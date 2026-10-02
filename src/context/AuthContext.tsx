import React, { createContext, useContext, useState, useEffect } from 'react';
import type { User } from '../types/index.ts';
import { api } from '../services/api.ts';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isDealer: boolean;
  login: (email: string) => Promise<User>;
  register: (data: Partial<User>) => Promise<User>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => Promise<User>;
  authModalOpen: boolean;
  authMode: 'login' | 'register';
  openAuth: (mode?: 'login' | 'register') => void;
  closeAuth: () => void;
  switchUser: (role: 'admin' | 'dealer' | 'user') => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('autosavdo_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return null;
      }
    }
    // Default to a demo active user so visitors can immediately test all features without friction
    return {
      id: 'user_private_1',
      name: 'Alisher Qodirov',
      email: 'alisher@gmail.com',
      phone: '+998 90 123 45 67',
      telegram: '@alisher_uz',
      role: 'user',
      isVerifiedDealer: false,
      region: 'Toshkent shahri',
      city: 'Chilonzor tumani',
      createdAt: '2024-03-10T00:00:00.000Z'
    };
  });

  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

  useEffect(() => {
    if (user) {
      localStorage.setItem('autosavdo_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('autosavdo_user');
    }
  }, [user]);

  const login = async (email: string) => {
    const loggedUser = await api.login(email);
    setUser(loggedUser);
    setAuthModalOpen(false);
    return loggedUser;
  };

  const register = async (data: Partial<User>) => {
    const newUser = await api.register(data);
    setUser(newUser);
    setAuthModalOpen(false);
    return newUser;
  };

  const logout = () => {
    setUser(null);
  };

  const updateProfile = async (data: Partial<User>) => {
    if (!user) throw new Error('Not authenticated');
    const updated = await api.updateProfile(user.id, data);
    setUser(updated);
    return updated;
  };

  const openAuth = (mode: 'login' | 'register' = 'login') => {
    setAuthMode(mode);
    setAuthModalOpen(true);
  };

  const closeAuth = () => {
    setAuthModalOpen(false);
  };

  // Quick switcher for demo and testing roles easily
  const switchUser = async (role: 'admin' | 'dealer' | 'user') => {
    let email = 'alisher@gmail.com';
    if (role === 'admin') email = 'admin@autosavdo.uz';
    if (role === 'dealer') email = 'dealer@samauto.uz';
    try {
      const u = await api.login(email);
      setUser(u);
    } catch {
      // Fallback
    }
  };

  const isAdmin = user?.role === 'admin';
  const isDealer = user?.role === 'dealer' || (user?.isVerifiedDealer ?? false);

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      isAdmin,
      isDealer,
      login,
      register,
      logout,
      updateProfile,
      authModalOpen,
      authMode,
      openAuth,
      closeAuth,
      switchUser
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
