-- Add price to Event
ALTER TABLE "Event" ADD COLUMN IF NOT EXISTS "price" TEXT;

-- Add all landing/config columns to EventSettings
ALTER TABLE "EventSettings" ADD COLUMN IF NOT EXISTS "missionFormUrl"     TEXT;
ALTER TABLE "EventSettings" ADD COLUMN IF NOT EXISTS "instagramUrl"        TEXT;
ALTER TABLE "EventSettings" ADD COLUMN IF NOT EXISTS "emailAddress"        TEXT;
ALTER TABLE "EventSettings" ADD COLUMN IF NOT EXISTS "aboutText"           TEXT;
ALTER TABLE "EventSettings" ADD COLUMN IF NOT EXISTS "partnerLogoUrl"      TEXT;
ALTER TABLE "EventSettings" ADD COLUMN IF NOT EXISTS "sessionDescription"  TEXT;
ALTER TABLE "EventSettings" ADD COLUMN IF NOT EXISTS "activities"          JSONB;
ALTER TABLE "EventSettings" ADD COLUMN IF NOT EXISTS "timeline"            JSONB;
ALTER TABLE "EventSettings" ADD COLUMN IF NOT EXISTS "thingsToKnow"        JSONB;
