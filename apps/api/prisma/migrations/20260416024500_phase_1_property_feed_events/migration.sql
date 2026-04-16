CREATE TYPE "EventType" AS ENUM (
  'view_property',
  'like_property',
  'save_property',
  'share_property',
  'click_ripple',
  'contact_seller',
  'start_transaction',
  'complete_transaction'
);

CREATE TYPE "MediaType" AS ENUM ('image', 'video');

CREATE TYPE "PropertyListingStatus" AS ENUM (
  'draft',
  'active',
  'under-offer',
  'sold',
  'archived'
);

CREATE TABLE "PropertyListing" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "title" VARCHAR(160) NOT NULL,
  "description" VARCHAR(5000) NOT NULL,
  "city" VARCHAR(120) NOT NULL,
  "country" VARCHAR(120) NOT NULL,
  "latitude" DOUBLE PRECISION,
  "longitude" DOUBLE PRECISION,
  "priceAmount" DOUBLE PRECISION NOT NULL,
  "priceCurrency" VARCHAR(3) NOT NULL,
  "status" "PropertyListingStatus" NOT NULL DEFAULT 'active',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL
);

CREATE TABLE "PropertyMedia" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "propertyId" UUID NOT NULL REFERENCES "PropertyListing"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  "url" VARCHAR(2048) NOT NULL,
  "type" "MediaType" NOT NULL,
  "alt" VARCHAR(240) NOT NULL,
  "sortOrder" INTEGER NOT NULL
);

CREATE TABLE "PlatformEvent" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "userId" VARCHAR(160),
  "sessionId" VARCHAR(160) NOT NULL,
  "type" "EventType" NOT NULL,
  "entityId" VARCHAR(160) NOT NULL,
  "entityType" VARCHAR(80) NOT NULL,
  "metadata" JSONB NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX "PropertyListing_status_createdAt_idx" ON "PropertyListing"("status", "createdAt");
CREATE INDEX "PropertyListing_city_country_idx" ON "PropertyListing"("city", "country");
CREATE INDEX "PropertyMedia_propertyId_sortOrder_idx" ON "PropertyMedia"("propertyId", "sortOrder");
CREATE INDEX "PlatformEvent_entityId_type_idx" ON "PlatformEvent"("entityId", "type");
CREATE INDEX "PlatformEvent_sessionId_createdAt_idx" ON "PlatformEvent"("sessionId", "createdAt");
CREATE INDEX "PlatformEvent_createdAt_idx" ON "PlatformEvent"("createdAt");
