// payment.service.ts
import paymentRepository from "./payment.repository";
import orderRepository from "../order/order.repository";
import orderService from "../order/order.service";
import prisma from "../../config/prisma";
import { getPaymentProvider } from "./providers/PaymentProviderRegistry";
import { PaymentMethod } from "../../generated/prisma/client";
import { NotFoundError, ForbiddenError, ConflictError } from "../../errors";

class PaymentService {
  
  async initiate(orderId: string, userId: string, method: PaymentMethod) {
    const order = await orderRepository.findById(orderId);
    if (!order) throw new NotFoundError("Commande introuvable.");
    if (order.userId !== userId) throw new ForbiddenError();
    if (order.status !== "PENDING") {
      throw new ConflictError("Cette commande n'est plus en attente de paiement.");
    }

    const existingPayment = await paymentRepository.findByOrderId(orderId);
    if (existingPayment && existingPayment.status === "SUCCESS") {
      throw new ConflictError("Cette commande a déjà été payée.");
    }

    const provider = getPaymentProvider(method);

    // Construction de la liste des items pour le prestataire (Stripe, MoMo, etc.)
    const itemsForProvider = order.items.map((item) => ({
      name: item.dish.name,
      unitPrice: Number(item.unitPrice), // Cast Decimal en number pour la compatibilité
      quantity: item.quantity,
    }));

    // ➡️ INJECTION EXPLICITE DES FRAIS DE LIVRAISON DE LA COMMANDE
    itemsForProvider.push({
      name: "Frais de livraison",
      unitPrice: Number(order.deliveryFee), // Récupère les 1000 FCFA définis dans le modèle Order
      quantity: 1,
    });

    const { paymentUrl, providerReference } = await provider.initiatePayment({
      orderId,
      currency: "xaf",
      items: itemsForProvider,
    });

    if (existingPayment) {
      await paymentRepository.updateStatus(existingPayment.id, providerReference, "PENDING");
    } else {
      // order.totalAmount contient déjà sous-total + deliveryFee grâce au repository orders
      await paymentRepository.create(orderId, Number(order.totalAmount), method, providerReference);
    }

    return { paymentUrl };
  }

  async handleWebhook(method: PaymentMethod, rawBody: Buffer, signature: string) {
    const provider = getPaymentProvider(method);
    const event = provider.constructWebhookEvent(rawBody, signature);
    const result = provider.extractWebhookResult(event);

    if (!result) return;

    const payment = await paymentRepository.findByTransactionId(result.providerReference);
    if (!payment || !payment.transactionId) return;

    const transactionId: string = payment.transactionId;

    await prisma.$transaction(async (tx) => {
      await paymentRepository.updateStatus(payment.id, transactionId, result.status, tx);

      if (result.status === "SUCCESS") {
        const order = await orderRepository.findById(payment.orderId);
        if (order && order.status === "PENDING") {
          await orderService.updateStatus(payment.orderId, "CONFIRMED", order.userId, "SYSTEM", tx);
        }
      }
    });
  }
}

export default new PaymentService();
