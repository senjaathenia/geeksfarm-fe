// query/event/index.js
import { useQuery, useMutation } from "@tanstack/react-query";
import { getEvents, addEvent, updateEvent, deleteEvent, getEventById } from "@/service/event";

// Get Events Hook
// const useGetEvents = ({ page = 1, limit = 10, keyword = "" } = {}, options = {}) => {
//   return useQuery({
//     queryKey: ["getEvents", page, limit, keyword],
//     queryFn: async () => {
//       const response = await getEvents(page, limit, keyword);
//       const data = response.data?.data; // Akses `data` dari respons backend
//       return {
//         events: data?.event || [],
//         currentPage: data?.current_page || 1,
//         total: data?.total || 0,
//         lastPage: data?.last_page || 1,
//       };
//     },
//     ...options,
//   });
// };

const useGetEvents = (params,options = {}) => {
  return useQuery({
      queryKey: ["getEvents"],
      queryFn: async () => {
          const response = await getEvents();
          return response.data;
      },
      ...options, // Spread options ke dalam objek
  });
};

// Get Event by ID Hook
const useGetEventById = (id, options = {}) => {
  return useQuery({
    queryKey: ["getEventById", id],
    queryFn: async () => {
      const response = await getEventById(id);
      return response.data;
    },
    ...options,
  });
};

// Add Event Hook
const useAddEvent = (options = {}) => {
  return useMutation({
    mutationFn: addEvent,
    ...options,
  });
};

// Update Event Hook
const useUpdateEvent = (options = {}) => {
  return useMutation({
    mutationFn: updateEvent,
    ...options,
  });
};

// Delete Event Hook
const useDeleteEvent = (options = {}) => {
  return useMutation({
    mutationFn: deleteEvent,
    ...options,
  });
};

export {
  useGetEvents,
  useGetEventById,
  useAddEvent,
  useUpdateEvent,
  useDeleteEvent,
};
