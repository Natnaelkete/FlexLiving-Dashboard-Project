# Vercel Deployment Guide

This project is a monorepo containing a **Frontend** (Next.js) and a **Backend** (Express). You can deploy both to Vercel, but they must be deployed as separate projects.

## 1. Deploying the Frontend (Recommended)

The frontend is a Next.js application and is fully optimized for Vercel.

1.  **Push your code** to a Git repository (GitHub, GitLab, Bitbucket).
2.  **Log in to Vercel** and click **"Add New..."** -> **"Project"**.
3.  **Import your repository**.
4.  **Configure the Project**:
    *   **Framework Preset**: Next.js
    *   **Root Directory**: Click "Edit" and select `frontend`.
    *   **Environment Variables**: Add the following:
        *   `NEXT_PUBLIC_API_URL`: The URL of your deployed backend (e.g., `https://your-backend.vercel.app/api` or your VPS URL).
5.  Click **Deploy**.

## 2. Deploying the Backend (Optional)

You can deploy the Express backend to Vercel as a Serverless Function.
*Note: Serverless functions have execution time limits (usually 10s). Long-running sync jobs might time out.*

1.  **Go to Vercel Dashboard** and click **"Add New..."** -> **"Project"**.
2.  **Import the SAME repository** again.
3.  **Configure the Project**:
    *   **Project Name**: e.g., `flex-project-backend`
    *   **Framework Preset**: Other
    *   **Root Directory**: Click "Edit" and select `backend`.
    *   **Environment Variables**: Add all variables from your `backend/.env` file:
        *   `DATABASE_URL` (Must be accessible from the internet, e.g., Supabase, Neon, or your VPS Postgres)
        *   `REDIS_URL` (Must be accessible, e.g., Upstash)
        *   `HOSTAWAY_CLIENT_ID`
        *   `HOSTAWAY_CLIENT_SECRET`
        *   `GOOGLE_PLACES_API_KEY`
4.  Click **Deploy**.

## 3. Database & Redis for Vercel

Since Vercel is serverless, you cannot host the database "on Vercel". You need external providers:
*   **PostgreSQL**: Use [Neon](https://neon.tech), [Supabase](https://supabase.com), or [Railway](https://railway.app).
*   **Redis**: Use [Upstash](https://upstash.com).

## 4. Connecting Frontend to Backend

Once both are deployed:
1.  Copy the **Backend URL** (e.g., `https://flex-backend.vercel.app`).
2.  Go to your **Frontend Project** settings on Vercel.
3.  Update `NEXT_PUBLIC_API_URL` to point to the Backend URL (append `/api` if needed, though our routes are mounted at `/api`).
4.  Redeploy the Frontend.
