# Flowgraph AI design system

Implementation of the visual design system specified in
[docs/product-design-specification.md](../../../docs/product-design-specification.md) (§14–15)
and [docs/architecture-assessment.md](../../../docs/architecture-assessment.md) (§14).

The system is designed for dense engineering work: compact controls, clear
typographic hierarchy, minimal motion, warm neutral surfaces, and a small set of
accent colors with defined semantic roles.

A live catalog of every component and state is served at [`/design-system`](../app/design-system/page.tsx).

## Structure

```text
design-system/
├── tokens/            CSS custom properties — the semantic source of truth
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
   - `proposal` — unapplied assistant-originated changes only.
   - Focus/selection is blue; the rust accent marks brand and primary actions.
3. **Monospace is functional, not aesthetic.** IDs, code, values, logs, and
   units use `--ds-font-mono` with tabular numerals (`mono`/`numeric` props on
   Input, Badge, TableCell). Never use monospace as an "AI" style.
4. **Density is a token concern.** Set `data-density="compact"` on the root or
   any subtree. Density changes spacing and control/row heights only — it never
   hides labels or changes information architecture.
5. **Themes.** Light is default; `data-theme="dark"` switches to graphite dark.
   The root layout resolves the system preference before first paint.
   Forced-colors mode defers to system colors.
6. **Elevation is reserved** for overlays, menus, dialogs, and dragged items.
   Structure comes from 1 px dividers and alignment, not nested cards.
7. **No synonym components.** Adding a component requires a user need the
   existing inventory cannot serve. Product composites (GraphProposalCard,
   DiagnosticList, LogViewer…) live in their feature directories and consume
   these foundations — they do not belong in this package.

## Usage

Tokens are imported once in `app/layout.tsx`. Application code imports
components from the barrel:

```tsx
import { Button, FormField, UnitInput, useToast } from "@/design-system";

<FormField label="End time" hint="Total simulated time." required>
  <UnitInput unit="s" defaultValue="1.0" />
</FormField>
```

`FormField` wires label/help/error ids and `aria-invalid` to its child control
automatically — every input in this package calls `useFormField()`.

Interactive providers (mount once near the root):

```tsx
<TooltipProvider>
  <ToastProvider>{children}</ToastProvider>
</TooltipProvider>
```

## Accessibility

Target: WCAG 2.2 AA (product spec §17).

- Behavioral primitives come from [Radix UI](https://www.radix-ui.com/primitives)
  (dialogs, menus, selects, tabs, toasts…): focus trapping, dismissal,
  typeahead, and roving tabindex are handled there; we own the API and styling.
- Hand-rolled composites follow the
  [WAI-ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/patterns/):
  Combobox and CommandPalette implement the combobox pattern with
  `aria-activedescendant`; Tree implements the tree pattern with a roving
  tabindex; SplitView's handle is a keyboard-operable `role="separator"`.
- Focus rings use `outline` (visible in forced-colors), offset to stay distinct
  from selection borders.
- All animation honors `prefers-reduced-motion`.
- Icon-only actions require a `label` (enforced by `IconButton`'s API).
  Add a `Tooltip` when the surrounding interface does not make the action clear.
- Live-region announcements: `StatusMessage announce` for routine state,
  `role="alert"` reserved for blocking danger states.

## Governance (spec §15.3)

- Every new component needs a documented user need — check the inventory and
  the `/design-system` catalog first.
- Cover default, hover/focus, disabled, loading, empty, error, long-content,
  dark-theme, and compact-density states; add the specimen to the catalog page.
- Storybook, interaction tests, accessibility scans, and visual regression in
  CI are the planned next step for this package (architecture blueprint §14.2);
  the `/design-system` route is the interim reference.
