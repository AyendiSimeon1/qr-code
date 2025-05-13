// src/components/forms/CalibrationCertificationForm.tsx
'use client';

import React from 'react';
import { useForm, SubmitHandler, useFieldArray } from 'react-hook-form';
import { Button } from '../ui/Button';
import { InputField } from '../ui/InputField';
import { DatePickerField } from '../ui/DatePickerField';
import { SelectField } from '../ui/SelectField';

export interface CalibrationRun {
  runSerialNo: string;
  percentInput: string;
  readingRefInstrument: string;
  readingInstrumentOnTest: string;
  errorPercent: string;
}

export interface CalibrationCertificationFormData {
  client: string;
  method: string;
  dateIssued: string;

  // Dead Weight Tester Ametek
  dwtSerialNo: string;
  dwtCalibrationStart: string;
  dwtCalibrationEnd: string;

  // Precision Test Gauge De Wit
  ptgSerialNo: string;
  ptgCalibrationStart: string;
  ptgCalibrationEnd: string;

  // Equipment Under Test
  eutManufacturer: string;
  eutSerialNo: string;
  eutAccuracy: string;
  eutRange: string;
  eutSize: string;
  eutConnection: string;

  runs: CalibrationRun[];
}

interface CalibrationCertificationFormProps {
  onSubmit: SubmitHandler<CalibrationCertificationFormData>;
  isLoading?: boolean;
}

export const CalibrationCertificationForm: React.FC<CalibrationCertificationFormProps> = ({ onSubmit, isLoading }) => {
  const {
    register,
    control, // for useFieldArray
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CalibrationCertificationFormData>({
    mode: 'onBlur',
    defaultValues: {
      runs: [{ runSerialNo: '', percentInput: '', readingRefInstrument: '', readingInstrumentOnTest: '', errorPercent: '' }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'runs',
  });

  const loadingState = isLoading !== undefined ? isLoading : isSubmitting;

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-8">
      {/* Top Section */}
      <div className="p-6 border border-gray-300 rounded-lg shadow-sm bg-white">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <InputField
            label="Client"
            name="client"
            placeholder="Enter client name"
            register={register('client', { required: 'Client name is required' })}
            error={errors.client}
          />
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
            name="dateIssued"
            register={register('dateIssued', { required: 'Date issued is required' })}
            error={errors.dateIssued}
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
              name="dwtSerialNo"
              placeholder="Enter serial no"
              register={register('dwtSerialNo')}
              error={errors.dwtSerialNo}
              containerClassName="mb-4"
            />
            <div className="grid grid-cols-2 gap-4">
              <DatePickerField
                label="Calibration Start"
                name="dwtCalibrationStart"
                register={register('dwtCalibrationStart')}
                error={errors.dwtCalibrationStart}
              />
              <DatePickerField
                label="End Date"
                name="dwtCalibrationEnd"
                register={register('dwtCalibrationEnd')}
                error={errors.dwtCalibrationEnd}
              />
            </div>
          </div>

          {/* Precision Test Gauge De Wit */}
          <div className="p-4 border border-gray-200 rounded-md">
            <h3 className="text-lg font-medium text-gray-600 mb-3">PRECISION TEST GAUGE DE WIT</h3>
            <InputField
              label="Serial No."
              name="ptgSerialNo"
              placeholder="Enter serial no"
              register={register('ptgSerialNo')}
              error={errors.ptgSerialNo}
              containerClassName="mb-4"
            />
            <div className="grid grid-cols-2 gap-4">
              <DatePickerField
                label="Calibration Start"
                name="ptgCalibrationStart"
                register={register('ptgCalibrationStart')}
                error={errors.ptgCalibrationStart}
              />
              <DatePickerField
                label="End Date"
                name="ptgCalibrationEnd"
                register={register('ptgCalibrationEnd')}
                error={errors.ptgCalibrationEnd}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Equipment Under Test Details Section */}
      <div className="p-6 border border-gray-300 rounded-lg shadow-sm bg-white">
         <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6">
            <InputField label="Manufacturer" name="eutManufacturer" placeholder="Enter value" register={register('eutManufacturer')} error={errors.eutManufacturer} />
            <InputField label="Serial No" name="eutSerialNo" placeholder="Enter value" register={register('eutSerialNo')} error={errors.eutSerialNo} />
            <InputField label="Accuracy" name="eutAccuracy" placeholder="Enter value" register={register('eutAccuracy')} error={errors.eutAccuracy} />
            <InputField label="Range" name="eutRange" placeholder="Enter value" register={register('eutRange')} error={errors.eutRange} />
            <InputField label="Size" name="eutSize" placeholder="Enter value" register={register('eutSize')} error={errors.eutSize} />
            <InputField label="Connection" name="eutConnection" placeholder="Enter value" register={register('eutConnection')} error={errors.eutConnection} />
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
                name={`runs.${index}.runSerialNo`}
                placeholder="Enter S/N"
                register={register(`runs.${index}.runSerialNo`)}
                error={errors.runs?.[index]?.runSerialNo}
              />
              <InputField
                label="% Input"
                name={`runs.${index}.percentInput`}
                placeholder="Enter value"
                register={register(`runs.${index}.percentInput`)}
                error={errors.runs?.[index]?.percentInput}
              />
              <InputField
                label="Reading (Ref. Inst.)"
                name={`runs.${index}.readingRefInstrument`}
                placeholder="Ref. Instrument"
                register={register(`runs.${index}.readingRefInstrument`)}
                error={errors.runs?.[index]?.readingRefInstrument}
              />
              <InputField
                label="Reading (Inst. on Test)"
                name={`runs.${index}.readingInstrumentOnTest`}
                placeholder="Instrument on Test"
                register={register(`runs.${index}.readingInstrumentOnTest`)}
                error={errors.runs?.[index]?.readingInstrumentOnTest}
              />
              <InputField
                label="Error (%)"
                name={`runs.${index}.errorPercent`}
                placeholder="Enter value"
                register={register(`runs.${index}.errorPercent`)}
                error={errors.runs?.[index]?.errorPercent}
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
          onClick={() => append({ runSerialNo: '', percentInput: '', readingRefInstrument: '', readingInstrumentOnTest: '', errorPercent: '' })}
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