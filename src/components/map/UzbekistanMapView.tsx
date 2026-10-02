import React, { useState } from 'react';
import { MapPin, Navigation, Car, Shield, Sparkles, ChevronRight } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext.tsx';
import { UZBEKISTAN_REGIONS } from '../../i18n/translations.ts';
import type { CarListing } from '../../types/index.ts';

interface UzbekistanMapViewProps {
  listings: CarListing[];
  onSelectCar: (car: CarListing) => void;
}

export const UzbekistanMapView: React.FC<UzbekistanMapViewProps> = ({ listings, onSelectCar }) => {
  const { formatPrice, t } = useLanguage();
  const [selectedRegion, setSelectedRegion] = useState<string>('Barchasi');
  const [activeCar, setActiveCar] = useState<CarListing | null>(listings[0] || null);

  const filteredListings = selectedRegion === 'Barchasi'
    ? listings
    : listings.filter(l => l.region.toLowerCase().includes(selectedRegion.toLowerCase()));

  // Regional hubs coordinates on our stylized interactive map
  const regionHubs: Record<string, { x: number; y: number }> = {
    'Toshkent shahri': { x: 74, y: 32 },
    'Toshkent viloyati': { x: 76, y: 35 },
    'Samarqand': { x: 55, y: 55 },
    'Buxoro': { x: 42, y: 58 },
    'Andijon': { x: 88, y: 38 },
    'Farg\'ona': { x: 84, y: 44 },
    'Namangan': { x: 82, y: 33 },
    'Qashqadaryo': { x: 48, y: 70 },
    'Surxondaryo': { x: 58, y: 82 },
    'Xorazm': { x: 25, y: 38 },
    'Navoiy': { x: 45, y: 40 },
    'Qoraqalpog\'iston Respublikasi': { x: 18, y: 24 }
  };

  return (
    <div className="py-8 space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-100 dark:bg-red-950/40 text-red-600 dark:text-red-400 text-xs font-bold mb-2">
            <MapPin className="w-3.5 h-3.5" />
            <span>Geo-joylashuv</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {t('mapTitle')}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            {t('approxLocation')}
          </p>
        </div>

        {/* Region selector pill */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
          <button
            onClick={() => setSelectedRegion('Barchasi')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition shrink-0 ${
              selectedRegion === 'Barchasi' ? 'bg-red-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
            }`}
          >
            Barchasi ({listings.length})
          </button>
          {['Toshkent shahri', 'Samarqand', 'Andijon', 'Farg\'ona', 'Buxoro'].map(reg => (
            <button
              key={reg}
              onClick={() => setSelectedRegion(reg)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition shrink-0 ${
                selectedRegion === reg ? 'bg-red-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
              }`}
            >
              {reg}
            </button>
          ))}
        </div>
      </div>

      {/* Main Map Box */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-white dark:bg-[#161a22] rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-xl overflow-hidden">
        {/* Stylized Visual Interactive SVG Map of Uzbekistan */}
        <div className="lg:col-span-8 relative aspect-[16/10] bg-slate-950 rounded-2xl overflow-hidden border border-slate-800 flex items-center justify-center p-4">
          {/* Subtle Grid Background */}
          <div className="absolute inset-0 bg-[radial-gradient(#ffffff0d_1px,transparent_1px)] [background-size:16px_16px]" />

          {/* SVG Map Silhouette of Uzbekistan */}
          <svg
            viewBox="0 0 1000 650"
            className="w-full h-full opacity-60 text-slate-800"
            fill="currentColor"
          >
            {/* Stylized representation path of Uzbekistan territory */}
            <path
              d="M 50,150 L 150,110 L 280,100 L 380,170 L 450,220 L 520,240 L 620,200 L 730,170 L 820,210 L 920,230 L 940,290 L 880,340 L 810,310 L 740,320 L 670,360 L 620,440 L 580,550 L 520,530 L 450,440 L 380,390 L 280,340 L 180,320 L 110,250 Z"
              fill="rgba(30, 41, 59, 0.6)"
              stroke="rgba(239, 68, 68, 0.4)"
              strokeWidth="2"
            />
          </svg>

          {/* Listing Pins on Map */}
          {filteredListings.map(car => {
            const hub = regionHubs[car.region] || { x: 50, y: 50 };
            // Small jitter based on ID so multiple cars in same region don't overlap completely
            const idHash = (car.id.charCodeAt(car.id.length - 1) % 5) - 2;
            const left = `${Math.min(92, Math.max(8, hub.x + idHash * 2))}%`;
            const top = `${Math.min(90, Math.max(10, hub.y + idHash * 1.8))}%`;
            const isSelected = activeCar?.id === car.id;

            return (
              <div
                key={car.id}
                style={{ left, top }}
                onClick={() => setActiveCar(car)}
                className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer group z-20"
              >
                <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-bold shadow-lg transition-all ${
                  isSelected
                    ? 'bg-red-600 text-white ring-4 ring-red-500/40 scale-110'
                    : 'bg-slate-900/90 hover:bg-red-600 text-white border border-slate-700'
                }`}>
                  <MapPin className="w-3 h-3 text-red-400 group-hover:text-white" />
                  <span className="font-mono">{formatPrice(car.priceUZS)}</span>
                </div>
              </div>
            );
          })}

          {/* Map legend */}
          <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-800 text-[10px] text-slate-400 flex items-center gap-3">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-red-600 inline-block" />
              Avtomobil joylashuvi
            </span>
            <span>Taxminiy radius: 3-5 km</span>
          </div>
        </div>

        {/* Selected Car Preview Card */}
        <div className="lg:col-span-4 flex flex-col justify-between p-4 rounded-2xl bg-slate-50 dark:bg-[#12151b] border border-slate-200/80 dark:border-slate-800">
          {activeCar ? (
            <div className="space-y-4">
              <div className="relative aspect-[16/10] rounded-xl overflow-hidden bg-slate-200">
                <img
                  src={activeCar.coverImage || activeCar.images[0]}
                  alt={activeCar.title}
                  className="w-full h-full object-cover"
                />
                <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-black/60 text-white font-mono text-[10px] backdrop-blur-sm">
                  {activeCar.year} yil
                </span>
              </div>

              <div>
                <span className="text-[11px] font-bold text-red-600 block uppercase">
                  {activeCar.region}
                </span>
                <h4 className="font-extrabold text-base text-slate-900 dark:text-white line-clamp-1 mt-0.5">
                  {activeCar.make} {activeCar.model}
                </h4>
                <div className="text-xl font-black text-red-600 font-mono mt-1">
                  {formatPrice(activeCar.priceUZS)}
                </div>
              </div>

              <div className="space-y-1.5 text-xs text-slate-500 pt-2 border-t border-slate-200 dark:border-slate-800">
                <div className="flex justify-between">
                  <span>Yurgani:</span>
                  <span className="font-bold text-slate-700 dark:text-slate-300">{activeCar.mileage} km</span>
                </div>
                <div className="flex justify-between">
                  <span>Yoqilg'i:</span>
                  <span className="font-bold text-slate-700 dark:text-slate-300 capitalize">{activeCar.fuelType}</span>
                </div>
                <div className="flex justify-between">
                  <span>Sotuvchi:</span>
                  <span className="font-bold text-slate-700 dark:text-slate-300">{activeCar.sellerName}</span>
                </div>
              </div>

              <button
                onClick={() => onSelectCar(activeCar)}
                className="w-full py-2.5 px-4 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md transition"
              >
                <span>Batafsil ma'lumot</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="text-center p-8 text-slate-400 text-xs">
              Xaritadagi nuqtani tanlang
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
