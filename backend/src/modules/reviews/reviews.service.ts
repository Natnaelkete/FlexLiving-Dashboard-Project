import { HostawayService } from "./hostaway.service";
import { GoogleService, normalizeGoogleReview } from "./google.service";
import { normalizeHostawayReview } from "./reviews.utils";
import { redisClient } from "../../config/redis";
import prisma from "../../lib/prisma";
import { syncReviews } from "./reviews.sync";
import { AppError } from "../../lib/appError";
import { GetReviewsQuery } from "./reviews.schema";

const CACHE_TTL = 300; // 5 minutes

export class ReviewsService {
  private hostawayService: HostawayService;
  private googleService: GoogleService;

  constructor() {
    this.hostawayService = new HostawayService();
    this.googleService = new GoogleService();
  }

  async getGoogleReviews(query: GetReviewsQuery) {
    const cacheKey = `reviews:google:${JSON.stringify(query)}`;

    if (redisClient.isOpen) {
      const cached = await redisClient.get(cacheKey);
      if (cached) return JSON.parse(cached);
    }

    const placeId = query.listingId || "mock-place-id";
    const rawResponse = await this.googleService.fetchReviews(placeId);
    const normalizedReviews = rawResponse.result.reviews.map((r) =>
      normalizeGoogleReview(r, placeId)
    );

    const response = {
      data: normalizedReviews,
      meta: {
        total: normalizedReviews.length,
        filtersApplied: query,
      },
    };

    if (redisClient.isOpen) {
      await redisClient.setEx(cacheKey, CACHE_TTL, JSON.stringify(response));
    }

    return response;
  }

  async getHostawayReviews(query: GetReviewsQuery) {
    const cacheKey = `reviews:hostaway:${JSON.stringify(query)}`;

    if (redisClient.isOpen) {
      const cached = await redisClient.get(cacheKey);
      if (cached) return JSON.parse(cached);
    }

    const rawResponse = await this.hostawayService.fetchReviews(query);
    const normalizedReviews = rawResponse.result.map(normalizeHostawayReview);

    const response = {
      data: normalizedReviews,
      meta: {
        total: normalizedReviews.length,
        filtersApplied: query,
      },
    };

    if (redisClient.isOpen) {
      await redisClient.setEx(cacheKey, CACHE_TTL, JSON.stringify(response));
    }

    return response;
  }

  async getReviews(query: GetReviewsQuery) {
    const {
      listingId,
      type,
      status,
      minRating,
      maxRating,
      startDate,
      endDate,
      channel,
      selectedForPublic,
      search,
      sortBy,
      sortOrder,
    } = query;

    const where: any = {};

    if (listingId) where.listingId = listingId;
    if (type) where.type = type;
    if (status) where.status = status;
    if (channel) {
      where.channel = {
        equals: channel as string,
        mode: "insensitive",
      };
    }
    if (selectedForPublic)
      where.selectedForPublic = selectedForPublic === "true";

    if (minRating || maxRating) {
      where.overallRating = {};
      if (minRating) where.overallRating.gte = Number(minRating);
      if (maxRating) where.overallRating.lte = Number(maxRating);
    }

    if (startDate || endDate) {
      where.submittedAt = {};
      if (startDate) where.submittedAt.gte = new Date(startDate);
      if (endDate) where.submittedAt.lte = new Date(endDate);
    }

    if (search) {
      where.OR = [
        { publicText: { contains: search, mode: "insensitive" } },
        { guestName: { contains: search, mode: "insensitive" } },
      ];
    }

    const orderBy: any = {};
    if (sortBy) {
      orderBy[sortBy] = sortOrder || "desc";
    } else {
      orderBy.submittedAt = "desc";
    }

    const reviews = await prisma.review.findMany({
      where,
      include: {
        categories: true,
        listing: true,
      },
      orderBy,
    });

    return {
      data: reviews,
      meta: {
        total: reviews.length,
        filtersApplied: query,
      },
    };
  }

  async toggleReviewSelection(id: string, selectedForPublic: boolean) {
    const review = await prisma.review.findUnique({ where: { id } });
    if (!review) {
      throw new AppError("Review not found", 404);
    }

    return await prisma.review.update({
      where: { id },
      data: { selectedForPublic },
    });
  }

  async triggerSync() {
    return await syncReviews();
  }

  async getAnalytics(query: any) {
    const { listingId, startDate, endDate } = query;
    const where: any = {};

    if (listingId) where.listingId = listingId;
    if (startDate || endDate) {
      where.submittedAt = {};
      if (startDate) where.submittedAt.gte = new Date(startDate);
      if (endDate) where.submittedAt.lte = new Date(endDate);
    }

    const [totalReviews, averageRating, ratingDistribution] = await Promise.all([
      prisma.review.count({ where }),
      prisma.review.aggregate({
        where,
        _avg: { overallRating: true },
      }),
      prisma.review.groupBy({
        by: ["overallRating"],
        where,
        _count: { overallRating: true },
      }),
    ]);

    const distribution = ratingDistribution.reduce((acc, curr) => {
      if (curr.overallRating) {
        acc[curr.overallRating] = curr._count.overallRating;
      }
      return acc;
    }, {} as Record<number, number>);

    return {
      totalReviews,
      averageRating: averageRating._avg.overallRating || 0,
      ratingDistribution: distribution,
    };
  }

  async getListings() {
    return await prisma.listing.findMany({
      select: { id: true, name: true },
    });
  }
}
