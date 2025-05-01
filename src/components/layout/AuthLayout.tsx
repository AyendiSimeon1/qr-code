import React from 'react';
import { Logo } from '../ui/Logo'; // Adjust path

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ children, title }) => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md mb-6">
        <Logo className="mx-auto" width={180} /> {/* Larger logo for auth pages */}
      </div>
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
           <h2 className="text-center text-2xl font-bold text-gray-900 mb-6">{title}</h2>
          {children}
        </div>
      </div>
    </div>
  );
};