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
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>

      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-6">Analytics</h2>
        <AnalyticsSummary />
      </section>

      <SelectedReviews />

      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Reviews</h2>
        <ReviewsTable />
      </section>
    </div>
  );
}
