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

  // Submit form data to create a record
  const submitPressureTestingForm = (
    data: PressureTestingCertificationFormData
  ) => {
    // Spread form data to match RecordPayload (no formData property)
    return dispatch(
      createRecord({ type: 'pressure-testing', ...data })
    ).unwrap();
  };

  const submitCalibrationForm = (
    data: CalibrationCertificationFormData
  ) => {
    return dispatch(
      createRecord({ type: 'calibration', ...data })
    ).unwrap();
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
    clearFormData,
    resetFormStatus,
  };
};
