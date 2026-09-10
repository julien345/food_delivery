"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// prisma/seed.ts
const prisma_1 = __importDefault(require("../src/config/prisma"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const TEST_PASSWORD = "password123";
async function upsertTestUser(data) {
    const existing = await prisma_1.default.user.findFirst({ where: { email: data.email } });
    if (existing) {
        console.log(`Déjà existant, ignoré : ${data.email}`);
        return existing;
    }
    const hashedPassword = await bcrypt_1.default.hash(TEST_PASSWORD, 10);
    const user = await prisma_1.default.user.create({
        data: {
            email: data.email,
            password: hashedPassword,
            firstName: data.firstName,
            lastName: data.lastName,
            phone: data.phone, // Injection du numéro de téléphone requis
            role: data.role,
            // Seul le rôle CLIENT a strictement besoin d'un panier selon vos règles d'administration,
            // mais on garde la logique sécurisée s'il y a des dépendances relationnelles strictes dans Prisma
            ...(data.role === "CLIENT" ? { cart: { create: {} } } : {}),
        },
    });
    console.log(`Créé : ${user.email} (${user.role}) - Tél: ${user.phone}`);
    return user;
}
async function main() {
    console.log("Démarrage du seed...\n");
    await upsertTestUser({
        email: "admin@test.com",
        firstName: "rayan",
        lastName: "blommer",
        phone: "+237690000001",
        role: "ADMIN",
    });
    await upsertTestUser({
        email: "livreur3@test.com",
        firstName: "Paul",
        lastName: "jardin",
        phone: "+237690000002",
        role: "DELIVERY_AGENT",
    });
    await upsertTestUser({
        email: "livreur4@test.com",
        firstName: "Marc",
        lastName: "Ebelle",
        phone: "+237690000003",
        role: "DELIVERY_AGENT",
    });
    await upsertTestUser({
        email: "yannick@test.com",
        firstName: "yannick",
        lastName: "dumont",
        phone: "+237690000004",
        role: "CLIENT"
    });
    await upsertTestUser({
        email: "sophie@test.com",
        firstName: "Sophie",
        lastName: "larousse",
        phone: "+237690000005",
        role: "CLIENT",
    });
    console.log(`\nSeed terminé. Mot de passe commun : "${TEST_PASSWORD}"`);
}
main()
    .catch((e) => {
    console.error("Erreur pendant le seed :", e);
    process.exit(1);
})
    .finally(async () => {
    await prisma_1.default.$disconnect();
});
//# sourceMappingURL=seed.js.map