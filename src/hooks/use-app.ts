'use client';

import { useContext } from 'react';
import { AppContext, AppContextType } from '@/providers/app-provider';
import { useUser } from '@/firebase';

// Explicitly define the return type for useApp
interface UseAppReturnType extends AppContextType {
  isAuthenticated: boolean;
  user: ReturnType<typeof useUser>['user'];
  userLoading: boolean;
}

export const useApp = (): UseAppReturnType => {
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
