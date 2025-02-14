import { useQuery, useMutation } from "@tanstack/react-query";
import { getItems, addItems, updateItems, deleteItems } from "@/service/items";

// Get Items Hooks
const useGetItems = (options = {}) => {
  return useQuery({
    queryKey: ["getItems"],
    queryFn: async ({ queryKey }) => {
      const [, { page, limit, keyword }] = queryKey;
      const response = await getItems(page, limit, keyword);
      return response.data;
    },
    ...options,
  });
};

// Add Items Hooks
const useAddItems = (options = {}) => {
  return useMutation({
    mutationFn: addItems,
    ...options,
  });
};

// Update Items Hooks
const useUpdateItems = (options = {}) => {
  return useMutation({
    mutationFn: updateItems,
    ...options,
  });
};

// Delete Items Hooks
const useDeleteItems = (options = {}) => {
  return useMutation({
    mutationFn: deleteItems,
    ...options,
  });
};

export { useGetItems, useAddItems, useUpdateItems, useDeleteItems };
