// src/components/ui/SpinnerDots.tsx (Different filename to avoid conflict)
import React from 'react';
import clsx from 'clsx';

type SpinnerDotsSize = 'sm' | 'md' | 'lg';

interface SpinnerDotsProps {
    size?: SpinnerDotsSize;
    className?: string;
    color?: string; // e.g., 'bg-blue-500', 'bg-white'
}

export const Spinner: React.FC<SpinnerDotsProps> = ({
    size = 'md',
    className,
    color = 'bg-current', // Defaults to current text color
}) => {
    const sizeClasses: Record<SpinnerDotsSize, string> = {
        sm: 'h-1.5 w-1.5',
        md: 'h-2 w-2',
        lg: 'h-3 w-3',
    };

    const delayClasses = ['animation-delay-[-0.3s]', 'animation-delay-[-0.15s]', ''];

    return (
        <div className={clsx('flex items-center space-x-1', className)}>
            {[0, 1, 2].map((i) => (
                <div
                    key={i}
                    className={clsx(
                        'animate-bounce rounded-full', // Use bounce animation
                        sizeClasses[size],
                        color,
                        // Tailwind doesn't have direct animation-delay utilities by default,
                        // you might need to add them to your tailwind.config.js or use inline styles
                        // Example using inline style:
                        // style={{ animationDelay: `${-0.3 + i * 0.15}s` }}
                    )}
                    // Example using custom utility (if defined in tailwind.config.js)
                    // className={clsx(..., delayClasses[i])}
                    style={{ animationDelay: `${-0.3 + i * 0.15}s` }} // Inline style works directly
                ></div>
            ))}
        </div>
    );
};

// --- Add to your global CSS or Tailwind config if using custom utilities ---
/* In your global CSS (e.g., src/styles/globals.css) */
/* @layer utilities {
    .animation-delay-\[-0\.3s\] { animation-delay: -0.3s; }
    .animation-delay-\[-0\.15s\] { animation-delay: -0.15s; }
} */

// Or in tailwind.config.js (Requires plugin)
// plugins: [
//   function ({ addUtilities }) {
//     addUtilities({
//       '.animation-delay-[-0.3s]': { 'animation-delay': '-0.3s' },
//       '.animation-delay-[-0.15s]': { 'animation-delay': '-0.15s' },
//     })
//   }
// ],