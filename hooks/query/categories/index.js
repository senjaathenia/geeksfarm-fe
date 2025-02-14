// query/type/index.js
import { useQuery, useMutation } from "@tanstack/react-query";
import { getCategories, addCategories, updateCategories, deleteCategories } from "@/service/categories";

// const useGetCategories = (options) => {
//     return useQuery(["getTypes"], async () => {
//         const response = await getTypes()
//         return response.data
//     }, ...options)
// }

//Get type Hooks
const useGetCategories = (options = {}) => {
    return useQuery({
        queryKey: ["getCategories"],
        queryFn: async () => {
            const response = await getCategories();
            return response.data;
        },
        ...options, // Spread options ke dalam objek
    });
};

//Add type Hooks
const useAddCategories = (options) => {
    return useMutation({
        mutationFn: addCategories,
        ...options
    })
}

//Update type Hooks
const useUpdateCategories = (options) => {
    return useMutation({
        mutationFn: updateCategories,
        ...options
    })
}

//Delete type Hooks
const useDeleteCategories = (options) => {
    return useMutation({
        mutationFn: deleteCategories,
        ...options
    })
}

export {
    useGetCategories,
    useAddCategories,
    useUpdateCategories,
    useDeleteCategories
}