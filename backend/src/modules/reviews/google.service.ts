import { NormalizedReview, NormalizedReviewCategory } from '@flex-living/types';

export interface GoogleReview {
  author_name: string;
  author_url: string;
  language: string;
  original_language: string;
  profile_photo_url: string;
  rating: number;
  relative_time_description: string;
  text: string;
  time: number;
  translated: boolean;
}

export interface GooglePlacesResponse {
  result: {
    reviews: GoogleReview[];
  };
  status: string;
}

const MOCK_GOOGLE_REVIEWS: GoogleReview[] = [
  {
    author_name: "David Miller",
    author_url: "https://maps.google.com/...",
    language: "en",
    original_language: "en",
    profile_photo_url: "...",
    rating: 5,
    relative_time_description: "a month ago",
    text: "Fantastic location and very clean apartment.",
    time: 1698750000, // Unix timestamp
    translated: false
  },
  {
    author_name: "Eva Green",
    author_url: "https://maps.google.com/...",
    language: "en",
    original_language: "en",
    profile_photo_url: "...",
    rating: 4,
    relative_time_description: "2 months ago",
    text: "Nice place, but check-in was a bit confusing.",
    time: 1696150000,
    translated: false
  }
];

export class GoogleService {
  private apiKey: string;

  constructor() {
    this.apiKey = process.env.GOOGLE_PLACES_API_KEY || '';
  }

  async fetchReviews(placeId: string): Promise<GooglePlacesResponse> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // In real implementation:
    // const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=reviews&key=${this.apiKey}`;
    // const response = await axios.get(url);

    return {
      result: {
        reviews: MOCK_GOOGLE_REVIEWS
      },
      status: 'OK'
    };
  }
}

export function normalizeGoogleReview(review: GoogleReview, placeId: string): NormalizedReview {
  return {
    id: `google-${review.time}-${review.author_name.replace(/\s+/g, '')}`, // Generate a deterministic ID
    source: 'google',
    listingId: placeId, // Using Place ID as listing ID for now, or map it
    listingName: 'Google Place', // We'd need to fetch place details for name
    type: 'guest-to-host',
    status: 'published', // Google reviews are published by default
    overallRating: review.rating,
    categories: [], // Google doesn't provide sub-categories in standard response
    publicText: review.text,
    submittedAt: new Date(review.time * 1000).toISOString(),
    guestName: review.author_name,
    channel: 'google',
    selectedForPublic: false
  };
}
