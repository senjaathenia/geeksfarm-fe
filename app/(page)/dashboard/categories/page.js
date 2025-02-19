"use client";

import CategoryTable from "@/app/componentss/categories-table";

export default function CategorisManagement() {
  return (
    <div className="container mx-auto mt-8 px-4">
      
      <h1 className="text-3xl font-bold text-white-800 mb-6 text-center">Categories Management</h1>
      <div className="mb-8">
        <CategoryTable />
      </div>
    </div>
  );
}
