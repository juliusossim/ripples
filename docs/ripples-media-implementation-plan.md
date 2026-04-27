# Ripples — Media Platform Remaining Work Plan

> Remaining implementation plan for the
> [Media Platform Spec](/Users/juliusossim/Documents/ripples/docs/ripples-media-platform-spec.md).
> The original media cutover work is no longer theoretical: the repo already
> ships `MediaAsset`-backed listing creation, direct upload initiation, and
> authenticated media finalization. This document now tracks what is still left
> to complete before the media platform can be treated as broadly production
> complete across Ripples surfaces.

---

## 1. Status

The foundational hard cutover is already landed.

Completed:

- `MediaAsset`, `MediaDerivative`, and attachment-backed property persistence in
  [schema.prisma](/Users/juliusossim/Documents/ripples/apps/api/prisma/schema.prisma)
- `mediaAssetId`-based property write contracts in
  [property.types.ts](/Users/juliusossim/Documents/ripples/shared/types/src/lib/models/property.types.ts)
- authenticated upload initiation, completion, and abort in
  [media.controller.ts](/Users/juliusossim/Documents/ripples/apps/api/src/app/media/media.controller.ts)
- direct upload orchestration in
  [api-client.ts](/Users/juliusossim/Documents/ripples/shared/api-client/src/lib/api-client.ts)
- property media ownership checks and canonical ownership writes in
  [property.repository.ts](/Users/juliusossim/Documents/ripples/apps/api/src/app/property/property.repository.ts)

Still incomplete:

- async processing and derivative creation
- explicit delivery/read policy for public versus restricted media
- multi-surface adoption outside the property/listing path
- lifecycle cleanup, quotas, and operator-facing moderation flow
- meaningful video support

This file should be retained because there is still meaningful work left, but it
should only track unfinished implementation.

---

## 2. Remaining Workstreams

## 2.1 Processing Pipeline And Derivatives

Goal:

- move media completion from a synchronous verified upload into a fuller
  processing lifecycle

Current state:

- upload completion verifies object bytes and marks the asset ready in
  [media.service.ts](/Users/juliusossim/Documents/ripples/apps/api/src/app/media/media.service.ts)
- `MediaDerivative` exists in schema, but derivative generation is not yet
  active

Build:

- queue-backed processing jobs
- derivative creation for listing cards, gallery views, and thumbnails
- explicit `uploaded -> processing -> ready` transitions where appropriate
- derivative-backed read mapping in property and future catalog read models

Files and areas:

- `apps/api/src/app/media/*`
- `apps/api/src/app/telemetry/*` for worker/runtime integration if needed
- `shared/types/src/lib/models/media.types.ts`
- property and future catalog mappers that should read derivative-aware media

Exit criteria:

- derivatives are generated and persisted
- ready assets can resolve a stable presentation model
- upload completion does not need to perform every final media step inline

## 2.2 Delivery And Read Contract

Goal:

- make client-facing media reads stable and policy-aware instead of relying on a
  simple direct asset summary

Current state:

- `UploadedMediaAsset` and `MediaAssetSummary` expose a thin asset summary
- media completion currently assigns a public URL in
  [media.service.ts](/Users/juliusossim/Documents/ripples/apps/api/src/app/media/media.service.ts)

Build:

- decide default delivery policy: public CDN URL, signed read URL, or mixed
- define richer read contracts with role, placeholder, dimensions, and resolved
  derivative URLs
- add media read routes or mappers where a stable API boundary is preferable to
  exposing storage-derived URLs directly

Files and areas:

- `shared/types/src/lib/models/media.types.ts`
- `apps/api/src/app/media/*`
- property and future catalog/profile/content read mappers

Exit criteria:

- client-facing media reads do not leak accidental storage concerns
- public versus restricted delivery is an intentional policy
- listing reads are ready for reuse across web, mobile, and future admin
  surfaces

## 2.3 Multi-Surface Media Adoption

Goal:

- extend the canonical media platform beyond listing creation

Current state:

- listing/property attachments are live
- attachment models for user profile, organization, and content exist in schema
- those non-listing attachment paths are not yet the active application flow

Build:

- profile avatar and banner attachment flows
- organization logo and banner attachment flows
- content/post media attachment flows
- catalog/product media attachment flows
- route and form integration for `/dashboard/content`, `/dashboard/catalog`,
  creator surfaces, and related publishing workflows

Files and areas:

- `apps/api/src/app/media/*`
- `apps/api/src/app/content/*`
- `apps/api/src/app/catalog/*` when the domain is introduced
- `shared/types/src/lib/models/*`
- `ui/web/src/lib/*`
- `apps/web/src/routes/dashboard-*`

Exit criteria:

- non-listing publishing surfaces use `mediaAssetId` attachments
- legacy URL fields stop acting as canonical media persistence
- one media platform can serve listing, creator, catalog, and organization
  surfaces consistently

## 2.4 Moderation, Cleanup, And Operations

Goal:

- make the media system operationally safe at product scale

Current state:

- upload completion no longer auto-approves moderation
- there is no real moderation review flow, abandoned upload cleanup job, or
  asset lifecycle operations surface yet

Build:

- abandoned upload cleanup
- derivative cleanup on deletion
- quota and rate enforcement by intent and actor
- moderation review policy and operator hooks
- audit-friendly lifecycle transitions and rejection reasons

Files and areas:

- `apps/api/src/app/media/*`
- `apps/api/src/app/telemetry/*`
- future operator/dashboard surfaces

Exit criteria:

- storage does not accumulate abandoned or orphaned objects indefinitely
- moderation and rejection states are operationally useful
- media governance supports trust and operator workflows in the product roadmap

## 2.5 Video Phase

Goal:

- add video support only after image infrastructure is complete

Build later:

- container and codec verification
- poster generation
- delivery variants and transcoding strategy
- live/event cover and replay media policies

Exit criteria:

- video does not piggyback on image assumptions
- delivery and moderation policy are explicit for richer media

---

## 3. Recommended Sequence

1. processing pipeline and derivatives
2. delivery/read contract
3. multi-surface media adoption
4. moderation, cleanup, and operator workflows
5. video phase

This order keeps the current listing flow stable while turning the media system
into a reusable platform for the broader route and product roadmap.

---

## 4. Product Dependencies

These remaining workstreams directly unblock or materially improve:

- creator profile and attribution surfaces in the
  [Product Outcome Tracker](/Users/juliusossim/Documents/ripples/docs/ripples-product-outcome-tracker.md)
- `/dashboard/catalog/*`, `/dashboard/content`, and creator routes in the
  [Web Routing Plan](/Users/juliusossim/Documents/ripples/docs/ripples-web-routing-plan.md)
- trust and verification surfaces
- future live/event publishing

Until those workstreams land, the listing flow is in a good production-ready
state relative to the old local-file approach, but the repo does not yet have a
fully generalized media platform across all planned product slices.
