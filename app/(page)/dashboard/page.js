'use client'
import { useEffect, useState } from "react";
import { apiAuthed } from "@/service/api";  // Sesuaikan dengan import API kamu

export default function DashboardPage() {
  const [data, setData] = useState({
    users: 0,
    events: 0,
    items: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState(""); // Pencarian

  // Simulasi Role User (misalnya diambil dari API atau Context)
  const [userRole, setUserRole] = useState("Admin", "Super Admin"); // Bisa "superadmin" atau "admin"

  // Fungsi untuk fetch data
  const fetchData = async () => {
    setLoading(true);
    try {
      // Ambil data berdasarkan role
      if (userRole === "Super Admin") {
        // Fetch data pengguna hanya untuk superadmin
        const usersResponse = await apiAuthed.get("/get-users", {
          params: { keyword: search, limit: 1000 },
        });
        const activeUsers = usersResponse.data?.data?.users?.length || 0;
        setData(prevData => ({ ...prevData, activeUsers }));
      }

      // Ambil data events untuk semua role (admin dan superadmin)
      const eventsResponse = await apiAuthed.get("/get-events", {
        params: { keyword: search, limit: 1000 },
      });
      const events = eventsResponse.data?.data?.events?.length || 0;
      setData(prevData => ({ ...prevData, events }));

      // Ambil data items jika dibutuhkan
      const itemsResponse = await apiAuthed.get("/get-items", {});
      const items = itemsResponse.data?.data?.data?.items?.length || 0;
      setData(prevData => ({ ...prevData, items }));

    } catch (error) {
      console.error("Error fetching data:", error);
      setError("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [search]);

  console.log("User Role:", userRole); // Debugging role

  return (
    <div>
      <header className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Dashboard</h2>
      </header>

      {/* Bagian Kartu */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
        {
          // Kondisional untuk menampilkan kartu berdasarkan role
          userRole === "Super Admin" ? (
            <div className={`p-8 rounded-lg shadow-xl transition-all duration-300 ease-in-out hover:scale-105 bg-green-100 text-green-900`}>
              <p className="text-lg font-medium">Active Users</p>
              <p className="text-4xl font-bold">{data.users}</p>
            </div>
          ) : userRole === "Admin" ? (
            <div className={`p-8 rounded-lg shadow-xl transition-all duration-300 ease-in-out hover:scale-105 bg-purple-100 text-purple-900`}>
              <p className="text-lg font-medium">Events</p>
              <p className="text-4xl font-bold">{data.events}</p>
            </div>
          ) : (
            <p className="text-red-500">Role Tidak Valid</p> // Debugging jika role tidak valid
          )
        }
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
