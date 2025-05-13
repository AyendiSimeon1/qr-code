// src/redux/slices/search.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

// Define the Company type based on expected API response
interface Company {
  id: string;
  name: string;
  address?: string;
  email?: string;
  phone?: string;
  // Add other fields as needed based on the API response
}

interface SearchState {
  results: Company[];
  isLoading: boolean;
  error: string | null;
  searchTerm: string;
}

const initialState: SearchState = {
  results: [],
  isLoading: false,
  error: null,
  searchTerm: '',
};

// API endpoint
const API_URL = 'https://cert.ofissainternational.com/api/search/';

// Your API key should be stored in an environment variable in production
// For this example, we'll use a constant
const API_KEY = 'your-api-key'; // Replace with your actual API key

// Async thunk for searching companies
export const searchCompanies = createAsyncThunk(
  'search/searchCompanies',
  async (companyName: string, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}?company_name=${encodeURIComponent(companyName)}`, {
        headers: {
          'Authorization': `Bearer ${API_KEY}`,
          'Content-Type': 'application/json',
        },
      });
      
      // Check if the response is successful
      if (response.data.status === 'failed') {
        return rejectWithValue(response.data.message || 'Search failed');
      }
      
      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || 'Search failed';
      return rejectWithValue(message);
    }
  }
);

const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    setSearchTerm: (state, action: PayloadAction<string>) => {
      state.searchTerm = action.payload;
    },
    clearSearchResults: (state) => {
      state.results = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(searchCompanies.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(searchCompanies.fulfilled, (state, action) => {
        state.isLoading = false;
        state.results = action.payload.data || [];
      })
      .addCase(searchCompanies.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setSearchTerm, clearSearchResults } = searchSlice.actions;
export default searchSlice.reducer;