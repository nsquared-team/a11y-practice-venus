# DISCOVER VENUS
## Accessibility Testing Guide

**Document Version:** 1.0
**Last Updated:** January 27, 2026

---

## Table of Contents

1. [Overview](#overview)
2. [Toggle System](#toggle-system)
3. [Issues by WCAG Principle](#issues-by-wcag-principle)
   - [Perceivable](#perceivable)
   - [Operable](#operable)
   - [Understandable](#understandable)
   - [Robust](#robust)
4. [Issues by Page](#issues-by-page)
5. [Testing Tool Expectations](#testing-tool-expectations)
6. [Issue Reference Table](#issue-reference-table)

---

## Overview

The Discover Venus website is an accessibility testing practice site with **intentional accessibility issues** that can be toggled on and off. This guide documents all intentional issues, their locations, and which testing tools should detect them.

### Purpose

This site allows accessibility testers to:
- Practice identifying common accessibility barriers
- Learn to use automated testing tools (axe, WAVE, Lighthouse)
- Understand issues that require manual testing
- Compare accessible vs. inaccessible implementations

### Important Notes

- **Issues are ENABLED by default** - The site loads with accessibility issues active
- Issues can be toggled off to see the accessible version
- Some issues are CSS-based (toggle-dependent), others are always present in HTML
- Not all issues are detectable by automated tools

---

## Toggle System

### How to Access

1. **URL Parameter:** Add `?a11y-admin=true` to any page URL
   - Example: `index.html?a11y-admin=true`

2. **Keyboard Shortcut:** Press `Ctrl+Shift+A` (or `Cmd+Shift+A` on Mac)

### Admin Panel Features

When admin mode is active, a panel appears in the bottom-right corner:
- Shows current state (Issues: ENABLED / DISABLED)
- Toggle button to switch between states
- State persists in localStorage across sessions

### Technical Implementation

- Toggle state stored in `localStorage` key: `discoverVenus_a11yIssuesEnabled`
- Body attribute: `data-a11y-issues-enabled="true"` when issues are enabled
- Custom event `a11y:toggle` dispatched when state changes
- API available at `window.A11yToggle`

### CSS-Dependent Issues

When `body[data-a11y-issues-enabled="true"]` is set:
- Low contrast text styles are applied
- Focus indicators are removed from marked elements
- Skip link becomes non-functional
- Touch targets become undersized
- Color-only error indicators are used

---

## Issues by WCAG Principle

### Perceivable

#### 1.1.1 Non-text Content (Level A)

| Issue | Location | Type | Tool Detectable |
|-------|----------|------|-----------------|
| Missing alt text on gallery image | `destination-detail.html` - Gallery image 3 | Always present | ✅ Yes |
| Empty alt on decorative images | Various pages | Intentional (correct) | N/A |

**Details:**
- In `js/destination-detail.js`, the third gallery image has `alt: ''` (empty string)
- This simulates a missing image description for informative content

#### 1.4.3 Contrast (Minimum) (Level AA)

| Issue | Location | Type | Tool Detectable |
|-------|----------|------|-----------------|
| Low contrast hero text | `index.html` - Hero section | CSS toggle-dependent | ✅ Yes |
| Low contrast modal close button | Modal dialogs | CSS class variant | ✅ Yes |

**Details:**
- Elements with class `.a11y-low-contrast` get `color: rgba(255, 255, 255, 0.5)` when issues enabled
- Contrast ratio falls below 4.5:1 requirement

#### 1.4.11 Non-text Contrast (Level AA)

| Issue | Location | Type | Tool Detectable |
|-------|----------|------|-----------------|
| Color-only form error indicators | `booking.html` - Form fields | CSS toggle-dependent | ⚠️ Partial |

**Details:**
- Class `.a11y-color-only-error` shows errors with border color change only
- No icon, no text - relies solely on color to convey error state

---

### Operable

#### 2.1.1 Keyboard (Level A)

| Issue | Location | Type | Tool Detectable |
|-------|----------|------|-----------------|
| Modal escape key disabled | Modals with `data-a11y-issue="no-escape"` | Data attribute | ❌ No |
| Lightbox arrow navigation not discoverable | `destination-detail.html` | Always present | ❌ No |

**Details:**
- Modals can be configured with `data-a11y-issue="no-escape"` to prevent Escape key closing
- Arrow key navigation in lightbox works but is not announced to screen readers

#### 2.1.2 No Keyboard Trap (Level A)

| Issue | Location | Type | Tool Detectable |
|-------|----------|------|-----------------|
| Modal focus trap disabled | Modals with `data-a11y-issue="no-focus-trap"` | Data attribute | ❌ No |

**Details:**
- Modals with `data-a11y-issue="no-focus-trap"` allow focus to escape to background content

#### 2.2.2 Pause, Stop, Hide (Level A)

| Issue | Location | Type | Tool Detectable |
|-------|----------|------|-----------------|
| Auto-playing carousel without pause | `index.html` - Featured Destinations carousel | Data attribute | ❌ No |

**Details:**
- Carousel has `data-a11y-issue="no-pause"` which disables pause on hover/focus
- Auto-advances every 6 seconds without user control
- Located in the Featured Destinations section

#### 2.4.1 Bypass Blocks (Level A)

| Issue | Location | Type | Tool Detectable |
|-------|----------|------|-----------------|
| Non-functional skip link | All pages - Skip link | CSS toggle-dependent | ❌ No |

**Details:**
- Skip link points to `#non-existent-main` when issues are enabled
- CSS hides it even on focus when issues are enabled
- Located at the top of every page with class `.skip-link.a11y-broken`

#### 2.4.4 Link Purpose (Level A)

| Issue | Location | Type | Tool Detectable |
|-------|----------|------|-----------------|
| Vague "Edit" link text | `booking.html` - Review step | Always present | ⚠️ Partial |
| Vague carousel navigation labels | `index.html` - Carousel | Always present | ⚠️ Partial |

**Details:**
- Review section has multiple "Edit" links without context
- Carousel buttons have `aria-label="Previous"` and `aria-label="Next"` without carousel context

#### 2.4.7 Focus Visible (Level AA)

| Issue | Location | Type | Tool Detectable |
|-------|----------|------|-----------------|
| No focus indicator on buttons | Elements with `.a11y-no-focus-visible` | CSS toggle-dependent | ❌ No |
| No focus indicator on outline buttons | Elements with `.a11y-no-focus` | CSS toggle-dependent | ❌ No |
| No focus indicator on destination cards | Elements with `.a11y-no-focus` | CSS toggle-dependent | ❌ No |

**Details:**
- CSS removes `:focus` outline and box-shadow when issues are enabled
- Affects interactive elements marked with specific classes

#### 2.5.5 Target Size (Level AAA) / 2.5.8 Target Size Minimum (Level AA)

| Issue | Location | Type | Tool Detectable |
|-------|----------|------|-----------------|
| Small touch targets | Elements with `.a11y-small-target` | CSS toggle-dependent | ⚠️ Partial |

**Details:**
- Touch targets reduced to 24px × 24px (below 44px × 44px recommendation)
- Affects elements with `.a11y-small-target` class

---

### Understandable

#### 3.2.2 On Input (Level A)

| Issue | Location | Type | Tool Detectable |
|-------|----------|------|-----------------|
| No visible labels (placeholder only) | `index.html` - Reservation form | Always present | ✅ Yes |

**Details:**
- Reservation form uses placeholders instead of visible labels
- Labels are missing entirely, not just visually hidden

#### 3.3.1 Error Identification (Level A)

| Issue | Location | Type | Tool Detectable |
|-------|----------|------|-----------------|
| Error messages not associated with inputs | `booking.html` - Form validation | Always present | ⚠️ Partial |

**Details:**
- Error messages displayed but not linked via `aria-describedby`
- Screen readers may not announce errors when focusing on invalid fields

#### 3.3.2 Labels or Instructions (Level A)

| Issue | Location | Type | Tool Detectable |
|-------|----------|------|-----------------|
| Labels not properly associated | `booking.html` - Some form fields | Always present | ✅ Yes |
| Checkbox groups without fieldset/legend | `booking.html` - Add-ons section | Always present | ⚠️ Partial |

---

### Robust

#### 4.1.2 Name, Role, Value (Level A)

| Issue | Location | Type | Tool Detectable |
|-------|----------|------|-----------------|
| Missing `aria-labelledby` on modals | Some modal dialogs | Always present | ⚠️ Partial |
| Missing `aria-label` on close buttons | Modal/lightbox close buttons | Always present | ⚠️ Partial |
| Missing `aria-labelledby` on lightbox | `destination-detail.html` - Lightbox modal | Always present | ⚠️ Partial |

**Details:**
- Some modals lack proper labeling for screen readers
- Close buttons may only have visual icon without accessible name

#### 4.1.3 Status Messages (Level AA)

| Issue | Location | Type | Tool Detectable |
|-------|----------|------|-----------------|
| Carousel slide changes not announced | `index.html` - Carousel | Data attribute | ❌ No |
| Lightbox counter not in live region | `destination-detail.html` - Lightbox | Always present | ❌ No |

**Details:**
- Carousel with `data-a11y-issue="no-live-region"` doesn't announce slide changes
- Lightbox image counter updates visually but not announced to screen readers

---

## Issues by Page

### All Pages

| Issue | WCAG | Description |
|-------|------|-------------|
| Skip link broken | 2.4.1 | Points to non-existent target when issues enabled |
| Focus indicators removed | 2.4.7 | Elements with a11y classes lose focus styling |

### Homepage (index.html)

| Issue | WCAG | Section | Description |
|-------|------|---------|-------------|
| Auto-play carousel | 2.2.2 | Featured Destinations | No pause control |
| Hidden slides focusable | 2.1.1 | Carousel | Tab reaches hidden content |
| No slide announcements | 4.1.3 | Carousel | No live region for changes |
| Vague nav labels | 2.4.4 | Carousel | "Previous"/"Next" lack context |
| Missing labels | 3.3.2 | Reservation form | Placeholder-only inputs |
| Low contrast text | 1.4.3 | Hero section | When issues enabled |

### Booking Page (booking.html)

| Issue | WCAG | Section | Description |
|-------|------|---------|-------------|
| Error messages unassociated | 3.3.1 | All form steps | Missing aria-describedby |
| Label association issues | 3.3.2 | Form fields | Some labels not linked |
| Missing fieldset/legend | 3.3.2 | Add-ons checkboxes | Group not properly marked |
| Vague "Edit" links | 2.4.4 | Review step | Multiple identical links |
| Color-only errors | 1.4.11 | Form validation | Border color only |

### Destination Detail (destination-detail.html)

| Issue | WCAG | Section | Description |
|-------|------|---------|-------------|
| Missing alt text | 1.1.1 | Gallery image 3 | Empty alt on informative image |
| Counter not announced | 4.1.3 | Lightbox | "1 of 4" not in live region |
| Arrow keys undiscoverable | 2.1.1 | Lightbox | Works but not announced |
| Missing aria-labelledby | 4.1.2 | Lightbox modal | No accessible name |
| Missing close button label | 4.1.2 | Lightbox | Icon-only button |

### Contact Page (contact.html)

| Issue | WCAG | Section | Description |
|-------|------|---------|-------------|
| FAQ accordion | - | FAQ section | Generally accessible (no intentional issues) |

---

## Testing Tool Expectations

### Automated Tool Detection

| Tool | Detectable Issues | Typically Missed |
|------|-------------------|------------------|
| **axe DevTools** | Missing alt text, contrast, missing labels, form issues | Keyboard traps, focus visibility, live regions |
| **WAVE** | Missing alt text, contrast, missing labels, empty links | Keyboard navigation, carousel timing |
| **Lighthouse** | Contrast, labels, alt text, basic ARIA | Dynamic issues, keyboard flow |
| **NVDA/VoiceOver** | All issues when manually tested | N/A (manual tool) |

### Issues Requiring Manual Testing

The following issues **cannot be detected by automated tools** and require manual testing:

1. **Keyboard Navigation**
   - Skip link functionality
   - Modal focus trapping
   - Carousel pause on focus
   - Arrow key discoverability

2. **Screen Reader Testing**
   - Live region announcements
   - Dynamic content updates
   - Modal labeling context
   - Error message association (full context)

3. **Visual Testing**
   - Focus indicator visibility
   - Touch target adequacy (context-dependent)
   - Color-only indicators (contextual)

### Recommended Testing Process

1. **Run automated scan** with axe or WAVE
2. **Keyboard test** - Tab through entire page
3. **Screen reader test** - Navigate with NVDA/VoiceOver
4. **Toggle comparison** - Disable issues and compare

---

## Issue Reference Table

### Quick Reference by Data Attribute

| Attribute | Effect | Location |
|-----------|--------|----------|
| `data-a11y-issue="no-focus-trap"` | Disables modal focus trapping | Modal elements |
| `data-a11y-issue="no-escape"` | Disables Escape key closing | Modal elements |
| `data-a11y-issue="no-pause"` | Disables auto-play pause on hover/focus | Carousel |
| `data-a11y-issue="focusable-hidden"` | Hidden slides remain in tab order | Carousel |
| `data-a11y-issue="no-live-region"` | No screen reader announcements | Carousel |

### Quick Reference by CSS Class

| Class | Effect | When Active |
|-------|--------|-------------|
| `.a11y-low-contrast` | Reduces text contrast | Issues enabled |
| `.a11y-no-focus-visible` | Removes focus outline | Issues enabled |
| `.a11y-no-focus` | Removes focus styling | Issues enabled |
| `.a11y-broken` (on skip link) | Makes skip link non-functional | Issues enabled |
| `.a11y-small-target` | Reduces touch target size | Issues enabled |
| `.a11y-color-only-error` | Shows color-only error state | Issues enabled |
| `.a11y-custom-checkbox` | Custom checkbox without ARIA | Issues enabled |

---

## Appendix: File Locations

### JavaScript Files
- `js/a11y-toggle.js` - Toggle system implementation
- `js/components.js` - Modal and carousel with a11y issues
- `js/destination-detail.js` - Gallery/lightbox issues
- `js/booking.js` - Form validation (issues in HTML structure)

### SCSS Files
- `sass/_a11y-issues.scss` - CSS-based toggleable issues
- `sass/_booking.scss` - Booking form styles

### HTML Files with Issues
- `index.html` - Skip link, carousel, reservation form
- `booking.html` - Multi-step form issues
- `destination-detail.html` - Gallery and lightbox issues

---

*This guide is part of the Discover Venus accessibility testing practice website.*
