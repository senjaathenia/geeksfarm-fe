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
import { useGetTypes } from "@/hooks/query/type";

const TypeTable = () => {
  const { isDarkMode } = useTheme();
  const [types, setTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1); // Current page
  const [limit, setLimit] = useState(10); // Items per page
  const [total, setTotal] = useState(0); // Total items
  const [lastPage, setLastPage] = useState(1); // Total pages
  const [debouncedSearch] = useDebounce(search, 500);

  // States for Modal (Add and Update)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddMode, setIsAddMode] = useState(false);
  const [typeToUpdate, settypeToUpdate] = useState(null);
  const [name, setName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorDetails, setErrorDetails] = useState([])

  const data = useGetTypes()

  const handleApiError = (error) => {
    if (error.response) {
      const { status, data } = error.response;
      const message = data.message || "An error occurred."; // Pesan utama
      const details = data.errors || []; // Detail error
  
      return { status, message, details };
    }
    return { status: 500, message: "Unknown error occurred.", details: [] };
  };
  

  const fetchTypes = async () => {
    setLoading(true);
    try {
      const response = await apiAuthed.get("/get-types", {
        params: { page, limit, keyword: search } // Pastikan parameter sesuai backend
      });
      
      const typesData = response.data?.data?.types || [];
      setTypes(typesData);
      setTotal(response.data?.data?.total || 0);
      setLastPage(response.data?.data?.last_page || 1);
    } catch (error) {
      const { message, details } = handleApiError(error);
      toast.error(message);
      details.forEach(err => toast.error(`${err.parameter}: ${err.message}`));
    } finally {
      setLoading(false);
    }
  };
  // Fetch types when `page`, `limit`, or `search` changes
  useEffect(() => {
    console.log("Fetching data with params:", { page, limit, search: debouncedSearch });
    fetchTypes();
  }, [page, limit, debouncedSearch]);

  const columns = [
    { accessorKey: "id", header: "ID" },
    { accessorKey: "name", header: "Name" },
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
        </div>
      ),
    },
  ];

  const validateForm = () => {
    let isValid = true;
  
    if (!name || name.trim() === "") {
      toast.error("Name is required.");
      isValid = false;
    }
    if (name.length > 50) {
      toast.error("Name must not exceed 50 characters.");
      isValid = false;
    }
  
    return isValid;
  };
  
  // console.log("Types:", data.data.data.data.types); // Debugging

  const table = useReactTable({
    data:  types, // Pastikan `types` adalah array
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: limit } },
  });  
  
  const handleAddType = () => {
    setIsAddMode(true);
    setName("");
    setError(""); // Reset error
    setErrorDetails([]); // Reset error details  
    setIsModalOpen(true);
  };

  const handleEdit = (type) => {
    setIsAddMode(false);
    settypeToUpdate(type);
    setName(type.name);
    setError(""); // Reset error
    setErrorDetails([]); // Reset error details  
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      await apiAuthed.delete(`/delete-types/${id}`);
      toast.success("Type deleted successfully");
      fetchTypes();
    } catch (error) {
      const { message } = handleApiError(error);
      toast.error(message);
    }
  };


  const handleFormSubmit = async (e) => {
    e.preventDefault();
  
    // Validasi dengan toast
    if (!validateForm()) return;
  
    setIsSubmitting(true);
  
    try {
      if (isAddMode) {
        await apiAuthed.post("/types", { name });
        toast.success("Type added successfully!");
      } else {
        await apiAuthed.put(`/update-types/${typeToUpdate.id}`, { name });
        toast.success("Type updated successfully!");
      }
  
      setIsModalOpen(false);
      fetchTypes();
    } catch (error) {
      const { message, details } = handleApiError(error);
      // Tampilkan error di toast, bukan di form
      toast.error(message);
      details.forEach(err => toast.error(`${err.parameter}: ${err.message}`));
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="container mx-auto mt-1 px-4">
      <h1 className="mb-8 text-center">This page is for managing Type data</h1>

      {/* Search and Add type */}
      <div className="flex justify-between items-center mb-4">
          <input
            type="text"
            placeholder="Search types..."
            className="w-full max-w-lg px-4 py-2 border rounded-lg focus:ring focus:ring-blue-300 dark:bg-gray-800 dark:text-white dark:border-gray-600"
            value={search}
            onChange={(e) => setSearch(e.target.value)} // Update state `search`
         />
        <button
          onClick={handleAddType}
          className={`flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 transition`}
        >
          <PlusIcon className="h-5 w-5" />
          <span>Add Type</span>
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
             ) : types.length > 0 ? (
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
                   No types found.
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
              {isAddMode ? "Add Type" : "Update Type"}
            </h2>
            <form onSubmit={handleFormSubmit}>

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

export default TypeTable;
