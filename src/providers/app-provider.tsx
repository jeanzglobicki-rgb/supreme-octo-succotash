'use client';

import { createContext, useState, useEffect, ReactNode, useCallback, useMemo } from 'react';
import { type Verse } from '@/lib/verses';
import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import { deleteDocumentNonBlocking, setDocumentNonBlocking } from '@/firebase/non-blocking-updates';

interface AppContextType {
  favorites: (Verse & {id: string})[];
  toggleFavorite: (verse: Verse) => void;
  isFavorite: (verseReference: string) => boolean;
  favoritesLoading: boolean;
}

export const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const { user } = useUser();
  const firestore = useFirestore();

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

  const value = {
    favorites: favorites || [],
    toggleFavorite,
    isFavorite,
    favoritesLoading,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
