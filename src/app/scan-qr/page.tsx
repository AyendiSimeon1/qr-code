'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { AppLayout } from '@/components/layout/AppLayout'; // Assuming this is correctly imported
import { Button } from '@/components/ui/Button'; // Assuming this is correctly imported
import { Html5Qrcode, Html5QrcodeSupportedFormats,  Html5QrcodeResult } from 'html5-qrcode';

// Define a type for the camera devices (already in your code, good)
interface CameraDevice {
  id: string;
  label: string;
}

const ScanQrPage = () => {
  const router = useRouter();
  const [scanResult, setScanResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [cameraPermission, setCameraPermission] = useState<PermissionState | 'prompt'>('prompt');
  const [availableCameras, setAvailableCameras] = useState<CameraDevice[]>([]);
  const [currentCameraIndex, setCurrentCameraIndex] = useState(0);
  
  // Use a stable ID for the qr-reader div, but only generate it on the client to avoid hydration errors
  const qrReaderIdRef = useRef<string | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    if (!qrReaderIdRef.current) {
      qrReaderIdRef.current = `qr-reader-${Math.random().toString(36).substr(2, 9)}`;
    }
  }, []);

  const html5QrcodeRef = useRef<Html5Qrcode | null>(null);
  const retryCountRef = useRef(0);
  const MAX_RETRIES = 3;

  // Check and monitor camera permission
  useEffect(() => {
    const checkPermission = async () => {
      if (!navigator.permissions) {
        console.warn('Navigator permissions API not supported.');
        // Fallback: try to get user media directly to trigger prompt if needed,
        // or assume 'prompt' and let the start scan action handle it.
        setCameraPermission('prompt');
        return;
      }
      try {
        const result = await navigator.permissions.query({ name: 'camera' as PermissionName });
        setCameraPermission(result.state);
        result.addEventListener('change', () => setCameraPermission(result.state));
      } catch (err) {
        console.error('Error querying camera permission:', err);
        setCameraPermission('prompt'); // Assume prompt if query fails
      }
    };
    checkPermission();
  }, []);

  // Load available cameras
  useEffect(() => {
    Html5Qrcode.getCameras()
      .then((devices) => {
        if (devices && devices.length) {
          setAvailableCameras(devices);
          const backCameraIndex = devices.findIndex((device) =>
            /back|rear|environment/i.test(device.label)
          );
          if (backCameraIndex !== -1) {
            setCurrentCameraIndex(backCameraIndex);
          } else if (devices.length > 0) {
            setCurrentCameraIndex(0); // Default to the first camera if no back camera found
          }
        }
      })
      .catch((err) => {
        console.error('Error fetching cameras:', err);
        setError('Could not fetch camera list. Ensure permission is granted.');
      });
  }, [cameraPermission]); // Re-fetch if permission changes from prompt to granted

  const onScanSuccess = useCallback((decodedText: string, decodedResult: Html5QrcodeResult) => {
    console.log(`Scan result: ${decodedText}`, decodedResult);
    setScanResult(decodedText);
    setIsScanning(false); // This will trigger cleanup in the main useEffect

    // Navigate after a short delay to show success message/feedback
    setTimeout(() => {
      router.push(`/qr-result/${encodeURIComponent(decodedText)}`);
    }, 500);
  }, [router]);

  const onScanFailure = useCallback((errorMessage: string) => {
    // Annoying "QR code not found." message can be ignored if desired.
    if (!errorMessage.toLowerCase().includes('qr code not found')) {
      console.warn(`QR Scan Error: ${errorMessage}`);
      // You could set a transient error message here if needed
      // setError(`Scan Error: ${errorMessage.substring(0,100)}`);
    }
  }, []);

 
  useEffect(() => {
    const qrCodeRegion = document.getElementById(qrReaderIdRef.current || '');

    if (isScanning && qrCodeRegion && cameraPermission === 'granted') {
      
      if (!html5QrcodeRef.current) {
        html5QrcodeRef.current = new Html5Qrcode(qrReaderIdRef.current || '', { 
            verbose: false, // Set to true for more logs from the library
            formatsToSupport: [ Html5QrcodeSupportedFormats.QR_CODE ]
        });
      }
      const html5qrcode = html5QrcodeRef.current;

      // Configuration for the scanner
      const qrboxFunction = (viewfinderWidth: number, viewfinderHeight: number): any => {
        const minEdgePercentage = 0.7; // 70%
        const minEdgeSize = Math.min(viewfinderWidth, viewfinderHeight);
        const qrboxSize = Math.floor(minEdgeSize * minEdgePercentage);
        return { width: qrboxSize, height: qrboxSize };
      };

      const config = {
        fps: 10,
        qrbox: qrboxFunction,
        aspectRatio: 1.0, // Or calculate based on video stream
        // videoConstraints: { // More specific constraints, apply with caution
        //   width: { ideal: 1280 },
        //   height: { ideal: 720 },
        // }
      };
      
      let cameraConfigToUse: string | object = { facingMode: 'environment' };
      if (availableCameras.length > 0 && availableCameras[currentCameraIndex]) {
        cameraConfigToUse = { deviceId: { exact: availableCameras[currentCameraIndex].id } };
      }
      
      console.log("Starting scanner with camera:", cameraConfigToUse, "and config:", config);

      html5qrcode.start(
          cameraConfigToUse,
          config,
          onScanSuccess,
          onScanFailure
        )
        .then(() => {
          console.log("Scanner started successfully.");
          setError(null); // Clear previous errors
          retryCountRef.current = 0;
        })
        .catch((err: any) => {
          console.error('Error starting scanner:', err);
          // Handle specific errors
          if (err.name === 'IndexSizeError' && retryCountRef.current < MAX_RETRIES) {
            retryCountRef.current += 1;
            console.warn(`Retrying scanner start (${retryCountRef.current}/${MAX_RETRIES})`);
            // Potentially re-trigger this effect after a delay, or let user retry
            setIsScanning(false); // Toggle to allow retry
            setTimeout(() => setIsScanning(true), 500);
            return;
          }

          let message = `Failed to start camera: ${err.name || 'Unknown Error'}`;
          if (err.message) message += ` - ${err.message}`;

          if (err.name === 'NotAllowedError') {
            message = 'Camera permission denied. Please enable it in your browser settings.';
            setCameraPermission('denied');
          } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
            message = 'No suitable camera found. Ensure a camera is connected and enabled.';
          } else if (err.name === 'NotReadableError' || err.name === 'TrackStartError') {
            message = 'Camera is already in use or cannot be accessed. Try closing other apps using the camera.';
          } else if (err.name === 'OverconstrainedError') {
            message = 'Camera does not support the requested constraints (e.g., resolution). Try different settings or camera.';
          }
          setError(message);
          setIsScanning(false); // Stop scanning if start fails
        });
    } else if (!isScanning && html5QrcodeRef.current && html5QrcodeRef.current.isScanning) {
        // Stop scanning if isScanning is set to false
        html5QrcodeRef.current.stop()
          .then(() => {
            console.log('Scanner stopped successfully.');
            // html5QrcodeRef.current = null; // Don't nullify here, can reuse the instance
          })
          .catch((err) => {
            console.error('Error stopping scanner:', err);
            setError('Failed to stop the scanner.');
          });
    }

    // Cleanup on component unmount or if dependencies change causing scanner to stop
    return () => {
      if (html5QrcodeRef.current && html5QrcodeRef.current.isScanning) {
        console.log("Cleaning up scanner...");
        html5QrcodeRef.current.stop()
          .catch(err => console.error('Error stopping scanner during cleanup:', err));
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isScanning, currentCameraIndex, availableCameras, cameraPermission, onScanSuccess, onScanFailure]);


  // Stop scanner when tab becomes hidden
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && isScanning) {
        console.log("Tab hidden, stopping scanner.");
        setIsScanning(false);
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [isScanning]);


  const handleStartStopScan = async () => {
    if (!isScanning) {
      setError(null); // Clear previous errors
      setScanResult(null);

      // Check permission before attempting to scan
      if (cameraPermission === 'denied') {
        setError('Camera permission is denied. Please enable it in your browser settings.');
        return;
      }
      
      if (cameraPermission === 'prompt' || cameraPermission !== 'granted') {
        // Try to prompt for permission by requesting media stream
        // This is a common way to trigger the browser's permission dialog
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ video: true });
          // If successful, the permission state should update via the permission API listener.
          // We can also manually update it here and close the stream.
          stream.getTracks().forEach(track => track.stop());
          setCameraPermission('granted'); // Tentatively set, listener will confirm
          console.log("Camera permission obtained via direct getUserMedia call.");
          setIsScanning(true); // Now attempt to start
        } catch (err: any) {
          console.error("Error requesting camera permission:", err);
          setError('Camera permission denied or an error occurred. Please enable camera access.');
          setCameraPermission('denied'); // Update state
          return;
        }
      } else {
         // Permission already granted
        setIsScanning(true);
      }
    } else {
      setIsScanning(false); // If already scanning, stop it
    }
  };

  const handleSwitchCamera = () => {
    if (availableCameras.length > 1) {
      // Stop current scanner if active by setting isScanning to false.
      // The main useEffect will handle stopping it.
      // Then, update camera index and restart.
      if (isScanning) {
        setIsScanning(false);
        // Give a moment for the scanner to stop before restarting with new camera
        setTimeout(() => {
          setCurrentCameraIndex((prevIndex) => (prevIndex + 1) % availableCameras.length);
          setIsScanning(true);
        }, 200); // Adjust delay if needed
      } else {
        // If not scanning, just cycle the camera index. User can press "Start" later.
        setCurrentCameraIndex((prevIndex) => (prevIndex + 1) % availableCameras.length);
      }
    } else {
      setError('No other cameras available to switch to.');
    }
  };

  const currentCameraLabel = availableCameras[currentCameraIndex]?.label || 'Default Camera';

  return (
    <AppLayout title="Scan QR Code">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-semibold mb-6 text-gray-800">Scan QR Code</h1>
        
        <div className="p-6 border border-gray-300 rounded-lg shadow-sm bg-white">
          {cameraPermission === 'denied' && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 border border-red-400 rounded">
              Camera permission denied. Please enable camera access in your browser settings and refresh the page.
            </div>
          )}
          {cameraPermission === 'prompt' && !isScanning && (
            <div className="mb-4 p-3 bg-yellow-100 text-yellow-700 border border-yellow-400 rounded">
              Camera permission is required. Click "Start Scanning" to allow access.
            </div>
          )}

          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 border border-red-400 rounded">
              <strong>Error:</strong> {error}
            </div>
          )}

          {scanResult && (
            <div className="mb-4 p-3 bg-green-100 text-green-700 border border-green-400 rounded">
              <strong>Scan Success!</strong> Result: {scanResult}
              <p className="text-sm">Redirecting...</p>
            </div>
          )}
          
          <div className="text-center">
            {/* Scanner video feed area */}
            {/* This div MUST be in the DOM for html5-qrcode to attach the video stream */}
            {/* We control its visibility using CSS rather than conditionally rendering the div itself */}
            <div 
              className={`w-full max-w-md mx-auto bg-gray-200 rounded-md overflow-hidden relative transition-all duration-300 ease-in-out ${
                isScanning && !scanResult ? 'h-[400px] opacity-100 mb-4' : 'h-0 opacity-0'
              }`}
            >
              {/* Only render the qr-reader div on the client to avoid hydration errors */}
              {isClient && (
                <div id={qrReaderIdRef.current || ''} className="w-full h-full" />
              )}
            </div>

            {!scanResult && (
              <>
                <Button onClick={handleStartStopScan} variant="primary" size="lg" disabled={cameraPermission === 'denied' && !isScanning}>
                  {isScanning ? 'Stop Scanning' : 'Start Scanning'}
                </Button>

                {availableCameras.length > 1 && !isScanning && (
                  <Button onClick={handleSwitchCamera} variant="secondary" className="ml-2">
                    Switch Camera
                  </Button>
                )}
                 {isScanning && availableCameras.length > 1 && (
                  <Button onClick={handleSwitchCamera} variant="secondaryOutline" className="ml-2">
                    Switch Camera
                  </Button>
                )}
              </>
            )}

            {availableCameras.length > 0 && !isScanning && (
              <p className="text-sm text-gray-600 mt-2">
                Selected camera: {currentCameraLabel || `Camera ${currentCameraIndex + 1}`}
              </p>
            )}
            {isScanning && (
               <p className="text-sm text-gray-600 mt-2">
                Scanning with: {currentCameraLabel || `Camera ${currentCameraIndex + 1}`}
              </p>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default ScanQrPage;