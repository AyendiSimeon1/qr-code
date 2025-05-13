// src/redux/hooks/records.ts
import { useAppDispatch, useAppSelector } from './auth';
import {
  savePressureTestingForm,
  saveCalibrationForm,
  clearForms,
  resetStatus,
  createRecord,
  RecordType,
} from '../slices/records';
import { PressureTestingCertificationFormData } from '@/components/forms/PressureTestingCertificationForm';
import { CalibrationCertificationFormData } from '@/components/forms/CalibrationCertificationForm';

// Custom hooks for records functionality
export const useRecords = () => {
  const dispatch = useAppDispatch();
  const recordsState = useAppSelector((state) => state.records);

  // Save form data without submitting
  const savePressureTestingFormData = (data: PressureTestingCertificationFormData) => {
    dispatch(savePressureTestingForm(data));
  };

  const saveCalibrationFormData = (data: CalibrationCertificationFormData) => {
    dispatch(saveCalibrationForm(data));
  };

  // Submit form data to create a record
  const submitPressureTestingForm = (data: PressureTestingCertificationFormData) => {
    return dispatch(createRecord({ type: 'pressure-testing', formData: data }));
  };

  const submitCalibrationForm = (data: CalibrationCertificationFormData) => {
    return dispatch(createRecord({ type: 'calibration', formData: data }));
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
    pressureTestingForm: recordsState.pressureTestingForm,
    calibrationForm: recordsState.calibrationForm,
    isSubmitting: recordsState.isSubmitting,
    isSuccess: recordsState.isSuccess,
    error: recordsState.error,
    
    // Actions
    savePressureTestingFormData,
    saveCalibrationFormData,
    submitPressureTestingForm,
    submitCalibrationForm,
    clearFormData,
    resetFormStatus,
  };
};