// src/components/ui/SelectField.tsx
'use client';

import React from 'react';
import { UseFormRegisterReturn, FieldError } from 'react-hook-form';

interface SelectOption {
  value: string | number;
  label: string;
}

interface SelectFieldProps {
  label: string;
  name: string;
  register: UseFormRegisterReturn;
  options: SelectOption[];
  error?: FieldError;
  containerClassName?: string;
  labelClassName?: string;
  selectClassName?: string;
  placeholder?: string;
  defaultValue?: string | number;
}

export const SelectField: React.FC<SelectFieldProps> = ({
  label,
  name,
  register,
  options,
  error,
  containerClassName = '',
  labelClassName = 'block text-sm font-medium text-gray-700 mb-1',
  selectClassName = '',
  placeholder,
  defaultValue,
}) => {
  const baseSelectClasses =
    'mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md bg-white';

  return (
    <div className={containerClassName}>
      <label htmlFor={name} className={labelClassName}>
        {label}
      </label>
      <select
        id={name}
        defaultValue={defaultValue}
        {...register}
        className={`${baseSelectClasses} ${selectClassName} ${error ? 'border-red-500' : 'border-gray-300'}`}
        aria-invalid={error ? 'true' : 'false'}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <p className="mt-1 text-xs text-red-600">{error.message}</p>}
    </div>
  );
};