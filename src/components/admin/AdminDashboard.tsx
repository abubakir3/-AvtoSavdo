import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  CheckCircle, 
  XCircle, 
  Trash2, 
  Users, 
  AlertTriangle, 
  BarChart3, 
  Building2, 
  Car,
  FileCheck,
  Check
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.tsx';
import { useLanguage } from '../../context/LanguageContext.tsx';
import { api } from '../../services/api.ts';
import type { CarListing, User, Report, PlatformStats } from '../../types/index.ts';

export const AdminDashboard: React.FC<{ onSelectCar: (car: CarListing) => void }> = ({ onSelectCar }) => {
  const { user, isAdmin } = useAuth();
  const { formatPrice, formatNumber, t } = useLanguage();

  const [activeTab, setActiveTab] = useState<'moderation' | 'users' | 'reports' | 'stats'>('moderation');
  const [listings, setListings] = useState<CarListing[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [reports, setReports] = useState<Report[]>([]);
  const [stats, setStats] = useState<PlatformStats | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchAdminData = () => {
    setLoading(true);
    Promise.all([
      api.getListings({ limit: 100 }),
      api.getAdminUsers(),
      api.getAdminReports(),
      api.getStats()
    ])
      .then(([listingsRes, usersRes, reportsRes, statsRes]) => {
        setListings(listingsRes.listings);
        setUsers(usersRes);
        setReports(reportsRes);
        setStats(statsRes);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleModerate = async (carId: string, status: 'active' | 'rejected') => {
    try {
      await api.updateListingStatus(carId, status);
      fetchAdminData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleDealer = async (userId: string) => {
    try {
      await api.toggleDealerStatus(userId);
      fetchAdminData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleResolveReport = async (reportId: string, action: 'resolve' | 'dismiss') => {
    try {
      await api.resolveReport(reportId, action);
      fetchAdminData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteListing = async (carId: string) => {
    if (confirm('E\'lonni o\'chirishni xohlaysizmi?')) {
      await api.deleteListing(carId);
      fetchAdminData();
    }
  };

  if (!isAdmin) {
    return (
      <div className="py-20 text-center space-y-4">
        <Shield className="w-12 h-12 text-red-500 mx-auto" />
        <h2 className="text-xl font-bold">Ushbu bo'lim faqat administratorlar uchun</h2>
        <p className="text-xs text-slate-400">
          Demo uchun yuqoridagi 'Demo rol' panelidan Admin tugmasini bosing.
        </p>
      </div>
    );
  }

  return (
    <div className="py-8 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-950 via-slate-900 to-[#12161f] text-white rounded-3xl p-6 sm:p-8 border border-purple-800/40 shadow-xl flex items-center justify-between">
        <div>
          <span className="flex items-center gap-1.5 text-xs font-bold text-purple-400 uppercase tracking-wider mb-1">
            <Shield className="w-4 h-4" />
            Boshqaruv markazi
          </span>
          <h1 className="text-2xl sm:text-3xl font-black">
            {t('adminTitle')}
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            E'lonlarni tekshirish, foydalanuvchilar va shikoyatlarni boshqarish
          </p>
        </div>

        <div className="hidden sm:flex items-center gap-4 text-xs font-mono">
          <div className="px-3 py-1.5 rounded-xl bg-white/10 text-center">
            <span className="text-[10px] text-slate-400 block">Jami e'lonlar</span>
            <span className="font-bold text-base">{listings.length}</span>
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-white/10 text-center">
            <span className="text-[10px] text-slate-400 block">Shikoyatlar</span>
            <span className="font-bold text-base text-red-400">{reports.filter(r => r.status === 'pending').length}</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveTab('moderation')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition ${
            activeTab === 'moderation' ? 'bg-purple-600 text-white shadow-md' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Car className="w-4 h-4" />
          <span>E'lonlar ({listings.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('users')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition ${
            activeTab === 'users' ? 'bg-purple-600 text-white shadow-md' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Foydalanuvchilar ({users.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('reports')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition ${
            activeTab === 'reports' ? 'bg-purple-600 text-white shadow-md' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <AlertTriangle className="w-4 h-4" />
          <span>Shikoyatlar ({reports.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('stats')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition ${
            activeTab === 'stats' ? 'bg-purple-600 text-white shadow-md' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>Platforma statistikasi</span>
        </button>
      </div>

      {/* Tab 1: Moderation */}
      {activeTab === 'moderation' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            {listings.map(car => (
              <div
                key={car.id}
                className="bg-white dark:bg-[#161a22] rounded-2xl p-4 sm:p-5 border border-slate-200/80 dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div className="flex items-center gap-4 cursor-pointer" onClick={() => onSelectCar(car)}>
                  <img
                    src={car.coverImage || car.images[0]}
                    alt={car.title}
                    className="w-20 h-16 object-cover rounded-xl shrink-0"
                  />
                  <div>
                    <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                      {car.make} {car.model} ({car.year})
                    </h4>
                    <span className="text-sm font-extrabold text-red-600 font-mono">
                      {formatPrice(car.priceUZS)}
                    </span>
                    <p className="text-xs text-slate-400">
                      Sotuvchi: {car.sellerName} ({car.sellerPhone}) • {car.city}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase ${
                    car.status === 'active'
                      ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400'
                      : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                  }`}>
                    {car.status}
                  </span>

                  <button
                    onClick={() => handleModerate(car.id, 'active')}
                    className="p-2 rounded-xl text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/40"
                    title="Tasdiqlash"
                  >
                    <CheckCircle className="w-5 h-5" />
                  </button>

                  <button
                    onClick={() => handleModerate(car.id, 'rejected')}
                    className="p-2 rounded-xl text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/40"
                    title="Rad etish"
                  >
                    <XCircle className="w-5 h-5" />
                  </button>

                  <button
                    onClick={() => handleDeleteListing(car.id)}
                    className="p-2 rounded-xl text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40"
                    title="O'chirish"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: Users & Dealer Verification */}
      {activeTab === 'users' && (
        <div className="bg-white dark:bg-[#161a22] rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 text-slate-500 font-bold uppercase text-[11px]">
                <tr>
                  <th className="p-4">Foydalanuvchi</th>
                  <th className="p-4">Aloqa</th>
                  <th className="p-4">Hudud</th>
                  <th className="p-4">Roli</th>
                  <th className="p-4">Dilerlik holati</th>
                  <th className="p-4 text-right">Amal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {users.map(u => (
                  <tr key={u.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                    <td className="p-4 font-bold text-slate-900 dark:text-white">
                      {u.name}
                    </td>
                    <td className="p-4 text-slate-500 font-mono">
                      {u.email} <br /> {u.phone}
                    </td>
                    <td className="p-4 text-slate-500">
                      {u.city}, {u.region}
                    </td>
                    <td className="p-4">
                      <span className="capitalize px-2 py-0.5 rounded text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                        {u.role}
                      </span>
                    </td>
                    <td className="p-4">
                      {u.isVerifiedDealer ? (
                        <span className="inline-flex items-center gap-1 text-emerald-600 font-bold text-xs">
                          <Check className="w-3.5 h-3.5" /> Tasdiqlangan diler
                        </span>
                      ) : (
                        <span className="text-slate-400 text-xs">Oddiy foydalanuvchi</span>
                      )}
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => handleToggleDealer(u.id)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                          u.isVerifiedDealer
                            ? 'border border-red-300 text-red-600 hover:bg-red-50'
                            : 'bg-emerald-600 text-white hover:bg-emerald-500'
                        }`}
                      >
                        {u.isVerifiedDealer ? 'Dilerlikni bekor qilish' : 'Diler qilish'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Reports */}
      {activeTab === 'reports' && (
        <div className="space-y-4">
          {reports.length === 0 ? (
            <div className="bg-white dark:bg-[#161a22] rounded-3xl p-12 text-center border border-slate-200 dark:border-slate-800">
              <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto mb-2" />
              <p className="font-bold text-slate-700 dark:text-slate-300">
                Hozircha hech qanday shikoyat yo'q
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {reports.map(rep => (
                <div
                  key={rep.id}
                  className="p-5 rounded-2xl bg-white dark:bg-[#161a22] border border-slate-200 dark:border-slate-800 flex items-start justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold px-2 py-0.5 rounded bg-red-100 text-red-600 uppercase">
                        {rep.reason}
                      </span>
                      <span className="text-xs text-slate-400">
                        {new Date(rep.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                      {rep.listingTitle} (ID: {rep.listingId})
                    </h4>
                    <p className="text-xs text-slate-500">
                      Izoh: "{rep.comment || 'Izoh qoldirilmagan'}"
                    </p>
                    <p className="text-[11px] text-slate-400">
                      Yuboruvchi: {rep.reporterEmail}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleResolveReport(rep.id, 'resolve')}
                      className="px-3 py-1.5 rounded-xl bg-emerald-600 text-white font-bold text-xs"
                    >
                      Hal qilindi
                    </button>
                    <button
                      onClick={() => handleResolveReport(rep.id, 'dismiss')}
                      className="px-3 py-1.5 rounded-xl border border-slate-300 text-xs font-bold"
                    >
                      Bekor qilish
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 4: Platform Analytics */}
      {activeTab === 'stats' && stats && (
        <div className="bg-white dark:bg-[#161a22] rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40">
              <span className="text-xs text-slate-400 block">Jami e'lonlar</span>
              <span className="text-2xl font-black text-slate-900 dark:text-white font-mono">
                {stats.totalListings}
              </span>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40">
              <span className="text-xs text-slate-400 block">Faol takliflar</span>
              <span className="text-2xl font-black text-emerald-500 font-mono">
                {stats.activeListings}
              </span>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40">
              <span className="text-xs text-slate-400 block">A'zolar soni</span>
              <span className="text-2xl font-black text-blue-500 font-mono">
                {stats.totalUsers}
              </span>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40">
              <span className="text-xs text-slate-400 block">O'rtacha narx</span>
              <span className="text-xl font-black text-red-500 font-mono">
                {formatPrice(stats.averagePriceUZS)}
              </span>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
            <h4 className="font-bold text-sm text-slate-900 dark:text-white mb-3">
              Eng ko'p e'lon joylashtirilgan markalar:
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {stats.topMakes.map(tm => (
                <div key={tm.make} className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 flex justify-between items-center text-xs">
                  <span className="font-bold">{tm.make}</span>
                  <span className="px-2 py-0.5 rounded-full bg-red-100 dark:bg-red-950/40 text-red-600 font-mono font-bold">
                    {tm.count}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
