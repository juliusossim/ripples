# Isolated `ui/composed` Dump Review

The current dump under `src/lib` is preserved in place for review, but it is
not part of the active `@org/ui-composed` package surface yet.

Why it is isolated:

- it imports a foreign model layer: `@org/models`
- it imports legacy local paths that do not exist here: `../ui/*`,
  `../../ui/*`, `../utils`, `../../utils`
- it duplicates repo-wide hooks that already belong elsewhere:
  `use-mobile`, `use-media`, `useCurrency`
- it mixes Storybook stories and test files directly into the library source
- it assumes packages that are not currently part of the approved workspace
  surface

Missing or foreign package surface referenced by the dump:

- `@org/models`
- `@org/shared-data`
- `@storybook/react-vite`
- `storybook/test`
- `react-router-dom`
- `embla-carousel-autoplay`
- `cmdk`

Needs repo-native adaptation even where a package already exists:

- `lucide-react`
  Already used elsewhere in the repo, but each composed component still needs
  package wiring and local prop/type normalization.
- `../ui/*` and `../../ui/*`
  Must be rewritten to `@org/ui-primitives` imports, not recreated locally.
- `../utils` and `../../utils`
  Must be rewritten to `@org/utils` or local pure helpers under
  `ui/composed/src/lib/*`.

Adapted into the active package surface:

- `src/lib/amount/*`
- `src/lib/badge/brand-badge/*`
- `src/lib/card/fashion-card/*`
- `src/lib/card/property-card/*`
- `src/lib/carousel/brand-carousel/*`
- `src/lib/carousel/media-carousel/*`
- `src/lib/carousel/product-carousel/*`
- `src/lib/carousel/property-carousel/*`
- `src/lib/command/*`
- `src/lib/error-message/*`
- `src/lib/form/*`
- `src/lib/grid/*`
- `src/lib/hooks/index.ts`
- `src/lib/loading-spinner/*`
- `src/lib/media/index.ts`
- `src/lib/nav/*`
- `src/lib/social-interactions/*`
- `src/lib/stars/*`
- `src/lib/typography/*`

Still parked for deliberate review:

- story files across `src/lib/**`
- old flat and foreign-case duplicates such as:
  - `src/lib/card/FashionCard.tsx`
  - `src/lib/card/PropertyCard.tsx`
  - `src/lib/carousel/brandCarousel/**`
  - `src/lib/carousel/mediaCarousel/**`
  - `src/lib/carousel/productCarousel/**`
  - `src/lib/carousel/propertyCarousel/**`
  - `src/lib/forms/**`
  - `src/lib/modals/**`
  - `src/lib/nav/NavListItem.tsx`
  - `src/lib/nav/navMenuWrapper.tsx`
  - `src/lib/product-grid/**`
  - `src/lib/socialInteractions/**`
  - dumped typography and amount files kept for comparison

Lower-confidence candidates that should wait for a product decision:

- `socialInteractions/SocialInteractions.tsx`
  Tied to future API interaction flows and a missing shared data layer.
- storybook-only examples and demo wrappers
  Useful for visual documentation, but not part of the runtime package surface.
- old router-bound wrappers
  These should stay parked unless we explicitly want web-only composed exports.
- `typography/**`
  Reintroduces a separate typography system instead of composing the primitives
  already present in this workspace.

Repo adaptation rules for future migrations:

- use folder-based modules only
- keep prop types in local `*.types.ts` files
- mark component props as `Readonly<...>`
- prefer `@org/ui-primitives`, `@org/ui-hooks`, `@org/utils`, and `@org/types`
- do not add duplicate hooks or local `ui/*` wrappers inside `ui/composed`
- only expose adapted concern folders through the active package surface
