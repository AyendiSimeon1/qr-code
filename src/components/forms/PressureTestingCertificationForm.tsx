'use client';

import React from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { Button } from '../ui/Button';
import { InputField } from '../ui/InputField';
import { DatePickerField } from '../ui/DatePickerField';
import { SelectField } from '../ui/SelectField';

export interface PressureTestingCertificationFormData {
  company_name: string;
  email: string;
  cert_no: string;
  seriel_no: string;
  certificate_type: string;
  doe: string;
  report_no: string;
  due_date: string;
  test_date: string;
  procedure: string;
  standard: string;
  location_unit_no: string;
  final_hold_time: string;
  type_of_inspection: string;
  description: string;
  manufacturer: string;
  connection: string;
  equipment_s_no: string;
  ref_equipment: string;
  make: string;
  range: string;
  test_pump: string;
  test_medium: string;
  proof_test_pressure: string;
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
    defaultValues: {
      certificate_type: 'Pressure Testing Certification',
      company_name: ''
    }
  });

  const loadingState = isLoading !== undefined ? isLoading : isSubmitting;

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-8">
      <div className="p-6 border border-gray-300 rounded-lg shadow-sm bg-white">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Basic Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <InputField
            label="Company Name"
            name="company_name"
            placeholder="Enter company name"
            register={register('company_name', { required: 'Company name is required' })}
            error={errors.company_name}
          />
          <InputField
            label="Email"
            name="email"
            placeholder="Enter email address"
            register={register('email', { 
              required: 'Email is required',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Invalid email address'
              }
            })}
            error={errors.email}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <InputField
            label="Certificate Number"
            name="cert_no"
            placeholder="Enter certificate number"
            register={register('cert_no', {
              required: 'Certificate number is required',
              minLength: { value: 3, message: 'Certificate number must be exactly 3 letters' },
              maxLength: { value: 3, message: 'Certificate number must be exactly 3 letters' },
              pattern: {
                value: /^[A-Za-z]{3}$/,
                message: 'Certificate number must be exactly 3 letters (A-Z)'
              }
            })}
            error={errors.cert_no}
            maxLength={3}
          />
          <InputField
            label="Serial Number"
            name="seriel_no"
            placeholder="Enter serial number"
            register={register('seriel_no', { required: 'Serial number is required' })}
            error={errors.seriel_no}
          />
          <DatePickerField
            label="Date of Expiry"
            name="doe"
            register={register('doe', { required: 'Date of expiry is required' })}
            error={errors.doe}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <InputField
            label="Report No."
            name="report_no"
            placeholder="Enter report number"
            register={register('report_no', { required: 'Report number is required' })}
            error={errors.report_no}
          />
          <DatePickerField
            label="Due Date"
            name="due_date"
            register={register('due_date')}
            error={errors.due_date}
          />
          <DatePickerField
            label="Test Date"
            name="test_date"
            register={register('test_date')}
            error={errors.test_date}
          />
          <InputField
            label="Procedure"
            name="procedure"
            placeholder="Enter procedure"
            register={register('procedure')}
            error={errors.procedure}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          <InputField
            label="Standard"
            name="standard"
            placeholder="Enter standard"
            register={register('standard')}
            error={errors.standard}
          />
          <InputField
            label="Location Unit No."
            name="location_unit_no"
            placeholder="Enter location unit number"
            register={register('location_unit_no')}
            error={errors.location_unit_no}
          />
          <InputField
            label="Final Hold Time"
            name="final_hold_time"
            placeholder="Enter final hold time (e.g., 30 minutes)"
            register={register('final_hold_time')}
            error={errors.final_hold_time}
          />
        </div>

        <h2 className="text-xl font-semibold text-gray-700 mb-4 mt-8">Test Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <InputField
            label="Type of Inspection"
            name="type_of_inspection"
            placeholder="Enter inspection type"
            register={register('type_of_inspection')}
            error={errors.type_of_inspection}
          />
          <InputField
            label="Description"
            name="description"
            placeholder="Enter description"
            register={register('description')}
            error={errors.description}
          />
          <InputField
            label="Manufacturer"
            name="manufacturer"
            placeholder="Enter manufacturer"
            register={register('manufacturer')}
            error={errors.manufacturer}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <InputField
            label="Connection"
            name="connection"
            placeholder="Enter connection type"
            register={register('connection')}
            error={errors.connection}
          />
          <InputField
            label="Equipment S/N"
            name="equipment_s_no"
            placeholder="Enter equipment serial number"
            register={register('equipment_s_no')}
            error={errors.equipment_s_no}
          />
          <InputField
            label="Reference Equipment"
            name="ref_equipment"
            placeholder="Enter reference equipment"
            register={register('ref_equipment')}
            error={errors.ref_equipment}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <InputField
            label="Make"
            name="make"
            placeholder="Enter make"
            register={register('make')}
            error={errors.make}
          />
          <InputField
            label="Range"
            name="range"
            placeholder="Enter range (e.g., 0 - 5000 PSI)"
            register={register('range')}
            error={errors.range}
          />
          <InputField
            label="Test Pump"
            name="test_pump"
            placeholder="Enter test pump"
            register={register('test_pump')}
            error={errors.test_pump}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputField
            label="Test Medium"
            name="test_medium"
            placeholder="Enter test medium"
            register={register('test_medium')}
            error={errors.test_medium}
          />
          <InputField
            label="Proof Test Pressure"
            name="proof_test_pressure"
            placeholder="Enter proof test pressure"
            register={register('proof_test_pressure')}
            error={errors.proof_test_pressure}
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