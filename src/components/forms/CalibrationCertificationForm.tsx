'use client';

import React from 'react';
import { useForm, SubmitHandler, useFieldArray } from 'react-hook-form';
import { Button } from '../ui/Button';
import { InputField } from '../ui/InputField';
import { DatePickerField } from '../ui/DatePickerField';
import { SelectField } from '../ui/SelectField';

export interface CalibrationRun {
  run_s_n: string;
  percent_input: string;
  readings_reference_instrument: string;
  readings_instrument_on_test: string;
  error_percent: string;
}

export interface CalibrationCertificationFormData {
  company_name: string;
  email: string;
  cert_no: string;
  seriel_no: string;
  certificate_type: string;
  doe: string;
  method: string;
  date_issued: string;

  // Dead Weight Tester Ametek
  dead_weight_tester_ametek_serial_no: string;
  dead_weight_tester_ametek_calibration_start: string;
  dead_weight_tester_ametek_end_date: string;

  // Precision Test Gauge De Wit
  precision_test_gauge_dewit_serial_no: string;
  precision_test_gauge_dewit_calibration_start: string;
  precision_test_gauge_dewit_calibration_end_date: string;

  // Equipment Under Test
  manufacturer: string;
  equipment_s_no: string;
  ref_equipment: string;
  range: string;
  connection: string;

  runs: CalibrationRun[];
}

interface CalibrationCertificationFormProps {
  onSubmit: SubmitHandler<CalibrationCertificationFormData>;
  isLoading?: boolean;
}

export const CalibrationCertificationForm: React.FC<CalibrationCertificationFormProps> = ({ onSubmit, isLoading }) => {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CalibrationCertificationFormData>({
    mode: 'onBlur',
    defaultValues: {
      certificate_type: 'Calibration Certification',
      runs: [{ run_s_n: '', percent_input: '', readings_reference_instrument: '', readings_instrument_on_test: '', error_percent: '' }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'runs',
  });

  const loadingState = isLoading !== undefined ? isLoading : isSubmitting;

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-8">
      {/* Basic Information Section */}
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <SelectField
            label="Method"
            name="method"
            register={register('method', { required: 'Method is required' })}
            options={[{ value: 'method1', label: 'Method 1' }, { value: 'method2', label: 'Method 2' }]}
            error={errors.method}
            placeholder="Select method"
          />
          <DatePickerField
            label="Date Issued"
            name="date_issued"
            register={register('date_issued', { required: 'Date issued is required' })}
            error={errors.date_issued}
          />
        </div>
      </div>

      {/* Reference Equipment Section */}
      <div className="p-6 border border-gray-300 rounded-lg shadow-sm bg-white">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Reference Equipment</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
          {/* Dead Weight Tester Ametek */}
          <div className="p-4 border border-gray-200 rounded-md">
            <h3 className="text-lg font-medium text-gray-600 mb-3">DEAD WEIGHT TESTER AMETEK</h3>
            <InputField
              label="Serial No."
              name="dead_weight_tester_ametek_serial_no"
              placeholder="Enter serial no"
              register={register('dead_weight_tester_ametek_serial_no')}
              error={errors.dead_weight_tester_ametek_serial_no}
              containerClassName="mb-4"
            />
            <div className="grid grid-cols-2 gap-4">
              <DatePickerField
                label="Calibration Start"
                name="dead_weight_tester_ametek_calibration_start"
                register={register('dead_weight_tester_ametek_calibration_start')}
                error={errors.dead_weight_tester_ametek_calibration_start}
              />
              <DatePickerField
                label="End Date"
                name="dead_weight_tester_ametek_end_date"
                register={register('dead_weight_tester_ametek_end_date')}
                error={errors.dead_weight_tester_ametek_end_date}
              />
            </div>
          </div>

          {/* Precision Test Gauge De Wit */}
          <div className="p-4 border border-gray-200 rounded-md">
            <h3 className="text-lg font-medium text-gray-600 mb-3">PRECISION TEST GAUGE DE WIT</h3>
            <InputField
              label="Serial No."
              name="precision_test_gauge_dewit_serial_no"
              placeholder="Enter serial no"
              register={register('precision_test_gauge_dewit_serial_no')}
              error={errors.precision_test_gauge_dewit_serial_no}
              containerClassName="mb-4"
            />
            <div className="grid grid-cols-2 gap-4">
              <DatePickerField
                label="Calibration Start"
                name="precision_test_gauge_dewit_calibration_start"
                register={register('precision_test_gauge_dewit_calibration_start')}
                error={errors.precision_test_gauge_dewit_calibration_start}
              />
              <DatePickerField
                label="End Date"
                name="precision_test_gauge_dewit_calibration_end_date"
                register={register('precision_test_gauge_dewit_calibration_end_date')}
                error={errors.precision_test_gauge_dewit_calibration_end_date}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Equipment Under Test Details Section */}
      <div className="p-6 border border-gray-300 rounded-lg shadow-sm bg-white">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Equipment Under Test</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
          <InputField 
            label="Manufacturer" 
            name="manufacturer" 
            placeholder="Enter value" 
            register={register('manufacturer')} 
            error={errors.manufacturer} 
          />
          <InputField 
            label="Serial No" 
            name="equipment_s_no" 
            placeholder="Enter value" 
            register={register('equipment_s_no')} 
            error={errors.equipment_s_no} 
          />
          <InputField 
            label="Reference Equipment" 
            name="ref_equipment" 
            placeholder="Enter value" 
            register={register('ref_equipment')} 
            error={errors.ref_equipment} 
          />
          <InputField 
            label="Range" 
            name="range" 
            placeholder="Enter value" 
            register={register('range')} 
            error={errors.range} 
          />
          <InputField 
            label="Connection" 
            name="connection" 
            placeholder="Enter value" 
            register={register('connection')} 
            error={errors.connection} 
          />
        </div>
      </div>

      {/* Runs Section */}
      <div className="p-6 border border-gray-300 rounded-lg shadow-sm bg-white">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Runs</h2>
        {fields.map((item, index) => (
          <div key={item.id} className="p-4 border border-gray-200 rounded-md mb-4 space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
              <InputField
                label={`Run S/N (#${index + 1})`}
                name={`runs.${index}.run_s_n`}
                placeholder="Enter S/N"
                register={register(`runs.${index}.run_s_n`)}
                error={errors.runs?.[index]?.run_s_n}
              />
              <InputField
                label="% Input"
                name={`runs.${index}.percent_input`}
                placeholder="Enter value"
                register={register(`runs.${index}.percent_input`)}
                error={errors.runs?.[index]?.percent_input}
              />
              <InputField
                label="Reading (Ref. Inst.)"
                name={`runs.${index}.readings_reference_instrument`}
                placeholder="Ref. Instrument"
                register={register(`runs.${index}.readings_reference_instrument`)}
                error={errors.runs?.[index]?.readings_reference_instrument}
              />
              <InputField
                label="Reading (Inst. on Test)"
                name={`runs.${index}.readings_instrument_on_test`}
                placeholder="Instrument on Test"
                register={register(`runs.${index}.readings_instrument_on_test`)}
                error={errors.runs?.[index]?.readings_instrument_on_test}
              />
              <InputField
                label="Error (%)"
                name={`runs.${index}.error_percent`}
                placeholder="Enter value"
                register={register(`runs.${index}.error_percent`)}
                error={errors.runs?.[index]?.error_percent}
              />
            </div>
            {fields.length > 1 && (
              <Button type="button" variant="dangerOutline" onClick={() => remove(index)} className="mt-2 text-sm">
                Remove Run
              </Button>
            )}
          </div>
        ))}
        <Button
          type="button"
          variant="secondaryOutline"
          onClick={() => append({ run_s_n: '', percent_input: '', readings_reference_instrument: '', readings_instrument_on_test: '', error_percent: '' })}
          className="mt-4"
        >
          Add new record
        </Button>
      </div>

      <Button
        type="submit"
        variant="primary"
        className="w-full md:w-auto"
        isLoading={loadingState}
        disabled={loadingState}
      >
        Create Record
      </Button>
    </form>
  );
};