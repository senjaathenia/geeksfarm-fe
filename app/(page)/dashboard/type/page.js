"use client";

import TypeTable from "@/app/componentss/type-table";


export default function TypeManagement() {
  return (
    <div className="container mx-auto mt-8 px-4">
      
      <h1 className="text-3xl font-bold text-white-800 mb-6 text-center">Type Management</h1>
      <div className="mb-8">
        <TypeTable />
      </div>


    </div>
  );
}
