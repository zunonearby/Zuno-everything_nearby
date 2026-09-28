# ZUNO Brand Assets

## Logo

`logo/logo-primary.png` — the provided ZUNO wordmark + leaf/pin mark, used
as the source of truth. It has not been redesigned or modified.

Only variants actually supplied are kept here. If additional variants
(horizontal lockup, stacked, mark-only, dark/light backgrounds, app icon)
are provided later, add them under `logo/` or `icon/` with matching names:

```
logo/
  logo-primary.png     <- provided
  logo-horizontal.png  <- not yet provided
  logo-stacked.png     <- not yet provided
  logo-dark.png        <- not yet provided
  logo-light.png       <- not yet provided
icon/
  app-icon.png         <- not yet provided
```

## Colors

See `packages/config/src/brand.ts` for the token source of truth:

| Token      | Hex       |
|------------|-----------|
| Primary    | `#0F5D3A` |
| Secondary  | `#22A06B` |
| Accent     | `#A7D56B` |
| Background | `#F8FAF6` |
| Surface    | `#FFFFFF` |
| Text       | `#17231D` |

Brand direction: modern, premium, clean, minimal, trustworthy, local, fresh.
Keep the primary palette to deep green + warm off-white — category accent
colors (`packages/config/src/categoryColors.ts`) are secondary and used
sparingly.
