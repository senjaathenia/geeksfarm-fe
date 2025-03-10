"use client";

import React, { useState, useEffect } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  flexRender,
} from "@tanstack/react-table";
import { apiAuthed } from "@/service/api";
import { toast } from "react-toastify";
import {
  PencilSquareIcon,
  TrashIcon,
  KeyIcon,
  PlusIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
} from "@heroicons/react/24/outline";
import "react-toastify/dist/ReactToastify.css";
import { useTheme } from "@/app/theme";
import { useDebounce } from "use-debounce";
import { useGetUsers, useUpdateStatus } from "@/hooks/query/user";
import { getSession } from "next-auth/react";
import { useSession } from "next-auth/react";
import { useRef } from "react";

const UserTable = () => {
  const { isDarkMode } = useTheme();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1); // Current page
  const [limit, setLimit] = useState(10); // Items per page
  const [total, setTotal] = useState(0); // Total items
  const [lastPage, setLastPage] = useState(1); // Total pages
  const [debouncedSearch] = useDebounce(search, 500);
  const { data: session } = useSession(); // Mengambil sesi pengguna
  // States for Modal (Add and Update)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddMode, setIsAddMode] = useState(false);
  const [userToUpdate, setUserToUpdate] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [roleID, setRoleID] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorDetails, setErrorDetails] = useState([]);
  const isFetching = useRef(false); // Gunakan useRef untuk melacak apakah API sedang dipanggil
  const data = useGetUsers()

  const handleApiError = (error) => {
    if (error.response) {
      const { status, data } = error.response;
      const message = data.message || "An error occurred."; // Pesan utama
      const details = data.errors || []; // Detail error
  
      return { status, message, details };
    }
    return { status: 500, message: "Unknown error occurred.", details: [] };
  };
  
  
  const fetchUsers = async () => {
    setLoading(true);
    try {
        const response = await apiAuthed.get("/get-users", {
            params: { pages: page, limit, keyword: search },
        });
        console.log("Users data from API:", response.data);  // Periksa data yang diterima
        const usersData = response.data?.data?.users || [];
        console.log("Users data:", usersData);
        setUsers(usersData);
        usersData.forEach(user => {
          console.log("User ID:", user.id);
        });    
        setTotal(response.data?.data?.total || 0);
        setLastPage(response.data?.data?.last_page || 1);
        toast.success("Users loaded successfully!");
    } catch (error) {
        const { status, message, details } = handleApiError(error);
        console.error("Fetch Users Error:", { status, message, details });
        setError(message);
        toast.error(message);
    } finally {
        setLoading(false);
    }
};
  
useEffect(() => {
  const searchQuery = debouncedSearch || ""; // Gunakan string kosong jika undefined
  fetchUsers(searchQuery);
}, [page, limit, debouncedSearch]);


  const columns = [
    { accessorKey: "id", header: "ID" },
    { accessorKey: "name", header: "Name" },
    { accessorKey: "email", header: "Email" },
    {
      accessorKey: "role_id",
      header: "Role",
      cell: (info) => (info.getValue() === 1 ? "Admin" : "Super Admin"),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <span
          onClick={() => handleToggleStatus(row)} 
          className={`cursor-pointer px-4 py-2 rounded-full ${row.original.status === "active" ? "bg-green-200" : "bg-red-200"}`}
        >
          {row.original.status === "active" ? "Active" : "Inactive"}
        </span>
      ),
    },

    {
      accessorKey: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex space-x-2">
          <button
            onClick={() => handleEdit(row.original)}
            className={`p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition ${
              isDarkMode ? "text-gray-300" : "text-gray-700"
            }`}
          >
            <PencilSquareIcon className="h-5 w-5" />
          </button>
          <button
            onClick={() => handleDelete(row.original.id)}
            className={`p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition ${
              isDarkMode ? "text-red-400" : "text-red-600"
            }`}
          >
            <TrashIcon className="h-5 w-5" />
          </button>
          <button
            onClick={() => handleForgotPassword(row.original)}
            className={`p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition ${
              isDarkMode ? "text-blue-400" : "text-blue-600"
            }`}
          >
            <KeyIcon className="h-5 w-5" />
          </button>
        </div>
      ),
    },
  ];
 
  const handleToggleStatus = async (row) => {
    const id = row.original.id;
    const newStatus = row.original.status === "active" ? "inactive" : "active";
  
    try {
      const response = await apiAuthed.put(`/update-status/${id}`, { status: newStatus });
      if (response.status === 200) {
        // Update the status in the UI directly
        setUsers(users.map(user => 
          user.id === id ? { ...user, status: newStatus } : user
        ));
        toast.success("User status updated successfully!");
      } else {
        toast.error("Failed to update user status");
      }
    } catch (error) {
      toast.error("Error updating user status");
    }
  };
  
  const table = useReactTable({
    data: users, // Gunakan state users sebagai sumber data tabel
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: limit } },
  });
  
  const handleAddUser = () => {
    setIsAddMode(true);
    setName(""); // Reset name
    setEmail(""); // Reset email
    setRoleID(""); // Reset roleID
    setError(""); // Reset error
    setErrorDetails([]); // Reset error details
    setIsModalOpen(true); // Buka modal
  };
  
  const handleEdit = (user) => {
    setIsAddMode(false);
    setUserToUpdate(user);
    setName(user.name); // Set nama untuk diedit
    setEmail(user.email); // Set email untuk diedit
    setRoleID(user.role_id.toString()); // Set role untuk diedit
    setError(""); // Reset error
    setErrorDetails([]); // Reset error details
    setIsModalOpen(true); // Buka modal
  };
  

  const handleDelete = async (id) => {
    try {
      await apiAuthed.delete(`/delete-users/${id}`);
      toast.success("User deleted successfully.");
      fetchUsers(); // Refresh data
    } catch (error) {
      const { status, message, details } = handleApiError(error);
      console.error("Delete User Error:", { status, message, details });
      toast.error(message);
    }
  };  
  
  const handleForgotPassword = async (user) => {
    try {
      await apiAuthed.post(`/forgot-password/${user.id}`);
      toast.success(`Reset password link sent to ${user.email}`);
    } catch (error) {
      const { status, message, details } = handleApiError(error);
      console.error("Forgot Password Error:", { status, message, details });
      toast.error(message);
    }
  };

  const validateForm = () => {
    const errors = [];
  
    const nameError = validateName(name);
    if (nameError) errors.push(nameError);
  
    if (!validateEmail(email)) {
      errors.push("Invalid email format.");
    }
  
    if (!roleID) {
      errors.push("Role is required.");
    }
  
    if (errors.length > 0) {
      errors.forEach((err) => toast.error(err));
      return false;
    }
  
    return true;
  };
  
  const validateEmail = (email) => {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return regex.test(email);
  };
  

  const validateName = (name) => {
    if (!name || name.length < 2 || name.length > 50) {
      return "Name must be between 2 and 50 characters.";
    }
    if (!/^[a-zA-Z\s]+$/.test(name)) {
      return "Name must only contain letters and spaces.";
    }
    return null;
  };
  
  const handleFormSubmit = async (e) => {
    e.preventDefault();
  
    // Validasi input di sisi frontend
    const errors = [];
    const nameError = validateName(name);
    const emailError = validateEmail(email);
  
    if (nameError) errors.push(nameError);
    if (!emailError) errors.push("Invalid email format.");
    if (!roleID) errors.push("Role is required.");
  
    if (errors.length > 0) {
      errors.forEach((err) => toast.error(err));
      return;
    }
  
    setIsSubmitting(true);
  
    try {
      const payload = { name, email, password: "", role_id: parseInt(roleID, 10) };
  
      if (isAddMode) {
        // Jika mode tambah user
        await apiAuthed.post(`/register`, payload);
        toast.success("User added successfully!");
      } else {
        // Jika mode update user
        await apiAuthed.put(`/users/${userToUpdate.id}`, payload);
        toast.success("User updated successfully!");
      }
  
      setIsModalOpen(false);
      fetchUsers(); // Refresh data user
    } catch (error) {
      // Tangani error dari backend
      if (error.response && error.response.data) {
        const { message, errors: backendErrors } = error.response.data;
  
        // Tampilkan pesan utama
        toast.error(message || "Failed to process request.");
  
        // Tampilkan detail error jika ada
        if (backendErrors && Array.isArray(backendErrors)) {
          backendErrors.forEach((err) => {
            toast.error(`${err.parameter || "Field"}: ${err.message}`);
          });
        }
      } else {
        // Error fallback jika tidak ada response dari backend
        toast.error("An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="container mx-auto mt-1 px-4">
        {/* Search and Add User */}
      <div className="flex justify-between items-center mb-4">
          <input
            type="text"
            placeholder="Search users..."
            className="w-full max-w-lg px-4 py-2 border rounded-lg focus:ring focus:ring-blue-300 dark:bg-gray-800 dark:text-white dark:border-gray-600"
            value={search}
            onChange={(e) => setSearch(e.target.value)} // Update state `search`
         />
        <button
          onClick={handleAddUser}
          className={`flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 transition`}
        >
          <PlusIcon className="h-5 w-5" />
          <span>Add User</span>
        </button>
      </div>

      {/* Table */}
      <div className="overflow-hidden border rounded-lg shadow-sm">
        <table className="w-full text-sm bg-white dark:bg-gray-800">
          <thead className="bg-gray-100 dark:bg-gray-700">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-6 py-3 font-semibold text-left text-gray-700 dark:text-gray-300"
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={columns.length} className="text-center py-4">
                  Loading...
                </td>
              </tr>
            ) : users.length > 0 ? (
              table.getRowModel().rows.map((row) => (
                <tr key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-6 py-4">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="text-center py-4">
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

{/* Pagination */}
<div className="mt-4">
  {/* Teks Showing Entries */}
  <div className="flex justify-between items-center mb-2">
    <div>
      <span className="text-sm font-medium dark:text-gray-300">
        Showing {limit * (page - 1) + 1} to{" "}
        {Math.min(limit * page, total)} of {total} entries
      </span>
    </div>
  </div>

            {/* Pagination dan Dropdown */}
            <div className="flex justify-between items-center">
              {/* Pagination */}
              <div className="flex items-center space-x-1">
                {/* Tombol Previous */}
                <button
                  onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                  disabled={page === 1}
                  className="px-3 py-2 bg-gray-200 dark:bg-gray-700 rounded disabled:opacity-50 hover:bg-gray-300 dark:hover:bg-gray-600"
                >
                  Previous
                </button>

                {/* Angka Halaman */}
                {[...Array(lastPage)].map((_, index) => {
                  const pageNumber = index + 1;
                  return (
                    <button
                      key={pageNumber}
                      onClick={() => setPage(pageNumber)}
                      className={`px-3 py-2 rounded ${
                        page === pageNumber
                          ? "bg-blue-500 text-white"
                          : "bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600"
                      }`}
                    >
                      {pageNumber}
                    </button>
                  );
                })}

                {/* Tombol Next */}
                <button
                  onClick={() => setPage((prev) => Math.min(prev + 1, lastPage))}
                  disabled={page === lastPage}
                  className="px-3 py-2 bg-gray-200 dark:bg-gray-700 rounded disabled:opacity-50 hover:bg-gray-300 dark:hover:bg-gray-600"
                >
                  Next
                </button>
              </div>

              {/* Dropdown Items per Page */}
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium dark:text-gray-300">
                  Items per page:
                </span>
                <select
                  value={limit}
                  onChange={(e) => setLimit(Number(e.target.value))}
                  className="px-4 py-2 border rounded-lg focus:ring focus:ring-blue-300 dark:bg-gray-800 dark:text-white dark:border-gray-600"
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>
              </div>
            </div>
          </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed z-10 inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 w-96">
            <h2 className="text-2xl font-semibold mb-4">
              {isAddMode ? "Add User" : "Update User"}
            </h2>
            <form onSubmit={handleFormSubmit}>
            {error && (
  <div className="mt-4 p-4 bg-red-100 text-red-700 rounded">
    <h4 className="font-semibold">{error}</h4>
    {errorDetails.length > 0 && (
      <ul className="mt-2">
        {errorDetails.map((detail, index) => (
          <li key={index} className="text-sm">
            <strong>{detail.parameter}:</strong> {detail.message}
          </li>
        ))}
      </ul>
    )}
  </div>
)}

              <div className="mb-4">
                <label>Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-blue-300 dark:bg-gray-800 dark:text-white dark:border-gray-600"
                  required
                />
              </div>
              <div className="mb-4">
                <label>Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-blue-300 dark:bg-gray-800 dark:text-white dark:border-gray-600"
                  required
                />
              </div>
              <div className="mb-4">
                <label>Role</label>
                <select
                  value={roleID}
                  onChange={(e) => setRoleID(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-blue-300 dark:bg-gray-800 dark:text-white dark:border-gray-600"
                  required
                >
                  <option value="" disabled>
                    Select Role
                  </option>
                  <option value="1">Admin</option>
                  <option value="2">Super Admin</option>
                </select>
              </div>
              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-gray-300 dark:bg-gray-800 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Submitting..." : isAddMode ? "Add" : "Update"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserTable;
