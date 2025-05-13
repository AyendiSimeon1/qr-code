# Redux State Management for QR Code App

## Overview
This directory contains the Redux state management implementation for the QR Code App. The Redux store is organized into slices, each handling a specific domain of the application state.

## Slices

### Auth Slice
Handles authentication state including user login, logout, and session management.

### Records Slice
Manages the state for record creation functionality, supporting both Pressure Testing and Calibration certification forms.

## Usage

### Records Management

The records slice provides the following functionality:

1. **Form Data Storage**
   - Save form data without submitting
   - Retrieve previously saved form data

2. **Record Creation**
   - Submit form data to create new records
   - Handle loading states during submission
   - Manage success/error states

3. **Form Types**
   - Pressure Testing Certification
   - Calibration Certification

### Using the Records Hooks

```tsx
import { useRecords } from '@/redux/hooks/records';

const MyComponent = () => {
  const {
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
  } = useRecords();

  // Use these hooks in your component
};
```

## Workflow

1. User navigates to the record creation page
2. User selects a form type (Pressure Testing or Calibration)
3. User fills out the form
4. On submission, the form data is dispatched to the Redux store
5. The async thunk handles the API call (simulated in the current implementation)
6. On success, the user is redirected to the dashboard

## Future Enhancements

- Implement actual API integration for record creation
- Add record editing functionality
- Implement record deletion
- Add filtering and sorting capabilities for records list