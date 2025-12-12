import { NormalizedReview, NormalizedReviewCategory } from "@flex-living/types";
import { HostawayReview } from "./hostaway.types";

export function normalizeHostawayReview(
  review: HostawayReview
): NormalizedReview {
  const categories: NormalizedReviewCategory[] = [];

  if (review.cleanlinessRating)
    categories.push({
      category: "cleanliness",
      rating: review.cleanlinessRating,
    });
  if (review.communicationRating)
    categories.push({
      category: "communication",
      rating: review.communicationRating,
    });
  if (review.checkInRating)
    categories.push({ category: "checkIn", rating: review.checkInRating });
  if (review.accuracyRating)
    categories.push({ category: "accuracy", rating: review.accuracyRating });
  if (review.locationRating)
    categories.push({ category: "location", rating: review.locationRating });
  if (review.valueRating)
    categories.push({ category: "value", rating: review.valueRating });

  return {
    id: review.id.toString(),
    source: "hostaway",
    listingId: review.listingMapId.toString(),
    listingName: `Listing ${review.listingMapId}`, // Placeholder as we don't have listing details in review
    type: review.type === "guest_to_host" ? "guest-to-host" : "host-to-guest",
    status: review.status === "approved" ? "published" : "pending", // Simplified mapping
    overallRating: review.rating,
    categories,
    publicText: review.comment,
    submittedAt: new Date(review.reviewDate).toISOString(),
    guestName: review.guestName,
    channel: review.channelName,
    selectedForPublic: false, // Default to false, manager must approve
  };
}
