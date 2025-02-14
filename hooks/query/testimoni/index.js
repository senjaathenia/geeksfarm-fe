import { useQuery, useMutation } from "@tanstack/react-query";
import { getTestimoni, addTestimoni, updateTestimoni, deleteTestimoni } from "@/service/testimoni";

// Get Testimoni Hooks
const useGetTestimoni = (options = {}) => {
  return useQuery({
    queryKey: ["getTestimoni"],
    queryFn: async ({ queryKey }) => {
      const [, { page, limit, keyword }] = queryKey;
      const response = await getTestimoni(page, limit, keyword);
      return response.data;
    },
    ...options,
  });
};

// Add Testimoni Hooks
const useAddTestimoni = (options = {}) => {
  return useMutation({
    mutationFn: addTestimoni,
    ...options,
  });
};

// Update Testimoni Hooks
const useUpdateTestimoni = (options = {}) => {
  return useMutation({
    mutationFn: updateTestimoni,
    ...options,
  });
};

// Delete Testimoni Hooks
const useDeleteTestimoni = (options = {}) => {
  return useMutation({
    mutationFn: deleteTestimoni,
    ...options,
  });
};

export {
  useGetTestimoni,
  useAddTestimoni,
  useUpdateTestimoni,
  useDeleteTestimoni,
};
