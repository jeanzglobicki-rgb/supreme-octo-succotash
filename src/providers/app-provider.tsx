'use client';

import { createContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { type Verse } from '@/lib/verses';

interface AppContextType {
  isAuthenticated: boolean;
  signIn: (method: 'anonymous' | 'google' | 'apple') => void;
  signOut: () => void;
  favorites: Verse[];
  toggleFavorite: (verse: Verse) => void;
  isFavorite: (verseReference: string) => boolean;
}

export const AppContext = createContext<AppContextType | undefined>(undefined);

const FAVORITES_STORAGE_KEY = 'daily-script-favorites';

export function AppProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [favorites, setFavorites] = useState<Verse[]>([]);

  useEffect(() => {
    // Check for auth state in local storage (mock)
    const storedAuth = localStorage.getItem('daily-script-auth');
    if (storedAuth === 'true') {
      setIsAuthenticated(true);
    }
    
    // Load favorites from local storage
    try {
      const storedFavorites = localStorage.getItem(FAVORITES_STORAGE_KEY);
      if (storedFavorites) {
        setFavorites(JSON.parse(storedFavorites));
      }
    } catch (error) {
      console.error('Could not parse favorites from localStorage', error);
      setFavorites([]);
    }
  }, []);

  const signIn = (method: 'anonymous' | 'google' | 'apple') => {
    // Mock sign-in
    localStorage.setItem('daily-script-auth', 'true');
    setIsAuthenticated(true);
    console.log(`Signed in with ${method}`);
  };

  const signOut = () => {
    // Mock sign-out
    localStorage.removeItem('daily-script-auth');
    setIsAuthenticated(false);
  };
  
  const toggleFavorite = useCallback((verse: Verse) => {
    setFavorites(prevFavorites => {
      const isAlreadyFavorite = prevFavorites.some(fav => fav.reference === verse.reference);
      let updatedFavorites;
      if (isAlreadyFavorite) {
        updatedFavorites = prevFavorites.filter(fav => fav.reference !== verse.reference);
      } else {
        updatedFavorites = [...prevFavorites, verse];
      }
      localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(updatedFavorites));
      return updatedFavorites;
    });
  }, []);

  const isFavorite = useCallback((verseReference: string) => {
    return favorites.some(fav => fav.reference === verseReference);
  }, [favorites]);

  const value = {
    isAuthenticated,
    signIn,
    signOut,
    favorites,
    toggleFavorite,
    isFavorite,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
