import { Router } from 'express';
import { reviewsRouter } from '../modules/reviews/reviews.routes';

const router = Router();

router.use('/reviews', reviewsRouter);

export { router };
