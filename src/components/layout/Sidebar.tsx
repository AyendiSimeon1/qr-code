import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Logo } from '../ui/Logo'; // Adjust path
import clsx from 'clsx';
// Import your icons (e.g., HomeIcon, CogIcon)

const HomeIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" {...props}>
    <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"></path>
  </svg>
);
const PlusCircleIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const CogIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" {...props}>
    <path
      fillRule="evenodd"
      d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01-.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z"
      clipRule="evenodd"
    ></path>
  </svg>
);

const QrCodeIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h2v2H7zm0 8h2v2H7zm8-8h2v2h-2zm0 8h2v2h-2zM7 11h2v2H7zm8 0h2v2h-2z" />
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" strokeWidth={2} stroke="currentColor" fill="none" />
  </svg>
);




const navigation = [
  { name: 'Home', href: '/dashboard', icon: HomeIcon }, // Adjust hrefs
  { name: 'Create Record', href: '/records/create', icon: PlusCircleIcon },
  { name: 'Scan QR Code', href: '/scan-qr', icon: QrCodeIcon },

];

export const Sidebar: React.FC = () => {
  const pathname = usePathname();

  return (
    <div className="w-64 bg-gray-900 text-white flex flex-col flex-shrink-0"> {/* Dark sidebar like mockup */}
        <div className="h-20 flex items-center justify-center px-4 flex-shrink-0"> {/* Adjust height */}
             <Logo href="/dashboard" width={120} className="filter brightness-0 invert"/> {/* Adjust logo for dark bg */}
        </div>
        <nav className="flex-1 px-2 py-4 space-y-1">
            {navigation.map((item) => (
            <Link
                key={item.name}
                href={item.href}
                className={clsx(
                'group flex items-center px-3 py-3 text-sm font-medium rounded-md transition duration-150 ease-in-out',
                pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href))
                    ? 'bg-gray-800 text-white' // Active state
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white' // Inactive state
                )}
            >
                <item.icon
                 className={clsx(
                    'mr-3 flex-shrink-0 h-6 w-6',
                     pathname === item.href ? 'text-gray-300' : 'text-gray-400 group-hover:text-gray-300'
                 )}
                 aria-hidden="true"
                />
                {item.name}
            </Link>
            ))}
      </nav>
      {/* Optional: User profile/logout section at the bottom */}
    </div>
  );
};