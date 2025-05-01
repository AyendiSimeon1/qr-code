// src/components/ui/PasswordInputField.tsx
import React, { useState } from 'react';
import { InputField } from './InputField'; // Assuming InputField is in the same directory
import { UseFormRegisterReturn, FieldError } from 'react-hook-form';

// --- Placeholder Icons (Replace with your actual icons) ---
// Option 1: Inline SVGs (simple, no extra dependency)
const EyeIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
);

const EyeOffIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
    </svg>
);
// Option 2: If using react-icons
// import { FiEye, FiEyeOff } from 'react-icons/fi';
// --- End Icons ---


interface PasswordInputFieldProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
    label?: string;
    name: string; // Required for react-hook-form
    register?: UseFormRegisterReturn; // From react-hook-form
    error?: FieldError;
    placeholder?: string;
    containerClassName?: string;
    // Inherit other InputHTMLAttributes like required, disabled, etc.
}

export const PasswordInputField: React.FC<PasswordInputFieldProps> = ({
    label = "Password", // Default label
    name,
    register,
    error,
    placeholder = "Enter Password", // Default placeholder
    containerClassName,
    ...props // Pass down other standard input attributes
}) => {
    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword(prevState => !prevState);
    };

    // Define the toggle button element
    const toggleIcon = (
        <button
            type="button" // Important: Prevent form submission
            onClick={togglePasswordVisibility}
            className="focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-indigo-500 rounded" // Add focus styles for accessibility
            aria-label={showPassword ? "Hide password" : "Show password"} // Accessibility
        >
            {showPassword
                ? <EyeOffIcon className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                : <EyeIcon className="h-5 w-5 text-gray-400 hover:text-gray-600" />
            }
            {/* Or using react-icons: */}
            {/* {showPassword ? <FiEyeOff size={20} className="text-gray-400 hover:text-gray-600" /> : <FiEye size={20} className="text-gray-400 hover:text-gray-600" />} */}
        </button>
    );

    return (
        <InputField
            label={label}
            name={name}
            type={showPassword ? 'text' : 'password'} // Dynamically set type
            register={register}
            error={error}
            placeholder={placeholder}
            containerClassName={containerClassName}
            trailingIcon={toggleIcon} // Pass the button as the trailing icon
            autoComplete="current-password" // Good practice for password fields
            {...props} // Spread remaining props (like required, disabled, etc.)
        />
    );
};