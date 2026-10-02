import React from 'react';
import { Car, Phone, Mail, MapPin, Shield, CheckCircle, Heart, ArrowUp } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext.tsx';
import { POPULAR_MAKES, UZBEKISTAN_REGIONS } from '../../i18n/translations.ts';

export const Footer: React.FC<{ onNavigate: (tab: string, param?: string) => void }> = ({ onNavigate }) => {
  const { t } = useLanguage();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-slate-950 text-slate-400 pt-16 pb-12 border-t border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800/80">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-600 flex items-center justify-center text-white shadow-lg shadow-red-600/30">
                <Car className="w-6 h-6" />
              </div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-2xl tracking-tight text-white">
                  Auto<span className="text-red-500">Savdo</span>
                </span>
                <span className="text-[10px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded bg-red-600/20 text-red-400 border border-red-500/30">
                  PRO
                </span>
              </div>
            </div>
            
            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              {t('footerDesc')}
            </p>

            <div className="flex flex-col gap-2 pt-2 text-xs">
              <div className="flex items-center gap-2 text-slate-300">
                <Phone className="w-4 h-4 text-red-500 shrink-0" />
                <span>+998 (71) 200-00-00 (Qo'llab-quvvatlash)</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <Mail className="w-4 h-4 text-red-500 shrink-0" />
                <span>support@autosavdo.uz</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <MapPin className="w-4 h-4 text-red-500 shrink-0" />
                <span>Toshkent shahri, Amir Temur shox ko'chasi, 107-B</span>
              </div>
            </div>
          </div>

          {/* Popular Makes */}
          <div>
            <h4 className="text-white font-bold text-sm mb-4 uppercase tracking-wider">
              {t('popularBrands')}
            </h4>
            <ul className="space-y-2 text-xs">
              {POPULAR_MAKES.slice(0, 7).map(make => (
                <li key={make}>
                  <button 
                    onClick={() => onNavigate('catalog', make)}
                    className="hover:text-red-400 transition"
                  >
                    {make} O'zbekistonda
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Popular Cities */}
          <div>
            <h4 className="text-white font-bold text-sm mb-4 uppercase tracking-wider">
              {t('popularCities')}
            </h4>
            <ul className="space-y-2 text-xs">
              {UZBEKISTAN_REGIONS.slice(0, 7).map(reg => (
                <li key={reg}>
                  <button 
                    onClick={() => onNavigate('catalog', reg)}
                    className="hover:text-red-400 transition"
                  >
                    {reg} avtomashinalar
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Tools & Safety */}
          <div>
            <h4 className="text-white font-bold text-sm mb-4 uppercase tracking-wider">
              {t('quickLinks')}
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => onNavigate('calculators')} className="hover:text-red-400 transition">
                  {t('loanCalc')}
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('calculators')} className="hover:text-red-400 transition">
                  {t('tcoCalc')}
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('compare')} className="hover:text-red-400 transition">
                  {t('compareTitle')}
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('map')} className="hover:text-red-400 transition">
                  {t('mapTitle')}
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('dealers')} className="hover:text-red-400 transition">
                  Rasmiy dilerlar
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('home')} className="hover:text-red-400 transition">
                  {t('safetyTipsTitle')}
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} AutoSavdo Pro. {t('copyright')}</p>
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-emerald-400" />
              Xavfsiz bitimlar
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle className="w-3.5 h-3.5 text-blue-400" />
              Notariat tekshiruvi
            </span>
            <button
              onClick={scrollToTop}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white transition ml-2"
              title="Yuqoriga"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
