# CarSensor MVP

Full-stack test assignment solution for scraping, normalizing, storing, and browsing used car listings from CarSensor.

## Overview

This project includes:

1. A worker that scrapes car listings from CarSensor and normalizes Japanese source data
2. PostgreSQL persistence with Prisma
3. A JWT-protected backend API for authentication and car browsing
4. A responsive Next.js frontend with login, filters, pagination, and a car detail page
5. Manual scraping plus hourly scheduled scraping
## Architecture

Repository structure:

```text
apps/
  backend/   Express + TypeScript API
  frontend/  Next.js + React + TypeScript UI
  worker/    Scraper + scheduler
packages/
  shared/    Shared request/response types
prisma/
  schema.prisma
  migrations/
```

Flow:

- `apps/worker` scrapes CarSensor listing pages, visits detail pages, extracts raw attributes, normalizes Japanese labels/values, and upserts cars plus image URLs.
- `apps/backend` exposes `POST /auth/login`, `GET /cars`, and `GET /cars/:id` with JWT Bearer auth.
- `apps/frontend` uses a cookie-backed JWT session, redirects unauthenticated users to `/login`, and renders the list/detail UI from the backend API.

## Tech Stack

- Backend: Node.js, TypeScript, Express, JWT, Zod
- Frontend: Next.js App Router, React, TypeScript, Tailwind CSS
- Database: PostgreSQL
- ORM: Prisma
- Worker: Node.js, TypeScript, Axios, Cheerio, node-cron
- Auth: JWT + bcryptjs

## Implemented Features

- Real scraping with polite delay, retry logic, and clear logs
- Listing-page and detail-page parsing
- Raw extracted attribute dictionary stored in `rawData`
- Dedicated normalization module with:
  - Japanese field label mapping
  - Japanese value dictionaries
  - parsers for year, mileage, price, and engine displacement
- Database upsert by stable `sourceId`
- Multiple image URLs stored in `CarImage`
- JWT login with seeded admin user
- Protected car endpoints
- Server-side pagination, sorting, and filtering
- Responsive frontend:
  - `/login`
  - `/cars`
  - `/cars/[id]`
- Hourly scheduler plus manual scrape command

## Requirements Covered

### 1. Scraping
- CarSensor listing and detail pages are scraped by a dedicated worker
- Car data such as brand, model, year, mileage, price, and images is collected
- Japanese labels and values are normalized through a dictionary-based normalization layer
- Scraping can run manually or on an hourly schedule
- Parsed data is stored in PostgreSQL

### 2. Backend
- JWT authentication is implemented
- `POST /auth/login` returns a token for valid credentials
- `GET /cars` supports filtering, sorting, and pagination
- `GET /cars/:id` returns detailed car information

### 3. Web Application
- Responsive Next.js frontend for desktop and mobile
- Login with username and password
- Car list page with filters, sorting, and pagination
- Dedicated car detail page with structured characteristics and images

## Environment Variables

Copy `.env.example` to `.env` and adjust as needed:

```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/carsensor_mvp?schema=public
JWT_SECRET=super-secret-jwt-key-change-me
BACKEND_PORT=4000
FRONTEND_URL=http://localhost:3000
NEXT_PUBLIC_API_BASE_URL=http://localhost:4000
SCRAPER_BASE_URL=https://www.carsensor.net/
SCRAPER_LIST_PATH=/usedcar/freeword/%E3%83%88%E3%83%A8%E3%82%BF/index.html
SCRAPER_MAX_LIST_PAGES=2
SCRAPER_MAX_CARS_PER_RUN=20
SCRAPER_TIMEOUT_MS=20000
SCRAPER_DELAY_MS=1200
```

Notes:

- `SCRAPER_LIST_PATH` defaults to a stable Toyota freeword search to keep the MVP polite and reliable.
- `SCRAPER_MAX_LIST_PAGES` and `SCRAPER_MAX_CARS_PER_RUN` intentionally limit scrape scope for the assignment MVP.

## Local Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Start PostgreSQL

Preferred:

```bash
docker compose up -d postgres
```

If Docker is unavailable, start any local PostgreSQL instance and make sure `DATABASE_URL` points to it.

### 3. Generate Prisma client

```bash
npm run prisma:generate
```

### 4. Run migrations

```bash
npm run prisma:deploy
```

If you prefer a local dev migration flow:

```bash
npm run prisma:migrate
```

### 5. Seed admin user

```bash
npm run seed
```

Demo credentials:

- username: `admin`
- password: `admin123`

## Running the Apps

### Backend

```bash
npm run dev:backend
```

Backend runs on `http://localhost:4000`.

### Frontend

```bash
npm run dev:frontend
```

Frontend runs on `http://localhost:3000`.

### Worker

```bash
npm run dev:worker
```

Behavior:

- starts the hourly scheduler
- triggers an initial scrape on boot
- logs visited pages, parsed cars, persistence events, and failures

### Manual scrape

```bash
npm run scrape
```

## API Overview

### `POST /auth/login`

Request:

```json
{
  "username": "admin",
  "password": "admin123"
}
```

Response:

```json
{
  "token": "jwt-token",
  "user": {
    "id": "user-id",
    "username": "admin"
  }
}
```

### `GET /cars`

Protected with `Authorization: Bearer <token>`.

Supported query params:

- `page`
- `limit`
- `sortBy`
- `sortOrder`
- `brand`
- `model`
- `minPrice`
- `maxPrice`
- `minYear`
- `maxYear`
- `minMileage`
- `maxMileage`

Response shape:

```json
{
  "items": [],
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "pages": 5
  }
}
```

### `GET /cars/:id`

Protected with `Authorization: Bearer <token>`.

Returns:

- normalized car fields
- image URLs
- `sourceUrl`
- `rawData`

## Scraper Notes

Current MVP strategy:

- scrape a stable CarSensor listing/search page
- parse listing cards for basic metadata and detail links
- visit each detail page
- save:
  - stable source ID
  - normalized fields
  - raw extracted attribute dictionary
  - multiple image URLs

Reliability choices:

- `axios + cheerio` instead of a headless browser
- real User-Agent
- retry logic for transient failures
- polite request delay
- per-car failure isolation so one bad page does not crash the run

## Normalization Notes

Implemented in `apps/worker/src/scraper/normalization.ts`.

Includes:

- field label mapping such as `年式 -> year`, `走行距離 -> mileage`, `排気量 -> engineCc`
- value dictionaries such as:
  - `ガソリン -> petrol`
  - `ディーゼル -> diesel`
  - `ハイブリッド -> hybrid`
  - `AT -> automatic`
  - `MT -> manual`
  - `CVT -> cvt`
  - `2WD -> 2wd`
  - `4WD -> 4wd`
- numeric parsers for:
  - year
  - mileage
  - price
  - engine displacement

Original values are preserved in `rawData`.
## Known Limitations

- The scraper intentionally processes a limited number of listing pages and cars per run to keep the assignment stable and predictable.
- CarSensor HTML is not fully uniform, so some fields may be `null` for certain listings.
- The normalization dictionary currently covers the main labels and values used in the scraped dataset and can be extended further if needed.
- Authentication/session handling is intentionally lightweight for the scope of the assignment.
  
  ## Deployment Notes

- Backend, frontend, and worker are separated cleanly and can be deployed as individual services.
- Prisma migrations are included under `prisma/migrations`.
- `docker-compose.yml` provides PostgreSQL for local development.
- For production-style deployment, the frontend, backend, worker, and database can be hosted separately.