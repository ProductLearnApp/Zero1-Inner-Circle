# Zero1 Money Circle — UI Design Brief

## Purpose

This document is a complete specification for redesigning the Zero1 Money Circle application's UI. All functionality is already implemented and working. The goal is to produce a higher-quality visual design for each screen, then hand the designs back for code integration.

---

## 1. Brand & Design System

### Identity

- **Product name:** Zero1 Money Circle
- **Nature:** An exclusive private event — invitation-only, curated crowd
- **Tone:** Premium, dark, minimal. Think luxury event ticketing crossed with a modern SaaS admin tool.
- **NOT:** Bright, playful, consumer app. This is for event organizers and their vetted guests.

### Color Palette

| Token | Hex | Usage |
|---|---|---|
| `--bg` | `#0A0A0F` | Page backgrounds |
| `--card` | `#161616` | Card / panel surfaces |
| `--border` | `#252525` | Dividers, input borders |
| `--accent` | `#F2BA30` | Gold — primary action color, highlights |
| `--muted` | `#666` | Secondary text, placeholders |
| White | `#FFFFFF` | Primary text |

> The accent gold (#F2BA30) is the only color — everything else is near-black and grey. The gold must feel deliberate and rare, not used on everything.

### Typography

- **Font:** Geist (already loaded) — clean, geometric, modern
- **Scale:**
  - Page titles: 24px bold
  - Section headers: 14px semibold
  - Body: 14px regular
  - Labels / captions: 12px
  - Monospaced data (seat labels, phone numbers): Geist Mono

### Spacing & Radius

- Base unit: 4px
- Cards / containers: `border-radius: 16px`
- Inputs, buttons, badges: `border-radius: 8px`
- Pill badges: `border-radius: 999px`
- Consistent padding inside cards: 20–24px

### Elevation / Depth

No box shadows — depth is achieved purely through background color steps (`--bg` → `--card` → slightly lighter surface).

---

## 2. Admin Side — Screens

The admin section has a persistent navigation (sidebar on desktop ≥768px, bottom bar on mobile).

---

### Screen A — Admin Login

**URL:** `/admin`
**Device:** Desktop and mobile

**Current state:** Centered card with logo, email/password inputs, sign-in button.

**Redesign direction:**
- Full-page split layout on desktop: left half is a dark hero panel with a large, elegant Zero1 wordmark and a quote or tagline ("Curating the room since 2024"). Right half is the login form.
- On mobile: single centered card, same as now but more polished.
- The "Z" icon should be replaced by a proper logo lockup: gold square icon + "Zero1" text + "Money Circle" in lighter weight below.
- The form card should feel premium: slightly elevated background (`#1a1a1a`), generous padding (40px), subtle inner border.
- Input fields: dark background (`#0A0A0F`), no visible border at rest — gold `1px` border on focus.
- CTA button: full-width, gold background, black text, 14px semibold. Should be the only bright element on the screen.
- No decorative elements — just typography, negative space, and the gold button.

**States to design:**
1. Default (empty form)
2. Filled (both fields have text)
3. Loading (button shows spinner, disabled)
4. Error (red inline message below password field)

---

### Screen B — Admin Navigation

**Component:** `AdminNav`
**Appears on:** All `/admin/*` pages

#### B1 — Desktop Sidebar (≥768px)

**Current state:** 224px fixed left sidebar, icon + label nav links, logout at bottom.

**Redesign direction:**
- Width: 220px
- Top: Logo lockup (icon + "Zero1 / Admin" two-line text). More whitespace below it.
- Nav links: icon on the left (replace current unicode symbols with proper SVG icons — see icon list below), label text, active state highlighted with gold background (`--accent`) and black text. Inactive: muted text, transparent background, gold left accent bar on hover.
- Bottom: thin divider line, then Logout link in muted text.
- No border on the right — let the background color contrast do the work (`--card` sidebar against `--bg` content).

**Icons (SVG, 18px):**
- Dashboard → grid / 4-square icon
- Attendees → person-list / table icon
- Check-in → QR code / scan icon
- Settings → sliders / gear icon
- Logout → arrow-left-from-box icon

#### B2 — Mobile Bottom Bar (<768px)

**Current state:** 4-tab bar at the bottom with icon + label.

**Redesign direction:**
- Thicker (64px height), pill-shaped active indicator behind the active tab (gold, full width of tab, 8px radius).
- Icon + label stack, active tab gets gold icon and black label (inside the pill). Inactive tabs: muted icon and text.
- No top border — use a very subtle blur / glass effect (`backdrop-filter: blur(12px); background: rgba(22,22,22,0.92)`).

---

### Screen C — Dashboard

**URL:** `/admin/dashboard`
**Device:** Desktop primary, mobile secondary

**Current state:** 4 stat cards in a grid, capacity progress bar, recent check-ins list.

**Redesign direction:**

**C1 — Stats Row**
4 stat cards in a 2×2 grid on mobile, 4-column row on desktop.
Each card:
- Background: `--card`
- Large number (36px bold, white)
- Label (12px uppercase, muted, letter-spacing)
- Subtitle / secondary stat (12px, muted)
- For "Checked In" card: add a small circular progress arc around the number (arc goes from 0 to the % checked in, gold stroke)
- For "Selected" card: add a small pill below showing "X of Y capacity"

**C2 — Capacity Bar**
Keep the capacity bar but make it more visual:
- Tall bar (12px height instead of 8px)
- Gold fill with a subtle shimmer gradient (linear: `#F2BA30` → `#FFD560`)
- Label on the right shows the percentage in gold
- Add tick marks at 25%, 50%, 75%, 100%

**C3 — Event Header**
Above the stats: a wider event banner card spanning full width.
- Left: Event name (20px bold), date · time · city in muted text below
- Right: A small pill badge ("Active" in green or "Upcoming") based on event state
- Background: slightly different from card — a subtle gold-tinted background `rgba(242,186,48,0.04)`

**C4 — Recent Check-ins List**
- Each row: avatar initials (gold circle with first letter, 32px), name, seat badge (monospace), check-in time on the right
- If the person has a +1 checked in: show a small "+1" pill badge next to their name
- Alternate row backgrounds (every other row slightly lighter: `rgba(255,255,255,0.02)`)
- Empty state: large centered icon (QR scan outline), "No check-ins yet" in muted text

---

### Screen D — Attendees

**URL:** `/admin/attendees`
**Device:** Desktop primary, mobile secondary

**Current state:** Header with action buttons, filter tabs, search input, full-width table with status dropdowns.

**Redesign direction:**

**D1 — Page Header**
- Left: "Attendees" title + count badge (rounded pill: "32 total" in gold)
- Right: two buttons — "↓ Sample CSV" (ghost/outline style), "+ Import CSV" (gold fill)
- Below header: stats row — 4 mini counters in a single row card: Total | Selected | Rejected | Not Selected — each as a number + label, separated by dividers

**D2 — Filter + Search Row**
- Search input: full-width on mobile, 280px on desktop, with a search icon inside on the left
- Filter pills: scrollable horizontal row of pill buttons (All / Selected / Not Selected / Rejected / Checked In)
- Active pill: gold background, black text
- Inactive: dark background, muted text, subtle border

**D3 — Attendees Table**
The table is the core of this page. Make it feel like a high-end data table.

Column order: # | Name | Phone | Status | Seat | Check-in time | Actions

- **Row height:** 56px
- **Name column:** Bold white text, 14px. Below in 12px muted: show phone number (so phone can be a secondary column or removed to save space on mobile)
- **Status column:** Colored pill badge
  - Not Selected: `#555` background, `#888` text
  - Selected: dark green background (`#1a2a10`), green text (`#6fcf30`) with a filled circle dot
  - Rejected: dark red background (`#2a0f0f`), red text (`#cf4444`)
  - Checked In: dark blue background (`#0f1f2a`), blue text (`#30b0cf`)
  - Clicking the pill opens a small dropdown to change status (same as current)
- **Seat column:** Monospaced gold text (`--accent`), or an em dash if unassigned. Click to edit inline (same as current).
- **Check-in column:** Show only on desktop. Green tick + time if checked in, em dash if not.
- **Actions column:** Icon buttons only (no text) — Pass icon (external link), WhatsApp icon, Delete (trash) icon. On hover: each icon gets a subtle gold ring.

**Mobile view of table:**
On mobile, collapse to a card list instead of a table. Each card:
- Name (bold) + status pill on the same row
- Seat label + phone on the second row in muted text
- Tap to expand: reveals action buttons

**D4 — CSV Preview Drawer**
When a CSV is selected, show a slide-up drawer (from bottom on mobile, modal on desktop):
- Header: "Import Preview — X rows" + Cancel + Confirm buttons
- Scrollable table inside the drawer showing the parsed rows (first 10, "+ X more")
- Column header row in muted uppercase

**D5 — Error / Warning Banners**
Database error: orange-tinted card with monospace instructions (keep current layout, just refine the visual)
No event: yellow-tinted card with instructions

---

### Screen E — Check-in (QR Scanner)

**URL:** `/admin/checkin`
**Device:** Mobile primary (used at the event entrance)

**Current state:** Stats bar at top, full-width camera viewfinder with animated scan line, result overlay for 3s, recent scans list below.

**Redesign direction:**

This is the most important mobile screen — it's used in real-time at the event door.

**E1 — Stats Bar**
- Compact: single row. Left: "Check-in" title. Right: "5 / 8" counter in white + a mini arc progress (same circular mini-chart style as dashboard). Below the counter: large "62%" in gold.
- The stats bar should not take more than 60px of vertical space.

**E2 — Camera Viewfinder**
- Full width, 4:3 aspect ratio (taller on mobile portrait = more useful)
- The camera feed fills the entire frame
- Dark vignette overlay at the edges (radial gradient from transparent center to rgba(0,0,0,0.5) at edges)
- Centered scan zone: a clean white-outlined rounded square (no fill, just the border), 240×240px
- Corner brackets: thick gold 3px lines at each corner of the scan zone (20px length)
- Animated scan line: thin gold horizontal line that sweeps top-to-bottom in a 2s loop
- Below the scan zone: "Align QR code within the frame" in small white/muted text
- Top-right: camera flip button (clean icon, semi-transparent dark circle)

**E3 — Scan Result Overlay**
Appears on top of the scanner for 3 seconds, then auto-dismisses.

States:
- **SUCCESS** (green): Large checkmark (animated — draws in with a stroke animation), "Checked In" label, attendee name (large), seat label badge. If +1 pass: "Guest Pass" label instead.
- **ALREADY_CHECKED_IN** (amber/gold): Warning triangle icon, "Already Checked In", name, "First checked in at HH:MM".
- **NOT_FOUND / INVALID_QR / WRONG_EVENT** (red): X icon (animated), error label, short message.

Each overlay: semi-transparent frosted glass background over the camera feed (do NOT replace the camera view — overlay on top of it). Appears with a quick scale-up animation (scale 0.95 → 1, 150ms ease-out).

**E4 — Recent Scans List**
Below the scanner: scrollable list of recent scans.
- Row: colored dot (green/amber/red) + name + badge ("Primary" or "+1") + time on right
- Max 5 visible before scrolling
- Subtle entrance animation: each new scan slides in from the top

---

### Screen F — Settings

**URL:** `/admin/settings`
**Device:** Desktop primary

**Current state:** Long form with sections for Event Details, Branding & Images, Plus One, WhatsApp Templates. Single "Save Settings" button at the bottom.

**Redesign direction:**

**F1 — Page Layout**
Instead of one long vertical form, use a two-column layout on desktop:
- Left column (60% width): Event Details + Plus One + WhatsApp templates
- Right column (40% width): Live pass preview card (a small rendered preview of how the pass will look with current settings — updates as you type the event name, change accent color, etc.)

**F2 — Section Cards**
Each section is a card (same as current). Improvements:
- Add a small section icon next to the section title (calendar icon for Event Details, palette icon for Branding, etc.)
- "Save Settings" becomes a sticky footer bar that appears once any field is changed: "You have unsaved changes" on the left, "Save" button on the right. This is clearer than a button buried at the bottom of the page.

**F3 — Image Upload Fields**
The current design uses plain text inputs for image URLs.
Redesign each image field as:
- A dashed-border upload area (300×160px for hero, 200×80px for logo, 200×80px for background)
- Shows a preview thumbnail when a URL is present
- "Replace" text link below the preview
- Still uses URL input (no actual file upload needed), but presented as a visual preview zone

**F4 — Accent Color Picker**
- Color swatch (24×24px circle) + hex input, same as current
- Add 5 preset swatches below: the current gold, white, teal, red, purple — quick selection

**F5 — Live Pass Preview (right column)**
A miniaturized version of the actual pass card showing:
- Event name (from form)
- Date and time
- A placeholder QR code (static decorative image)
- Seat label placeholder "A-01"
- The accent color applied to borders and labels in real-time
- Logo if set

Label it "Pass Preview" in muted text above.

---

## 3. Public Side — Screens

The public pass page is mobile-first. Attendees receive a WhatsApp link and open it on their phone. This page must feel premium and event-appropriate — like a digital version of a physical wristband or ticket.

---

### Screen G — Attendee Pass (Selected / Checked In)

**URL:** `/pass/[passId]`
**Device:** Mobile only (design for 390px wide, iPhone 14 viewport)

**Current state:** Hero banner image (optional), ticket card with QR code, event detail block, +1 invite section, notes block.

**Redesign direction:**

**G1 — Page Shell**
- Full dark background (`#0A0A0F`)
- Single-column layout, max-width 420px, centered on desktop

**G2 — Ticket Card** (the main element)

This is the centerpiece of the page. It should look like a physical premium event ticket.

Dimensions: full width of the container, roughly 340×520px.

Structure (top to bottom):
```
┌──────────────────────────────────┐
│  [Hero image — full width, 140px │
│   height, object-cover]          │
│  Event name overlaid in bold     │
│  white text at bottom-left       │
├──────────────────────────────────┤
│  [Logo — 80px wide, top-left]    │
│  [Status badge — "Confirmed"     │
│   top-right, gold pill]          │
│                                  │
│  [QR Code — 220×220px, centered, │
│   white background, 12px radius] │
│                                  │
├ ─ ─ ─ ─ ○ ─ ─ ─ ─ ─ ─ ○ ─ ─ ─ ┤  ← perforated tear line
│  Name (bold 18px)   Seat A-01   │
│  May 24, 2025       Confirmed   │
└──────────────────────────────────┘
```

Design details:
- Card background: `#161616` (or pass background image with a dark overlay)
- Subtle border: `1px solid rgba(255,255,255,0.08)`
- Top section (hero image): 140px tall, image fills it with object-cover. If no image: solid dark gradient.
- Event name overlay: 20px bold white with a gradient overlay below the image text for readability
- QR section: clean, centered. QR has white background (mandatory for scanning). 12px radius.
- Perforated tear line: a horizontal dashed line with small semicircles cut into the left and right edges (CSS: overflow:hidden on the card, negative-margin circles on the sides)
- Bottom section (attendee info): name in 18px bold white, seat label in gold monospace. Date and "Confirmed" badge side by side.

**G3 — Event Details Block**
Below the ticket card:
- Clean pill-style icon rows: 📅 Date · Time | 📍 City · Venue
- Background: slightly different card `#1a1a1a`

**G4 — Not Yet Selected State**
When `status !== SELECTED`:
- Show a "peeked" blurred ticket card (the ticket is visible but blurred, as if behind frosted glass)
- Overlay text: "⏳ Your application is under review" 
- Subtext: "We'll notify you via WhatsApp once selected."
- This creates intrigue rather than just showing a plain message

---

### Screen H — +1 Invite Section (on pass page, below ticket)

Only shown when attendee is SELECTED and allowPlusOne is true.

**H1 — No +1 yet (default)**

A standalone card below the event details:
- Heading: "Bring someone?" in 16px semibold white
- Subtext: "Your pass allows one guest. They'll get their own QR via WhatsApp."
- CTA: "Invite your +1 →" — gold button, full width

**H2 — Form open state**

The card expands (smooth height animation) to reveal:
- Name input field
- Phone input (with +91 prefix pill on the left)
- "Send invite" gold button
- Dismiss (×) top-right

**H3 — +1 confirmed state**

A green confirmation card appears:
- "✓ Attending with [Name]" in green text
- Below the ticket card: show BOTH ticket cards side by side (the primary ticket and the +1 ticket) — on mobile, this means stacking them slightly offset to show there are two tickets

---

### Screen I — +1 Guest Pass View

When a +1 views the same pass URL, they see the same page but with "Guest Pass" labeling on the QR ticket card, and the parent attendee's name shown as "Invited by [Primary Name]". The +1 invite section is hidden for +1 guests.

---

## 4. Component Inventory

These are the reusable components that need design specs:

### C-01 — StatCard
**Used on:** Dashboard, Attendees page header
Fields: `label` (uppercase muted), `value` (large number), `sub` (small muted subtitle)
Variant: `ring` — adds a circular progress arc around the value

### C-02 — StatusBadge
**Used on:** Attendees table, pass page
States: NOT_SELECTED | SELECTED | REJECTED | CHECKED_IN
Format: colored dot + label in a pill

### C-03 — StatusDropdown
**Used on:** Attendees table
Opens on click of StatusBadge. Shows the 3 settable statuses (not CHECKED_IN) with a checkmark on the current one.

### C-04 — DataTable
**Used on:** Attendees page
A styled table component with: hover row highlight, fixed column widths, sortable headers (future), inline editing on cells.

### C-05 — SectionCard
**Used on:** Settings, Dashboard
A card container with a `title` prop and optional `icon`.

### C-06 — TextInput
**Used on:** Settings form, Login, CSV preview
States: default, focused (gold border), error (red border + error message below), disabled

### C-07 — ToggleSwitch
**Used on:** Settings → Allow Plus One
States: on (gold track, white thumb translated right), off (dark track, white thumb at left)

### C-08 — QRTicketCard
**Used on:** Pass page
Props: `name`, `seatLabel`, `date`, `qrPayload`, `accent`, `logoUrl`, `bgUrl`, `status`, `label` ("Your Pass" or "+1 Guest Pass")

### C-09 — ScanResultOverlay
**Used on:** Check-in page
Props: `status` (SUCCESS | ALREADY_CHECKED_IN | error states), `attendee`, `passType`
Appears as an animated overlay on top of the camera feed.

### C-10 — CameraViewfinder
**Used on:** Check-in page
Contains: video feed, dark vignette, scan zone box with gold corner brackets, animated scan line, flip button.

### C-11 — PlusOneCard
**Used on:** Pass page
States: collapsed (invite CTA), form open, confirmed (with +1 name)

### C-12 — ImportDrawer / Modal
**Used on:** Attendees page (CSV preview)
Contains: table preview of parsed CSV rows, Cancel + Confirm Import buttons

---

## 5. Design Deliverables Required

Please produce the following frames, in this exact order:

| # | Frame | Notes |
|---|---|---|
| 1 | Design system / tokens sheet | Colors, typography scale, spacing, component anatomy |
| 2 | Screen A — Login (desktop) | Both columns |
| 3 | Screen A — Login (mobile) | Centered card |
| 4 | Screen B1 — Sidebar navigation | All 4 states: default, hover, active, with event name |
| 5 | Screen B2 — Mobile bottom bar | Default + active state |
| 6 | Screen C — Dashboard (desktop) | With populated data: 4 stat cards, capacity bar, recent scans list |
| 7 | Screen C — Dashboard (mobile) | 2-column stat grid, stacked layout |
| 8 | Screen D — Attendees (desktop) | Full table with all 4 status types, actions visible |
| 9 | Screen D — Attendees (mobile) | Card list view |
| 10 | Screen D — CSV Import modal | Preview table, 8 rows |
| 11 | Screen E — Check-in (mobile) | Camera active, no result showing |
| 12 | Screen E — Check-in result: SUCCESS | Green overlay on camera |
| 13 | Screen E — Check-in result: ALREADY_CHECKED_IN | Amber overlay |
| 14 | Screen E — Check-in result: Error | Red overlay |
| 15 | Screen F — Settings (desktop) | Two-column layout with live pass preview on right |
| 16 | Screen G — Pass page (mobile, selected) | Full ticket card + event details |
| 17 | Screen G — Pass page (mobile, under review) | Blurred ticket + "under review" state |
| 18 | Screen H1 — Pass page: +1 invite CTA | Card below pass |
| 19 | Screen H2 — Pass page: +1 form open | Expanded card with inputs |
| 20 | Screen H3 — Pass page: +1 confirmed | Two stacked ticket cards |
| 21 | Component sheet 1 — StatusBadge (all 4 states) + StatusDropdown | |
| 22 | Component sheet 2 — Inputs (all states) + ToggleSwitch | |
| 23 | Component sheet 3 — Buttons (primary, ghost, icon-only, loading, disabled) | |

---

## 6. Implementation Constraints

These constraints must be respected so that the implemented design is feasible without a full rewrite:

1. **Tech stack:** Next.js 14 App Router, React, Tailwind CSS, no UI component library. All styling is inline styles + Tailwind utilities.
2. **Dark theme only.** There is no light mode.
3. **Navigation structure is fixed.** The sidebar/bottom-bar layout cannot change (same routes).
4. **Animations:** CSS-only or Tailwind `transition` classes. No Framer Motion or GSAP.
5. **No images in the admin UI.** Only the pass page and the settings branding section deal with images.
6. **Typography:** Only Geist and Geist Mono (already loaded via `next/font`).
7. **Mobile breakpoint:** `768px` (md in Tailwind). Below this: mobile layout. Above: desktop layout.
8. **The QR code in the pass must remain on a white background** (required for scanning).
9. **The camera viewfinder must remain a `<video>` element** with a hidden `<canvas>` — it cannot be replaced with an `<img>` or third-party player.
10. **API shapes are fixed** — the UI changes cannot require new backend endpoints.

---

## 7. Reference Aesthetic

Style direction in plain words:
- **Vercel dashboard** — minimal, dark, data-dense, monochrome except for a single accent color
- **Physical premium ticket** — for the pass page specifically: the ticket card should feel like a real printed pass (perforated lines, QR code on white, embossed-looking name)
- **Luxury events** — the pass page is consumer-facing and should feel exclusive, not like a generic event app

What to avoid:
- Generic SaaS blues and greens
- Rounded pill buttons everywhere
- Gradient backgrounds
- Illustrations or icons with fills (use outline/stroke icons only in admin)
- Busy layouts — generous whitespace is the luxury signal
