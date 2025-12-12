import request from "supertest";
import { app } from "../../../app";
import { normalizeHostawayReview } from "../reviews.utils";
import { normalizeGoogleReview, GoogleReview } from "../google.service";
import { HostawayReview } from "../hostaway.types";
import { getReviewsSchema } from "../reviews.schema";

// Mock Redis
jest.mock("../../../config/redis", () => ({
  redisClient: {
    isOpen: false,
    get: jest.fn(),
    setEx: jest.fn(),
    connect: jest.fn(),
    on: jest.fn(),
  },
  connectRedis: jest.fn(),
}));

describe("Reviews Module", () => {
  describe("Normalization", () => {
    it("should normalize a Hostaway review correctly", () => {
      const mockReview: HostawayReview = {
        id: 123,
        listingMapId: 456,
        guestName: "John Doe",
        comment: "Great place",
        rating: 5,
        reviewDate: "2023-01-01 12:00:00",
        channelName: "airbnb",
        cleanlinessRating: 5,
        isPublic: 1,
        status: "approved",
        type: "guest_to_host",
      };

      const normalized = normalizeHostawayReview(mockReview);

      expect(normalized.id).toBe("123");
      expect(normalized.source).toBe("hostaway");
      expect(normalized.overallRating).toBe(5);
      expect(normalized.categories).toHaveLength(1);
      expect(normalized.categories[0].category).toBe("cleanliness");
      expect(normalized.submittedAt).toBe(
        new Date("2023-01-01 12:00:00").toISOString()
      );
    });

    it("should normalize a Google review correctly", () => {
      const mockGoogleReview: GoogleReview = {
        author_name: "Jane Doe",
        author_url: "http://google.com",
        language: "en",
        original_language: "en",
        profile_photo_url: "http://photo.url",
        rating: 4,
        relative_time_description: "a week ago",
        text: "Good stay",
        time: 1672574400, // 2023-01-01 12:00:00 UTC
        translated: false
      };

      const normalized = normalizeGoogleReview(mockGoogleReview, "place-123");

      expect(normalized.source).toBe("google");
      expect(normalized.listingId).toBe("place-123");
      expect(normalized.overallRating).toBe(4);
      expect(normalized.publicText).toBe("Good stay");
      expect(normalized.submittedAt).toBe(new Date(1672574400 * 1000).toISOString());
    });
  });

  describe("API Endpoints", () => {
    it("GET /api/reviews/google should return mocked reviews", async () => {
      const res = await request(app).get("/api/reviews/google");
      expect(res.status).toBe(200);
      expect(res.body.data).toBeDefined();
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data[0].source).toBe("google");
    });
  });

  describe("Validation", () => {
    it("should validate correct query params", () => {
      const query = {
        listingId: "123",
        minRating: 4,
        type: "guest-to-host",
      };
      const result = getReviewsSchema.safeParse({ query });
      expect(result.success).toBe(true);
    });

    it("should fail on invalid rating", () => {
      const query = {
        minRating: 6,
      };
      const result = getReviewsSchema.safeParse({ query });
      expect(result.success).toBe(false);
    });
  });

  describe("Endpoint GET /api/reviews/hostaway", () => {
    it("should return normalized reviews", async () => {
      const res = await request(app).get("/api/reviews/hostaway");
      expect(res.status).toBe(200);
      expect(res.body.data).toBeDefined();
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.meta).toBeDefined();
    });

    it("should filter by listingId", async () => {
      const res = await request(app).get(
        "/api/reviews/hostaway?listingId=5001"
      );
      expect(res.status).toBe(200);
      expect(res.body.data.length).toBeGreaterThan(0);
      // Check if all returned reviews have listingId 5001
      res.body.data.forEach((r: any) => {
        expect(r.listingId).toBe("5001");
      });
    });

    it("should return 400 for invalid query params", async () => {
      const res = await request(app).get("/api/reviews/hostaway?minRating=10");
      expect(res.status).toBe(400);
    });
  });
});
