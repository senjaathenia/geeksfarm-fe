"use client";

import { useState, useEffect } from "react";
import {
  CogIcon,
  ArrowRightOnRectangleIcon,
} from "@heroicons/react/24/solid";
import Sidebar from "@/app/componentss/sidebar";
import { useTheme } from "@/app/theme";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";


export default function Home({ children }) {
  const { isDarkMode } = useTheme();
  const [showMenu, setShowMenu] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState("");
  const [userName, setUserName] = useState("Guest");
  const [userRole, setUserRole] = useState("User");
  const router = useRouter();
  const [users, setUsers] = useState([]);

  useEffect(() => {
    // Ambil data dari localStorage
    const name = localStorage.getItem("userName") || "Guest";
    const role = localStorage.getItem("userRole") || "User";
  
    // Set nama dan role
    setUserName(name);
    setUserRole(role);

    // Generate random avatar URL
    const avatarBaseUrl = "https://robohash.org/";
    const uniqueString = `${name}-${role}`;
    setAvatarUrl(`${avatarBaseUrl}${encodeURIComponent(uniqueString)}.png`);
  }, []);

  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  // const handleLogout = async () => {
  //   try {
  //     // Panggil signOut dari NextAuth
  //     await signOut({ callbackUrl: "/login" }); // Redirect ke halaman login setelah logout
  //   } catch (error) {
  //     console.error("Logout error:", error);
  //   }
  // };


  const handleLogout = async () => {
    await signOut({ redirect: true, redirectTo: "/login" });
  };
  // const handleLogout = async () => zzz{
  //   await signOut({ redirect: false });
  //   document.cookie =
  //     "auth_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  //   router.push("/login");
  // };
  // const handleLogout = async () => {
  //   // Clear local storage or session storage if you store user data
  //   localStorage.removeItem("userSession"); // Remove session if it's stored in local storage
  //   localStorage.removeItem("authToken"); // Remove token if it's stored in local storage
    
  //   // Call the NextAuth signOut function
  //   await signOut({ redirect: false }); // You can choose to redirect to a specific page or stay on the current page
    
  //   // Optional: Redirect to login page after sign-out
  //   window.location.href = "/login"; // Or navigate to any other page
  // };

  // const handleLogout = async () => {
  //   const token = localStorage.getItem("authToken"); // Ambil token dari localStorage
  
  //   try {
  //     const response = await fetch("http://localhost:8080/logout", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //         Authorization: `Bearer ${token}`, // Tambahkan token di header
  //       },
  //       credentials: "include", // Pastikan cookie dikirimkan
  //     });
  
  //     if (response.ok) {
  //       localStorage.removeItem("userSession"); // Hapus session dari local storage
  //       localStorage.removeItem("authToken"); // Hapus token jika diperlukan
  //       window.location.href = "/login"; // Redirect ke halaman login
  //     } else {
  //       console.error("Logout failed");
  //     }
  //   } catch (err) {
  //     console.error("Error during logout:", err);
  //   }
  // };
  
  // const handleLogout = () => {
  //   // Hapus data dari localStorage
  //   localStorage.removeItem("authToken");
  //   localStorage.removeItem("userName");
  //   localStorage.removeItem("userRole");

  //   // Redirect ke halaman login
  //   window.location.href = "/login";
  // };

  return (
    <div
      className={`flex font-sans ${
        isDarkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"
      }`}
    >
      {/* Sidebar tetap */}
      <Sidebar avatarUrl={avatarUrl} userName={userName} userRole={userRole} />

      {/* Kontainer utama */}
      <div className="flex-1 relative">
        {/* Header */}
        <div className="absolute top-0 right-0 p-4 flex items-center space-x-4">
          {/* Avatar */}
          <div
            onClick={toggleMenu}
            className={`w-12 h-12 rounded-full overflow-hidden cursor-pointer shadow-md ${
              isDarkMode ? "bg-gray-700" : "bg-white"
            }`}
          >
            {avatarUrl && (
              <img
                src={avatarUrl}
                alt="User Avatar"
                className="w-full h-full object-cover"
              />
            )}
          </div>

          {/* Dropdown Menu */}
          {showMenu && (
            <div
              className={`absolute top-16 right-4 w-48 rounded-lg shadow-lg z-50 ${
                isDarkMode ? "bg-gray-700" : "bg-white"
              }`}
            >
              {/* Avatar User di Dropdown */}
              <div className="flex items-center px-4 py-2 border-b dark:border-gray-600">
                <img
                  src={avatarUrl}
                  alt="User Avatar"
                  className="w-10 h-10 rounded-full mr-3"
                />
                <div>
                  <p className="text-sm font-medium text-gray-800 dark:text-white">
                    {userName}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-300">
                    {userRole}
                  </p>
                </div>
              </div>

              <a
                href="#settings"
                className="flex items-center px-4 py-2 text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-600"
              >
                <CogIcon className="h-5 w-5 mr-2" />
                Settings
              </a>
              <a
                onClick={handleLogout}
                className="flex items-center px-4 py-2 text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer"
              >
                <ArrowRightOnRectangleIcon className="h-5 w-5 mr-2" />
                Logout
              </a>
            </div>
          )}
        </div>

        {/* Konten dinamis */}
        <div className="p-8 ml-[250px]">{children}</div>
      </div>
    </div>
  );
}
