# Flex Living Reviews Dashboard - Technical Documentation

## 1. Tech Stack

### Backend

- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL (via Prisma ORM)
- **Caching**: Redis (for API response caching)
- **Validation**: Zod
- **Testing**: Jest & Supertest
- **Architecture**: Modular Monolith with Layered Architecture (Controller-Service-Repository)

### Frontend

- **Framework**: Next.js 16 (App Router)
- **Styling**: Tailwind CSS
- **State Management**: Redux Toolkit
- **HTTP Client**: Axios
- **Icons**: Lucide React

### Infrastructure & DevOps

- **Containerization**: Docker & Docker Compose
- **Deployment**: Vercel (Frontend & Backend)
- **CI/CD**: GitHub Actions (Linting, Testing, Build Verification)

---

## 2. Key Design Decisions

### API Design & Normalization

To handle reviews from multiple sources (Hostaway, Google) with different data structures, we implemented a **Normalization Strategy**.

- **`NormalizedReview` Interface**: A unified schema that all incoming reviews are mapped to before reaching the frontend or database.
- **Deterministic IDs**: IDs are generated deterministically (e.g., `google-{timestamp}-{author}`) to prevent duplicates without relying solely on database auto-incrementing IDs.
- **Service Layer Pattern**: Business logic is encapsulated in services (`ReviewsService`, `GoogleService`, `HostawayService`), keeping controllers thin and testable.

### Dashboard UX/UI

- **Mobile-First Responsiveness**: The dashboard features a collapsible sidebar and responsive tables to ensure usability on tablets and phones.
- **Visual Cues**: Color-coded badges (Green/Yellow/Red) for ratings allow managers to instantly spot low-performing listings.
- **Optimistic UI**: Toggle actions (like "Select for Public") update the UI immediately while the backend processes the request, providing a snappy user experience.

---

## 3. API Behaviors & Endpoints

### `GET /api/reviews`

Retrieves a paginated and filtered list of reviews from the database.

- **Query Params**: `page`, `limit`, `minRating`, `maxRating`, `listingId`, `search`.
- **Response**: `{ data: NormalizedReview[], meta: { total, page, limit } }`

### `GET /api/reviews/hostaway`

Fetches fresh reviews directly from the Hostaway API, normalizes them, and returns them.

- **Caching**: Responses are cached in Redis for 5 minutes to prevent rate limiting.

### `GET /api/reviews/google`

Fetches reviews from the Google Places API for a specific listing.

- **Query Params**: `listingId` (mapped to Google Place ID).
- **Behavior**: Fetches details including author name, rating, text, and time.

### `PATCH /api/reviews/:id/selection`

Toggles the `selectedForPublic` status of a review.

- **Body**: `{ selectedForPublic: boolean }`
- **Use Case**: Allows managers to curate which reviews appear on the public marketing page.

### `POST /api/reviews/sync`

Triggers a background synchronization job.

- **Behavior**: Fetches reviews from all sources, normalizes them, and upserts them into the PostgreSQL database.

---

## 4. Google Reviews Integration Findings

### Capabilities

- **Google Places API (New)** allows fetching reviews for specific locations using a Place ID.
- We can retrieve: Author Name, Rating (1-5), Review Text, and Relative Time.

### Limitations

- **No Webhooks**: Google does not provide webhooks for new reviews; we must poll the API.
- **Rate Limits**: The API has quotas; aggressive polling requires caching (implemented via Redis).
- **Matching**: We must manually map our internal `listingId` to Google's `place_id`.

### Implementation Status

- **Implemented**: `GoogleService` with fetching and normalization logic (currently using **Mock Data** for development).
- **Implemented**: Caching strategy to minimize API costs.
- **Pending**: Integration with live Google Places API (replacing mock data).
- **Pending**: Automated background job (Cron) to sync Google reviews nightly (currently manual trigger).

---

## 5. Deployment & Workflow

### Git Workflow

- **Branches**: Feature branches merged into `main` via Pull Requests.
- **Quality Gates**: Husky pre-commit hooks ensure linting passes. GitHub Actions run unit tests on every push.

### Deployment Strategy

- **Frontend**: Deployed to Vercel, connected to the backend via `NEXT_PUBLIC_API_URL`.
- **Backend**: Deployed to Vercel as Serverless Functions.
- **Database**: Hosted on Neon (PostgreSQL) and Upstash (Redis) for cloud accessibility.
