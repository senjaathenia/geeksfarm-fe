// query/user/index.js
import { useQuery, useMutation } from "@tanstack/react-query";
import { updateStatus,  getUserById, getUsers, addUser, updateUser, deleteUser, forgotPassword } from "@/service/user";

// const useGetUsers = (options) => {
//     return useQuery(["getUsers"], async () => {
//         const response = await getUsers()
//         return response.data
//     }, ...options)
// }

const useUpdateStatus = () => {
    return useMutation({
        mutationFn: async ({ id, status }) => {
            if (!id || !status) {
                throw new Error("ID dan status diperlukan");
            }
            const response = await apiAuthed.put(`/update-status/${id}`, { status });
            return response.data;
        },
    });
};

//Get User Hooks
const useGetUsers = (options = {}) => {
    return useQuery({
        queryKey: ["getUsers"],
        queryFn: async () => {
            const response = await getUsers();
            return response.data;
        },
        ...options, // Spread options ke dalam objek
    });
};

//Forgot Password User Hooks
const useForgotPassword = (options) => {
    return useMutation({
        mutationFn: forgotPassword,
        ...options
    })
}

//Add User Hooks
const useAddUser = (options) => {
    return useMutation({
        mutationFn: addUser,
        ...options
    })
}

//Update User Hooks
const useUpdateUser = (options) => {
    return useMutation({
        mutationFn: updateUser,
        ...options
    })
}

//Delete User Hooks
const useDeleteUser = (options) => {
    return useMutation({
        mutationFn: deleteUser,
        ...options
    })
}

const useGetUserById = (id, options = {}) => {
    return useQuery({
        queryKey: ["getUserById", id],
        queryFn: async () => {
            if (!id) {
                throw new Error("User ID is required");
            }
            const response = await getUserById(id);
            return response;
        },
        enabled: !!id, // Disable query jika ID tidak tersedia
        ...options, // Spread options tambahan
    });
};

export {
    useGetUsers,
    useGetUserById,
    useForgotPassword,
    useAddUser,
    useUpdateUser,
    useDeleteUser,
    useUpdateStatus
}
