import React from 'react';
import { ChevronRight } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext.tsx';
import { POPULAR_MAKES } from '../../i18n/translations.ts';

interface PopularBrandsProps {
  onSelectBrand: (brand: string) => void;
  brandCounts?: Record<string, number>;
}

export const PopularBrands: React.FC<PopularBrandsProps> = ({ onSelectBrand, brandCounts = {} }) => {
  const { t } = useLanguage();

  const brandsMeta: Record<string, { desc: string; icon: string; bg: string }> = {
    Chevrolet: { desc: 'Cobalt, Gentra, Tracker, Onix', icon: '🚗', bg: 'from-amber-500/10 to-amber-600/10' },
    BYD: { desc: 'Song Plus, Chazor, Han, Seagull', icon: '⚡', bg: 'from-emerald-500/10 to-teal-600/10' },
    Kia: { desc: 'K5, Seltos, Sportage, Sonet', icon: '🏎️', bg: 'from-red-500/10 to-rose-600/10' },
    Hyundai: { desc: 'Elantra, Santa Fe, Tucson, Sonata', icon: '🚙', bg: 'from-blue-500/10 to-indigo-600/10' },
    Toyota: { desc: 'Camry, Prado, LC300, RAV4', icon: '🛡️', bg: 'from-red-500/10 to-red-700/10' },
    BMW: { desc: '5 Series, X5, 3 Series, X7', icon: '🚀', bg: 'from-sky-500/10 to-blue-600/10' },
    'Mercedes-Benz': { desc: 'E-Class, C-Class, S-Class, GLE', icon: '⭐', bg: 'from-slate-500/10 to-slate-700/10' },
    Tesla: { desc: 'Model Y, Model 3, Model X', icon: '🔋', bg: 'from-purple-500/10 to-violet-600/10' },
  };

  return (
    <section className="py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {t('popularBrands')}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            O'zbekistonda eng ko'p sotilayotgan va xarid qilinayotgan avtomobil markalari
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
        {POPULAR_MAKES.slice(0, 8).map(make => {
          const meta = brandsMeta[make] || { desc: 'Avtomobillar', icon: '🚘', bg: 'from-slate-500/10 to-slate-600/10' };
          const count = brandCounts[make] || 0;

          return (
            <button
              key={make}
              onClick={() => onSelectBrand(make)}
              className="group p-4 rounded-2xl bg-white dark:bg-[#161a22] border border-slate-200/80 dark:border-slate-800 hover:border-red-500/50 dark:hover:border-red-500/50 hover:shadow-lg transition-all duration-200 text-left flex flex-col justify-between"
            >
              <div className="flex items-center justify-between">
                <span className="text-2xl p-2 rounded-xl bg-slate-100 dark:bg-slate-800/80 group-hover:scale-110 transition">
                  {meta.icon}
                </span>
                {count > 0 && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                    {count}
                  </span>
                )}
              </div>

              <div className="mt-3">
                <span className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-red-600 dark:group-hover:text-red-400 transition block">
                  {make}
                </span>
                <span className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">
                  {meta.desc}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
};
