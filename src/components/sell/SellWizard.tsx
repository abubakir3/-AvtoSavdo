import React, { useState } from 'react';
import { 
  X, 
  Check, 
  Upload, 
  Trash2, 
  Sparkles, 
  ArrowRight, 
  ArrowLeft, 
  Car, 
  MapPin, 
  DollarSign, 
  Image as ImageIcon, 
  FileText,
  AlertCircle
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext.tsx';
import { useAuth } from '../../context/AuthContext.tsx';
import { api } from '../../services/api.ts';
import { POPULAR_MAKES, MODELS_BY_MAKE, UZBEKISTAN_REGIONS } from '../../i18n/translations.ts';
import type { 
  BodyType, 
  FuelType, 
  TransmissionType, 
  DrivetrainType, 
  CarCondition, 
  PaintCondition,
  CarListing 
} from '../../types/index.ts';

interface SellWizardProps {
  onClose: () => void;
  onSuccess: (newListing: CarListing) => void;
}

export const SellWizard: React.FC<SellWizardProps> = ({ onClose, onSuccess }) => {
  const { t, formatPrice, formatNumber } = useLanguage();
  const { user } = useAuth();

  const [currentStep, setCurrentStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Form State
  const [make, setMake] = useState('Chevrolet');
  const [model, setModel] = useState('Cobalt');
  const [generation, setGeneration] = useState('4-pozitsiya Elegant AT');
  const [year, setYear] = useState(2023);
  const [bodyType, setBodyType] = useState<BodyType>('sedan');
  const [color, setColor] = useState('Oq');

  const [mileage, setMileage] = useState('35000');
  const [engineVolume, setEngineVolume] = useState('1.5');
  const [fuelType, setFuelType] = useState<FuelType>('cng');
  const [hasCngGaz, setHasCngGaz] = useState(true);
  const [hasLpgGaz, setHasLpgGaz] = useState(false);
  const [transmission, setTransmission] = useState<TransmissionType>('automatic');
  const [drivetrain, setDrivetrain] = useState<DrivetrainType>('front');
  const [condition, setCondition] = useState<CarCondition>('ideal');
  const [paintCondition, setPaintCondition] = useState<PaintCondition>('clean');
  const [vin, setVin] = useState('');

  const [priceUZS, setPriceUZS] = useState('155000000');
  const [isNegotiable, setIsNegotiable] = useState(true);
  const [region, setRegion] = useState('Toshkent shahri');
  const [city, setCity] = useState('Chilonzor tumani');
  const [phone, setPhone] = useState(user?.phone || '+998 90 123 45 67');
  const [telegram, setTelegram] = useState(user?.telegram || '@my_auto');

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('Mashina a\'lo holatda. O\'z vaqtida moy almashtirilgan, kraskasi toza. Kelishiladi.');
  const [images, setImages] = useState<string[]>([
    'https://images.unsplash.com/photo-1590362891988-3069176378e9?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80'
  ]);
  const [features, setFeatures] = useState<string[]>([
    'Konditsioner',
    'Old o\'rindiqlar isitgichi',
    'ABS',
    'Magicar pult',
    'Metan gaz 4-avlod'
  ]);

  const availableModels = make && MODELS_BY_MAKE[make] ? MODELS_BY_MAKE[make] : [];

  const handleMakeChange = (newMake: string) => {
    setMake(newMake);
    const models = MODELS_BY_MAKE[newMake];
    if (models && models.length > 0) {
      setModel(models[0]);
    } else {
      setModel('');
    }
  };

  const validateStep = (step: number): boolean => {
    const errs: Record<string, string> = {};
    if (step === 1) {
      if (!make) errs.make = 'Markani tanlang';
      if (!model) errs.model = 'Modelni tanlang';
      if (!year || year < 1980 || year > 2026) errs.year = 'Yilni to\'g\'ri kiriting';
    } else if (step === 2) {
      if (!mileage || Number(mileage) < 0) errs.mileage = 'Yurgan masofasini kiriting';
    } else if (step === 3) {
      if (!priceUZS || Number(priceUZS) <= 0) errs.priceUZS = 'Narxni kiriting';
      if (!phone) errs.phone = 'Telefon raqamni kiriting';
    } else if (step === 4) {
      if (images.length === 0) errs.images = 'Kamida bitta rasm yuklang';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep === 3 && !title) {
        setTitle(`${make} ${model} ${generation} (${year})`);
      }
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    setCurrentStep(prev => prev - 1);
  };

  const handleAddSampleImage = () => {
    const samples = [
      'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=1200&q=80'
    ];
    const nextImg = samples[images.length % samples.length];
    setImages(prev => [...prev, nextImg]);
  };

  const handleRemoveImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSetCover = (index: number) => {
    const selected = images[index];
    setImages(prev => [selected, ...prev.filter((_, i) => i !== index)]);
  };

  const handleToggleFeature = (feat: string) => {
    if (features.includes(feat)) {
      setFeatures(prev => prev.filter(f => f !== feat));
    } else {
      setFeatures(prev => [...prev, feat]);
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const payload: Partial<CarListing> = {
        userId: user?.id || 'user_guest',
        sellerName: user?.name || 'Foydalanuvchi',
        sellerPhone: phone,
        sellerTelegram: telegram,
        sellerType: user?.role === 'dealer' ? 'dealer' : 'private',
        isVerifiedSeller: user?.isVerifiedDealer || false,
        dealerName: user?.dealerName,

        make,
        model,
        generation,
        year: Number(year),
        bodyType,
        color,

        priceUZS: Number(priceUZS),
        isNegotiable,
        mileage: Number(mileage),
        engineVolume: Number(engineVolume),
        fuelType,
        hasCngGaz: fuelType === 'cng' || hasCngGaz,
        hasLpgGaz: fuelType === 'lpg' || hasLpgGaz,
        transmission,
        drivetrain,
        condition,
        paintCondition,
        vin,

        region,
        city,
        title: title || `${make} ${model} ${year}`,
        description,
        images,
        coverImage: images[0],
        features
      };

      const created = await api.createListing(payload);
      onSuccess(created);
    } catch (err: any) {
      alert(err.message || 'Xatolik yuz berdi');
    } finally {
      setSubmitting(false);
    }
  };

  const allPossibleFeatures = [
    'Konditsioner',
    'Old o\'rindiqlar isitgichi',
    'Orqa o\'rindiqlar isitgichi',
    'Charm salon',
    'Panoramali tom / Lyuk',
    'Kruiz-kontrol',
    'Orqa kamera va parktroniklar',
    'Magicar pult',
    'Start/Stop tugmasi',
    'Metan gaz 4-avlod',
    '360° kamera',
    'Bort kompyuter',
    'ABS tormoz tizimi'
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="relative bg-white dark:bg-[#13161c] rounded-3xl w-full max-w-3xl shadow-2xl border border-slate-200 dark:border-slate-800 my-auto overflow-hidden">
        {/* Top Header with Steps */}
        <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-red-600 uppercase tracking-wider block">
              AutoSavdo Pro
            </span>
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
              {t('sellTitle')}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-red-600 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Bar Indicator */}
        <div className="px-6 py-3 bg-slate-50 dark:bg-[#181c24] border-b border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
          {[1, 2, 3, 4, 5].map(step => (
            <div key={step} className="flex items-center gap-1.5 font-bold">
              <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] transition ${
                currentStep === step
                  ? 'bg-red-600 text-white shadow-md'
                  : currentStep > step
                  ? 'bg-emerald-500 text-white'
                  : 'bg-slate-200 dark:bg-slate-800 text-slate-500'
              }`}>
                {currentStep > step ? <Check className="w-3.5 h-3.5" /> : step}
              </span>
              <span className={`hidden sm:inline ${currentStep === step ? 'text-slate-900 dark:text-white font-extrabold' : 'text-slate-400'}`}>
                {step === 1 && 'Asosiy'}
                {step === 2 && 'Texnik'}
                {step === 3 && 'Narx & Aloqa'}
                {step === 4 && 'Rasmlar'}
                {step === 5 && 'Chop etish'}
              </span>
            </div>
          ))}
        </div>

        {/* Form Body */}
        <div className="p-6 sm:p-8 max-h-[70vh] overflow-y-auto space-y-6">
          {/* STEP 1: Basic Information */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white mb-2">
                1-Qadam: Avtomobilning asosiy ma'lumotlari
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Markasi *
                  </label>
                  <select
                    value={make}
                    onChange={e => handleMakeChange(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2.5 text-sm font-semibold focus:ring-2 focus:ring-red-500 focus:outline-none"
                  >
                    {POPULAR_MAKES.map(m => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Modeli *
                  </label>
                  <select
                    value={model}
                    onChange={e => setModel(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2.5 text-sm font-semibold focus:ring-2 focus:ring-red-500 focus:outline-none"
                  >
                    {availableModels.map(mod => (
                      <option key={mod} value={mod}>{mod}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Pozitsiyasi / Modifikatsiyasi
                  </label>
                  <input
                    type="text"
                    value={generation}
                    placeholder="Masalan: 4-pozitsiya Elegant AT"
                    onChange={e => setGeneration(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-sm font-medium focus:ring-2 focus:ring-red-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Ishlab chiqarilgan yili *
                  </label>
                  <input
                    type="number"
                    value={year}
                    min="1990"
                    max="2026"
                    onChange={e => setYear(Number(e.target.value))}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-sm font-medium focus:ring-2 focus:ring-red-500 focus:outline-none"
                  />
                  {errors.year && <p className="text-red-500 text-xs mt-1">{errors.year}</p>}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Kuzov turi
                  </label>
                  <select
                    value={bodyType}
                    onChange={e => setBodyType(e.target.value as BodyType)}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2.5 text-sm font-semibold focus:ring-2 focus:ring-red-500 focus:outline-none"
                  >
                    <option value="sedan">Sedan</option>
                    <option value="crossover">Krossover</option>
                    <option value="suv">Yo'ltanlamas (SUV)</option>
                    <option value="hatchback">Xetchbek</option>
                    <option value="minivan">Miniven</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Rangi
                  </label>
                  <input
                    type="text"
                    value={color}
                    placeholder="Masalan: Oq, Qora, Mokriy asfalt"
                    onChange={e => setColor(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-sm font-medium focus:ring-2 focus:ring-red-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Technical Specifications */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white mb-2">
                2-Qadam: Texnik holat va parametrlar
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Yurgan masofasi (km) *
                  </label>
                  <input
                    type="number"
                    value={mileage}
                    onChange={e => setMileage(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-sm font-medium focus:ring-2 focus:ring-red-500 focus:outline-none"
                  />
                  {errors.mileage && <p className="text-red-500 text-xs mt-1">{errors.mileage}</p>}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Dvigatel hajmi (Litr)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={engineVolume}
                    placeholder="Masalan: 1.5 (EV bo'lsa 0)"
                    onChange={e => setEngineVolume(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-sm font-medium focus:ring-2 focus:ring-red-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Yoqilg'i turi
                  </label>
                  <select
                    value={fuelType}
                    onChange={e => setFuelType(e.target.value as FuelType)}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2.5 text-sm font-semibold focus:ring-2 focus:ring-red-500 focus:outline-none"
                  >
                    <option value="petrol">Benzin</option>
                    <option value="cng">Gaz (Metan)</option>
                    <option value="lpg">Gaz (Propan)</option>
                    <option value="electric">Elektr (EV)</option>
                    <option value="hybrid">Gibrid</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Uzatma qutisi
                  </label>
                  <select
                    value={transmission}
                    onChange={e => setTransmission(e.target.value as TransmissionType)}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2.5 text-sm font-semibold focus:ring-2 focus:ring-red-500 focus:outline-none"
                  >
                    <option value="automatic">Avtomat</option>
                    <option value="manual">Mexanika</option>
                    <option value="robot">Robot</option>
                    <option value="variator">Variator</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Bo'yoq (kraska) holati
                  </label>
                  <select
                    value={paintCondition}
                    onChange={e => setPaintCondition(e.target.value as PaintCondition)}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2.5 text-sm font-semibold focus:ring-2 focus:ring-red-500 focus:outline-none"
                  >
                    <option value="clean">Toza (bo'yoq tegmagan)</option>
                    <option value="spot">Petno bor (mayda chiziq)</option>
                    <option value="partial_repainted">Qisman bo'yalgan (1-2 detal)</option>
                    <option value="fully_repainted">To'liq bo'yalgan</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    VIN / Kuzov kodi (ixtiyoriy)
                  </label>
                  <input
                    type="text"
                    value={vin}
                    placeholder="XWB..."
                    onChange={e => setVin(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-sm font-mono focus:ring-2 focus:ring-red-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Price & Location */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white mb-2">
                3-Qadam: Narxi va joylashuv
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Narxi (so'mda) *
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      value={priceUZS}
                      onChange={e => setPriceUZS(e.target.value)}
                      placeholder="150000000"
                      className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-lg font-bold font-mono focus:ring-2 focus:ring-red-500 focus:outline-none"
                    />
                    <span className="absolute right-4 top-3 text-slate-400 font-bold">
                      so'm
                    </span>
                  </div>
                  {priceUZS && (
                    <p className="text-xs text-slate-500 mt-1">
                      {formatNumber(Number(priceUZS))} so'm (taxminan ${formatNumber(Math.round(Number(priceUZS) / 12850))})
                    </p>
                  )}
                  {errors.priceUZS && <p className="text-red-500 text-xs mt-1">{errors.priceUZS}</p>}
                </div>

                <div className="sm:col-span-2">
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700 dark:text-slate-300">
                    <input
                      type="checkbox"
                      checked={isNegotiable}
                      onChange={e => setIsNegotiable(e.target.checked)}
                      className="rounded text-red-600 focus:ring-red-500 w-4 h-4"
                    />
                    <span>Savdolashish imkoniyati bor (kelishiladi)</span>
                  </label>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Viloyat *
                  </label>
                  <select
                    value={region}
                    onChange={e => setRegion(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2.5 text-sm font-semibold focus:ring-2 focus:ring-red-500 focus:outline-none"
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
                    placeholder="Masalan: Chilonzor tumani"
                    onChange={e => setCity(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-sm font-medium focus:ring-2 focus:ring-red-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Telefon raqam *
                  </label>
                  <input
                    type="text"
                    value={phone}
                    placeholder="+998 90 123 45 67"
                    onChange={e => setPhone(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-sm font-medium focus:ring-2 focus:ring-red-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Telegram username (ixtiyoriy)
                  </label>
                  <input
                    type="text"
                    value={telegram}
                    placeholder="@username"
                    onChange={e => setTelegram(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-sm font-medium focus:ring-2 focus:ring-red-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: Photos & Description */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                4-Qadam: Rasmlar va batafsil tavsif
              </h3>

              {/* Photos Gallery */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                  Avtomobil fotosuratlari ({images.length} ta yuklandi)
                </label>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {images.map((img, idx) => (
                    <div key={idx} className="relative group rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 aspect-[4/3] bg-slate-100">
                      <img src={img} alt="car" className="w-full h-full object-cover" />
                      {idx === 0 && (
                        <span className="absolute top-1.5 left-1.5 bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow">
                          Asosiy
                        </span>
                      )}
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-2">
                        {idx !== 0 && (
                          <button
                            type="button"
                            onClick={() => handleSetCover(idx)}
                            className="p-1.5 rounded-lg bg-white text-slate-900 text-[10px] font-bold"
                            title="Asosiy rasm qilish"
                          >
                            Asosiy
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(idx)}
                          className="p-1.5 rounded-lg bg-red-600 text-white"
                          title="O'chirish"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}

                  <button
                    type="button"
                    onClick={handleAddSampleImage}
                    className="flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-red-500 text-slate-500 hover:text-red-500 transition aspect-[4/3]"
                  >
                    <Upload className="w-6 h-6" />
                    <span className="text-xs font-semibold">+ Rasm qo'shish</span>
                  </button>
                </div>
                {errors.images && <p className="text-red-500 text-xs mt-1">{errors.images}</p>}
              </div>

              {/* Title & Description */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  E'lon sarlavhasi
                </label>
                <input
                  type="text"
                  value={title}
                  placeholder={`${make} ${model} ${generation} (${year})`}
                  onChange={e => setTitle(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-sm font-medium focus:ring-2 focus:ring-red-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Batafsil tavsif
                </label>
                <textarea
                  rows={4}
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="Avtomobil holati, qo'shimcha o'rnatilgan detallar haqida ma'lumot bering..."
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 text-sm font-medium focus:ring-2 focus:ring-red-500 focus:outline-none"
                />
              </div>

              {/* Features Checklist */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                  Qulayliklar va jihozlar
                </label>
                <div className="flex flex-wrap gap-2">
                  {allPossibleFeatures.map(feat => {
                    const active = features.includes(feat);
                    return (
                      <button
                        key={feat}
                        type="button"
                        onClick={() => handleToggleFeature(feat)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                          active
                            ? 'bg-red-600 text-white'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                        }`}
                      >
                        {active ? `✓ ${feat}` : `+ ${feat}`}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* STEP 5: Review & Preview */}
          {currentStep === 5 && (
            <div className="space-y-6">
              <div className="flex items-center gap-2 p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 text-xs font-semibold border border-emerald-500/20">
                <Check className="w-4 h-4 shrink-0" />
                <span>Barcha ma'lumotlar to'ldirildi. E'lonni tekshiring va tasdiqlang.</span>
              </div>

              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 space-y-4">
                <div className="flex items-start gap-4">
                  {images[0] && (
                    <img src={images[0]} alt="preview" className="w-28 h-20 object-cover rounded-xl shrink-0" />
                  )}
                  <div>
                    <h4 className="font-extrabold text-base text-slate-900 dark:text-white">
                      {title || `${make} ${model} (${year})`}
                    </h4>
                    <p className="text-xs text-slate-500 mt-1">
                      {formatNumber(Number(mileage))} km • {fuelType} • {transmission}
                    </p>
                    <p className="text-lg font-black text-red-600 font-mono mt-2">
                      {formatPrice(Number(priceUZS))}
                    </p>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300 space-y-1">
                  <p><strong>Joylashuv:</strong> {city}, {region}</p>
                  <p><strong>Aloqa:</strong> {phone} {telegram ? `(${telegram})` : ''}</p>
                  <p><strong>Bo'yoq holati:</strong> {paintCondition === 'clean' ? 'Toza' : 'Bo\'yalgan'}</p>
                  <p className="line-clamp-2"><strong>Tavsif:</strong> {description}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Navigation Buttons */}
        <div className="px-6 py-4 bg-slate-50 dark:bg-[#181c24] border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          {currentStep > 1 ? (
            <button
              onClick={handlePrev}
              className="px-4 py-2 rounded-xl text-xs font-bold border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 flex items-center gap-1.5 transition"
            >
              <ArrowLeft className="w-4 h-4" />
              {t('prevStep')}
            </button>
          ) : (
            <div />
          )}

          {currentStep < 5 ? (
            <button
              onClick={handleNext}
              className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-red-600/30 transition"
            >
              <span>{t('nextStep')}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white text-sm font-bold flex items-center gap-2 shadow-lg shadow-red-600/40 transition disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4" />
              <span>{submitting ? 'Yuklanmoqda...' : t('publishListing')}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
