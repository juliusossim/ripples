# Ripples — ERD Blueprint

> Conceptual entity relationship blueprint for Ripples. This is not yet the
> final Prisma schema; it is the model map we will refine into concrete tables,
> joins, and constraints.

---

## 1. Modeling Principles

- one base `User` identity
- organizations modeled through `Organization`
- personas expressed through roles, memberships, and profiles
- `Property` and `Listing` remain separate
- `Product` and `Property` remain separate
- `Ripple` is ledger-based
- trending is computed from event streams and snapshots

---

## 2. High-Level Relationship Groups

### 2.1 Identity And Organizations

```mermaid
erDiagram
    USER ||--o{ AUTH_IDENTITY : has
    USER ||--o{ SESSION : has
    USER ||--o{ USER_ROLE : assigned
    ROLE ||--o{ USER_ROLE : grants
    ROLE ||--o{ ROLE_PERMISSION : maps
    PERMISSION ||--o{ ROLE_PERMISSION : includes
    USER ||--|| USER_PROFILE : owns
    USER ||--o{ ORGANIZATION_MEMBERSHIP : joins
    ORGANIZATION ||--o{ ORGANIZATION_MEMBERSHIP : has
    ORGANIZATION ||--|| ORGANIZATION_PROFILE : owns
    ORGANIZATION ||--o{ TEAM : contains
    TEAM ||--o{ TEAM_MEMBERSHIP : has
    USER ||--o{ TEAM_MEMBERSHIP : joins
```

### 2.1.5 Address, Verification, And Zones

```mermaid
erDiagram
    ADDRESS ||--o{ ADDRESS_ASSIGNMENT : assigned_via
    ADDRESS ||--o{ ADDRESS_VERIFICATION : verified_by
    ORGANIZATION ||--o{ SERVICE_ZONE : defines
    USER ||--o{ ADDRESS_ASSIGNMENT : uses
    ORGANIZATION ||--o{ ADDRESS_ASSIGNMENT : uses
    PROPERTY ||--o{ ADDRESS_ASSIGNMENT : located_at
    USER_PROFILE ||--o{ ADDRESS_ASSIGNMENT : uses
```

### 2.2 Property, Project, And Listing

```mermaid
erDiagram
    ORGANIZATION ||--o{ DEVELOPMENT_PROJECT : operates
    DEVELOPMENT_PROJECT ||--o{ PROJECT_PHASE : has
    DEVELOPMENT_PROJECT ||--o{ PROPERTY_UNIT : contains
    PROPERTY ||--o{ PROPERTY_OWNERSHIP : owned_via
    USER ||--o{ PROPERTY_OWNERSHIP : owns
    ORGANIZATION ||--o{ PROPERTY_OWNERSHIP : owns
    PROPERTY ||--o{ PROPERTY_MEDIA : has
    PROPERTY ||--o{ PROPERTY_DOCUMENT : has
    PROPERTY ||--o{ LISTING : offered_as
    PROPERTY_UNIT ||--o{ LISTING : offered_as
    LISTING ||--o{ LISTING_ASSIGNMENT : assigned
    USER ||--o{ LISTING_ASSIGNMENT : participates
    ORGANIZATION ||--o{ LISTING_ASSIGNMENT : participates
    LISTING ||--o{ LISTING_PROMOTION : boosted_by
    LISTING ||--o{ LISTING_SHARE_PROGRAM : shared_via
```

### 2.3 Product Commerce

```mermaid
erDiagram
    ORGANIZATION ||--o{ SUPPLIER : operates
    BRAND ||--o{ PRODUCT : brands
    SUPPLIER ||--o{ PRODUCT : supplies
    PRODUCT_CATEGORY ||--o{ PRODUCT : classifies
    PRODUCT ||--o{ PRODUCT_VARIANT : has
    PRODUCT ||--o{ PRODUCT_MEDIA : has
    PRODUCT ||--o{ PRODUCT_INVENTORY : tracks
    PRODUCT ||--o{ PRODUCT_PRICE : prices
    PRODUCT ||--o{ PRODUCT_REVIEW : reviewed_by
    PRODUCT ||--o{ PRODUCT_BUNDLE : bundled_as
```

### 2.4 Social, Content, And Feed

```mermaid
erDiagram
    USER ||--o{ CONTENT_POST : authors
    ORGANIZATION ||--o{ CONTENT_POST : publishes
    CONTENT_POST ||--o{ CONTENT_MEDIA : has
    CONTENT_POST ||--o{ COMMENT : has
    USER ||--o{ COMMENT : writes
    USER ||--o{ REACTION : creates
    USER ||--o{ SAVE : creates
    USER ||--o{ SHARE : creates
    USER ||--o{ FOLLOW : follows
    USER ||--o{ CREATOR_PROFILE : may_have
    CREATOR_PROFILE ||--o{ PROMOTION_ASSIGNMENT : receives
    LISTING ||--o{ PROMOTION_ASSIGNMENT : promoted_by
    PRODUCT ||--o{ PROMOTION_ASSIGNMENT : promoted_by
    CONTENT_POST ||--o{ FEED_ITEM : surfaces_as
    LISTING ||--o{ FEED_ITEM : surfaces_as
    PRODUCT ||--o{ FEED_ITEM : surfaces_as
```

### 2.5 Live Domain

```mermaid
erDiagram
    LIVE_SESSION ||--o{ LIVE_SCHEDULE : scheduled_by
    LIVE_SESSION ||--o{ LIVE_HOST : hosted_by
    LIVE_SESSION ||--o{ LIVE_COHOST : cohosted_by
    LIVE_SESSION ||--o{ LIVE_LISTING_SPOTLIGHT : spotlights
    LIVE_SESSION ||--o{ LIVE_VIEWER_SESSION : attends
    LIVE_SESSION ||--o{ LIVE_CHAT_MESSAGE : has
    LIVE_SESSION ||--o{ LIVE_REACTION : has
    LIVE_SESSION ||--o{ LIVE_QUESTION : has
    LIVE_SESSION ||--o{ LIVE_POLL : has
    LIVE_SESSION ||--o{ LIVE_OFFER : creates
    LIVE_SESSION ||--o{ LIVE_GIFT : receives
    LIVE_SESSION ||--o{ LIVE_REPLAY : produces
    LIVE_SESSION ||--o{ LIVE_CONVERSION_EVENT : converts
    USER ||--o{ LIVE_VIEWER_SESSION : participates
    USER ||--o{ LIVE_CHAT_MESSAGE : sends
```

### 2.6 Wallet, Ripple, Payment, And Transaction

```mermaid
erDiagram
    USER ||--o{ WALLET : owns
    ORGANIZATION ||--o{ WALLET : owns
    WALLET ||--o{ WALLET_ACCOUNT : contains
    WALLET_ACCOUNT ||--o{ LEDGER_ENTRY : records
    USER ||--o{ RIPPLE_TRANSFER : sends
    USER ||--o{ GIFT_TRANSACTION : sends
    USER ||--o{ RIPPLE_REWARD : earns
    USER ||--o{ RIPPLE_SPEND : spends
    TRANSACTION ||--o{ TRANSACTION_ITEM : contains
    TRANSACTION ||--o{ TRANSACTION_PARTY : includes
    TRANSACTION ||--o{ PAYMENT : settles
    TRANSACTION ||--o{ ESCROW_ACCOUNT : secures
    ESCROW_ACCOUNT ||--o{ ESCROW_MILESTONE : releases_by
    PAYMENT ||--o{ REFUND : may_create
    TRANSACTION ||--o{ SETTLEMENT : distributes
    COMMISSION_RULE ||--o{ COMMISSION_LEDGER_ENTRY : drives
```

### 2.7 Trending, Analytics, And Recommendation

```mermaid
erDiagram
    USER ||--o{ BEHAVIOR_EVENT : emits
    CONTENT_POST ||--o{ FEED_IMPRESSION : receives
    LISTING ||--o{ FEED_IMPRESSION : receives
    PRODUCT ||--o{ FEED_IMPRESSION : receives
    LIVE_SESSION ||--o{ FEED_IMPRESSION : receives
    BEHAVIOR_EVENT ||--o{ TREND_SIGNAL : aggregates_into
    TREND_SIGNAL ||--o{ TRENDING_SNAPSHOT : surfaces_in
    LIVE_SESSION ||--o{ LIVE_TREND_METRICS : measured_by
    CREATOR_PROFILE ||--o{ CREATOR_TREND_METRICS : measured_by
    USER ||--|| RECOMMENDATION_PROFILE : has
    USER ||--o{ PREFERENCE_SIGNAL : generates
```

---

## 3. Core Entity Definitions

### 3.1 Root Entities

- `User`
- `Organization`
- `Property`
- `Listing`
- `DevelopmentProject`
- `PropertyUnit`
- `Product`
- `ContentPost`
- `LiveSession`
- `Wallet`
- `Transaction`
- `Lead`
- `Conversation`
- `Address`
- `AddressVerification`
- `ServiceZone`

### 3.2 Join Entities

- `UserRole`
- `RolePermission`
- `OrganizationMembership`
- `TeamMembership`
- `AddressAssignment`
- `PropertyOwnership`
- `ListingAssignment`
- `PromotionAssignment`
- `TransactionParty`
- `Follow`

### 3.3 Derived / Read Models

- `FeedItem`
- `TrendSignal`
- `TrendingSnapshot`
- `CreatorMetrics`
- `LiveTrendMetrics`

### 3.4 Financial Audit Entities

- `WalletAccount`
- `LedgerEntry`
- `RippleTransfer`
- `GiftTransaction`
- `RippleReward`
- `RippleSpend`
- `Payment`
- `EscrowAccount`
- `EscrowMilestone`
- `Settlement`
- `Refund`
- `CommissionLedgerEntry`

---

## 4. Key Cardinality Rules

- one `User` can belong to many `Organization`s
- one `Organization` can have many `User`s through memberships
- one `Address` can be assigned to many entities through `AddressAssignment`
- one entity can have many addresses through `AddressAssignment`
- one `Property` can have many owners through `PropertyOwnership`
- one `Property` can have many `Listing`s over time
- one `Listing` can involve many participants through `ListingAssignment`
- one `CreatorProfile` can promote many listings/products
- one `LiveSession` can spotlight many listings/products
- one `Wallet` can contain many `WalletAccount`s
- one `WalletAccount` can have many `LedgerEntry` rows
- one `Transaction` can have many parties, items, payments, and milestones
- one trendable entity can have many `TrendSignal` records across windows

---

## 5. Trendable Entity Concept

The following entities must be eligible for trending:

- `Listing`
- `Property`
- `LiveSession`
- `CreatorProfile`
- `ContentPost`
- `Product`

Recommended fields for `TrendSignal`:

- `entityType`
- `entityId`
- `window`
- `views`
- `uniqueViewers`
- `saves`
- `shares`
- `comments`
- `watchTime`
- `liveAttendance`
- `giftsValue`
- `rippleSpend`
- `conversionIntent`
- `score`
- `computedAt`

---

## 6. Ripple Economy Principles

`Ripple` is platform-native digital money and must be modeled as:

- wallet-based
- ledger-driven
- auditable
- usable for gifting, rewards, boosts, and platform purchases

Ripple must not initially be modeled as:

- a public blockchain asset
- a mutable integer field on `User`
- an untracked balance without double-entry or ledger evidence

---

## 7. Schema Design Notes For Next Step

When moving from this ERD to implementation, we should next define:

1. unique constraints
2. status enums and lifecycle transitions
3. nullable vs required ownership rules
4. cascade and delete strategies
5. which read models stay computed vs persisted
