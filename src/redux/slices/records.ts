// src/redux/slices/records.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { PressureTestingCertificationFormData } from '@/components/forms/PressureTestingCertificationForm';
import { CalibrationCertificationFormData } from '@/components/forms/CalibrationCertificationForm';

// Define types for our state
export type RecordType = 'pressure-testing' | 'calibration';

export interface RecordState {
  pressureTestingForm: PressureTestingCertificationFormData | null;
  calibrationForm: CalibrationCertificationFormData | null;
  isSubmitting: boolean;
  isSuccess: boolean;
  error: string | null;
}

// Initial state
const initialState: RecordState = {
  pressureTestingForm: null,
  calibrationForm: null,
  isSubmitting: false,
  isSuccess: false,
  error: null,
};

export const createRecord = createAsyncThunk<
  // 1) Returned payload type
  { id: string; type: RecordType; formData: any; createdAt: string },
  // 2) Thunk argument type
  { type: RecordType; formData: PressureTestingCertificationFormData | CalibrationCertificationFormData },
  // 3) ThunkAPI config (for rejectWithValue)
  { rejectValue: string }
>(
  'records/createRecord',
  async ({ type, formData }, { rejectWithValue }) => {
    try {
      // Build request payload
      const payload = { type, ...formData };

      // Call your real API
      const response = await fetch(
        'https://cert.ofissainternational.com/api/new-record/',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            // add auth headers here if needed, e.g. Authorization
          },
          body: JSON.stringify(payload),
        }
      );

      // Handle non-2xx statuses
      if (!response.ok) {
        // Try to pull error message from body if available
        let errorMsg = `Server returned ${response.status}`;
        try {
          const errJson = await response.json();
          if (errJson?.message) errorMsg = errJson.message;
        } catch {
          /* ignore JSON parse errors */
        }
        return rejectWithValue(errorMsg);
      }

      // Parse the JSON response
      const data = await response.json();

      // Assuming your API returns something like { id, createdAt, ... }
      return {
        id: data.id,
        type,
        formData,
        createdAt: data.createdAt || new Date().toISOString(),
      };
    } catch (err: any) {
      // Network error or other
      return rejectWithValue(err.message || 'Failed to create record');
    }
  }
);
// Create the slice
const recordsSlice = createSlice({
  name: 'records',
  initialState,
  reducers: {
    // Save form data without submitting
    savePressureTestingForm: (state, action: PayloadAction<PressureTestingCertificationFormData>) => {
      state.pressureTestingForm = action.payload;
    },
    saveCalibrationForm: (state, action: PayloadAction<CalibrationCertificationFormData>) => {
      state.calibrationForm = action.payload;
    },
    clearForms: (state) => {
      state.pressureTestingForm = null;
      state.calibrationForm = null;
      state.isSuccess = false;
      state.error = null;
    },
    resetStatus: (state) => {
      state.isSubmitting = false;
      state.isSuccess = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createRecord.pending, (state) => {
        state.isSubmitting = true;
        state.isSuccess = false;
        state.error = null;
      })
      .addCase(createRecord.fulfilled, (state, action) => {
        state.isSubmitting = false;
        state.isSuccess = true;
        // Clear the form data after successful submission if needed
        if (action.meta.arg.type === 'pressure-testing') {
          state.pressureTestingForm = null;
        } else if (action.meta.arg.type === 'calibration') {
          state.calibrationForm = null;
        }
      })
      .addCase(createRecord.rejected, (state, action) => {
        state.isSubmitting = false;
        state.error = action.payload as string || 'An unknown error occurred';
      });
  },
});

// Export actions
export const { 
  savePressureTestingForm, 
  saveCalibrationForm, 
  clearForms,
  resetStatus 
} = recordsSlice.actions;

// Export reducer
export default recordsSlice.reducer;