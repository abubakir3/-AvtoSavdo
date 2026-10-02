import React, { useState } from 'react';
import { Search, SlidersHorizontal, Sparkles, MapPin, ChevronDown } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext.tsx';
import { POPULAR_MAKES, MODELS_BY_MAKE, UZBEKISTAN_REGIONS } from '../../i18n/translations.ts';
import type { FilterParams } from '../../types/index.ts';

interface HeroSearchProps {
  onSearch: (params: FilterParams) => void;
  totalListingsCount?: number;
}

export const HeroSearch: React.FC<HeroSearchProps> = ({ onSearch, totalListingsCount = 12 }) => {
  const { t, formatPrice, formatNumber } = useLanguage();

  const [activeTab, setActiveTab] = useState<'all' | 'new' | 'used' | 'ev'>('all');
  const [make, setMake] = useState<string>('');
  const [model, setModel] = useState<string>('');
  const [region, setRegion] = useState<string>('');
  const [priceMax, setPriceMax] = useState<string>('');
  const [yearMin, setYearMin] = useState<string>('');

  const availableModels = make && MODELS_BY_MAKE[make] ? MODELS_BY_MAKE[make] : [];

  const handleMakeChange = (selectedMake: string) => {
    setMake(selectedMake);
    setModel('');
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params: FilterParams = {};
    if (make) params.make = make;
    if (model) params.model = model;
    if (region) params.region = region;
    if (priceMax) params.priceMax = parseInt(priceMax);
    if (yearMin) params.yearMin = parseInt(yearMin);

    if (activeTab === 'new') params.condition = 'new';
    if (activeTab === 'ev') params.fuelType = 'electric';

    onSearch(params);
  };

  const handleQuickTag = (tagMake: string, tagModel?: string) => {
    onSearch({
      make: tagMake,
      model: tagModel
    });
  };

  return (
    <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-slate-800 bg-[#0e1117] text-white">
      {/* Background Graphic & Car Image */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=2000&q=80"
          alt="Luxury car showcase"
          className="w-full h-full object-cover object-center opacity-30 mix-blend-luminosity scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0b0d13] via-[#0b0d13]/90 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0b0d13] via-transparent to-transparent" />
      </div>

      <div className="relative z-10 p-6 sm:p-10 lg:p-14 max-w-5xl">
        {/* Badge & Title */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-600/20 border border-red-500/30 text-red-400 text-xs font-semibold mb-4 backdrop-blur-md">
          <Sparkles className="w-3.5 h-3.5" />
          <span>O'zbekistonda №1 avtomobil savdo portali</span>
        </div>

        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
          O'zbekistonda orzuingizdagi <br />
          <span className="bg-gradient-to-r from-red-500 via-rose-400 to-red-600 bg-clip-text text-transparent">
            avtomobilni toping
          </span>
        </h1>
        <p className="mt-3 text-sm sm:text-base text-slate-300 max-w-xl">
          {t('heroSubtitle')} — Chevrolet, BYD, Kia, Hyundai va minglab boshqa takliflar.
        </p>

        {/* Search Box Card */}
        <div className="mt-8 bg-white/95 dark:bg-[#161a22]/95 backdrop-blur-xl rounded-2xl p-4 sm:p-6 shadow-2xl border border-slate-200/20 dark:border-slate-800 text-slate-900 dark:text-white">
          {/* Quick Category Tabs */}
          <div className="flex items-center gap-2 pb-4 mb-4 border-b border-slate-200 dark:border-slate-800 overflow-x-auto no-scrollbar">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition shrink-0 ${
                activeTab === 'all'
                  ? 'bg-red-600 text-white shadow-md shadow-red-600/30'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              Barchasi ({totalListingsCount})
            </button>
            <button
              onClick={() => setActiveTab('new')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition shrink-0 ${
                activeTab === 'new'
                  ? 'bg-red-600 text-white shadow-md shadow-red-600/30'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              Yangi (salondan)
            </button>
            <button
              onClick={() => setActiveTab('used')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition shrink-0 ${
                activeTab === 'used'
                  ? 'bg-red-600 text-white shadow-md shadow-red-600/30'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              Probeg bilan
            </button>
            <button
              onClick={() => setActiveTab('ev')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition shrink-0 ${
                activeTab === 'ev'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              ⚡ Elektr & Gibrid
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {/* Make */}
            <div className="relative">
              <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1">
                {t('make')}
              </label>
              <select
                value={make}
                onChange={e => handleMakeChange(e.target.value)}
                className="w-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2.5 text-xs sm:text-sm font-medium focus:ring-2 focus:ring-red-500 focus:outline-none appearance-none"
              >
                <option value="">Barcha markalar</option>
                {POPULAR_MAKES.map(m => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-8 pointer-events-none" />
            </div>

            {/* Model */}
            <div className="relative">
              <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1">
                {t('model')}
              </label>
              <select
                value={model}
                disabled={!make}
                onChange={e => setModel(e.target.value)}
                className="w-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2.5 text-xs sm:text-sm font-medium focus:ring-2 focus:ring-red-500 focus:outline-none appearance-none disabled:opacity-50"
              >
                <option value="">{make ? 'Barcha modellar' : 'Avval markani tanlang'}</option>
                {availableModels.map(mod => (
                  <option key={mod} value={mod}>{mod}</option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-8 pointer-events-none" />
            </div>

            {/* Region */}
            <div className="relative">
              <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1">
                {t('region')}
              </label>
              <select
                value={region}
                onChange={e => setRegion(e.target.value)}
                className="w-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2.5 text-xs sm:text-sm font-medium focus:ring-2 focus:ring-red-500 focus:outline-none appearance-none"
              >
                <option value="">Barcha hududlar</option>
                {UZBEKISTAN_REGIONS.map(reg => (
                  <option key={reg} value={reg}>{reg}</option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-8 pointer-events-none" />
            </div>

            {/* Price Max */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1">
                Maksimal narx ({t('som')})
              </label>
              <select
                value={priceMax}
                onChange={e => setPriceMax(e.target.value)}
                className="w-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2.5 text-xs sm:text-sm font-medium focus:ring-2 focus:ring-red-500 focus:outline-none appearance-none"
              >
                <option value="">Ixtiyoriy</option>
                <option value="120000000">120 mln gacha</option>
                <option value="180000000">180 mln gacha</option>
                <option value="250000000">250 mln gacha</option>
                <option value="400000000">400 mln gacha</option>
                <option value="800000000">800 mln gacha</option>
              </select>
            </div>

            {/* Submit Button */}
            <div className="flex items-end">
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold py-2.5 px-4 rounded-xl text-sm flex items-center justify-center gap-2 shadow-lg shadow-red-600/30 active:scale-98 transition"
              >
                <Search className="w-4 h-4" />
                <span>Qidirish</span>
              </button>
            </div>
          </form>

          {/* Quick tags */}
          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex flex-wrap items-center gap-2 text-xs">
            <span className="text-slate-400 font-medium">Tezkor:</span>
            {['Cobalt', 'Gentra', 'Tracker', 'Song Plus', 'K5', 'Onix'].map(item => (
              <button
                key={item}
                type="button"
                onClick={() => {
                  if (item === 'Song Plus') handleQuickTag('BYD', 'Song Plus DM-i');
                  else if (item === 'K5') handleQuickTag('Kia', 'K5');
                  else handleQuickTag('Chevrolet', item);
                }}
                className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800/60 hover:bg-red-50 dark:hover:bg-red-950/40 text-slate-700 dark:text-slate-300 hover:text-red-600 dark:hover:text-red-400 border border-slate-200/60 dark:border-slate-700/60 transition"
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
