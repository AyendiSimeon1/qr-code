// src/components/features/dashboard/RecordsTable.tsx
import React from 'react';
import { Badge } from './Badge';
import { Spinner } from './Spinner'; // Assuming you have a Spinner component   

export interface RecordData {
  due_date: string | number | Date;
  type_of_inspection: ReactNode;
  test_date: ReactNode;
  id: string | number;
  company_name: string;
  email: string;
  dateOfExpiration: string; // Or Date object, format as needed
  testStatus: 'Exp+ired' | 'Current' | 'Warning'; // Ensure 'Warning' is included
}

// --- Define or Import Warning Icon ---
const WarningIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" {...props}>
        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 3.001-1.742 3.001H4.42c-1.53 0-2.493-1.667-1.743-3.001l5.58-9.92zM10 13a1 1 0 110-2 1 1 0 010 2zm-1-4a1 1 0 011-1h.008a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd"></path>
    </svg>
);
// --- End Warning Icon ---

interface RecordsTableProps {
  records: RecordData[];
  isLoading?: boolean;
  onRowClick?: (record: RecordData) => void; // Optional: For making rows clickable
}

// Mapping for status to badge appearance
const statusMap: Record<RecordData['testStatus'], { color: 'red' | 'green' | 'yellow', text: string }> = {
    'Expired': { color: 'red', text: 'Expired' },
    'Current': { color: 'green', text: 'Current' },
    'Warning': { color: 'yellow', text: 'Expiring Soon' }, // Or 'Warning', adjust text as needed
};


export const RecordsTable: React.FC<RecordsTableProps> = ({ records, isLoading = false, onRowClick }) => {

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-10 bg-white rounded-lg shadow border border-gray-200">
        <Spinner size="lg" />
        <span className="ml-3 text-gray-500">Loading records...</span>
      </div>
    );
  }

  if (!records || records.length === 0) {
    return (
      <div className="text-center p-10 text-gray-500 bg-white rounded-lg shadow border border-gray-200">
        No records found.
      </div>
    );
  }

  return (
    // Container with shadow, border, rounding, and horizontal scroll for small screens
    <div className="shadow border border-gray-200 sm:rounded-lg overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        {/* Table Head: Styled exactly like the image */}
        <thead className="bg-gray-800">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
              S/N
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
              Company Name
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
              Test Type
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
              Date of Expiration
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
              Test Status
            </th>
            {/* Empty header for the icon column */}
            <th scope="col" className="relative px-6 py-3">
              <span className="sr-only">Status Icon</span>
            </th>
          </tr>
        </thead>
        {/* Table Body */}
        <tbody className="bg-white divide-y divide-gray-200">
          {records.map((record, index) => {
            const statusInfo = statusMap[record.testStatus]; // Get badge info
            const isClickable = !!onRowClick; // Check if rows should be clickable

            return (
              <tr
                key={record.id}
                className={isClickable ? 'hover:bg-gray-50 cursor-pointer transition duration-150 ease-in-out' : ''}
                onClick={isClickable ? () => onRowClick(record) : undefined}
              >
                {/* S/N Column */}
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {index + 1}
                </td>
                {/* Company Name Column */}
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                  {record.company_name}
                </td>
                {/* Email Column */}
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {record.type_of_inspection
}
                </td>
                {/* Date of Expiration Column */}
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {/* You might want to format the date here if it's a Date object */}
                  {record.test_date
                    ? new Date(record.due_date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                      })
                    : 'N/A'}
                </td>
          
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {statusInfo && <Badge color={statusInfo.color}>{statusInfo.text}</Badge>}
                </td>
               
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    {/* Conditionally render WarningIcon */}
                    {record.testStatus === 'Warning' && <WarningIcon />}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
 
    </div>
  );
};