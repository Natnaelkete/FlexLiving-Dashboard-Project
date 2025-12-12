import { PrismaClient } from '@prisma/client';
import { HostawayService } from './hostaway.service';
import { normalizeHostawayReview } from './reviews.utils';

const prisma = new PrismaClient();
const hostawayService = new HostawayService();

export const syncReviews = async () => {
  console.log('Starting reviews sync...');
  
  try {
    // 1. Fetch all reviews from Hostaway (mocked)
    // In a real scenario, we might need pagination or date filtering to fetch incremental updates
    const rawResponse = await hostawayService.fetchReviews({});
    const normalizedReviews = rawResponse.result.map(normalizeHostawayReview);

    console.log(`Fetched ${normalizedReviews.length} reviews from Hostaway.`);

    let createdCount = 0;
    let updatedCount = 0;

    // 2. Upsert into Database
    for (const review of normalizedReviews) {
      // We need to ensure the Listing exists first. 
      // In a real app, we'd sync listings separately. 
      // Here, we'll upsert the listing based on the review data.
      
      await prisma.listing.upsert({
        where: { id: review.listingId },
        update: {
          name: review.listingName,
          channel: review.channel,
        },
        create: {
          id: review.listingId,
          name: review.listingName,
          slug: `listing-${review.listingId}`, // Simple slug generation
          channel: review.channel,
        },
      });

      // Now upsert the review
      const existingReview = await prisma.review.findUnique({
        where: { id: review.id },
      });

      if (existingReview) {
        // Update if needed (e.g. status changed)
        await prisma.review.update({
          where: { id: review.id },
          data: {
            status: review.status,
            overallRating: review.overallRating,
            publicText: review.publicText,
            updatedAt: new Date(),
            // We do NOT update selectedForPublic here to preserve manager's choice
          },
        });
        updatedCount++;
      } else {
        // Create new review
        await prisma.review.create({
          data: {
            id: review.id,
            source: review.source,
            listingId: review.listingId,
            type: review.type,
            status: review.status,
            overallRating: review.overallRating,
            publicText: review.publicText,
            submittedAt: review.submittedAt,
            guestName: review.guestName,
            channel: review.channel,
            selectedForPublic: false, // Default
            categories: {
              create: review.categories.map((c: any) => ({
                category: c.category,
                rating: c.rating
              }))
            }
          },
        });
        createdCount++;
      }
    }

    console.log(`Sync complete. Created: ${createdCount}, Updated: ${updatedCount}`);
    return { createdCount, updatedCount };

  } catch (error) {
    console.error('Error syncing reviews:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
};
