-- CreateEnum
CREATE TYPE "AttendeeStatus" AS ENUM ('NOT_SELECTED', 'SELECTED', 'REJECTED', 'CHECKED_IN');

-- CreateTable
CREATE TABLE "Event" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "time" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "venue" TEXT NOT NULL,
    "heroImageUrl" TEXT,
    "maxCapacity" INTEGER NOT NULL DEFAULT 30,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EventSettings" (
    "id" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "logoUrl" TEXT,
    "passBackgroundUrl" TEXT,
    "accentColor" TEXT NOT NULL DEFAULT '#F2BA30',
    "allowPlusOne" BOOLEAN NOT NULL DEFAULT true,
    "whatsappTemplateSelected" TEXT,
    "whatsappTemplateReminder" TEXT,
    "whatsappTemplatePlusOne" TEXT,

    CONSTRAINT "EventSettings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Attendee" (
    "id" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "status" "AttendeeStatus" NOT NULL DEFAULT 'NOT_SELECTED',
    "passUrl" TEXT,
    "qrPayload" TEXT,
    "seatLabel" TEXT,
    "checkedIn" BOOLEAN NOT NULL DEFAULT false,
    "checkedInAt" TIMESTAMP(3),
    "plusOneName" TEXT,
    "plusOnePhone" TEXT,
    "plusOneQrPayload" TEXT,
    "plusOneCheckedIn" BOOLEAN NOT NULL DEFAULT false,
    "plusOneCheckedInAt" TIMESTAMP(3),
    "uploadedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "notifiedAt" TIMESTAMP(3),

    CONSTRAINT "Attendee_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "EventSettings_eventId_key" ON "EventSettings"("eventId");

-- CreateIndex
CREATE UNIQUE INDEX "Attendee_eventId_phone_key" ON "Attendee"("eventId", "phone");

-- AddForeignKey
ALTER TABLE "EventSettings" ADD CONSTRAINT "EventSettings_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Attendee" ADD CONSTRAINT "Attendee_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
