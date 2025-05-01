import React from 'react';
import Image from 'next/image'; // Use Next.js Image for optimization
import Link from 'next/link'; // Optional: make logo clickable

interface LogoProps {
  href?: string; // Optional link destination (e.g., "/")
  width?: number;
  height?: number;
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({ href = '/', width = 150, height = 40, className }) => {
  const logoImage = (
    <Image
      src="/path/to/your/ofissa-logo.png" // UPDATE THIS PATH
      alt="OFISSA International Limited Logo"
      width={width}
      height={height}
      priority // Load logo quickly, especially if in LCP
      className={className}
      style={{ height: 'auto' }} // Maintain aspect ratio
    />
  );

  return href ? <Link href={href}>{logoImage}</Link> : logoImage;
};