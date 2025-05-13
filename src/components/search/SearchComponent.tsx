"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Logo } from '../../components/ui/Logo';
import { Button } from '../../components/ui/Button';
import { InputField } from '../../components/ui/InputField';
import { FeatureCard } from '../ui/FeatureCard';
import { SearchResults } from './SearchResults';
import { useSearch } from '@/redux/hooks/search';

// Placeholder Icons
const LockClosedIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props} className="w-4 h-4">
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
  </svg>
);
const LocationMarkerIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
  </svg>
);
const BuildingLibraryIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75z" />
  </svg>
);
const DocumentCheckIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

export const PublicSearchPage: React.FC = () => {
  const router = useRouter();
  const { results, isLoading, error, searchTerm, handleSearch: performSearch, clearSearch } = useSearch();
  const [localSearchTerm, setLocalSearchTerm] = useState('');

  const handleSearch = (event: React.FormEvent) => {
    event.preventDefault();
    if (localSearchTerm.trim()) {
      performSearch(localSearchTerm);
    }
  };

  const handleLoginClick = () => {
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="flex justify-between items-center mb-16 md:mb-24">
          <Logo href="/" />
          <Button
            variant="primary"
            size="md"
            onClick={handleLoginClick}
            leftIcon={<LockClosedIcon />}
          >
            Log In
          </Button>
        </header>

        <main>
          {/* Search Section */}
          <section className="mb-16 md:mb-24 text-center">
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-5 sm:mb-6">
              Search The Record
            </h2>
            <form
              onSubmit={handleSearch}
              className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 max-w-xl mx-auto"
            >
              <InputField
                name="search"
                placeholder="Search company name"
                value={localSearchTerm}
                onChange={(e) => setLocalSearchTerm(e.target.value)}
                className="w-full text-sm sm:text-base"
                containerClassName="mb-0 flex-grow"
                aria-label="Search Company"
              />
              <Button
                type="submit"
                variant="primary"
                size="md"
                className="w-full sm:w-auto flex-shrink-0"
              >
                Search
              </Button>
            </form>
          </section>

          {/* Search Results Section */}
          <section className="mb-16">
            <SearchResults results={results} isLoading={isLoading} error={error} />
          </section>

          {/* Discover Section */}
          <section className="mb-12">
            <h3 className="text-center text-lg font-semibold uppercase tracking-wider text-gray-600 mb-8 md:mb-10">
              Discover Online Search
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-4xl mx-auto">
              <FeatureCard
                title="Locate Company address"
                icon={<LocationMarkerIcon className="w-12 h-12 text-blue-800" />}
              />
              <FeatureCard
                title="Follow Company"
                icon={<BuildingLibraryIcon className="w-12 h-12 text-blue-800" />}
              />
              <FeatureCard
                title="View Test Data"
                icon={<DocumentCheckIcon className="w-12 h-12 text-blue-800" />}
              />
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};
