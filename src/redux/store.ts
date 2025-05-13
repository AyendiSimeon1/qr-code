// src/redux/store.ts
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '@/redux/slices/auth';
import recordsReducer from '@/redux/slices/records';
import searchReducer from '@/redux/slices/search';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    records: recordsReducer,
    search: searchReducer,
    // Add other reducers here as your app grows
  },
  // devTools: process.env.NODE_ENV !== 'production', // Redux DevTools Extension is enabled by default in development
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {auth: AuthState, ...}
export type AppDispatch = typeof store.dispatch;