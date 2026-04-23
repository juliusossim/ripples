# Ripples — Software Requirements Specification

> Living SRS for the Ripples platform. This document defines scope, users,
> domains, functional expectations, and the canonical model inventory before
> schema implementation.

---

## 1. Purpose

Ripples is a feed-first real estate social commerce platform combining:

- property discovery
- creator-led promotion
- live selling and live engagement
- transaction and escrow infrastructure
- a platform-native digital money called `Ripple`
- recommendation, trending, and ranking systems

The system must support marketplace operations for individuals, agencies,
developers, owners, creators, buyers, and investors without fragmenting user
identity into unrelated account systems.

---

## 2. Product Goals

1. Turn every listing into discoverable content.
2. Let distribution happen through creators, agencies, and live experiences.
3. Support real commercial conversion, not just browsing.
4. Track platform behavior in a way that powers ranking and trending.
5. Build a durable economic system for creators and platform operators.
6. Keep the model architecture robust enough for enterprise growth.

---

## 3. Core Product Loops

### 3.1 Discovery Loop

```text
Property / Event / Creator -> Feed impression -> Interaction -> Save / Share / Watch
-> Better ranking -> More discovery
```

### 3.2 Conversion Loop

```text
Discovery -> Inquiry / Viewing / Live attendance -> Transaction intent
-> Payment / Escrow / Completion
```

### 3.3 Creator Economy Loop

```text
Listing / Product / Live session -> Creator promotion -> Audience engagement
-> Conversion / gifting / Ripple rewards -> More creator participation
```

### 3.4 Ripple Economy Loop

```text
Fiat purchase / rewards / gifts -> Ripple wallet balance -> Spend on platform
-> Boosts / gifts / purchases / commissions -> Platform revenue and retention
```

---

## 4. Personas

### 4.1 Base Identity Principle

Ripples should model a single `User` identity and layer personas through:

- roles
- organization memberships
- profile types
- permissions
- ownership and assignment relationships

This avoids duplicating a person into separate incompatible account models.

### 4.2 Primary Personas

- `Buyer`
  A user browsing, saving, inquiring, booking viewings, attending lives, and
  completing purchases or rentals.
- `Agent`
  A professional realtor acting independently or under an agency.
- `Creator`
  A user promoting listings, products, lives, or campaigns; may or may not be
  the original lister.
- `Owner`
  A user or organization that owns a property or inventory being listed.
- `Developer`
  A user or organization managing projects, phases, units, launches, and
  large-scale inventory.
- `Agency Administrator`
  A user managing an agency account, team assignments, members, and listings.
- `Operations / Admin`
  Internal user managing moderation, verification, compliance, payouts, and
  dispute flows.
- `Investor / Enterprise Stakeholder`
  A user consuming reports, analytics, and performance data.

### 4.3 Organization Personas

- `Agency`
- `Developer Company`
- `Owner Company`
- `Supplier / Brand`

These should usually be modeled as `Organization` with a `type`.

---

## 5. Scope

### 5.1 In Scope

- user identity and authentication
- organization and membership management
- property and listing lifecycle
- product catalog for materials, furniture, and related commerce
- feed content and creator-driven promotion
- real-time live sessions
- comments, saves, shares, reactions, follows
- trending and ranking systems
- Ripple digital money and wallet flows
- payment, escrow, transaction, and commission flows
- verification and trust systems
- notifications and analytics

### 5.2 Out of Scope for Initial Implementation

- open blockchain / public crypto behavior for Ripple
- public token exchange outside the platform
- arbitrary third-party marketplace federation
- multi-country tax/legal automation beyond foundational support

---

## 6. Canonical Domain Inventory

## 6.1 Identity And Access

- `User`
- `AuthIdentity`
- `Session`
- `Role`
- `Permission`
- `UserRole`
- `RolePermission`
- `UserProfile`
- `Verification`
- `Device`

## 6.2 Organization And Participation

- `Organization`
- `OrganizationProfile`
- `OrganizationMembership`
- `Team`
- `TeamMembership`

## 6.3 Location And Address

- `Address`
- `AddressAssignment`
- `AddressVerification`
- `GeoPoint`
- `Country`
- `Region`
- `City`
- `Neighborhood`
- `ServiceArea`
- `ServiceZone`

## 6.4 Property Domain

- `Property`
- `PropertyOwnership`
- `PropertyMedia`
- `PropertyDocument`
- `PropertyDocumentVerification`
- `PropertyDuplicateCandidate`
- `PropertyFeature`
- `PropertyAmenity`
- `DevelopmentProject`
- `ProjectPhase`
- `PropertyUnit`
- `InventoryUnit`

## 6.5 Listing Domain

- `Listing`
- `ListingVersion`
- `ListingAssignment`
- `ListingPrice`
- `ListingSuitabilityProfile`
- `ListingEligibilityPolicy`
- `ListingOccupancyProfile`
- `ListingPaymentTerms`
- `ListingPromotion`
- `ListingAvailability`
- `ListingShareProgram`
- `ListingMetrics`
- `ListingTag`
- `ListingCollection`

## 6.6 Product Commerce Domain

- `Product`
- `ProductCategory`
- `ProductVariant`
- `ProductMedia`
- `ProductInventory`
- `ProductPrice`
- `Brand`
- `Supplier`
- `ProductAttribute`
- `ProductBundle`
- `ProductReview`

## 6.7 Feed And Social Domain

- `ContentPost`
- `ContentMedia`
- `FeedItem`
- `Comment`
- `Reaction`
- `Save`
- `Share`
- `Follow`
- `Hashtag`
- `Mention`
- `Campaign`
- `ReferralLink`

## 6.8 Live Domain

- `LiveSession`
- `LiveSchedule`
- `LiveHost`
- `LiveCoHost`
- `LiveListingSpotlight`
- `LiveViewerSession`
- `LiveChatMessage`
- `LiveReaction`
- `LiveQuestion`
- `LivePoll`
- `LiveOffer`
- `LiveGift`
- `LiveReplay`
- `LiveConversionEvent`

## 6.9 Creator Economy Domain

- `CreatorProfile`
- `CreatorProgram`
- `PromotionAssignment`
- `ReferralAttribution`
- `CommissionRule`
- `CommissionLedgerEntry`
- `CreatorMetrics`
- `CreatorReputation`

## 6.10 Wallet, Ripple, Payment, And Transaction Domain

- `Wallet`
- `WalletAccount`
- `LedgerEntry`
- `RippleTransfer`
- `GiftTransaction`
- `RippleReward`
- `RippleSpend`
- `PaymentMethod`
- `Payment`
- `EscrowAccount`
- `EscrowMilestone`
- `Transaction`
- `TransactionItem`
- `TransactionParty`
- `Payout`
- `Settlement`
- `Refund`
- `Dispute`

## 6.11 Trending, Recommendation, And Analytics Domain

- `BehaviorEvent`
- `FeedImpression`
- `ContentInteraction`
- `TrendSignal`
- `TrendingSnapshot`
- `LiveTrendMetrics`
- `CreatorTrendMetrics`
- `RecommendationProfile`
- `PreferenceSignal`
- `SavedSearch`
- `AlertSubscription`

## 6.12 Trust, Compliance, And Moderation Domain

- `KycProfile`
- `KybProfile`
- `IdentityDocument`
- `BusinessDocument`
- `License`
- `OwnershipProof`
- `ModerationCase`
- `FraudSignal`
- `AuditLog`

## 6.13 Communication And CRM Domain

- `Lead`
- `Inquiry`
- `ViewingAppointment`
- `Conversation`
- `Message`
- `Deal`
- `PipelineStage`
- `Task`
- `Reminder`
- `Note`

---

## 7. Property Versus Listing Truth

Ripples must distinguish clearly between:

- `Property`
  The canonical real-world asset or unit.
- `Listing`
  The commercial offer, packaging, and market terms shown to users.

This distinction matters because some information belongs to the asset itself,
while other information belongs to the offer or landlord policy around that
asset.

### 7.1 Property truth

The following should generally live on `Property` or closely attached property
models:

- physical characteristics
- amenities
- location and address
- canonical media
- legal documents
- ownership
- project or unit identity

### 7.2 Listing truth

The following should generally live on `Listing` or listing-attached policy
models:

- asking price and commercial status
- payment structure
- whether installments are allowed
- whether the property is offered as rent, sale, short-let, or off-plan
- occupancy arrangement such as shared accommodation or landlord-on-site
- audience suitability such as student-friendly or couple-friendly
- creator, agent, and promotion assignments

### 7.3 Sensitive audience restrictions

Requirements such as `female only`, `students only`, or similar audience
restrictions are jurisdiction-sensitive and should not be treated as informal
free-text product metadata.

Ripples should model these through:

- positive `ListingSuitabilityProfile` signals for discovery and matching
- a separate `ListingEligibilityPolicy` for explicit restrictive rules
- reviewable and auditable policy status before public exposure where required

### 7.4 Multiple listings and duplicate properties

Ripples should allow one canonical `Property` to have multiple `Listing`
records, because this can legitimately happen when:

- different agents market the same asset
- the same asset is listed for sale and rent
- the same asset is relisted over time with different terms
- a developer runs multiple campaigns for the same unit or inventory

However, the platform should not allow uncontrolled duplicate `Property`
records to fragment trust and analytics.

The system should therefore support:

- duplicate detection based on address, coordinates, media similarity, unit
  identity, and ownership signals
- `PropertyDuplicateCandidate` style review workflows
- canonical property merge or linking decisions

### 7.5 Property document authenticity

Property authenticity should include first-class document review.

Ripples should support:

- `PropertyDocument` as the stored legal or marketing artifact
- `PropertyDocumentVerification` as the review and authenticity workflow
- document history retention rather than destructive replacement

## 6.14 Notification Domain

- `Notification`
- `NotificationPreference`
- `DeliveryAttempt`
- `NotificationTemplate`

---

## 7. Key Modeling Decisions

1. `User` is a single base identity.
2. `Agent`, `Creator`, `Owner`, and `Developer` are primarily roles, profiles,
   or relationships rather than separate base user tables.
3. `Organization` is the base business entity for agencies, developers, owner
   companies, and suppliers.
4. `Address` is a lightly normalized root entity with polymorphic
   `AddressAssignment` records and explicit `AddressVerification`.
5. `Property` and `Listing` must remain separate.
6. `Property` and `Product` must remain separate.
7. `LiveSession` must be first-class, not just another post type.
8. `Ripple` must be ledger-based, not a simple mutable balance field.
9. `Trending` must be derived from event streams and rolling aggregates, not a
   static boolean flag.
10. Verification should be split where compliance behavior differs materially
    across users, organizations, and addresses.
11. creator attribution and commission must be explicit and auditable.
12. permissions must be explicit and grantable independent of broad role names.

---

## 8. Functional Requirements

### 8.1 Identity And Access

- users shall register and authenticate via supported auth providers
- users shall maintain a public profile and optional persona-specific profiles
- organizations shall manage memberships and internal roles
- permissions shall govern access to creation, moderation, payout, and admin flows

### 8.2 Property And Listing

- the system shall support properties with multiple media assets
- the system shall support property owners, assigned agents, and promoting creators
- the system shall support draft, published, paused, sold, and archived listing states
- the system shall support project and unit inventory for developers

### 8.3 Products

- the system shall support sellable products such as furniture and building materials
- products shall support categories, variants, pricing, media, and inventory
- products may be promoted in feed, live, and creator campaigns

### 8.4 Feed And Social

- the system shall surface properties, products, lives, campaigns, and creator content
- users shall be able to like, save, share, follow, comment, and view content
- the system shall track impressions and interactions as event data

### 8.5 Live

- users shall create, schedule, start, and replay live sessions
- lives shall support chat, reactions, gifting, offers, and pinned spotlights
- live performance shall feed ranking, trending, and monetization systems

### 8.6 Ripple

- users shall have Ripple wallet accounts
- Ripple shall be earnable via gifts, rewards, commissions, or promotions
- Ripple shall be transferable between users where permitted
- Ripple shall be spendable on boosts, gifts, purchases, and platform services
- all Ripple movement shall produce immutable ledger entries

### 8.7 Transaction And Escrow

- users shall create transaction intents from listings, products, and live offers
- the platform shall support escrow and milestone-based release
- parties and allocations shall be explicit for every transaction

### 8.8 Trending And Ranking

- the system shall rank feed items with transparent, inspectable signals
- the system shall compute rolling trend scores for properties, lives, creators,
  posts, and products
- trend state shall support real-time or near-real-time updates

### 8.9 Creator Economy

- creators shall be assignable to listings, products, and campaigns
- referral attribution shall persist through engagement and conversion events
- commission rules and earnings shall be auditable

### 8.10 Address, Verification, And Zones

- the system shall allow addresses to be attached to multiple domain actors
  through explicit assignment roles
- addresses shall support verification workflows independent of the owning actor
- organizations operating as shops or suppliers shall support service zones for
  product delivery and fulfillment
- property locations shall require a canonical location assignment role
- address infrastructure shall support future geocoding and serviceability
  expansion

---

## 9. Non-Functional Requirements

- strict type safety across all shared contracts
- event and finance layers must be auditable
- trending and live features must be designed for real-time reads
- wallets and ledgers must be append-only in practice
- data model must support multi-tenant organization behavior
- relationships must support future analytics without schema duplication

---

## 10. Constraints

- `shared/types` remains the canonical domain contract package
- UI-only props and view models must not be promoted into domain models
- financial state must not rely on denormalized mutable balances alone
- content ranking must remain explainable in early phases

---

## 11. Next Design Step

After approval of this SRS, the next design artifact should define:

1. entity categories:
   - root entities
   - join entities
   - value objects
   - derived/read models
2. relationships and cardinalities
3. uniqueness and integrity constraints
4. lifecycle states and transition rules
