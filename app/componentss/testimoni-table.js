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
import { useGetTestimoni } from "@/hooks/query/testimoni";

const TestimoniTable = () => {
  const { isDarkMode } = useTheme();
  const [testimoni, setTestimonies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1); // Current page
  const [limit, setLimit] = useState(10); // Items per page
  const [total, setTotal] = useState(0); // Total items
  const [lastPage, setLastPage] = useState(1); // Total pages
  const [debouncedSearch] = useDebounce(search, 500);

  // States for Modal (Add and Update)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddMode, setIsAddMode] = useState(false);
  const [testimoniToUpdate, setTestimoniToUpdate] = useState(null);
  const [name, setName] = useState("");
  const [title, setTitle] = useState("");
  const [deskripsi, setDeskripsi] = useState("");
  const [mediaFile, setMediaFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const data = useGetTestimoni()

  // const newTestimoni = testimoni.map((testi) => ({...testi, tanggal: new Date(testi.tanggal).toLocaleDateString('en-GB')}))
  const handleApiError = (error) => {
    if (error.response) {
      const { status, data } = error.response;
      const message = data.message || "An error occurred."; // Pesan utama
      const details = data.errors || []; // Detail error
  
      // Removed setting error state here
      toast.error(message); // Toast notification for error
      return { status, message, details };
    }
    toast.error("Unknown error occurred."); // Default error message if no response
    return { status: 500, message: "Unknown error occurred.", details: [] };
  };
  

  const fetchTestimonies = async () => {
    setLoading(true);
    try {
      const response = await apiAuthed.get("/get-testimoni", {
        params: { pages: page, limit, keyword: search },
      });
      const testimoniesData = response.data?.data?.data?.testimoni || [];
      setTestimonies(testimoniesData.map((testi) => ({ ...testi, tanggal: new Date(testi.tanggal).toLocaleDateString('en-GB') })));
      setTotal(response.data?.data?.total || 0);
      setLastPage(response.data?.data?.last_page || 1);
      toast.success("Testimonies loaded successfully!");
    } catch (error) {
      const { status, message, details } = handleApiError(error);
      console.error("Fetch Testimonies Error:", { status, message, details });
      setError(message);
      setErrorDetails(details);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };
  
  // Fetch Testimonies when `page`, `limit`, or `search` changes
  useEffect(() => {
    fetchTestimonies();
  }, [page, limit, debouncedSearch]);

  const columns = [
    { accessorKey: "id", header: "ID" },
    { accessorKey: "name", header: "Name" },
    { accessorKey: "title", header: "Title" },
    { accessorKey: "deskripsi", header: "Deskripsi" },
    { accessorKey: "tanggal", header: "Tanggal" },
    {
      accessorKey: "media",
      header: "Media",
      cell: ({ row }) => (
        <a
          href={row.original.media}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 hover:underline"
        >
          View Media
        </a>
      ),
    },
    {
      accessorKey: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex space-x-2">
          <button
            onClick={() => handleEdit(row.original)}
            className="text-blue-500 hover:text-blue-700"
          >
            <PencilSquareIcon className="h-5 w-5" />
          </button>
          <button
            onClick={() => handleDelete(row.original.id)}
            className="text-red-500 hover:text-red-700"
          >
            <TrashIcon className="h-5 w-5" />
          </button>
        </div>
      ),
    },
  ];

  const table = useReactTable({
    data: testimoni, // Gunakan state testimonies sebagai sumber data tabel
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: limit 
      
    } },
  });
  
  const handleAddTestimoni = () => {
    setIsAddMode(true);
    setName("");
    setTitle("");
    setDeskripsi("");
    setMediaFile(null);
    setIsModalOpen(true);
  };

  const handleEdit = (testimoni) => {
    setIsAddMode(false);
    setTestimoniToUpdate(testimoni);
    setName(testimoni.name);
    setTitle(testimoni.title);
    setDeskripsi(testimoni.deskripsi);
    setMediaFile(null); // Media file tidak langsung diisi.
    setIsModalOpen(true);
  };


  const handleDelete = async (id) => {
    try {
      await apiAuthed.delete(`/delete-testimoni/${id}`);
      toast.success("Testimoni deleted successfully.");
      fetchTestimonies(); // Refresh data
    } catch (error) {
      const { status, message, details } = handleApiError(error);
      console.error("Delete Testimoni Error:", { status, message, details });
      toast.error(message);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // File size check
        toast.error("File size must be less than 5MB.");
        return;
      }
      if (!file.type.startsWith("image/")) { // File type check
        toast.error("Only image files are allowed.");
        return;
      }
      setMediaFile(file); // If valid, set the file
    }
  };
  
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
  
    const formData = new FormData();
    formData.append("name", name);
    formData.append("title", title);
    formData.append("deskripsi", deskripsi);
    if (mediaFile) {
      formData.append("media", mediaFile);
    }
  
    try {
      if (isAddMode) {
        const response = await apiAuthed.post("/testimoni", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Testimoni added successfully.");
      } else {
        const response = await apiAuthed.put(`/update-testimoni/${testimoniToUpdate.id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Testimoni updated successfully.");
      }
      setIsModalOpen(false);
      fetchTestimonies();
    } catch (error) {
      // Enhanced error handling
      if (error.response) {
        // Check for error response
        const { status, data } = error.response;
        const message = data.message || "An error occurred.";
        const details = data.errors || [];
        toast.error(message);  // Display error toast
        console.error("Submit Testimoni Error:", { status, message, details });
      } else if (error.request) {
        // Handle case if there is no response from server
        console.error("Submit Testimoni Error: No response from server", error.request);
        toast.error("No response from server.");
      } else {
        // Handle other errors
        console.error("Submit Testimoni Error: ", error.message);
        toast.error("An unexpected error occurred.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="container mx-auto mt-1 px-4">
      <h1 className="mb-8 text-center">This page is for managing Testimoni data</h1>

      {/* Search and Add Testimoni */}
      <div className="flex justify-between items-center mb-4">
          <input
            type="text"
            placeholder="Search testimonies..."
            className="w-full max-w-lg px-4 py-2 border rounded-lg focus:ring focus:ring-blue-300 dark:bg-gray-800 dark:text-white dark:border-gray-600"
            value={search}
            onChange={(e) => setSearch(e.target.value)} // Update state `search`
         />
        <button
          onClick={handleAddTestimoni}
          className={`flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 transition`}
        >
          <PlusIcon className="h-5 w-5" />
          <span>Add Testimoni</span>
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
            ) : testimoni.length > 0 ? (
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
                  No Testimonies found.
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
              {isAddMode ? "Add Testimoni" : "Update Testimoni"}
            </h2>
            <form onSubmit={handleFormSubmit}>
  {/* Removed error display from here */}
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
    <label>Title</label>
    <input
      type="title"
      value={title}
      onChange={(e) => setTitle(e.target.value)}
      className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-blue-300 dark:bg-gray-800 dark:text-white dark:border-gray-600"
      required
    />
  </div>
  <div className="mb-4">
    <label>Deskripsi</label>
    <input
      type="deskripsi"
      value={deskripsi}
      onChange={(e) => setDeskripsi(e.target.value)}
      className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-blue-300 dark:bg-gray-800 dark:text-white dark:border-gray-600"
      required
    />
  </div>

  {/* File Upload Section */}
  <div className="mb-4" onDragOver={(e) => e.preventDefault()} onDrop={(e) => {
    e.preventDefault(); // Prevent default behavior for drop
    const file = e.dataTransfer.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size must be less than 5MB.");
        return;
      }
      if (!file.type.startsWith("image/")) {
        toast.error("Only image files are allowed.");
        return;
      }
      setMediaFile(file);
    }
  }}>
    <label className="block font-medium dark:text-gray-300">Upload Media File</label>
    <div className={`flex flex-col items-center justify-center border-2 ${mediaFile || testimoniToUpdate?.media ? "border-green-500" : "border-dashed border-blue-500"} rounded-lg p-4 space-y-4 dark:bg-gray-800 dark:border-gray-600`}>
      {mediaFile ? (
        <div className="text-center">
          {/* Preview if file uploaded */}
          <img
            src={URL.createObjectURL(mediaFile)}
            alt="Preview"
            className="max-w-[150px] max-h-[150px] object-cover rounded-lg shadow-md"
          />
          <p className="mt-2 text-sm font-medium dark:text-gray-300">{mediaFile.name}</p>
          <button
            type="button"
            onClick={() => setMediaFile(null)}
            className="mt-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
          >
            Remove File
          </button>
        </div>
      ) : testimoniToUpdate?.media ? (
        <div className="text-center">
          {/* Preview previous media */}
          <img
            src={testimoniToUpdate.media}
            alt="Previous Media"
            className="max-w-[150px] max-h-[150px] object-cover rounded-lg shadow-md"
          />
          <p className="mt-2 text-sm font-medium dark:text-gray-300">Previous Media</p>
        </div>
      ) : null}

      <label
        htmlFor="mediaFileInput"
        className="flex flex-col items-center justify-center cursor-pointer text-center px-4 py-6 bg-blue-100 text-blue-500 rounded-lg shadow-md hover:bg-blue-200 transition dark:bg-blue-900 dark:text-blue-300 dark:hover:bg-blue-800"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm7 4a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H8a1 1 0 110-2h3V8a1 1 0 011-1z" clipRule="evenodd" />
        </svg>
        <p className="mt-2 text-sm font-semibold">Click or Drag & Drop File</p>
        <p className="text-xs text-gray-500">JPEG, PNG, up to 5MB</p>
      </label>
      <input
        type="file"
        accept="image/*"
        id="mediaFileInput"
        className="hidden"
        onChange={handleFileChange} // Handle file change here
      />
    </div>
  </div>

  {/* Buttons */}
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

export default TestimoniTable;
