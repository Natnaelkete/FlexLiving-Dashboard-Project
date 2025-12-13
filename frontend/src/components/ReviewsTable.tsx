"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import { toggleReviewSelection } from "@/store/reviewsSlice";
import { NormalizedReview } from "@/types";
import { ReviewDetailModal } from "./ReviewDetailModal";

export function ReviewsTable() {
  const dispatch = useDispatch<AppDispatch>();
  const { items, status, error } = useSelector(
    (state: RootState) => state.reviews
  );
  const filters = useSelector((state: RootState) => state.filters);
  const [selectedReview, setSelectedReview] = useState<NormalizedReview | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toggleError, setToggleError] = useState<string | null>(null);

  const handleToggleSelection = async (
    id: string,
    currentStatus: boolean,
    review: NormalizedReview
  ) => {
    setToggleError(null);
    try {
      await dispatch(
        toggleReviewSelection({ id, selectedForPublic: !currentStatus, review })
      ).unwrap();
    } catch (err: any) {
      setToggleError(err.message || "Failed to toggle review selection");
    }
  };

  const handleViewDetails = (review: NormalizedReview) => {
    setSelectedReview(review);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedReview(null);
  };

  if (status === "loading") {
    return (
      <div className="w-full h-64 flex items-center justify-center bg-white rounded-lg shadow border border-gray-200">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-500 text-sm font-medium">
            Loading reviews...
          </p>
        </div>
      </div>
    );
  }
  if (status === "failed") return <div>Error: {error}</div>;

  return (
    <>
      {toggleError && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800 text-sm font-medium">{toggleError}</p>
        </div>
      )}
      <div className="overflow-hidden bg-white rounded-lg shadow border border-gray-200">
        <div className="overflow-x-auto scrollbar-hide">
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
                <tr
                  key={review.id}
                  className="hover:bg-gray-50 transition-colors"
                >
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
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        (review.overallRating || 0) >= 4
                          ? "bg-green-100 text-green-800"
                          : (review.overallRating || 0) >= 3
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                      }`}
                    >
                      {review.overallRating || 0}/5
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">
                    {review.source}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <button
                      onClick={() =>
                        handleToggleSelection(
                          review.id,
                          review.selectedForPublic,
                          review
                        )
                      }
                      className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 cursor-pointer ${
                        review.selectedForPublic ? "bg-gray-900" : "bg-gray-200"
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
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleViewDetails(review)}
                      className="text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 px-3 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <ReviewDetailModal
        review={selectedReview}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </>
  );
}
