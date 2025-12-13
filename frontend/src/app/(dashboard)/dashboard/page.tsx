"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import { fetchHostawayReviews, fetchAnalytics } from "@/store/reviewsSlice";
import { AnalyticsSummary } from "@/components/AnalyticsSummary";
import { ReviewsTable } from "@/components/ReviewsTable";
import { SelectedReviews } from "@/components/SelectedReviews";

export default function DashboardPage() {
  const dispatch = useDispatch<AppDispatch>();
  const filters = useSelector((state: RootState) => state.filters);

  useEffect(() => {
    dispatch(fetchHostawayReviews(filters));
    dispatch(fetchAnalytics(filters));
  }, [dispatch, filters]);

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
        Dashboard Overview
      </h1>

      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-6">Analytics</h2>
        <AnalyticsSummary />
      </section>

      <SelectedReviews />

      <section className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-900">Recent Reviews</h2>
        </div>
        <ReviewsTable />
      </section>
    </div>
  );
}
