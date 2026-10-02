import React, { useState, useEffect } from 'react';
import { 
  LanguageProvider, 
  useLanguage 
} from './context/LanguageContext.tsx';
import { 
  AuthProvider, 
  useAuth 
} from './context/AuthContext.tsx';
import { 
  FavoritesProvider, 
  useFavorites 
} from './context/FavoritesContext.tsx';
import { 
  CompareProvider, 
  useCompare 
} from './context/CompareContext.tsx';
import { api } from './services/api.ts';
import type { 
  CarListing, 
  FilterParams, 
  PlatformStats 
} from './types/index.ts';

// Components
import { Header } from './components/common/Header.tsx';
import { Footer } from './components/common/Footer.tsx';
import { CarCard } from './components/common/CarCard.tsx';
import { HeroSearch } from './components/home/HeroSearch.tsx';
import { PopularBrands } from './components/home/PopularBrands.tsx';
import { BodyTypesGrid } from './components/home/BodyTypesGrid.tsx';
import { SafetyTips } from './components/home/SafetyTips.tsx';
import { StatsSection } from './components/home/StatsSection.tsx';
import { FaqSection } from './components/home/FaqSection.tsx';
import { ListingFilters } from './components/listings/ListingFilters.tsx';
import { ListingDetailModal } from './components/listings/ListingDetailModal.tsx';
import { CarComparisonView } from './components/listings/CarComparisonView.tsx';
import { CalculatorsView } from './components/calculators/CalculatorsView.tsx';
import { UzbekistanMapView } from './components/map/UzbekistanMapView.tsx';
import { ChatView } from './components/chat/ChatView.tsx';
import { UserDashboard } from './components/dashboard/UserDashboard.tsx';
import { AdminDashboard } from './components/admin/AdminDashboard.tsx';
import { DealersView } from './components/dealers/DealersView.tsx';
import { SellWizard } from './components/sell/SellWizard.tsx';
import { AuthModal } from './components/auth/AuthModal.tsx';
import { ReportModal } from './components/trust/ReportModal.tsx';

import { 
  Grid, 
  List, 
  ArrowUpDown, 
  ChevronLeft, 
  ChevronRight, 
  Sparkles, 
  TrendingDown, 
  Filter, 
  Check, 
  X,
  Search
} from 'lucide-react';

const MainApp: React.FC = () => {
  const { t, formatPrice } = useLanguage();
  const { user } = useAuth();
  const { addToRecentlyViewed } = useFavorites();

  // Navigation state
  const [currentTab, setCurrentTab] = useState<string>('home');
  const [selectedCarId, setSelectedCarId] = useState<string | null>(null);
  const [sellWizardOpen, setSellWizardOpen] = useState(false);
  const [reportCar, setReportCar] = useState<CarListing | null>(null);
  const [activeChatListing, setActiveChatListing] = useState<CarListing | null>(null);

  // Listings & Data State
  const [listings, setListings] = useState<CarListing[]>([]);
  const [stats, setStats] = useState<PlatformStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [totalFound, setTotalFound] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [layout, setLayout] = useState<'grid' | 'list'>('grid');

  // Filter params
  const [filters, setFilters] = useState<FilterParams>({
    sort: 'newest',
    page: 1,
    limit: 12
  });

  // Fetch listings whenever filters change
  const fetchListings = () => {
    setLoading(true);
    api.getListings(filters)
      .then(res => {
        setListings(res.listings);
        setTotalFound(res.total);
        setTotalPages(res.totalPages);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  const fetchStats = () => {
    api.getStats()
      .then(s => setStats(s))
      .catch(err => console.error(err));
  };

  useEffect(() => {
    fetchListings();
  }, [filters]);

  useEffect(() => {
    fetchStats();
  }, []);

  const handleNavigate = (tab: string, param?: string) => {
    setCurrentTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    if (param) {
      // Check if param is make or region
      if (['Chevrolet', 'BYD', 'Kia', 'Hyundai', 'Toyota', 'BMW', 'Mercedes-Benz', 'Tesla'].includes(param)) {
        setFilters(prev => ({ ...prev, make: param, page: 1 }));
      } else {
        setFilters(prev => ({ ...prev, region: param, page: 1 }));
      }
    }
  };

  const handleHeroSearch = (searchParams: FilterParams) => {
    setFilters(prev => ({ ...prev, ...searchParams, page: 1 }));
    setCurrentTab('catalog');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectCar = (car: CarListing) => {
    addToRecentlyViewed(car);
    setSelectedCarId(car.id);
  };

  const handleListingCreated = (newListing: CarListing) => {
    setSellWizardOpen(false);
    fetchListings();
    fetchStats();
    handleSelectCar(newListing);
  };

  // Sections on Home
  const featuredListings = listings.filter(l => l.isFeatured);
  const discountedListings = listings.filter(l => l.isDiscounted);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 dark:bg-[#0e1117] dark:text-slate-100 transition-colors">
      {/* Global Header */}
      <Header
        currentTab={currentTab}
        onNavigate={handleNavigate}
        onOpenSellWizard={() => setSellWizardOpen(true)}
      />

      {/* Main View Area */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6">
        {/* TAB 1: HOME PAGE */}
        {currentTab === 'home' && (
          <div className="space-y-12">
            {/* Hero Search */}
            <HeroSearch
              onSearch={handleHeroSearch}
              totalListingsCount={stats?.activeListings || listings.length}
            />

            {/* Popular Makes Grid */}
            <PopularBrands
              onSelectBrand={(make) => {
                setFilters(prev => ({ ...prev, make, page: 1 }));
                setCurrentTab('catalog');
              }}
              brandCounts={stats?.topMakes?.reduce((acc, curr) => ({ ...acc, [curr.make]: curr.count }), {}) || {}}
            />

            {/* VIP & Featured Showcase */}
            {featuredListings.length > 0 && (
              <section className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="p-1.5 rounded-lg bg-amber-500/20 text-amber-500">
                      <Sparkles className="w-5 h-5" />
                    </span>
                    <div>
                      <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
                        {t('featuredListings')}
                      </h2>
                      <p className="text-xs text-slate-400">
                        Tekshirilgan va kafolatlangan eng sara takliflar
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setFilters(prev => ({ ...prev, isFeatured: true, page: 1 }));
                      setCurrentTab('catalog');
                    }}
                    className="text-xs sm:text-sm font-bold text-red-600 hover:underline"
                  >
                    {t('viewAll')} &gt;
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                  {featuredListings.slice(0, 4).map(car => (
                    <CarCard key={car.id} car={car} onClick={handleSelectCar} />
                  ))}
                </div>
              </section>
            )}

            {/* Latest Listings */}
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
                    {t('latestListings')}
                  </h2>
                  <p className="text-xs text-slate-400">
                    Bugun va oxirgi kunlarda joylashtirilgan yangi e'lonlar
                  </p>
                </div>
                <button
                  onClick={() => {
                    setFilters({ sort: 'newest', page: 1, limit: 12 });
                    setCurrentTab('catalog');
                  }}
                  className="text-xs sm:text-sm font-bold text-red-600 hover:underline"
                >
                  {t('viewAll')} &gt;
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {listings.slice(0, 8).map(car => (
                  <CarCard key={car.id} car={car} onClick={handleSelectCar} />
                ))}
              </div>
            </section>

            {/* Discounted Deals */}
            {discountedListings.length > 0 && (
              <section className="space-y-4">
                <div className="flex items-center gap-2">
                  <span className="p-1.5 rounded-lg bg-red-600/20 text-red-500">
                    <TrendingDown className="w-5 h-5" />
                  </span>
                  <div>
                    <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
                      {t('discountedListings')}
                    </h2>
                    <p className="text-xs text-slate-400">
                      Sotuvchilar tomonidan narxi tushirilgan qulay variantlar
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                  {discountedListings.slice(0, 4).map(car => (
                    <CarCard key={car.id} car={car} onClick={handleSelectCar} />
                  ))}
                </div>
              </section>
            )}

            {/* Browse by Body & Fuel */}
            <BodyTypesGrid
              onSelectBodyType={(body) => {
                setFilters(prev => ({ ...prev, bodyType: body, page: 1 }));
                setCurrentTab('catalog');
              }}
              onSelectFuelType={(fuel) => {
                setFilters(prev => ({ ...prev, fuelType: fuel as any, page: 1 }));
                setCurrentTab('catalog');
              }}
            />

            {/* Platform Real Statistics */}
            <StatsSection stats={stats} />

            {/* Safety & Anti-Scam Tips */}
            <SafetyTips />

            {/* FAQ */}
            <FaqSection />
          </div>
        )}

        {/* TAB 2: ADVANCED SEARCH & CATALOG */}
        {currentTab === 'catalog' && (
          <div className="py-4 space-y-6">
            {/* Catalog Top Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-[#161a22] p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
                  {t('cars')}
                </h1>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                  {totalFound} {t('resultsFound')}
                </span>
              </div>

              {/* Sorting & Layout Toggles */}
              <div className="flex items-center gap-3">
                {/* Sort */}
                <div className="flex items-center gap-1.5 text-xs">
                  <ArrowUpDown className="w-4 h-4 text-slate-400" />
                  <select
                    value={filters.sort || 'newest'}
                    onChange={e => setFilters(prev => ({ ...prev, sort: e.target.value as any, page: 1 }))}
                    className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-1.5 text-xs font-semibold focus:outline-none"
                  >
                    <option value="newest">{t('sortNewest')}</option>
                    <option value="price_asc">{t('sortPriceAsc')}</option>
                    <option value="price_desc">{t('sortPriceDesc')}</option>
                    <option value="year_desc">{t('sortYearDesc')}</option>
                    <option value="mileage_asc">{t('sortMileageAsc')}</option>
                  </select>
                </div>

                {/* Grid / List Layout Switcher */}
                <div className="flex items-center bg-slate-100 dark:bg-slate-900 rounded-xl p-1 border border-slate-200 dark:border-slate-800">
                  <button
                    onClick={() => setLayout('grid')}
                    className={`p-1.5 rounded-lg transition ${
                      layout === 'grid' ? 'bg-white dark:bg-[#1a1d24] text-red-600 shadow-sm' : 'text-slate-400 hover:text-white'
                    }`}
                    title="Jadval ko'rinishi"
                  >
                    <Grid className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setLayout('list')}
                    className={`p-1.5 rounded-lg transition ${
                      layout === 'list' ? 'bg-white dark:bg-[#1a1d24] text-red-600 shadow-sm' : 'text-slate-400 hover:text-white'
                    }`}
                    title="Ro'yxat ko'rinishi"
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Filter Chips if any */}
            {(filters.make || filters.model || filters.region || filters.priceMax || filters.fuelType || filters.bodyType) && (
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs text-slate-400 font-semibold">Faol filtrlar:</span>
                {filters.make && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-red-100 dark:bg-red-950/40 text-red-600 text-xs font-semibold">
                    {filters.make}
                    <X className="w-3 h-3 cursor-pointer" onClick={() => setFilters(prev => ({ ...prev, make: undefined, model: undefined }))} />
                  </span>
                )}
                {filters.model && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-red-100 dark:bg-red-950/40 text-red-600 text-xs font-semibold">
                    {filters.model}
                    <X className="w-3 h-3 cursor-pointer" onClick={() => setFilters(prev => ({ ...prev, model: undefined }))} />
                  </span>
                )}
                {filters.region && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-red-100 dark:bg-red-950/40 text-red-600 text-xs font-semibold">
                    {filters.region}
                    <X className="w-3 h-3 cursor-pointer" onClick={() => setFilters(prev => ({ ...prev, region: undefined }))} />
                  </span>
                )}
                <button
                  onClick={() => setFilters({ sort: 'newest', page: 1, limit: 12 })}
                  className="text-xs text-red-600 hover:underline font-bold ml-2"
                >
                  Barchasini tozalash
                </button>
              </div>
            )}

            {/* Layout: Sidebar Filter + Results Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              {/* Left Sidebar Filter */}
              <div className="lg:col-span-1">
                <ListingFilters
                  filters={filters}
                  onChange={newFilters => setFilters(newFilters)}
                  onReset={() => setFilters({ sort: 'newest', page: 1, limit: 12 })}
                  totalFound={totalFound}
                />
              </div>

              {/* Right Cars Grid / List */}
              <div className="lg:col-span-3 space-y-6">
                {loading ? (
                  <div className="py-20 text-center space-y-3">
                    <div className="w-8 h-8 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto" />
                    <p className="text-xs text-slate-400">{t('loading')}</p>
                  </div>
                ) : listings.length === 0 ? (
                  <div className="bg-white dark:bg-[#161a22] rounded-3xl p-12 text-center border border-slate-200 dark:border-slate-800 space-y-3">
                    <Search className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto" />
                    <h3 className="font-extrabold text-base text-slate-800 dark:text-slate-200">
                      {t('noResults')}
                    </h3>
                    <p className="text-xs text-slate-400 max-w-sm mx-auto">
                      {t('noResultsDesc')}
                    </p>
                    <button
                      onClick={() => setFilters({ sort: 'newest', page: 1, limit: 12 })}
                      className="px-4 py-2 rounded-xl bg-red-600 text-white font-bold text-xs shadow-md mt-2"
                    >
                      {t('clearFilters')}
                    </button>
                  </div>
                ) : (
                  <>
                    <div className={
                      layout === 'grid'
                        ? 'grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5'
                        : 'space-y-4'
                    }>
                      {listings.map(car => (
                        <CarCard
                          key={car.id}
                          car={car}
                          layout={layout}
                          onClick={handleSelectCar}
                        />
                      ))}
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                      <div className="flex items-center justify-center gap-2 pt-6">
                        <button
                          disabled={filters.page === 1}
                          onClick={() => setFilters(prev => ({ ...prev, page: Math.max(1, (prev.page || 1) - 1) }))}
                          className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 disabled:opacity-40 hover:bg-slate-100 dark:hover:bg-slate-800"
                        >
                          <ChevronLeft className="w-4 h-4" />
                        </button>
                        <span className="text-xs font-mono font-bold px-3">
                          {filters.page} / {totalPages}
                        </span>
                        <button
                          disabled={filters.page === totalPages}
                          onClick={() => setFilters(prev => ({ ...prev, page: Math.min(totalPages, (prev.page || 1) + 1) }))}
                          className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 disabled:opacity-40 hover:bg-slate-100 dark:hover:bg-slate-800"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: UZBEKISTAN MAP */}
        {currentTab === 'map' && (
          <UzbekistanMapView
            listings={listings}
            onSelectCar={handleSelectCar}
          />
        )}

        {/* TAB 4: CAR COMPARISON TOOL */}
        {currentTab === 'compare' && (
          <CarComparisonView
            onSelectCar={handleSelectCar}
            onBrowseMore={() => setCurrentTab('catalog')}
          />
        )}

        {/* TAB 5: FINANCIAL CALCULATORS */}
        {currentTab === 'calculators' && (
          <CalculatorsView />
        )}

        {/* TAB 6: DEALERS */}
        {currentTab === 'dealers' && (
          <DealersView
            listings={listings}
            onSelectCar={handleSelectCar}
            onFilterByDealer={(dealerName) => {
              setFilters(prev => ({ ...prev, search: dealerName, page: 1 }));
              setCurrentTab('catalog');
            }}
          />
        )}

        {/* TAB 7: USER DASHBOARD */}
        {currentTab === 'dashboard' && (
          <UserDashboard
            onOpenSellWizard={() => setSellWizardOpen(true)}
            onSelectCar={handleSelectCar}
            onExecuteSavedSearch={(savedParams) => {
              setFilters({ ...savedParams, page: 1 });
              setCurrentTab('catalog');
            }}
          />
        )}

        {/* TAB 8: MESSAGING & CHAT */}
        {currentTab === 'chat' && (
          <ChatView
            initialListing={activeChatListing}
            onSelectCar={(id) => setSelectedCarId(id)}
          />
        )}

        {/* TAB 9: FAVORITES */}
        {currentTab === 'favorites' && (
          <div className="py-6 space-y-6">
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
              {t('favorites')}
            </h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {listings.filter(l => l.favoritesCount > 0).map(car => (
                <CarCard key={car.id} car={car} onClick={handleSelectCar} />
              ))}
            </div>
          </div>
        )}

        {/* TAB 10: ADMIN DASHBOARD */}
        {currentTab === 'admin' && (
          <AdminDashboard
            onSelectCar={handleSelectCar}
          />
        )}
      </main>

      {/* Global Footer */}
      <Footer onNavigate={handleNavigate} />

      {/* MODALS */}

      {/* Car Details Dedicated Modal */}
      {selectedCarId && (
        <ListingDetailModal
          carId={selectedCarId}
          onClose={() => setSelectedCarId(null)}
          onOpenChat={(car) => {
            setActiveChatListing(car);
            setCurrentTab('chat');
          }}
          onOpenReport={(car) => setReportCar(car)}
          onSelectCar={(car) => setSelectedCarId(car.id)}
          onListingUpdated={() => {
            fetchListings();
            fetchStats();
          }}
        />
      )}

      {/* Sell a Car Wizard Modal */}
      {sellWizardOpen && (
        <SellWizard
          onClose={() => setSellWizardOpen(false)}
          onSuccess={handleListingCreated}
        />
      )}

      {/* Report Modal */}
      {reportCar && (
        <ReportModal
          listing={reportCar}
          onClose={() => setReportCar(null)}
        />
      )}

      {/* Auth Modal */}
      <AuthModal />
    </div>
  );
};

export default function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <FavoritesProvider>
          <CompareProvider>
            <MainApp />
          </CompareProvider>
        </FavoritesProvider>
      </AuthProvider>
    </LanguageProvider>
  );
}
