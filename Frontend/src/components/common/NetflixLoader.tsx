import React from 'react';
import { UtensilsCrossed } from 'lucide-react';

interface NetflixLoaderProps {
  /** Mode plein écran avec fond immersif noir/ardoise Netflix */
  fullScreen?: boolean;
  /** Message affiché sous le loader (par défaut 'Loading') */
  message?: string;
  /** Sous-message facultatif */
  subMessage?: string;
  /** Taille du spinner : 'sm' (petit), 'md' (moyen), 'lg' (grand) */
  size?: 'sm' | 'md' | 'lg';
  /** Variante visuelle : 'dark' (noir profond Netflix) ou 'card' (carte intégrée) */
  variant?: 'dark' | 'card';
}

export const NetflixLoader: React.FC<NetflixLoaderProps> = ({
  fullScreen = false,
  message = 'Loading',
  size = 'md',
  variant = 'dark',
}) => {
  // Dimensions selon la taille
  const sizeMap = {
    sm: {
      spinner: 'w-12 h-12',
      centerIcon: 'w-5 h-5',
      fontSize: 'text-[11px]',
      padding: 'p-6',
    },
    md: {
      spinner: 'w-18 h-18 sm:w-20 sm:h-20',
      centerIcon: 'w-8 h-8',
      fontSize: 'text-xs',
      padding: 'p-10',
    },
    lg: {
      spinner: 'w-24 h-24 sm:w-28 sm:h-28',
      centerIcon: 'w-10 h-10 sm:w-12 sm:h-12',
      fontSize: 'text-sm',
      padding: 'p-16',
    },
  }[size];

  const content = (
    <div className="flex flex-col items-center justify-center text-center space-y-4 select-none relative z-10">
      {/* Netflix-Style Spinning Ring with Glowing Center */}
      <div className="relative flex items-center justify-center">
        {/* Ambient background glow */}
        <div className="absolute w-24 h-24 bg-amber-500/20 rounded-full blur-2xl animate-pulse pointer-events-none" />
        <div className="absolute w-16 h-16 bg-orange-600/15 rounded-full blur-xl pointer-events-none" />

        {/* Circular Track & Rotating Arc */}
        <div className={`relative ${sizeMap.spinner} flex items-center justify-center`}>
          {/* Subtle base track */}
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            {/* Background ring track */}
            <circle
              cx="50"
              cy="50"
              r="42"
              className="stroke-slate-800/80"
              strokeWidth="5"
              fill="none"
            />
          </svg>

          {/* Animated Netflix Arc with SVG gradient */}
          <svg
            className="absolute inset-0 w-full h-full animate-spin"
            style={{ animationDuration: '0.85s' }}
            viewBox="0 0 100 100"
          >
            <defs>
              <linearGradient id="netflix-culinary-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#f59e0b" stopOpacity="1" />
                <stop offset="50%" stopColor="#f97316" stopOpacity="0.85" />
                <stop offset="100%" stopColor="#ea580c" stopOpacity="0.05" />
              </linearGradient>
            </defs>
            <circle
              cx="50"
              cy="50"
              r="42"
              stroke="url(#netflix-culinary-gradient)"
              strokeWidth="5.5"
              strokeLinecap="round"
              strokeDasharray="140 260"
              fill="none"
            />
          </svg>

          {/* Inner pulsating Julien's Food emblem */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-slate-950 via-blue-950 to-indigo-950 border border-amber-400/40 shadow-inner ring-1 ring-amber-400/20 animate-pulse">
              <UtensilsCrossed className={`${sizeMap.centerIcon} text-amber-300 drop-shadow-[0_0_8px_rgba(245,158,11,0.6)]`} />
            </div>
          </div>
        </div>
      </div>

      {/* Loading Text only */}
      <div className="flex flex-col items-center justify-center space-y-2">
        <p className={`font-display font-black tracking-widest text-slate-300 uppercase ${sizeMap.fontSize} flex items-center gap-1`}>
          <span>{message || 'Loading'}</span>
          <span className="inline-flex">
            <span className="animate-bounce" style={{ animationDelay: '0ms' }}>.</span>
            <span className="animate-bounce" style={{ animationDelay: '150ms' }}>.</span>
            <span className="animate-bounce" style={{ animationDelay: '300ms' }}>.</span>
          </span>
        </p>

        {/* Subtle progress pulse bar */}
        <div className="w-24 h-0.5 bg-slate-800/80 rounded-full overflow-hidden relative">
          <div className="h-full w-1/2 bg-gradient-to-r from-transparent via-amber-400 to-orange-500 rounded-full animate-[shimmer_1.4s_infinite]" />
        </div>
      </div>
    </div>
  );

  if (fullScreen) {
    return (
      <div
        id="netflix-global-loader"
        className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/95 backdrop-blur-md transition-opacity duration-300"
      >
        {/* Subtle background radial light */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-b from-amber-500/10 via-blue-600/5 to-transparent rounded-full blur-3xl pointer-events-none" />
        {content}
      </div>
    );
  }

  if (variant === 'card') {
    return (
      <div className={`w-full rounded-3xl bg-slate-950 border border-slate-800/80 shadow-2xl ${sizeMap.padding} relative overflow-hidden`}>
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
        {content}
      </div>
    );
  }

  return (
    <div className={`w-full ${sizeMap.padding} flex items-center justify-center bg-slate-950/60 rounded-3xl border border-slate-800/50 backdrop-blur-xs`}>
      {content}
    </div>
  );
};
