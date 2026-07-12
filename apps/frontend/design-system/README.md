# Flowgraph AI design system

This package defines the visual tokens, component APIs, and interaction patterns
used by the frontend.

The system is designed for dense engineering work: compact controls, clear
typographic hierarchy, minimal motion, warm neutral surfaces, and a small set of
accent colors with defined semantic roles.

The current component catalog is served at
[`/design-system`](../app/design-system/page.tsx).

## Structure

```text
design-system/
├── tokens/            Shared semantic CSS custom properties
│   ├── primitives.css   Raw scales: color ramps, type, spacing, radii, motion
│   ├── semantic.css     Meaning: surfaces, text, actions, status, graph (light + dark)
│   └── density.css      Comfortable/compact control and row metrics
├── lib/               cx() and the shared Status vocabulary
├── components/        One folder per component family (co-located CSS modules)
└── index.ts           Public API — feature code imports from here only
```

## Rules

1. **Never use raw color values in feature components.** Consume semantic
   tokens (`--ds-surface-*`, `--ds-text-*`, `--ds-status-*`…). Primitives
   (`--ds-neutral-*`, `--ds-rust-*`…) are reserved for this package.
2. **Status is never color-only.** Every state pairing combines text, an icon
   or shape, and color as reinforcement. Use the shared `Status` type:
   `neutral | info | success | warning | danger | proposal`.
   - `success` — deterministically verified success only.
   - `danger` — errors, failures, destructive actions only.
   - `proposal` — unapplied model-generated changes only.
   - Focus/selection is blue; the rust accent marks brand and primary actions.
3. **Monospace is functional, not aesthetic.** IDs, code, values, logs, and
   units use `--ds-font-mono` with tabular numerals (`mono`/`numeric` props on
   Input, Badge, TableCell). Monospace is not a brand treatment.
4. **Density is a token concern.** Set `data-density="compact"` on the root or
   any subtree. Density changes spacing and control/row heights only — it never
   hides labels or changes information architecture.
5. **Themes.** Light is default; `data-theme="dark"` switches to graphite dark.
   The root layout resolves the system preference before first paint.
   Forced-colors mode defers to system colors.
6. **Elevation is reserved** for overlays, menus, dialogs, and dragged items.
   Structure comes from 1 px dividers and alignment, not nested cards.
7. **Avoid duplicate component roles.** Add a component only when the existing
   inventory cannot satisfy the documented interaction need. Feature-specific
   composites belong in their feature directories and consume these primitives.

## Usage

Tokens are imported once in `app/layout.tsx`. Application code imports
components from the barrel:

```tsx
import { Button, FormField, UnitInput, useToast } from "@/design-system";

<FormField label="End time" hint="Total simulated time." required>
  <UnitInput unit="s" defaultValue="1.0" />
</FormField>
```

`FormField` provides label, help, error, and validity relationships through
context. Compatible field controls consume those relationships with
`useFormField()`.

Interactive providers (mount once near the root):

```tsx
<TooltipProvider>
  <ToastProvider>{children}</ToastProvider>
</TooltipProvider>
```

## Accessibility

Target: WCAG 2.2 AA.

- Behavioral primitives come from [Radix UI](https://www.radix-ui.com/primitives)
  (dialogs, menus, selects, tabs, toasts…): focus trapping, dismissal,
  typeahead, and roving tabindex are handled there. Public component APIs and
  styling are defined in this package.
- Hand-rolled composites follow the
  [WAI-ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/patterns/):
  Combobox and CommandPalette implement the combobox pattern with
  `aria-activedescendant`; Tree implements the tree pattern with a roving
  tabindex; SplitView's handle is a keyboard-operable `role="separator"`.
- Focus rings use `outline` (visible in forced-colors), offset to stay distinct
  from selection borders.
- Motion durations resolve to `0ms` when `prefers-reduced-motion: reduce` is set.
- Icon-only actions require a `label` (enforced by `IconButton`'s API).
  Add a `Tooltip` when the surrounding interface does not make the action clear.
- Live-region announcements: `StatusMessage announce` for routine state,
  `role="alert"` reserved for blocking danger states.

## Governance

- Every new component needs a documented user need — check the inventory and
  the `/design-system` catalog first.
- Cover default, hover/focus, disabled, loading, empty, error, long-content,
  dark-theme, and compact-density states; add the specimen to the catalog page.
- Storybook, interaction tests, accessibility scans, and visual regression are
  planned additions. Until they are available, the `/design-system` route is the
  component reference.
