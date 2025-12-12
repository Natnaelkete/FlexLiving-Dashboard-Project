import request from "supertest";
import { app } from "../../../app";
import { normalizeHostawayReview } from "../reviews.utils";
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
