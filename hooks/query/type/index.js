// query/type/index.js
import { useQuery, useMutation } from "@tanstack/react-query";
import { getTypes, addType, updateType, deleteType } from "@/service/type";

// const useGetTypes = (options) => {
//     return useQuery(["getTypes"], async () => {
//         const response = await getTypes()
//         return response.data
//     }, ...options)
// }

//Get type Hooks
const useGetTypes = (options = {}) => {
    return useQuery({
        queryKey: ["getTypes"],
        queryFn: async () => {
            const response = await getTypes();
            return response.data;
        },
        ...options, // Spread options ke dalam objek
    });
};

//Add type Hooks
const useaddTypes = (options) => {
    return useMutation({
        mutationFn: addType,
        ...options
    })
}

//Update type Hooks
const useUpdateTypes = (options) => {
    return useMutation({
        mutationFn: updateType,
        ...options
    })
}

//Delete type Hooks
const useDeleteTypes = (options) => {
    return useMutation({
        mutationFn: deleteType,
        ...options
    })
}

export {
    useGetTypes,
    useaddTypes,
    useUpdateTypes,
    useDeleteTypes
}