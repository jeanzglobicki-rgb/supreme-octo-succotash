// src/firebase/firestore/use-doc.tsx
'use client';
import { useState, useEffect } from 'react';
import {
  doc,
  onSnapshot,
  type DocumentData,
  type DocumentReference,
} from 'firebase/firestore';
import { useFirestore } from '@/firebase/provider';
import { errorEmitter } from '../error-emitter';
import { FirestorePermissionError } from '../errors';

type Options = {
  listen: boolean;
};

export const useDoc = <T extends DocumentData>(
  ref: DocumentReference<T> | null,
  options: Options = { listen: true }
) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!ref) {
      setData(null);
      setLoading(true);
      return;
    }
    setLoading(true);
    const unsubscribe = onSnapshot(
      ref,
      (doc) => {
        if (doc.exists()) {
          setData({ ...doc.data(), id: doc.id });
        } else {
          setData(null);
        }
        setLoading(false);
        setError(null);
      },
      (err) => {
        const permissionError = new FirestorePermissionError({
            path: ref.path,
            operation: 'get'
        }, err);
        errorEmitter.emit('permission-error', permissionError);
        setError(permissionError);
        setLoading(false);
        setData(null);
      }
    );
    return () => unsubscribe();
  }, [ref, options.listen]);

  return { data, loading, error };
};
