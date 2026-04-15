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
pnpm nx run-many -t serve -p web,api --parallel=2
```

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

See [docs/ripples-v2-blueprint.md](docs/ripples-v2-blueprint.md) for the product and system
blueprint.

## Useful Commands

```sh
pnpm nx sync:check
pnpm nx run-many -t typecheck
pnpm nx run-many -t test
pnpm nx run-many -t lint
pnpm nx run-many -t build
```
