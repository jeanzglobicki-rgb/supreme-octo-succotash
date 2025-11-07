'use client';

import { createContext, useState, useEffect, ReactNode, useCallback, useMemo } from 'react';
import { type Verse } from '@/lib/verses';
import { useUser, useFirestore, useDoc, useCollection, useMemoFirebase } from '@/firebase';
import {
  collection,
  doc,
  serverTimestamp,
} from 'firebase/firestore';
import { deleteDocumentNonBlocking, setDocumentNonBlocking, updateDocumentNonBlocking } from '@/firebase/non-blocking-updates';

export interface AppContextType {
  favorites: (Verse & {id: string})[];
  toggleFavorite: (verse: Verse) => void;
  isFavorite: (verseReference: string) => boolean;
  favoritesLoading: boolean;
  isPremium: boolean;
  upgradeToPremium: () => Promise<void>;
  notificationPreference: string;
  setNotificationPreference: (preference: 'daily' | 'off') => void;
}

export const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const { user } = useUser();
  const firestore = useFirestore();

  // User document hook
  const userDocRef = useMemoFirebase(() => {
    if (!user || !firestore) return null;
    return doc(firestore, 'users', user.uid);
  }, [user, firestore]);
  const { data: userData } = useDoc(userDocRef);
  
  const isPremium = useMemo(() => userData?.isPremium || false, [userData]);
  const notificationPreference = useMemo(() => userData?.notificationPreferences || 'off', [userData]);

  const favoritesQuery = useMemoFirebase(() => {
      if (!user || !firestore) return null;
      return collection(firestore, 'users', user.uid, 'favoriteVerses');
  }, [user, firestore]);

  const { data: favorites, loading: favoritesLoading } = useCollection(favoritesQuery);

  const toggleFavorite = useCallback((verse: Verse) => {
    if (!user || !firestore) return;

    const favoritesCol = collection(firestore, 'users', user.uid, 'favoriteVerses');
    const isAlreadyFavorite = favorites?.some(fav => fav.reference === verse.reference);
    
    if (isAlreadyFavorite) {
      const favoriteDoc = favorites?.find(fav => fav.reference === verse.reference);
      if (favoriteDoc?.id) {
          const docRef = doc(favoritesCol, favoriteDoc.id);
          deleteDocumentNonBlocking(docRef)
      }
    } else {
        const docRef = doc(favoritesCol, verse.reference.replace(/[\s:]+/g, '-'));
        setDocumentNonBlocking(docRef, {
            ...verse,
            createdAt: serverTimestamp()
        }, { merge: true });
    }
  }, [user, firestore, favorites]);

  const isFavorite = useCallback((verseReference: string) => {
    return favorites?.some(fav => fav.reference === verseReference) || false;
  }, [favorites]);

  const upgradeToPremium = useCallback(async () => {
    if (!userDocRef) {
      throw new Error("User document reference not available.");
    }
    // In a real app, this would involve a payment gateway.
    // Here, we'll just update the user's document.
    updateDocumentNonBlocking(userDocRef, { isPremium: true });
  }, [userDocRef]);

  const setNotificationPreference = useCallback((preference: 'daily' | 'off') => {
    if (!userDocRef) return;
    updateDocumentNonBlocking(userDocRef, { notificationPreferences: preference });
  }, [userDocRef]);

  const value = {
    favorites: favorites || [],
    toggleFavorite,
    isFavorite,
    favoritesLoading,
    isPremium,
    upgradeToPremium,
    notificationPreference,
    setNotificationPreference,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
