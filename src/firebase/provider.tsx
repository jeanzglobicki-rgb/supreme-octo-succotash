// src/firebase/provider.tsx
'use client';
import React, { createContext, useContext, ReactNode } from 'react';
import type { FirebaseApp } from 'firebase/app';
import type { Auth } from 'firebase/auth';
import type { Firestore } from 'firebase/firestore';

interface FirebaseContextType {
  app: FirebaseApp | null;
  auth: Auth | null;
  firestore: Firestore | null;
}

const FirebaseContext = createContext<FirebaseContextType>({
  app: null,
  auth: null,
  firestore: null,
});

export const FirebaseProvider = ({
  children,
  firebaseApp,
  auth,
  firestore,
}: {
  children: ReactNode;
  firebaseApp: FirebaseApp;
  auth: Auth;
  firestore: Firestore;
}) => {
  return (
    <FirebaseContext.Provider
      value={{ app: firebaseApp, auth, firestore }}
    >
      {children}
    </FirebaseContext.Provider>
  );
};

export const useFirebase = (): FirebaseContextType => {
  return useContext(FirebaseContext);
};

export const useFirebaseApp = (): FirebaseApp | null => {
  return useContext(FirebaseContext).app;
};

export const useAuth = (): Auth | null => {
  return useContext(FirebaseContext).auth;
};

export const useFirestore = (): Firestore | null => {
  return useContext(FirebaseContext).firestore;
};

export const getFirebase = (): FirebaseContextType => {
    return useFirebase();
}
