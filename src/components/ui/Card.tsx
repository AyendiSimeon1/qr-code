import React from 'react';
import clsx from 'clsx';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  padding?: 'sm' | 'md' | 'lg' | 'none'; // Control internal padding
  shadow?: 'sm' | 'md' | 'lg' | 'none';
}

export const Card: React.FC<CardProps> = ({
  children,
  padding = 'md',
  shadow = 'sm',
  className,
  ...props
}) => {
  const paddingStyles = {
    sm: 'p-4',
    md: 'p-6', // Default
    lg: 'p-8',
    none: 'p-0',
  };

  const shadowStyles = {
    sm: 'shadow-sm', // Default
    md: 'shadow-md',
    lg: 'shadow-lg',
    none: 'shadow-none',
  }

  return (
    <div
      className={clsx(
        'bg-white rounded-lg', // Base styles
        'border border-gray-100', // Subtle border like in mockups
        paddingStyles[padding],
        shadowStyles[shadow],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};