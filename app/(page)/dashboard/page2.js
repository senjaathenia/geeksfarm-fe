'use client'
import { useEffect, useState } from "react";
import { apiAuthed } from "@/service/api";  // Sesuaikan dengan import API kamu

export default function DashboardPage() {
  const [data, setData] = useState({
    activeUsers: 0,
    totalUsers: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState(""); // Pencarian

  // Fetch data untuk Users
  const fetchData = async () => {
    setLoading(true);
    try {
      // Ambil semua data users tanpa pagination (dengan limit tinggi)
      const usersResponse = await apiAuthed.get("/get-users", {
        params: { keyword: search, limit: 1000 }, // Menggunakan limit yang lebih tinggi
      });
      console.log("Users Response:", usersResponse.data);

      const activeUsers = usersResponse.data?.data?.users?.filter(user => user.status === "Active").length || 0;
      const totalUsers = usersResponse.data?.data?.users?.length || 0;

      setUsers(usersResponse.data?.data?.users || []);
      setData({
        activeUsers,
        totalUsers,
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
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Dashboard Super</h2>
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
            title: "Total Users",
            value: data.totalUsers,
            lightColor: "bg-purple-100 text-purple-900",
            darkColor: "bg-purple-800 text-purple-100",
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

      {/* Bagian Tabel Pengguna */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">User List</h3>

        {/* Pencarian */}
        <div className="mb-4 flex items-center space-x-4">
          <input
            type="text"
            placeholder="Search users..."
            className="w-full max-w-lg px-4 py-2 border rounded-lg focus:ring focus:ring-blue-300 dark:bg-gray-800 dark:text-white dark:border-gray-600"
            value={search}
            onChange={(e) => setSearch(e.target.value)} // Update state `search`
          />
        </div>

        <table className="w-full text-left">
          <thead>
            <tr className="border-b">
              <th className="py-4 text-gray-900 dark:text-white">Name</th>
              <th className="py-4 text-gray-900 dark:text-white">Email</th>
              <th className="py-4 text-gray-900 dark:text-white">Role</th>
              <th className="py-4 text-gray-900 dark:text-white">Status</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="4" className="text-center py-4">Loading...</td>
              </tr>
            ) : (
              <>
                {/* Daftar pengguna */}
                {users.map((row, idx) => (
                  <tr key={idx} className="hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300 ease-in-out">
                    <td className="py-4 text-gray-900 dark:text-white">{row.name}</td>
                    <td className="py-4 text-gray-900 dark:text-white">{row.email}</td>
                    <td className="py-4 text-gray-900 dark:text-white">{row.role_id === 1 ? "Admin" : "User"}</td>
                    <td className="py-4">
                      <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold shadow-lg ${row.status === "Active" ? "bg-green-500 text-white" : "bg-red-500 text-white"}`}>
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
