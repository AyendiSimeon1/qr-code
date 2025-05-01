"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { LoginFormData, LoginForm } from '@/components/auth/LoginForm';
import { AuthLayout } from '@/components/layout/AuthLayout';

const LoginPage: React.FC = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  // Potentially add state for displaying API errors below the form
  // const [apiError, setApiError] = useState<string | null>(null);

  const handleLoginSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    // setApiError(null); // Clear previous errors
    console.log('Login attempt with:', data);

    try {
      // --- Your Actual API Call Logic Here ---
      // const response = await yourAuthApi.login(data.email, data.password);
      // handle successful login (e.g., store token, update user state)
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      console.log("Login successful (simulated)");
      router.push('/dashboard'); // Redirect on success

    } catch (error) {
      console.error("Login failed:", error);
      // Handle login failure (e.g., show error message)
      // setApiError("Invalid email or password."); // Example error message
      setIsLoading(false); // Ensure loading state is reset on error
    }
    // Note: No need to set isLoading to false on success if redirecting immediately
  };

  return (
    <AuthLayout title="Login">
       <LoginForm onSubmit={handleLoginSubmit} isLoading={isLoading} />
       {/* Optional: Display API errors here */}
       {/* {apiError && <p className="mt-4 text-center text-sm text-red-600">{apiError}</p>} */}
    </AuthLayout>
  );
};

export default LoginPage;