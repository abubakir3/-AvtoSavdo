import React from 'react';
import { useLanguage } from '../../context/LanguageContext.tsx';
import type { BodyType } from '../../types/index.ts';

interface BodyTypesGridProps {
  onSelectBodyType: (body: BodyType) => void;
  onSelectFuelType: (fuel: string) => void;
}

export const BodyTypesGrid: React.FC<BodyTypesGridProps> = ({ onSelectBodyType, onSelectFuelType }) => {
  const { t } = useLanguage();

  const bodyTypes: { id: BodyType; name: string; icon: string; countText: string }[] = [
    { id: 'sedan', name: 'Sedan', icon: '🚗', countText: 'Cobalt, Gentra, K5, Chazor' },
    { id: 'crossover', name: 'Krossover & SUV', icon: '🚙', countText: 'Tracker, Song Plus, Prado' },
    { id: 'minivan', name: 'Miniven', icon: '🚐', countText: 'Damas, Carnival, Staria' },
    { id: 'hatchback', name: 'Xetchbek', icon: '🚘', countText: 'Spark, Seagull, Golf' },
  ];

  const fuelBadges = [
    { id: 'cng', label: 'Gaz (Metan)', icon: '🟢', desc: 'Tejamkor 4-avlod' },
    { id: 'petrol', label: 'Benzin (AI-92/95)', icon: '⛽', desc: 'Klassik yonilg\'i' },
    { id: 'electric', label: 'Elektr (EV)', icon: '⚡', desc: 'Nol emissiya' },
    { id: 'hybrid', label: 'Gibrid (DM-i / HEV)', icon: '🔋', desc: '1000+ km zaxira' },
  ];

  return (
    <section className="py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Body Types */}
        <div className="bg-white dark:bg-[#161a22] rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-extrabold text-lg text-slate-900 dark:text-white">
              {t('browseByBody')}
            </h3>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {bodyTypes.map(item => (
              <button
                key={item.id}
                onClick={() => onSelectBodyType(item.id)}
                className="group p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 hover:bg-red-50 dark:hover:bg-red-950/30 border border-slate-200/60 dark:border-slate-700/60 hover:border-red-400 dark:hover:border-red-600 transition text-left"
              >
                <span className="text-2xl block mb-2 group-hover:scale-110 transition">{item.icon}</span>
                <span className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-red-600 dark:group-hover:text-red-400 block">
                  {item.name}
                </span>
                <span className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                  {item.countText}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Fuel Types */}
        <div className="bg-white dark:bg-[#161a22] rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-extrabold text-lg text-slate-900 dark:text-white">
              {t('browseByFuel')}
            </h3>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {fuelBadges.map(item => (
              <button
                key={item.id}
                onClick={() => onSelectFuelType(item.id)}
                className="group p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 hover:bg-red-50 dark:hover:bg-red-950/30 border border-slate-200/60 dark:border-slate-700/60 hover:border-red-400 dark:hover:border-red-600 transition text-left"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xl group-hover:scale-110 transition">{item.icon}</span>
                </div>
                <span className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-red-600 dark:group-hover:text-red-400 block">
                  {item.label}
                </span>
                <span className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                  {item.desc}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
