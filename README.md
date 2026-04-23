# Ripples

Ripples is a feed-first, AI-powered real estate platform for social discovery, sharing, and
conversion.

The product direction is:

- Feed-first property discovery instead of CRUD-first browsing
- Every listing is content
- Sharing creates measurable ripple effects
- Event tracking powers ranking, personalization, and conversion analytics
- AI is a core platform layer, starting with heuristics and evolving toward learned ranking

## Workspace

This is an Nx monorepo using pnpm workspaces.

```sh
pnpm install
pnpm dev
```

The `dev` script runs the web and API servers together:

```sh
pnpm dev
```

For web-side environment variables, copy [apps/web/.env.example](apps/web/.env.example) to
`apps/web/.env`. That file includes the optional Google Drive and Dropbox picker keys used by the
listing media uploader.

## Current Architecture

```text
apps/
  web/
  mobile/
  api/

ai/
  core/
  functions/
  prompts/
  tools/

features/
  agents/
  chat/
  dashboard/

shared/
  api-client/
  config/
  types/
  utils/

ui/
  primitives/
  web/
  native/
  hooks/
```

Apps are composition surfaces. Reusable UI, shared types, utilities, and domain contracts belong in
workspace packages.

## Roadmap Anchor

See these docs together for the current product and implementation direction:

- [docs/ripples-v2-blueprint.md](docs/ripples-v2-blueprint.md)
- [docs/ripples-implementation-tracker.md](docs/ripples-implementation-tracker.md)
- [docs/ripples-product-outcome-tracker.md](docs/ripples-product-outcome-tracker.md)
- [docs/ripples-scope-ownership-matrix.md](docs/ripples-scope-ownership-matrix.md)

## Useful Commands

```sh
pnpm nx sync:check
pnpm nx run-many -t typecheck
pnpm nx run-many -t test
pnpm nx run-many -t lint
pnpm nx run-many -t build
```
