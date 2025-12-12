import { Router } from "express";
import {
  getHostawayReviews,
  getGoogleReviews,
  getReviews,
  toggleReviewSelection,
  triggerSync,
  getAnalytics,
  getListings,
} from "./reviews.controller";
import { validate } from "../../middleware/validate";
import {
  getReviewsSchema,
  toggleSelectionSchema,
  getAnalyticsSchema,
} from "./reviews.schema";

const router = Router();

router.get("/hostaway", validate(getReviewsSchema), getHostawayReviews);
router.get("/google", validate(getReviewsSchema), getGoogleReviews);
router.get("/analytics", validate(getAnalyticsSchema), getAnalytics);
router.get("/listings", getListings);
router.get("/", validate(getReviewsSchema), getReviews);
router.patch(
  "/:id/selection",
  validate(toggleSelectionSchema),
  toggleReviewSelection
);
router.post("/sync", triggerSync);

export { router as reviewsRouter };
