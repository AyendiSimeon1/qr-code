// src/components/forms/PressureTestingCertificationForm.tsx
'use client';

import React from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { Button } from '../ui/Button';
import { InputField } from '../ui/InputField';
import { DatePickerField } from '../ui/DatePickerField';

export interface PressureTestingCertificationFormData {
  company: string;
  reportNo: string;
  dueDate: string;
  testDate: string;
  procedure: string;
  standard: string;
  locationUnitNo: string;
  finalHoldTime: string;
  typeOfInspection: string;
  description: string;
  manufacturer: string; // This might be a select or free text
  connection: string;
  serialNoEquipment: string; // S/N for equipment
  refEquipment: string;
  make: string;
  serialNoGauge: string; // S/N for gauge
  range: string;
  testPump: string;
  testMedium: string;
  proofTestPressure: string;
}

interface PressureTestingCertificationFormProps {
  onSubmit: SubmitHandler<PressureTestingCertificationFormData>;
  isLoading?: boolean;
}

export const PressureTestingCertificationForm: React.FC<PressureTestingCertificationFormProps> = ({ onSubmit, isLoading }) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<PressureTestingCertificationFormData>({
    mode: 'onBlur',
  });

  const loadingState = isLoading !== undefined ? isLoading : isSubmitting;

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-8">
      <div className="p-6 border border-gray-300 rounded-lg shadow-sm bg-white">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <InputField
            label="Company"
            name="company"
            placeholder="Enter company name"
            register={register('company', { required: 'Company name is required' })}
            error={errors.company}
          />
          <InputField
            label="Report No."
            name="reportNo"
            placeholder="Enter value"
            register={register('reportNo', { required: 'Report number is required' })}
            error={errors.reportNo}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <DatePickerField
            label="Due Date"
            name="dueDate"
            register={register('dueDate')}
            error={errors.dueDate}
          />
          <DatePickerField
            label="Test Date"
            name="testDate"
            register={register('testDate')}
            error={errors.testDate}
          />
          <InputField
            label="Procedure"
            name="procedure"
            placeholder="Enter value"
            register={register('procedure')}
            error={errors.procedure}
          />
          <InputField
            label="Standard"
            name="standard"
            placeholder="Enter value"
            register={register('standard')}
            error={errors.standard}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <InputField
            label="Location Unit No:"
            name="locationUnitNo"
            placeholder="Enter location"
            register={register('locationUnitNo')}
            error={errors.locationUnitNo}
          />
          <InputField
            label="Final Hold Time:"
            name="finalHoldTime"
            placeholder="Enter time value"
            register={register('finalHoldTime')}
            error={errors.finalHoldTime}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <InputField
            label="Type of Inspection:"
            name="typeOfInspection"
            placeholder="Enter client name" // Placeholder from image, adjust if needed
            register={register('typeOfInspection')}
            error={errors.typeOfInspection}
          />
          <InputField
            label="Description:"
            name="description"
            placeholder="Enter client name" // Placeholder from image, adjust if needed
            register={register('description')}
            error={errors.description}
          />
          <InputField // This might be a select or free text, or DatePicker based on image context 'Pick Date'
            label="Manufacturer"
            name="manufacturer"
            placeholder="Pick date / Enter Manufacturer" // Placeholder from image, adjust if needed
            register={register('manufacturer')}
            error={errors.manufacturer}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <InputField
            label="Connection"
            name="connection"
            placeholder="Enter client name" // Placeholder from image, adjust if needed
            register={register('connection')}
            error={errors.connection}
          />
          <InputField
            label="S/N O:" // Assuming this is Serial Number for Equipment
            name="serialNoEquipment"
            placeholder="Enter value"
            register={register('serialNoEquipment')}
            error={errors.serialNoEquipment}
          />
          <InputField
            label="Ref. Equipment"
            name="refEquipment"
            placeholder="Enter value"
            register={register('refEquipment')}
            error={errors.refEquipment}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <InputField
            label="Make:"
            name="make"
            placeholder="Enter value"
            register={register('make')}
            error={errors.make}
          />
          <InputField
            label="S/N O:" // Assuming this is Serial Number for Gauge
            name="serialNoGauge"
            placeholder="Enter value"
            register={register('serialNoGauge')}
            error={errors.serialNoGauge}
          />
          <InputField
            label="Range:"
            name="range"
            placeholder="Enter value"
            register={register('range')}
            error={errors.range}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <InputField
            label="Test Pump:"
            name="testPump"
            placeholder="Enter value"
            register={register('testPump')}
            error={errors.testPump}
          />
          <InputField
            label="Test Medium:"
            name="testMedium"
            placeholder="Enter value"
            register={register('testMedium')}
            error={errors.testMedium}
          />
          <InputField
            label="Proof Test Pressure:"
            name="proofTestPressure"
            placeholder="Enter value"
            register={register('proofTestPressure')}
            error={errors.proofTestPressure}
          />
        </div>
      </div>

      <Button
        type="submit"
        variant="primary"
        className="w-full md:w-auto mt-8"
        isLoading={loadingState}
        disabled={loadingState}
      >
        Create Record
      </Button>
    </form>
  );
};