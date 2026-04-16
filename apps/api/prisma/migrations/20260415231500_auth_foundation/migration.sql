CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TYPE "AuthProvider" AS ENUM ('manual', 'google');
CREATE TYPE "UserRole" AS ENUM ('user', 'admin');

CREATE TABLE "AuthUser" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "email" VARCHAR(254) NOT NULL UNIQUE,
  "fullName" VARCHAR(120) NOT NULL,
  "avatarUrl" VARCHAR(2048),
  "roles" "UserRole"[] NOT NULL DEFAULT ARRAY['user']::"UserRole"[],
  "emailVerified" BOOLEAN NOT NULL DEFAULT false,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "AuthAccount" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "userId" UUID NOT NULL REFERENCES "AuthUser"("id") ON DELETE CASCADE,
  "provider" "AuthProvider" NOT NULL,
  "providerUserId" VARCHAR(255) NOT NULL,
  "passwordHash" TEXT,
  "passwordSalt" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "AuthAccount_provider_providerUserId_key" UNIQUE ("provider", "providerUserId")
);

CREATE TABLE "AuthSession" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "userId" UUID NOT NULL REFERENCES "AuthUser"("id") ON DELETE CASCADE,
  "refreshTokenHash" TEXT NOT NULL UNIQUE,
  "expiresAt" TIMESTAMP(3) NOT NULL,
  "revokedAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "OAuthState" (
  "state" TEXT PRIMARY KEY,
  "codeVerifier" TEXT NOT NULL,
  "redirectUri" VARCHAR(2048) NOT NULL,
  "provider" "AuthProvider" NOT NULL,
  "expiresAt" TIMESTAMP(3) NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX "AuthUser_createdAt_idx" ON "AuthUser"("createdAt");
CREATE INDEX "AuthAccount_userId_idx" ON "AuthAccount"("userId");
CREATE INDEX "AuthSession_userId_idx" ON "AuthSession"("userId");
CREATE INDEX "AuthSession_expiresAt_idx" ON "AuthSession"("expiresAt");
CREATE INDEX "AuthSession_revokedAt_idx" ON "AuthSession"("revokedAt");
CREATE INDEX "OAuthState_expiresAt_idx" ON "OAuthState"("expiresAt");
