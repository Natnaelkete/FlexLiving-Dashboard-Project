-- CreateTable
CREATE TABLE "Listing" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT,
    "channel" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Listing_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Review" (
    "id" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "listingId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "overallRating" INTEGER,
    "publicText" TEXT,
    "submittedAt" TIMESTAMP(3) NOT NULL,
    "guestName" TEXT,
    "channel" TEXT,
    "selectedForPublic" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Review_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReviewCategory" (
    "id" TEXT NOT NULL,
    "reviewId" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "rating" INTEGER,

    CONSTRAINT "ReviewCategory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Review_listingId_idx" ON "Review"("listingId");

-- CreateIndex
CREATE INDEX "Review_source_idx" ON "Review"("source");

-- CreateIndex
CREATE INDEX "Review_selectedForPublic_idx" ON "Review"("selectedForPublic");

-- CreateIndex
CREATE INDEX "ReviewCategory_reviewId_idx" ON "ReviewCategory"("reviewId");

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "Listing"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReviewCategory" ADD CONSTRAINT "ReviewCategory_reviewId_fkey" FOREIGN KEY ("reviewId") REFERENCES "Review"("id") ON DELETE CASCADE ON UPDATE CASCADE;
