
import axios from 'axios';
import { getSession, signOut } from 'next-auth/react';
import { redirect } from 'next/navigation';

export const api = axios.create({
    baseURL: process.env.BASE_URL, // Menggunakan variabel dari .env
    timeout: 10000,
});
// Create an instance of axios
export const apiAuthed = axios.create({
    baseURL: process.env.BASE_URL, // Replace with your API base URL
    timeout: 10000, // Request timeout
});
// Request interceptor
// apiAuthed.interceptors.request.use(
//     (config) => {
//       const token = getSession.getItem("authToken");
//       if (!token) {
//         throw new Error("Token tidak ditemukan. Harap login terlebih dahulu.");
//       }
//       config.headers.Authorization = `Bearer ${token}`;
//       console.log("Request Interceptor Config:", config); // Debug log
//       return config; // Jangan lupa return config
//     },
//     (error) => {
//       return Promise.reject(error);
//     }
//   );


apiAuthed.interceptors.request.use(
  async (config) => {
    try {
      const session = await getSession()

      const token = session?.user?.token; // Ambil token dari sesi
      if (!token) {
        redirect("/login");
      }

      config.headers.Authorization = `Bearer ${token}`; // Tambahkan token ke header
      return config;
    } catch (error) {
      console.error("Error in request interceptor:", error);zzz
      return Promise.reject(error);
    }
  },
  (error) => Promise.reject(error)
);

  apiAuthed.interceptors.response.use(
    (response) => {
      // Handle successful response
      return response;
    },
   async (error) => {
      // Handle error response
      if ( error.response.status === 401) {
          console.log( error.response.status)
          await signOut({ redirect: true, callbackUrl: "/login" });
      }
      
      return Promise.reject(error);
    }
  );

// Response interceptor
// apiAuthed.interceptors.response.use(
//     response => {
//         // Handle successful response
//         return response;
//     },
//     error => {
//         // Handle error response
//         if (error.response && error.response.status === 401) {
//             // Handle unauthorized error
//             console.error('Unauthorized, logging out...');
//             getSession.removeItem('authToken');
//             getSession.removeItem('userName');
//             getSession.removeItem('userRole');
//             window.location.href = '/login';
//             // Perform logout or redirect to login page
//         }
//         return Promise.reject(error);
//     }
// );