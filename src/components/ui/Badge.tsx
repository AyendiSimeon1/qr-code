import React from 'react';
import clsx from 'clsx';

type BadgeColor = 'green' | 'red' | 'yellow' | 'blue' | 'gray'; // Extend as needed

interface BadgeProps {
  color?: BadgeColor;
  children: React.ReactNode;
  className?: string;
  dot?: boolean; // Optional leading dot
}

export const Badge: React.FC<BadgeProps> = ({
  color = 'gray',
  children,
  className,
  dot = false,
}) => {
  const colorStyles: Record<BadgeColor, string> = {
    green: 'bg-green-100 text-green-800', // Like 'Current'
    red: 'bg-red-100 text-red-800',     // Like 'Expired'
    yellow: 'bg-yellow-100 text-yellow-800', // Like the warning icon row
    blue: 'bg-blue-100 text-blue-800',
    gray: 'bg-gray-100 text-gray-800',
  };
   const dotColorStyles: Record<BadgeColor, string> = {
    green: 'bg-green-500',
    red: 'bg-red-500',
    yellow: 'bg-yellow-500',
    blue: 'bg-blue-500',
    gray: 'bg-gray-500',
  };

  return (
    <span
      className={clsx(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
        colorStyles[color],
        className
      )}
    >
      {dot && <span className={clsx('w-2 h-2 mr-1.5 rounded-full', dotColorStyles[color])}></span>}
      {children}
    </span>
  );
};