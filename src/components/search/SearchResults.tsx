// src/components/search/SearchResults.tsx
import React from 'react';

interface Company {
  id: string;
  name: string;
  address?: string;
  email?: string;
  phone?: string;
  // Add other fields as needed based on the API response
}

interface SearchResultsProps {
  results: Company[];
  isLoading: boolean;
  error: string | null;
}

export const SearchResults: React.FC<SearchResultsProps> = ({ results, isLoading, error }) => {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-700"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-800 rounded-md p-4 my-4">
        <p className="text-sm">{error}</p>
      </div>
    );
  }

  if (results.length === 0) {
    return null; // Don't show anything if there are no results yet
  }

  return (
    <div className="mt-8 bg-white shadow-md rounded-lg overflow-hidden">
      <div className="px-4 py-5 sm:px-6 bg-gray-50 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900">Search Results</h3>
        <p className="mt-1 text-sm text-gray-600">{results.length} companies found</p>
      </div>
      <ul className="divide-y divide-gray-200">
        {results.map((company) => (
          <li key={company.id} className="px-4 py-4 sm:px-6 hover:bg-gray-50 transition duration-150">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-lg font-semibold text-blue-800">{company.name}</h4>
                {company.address && (
                  <p className="mt-1 text-sm text-gray-600">
                    <span className="font-medium">Address:</span> {company.address}
                  </p>
                )}
                {company.email && (
                  <p className="mt-1 text-sm text-gray-600">
                    <span className="font-medium">Email:</span> {company.email}
                  </p>
                )}
                {company.phone && (
                  <p className="mt-1 text-sm text-gray-600">
                    <span className="font-medium">Phone:</span> {company.phone}
                  </p>
                )}
              </div>
              <div>
                <button
                  className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-full shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  onClick={() => window.open(`/company/${company.id}`, '_blank')}
                >
                  View Details
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};