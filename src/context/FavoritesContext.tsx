import React, { createContext, useContext, useState, useEffect } from 'react';
import type { CarListing } from '../types/index.ts';
import { api } from '../services/api.ts';
import { useAuth } from './AuthContext.tsx';

interface FavoritesContextType {
  favorites: string[];
  isFavorite: (listingId: string) => boolean;
  toggleFavorite: (listing: CarListing) => Promise<void>;
  favoriteListings: CarListing[];
  recentlyViewed: CarListing[];
  addToRecentlyViewed: (car: CarListing) => void;
  loading: boolean;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export const FavoritesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState<string[]>(() => {
    const saved = localStorage.getItem('autosavdo_favorites');
    return saved ? JSON.parse(saved) : ['car-2', 'car-7'];
  });
  const [favoriteListings, setFavoriteListings] = useState<CarListing[]>([]);
  const [recentlyViewed, setRecentlyViewed] = useState<CarListing[]>(() => {
    const saved = localStorage.getItem('autosavdo_recent');
    return saved ? JSON.parse(saved) : [];
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    localStorage.setItem('autosavdo_favorites', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem('autosavdo_recent', JSON.stringify(recentlyViewed));
  }, [recentlyViewed]);

  // Load full favorite listings when user or favorites change
  useEffect(() => {
    if (favorites.length === 0) {
      setFavoriteListings([]);
      return;
    }
    setLoading(true);
    // Fetch all listings and filter
    api.getListings({ limit: 100 })
      .then(res => {
        const favs = res.listings.filter(l => favorites.includes(l.id));
        setFavoriteListings(favs);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [favorites]);

  const isFavorite = (listingId: string): boolean => {
    return favorites.includes(listingId);
  };

  const toggleFavorite = async (listing: CarListing) => {
    const carId = listing.id;
    const exists = favorites.includes(carId);
    
    // Optimistic update
    if (exists) {
      setFavorites(prev => prev.filter(id => id !== carId));
      setFavoriteListings(prev => prev.filter(l => l.id !== carId));
    } else {
      setFavorites(prev => [...prev, carId]);
      setFavoriteListings(prev => [listing, ...prev]);
    }

    if (user) {
      try {
        await api.toggleFavorite(user.id, carId);
      } catch (err) {
        console.error('Failed to sync favorite with server', err);
      }
    }
  };

  const addToRecentlyViewed = (car: CarListing) => {
    setRecentlyViewed(prev => {
      const filtered = prev.filter(c => c.id !== car.id);
      return [car, ...filtered].slice(0, 8);
    });
  };

  return (
    <FavoritesContext.Provider value={{
      favorites,
      isFavorite,
      toggleFavorite,
      favoriteListings,
      recentlyViewed,
      addToRecentlyViewed,
      loading
    }}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) throw new Error('useFavorites must be used within FavoritesProvider');
  return context;
};
