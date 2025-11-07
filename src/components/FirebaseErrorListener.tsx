// src/components/FirebaseErrorListener.tsx
'use client';

import { useEffect } from 'react';
import { errorEmitter } from '@/firebase/error-emitter';
import { useToast } from '@/hooks/use-toast';
import { FirestorePermissionError } from '@/firebase/errors';

export function FirebaseErrorListener() {
  const { toast } = useToast();

  useEffect(() => {
    const handlePermissionError = (error: FirestorePermissionError) => {
      console.error('Firestore Permission Error:', error.toFriendlyString());
      toast({
        variant: 'destructive',
        title: 'Permission Denied',
        description:
          'You do not have permission to perform this action. Check the console for details.',
      });

      // In a real development environment, you might want to throw the error
      // to make it visible in Next.js's error overlay.
      if (process.env.NODE_ENV === 'development') {
        throw error;
      }
    };

    errorEmitter.on('permission-error', handlePermissionError);

    return () => {
      errorEmitter.off('permission-error', handlePermissionError);
    };
  }, [toast]);

  return null;
}
