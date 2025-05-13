// src/app/create-record/page.tsx
'use client';

import React, { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { CalibrationCertificationForm, CalibrationCertificationFormData } from '@/components/forms/CalibrationCertificationForm';
import { PressureTestingCertificationForm, PressureTestingCertificationFormData } from '@/components/forms/PressureTestingCertificationForm';
import { Button } from '@/components/ui/Button';

type FormType = 'calibration' | 'pressure';

const CreateRecordPage: React.FC = () => {
  const [activeForm, setActiveForm] = useState<FormType>('calibration');
  const [isLoading, setIsLoading] = useState(false);

  const handleCalibrationSubmit = async (data: CalibrationCertificationFormData) => {
    setIsLoading(true);
    console.log('Calibration Certification Data:', data);
    // Add actual submission logic here
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
    setIsLoading(false);
    // Potentially show success message or redirect
  };

  const handlePressureTestingSubmit = async (data: PressureTestingCertificationFormData) => {
    setIsLoading(true);
    console.log('Pressure Testing Certification Data:', data);
    // Add actual submission logic here
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
    setIsLoading(false);
    // Potentially show success message or redirect
  };

  return (
    <AppLayout title="Create New Record">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold mb-6 text-gray-800 text-center md:text-left">Create New Record</h1>
          <div className="flex flex-col sm:flex-row justify-center md:justify-start space-y-2 sm:space-y-0 sm:space-x-4 mb-8">
            <Button
              onClick={() => setActiveForm('calibration')}
              variant={activeForm === 'calibration' ? 'primary' : 'secondaryOutline'}
              className={`w-full sm:w-auto px-6 py-3 text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 ${activeForm === 'calibration' ? 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500' : 'bg-white text-blue-600 border-blue-600 hover:bg-blue-50 focus:ring-blue-500'}`}
            >
              Calibration Certification
            </Button>
            <Button
              onClick={() => setActiveForm('pressure')}
              variant={activeForm === 'pressure' ? 'primary' : 'secondaryOutline'}
              className={`w-full sm:w-auto px-6 py-3 text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 ${activeForm === 'pressure' ? 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500' : 'bg-white text-blue-600 border-blue-600 hover:bg-blue-50 focus:ring-blue-500'}`}
            >
              Pressure Testing Certification
            </Button>
          </div>
        </div>

        {activeForm === 'calibration' && (
          <CalibrationCertificationForm onSubmit={handleCalibrationSubmit} isLoading={isLoading} />
        )}

        {activeForm === 'pressure' && (
          <PressureTestingCertificationForm onSubmit={handlePressureTestingSubmit} isLoading={isLoading} />
        )}
      </div>
    </AppLayout>
  );
};

export default CreateRecordPage;