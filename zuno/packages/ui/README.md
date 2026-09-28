# @zuno/ui

Shared, framework-agnostic UI primitives shared across the Next.js apps
(`shop`, `super-admin`). React Native apps (`customer`, `delivery`) use
their own native-styled components since RN and web cannot share DOM-based
components directly — this package documents the shared *design contract*
(props/variants) that both should mirror.

## Primitives (foundation only — do not add dozens more without a reason)
- Button
- Input
- Card
- Badge
- Modal / Dialog
- Table
- Tabs
- Dropdown
- Avatar

## States
- LoadingState
- EmptyState
- ErrorState
- Skeleton
