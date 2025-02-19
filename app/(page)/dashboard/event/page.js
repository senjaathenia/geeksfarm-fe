"use client";

import EventTable from "@/app/componentss/event-table";

export default function EventManagement() {
  return (
    <div className="container mx-auto mt-8 px-4">
      
      <h1 className="text-3xl font-bold text-white-800 mb-6 text-center">Event Management</h1>
      <div className="mb-8">
        <EventTable />
      </div>
    </div>
  );
}
