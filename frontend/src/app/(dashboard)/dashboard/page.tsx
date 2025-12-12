"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import { fetchReviews, fetchAnalytics } from "@/store/reviewsSlice";
import { AnalyticsSummary } from "@/components/AnalyticsSummary";
import { ReviewsTable } from "@/components/ReviewsTable";

export default function DashboardPage() {
  const dispatch = useDispatch<AppDispatch>();
  const filters = useSelector((state: RootState) => state.filters);

  useEffect(() => {
    dispatch(fetchReviews(filters));
    dispatch(fetchAnalytics(filters));
  }, [dispatch, filters]);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
      
      <section>
        <h2 className="text-lg font-semibold text-gray-700 mb-4">Analytics</h2>
        <AnalyticsSummary />
      </section>

      <section className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Recent Reviews</h2>
        </div>
        <ReviewsTable />
      </section>
    </div>
  );
}
