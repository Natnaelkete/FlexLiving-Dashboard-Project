"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import { fetchReviews, fetchAnalytics } from "@/store/reviewsSlice";
import { fetchListings } from "@/store/listingsSlice";
import { setFilters } from "@/store/filtersSlice";
import { ReviewsTable } from "@/components/ReviewsTable";

export default function ReviewsPage() {
  const dispatch = useDispatch<AppDispatch>();
  const filters = useSelector((state: RootState) => state.filters);
  const listings = useSelector((state: RootState) => state.listings.items);

  useEffect(() => {
    dispatch(fetchListings());
  }, [dispatch]);

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
    const [sortBy, sortOrder] = e.target.value.split("-");
    dispatch(
      setFilters({ ...filters, sortBy, sortOrder: sortOrder as "asc" | "desc" })
    );
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
            defaultValue={filters.search || ""}
          />

          <select
            className="px-4 py-2 border border-gray-300 rounded-md text-sm"
            onChange={(e) =>
              dispatch(
                setFilters({
                  ...filters,
                  listingId: e.target.value || undefined,
                })
              )
            }
            defaultValue={filters.listingId || ""}
          >
            <option value="">All Properties</option>
            {listings.map((listing) => (
              <option key={listing.id} value={listing.id}>
                {listing.name}
              </option>
            ))}
          </select>

          <select
            className="px-4 py-2 border border-gray-300 rounded-md text-sm"
            onChange={(e) =>
              dispatch(
                setFilters({ ...filters, channel: e.target.value || undefined })
              )
            }
            defaultValue={filters.channel || ""}
          >
            <option value="">All Channels</option>
            <option value="airbnb">Airbnb</option>
            <option value="booking.com">Booking.com</option>
            <option value="google">Google</option>
            <option value="hostaway">Hostaway</option>
          </select>

          <select
            className="px-4 py-2 border border-gray-300 rounded-md text-sm"
            onChange={(e) =>
              dispatch(
                setFilters({
                  ...filters,
                  minRating: e.target.value
                    ? Number(e.target.value)
                    : undefined,
                })
              )
            }
            defaultValue={filters.minRating || ""}
          >
            <option value="">All Ratings</option>
            <option value="5">5 Stars Only</option>
            <option value="4">4+ Stars</option>
            <option value="3">3+ Stars</option>
          </select>

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

      <ReviewsTable />
    </div>
  );
}
