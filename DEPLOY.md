# Deployment Guide

## Prerequisites

- Docker and Docker Compose installed on the target server.
- Git installed.
- Environment variables configured.

## Environment Variables

Create a `.env` file in the root directory with the following variables (see `.env.example` in backend):

```env
POSTGRES_USER=user
POSTGRES_PASSWORD=secure_password
POSTGRES_DB=flex_reviews
DATABASE_URL=postgres://user:secure_password@postgres:5432/flex_reviews?schema=public
REDIS_URL=redis://redis:6379
HOSTAWAY_CLIENT_ID=your_id
HOSTAWAY_CLIENT_SECRET=your_secret
GOOGLE_PLACES_API_KEY=your_key
NEXT_PUBLIC_API_URL=http://your-domain.com/api
```

## Deployment Steps

1. **Clone the repository**

   ```bash
   git clone <repo_url>
   cd FlexProject
   ```

2. **Build and Run with Docker Compose**

   ```bash
   docker-compose -f docker-compose.prod.yml up -d --build
   ```

3. **Run Database Migrations**

   ```bash
   docker-compose -f docker-compose.prod.yml exec backend npx prisma migrate deploy
   ```

4. **Verify Deployment**
   - Frontend: `http://localhost:3000` (or your domain)
   - Backend: `http://localhost:4000`

## CI/CD

The project includes a GitHub Actions workflow (`.github/workflows/ci.yml`) that runs on every push to `main` or `master`. It performs:

- Dependency installation
- Type checking
- Unit tests (Backend & Frontend)
- Build verification

## Troubleshooting

- **Logs**: `docker-compose -f docker-compose.prod.yml logs -f`
- **Rebuild**: `docker-compose -f docker-compose.prod.yml up -d --build --force-recreate`
