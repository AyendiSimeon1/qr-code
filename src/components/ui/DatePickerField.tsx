// src/components/ui/DatePickerField.tsx
'use client';

import React from 'react';
import { UseFormRegisterReturn, FieldError } from 'react-hook-form';

interface DatePickerFieldProps {
  label: string;
  name: string;
  register: UseFormRegisterReturn;
  error?: FieldError;
  containerClassName?: string;
  labelClassName?: string;
  inputClassName?: string;
  placeholder?: string;
  defaultValue?: string;
}

export const DatePickerField: React.FC<DatePickerFieldProps> = ({
  label,
  name,
  register,
  error,
  containerClassName = '',
  labelClassName = 'block text-sm font-medium text-gray-700 mb-1',
  inputClassName = '',
  placeholder,
  defaultValue,
}) => {
  const baseInputClasses =
    'mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm';

  return (
    <div className={containerClassName}>
      <label htmlFor={name} className={labelClassName}>
        {label}
      </label>
      <input
        type="date"
        id={name}
        placeholder={placeholder}
        defaultValue={defaultValue}
        {...register}
        className={`${baseInputClasses} ${inputClassName} ${error ? 'border-red-500' : 'border-gray-300'}`}
        aria-invalid={error ? 'true' : 'false'}
      />
      {error && <p className="mt-1 text-xs text-red-600">{error.message}</p>}
    </div>
  );
};