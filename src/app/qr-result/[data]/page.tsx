// src/app/qr-result/[data]/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { AppLayout } from '@/components/layout/AppLayout';

// Placeholder for actual data fetching logic
interface QrResultData {
  id: string;
  title: string;
  description: string;
  details: Record<string, any>;
}

const fetchQrData = async (scannedData: string): Promise<QrResultData | null> => {
  // In a real application, you would fetch this data from your backend
  // using the scannedData as an identifier.
  console.log('Fetching data for:', scannedData);
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Example: If scannedData is a specific ID, return mock data
  if (scannedData === 'Simulated-QR-Data-12345') {
    return {
      id: scannedData,
      title: 'Simulated Equipment Record',
      description: 'This is a detailed record for the scanned QR code.',
      details: {
        serialNumber: 'SN-XYZ-789',
        model: 'Model T-1000',
        manufacturer: 'Cyberdyne Systems',
        lastServiceDate: '2024-01-15',
        status: 'Operational',
      },
    };
  }
  return null; // Or throw an error if data not found
};

const QrResultPage: React.FC = () => {
  const params = useParams();
  const scannedData = params.data ? decodeURIComponent(params.data as string) : null;
  const [data, setData] = useState<QrResultData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (scannedData) {
      setLoading(true);
      setError(null);
      fetchQrData(scannedData)
        .then(result => {
          if (result) {
            setData(result);
          } else {
            setError('No data found for this QR code.');
          }
        })
        .catch(err => {
          console.error('Error fetching QR data:', err);
          setError('Failed to load data. Please try again.');
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setError('No QR data provided.');
      setLoading(false);
    }
  }, [scannedData]);

  return (
    <AppLayout title={data ? `Details: ${data.title}` : 'QR Code Result'}>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-semibold mb-6 text-gray-800">
          {data ? data.title : 'QR Code Result'}
        </h1>

        {loading && (
          <div className="p-6 border border-gray-300 rounded-lg shadow-sm bg-white text-center">
            <p className="text-lg text-gray-600">Loading details...</p>
            {/* You can add a spinner component here */}
          </div>
        )}

        {error && (
          <div className="p-6 border border-red-300 bg-red-50 rounded-lg shadow-sm text-center">
            <h2 className="text-xl font-medium text-red-700">Error</h2>
            <p className="text-gray-700 mt-2">{error}</p>
          </div>
        )}

        {!loading && !error && data && (
          <div className="p-6 border border-gray-300 rounded-lg shadow-sm bg-white space-y-4">
            <p className="text-lg text-gray-700"><strong>ID:</strong> {data.id}</p>
            <p className="text-lg text-gray-700"><strong>Description:</strong> {data.description}</p>
            <h2 className="text-2xl font-semibold text-gray-800 mt-6 mb-3">Additional Details:</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-md">
              {Object.entries(data.details).map(([key, value]) => (
                <div key={key} className="py-2">
                  <span className="font-medium text-gray-600 capitalize">{key.replace(/([A-Z])/g, ' $1')}: </span>
                  <span className="text-gray-800">{String(value)}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {!loading && !data && !error && (
             <div className="p-6 border border-gray-300 rounded-lg shadow-sm bg-white text-center">
                <p className="text-lg text-gray-600">No details to display for the provided QR code.</p>
            </div>
        )}

      </div>
    </AppLayout>
  );
};

export default QrResultPage;