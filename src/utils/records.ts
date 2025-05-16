import axios from 'axios';
import {
  PressureTestingCertificationFormData,
} from '@/components/forms/PressureTestingCertificationForm';
import {
  CalibrationCertificationFormData,
} from '@/components/forms/CalibrationCertificationForm';

export type RecordPayload =
  | (PressureTestingCertificationFormData & { type: 'pressure-testing' })
  | (CalibrationCertificationFormData & { type: 'calibration' });

/**
 * Sends a request to create a new record.
 *
 * @param payload - The form data combined with a record type.
 * @returns The response data from the API.
 * @throws Error if called on the server or if no auth token is present.
 */
export const createRecordApi = async (
  payload: RecordPayload
): Promise<any> => {
  // Prevent usage during server-side rendering
  if (typeof window === 'undefined') {
    throw new Error('Cannot create record on the server');
  }

  // Grab the token at call time
  const token = localStorage.getItem('authToken');
  console.log('i am the token', token);
  if (!token) {
    throw new Error('No auth token found—please log in first.');
  }

  // Make the API request
  const response = await axios.post<any>(
    '/api/records/create',
    payload,
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};
