import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  ShoppingBag,
  User as UserIcon,
  LogOut,
  Shield,
  Truck,
  Menu,
  X,
  UtensilsCrossed,
  MapPin,
  ChevronDown,
  LayoutDashboard,
  Eye,
  LogIn,
  UserPlus,
  Package,
} from 'lucide-react';
import { useAuthStore } from '../../store/auth.store';
import { useCartStore } from '../../store/cart.store';
import { formatFCFA } from '../../utils/format';

export const Navbar: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuthStore();
  const { setIsOpen, getItemCount, total } = useCartStore();
  const itemCount = getItemCount();
  const navigate = useNavigate();
  const location = useLocation();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const isAdmin = isAuthenticated && user?.role === 'ADMIN';
  const isDelivery = isAuthenticated && user?.role === 'DELIVERY_AGENT';
  const isClient = !isAuthenticated || user?.role === 'CLIENT';

  const handleLogout = () => {
    logout();
    setProfileDropdownOpen(false);
    navigate('/login');
  };

  const isCurrent = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-40 bg-white/85 backdrop-blur-xl border-b border-slate-200/70 shadow-xs transition-all">
      {/* Main Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 sm:h-20">
          {/* Brand Logo - On the left for both mobile & desktop */}
          <Link
            to={isAdmin ? '/admin' : isDelivery ? '/delivery' : '/'}
            className="flex items-center gap-2.5 sm:gap-3 group shrink-0"
          >
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-tr from-slate-950 via-blue-900 to-indigo-800 flex items-center justify-center text-white shadow-md shadow-blue-950/20 group-hover:scale-105 transition-all duration-300 border border-white/15 ring-2 ring-amber-400/25">
              <UtensilsCrossed className="w-5 h-5 text-amber-300 group-hover:rotate-12 transition-transform duration-300" />
            </div>
            <div className="flex items-center gap-1.5">
              <span className="font-display text-[22px] sm:text-2xl font-black tracking-tight text-slate-950 block leading-none">
                Julien's
              </span>
              <span className="text-[10px] sm:text-[11px] font-black tracking-wider px-2 py-0.5 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 text-white uppercase leading-none shadow-xs border border-blue-500/30">
                Food
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          {isAdmin ? (
            <nav className="hidden md:flex items-center gap-1 bg-slate-100/70 p-1.5 rounded-2xl border border-slate-200/70">
              <Link
                to="/admin"
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 flex items-center gap-2 ${
                  location.pathname.startsWith('/admin')
                    ? 'text-white bg-blue-600 shadow-xs'
                    : 'text-slate-700 hover:text-slate-950 hover:bg-white/60'
                }`}
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>Dashboard</span>
              </Link>
              <Link
                to="/"
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 flex items-center gap-2 ${
                  location.pathname === '/'
                    ? 'text-white bg-blue-600 shadow-xs'
                    : 'text-slate-700 hover:text-slate-950 hover:bg-white/60'
                }`}
              >
                <Eye className="w-4 h-4" />
                <span>Aperçu site</span>
              </Link>
            </nav>
          ) : isDelivery ? (
            <nav className="hidden md:flex items-center gap-1 bg-slate-100/70 p-1.5 rounded-2xl border border-slate-200/70">
              <Link
                to="/delivery"
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 flex items-center gap-2 ${
                  location.pathname.startsWith('/delivery')
                    ? 'text-white bg-blue-600 shadow-xs'
                    : 'text-slate-700 hover:text-slate-950 hover:bg-white/60'
                }`}
              >
                <Truck className="w-4 h-4" />
                <span>Espace Livraisons</span>
              </Link>
              <Link
                to="/"
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 flex items-center gap-2 ${
                  location.pathname === '/'
                    ? 'text-white bg-blue-600 shadow-xs'
                    : 'text-slate-700 hover:text-slate-950 hover:bg-white/60'
                }`}
              >
                <Eye className="w-4 h-4" />
                <span>Aperçu Carte</span>
              </Link>
            </nav>
          ) : (
            <nav className="hidden md:flex items-center gap-1 bg-slate-100/70 p-1.5 rounded-2xl border border-slate-200/70">
              <Link
                to="/"
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 ${
                  isCurrent('/')
                    ? 'text-blue-900 bg-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                }`}
              >
                La Carte
              </Link>
              {isAuthenticated && (
                <Link
                  to="/orders"
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 ${
                    isCurrent('/orders')
                      ? 'text-blue-900 bg-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                  }`}
                >
                  Mes commandes
                </Link>
              )}
              {isAuthenticated && (
                <Link
                  to="/addresses"
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 ${
                    isCurrent('/addresses')
                      ? 'text-blue-900 bg-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                  }`}
                >
                  Mes adresses
                </Link>
              )}
            </nav>
          )}

          {/* Right Action Buttons */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Cart Button: ONLY displayed for clients and visitors, NEVER for Admin or Delivery */}
            {isClient && (
              <button
                id="open-cart-drawer-btn"
                onClick={() => setIsOpen(true)}
                className="relative flex items-center justify-center gap-2 h-10 sm:h-11 px-3 sm:px-4 rounded-2xl bg-gradient-to-r from-slate-950 via-slate-900 to-blue-950 text-white hover:from-blue-900 hover:to-indigo-950 shadow-md shadow-slate-950/20 font-bold text-xs sm:text-sm transition-all duration-300 active:scale-95 cursor-pointer border border-white/10 ring-1 ring-amber-400/20 shrink-0 group"
                aria-label="Voir le panier"
              >
                <div className="relative flex items-center justify-center">
                  <ShoppingBag className="w-5 h-5 sm:w-4 sm:h-4 text-amber-300 group-hover:scale-110 transition-transform" />
                  {itemCount > 0 && (
                    <span className="absolute -top-2.5 -right-2.5 bg-gradient-to-r from-orange-500 to-amber-500 text-slate-950 text-[10px] font-black w-4.5 h-4.5 rounded-full flex items-center justify-center border-2 border-slate-950 shadow-xs animate-pulse">
                      {itemCount}
                    </span>
                  )}
                </div>
                <span className="hidden md:inline font-bold">Panier</span>
                {total > 0 && (
                  <span className="text-[11px] font-black bg-white/15 px-2 py-0.5 rounded-lg text-amber-300 border border-white/10 hidden md:inline">
                    {formatFCFA(total)}
                  </span>
                )}
              </button>
            )}

            {/* Auth Button or User Profile (Espace Compte) - DESKTOP ONLY */}
            {isAuthenticated && user ? (
              <div className="relative hidden md:block">
                <button
                  id="user-profile-menu-btn"
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-2xl border border-slate-200/80 hover:border-blue-300 hover:bg-slate-50 transition-all cursor-pointer shadow-xs"
                >
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-700 to-indigo-600 text-white font-black text-xs flex items-center justify-center shadow-xs">
                    {user.firstName.charAt(0)}
                    {user.lastName ? user.lastName.charAt(0) : ''}
                  </div>
                  <div className="text-left">
                    <div className="text-xs font-bold text-slate-900 leading-tight">
                      {user.firstName}
                    </div>
                    <div className="text-[10px] text-blue-600 font-semibold leading-none">
                      {user.role}
                    </div>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {profileDropdownOpen && (
                  <div
                    className="absolute right-0 mt-2 w-60 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-200/80 py-2.5 z-50 animate-in fade-in zoom-in-95"
                    onMouseLeave={() => setProfileDropdownOpen(false)}
                  >
                    <div className="px-4 py-2 border-b border-slate-100">
                      <p className="text-xs font-black text-slate-900">
                        {user.firstName} {user.lastName}
                      </p>
                      <p className="text-[11px] text-slate-500 truncate">{user.email}</p>
                      <span className="inline-block mt-1.5 px-2 py-0.5 text-[10px] font-bold rounded-md bg-blue-50 text-blue-700 border border-blue-100">
                        Rôle: {user.role === 'ADMIN' ? 'Administrateur' : user.role === 'DELIVERY_AGENT' ? 'Livreur' : user.role}
                      </span>
                    </div>

                    <div className="py-1">
                      {isAdmin ? (
                        <>
                          <Link
                            to="/admin"
                            onClick={() => setProfileDropdownOpen(false)}
                            className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-blue-50 hover:text-blue-700 transition"
                          >
                            <LayoutDashboard className="w-4 h-4 text-blue-600" />
                            <span>Dashboard Admin</span>
                          </Link>
                          <Link
                            to="/"
                            onClick={() => setProfileDropdownOpen(false)}
                            className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-blue-50 hover:text-blue-700 transition"
                          >
                            <Eye className="w-4 h-4 text-slate-400" />
                            <span>Aperçu site (Lecture seule)</span>
                          </Link>
                          <Link
                            to="/profile"
                            onClick={() => setProfileDropdownOpen(false)}
                            className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-blue-50 hover:text-blue-700 transition"
                          >
                            <UserIcon className="w-4 h-4 text-slate-400" />
                            <span>Mon Profil</span>
                          </Link>
                        </>
                      ) : isDelivery ? (
                        <>
                          <Link
                            to="/delivery"
                            onClick={() => setProfileDropdownOpen(false)}
                            className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-blue-50 hover:text-blue-700 transition"
                          >
                            <Truck className="w-4 h-4 text-blue-600" />
                            <span>Espace Livraisons</span>
                          </Link>
                          <Link
                            to="/"
                            onClick={() => setProfileDropdownOpen(false)}
                            className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-blue-50 hover:text-blue-700 transition"
                          >
                            <Eye className="w-4 h-4 text-slate-400" />
                            <span>Aperçu Carte (Lecture seule)</span>
                          </Link>
                          <Link
                            to="/profile"
                            onClick={() => setProfileDropdownOpen(false)}
                            className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-blue-50 hover:text-blue-700 transition"
                          >
                            <UserIcon className="w-4 h-4 text-slate-400" />
                            <span>Mon Profil</span>
                          </Link>
                        </>
                      ) : (
                        <>
                          <Link
                            to="/profile"
                            onClick={() => setProfileDropdownOpen(false)}
                            className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-blue-50 hover:text-blue-700 transition"
                          >
                            <UserIcon className="w-4 h-4 text-slate-400" />
                            <span>Mon Profil</span>
                          </Link>
                          <Link
                            to="/orders"
                            onClick={() => setProfileDropdownOpen(false)}
                            className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-blue-50 hover:text-blue-700 transition"
                          >
                            <ShoppingBag className="w-4 h-4 text-slate-400" />
                            <span>Mes commandes</span>
                          </Link>
                          <Link
                            to="/addresses"
                            onClick={() => setProfileDropdownOpen(false)}
                            className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-blue-50 hover:text-blue-700 transition"
                          >
                            <MapPin className="w-4 h-4 text-slate-400" />
                            <span>Mes adresses</span>
                          </Link>
                        </>
                      )}
                    </div>

                    <div className="border-t border-slate-100 pt-1">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Se déconnecter</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden md:flex items-center space-x-2">
                <Link
                  to="/login"
                  className="px-3.5 py-2 text-xs sm:text-sm font-bold text-slate-700 hover:text-blue-600 hover:bg-slate-100/70 rounded-xl transition"
                >
                  Connexion
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-xs sm:text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-sm hover:shadow-md shadow-blue-600/20 transition"
                >
                  Inscription
                </Link>
              </div>
            )}

            {/* Mobile Hamburger Button - Placed at the right on mobile */}
            <button
              id="mobile-menu-toggle-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden w-10 h-10 rounded-2xl text-slate-700 hover:bg-slate-100 hover:text-slate-950 transition cursor-pointer border border-slate-200/80 flex items-center justify-center shrink-0"
              aria-label="Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-5 space-y-3 shadow-lg animate-in slide-in-from-top-2">
          {/* Top User identity for authenticated users only */}
          {isAuthenticated && user && (
            <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-700 to-indigo-600 text-white font-black text-sm flex items-center justify-center shadow-xs shrink-0">
                {user.firstName.charAt(0)}
                {user.lastName ? user.lastName.charAt(0) : ''}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-bold text-slate-900 truncate">
                  {user.firstName} {user.lastName}
                </div>
                <div className="text-xs text-slate-500 truncate">{user.email}</div>
              </div>
              <span className="px-2 py-0.5 text-[10px] font-bold rounded-lg bg-blue-100 text-blue-800 border border-blue-200 shrink-0">
                {user.role === 'ADMIN' ? 'Admin' : user.role === 'DELIVERY_AGENT' ? 'Livreur' : 'Client'}
              </span>
            </div>
          )}

          <nav className="flex flex-col space-y-1">
            {isAdmin ? (
              <>
                <Link
                  to="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`w-full px-3 py-2.5 rounded-xl text-sm font-bold flex items-center gap-3 transition border ${
                    location.pathname.startsWith('/admin')
                      ? 'text-white bg-blue-600 border-blue-600 shadow-xs'
                      : 'text-slate-700 hover:bg-slate-50 border-transparent'
                  }`}
                >
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                    location.pathname.startsWith('/admin') ? 'bg-white/20 text-white' : 'bg-blue-50 text-blue-600'
                  }`}>
                    <LayoutDashboard className="w-4 h-4" />
                  </div>
                  <span>Dashboard Admin</span>
                </Link>
                <Link
                  to="/"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`w-full px-3 py-2.5 rounded-xl text-sm font-bold flex items-center gap-3 transition border ${
                    location.pathname === '/'
                      ? 'text-white bg-blue-600 border-blue-600 shadow-xs'
                      : 'text-slate-700 hover:bg-slate-50 border-transparent'
                  }`}
                >
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                    location.pathname === '/' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                  }`}>
                    <Eye className="w-4 h-4" />
                  </div>
                  <span>Aperçu site (Lecture seule)</span>
                </Link>
                <Link
                  to="/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`w-full px-3 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-3 transition border ${
                    isCurrent('/profile')
                      ? 'text-white bg-blue-600 border-blue-600 shadow-xs'
                      : 'text-slate-700 hover:bg-slate-50 border-transparent'
                  }`}
                >
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                    isCurrent('/profile') ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                  }`}>
                    <UserIcon className="w-4 h-4" />
                  </div>
                  <span>Mon Profil</span>
                </Link>
              </>
            ) : isDelivery ? (
              <>
                <Link
                  to="/delivery"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`w-full px-3 py-2.5 rounded-xl text-sm font-bold flex items-center gap-3 transition border ${
                    location.pathname.startsWith('/delivery')
                      ? 'text-white bg-blue-600 border-blue-600 shadow-xs'
                      : 'text-slate-700 hover:bg-slate-50 border-transparent'
                  }`}
                >
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                    location.pathname.startsWith('/delivery') ? 'bg-white/20 text-white' : 'bg-blue-50 text-blue-600'
                  }`}>
                    <Truck className="w-4 h-4" />
                  </div>
                  <span>Espace Livraisons</span>
                </Link>
                <Link
                  to="/"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`w-full px-3 py-2.5 rounded-xl text-sm font-bold flex items-center gap-3 transition border ${
                    location.pathname === '/'
                      ? 'text-white bg-blue-600 border-blue-600 shadow-xs'
                      : 'text-slate-700 hover:bg-slate-50 border-transparent'
                  }`}
                >
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                    location.pathname === '/' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                  }`}>
                    <Eye className="w-4 h-4" />
                  </div>
                  <span>Aperçu Carte (Lecture seule)</span>
                </Link>
                <Link
                  to="/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`w-full px-3 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-3 transition border ${
                    isCurrent('/profile')
                      ? 'text-white bg-blue-600 border-blue-600 shadow-xs'
                      : 'text-slate-700 hover:bg-slate-50 border-transparent'
                  }`}
                >
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                    isCurrent('/profile') ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                  }`}>
                    <UserIcon className="w-4 h-4" />
                  </div>
                  <span>Mon Profil</span>
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`w-full py-2.5 rounded-xl text-sm transition border ${
                    isAuthenticated
                      ? `px-3 font-semibold flex items-center gap-3 ${
                          isCurrent('/')
                            ? 'text-slate-900 bg-slate-100 font-bold border-slate-200 shadow-2xs'
                            : 'text-slate-700 hover:bg-slate-50 border-transparent'
                        }`
                      : `px-4 font-bold flex items-center justify-center gap-2.5 ${
                          isCurrent('/')
                            ? 'text-slate-950 bg-slate-100/90 border-slate-200/90 shadow-2xs'
                            : 'text-slate-700 hover:bg-slate-50 border-transparent'
                        }`
                  }`}
                >
                  <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 border border-amber-200/60 flex items-center justify-center shrink-0">
                    <UtensilsCrossed className="w-4 h-4 text-amber-600" />
                  </div>
                  <span>La Carte</span>
                </Link>

                {isAuthenticated && (
                  <>
                    <Link
                      to="/orders"
                      onClick={() => setMobileMenuOpen(false)}
                      className={`w-full px-3 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-3 transition border ${
                        isCurrent('/orders')
                          ? 'text-blue-700 bg-blue-50/90 font-bold border-blue-200/80 shadow-2xs'
                          : 'text-slate-700 hover:bg-slate-50 border-transparent'
                      }`}
                    >
                      <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 border border-blue-200/60 flex items-center justify-center shrink-0">
                        <Package className="w-4 h-4 text-blue-600" />
                      </div>
                      <span>Mes commandes</span>
                    </Link>
                    <Link
                      to="/addresses"
                      onClick={() => setMobileMenuOpen(false)}
                      className={`w-full px-3 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-3 transition border ${
                        isCurrent('/addresses')
                          ? 'text-blue-700 bg-blue-50/90 font-bold border-blue-200/80 shadow-2xs'
                          : 'text-slate-700 hover:bg-slate-50 border-transparent'
                      }`}
                    >
                      <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-200/60 flex items-center justify-center shrink-0">
                        <MapPin className="w-4 h-4 text-emerald-600" />
                      </div>
                      <span>Mes adresses</span>
                    </Link>
                    <Link
                      to="/profile"
                      onClick={() => setMobileMenuOpen(false)}
                      className={`w-full px-3 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-3 transition border ${
                        isCurrent('/profile')
                          ? 'text-blue-700 bg-blue-50/90 font-bold border-blue-200/80 shadow-2xs'
                          : 'text-slate-700 hover:bg-slate-50 border-transparent'
                      }`}
                    >
                      <div className="w-7 h-7 rounded-lg bg-slate-100 text-slate-600 border border-slate-200/60 flex items-center justify-center shrink-0">
                        <UserIcon className="w-4 h-4 text-slate-600" />
                      </div>
                      <span>Mon Profil</span>
                    </Link>
                  </>
                )}
              </>
            )}
          </nav>

          {isAuthenticated ? (
            <div className="pt-2 border-t border-slate-100">
              <button
                onClick={() => {
                  handleLogout();
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center justify-center gap-2 py-2 text-xs text-rose-600 font-bold bg-rose-50 hover:bg-rose-100 rounded-xl transition cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Se déconnecter</span>
              </button>
            </div>
          ) : (
            <div className="pt-2.5 border-t border-slate-100">
              <div className="grid grid-cols-2 gap-2 max-w-sm">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-1.5 h-9 px-3 text-xs text-slate-700 font-bold bg-slate-100 hover:bg-slate-200/80 rounded-xl transition cursor-pointer"
                >
                  <LogIn className="w-3.5 h-3.5 text-slate-600" />
                  <span>Connexion</span>
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-1.5 h-9 px-3 text-xs text-white font-bold bg-blue-600 hover:bg-blue-700 rounded-xl transition cursor-pointer shadow-xs"
                >
                  <UserPlus className="w-3.5 h-3.5 text-white" />
                  <span>Inscription</span>
                </Link>
              </div>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
