'use client'
import { useEffect, useState } from "react";
import { apiAuthed } from "@/service/api";  // Sesuaikan dengan import API kamu

export default function DashboardPage() {zzzz
  const [data, setData] = useState({
    activeUsers: 0,
    events: 0,
    items: 0, // Misalnya jumlah laporan bisa diambil dari API lain atau di hardcode
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState(""); // Pencarian

  // Fetch data untuk Users dan Events
  const fetchData = async () => {
    setLoading(true);
    try {
      // Ambil semua data users tanpa pagination (dengan limit tinggi)
      const usersResponse = await apiAuthed.get("/get-users", {
        params: { keyword: search, limit: 1000 }, // Menggunakan limit yang lebih tinggi
      });
      console.log("Users Response:", usersResponse.data);
  
      const activeUsers = usersResponse.data?.data?.users?.length || 0;
  
      // Ambil semua data events tanpa pagination (dengan limit tinggi)
      const eventsResponse = await apiAuthed.get("/get-events", {
        params: { keyword: search, limit: 1000 }, // Menggunakan limit yang lebih tinggi
      });
      console.log("Events Response:", eventsResponse.data);
  
      const events = eventsResponse.data?.data?.events?.length || 0;

      const itemsResponse = await apiAuthed.get("/get-items", {
      });

      console.log("Items Response:", itemsResponse.data);

      const items = itemsResponse.data?.data?.data?.items?.length || 0;
  
      setData({
        activeUsers,
        events,
        items, // Laporan yang mungkin diambil dari API lain
      });
  
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("Failed to load data");
    } finally {
      setLoading(false);
    }
  };
  

  useEffect(() => {
    fetchData();
  }, [search]); // Jalankan fetchData hanya ketika search berubah

  return (
    <div>
      <header className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Dashboard</h2>
      </header>

      {/* Bagian Kartu */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
        {[
          {
            title: "Active Users",
            value: data.activeUsers,
            lightColor: "bg-green-100 text-green-900",
            darkColor: "bg-green-800 text-green-100",
          },
          {
            title: "Events",
            value: data.events,
            lightColor: "bg-purple-100 text-purple-900",
            darkColor: "bg-purple-800 text-purple-100",
          },
          {
            title: "Items",
            value: data.items,
            lightColor: "bg-green-200 text-green-900",
            darkColor: "bg-green-700 text-green-100",
          },
        ].map((card, idx) => (
          <div
            key={idx}
            className={`p-8 rounded-lg shadow-xl transition-all duration-300 ease-in-out hover:scale-105 ${
              card.lightColor
            }`}
          >
            <p className="text-lg font-medium">{card.title}</p>
            <p className="text-4xl font-bold">{card.value}</p>
          </div>
        ))}
      </div>

      {/* Bagian Tabel */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Recent Activities</h3>
        <table className="w-full text-left">
          <thead>
            <tr className="border-b">
              <th className="py-4 text-gray-900 dark:text-white">Name</th>
              <th className="py-4 text-gray-900 dark:text-white">Role</th>
              <th className="py-4 text-gray-900 dark:text-white">Status</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="3" className="text-center py-4">Loading...</td>
              </tr>
            ) : (
              <>
                {/* Daftar penggunanya */}
                {[
                  { name: "John Doe", role: "Developer", status: "Active" },
                  { name: "Jane Smith", role: "Manager", status: "Pending" },
                  // Masukkan data users yang sesuai disini
                ].map((row, idx) => (
                  <tr key={idx} className="hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300 ease-in-out">
                    <td className="py-4 text-gray-900 dark:text-white">{row.name}</td>
                    <td className="py-4 text-gray-900 dark:text-white">{row.role}</td>
                    <td className="py-4">
                      <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold shadow-lg ${row.status === "Active" ? "bg-green-500 text-white" : "bg-purple-600 text-white"}`}>
                        {row.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </>
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
}
