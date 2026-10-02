import React, { useState } from 'react';
import { 
  Car, 
  Search, 
  Heart, 
  Scale, 
  MessageSquare, 
  PlusCircle, 
  User as UserIcon, 
  Sun, 
  Moon, 
  Globe, 
  Menu, 
  X, 
  Shield, 
  Calculator, 
  MapPin, 
  ChevronDown, 
  LogOut, 
  Sparkles,
  DollarSign
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.tsx';
import { useLanguage } from '../../context/LanguageContext.tsx';
import { useFavorites } from '../../context/FavoritesContext.tsx';
import { useCompare } from '../../context/CompareContext.tsx';
import { NotificationBell } from './NotificationBell.tsx';
import type { Language, Currency } from '../../types/index.ts';

interface HeaderProps {
  currentTab: string;
  onNavigate: (tab: string, param?: string) => void;
  onOpenSellWizard: () => void;
}

export const Header: React.FC<HeaderProps> = ({ currentTab, onNavigate, onOpenSellWizard }) => {
  const { user, isAuthenticated, isAdmin, isDealer, logout, openAuth, switchUser } = useAuth();
  const { language, setLanguage, currency, setCurrency, usdRate, formatNumber, t, darkMode, setDarkMode } = useLanguage();
  const { favorites } = useFavorites();
  const { compareCars } = useCompare();
  
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);

  const navLinks = [
    { id: 'home', label: t('home') },
    { id: 'catalog', label: t('cars') },
    { id: 'map', label: 'Xarita' },
    { id: 'compare', label: t('compare'), count: compareCars.length },
    { id: 'calculators', label: t('calculators') },
    { id: 'dealers', label: t('dealers') },
  ];

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-white/90 dark:bg-[#121418]/90 border-b border-slate-200 dark:border-slate-800 transition-colors">
      {/* Top Utility Bar */}
      <div className="bg-slate-900 text-slate-300 text-xs py-1.5 px-4 hidden md:block">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 font-mono text-emerald-400">
              <DollarSign className="w-3.5 h-3.5" />
              1 USD = {formatNumber(usdRate)} UZS (CBU)
            </span>
            <span className="text-slate-600">|</span>
            <span className="text-slate-400">
              O'zbekistondagi eng yirik avtomobil platformasi
            </span>
          </div>

          <div className="flex items-center gap-4">
            {/* Quick Demo Switcher for fast testing of buyer/dealer/admin roles */}
            <div className="flex items-center gap-1.5 bg-slate-800/80 px-2 py-0.5 rounded-md border border-slate-700/60">
              <span className="text-[11px] text-slate-400">Demo rol:</span>
              <button 
                onClick={() => switchUser('user')} 
                className={`px-1.5 py-0.5 rounded text-[11px] font-medium transition ${
                  user?.role === 'user' ? 'bg-red-600 text-white' : 'text-slate-300 hover:text-white'
                }`}
              >
                Xaridor
              </button>
              <button 
                onClick={() => switchUser('dealer')} 
                className={`px-1.5 py-0.5 rounded text-[11px] font-medium transition ${
                  user?.role === 'dealer' ? 'bg-amber-600 text-white' : 'text-slate-300 hover:text-white'
                }`}
              >
                Diler
              </button>
              <button 
                onClick={() => switchUser('admin')} 
                className={`px-1.5 py-0.5 rounded text-[11px] font-medium transition ${
                  user?.role === 'admin' ? 'bg-purple-600 text-white' : 'text-slate-300 hover:text-white'
                }`}
              >
                Admin
              </button>
            </div>

            {/* Currency toggle */}
            <div className="flex items-center bg-slate-800 rounded-md p-0.5 border border-slate-700">
              <button
                onClick={() => setCurrency('UZS')}
                className={`px-2 py-0.5 rounded text-[11px] font-bold transition ${
                  currency === 'UZS' ? 'bg-red-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                UZS
              </button>
              <button
                onClick={() => setCurrency('USD')}
                className={`px-2 py-0.5 rounded text-[11px] font-bold transition ${
                  currency === 'USD' ? 'bg-red-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                USD ($)
              </button>
            </div>

            {/* Language toggle */}
            <div className="relative">
              <button
                onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                className="flex items-center gap-1 text-slate-300 hover:text-white transition"
              >
                <Globe className="w-3.5 h-3.5 text-red-500" />
                <span className="uppercase font-semibold">{language}</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>
              {langDropdownOpen && (
                <div className="absolute right-0 mt-2 w-28 bg-white dark:bg-[#1a1d24] text-slate-800 dark:text-slate-200 rounded-xl shadow-xl border border-slate-200 dark:border-slate-800 py-1 z-50">
                  <button
                    onClick={() => { setLanguage('uz'); setLangDropdownOpen(false); }}
                    className={`w-full text-left px-3 py-1.5 text-xs hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-between ${language === 'uz' ? 'text-red-600 font-bold' : ''}`}
                  >
                    O'zbekcha {language === 'uz' && '✓'}
                  </button>
                  <button
                    onClick={() => { setLanguage('ru'); setLangDropdownOpen(false); }}
                    className={`w-full text-left px-3 py-1.5 text-xs hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-between ${language === 'ru' ? 'text-red-600 font-bold' : ''}`}
                  >
                    Русский {language === 'ru' && '✓'}
                  </button>
                  <button
                    onClick={() => { setLanguage('en'); setLangDropdownOpen(false); }}
                    className={`w-full text-left px-3 py-1.5 text-xs hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-between ${language === 'en' ? 'text-red-600 font-bold' : ''}`}
                  >
                    English {language === 'en' && '✓'}
                  </button>
                </div>
              )}
            </div>

            {/* Dark / Light toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-1 rounded text-slate-400 hover:text-white transition"
              title="Rejimni almashtirish"
            >
              {darkMode ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5 text-slate-300" />}
            </button>
          </div>
        </div>
      </div>

      {/* Main Nav Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-4">
          {/* Logo */}
          <div 
            onClick={() => onNavigate('home')} 
            className="flex items-center gap-3 cursor-pointer group shrink-0"
          >
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-tr from-red-600 via-rose-600 to-red-500 flex items-center justify-center text-white shadow-lg shadow-red-600/30 group-hover:scale-105 transition duration-200">
              <Car className="w-6 h-6 transform group-hover:-translate-x-0.5 transition" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-xl sm:text-2xl tracking-tight text-slate-900 dark:text-white">
                  Auto<span className="text-red-600">Savdo</span>
                </span>
                <span className="text-[10px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded bg-red-600/10 text-red-600 dark:bg-red-500/20 dark:text-red-400 border border-red-500/20">
                  PRO
                </span>
              </div>
              <span className="hidden sm:block text-[10px] text-slate-400 dark:text-slate-500 font-medium">
                O'zbekiston avtomobil bozori
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map(link => {
              const active = currentTab === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => onNavigate(link.id)}
                  className={`relative px-3.5 py-2 rounded-xl text-sm font-semibold transition ${
                    active
                      ? 'text-red-600 dark:text-red-400 bg-red-50/80 dark:bg-red-950/30'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    {link.label}
                    {link.count !== undefined && link.count > 0 && (
                      <span className="flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-[10px] font-bold text-white">
                        {link.count}
                      </span>
                    )}
                  </span>
                </button>
              );
            })}
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Favorites Icon */}
            <button
              onClick={() => onNavigate('favorites')}
              className="relative p-2.5 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              title={t('favorites')}
            >
              <Heart className={`w-5 h-5 ${favorites.length > 0 ? 'text-red-500 fill-red-500' : ''}`} />
              {favorites.length > 0 && (
                <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-[10px] font-bold text-white ring-2 ring-white dark:ring-slate-900">
                  {favorites.length}
                </span>
              )}
            </button>

            {/* In-App Notifications */}
            {isAuthenticated && (
              <NotificationBell onNavigate={onNavigate} />
            )}

            {/* Chat Icon */}
            {isAuthenticated && (
              <button
                onClick={() => onNavigate('chat')}
                className="relative p-2.5 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                title={t('messages')}
              >
                <MessageSquare className="w-5 h-5" />
              </button>
            )}

            {/* Sell Car Button (High-impact CTA) */}
            <button
              onClick={onOpenSellWizard}
              className="hidden sm:flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold text-sm shadow-md shadow-red-600/25 active:scale-95 transition"
            >
              <PlusCircle className="w-4 h-4" />
              <span>{t('sellCarBtn')}</span>
            </button>

            {/* User Account / Profile */}
            {isAuthenticated && user ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-2 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800/80 transition"
                >
                  <div className="w-7 h-7 rounded-lg bg-red-600/10 dark:bg-red-500/20 text-red-600 dark:text-red-400 font-bold flex items-center justify-center text-xs">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="hidden md:block text-xs font-semibold text-slate-700 dark:text-slate-200 max-w-[100px] truncate">
                    {user.name}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white dark:bg-[#1a1d24] shadow-2xl border border-slate-200 dark:border-slate-800 py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                    <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800/80">
                      <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{user.name}</p>
                      <p className="text-xs text-slate-400 font-mono truncate">{user.email}</p>
                      <span className="inline-block mt-1 text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                        {user.role === 'admin' ? 'Administrator' : user.role === 'dealer' ? 'Avtosalon' : 'Foydalanuvchi'}
                      </span>
                    </div>

                    <div className="py-1">
                      <button
                        onClick={() => { onNavigate('dashboard'); setUserDropdownOpen(false); }}
                        className="w-full text-left px-4 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2"
                      >
                        <UserIcon className="w-3.5 h-3.5 text-slate-400" />
                        {t('dashboard')}
                      </button>

                      {isAdmin && (
                        <button
                          onClick={() => { onNavigate('admin'); setUserDropdownOpen(false); }}
                          className="w-full text-left px-4 py-2 text-xs font-medium text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-950/30 flex items-center gap-2"
                        >
                          <Shield className="w-3.5 h-3.5 text-purple-500" />
                          {t('adminPanel')}
                        </button>
                      )}

                      <button
                        onClick={() => { onNavigate('favorites'); setUserDropdownOpen(false); }}
                        className="w-full text-left px-4 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2"
                      >
                        <Heart className="w-3.5 h-3.5 text-slate-400" />
                        {t('favorites')} ({favorites.length})
                      </button>

                      <button
                        onClick={() => { onNavigate('chat'); setUserDropdownOpen(false); }}
                        className="w-full text-left px-4 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2"
                      >
                        <MessageSquare className="w-3.5 h-3.5 text-slate-400" />
                        {t('messages')}
                      </button>
                    </div>

                    <div className="pt-1 border-t border-slate-100 dark:border-slate-800/80">
                      <button
                        onClick={() => { logout(); setUserDropdownOpen(false); }}
                        className="w-full text-left px-4 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 flex items-center gap-2"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        {t('logout')}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => openAuth('login')}
                className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 transition"
              >
                <UserIcon className="w-4 h-4 text-red-600" />
                <span>{t('signIn')}</span>
              </button>
            )}

            {/* Mobile Hamburger Menu */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-[#15181e] px-4 pt-3 pb-6 space-y-3">
          <div className="grid grid-cols-2 gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
            <button
              onClick={() => { onOpenSellWizard(); setMobileMenuOpen(false); }}
              className="col-span-2 flex items-center justify-center gap-2 py-3 rounded-xl bg-red-600 text-white font-bold text-sm shadow-md"
            >
              <PlusCircle className="w-4 h-4" />
              <span>{t('sellCarBtn')}</span>
            </button>
          </div>

          <div className="flex flex-col gap-1">
            {navLinks.map(link => (
              <button
                key={link.id}
                onClick={() => { onNavigate(link.id); setMobileMenuOpen(false); }}
                className={`text-left px-4 py-2.5 rounded-xl text-sm font-semibold flex items-center justify-between ${
                  currentTab === link.id
                    ? 'bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400'
                    : 'text-slate-700 dark:text-slate-300'
                }`}
              >
                <span>{link.label}</span>
                {link.count !== undefined && link.count > 0 && (
                  <span className="px-2 py-0.5 text-xs bg-red-600 text-white rounded-full font-bold">
                    {link.count}
                  </span>
                )}
              </button>
            ))}
            
            {isAdmin && (
              <button
                onClick={() => { onNavigate('admin'); setMobileMenuOpen(false); }}
                className="text-left px-4 py-2.5 rounded-xl text-sm font-bold text-purple-600 dark:text-purple-400 flex items-center gap-2"
              >
                <Shield className="w-4 h-4" />
                {t('adminPanel')}
              </button>
            )}
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500">Til:</span>
              {(['uz', 'ru', 'en'] as Language[]).map(lang => (
                <button
                  key={lang}
                  onClick={() => setLanguage(lang)}
                  className={`px-2 py-1 rounded text-xs uppercase font-bold ${
                    language === lang ? 'bg-red-600 text-white' : 'text-slate-400'
                  }`}
                >
                  {lang}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500">Valyuta:</span>
              {(['UZS', 'USD'] as Currency[]).map(curr => (
                <button
                  key={curr}
                  onClick={() => setCurrency(curr)}
                  className={`px-2 py-1 rounded text-xs font-bold ${
                    currency === curr ? 'bg-red-600 text-white' : 'text-slate-400'
                  }`}
                >
                  {curr}
                </button>
              ))}
            </div>

            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200"
            >
              {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
