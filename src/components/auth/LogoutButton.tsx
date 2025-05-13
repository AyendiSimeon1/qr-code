// // src/components/LogoutButton.tsx (Conceptual Example)
// "use client";
// import React from 'react';
// import { useRouter } from 'next/navigation';

// import { useAppDispatch, useAppSelector } from '@/redux/hooks';
// import { logout } from '@/redux/slices/authSlice'; // Import the logout action

// const LogoutButton: React.FC = () => {
//   const dispatch = useAppDispatch();
//   const router = useRouter();
//   const { isLoading } = useAppSelector(state => state.auth); // Optional: check loading state

//   const handleLogout = async () => {
//      // Dispatch the logout async thunk
//      await dispatch(logout()).unwrap(); // Use unwrap() to handle potential API errors if needed
//      // The thunk clears state and storage.
//      // Redirect after the thunk completes (or watch isAuthenticated state)
//      console.log("Logout successful, redirecting to login...");
//      router.push('/login');
//   };

//   return (
//     <button
//       onClick={handleLogout}
//       disabled={isLoading} // Disable button while logging out (if API call involved)
//       className="text-sm text-gray-600 hover:text-gray-900" // Example styling
//     >
//       {isLoading ? 'Logging out...' : 'Logout'}
//     </button>
//   );
// };

// export default LogoutButton;