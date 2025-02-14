"use client";

import TestimoniTable from "@/app/componentss/testimoni-table";



export default function TestimoniManagement() {
  return (
    <div className="container mx-auto mt-8 px-4">
      
      <h1 className="text-3xl font-bold text-white-800 mb-6 text-center">Testimoni Management</h1>
      <div className="mb-8">
        <TestimoniTable />
      </div>


    </div>
  );
}
