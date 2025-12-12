import { NormalizedReview } from "@flex-living/types";

async function getPublicReviews(
  listingId: string
): Promise<NormalizedReview[]> {
  // Use internal URL for server-side fetches if available, otherwise fallback to public URL
  const apiUrl = process.env.INTERNAL_API_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";
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
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const reviews = await getPublicReviews(id);

  // Calculate average rating
  const averageRating =
    reviews.length > 0
      ? (
          reviews.reduce((acc, review) => acc + review.overallRating, 0) /
          reviews.length
        ).toFixed(1)
      : "New";

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Hero Section */}
      <div className="relative h-[50vh] min-h-[400px] w-full overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=2080&auto=format&fit=crop"
          alt="Property Hero"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-8 sm:p-12 max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <span className="inline-block px-3 py-1 mb-4 text-xs font-semibold tracking-wider text-white uppercase bg-indigo-600 rounded-full">
                Premium Stay
              </span>
              <h1 className="text-4xl sm:text-5xl font-bold text-white mb-2 shadow-sm">
                Luxury Apartment in City Center
              </h1>
              <p className="text-lg text-gray-200 max-w-2xl">
                Experience the best of city living in this beautifully furnished
                apartment.
              </p>
            </div>
            <div className="flex items-center bg-white/10 backdrop-blur-md px-4 py-2 rounded-lg border border-white/20">
              <span className="text-yellow-400 text-xl mr-2">★</span>
              <span className="text-xl font-bold text-white">{averageRating}</span>
              <span className="text-gray-300 ml-2 text-sm">
                ({reviews.length} reviews)
              </span>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Left Column: Details & Reviews */}
          <div className="lg:col-span-2 space-y-12">
            {/* About Section */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">About this space</h2>
              <p className="text-gray-600 leading-relaxed text-lg">
                Enjoy a stylish experience at this centrally-located place. 
                Close to all amenities and transport links. Perfect for business 
                travelers and couples looking for a convenient base.
              </p>
              
              {/* Mock Amenities */}
              <div className="mt-6 grid grid-cols-2 gap-4">
                {["Wifi", "Kitchen", "Workplace", "Air conditioning"].map((item) => (
                  <div key={item} className="flex items-center text-gray-600">
                    <svg className="w-5 h-5 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                    {item}
                  </div>
                ))}
              </div>
            </section>

            <hr className="border-gray-200" />

            {/* Reviews Section */}
            <section>
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-2xl font-bold text-gray-900">
                  Guest Reviews
                </h3>
              </div>

              {reviews.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-xl border border-gray-100">
                  <p className="text-gray-500 text-lg">No reviews yet.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-6">
                  {reviews.map((review) => (
                    <div
                      key={review.id}
                      className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center">
                          <div className="h-12 w-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg shadow-md">
                            {review.guestName ? review.guestName.charAt(0) : "G"}
                          </div>
                          <div className="ml-4">
                            <p className="text-base font-semibold text-gray-900">
                              {review.guestName || "Guest"}
                            </p>
                            <p className="text-sm text-gray-500">
                              {new Date(review.submittedAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center bg-gray-50 px-3 py-1 rounded-full border border-gray-200">
                          <span className="text-yellow-500 mr-1.5 text-sm">★</span>
                          <span className="text-sm font-bold text-gray-900">
                            {review.overallRating}
                          </span>
                        </div>
                      </div>
                      <p className="text-gray-700 leading-relaxed">
                        {review.publicText}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>

          {/* Right Column: Sticky Booking Card (Mock) */}
          <div className="hidden lg:block">
            <div className="sticky top-8 bg-white p-6 rounded-2xl border border-gray-200 shadow-lg">
              <div className="flex justify-between items-end mb-6">
                <div>
                  <span className="text-2xl font-bold text-gray-900">$120</span>
                  <span className="text-gray-500"> / night</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <span className="text-yellow-500 mr-1">★</span>
                  <span className="font-semibold text-gray-900 mr-1">{averageRating}</span>
                  <span className="underline">({reviews.length} reviews)</span>
                </div>
              </div>
              
              <button className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors mb-4">
                Check Availability
              </button>
              
              <p className="text-center text-xs text-gray-500">
                You won't be charged yet
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Mobile Fixed Booking Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 lg:hidden z-40">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <span className="text-lg font-bold text-gray-900">$120</span>
            <span className="text-gray-500 text-sm"> / night</span>
            <div className="flex items-center text-xs text-gray-600 mt-1">
              <span className="text-yellow-500 mr-1">★</span>
              <span className="font-semibold text-gray-900 mr-1">{averageRating}</span>
            </div>
          </div>
          <button className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors">
            Check Availability
          </button>
        </div>
      </div>
    </div>
  );
}
