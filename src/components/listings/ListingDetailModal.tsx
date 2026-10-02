import React, { useState, useEffect } from 'react';
import { 
  X, 
  Heart, 
  Scale, 
  Share2, 
  Flag, 
  Phone, 
  Send, 
  MessageSquare, 
  MapPin, 
  Gauge, 
  Fuel, 
  Calendar, 
  ShieldCheck, 
  AlertTriangle, 
  Check, 
  Sparkles, 
  Layers, 
  TrendingDown, 
  Building2, 
  Calculator,
  ChevronLeft,
  ChevronRight,
  Eye,
  CheckCircle2,
  Trash2,
  CheckSquare
} from 'lucide-react';
import type { CarListing } from '../../types/index.ts';
import { useLanguage } from '../../context/LanguageContext.tsx';
import { useAuth } from '../../context/AuthContext.tsx';
import { useFavorites } from '../../context/FavoritesContext.tsx';
import { useCompare } from '../../context/CompareContext.tsx';
import { api } from '../../services/api.ts';

interface ListingDetailModalProps {
  carId: string;
  onClose: () => void;
  onOpenChat: (listing: CarListing) => void;
  onOpenReport: (listing: CarListing) => void;
  onSelectCar: (car: CarListing) => void;
  onListingUpdated?: () => void;
}

export const ListingDetailModal: React.FC<ListingDetailModalProps> = ({
  carId,
  onClose,
  onOpenChat,
  onOpenReport,
  onSelectCar,
  onListingUpdated
}) => {
  const { formatPrice, formatNumber, t, currency } = useLanguage();
  const { user, isAdmin } = useAuth();
  const { isFavorite, toggleFavorite } = useFavorites();
  const { isComparing, addToCompare } = useCompare();

  const [car, setCar] = useState<CarListing | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [phoneRevealed, setPhoneRevealed] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [marketValuation, setMarketValuation] = useState<{
    averagePriceUZS: number;
    sampleSize: number;
    minPriceUZS: number;
    maxPriceUZS: number;
  } | null>(null);
  const [similarCars, setSimilarCars] = useState<CarListing[]>([]);

  // Loan calculator quick state
  const [downPaymentPercent, setDownPaymentPercent] = useState(25);
  const [loanTermMonths, setLoanTermMonths] = useState(36);
  const [interestRatePercent, setInterestRatePercent] = useState(24);

  useEffect(() => {
    setLoading(true);
    setPhoneRevealed(false);
    setActiveImageIndex(0);
    api.getListingById(carId)
      .then(res => {
        setCar(res);
        if (res.marketValuation) setMarketValuation(res.marketValuation);
        if (res.similarCars) setSimilarCars(res.similarCars);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [carId]);

  if (loading || !car) {
    return (
      <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
        <div className="bg-white dark:bg-[#161a22] rounded-3xl p-8 max-w-sm w-full text-center space-y-4">
          <div className="w-10 h-10 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm font-bold text-slate-700 dark:text-slate-300">{t('loading')}</p>
        </div>
      </div>
    );
  }

  const isOwner = user && user.id === car.userId;
  const canManage = isOwner || isAdmin;
  const fav = isFavorite(car.id);
  const comparing = isComparing(car.id);

  const images = car.images && car.images.length > 0 ? car.images : [car.coverImage];

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleStatusChange = async (newStatus: 'active' | 'reserved' | 'sold') => {
    try {
      const updated = await api.updateListingStatus(car.id, newStatus);
      setCar(updated);
      if (onListingUpdated) onListingUpdated();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async () => {
    if (confirm('Ushbu e\'lonni o\'chirishni tasdiqlaysizmi?')) {
      try {
        await api.deleteListing(car.id);
        if (onListingUpdated) onListingUpdated();
        onClose();
      } catch (err) {
        console.error(err);
      }
    }
  };

  // Loan calculation for this car
  const downPaymentAmount = Math.round(car.priceUZS * (downPaymentPercent / 100));
  const loanPrincipal = car.priceUZS - downPaymentAmount;
  const monthlyInterestRate = (interestRatePercent / 100) / 12;
  const monthlyPayment = loanPrincipal > 0
    ? Math.round((loanPrincipal * monthlyInterestRate * Math.pow(1 + monthlyInterestRate, loanTermMonths)) / (Math.pow(1 + monthlyInterestRate, loanTermMonths) - 1))
    : 0;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex justify-center p-2 sm:p-4 lg:p-6 animate-in fade-in duration-200">
      <div className="relative bg-white dark:bg-[#13161c] rounded-3xl w-full max-w-5xl shadow-2xl border border-slate-200 dark:border-slate-800 my-auto overflow-hidden">
        {/* Top Sticky Bar */}
        <div className="sticky top-0 z-30 flex items-center justify-between px-6 py-4 bg-white/95 dark:bg-[#13161c]/95 backdrop-blur-md border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 uppercase font-semibold">
              {car.make} &gt; {car.model} &gt; {car.year}
            </span>
            {car.status === 'sold' && (
              <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-slate-800 text-white">
                {t('sold')}
              </span>
            )}
            {car.status === 'reserved' && (
              <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-amber-500 text-white">
                {t('reserved')}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => toggleFavorite(car)}
              className={`p-2 rounded-xl transition ${
                fav ? 'bg-red-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-red-600'
              }`}
              title="Sevimlilarga qo'shish"
            >
              <Heart className={`w-4 h-4 ${fav ? 'fill-white' : ''}`} />
            </button>

            <button
              onClick={() => addToCompare(car)}
              className={`p-2 rounded-xl transition ${
                comparing ? 'bg-blue-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-blue-600'
              }`}
              title="Taqqoslash"
            >
              <Scale className="w-4 h-4" />
            </button>

            <button
              onClick={handleShare}
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 transition relative"
              title="Ulashish"
            >
              <Share2 className="w-4 h-4" />
              {copiedLink && (
                <span className="absolute -bottom-8 right-0 bg-black text-white text-[10px] px-2 py-1 rounded shadow-lg whitespace-nowrap">
                  {t('linkCopied')}
                </span>
              )}
            </button>

            <button
              onClick={() => onOpenReport(car)}
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-red-500 transition"
              title="Shikoyat qilish"
            >
              <Flag className="w-4 h-4" />
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-red-50 dark:hover:bg-red-950/40 hover:text-red-600 transition ml-2"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 lg:p-8 space-y-8 max-h-[82vh] overflow-y-auto">
          {/* Top Title & Price Grid */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-2">
                {car.isFeatured && (
                  <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-amber-500 text-white font-bold text-xs uppercase">
                    <Sparkles className="w-3.5 h-3.5" /> VIP E'lon
                  </span>
                )}
                {car.paintCondition === 'clean' && (
                  <span className="px-2.5 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-xs border border-emerald-500/20">
                    Kraskasi toza
                  </span>
                )}
                <span className="text-xs text-slate-400 font-mono">
                  ID: #{car.id.replace('car-', '')}
                </span>
                <span className="flex items-center gap-1 text-xs text-slate-400">
                  <Eye className="w-3.5 h-3.5" /> {car.viewsCount} marta ko'rildi
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                {car.title}
              </h1>

              <div className="flex items-center gap-3 mt-2 text-sm text-slate-500 dark:text-slate-400">
                <span className="flex items-center gap-1">
                  <MapPin className="w-4 h-4 text-red-500" />
                  {car.city}, {car.region}
                </span>
                <span>•</span>
                <span>{new Date(car.createdAt).toLocaleDateString()}</span>
              </div>
            </div>

            {/* Price Box */}
            <div className="lg:text-right p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/60">
              <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white font-mono tracking-tight text-red-600 dark:text-red-500">
                {formatPrice(car.priceUZS)}
              </div>
              <div className="text-xs text-slate-400 font-mono mt-0.5">
                {currency === 'UZS' ? `Taxminan $${formatNumber(car.priceUSD)}` : `${formatNumber(car.priceUZS)} so'm`}
                {car.isNegotiable ? ' (Kelishiladi)' : ' (Qat\'iy narx)'}
              </div>

              {/* Data-backed Price Evaluation Badge */}
              {marketValuation && marketValuation.sampleSize > 1 && (
                <div className="mt-2 inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>
                    Bozor bahosi: ~{formatPrice(marketValuation.averagePriceUZS)} ({marketValuation.sampleSize} ta e'lon tahlili)
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Photo Gallery & Lightbox */}
          <div className="space-y-3">
            <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden bg-slate-900">
              <img
                src={images[activeImageIndex]}
                alt={car.title}
                className="w-full h-full object-contain"
              />

              {/* Navigation arrows */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={() => setActiveImageIndex((activeImageIndex - 1 + images.length) % images.length)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/60 hover:bg-black/80 text-white backdrop-blur-sm transition"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button
                    onClick={() => setActiveImageIndex((activeImageIndex + 1) % images.length)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/60 hover:bg-black/80 text-white backdrop-blur-sm transition"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                  <div className="absolute bottom-3 right-3 bg-black/70 backdrop-blur-md px-3 py-1 rounded-full text-white text-xs font-mono">
                    {activeImageIndex + 1} / {images.length}
                  </div>
                </>
              )}
            </div>

            {/* Thumbnails strip */}
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`relative w-24 h-16 rounded-xl overflow-hidden shrink-0 border-2 transition ${
                      activeImageIndex === idx ? 'border-red-600 scale-105' : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="thumbnail" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Main Specs Matrix */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800">
              <span className="text-[11px] text-slate-400 font-medium block mb-1">Yurgan masofasi</span>
              <div className="flex items-center gap-2 font-bold text-sm sm:text-base text-slate-900 dark:text-white">
                <Gauge className="w-4 h-4 text-red-500" />
                <span>{formatNumber(car.mileage)} km</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800">
              <span className="text-[11px] text-slate-400 font-medium block mb-1">Yoqilg'i turi</span>
              <div className="flex items-center gap-2 font-bold text-sm sm:text-base text-slate-900 dark:text-white">
                <Fuel className="w-4 h-4 text-red-500" />
                <span className="capitalize">{car.fuelType === 'cng' ? 'Metan Gaz' : car.fuelType === 'electric' ? 'Elektr' : car.fuelType === 'hybrid' ? 'Gibrid' : 'Benzin'}</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800">
              <span className="text-[11px] text-slate-400 font-medium block mb-1">Uzatma qutisi</span>
              <div className="flex items-center gap-2 font-bold text-sm sm:text-base text-slate-900 dark:text-white">
                <Layers className="w-4 h-4 text-red-500" />
                <span className="capitalize">{car.transmission === 'automatic' ? 'Avtomat' : 'Mexanika'}</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800">
              <span className="text-[11px] text-slate-400 font-medium block mb-1">Kuzov va rang</span>
              <div className="flex items-center gap-2 font-bold text-sm sm:text-base text-slate-900 dark:text-white">
                <Calendar className="w-4 h-4 text-red-500" />
                <span className="capitalize truncate">{car.color}</span>
              </div>
            </div>
          </div>

          {/* Two Columns: Details/Description + Seller Card */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left 2 Cols: Description & Full Technical Specs */}
            <div className="lg:col-span-2 space-y-6">
              {/* Description */}
              <div className="space-y-3">
                <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                  {t('description')}
                </h3>
                <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/30 border border-slate-200/80 dark:border-slate-800 text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                  {car.description}
                </div>
              </div>

              {/* Full Specs Table */}
              <div className="space-y-3">
                <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                  {t('carSpecs')}
                </h3>
                <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 overflow-hidden divide-y divide-slate-100 dark:divide-slate-800/60 text-xs sm:text-sm">
                  <div className="flex justify-between p-3.5 bg-slate-50/50 dark:bg-slate-800/20">
                    <span className="text-slate-500">{t('make')}</span>
                    <span className="font-bold text-slate-900 dark:text-white">{car.make}</span>
                  </div>
                  <div className="flex justify-between p-3.5">
                    <span className="text-slate-500">{t('model')}</span>
                    <span className="font-bold text-slate-900 dark:text-white">{car.model}</span>
                  </div>
                  <div className="flex justify-between p-3.5 bg-slate-50/50 dark:bg-slate-800/20">
                    <span className="text-slate-500">{t('year')}</span>
                    <span className="font-bold text-slate-900 dark:text-white">{car.year}</span>
                  </div>
                  <div className="flex justify-between p-3.5">
                    <span className="text-slate-500">{t('engineVolume')}</span>
                    <span className="font-bold text-slate-900 dark:text-white">{car.engineVolume ? `${car.engineVolume} L` : 'Elektr motor'}</span>
                  </div>
                  <div className="flex justify-between p-3.5 bg-slate-50/50 dark:bg-slate-800/20">
                    <span className="text-slate-500">{t('paintCondition')}</span>
                    <span className="font-bold text-slate-900 dark:text-white">{car.paintCondition === 'clean' ? 'Kraska toza (bo\'yoq tegmagan)' : 'Qisman petno/bo\'yalgan'}</span>
                  </div>
                  {car.vin && (
                    <div className="flex justify-between p-3.5">
                      <span className="text-slate-500">VIN / Kuzov raqami</span>
                      <span className="font-mono text-slate-700 dark:text-slate-300">{car.vin}</span>
                    </div>
                  )}
                  <div className="flex justify-between p-3.5 bg-slate-50/50 dark:bg-slate-800/20">
                    <span className="text-slate-500">{t('drivetrain')}</span>
                    <span className="font-bold text-slate-900 dark:text-white uppercase">{car.drivetrain}</span>
                  </div>
                </div>
              </div>

              {/* Equipment & Features */}
              {car.features && car.features.length > 0 && (
                <div className="space-y-3">
                  <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                    {t('features')}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {car.features.map(f => (
                      <span
                        key={f}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-semibold"
                      >
                        <Check className="w-3.5 h-3.5 text-emerald-500" />
                        {f}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Loan Calculator Preview Widget for this Car */}
              <div className="p-6 rounded-3xl bg-gradient-to-br from-slate-900 to-[#181d26] text-white space-y-4 border border-slate-800">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Calculator className="w-5 h-5 text-red-500" />
                    <h3 className="font-extrabold text-base">Ushbu avtomobil uchun avtokredit</h3>
                  </div>
                  <span className="text-xs text-red-400 font-semibold">Tezkor hisob</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div>
                    <label className="block text-slate-400 mb-1">Boshlang'ich to'lov: {downPaymentPercent}%</label>
                    <input
                      type="range"
                      min="15"
                      max="50"
                      step="5"
                      value={downPaymentPercent}
                      onChange={e => setDownPaymentPercent(Number(e.target.value))}
                      className="w-full accent-red-600"
                    />
                    <div className="text-white font-mono font-bold mt-1">
                      {formatPrice(downPaymentAmount)}
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-400 mb-1">Muddati: {loanTermMonths} oy</label>
                    <input
                      type="range"
                      min="12"
                      max="60"
                      step="12"
                      value={loanTermMonths}
                      onChange={e => setLoanTermMonths(Number(e.target.value))}
                      className="w-full accent-red-600"
                    />
                    <div className="text-white font-mono font-bold mt-1">
                      {loanTermMonths / 12} yil
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-white/10 text-center">
                    <span className="text-[11px] text-slate-300 block">Oylik to'lov:</span>
                    <span className="text-lg font-black text-emerald-400 font-mono">
                      {formatPrice(monthlyPayment)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Seller Profile & Contact Box */}
            <div className="space-y-6">
              {/* Seller Card */}
              <div className="p-6 rounded-3xl bg-slate-50 dark:bg-[#181c24] border border-slate-200/80 dark:border-slate-800 space-y-5">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-red-600 to-rose-600 text-white font-bold flex items-center justify-center text-lg shadow-md">
                    {car.sellerName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h4 className="font-bold text-slate-900 dark:text-white text-base">
                        {car.sellerName}
                      </h4>
                      {car.isVerifiedSeller && (
                        <span title="Tasdiqlangan">
                          <ShieldCheck className="w-4 h-4 text-emerald-500" />
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-slate-500 block">
                      {car.sellerType === 'dealer' ? 'Rasmiy avtosalon' : 'Xususiy sotuvchi'}
                    </span>
                  </div>
                </div>

                {/* Contact Actions */}
                <div className="space-y-2.5">
                  {/* Phone reveal */}
                  {phoneRevealed ? (
                    <a
                      href={`tel:${car.sellerPhone}`}
                      className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/25 transition"
                    >
                      <Phone className="w-4 h-4" />
                      <span>{car.sellerPhone}</span>
                    </a>
                  ) : (
                    <button
                      onClick={() => setPhoneRevealed(true)}
                      className="w-full py-3 px-4 rounded-xl bg-slate-900 dark:bg-white hover:bg-slate-800 dark:hover:bg-slate-100 text-white dark:text-slate-900 font-bold text-sm flex items-center justify-center gap-2 transition"
                    >
                      <Phone className="w-4 h-4" />
                      <span>{t('showPhone')}</span>
                    </button>
                  )}

                  {/* Telegram Link */}
                  {car.sellerTelegram && (
                    <a
                      href={`https://t.me/${car.sellerTelegram.replace('@', '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-3 px-4 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md transition"
                    >
                      <Send className="w-4 h-4" />
                      <span>{t('writeTelegram')}</span>
                    </a>
                  )}

                  {/* Chat in App */}
                  <button
                    onClick={() => {
                      onOpenChat(car);
                      onClose();
                    }}
                    className="w-full py-3 px-4 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold text-sm flex items-center justify-center gap-2 transition"
                  >
                    <MessageSquare className="w-4 h-4 text-red-500" />
                    <span>{t('chatWithSeller')}</span>
                  </button>
                </div>

                {/* Safety pledge notice */}
                <div className="pt-4 border-t border-slate-200 dark:border-slate-800 text-[11px] text-slate-500 space-y-1">
                  <div className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400 font-semibold">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>Eslatma:</span>
                  </div>
                  <p>
                    Avtomobilni ko'rmasdan oldindan kartaga pul o'tkazmang (zalat bermang).
                  </p>
                </div>
              </div>

              {/* Owner / Admin Management Bar */}
              {canManage && (
                <div className="p-5 rounded-3xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/40 space-y-3">
                  <h4 className="font-bold text-xs uppercase tracking-wider text-red-700 dark:text-red-400">
                    E'lonni boshqarish ({isOwner ? 'Sizning e\'loningiz' : 'Admin'})
                  </h4>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => handleStatusChange(car.status === 'sold' ? 'active' : 'sold')}
                      className="py-2 px-3 rounded-xl bg-slate-900 text-white text-xs font-bold transition"
                    >
                      {car.status === 'sold' ? 'Qayta sotuvga' : 'Sotildi deb belgilash'}
                    </button>
                    <button
                      onClick={() => handleStatusChange(car.status === 'reserved' ? 'active' : 'reserved')}
                      className="py-2 px-3 rounded-xl bg-amber-600 text-white text-xs font-bold transition"
                    >
                      {car.status === 'reserved' ? 'Bandlikni bekor qilish' : 'Band qilish'}
                    </button>
                  </div>
                  <button
                    onClick={handleDelete}
                    className="w-full py-2 px-3 rounded-xl border border-red-300 dark:border-red-800 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/30 text-xs font-bold flex items-center justify-center gap-1 transition"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    E'lonni butunlay o'chirish
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Similar Cars Section */}
          {similarCars.length > 0 && (
            <div className="pt-8 border-t border-slate-100 dark:border-slate-800 space-y-4">
              <h3 className="font-extrabold text-lg text-slate-900 dark:text-white">
                {t('similarCars')}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {similarCars.map(sim => (
                  <div
                    key={sim.id}
                    onClick={() => {
                      onSelectCar(sim);
                    }}
                    className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 cursor-pointer hover:border-red-500 transition"
                  >
                    <img
                      src={sim.coverImage || sim.images[0]}
                      alt={sim.title}
                      className="w-full h-28 object-cover rounded-xl mb-2"
                    />
                    <h5 className="font-bold text-xs text-slate-900 dark:text-white truncate">
                      {sim.make} {sim.model} ({sim.year})
                    </h5>
                    <div className="font-black text-sm text-red-600 dark:text-red-400 font-mono mt-1">
                      {formatPrice(sim.priceUZS)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
