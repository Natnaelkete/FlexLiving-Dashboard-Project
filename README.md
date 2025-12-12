# Flex Living Reviews Dashboard

A comprehensive dashboard for managing property reviews from multiple sources (Hostaway, Google) with a public-facing showcase page. This project allows property managers to aggregate, analyze, and curate reviews to build trust with potential guests.

## 🚀 Features

- **Unified Review Management**: Aggregate reviews from Hostaway and Google in one place.
- **Public Showcase**: A modern, responsive page to display curated reviews to the public.
- **Analytics Dashboard**: Track rating trends, distribution, and total review counts.
- **Review Curation**: Toggle which reviews appear on the public page.
- **Responsive Design**: Optimized for both desktop and mobile devices.
- **Robust Architecture**: Built with a modular monolith backend and a type-safe frontend.

## 🛠️ Tech Stack

- **Frontend**: Next.js 16 (App Router), Tailwind CSS, Redux Toolkit, Lucide Icons.
- **Backend**: Node.js, Express.js, TypeScript.
- **Database**: PostgreSQL (via Prisma ORM).
- **Caching**: Redis.
- **Infrastructure**: Docker, Docker Compose.

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v18 or higher)
- [Docker](https://www.docker.com/) & Docker Compose
- [Git](https://git-scm.com/)

## 🏁 Getting Started

### 1. Clone the Repository
```bash
git clone https://github.com/Natnaelkete/FlexLiving-Dashboard-Project.git
cd FlexLiving-Dashboard-Project
```

### 2. Environment Setup

You need to configure environment variables for the backend. Create a `.env` file in the `backend` directory.

**backend/.env**
```env
PORT=4000
# Database Connection (Default for Docker)
DATABASE_URL="postgresql://user:secure_password@postgres:5432/flex_reviews?schema=public"

# Redis Connection (Default for Docker)
REDIS_URL="redis://redis:6379"

# External APIs (Replace with your credentials)
HOSTAWAY_ACCOUNT_ID="your_hostaway_id"
HOSTAWAY_API_KEY="your_hostaway_key"
GOOGLE_PLACES_API_KEY="your_google_api_key"
```

### 3. Run with Docker (Recommended) 🐳

The easiest way to run the entire stack (Frontend, Backend, Database, Redis) is using Docker Compose.

```bash
# Build and start all services
docker-compose up --build
```

Once the containers are running, access the application at:
- **Frontend (Dashboard)**: [http://localhost:3000](http://localhost:3000)
- **Backend API**: [http://localhost:4000](http://localhost:4000)
- **Prisma Studio (DB GUI)**: [http://localhost:5555](http://localhost:5555)

### 4. Run Manually (Without Docker)

If you prefer to run the services individually on your machine:

**Backend Setup**
```bash
cd backend
npm install

# Ensure you have a PostgreSQL and Redis instance running locally
# Update .env DATABASE_URL and REDIS_URL to point to your local instances

# Run migrations
npx prisma generate
npx prisma migrate dev

# Start server
npm run dev
```

**Frontend Setup**
```bash
cd frontend
npm install

# Start development server
npm run dev
```

## 📂 Project Structure

```
FlexLiving-Dashboard-Project/
├── backend/                # Express.js API
│   ├── src/
│   │   ├── modules/        # Feature-based modules (Reviews, etc.)
│   │   ├── middleware/     # Error handling, validation
│   │   └── lib/            # Shared utilities
│   └── prisma/             # Database schema and migrations
├── frontend/               # Next.js Application
│   ├── src/
│   │   ├── app/            # App Router pages
│   │   ├── components/     # Reusable UI components
│   │   └── store/          # Redux state management
├── packages/               # Shared workspaces
│   └── types/              # Shared TypeScript interfaces
└── docker-compose.yml      # Docker orchestration
```

## 📚 Documentation

- **Technical Details**: See [DOCUMENTATION.md](./DOCUMENTATION.md) for architecture decisions and API reference.
- **Deployment**: See [VERCEL_GUIDE.md](./VERCEL_GUIDE.md) for instructions on deploying to Vercel.

## 📄 License

This project is licensed under the MIT License.
