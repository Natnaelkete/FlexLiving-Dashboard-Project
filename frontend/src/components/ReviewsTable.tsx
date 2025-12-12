"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import { fetchReviews, toggleReviewSelection } from "@/store/reviewsSlice";
import { NormalizedReview } from "@flex-living/types";

export function ReviewsTable() {
  const dispatch = useDispatch<AppDispatch>();
  const { items, status, error } = useSelector(
    (state: RootState) => state.reviews
  );
  const filters = useSelector((state: RootState) => state.filters);

  useEffect(() => {
    dispatch(fetchReviews(filters));
  }, [dispatch, filters]);

  const handleToggleSelection = (id: string, currentStatus: boolean) => {
    dispatch(toggleReviewSelection({ id, selectedForPublic: !currentStatus }));
  };

  if (status === "loading") return <div>Loading reviews...</div>;
  if (status === "failed") return <div>Error: {error}</div>;

  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Date
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Guest
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Listing
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Rating
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Source
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Public
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {items.map((review: NormalizedReview) => (
            <tr key={review.id}>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {new Date(review.submittedAt).toLocaleDateString()}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {review.guestName || "Anonymous"}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {review.listingName}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                  {review.overallRating}/5
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">
                {review.source}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <button
                  onClick={() =>
                    handleToggleSelection(review.id, review.selectedForPublic)
                  }
                  className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                    review.selectedForPublic ? "bg-indigo-600" : "bg-gray-200"
                  }`}
                >
                  <span
                    className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${
                      review.selectedForPublic
                        ? "translate-x-6"
                        : "translate-x-1"
                    }`}
                  />
                </button>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600 hover:text-blue-900 cursor-pointer">
                View Details
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
