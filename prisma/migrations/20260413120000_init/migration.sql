-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cars" (
    "id" TEXT NOT NULL,
    "sourceId" TEXT NOT NULL,
    "sourceUrl" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "brand" TEXT,
    "model" TEXT,
    "year" INTEGER,
    "mileageKm" INTEGER,
    "priceJpy" INTEGER,
    "totalPriceJpy" INTEGER,
    "bodyType" TEXT,
    "fuelType" TEXT,
    "transmission" TEXT,
    "drive" TEXT,
    "engineCc" INTEGER,
    "color" TEXT,
    "location" TEXT,
    "rawData" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cars_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "car_images" (
    "id" TEXT NOT NULL,
    "carId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "car_images_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "cars_sourceId_key" ON "cars"("sourceId");

-- CreateIndex
CREATE UNIQUE INDEX "cars_sourceUrl_key" ON "cars"("sourceUrl");

-- CreateIndex
CREATE INDEX "cars_brand_idx" ON "cars"("brand");

-- CreateIndex
CREATE INDEX "cars_model_idx" ON "cars"("model");

-- CreateIndex
CREATE INDEX "cars_year_idx" ON "cars"("year");

-- CreateIndex
CREATE INDEX "cars_priceJpy_idx" ON "cars"("priceJpy");

-- CreateIndex
CREATE INDEX "cars_mileageKm_idx" ON "cars"("mileageKm");

-- CreateIndex
CREATE INDEX "car_images_carId_sortOrder_idx" ON "car_images"("carId", "sortOrder");

-- AddForeignKey
ALTER TABLE "car_images" ADD CONSTRAINT "car_images_carId_fkey" FOREIGN KEY ("carId") REFERENCES "cars"("id") ON DELETE CASCADE ON UPDATE CASCADE;

