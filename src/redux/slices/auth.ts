// src/redux/slices/authSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { loginApi, logoutApi, setAuthToken, getAuthToken } from '@/utils/auth'; // Adjust path
import { LoginFormData } from '@/components/auth/LoginForm'; // Adjust path
// Import RegisterFormData if you implement registration
// import { RegisterFormData } from '@/components/auth/RegisterForm';

// Define the User type (should match your API response)
interface User {
  id: string;
  email: string;
  name?: string;
  // ... other user properties
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  token: null, // Will try to load token from storage on app init
  isAuthenticated: false, // Derived from user !== null and token !== null
  isLoading: false,
  error: null,
};

// --- Async Thunks ---

// Thunk for logging in
export const login = createAsyncThunk(
  'auth/login',
  async (credentials: LoginFormData, { rejectWithValue }) => {
    try {
      const response = await loginApi(credentials);
      // Store token persistently
      setAuthToken(response.token);
      console.log('the response', response);
      return response; // This data will be in action.payload
    } catch (error: any) {
      console.log('the error', error);
      const message = error.response?.data?.message || error.message || 'Login failed';
      return rejectWithValue(message);
    }
  }
);

// Thunk for registering (if applicable)
// export const register = createAsyncThunk(
//   'auth/register',
//   async (data: RegisterFormData, { rejectWithValue }) => {
//     try {
//       const response = await registerApi(data);
//       // Decide if registration logs them in immediately or requires verification/manual login
//       // If it logs them in: setAuthToken(response.token);
//       return response; // Or just a success status
//     } catch (error: any) {
//       const message = error.response?.data?.message || error.message || 'Registration failed';
//       return rejectWithValue(message);
//     }
//   }
// );

// Thunk for logging out
export const logout = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      // Optional: call backend logout endpoint
      await logoutApi();
      // Clear token from persistent storage
      setAuthToken(null);
      // Return nothing or success indicator
      return;
    } catch (error: any) {
      // Even if API logout fails, we might want to clear local state
      // Clear token from persistent storage anyway? Depends on desired behavior.
      setAuthToken(null);
      const message = error.response?.data?.message || error.message || 'Logout failed';
      // Decide if you still want to reject or fulfill even on API error but local clear success
      // For this example, we'll fulfill locally even if API call had issues, but log the error
      console.error("Logout API failed:", error);
      return; // Still fulfill locally
      // Or: return rejectWithValue(message); // If you want to indicate the API call failed
    }
  }
);

// Thunk to check auth status from storage on app load
export const checkAuthStatus = createAsyncThunk(
  'auth/checkStatus',
  async (_, { dispatch, rejectWithValue }) => {
    const token = getAuthToken();
    if (token) {
      // You might want to add a thunk here to validate the token with the backend
      // and fetch user data if the token is valid.
      // For simplicity, this example *assumes* a token means potentially authenticated.
      // A better approach is to call a "/me" or "/validate-token" endpoint.

      // Dummy user data for now if not validating token with backend
      // In a real app, fetch user data using the token
      // const user = await fetchUserProfile(token); // Example fetching user profile

      // If token exists, set isAuthenticated to true. User data might be null initially
      // until a fetchUserProfile type thunk runs.
      // dispatch(authSlice.actions.setAuthState({ user: null, token, isAuthenticated: true }));

       // --- More robust approach: Fetch user data with the token ---
       try {
            // Assuming you have a function like getUserProfile in your API layer
            // const user = await getUserProfile(); // Needs token in headers (handled in api function)
            // Simulate fetching user data:
             await new Promise(resolve => setTimeout(resolve, 100)); // Simulate delay
             const user = { id: 'guest', email: 'user@restored.com', name: 'Restored User' }; // Dummy data
             dispatch(authSlice.actions.setAuthState({ user, token, isAuthenticated: true }));

       } catch (error) {
           // If token validation/user fetch fails, token is invalid or expired
           console.error("Token validation or user fetch failed:", error);
           setAuthToken(null); // Clear invalid token
           dispatch(authSlice.actions.setAuthState({ user: null, token: null, isAuthenticated: false }));
           return rejectWithValue("Session expired or invalid.");
       }

    } else {
      // No token found in storage
       dispatch(authSlice.actions.setAuthState({ user: null, token: null, isAuthenticated: false }));
    }
  }
);


// --- Auth Slice ---

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Reducer to set initial state from storage check
    setAuthState: (state, action: PayloadAction<{ user: User | null; token: string | null; isAuthenticated: boolean }>) => {
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = action.payload.isAuthenticated;
        state.isLoading = false; // Ensure loading is false after check
        state.error = null; // Clear error on initial state set
    },
    // Synchronous reducer to clear errors manually
    clearAuthError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // --- Login Thunk ---
    builder.addCase(login.pending, (state) => {
      state.isLoading = true;
      state.error = null; // Clear previous errors
    });
    builder.addCase(login.fulfilled, (state, action: any) => {
      state.isLoading = false;
      state.user = action.payload.user;
      state.token = action.payload.token; // Token is already set in storage in the thunk
      state.isAuthenticated = true;
      state.error = null; // Clear any previous errors
    });
    builder.addCase(login.rejected, (state, action: PayloadAction<any>) => {
      state.isLoading = false;
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = action.payload as string; // action.payload is the error message from rejectWithValue
       setAuthToken(null); // Ensure token is removed on failed login
    });

    // --- Register Thunk (Example) ---
    // builder.addCase(register.pending, (state) => {
    //   state.isLoading = true;
    //   state.error = null;
    // });
    // builder.addCase(register.fulfilled, (state, action: PayloadAction<AuthResponse | any>) => {
    //    state.isLoading = false;
    //    // Depending on your registration flow:
    //    // If logs in immediately:
    //    // state.user = action.payload.user;
    //    // state.token = action.payload.token;
    //    // state.isAuthenticated = true;
    //    // If just successful registration:
    //    // Set a success flag or message
    //    state.error = null; // Clear error
    // });
    // builder.addCase(register.rejected, (state, action: PayloadAction<any>) => {
    //    state.isLoading = false;
    //    state.error = action.payload as string;
    // });


    // --- Logout Thunk ---
    builder.addCase(logout.pending, (state) => {
      state.isLoading = true; // Optional: if logout API call takes time
      state.error = null;
    });
     builder.addCase(logout.fulfilled, (state) => {
       state.isLoading = false;
       state.user = null;
       state.token = null; // Token is cleared in storage in the thunk
       state.isAuthenticated = false;
       state.error = null;
     });
     builder.addCase(logout.rejected, (state, action: PayloadAction<any>) => {
        state.isLoading = false;
        // Even if logout API fails, we often want to clear client state
        state.user = null;
        state.token = null; // Token is cleared in storage in the thunk anyway
        state.isAuthenticated = false;
        state.error = action.payload as string; // Optional: show API error message
     });

     // --- Check Auth Status Thunk ---
     builder.addCase(checkAuthStatus.pending, (state) => {
         state.isLoading = true;
         state.error = null;
     });
     // fulfilled is handled by the setAuthState reducer dispatched within the thunk
     builder.addCase(checkAuthStatus.rejected, (state, action: PayloadAction<any>) => {
        state.isLoading = false;
        // State is already set to null in the thunk's catch block
        state.error = action.payload as string; // Optional: show error message if check failed
     });
  },
});

export const { clearAuthError } = authSlice.actions;
export default authSlice.reducer;