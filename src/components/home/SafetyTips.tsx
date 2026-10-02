import React from 'react';
import { ShieldAlert, FileCheck, SearchCheck, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext.tsx';

export const SafetyTips: React.FC = () => {
  const { t } = useLanguage();

  return (
    <section className="py-10">
      <div className="rounded-3xl bg-gradient-to-br from-slate-900 to-[#12161f] text-white p-8 sm:p-12 border border-slate-800 shadow-xl relative overflow-hidden">
        {/* Glow accent */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-4xl">
          <div className="flex items-center gap-2 text-red-400 font-bold text-xs uppercase tracking-wider mb-2">
            <ShieldAlert className="w-4 h-4" />
            <span>Xavfsizlik va ishonch kafolati</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            {t('safetyTipsTitle')}
          </h2>
          <p className="mt-2 text-sm text-slate-300">
            AutoSavdo Pro orqali xarid qilishda firibgarlardan himoyalanish va avtomobilni to'g'ri tekshirish bo'yicha maslahatlar:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            {/* Tip 1 */}
            <div className="p-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
              <div className="w-10 h-10 rounded-xl bg-red-600/20 text-red-400 flex items-center justify-center mb-4">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base mb-2 text-white">
                {t('safetyTip1Title')}
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                {t('safetyTip1Desc')}
              </p>
            </div>

            {/* Tip 2 */}
            <div className="p-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
              <div className="w-10 h-10 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center mb-4">
                <FileCheck className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base mb-2 text-white">
                {t('safetyTip2Title')}
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                {t('safetyTip2Desc')}
              </p>
            </div>

            {/* Tip 3 */}
            <div className="p-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
              <div className="w-10 h-10 rounded-xl bg-emerald-600/20 text-emerald-400 flex items-center justify-center mb-4">
                <SearchCheck className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base mb-2 text-white">
                {t('safetyTip3Title')}
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                {t('safetyTip3Desc')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
