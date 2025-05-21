// src/app/qr-result/[data]/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { AppLayout } from '@/components/layout/AppLayout';
import { format } from 'date-fns';

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
    // Extract everything after "qr-result/" from the URL
    const match = scannedUrl.match(/qr-result\/(.+)/);
    if (match && match[1]) {
      return match[1];
    }
    console.log('i am the scannedUrl', scannedUrl);
    return scannedUrl; // Return the full string if pattern not found
  } catch (error) {
    console.error("Error extracting value after qr-result/:", error);
    return null;
  }
};

const fetchCertificateDataByCertNo = async (
  certNo: string,
  originalScannedUrl: string
): Promise<QrResultDisplayData | null> => {
  // --- Get Auth Token from localStorage ---
  let authToken: string | null = null;
  if (typeof window !== 'undefined') { // Ensure localStorage is available (client-side)
    authToken = localStorage.getItem('authToken'); // REPLACE 'authToken' with your actual key if different
    console.log('Fetched auth token from localStorage:', authToken);
  }

  // Construct URL for your Next.js proxy API route
  const proxyApiUrl = `/api/get-certificate-proxy?cert_no=${encodeURIComponent(certNo)}`;

  console.log('Fetching certificate data via proxy:', proxyApiUrl);

  try {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    if (authToken) {

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
  const certData = data && data.details && data.details.data ? data.details.data[0] || '' : '';

  console.log('the cert data', certData);
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

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        <h1 className="text-2xl sm:text-3xl font-semibold mb-6 text-gray-800">
          {loading ? 'Loading Certificate Details...' : 'Certificate Result'}
        </h1>

        {loading && (
          <div className="p-4 sm:p-6 border border-gray-300 rounded-lg shadow-sm bg-white text-center">
            <p className="text-base sm:text-lg text-gray-600">
              Loading details for certificate ID: "<strong className="break-all">{extractedCertNo || 'Extracting ID...'}</strong>"...
            </p>
            <div className="animate-pulse mt-2 text-sm sm:text-base">Fetching data...</div>
          </div>
        )}

        {error && (
          <div className="p-4 sm:p-6 border border-red-300 bg-red-50 rounded-lg shadow-sm text-center">
            <h2 className="text-xl sm:text-2xl font-medium text-red-700">Error</h2>
            <p className="text-red-600 mt-2 text-sm sm:text-base">{error}</p>
            {cleanedScannedUrl && <p className="text-xs sm:text-sm text-gray-500 mt-2 break-all">Scanned value (processed): {cleanedScannedUrl}</p>}
          </div>
        )}

        {!loading && !error && data && (
          <div className="p-4 sm:p-6 border border-gray-300 rounded-lg shadow-sm bg-white space-y-4">
            <p className="text-sm sm:text-md text-gray-600">
              Report generated on
              <strong className="block text-lg sm:text-xl text-gray-800 break-all">{data.id}</strong>
            </p>
            {data.details.data.company_name && <p className="text-base sm:text-lg text-gray-700"><strong>Description:</strong> {data.description}</p>}
            <h1 className="text-base sm:text-lg text-gray-700">Expiry timeline: <strong className="text-gray-800">{certData.due_date}</strong></h1>
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mt-6 mb-3">Certificate Details:</h2>
            {Object.keys(data.details).length > 0 ? (
              // Use `md:grid-cols-2` to make it 2 columns on medium screens and up, 1 column on small screens
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
                
                <div className="flex flex-col space-y-3"> {/* Increased space-y for better mobile spacing */}
                  <div>
                    <span className="block text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</span>
                    <span className={`inline-block px-2 py-1 rounded text-sm font-medium ${certData.status === 'Active' || !certData.status ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>{certData.status ? certData.status : 'Active'}</span>
                  </div>
                  <div>
                    <span className="block text-xs font-semibold text-gray-500 uppercase tracking-wide">Date of Registration</span>
                    <span className="block text-gray-800 text-sm font-mono">
                      {certData.created_at ? format(new Date(certData.created_at), 'PPPp') : 'N/A'}
                    </span>
                  </div>
                  <div>
                    <span className="block text-xs font-semibold text-gray-500 uppercase tracking-wide">Date of Certification</span>
                    <span className="block text-gray-800 text-sm font-mono">
                      {certData.date_issued ? format(new Date(certData.date_issued), 'PPPp') : 'N/A'}
                    </span>
                  </div>
                  <div>
                    <span className="block text-xs font-semibold text-gray-500 uppercase tracking-wide">Serial No</span>
                    <span className="block text-gray-800 text-sm font-mono">
                      {certData.seriel_no || 'N/A'}
                    </span>
                  </div>
                  {/* Add more fields here as needed from certData */}
                  {certData.company_name && (
                    <div>
                      <span className="block text-xs font-semibold text-gray-500 uppercase tracking-wide">Company Name</span>
                      <span className="block text-gray-800 text-sm font-mono">{certData.company_name}</span>
                    </div>
                  )}
                  {certData.company_address && (
                    <div>
                      <span className="block text-xs font-semibold text-gray-500 uppercase tracking-wide">Company Address</span>
                      <span className="block text-gray-800 text-sm font-mono">{certData.company_address}</span>
                    </div>
                  )}
                </div>
              </div>
              
            ) : (
              <p className="text-gray-600 text-sm sm:text-base">No additional details available.</p>
            )}
            <p className="text-xs text-gray-400 mt-4 pt-2 border-t border-gray-200 break-all">
              Original scanned URL: {data.originalScannedUrl}
            </p>
          </div>
        )}

        {!loading && !data && !error && (
            <div className="p-4 sm:p-6 border border-orange-300 bg-orange-50 rounded-lg shadow-sm text-center">
              <h2 className="text-xl sm:text-2xl font-medium text-orange-700">Information Not Found</h2>
              <p className="text-gray-700 mt-2 text-sm sm:text-base">
                  Could not display certificate details for the identifier "<strong className="break-all">{extractedCertNo || 'Unknown'}</strong>".
              </p>
              {cleanedScannedUrl && <p className="text-xs sm:text-sm text-gray-500 mt-2 break-all">Scanned value (processed): {cleanedScannedUrl}</p>}
            </div>
        )}
      {/* </div>
    </div> */}
    </div>
  );
};
export default QrResultPage;