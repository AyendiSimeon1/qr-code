import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Logo } from '../ui/Logo'; // Adjust path
import clsx from 'clsx';
import Image from 'next/image';

// Icon components (unchanged)
const HomeIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" {...props}>
    <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
  </svg>
);
const PlusCircleIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);
const CogIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" {...props}>
    <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01-.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
  </svg>
);
const QrCodeIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h2v2H7zm0 8h2v2H7zm8-8h2v2h-2zm0 8h2v2h-2zM7 11h2v2H7zm8 0h2v2h-2z" />
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" strokeWidth={2} stroke="currentColor" fill="none" />
  </svg>
);
const MenuIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
  </svg>
);
const XIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const navigation = [
  { name: 'Home', href: '/dashboard', icon: HomeIcon },
  { name: 'Create Record', href: '/records/create', icon: PlusCircleIcon },
  { name: 'Scan QR Code', href: '/scan-qr', icon: QrCodeIcon },
];

export const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <>
      {/* Mobile menu button */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setSidebarOpen((open) => !open)}
          className="p-2 rounded-md text-gray-500 hover:text-white hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
        >
          <span className="sr-only">Toggle sidebar</span>
          {sidebarOpen ? <XIcon /> : <MenuIcon />}
        </button>
      </div>

      {/* Overlay when open */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar panel */}
      <aside
        className={clsx(
          'fixed inset-y-0 left-0 transform bg-gray-900 text-white w-64 flex flex-col z-50 transition-transform duration-300 ease-in-out',
          {
            '-translate-x-full': !sidebarOpen,
            'translate-x-0': sidebarOpen,
          },
          'md:relative md:translate-x-0 md:flex-shrink-0'
        )}
      >
        <div className="h-20 flex items-center justify-center px-4 flex-shrink-0">
          <Image src="/ofissa-logo.png" alt="Logo" width={200} height={200} />
        </div>
        <nav className="flex-1 px-2 py-4 space-y-1">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={clsx(
                'group flex items-center px-3 py-3 text-sm font-medium rounded-md transition-colors',
                pathname === item.href
                  ? 'bg-gray-800 text-white'
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'
              )}
              onClick={() => setSidebarOpen(false)}
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
      </aside>
    </>
  );
};
