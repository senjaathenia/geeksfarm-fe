
import { apiAuthed } from '../../../service/api';
import { useQuery } from '@tanstack/react-query'; // Pastikan mengimpor dari React Query versi 5

const useGetUserStatus = (params, options) => {
  return useQuery({
    queryKey: ['getUserStatus', params], // queryKey dalam bentuk array
    queryFn: async () => {
      const response = await apiAuthed.get('/get-user-status', {params});
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

  const useGetCategories= () => {
    return useQuery({
      queryKey: ['getCategories'], 
      queryFn: async () => {
        const response = await apiAuthed.get('/get-categories');
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

  const useGetTypes = () => {
    return useQuery({
      queryKey: ['getTypes'], 
      queryFn: async () => {
        const response = await apiAuthed.get('/get-types');
        return response.data;
      }
    });
  };
  
export {
  useGetUserStatus,
  useGetEvents,
  useGetFaqs,
  useGetTestimoni,
  useGetItems,
  useGetCategories,
  useGetTypes
};
