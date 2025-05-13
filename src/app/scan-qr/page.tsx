'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/Button';
import { QrReader } from 'react-qr-reader';

interface QrScanResult {
  getText(): string;
}

const ScanQrPage = () => {
  const router = useRouter();
  const [scanResult, setScanResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [facing, setFacing] = useState<'environment' | 'user'>('environment');
  const [cameraPermission, setCameraPermission] = useState<PermissionState | 'prompt'>('prompt');
  const [isVideoVisible, setIsVideoVisible] = useState(false);
  const [userAgent, setUserAgent] = useState<string>('Loading...');
  const [scanAttempt, setScanAttempt] = useState(0);

  const qrScannerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setUserAgent(navigator.userAgent);
    }
  }, []);

  useEffect(() => {
    const checkCameraPermission = async () => {
      if (typeof navigator.permissions?.query === 'function') {
        try {
          const result = await navigator.permissions.query({ name: 'camera' as PermissionName });
          setCameraPermission(result.state);
          result.addEventListener('change', () => {
            setCameraPermission(result.state);
          });
        } catch (err) {
          console.warn('Permission API query failed:', err);
        }
      }
    };
    checkCameraPermission();
  }, []);

  const commonStartScanActions = () => {
    setScanResult(null);
    setError(null);
    setIsVideoVisible(false);
    setScanAttempt(prev => prev + 1); 
    setIsScanning(true);
    console.log('Attempting to start QR Scanner with camera facing:', facing);
  };
  
  const startScanIfPermitted = () => {
    if (cameraPermission === 'granted') {
      commonStartScanActions();
    } else {
      console.warn("StartScanIfPermitted called but permission not granted.");
    }
  };

  const requestCameraAccessAndScan = async () => {
    setError(null); 
    try {
      console.log('Requesting camera access...');
      await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: facing } 
      });
      console.log('Camera access granted by getUserMedia.');
      setCameraPermission('granted');
      commonStartScanActions();
    } catch (err: any) {
      console.error('Camera access denied or getUserMedia error:', err);
      setCameraPermission('denied');
      const errName = err.name || 'UnknownError';
      const errMessage = err.message || 'No specific message.';
      setError(`Camera access request failed (${errName}): ${errMessage}. Please allow camera access in your browser settings and try again.`);
      setIsScanning(false);
    }
  };

  useEffect(() => {
    let videoCheckInterval: NodeJS.Timeout | undefined;
    let checkVideoPlayingInterval: NodeJS.Timeout | undefined;

    if (isScanning && cameraPermission === 'granted') {
      const checkForVideo = () => {
        if (qrScannerRef.current) {
          const videoElement = qrScannerRef.current.querySelector('video');
          if (videoElement) {
            console.log('Video element found in DOM for QrReader.');
            setIsVideoVisible(true);
            checkVideoPlayingInterval = setInterval(() => {
              if (videoElement.readyState >= 2) {
                console.log('QrReader Video is ready to play, dimensions:', videoElement.videoWidth, 'x', videoElement.videoHeight);
                if (checkVideoPlayingInterval) clearInterval(checkVideoPlayingInterval);
              }
            }, 500);
            if (videoCheckInterval) clearInterval(videoCheckInterval);
          } else {
            console.log('No video element found yet for QrReader.');
            setIsVideoVisible(false);
          }
        }
      };
      checkForVideo();
      videoCheckInterval = setInterval(checkForVideo, 1000);
    }
    
    return () => {
      if (videoCheckInterval) clearInterval(videoCheckInterval);
      if (checkVideoPlayingInterval) clearInterval(checkVideoPlayingInterval);
    };
  }, [isScanning, cameraPermission, scanAttempt]);


  const handleScanWrapper = (result: QrScanResult | undefined | null, scanError: any) => {
    if (scanResult) return; 
    
    if (result) {
      handleScanSuccess(result);
      return;
    }
    
    let errorToReport: any;
if (scanError) {
  errorToReport = scanError;
} else if (typeof scanError === 'string') {
  errorToReport = new Error(scanError);
} else if (scanError && typeof scanError.name === 'string' && typeof scanError.message === 'string') {
  // If it's an object with name and message (like a duck-typed error)
  errorToReport = new Error(`${scanError.name}: ${scanError.message}`);
  errorToReport.name = scanError.name; // Preserve original name if possible
} else {
  // This is likely the case for the simple 'e'
  errorToReport = new Error('QR Reader failed to initialize or process video. Check camera and permissions.');
  errorToReport.name = 'QrReaderInternalError'; // Give it a more specific name
}
  };
  
  const handleScanSuccess = (result: QrScanResult) => {
    const textResult = result.getText();
    console.log('QR Scan successful:', textResult);
    setScanResult(textResult);
    setIsScanning(false);
    router.push(`/qr-result/${encodeURIComponent(textResult)}`);
  };

  const handleScanError = (currentError: Error) => {
    const errorName = currentError.name || 'Error';
    const errorMessageText = currentError.message || 'An unexpected issue occurred.';
    console.error(`Displaying Scan Error - Name: ${errorName}, Message: ${errorMessageText}`);
    setError(`Failed to scan QR code (${errorName}). ${errorMessageText}. Please try again or check lighting conditions.`);
    setIsScanning(false);
  };
  
  const toggleCamera = () => {
    setFacing(prevFacing => prevFacing === 'environment' ? 'user' : 'environment');
    setIsScanning(false); 
    setTimeout(() => {
      if (cameraPermission === 'granted') {
        commonStartScanActions();
      } else {
        requestCameraAccessAndScan();
      }
    }, 100);
  };

  const handlePrimaryScanButton = () => {
    if (cameraPermission === 'granted') {
      commonStartScanActions();
    } else {
      requestCameraAccessAndScan();
    }
  };

  return (
    <AppLayout title="Scan QR Code">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-semibold mb-6 text-gray-800">Scan QR Code</h1>
        <div className="p-6 border border-gray-300 rounded-lg shadow-sm bg-white text-center">
          {!isScanning && (
            <Button 
              onClick={handlePrimaryScanButton} 
              variant="primary" 
              size="lg"
            >
              {cameraPermission === 'prompt' ? 'Allow Camera & Scan' : 
               cameraPermission === 'denied' ? 'Try Granting Camera Access' : 'Start Scanning'}
            </Button>
          )}

          {cameraPermission === 'denied' && !isScanning && error && (
            <div className="mt-4 mb-6 p-4 bg-yellow-50 border border-yellow-300 rounded-md">
              <h2 className="text-xl font-medium text-yellow-700">Camera Access Issue</h2>
              <p className="text-gray-700 mt-2">{error}</p>
            </div>
          )}

          {isScanning && cameraPermission === 'granted' && (
            <div>
              <p className="text-lg text-gray-600 mb-4">Position the QR code within the frame.</p>
              
              {!isVideoVisible && !error && (
                <div className="mb-4 p-2 bg-blue-50 border border-blue-200 rounded text-sm">
                  Initializing camera... Please wait.
                </div>
              )}
              
              <div 
                ref={qrScannerRef} 
                className="w-full max-w-md mx-auto bg-gray-200 rounded-md overflow-hidden relative"
                style={{ height: "300px" }}
              >
                <QrReader
                  key={`${facing}-${scanAttempt}`}
                  onResult={handleScanWrapper}
                  constraints={{ 
                    facingMode: facing,
                  }}
                  videoContainerStyle={{ 
                    position: 'absolute', top: 0, left: 0, width: '100%', height: '100%'
                  }}
                  videoStyle={{ 
                    width: '100%', height: '100%', objectFit: 'cover' 
                  }}
                  scanDelay={500}
                  ViewFinder={() => ( 
                    <div style={{
                      position: 'absolute', top: '50%', left: '50%',
                      width: '60%', height: '60%',
                      border: '3px solid white', borderRadius: '8px',
                      boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.5)',
                      transform: 'translate(-50%, -50%)',
                      pointerEvents: 'none',
                    }} />
                  )}
                />
              </div>
              
              <div className="mt-4 flex justify-center gap-4">
                <Button onClick={() => setIsScanning(false)} variant="secondaryOutline">
                  Cancel Scan
                </Button>
                <Button onClick={toggleCamera} variant="secondary">
                  Switch Camera
                </Button>
              </div>
            </div>
          )}
          {isScanning && cameraPermission === 'prompt' && (
            <p className="text-lg text-gray-600 mb-4">Waiting for camera permission prompt...</p>
          )}

          {scanResult && (
            <div className="mt-6 p-4 bg-green-50 border border-green-300 rounded-md">
              <h2 className="text-xl font-medium text-green-700">Scan Successful!</h2>
              <p className="text-gray-700 mt-2">Data: {scanResult}</p>
              <p className="text-gray-600">Redirecting to details page...</p>
            </div>
          )}

          {error && !isScanning && (
            <div className="mt-6 p-4 bg-red-50 border border-red-300 rounded-md">
              <h2 className="text-xl font-medium text-red-700">Scan Error</h2>
              <p className="text-gray-700 mt-2">{error}</p>
              <div className="mt-2 text-gray-600">
                <p>Tips:</p>
                <ul className="list-disc pl-5 text-gray-600 text-left text-sm">
                  <li>Ensure the QR code is well-lit and not blurry.</li>
                  <li>Hold your device steady.</li>
                  <li>Make sure the entire QR code is visible in the frame.</li>
                  <li>Try switching cameras if available.</li>
                  <li>If using desktop, ensure you're using a supported browser (Chrome, Edge, or Firefox).</li>
                  <li>Check browser console (F12 - Console) for more detailed error messages.</li>
                </ul>
              </div>
              <Button onClick={handlePrimaryScanButton} variant="primary" className="mt-4">
                Try Again
              </Button>
            </div>
          )}
        </div>
        
        {process.env.NODE_ENV !== 'production' && (
          <div className="mt-6 p-4 border border-gray-300 rounded-lg bg-gray-50">
            <h3 className="text-sm font-semibold text-gray-700">Debug Info:</h3>
            <div className="text-xs text-gray-600 space-y-1">
              <p>Camera Permission: {cameraPermission}</p>
              <p>Camera Facing: {facing}</p>
              <p>Scanning Active: {isScanning ? 'Yes' : 'No'}</p>
              <p>Video Element Expected Visible: {isVideoVisible ? 'Yes' : 'No'}</p>
              <p>Scan Attempt: {scanAttempt}</p>
              <p>Browser: {userAgent}</p>
              <p>Current Error State: {error || 'null'}</p>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default ScanQrPage;