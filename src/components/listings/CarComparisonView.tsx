import React, { useState } from 'react';
import { 
  Scale, 
  Trash2, 
  Plus, 
  Check, 
  X, 
  Gauge, 
  Fuel, 
  Layers, 
  MapPin, 
  ShieldCheck, 
  ExternalLink 
} from 'lucide-react';
import { useCompare } from '../../context/CompareContext.tsx';
import { useLanguage } from '../../context/LanguageContext.tsx';
import type { CarListing } from '../../types/index.ts';

interface CarComparisonViewProps {
  onSelectCar: (car: CarListing) => void;
  onBrowseMore: () => void;
}

export const CarComparisonView: React.FC<CarComparisonViewProps> = ({ onSelectCar, onBrowseMore }) => {
  const { compareCars, removeFromCompare, clearCompare } = useCompare();
  const { formatPrice, formatNumber, t, currency } = useLanguage();
  const [onlyDifferences, setOnlyDifferences] = useState(false);

  if (compareCars.length === 0) {
    return (
      <div className="py-20 text-center space-y-4">
        <div className="w-16 h-16 rounded-3xl bg-red-100 dark:bg-red-950/40 text-red-600 dark:text-red-400 flex items-center justify-center mx-auto">
          <Scale className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
          {t('noCompareSelected')}
        </h2>
        <p className="text-sm text-slate-500 max-w-md mx-auto">
          {t('noCompareDesc')} (4 tagacha avtomobilni yonma-yon solishtirishingiz mumkin).
        </p>
        <button
          onClick={onBrowseMore}
          className="px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-sm shadow-md transition"
        >
          Avtomobillarni ko'rish
        </button>
      </div>
    );
  }

  // Comparison Rows
  const specRows = [
    { label: t('price'), key: 'price', render: (c: CarListing) => formatPrice(c.priceUZS) },
    { label: t('year'), key: 'year', render: (c: CarListing) => c.year },
    { label: t('mileage'), key: 'mileage', render: (c: CarListing) => `${formatNumber(c.mileage)} km` },
    { label: t('engineVolume'), key: 'engine', render: (c: CarListing) => c.engineVolume ? `${c.engineVolume} L` : 'Elektr' },
    { label: t('fuelType'), key: 'fuel', render: (c: CarListing) => c.fuelType.toUpperCase() },
    { label: t('transmission'), key: 'transmission', render: (c: CarListing) => c.transmission },
    { label: t('drivetrain'), key: 'drivetrain', render: (c: CarListing) => c.drivetrain.toUpperCase() },
    { label: t('bodyType'), key: 'bodyType', render: (c: CarListing) => c.bodyType },
    { label: t('paintCondition'), key: 'paint', render: (c: CarListing) => c.paintCondition === 'clean' ? 'Toza (bo\'yoq yo\'q)' : 'Bo\'yalgan' },
    { label: t('region'), key: 'region', render: (c: CarListing) => `${c.city}, ${c.region}` },
    { label: t('sellerType'), key: 'seller', render: (c: CarListing) => c.sellerType === 'dealer' ? 'Rasmiy diler' : 'Xususiy' },
  ];

  return (
    <div className="py-8 space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {t('compareTitle')} ({compareCars.length}/4)
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            {t('compareSubtitle')}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700 dark:text-slate-300">
            <input
              type="checkbox"
              checked={onlyDifferences}
              onChange={e => setOnlyDifferences(e.target.checked)}
              className="rounded text-red-600 focus:ring-red-500 w-4 h-4"
            />
            <span>{t('highlightDiff')}</span>
          </label>

          <button
            onClick={clearCompare}
            className="px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-red-600 transition flex items-center gap-1.5"
          >
            <Trash2 className="w-3.5 h-3.5" />
            {t('clearCompare')}
          </button>
        </div>
      </div>

      {/* Comparison Grid Table */}
      <div className="overflow-x-auto rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#161a22]">
        <table className="w-full text-left border-collapse min-w-[700px]">
          {/* Header Row: Car Photos & Titles */}
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-800">
              <th className="p-4 w-44 bg-slate-50/50 dark:bg-slate-900/40 text-xs font-bold text-slate-500 uppercase">
                Parametr
              </th>
              {compareCars.map(car => (
                <th key={car.id} className="p-4 align-top w-64 min-w-[200px]">
                  <div className="relative group">
                    <button
                      onClick={() => removeFromCompare(car.id)}
                      className="absolute -top-2 -right-2 p-1 rounded-full bg-slate-800 text-white hover:bg-red-600 transition z-10"
                      title="O'chirish"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                    <img
                      src={car.coverImage || car.images[0]}
                      alt={car.title}
                      className="w-full h-32 object-cover rounded-xl mb-3 cursor-pointer"
                      onClick={() => onSelectCar(car)}
                    />
                    <h4 
                      onClick={() => onSelectCar(car)}
                      className="font-bold text-sm text-slate-900 dark:text-white hover:text-red-500 transition cursor-pointer line-clamp-1"
                    >
                      {car.make} {car.model}
                    </h4>
                    <span className="text-xs text-slate-400 font-mono block">
                      {car.year} yil
                    </span>
                  </div>
                </th>
              ))}

              {/* Slot to add more */}
              {compareCars.length < 4 && (
                <th className="p-4 align-middle w-48 text-center border-l border-dashed border-slate-200 dark:border-slate-800">
                  <button
                    onClick={onBrowseMore}
                    className="p-6 rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-red-500 text-slate-500 hover:text-red-500 transition flex flex-col items-center justify-center gap-2 mx-auto"
                  >
                    <Plus className="w-6 h-6" />
                    <span className="text-xs font-bold">{t('addCarToCompare')}</span>
                  </button>
                </th>
              )}
            </tr>
          </thead>

          {/* Specs Rows */}
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-xs sm:text-sm">
            {specRows.map(row => {
              // Check if values differ across cars
              const values = compareCars.map(c => row.render(c));
              const allEqual = values.every(v => v === values[0]);
              if (onlyDifferences && allEqual) return null;

              return (
                <tr key={row.key} className={allEqual ? '' : 'bg-red-50/20 dark:bg-red-950/10'}>
                  <td className="p-4 font-bold text-slate-500 dark:text-slate-400 bg-slate-50/50 dark:bg-slate-900/40">
                    {row.label}
                  </td>
                  {compareCars.map(car => (
                    <td key={car.id} className="p-4 font-semibold text-slate-900 dark:text-white">
                      {row.render(car)}
                    </td>
                  ))}
                  {compareCars.length < 4 && <td className="p-4" />}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
