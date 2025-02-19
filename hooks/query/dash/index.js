
import { apiAuthed } from '../../../service/api';
import { useQuery } from '@tanstack/react-query'; // Pastikan mengimpor dari React Query versi 5

const useGetUsers = (params, options) => {
  return useQuery({
    queryKey: ['getUsers', params], // queryKey dalam bentuk array
    queryFn: async () => {
      const response = await apiAuthed.get('/get-users', {params});
      return response.data;  // Kembalikan data
    },
    ...options
  });
};


// Hook untuk mengambil data Events
const useGetEvents = (params, options) => {
    return useQuery({
      queryKey: ['getEvents'], // Query key sebagai array
      queryFn: async () => {
        const response = await apiAuthed.get('/get-events', {params});
        return response.data; // Mengembalikan data dari API
      },
      ...options
    });
  };
  
  // Hook untuk mengambil data FAQs
  const useGetFaqs = () => {
    return useQuery({
      queryKey: ['getFaqs'], 
      queryFn: async () => {
        const response = await apiAuthed.get('/get-faqs');
        return response.data;
      }
    });
  };
  
  // Hook untuk mengambil data Testimoni
  const useGetTestimoni = () => {
    return useQuery({
      queryKey: ['getTestimoni'], 
      queryFn: async () => {
        const response = await apiAuthed.get('/get-testimoni');
        return response.data;
      }
    });
  };
  
  // Hook untuk mengambil data Items
  const useGetItems = () => {
    return useQuery({
      queryKey: ['getItems'], 
      queryFn: async () => {
        const response = await apiAuthed.get('/get-items');
        return response.data;
      }
    });
  };
  
export {
  useGetUsers,
  useGetEvents,
  useGetFaqs,
  useGetTestimoni,
  useGetItems
};
