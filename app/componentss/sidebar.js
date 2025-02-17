import { CalendarIcon, FolderIcon, HomeIcon, TagIcon, User, HelpCircle, Box } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useTheme } from "@/app/theme";
import { useSession } from "next-auth/react";

const Sidebar = ({ avatarUrl}) => {
  const { isDarkMode, toggleDarkMode } = useTheme();
  const { data: session } = useSession();

  // Menangani status loading
  // if (status === "loading") {
  //   return <div>Loading...</div>;  // Atau bisa ditampilkan spinner
  // }

  const userName = session?.user?.name || "Guest";
  const userRole = session?.user?.role || "User";

  return (
    <aside
      className={`fixed z-[2] w-64 bg-white dark:bg-gray-800 shadow-lg h-screen p-6 flex flex-col transition-all duration-300 rounded-r-3xl`}
    >
      {/* Logo */}
      <div className="text-center mb-8">
        <div className="relative inline-block">
          {/* Logo untuk Light Mode */}
          <Image
            src="/geeksfarm_black_text.png"
            alt="Geeksfarm Logo Light Mode"
            width={150}
            height={40}
            className="block dark:hidden"
          />
          {/* Logo untuk Dark Mode */}
          <Image
            src="/geeksfarm.webp"
            alt="Geeksfarm Logo Dark Mode"
            width={150}
            height={40}
            className="hidden dark:block"
          />
        </div>
        <p className="text-sm text-gray-700 dark:text-white mt-2">Empowering Developers</p>
      </div>

      {/* Profil User */}
      <div className="mb-6">
        <div className="flex items-center mb-4">
        <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-600">
  {avatarUrl ? (
    <img
      src={avatarUrl}
      alt="User Avatar"
      className="w-full h-full object-cover"
    />
  ) : (
    <div className="flex items-center justify-center w-full h-full text-gray-500 dark:text-gray-300">
      No Avatar
    </div>
  )}
</div>

          <div className="ml-4">
            <p className="font-semibold text-gray-900 dark:text-white">{userName}</p>
            <p className="text-sm text-gray-500 dark:text-gray-300">{userRole}</p>
          </div>
        </div>
      </div>

      {/* Navigasi Sidebar */}
      <nav className="flex-1">
        {[
          {
            icon: <HomeIcon className="h-5 w-5 text-green-600 dark:text-green-300" />,
            text: "Dashboard",
            path: "/dashboard",
            role: ["Super Admin", "Admin"],
          },
          {
            icon: <User className="h-5 w-5 text-green-600 dark:text-green-300" />,
            text: "User",
            path: "/dashboard/user",
            role: ["Super Admin"],
          },
          {
            icon: <CalendarIcon className="h-5 w-5 text-purple-600 dark:text-purple-300" />,
            text: "Event",
            path: "/dashboard/event",
            role: ["Admin"],
          },
          {
            icon: <FolderIcon className="h-5 w-5 text-green-600 dark:text-green-300" />,
            text: "Categories Event",
            path: "/dashboard/categories",
            role: ["Admin"],
          },
          {
            icon: <TagIcon className="h-5 w-5 text-purple-600 dark:text-purple-300" />,
            text: "Event Type",
            path: "/dashboard/type",
            role: ["Admin"],
          },
          {
            icon: <HelpCircle className="h-5 w-5 text-blue-600 dark:text-blue-300" />,
            text: "FAQs",
            path: "/dashboard/faqs",
            role: ["Admin"],
          },
          {
            // Tambahan untuk Testimoni
            icon: <TagIcon className="h-5 w-5 text-orange-600 dark:text-orange-300" />,
            text: "Testimoni",
            path: "/dashboard/testimoni",
            role: ["Admin"],
          },
          {
            // Tambahan untuk Items
            icon: <Box className="h-5 w-5 text-blue-600 dark:text-blue-300" />,
            text: "Items",
            path: "/dashboard/items",
            role: ["Admin"],
          },
        ].filter(val => val.role.includes(userRole)).map(({ icon, text, path }, idx) => (
          <Link
            key={idx}
            href={path}
            className="flex items-center p-3 mb-4 rounded-lg text-gray-700 hover:bg-gray-200 dark:text-white dark:hover:bg-gray-600 transition-all duration-300"
          >
            <div className="flex items-center justify-center">{icon}</div>
            <span className="ml-3 text-gray-900 dark:text-white">{text}</span>
          </Link>
        ))}
      </nav>

      {/* Tombol Dark Mode */}
      <div className="mt-auto">
        <button
          onClick={toggleDarkMode}
          className="mt-auto w-full p-2 bg-white text-gray-900 dark:bg-gray-800 dark:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          {isDarkMode ? "Light Mode" : "Dark Mode"}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
