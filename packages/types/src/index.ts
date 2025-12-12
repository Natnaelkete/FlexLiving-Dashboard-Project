// Shared types will go here
export interface NormalizedReview {
  id: string;
  source: 'hostaway' | 'google';
  listingId: string;
  listingName: string;
  type: 'host-to-guest' | 'guest-to-host';
  status: 'published' | 'pending' | 'rejected';
  overallRating: number | null;
  categories: NormalizedReviewCategory[];
  publicText: string;
  submittedAt: string; // ISO 8601
  guestName?: string;
  channel?: string;
  selectedForPublic: boolean;
}

export interface NormalizedReviewCategory {
  category: string;
  rating: number | null;
}
