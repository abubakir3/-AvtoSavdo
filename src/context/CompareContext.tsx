import React, { createContext, useContext, useState, useEffect } from 'react';
import type { CarListing } from '../types/index.ts';

interface CompareContextType {
  compareCars: CarListing[];
  addToCompare: (car: CarListing) => boolean;
  removeFromCompare: (carId: string) => void;
  clearCompare: () => void;
  isComparing: (carId: string) => boolean;
}

const CompareContext = createContext<CompareContextType | undefined>(undefined);

export const CompareProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [compareCars, setCompareCars] = useState<CarListing[]>(() => {
    const saved = localStorage.getItem('autosavdo_compare');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('autosavdo_compare', JSON.stringify(compareCars));
  }, [compareCars]);

  const addToCompare = (car: CarListing): boolean => {
    if (compareCars.some(c => c.id === car.id)) {
      removeFromCompare(car.id);
      return false;
    }
    if (compareCars.length >= 4) {
      alert('Maksimal 4 ta avtomobilni bir vaqtning o\'zida taqqoslash mumkin.');
      return false;
    }
    setCompareCars(prev => [...prev, car]);
    return true;
  };

  const removeFromCompare = (carId: string) => {
    setCompareCars(prev => prev.filter(c => c.id !== carId));
  };

  const clearCompare = () => {
    setCompareCars([]);
  };

  const isComparing = (carId: string): boolean => {
    return compareCars.some(c => c.id === carId);
  };

  return (
    <CompareContext.Provider value={{
      compareCars,
      addToCompare,
      removeFromCompare,
      clearCompare,
      isComparing
    }}>
      {children}
    </CompareContext.Provider>
  );
};

export const useCompare = () => {
  const context = useContext(CompareContext);
  if (!context) throw new Error('useCompare must be used within CompareProvider');
  return context;
};
