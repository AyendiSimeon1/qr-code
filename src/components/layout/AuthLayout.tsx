import React from 'react';
import Image from 'next/image';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ children, title }) => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center py-6 px-4 sm:px-6 lg:px-8">
      {/* Logo Container: constrained width for better balance */}
      <div className="w-full max-w-xs mb-6 flex justify-center">
        <Image
          src="/ofissa-logo.png"
          alt="Logo"
          width={200}
          height={80}
          className="object-contain"
        />
      </div>

      {/* Auth Card */}
      <div className="w-full max-w-md">
        <div className="bg-white py-6 px-6 shadow-md rounded-lg">
          <h2 className="text-center text-xl font-semibold text-gray-900 mb-4">
            {title}
          </h2>
          {children}
        </div>
      </div>
    </div>
  );
};
