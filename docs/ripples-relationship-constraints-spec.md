# Ripples — Relationship And Constraints Specification

> Implementation-facing relationship, integrity, and lifecycle rules derived
> from the SRS, ERD, and domain matrix.

---

## 1. Locked Architectural Choices

The following choices are considered accepted for schema design:

- one base `User` identity
- `Organization` as the canonical business actor
- `Address` as a lightly normalized root entity
- `AddressAssignment` as a polymorphic join
- `AddressVerification` as a separate root
- split verification for compliance-heavy domains
- `ContentPost` references using a polymorphic-or-hybrid strategy
- `LedgerEntry` as a strongly typed financial record
- `LiveSession` as a first-class root entity
- `CreatorProfile` as an opt-in one-to-one root from `User`
- `CommissionRule` as a normalized root entity

---

## 2. Relationship Rules By Domain

## 2.1 Identity And Access

### Relationships

- one `User` to many `AuthIdentity`
- one `User` to many `Session`
- one `User` to one `UserProfile`
- many `User` to many `Role` through `UserRole`
- many `Role` to many `Permission` through `RolePermission`

### Required constraints

- `AuthIdentity(provider, providerSubject)` unique
- `UserRole(userId, roleId, scope)` unique
- `RolePermission(roleId, permissionId)` unique

### Delete behavior

- deleting `User` should be soft-delete only
- deleting `Role` should be restricted if still assigned
- deleting `Permission` should be restricted if still mapped

---

## 2.2 Organization And Participation

### Relationships

- one `Organization` to one `OrganizationProfile`
- one `Organization` to many `Team`
- many `User` to many `Organization` through `OrganizationMembership`
- many `User` to many `Team` through `TeamMembership`

### Required constraints

- `Organization.slug` unique
- `OrganizationMembership(userId, organizationId)` unique for active membership
- `Team(organizationId, name)` unique

### Delete behavior

- deleting `Organization` should be soft-delete only
- deleting `Team` should restrict if active memberships exist or archive them

---

## 2.3 Address, Verification, And Zones

### Relationships

- one `Address` to many `AddressAssignment`
- one `Address` to many `AddressVerification`
- one `Organization` to many `ServiceZone`

### Address assignment subject set

`AddressAssignment.subjectType` should initially support:

- `property`
- `organization`
- `user-profile`
- `creator-profile`

Future additions may include:

- `team`
- `warehouse`
- `shop-profile`

### Required constraints

- `AddressAssignment(addressId, subjectType, subjectId, role)` unique
- `AddressAssignment(subjectType, subjectId, role, isPrimary=true)` unique
- `Property` must have exactly one active `property_location` assignment
- `Organization` may have one primary `registered_address`
- `Organization` may have one primary `operating_address`

### Recommended `AddressAssignment.role` values

- `property_location`
- `registered_address`
- `operating_address`
- `billing_address`
- `shipping_origin`
- `pickup_address`
- `profile_address`
- `service_base`

### Address verification rules

- `AddressVerification` is a separate root
- verification history must be retained
- at most one active current verification record per address
- verification should not be deleted after use; it should move through statuses

### Service zone rules

- `ServiceZone` belongs to an `Organization`
- `Organization.type='shop'` or supplier-like orgs may define many service zones
- a service zone can reference:
  - polygon geometry
  - named locality coverage
  - postal coverage set
- service zone membership for a delivery point is evaluated from address
  geography, not direct address ownership

### Delete behavior

- deleting `Address` is restricted while active assignments exist
- deleting `AddressAssignment` is allowed if replacement constraints are still met
- deleting `ServiceZone` is restricted if active products depend on it,
  otherwise archive preferred

---

## 2.4 Property, Project, And Listing

### Relationships

- one `Property` to many `PropertyMedia`
- one `Property` to many `PropertyDocument`
- one `PropertyDocument` to many `PropertyDocumentVerification`
- one `Property` to many `PropertyOwnership`
- one `Property` to many `Listing`
- one `PropertyUnit` to many `Listing`
- one `DevelopmentProject` to many `ProjectPhase`
- one `DevelopmentProject` to many `PropertyUnit`
- one `Listing` to many `ListingAssignment`
- one `Listing` to many `ListingVersion`
- one `Listing` to zero or one active `ListingSuitabilityProfile`
- one `Listing` to zero or one active `ListingEligibilityPolicy`
- one `Listing` to zero or one active `ListingOccupancyProfile`
- one `Listing` to zero or one active `ListingPaymentTerms`
- one `Listing` to many `ListingPromotion`
- one `Listing` to zero or one active `ListingShareProgram`

### Required constraints

- `PropertyOwnership(propertyId, ownerType, ownerId, role)` unique for active ownership
- `PropertyMedia(propertyId, sortOrder)` unique
- `PropertyDocumentVerification(propertyDocumentId, isCurrent=true)` unique
- `PropertyUnit(projectId, unitCode)` unique
- `ListingAssignment(listingId, actorType, actorId, role)` unique for active assignment
- a listing may reference either `propertyId` or `propertyUnitId`, but must reference at least one
- only one active `ListingOccupancyProfile` should exist per listing
- only one active `ListingPaymentTerms` should exist per listing
- only one active `ListingSuitabilityProfile` should exist per listing

### Delete behavior

- `Property` should be archived, not hard-deleted, once listed or transacted
- `Listing` should be archived, not hard-deleted, once exposed publicly
- `DevelopmentProject` should be archived if inventory exists
- `PropertyDocumentVerification` should never be hard-deleted once used in trust decisions

### Canonical property rule

`Property` should represent the canonical real-world asset, while `Listing`
represents a commercial offer for that asset.

This means:

- multiple active listings may reference one property when commercial context
  legitimately differs
- uncontrolled duplicate property records should be detected and reviewed
- duplicate handling should use address, geospatial, ownership, media, and
  project or unit identity signals
- duplicate workflows should prefer merge, link, or canonical-marking behavior
  over destructive deletion

### Listing policy rule

Suitability, occupancy, and payment requirements should be modeled on
`Listing`, not `Property`, because they are part of the offer and household
policy rather than the physical asset truth.

Recommended split:

- `ListingSuitabilityProfile` for positive matching and discovery signals
- `ListingEligibilityPolicy` for explicit restrictive or reviewable policies
- `ListingOccupancyProfile` for shared accommodation and landlord-on-site
  context
- `ListingPaymentTerms` for rent cadence, installment support, deposits, and
  off-plan payment structure

---

## 2.5 Product Commerce

### Relationships

- one `Brand` to many `Product`
- one `Supplier` to many `Product`
- one `ProductCategory` to many `Product`
- one `Product` to many `ProductVariant`
- one `Product` to many `ProductMedia`
- one `ProductVariant` to many `ProductInventory`

### Required constraints

- `Product.slug` unique
- `ProductVariant.sku` unique when present
- `ProductInventory(productVariantId, inventoryScope)` unique

### Serviceability rule

- products requiring fulfillment should reference `Organization` and its `ServiceZone`s
- serviceability is evaluated against `Address` + `ServiceZone`, not ad hoc strings

---

## 2.6 Social, Content, And Feed

### Relationships

- one `ContentPost` to many `ContentMedia`
- one `ContentPost` to many `Comment`
- many `User` to many target entities through `Reaction`
- many `User` to many target entities through `Save`
- many `User` to many target entities through `Follow`
- one `Campaign` to many posts, assignments, and referral objects

### Reference strategy

`ContentPost` should use a polymorphic-or-hybrid target strategy:

- required post author reference
- optional direct references for highest-frequency targets if needed
- generic target context for extensibility

### Required constraints

- `Reaction(userId, targetType, targetId, kind)` unique
- `Save(userId, targetType, targetId)` unique
- `Follow(followerId, targetType, targetId)` unique
- `ReferralLink.code` unique

### Delete behavior

- user-generated content should generally be soft-deleted
- reactions, saves, follows may be hard-deleted if audit requirements do not apply
- referral links should be disabled, not removed, after campaign use

---

## 2.7 Live Domain

### Relationships

- one `LiveSession` to many `LiveSchedule` entries if recurrence is supported
- one `LiveSession` to many `LiveHost`
- one `LiveSession` to many `LiveCoHost`
- one `LiveSession` to many `LiveListingSpotlight`
- one `LiveSession` to many `LiveViewerSession`
- one `LiveSession` to many `LiveChatMessage`
- one `LiveSession` to many `LiveGift`
- one `LiveSession` to many `LiveOffer`
- one `LiveSession` to many `LiveConversionEvent`

### Required constraints

- a `LiveSession` must have at least one active host
- `LiveViewerSession(liveSessionId, viewerIdentityKey, attendanceInstance)` unique
- `LiveGift` must reference a valid `GiftTransaction` or `LedgerEntry` chain

### Delete behavior

- completed live sessions should be archived, not deleted
- chat and reaction streams may be retention-limited by policy
- gifts and conversions must not be deleted if tied to revenue

---

## 2.8 Creator Economy

### Relationships

- one `User` to zero or one `CreatorProfile`
- one `CreatorProfile` to zero or one `CreatorProgram`
- one `CreatorProfile` to many `PromotionAssignment`
- one `CreatorProfile` to many `CommissionLedgerEntry`
- one `Campaign` / `ListingShareProgram` / platform context to many `CommissionRule`

### Required constraints

- `CreatorProfile(userId)` unique
- `PromotionAssignment(creatorProfileId, targetType, targetId, programContext)` unique
- commission attribution should be idempotent by source event or source transaction

### Delete behavior

- creator profiles should be deactivated, not deleted, once earnings exist
- commission ledger entries must be immutable after posting

---

## 2.9 Wallet, Ripple, Payment, And Transaction

### Relationships

- one `User` or `Organization` to many `Wallet`
- one `Wallet` to many `WalletAccount`
- one `WalletAccount` to many `LedgerEntry`
- one `Transaction` to many `TransactionItem`
- one `Transaction` to many `TransactionParty`
- one `Transaction` to many `Payment`
- one `Transaction` to zero or one `EscrowAccount`
- one `EscrowAccount` to many `EscrowMilestone`
- one `Transaction` to many `Settlement`

### Required constraints

- `Wallet(ownerType, ownerId, scope)` unique where scope defines wallet purpose
- `WalletAccount(walletId, currencyCode)` unique
- `TransactionParty(transactionId, actorType, actorId, role)` unique
- `EscrowAccount(transactionId)` unique
- every posted `LedgerEntry` must belong to exactly one `WalletAccount`

### Ledger rule

`LedgerEntry` is strongly typed and non-polymorphic. It should not store a
generic target pointer as its primary integrity mechanism.

### Delete behavior

- wallets should never be hard-deleted after ledger activity
- ledger entries, payments, settlements, refunds, disputes, and escrow
  milestones must be immutable or append-only in effect

---

## 2.10 Trending, Analytics, And Recommendation

### Relationships

- one `User` / session to many `BehaviorEvent`
- one trendable entity to many `TrendSignal`
- one `TrendingSnapshot` to many ranked entity references
- one `User` to one `RecommendationProfile`
- one `User` to many `PreferenceSignal`

### Required constraints

- `TrendSignal(entityType, entityId, window, timeBucket)` unique
- `TrendingSnapshot(surface, segmentKey, window, timeBucket)` unique
- event idempotency keys should be supported where ingestion is retryable

### Materialization rule

- `TrendSignal` should be materialized
- `TrendingSnapshot` should be materialized
- `FeedItem` may start as computed and cached rather than permanently persisted

---

## 3. Verification Split Decision

The platform should not use one generic verification model for everything in
compliance-heavy flows.

Preferred split:

- `KycProfile` for user identity compliance
- `KybProfile` for organization compliance
- `AddressVerification` for address validity and quality
- `PropertyDocumentVerification` for property authenticity and legal document review
- optional business-specific verification roots later if licensing diverges

This keeps:

- constraints stronger
- workflows clearer
- auditing simpler

---

## 4. State Transition Guidance

### Listing

- `draft -> review -> active -> paused -> under-offer -> sold | archived`

### LiveSession

- `draft -> scheduled -> live -> ended -> replay-available | archived`

### Transaction

- `initiated -> pending-payment -> funded -> in-escrow -> completed | cancelled | disputed`

### AddressVerification

- `pending -> in-review -> verified | rejected | expired`

### PropertyDocumentVerification

- `pending -> in-review -> verified | rejected | expired`

### CreatorProgram

- `applied -> approved -> active -> suspended | exited`

---

## 5. Remaining Decision Set

The following still need final product/engineering agreement:

1. whether `ContentPost` should be fully polymorphic or hybrid
2. whether first-version ledgers are fully double-entry or balanced transfer records
3. whether `LiveSession` supports organization hosts directly or only through users
4. whether `ListingShareProgram` and `CommissionRule` remain separate

---

## 6. Next Schema Step

After this spec, the next concrete implementation artifact should be:

- a schema package plan
- enum inventory
- Prisma model drafts for Phase 1 roots and joins
