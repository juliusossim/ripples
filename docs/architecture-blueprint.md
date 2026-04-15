# Ripples — Architecture Blueprint

> Living document describing the monorepo structure, module boundaries, dependency rules, and technology decisions.

---

## Table of Contents

1. [Package Topology](#package-topology)
2. [Dependency Graph](#dependency-graph)
3. [Module Boundary Rules](#module-boundary-rules)
4. [Layer Responsibilities](#layer-responsibilities)
5. [Backend Architecture](#backend-architecture)
6. [Data Flow](#data-flow)
7. [Tailwind Strategy](#tailwind-strategy)
8. [State Management](#state-management)
9. [Testing Strategy](#testing-strategy)
10. [Packages to Scaffold](#packages-to-scaffold)

---

## Package Topology

```
ripples/
├── ai/                           # scope:ai — AI domain
│   ├── core/                     # @org/core — Agent runtime, orchestration, base types
│   ├── functions/                # @org/functions — LLM function calling schemas
│   ├── prompts/                  # @org/prompts — Prompt templates, system messages
│   └── tools/                    # @org/tools — Tool implementations agents invoke
│
├── shared/                       # scope:shared — Framework-agnostic, zero UI dependencies
│   ├── config/                   # @org/config — Environment detection, runtime config
│   ├── types/                    # @org/types — Domain interfaces and type definitions
│   ├── utils/                    # @org/utils — Pure utility functions
│   └── api-client/               # @org/api-client — Typed HTTP client (fetch-based, no React)
│
├── ui/                           # scope:ui — React ecosystem
│   ├── primitives/               # @org/ui-primitives — shadcn + Tailwind base components
│   ├── web/                      # @org/ui-web — Web-only components (DOM APIs)
│   ├── native/                   # @org/ui-native — React Native-only components
│   └── hooks/                    # @org/ui-hooks — Shared React hooks (no DOM/RN imports)
│
├── features/                     # scope:feature — Vertical slices composing UI + AI
│   ├── chat/                     # @org/feature-chat — Chat interface + streaming
│   ├── agents/                   # @org/feature-agents — Agent management UI
│   └── dashboard/                # @org/feature-dashboard — Analytics and overview
│
├── apps/                         # scope:app — Deployable targets
│   ├── web/                      # React web app (Vite)
│   ├── mobile/                   # React Native app (Expo)
│   └── api/                      # NestJS backend
│
└── packages/                     # Publishable packages (future)
```

---

## Dependency Graph

```
apps/*       → features/* + ui/* + ai/* + shared/*
features/*   → ui/* + ai/* + shared/*
ui/*         → shared/* only
ai/*         → shared/* only
shared/*     → nothing internal
```

The dependency flow is strictly left-to-right:

```
shared/ (pure TS)  →  ai/ (LLM domain)  →  ui/ (React)  →  features/  →  apps/
```

Each column can only import from columns to its left, never right.

---

## Module Boundary Rules

Enforced via `@nx/enforce-module-boundaries` in ESLint.

| Scope           | Can Import                             | Cannot Import                            |
| --------------- | -------------------------------------- | ---------------------------------------- |
| `scope:shared`  | nothing internal                       | everything else                          |
| `scope:ai`      | `scope:shared`                         | `scope:ui`, `scope:feature`, `scope:app` |
| `scope:ui`      | `scope:shared`                         | `scope:ai`, `scope:feature`, `scope:app` |
| `scope:feature` | `scope:shared`, `scope:ai`, `scope:ui` | `scope:app`, other features              |
| `scope:app`     | everything                             | —                                        |

**Key constraints:**

- `shared/*` has **zero** framework dependencies (no React, no NestJS, no Angular)
- `ai/*` has **zero** UI dependencies
- `ui/*` has **zero** AI dependencies (it renders data, never calls LLMs directly)
- Features do **not** cross-import other features — shared logic goes to `shared/*` or `ui/hooks`

---

## Layer Responsibilities

### `shared/` — Zero framework dependencies

| Package           | Dependencies | Contains                                                                     |
| ----------------- | ------------ | ---------------------------------------------------------------------------- |
| `@org/types`      | none         | Domain interfaces: `User`, `Agent`, `Conversation`, `Message`, `ToolResult`  |
| `@org/utils`      | none         | Pure functions: `formatDate`, `truncate`, `retry`, `debounce`                |
| `@org/config`     | none         | `requireEnv()`, `getEnv()`, `getEnvFlag()`, environment detection            |
| `@org/api-client` | `@org/types` | Typed HTTP client wrapping `fetch`. Works in Node, browser, and React Native |

### `ai/` — LLM domain, no UI

| Package          | Dependencies           | Contains                                                      |
| ---------------- | ---------------------- | ------------------------------------------------------------- |
| `@org/core`      | `@org/types`, `openai` | Agent runtime, orchestration loop, memory store, chat engine  |
| `@org/functions` | `@org/types`           | LLM function calling schemas (JSON Schema + TypeScript types) |
| `@org/prompts`   | `@org/types`           | Prompt templates as composable functions                      |
| `@org/tools`     | `@org/types`           | Tool implementations: `(input) => Promise<ToolResult>`        |

### `ui/` — React ecosystem

| Package              | Dependencies                    | Contains                                                          |
| -------------------- | ------------------------------- | ----------------------------------------------------------------- |
| `@org/ui-primitives` | `@org/types`, Tailwind, shadcn  | `Button`, `Dialog`, `Input`, `Card`, `DataTable` — design system  |
| `@org/ui-web`        | `@org/ui-primitives`            | Web-specific: layouts, navigation, `<Sidebar>`, responsive shells |
| `@org/ui-native`     | `@org/types`, RN primitives     | RN-specific: `<NativeButton>`, `<NativeCard>`, navigation shells  |
| `@org/ui-hooks`      | `@org/types`, `@org/api-client` | `useChat()`, `useAgent()`, `useConversation()` — pure React hooks |

**`@org/ui-hooks` is shared between web and native.** It contains all data-fetching and state logic. Web and native only differ at the rendering layer.

### `features/` — Vertical slices

| Package                  | Dependencies                                              | Contains                                                     |
| ------------------------ | --------------------------------------------------------- | ------------------------------------------------------------ |
| `@org/feature-chat`      | `@org/ui-hooks`, `@org/ui-primitives` or `@org/ui-native` | Chat UI, message list, input, streaming, tool-call rendering |
| `@org/feature-agents`    | same pattern                                              | Agent CRUD, configuration, system prompt editor              |
| `@org/feature-dashboard` | same pattern                                              | Usage analytics, conversation history                        |

Each feature exports a top-level component and may have platform variants:

```
features/chat/
  src/
    lib/
      use-chat-feature.ts         # shared hook (logic)
      chat-feature.tsx             # web variant
      chat-feature.native.tsx      # native variant
```

### `apps/` — Thin shells, no business logic

| App           | Framework           | Role                                                            |
| ------------- | ------------------- | --------------------------------------------------------------- |
| `apps/web`    | React + Vite        | Routing, layout, composes features into pages                   |
| `apps/mobile` | React Native + Expo | Same: routing + feature composition                             |
| `apps/api`    | NestJS              | REST/WebSocket API, orchestrates `@org/core` agents server-side |

---

## Backend Architecture

```
apps/api/
  src/
    app/
      modules/
        chat/             # ChatModule — WebSocket gateway for streaming
        agents/           # AgentsModule — CRUD for agent configs
        auth/             # AuthModule — JWT + session management
      common/
        guards/           # AuthGuard, RateLimitGuard
        interceptors/     # LoggingInterceptor, TransformInterceptor
        filters/          # HttpExceptionFilter
    main.ts
```

NestJS modules import from `@org/core` (agent runtime), `@org/types` (shared interfaces), and `@org/config` (env vars). The API **never** imports from `ui/*` or `features/*`.

---

## Data Flow

```
[Web / Mobile App]
    ↓ uses @org/ui-hooks
    ↓ calls @org/api-client
    ↓ HTTP / WebSocket
[NestJS API]
    ↓ uses @org/core (agent runtime)
    ↓ calls OpenAI / tool dispatch
    ↓ streams response back
[Web / Mobile App]
    ↓ @org/ui-hooks receives stream
    ↓ @org/ui-primitives renders messages
```

---

## Tailwind Strategy

| Concern                           | Location                                       |
| --------------------------------- | ---------------------------------------------- |
| Tailwind preset (colors, spacing) | `ui/primitives/tailwind.preset.ts`             |
| Component styles                  | Co-located in `@org/ui-primitives` via classes |
| App-level Tailwind config         | `apps/web/tailwind.config.ts` extends preset   |
| CSS variables for theming         | `ui/primitives/src/styles/globals.css`         |

React Native uses **NativeWind** (Tailwind for RN) consuming the same preset, so design tokens stay consistent across platforms.

---

## State Management

| Layer        | Tool                    | Scope                                                               |
| ------------ | ----------------------- | ------------------------------------------------------------------- |
| Server state | TanStack Query          | API data fetching, caching, optimistic updates — in `@org/ui-hooks` |
| Client state | Zustand                 | Ephemeral UI state (sidebar open, active tab) — in `features/*`     |
| Form state   | React Hook Form + Zod   | Validation co-located with forms — in `features/*`                  |
| Streaming    | EventSource / WebSocket | Chat streaming — in `@org/ui-hooks/use-chat.ts`                     |

No Redux. TanStack Query + Zustand covers all cases with less boilerplate.

---

## Testing Strategy

| Layer           | Runner                   | What to Test                                                   |
| --------------- | ------------------------ | -------------------------------------------------------------- |
| `shared/*`      | Jest                     | Pure function logic, type guards, API client (mock fetch)      |
| `ai/*`          | Jest                     | Agent orchestration, tool dispatch, prompt assembly (mock LLM) |
| `ui/primitives` | Vitest + Testing Library | Component rendering, accessibility, interaction                |
| `ui/hooks`      | Vitest + renderHook      | Hook behavior, API integration (mock api-client)               |
| `features/*`    | Vitest + Testing Library | Feature integration, user flows                                |
| `apps/web`      | Playwright (e2e)         | Full user journeys                                             |
| `apps/api`      | Jest + supertest         | Endpoint contracts, WebSocket flows                            |

---

## Packages to Scaffold

When ready to implement, these are the new packages to create:

| Package                  | Location             | Generator / Setup                         |
| ------------------------ | -------------------- | ----------------------------------------- |
| `@org/api-client`        | `shared/api-client`  | `@nx/js:lib` — pure TS, Jest              |
| `@org/ui-primitives`     | `ui/primitives`      | `@nx/react:lib` — React + Vite + Tailwind |
| `@org/ui-web`            | `ui/web`             | `@nx/react:lib` — React + Vite            |
| `@org/ui-native`         | `ui/native`          | `@nx/react-native:lib` or `@nx/expo:lib`  |
| `@org/ui-hooks`          | `ui/hooks`           | `@nx/react:lib` — React hooks only        |
| `@org/feature-chat`      | `features/chat`      | `@nx/react:lib`                           |
| `@org/feature-agents`    | `features/agents`    | `@nx/react:lib`                           |
| `@org/feature-dashboard` | `features/dashboard` | `@nx/react:lib`                           |
| Web app                  | `apps/web`           | `@nx/react:app` — Vite                    |
| Mobile app               | `apps/mobile`        | `@nx/expo:app`                            |
| API                      | `apps/api`           | `@nx/nest:app`                            |

The existing `shared/ui` placeholder will be deleted — it is replaced by `ui/primitives`.

---

## Technology Stack Summary

| Concern          | Technology                    |
| ---------------- | ----------------------------- |
| Language         | TypeScript (strict, nodenext) |
| Monorepo         | Nx + pnpm workspaces          |
| Web framework    | React + Vite                  |
| Mobile framework | React Native + Expo           |
| Backend          | NestJS                        |
| UI components    | shadcn/ui + Tailwind CSS      |
| LLM SDK          | OpenAI SDK                    |
| State (server)   | TanStack Query                |
| State (client)   | Zustand                       |
| Forms            | React Hook Form + Zod         |
| Testing          | Jest, Vitest, Playwright      |
| Linting          | ESLint + Prettier             |
| CI               | Nx Cloud                      |
