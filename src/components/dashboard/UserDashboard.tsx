import React, { useState, useEffect } from 'react';
import { 
  User as UserIcon, 
  Car, 
  Heart, 
  Bookmark, 
  Settings, 
  ShieldCheck, 
  PlusCircle, 
  Trash2, 
  Edit3, 
  Check, 
  AlertCircle,
  Building2,
  Calendar
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.tsx';
import { useLanguage } from '../../context/LanguageContext.tsx';
import { useFavorites } from '../../context/FavoritesContext.tsx';
import { api } from '../../services/api.ts';
import { UZBEKISTAN_REGIONS } from '../../i18n/translations.ts';
import type { CarListing, SavedSearch, FilterParams } from '../../types/index.ts';

interface UserDashboardProps {
  onOpenSellWizard: () => void;
  onSelectCar: (car: CarListing) => void;
  onExecuteSavedSearch: (params: FilterParams) => void;
}

export const UserDashboard: React.FC<UserDashboardProps> = ({
  onOpenSellWizard,
  onSelectCar,
  onExecuteSavedSearch
}) => {
  const { user, updateProfile } = useAuth();
  const { formatPrice, formatNumber, t } = useLanguage();
  const { favoriteListings, toggleFavorite } = useFavorites();

  const [activeTab, setActiveTab] = useState<'listings' | 'favorites' | 'searches' | 'settings'>('listings');
  const [myListings, setMyListings] = useState<CarListing[]>([]);
  const [savedSearches, setSavedSearches] = useState<SavedSearch[]>([]);
  const [loading, setLoading] = useState(true);

  // Profile Edit State
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [telegram, setTelegram] = useState(user?.telegram || '');
  const [region, setRegion] = useState(user?.region || 'Toshkent shahri');
  const [city, setCity] = useState(user?.city || 'Toshkent');
  const [dealerName, setDealerName] = useState(user?.dealerName || '');
  const [dealerAddress, setDealerAddress] = useState(user?.dealerAddress || '');
  const [profileSuccess, setProfileSuccess] = useState(false);

  const fetchMyData = () => {
    if (!user) return;
    setLoading(true);
    Promise.all([
      api.getListings({ userId: user.id }),
      api.getSavedSearches(user.id)
    ])
      .then(([listRes, searchRes]) => {
        setMyListings(listRes.listings);
        setSavedSearches(searchRes);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchMyData();
  }, [user]);

  const handleUpdateStatus = async (carId: string, status: 'active' | 'reserved' | 'sold') => {
    try {
      await api.updateListingStatus(carId, status);
      fetchMyData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteListing = async (carId: string) => {
    if (confirm('Ushbu e\'lonni o\'chirishni tasdiqlaysizmi?')) {
      try {
        await api.deleteListing(carId);
        fetchMyData();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleDeleteSearch = async (searchId: string) => {
    try {
      await api.deleteSavedSearch(searchId);
      setSavedSearches(prev => prev.filter(s => s.id !== searchId));
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateProfile({
        name,
        phone,
        telegram,
        region,
        city,
        dealerName,
        dealerAddress
      });
      setProfileSuccess(true);
      setTimeout(() => setProfileSuccess(false), 3000);
    } catch (err) {
      console.error(err);
    }
  };

  if (!user) {
    return (
      <div className="py-20 text-center space-y-4">
        <UserIcon className="w-12 h-12 text-slate-400 mx-auto" />
        <h2 className="text-xl font-bold">Iltimos, avval tizimga kiring</h2>
      </div>
    );
  }

  return (
    <div className="py-8 max-w-6xl mx-auto space-y-6">
      {/* User Header Profile Card */}
      <div className="bg-white dark:bg-[#161a22] rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-red-600 to-rose-600 text-white font-extrabold flex items-center justify-center text-2xl shadow-lg shadow-red-600/30">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
                {user.name}
              </h1>
              {user.isVerifiedDealer && (
                <span className="flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full border border-emerald-500/20">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Tasdiqlangan diler
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400 font-mono mt-0.5">{user.email} • {user.phone}</p>
            <p className="text-xs text-slate-500 mt-1">{user.city}, {user.region}</p>
          </div>
        </div>

        <button
          onClick={onOpenSellWizard}
          className="px-5 py-3 rounded-2xl bg-red-600 hover:bg-red-500 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-red-600/30 active:scale-95 transition"
        >
          <PlusCircle className="w-4 h-4" />
          <span>{t('sellCarBtn')}</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveTab('listings')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition ${
            activeTab === 'listings' ? 'bg-red-600 text-white shadow-md' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Car className="w-4 h-4" />
          <span>Mening e'lonlarim ({myListings.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('favorites')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition ${
            activeTab === 'favorites' ? 'bg-red-600 text-white shadow-md' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Heart className="w-4 h-4" />
          <span>{t('favorites')} ({favoriteListings.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('searches')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition ${
            activeTab === 'searches' ? 'bg-red-600 text-white shadow-md' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Bookmark className="w-4 h-4" />
          <span>Saqlangan qidiruvlar ({savedSearches.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition ${
            activeTab === 'settings' ? 'bg-red-600 text-white shadow-md' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Settings className="w-4 h-4" />
          <span>Profil sozlamalari</span>
        </button>
      </div>

      {/* Tab 1: My Listings */}
      {activeTab === 'listings' && (
        <div className="space-y-4">
          {myListings.length === 0 ? (
            <div className="bg-white dark:bg-[#161a22] rounded-3xl p-12 text-center border border-slate-200 dark:border-slate-800 space-y-3">
              <Car className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto" />
              <h3 className="font-bold text-base text-slate-700 dark:text-slate-300">
                Sizda hali e'lonlar mavjud emas
              </h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Avtomobilingizni bir necha daqiqada bepul joylashtiring va xaridorlarni toping.
              </p>
              <button
                onClick={onOpenSellWizard}
                className="mt-2 px-5 py-2.5 rounded-xl bg-red-600 text-white text-xs font-bold"
              >
                + E'lon berish
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {myListings.map(car => (
                <div
                  key={car.id}
                  className="bg-white dark:bg-[#161a22] rounded-2xl p-4 sm:p-5 border border-slate-200/80 dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-4 cursor-pointer" onClick={() => onSelectCar(car)}>
                    <img
                      src={car.coverImage || car.images[0]}
                      alt={car.title}
                      className="w-24 h-18 object-cover rounded-xl shrink-0"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                          {car.make} {car.model} ({car.year})
                        </h4>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                          car.status === 'sold'
                            ? 'bg-slate-800 text-white'
                            : car.status === 'reserved'
                            ? 'bg-amber-500 text-white'
                            : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400'
                        }`}>
                          {car.status === 'sold' ? t('sold') : car.status === 'reserved' ? t('reserved') : t('active')}
                        </span>
                      </div>
                      <div className="text-base font-extrabold text-red-600 font-mono mt-1">
                        {formatPrice(car.priceUZS)}
                      </div>
                      <p className="text-[11px] text-slate-400">
                        {formatNumber(car.mileage)} km • {car.city} • {car.viewsCount} ko'rish
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-end pt-3 sm:pt-0 border-t sm:border-0 border-slate-100 dark:border-slate-800">
                    <button
                      onClick={() => handleUpdateStatus(car.id, car.status === 'sold' ? 'active' : 'sold')}
                      className="px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800"
                    >
                      {car.status === 'sold' ? 'Qayta faollashtirish' : 'Sotildi'}
                    </button>
                    <button
                      onClick={() => handleUpdateStatus(car.id, car.status === 'reserved' ? 'active' : 'reserved')}
                      className="px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800"
                    >
                      {car.status === 'reserved' ? 'Bandlikdan chiqarish' : 'Band qilish'}
                    </button>
                    <button
                      onClick={() => handleDeleteListing(car.id)}
                      className="p-2 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40"
                      title="O'chirish"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Favorites */}
      {activeTab === 'favorites' && (
        <div className="space-y-4">
          {favoriteListings.length === 0 ? (
            <div className="bg-white dark:bg-[#161a22] rounded-3xl p-12 text-center border border-slate-200 dark:border-slate-800">
              <Heart className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
              <p className="text-sm font-bold text-slate-600 dark:text-slate-400">
                Sevimlilar ro'yxati hozircha bo'sh
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {favoriteListings.map(c => (
                <div
                  key={c.id}
                  onClick={() => onSelectCar(c)}
                  className="p-4 rounded-2xl bg-white dark:bg-[#161a22] border border-slate-200 dark:border-slate-800 hover:border-red-500 transition cursor-pointer flex flex-col justify-between"
                >
                  <img
                    src={c.coverImage || c.images[0]}
                    alt={c.title}
                    className="w-full h-36 object-cover rounded-xl mb-3"
                  />
                  <div>
                    <h4 className="font-bold text-sm text-slate-900 dark:text-white line-clamp-1">
                      {c.make} {c.model}
                    </h4>
                    <span className="text-base font-black text-red-600 font-mono mt-1 block">
                      {formatPrice(c.priceUZS)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between mt-3 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-400">
                    <span>{c.city}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(c);
                      }}
                      className="text-red-500 hover:text-red-600 font-bold"
                    >
                      O'chirish
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Saved Searches */}
      {activeTab === 'searches' && (
        <div className="space-y-4">
          {savedSearches.length === 0 ? (
            <div className="bg-white dark:bg-[#161a22] rounded-3xl p-12 text-center border border-slate-200 dark:border-slate-800">
              <Bookmark className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
              <p className="text-sm font-bold text-slate-600 dark:text-slate-400">
                Saqlangan qidiruvlar mavjud emas
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {savedSearches.map(s => (
                <div
                  key={s.id}
                  className="p-5 rounded-2xl bg-white dark:bg-[#161a22] border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4"
                >
                  <div>
                    <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                      {s.name}
                    </h4>
                    <p className="text-xs text-slate-400 mt-1">
                      {s.params.make || 'Barcha'} {s.params.region ? `• ${s.params.region}` : ''}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onExecuteSavedSearch(s.params)}
                      className="px-3 py-1.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs shadow"
                    >
                      Qidirish
                    </button>
                    <button
                      onClick={() => handleDeleteSearch(s.id)}
                      className="p-1.5 text-slate-400 hover:text-red-500"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 4: Profile Settings & Dealer Status */}
      {activeTab === 'settings' && (
        <div className="bg-white dark:bg-[#161a22] rounded-3xl p-6 sm:p-10 border border-slate-200 dark:border-slate-800 shadow-xl max-w-2xl">
          <form onSubmit={handleSaveProfile} className="space-y-4">
            <h3 className="font-extrabold text-base text-slate-900 dark:text-white mb-4">
              Shaxsiy ma'lumotlar
            </h3>

            {profileSuccess && (
              <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 text-xs font-bold flex items-center gap-2">
                <Check className="w-4 h-4" />
                <span>Profil muvaffaqiyatli yangilandi!</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Ism va familiya
              </label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-red-500 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Telefon raqam
                </label>
                <input
                  type="text"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-red-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Telegram username
                </label>
                <input
                  type="text"
                  value={telegram}
                  onChange={e => setTelegram(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-red-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Viloyat
                </label>
                <select
                  value={region}
                  onChange={e => setRegion(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-sm font-semibold focus:ring-2 focus:ring-red-500 focus:outline-none"
                >
                  {UZBEKISTAN_REGIONS.map(reg => (
                    <option key={reg} value={reg}>{reg}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Shahar / Tuman
                </label>
                <input
                  type="text"
                  value={city}
                  onChange={e => setCity(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-red-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Dealer Profile Information */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-4">
              <h4 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <Building2 className="w-4 h-4 text-red-500" />
                Avtosalon / Diler ma'lumotlari
              </h4>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Avtosalon nomi
                </label>
                <input
                  type="text"
                  value={dealerName}
                  placeholder="Masalan: Samarqand Premium Auto MCHJ"
                  onChange={e => setDealerName(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-red-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Showroom manzili
                </label>
                <input
                  type="text"
                  value={dealerAddress}
                  placeholder="Masalan: Mirzo Ulug'bek ko'chasi 42-uy"
                  onChange={e => setDealerAddress(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-red-500 focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              className="mt-4 px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs shadow-md transition"
            >
              Saqlash
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
