import React from 'react';
import { Car, Building2, Users, CheckCircle } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext.tsx';
import type { PlatformStats } from '../../types/index.ts';

interface StatsSectionProps {
  stats: PlatformStats | null;
}

export const StatsSection: React.FC<StatsSectionProps> = ({ stats }) => {
  const { formatNumber, formatPrice, t } = useLanguage();

  return (
    <section className="py-8">
      <div className="rounded-3xl bg-slate-100 dark:bg-[#141820] p-6 sm:p-8 border border-slate-200 dark:border-slate-800">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-red-600/10 dark:bg-red-500/20 text-red-600 dark:text-red-400 flex items-center justify-center shrink-0">
              <Car className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-mono">
                {formatNumber(stats?.activeListings || 12)}
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                Faol avtomobillar
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-600/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-mono">
                {formatNumber(stats?.dealersCount || 3)}
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                Rasmiy avtosalonlar
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-600/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
              <CheckCircle className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-mono">
                {stats?.averagePriceUZS ? formatPrice(stats.averagePriceUZS) : '315 000 000 so\'m'}
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                O'rtacha bozor narxi
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-purple-600/10 dark:bg-purple-500/20 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-mono">
                {formatNumber(stats?.totalUsers || 15)}
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                Ro'yxatdan o'tgan a'zolar
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
