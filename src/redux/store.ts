// src/redux/store.ts
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '@/redux/slices/auth';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    // Add other reducers here as your app grows
    // counter: counterReducer,
  },
  // devTools: process.env.NODE_ENV !== 'production', // Redux DevTools Extension is enabled by default in development
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {auth: AuthState, ...}
export type AppDispatch = typeof store.dispatch;