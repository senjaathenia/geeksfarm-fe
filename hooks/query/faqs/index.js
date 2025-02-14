// query/type/index.js
import { useQuery, useMutation } from "@tanstack/react-query";
import { getFaqs, addFaqs, updateFaqs, deleteFaqs } from "@/service/faqs";

// const useGetFaqs = (options) => {
//     return useQuery(["getFaqs"], async () => {
//         const response = await getFaqs()
//         return response.data
//     }, ...options)
// }

//Get type Hooks
const useGetFaqs = (options = {}) => {
    return useQuery({
        queryKey: ["getFaqs"],
        queryFn: async () => {
            const response = await getFaqs();
            return response.data;
        },
        ...options, // Spread options ke dalam objek
    });
};

//Add type Hooks
const useaddFaqs = (options) => {
    return useMutation({
        mutationFn: addFaqs,
        ...options
    })
}

//Update type Hooks
const useUpdateFaqs = (options) => {
    return useMutation({
        mutationFn: updatedFaqs,
        ...options
    })
}

//Delete type Hooks
const useDeleteFaqs = (options) => {
    return useMutation({
        mutationFn: deleteFaqs,
        ...options
    })
}

export {
    useGetFaqs,
    useaddFaqs,
    useUpdateFaqs,
    useDeleteFaqs
}