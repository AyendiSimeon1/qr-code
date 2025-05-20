// src/app/login/page.tsx
"use client";
import React, { useEffect } from 'react'; // Import useEffect
import { useRouter } from 'next/navigation';

import { AuthLayout } from '@/components/layout/AuthLayout';

// Import Redux hooks and the login action
import { useAppDispatch, useAppSelector } from '@/redux/hooks/auth';
import { login, clearAuthError } from '@/redux/slices/auth';
import { LoginForm, LoginFormData } from '@/components/auth/LoginForm';

const ONE_HOUR_MS = 60 * 60 * 1000;

const LoginPage: React.FC = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();

  // Select state from Redux store
  const { isLoading, error, isAuthenticated } = useAppSelector(state => state.auth);

  // Check localStorage for expiry on mount
  useEffect(() => {
    const loginTimestamp = localStorage.getItem('loginTimestamp');
    const token = localStorage.getItem('token');
    if (loginTimestamp) {
      const now = Date.now();
      const diff = now - parseInt(loginTimestamp, 10);
      if (diff > ONE_HOUR_MS) {
        localStorage.clear();
        localStorage.removeItem('loginTimestamp');
      }
    }
    // Redirect to login if no token
    if (!token) {
      router.push('/login');
    }
  }, []);

  // Redirect on successful authentication
  useEffect(() => {
    if (isAuthenticated) {
      // Set login timestamp on successful login
      localStorage.setItem('loginTimestamp', Date.now().toString());
      console.log("Authenticated, redirecting to dashboard...");
      router.push('/dashboard');
      // Optional: Clear error state after successful login and redirect
      dispatch(clearAuthError());
    }
  }, [isAuthenticated, router, dispatch]); // Depend on isAuthenticated, router, and dispatch

  // Clear error when component mounts or if you navigate away
  useEffect(() => {
    return () => {
      // Cleanup function: clear error when component unmounts
      dispatch(clearAuthError());
    };
  }, [dispatch]);


  const handleLoginSubmit = async (data: LoginFormData) => {
    // Dispatch the login async thunk
    // The thunk handles API call, loading state, success/failure, and state updates
    dispatch(login(data));

    // Note: Redirection is now handled by the useEffect watching 'isAuthenticated'
    // We no longer need the try/catch block or local isLoading state here
    // because the thunk manages the async logic and state updates.
  };

  return (
    <AuthLayout title="Login">
       {/* Pass isLoading and error from Redux state */}
       <LoginForm onSubmit={handleLoginSubmit} isLoading={isLoading} />

       {/* Display API errors from Redux state */}
       {error && <p className="mt-4 text-center text-sm text-red-600">{error}</p>}
    </AuthLayout>
  );
};

export default LoginPage;