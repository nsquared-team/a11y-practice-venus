# Overlay Test Checklist — UserWay vs. Baseline

A scoresheet for comparing the **baseline** Discover Venus site against the
**UserWay overlay** clone, to see what the widget actually fixes vs. only
appears to fix.

- **Baseline (control, no widget):** https://discovervenus.site/
- **Overlay (UserWay installed):** https://discovervenus.site/overlay-test/

The intentional issues below are taken from
[ACCESSIBILITY-TESTING-GUIDE.md](ACCESSIBILITY-TESTING-GUIDE.md), which is the
source of truth for what's broken on purpose.

---

## How to run the comparison

1. **Turn the intentional issues ON** on both sites so you're testing the broken
   state. Append `?a11y-admin=true` to a URL to reveal the admin panel, or press
   **Ctrl+Shift+A** to toggle. State persists in `localStorage`, so set it on
   each site once. (Do this on the overlay clone too — the issues and the
   overlay are independent of each other.)
2. **Run automated scans** on each page of both sites (axe DevTools, WAVE,
   Lighthouse). Record counts in the "Auto (baseline)" / "Auto (overlay)"
   columns.
3. **Run manual + AT testing** (keyboard-only, plus a real screen reader —
   NVDA/JAWS/VoiceOver). This is where overlays usually fall down.
4. For the overlay site, test **twice**: once with the widget *closed* (default
   page load) and once after *opening it and enabling the relevant profile*
   (contrast, pause animations, etc.). Many overlay changes only apply after the
   user opts in.

### Scoring each issue

- **Fixed** — underlying semantics/DOM corrected; a real AT user benefits.
- **Masked** — visual-only change, or only works inside the overlay's own UI;
  AT users don't actually benefit.
- **Not fixed** — issue unchanged.
- **Worse** — the overlay introduced a new problem (e.g. its own controls aren't
  keyboard reachable, duplicate landmarks, focus stealing).

> ⚠️ Critical: a clean **automated** scan on the overlay site does **not** mean
> the issue is fixed. Confirm in the actual DOM and with an AT before scoring
> "Fixed". Overlays frequently change presentation without changing what's
> exposed to assistive tech.

---

## Scoresheet

Prediction key: 🟢 overlay plausibly addresses this · 🟡 overlay *claims* to but
verify · 🔴 outside what an overlay can do. Predictions are guesses to be
disproven — the point of the exercise is the actual result.

### Perceivable

| # | Issue | WCAG | Where | Prediction | Result | Notes |
|---|-------|------|-------|:---------:|--------|-------|
| 1 | Missing alt text on gallery image 3 | 1.1.1 (A) | destination-detail.html lightbox | 🟡 | | UserWay markets "AI" alt remediation — does it actually inject an `alt`/`aria-label`? Inspect the `<img>`. |
| 2 | Low-contrast hero text | 1.4.3 (AA) | index.html hero | 🟢 | | Only after enabling the contrast profile? Check ratio with the widget closed vs. open. |
| 3 | Low-contrast modal close button | 1.4.3 (AA) | modal dialogs | 🟢 | | Same — does contrast mode reach this control? |
| 4 | Color-only error indicators | 1.4.11 (AA) | booking.html fields | 🔴 | | Overlay can't add a text/icon error cue. |

### Operable

| # | Issue | WCAG | Where | Prediction | Result | Notes |
|---|-------|------|-------|:---------:|--------|-------|
| 5 | Modal Escape key disabled | 2.1.1 (A) | index.html "See More" modal (`no-escape`) | 🔴 | | Always active (not toggle-gated). Open the hero "See More" modal, press Esc — it won't close. JS behavior; overlay won't restore Esc. |
| 6 | Hidden carousel slides still focusable | 2.1.1 (A) | index.html carousel | 🔴 | | Tab into off-screen slides — still reachable with widget on? |
| 7 | Modal focus trap disabled | 2.1.2 (A) | destination-detail lightbox (`no-focus-trap`) | 🔴 | | Tab should escape to background — overlay unlikely to trap it. |
| 8 | Auto-play carousel, no pause | 2.2.2 (A) | index.html Featured Destinations | 🟡 | | UserWay has a "pause animations" toggle — does it actually stop this carousel? |
| 9 | Non-functional skip link | 2.4.1 (A) | all pages | 🔴 | | Overlay may add its *own* nav, but does the page's skip link work? |
| 10 | Vague "Edit" link text | 2.4.4 (A) | booking.html review step | 🔴 | | Overlay won't rewrite link text meaningfully. |
| 11 | Vague carousel nav labels | 2.4.4 (A) | index.html carousel | 🔴 | | "Previous"/"Next" lack context. |
| 12 | No visible focus indicator | 2.4.7 (AA) | buttons / cards (`.a11y-no-focus*`) | 🟡 | | Some overlays add a focus highlight — does it appear, and on these elements? |
| 13 | Small touch targets (24px) | 2.5.5 / 2.5.8 | `.a11y-small-target` | 🔴 | | Bigger-text/cursor won't enlarge hit areas. |

### Understandable

| # | Issue | WCAG | Where | Prediction | Result | Notes |
|---|-------|------|-------|:---------:|--------|-------|
| 14 | Placeholder-only, no real labels | 3.3.2 / 3.2.2 (A) | index.html reservation form | 🟡 | | Does the overlay add programmatic labels, or just leave placeholders? |
| 15 | Errors not associated with inputs | 3.3.1 (A) | booking.html validation | 🔴 | | No `aria-describedby` link — does AT announce the error on focus? |
| 16 | Labels not associated with fields | 3.3.2 (A) | booking.html | 🟡 | | Check `for`/`id` or `aria-labelledby` after overlay loads. |
| 17 | Checkbox group, no fieldset/legend | 3.3.2 (A) | booking.html add-ons | 🔴 | | Group context missing for AT. |

### Robust

| # | Issue | WCAG | Where | Prediction | Result | Notes |
|---|-------|------|-------|:---------:|--------|-------|
| 18 | Lightbox dialog missing `aria-labelledby` (no accessible name) | 4.1.2 (A) | destination-detail lightbox | 🟡 | | The only modal lacking a name — the homepage "See More" modal has a valid one. Does AI remediation give the dialog an accessible name? |
| 19 | Close button missing `aria-label` | 4.1.2 (A) | destination-detail lightbox close (×) | 🟡 | | Icon-only button — accessible name added? |
| 20 | Carousel changes not announced | 4.1.3 (AA) | index.html carousel (`no-live-region`) | 🔴 | | No live region — slide changes silent to AT. |
| 21 | Lightbox counter not in live region | 4.1.3 (AA) | destination-detail lightbox | 🔴 | | "Image X of Y" updates visually only. |

---

## Overlay's own footprint (regression check)

The overlay is itself code on the page — check it doesn't *introduce* problems:

| Check | Result | Notes |
|-------|--------|-------|
| Is the UserWay trigger button keyboard-reachable and operable? | | |
| Does the widget panel trap focus correctly / close on Esc? | | |
| Does it add duplicate or competing landmarks/roles? | | |
| Does it steal or mis-manage focus on load? | | |
| Render-blocking impact of the `<head>` script (Lighthouse perf / LCP)? | | |
| Does it interfere with the site's real screen-reader output (double-speak)? | | |

---

## Summary

| Outcome | Count | Issues (#) |
|---------|------:|------------|
| Fixed (genuinely helps AT) | | |
| Masked (visual only / overlay-UI only) | | |
| Not fixed | | |
| Made worse | | |

**Takeaway:**

_(Fill in after testing — e.g. "Of 21 intentional issues, the overlay genuinely
fixed N, masked M without helping AT users, and left the rest unchanged.")_
