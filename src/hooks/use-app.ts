'use client';

import { useContext } from 'react';
import { AppContext } from '@/providers/app-provider';
import { useUser } from '@/firebase';

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  const { user, loading: userLoading } = useUser();
  const isAuthenticated = !!user;

  return {
    ...context,
    isAuthenticated,
    user,
    userLoading,
  };
};
