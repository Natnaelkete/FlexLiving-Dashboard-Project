import { HostawayReview } from "./hostaway.types";

export const MOCK_REVIEWS: HostawayReview[] = [
  {
    id: 7453,
    type: "host-to-guest",
    status: "published",
    rating: null,
    publicReview:
      "Shane and family are wonderful! Would definitely host again :)",
    reviewCategory: [
      {
        category: "cleanliness",
        rating: 10,
      },
      {
        category: "communication",
        rating: 10,
      },
      {
        category: "respect_house_rules",
        rating: 10,
      },
    ],
    submittedAt: "2020-08-21 22:45:14",
    guestName: "Shane Finkelstein",
    listingName: "2B N1 A - 29 Shoreditch Heights",
  },
  {
    id: 7454,
    type: "guest-to-host",
    status: "published",
    rating: 5,
    publicReview:
      "Absolutely loved our stay! The apartment was spotless and in a perfect location. The host was very responsive.",
    reviewCategory: [
      {
        category: "cleanliness",
        rating: 5,
      },
      {
        category: "communication",
        rating: 5,
      },
      {
        category: "checkIn",
        rating: 5,
      },
      {
        category: "accuracy",
        rating: 5,
      },
      {
        category: "location",
        rating: 5,
      },
      {
        category: "value",
        rating: 4,
      },
    ],
    submittedAt: "2023-11-15 10:30:00",
    guestName: "Emily Johnson",
    listingName: "Modern Downtown Loft",
  },
  {
    id: 7455,
    type: "guest-to-host",
    status: "published",
    rating: 4,
    publicReview:
      "Great place, very cozy. A bit noisy at night due to the street, but otherwise fantastic.",
    reviewCategory: [
      {
        category: "cleanliness",
        rating: 5,
      },
      {
        category: "communication",
        rating: 4,
      },
      {
        category: "location",
        rating: 5,
      },
      {
        category: "value",
        rating: 4,
      },
    ],
    submittedAt: "2023-12-01 14:15:00",
    guestName: "Michael Brown",
    listingName: "Cozy Studio near Park",
  },
];
