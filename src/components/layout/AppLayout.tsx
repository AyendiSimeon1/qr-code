import React from 'react';
import { Sidebar } from './Sidebar';

// import { Header } from './Header'; // Optional Header

interface AppLayoutProps {
  children: React.ReactNode;
  title?: string; // Optional title prop
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Optional Header could go here */}
        {/* <Header /> */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6 md:p-8 lg:p-10">
          {children}
        </main>
      </div>
    </div>
  );
};