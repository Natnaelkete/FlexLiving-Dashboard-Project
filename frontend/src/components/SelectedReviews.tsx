"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import { fetchPublicReviews } from "@/store/reviewsSlice";
import { Star, Quote } from "lucide-react";

export function SelectedReviews() {
  const dispatch = useDispatch<AppDispatch>();
  const { publicReviews } = useSelector((state: RootState) => state.reviews);

  useEffect(() => {
    dispatch(fetchPublicReviews());
  }, [dispatch]);

  if (!publicReviews || publicReviews.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">
          Selected for Public Display
        </h2>
        <span className="text-sm text-gray-500">
          {publicReviews.length} reviews visible
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {publicReviews.map((review) => (
          <div
            key={review.id}
            className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow relative overflow-hidden"
          >
            <Quote className="absolute top-4 right-4 w-8 h-8 text-gray-100" />

            <div className="flex items-center gap-1 mb-4">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i < (review.overallRating || 0)
                      ? "text-yellow-400 fill-yellow-400"
                      : "text-gray-200"
                  }`}
                />
              ))}
            </div>

            <p className="text-gray-600 text-sm mb-6 line-clamp-3 relative z-10 leading-relaxed">
              "{review.publicText}"
            </p>

            <div className="flex items-center gap-3 mt-auto pt-4 border-t border-gray-50">
              <div className="w-10 h-10 rounded-full bg-gray-900 flex items-center justify-center text-white font-medium text-sm">
                {review.guestName?.charAt(0) || "G"}
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">
                  {review.guestName || "Guest"}
                </p>
                <p className="text-xs text-gray-500">
                  {new Date(review.submittedAt).toLocaleDateString(undefined, {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
