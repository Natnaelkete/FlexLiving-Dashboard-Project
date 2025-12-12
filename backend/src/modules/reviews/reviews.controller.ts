import { Request, Response } from 'express';
import { HostawayService } from './hostaway.service';
import { normalizeHostawayReview } from './reviews.utils';
import { redisClient } from '../../config/redis';
import { GetReviewsQuery } from './reviews.schema';

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
