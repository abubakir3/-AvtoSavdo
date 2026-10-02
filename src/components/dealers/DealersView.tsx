import React from 'react';
import { Building2, MapPin, Phone, Send, ShieldCheck, Car, ExternalLink } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext.tsx';
import type { CarListing } from '../../types/index.ts';

interface DealersViewProps {
  listings: CarListing[];
  onSelectCar: (car: CarListing) => void;
  onFilterByDealer: (dealerName: string) => void;
}

export const DealersView: React.FC<DealersViewProps> = ({ listings, onSelectCar, onFilterByDealer }) => {
  const { t, formatPrice } = useLanguage();

  const dealersList = [
    {
      id: 'dealer-1',
      name: 'Samarqand Premium Auto',
      region: 'Samarqand',
      address: 'Samarqand sh., Mirzo Ulug\'bek ko\'chasi, 42-uy',
      phone: '+998 93 333 44 55',
      telegram: '@sam_premium_auto',
      brands: ['BYD', 'Kia', 'Toyota', 'Chevrolet', 'BMW'],
      rating: '4.9',
      verified: true,
      description: 'Samarqanddagi eng yirik avtosalon. BYD, Kia va boshqa premium avtomobillarni rasmiy kafolat bilan taqdim etamiz. Kredit va lizing mavjud.'
    },
    {
      id: 'dealer-2',
      name: 'Tashkent Auto Gallery',
      region: 'Toshkent shahri',
      address: 'Toshkent sh., Mirobod tumani, Shahrisabz ko\'chasi, 15',
      phone: '+998 71 200 44 88',
      telegram: '@tashkent_autogallery',
      brands: ['Chevrolet', 'Tesla', 'Mercedes-Benz', 'Toyota'],
      rating: '4.8',
      verified: true,
      description: 'Rasmiy dilerlik markazi. Yangi Chevrolet va xorijiy elektroavtomobillar doimiy mavjud.'
    },
    {
      id: 'dealer-3',
      name: 'Vodiy Motors Andijon',
      region: 'Andijon',
      address: 'Andijon sh., Bobur shox ko\'chasi, 88',
      phone: '+998 90 555 12 34',
      telegram: '@vodiy_motors_uz',
      brands: ['Chevrolet', 'Chery', 'Kia'],
      rating: '4.7',
      verified: true,
      description: 'Farg\'ona vodiysidagi ishonchli avtomobil markazi. Damas, Cobalt, Gentra va Tracker avtomobillari tezkor yetkazib beriladi.'
    }
  ];

  return (
    <div className="py-8 max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-100 dark:bg-red-950/40 text-red-600 dark:text-red-400 text-xs font-bold mb-2">
          <Building2 className="w-3.5 h-3.5" />
          <span>Rasmiy avtosalonlar</span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          O'zbekistondagi rasmiy avtosalonlar va dilerlar
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 max-w-xl mt-1">
          Kafolatlangan avtomobillar, kredit va lizing xizmatlari bilan rasmiy savdo markazlari
        </p>
      </div>

      {/* Dealer Cards */}
      <div className="space-y-6">
        {dealersList.map(dealer => {
          const dealerCars = listings.filter(l => 
            l.dealerName?.toLowerCase().includes(dealer.name.toLowerCase()) || 
            l.sellerName.toLowerCase().includes(dealer.name.toLowerCase()) ||
            l.region.toLowerCase() === dealer.region.toLowerCase()
          ).slice(0, 3);

          return (
            <div
              key={dealer.id}
              className="bg-white dark:bg-[#161a22] rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-xl space-y-6"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-slate-900 to-slate-800 text-white font-extrabold flex items-center justify-center text-xl shadow-md border border-slate-700">
                    <Building2 className="w-7 h-7 text-red-500" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
                        {dealer.name}
                      </h3>
                      {dealer.verified && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full border border-emerald-500/20">
                          <ShieldCheck className="w-3.5 h-3.5" />
                          Rasmiy tasdiqlangan
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-1">
                      <MapPin className="w-3.5 h-3.5 text-red-500" />
                      {dealer.address}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href={`tel:${dealer.phone}`}
                    className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center gap-1.5 transition"
                  >
                    <Phone className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{dealer.phone}</span>
                  </a>
                  <a
                    href={`https://t.me/${dealer.telegram.replace('@', '')}`}
                    target="_blank"
                    rel="noreferrer"
                    className="px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-white text-xs font-bold flex items-center gap-1.5 transition"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Telegram</span>
                  </a>
                </div>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {dealer.description}
              </p>

              {/* Brands sold */}
              <div className="flex flex-wrap items-center gap-2 pt-2">
                <span className="text-xs font-bold text-slate-400">Markalar:</span>
                {dealer.brands.map(b => (
                  <span
                    key={b}
                    className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold"
                  >
                    {b}
                  </span>
                ))}
              </div>

              {/* Showroom Cars Preview */}
              {dealerCars.length > 0 && (
                <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                    Avtosalondagi mashinalar:
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {dealerCars.map(c => (
                      <div
                        key={c.id}
                        onClick={() => onSelectCar(c)}
                        className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 hover:border-red-500 cursor-pointer transition flex items-center gap-3"
                      >
                        <img
                          src={c.coverImage || c.images[0]}
                          alt={c.title}
                          className="w-14 h-14 rounded-xl object-cover shrink-0"
                        />
                        <div className="min-w-0">
                          <h5 className="font-bold text-xs text-slate-900 dark:text-white truncate">
                            {c.make} {c.model}
                          </h5>
                          <div className="text-xs font-black text-red-600 font-mono mt-0.5">
                            {formatPrice(c.priceUZS)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
