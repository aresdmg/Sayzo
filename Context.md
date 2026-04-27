# Sayzo - Project Context

## Overview
Sayzo is a full-stack web application designed for businesses to collect and manage customer reviews. Business owners can register, create profiles for their businesses, generate unique review links, and analyze the feedback they receive through a dashboard.

## Tech Stack
* **Frontend Framework**: Next.js 16 (App Router) with React 19.
* **Styling & UI**: Tailwind CSS (v4), Radix UI, Shadcn UI, Framer Motion (for animations), Recharts (for analytics dashboards), and Lucide React (for icons).
* **API Layer**: tRPC (Client, Server, and React Query integration) for type-safe API communication between the frontend and backend.
* **Database & ORM**: PostgreSQL database interacted with via Drizzle ORM.
* **Authentication & Security**: Custom JWT-based authentication using `jsonwebtoken` and `bcrypt` for password hashing.
* **Spam Prevention**: Integration with `@fingerprintjs/fingerprintjs` and local storage checks to prevent duplicate reviews from the same user/device.

## Core Features
1. **Business Management**:
   - Users can create and manage multiple businesses.
   - Each business can be toggled as active/inactive.
   - Owners can generate unique, shareable review links (e.g., `/r/[slug]`) to send to customers.
2. **Review Collection**:
   - Customers can visit a public-facing review page specific to a business.
   - They can submit a star rating (1-5) and a descriptive text review.
   - The system tracks fingerprints to ensure one review per device per business.
   - *Future/Schema feature*: The database schema also supports audio reviews and transcripts, suggesting a feature for voice-based feedback.
3. **Analytics Dashboard**:
   - Business owners have a detailed dashboard (`/business/[id]`).
   - The dashboard displays key metrics: Total Reviews, Average Rating.
   - It visualizes review trends over time using interactive line charts (Recharts).
   - It lists the most recent reviews directly on the page.

## Database Schema Structure
The data layer is defined in `src/db/schema.ts` and consists of the following tables:
* `users`: Manages platform users (business owners), their credentials, and roles.
* `user_tokens`: Handles refresh tokens for persistent user sessions.
* `businesses`: Stores business details (name, unique slug, active status, and the generated review link).
* `reviews`: Stores customer feedback, including rating, content, the user's browser fingerprint, and language.
* `audio_reviews`: Links to `reviews` to store audio file URLs, duration, and text transcripts.

## Directory Structure Highlights
* `src/app`: Contains the Next.js App Router pages.
  * `/auth`: Login and registration flows.
  * `/business`: The dashboard and business management views.
  * `/r/[slug]`: The public-facing customer review submission form.
* `src/server/routes`: Contains the tRPC router definitions (`user.ts`, `business.ts`, `review.ts`) defining the backend logic.
* `src/components`: Contains reusable UI components built with Radix and Shadcn.
* `src/db`: Contains the Drizzle schema and likely the database connection setup.
