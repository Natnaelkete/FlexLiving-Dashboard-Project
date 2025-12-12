import { NormalizedReview } from "@flex-living/types";

async function getPublicReviews(
  listingId: string
): Promise<NormalizedReview[]> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";
  const res = await fetch(
    `${apiUrl}/reviews?listingId=${listingId}&selectedForPublic=true`,
    {
      cache: "no-store", // Ensure fresh data
    }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch reviews");
  }

  const json = await res.json();
  return json.data;
}

export default async function PropertyPage({
  params,
}: {
  params: { id: string };
}) {
  const reviews = await getPublicReviews(params.id);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section (Mock) */}
      <div className="h-96 bg-gray-300 flex items-center justify-center">
        <h1 className="text-4xl font-bold text-gray-700">
          Property {params.id} Hero Image
        </h1>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Property Details (Mock) */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Luxury Apartment in City Center
          </h2>
          <p className="text-gray-600">
            Experience the best of city living in this beautifully furnished
            apartment. Close to all amenities and transport links.
          </p>
        </div>

        {/* Reviews Section */}
        <section>
          <h3 className="text-2xl font-bold text-gray-900 mb-8">
            Guest Reviews
          </h3>

          {reviews.length === 0 ? (
            <p className="text-gray-500">No reviews yet.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {reviews.map((review) => (
                <div
                  key={review.id}
                  className="bg-gray-50 p-6 rounded-lg shadow-sm"
                >
                  <div className="flex items-center mb-4">
                    <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">
                      {review.guestName ? review.guestName.charAt(0) : "G"}
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">
                        {review.guestName || "Guest"}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(review.submittedAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="ml-auto flex items-center bg-white px-2 py-1 rounded border border-gray-200">
                      <span className="text-yellow-400 mr-1">★</span>
                      <span className="text-sm font-bold text-gray-900">
                        {review.overallRating}
                      </span>
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm line-clamp-4">
                    {review.publicText}
                  </p>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
