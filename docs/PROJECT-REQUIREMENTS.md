# DISCOVER VENUS
## Project Requirements Document

**Version 1.0 • January 2026**

---

## 1. Project Overview

Discover Venus is a minimalist travel booking website set in a fictional future where luxury tourism to Venus is possible. The site serves as an accessibility testing platform while maintaining a realistic, aspirational travel booking experience. All destinations featured are based on real geographic features of Venus, lending an educational authenticity to the fictional tourism premise.

### 1.1 Concept

Venus, Earth's "sister planet" with its thick atmosphere and crushing surface pressure, provides the perfect setting for a luxury adventure travel site. Discover Venus offers exclusive tour packages to real Venusian landmarks—towering shield volcanoes, ancient tessera highlands, and dramatic rift canyons—presented through a clean, aspirational booking interface.

### 1.2 Design Philosophy

- **Minimalist and elegant:** White backgrounds with generous whitespace
- **High-end inspiration:** Think Airbnb Luxe or boutique hotel booking platforms
- **Warm accent colors:** Soft yellows and oranges reflecting Venus's golden atmosphere
- **Primary CTA color:** Teal/blue (#1A8BB3) for buttons and interactive elements
- **Typography:** Light, airy with careful hierarchy
- **Fallback backgrounds:** Sections with background images that contain text must have dark fallback background colors to ensure text remains readable if images fail to load

### 1.3 Current State

The site currently exists as a single polished HTML page with vanilla CSS and JavaScript. The existing design establishes a strong visual language with a hero section, quick booking bar, destination cards, package pricing tables, and newsletter signup. This document outlines the expansion to a 6-page site with faux booking functionality.

---

## 2. Site Structure

The expanded site will consist of eight interconnected pages:

| Page | File | Purpose |
|------|------|---------|
| Home | `index.html` | Landing page with hero, quick booking, featured destinations and packages |
| Destinations | `destinations.html` | Full catalog of Venus locations with filtering and detailed cards |
| Destination Detail | `destination-detail.html` | Individual destination page with gallery, details, and booking options |
| Packages | `packages.html` | Package comparison with detailed inclusions and pricing tiers |
| Booking | `booking.html` | Multi-step booking flow with traveler forms and confirmation |
| About | `about.html` | Company story, mission, team, and safety information |
| Contact | `contact.html` | Contact form, FAQ accordion, and support information |
| Credits | `credits.html` | Photo credits, licensing, and attribution information |

---

## 3. Page Specifications

### 3.1 Home Page (index.html)

**Purpose:** Primary landing page that establishes brand identity and drives users toward booking.

#### Sections

1. **Header:** Logo, navigation (About, Destinations, Packages, Contact), "Book Now" CTA button
2. **Hero Section:** Full-width atmospheric image, promotional offer overlay, scroll indicator
3. **Quick Booking Bar:** Destination dropdown, date pickers (from/to), guest counter, "Check Availability" button
4. **About Preview:** Image/text split layout with "Learn More" link to about page
5. **Top Destinations:** Grid of 6 destination cards with images and names, "See All Destinations" button
6. **Packages Overview:** Three package tiers (Mountains, Volcanoes, Plains) with pricing tables
7. **Featured Tour Banner:** Full-width promotional section for a specific tour
8. **Newsletter Signup:** Email input with subscribe button
9. **Footer:** Link to credits page, social links, copyright

---

### 3.2 Destinations Page (destinations.html)

**Purpose:** Comprehensive catalog of all Venus destinations with filtering and sorting capabilities.

#### Sections

1. **Page Header:** "Explore Venus" title with atmospheric subheading
2. **Filter Bar:** Region dropdown, experience type checkboxes, difficulty slider, price range
3. **Sort Controls:** Sort by popularity, price, duration, or alphabetical
4. **Results Count:** "Showing X of Y destinations" with active filter tags
5. **Destination Grid:** Cards with image, name, region tag, brief description, starting price, "View Details" button

#### Destinations Data

All destinations are based on real geographic features of Venus as mapped by the Magellan spacecraft and other missions.

##### Highland Regions (Terrae)

| Destination | Region | Type | Description |
|-------------|--------|------|-------------|
| Ishtar Terra | Northern Hemisphere | Continental Highland | Australia-sized highland featuring the highest mountains on Venus; home to Lakshmi Planum and Maxwell Montes |
| Aphrodite Terra | Equatorial | Continental Highland | South America-sized highland stretching along the equator; complex terrain with mountain ranges and deep troughs |
| Alpha Regio | Southern Highlands | Elevated Region | One of the first features identified on Venus; characterized by intersecting ridges and troughs |
| Beta Regio | Northern Midlatitudes | Volcanic Rise | 3,000 km dome created by volcanic activity; hosts major shield volcanoes Theia and Rhea Mons |
| Phoebe Regio | Southern Highlands | Highland Region | Exclusive highland named for the daughter of Uranus and Gaia; connected to major rift systems |

##### Major Volcanoes

| Destination | Region | Type | Description |
|-------------|--------|------|-------------|
| Maat Mons | Atla Regio | Shield Volcano | Venus's highest volcano at ~9 km relief; shows evidence of geologically recent volcanic activity confirmed in 2023 |
| Sapas Mons | Atla Regio | Shield Volcano | 400 km across with distinctive double flat-topped summit; flanks covered in overlapping lava flows |
| Theia Mons | Beta Regio | Shield Volcano | Largest volcano on Venus by area; over 4 km high with lava flows covering 800+ km; sits at junction of three major rifts |
| Maxwell Montes | Ishtar Terra | Mountain Range | Highest point on Venus at 11 km above mean radius; parallel ridges resembling the Appalachians but far higher |

##### Tessera Terrain

| Destination | Region | Type | Description |
|-------------|--------|------|-------------|
| Fortuna Tessera | Ishtar Terra | Tessera | Rugged "mosaic tile" terrain; among the oldest geological features on Venus at ~4.5 billion years |
| Tellus Regio | Northern Highlands | Tessera Region | Ancient deformed terrain showing complex patterns of intersecting ridges and grooves |

##### Plateaus & Plains

| Destination | Region | Type | Description |
|-------------|--------|------|-------------|
| Lakshmi Planum | Ishtar Terra | High Plateau | Tibet-like plateau bounded by mountains on most sides; relatively smooth interior |
| Lavinia Planitia | Southern Lowlands | Lowland Plains | Vast lowland region near the southern pole; features extensive ridge belts |
| Atalanta Planitia | Northern Lowlands | Lowland Plains | Major lowland plain adjacent to ridge belt concentrations near the northern pole |

##### Coronae (Volcanic-Tectonic Features)

| Destination | Region | Type | Description |
|-------------|--------|------|-------------|
| Artemis Corona | Aphrodite Terra | Corona | Largest corona on Venus at 2,600 km diameter; site of regional plate tectonics with 7.5 km elevation differences |
| Atne Corona | Aphrodite Terra | Corona | Circular volcanic feature with concentric fracture rings formed by mantle upwelling |

##### Chasmata (Rift Canyons)

| Destination | Region | Type | Description |
|-------------|--------|------|-------------|
| Diana Chasma | Aphrodite Terra | Rift Canyon | Part of the 7,400 km Dali-Diana system; features slopes exceeding 30°—the steepest on Venus |
| Devana Chasma | Beta-Phoebe Regio | Rift Zone | 4,000 km long extensional rift reaching 5 km depth; comparable only to Earth's East African Rift |
| Dali Chasma | Aphrodite Terra | Rift Canyon | Deep trough system nicknamed the "Scorpion Tail" of Aphrodite Terra; connects major highland regions |

##### Other Notable Features

| Destination | Region | Type | Description |
|-------------|--------|------|-------------|
| Baltis Vallis | Lowlands | Lava Channel | Longest channel on Venus at 6,800+ km—longer than the Nile; carved by ancient fluid lava flows |
| Vesta Rupes | Highlands | Scarp/Cliff | Dramatic cliff formations named after the Roman goddess of the hearth |

---

### 3.3 Destination Detail (destination-detail.html)

**Purpose:** Individual destination showcase with comprehensive information and direct booking options.

#### Sections

1. **Hero Gallery:** Large featured image with thumbnail carousel below
2. **Title Block:** Destination name, region tag, rating display, and quick stats (duration, difficulty, group size)
3. **Description:** Rich text description of the destination with expandable "Read More"
4. **Highlights:** Icon-based feature list (what's included, what to expect)
5. **Available Tours:** List of tour options for this destination with dates and pricing
6. **Booking Widget:** Sticky sidebar with date selector, guest count, package selection, and "Book Now" button
7. **Reviews Section:** User testimonials with star ratings and pagination
8. **Related Destinations:** Card row of similar or nearby destinations

---

### 3.4 Packages Page (packages.html)

**Purpose:** Detailed comparison of all available tour packages with full inclusions and pricing.

#### Sections

1. **Page Introduction:** Overview of package philosophy and what sets each tier apart
2. **Package Comparison Table:** Side-by-side feature comparison across all tiers
3. **Package Detail Cards:** Expanded view of each package with full inclusions list
4. **Add-Ons Section:** Optional upgrades and enhancements available for any package
5. **FAQ Accordion:** Common questions about packages, cancellation, and policies

#### Package Tiers

| Tier | Name | Focus | Price Range |
|------|------|-------|-------------|
| Standard | Mountains | Highland exploration | $15,000 – $25,000 |
| Premium | Volcanoes | Volcanic expedition | $30,000 – $45,000 |
| Luxury | Plains | Leisurely exploration | $50,000 – $75,000 |

---

### 3.5 Booking Page (booking.html)

**Purpose:** Multi-step booking flow for completing tour reservations.

#### Booking Steps

1. **Step 1 – Select Tour:** Choose destination, package tier, and travel dates
2. **Step 2 – Travelers:** Enter traveler information (name, age, emergency contact, medical requirements)
3. **Step 3 – Add-Ons:** Select optional upgrades (equipment rentals, photography packages, extended stays)
4. **Step 4 – Review:** Summary of selections with itemized pricing
5. **Step 5 – Confirmation:** Success message with booking reference number and next steps

#### UI Components

- **Progress indicator:** Visual step tracker showing current position and completion status
- **Form validation:** Inline error messages with clear guidance on required fields
- **Price summary:** Sticky sidebar showing running total as options are selected
- **Navigation:** "Previous" and "Continue" buttons with validation before advancing
- **Save progress:** Local storage persistence so users can return to incomplete bookings

---

### 3.6 About Page (about.html)

**Purpose:** Company story, mission, and credibility-building content.

#### Sections

1. **Our Story:** Timeline of company founding and Venus exploration milestones
2. **Mission Statement:** Company values and commitment to sustainable space tourism
3. **Leadership Team:** Team member cards with photos, titles, and brief bios
4. **Safety First:** Safety protocols, certifications, and emergency procedures
5. **Statistics Section:** Key figures (tours completed, satisfied travelers, safety record)
6. **Partners & Certifications:** Logo wall of fictional space agencies and certification bodies

---

### 3.7 Contact Page (contact.html)

**Purpose:** Customer support, inquiries, and self-service help.

#### Sections

1. **Contact Form:** Name, email, subject dropdown, message textarea, file attachment option
2. **Contact Information:** Email, phone, physical address (fictional Earth HQ)
3. **FAQ Accordion:** Expandable questions covering common topics
4. **Office Hours:** Support availability across time zones
5. **Map Embed:** Placeholder or stylized map showing headquarters location

---

### 3.8 Credits Page (credits.html)

**Purpose:** Centralized attribution for all third-party assets and licensing information.

#### Sections

1. **Page Header:** "Credits & Attribution" title with brief introduction
2. **Photo Credits:** List of all Unsplash photographers with links to their profiles and the specific images used
3. **Icon Credits:** Attribution to Font Awesome with license information
4. **Font Credits:** Attribution to Google Fonts (Lato, Merriweather)
5. **Technology Credits:** Libraries and tools used (modularscale-sass, etc.)
6. **License Information:** Creative Commons BY-SA 4.0 license details and what it means for users
7. **Creator Attribution:** Credit to Digitally as the original creators

#### Design Notes

- Clean, readable layout with clear sections
- Links to original sources where applicable
- License badges/icons for visual clarity

---

## 4. Interactive Components

### 4.1 Navigation

- Fixed header on scroll with transparent-to-solid transition
- Mobile hamburger menu with slide-in drawer
- Active page indicator in navigation
- Skip link for keyboard navigation

### 4.2 Forms

- Custom date picker with calendar dropdown
- Guest counter with increment/decrement buttons
- Custom styled select dropdowns
- Input validation with inline error messages
- Form progress persistence with localStorage

### 4.3 Cards & Galleries

- Destination cards with hover effects
- Image carousel with touch/swipe support
- Lightbox modal for full-size images
- Thumbnail navigation for galleries

### 4.4 Content Disclosure

- FAQ accordion with expand/collapse animations
- "Read More" text truncation with expansion
- Modal dialogs for package details
- Tab panels for organizing related content

### 4.5 Feedback & Status

- Toast notifications for form submissions
- Loading spinners for async operations
- Success/error state indicators
- Progress bar for multi-step forms

---

## 5. Accessibility Testing Opportunities

The site is designed to provide realistic scenarios for testing common accessibility patterns and potential issues.

### 5.1 Perceivable (WCAG 1.x)

- **Image alt text:** Destination images, team photos, gallery items
- **Color contrast:** White text on hero images, accent colors on white backgrounds
- **Text alternatives:** Icons with accessible names, decorative vs. informative images
- **Responsive text:** Text scaling and reflow at different viewport sizes

### 5.2 Operable (WCAG 2.x)

- **Keyboard navigation:** Tab order through interactive elements, skip links
- **Focus management:** Modal focus trapping, focus restoration after close
- **Custom controls:** Date picker, guest counter, carousel navigation
- **Touch targets:** Button sizes, spacing between interactive elements

### 5.3 Understandable (WCAG 3.x)

- **Form labels:** Proper labeling of all form inputs
- **Error handling:** Clear error messages with suggestions for correction
- **Consistent navigation:** Predictable menu structure across pages
- **Instructions:** Guidance for complex interactions like booking flow

### 5.4 Robust (WCAG 4.x)

- **Semantic HTML:** Proper heading hierarchy, landmarks, lists
- **ARIA usage:** Appropriate roles, states, and properties for custom widgets
- **Status updates:** Live regions for dynamic content changes
- **Valid markup:** Clean HTML that parses correctly across browsers

---

## 6. Intentional Accessibility Issues

For accessibility testing purposes, the following issues will be deliberately introduced. These should be documented in a separate testing guide so evaluators know what to look for.

### 6.1 Perceivable Issues

| Issue | Location | WCAG Criterion |
|-------|----------|----------------|
| Missing alt text on decorative images that convey information | Destination cards on home page | 1.1.1 Non-text Content |
| Low contrast text on hero image overlay | Hero section promotional text | 1.4.3 Contrast (Minimum) |
| Color-only indication of required fields | Booking form required fields | 1.4.1 Use of Color |
| Text embedded in images without alternatives | Package tier badges | 1.1.1 Non-text Content |
| Auto-playing carousel without pause control | Destination gallery | 1.4.2 Audio Control (adapted) |

### 6.2 Operable Issues

| Issue | Location | WCAG Criterion |
|-------|----------|----------------|
| Keyboard trap in date picker modal | Booking form date selection | 2.1.2 No Keyboard Trap |
| Focus not visible on some interactive elements | Secondary buttons, card links | 2.4.7 Focus Visible |
| Skip link present but hidden and non-functional | Site-wide header | 2.4.1 Bypass Blocks |
| Custom dropdown not keyboard accessible | Filter controls on destinations page | 2.1.1 Keyboard |
| Touch targets too small on mobile | Guest counter +/- buttons | 2.5.5 Target Size |
| No focus management when modal opens | Package detail modals | 2.4.3 Focus Order |

### 6.3 Understandable Issues

| Issue | Location | WCAG Criterion |
|-------|----------|----------------|
| Form inputs without visible labels (placeholder only) | Newsletter signup form | 3.3.2 Labels or Instructions |
| Error messages not associated with inputs | Contact form validation | 3.3.1 Error Identification |
| Inconsistent navigation order | Mobile vs. desktop menu | 3.2.3 Consistent Navigation |
| Form submission without confirmation | Newsletter signup | 3.3.4 Error Prevention |
| Unclear error messages ("Invalid input") | Booking form validation | 3.3.3 Error Suggestion |
| Language of page not specified | All pages | 3.1.1 Language of Page |

### 6.4 Robust Issues

| Issue | Location | WCAG Criterion |
|-------|----------|----------------|
| Missing ARIA labels on icon buttons | Social media links, close buttons | 4.1.2 Name, Role, Value |
| Invalid HTML (duplicate IDs) | FAQ accordion | 4.1.1 Parsing |
| Custom checkbox without proper role/state | Terms acceptance in booking | 4.1.2 Name, Role, Value |
| Dynamic content changes without live region | Price summary updates | 4.1.3 Status Messages |
| Improper heading hierarchy (skipped levels) | About page | 1.3.1 Info and Relationships |

### 6.5 Implementation Notes

- Each intentional issue should have exactly one clear instance to avoid confusion during testing
- Issues should be realistic—the kind that commonly occur in production websites
- A "clean" version of each component should exist in the codebase for comparison
- Consider adding a hidden admin toggle to enable/disable intentional issues for training purposes

---

## 7. Technical Implementation

### 7.1 Technology Stack

- **HTML5:** Semantic markup with ARIA enhancements
- **CSS3:** Vanilla CSS with custom properties for theming
- **JavaScript:** Vanilla ES6+ for interactivity
- **No frameworks:** Static site with front-end-only state management

### 7.2 File Structure

```
discover-venus/
├── index.html
├── destinations.html
├── destination-detail.html
├── packages.html
├── booking.html
├── about.html
├── contact.html
├── credits.html
├── css/
│   ├── styles.css          (compiled from SASS)
│   ├── styles.css.map      (source map for debugging)
│   └── components.css      (optional component overrides)
├── js/
│   ├── main.js             (global functionality)
│   ├── booking.js          (booking page specific)
│   └── components.js       (reusable components)
├── sass/
│   ├── style.scss          (main entry point)
│   ├── _vars.scss          (variables and color definitions)
│   ├── _mixins.scss        (reusable mixins)
│   ├── _reset.scss         (CSS reset)
│   ├── _elements.scss      (base element styles)
│   ├── _classes.scss       (utility classes)
│   ├── _header.scss        (header component)
│   ├── _hero.scss          (hero section)
│   ├── _reservations.scss  (booking form styles)
│   ├── _about.scss         (about section)
│   ├── _destinations.scss  (destination cards)
│   ├── _packages.scss      (package listings)
│   ├── _special-offer.scss (promotional banner)
│   ├── _newsletter.scss    (newsletter signup)
│   ├── _credits.scss       (credits section)
│   ├── _footer.scss        (footer component)
│   └── _a11y.scss          (accessibility utilities)
├── images/
│   ├── destinations/
│   ├── team/
│   └── ui/
├── webfonts/               (Font Awesome icons)
├── docs/
│   ├── PROJECT-REQUIREMENTS.md
│   └── DEVELOPMENT-PLAN.md
└── data/
    └── destinations.json
```

### 7.3 Build Tools

The project uses npm scripts for building assets:

```bash
# Install dependencies
npm install

# Build CSS (one-time compilation)
npm run sass:build

# Watch for changes during development
npm run sass:watch
```

**Dependencies:**
- `sass` - Dart Sass compiler
- `modularscale-sass` - Typography scale calculations

### 7.3 Responsive Breakpoints

| Breakpoint | Width | Layout Changes |
|------------|-------|----------------|
| Mobile | < 768px | Single column, hamburger menu |
| Tablet | 768px – 1024px | Two-column grids, condensed nav |
| Desktop | > 1024px | Full layout with sidebars |

### 7.4 Browser Support

- Chrome (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Edge (latest 2 versions)

---

## 8. Development Phases

### Phase 1: Foundation

- Refactor existing index.html for multi-page navigation
- Create shared header/footer components
- Establish CSS architecture with custom properties
- Build basic page templates for all routes

### Phase 2: Content Pages

- Complete Destinations listing page with filtering
- Build Destination Detail page template
- Implement Packages comparison page
- Create About and Contact pages

### Phase 3: Booking Flow

- Implement multi-step booking form
- Add form validation and error handling
- Build price calculation logic
- Create confirmation page with booking summary

### Phase 4: Enhancement

- Add image galleries and carousels
- Implement FAQ accordions
- Add localStorage for booking persistence
- Polish animations and transitions

### Phase 5: Accessibility Issues Implementation

- Introduce documented intentional accessibility issues
- Create testing guide with issue locations
- Build admin toggle for enabling/disabling issues
- Validate that issues are detectable with common testing tools

### Phase 6: Final Review

- Conduct full keyboard navigation audit
- Test with screen readers (NVDA, VoiceOver, JAWS)
- Verify color contrast compliance
- Validate all custom widget ARIA implementations
- Document all intentional issues for testers

---

*— End of Document —*
