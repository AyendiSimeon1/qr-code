// src/app/calibration-certification/page.tsx
'use client';

import React from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { CalibrationCertificationForm } from '@/components/forms/CalibrationCertificationForm';

const CalibrationCertificationPage: React.FC = () => {
  const handleSubmit = (data: any) => {
    console.log('Calibration Certification Data:', data);
    // Handle form submission logic here
  };

  return (
    <AppLayout title="Create New Record - Calibration Certification">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-semibold mb-6 text-gray-800">Create New Record</h1>
        <CalibrationCertificationForm onSubmit={handleSubmit} />
      </div>
    </AppLayout>
  );
};

export default CalibrationCertificationPage;