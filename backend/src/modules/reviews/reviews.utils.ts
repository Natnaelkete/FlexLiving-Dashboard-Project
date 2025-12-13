import { NormalizedReview, NormalizedReviewCategory } from "@flex-living/types";
import { HostawayReview } from "./hostaway.types";

export function normalizeHostawayReview(
  review: HostawayReview
): NormalizedReview {
  const categories: NormalizedReviewCategory[] = review.reviewCategory
    ? review.reviewCategory.map((c) => ({
        category: c.category,
        rating: c.rating,
      }))
    : [];

  return {
    id: review.id.toString(),
    source: "hostaway",
    listingId: `hostaway-${review.listingName.replace(/[^a-zA-Z0-9]/g, "-").toLowerCase()}`,
    listingName: review.listingName,
    type: review.type === "guest-to-host" ? "guest-to-host" : "host-to-guest",
    status: review.status === "published" ? "published" : "pending",
    overallRating: review.rating || 0,
    categories,
    publicText: review.publicReview,
    submittedAt: new Date(review.submittedAt).toISOString(),
    guestName: review.guestName,
    channel: "hostaway", // Channel not provided in review response
    selectedForPublic: false,
  };
}
