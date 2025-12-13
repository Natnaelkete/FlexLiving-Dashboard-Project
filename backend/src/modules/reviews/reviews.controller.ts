import { Request, Response, NextFunction } from "express";
import { ReviewsService } from "./reviews.service";
import {
  GetReviewsQuery,
  GetAnalyticsQuery,
  ToggleSelectionBody,
} from "./reviews.schema";

const reviewsService = new ReviewsService();

export const getGoogleReviews = async (
  req: Request<{}, {}, {}, GetReviewsQuery>,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await reviewsService.getGoogleReviews(req.query);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const getHostawayReviews = async (
  req: Request<{}, {}, {}, GetReviewsQuery>,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await reviewsService.getHostawayReviews(req.query);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const getReviews = async (
  req: Request<{}, {}, {}, GetReviewsQuery>,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await reviewsService.getReviews(req.query);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const toggleReviewSelection = async (
  req: Request<{ id: string }, {}, ToggleSelectionBody>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const { selectedForPublic, ...reviewData } = req.body;
    const result = await reviewsService.toggleReviewSelection(
      id,
      selectedForPublic,
      reviewData
    );
    res.json({ data: result });
  } catch (error) {
    next(error);
  }
};

export const triggerSync = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await reviewsService.triggerSync();
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const getAnalytics = async (
  req: Request<{}, {}, {}, GetAnalyticsQuery>,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await reviewsService.getAnalytics(req.query);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const getListings = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await reviewsService.getListings();
    res.json(result);
  } catch (error) {
    next(error);
  }
};
