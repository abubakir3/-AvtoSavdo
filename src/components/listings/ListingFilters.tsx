import React, { useState } from 'react';
import { 
  Filter, 
  RotateCcw, 
  Bookmark, 
  Check, 
  ChevronDown, 
  Search,
  Sparkles,
  ShieldCheck
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext.tsx';
import { useAuth } from '../../context/AuthContext.tsx';
import { api } from '../../services/api.ts';
import { POPULAR_MAKES, MODELS_BY_MAKE, UZBEKISTAN_REGIONS } from '../../i18n/translations.ts';
import type { FilterParams, BodyType, FuelType, TransmissionType, SellerType } from '../../types/index.ts';

interface ListingFiltersProps {
  filters: FilterParams;
  onChange: (filters: FilterParams) => void;
  onReset: () => void;
  totalFound: number;
}

export const ListingFilters: React.FC<ListingFiltersProps> = ({
  filters,
  onChange,
  onReset,
  totalFound
}) => {
  const { t, formatPrice } = useLanguage();
  const { user } = useAuth();
  const [saveSuccess, setSaveSuccess] = useState(false);

  const availableModels = filters.make && MODELS_BY_MAKE[filters.make] ? MODELS_BY_MAKE[filters.make] : [];

  const handleFieldChange = (key: keyof FilterParams, value: any) => {
    const updated = { ...filters, [key]: value, page: 1 };
    if (key === 'make') {
      updated.model = '';
    }
    onChange(updated);
  };

  const handleSaveSearch = async () => {
    if (!user) {
      alert('Qidiruvni saqlash uchun iltimos tizimga kiring');
      return;
    }
    const name = `${filters.make || 'Barcha'} ${filters.model || ''} ${filters.region || ''}`.trim() || 'Avto qidiruv';
    try {
      await api.saveSearch(user.id, name, filters);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="bg-white dark:bg-[#161a22] rounded-3xl p-5 sm:p-6 border border-slate-200/80 dark:border-slate-800 space-y-6">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-red-600" />
          <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
            {t('filter')}
          </h3>
          <span className="px-2 py-0.5 text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-full">
            {totalFound}
          </span>
        </div>

        <button
          onClick={onReset}
          className="text-xs text-slate-500 hover:text-red-600 dark:hover:text-red-400 flex items-center gap-1 transition"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          {t('clearFilters')}
        </button>
      </div>

      {/* Make & Model */}
      <div className="space-y-3">
        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
            {t('make')}
          </label>
          <div className="relative">
            <select
              value={filters.make || ''}
              onChange={e => handleFieldChange('make', e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs font-semibold appearance-none focus:ring-2 focus:ring-red-500 focus:outline-none"
            >
              <option value="">Barcha markalar</option>
              {POPULAR_MAKES.map(m => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
            <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-2.5 pointer-events-none" />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
            {t('model')}
          </label>
          <div className="relative">
            <select
              value={filters.model || ''}
              disabled={!filters.make}
              onChange={e => handleFieldChange('model', e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs font-semibold appearance-none focus:ring-2 focus:ring-red-500 focus:outline-none disabled:opacity-50"
            >
              <option value="">{filters.make ? 'Barcha modellar' : 'Avval markani tanlang'}</option>
              {availableModels.map(mod => (
                <option key={mod} value={mod}>{mod}</option>
              ))}
            </select>
            <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-2.5 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Region */}
      <div>
        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
          {t('region')}
        </label>
        <div className="relative">
          <select
            value={filters.region || ''}
            onChange={e => handleFieldChange('region', e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs font-semibold appearance-none focus:ring-2 focus:ring-red-500 focus:outline-none"
          >
            <option value="">Barcha hududlar</option>
            {UZBEKISTAN_REGIONS.map(reg => (
              <option key={reg} value={reg}>{reg}</option>
            ))}
          </select>
          <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-2.5 pointer-events-none" />
        </div>
      </div>

      {/* Price Range */}
      <div>
        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
          {t('price')} ({t('som')})
        </label>
        <div className="grid grid-cols-2 gap-2">
          <input
            type="number"
            placeholder="Dan (masalan: 100 mln)"
            value={filters.priceMin || ''}
            onChange={e => handleFieldChange('priceMin', e.target.value ? Number(e.target.value) : undefined)}
            className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs font-medium focus:ring-2 focus:ring-red-500 focus:outline-none"
          />
          <input
            type="number"
            placeholder="Gacha (masalan: 300 mln)"
            value={filters.priceMax || ''}
            onChange={e => handleFieldChange('priceMax', e.target.value ? Number(e.target.value) : undefined)}
            className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs font-medium focus:ring-2 focus:ring-red-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Year Range */}
      <div>
        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
          {t('year')}
        </label>
        <div className="grid grid-cols-2 gap-2">
          <input
            type="number"
            placeholder="Dan (2018)"
            value={filters.yearMin || ''}
            onChange={e => handleFieldChange('yearMin', e.target.value ? Number(e.target.value) : undefined)}
            className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs font-medium focus:ring-2 focus:ring-red-500 focus:outline-none"
          />
          <input
            type="number"
            placeholder="Gacha (2025)"
            value={filters.yearMax || ''}
            onChange={e => handleFieldChange('yearMax', e.target.value ? Number(e.target.value) : undefined)}
            className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs font-medium focus:ring-2 focus:ring-red-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Fuel Type */}
      <div>
        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
          {t('fuelType')}
        </label>
        <div className="relative">
          <select
            value={filters.fuelType || ''}
            onChange={e => handleFieldChange('fuelType', e.target.value as FuelType)}
            className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs font-semibold appearance-none focus:ring-2 focus:ring-red-500 focus:outline-none"
          >
            <option value="">Barchasi</option>
            <option value="petrol">{t('petrol')}</option>
            <option value="cng">{t('cng')}</option>
            <option value="lpg">{t('lpg')}</option>
            <option value="electric">{t('electric')}</option>
            <option value="hybrid">{t('hybrid')}</option>
          </select>
          <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-2.5 pointer-events-none" />
        </div>
      </div>

      {/* Transmission */}
      <div>
        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
          {t('transmission')}
        </label>
        <div className="relative">
          <select
            value={filters.transmission || ''}
            onChange={e => handleFieldChange('transmission', e.target.value as TransmissionType)}
            className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs font-semibold appearance-none focus:ring-2 focus:ring-red-500 focus:outline-none"
          >
            <option value="">Barchasi</option>
            <option value="automatic">{t('automatic')}</option>
            <option value="manual">{t('manual')}</option>
            <option value="robot">{t('robot')}</option>
            <option value="variator">{t('variator')}</option>
          </select>
          <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-2.5 pointer-events-none" />
        </div>
      </div>

      {/* Body Type */}
      <div>
        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
          {t('bodyType')}
        </label>
        <div className="relative">
          <select
            value={filters.bodyType || ''}
            onChange={e => handleFieldChange('bodyType', e.target.value as BodyType)}
            className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs font-semibold appearance-none focus:ring-2 focus:ring-red-500 focus:outline-none"
          >
            <option value="">Barchasi</option>
            <option value="sedan">{t('sedan')}</option>
            <option value="crossover">{t('crossover')}</option>
            <option value="suv">{t('suv')}</option>
            <option value="hatchback">{t('hatchback')}</option>
            <option value="minivan">{t('minivan')}</option>
          </select>
          <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-2.5 pointer-events-none" />
        </div>
      </div>

      {/* Seller Type */}
      <div>
        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
          {t('sellerType')}
        </label>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => handleFieldChange('sellerType', filters.sellerType === 'private' ? '' : 'private')}
            className={`py-2 px-3 rounded-xl text-xs font-semibold border transition ${
              filters.sellerType === 'private'
                ? 'bg-red-600 text-white border-red-600'
                : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
            }`}
          >
            {t('privateSeller')}
          </button>
          <button
            type="button"
            onClick={() => handleFieldChange('sellerType', filters.sellerType === 'dealer' ? '' : 'dealer')}
            className={`py-2 px-3 rounded-xl text-xs font-semibold border transition ${
              filters.sellerType === 'dealer'
                ? 'bg-red-600 text-white border-red-600'
                : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
            }`}
          >
            {t('dealer')}
          </button>
        </div>
      </div>

      {/* Verification & Badges */}
      <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
        <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-slate-700 dark:text-slate-300">
          <input
            type="checkbox"
            checked={!!filters.onlyVerified}
            onChange={e => handleFieldChange('onlyVerified', e.target.checked)}
            className="rounded text-red-600 focus:ring-red-500 w-4 h-4"
          />
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
          <span>Faqat tasdiqlangan sotuvchilar</span>
        </label>

        <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-slate-700 dark:text-slate-300">
          <input
            type="checkbox"
            checked={!!filters.isFeatured}
            onChange={e => handleFieldChange('isFeatured', e.target.checked)}
            className="rounded text-red-600 focus:ring-red-500 w-4 h-4"
          />
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>Faqat VIP takliflar</span>
        </label>
      </div>

      {/* Save Search Button */}
      <div className="pt-2">
        <button
          onClick={handleSaveSearch}
          className="w-full py-2.5 px-4 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-bold flex items-center justify-center gap-2 transition"
        >
          {saveSuccess ? (
            <>
              <Check className="w-4 h-4 text-emerald-500" />
              <span className="text-emerald-500">{t('savedSearchSuccess')}</span>
            </>
          ) : (
            <>
              <Bookmark className="w-4 h-4 text-red-500" />
              <span>{t('saveSearch')}</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
