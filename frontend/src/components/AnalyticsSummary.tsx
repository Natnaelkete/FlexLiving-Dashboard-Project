import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';

export const AnalyticsSummary = () => {
  const { analytics, analyticsStatus } = useSelector((state: RootState) => state.reviews);

  if (analyticsStatus === 'loading') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 animate-pulse">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-gray-200 h-24 rounded-lg"></div>
        ))}
      </div>
    );
  }

  if (!analytics) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <div className="bg-white p-4 rounded-lg shadow border border-gray-100">
        <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Total Reviews</h3>
        <p className="text-3xl font-bold text-gray-900 mt-1">{analytics.totalReviews}</p>
      </div>
      <div className="bg-white p-4 rounded-lg shadow border border-gray-100">
        <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Average Rating</h3>
        <div className="flex items-baseline mt-1">
            <p className="text-3xl font-bold text-gray-900">{analytics.averageRating.toFixed(1)}</p>
            <span className="ml-1 text-sm text-gray-500">/ 5.0</span>
        </div>
      </div>
      <div className="bg-white p-4 rounded-lg shadow border border-gray-100">
        <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Distribution</h3>
        <div className="flex items-end space-x-2 mt-2 h-10">
            {[1, 2, 3, 4, 5].map(star => {
                const count = analytics.ratingDistribution[star] || 0;
                const max = Math.max(...Object.values(analytics.ratingDistribution), 1);
                const height = Math.max((count / max) * 100, 10); // Min height 10%
                
                return (
                    <div key={star} className="flex flex-col items-center flex-1 group relative">
                        <div 
                            className={`w-full rounded-t ${star >= 4 ? 'bg-green-500' : star === 3 ? 'bg-yellow-400' : 'bg-red-400'}`} 
                            style={{ height: `${height}%` }}
                        ></div>
                        <span className="text-xs text-gray-600 mt-1">{star}★</span>
                        <div className="absolute bottom-full mb-1 hidden group-hover:block bg-black text-white text-xs p-1 rounded">
                            {count}
                        </div>
                    </div>
                );
            })}
        </div>
      </div>
    </div>
  );
};
