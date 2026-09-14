import React from 'react';
import { UtensilsCrossed } from 'lucide-react';

interface LogoLoaderProps {
  /** Taille globale : 'sm', 'md', 'lg' */
  size?: 'sm' | 'md' | 'lg';
  /** Texte indicatif optionnel */
  message?: string;
  /** Classes CSS supplémentaires pour l'espacement */
  className?: string;
}

export const LogoLoader: React.FC<LogoLoaderProps> = ({
  size = 'md',
  message,
  className = '',
}) => {
  const sizeConfig = {
    sm: {
      ring: 'w-16 h-16',
      badge: 'w-10 h-10',
      icon: 'w-5 h-5',
      padding: 'py-8',
    },
    md: {
      ring: 'w-22 h-22',
      badge: 'w-14 h-14',
      icon: 'w-7 h-7',
      padding: 'py-14 sm:py-16',
    },
    lg: {
      ring: 'w-28 h-28',
      badge: 'w-18 h-18',
      icon: 'w-9 h-9',
      padding: 'py-20 sm:py-24',
    },
  }[size];

  return (
    <div
      className={`w-full flex flex-col items-center justify-center text-center select-none bg-transparent ${sizeConfig.padding} ${className}`}
      role="status"
      aria-label="Chargement en cours"
    >
      {/* Conteneur du logo animé avec anneau de chargement (sans fond d'écran) */}
      <div className="relative flex items-center justify-center">
        {/* Anneau de chargement fin rotatif aux couleurs de Julien's Food */}
        <div
          className={`absolute ${sizeConfig.ring} rounded-full border-2 border-slate-200/60 border-t-blue-600 border-r-amber-400 animate-spin pointer-events-none`}
          style={{ animationDuration: '0.9s' }}
        />

        {/* Emblème Julien's Food avec pulsation douce */}
        <div
          className={`${sizeConfig.badge} rounded-2xl bg-gradient-to-tr from-slate-950 via-blue-900 to-indigo-800 flex items-center justify-center text-white shadow-lg shadow-blue-950/15 border border-white/20 ring-2 ring-amber-400/30 transition-transform animate-pulse`}
        >
          <UtensilsCrossed
            className={`${sizeConfig.icon} text-amber-300 drop-shadow-[0_0_8px_rgba(245,158,11,0.6)]`}
          />
        </div>
      </div>

      {/* Message discret optionnel si spécifié */}
      {message && (
        <p className="text-xs font-semibold text-slate-500 mt-4 tracking-wide animate-pulse">
          {message}
        </p>
      )}
    </div>
  );
};
