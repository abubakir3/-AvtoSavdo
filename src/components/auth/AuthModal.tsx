import React, { useState } from 'react';
import { X, User as UserIcon, Lock, Mail, Phone, Building2, Check, Shield } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.tsx';
import { useLanguage } from '../../context/LanguageContext.tsx';
import { UZBEKISTAN_REGIONS } from '../../i18n/translations.ts';

export const AuthModal: React.FC = () => {
  const { authModalOpen, authMode, closeAuth, login, register } = useAuth();
  const { t } = useLanguage();

  const [mode, setMode] = useState<'login' | 'register'>(authMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('+998 ');
  const [telegram, setTelegram] = useState('');
  const [role, setRole] = useState<'user' | 'dealer'>('user');
  const [region, setRegion] = useState('Toshkent shahri');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!authModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (mode === 'login') {
        await login(email);
      } else {
        await register({
          name,
          email,
          phone,
          telegram,
          role,
          region,
          city: region
        });
      }
    } catch (err: any) {
      setError(err.message || 'Xatolik yuz berdi');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = (demoEmail: string) => {
    setEmail(demoEmail);
    login(demoEmail).catch(err => setError(err.message));
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div className="relative bg-white dark:bg-[#161a22] rounded-3xl w-full max-w-md shadow-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 space-y-6">
        <button
          onClick={closeAuth}
          className="absolute top-4 right-4 p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-red-600 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center space-y-1">
          <div className="w-12 h-12 rounded-2xl bg-red-600 text-white flex items-center justify-center mx-auto mb-2 shadow-lg shadow-red-600/30">
            <UserIcon className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white">
            {mode === 'login' ? t('loginTitle') : t('registerTitle')}
          </h2>
          <p className="text-xs text-slate-500">
            AutoSavdo Pro avtomobil maydonchasiga xush kelibsiz
          </p>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/40 text-red-600 text-xs font-semibold">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'register' && (
            <>
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {t('fullName')} *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ism va familiyangiz"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs sm:text-sm focus:ring-2 focus:ring-red-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {t('phone')} *
                </label>
                <input
                  type="text"
                  required
                  placeholder="+998 90 123 45 67"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs sm:text-sm focus:ring-2 focus:ring-red-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {t('region')}
                </label>
                <select
                  value={region}
                  onChange={e => setRegion(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs sm:text-sm focus:ring-2 focus:ring-red-500 focus:outline-none"
                >
                  {UZBEKISTAN_REGIONS.map(reg => (
                    <option key={reg} value={reg}>{reg}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Akkaunt turi
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setRole('user')}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border transition ${
                      role === 'user' ? 'bg-red-600 text-white border-red-600' : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    Oddiy sotuvchi
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole('dealer')}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border transition ${
                      role === 'dealer' ? 'bg-red-600 text-white border-red-600' : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    Avtosalon / Diler
                  </button>
                </div>
              </div>
            </>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              {t('email')} *
            </label>
            <input
              type="email"
              required
              placeholder="example@mail.uz"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs sm:text-sm focus:ring-2 focus:ring-red-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              {t('password')} *
            </label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs sm:text-sm focus:ring-2 focus:ring-red-500 focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-sm shadow-md shadow-red-600/30 transition disabled:opacity-50"
          >
            {loading ? 'Tekshirilmoqda...' : mode === 'login' ? t('signIn') : t('signUp')}
          </button>
        </form>

        {/* Quick Demo Logins for Fast Evaluation */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-2">
          <span className="text-[11px] text-slate-400 font-medium block text-center">
            Tezkor demo loginlar (parol talab qilinmaydi):
          </span>
          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            <button
              onClick={() => handleQuickLogin('alisher@gmail.com')}
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-red-50 hover:text-red-600 transition font-bold"
            >
              Xaridor
            </button>
            <button
              onClick={() => handleQuickLogin('dealer@samauto.uz')}
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-amber-50 hover:text-amber-600 transition font-bold"
            >
              Diler
            </button>
            <button
              onClick={() => handleQuickLogin('admin@autosavdo.uz')}
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-purple-50 hover:text-purple-600 transition font-bold"
            >
              Admin
            </button>
          </div>
        </div>

        {/* Toggle Mode */}
        <div className="text-center pt-2">
          <button
            onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
            className="text-xs text-red-600 hover:underline font-bold"
          >
            {mode === 'login' ? t('dontHaveAccount') : t('alreadyHaveAccount')}
          </button>
        </div>
      </div>
    </div>
  );
};
