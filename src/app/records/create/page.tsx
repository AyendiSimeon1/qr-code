// src/app/records/create/page.tsx
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/Button';
import { PressureTestingCertificationForm, PressureTestingCertificationFormData } from '@/components/forms/PressureTestingCertificationForm';
import { CalibrationCertificationForm, CalibrationCertificationFormData } from '@/components/forms/CalibrationCertificationForm';
import { useRecords } from '@/redux/hooks/records';

type FormType = 'pressure-testing' | 'calibration' | null;

const CreateRecordPage: React.FC = () => {
  const [selectedForm, setSelectedForm] = useState<FormType>(null);
  const router = useRouter();
  const { 
    submitPressureTestingForm, 
    submitCalibrationForm, 
    isSubmitting, 
    isSuccess, 
    error 
  } = useRecords();

  // Handle form selection
  const handleSelectForm = (formType: FormType) => {
    setSelectedForm(formType);
  };

  // Handle pressure testing form submission
  const handlePressureTestingSubmit = async (data: PressureTestingCertificationFormData) => {
    await submitPressureTestingForm(data);
    // Navigate to dashboard or record details page on success
    if (isSuccess) {
      router.push('/dashboard');
    }
  };

  // Handle calibration form submission
  const handleCalibrationSubmit = async (data: CalibrationCertificationFormData) => {
    await submitCalibrationForm(data);
    // Navigate to dashboard or record details page on success
    if (isSuccess) {
      router.push('/dashboard');
    }
  };

  return (
    <AppLayout title="Create New Record">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Create New Record</h1>
          <Button
            variant="secondary"
            onClick={() => router.push('/dashboard')}
          >
            Back to Dashboard
          </Button>
        </div>

        {/* Form Type Selection */}
        {!selectedForm && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            <div 
              className="p-6 border border-gray-300 rounded-lg shadow-sm bg-white hover:border-blue-500 cursor-pointer transition-all"
              onClick={() => handleSelectForm('pressure-testing')}
            >
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Pressure Testing Certification</h2>
              <p className="text-gray-600">Create a new pressure testing certification record with detailed equipment information.</p>
            </div>

            <div 
              className="p-6 border border-gray-300 rounded-lg shadow-sm bg-white hover:border-blue-500 cursor-pointer transition-all"
              onClick={() => handleSelectForm('calibration')}
            >
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Calibration Certification</h2>
              <p className="text-gray-600">Create a new calibration certification record with detailed calibration runs.</p>
            </div>
          </div>
        )}

        {/* Display error message if any */}
        {error && (
          <div className="p-4 mb-6 border border-red-300 bg-red-50 rounded-lg text-red-700">
            {error}
          </div>
        )}

        {/* Pressure Testing Form */}
        {selectedForm === 'pressure-testing' && (
          <div className="mt-6">
            <Button 
              variant="secondary" 
              onClick={() => setSelectedForm(null)}
              className="mb-6"
            >
              Back to Selection
            </Button>
            <PressureTestingCertificationForm 
              onSubmit={handlePressureTestingSubmit} 
              isLoading={isSubmitting}
            />
          </div>
        )}

        {/* Calibration Form */}
        {selectedForm === 'calibration' && (
          <div className="mt-6">
            <Button 
              variant="secondary" 
              onClick={() => setSelectedForm(null)}
              className="mb-6"
            >
              Back to Selection
            </Button>
            <CalibrationCertificationForm 
              onSubmit={handleCalibrationSubmit} 
              isLoading={isSubmitting}
            />
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default CreateRecordPage;