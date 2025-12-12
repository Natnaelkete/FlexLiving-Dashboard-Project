import { Router } from 'express';
import { getHostawayReviews } from './reviews.controller';
import { validate } from '../../middleware/validate';
import { getReviewsSchema } from './reviews.schema';

const router = Router();

router.get('/hostaway', validate(getReviewsSchema), getHostawayReviews);

export { router as reviewsRouter };
