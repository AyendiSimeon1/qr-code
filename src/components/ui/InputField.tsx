import React from 'react';
import clsx from 'clsx';
import { UseFormRegisterReturn, FieldError } from 'react-hook-form';

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  name: string; // Required for react-hook-form
  register?: UseFormRegisterReturn; // From react-hook-form
  error?: FieldError;
  leadingIcon?: React.ReactNode;
  trailingIcon?: React.ReactNode; // For password visibility toggle etc.
  containerClassName?: string;
}

export const InputField: React.FC<InputFieldProps> = ({
  label,
  name,
  type = 'text',
  register,
  error,
  leadingIcon,
  trailingIcon,
  className,
  containerClassName,
  ...props
}) => {
  const inputId = `input-${name}`;
  return (
    <div className={clsx('mb-4', containerClassName)}>
      {label && (
        <label htmlFor={inputId} className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <div className="relative rounded-md shadow-sm">
        {leadingIcon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            {/* Adjust icon styling as needed */}
            <span className="text-gray-500 sm:text-sm">{leadingIcon}</span>
          </div>
        )}
        <input
          id={inputId}
          // name is provided through the register object if available
          type={type}
          className={clsx(
            'block w-full px-4 py-2 border rounded-md sm:text-sm', // Base styles
            'bg-gray-50 border-gray-200', // Example light background from screenshots
            'focus:ring-indigo-500 focus:border-indigo-500', // Focus styles
            error ? 'border-red-500 text-red-600 focus:ring-red-500 focus:border-red-500' : 'border-gray-300',
            leadingIcon ? 'pl-10' : '',
            trailingIcon ? 'pr-10' : '',
            className
          )}
          {...(register ? register : {})} // Spread register props if provided
          {...props}
        />
        {trailingIcon && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
             {/* Make sure this wrapper doesn't block input interaction if the icon IS interactive (like password toggle) */}
            {trailingIcon}
          </div>
        )}
      </div>
      {error && <p className="mt-1 text-xs text-red-600">{error.message}</p>}
    </div>
  );
};