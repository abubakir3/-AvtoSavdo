import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations } from '../i18n/translations.ts';
import type { Language, Currency } from '../types/index.ts';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  currency: Currency;
  setCurrency: (curr: Currency) => void;
  usdRate: number;
  formatPrice: (priceUZS: number, forceCurrency?: Currency) => string;
  formatNumber: (num: number) => string;
  t: (key: keyof typeof translations.uz) => string;
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    return (localStorage.getItem('autosavdo_lang') as Language) || 'uz';
  });
  
  const [currency, setCurrencyState] = useState<Currency>(() => {
    return (localStorage.getItem('autosavdo_curr') as Currency) || 'UZS';
  });

  const [darkMode, setDarkModeState] = useState<boolean>(() => {
    const saved = localStorage.getItem('autosavdo_theme');
    if (saved) return saved === 'dark';
    return true; // Default to dark for automotive aesthetic
  });

  const [usdRate, setUsdRate] = useState<number>(12850);

  useEffect(() => {
    fetch('/api/rates')
      .then(res => res.json())
      .then(data => {
        if (data.USD) setUsdRate(data.USD);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    localStorage.setItem('autosavdo_lang', language);
    document.documentElement.lang = language;
  }, [language]);

  useEffect(() => {
    localStorage.setItem('autosavdo_curr', currency);
  }, [currency]);

  useEffect(() => {
    localStorage.setItem('autosavdo_theme', darkMode ? 'dark' : 'light');
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  const setCurrency = (curr: Currency) => {
    setCurrencyState(curr);
  };

  const setDarkMode = (val: boolean) => {
    setDarkModeState(val);
  };

  const t = (key: keyof typeof translations.uz): string => {
    const dict = translations[language] || translations.uz;
    return dict[key] || translations.uz[key] || key;
  };

  const formatNumber = (num: number): string => {
    return new Intl.NumberFormat('ru-RU').format(Math.round(num));
  };

  const formatPrice = (priceUZS: number, forceCurrency?: Currency): string => {
    const activeCurr = forceCurrency || currency;
    if (activeCurr === 'USD') {
      const usdVal = Math.round(priceUZS / usdRate);
      return `$ ${formatNumber(usdVal)}`;
    }
    return `${formatNumber(priceUZS)} ${t('som')}`;
  };

  return (
    <LanguageContext.Provider value={{
      language,
      setLanguage,
      currency,
      setCurrency,
      usdRate,
      formatPrice,
      formatNumber,
      t,
      darkMode,
      setDarkMode
    }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used within LanguageProvider');
  return context;
};
