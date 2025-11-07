// src/firebase/client-provider.tsx
'use client';
import { initializeFirebase } from '@/firebase/index';
import { FirebaseProvider } from '@/firebase/provider';
import React, { ReactNode, useEffect, useState } from 'react';
import type { FirebaseApp } from 'firebase/app';
import type { Auth } from 'firebase/auth';
import type { Firestore } from 'firebase/firestore';

type FirebaseInstances = {
  app: FirebaseApp;
  auth: Auth;
  firestore: Firestore;
};

export const FirebaseClientProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [firebase, setFirebase] = useState<FirebaseInstances | null>(null);
  useEffect(() => {
    const instances = initializeFirebase();
    setFirebase(instances);
  }, []);

  if (!firebase) {
    // You can show a loader here if you want.
    return null;
  }
  return (
    <FirebaseProvider
      firebaseApp={firebase.app}
      auth={firebase.auth}
      firestore={firebase.firestore}
    >
      {children}
    </FirebaseProvider>
  );
};
