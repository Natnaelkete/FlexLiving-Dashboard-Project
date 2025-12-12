import request from 'supertest';
import { app } from '../../../app';
import prisma from '../../../lib/prisma';
import { redisClient } from '../../../config/redis';

// Mock Redis
jest.mock('../../../config/redis', () => ({
  redisClient: {
    isOpen: false,
    get: jest.fn(),
    setEx: jest.fn(),
    connect: jest.fn(),
    on: jest.fn(),
  },
  connectRedis: jest.fn(),
}));

// Mock Prisma
jest.mock('../../../lib/prisma', () => ({
  review: {
    findMany: jest.fn(),
    update: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
    count: jest.fn(),
    aggregate: jest.fn(),
    groupBy: jest.fn(),
  },
  listing: {
    upsert: jest.fn(),
  },
  $disconnect: jest.fn(),
}));

describe('Reviews Persistence & Selection', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/reviews', () => {
    it('should return reviews from database', async () => {
      (prisma.review.findMany as jest.Mock).mockResolvedValue([
        { id: '1', overallRating: 5, listingId: '100' }
      ]);

      const res = await request(app).get('/api/reviews');
      
      expect(res.status).toBe(200);
      expect(res.body.data).toHaveLength(1);
      expect(prisma.review.findMany).toHaveBeenCalled();
    });

    it('should filter by selectedForPublic', async () => {
      (prisma.review.findMany as jest.Mock).mockResolvedValue([]);

      await request(app).get('/api/reviews?selectedForPublic=true');
      
      expect(prisma.review.findMany).toHaveBeenCalledWith(expect.objectContaining({
        where: expect.objectContaining({
          selectedForPublic: true
        })
      }));
    });
  });

  describe('PATCH /api/reviews/:id/selection', () => {
    it('should update selection status', async () => {
      (prisma.review.update as jest.Mock).mockResolvedValue({
        id: '1',
        selectedForPublic: true
      });

      const res = await request(app)
        .patch('/api/reviews/1/selection')
        .send({ selectedForPublic: true });

      expect(res.status).toBe(200);
      expect(res.body.data.selectedForPublic).toBe(true);
      expect(prisma.review.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: { selectedForPublic: true }
      });
    });

    it('should validate body', async () => {
      const res = await request(app)
        .patch('/api/reviews/1/selection')
        .send({ selectedForPublic: 'invalid' }); // Invalid type

      expect(res.status).toBe(400);
    });
  });

  describe('GET /api/reviews/analytics', () => {
    it('should return analytics data', async () => {
      (prisma.review.count as jest.Mock).mockResolvedValue(10);
      (prisma.review.aggregate as jest.Mock).mockResolvedValue({ _avg: { overallRating: 4.5 } });
      (prisma.review.groupBy as jest.Mock).mockResolvedValue([
        { overallRating: 5, _count: { overallRating: 6 } },
        { overallRating: 4, _count: { overallRating: 4 } }
      ]);

      const res = await request(app).get('/api/reviews/analytics');

      expect(res.status).toBe(200);
      expect(res.body.totalReviews).toBe(10);
      expect(res.body.averageRating).toBe(4.5);
      expect(res.body.ratingDistribution).toEqual({ '4': 4, '5': 6 });
    });
  });
});
