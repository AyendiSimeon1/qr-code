// src/utils/records.ts
import axios from 'axios';
import {
  PressureTestingCertificationFormData,
} from '@/components/forms/PressureTestingCertificationForm';
import {
  CalibrationCertificationFormData,
} from '@/components/forms/CalibrationCertificationForm';

const token = localStorage.getItem('authToken');
console.log('the token', token);

export type RecordPayload =
  | (PressureTestingCertificationFormData & { type: 'pressure-testing' })
  | (CalibrationCertificationFormData & { type: 'calibration' });

export interface CreateRecordResponse {
  id: string;
  type: 'pressure-testing' | 'calibration';
  createdAt: string;
  // …any other fields your API returns
}

export const createRecordApi = async (
    payload: RecordPayload
  ): Promise<CreateRecordResponse> => {
    if (typeof window === 'undefined') {
        throw new Error('Cannot create record on the server');
      }
    
      // 2) Grab the token at call time, not module load time
      const token = localStorage.getItem('authToken');
      console.log('i am the token', token);
      if (!token) {
        throw new Error('No auth token found—please log in first.');
      }
  
    // 2. Include it in the Authorization header
    const res = await axios.post<CreateRecordResponse>(
      '/api/records/create',
      payload,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }
    );
  
    return res.data;
  };