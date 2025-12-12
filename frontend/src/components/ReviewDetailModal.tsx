"use client";

import { NormalizedReview } from "@/types";

interface ReviewDetailModalProps {
  review: NormalizedReview | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ReviewDetailModal({
  review,
  isOpen,
  onClose,
}: ReviewDetailModalProps) {
  if (!isOpen || !review) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
        aria-hidden="true"
        onClick={onClose}
      ></div>

      {/* Modal Content */}
      <div className="relative bg-white rounded-lg shadow-xl max-w-lg w-full z-10 overflow-hidden">
        <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
          <div className="sm:flex sm:items-start">
            <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
              <h3
                className="text-lg leading-6 font-medium text-gray-900"
                id="modal-title"
              >
                Review Details
              </h3>
              <div className="mt-4 space-y-3">
                <div>
                  <p className="text-sm font-medium text-gray-500">Guest</p>
                  <p className="text-sm text-gray-900">
                    {review.guestName || "Anonymous"}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Listing</p>
                  <p className="text-sm text-gray-900">{review.listingName}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Rating</p>
                  <p className="text-sm text-gray-900">
                    {review.overallRating}/5
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Date</p>
                  <p className="text-sm text-gray-900">
                    {new Date(review.submittedAt).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Source</p>
                  <p className="text-sm text-gray-900 capitalize">
                    {review.source}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Review</p>
                  <p className="text-sm text-gray-900 mt-1 whitespace-pre-wrap">
                    {review.publicText}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
          <button
            type="button"
            className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
