"use client";

import UserTable from "@/app/componentss/user-table";

export default function UserManagement() {
  return (
    <div className="container mx-auto mt-8 px-6">
      {/* Title Section */}
      <div className="mb-6">
        <h1 className="text-3xl font-semibold text-gray-800">User Management</h1>
        <h2 className="text-lg text-gray-500 mt-2">This page is for managing User data</h2>
      </div>

      {/* Info Panel */}


      {/* User Table Section */}
      <div className="bg-white shadow rounded-lg p-4">
        <UserTable />
      </div>
    </div>
  );
}
