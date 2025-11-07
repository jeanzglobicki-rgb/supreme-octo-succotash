// src/firebase/firestore/use-collection.tsx
'use client';
import { useState, useEffect } from 'react';
import {
  collection,
  onSnapshot,
  query,
  where,
  type DocumentData,
  type Query,
  type CollectionReference,
} from 'firebase/firestore';
import { useFirestore } from '@/firebase/provider';
import { errorEmitter } from '../error-emitter';
import { FirestorePermissionError } from '../errors';

type Options = {
  listen: boolean;
};

export const useCollection = <T extends DocumentData>(
  q: Query<T> | CollectionReference<T> | null,
  options: Options = { listen: true }
) => {
  const [data, setData] = useState<T[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!q) {
      // Query is not ready yet, do nothing.
      setData(null);
      setLoading(true);
      return;
    }
    setLoading(true);

    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        const data: T[] = [];
        querySnapshot.forEach((doc) => {
          data.push({ ...doc.data(), id: doc.id });
        });
        setData(data);
        setLoading(false);
        setError(null);
      },
      (err) => {
        console.error('onSnapshot error:', err);
        const permissionError = new FirestorePermissionError({
          path: 'path' in q ? q.path : 'unknown',
          operation: 'list',
        }, err);
        errorEmitter.emit('permission-error', permissionError);
        setError(permissionError);
        setLoading(false);
        setData(null);
      }
    );
    return () => unsubscribe();
  }, [q, options.listen]);

  return { data, loading, error };
};
