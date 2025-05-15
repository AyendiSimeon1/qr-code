// src/redux/slices/records.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { PressureTestingCertificationFormData } from '@/components/forms/PressureTestingCertificationForm';
import { CalibrationCertificationFormData } from '@/components/forms/CalibrationCertificationForm';
import { createRecordApi, CreateRecordResponse, RecordPayload } from '@/utils/records';

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
  CreateRecordResponse,
  RecordPayload,
  { rejectValue: string }
>(
  'records/createRecord',
  async (payload, { rejectWithValue }) => {
    try {
      const data = await createRecordApi(payload);
      console.log('Record created successfully:', data);
      return data;
    } catch (err: any) {
      const msg =
        err.response?.data?.message ||
        err.message ||
        'Failed to create record';
      return rejectWithValue(msg);
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