# @org/ui-composed

Concern-shaped reusable UI assembled from `@org/ui-primitives`.

Use this library for presentation-focused compounds that are more specific than
primitives but still reusable across multiple product surfaces.

Examples:

- `property-carousel`
- `feed-post-shell`
- `listing-summary-card`

Boundary guidance:

- can depend on `@org/ui-primitives`, `@org/ui-hooks`, `@org/types`, and
  `@org/utils`
- should not own fetching, mutations, or page workflow logic
- keep feature- or domain-heavy assembly in feature-local packages until reuse
  is proven

Current status:

- the active package surface is intentionally limited to repo-aligned exports
- adapted modules currently available:
  - `amount`
  - `badge/brand-badge`
  - `card/fashion-card`
  - `card/property-card`
  - `carousel/brand-carousel`
  - `carousel/media-carousel`
  - `carousel/product-carousel`
  - `carousel/property-carousel`
  - `command/command-wrapper`
  - `command/suggestion-search`
  - `error-message`
  - `form`
  - `grid/product-grid`
  - `hooks` (repo-native re-exports only)
  - `loading-spinner`
  - `media` (repo-native re-export only)
  - `nav`
  - `social-interactions`
  - `stars/star-rating`
  - `typography`
- imported dumps that still rely on foreign package structure stay isolated until
  they are adapted to `@org/ui-primitives`, `@org/ui-hooks`, `@org/utils`, and
  local `*.types.ts` files
- see `ISOLATED_COMPOSED.md` for the current review inventory

This library was generated with [Nx](https://nx.dev).

## Running unit tests

Run `nx test ui-composed` to execute the unit tests via [Jest](https://jestjs.io).
