"use client";

import { ReviewsTable } from "@/components/ReviewsTable";

export default function ReviewsPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Reviews Management</h1>
        <div className="flex space-x-2">
          {/* Filters placeholder */}
          <button className="px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
            Filter
          </button>
        </div>
      </div>

      <ReviewsTable />
    </div>
  );
}
