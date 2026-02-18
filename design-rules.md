# Design rules (Naboo / ai-planner-design)

Use this document as the single source of truth for UI and copy. Follow it in all new and updated UI.

---

## Typography

- **Font:** Aeonik only. Use `font-sans` (Tailwind) or `var(--font-sans)`; body is already set in `globals.css`.
- **Weights:** `font-normal` (400), `font-medium` (500), `font-semibold` (600). Prefer normal or medium for body and labels; semibold only for brand/logo (e.g. “Naboo” in sidebar).
- **Sizes and tracking:** Prefer explicit sizes with negative letter-spacing for headlines and UI text:
  - **Page title:** `text-[24px]` or `text-[18px]`, `font-medium`, `tracking-[-0.48px]` / `tracking-[-0.36px]`.
  - **Section title:** `text-[18px]` or `text-[16px]`, `font-medium`, `tracking-[-0.36px]` / `tracking-[-0.32px]`.
  - **Body / labels:** `text-[14px]` or `text-[15px]`, `font-normal` or `font-medium`, `tracking-[-0.28px]` / `tracking-[-0.3px]`.
  - **Small / captions:** `text-[13px]` or `text-[12px]`, `tracking-[-0.22px]` / `tracking-[-0.12px]`.
- **Never use all uppercase for anything.** No `uppercase` class, no `text-transform: uppercase`, and no copy written in ALL CAPS. Use sentence case or title case (e.g. “Action required”, “Recents”) instead.

---

## Colors

Use tokens from `@/data/constants` — **FIGMA.colors**:

| Token       | Hex / value           | Use |
|------------|------------------------|-----|
| `black`    | `#212724`             | Primary text, strong emphasis. |
| `white`    | `#ffffff`             | Cards, inputs, modals. |
| `grey`     | `#737876`             | Secondary text, labels, disabled. |
| `greyLight`| `#f1f1f1`             | Backgrounds (pills, inactive tabs, list hover). |
| `green`    | `#C6E278`             | Primary actions, success, active counts, “new” badges. |
| `border`   | `rgba(0, 0, 0, 0.1)`  | Borders, dividers. |

- Prefer `FIGMA.colors.*` in `style={{ }}` or Tailwind only where the config maps (e.g. `text-black` if it resolves to the same black). Avoid hardcoding hex for primary UI except for one-off backgrounds (e.g. page bg `#F8F9FC`).
- Decorative or semantic accents (e.g. alert red for “expiring”) can use inline hex or a small palette extension; keep primary UI on the tokens above.

---

## Radius and spacing

- **FIGMA.radius:** `button: 4`, `card: 4` (px). Use for buttons, cards, inputs (e.g. `rounded-[4px]`, `rounded-lg` where 8px is acceptable).
- **Cards / containers:** Rounded corners (4–8px), light border `FIGMA.colors.border`, optional subtle shadow.
- **Consistent padding:** Sidebar nav items `px-3 py-2.5`; page content `px-4 py-6` or `px-6 py-6`; card inner `p-4`.

---

## Layout and structure

- **App shell:** Sidebar 240px; main content area flexes. Sidebar visible for all `/events/*` routes (overview, list, wishlist, new, [eventId], archived).
- **Content width:** Constrain main content with `max-w-[640px]` or `max-w-[760px]` where appropriate; full width for tables/lists is fine.
- **Backgrounds:** Page background `#F8F9FC`; sidebar and cards `FIGMA.colors.white`; subtle grey for inactive states `FIGMA.colors.greyLight`.

---

## Components and patterns

- **ChatInput (AI input):** Rounded border, shadow, 17px text, placeholder e.g. “What are you planning?” or “Ask any question…”. Auto-resize textarea (max height ~200px), Enter to submit. Submit button: round, `FIGMA.colors.green`, no heavy primary styling (neutral in rafale style).
- **Buttons:** Primary: green background; secondary: border + white/grey background. Use `rounded-[4px]` or `rounded-lg`, `font-medium`, `text-[14px]` or `text-[15px]`.
- **Navigation (sidebar):** Active state: `FIGMA.colors.black` text, `FIGMA.colors.greyLight` background. Inactive: `FIGMA.colors.grey`. Hover: `hover:bg-black/[0.04]`.
- **Cards (e.g. ProposalCard, action-required):** White bg, border, padding, optional hover state. Use same radius and border token.
- **Pills / badges:** Small labels (e.g. “1 new quote”, status): `rounded-full`, padding `px-2.5 py-1` or similar; green for positive/new, grey for neutral.

---

## Copy and language

- **Language:** English only. No i18n in this design phase; all strings are plain English.
- **Labels:** Sentence case or title case. Examples: “My events”, “Action required”, “Recents”, “Wishlist”, “What are you planning?”.
- **Again: never use all uppercase** for headings, labels, or buttons (no “ACTION REQUIRED”, “RECENTS”, etc.).

---

## Accessibility and behavior

- Use semantic HTML (`nav`, `main`, `section`, headings hierarchy). Provide `aria-label` where useful (e.g. “Event navigation”, “Breadcrumb”).
- Focus and hover states: visible and consistent (e.g. border or background change). Don’t rely on color alone for critical info.
- Truncation: use `truncate` or `line-clamp-1` with a title attribute where the full text matters.

---

## Summary checklist

- [ ] Aeonik only; sizes and tracking as above.
- [ ] Colors from `FIGMA.colors`; no random hex for primary UI.
- [ ] Radius 4px for buttons/cards unless a spec says otherwise.
- [ ] **No all-caps anywhere** — use sentence or title case.
- [ ] English only; clear, concise labels.
- [ ] Sidebar and ChatInput/Card patterns as described.
