# StoreHubBD — Frontend Redesign Plan

> Mobile-first. Minimalistic. Professional. Built for Bangladeshi Facebook sellers.

---

## Design System

### Color Palette

**Primary Brand — Indigo**

| Token | Hex | Tailwind | Usage |
|---|---|---|---|
| `brand-primary` | `#4F46E5` | `indigo-600` | CTAs, active states, links |
| `brand-primary-hover` | `#4338CA` | `indigo-700` | Button hover |
| `brand-primary-light` | `#EEF2FF` | `indigo-50` | Sidebar active bg, chip backgrounds |
| `brand-primary-mid` | `#C7D2FE` | `indigo-200` | Borders on active elements |

**Accent — Amber** (used sparingly)

| Token | Hex | Usage |
|---|---|---|
| `accent` | `#F59E0B` | Landing page highlight word, callouts |
| `accent-light` | `#FFFBEB` | Feature icon backgrounds |

**Neutrals**

| Token | Hex | Usage |
|---|---|---|
| `gray-50` | `#F9FAFB` | Page backgrounds, table headers |
| `gray-100` | `#F3F4F6` | Card hover, empty state fills |
| `gray-200` | `#E5E7EB` | Borders, dividers |
| `gray-400` | `#9CA3AF` | Placeholder text |
| `gray-500` | `#6B7280` | Secondary labels, meta text |
| `gray-700` | `#374151` | Body text, table values |
| `gray-900` | `#111827` | Headings, primary text |

**Status Colors**

| Status | Background | Text | Border |
|---|---|---|---|
| Pending | `#FFFBEB` | `#B45309` | `#FDE68A` |
| Confirmed | `#F5F3FF` | `#6D28D9` | `#DDD6FE` |
| Shipped | `#EEF2FF` | `#4338CA` | `#C7D2FE` |
| Delivered | `#ECFDF5` | `#065F46` | `#A7F3D0` |
| Cancelled | `#FEF2F2` | `#991B1B` | `#FECACA` |

---

### Typography Scale

Font: **Geist Sans** (already loaded). Keep it.

| Token | Size | Weight | Usage |
|---|---|---|---|
| `display` | 40–56px | 800 | Landing hero headline only |
| `h1` | 24px | 700 | Page titles |
| `h2` | 18–20px | 600 | Section headings |
| `h3` | 16px | 600 | Card headings |
| `body-lg` | 16px | 400 | Landing paragraphs |
| `body` | 14px | 400 | Default body, form labels |
| `body-sm` | 13px | 400 | Table cells, meta info |
| `caption` | 12px | 400 | Helper text, timestamps |
| `mono` | 13px | 600 | **Order codes only** (Geist Mono) |
| `price` | 20–22px | 700 | Product prices (customer store) |

---

### Component Patterns

**Buttons**
- **Primary**: `bg-indigo-600 text-white rounded-xl px-5 py-2.5 font-semibold text-sm hover:bg-indigo-700 active:scale-[0.98] transition-all`
- **Secondary**: `bg-white border border-gray-200 text-gray-700 rounded-xl px-5 py-2.5 font-medium text-sm hover:bg-gray-50`
- **Danger**: `bg-red-50 text-red-600 border border-red-100 rounded-xl`
- **Ghost**: `text-indigo-600 font-medium text-sm` — inline links, back arrows
- **Full-width CTA (store)**: `w-full bg-indigo-600 text-white py-3.5 rounded-2xl font-bold text-base`

**Cards**: `bg-white rounded-2xl border border-gray-200`
Interactive cards add: `hover:shadow-md hover:border-gray-300 transition-all duration-150`

**Status Badges**: `inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold` with a 6px color dot before the label.

**Dashboard Stat Cards**: White card + 4px left accent bar (color-coded by status). Number in `text-4xl font-extrabold`, label in `text-xs font-medium uppercase tracking-wider text-gray-500`.

**Form Inputs**:
- `w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm bg-white`
- Focus: `focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-400`
- Error: `border-red-400 ring-2 ring-red-100`

**Empty States**: SVG illustration (80px) + bold heading + gray subtext + optional CTA button.

---

## Implementation Sequence

**Phase A — Foundation** (do first, everything else builds on this)
1. Color tokens in `globals.css`
2. Shared components: `Input.tsx`, `Button.tsx`, `StatusBadge.tsx`, `EmptyState.tsx`
3. Redesign `Sidebar.tsx` + create `BottomNav.tsx` (mobile bottom tabs)
4. Update `DashboardLayout` to show sidebar on desktop, bottom nav on mobile

**Phase B — Customer Store Pages** (highest business impact)
5. Store home `/(store)/[store]/page.tsx`
6. Product detail + bottom sheet order form
7. Order confirmation
8. Store 404

**Phase C — Auth & Landing**
9. Landing page
10. Register + Login (split layout)

**Phase D — Dashboard Pages**
11. Dashboard home
12. Products list → Add/Edit product
13. Orders list → Order detail
14. Settings

---

## Pages

---

### 1. Landing Page (`/`)

**Sections:**

**Navbar** (sticky, 60px, `bg-white border-b border-gray-100`)
- Left: StoreHubBD wordmark + small indigo logo square
- Right: "Sign In" ghost link + "Start Free →" primary button

**Hero** (`bg-white` with subtle indigo radial glow behind headline)
- Headline (display): *"Your Facebook Store, Finally Organized."* — "Finally" in `text-amber-500`
- Subheadline: "Turn DMs and comments into orders. Give every customer a real checkout link. Get SMS alerts. Track everything."
- Two CTAs: "Create Your Free Store →" (primary) + "See a Live Demo" (secondary)
- Trust line: `text-xs text-gray-400` — "No credit card. Free forever for small stores."
- Phone mockup SVG at slight angle (hidden on mobile)

**Social Proof Strip** (`bg-gray-50 border-y border-gray-100`)
- "Trusted by 500+ Facebook sellers in Bangladesh" + avatar circles + star rating

**How It Works** (3 steps)
- "Register" → "Add Products" → "Share & Get Orders"
- Each step: white card, centered icon in `bg-accent-light` circle, bold title, 2-line description
- Desktop: horizontal with `→` connectors. Mobile: stacked with `↓`

**Feature Highlights** (3 columns)
- Your own store link
- SMS order alerts
- Order status tracking pipeline

**CTA Banner** (`bg-indigo-600 rounded-3xl py-12 text-center`)
- "Start your free store today" in white
- "Get Started Free" button in white bg + indigo text

**Footer** (minimal, `text-xs text-gray-400 text-center`)

---

### 2. Register Page (`/register`)

**Layout**: Split screen — left panel (desktop only) + right form panel.

**Left Panel** (`bg-gradient-to-br from-indigo-600 to-indigo-800`, `hidden md:flex`)
- Brand quote in white
- 3 static testimonial chips
- "Already have an account? Sign in →" in `text-indigo-200`

**Right Panel** (form, single column)
- StoreHubBD logo + "Create your store" heading
- Fields:
  1. **Store Name** — input + `.storehubbd.com` suffix chip in `bg-indigo-50 text-indigo-600`
     - Live slug preview below: *"Your store will be at: arjha.storehubbd.com"* in `text-xs text-indigo-600`
  2. Your Name
  3. Email
  4. Phone — with `+880` prefix chip decorative
  5. Password — with show/hide toggle eye icon
- Error: red pill banner above submit (not inline per-field)
- Submit: "Create My Store →" full-width primary
- Footer: "Already have an account? Sign in"

**Mobile**: Single column only (left panel hidden). Store name suffix wraps below input if very narrow.

**Micro-interactions**: Live slug preview fades in as user types. Password toggle animates.

---

### 3. Login Page (`/login`)

**Layout**: Same split screen as Register.

**Left Panel**: Different message — "Welcome back. Your orders are waiting." with decorative order status badges (static).

**Right Panel**:
- Email + Password (with show/hide)
- "Forgot password?" right-aligned below password field (placeholder link)
- "Sign In" full-width primary
- "No account? Create your free store →"

**Micro-interactions**: Failed login triggers a horizontal card shake animation (300ms keyframe). Error slides in from above.

---

### 4. Dashboard Home (`/dashboard`)

**Shell** (affects all dashboard pages):
- Desktop: 220px white sidebar + main area
- Mobile: **bottom tab bar** (4 icons: Dashboard / Products / Orders / Settings) — `fixed bottom-0 bg-white border-t border-gray-200`
- Sidebar nav: SVG icons (Heroicons line, 18px). Active: `bg-indigo-50 text-indigo-700 font-semibold rounded-xl`. Inactive: `text-gray-500 hover:bg-gray-50 rounded-xl`
- Sidebar bottom: Owner avatar (initials circle) + "Sign Out"

**Main Content**:

**Welcome Row**
- "Good morning/afternoon/evening, {name}"
- Store URL with external link icon
- Right: "View Live Store →" ghost button

**Stats Grid** (2-col mobile, 5-col desktop)
- White card + 4px left color bar
- Large number, status label, decorative mini sparkline (5 bars)
- Status bar colors match the status color system

**Quick Actions** (2-col grid)
- "Add New Product" — dashed border card, `hover:border-indigo-400 hover:bg-indigo-50`
- "View All Orders" — solid border card
- Dashed card pulses gently if product count is 0

**Recent Orders** (last 5)
- Mobile: stacked card list with order code, name, amount, status badge
- Desktop: condensed table with "View All →" link

**Micro-interactions**: Stat numbers count up from 0 on first load.

---

### 5. Products List (`/products`)

**Header**: "Products" h1 + count chip + "+ Add Product" button

**Desktop**: Table with columns: [Thumbnail 40px] [Name + excerpt] [Price] [Status] [Actions]
- Row hover: `hover:bg-indigo-50/30`
- Delete: inline confirm replaces `window.confirm`

**Mobile**: Card list inside `rounded-2xl border` container
- Each product: 48px thumbnail + name + price + status badge + `...` menu button (bottom sheet: Edit / Delete)

**Empty State**: Empty box SVG + "No products yet" + "Add your first product" + CTA button

---

### 6. Add Product (`/products/new`)

**Layout**: Two-column on desktop (form left, image+settings right), single column on mobile.
**Breadcrumb**: `Products / Add New Product`

**Left column**:
- Product Name
- Description (textarea)
- Price with "৳" left adornment (`bg-gray-50 border-r px-3 rounded-l-xl`)

**Right column**:
- **Image Upload Panel**: Large `aspect-square` drop zone with dashed border + cloud-upload icon
  - "Drop image here or click to browse" / "Or paste image URL" toggle
  - When image loads: fills zone as cover preview with `×` remove button
- **Availability Toggle**: Pill switch (indigo on, gray off) replacing checkbox

**Submit**: "Add Product" primary + "Cancel" secondary

**Mobile**: Single column. Image panel below text fields. ৳ as decorative prefix. Upload area is tappable.

**Micro-interactions**: Price formats with commas. Image preview fades in. Toggle slides with CSS transition.

---

### 7. Edit Product (`/products/[id]`)

Identical to Add Product visually. Differences:
- Breadcrumb shows product name
- h1: "Edit Product"
- Buttons: "Save Changes" + "Cancel" + "Delete Product" (danger, separated at bottom)
- Delete triggers inline confirmation panel: `bg-red-50 border border-red-100 rounded-xl p-4` that slides down

---

### 8. Orders List (`/orders`)

**Header**: "Orders" h1 + count chip + horizontally scrollable status filter pills
- Active pill: `bg-indigo-600 text-white`
- Inactive: `bg-gray-100 text-gray-600`
- Pills: All · Pending · Confirmed · Shipped · Delivered · Cancelled

**Desktop**: Table — [Order Code (mono indigo)] [Customer + Phone as 2nd line] [Total] [Relative Date] [Status] [View →]

**Mobile**: Card list
- Order code (mono, indigo) + status badge top row
- Customer name + phone center
- Total + relative date bottom row
- Full card is a Link to order detail

**Empty State**: Shopping bag SVG + "No orders yet" + "Copy Store Link" button (copies store URL to clipboard)

---

### 9. Order Detail (`/orders/[id]`)

**Header**: `← Orders` breadcrumb + order code (`text-2xl font-mono font-extrabold`) + large status badge + "Placed on {date}" meta

**Status Timeline Strip** ← most impactful addition
- Horizontal: `Pending → Confirmed → Shipped → Delivered`
- Completed: filled indigo circle + indigo line
- Current: filled circle + `ring ring-indigo-300 animate-pulse`
- Future: gray circle + gray line
- Cancelled: all red, broken line

**Customer Card**
- Name, phone (tappable `tel:` link in indigo), address, note
- Phone gets a "Call" chip: `bg-green-50 text-green-700 border border-green-100 rounded-lg text-xs` — taps initiate phone call on mobile

**Items Card**
- Product name × qty = subtotal per row
- Total row: `border-t pt-3 flex justify-between font-bold text-indigo-600`

**Status Update Card**
- Segmented control showing all statuses as radio options
- Pre-selects current status
- "Confirm Update" button disabled until a different status is selected — prevents accidental changes

---

### 10. Store Settings (`/settings`)

**Sections as separate cards** (each saves independently):

**Section 1 — Store Identity**
- Logo/avatar: 96px circle. If no logo: initials in indigo. "Upload Logo" / "Change" button triggers Cloudinary upload
- Store Display Name
- Store Description
- "Save" button

**Section 2 — Contact & Links**
- Phone number
- Facebook Page URL (optional, shows FB icon on customer store)
- "Save" button

**Section 3 — Danger Zone** (`border-red-100 bg-red-50/50`)
- "Deactivate Store" description
- Red outlined "Deactivate Store" button → confirmation modal

---

### 11. Customer Store Home (`/[store]`)

**No sidebar. Max-width `max-w-screen-sm mx-auto` (430px — phone width).**

**Store Header** (redesigned as profile-style header)
- Cover banner: `bg-gradient-to-br from-indigo-600 to-indigo-500` (80px tall)
- Store logo/avatar: 72px circle overlapping banner bottom edge (`-mt-8 ring-4 ring-white`)
- Store name `text-xl font-bold`, description `text-sm text-gray-500`
- Product count chip + optional Facebook page link button

**Search Bar**: Full-width `rounded-xl` input with search icon. Filters grid client-side.

**Product Grid** (2-column)
- Card: `bg-white rounded-2xl border border-gray-100`
- Image: `aspect-square object-cover` (1:1 ratio — cleaner than fixed height)
- Product name (truncated 1 line), price in `text-indigo-600 font-bold`, small "Order →" chip
- Hover: `hover:shadow-lg hover:border-indigo-200 transition-all`
- Mobile tap: `active:scale-[0.97]` for tactile feedback

**Sticky Footer** (non-intrusive, `fixed bottom-0`)
- `text-xs text-gray-400` — "Powered by StoreHubBD · Create your free store →"

**Micro-interactions**: Products stagger fade-in on load (50ms delay per card). Search filtering transitions smoothly.

---

### 12. Customer Product Detail (`/[store]/[productId]`)

**Top Navigation** (sticky, 50px)
- `←` back to store home
- Store name + store logo thumbnail (24px)

**Product Image**: Edge-to-edge `aspect-video`, `rounded-none` on mobile (feels native-app)

**Product Info** (white padded area below image)
- Name `text-2xl font-bold`
- Price `text-2xl font-bold text-indigo-600`
- Availability badge: `bg-green-50 text-green-700 rounded-full text-xs font-medium`
- Description `text-sm text-gray-600 leading-relaxed`

**Sticky "Place Order" Bar** (`fixed bottom-0 bg-white border-t border-gray-100 px-4 py-3`)
- Left: price
- Right: "Place Order →" full-width indigo button
- Tapping slides up the order form as a **bottom sheet**

**Order Form Bottom Sheet**
- Slides up from bottom (`translateY(100%) → translateY(0)` with `ease-out`)
- Drag handle at top: `w-10 h-1 bg-gray-300 rounded-full mx-auto`
- White, `rounded-t-3xl`, max-height 90vh, scrollable
- Overlay: `bg-black/30 backdrop-blur-sm`
- Quantity stepper: larger touch targets `w-10 h-10`, number `font-bold text-lg`
- Bottom of sheet: running total left + "Place Order →" right

**Micro-interactions**: Sheet slides with `transition-transform duration-300`. Success triggers checkmark animation before redirecting.

---

### 13. Order Confirmation (`/[store]/checkout`)

**Card** (`bg-white rounded-3xl p-8 max-w-sm shadow-lg`)

**Success Animation**
- Green circle checkmark: scale-in from 0 → 1 (`@keyframes` with 1.15 overshoot)
- Confetti burst (4–6 small squares, CSS-only, 3 colors: indigo/amber/green)
- Fires once, no loop

**Content**
- "Order Confirmed!" `text-2xl font-extrabold text-center`
- "You'll receive an SMS confirmation shortly." `text-sm text-gray-500`

**Order Details Box** (`bg-indigo-50 border border-indigo-100 rounded-2xl p-4`)
- "Your Order ID" label `text-xs font-semibold uppercase text-indigo-500`
- Order code `text-2xl font-mono font-extrabold text-indigo-700` — **large, photographable**
- Total below
- "Copy Order ID" icon button → "Copied!" tooltip for 1.5s

**Note**: `text-xs text-gray-400 text-center` — "Save this order ID to ask the seller about your order status."

**CTA**: "Continue Shopping →" full-width indigo

---

### 14. Store Not Found (404)

**Design**: Neutral, no brand color pressure. Guides the user back, nothing else.

- SVG: empty storefront / broken sign illustration (100px, gray-300 line-art)
- "Store not found" `text-2xl font-bold text-gray-900`
- "The store `{storeName}` doesn't exist or has been deactivated." `text-sm text-gray-500`
- Divider line `w-12 h-px bg-gray-200 mx-auto`
- "Go to StoreHubBD" — indigo primary button

---

## Critical Files to Touch

| File | What changes |
|------|-------------|
| `frontend/app/globals.css` | Color tokens (CSS custom properties) — do first |
| `frontend/components/dashboard/Sidebar.tsx` | Refined styles + extract `BottomNav.tsx` |
| `frontend/app/(dashboard)/layout.tsx` | Sidebar (desktop) + BottomNav (mobile) |
| `frontend/components/store/OrderForm.tsx` | Bottom sheet pattern, larger touch targets |
| `frontend/app/(store)/[store]/page.tsx` | Store header redesign, product grid, search |
| `frontend/app/(store)/[store]/[productId]/page.tsx` | Sticky order bar + bottom sheet trigger |
| `frontend/app/(store)/[store]/checkout/page.tsx` | Success animation, confetti, copy button |
| `frontend/app/(landing)/page.tsx` | Full landing page build |
| `frontend/app/(dashboard)/dashboard/page.tsx` | Stat cards with bars, recent orders |
| `frontend/app/(dashboard)/orders/page.tsx` | Filter pills, mobile card list |
| `frontend/app/(dashboard)/orders/[id]/page.tsx` | Status timeline, call button |
