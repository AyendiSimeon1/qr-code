// src/lib/api/auth.ts
import axios from 'axios';
import { LoginFormData } from '@/components/auth/LoginForm'; // Adjust path if needed
// Assuming you have a type for registration data
// import { RegisterFormData } from '@/components/auth/RegisterForm';

const API_BASE_URL = 'https://ofissa.godiscova.com/api'
interface User {
  id: string;
  email: string;
  name?: string;
  // ... other user properties
}

interface AuthResponse {
  user: User;
  token: string;
  // ... other data from API response
}

// Function to get the current token (e.g., from localStorage or cookies)
// You'll need to implement token storage/retrieval.
export const getAuthToken = (): string | null => {
  // Example: reading from localStorage (consider more secure methods for production)
  if (typeof window !== 'undefined') {
     return localStorage.getItem('authToken');
  }
  return null;
};

// Function to store the token
export const setAuthToken = (token: string | null) => {
   if (typeof window !== 'undefined') {
      if (token) {
         localStorage.setItem('authToken', token);
      } else {
         localStorage.removeItem('authToken');
      }
   }
};


// --- Login API Call ---
export const loginApi = async (credentials: LoginFormData): Promise<AuthResponse> => {
  const apiKey = '13db0a2eda129aa67f8b2c60e175e1fd'

  if (!apiKey) {
    console.warn("Login API call potentially an issue: API key not configured. Depending on backend, this might be required.");
    // Depending on backend requirements, you might throw an error here
    // or proceed if the backend allows login without an API key for certain flows.
  }

  const headers: { [key: string]: string } = {};
  if (apiKey) {
    headers[''] = apiKey;
  }

  // Replace with your actual login endpoint and data structure
  const response = await axios.post<AuthResponse>(`${API_BASE_URL}/login`, credentials, {
    headers: headers
  });
  // On successful login, you might want to store the token here or in the Redux thunk
  // setAuthToken(response.data.token); // Can store here or in thunk

  return response.data;
};

// --- Register API Call ---
// Assuming RegisterFormData is a type for registration data
// export const registerApi = async (data: RegisterFormData): Promise<AuthResponse> => {
//   // Replace with your actual registration endpoint and data structure
//   const response = await axios.post<AuthResponse>(`${API_BASE_URL}/auth/register`, data);
//   // On successful registration, you might want to handle token storage
//   // setAuthToken(response.data.token); // If registration logs them in
//   return response.data;
// };

// --- Logout API Call (Optional, depends on backend) ---
// Some backends have a logout endpoint to invalidate tokens server-side.
// If not, clearing the token client-side is sufficient.
export const logoutApi = async (): Promise<void> => {
   const apiKey = process.env.NEXT_PUBLIC_API_KEY; // Retrieve API key
   if (!apiKey) {
     console.warn("Logout API call skipped: API key not configured.");
     // Depending on requirements, you might throw an error or simply skip the API call
     // if the backend doesn't strictly require this for session invalidation.
     // For now, we'll just return, assuming client-side cleanup is still important.
     return;
   }

   try {
     // Replace with your actual logout endpoint
     await axios.post(`${API_BASE_URL}/auth/logout`, {}, {
       headers: {
         'X-API-Key': apiKey // Use API key in header
       }
     });
   } catch (error) {
     console.error("Logout API call failed:", error);
     // Decide how to handle API call failure.
     // Client-side token clearing (if any) will still proceed in the Redux thunk.
     // You might re-throw the error if the caller needs to know.
     // throw error;
   }
   // Client-side token clearing happens in the thunk or component after successful call
};

// Example of an authenticated API call (for demonstration)
// export const getUserProfile = async (): Promise<User> => {
//   const token = getAuthToken();
//   if (!token) throw new Error("No authentication token found.");

//   const response = await axios.get<User>(`${API_BASE_URL}/user/profile`, {
//     headers: {
//       Authorization: `Bearer ${token}`
//     }
//   });
//   return response.data;
// };