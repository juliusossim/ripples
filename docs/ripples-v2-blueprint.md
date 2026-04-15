# Ripples V2 System Blueprint

## Vision

Ripples is a feed-driven, AI-powered real estate platform combining social commerce, ripple-based
sharing economics, and intelligent property discovery.

Ripples is not a Zillow clone and not a CRUD-only listing platform. It is a social, AI, and commerce
engine for real estate.

## Product Philosophy

1. Feed beats search as the primary discovery loop.
2. Engagement drives conversion.
3. Every listing is content.
4. Sharing creates trackable ripple effects.
5. AI improves discovery over time.
6. Architecture must keep reusable logic out of apps.

## Core Domains

| Domain      | Responsibility                                       |
| ----------- | ---------------------------------------------------- |
| Property    | Listings, media, search                              |
| Ripple      | Share links, referral chains, commission attribution |
| User        | Identity, preferences                                |
| Transaction | Payments, escrow                                     |
| Experience  | Feed, interaction design, UI systems                 |
| AI          | Personalization, ranking, smart search               |

## Feed Engine

```text
Feed -> Interaction -> Data -> AI -> Better Feed -> Conversion
```

Feed content types are defined in `@org/types`:

```ts
type FeedItemType = 'property' | 'ripple' | 'campaign' | 'live-event' | 'news' | 'user-post';
```

MVP ranking should start with transparent heuristics:

- Recency
- Likes, saves, and shares
- Location relevance
- User preferences
- Seller performance
- Ripple activity

## Event System

Events are first-class platform data. They power feed ranking, AI learning, conversion tracking, and
business analytics.

Core event contracts live in `shared/types/src/lib/ripples.ts`.

## AI Layer

AI is a platform layer, not a feature. The first implementation should be deterministic and
observable:

1. Heuristic scoring
2. Weighted ranking
3. Recommendation interfaces
4. Learned ranking later

## Technical Direction

Frontend:

- React and TypeScript
- Tailwind CSS v4
- shadcn-style primitives in `ui/primitives`
- Web-specific composition in `ui/web`

Backend:

- NestJS modules
- GraphQL-ready API boundaries
- Event-first tracking

Data:

- PostgreSQL for core entities
- Redis for feed/session acceleration
- Search index for property discovery
- Object storage for media

## Nx Rules

- Apps compose, packages implement.
- Reusable UI belongs in `ui/*`.
- Shared contracts belong in `shared/types`.
- Business logic should move into domain packages before apps depend on it.
- No duplicated components.
- No untracked user interaction.
- AI ranking starts simple but must be designed as a core layer.

## Phase Roadmap

### Phase 1: Core Foundation

- Listing creation
- Property cards
- Feed integration
- Interaction tracking
- Basic ranking

### Phase 1.5: Feed System

- Multi-content feed API
- Infinite scroll UI
- Feed item components
- Engagement actions

### Phase 2: Ripple System

- Share links
- Referral chain
- Commission logic
- Tracking system

### Phase 3: Social Layer

- Likes and comments
- Activity feed
- Social proof indicators

### Phase 4: AI Layer

- Recommendations
- Smart search
- Ranking improvements

### Phase 5: Transactions

- Escrow
- Payments
- Verification

### Phase 6: Scale

- Agency tools
- Marketplace expansion
- Analytics platform
