import { HostawayResponse, HostawayReview } from './hostaway.types';

const MOCK_REVIEWS: HostawayReview[] = [
  {
    id: 101,
    listingMapId: 5001,
    guestName: "Alice Smith",
    comment: "Great stay! The place was clean and tidy.",
    rating: 5,
    reviewDate: "2023-10-15 14:30:00",
    channelName: "airbnb",
    cleanlinessRating: 5,
    communicationRating: 5,
    checkInRating: 4,
    accuracyRating: 5,
    locationRating: 5,
    valueRating: 4,
    isPublic: 1,
    status: "approved",
    type: "guest_to_host"
  },
  {
    id: 102,
    listingMapId: 5001,
    guestName: "Bob Jones",
    comment: "Good location but a bit noisy.",
    rating: 4,
    reviewDate: "2023-10-20 09:15:00",
    channelName: "booking.com",
    cleanlinessRating: 4,
    communicationRating: 4,
    checkInRating: 5,
    accuracyRating: 4,
    locationRating: 5,
    valueRating: 3,
    isPublic: 1,
    status: "approved",
    type: "guest_to_host"
  },
  {
    id: 103,
    listingMapId: 5002,
    guestName: "Charlie Brown",
    comment: "Host cancelled last minute.",
    rating: 1,
    reviewDate: "2023-11-01 10:00:00",
    channelName: "vrbo",
    cleanlinessRating: 1,
    communicationRating: 1,
    checkInRating: 1,
    accuracyRating: 1,
    locationRating: 1,
    valueRating: 1,
    isPublic: 1,
    status: "approved",
    type: "guest_to_host"
  }
];

export class HostawayService {
  private accountId: string;
  private apiKey: string;

  constructor() {
    this.accountId = process.env.HOSTAWAY_ACCOUNT_ID || '';
    this.apiKey = process.env.HOSTAWAY_API_KEY || '';
  }

  async fetchReviews(params: any): Promise<HostawayResponse> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // In a real implementation, we would use axios to fetch from Hostaway API
    // const response = await axios.get('https://api.hostaway.com/v1/reviews', { ... });

    // For now, return mock data
    // We can implement basic filtering here to simulate the API
    let filtered = [...MOCK_REVIEWS];

    if (params.listingId) {
      filtered = filtered.filter(r => r.listingMapId === Number(params.listingId));
    }
    
    // ... other filters

    return {
      status: 'success',
      result: filtered,
      total: filtered.length
    };
  }
}
