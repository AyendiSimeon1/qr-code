// src/redux/hooks/records.ts
import { useAppDispatch, useAppSelector } from '../hooks/hooks';
import {
  savePressureTestingForm,
  saveCalibrationForm,
  clearForms,
  resetStatus,
  createRecord,
} from '../slices/records';
import { PressureTestingCertificationFormData } from '@/components/forms/PressureTestingCertificationForm';
import { CalibrationCertificationFormData } from '@/components/forms/CalibrationCertificationForm';
import { useState } from 'react';

// Custom hook for records functionality
export const useRecords = () => {
  const dispatch = useAppDispatch();
  const {
    pressureTestingForm,
    calibrationForm,
    isSubmitting,
    isSuccess,
    error,
  } = useAppSelector((state) => state.records);
  const [certificateData, setCertificateData] = useState<any>(null);

  // Save form data without submitting
  const savePressureTestingFormData = (
    data: PressureTestingCertificationFormData
  ) => {
    dispatch(savePressureTestingForm(data));
  };

  const saveCalibrationFormData = (
    data: CalibrationCertificationFormData
  ) => {
    dispatch(saveCalibrationForm(data));
  };

  const submitPressureTestingForm = async (data: PressureTestingCertificationFormData) => {
    const result = await dispatch(
      createRecord({ type: 'pressure-testing', ...data })
    ).unwrap();

    console.log('I am the result', result);
  
    if (result.data?.qr_code_url) {
      setCertificateData({ 
        ...data, 
        qr_code_url: result.data.qr_code_url 
      });
    }
  };

  console.log('I am the certificate data', certificateData);

  const submitCalibrationForm = async (data: CalibrationCertificationFormData) => {
    const result = await dispatch(
      createRecord({ type: 'calibration', ...data })
    ).unwrap();
    console.log('I am the result at cali', result);
    if (result.data?.qr_code_url) {
      setCertificateData({ 
        ...data, 
        qr_code_url: result.data.qr_code_url 
      });
    }
  };

  // Clear form data
  const clearFormData = () => {
    dispatch(clearForms());
  };

  // Reset status (after success or error)
  const resetFormStatus = () => {
    dispatch(resetStatus());
  };

  return {
    // State
    pressureTestingForm,
    calibrationForm,
    isSubmitting,
    isSuccess,
    error,
    // Actions
    savePressureTestingFormData,
    saveCalibrationFormData,
    submitPressureTestingForm,
    submitCalibrationForm,
    certificateData,
    setCertificateData,
    clearFormData,
    resetFormStatus,
  };
};
