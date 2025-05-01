// src/components/features/auth/LoginForm.tsx
import React from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { Button } from '../ui/Button';
import { InputField } from '../ui/InputField';
import { PasswordInputField } from '../ui/PasswordInputField';

export interface LoginFormData {
  email: string;
  password: string;
}

interface LoginFormProps {
  onSubmit: SubmitHandler<LoginFormData>;
  isLoading?: boolean; // Allow parent to control loading state if needed
}

export const LoginForm: React.FC<LoginFormProps> = ({ onSubmit, isLoading }) => {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginFormData>({
    mode: 'onBlur'
  });

  const loadingState = isLoading !== undefined ? isLoading : isSubmitting;

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <InputField
        label="Login"
        name="email"
        type="email"
        placeholder="Enter email address"
        register={register('email', {
          required: 'Email address is required',
          pattern: {
            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
            message: 'Invalid email address format',
          },
        })}
        error={errors.email}
        autoComplete="email"
        containerClassName="mb-6"
      />

      <PasswordInputField
        name="password"
        placeholder="Enter Password"
        register={register('password', {
          required: 'Password is required',
        })}
        error={errors.password}
        autoComplete="current-password"
        containerClassName="mb-8"
      />

      <Button
        type="submit"
        variant="primary"
        className="w-full"
        isLoading={loadingState}
        disabled={loadingState}
      >
        Log In
      </Button>
    </form>
  );
};