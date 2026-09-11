import React from 'react';
import { AlertTriangle, X, Loader2 } from 'lucide-react';

interface CancelOrderModalProps {
  isOpen: boolean;
  orderNumber?: number;
  isCancelling: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

export const CancelOrderModal: React.FC<CancelOrderModalProps> = ({
  isOpen,
  orderNumber,
  isCancelling,
  onConfirm,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop overlay */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={!isCancelling ? onClose : undefined}
      />

      {/* Modal Dialog */}
      <div className="relative bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 z-10 animate-in fade-in zoom-in-95 duration-200">
        {/* Close button */}
        {!isCancelling && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition cursor-pointer"
            aria-label="Fermer"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600 shrink-0">
            <AlertTriangle className="w-6 h-6" />
          </div>

          <div className="flex-1 min-w-0 pr-4">
            <h3 className="text-lg font-black text-slate-900 tracking-tight">
              Annuler la commande ?
            </h3>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              Êtes-vous certain de vouloir annuler cette commande ? Le statut passera immédiatement à{' '}
              <span className="font-bold text-rose-600">Annulée</span>. Cette action est irréversible.
            </p>
          </div>
        </div>

        <div className="mt-6 flex flex-col-reverse sm:flex-row items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            disabled={isCancelling}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-50 transition cursor-pointer disabled:opacity-50"
          >
            Conserver ma commande
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={isCancelling}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs transition shadow-md shadow-rose-600/25 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75"
          >
            {isCancelling ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Annulation en cours...</span>
              </>
            ) : (
              <span>Confirmer l'annulation</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
