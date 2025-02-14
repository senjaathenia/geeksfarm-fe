"use client";

import ItemsTable from "@/app/componentss/items-table";

export default function FaqsManagement() {
  return (
    <div className="container mx-auto mt-8 px-4">
      
      <h1 className="text-3xl font-bold text-white-800 mb-6 text-center">Items Management</h1>
      <div className="mb-8">
        <ItemsTable />
      </div>


    </div>
  );
}
