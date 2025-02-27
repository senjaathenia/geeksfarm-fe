'use client'
import { useEffect, useState } from "react";
import { useIsFetching } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useGetEvents, useGetItems, useGetUserStatus, useGetFaqs, useGetTestimoni, useGetTypes, useGetCategories } from "@/hooks/query/dash";
import Link from 'next/link'; // Import Link dari Next.js

export default function DashboardPage() {
  const isLoading = useIsFetching();
  const [page, setPage] = useState(1); // Halaman saat ini
  const [limit] = useState(5); // Limit 5 data per halaman

  const { data: eventsData } = useGetEvents({ keyword: "", limit: 100 });
  const events = eventsData?.data?.events || [];
  const { data: itemsData } = useGetItems({ keyword: "", limit: 100 });
  const items = itemsData?.data?.data?.items || [];
  const { data: faqsData } = useGetFaqs({ keyword: "", limit: 100 });
  const faqs = faqsData?.data?.data?.faqs || [];
  const { data: testimoniData } = useGetTestimoni({ keyword: "", limit: 100 });
  const testimoni = testimoniData?.data?.data?.testimoni || [];
  const { data: typesData } = useGetTypes({ keyword: "", limit: 100 });
  const types = typesData?.data?.data?.types || [];
  const { data: categoriesData } = useGetCategories({ keyword: "", limit: 100 });
  const categories = categoriesData?.data?.data?.categories || [];

  const userRole = useSession().data?.user?.role;

  const usersQuery = useGetUserStatus({ limit: 1000 });
  const itemsQuery = useGetItems({ limit: 1000 });
  const eventsQuery = useGetEvents({ limit: 1000 });
  const faqsQuery = useGetFaqs({ limit: 1000 });
  const testimoniQuery = useGetTestimoni({ limit: 1000 });
  const typeQuery = useGetTypes({ limit: 1000 });
  const categoriesQuery = useGetCategories({ limit: 1000 });

  const data = {
    users: Array.isArray(usersQuery.data?.data?.users) ? usersQuery.data?.data?.users.length : 0,
    events: Array.isArray(eventsQuery.data?.data?.events) ? eventsQuery.data?.data?.events.length : 0,
    items: Array.isArray(itemsQuery.data?.data?.data?.items) ? itemsQuery.data?.data?.data?.items.length : 0,
    faqs: Array.isArray(faqsQuery.data?.data?.data?.faqs) ? faqsQuery.data?.data?.data?.faqs.length : 0,
    testimoni: Array.isArray(testimoniQuery.data?.data?.data?.testimoni) ? testimoniQuery.data?.data?.data?.testimoni.length : 0,
    types: Array.isArray(typeQuery.data?.data?.data?.types) ? typeQuery.data?.data?.data?.types.length : 0,
    categories: Array.isArray(categoriesQuery.data?.data?.data?.categories) ? categoriesQuery.data?.data?.data?.categories.length : 0
  };

  // Sort events by ID descending to show the latest ones first
  const sortedEvents = events.sort((a, b) => b.id - a.id);
  const sortedItems = items.sort((a, b) => b.id - a.id);
  const sortedFaqs = faqs.sort((a, b) => b.id - a.id);
  const sortedTestimoni = testimoni.sort((a, b) => b.id - a.id);
  const sortedTypes = types.sort((a, b) => b.id - a.id);
  const sortedCategories = categories.sort((a, b) => b.id - a.id);

  // Paginate data - Ambil 5 data per halaman
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedEvents = sortedEvents.slice(startIndex, endIndex);
  const paginatedItems = sortedItems.slice(startIndex, endIndex);
  const paginatedFaqs = sortedItems.slice(startIndex, endIndex);
  const paginatedTestimoni = sortedItems.slice(startIndex, endIndex);
  const paginatedTypes = sortedItems.slice(startIndex, endIndex);
  const paginatedCategories = sortedItems.slice(startIndex, endIndex);

  // Total halaman
  const totalPages = Math.ceil(sortedEvents.length / limit);
  const totalItemsPages = Math.ceil(sortedItems.length / limit);
  const totalFaqsPages = Math.ceil(sortedFaqs.length / limit);
  const totalTestimoniPages = Math.ceil(sortedTestimoni.length / limit);
  const totalTypesPages = Math.ceil(sortedTypes.length / limit);
  const totalCategoriesPages = Math.ceil(sortedCategories.length / limit);

  return (
    <div>
      <header className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-semibold text-gray-900 dark:text-white">Dashboard</h2>
      </header>

      {/* Bagian Kartu */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
        {userRole === "Super Admin" && (
          <Link href="/users" passHref>
            <div className="p-8 rounded-lg shadow-lg bg-green-100 dark:bg-green-900 text-green-900 dark:text-green-100 cursor-pointer">
              <p className="text-lg font-medium">Active Users</p>
              <p className="text-4xl font-bold">{data?.users ?? "0"}</p>
            </div>
          </Link>
        )}

        <Link href="/events" passHref>
          <div className="p-8 rounded-lg shadow-lg bg-purple-100 dark:bg-purple-900 text-purple-900 dark:text-purple-100 cursor-pointer">
            <p className="text-lg font-medium">Events</p>
            <p className="text-4xl font-bold">{data?.events ?? "0"}</p>
          </div>
        </Link>

        <Link href="/items" passHref>
          <div className="p-8 rounded-lg shadow-lg bg-green-100 dark:bg-green-900 text-green-900 dark:text-green-100 cursor-pointer">
            <p className="text-lg font-medium">Items</p>
            <p className="text-4xl font-bold">{data?.items ?? "0"}</p>
          </div>
        </Link>

        <Link href="/faqs" passHref>
          <div className="p-8 rounded-lg shadow-lg bg-purple-100 dark:bg-purple-900 text-purple-900 dark:text-purple-100 cursor-pointer">
            <p className="text-lg font-medium">FAQs</p>
            <p className="text-4xl font-bold">{data?.faqs ?? "0"}</p>
          </div>
        </Link>

        <Link href="/testimoni" passHref>
          <div className="p-8 rounded-lg shadow-lg bg-green-100 dark:bg-green-900 text-green-900 dark:text-green-100 cursor-pointer">
            <p className="text-lg font-medium">Testimoni</p>
            <p className="text-4xl font-bold">{data?.testimoni ?? "0"}</p>
          </div>
        </Link>

        <Link href="/types" passHref>
          <div className="p-8 rounded-lg shadow-lg bg-purple-100 dark:bg-purple-900 text-purple-900 dark:text-purple-100 cursor-pointer">
            <p className="text-lg font-medium">Types</p>
            <p className="text-4xl font-bold">{data?.types ?? "0"}</p>
          </div>
        </Link>

        <Link href="/categories" passHref>
          <div className="p-8 rounded-lg shadow-lg bg-green-100 dark:bg-green-900 text-green-900 dark:text-green-100 cursor-pointer">
            <p className="text-lg font-medium">Categories</p>
            <p className="text-4xl font-bold">{data?.categories ?? "0"}</p>
          </div>
        </Link>
      </div>

      {/* Bagian Tabel */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
  <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">Recent Events</h3>
  <table className="min-w-full text-left table-auto border-collapse border border-gray-300 dark:border-gray-700">
    <thead className="bg-gray-200 dark:bg-gray-600">
      <tr>
        <th className="py-4 px-6 text-sm font-semibold text-gray-700 dark:text-white border-b">Title</th>
        <th className="py-4 px-6 text-sm font-semibold text-gray-700 dark:text-white border-b">Content</th>
        <th className="py-4 px-6 text-sm font-semibold text-gray-700 dark:text-white border-b">Type</th>
        <th className="py-4 px-6 text-sm font-semibold text-gray-700 dark:text-white border-b">Categories</th>
      </tr>
    </thead>
    <tbody className="text-sm text-gray-700 dark:text-gray-300">
      {isLoading ? (
        <tr>
          <td colSpan="4" className="text-center py-4">Loading...</td>
        </tr>
      ) : paginatedEvents.length === 0 ? (
        <tr>
          <td colSpan="4" className="text-center py-4">No events found.</td>
        </tr>
      ) : (
        paginatedEvents.map((event, index) => (
          <tr key={`${event.id}-${index}`} className="cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-500 hover:scale-105 transition-all duration-300 ease-in-out">
            <td className="py-4 px-6 border-b">{event.title}</td>
            <td className="py-4 px-6 border-b">{event.content ? event.content : "No content available"}</td>
            <td className="py-4 px-6 border-b">{event.type?.name || "No type available"}</td>
            <td className="py-4 px-6 border-b">
              {event.categories?.map((category, idx) => (
                <span key={category.id} className="text-gray-700 dark:text-gray-300">{category.name}{idx < event.categories.length - 1 && ", "}</span>
              )) || "No categories available"}
            </td>
          </tr>
        ))
      )}
    </tbody>
  </table>

  {/* Pagination Controls */}
  <div className="flex justify-between items-center mt-6">
    <button
      className="px-5 py-2 bg-gray-200 text-gray-700 rounded-md shadow-sm disabled:opacity-50"
      onClick={() => setPage(page > 1 ? page - 1 : 1)}
      disabled={page === 1}
    >
      Previous
    </button>
    <span className="text-gray-700 text-lg font-medium dark:text-white">{`Page ${page} of ${totalPages}`}</span>
    <button
      className="px-5 py-2 bg-gray-200 text-gray-700 rounded-md shadow-sm disabled:opacity-50"
      onClick={() => setPage(page < totalPages ? page + 1 : totalPages)}
      disabled={page === totalPages}
    >
      Next
    </button>
  </div>
</div>

{/* Recent Items */}
<div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
  <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">Recent Items</h3>
  <table className="min-w-full text-left table-auto border-collapse border border-gray-300 dark:border-gray-700">
    <thead className="bg-gray-200 dark:bg-gray-600">
      <tr>
        <th className="py-4 px-6 text-sm font-semibold text-gray-700 dark:text-white border-b">Pointer</th>
        <th className="py-4 px-6 text-sm font-semibold text-gray-700 dark:text-white border-b">Content</th>
      </tr>
    </thead>
    <tbody className="text-sm text-gray-700 dark:text-gray-300">
      {isLoading ? (
        <tr>
          <td colSpan="4" className="text-center py-4">Loading...</td>
        </tr>
      ) : paginatedItems.length === 0 ? (
        <tr>
          <td colSpan="4" className="text-center py-4">No items found.</td>
        </tr>
      ) : (
        paginatedItems.map((item, index) => (
          <tr key={item.id} className="cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-500 hover:scale-105 transition-all duration-300 ease-in-out">
            <td className="py-4 px-6 border-b">{item.pointer}</td>
            <td className="py-4 px-6 border-b">
              {item.content?.startsWith("http") ? (
                <a
                  href={item.content}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline"
                >
                  View File
                </a>
              ) : (
                <span>{item.content}</span>
              )}
            </td>
          </tr>
        ))
      )}
    </tbody>
  </table>

  {/* Pagination Controls */}
  <div className="flex justify-between items-center mt-6">
    <button
      className="px-5 py-2 bg-gray-200 text-gray-700 rounded-md shadow-sm disabled:opacity-50"
      onClick={() => setPage(page > 1 ? page - 1 : 1)}
      disabled={page === 1}
    >
      Previous
    </button>
    <span className="text-gray-700 text-lg font-medium dark:text-white">{`Page ${page} of ${totalItemsPages}`}</span>
    <button
      className="px-5 py-2 bg-gray-200 text-gray-700 rounded-md shadow-sm disabled:opacity-50"
      onClick={() => setPage(page < totalItemsPages ? page + 1 : totalItemsPages)}
      disabled={page === totalItemsPages}
    >
      Next
    </button>
  </div>
</div>

{/* Recent Faqs */}
<div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
  <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">Recent FAQs</h3>
  <table className="min-w-full text-left table-auto border-collapse border border-gray-300 dark:border-gray-700">
    <thead className="bg-gray-200 dark:bg-gray-600">
      <tr>
        <th className="py-4 px-6 text-sm font-semibold text-gray-700 dark:text-white border-b">Question</th>
        <th className="py-4 px-6 text-sm font-semibold text-gray-700 dark:text-white border-b">Answer</th>
      </tr>
    </thead>
    <tbody className="text-sm text-gray-700 dark:text-gray-300">
      {isLoading ? (
        <tr>
          <td colSpan="4" className="text-center py-4">Loading...</td>
        </tr>
      ) : paginatedFaqs.length === 0 ? (
        <tr>
          <td colSpan="4" className="text-center py-4">No faqs found.</td>
        </tr>
      ) : (
        paginatedFaqs.map((faqs, index) => (
          <tr key={faqs.id} className="cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-500 hover:scale-105 transition-all duration-300 ease-in-out">
            <td className="py-4 px-6 border-b">{faqs.question}</td>
            <td className="py-4 px-6 border-b">{faqs.answer}</td>
          </tr>
        ))
      )}
    </tbody>
  </table>

  {/* Pagination Controls */}
  <div className="flex justify-between items-center mt-6">
    <button
      className="px-5 py-2 bg-gray-200 text-gray-700 rounded-md shadow-sm disabled:opacity-50"
      onClick={() => setPage(page > 1 ? page - 1 : 1)}
      disabled={page === 1}
    >
      Previous
    </button>
    <span className="text-gray-700 text-lg font-medium dark:text-white">{`Page ${page} of ${totalFaqsPages}`}</span>
    <button
      className="px-5 py-2 bg-gray-200 text-gray-700 rounded-md shadow-sm disabled:opacity-50"
      onClick={() => setPage(page < totalFaqsPages ? page + 1 : totalFaqsPages)}
      disabled={page === totalFaqsPages}
    >
      Next
    </button>
  </div>
</div>
    </div>
  );
}
