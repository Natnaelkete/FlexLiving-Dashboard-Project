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
    let response;

    if (redisClient.isOpen) {
      const cached = await redisClient.get(cacheKey);
      if (cached) {
        response = JSON.parse(cached);
      }
    }

    if (!response) {
      const rawResponse = await this.hostawayService.fetchReviews(query);
      const normalizedReviews = rawResponse.result.map(normalizeHostawayReview);

      response = {
        data: normalizedReviews,
        meta: {
          total: normalizedReviews.length,
          filtersApplied: query,
        },
      };

      if (redisClient.isOpen) {
        await redisClient.setEx(cacheKey, CACHE_TTL, JSON.stringify(response));
      }
    }

    // Merge with local DB status
    const reviewIds = response.data.map((r: any) => r.id);
    const localReviews = await prisma.review.findMany({
      where: { id: { in: reviewIds } },
      select: { id: true, selectedForPublic: true },
    });

    const localStatusMap = new Map(
      localReviews.map((r) => [r.id, r.selectedForPublic])
    );

    response.data = response.data.map((r: any) => ({
      ...r,
      selectedForPublic: localStatusMap.get(r.id) || false,
    }));

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

  async toggleReviewSelection(
    id: string,
    selectedForPublic: boolean,
    reviewData?: any
  ) {
    const review = await prisma.review.findUnique({ where: { id } });

    if (!review) {
      if (reviewData && reviewData.listingId) {
        // Ensure listing exists
        await prisma.listing.upsert({
          where: { id: String(reviewData.listingId) },
          update: reviewData.listingName
            ? { name: reviewData.listingName }
            : {},
          create: {
            id: String(reviewData.listingId),
            name: reviewData.listingName || "Unknown Listing",
            channel: reviewData.channel,
          },
        });

        // Create review
        const newReview = await prisma.review.create({
          data: {
            id,
            selectedForPublic,
            source: reviewData.source || "Hostaway",
            listingId: String(reviewData.listingId),
            type: reviewData.type || "guest-to-host",
            status: reviewData.status || "published",
            overallRating: reviewData.overallRating,
            publicText: reviewData.publicText,
            submittedAt: new Date(reviewData.submittedAt || Date.now()),
            guestName: reviewData.guestName,
            channel: reviewData.channel,
          },
          include: { listing: true },
        });

        return {
          ...newReview,
          listingName: newReview.listing?.name,
        };
      }
      throw new AppError(
        "Review not found and no data provided for creation",
        404
      );
    }

    const updatedReview = await prisma.review.update({
      where: { id },
      data: { selectedForPublic },
      include: { listing: true },
    });

    return {
      ...updatedReview,
      listingName: updatedReview.listing?.name,
    };
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

    const [totalReviews, averageRating, ratingDistribution] = await Promise.all(
      [
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
      ]
    );

    const distribution = ratingDistribution.reduce(
      (acc, curr) => {
        if (curr.overallRating) {
          acc[curr.overallRating] = curr._count.overallRating;
        }
        return acc;
      },
      {} as Record<number, number>
    );

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
