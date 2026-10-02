import React, { useState } from 'react';
import { 
  Calculator, 
  Fuel, 
  DollarSign, 
  TrendingUp, 
  Calendar, 
  Shield, 
  Info,
  ArrowRightLeft,
  Percent
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext.tsx';

export const CalculatorsView: React.FC = () => {
  const { formatPrice, formatNumber, usdRate, t } = useLanguage();

  const [activeTab, setActiveTab] = useState<'loan' | 'tco' | 'currency' | 'seller'>('loan');

  // Loan State
  const [carPrice, setCarPrice] = useState(160000000);
  const [downPaymentPct, setDownPaymentPct] = useState(25);
  const [loanTermMonths, setLoanTermMonths] = useState(36);
  const [annualRate, setAnnualRate] = useState(24);

  // TCO State
  const [annualKm, setAnnualKm] = useState(20000);
  const [tcoFuelType, setTcoFuelType] = useState<'cng' | 'petrol' | 'electric'>('cng');
  const [oilMaintCost, setOilMaintCost] = useState(4000000);
  const [insuranceCost, setInsuranceCost] = useState(1500000);

  // Currency Converter State
  const [convAmount, setConvAmount] = useState(10000);
  const [convDirection, setConvDirection] = useState<'usd_to_uzs' | 'uzs_to_usd'>('usd_to_uzs');

  // Loan Math
  const downPaymentAmount = Math.round(carPrice * (downPaymentPct / 100));
  const principal = carPrice - downPaymentAmount;
  const monthlyRate = (annualRate / 100) / 12;
  const monthlyPayment = principal > 0
    ? Math.round((principal * monthlyRate * Math.pow(1 + monthlyRate, loanTermMonths)) / (Math.pow(1 + monthlyRate, loanTermMonths) - 1))
    : 0;
  const totalLoanPayment = (monthlyPayment * loanTermMonths) + downPaymentAmount;
  const totalInterest = (monthlyPayment * loanTermMonths) - principal;

  // TCO Math (approx fuel prices in Uzbekistan)
  // 100km on Metan: ~40,000 UZS
  // 100km on Benzin (92/95): ~120,000 UZS
  // 100km on Electric: ~15,000 UZS
  const fuelRatePer100Km = tcoFuelType === 'cng' ? 40000 : tcoFuelType === 'electric' ? 15000 : 120000;
  const annualFuelCost = Math.round((annualKm / 100) * fuelRatePer100Km);
  const totalAnnualCost = annualFuelCost + oilMaintCost + insuranceCost;
  const costPerKm = Math.round(totalAnnualCost / annualKm);

  // Currency Conversion
  const convertedResult = convDirection === 'usd_to_uzs'
    ? convAmount * usdRate
    : Math.round(convAmount / usdRate);

  return (
    <div className="py-8 max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-100 dark:bg-red-950/40 text-red-600 dark:text-red-400 text-xs font-bold">
          <Calculator className="w-3.5 h-3.5" />
          <span>Moliyaviy vositalar</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          {t('calcTitle')}
        </h1>
        <p className="text-sm text-slate-500 max-w-xl mx-auto">
          {t('calcSubtitle')}
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center justify-center gap-2 p-1.5 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 max-w-xl mx-auto">
        <button
          onClick={() => setActiveTab('loan')}
          className={`flex-1 py-2 px-3 rounded-xl text-xs sm:text-sm font-bold transition ${
            activeTab === 'loan' ? 'bg-white dark:bg-[#1a1d24] text-red-600 shadow-sm' : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          {t('loanCalc')}
        </button>
        <button
          onClick={() => setActiveTab('tco')}
          className={`flex-1 py-2 px-3 rounded-xl text-xs sm:text-sm font-bold transition ${
            activeTab === 'tco' ? 'bg-white dark:bg-[#1a1d24] text-red-600 shadow-sm' : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          {t('tcoCalc')}
        </button>
        <button
          onClick={() => setActiveTab('currency')}
          className={`flex-1 py-2 px-3 rounded-xl text-xs sm:text-sm font-bold transition ${
            activeTab === 'currency' ? 'bg-white dark:bg-[#1a1d24] text-red-600 shadow-sm' : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          {t('currencyCalc')}
        </button>
      </div>

      {/* 1. AUTO LOAN CALCULATOR */}
      {activeTab === 'loan' && (
        <div className="bg-white dark:bg-[#161a22] rounded-3xl p-6 sm:p-10 border border-slate-200 dark:border-slate-800 shadow-xl grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7 space-y-6">
            <div>
              <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                <span>{t('carPrice')}</span>
                <span className="font-mono text-red-600 dark:text-red-400">{formatPrice(carPrice)}</span>
              </div>
              <input
                type="range"
                min="50000000"
                max="1000000000"
                step="5000000"
                value={carPrice}
                onChange={e => setCarPrice(Number(e.target.value))}
                className="w-full accent-red-600 cursor-pointer"
              />
              <div className="flex gap-2 mt-2">
                {[120000000, 160000000, 240000000, 400000000].map(val => (
                  <button
                    key={val}
                    onClick={() => setCarPrice(val)}
                    className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-[11px] font-semibold text-slate-600 dark:text-slate-300 hover:bg-red-50 hover:text-red-600"
                  >
                    {val / 1000000} mln
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                <span>{t('downPayment')} ({downPaymentPct}%)</span>
                <span className="font-mono text-slate-900 dark:text-white">{formatPrice(downPaymentAmount)}</span>
              </div>
              <input
                type="range"
                min="15"
                max="50"
                step="5"
                value={downPaymentPct}
                onChange={e => setDownPaymentPct(Number(e.target.value))}
                className="w-full accent-red-600 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                <span>{t('loanTerm')}</span>
                <span className="font-mono text-slate-900 dark:text-white">{loanTermMonths} oy ({loanTermMonths / 12} yil)</span>
              </div>
              <input
                type="range"
                min="12"
                max="60"
                step="12"
                value={loanTermMonths}
                onChange={e => setLoanTermMonths(Number(e.target.value))}
                className="w-full accent-red-600 cursor-pointer"
              />
              <div className="flex gap-2 mt-2">
                {[12, 24, 36, 48, 60].map(m => (
                  <button
                    key={m}
                    onClick={() => setLoanTermMonths(m)}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold ${
                      loanTermMonths === m ? 'bg-red-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    {m} oy
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                <span>{t('interestRate')}</span>
                <span className="font-mono text-slate-900 dark:text-white">{annualRate}%</span>
              </div>
              <input
                type="range"
                min="18"
                max="32"
                step="1"
                value={annualRate}
                onChange={e => setAnnualRate(Number(e.target.value))}
                className="w-full accent-red-600 cursor-pointer"
              />
            </div>
          </div>

          {/* Results Summary Box */}
          <div className="lg:col-span-5 flex flex-col justify-between p-6 sm:p-8 rounded-3xl bg-slate-900 text-white shadow-xl space-y-6">
            <div>
              <span className="text-xs uppercase font-bold tracking-wider text-red-400 block mb-1">
                Kredit hisobi
              </span>
              <span className="text-xs text-slate-400 block">Tavsiya etiladigan oylik to'lov:</span>
              <div className="text-3xl sm:text-4xl font-black font-mono text-emerald-400 mt-2">
                {formatPrice(monthlyPayment)}
              </div>
            </div>

            <div className="space-y-3 pt-6 border-t border-slate-800 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">Boshlang'ich to'lov:</span>
                <span className="font-mono font-bold">{formatPrice(downPaymentAmount)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Kredit miqdori:</span>
                <span className="font-mono font-bold">{formatPrice(principal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Jami hisoblangan foiz:</span>
                <span className="font-mono font-bold text-amber-400">{formatPrice(totalInterest)}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-slate-800 font-bold">
                <span className="text-slate-300">Jami umumiy to'lov:</span>
                <span className="font-mono text-white">{formatPrice(totalLoanPayment)}</span>
              </div>
            </div>

            <p className="text-[10px] text-slate-500 leading-tight">
              {t('calcDisclaimer')}
            </p>
          </div>
        </div>
      )}

      {/* 2. TCO (TOTAL COST OF OWNERSHIP) */}
      {activeTab === 'tco' && (
        <div className="bg-white dark:bg-[#161a22] rounded-3xl p-6 sm:p-10 border border-slate-200 dark:border-slate-800 shadow-xl grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7 space-y-6">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                {t('annualMileage')}
              </label>
              <input
                type="number"
                value={annualKm}
                onChange={e => setAnnualKm(Number(e.target.value))}
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-base font-bold font-mono focus:ring-2 focus:ring-red-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                Yoqilg'i turi
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => setTcoFuelType('cng')}
                  className={`py-3 px-3 rounded-xl text-xs font-bold border transition ${
                    tcoFuelType === 'cng' ? 'bg-red-600 text-white border-red-600' : 'bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  🟢 Metan Gaz
                </button>
                <button
                  onClick={() => setTcoFuelType('petrol')}
                  className={`py-3 px-3 rounded-xl text-xs font-bold border transition ${
                    tcoFuelType === 'petrol' ? 'bg-red-600 text-white border-red-600' : 'bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  ⛽ Benzin
                </button>
                <button
                  onClick={() => setTcoFuelType('electric')}
                  className={`py-3 px-3 rounded-xl text-xs font-bold border transition ${
                    tcoFuelType === 'electric' ? 'bg-red-600 text-white border-red-600' : 'bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  ⚡ Elektr
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                {t('maintenanceCost')} ({t('som')})
              </label>
              <input
                type="number"
                value={oilMaintCost}
                onChange={e => setOilMaintCost(Number(e.target.value))}
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-sm font-mono focus:ring-2 focus:ring-red-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                {t('insuranceCost')} ({t('som')})
              </label>
              <input
                type="number"
                value={insuranceCost}
                onChange={e => setInsuranceCost(Number(e.target.value))}
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-sm font-mono focus:ring-2 focus:ring-red-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="lg:col-span-5 flex flex-col justify-between p-6 sm:p-8 rounded-3xl bg-slate-900 text-white shadow-xl space-y-6">
            <div>
              <span className="text-xs uppercase font-bold tracking-wider text-red-400 block mb-1">
                Yillik umumiy xarajat
              </span>
              <div className="text-3xl sm:text-4xl font-black font-mono text-emerald-400 mt-2">
                {formatPrice(totalAnnualCost)}
              </div>
              <span className="text-xs text-slate-400 block mt-1">
                Har 1 km uchun: <strong className="text-white">{formatNumber(costPerKm)} so'm</strong>
              </span>
            </div>

            <div className="space-y-3 pt-6 border-t border-slate-800 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">{t('fuelCostAnnual')}:</span>
                <span className="font-mono font-bold">{formatPrice(annualFuelCost)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">{t('maintenanceCost')}:</span>
                <span className="font-mono font-bold">{formatPrice(oilMaintCost)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">{t('insuranceCost')}:</span>
                <span className="font-mono font-bold">{formatPrice(insuranceCost)}</span>
              </div>
            </div>

            <p className="text-[10px] text-slate-500 leading-tight">
              Hisob-kitoblar O'zbekiston yoqilg'i narxlari va o'rtacha ekspluatatsiya xarajatlariga asoslangan.
            </p>
          </div>
        </div>
      )}

      {/* 3. CURRENCY CONVERTER */}
      {activeTab === 'currency' && (
        <div className="bg-white dark:bg-[#161a22] rounded-3xl p-6 sm:p-10 border border-slate-200 dark:border-slate-800 shadow-xl max-w-2xl mx-auto space-y-6">
          <div className="text-center pb-4 border-b border-slate-100 dark:border-slate-800">
            <span className="text-xs text-slate-400 font-mono">Markaziy Bank rasmiy kursi</span>
            <div className="text-2xl font-black text-slate-900 dark:text-white font-mono mt-1">
              1 USD = {formatNumber(usdRate)} UZS
            </div>
          </div>

          <div className="flex items-center justify-center gap-4">
            <button
              onClick={() => setConvDirection(convDirection === 'usd_to_uzs' ? 'uzs_to_usd' : 'usd_to_uzs')}
              className="p-3 rounded-2xl bg-red-600 text-white font-bold flex items-center gap-2 shadow-lg shadow-red-600/30 transition active:scale-95"
            >
              <ArrowRightLeft className="w-4 h-4" />
              <span>Yo'nalishni almashtirish</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Kiritilayotgan summa ({convDirection === 'usd_to_uzs' ? 'USD $' : 'UZS so\'m'})
              </label>
              <input
                type="number"
                value={convAmount}
                onChange={e => setConvAmount(Number(e.target.value))}
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-lg font-bold font-mono focus:ring-2 focus:ring-red-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Natija ({convDirection === 'usd_to_uzs' ? 'UZS so\'m' : 'USD $'})
              </label>
              <div className="w-full bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-lg font-black font-mono text-emerald-600 dark:text-emerald-400">
                {convDirection === 'usd_to_uzs' ? `${formatNumber(convertedResult)} so'm` : `$ ${formatNumber(convertedResult)}`}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
