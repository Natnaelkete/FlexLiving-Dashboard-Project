export interface HostawayReview {
  id: number;
  listingMapId: number;
  guestName: string;
  comment: string;
  rating: number;
  reviewDate: string; // YYYY-MM-DD HH:mm:ss
  channelName: string;
  cleanlinessRating?: number;
  communicationRating?: number;
  checkInRating?: number;
  accuracyRating?: number;
  locationRating?: number;
  valueRating?: number;
  isPublic: number; // 0 or 1
  status: string; // 'new', 'approved', etc.
  type: "guest_to_host" | "host_to_guest";
}

export interface HostawayResponse {
  status: string;
  result: HostawayReview[];
  total: number;
}
