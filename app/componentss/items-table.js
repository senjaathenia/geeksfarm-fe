"use client";

import React, { useState, useEffect, } from "react";
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
import { useGetItems } from "@/hooks/query/items";

const ItemsTable = () => {
  const { isDarkMode } = useTheme();
  const [items, setItems] = useState([]);
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
  const [itemsToUpdate, setItemsToUpdate] = useState(null);
  const [pointer, setPointer] = useState("");
  const [contentText, setContentText] = useState("");
  const [file, setFile] = useState(null);
  const [contentType, setContentType] = useState(""); // Tambahkan ini
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleApiError = (error) => {
    if (error.response) {
      const { status, data } = error.response;
      const message = data.message || "An error occurred";
      const details = data.errors || [];
      return { status, message, details };
    }
    return { status: 500, message: "Network error", details: [] };
  };

  const data = useGetItems()

  // const newTestimoni = testimoni.map((testi) => ({...testi, tanggal: new Date(testi.tanggal).toLocaleDateString('en-GB')}))


  // console.log(newTestimoni)
  const fetchItems = async () => {
    setLoading(true);
    try {
      const response = await apiAuthed.get("/get-items", {
        params: { 
          page, 
          limit, 
          keyword: debouncedSearch // Gunakan debouncedSearch
        },
      });
      
      const itemsData = response.data?.data?.data?.items || [];
      setItems(itemsData.map(item => ({
        ...item,
        tanggal: new Date(item.tanggal).toLocaleDateString('en-GB')
      })));
      setTotal(response.data?.data?.data?.total || 0);
      setLastPage(response.data?.data?.data?.last_page || 1);
    } catch (error) {
      const { message, details } = handleApiError(error);
      toast.error(message);
      details.forEach(err => toast.error(`${err.parameter}: ${err.message}`));
    } finally {
      setLoading(false);
    }
  }
  
  // Fetch Testimonies when `page`, `limit`, or `search` changes
  useEffect(() => {
    fetchItems();
  }, [page, limit, debouncedSearch]);

  const columns = [
    { accessorKey: "id", header: "ID" },
    { accessorKey: "pointer", header: "Pointer" },
    {
        accessorKey: "content",
        header: "Content",
        cell: ({ row }) =>
          row.original.content?.startsWith("http") ? (
            <a
              href={row.original.content}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline"
            >
              View File
            </a>
          ) : (
            <span>{row.original.content}</span>
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

  const validateForm = () => {
    let isValid = true;
    
    if (!pointer.trim()) {
      toast.error("Pointer is required");
      isValid = false;
    }
    
    if (!contentType) {
      toast.error("Please select content type");
      isValid = false;
    }
    
    if (contentType === "text" && !contentText.trim()) {
      toast.error("Text content is required");
      isValid = false;
    }
    
    if (contentType === "file" && !file) {
      toast.error("Please upload a file");
      isValid = false;
    }

    return isValid;
  };

  const table = useReactTable({
    data: items, // Gunakan state testimonies sebagai sumber data tabel
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: limit } },
  });
  
  
  const handleAddItems = () => {
    setIsAddMode(true);
    setPointer("");
    setContentText("");
    setFile(null);
    setContentType("");
    setIsModalOpen(true);
  };

  const handleEdit = (item) => {
    setIsAddMode(false);
    setItemsToUpdate(item);
    setPointer(item.pointer);
    
    if (item.content.startsWith("http")) {
      setContentType("file");
      setFile({ name: "Existing File", url: item.content });
    } else {
      setContentType("text");
      setContentText(item.content);
    }
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      await apiAuthed.delete(`/delete-items/${id}`);
      toast.success("Item deleted successfully");
      fetchItems();
    } catch (error) {
      const { message } = handleApiError(error);
      toast.error(message);
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
  
    setIsSubmitting(true);
  
    try {
      const formData = new FormData();
      formData.append("pointer", pointer);
  
      if (contentType === "file" && file) {
        // Jika file baru diupload
        if (file instanceof File) {
          formData.append("content", file);
        }
        // Jika menggunakan file existing (update tanpa mengubah file)
        else if (file?.url) {
          formData.append("content", file.url);
        }
      } else if (contentType === "text") {
        formData.append("content", contentText);
      }
  
      if (isAddMode) {
        await apiAuthed.post("/items", formData, {
          headers: { "Content-Type": "multipart/form-data" }
        });
        toast.success("Item added successfully");
      } else {
        await apiAuthed.put(`/update-items/${itemsToUpdate.id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" }
        });
        toast.success("Item updated successfully");
      }
  
      setIsModalOpen(false);
      fetchItems();
    } catch (error) {
      const { message, details } = handleApiError(error);
      toast.error(message);
      if (details && details.length > 0) {
        details.forEach(err => toast.error(`${err.parameter}: ${err.message}`));
      }
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="container mx-auto mt-1 px-4">
      <h1 className="mb-8 text-center">This page is for managing Items data</h1>

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
          onClick={handleAddItems}
          className={`flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 transition`}
        >
          <PlusIcon className="h-5 w-5" />
          <span>Add Items</span>
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
            ) : items.length > 0 ? (
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
                  No Items found.
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
  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
    <div className="bg-white rounded-lg shadow-lg w-96 p-6 relative">
      <h2 className="text-xl font-bold mb-4 text-center">
        {isAddMode ? "Add Item" : "Update Item"}
      </h2>
      <form onSubmit={handleFormSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Pointer</label>
          <input
            type="text"
            value={pointer}
            onChange={(e) => setPointer(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-blue-300"
            placeholder="Enter pointer"
            required
          />
        </div>

        {/* Dropdown untuk memilih input type */}
        <div className="mb-4">
  <label className="block text-sm font-medium text-gray-700">Content Type</label>
  <select
    onChange={(e) => {
      setContentType(e.target.value);
      if (e.target.value === "file") {
        setContentText(""); // Bersihkan teks jika tipe konten adalah file
      } else if (e.target.value === "text") {
        setFile(null); // Bersihkan file jika tipe konten adalah teks
      }
    }}
    value={contentType}
    className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-blue-300"
  >
    <option value="">Select Content Type</option>
    <option value="text">Text</option>
    <option value="file">File</option>
  </select>
</div>


        {/* Input untuk Text */}
        {contentType === "text" && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Text Content</label>
            <textarea
              value={contentText}
              onChange={(e) => setContentText(e.target.value)}
              placeholder="Enter text content..."
              className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-blue-300"
              rows="3"
            ></textarea>
          </div>
        )}

        {/* Input untuk File */}
        {contentType === "file" && (
          <div
            className="mb-4"
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
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
                setFile(file);
              }
            }}
          >
            <label className="block text-sm font-medium text-gray-700">Upload File</label>
            <div
              className={`flex flex-col items-center justify-center border-2 ${
                file ? "border-green-500" : "border-dashed border-blue-500"
              } rounded-lg p-4 space-y-4`}
            >
              {file ? (
                <div className="text-center">
                  <img
                    src={URL.createObjectURL(file)}
                    alt="Preview"
                    className="max-w-[150px] max-h-[150px] object-cover rounded-lg shadow-md"
                  />
                  <p className="mt-2 text-sm font-medium">{file.name}</p>
                  <button
                    type="button"
                    onClick={() => setFile(null)}
                    className="mt-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                  >
                    Remove File
                  </button>
                </div>
              ) : (
                <>
                  <label
                    htmlFor="fileInput"
                    className="flex flex-col items-center justify-center cursor-pointer text-center px-4 py-6 bg-blue-100 text-blue-500 rounded-lg shadow-md hover:bg-blue-200 transition"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-10 w-10"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm7 4a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H8a1 1 0 110-2h3V8a1 1 0 011-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <p className="mt-2 text-sm font-semibold">Click or Drag & Drop File</p>
                    <p className="text-xs text-gray-500">JPEG, PNG, up to 5MB</p>
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    id="fileInput"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        if (file.size > 5 * 1024 * 1024) {
                          toast.error("File size must be less than 5MB.");
                          return;
                        }
                        if (!file.type.startsWith("image/")) {
                          toast.error("Only image files are allowed.");
                          return;
                        }
                        setFile(file);
                      }
                    }}
                  />
                </>
              )}
            </div>
          </div>
        )}

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => setIsModalOpen(false)}
            className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
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

export default ItemsTable;
