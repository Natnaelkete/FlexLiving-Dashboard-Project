import dotenv from "dotenv";
import path from "path";
// Load env before other imports
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

import { HostawayService } from "../modules/reviews/hostaway.service";
import { normalizeHostawayReview } from "../modules/reviews/reviews.utils";

async function test() {
  console.log("Testing Hostaway API...");
  const service = new HostawayService();
  try {
    const response = await service.fetchReviews({});
    console.log("Raw Response Status:", response.status);
    console.log("Number of reviews:", response.result.length);

    if (response.result && response.result.length > 0) {
      console.log(
        "Sample Raw Review:",
        JSON.stringify(response.result[0], null, 2)
      );
      const normalized = normalizeHostawayReview(response.result[0]);
      console.log(
        "Sample Normalized Review:",
        JSON.stringify(normalized, null, 2)
      );
    } else {
      console.log("No reviews found. Trying to fetch listings...");
      const listings = await service.fetchListings();
      console.log("Listings Response Status:", listings.status);
      console.log(
        "Number of listings:",
        listings.result ? listings.result.length : 0
      );
      if (listings.result && listings.result.length > 0) {
        const listingId = listings.result[0].id;
        console.log("Sample Listing ID:", listingId);
        console.log(`Fetching reviews for listing ${listingId}...`);
        const reviews = await service.fetchReviews({ listingId });
        console.log("Reviews for listing:", reviews.result.length);
        if (reviews.result && reviews.result.length > 0) {
          console.log(
            "Sample Raw Review:",
            JSON.stringify(reviews.result[0], null, 2)
          );
          const normalized = normalizeHostawayReview(reviews.result[0]);
          console.log(
            "Sample Normalized Review:",
            JSON.stringify(normalized, null, 2)
          );
        }
      }
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

test();
