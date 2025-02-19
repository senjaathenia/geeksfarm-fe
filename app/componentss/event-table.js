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
import { useGetCategories } from "@/hooks/query/categories";
import AsyncSelect from "react-select/async";
import RichTextEditor from "./rich-text-editor";
import { useIsFetching, useQueryClient } from "@tanstack/react-query";
import { useGetEvents } from "@/hooks/query/dash";

 // Wajib karena kita menggunakan state di sisi klien
 

const EventTable = () => {
  const queryClient = useQueryClient()


const { isDarkMode } = useTheme();
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);
const [page, setPage] = useState(1);
const [search, setSearch] = useState("");
const [limit, setLimit] = useState(10);
const [selectedFile, setSelectedFile] = useState(null);
const [mediaFile, setMediaFile] = useState(null);
 const [debouncedSearch] = useDebounce(search, 500);

const [isModalOpen, setIsModalOpen] = useState(false);
const [isAddMode, setIsAddMode] = useState(false);
const [eventToUpdate, setEventToUpdate] = useState(null);
const [title, setTitle] = useState("");
const [typeID, setTypeID] = useState("");
const [categories, setCategories] = useState([]);
const [content, setContent] = useState(null);
const [rating, setRating] = useState("");
const [isSubmitting, setIsSubmitting] = useState(false);

const data = useGetEvents()
const dataTypes = useGetTypes()
const { data: dataCategories, isError: isErrorCategories } = useGetCategories(); // Mengambil data kategori dengan hook

const isLoading = useIsFetching()


const loadOptions = async (inputValue) => {
  try {
    const response = await apiAuthed.get("/get-types", {
      params: { keyword: inputValue },
    });
    return response.data?.data?.data?.types?.map((type) => ({
      value: type.id,
      label: type.name,
    }));
  } catch (error) {
    console.error("Failed to fetch types:", error);
    return [];
  }
};

const handleTypeChange = (selectedOption) => {
  setTypeID(selectedOption ? selectedOption.value : "");
};


const loadCategoryOptions = async (inputValue) => {
  try {
    // Lakukan permintaan API untuk mengambil kategori berdasarkan input
    const response = await apiAuthed.get("/get-categories", {
      params: { keyword: inputValue },
    });

    const categories = response.data?.data?.data?.categories || [];

    // Format data menjadi { value, label }
    const formattedOptions = categories.map((category) => ({
      value: category.id,
      label: category.name,
    }));

    return formattedOptions; // Kembalikan hasil kategori
  } catch (error) {
    console.error("Failed to fetch categories:", error);
    return []; // Jika gagal, kembalikan array kosong
  }
};
;


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

const handleCategoriesChange = (selectedOptions) => {
  console.log("Selected categories:", selectedOptions);  // Debugging untuk melihat hasil
  // Set state categories dengan id kategori yang dipilih
  setCategories(selectedOptions ? selectedOptions.map(option => option.value) : []);
};

const {
  data: eventsData,
  isError: isErrorEvents,
} = useGetEvents({ page, limit, keyword: debouncedSearch });

const events = eventsData?.data?.events || [];
const total = eventsData?.data?.total || 0;
const lastPage = eventsData?.data?.last_page || 1;

useEffect(() => {
  // Invalidate and refetch when pagination params change
  queryClient.invalidateQueries({ 
    queryKey: ['getEvents']
  });
}, [page, limit, debouncedSearch, queryClient]);


const columns = [
    { accessorKey: "id", header: "ID" },
    { accessorKey: "title", header: "Title" },
    { accessorKey: "content", header: "Content" },
    {
      accessorKey: "type.name",
      header: "Type",
      cell: ({ row }) => <div>{row.original.type.name}</div>, // Menampilkan nama Type
    },
    {
      accessorKey: "categories",
      header: "Categories",
      cell: ({ row }) => (
        <div>
          {row.original.categories.map((category) => category.name).join(", ")} 
        </div>
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
        </div>
      ),
    },
  ];

  
  const table = useReactTable({
    data: events,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: {pageSize: limit} },
    });

    const handleAddEvent = () => {
        setIsAddMode(true);
        setTitle("");
        setContent("");
        setTypeID("");
        setCategories([]);
        setMediaFile(null);
        setIsModalOpen(true);
    }

    const handleEdit = (event) => {
        console.log("Event to edit:", event); // Debugging log
        setIsAddMode(false);
        setEventToUpdate(event);
        setTitle(event.title);
        setContent(event.content);
        setTypeID(event.type?.id); // Cek apakah `event.type` ada
        setCategories(event.categories?.map((category) => category.id) || []);
        setMediaFile(null) // Cek apakah `event.categories` ada
        setIsModalOpen(true);   
      };
    
    
  const handleDelete = async (id) => {
    try {
      await apiAuthed.delete(`/delete-events/${id}`);
      toast.success("Event deleted successfully.");
      queryClient.invalidateQueries({ queryKey: ['getEvents'] })
    } catch (error) {
      console.error("Delete Event Error:", error);
      toast.error("Failed to delete event.");
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
        // Validasi di Frontend
        if (!title.trim()) {
            toast.error("Title is required.");
            return;
        }
        if (!typeID) {
            toast.error("Please select a valid Type.");
            return;
        }
        if (categories.length === 0) {
            toast.error("Please select at least one category.");
            return;
        }
        if (categories.length > 1) {
            toast.error("Only one category is allowed.");
            return;
        }

        const formData = new FormData();
        formData.append("title", title);
        formData.append("content", content);
        formData.append("type_id", Number(typeID));
        formData.append("categories", categories[0]); // Kirim hanya satu kategori

        if (mediaFile) {
            formData.append("media", mediaFile);
        }

        const response = isAddMode
            ? await apiAuthed.post("/events", formData, { headers: { "Content-Type": "multipart/form-data" } })
            : await apiAuthed.put(`/update-events/${eventToUpdate.id}`, formData, { headers: { "Content-Type": "multipart/form-data" } });

        toast.success(`Event ${isAddMode ? "added" : "updated"} successfully.`);
        queryClient.invalidateQueries({ queryKey: ['getEvents'] })
        setIsModalOpen(false);
    } catch (error) {
        console.error("Submit Event Error:", error);
        toast.error(error.response?.data?.message || "Failed to submit event.");
    } finally {
        setIsSubmitting(false);
    }
};


  return (
    <div className="container mx-auto mt-1 px-4">
        <h1 className="mb-8 text-center">This page for managing Events Data</h1>

        <div className="flex justify-between items-center mb-4">
            <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search events..."
                className="w-full max-w-lg px-4 py-2 border rounded-lg focus:ring focus:ring-blue-300 dark:bg-gray-800 dark:text-white dark:border-gray-600"
                />
            <button
                onClick={handleAddEvent}
                className={`flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 transition`}
            >
                <PlusIcon className="h-5 w-5" />
                <span>Add Event</span>
            </button>
        </div>

        <div className="overflow-hidden border rounded-lg shadow-s">
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
                 {isLoading ? (
                              <tr>
                                <td colSpan={columns.length} className="text-center py-4">
                                  Loading...
                                </td>
                              </tr>
                            ) : events.length > 0 ? (
                              table.getRowModel().rows.map((row) => (
                                <tr key={row.id}>
                                  {row.getVisibleCells().map((cell) => {
                                    return (
                                      <td key={cell.id} className="px-6 py-4">
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                      </td>
                                    )
                                  })}
                                </tr>
                              ))
                            ) : (
                             <tr>
                             <td colSpan={columns.length} className="text-center py-4">
                              No events found.
                          </td>
                       </tr>
                      )}
                </tbody>
            </table>
        </div>

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
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 max-w-[500px] w-full">
      <h2 className="text-2xl font-semibold mb-4">
        {isAddMode ? "Add Event" : "Update Event"}
      </h2>
      <form onSubmit={handleFormSubmit}>
        {/* Title Input */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-blue-300 dark:bg-gray-800 dark:text-white dark:border-gray-600"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Content</label>
          {/* <input
            type="text"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-blue-300 dark:bg-gray-800 dark:text-white dark:border-gray-600"
            required
          /> */}
          <RichTextEditor defaultValue={content || ""} onChange={setContent} />
        </div>
        {/* Description Input */}
        {/* Type Dropdown */}
{/* Dropdown untuk Type */}
{/* Type Dropdown */}
<div className="mb-4">
              <label className="block text-sm font-medium mb-1">Type</label>
              <AsyncSelect
    cacheOptions
    defaultOptions
    loadOptions={loadOptions}
    onChange={handleTypeChange}
    value={
      typeID
        ? { value: typeID, label: dataTypes?.data?.data?.data?.types.find((type) => type.id === typeID)?.name }
        : null
    }
    placeholder="Select Type"
  />
            </div>

            <div className="mb-4">
  <label className="block text-sm font-medium mb-1">Categories</label>
  <AsyncSelect
  isMulti
  cacheOptions
  defaultOptions
  loadOptions={loadCategoryOptions}
  onChange={handleCategoriesChange}
  value={categories.map((id) => {
    // Ambil kategori berdasarkan id yang ada dalam categories
    const category = dataCategories?.data?.data?.categories?.find((category) => category.id === id);
    if (category) {
      return { value: category.id, label: category.name }; // Format yang benar
    }
    return null;
  }).filter(Boolean)} // Filter hanya kategori yang valid
  placeholder="Select Categories"
  isLoading={isLoading}
  isDisabled={isLoading || isErrorCategories || isErrorEvents} // Pastikan dropdown tidak dinonaktifkan ketika data sudah ada
/>
</div>
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
    <div className={`flex flex-col items-center justify-center border-2 ${mediaFile || eventToUpdate?.media ? "border-green-500" : "border-dashed border-blue-500"} rounded-lg p-4 space-y-4 dark:bg-gray-800 dark:border-gray-600`}>
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
      ) : eventToUpdate?.media ? (
        <div className="text-center">
          {/* Preview previous media */}
          <img
            src={eventToUpdate.media}
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
  )
};

export default EventTable;