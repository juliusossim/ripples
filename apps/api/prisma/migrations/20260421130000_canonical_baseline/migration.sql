-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "AuthProvider" AS ENUM ('manual', 'google');

-- CreateEnum
CREATE TYPE "EventType" AS ENUM ('view_property', 'like_property', 'save_property', 'share_property', 'click_ripple', 'contact_seller', 'start_transaction', 'complete_transaction');

-- CreateEnum
CREATE TYPE "MediaType" AS ENUM ('image', 'video');

-- CreateEnum
CREATE TYPE "UserSystemRole" AS ENUM ('user', 'admin');

-- CreateEnum
CREATE TYPE "OrganizationType" AS ENUM ('agency', 'developer', 'owner_company', 'shop', 'supplier', 'brand');

-- CreateEnum
CREATE TYPE "MembershipStatus" AS ENUM ('invited', 'active', 'suspended', 'removed');

-- CreateEnum
CREATE TYPE "OrganizationMembershipRole" AS ENUM ('owner', 'admin', 'manager', 'agent', 'creator', 'member');

-- CreateEnum
CREATE TYPE "VerificationStatus" AS ENUM ('pending', 'in_review', 'verified', 'rejected', 'expired');

-- CreateEnum
CREATE TYPE "AddressAssignmentSubjectType" AS ENUM ('property', 'organization', 'user_profile', 'creator_profile');

-- CreateEnum
CREATE TYPE "AddressAssignmentRole" AS ENUM ('property_location', 'registered_address', 'operating_address', 'billing_address', 'shipping_origin', 'pickup_address', 'profile_address', 'service_base');

-- CreateEnum
CREATE TYPE "PropertyStatus" AS ENUM ('draft', 'active', 'archived');

-- CreateEnum
CREATE TYPE "OwnershipSubjectType" AS ENUM ('user', 'organization');

-- CreateEnum
CREATE TYPE "PropertyOwnershipRole" AS ENUM ('owner', 'co_owner', 'manager');

-- CreateEnum
CREATE TYPE "ListingStatus" AS ENUM ('draft', 'review', 'active', 'paused', 'under-offer', 'sold', 'archived');

-- CreateEnum
CREATE TYPE "ListingAssignmentActorType" AS ENUM ('user', 'organization');

-- CreateEnum
CREATE TYPE "ListingAssignmentRole" AS ENUM ('owner', 'agent', 'creator', 'agency', 'manager');

-- CreateEnum
CREATE TYPE "ContentPostType" AS ENUM ('listing', 'campaign', 'creator_post', 'market_update');

-- CreateEnum
CREATE TYPE "ReactionType" AS ENUM ('like', 'love', 'wow', 'fire', 'interested');

-- CreateEnum
CREATE TYPE "TrendWindow" AS ENUM ('m5', 'h1', 'h24', 'd7');

-- CreateEnum
CREATE TYPE "TrendEntityType" AS ENUM ('listing', 'property', 'content_post', 'creator_profile', 'product', 'live_session');

-- CreateEnum
CREATE TYPE "CurrencyCode" AS ENUM ('NGN', 'USD', 'CAD', 'AUD', 'GHS', 'KES', 'ZAR', 'GBP', 'EUR', 'JPY', 'CNY', 'INR', 'RIPPLE');

-- CreateEnum
CREATE TYPE "WalletOwnerType" AS ENUM ('user', 'organization');

-- CreateEnum
CREATE TYPE "WalletStatus" AS ENUM ('active', 'suspended', 'closed');

-- CreateEnum
CREATE TYPE "LedgerEntryType" AS ENUM ('reward_credit', 'spend_debit', 'transfer_in', 'transfer_out', 'payment_in', 'payment_out', 'adjustment');

-- CreateEnum
CREATE TYPE "TransactionStatus" AS ENUM ('initiated', 'pending_payment', 'funded', 'completed', 'cancelled', 'disputed');

-- CreateEnum
CREATE TYPE "TransactionPartyRole" AS ENUM ('buyer', 'seller', 'agent', 'creator', 'agency', 'platform');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('pending', 'succeeded', 'failed', 'cancelled', 'refunded');

-- CreateEnum
CREATE TYPE "PropertyDocumentVerificationStatus" AS ENUM ('pending', 'in_review', 'verified', 'rejected', 'expired');

-- CreateEnum
CREATE TYPE "ListingOccupancyModel" AS ENUM ('entire_unit', 'room_only', 'shared_unit', 'landlord_on_site');

-- CreateEnum
CREATE TYPE "ListingSuitabilityTag" AS ENUM ('student_friendly', 'couple_friendly', 'working_professional_friendly', 'family_friendly');

-- CreateEnum
CREATE TYPE "PaymentCadence" AS ENUM ('one_time', 'monthly', 'quarterly', 'biannual', 'yearly', 'milestone');

-- CreateEnum
CREATE TYPE "PaymentPlanType" AS ENUM ('upfront_only', 'installments_allowed');

-- CreateEnum
CREATE TYPE "ListingCompletionState" AS ENUM ('ready_built', 'off_plan', 'under_construction');

-- CreateTable
CREATE TABLE "OAuthState" (
    "state" TEXT NOT NULL,
    "codeVerifier" TEXT NOT NULL,
    "redirectUri" VARCHAR(2048) NOT NULL,
    "provider" "AuthProvider" NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "OAuthState_pkey" PRIMARY KEY ("state")
);

-- CreateTable
CREATE TABLE "PropertyMedia" (
    "id" UUID NOT NULL,
    "propertyId" UUID NOT NULL,
    "url" VARCHAR(2048) NOT NULL,
    "type" "MediaType" NOT NULL,
    "alt" VARCHAR(240) NOT NULL,
    "sortOrder" INTEGER NOT NULL,

    CONSTRAINT "PropertyMedia_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" UUID NOT NULL,
    "email" VARCHAR(254) NOT NULL,
    "fullName" VARCHAR(120) NOT NULL,
    "avatarUrl" VARCHAR(2048),
    "systemRoles" "UserSystemRole"[] DEFAULT ARRAY['user']::"UserSystemRole"[],
    "emailVerified" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuthIdentity" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "provider" "AuthProvider" NOT NULL,
    "providerSubject" VARCHAR(255) NOT NULL,
    "passwordHash" TEXT,
    "passwordSalt" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AuthIdentity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "refreshTokenHash" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "revokedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserProfile" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "bio" VARCHAR(1000),
    "headline" VARCHAR(160),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Role" (
    "id" UUID NOT NULL,
    "code" VARCHAR(80) NOT NULL,
    "name" VARCHAR(120) NOT NULL,
    "description" VARCHAR(500),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Role_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Permission" (
    "id" UUID NOT NULL,
    "code" VARCHAR(120) NOT NULL,
    "name" VARCHAR(120) NOT NULL,
    "description" VARCHAR(500),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Permission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserRoleMap" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "roleId" UUID NOT NULL,
    "scope" VARCHAR(120),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserRoleMap_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RolePermissionMap" (
    "id" UUID NOT NULL,
    "roleId" UUID NOT NULL,
    "permissionId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RolePermissionMap_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Organization" (
    "id" UUID NOT NULL,
    "name" VARCHAR(160) NOT NULL,
    "slug" VARCHAR(120) NOT NULL,
    "type" "OrganizationType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Organization_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrganizationProfile" (
    "id" UUID NOT NULL,
    "organizationId" UUID NOT NULL,
    "description" VARCHAR(2000),
    "logoUrl" VARCHAR(2048),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OrganizationProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrganizationMembership" (
    "id" UUID NOT NULL,
    "organizationId" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "role" "OrganizationMembershipRole" NOT NULL,
    "status" "MembershipStatus" NOT NULL DEFAULT 'active',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OrganizationMembership_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Address" (
    "id" UUID NOT NULL,
    "line1" VARCHAR(160),
    "line2" VARCHAR(160),
    "city" VARCHAR(120) NOT NULL,
    "region" VARCHAR(120),
    "postalCode" VARCHAR(40),
    "country" VARCHAR(120) NOT NULL,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "formatted" VARCHAR(500),
    "landmark" VARCHAR(160),
    "placeProviderSource" VARCHAR(80),
    "placeProviderId" VARCHAR(160),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Address_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AddressAssignment" (
    "id" UUID NOT NULL,
    "addressId" UUID NOT NULL,
    "subjectType" "AddressAssignmentSubjectType" NOT NULL,
    "subjectId" UUID NOT NULL,
    "role" "AddressAssignmentRole" NOT NULL,
    "isPrimary" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AddressAssignment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AddressVerification" (
    "id" UUID NOT NULL,
    "addressId" UUID NOT NULL,
    "status" "VerificationStatus" NOT NULL DEFAULT 'pending',
    "provider" VARCHAR(120),
    "notes" VARCHAR(1000),
    "isCurrent" BOOLEAN NOT NULL DEFAULT true,
    "verifiedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AddressVerification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ServiceZone" (
    "id" UUID NOT NULL,
    "organizationId" UUID NOT NULL,
    "name" VARCHAR(120) NOT NULL,
    "description" VARCHAR(500),
    "geoJson" JSONB,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ServiceZone_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Property" (
    "id" UUID NOT NULL,
    "title" VARCHAR(160) NOT NULL,
    "description" VARCHAR(5000) NOT NULL,
    "status" "PropertyStatus" NOT NULL DEFAULT 'active',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Property_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PropertyOwnership" (
    "id" UUID NOT NULL,
    "propertyId" UUID NOT NULL,
    "ownerType" "OwnershipSubjectType" NOT NULL,
    "ownerId" UUID NOT NULL,
    "role" "PropertyOwnershipRole" NOT NULL DEFAULT 'owner',
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PropertyOwnership_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PropertyDocument" (
    "id" UUID NOT NULL,
    "propertyId" UUID NOT NULL,
    "kind" VARCHAR(80) NOT NULL,
    "name" VARCHAR(160) NOT NULL,
    "url" VARCHAR(2048) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PropertyDocument_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PropertyDocumentVerification" (
    "id" UUID NOT NULL,
    "propertyDocumentId" UUID NOT NULL,
    "status" "PropertyDocumentVerificationStatus" NOT NULL DEFAULT 'pending',
    "verifier" VARCHAR(120),
    "notes" VARCHAR(1000),
    "isCurrent" BOOLEAN NOT NULL DEFAULT true,
    "verifiedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PropertyDocumentVerification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Listing" (
    "id" UUID NOT NULL,
    "propertyId" UUID NOT NULL,
    "title" VARCHAR(160) NOT NULL,
    "description" VARCHAR(5000) NOT NULL,
    "priceAmount" DECIMAL(18,2) NOT NULL,
    "priceCurrency" "CurrencyCode" NOT NULL,
    "status" "ListingStatus" NOT NULL DEFAULT 'active',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Listing_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ListingVersion" (
    "id" UUID NOT NULL,
    "listingId" UUID NOT NULL,
    "title" VARCHAR(160) NOT NULL,
    "description" VARCHAR(5000) NOT NULL,
    "priceAmount" DECIMAL(18,2) NOT NULL,
    "priceCurrency" "CurrencyCode" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ListingVersion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ListingAssignment" (
    "id" UUID NOT NULL,
    "listingId" UUID NOT NULL,
    "actorType" "ListingAssignmentActorType" NOT NULL,
    "actorId" UUID NOT NULL,
    "role" "ListingAssignmentRole" NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ListingAssignment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ListingPromotion" (
    "id" UUID NOT NULL,
    "listingId" UUID NOT NULL,
    "slot" VARCHAR(80) NOT NULL,
    "startsAt" TIMESTAMP(3) NOT NULL,
    "endsAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ListingPromotion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ListingAvailability" (
    "id" UUID NOT NULL,
    "listingId" UUID NOT NULL,
    "availableFrom" TIMESTAMP(3),
    "availableTo" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ListingAvailability_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ListingShareProgram" (
    "id" UUID NOT NULL,
    "listingId" UUID NOT NULL,
    "commissionRate" DECIMAL(8,4) NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ListingShareProgram_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ListingSuitabilityProfile" (
    "id" UUID NOT NULL,
    "listingId" UUID NOT NULL,
    "tags" "ListingSuitabilityTag"[],
    "notes" VARCHAR(500),
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ListingSuitabilityProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ListingEligibilityPolicy" (
    "id" UUID NOT NULL,
    "listingId" UUID NOT NULL,
    "policyText" VARCHAR(2000) NOT NULL,
    "reviewStatus" "VerificationStatus" NOT NULL DEFAULT 'pending',
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ListingEligibilityPolicy_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ListingOccupancyProfile" (
    "id" UUID NOT NULL,
    "listingId" UUID NOT NULL,
    "occupancyModel" "ListingOccupancyModel" NOT NULL,
    "landlordLivesOnSite" BOOLEAN NOT NULL DEFAULT false,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ListingOccupancyProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ListingPaymentTerms" (
    "id" UUID NOT NULL,
    "listingId" UUID NOT NULL,
    "completionState" "ListingCompletionState" NOT NULL,
    "planType" "PaymentPlanType" NOT NULL,
    "cadence" "PaymentCadence" NOT NULL,
    "minimumUpfrontCycles" INTEGER NOT NULL DEFAULT 1,
    "installmentCount" INTEGER,
    "depositAmount" DECIMAL(18,2),
    "depositCurrency" "CurrencyCode",
    "notes" VARCHAR(1000),
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ListingPaymentTerms_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CreatorProfile" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "bio" VARCHAR(1000),
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CreatorProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContentPost" (
    "id" UUID NOT NULL,
    "authorUserId" UUID,
    "authorOrgId" UUID,
    "type" "ContentPostType" NOT NULL,
    "title" VARCHAR(160),
    "body" VARCHAR(5000),
    "targetType" "TrendEntityType",
    "targetId" UUID,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ContentPost_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContentMedia" (
    "id" UUID NOT NULL,
    "contentPostId" UUID NOT NULL,
    "url" VARCHAR(2048) NOT NULL,
    "type" "MediaType" NOT NULL,
    "alt" VARCHAR(240) NOT NULL,
    "sortOrder" INTEGER NOT NULL,

    CONSTRAINT "ContentMedia_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Reaction" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "targetType" "TrendEntityType" NOT NULL,
    "targetId" UUID NOT NULL,
    "kind" "ReactionType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Reaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Save" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "targetType" "TrendEntityType" NOT NULL,
    "targetId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Save_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Share" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "targetType" "TrendEntityType" NOT NULL,
    "targetId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Share_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Follow" (
    "id" UUID NOT NULL,
    "followerUserId" UUID NOT NULL,
    "targetType" "TrendEntityType" NOT NULL,
    "targetId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Follow_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BehaviorEvent" (
    "id" UUID NOT NULL,
    "userId" UUID,
    "sessionId" VARCHAR(160),
    "type" "EventType" NOT NULL,
    "entityId" VARCHAR(160) NOT NULL,
    "entityType" VARCHAR(80) NOT NULL,
    "metadata" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BehaviorEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FeedImpression" (
    "id" UUID NOT NULL,
    "userId" UUID,
    "sessionId" VARCHAR(160),
    "surface" VARCHAR(80) NOT NULL,
    "targetType" "TrendEntityType" NOT NULL,
    "targetId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FeedImpression_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TrendSignal" (
    "id" UUID NOT NULL,
    "entityType" "TrendEntityType" NOT NULL,
    "entityId" UUID NOT NULL,
    "window" "TrendWindow" NOT NULL,
    "timeBucket" TIMESTAMP(3) NOT NULL,
    "score" DECIMAL(18,6) NOT NULL,
    "metrics" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TrendSignal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Wallet" (
    "id" UUID NOT NULL,
    "ownerType" "WalletOwnerType" NOT NULL,
    "ownerId" UUID NOT NULL,
    "status" "WalletStatus" NOT NULL DEFAULT 'active',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Wallet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WalletAccount" (
    "id" UUID NOT NULL,
    "walletId" UUID NOT NULL,
    "currencyCode" "CurrencyCode" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WalletAccount_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LedgerEntry" (
    "id" UUID NOT NULL,
    "walletAccountId" UUID NOT NULL,
    "entryType" "LedgerEntryType" NOT NULL,
    "amount" DECIMAL(18,2) NOT NULL,
    "currencyCode" "CurrencyCode" NOT NULL,
    "referenceType" VARCHAR(80),
    "referenceId" UUID,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LedgerEntry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RippleReward" (
    "id" UUID NOT NULL,
    "ledgerEntryId" UUID NOT NULL,
    "sourceType" VARCHAR(80) NOT NULL,
    "sourceId" UUID,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RippleReward_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RippleSpend" (
    "id" UUID NOT NULL,
    "ledgerEntryId" UUID NOT NULL,
    "spendType" VARCHAR(80) NOT NULL,
    "targetId" UUID,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RippleSpend_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Transaction" (
    "id" UUID NOT NULL,
    "status" "TransactionStatus" NOT NULL DEFAULT 'initiated',
    "amount" DECIMAL(18,2) NOT NULL,
    "currencyCode" "CurrencyCode" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Transaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TransactionParty" (
    "id" UUID NOT NULL,
    "transactionId" UUID NOT NULL,
    "partyType" "WalletOwnerType" NOT NULL,
    "partyId" UUID NOT NULL,
    "role" "TransactionPartyRole" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TransactionParty_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Payment" (
    "id" UUID NOT NULL,
    "transactionId" UUID NOT NULL,
    "amount" DECIMAL(18,2) NOT NULL,
    "currencyCode" "CurrencyCode" NOT NULL,
    "status" "PaymentStatus" NOT NULL DEFAULT 'pending',
    "provider" VARCHAR(80),
    "providerReference" VARCHAR(160),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "OAuthState_expiresAt_idx" ON "OAuthState"("expiresAt");

-- CreateIndex
CREATE INDEX "PropertyMedia_propertyId_sortOrder_idx" ON "PropertyMedia"("propertyId", "sortOrder");

-- CreateIndex
CREATE UNIQUE INDEX "PropertyMedia_propertyId_sortOrder_key" ON "PropertyMedia"("propertyId", "sortOrder");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "AuthIdentity_userId_idx" ON "AuthIdentity"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "AuthIdentity_provider_providerSubject_key" ON "AuthIdentity"("provider", "providerSubject");

-- CreateIndex
CREATE UNIQUE INDEX "Session_refreshTokenHash_key" ON "Session"("refreshTokenHash");

-- CreateIndex
CREATE INDEX "Session_userId_idx" ON "Session"("userId");

-- CreateIndex
CREATE INDEX "Session_expiresAt_idx" ON "Session"("expiresAt");

-- CreateIndex
CREATE INDEX "Session_revokedAt_idx" ON "Session"("revokedAt");

-- CreateIndex
CREATE UNIQUE INDEX "UserProfile_userId_key" ON "UserProfile"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Role_code_key" ON "Role"("code");

-- CreateIndex
CREATE UNIQUE INDEX "Permission_code_key" ON "Permission"("code");

-- CreateIndex
CREATE INDEX "UserRoleMap_roleId_idx" ON "UserRoleMap"("roleId");

-- CreateIndex
CREATE UNIQUE INDEX "UserRoleMap_userId_roleId_scope_key" ON "UserRoleMap"("userId", "roleId", "scope");

-- CreateIndex
CREATE INDEX "RolePermissionMap_permissionId_idx" ON "RolePermissionMap"("permissionId");

-- CreateIndex
CREATE UNIQUE INDEX "RolePermissionMap_roleId_permissionId_key" ON "RolePermissionMap"("roleId", "permissionId");

-- CreateIndex
CREATE UNIQUE INDEX "Organization_slug_key" ON "Organization"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "OrganizationProfile_organizationId_key" ON "OrganizationProfile"("organizationId");

-- CreateIndex
CREATE INDEX "OrganizationMembership_userId_status_idx" ON "OrganizationMembership"("userId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "OrganizationMembership_organizationId_userId_key" ON "OrganizationMembership"("organizationId", "userId");

-- CreateIndex
CREATE INDEX "Address_city_country_idx" ON "Address"("city", "country");

-- CreateIndex
CREATE INDEX "AddressAssignment_subjectType_subjectId_role_idx" ON "AddressAssignment"("subjectType", "subjectId", "role");

-- CreateIndex
CREATE UNIQUE INDEX "AddressAssignment_addressId_subjectType_subjectId_role_key" ON "AddressAssignment"("addressId", "subjectType", "subjectId", "role");

-- CreateIndex
CREATE INDEX "AddressVerification_addressId_status_idx" ON "AddressVerification"("addressId", "status");

-- CreateIndex
CREATE INDEX "AddressVerification_addressId_isCurrent_idx" ON "AddressVerification"("addressId", "isCurrent");

-- CreateIndex
CREATE INDEX "ServiceZone_organizationId_active_idx" ON "ServiceZone"("organizationId", "active");

-- CreateIndex
CREATE INDEX "Property_status_createdAt_idx" ON "Property"("status", "createdAt");

-- CreateIndex
CREATE INDEX "PropertyOwnership_ownerType_ownerId_idx" ON "PropertyOwnership"("ownerType", "ownerId");

-- CreateIndex
CREATE UNIQUE INDEX "PropertyOwnership_propertyId_ownerType_ownerId_role_active_key" ON "PropertyOwnership"("propertyId", "ownerType", "ownerId", "role", "active");

-- CreateIndex
CREATE INDEX "PropertyDocument_propertyId_kind_idx" ON "PropertyDocument"("propertyId", "kind");

-- CreateIndex
CREATE INDEX "PropertyDocumentVerification_propertyDocumentId_status_idx" ON "PropertyDocumentVerification"("propertyDocumentId", "status");

-- CreateIndex
CREATE INDEX "PropertyDocumentVerification_propertyDocumentId_isCurrent_idx" ON "PropertyDocumentVerification"("propertyDocumentId", "isCurrent");

-- CreateIndex
CREATE INDEX "Listing_propertyId_status_createdAt_idx" ON "Listing"("propertyId", "status", "createdAt");

-- CreateIndex
CREATE INDEX "ListingVersion_listingId_createdAt_idx" ON "ListingVersion"("listingId", "createdAt");

-- CreateIndex
CREATE INDEX "ListingAssignment_actorType_actorId_idx" ON "ListingAssignment"("actorType", "actorId");

-- CreateIndex
CREATE UNIQUE INDEX "ListingAssignment_listingId_actorType_actorId_role_active_key" ON "ListingAssignment"("listingId", "actorType", "actorId", "role", "active");

-- CreateIndex
CREATE INDEX "ListingPromotion_listingId_startsAt_endsAt_idx" ON "ListingPromotion"("listingId", "startsAt", "endsAt");

-- CreateIndex
CREATE UNIQUE INDEX "ListingAvailability_listingId_key" ON "ListingAvailability"("listingId");

-- CreateIndex
CREATE UNIQUE INDEX "ListingShareProgram_listingId_key" ON "ListingShareProgram"("listingId");

-- CreateIndex
CREATE UNIQUE INDEX "ListingSuitabilityProfile_listingId_key" ON "ListingSuitabilityProfile"("listingId");

-- CreateIndex
CREATE UNIQUE INDEX "ListingEligibilityPolicy_listingId_key" ON "ListingEligibilityPolicy"("listingId");

-- CreateIndex
CREATE UNIQUE INDEX "ListingOccupancyProfile_listingId_key" ON "ListingOccupancyProfile"("listingId");

-- CreateIndex
CREATE UNIQUE INDEX "ListingPaymentTerms_listingId_key" ON "ListingPaymentTerms"("listingId");

-- CreateIndex
CREATE UNIQUE INDEX "CreatorProfile_userId_key" ON "CreatorProfile"("userId");

-- CreateIndex
CREATE INDEX "ContentPost_authorUserId_createdAt_idx" ON "ContentPost"("authorUserId", "createdAt");

-- CreateIndex
CREATE INDEX "ContentPost_authorOrgId_createdAt_idx" ON "ContentPost"("authorOrgId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "ContentMedia_contentPostId_sortOrder_key" ON "ContentMedia"("contentPostId", "sortOrder");

-- CreateIndex
CREATE UNIQUE INDEX "Reaction_userId_targetType_targetId_kind_key" ON "Reaction"("userId", "targetType", "targetId", "kind");

-- CreateIndex
CREATE UNIQUE INDEX "Save_userId_targetType_targetId_key" ON "Save"("userId", "targetType", "targetId");

-- CreateIndex
CREATE INDEX "Share_userId_createdAt_idx" ON "Share"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "Share_targetType_targetId_createdAt_idx" ON "Share"("targetType", "targetId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "Follow_followerUserId_targetType_targetId_key" ON "Follow"("followerUserId", "targetType", "targetId");

-- CreateIndex
CREATE INDEX "BehaviorEvent_entityId_type_idx" ON "BehaviorEvent"("entityId", "type");

-- CreateIndex
CREATE INDEX "BehaviorEvent_sessionId_createdAt_idx" ON "BehaviorEvent"("sessionId", "createdAt");

-- CreateIndex
CREATE INDEX "BehaviorEvent_createdAt_idx" ON "BehaviorEvent"("createdAt");

-- CreateIndex
CREATE INDEX "FeedImpression_surface_createdAt_idx" ON "FeedImpression"("surface", "createdAt");

-- CreateIndex
CREATE INDEX "FeedImpression_targetType_targetId_createdAt_idx" ON "FeedImpression"("targetType", "targetId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "TrendSignal_entityType_entityId_window_timeBucket_key" ON "TrendSignal"("entityType", "entityId", "window", "timeBucket");

-- CreateIndex
CREATE UNIQUE INDEX "Wallet_ownerType_ownerId_key" ON "Wallet"("ownerType", "ownerId");

-- CreateIndex
CREATE UNIQUE INDEX "WalletAccount_walletId_currencyCode_key" ON "WalletAccount"("walletId", "currencyCode");

-- CreateIndex
CREATE INDEX "LedgerEntry_walletAccountId_createdAt_idx" ON "LedgerEntry"("walletAccountId", "createdAt");

-- CreateIndex
CREATE INDEX "LedgerEntry_referenceType_referenceId_idx" ON "LedgerEntry"("referenceType", "referenceId");

-- CreateIndex
CREATE UNIQUE INDEX "RippleReward_ledgerEntryId_key" ON "RippleReward"("ledgerEntryId");

-- CreateIndex
CREATE UNIQUE INDEX "RippleSpend_ledgerEntryId_key" ON "RippleSpend"("ledgerEntryId");

-- CreateIndex
CREATE INDEX "TransactionParty_transactionId_role_idx" ON "TransactionParty"("transactionId", "role");

-- CreateIndex
CREATE INDEX "TransactionParty_partyType_partyId_idx" ON "TransactionParty"("partyType", "partyId");

-- CreateIndex
CREATE INDEX "Payment_transactionId_status_idx" ON "Payment"("transactionId", "status");

-- CreateIndex
CREATE INDEX "Payment_providerReference_idx" ON "Payment"("providerReference");

-- AddForeignKey
ALTER TABLE "PropertyMedia" ADD CONSTRAINT "PropertyMedia_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuthIdentity" ADD CONSTRAINT "AuthIdentity_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserProfile" ADD CONSTRAINT "UserProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserRoleMap" ADD CONSTRAINT "UserRoleMap_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserRoleMap" ADD CONSTRAINT "UserRoleMap_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RolePermissionMap" ADD CONSTRAINT "RolePermissionMap_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RolePermissionMap" ADD CONSTRAINT "RolePermissionMap_permissionId_fkey" FOREIGN KEY ("permissionId") REFERENCES "Permission"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrganizationProfile" ADD CONSTRAINT "OrganizationProfile_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrganizationMembership" ADD CONSTRAINT "OrganizationMembership_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrganizationMembership" ADD CONSTRAINT "OrganizationMembership_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AddressAssignment" ADD CONSTRAINT "AddressAssignment_addressId_fkey" FOREIGN KEY ("addressId") REFERENCES "Address"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AddressVerification" ADD CONSTRAINT "AddressVerification_addressId_fkey" FOREIGN KEY ("addressId") REFERENCES "Address"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServiceZone" ADD CONSTRAINT "ServiceZone_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PropertyOwnership" ADD CONSTRAINT "PropertyOwnership_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PropertyDocument" ADD CONSTRAINT "PropertyDocument_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PropertyDocumentVerification" ADD CONSTRAINT "PropertyDocumentVerification_propertyDocumentId_fkey" FOREIGN KEY ("propertyDocumentId") REFERENCES "PropertyDocument"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Listing" ADD CONSTRAINT "Listing_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ListingVersion" ADD CONSTRAINT "ListingVersion_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "Listing"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ListingAssignment" ADD CONSTRAINT "ListingAssignment_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "Listing"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ListingPromotion" ADD CONSTRAINT "ListingPromotion_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "Listing"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ListingAvailability" ADD CONSTRAINT "ListingAvailability_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "Listing"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ListingShareProgram" ADD CONSTRAINT "ListingShareProgram_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "Listing"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ListingSuitabilityProfile" ADD CONSTRAINT "ListingSuitabilityProfile_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "Listing"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ListingEligibilityPolicy" ADD CONSTRAINT "ListingEligibilityPolicy_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "Listing"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ListingOccupancyProfile" ADD CONSTRAINT "ListingOccupancyProfile_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "Listing"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ListingPaymentTerms" ADD CONSTRAINT "ListingPaymentTerms_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "Listing"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CreatorProfile" ADD CONSTRAINT "CreatorProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContentPost" ADD CONSTRAINT "ContentPost_authorUserId_fkey" FOREIGN KEY ("authorUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContentPost" ADD CONSTRAINT "ContentPost_authorOrgId_fkey" FOREIGN KEY ("authorOrgId") REFERENCES "Organization"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContentMedia" ADD CONSTRAINT "ContentMedia_contentPostId_fkey" FOREIGN KEY ("contentPostId") REFERENCES "ContentPost"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reaction" ADD CONSTRAINT "Reaction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Save" ADD CONSTRAINT "Save_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Share" ADD CONSTRAINT "Share_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Follow" ADD CONSTRAINT "Follow_followerUserId_fkey" FOREIGN KEY ("followerUserId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BehaviorEvent" ADD CONSTRAINT "BehaviorEvent_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FeedImpression" ADD CONSTRAINT "FeedImpression_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WalletAccount" ADD CONSTRAINT "WalletAccount_walletId_fkey" FOREIGN KEY ("walletId") REFERENCES "Wallet"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LedgerEntry" ADD CONSTRAINT "LedgerEntry_walletAccountId_fkey" FOREIGN KEY ("walletAccountId") REFERENCES "WalletAccount"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RippleReward" ADD CONSTRAINT "RippleReward_ledgerEntryId_fkey" FOREIGN KEY ("ledgerEntryId") REFERENCES "LedgerEntry"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RippleSpend" ADD CONSTRAINT "RippleSpend_ledgerEntryId_fkey" FOREIGN KEY ("ledgerEntryId") REFERENCES "LedgerEntry"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TransactionParty" ADD CONSTRAINT "TransactionParty_transactionId_fkey" FOREIGN KEY ("transactionId") REFERENCES "Transaction"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_transactionId_fkey" FOREIGN KEY ("transactionId") REFERENCES "Transaction"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- ManualPartialUniqueIndex
CREATE UNIQUE INDEX "AddressAssignment_primary_role_subject_unique"
ON "AddressAssignment"("subjectType", "subjectId", "role")
WHERE "isPrimary" = true;

-- ManualPartialUniqueIndex
CREATE UNIQUE INDEX "AddressVerification_current_per_address_unique"
ON "AddressVerification"("addressId")
WHERE "isCurrent" = true;

-- ManualPartialUniqueIndex
CREATE UNIQUE INDEX "PropertyDocumentVerification_current_per_document_unique"
ON "PropertyDocumentVerification"("propertyDocumentId")
WHERE "isCurrent" = true;
