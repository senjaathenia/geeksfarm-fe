import { signOut } from '../auth';
import axios from 'axios';
import { getSession } from 'next-auth/react';

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
        window.location.href = "/login";
        throw new Error("Token tidak ditemukan. Harap login terlebih dahulu.");
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
    (error) => {
      // Handle error response
      if ( error.response.status === 401) {
        document.cookie = "authToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        document.cookie = "userEmail=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        document.cookie = "userName=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        document.cookie = "userRole=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

          console.log( error.response.status)


        signOut({redirect: false}).then(() => {
          console.log( error.response.status)

          window.location.href = "/login";
        });
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