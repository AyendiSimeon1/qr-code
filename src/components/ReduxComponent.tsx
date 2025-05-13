// src/components/ReduxProvider.tsx
"use client"; // This is a client component

import { Provider } from 'react-redux';
import { store } from '@/redux/store'; // Adjust path if needed
import { useEffect } from 'react';
import { checkAuthStatus } from '@/redux/slices/auth'; // Import the check thunk

interface ReduxProviderProps {
  children: React.ReactNode;
}

export function ReduxProvider({ children }: ReduxProviderProps) {
   // Dispatch checkAuthStatus on initial load
   useEffect(() => {
     store.dispatch(checkAuthStatus());
   }, []); // Empty dependency array ensures this runs once on mount

  return <Provider store={store}>{children}</Provider>;
}

