import { Request, Response } from 'express';
import { HostawayService } from './hostaway.service';
import { normalizeHostawayReview } from './reviews.utils';
import { redisClient } from '../../config/redis';
import { GetReviewsQuery, ToggleSelectionBody } from './reviews.schema';
import prisma from '../../lib/prisma';
import { syncReviews } from './reviews.sync';

const hostawayService = new HostawayService();
const CACHE_TTL = 300; // 5 minutes

export const getHostawayReviews = async (req: Request<{}, {}, {}, GetReviewsQuery>, res: Response) => {
  try {
    const cacheKey = `reviews:hostaway:${JSON.stringify(req.query)}`;
    
    // Try cache
    if (redisClient.isOpen) {
        const cached = await redisClient.get(cacheKey);
        if (cached) {
            return res.json(JSON.parse(cached));
        }
    }

    const rawResponse = await hostawayService.fetchReviews(req.query);
    const normalizedReviews = rawResponse.result.map(normalizeHostawayReview);

    const response = {
      data: normalizedReviews,
      meta: {
        total: normalizedReviews.length,
        filtersApplied: req.query
      }
    };

    // Set cache
    if (redisClient.isOpen) {
        await redisClient.setEx(cacheKey, CACHE_TTL, JSON.stringify(response));
    }

    res.json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const getReviews = async (req: Request<{}, {}, {}, GetReviewsQuery>, res: Response) => {
  try {
    const { listingId, type, status, minRating, maxRating, startDate, endDate, channel, selectedForPublic } = req.query;

    const where: any = {};

    if (listingId) where.listingId = listingId;
    if (type) where.type = type;
    if (status) where.status = status;
    if (channel) where.channel = channel;
    if (selectedForPublic) where.selectedForPublic = selectedForPublic === 'true';
    
    if (minRating || maxRating) {
      where.overallRating = {};
      if (minRating) where.overallRating.gte = minRating;
      if (maxRating) where.overallRating.lte = maxRating;
    }

    if (startDate || endDate) {
      where.submittedAt = {};
      if (startDate) where.submittedAt.gte = new Date(startDate);
      if (endDate) where.submittedAt.lte = new Date(endDate);
    }

    const reviews = await prisma.review.findMany({
      where,
      include: {
        categories: true,
        listing: true
      },
      orderBy: {
        submittedAt: 'desc'
      }
    });

    res.json({
      data: reviews,
      meta: {
        total: reviews.length,
        filtersApplied: req.query
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const toggleReviewSelection = async (req: Request<{ id: string }, {}, ToggleSelectionBody>, res: Response) => {
  try {
    const { id } = req.params;
    const { selectedForPublic } = req.body;

    const review = await prisma.review.update({
      where: { id },
      data: { selectedForPublic }
    });

    res.json({ data: review });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const triggerSync = async (req: Request, res: Response) => {
  try {
    const result = await syncReviews();
    res.json({ message: 'Sync completed', result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Sync failed' });
  }
};
