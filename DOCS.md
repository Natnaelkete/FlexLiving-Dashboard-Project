# Google Reviews Integration Findings

## Overview
This document outlines the strategy for integrating Google Reviews into the Flex Living Reviews Dashboard.

## API Selection
We will use the **Google Places API (New)** or the existing **Places API**.
- **Endpoint**: `https://maps.googleapis.com/maps/api/place/details/json`
- **Parameters**: `place_id`, `fields=reviews`, `key=API_KEY`

## Authentication & Billing
- Requires a Google Cloud Project with billing enabled.
- API Key must be restricted to the specific IP addresses of our backend servers.
- **Cost**: The Places API has a free tier ($200 monthly credit), which should be sufficient for initial development and low-volume usage.

## Data Structure
Google returns reviews in the following format:
```json
{
  "author_name": "String",
  "author_url": "URL",
  "language": "en",
  "profile_photo_url": "URL",
  "rating": 5,
  "relative_time_description": "String",
  "text": "Review content",
  "time": 1234567890
}
```

## Normalization Strategy
We map Google reviews to our `NormalizedReview` interface:
- `id`: Generated deterministically (`google-{time}-{author_name}`).
- `source`: `google`.
- `listingId`: Mapped from `place_id`.
- `overallRating`: Mapped directly from `rating`.
- `publicText`: Mapped from `text`.

## Implementation Status
- **Backend**:
  - `GoogleService` created with mock data.
  - `getGoogleReviews` controller method added.
  - Route `GET /api/reviews/google` exposed.
- **Frontend**:
  - Pending integration.

## Next Steps
1. Obtain a valid Google Places API Key.
2. Configure `GOOGLE_PLACES_API_KEY` in `.env`.
3. Replace mock data in `GoogleService` with actual API calls.
4. Implement frontend display for Google source.
