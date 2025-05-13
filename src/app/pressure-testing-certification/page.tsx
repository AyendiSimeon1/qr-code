// src/app/pressure-testing-certification/page.tsx
'use client';

import React from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { PressureTestingCertificationForm } from '@/components/forms/PressureTestingCertificationForm';

const PressureTestingCertificationPage: React.FC = () => {
  const handleSubmit = (data: any) => {
    console.log('Pressure Testing Certification Data:', data);
    // Handle form submission logic here
  };

  return (
    <AppLayout title="Create New Record - Pressure Testing Certification">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-semibold mb-6 text-gray-800">Create New Record</h1>
        <PressureTestingCertificationForm onSubmit={handleSubmit} />
      </div>
    </AppLayout>
  );
};

export default PressureTestingCertificationPage;