import React from 'react';
import { 
  Heart, 
  Scale, 
  MapPin, 
  Gauge, 
  Fuel, 
  ShieldCheck, 
  Sparkles, 
  Zap,
  TrendingDown,
  Building2,
  Calendar,
  Layers
} from 'lucide-react';
import type { CarListing } from '../../types/index.ts';
import { useLanguage } from '../../context/LanguageContext.tsx';
import { useFavorites } from '../../context/FavoritesContext.tsx';
import { useCompare } from '../../context/CompareContext.tsx';

interface CarCardProps {
  car: CarListing;
  onClick: (car: CarListing) => void;
  layout?: 'grid' | 'list';
}

export const CarCard: React.FC<CarCardProps> = ({ car, onClick, layout = 'grid' }) => {
  const { formatPrice, formatNumber, t, currency } = useLanguage();
  const { isFavorite, toggleFavorite } = useFavorites();
  const { isComparing, addToCompare } = useCompare();

  const fav = isFavorite(car.id);
  const comparing = isComparing(car.id);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFavorite(car);
  };

  const handleCompareClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCompare(car);
  };

  // Fuel tag text
  const getFuelLabel = () => {
    if (car.fuelType === 'cng') return 'Metan Gaz';
    if (car.fuelType === 'lpg') return 'Propan Gaz';
    if (car.fuelType === 'electric') return 'Elektr';
    if (car.fuelType === 'hybrid') return 'Gibrid';
    return 'Benzin';
  };

  const isSold = car.status === 'sold';
  const isReserved = car.status === 'reserved';

  if (layout === 'list') {
    return (
      <div 
        onClick={() => onClick(car)}
        className="group relative bg-white dark:bg-[#161920] rounded-2xl border border-slate-200/80 dark:border-slate-800/80 hover:border-red-500/40 dark:hover:border-red-500/40 hover:shadow-xl hover:shadow-slate-200/50 dark:hover:shadow-black/50 transition-all duration-200 cursor-pointer overflow-hidden flex flex-col md:flex-row"
      >
        {/* Image Container */}
        <div className="relative md:w-72 h-52 md:h-auto shrink-0 bg-slate-100 dark:bg-slate-800 overflow-hidden">
          <img 
            src={car.coverImage || car.images[0]} 
            alt={car.title}
            className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ${isSold ? 'grayscale' : ''}`}
            loading="lazy"
          />

          {/* Badges overlay */}
          <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
            {car.isFeatured && (
              <span className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 text-white font-black text-[11px] uppercase tracking-wider shadow-md">
                <Sparkles className="w-3 h-3" /> VIP
              </span>
            )}
            {car.isDiscounted && (
              <span className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-red-600 text-white font-bold text-[11px] shadow-md">
                <TrendingDown className="w-3 h-3" /> Chegirma
              </span>
            )}
            {isSold && (
              <span className="px-2.5 py-1 rounded-lg bg-slate-900/90 text-white font-bold text-xs uppercase backdrop-blur-sm">
                {t('sold')}
              </span>
            )}
            {isReserved && (
              <span className="px-2.5 py-1 rounded-lg bg-amber-500/90 text-white font-bold text-xs uppercase backdrop-blur-sm">
                {t('reserved')}
              </span>
            )}
          </div>

          {/* Action buttons (Favorite & Compare) */}
          <div className="absolute top-3 right-3 flex flex-col gap-1.5 z-10">
            <button
              onClick={handleFavoriteClick}
              className={`p-2 rounded-xl backdrop-blur-md transition ${
                fav 
                  ? 'bg-red-600 text-white shadow-lg shadow-red-600/30' 
                  : 'bg-white/80 dark:bg-slate-900/80 text-slate-700 dark:text-slate-300 hover:text-red-600 dark:hover:text-red-400'
              }`}
            >
              <Heart className={`w-4 h-4 ${fav ? 'fill-white' : ''}`} />
            </button>
            <button
              onClick={handleCompareClick}
              className={`p-2 rounded-xl backdrop-blur-md transition ${
                comparing 
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30' 
                  : 'bg-white/80 dark:bg-slate-900/80 text-slate-700 dark:text-slate-300 hover:text-blue-600'
              }`}
              title="Taqqoslash"
            >
              <Scale className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Info Column */}
        <div className="p-5 flex-1 flex flex-col justify-between">
          <div>
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="font-bold text-lg text-slate-900 dark:text-white group-hover:text-red-600 dark:group-hover:text-red-400 transition line-clamp-1">
                  {car.make} {car.model} <span className="text-slate-500 font-normal">({car.year})</span>
                </h3>
                {car.generation && (
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{car.generation}</p>
                )}
              </div>

              {/* Price */}
              <div className="text-right">
                <div className="text-xl font-extrabold text-slate-900 dark:text-white font-mono">
                  {formatPrice(car.priceUZS)}
                </div>
                <div className="text-xs text-slate-400 font-mono mt-0.5">
                  {currency === 'UZS' ? `~$${formatNumber(car.priceUSD)}` : `${formatNumber(car.priceUZS)} so'm`}
                </div>
              </div>
            </div>

            {/* Description excerpt */}
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 line-clamp-2">
              {car.description}
            </p>

            {/* Specs row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-300">
                <Gauge className="w-3.5 h-3.5 text-red-500 shrink-0" />
                <span>{formatNumber(car.mileage)} km</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-300">
                <Fuel className="w-3.5 h-3.5 text-red-500 shrink-0" />
                <span>{getFuelLabel()}</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-300">
                <Layers className="w-3.5 h-3.5 text-red-500 shrink-0" />
                <span className="capitalize">{car.transmission === 'automatic' ? 'Avtomat' : 'Mexanika'}</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-300">
                <MapPin className="w-3.5 h-3.5 text-red-500 shrink-0" />
                <span className="truncate">{car.city || car.region}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
            <div className="flex items-center gap-2">
              {car.isVerifiedSeller && (
                <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold">
                  <ShieldCheck className="w-4 h-4" />
                  {car.sellerType === 'dealer' ? 'Rasmiy avtosalon' : 'Tasdiqlangan sotuvchi'}
                </span>
              )}
              {!car.isVerifiedSeller && (
                <span className="text-slate-500 dark:text-slate-400">
                  {car.sellerName}
                </span>
              )}
            </div>
            <span className="text-[11px] text-slate-400">
              {new Date(car.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>
    );
  }

  // Default Grid Layout
  return (
    <div 
      onClick={() => onClick(car)}
      className="group relative bg-white dark:bg-[#161920] rounded-2xl border border-slate-200/80 dark:border-slate-800/80 hover:border-red-500/40 dark:hover:border-red-500/40 hover:shadow-xl hover:shadow-slate-200/50 dark:hover:shadow-black/50 transition-all duration-200 cursor-pointer overflow-hidden flex flex-col"
    >
      {/* Photo Container */}
      <div className="relative aspect-[16/10] w-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
        <img 
          src={car.coverImage || car.images[0]} 
          alt={car.title}
          className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ${isSold ? 'grayscale' : ''}`}
          loading="lazy"
        />

        {/* Gradient Shadow */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
          {car.isFeatured && (
            <span className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 text-white font-black text-[10px] uppercase tracking-wider shadow-md">
              <Sparkles className="w-3 h-3" /> VIP
            </span>
          )}
          {car.isDiscounted && (
            <span className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-red-600 text-white font-bold text-[10px] shadow-md">
              <TrendingDown className="w-3 h-3" /> Chegirma
            </span>
          )}
          {isSold && (
            <span className="px-2.5 py-1 rounded-lg bg-slate-900/90 text-white font-bold text-xs uppercase backdrop-blur-sm">
              {t('sold')}
            </span>
          )}
          {isReserved && (
            <span className="px-2.5 py-1 rounded-lg bg-amber-500/90 text-white font-bold text-xs uppercase backdrop-blur-sm">
              {t('reserved')}
            </span>
          )}
        </div>

        {/* Action buttons (Favorite & Compare) */}
        <div className="absolute top-3 right-3 flex flex-col gap-1.5 z-10">
          <button
            onClick={handleFavoriteClick}
            className={`p-2 rounded-xl backdrop-blur-md transition ${
              fav 
                ? 'bg-red-600 text-white shadow-lg shadow-red-600/30 scale-105' 
                : 'bg-black/40 hover:bg-black/60 text-white'
            }`}
            title="Sevimlilarga qo'shish"
          >
            <Heart className={`w-4 h-4 ${fav ? 'fill-white' : ''}`} />
          </button>
          <button
            onClick={handleCompareClick}
            className={`p-2 rounded-xl backdrop-blur-md transition ${
              comparing 
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30' 
                : 'bg-black/40 hover:bg-black/60 text-white'
            }`}
            title="Taqqoslash"
          >
            <Scale className="w-4 h-4" />
          </button>
        </div>

        {/* Location & Year Bottom Overlay */}
        <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-white text-xs z-10">
          <span className="flex items-center gap-1 font-medium drop-shadow-md truncate">
            <MapPin className="w-3.5 h-3.5 text-red-400 shrink-0" />
            <span className="truncate">{car.region}</span>
          </span>
          <span className="font-bold bg-black/50 backdrop-blur-md px-2 py-0.5 rounded-md text-[11px]">
            {car.year}
          </span>
        </div>
      </div>

      {/* Body details */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div>
          <h3 className="font-bold text-slate-900 dark:text-white group-hover:text-red-600 dark:group-hover:text-red-400 transition line-clamp-1">
            {car.make} {car.model}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">
            {car.generation || `${car.engineVolume ? `${car.engineVolume}L` : ''} ${car.bodyType}`}
          </p>
        </div>

        {/* Key Specs Matrix */}
        <div className="grid grid-cols-3 gap-1 py-2 px-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 text-[11px] text-slate-600 dark:text-slate-300">
          <div className="flex items-center gap-1">
            <Gauge className="w-3 h-3 text-red-500 shrink-0" />
            <span className="truncate">{formatNumber(car.mileage)} km</span>
          </div>
          <div className="flex items-center gap-1">
            <Fuel className="w-3 h-3 text-red-500 shrink-0" />
            <span className="truncate">{getFuelLabel()}</span>
          </div>
          <div className="flex items-center gap-1">
            <Layers className="w-3 h-3 text-red-500 shrink-0" />
            <span className="truncate capitalize">{car.transmission === 'automatic' ? 'Avtomat' : 'Mexanika'}</span>
          </div>
        </div>

        {/* Price & Seller */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-end justify-between">
          <div>
            <div className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white font-mono tracking-tight">
              {formatPrice(car.priceUZS)}
            </div>
            <div className="text-[11px] text-slate-400 font-mono">
              {currency === 'UZS' ? `~$${formatNumber(car.priceUSD)}` : `${formatNumber(car.priceUZS)} so'm`}
            </div>
          </div>

          {/* Seller badge */}
          <div className="text-right">
            {car.isVerifiedSeller ? (
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                <ShieldCheck className="w-3.5 h-3.5" />
                {car.sellerType === 'dealer' ? 'Avtosalon' : 'Tasdiqlangan'}
              </span>
            ) : (
              <span className="text-[11px] text-slate-500 truncate max-w-[100px] block">
                {car.sellerName}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
