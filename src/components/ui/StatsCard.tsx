// src/components/features/dashboard/StatCard.tsx
import React from 'react';
import { Card } from './Card';


interface StatCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode; // Optional: For adding an icon if desired later
}

export const StatCard: React.FC<StatCardProps> = ({ title, value, icon }) => {
  return (
    <Card padding="md" shadow="sm" className="bg-white"> {/* Explicitly white background */}
      <div className="flex items-center justify-between"> {/* Use flex for potential icon alignment */}
        <div>
          <p className="text-sm font-medium text-gray-500 truncate">{title}</p>
          {/* Style the value exactly like the image: large, bold */}
          <p className="mt-1 text-3xl font-semibold text-gray-900">
            {/* Format value with comma if it's a number */}
            {typeof value === 'number' ? value.toLocaleString() : value}
          </p>
        </div>
        {icon && (
          <div className="flex-shrink-0 text-gray-400">
            {/* Render the icon if provided */}
            {icon}
          </div>
        )}
      </div>
    </Card>
  );
};