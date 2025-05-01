// src/components/features/search/FeatureCard.tsx
import React from 'react';
import Link from 'next/link';
import clsx from 'clsx';
import { Card } from './Card';


interface FeatureCardProps {
  title: string;
  icon: React.ReactNode; // Expecting an icon component instance, e.g., <LocationMarkerIcon />
  href?: string; // Optional: If the card should link somewhere
  onClick?: () => void; // Optional: If the card triggers an action
  className?: string; // Optional: For additional custom styling on the Card
}

export const FeatureCard: React.FC<FeatureCardProps> = ({
  title,
  icon,
  href,
  onClick,
  className,
}) => {
  // Define the inner content of the card
  const content = (
    <Card
      padding="lg" // Generous padding inside the card
      shadow="sm" // Subtle shadow like the mockup
      className={clsx(
        'h-full', // Ensure cards in a grid take full height of the row
        'flex flex-col items-center justify-center', // Center content vertically and horizontally
        'text-center', // Center the text
        'transition-shadow duration-200 ease-in-out', // Smooth transition for hover
        href || onClick ? 'hover:shadow-md cursor-pointer' : 'hover:shadow-sm', // Add hover effect only if interactive
        className // Allow overriding styles
      )}
    >
      {/* Icon Section */}
      <div className="mb-4">
        {/* Render the icon node passed as a prop. */}
        {/* Size/color should ideally be set when passing the icon instance */}
        {/* e.g., <LocationMarkerIcon className="w-12 h-12 text-blue-800" /> */}
        {icon}
      </div>

      {/* Title Section */}
      <h3 className="text-md font-medium text-green-600"> {/* Green text like mockup */}
        {title}
      </h3>
    </Card>
  );

  // Wrap with Link if href is provided
  if (href) {
    // Use legacyBehavior for simple anchor wrapping if needed, otherwise direct wrapping is fine in newer Next.js
    return (
      <Link href={href} onClick={onClick} className="block h-full">
          {content}
      </Link>
    );
  }

  // Add onClick directly if href is not provided but onClick is
  if (onClick) {
    return (
        <div onClick={onClick} className="h-full">
            {content}
        </div>
    );
  }

  // Render non-interactive content if neither href nor onClick is provided
  return <div className="h-full">{content}</div>;
};