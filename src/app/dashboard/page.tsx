"use client";
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/Button';
import { RecordsTable } from '@/components/ui/RecordsTable';
import { StatCard } from '@/components/ui/StatsCard';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface RecordData {
  id: string | number;
  companyName: string;
  email: string;
  dateOfExpiration: string;
  testStatus: 'Expired' | 'Current' | 'Warning';
}

// --- Paste PlusIcon definition here ---
const PlusIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props} className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
  </svg>
);


const DashboardPage: React.FC = () => {
  const [records, setRecords] = useState<any>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [certs, setCerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const handleCreateRecord = () => {
    router.push('/records/create');
  };

  // In a real app, fetch data in useEffect or using Next.js data fetching methods
  // useEffect(() => {
  //   setIsLoading(true);
  //   fetchYourRecords()
  //     .then(data => setRecords(data))
  //     .catch(error => console.error("Failed to fetch records", error))
  //     .finally(() => setIsLoading(false));
  // }, []);

  // const totalRecords = records.length || ''; // Or get from API metadata


  

  useEffect(() => {
    const fetchCerts = async () => {
      if (typeof window === 'undefined') return;
      const token = localStorage.getItem('authToken');
      console.log('i am the dashboard token', token);
      try {
        const res = await fetch('/api/all-certificates', {
          method: 'GET', // or 'GET'
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          }
        },);
        const json = await res.json();
        setRecords(json.data || []);
      } catch (err) {
        console.error('Error fetching certificates:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCerts();
  }, []);

  console.log('Fetched certificates:', records);

  return (
    <AppLayout>
      {/* Header Section */}
      <div className="mb-6 md:mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-4 md:mb-0">
            Overview
          </h1>
           <Button
            variant="success" // Use the success variant or className override
            // className="bg-green-600 text-white hover:bg-green-700 focus:ring-green-500" // Alternative if no variant
            onClick={handleCreateRecord}
            leftIcon={<PlusIcon />}
          >
            Create new Record
          </Button>
        </div>

        {/* Stat Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
          <StatCard title="Total Test Record Count" value={2000} /> {/* Value from image */}
          <StatCard title="Total Test Record Count" value={2000} /> {/* Value from image */}
        </div>
      </div>

      {/* Records Table Section */}
      <div>
        <RecordsTable records={records} isLoading={isLoading} />
      </div>

    </AppLayout>
  );
};

export default DashboardPage;