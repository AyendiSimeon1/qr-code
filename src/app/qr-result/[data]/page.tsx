// src/app/qr-result/[data]/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { AppLayout } from '@/components/layout/AppLayout';

// Interface for the data expected from your /api/get-cert/ endpoint (via proxy)
interface ApiCertificateData {
  cert_no: string;
  title: string;
  description?: string;
  issued_to?: string;
  valid_until?: string;
  status?: string;
  [key: string]: any;
}

// Interface for the data structure used by the component to display results
interface QrResultDisplayData {
  id: string;
  title: string;
  description: string;
  details: Record<string, any>;
  originalScannedUrl: string;
}

const extractCertNoFromUrl = (scannedUrl: string): string | null => {
  try {
    const url = new URL(scannedUrl);
    const pathSegments = url.pathname.split('/').filter(segment => segment.length > 0);
    const lastSegment = pathSegments.pop();
    return lastSegment ? lastSegment.trim() : null;
  } catch (error) {
    console.error("Error parsing URL to extract cert_no:", error);
    return null;
  }
};

const fetchCertificateDataByCertNo = async (
  certNo: string,
  originalScannedUrl: string
): Promise<QrResultDisplayData | null> => {
  // --- Get Auth Token from localStorage ---
  // let authToken: string | null = null;
  const authToken = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJ0ZXN0QGdtYWlsLmNvbSIsImF1ZCI6InVzZXIiLCJpYXQiOjE3NDc0MTQ4NjIsImV4cCI6MTc0NzQxODQ2MiwidXNlcl9pZCI6MCwiZW1haWwiOiJ0ZXN0QGdtYWlsLmNvbSJ9.suix4v9We8YCgPmQOd2RVp8uVmklphNcSoskOU4xVWs';
  // if (typeof window !== 'undefined') { // Ensure localStorage is available (client-side)
  //   authToken = localStorage.getItem('authToken'); // REPLACE 'yourAuthTokenKey'
  // }

  console.log('i am the auth token for the scanner', authToken);

  // Construct URL for your Next.js proxy API route
  const proxyApiUrl = `/api/get-certificate-proxy?cert_no=${encodeURIComponent(certNo)}`;
  console.log('Fetching certificate data via proxy:', proxyApiUrl);

  try {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    if (authToken) {
      // The proxy API route expects this header.
      // The proxy will then forward this (or a different one) to the third-party API.
      headers['Authorization'] = `Bearer ${authToken}`; // Assuming Bearer token
    } else {
      console.warn('Auth token not found in localStorage. Requesting proxy without it.');
      // The proxy API will decide if this is an error or not.
    }

    const response = await fetch(proxyApiUrl, {
      method: 'GET',
      headers: headers,
    });

    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json(); // Proxy should return JSON errors
      } catch (e) {
        errorData = { error: await response.text() };
      }
      console.error(`Proxy API Error: ${response.status}`, errorData);
      throw new Error(errorData.error || `Failed to fetch data via proxy. Status: ${response.status}`);
    }

    const apiData: ApiCertificateData = await response.json(); // Data is now from your proxy
    console.log('Received API data via proxy:', apiData);

    // if (!apiData || !apiData.cert_no) {
    //   console.warn("API response via proxy is missing essential data or cert_no.", apiData);
    //   return null;
    // }

    const {
      cert_no: id,
      title,
      description: apiDescription,
      issued_to,
      valid_until,
      status,
      ...otherDetails
    } = apiData;

    const displayDetails: Record<string, any> = { ...otherDetails };
    if (issued_to) displayDetails.issuedTo = issued_to;
    if (valid_until) displayDetails.validUntil = valid_until;
    if (status) displayDetails.status = status;
    delete displayDetails.cert_no;
    delete displayDetails.title;
    delete displayDetails.description;

    return {
      id: id,
      title: title || `Certificate ${id}`,
      description: apiDescription || `Details for certificate ${id}.`,
      details: displayDetails,
      originalScannedUrl: originalScannedUrl,
    };

  } catch (error: any) {
    console.error('Error in fetchCertificateDataByCertNo (client-side):', error);
    throw error; // Re-throw to be caught by useEffect's .catch
  }
};


const QrResultPage: React.FC = () => {
  const params = useParams();
  const rawDecodedDataFromUrl = params.data ? decodeURIComponent(params.data as string) : null;
  const cleanedScannedUrl = rawDecodedDataFromUrl ? rawDecodedDataFromUrl.trim() : null;

  const [data, setData] = useState<QrResultDisplayData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [extractedCertNo, setExtractedCertNo] = useState<string | null>(null);

  console.log(' you i am the data', data);

  useEffect(() => {
    console.log('QrResultPage - Raw decoded data from URL param:', `"[${rawDecodedDataFromUrl}]"`);
    console.log('QrResultPage - Cleaned Scanned URL:', `"[${cleanedScannedUrl}]"`);

    if (cleanedScannedUrl) {
      const certNo = extractCertNoFromUrl(cleanedScannedUrl);
      setExtractedCertNo(certNo);
      console.log('QrResultPage - Extracted cert_no:', `"[${certNo}]"`);

      if (certNo) {
        setLoading(true);
        setError(null);
        setData(null);

        fetchCertificateDataByCertNo(certNo, cleanedScannedUrl)
          .then(result => {
            if (result) {
              setData(result);
            } else {
              setError(`No certificate data found for identifier: "${certNo}".`);
            }
          })
          .catch(err => {
            console.error('Caught error during data fetching (client-side):', err);
            setError(err.message || 'An unexpected error occurred while fetching data.');
          })
          .finally(() => {
            setLoading(false);
          });
      } else {
        setError(`Could not extract a valid certificate identifier from: "${cleanedScannedUrl}"`);
        setLoading(false);
      }
    } else {
      setError('No QR data provided in the URL.');
      setLoading(false);
    }
  }, [cleanedScannedUrl, rawDecodedDataFromUrl]);

  // ... (rest of the JSX for QrResultPage remains the same)
  return (
    <AppLayout title={data ? `Certificate: ${data.title}` : 'QR Code Result'}>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-semibold mb-6 text-gray-800">
          {loading ? 'Loading Certificate Details...' : data ? data.title : 'Certificate Result'}
        </h1>

        {loading && (
          <div className="p-6 border border-gray-300 rounded-lg shadow-sm bg-white text-center">
            <p className="text-lg text-gray-600">
              Loading details for certificate ID: "{extractedCertNo || 'Extracting ID...'}"...
            </p>
            <div className="animate-pulse mt-2">Fetching data...</div>
          </div>
        )}

        {error && (
          <div className="p-6 border border-red-300 bg-red-50 rounded-lg shadow-sm text-center">
            <h2 className="text-xl font-medium text-red-700">Error</h2>
            <p className="text-red-600 mt-2">{error}</p>
            {cleanedScannedUrl && <p className="text-sm text-gray-500 mt-2">Scanned value (processed): {cleanedScannedUrl}</p>}
          </div>
        )}

        {!loading && !error && data && (
          <div className="p-6 border border-gray-300 rounded-lg shadow-sm bg-white space-y-4">
            <p className="text-md text-gray-600">
              Certificate ID (from API):
              <strong className="block text-lg text-gray-800 break-all">{data.id}</strong>
            </p>
            {data.details.data.company_name && <p className="text-lg text-gray-700"><strong>Description:</strong> {data.description}</p>}
            <h1>how : { data.details.data.certificate_type
 }</h1>
            <h2 className="text-2xl font-semibold text-gray-800 mt-6 mb-3">Certificate Details:</h2>
            {Object.keys(data.details).length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3 bg-gray-50 p-4 rounded-md">
                {Object.entries(data.details).map(([key, value]) => (
                  <div key={key} className="py-1">
                    <span className="font-medium text-gray-600 capitalize">{key.replace(/([A-Z])/g, ' $1').replace(/_/g, ' ').trim()}: </span>
                    <span className="text-gray-800">{String(value)}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600">No additional details available.</p>
            )}
            <p className="text-xs text-gray-400 mt-4 pt-2 border-t border-gray-200">
              Original scanned URL: {data.originalScannedUrl}
            </p>
          </div>
        )}

        {!loading && !data && !error && (
             <div className="p-6 border border-orange-300 bg-orange-50 rounded-lg shadow-sm text-center">
                <h2 className="text-xl font-medium text-orange-700">Information Not Found</h2>
                <p className="text-gray-700 mt-2">
                    Could not display certificate details for the identifier "{extractedCertNo || 'Unknown'}".
                </p>
                {cleanedScannedUrl && <p className="text-sm text-gray-500 mt-2">Scanned value (processed): {cleanedScannedUrl}</p>}
            </div>
        )}
      </div>
    </AppLayout>
  );
};
export default QrResultPage;