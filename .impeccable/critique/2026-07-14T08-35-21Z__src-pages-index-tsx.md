---
target: current dashboard UI/UX
total_score: 22
p0_count: 0
p1_count: 10
timestamp: 2026-07-14T08-35-21Z
slug: src-pages-index-tsx
---
# Code Vault Dashboard UX Critique

## Design Health Score

| # | Heuristic | Score | Key issue |
|---|---|---:|---|
| 1 | Visibility of system status | 2/4 | Loading and copy feedback exist, but refresh failures are hidden and Add Code can report false success. |
| 2 | Match system / real world | 3/4 | Destiny language is recognizable, but "Expired," "Found," and "No expiration" overstate what the data actually proves. |
| 3 | User control and freedom | 2/4 | Search and filters work, but zero-result views have no reset action and user-added codes cannot be redeemed from their card. |
| 4 | Consistency and standards | 3/4 | The component vocabulary is mostly consistent, but two empty-state implementations, dark-only toasts, and button-based external navigation create gaps. |
| 5 | Error prevention | 1/4 | Duplicate and unsupported extended codes close the modal and show success even though the catalogue remains unchanged. |
| 6 | Recognition rather than recall | 3/4 | Codes, reward names, imagery, and status labels are visible; category labels still require domain knowledge. |
| 7 | Flexibility and efficiency | 2/4 | Search and filters help, but there is no sort, density option, keyboard shortcut, or progressive loading for 79 records. |
| 8 | Aesthetic and minimalist design | 2/4 | The theme is distinctive, but gradient text, glow, stars, particles, pings, confetti, and identical cards compete with the task. |
| 9 | Error recovery | 2/4 | Clipboard fallback exists, but refresh failure and empty results do not provide a direct recovery action. |
| 10 | Help and documentation | 2/4 | Sources and policy pages exist, but verification methodology and category meanings are not available at the decision point. |
| **Total** | | **22/40** | **Acceptable: significant improvements needed** |

## Anti-Patterns Verdict

The surface has a genuine Destiny-inspired identity, but it crosses into polished fan-site styling rather than confident product UI. The strongest AI-style tells are the gradient headline, repeated eyebrow copy, multi-color subclass accents, ornamental glow, identical card grid, and decorative motion applied across the page.

The deterministic CLI detector found five source-level warnings: three gradient-text instances and two bounce-easing instances. The browser detector reported 26 visible instances in the first viewport, dominated by low-contrast microcopy, AI-style palette usage, clipped positioned decoration, a hero eyebrow, wide-shadow hairlines, and repeated image-hover transforms. Repeated per-card image findings were deduplicated in this critique.

The detector overlay was successfully injected on a local dashboard instance and captured in `files/ux-detector-overlay.png`.

## Overall Impression

The first impression is attractive and recognizably Destiny, but the interface is optimized for atmosphere rather than redemption speed. The single biggest opportunity is to turn the 79-card wall into a focused, trustworthy catalogue with a compact task header, sticky search/filter controls, denser results, and accurate feedback.

## What Is Working

1. Codes are visually prominent and the per-card copy/redeem action is easy to locate.
2. Reward imagery, text status labels, responsive columns, and three themes provide a solid functional foundation.
3. Search, category counts, reduced-motion CSS, visible focus styling, and clipboard fallback show good accessibility intent.

## Cognitive Load

Four of eight checklist items fail: single focus, visual hierarchy, minimal choices, and progressive disclosure. Mobile renders all 79 cards in a page approximately 31,920 pixels tall; the 320px layout reaches roughly 32,940 pixels. The visual journey starts with a strong atmospheric peak, drops into a repetitive card wall, and ends with a footer most users will never reach.

## Recommendations

| Area | Current problem | Proposed improvement | Why it improves UX | Priority |
|---|---|---|---|---|
| Hierarchy | The mobile hero consumes more than half the first viewport and promotes a generic Bungie link before users choose a code. | Replace it with a compact catalogue header containing the title, trust summary, search, and last-verified state. Move the external redemption action to code rows. | Users enter the task immediately and avoid leaving before copying a code. | High |
| Layout | All 79 records render as tall, identical cards, producing an 11,576px desktop page and a 31,920px mobile page. | Default to a compact list or dense two-column catalogue, initially show 18-24 results, and add Load more or pagination. Offer a grid/list density toggle on desktop. | Improves scanning, orientation, performance, and return-to-position behavior. | High |
| Information architecture | Header metrics duplicate filter counts; the mobile hamburger contains no meaningful navigation; Unknown remains visible at zero. | Use a simple app bar with brand, verification/help, theme, and a clearly named local action. Keep status counts in one catalogue summary and hide empty categories. | Removes chrome that does not help a decision and makes navigation predictable. | Medium |
| Taxonomy | "D2 Expired" combines restricted, individual, vendor, and unavailable rewards under an inaccurate label. | Use Redeemable, Destiny 1, and Restricted / unavailable. Explain each category inline and surface the restriction reason on the row. | Matches the real acquisition state and protects trust. | High |
| Card readability | Every card repeats Active, Found, Expires, source, and two actions; "Found" is generated at load time and "No expiration" is stronger than the evidence. | Show reward image, reward name/type, code, status, source, and one primary action. Replace Found with actual released/verified metadata when available; use "No known expiry." | Removes fabricated-looking detail and makes each row easier to compare. | High |
| Typography | Orbitron and Rajdhani are used for brand, headings, controls, labels, and the redemption code; text glow further reduces code clarity. | Reserve Orbitron for the wordmark and one page heading. Use a highly legible UI sans for controls/body and a tabular monospace face for codes. Remove code text glow. | Makes ambiguous characters easier to verify and reduces visual fatigue. | High |
| Color and motion | Purple, orange, green, cyan, stars, aurora, mouse particles, ping dots, image zoom, glow, confetti, and staggered card entrances all compete. | Use neutral surfaces plus one Void accent, Strand only for verified/redeemable state, and Solar only for Bungie-bound actions. Keep one static atmospheric motif and 150-200ms state transitions. | Preserves Destiny identity while meeting the chosen focused, mysterious, precise personality. | High |
| Contrast and consistency | Browser detection flags low-contrast microcopy; muted text often uses 50% opacity; toasts remain dark in light mode. | Define semantic text tiers that pass WCAG AA in every theme, remove opacity from critical labels/placeholders, and theme overlays/toasts with the active mode. | Improves readability for low-vision users and makes light mode feel intentional. | High |
| Data presentation | The dashboard emphasizes total counts but provides no meaningful trend or user-specific insight. | Do not add decorative charts. Replace duplicate metrics with one line: "70 redeemable, 3 D1, 6 restricted - verified [date]." Optionally add "New since your last visit." | Communicates useful state without turning a catalogue into fake analytics. | Medium |
| Responsive access | Automated checks found 86 visible controls below the product's 44px target, including the theme control and clickable code text. | Give all primary mobile controls a 44px hit area, keep search/filter controls sticky, use horizontally scrollable status chips, and test at 320px and 200% zoom. | Supports one-handed use and reduces missed taps without introducing horizontal overflow. | High |
| Feedback states | `errorMessage` is never rendered; zero results have no clear action; loading hides immediately available bundled data behind a spinner. | Keep existing results visible while refreshing, show an inline retry banner on failure, announce result counts, and provide Clear search / filters in the empty state. | Users always understand what happened and have a direct recovery path. | High |
| Add Code flow | Duplicate and 17-character entries show "Code added" while the count stays at 79. The copy says "Share" even though the item is only stored locally, and unknown cards have no redeem action. | Rename to "Pin a code," describe local-only behavior, propagate validation results, keep the form open on failure, support the same formats end to end, and allow pinned unknown codes to copy and open Bungie. | Prevents false confirmation and turns a dead end into a coherent utility. | High |
| Redeem flow | "Copy & Redeem" is a button that calls `window.open` after awaiting clipboard access, so middle-click and standard new-tab behavior are unavailable and popup blocking is possible. | Render a native external link, copy synchronously where supported, and preserve Ctrl/Cmd/middle-click. Use inline copied feedback rather than success confetti on failure. | Aligns with browser conventions and makes the primary flow more reliable. | High |
| Semantics | The page has two H1 elements, and state/result changes are not consistently announced. | Keep one page H1, make the wordmark non-heading text, use a live region for result counts and refresh errors, and give theme selection an explicit accessible name/state. | Improves screen-reader orientation and state awareness. | Medium |

## Persona Red Flags

**Casey, distracted mobile user:** Must pass a large hero and two calls to action before search; then faces a 31,920px result page. Primary actions repeat near the bottom of every tall card rather than staying in the thumb zone.

**Jordan, first-time user:** "Add Code" and "Share a code" imply community submission, but the code is local-only. Duplicate and unsupported codes close with a success toast, teaching the wrong mental model.

**Sam, accessibility-dependent user:** Low-contrast labels, 86 sub-44px controls, two H1s, decorative movement, and unrendered refresh errors make keyboard, low-vision, and screen-reader use less reliable than the visual polish suggests.

## Minor Observations

- The footer contains trust and policy links after an exceptionally long result list; essential verification help should be available near the catalogue header.
- The unused rich `EmptyState` and `CodeGridSkeleton` components signal divergent state patterns.
- The same "Guardian Archives" eyebrow appears in both header and hero.
- Card hover lift and image zoom repeat 79 times and do not convey state.
- Source labels are useful but should link to verification evidence when a stable URL exists.

## Questions to Consider

1. If every effect that does not help users verify or redeem a code were removed, what single atmospheric motif should remain?
2. Is the primary object the reward users want, or the code they need to copy? The answer should determine card hierarchy.
3. Should "Add Code" become a local pin/check utility, or a real community submission workflow with moderation and provenance?
