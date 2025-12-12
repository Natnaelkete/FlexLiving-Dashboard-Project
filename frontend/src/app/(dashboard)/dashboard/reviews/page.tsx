"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import { fetchReviews, fetchAnalytics } from "@/store/reviewsSlice";
import { setFilters } from "@/store/filtersSlice";
import { ReviewsTable } from "@/components/ReviewsTable";
import { AnalyticsSummary } from "@/components/AnalyticsSummary";

export default function ReviewsPage() {
  const dispatch = useDispatch<AppDispatch>();
  const filters = useSelector((state: RootState) => state.filters);

  useEffect(() => {
    // Debounce could be added here, but for now relying on Redux thunk handling
    const timer = setTimeout(() => {
        dispatch(fetchReviews(filters));
        dispatch(fetchAnalytics(filters));
    }, 300);
    return () => clearTimeout(timer);
  }, [dispatch, filters]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setFilters({ ...filters, search: e.target.value }));
  };

  const handleSort = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const [sortBy, sortOrder] = e.target.value.split('-');
    dispatch(setFilters({ ...filters, sortBy, sortOrder: sortOrder as 'asc' | 'desc' }));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-2xl font-bold text-gray-900">Reviews Management</h1>
        <div className="flex flex-wrap gap-2">
          <input 
            type="text" 
            placeholder="Search reviews..." 
            className="px-4 py-2 border border-gray-300 rounded-md text-sm"
            onChange={handleSearch}
            defaultValue={filters.search || ''}
          />
          <select 
            className="px-4 py-2 border border-gray-300 rounded-md text-sm"
            onChange={handleSort}
            defaultValue="submittedAt-desc"
          >
            <option value="submittedAt-desc">Newest First</option>
            <option value="submittedAt-asc">Oldest First</option>
            <option value="overallRating-desc">Highest Rated</option>
            <option value="overallRating-asc">Lowest Rated</option>
          </select>
        </div>
      </div>

      <AnalyticsSummary />
      <ReviewsTable />
    </div>
  );
}
