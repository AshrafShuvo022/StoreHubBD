# StoreHubBD — Project North Star

## What Are We Building?
A multi-tenant SaaS e-commerce platform for Bangladeshi Facebook sellers.
Every seller gets their own subdomain store (e.g. `arjha.storehubbd.com`) where
customers can browse products and place orders — while the seller manages everything
from a single clean dashboard.

---

## Why Are We Building This?

Thousands of Facebook pages in Bangladesh sell products every day.
Their reality:
- Orders come through DMs, comments, WhatsApp — scattered everywhere
- No order tracking, no record keeping
- Customers get no confirmation
- Sellers forget orders, lose money, look unprofessional

**Nobody has solved this specifically for Bangladeshi Facebook sellers at scale.**

We are building the missing infrastructure layer.

---

## Who Is This For?

**Primary target:** Facebook page owners in Bangladesh who sell products online
but have no proper storefront or order management system.

**Secondary target (future):** Any small business in Bangladesh wanting an
online presence without the complexity of building their own website.

---

## The Core Problem We Solve

> Turn Facebook order chaos into clean, tracked, professional orders.

One order ID. One dashboard. One place for everything.
Payment and delivery stay the same as before — we only solve the chaos.

---

## How It Works (Simple Version)

1. A seller registers on StoreHubBD
2. They instantly get `theirname.storehubbd.com`
3. They add their products
4. They share the link on their Facebook page
5. Customers visit, browse, and place orders
6. Seller sees all orders in one dashboard with unique IDs
7. Seller updates order status — customer gets SMS
8. No chaos. No missed orders. Full control.

---

## The Business Model (Phased)

### Phase 1 — Build Trust (0 to 50 sellers)
- Free for all sellers
- Goal: Get real sellers, real orders, real feedback
- Focus: Product quality and seller satisfaction

### Phase 2 — Monetize (50 to 200 sellers)
- Small monthly subscription: 500-1000 BDT/month
- StoreHubBD brand becomes recognized (always in the subdomain)
- Sellers are now dependent — switching cost is high

### Phase 3 — Scale (200+ sellers)
- Transaction cut (1-2%) OR subscription model
- Introduce advanced features: analytics, delivery integration, payment gateway

### Phase 4 — Marketplace
- StoreHubBD becomes a discovery platform
- Customers can browse all stores from storehubbd.com
- Ad revenue from sellers
- Full Daraz-like ecosystem — built on trust already established

---

## What Makes This Different From Daraz/Chaldal

| | Daraz | StoreHubBD |
|--|-------|-----------|
| Seller identity | Lost inside Daraz | Keeps own brand (arjha.storehubbd.com) |
| Target | Everyone | Facebook sellers specifically |
| Complexity | High | Simple, familiar |
| Entry barrier | High | Zero — free to start |
| Customer ownership | Daraz owns customers | Seller owns their customers |

---

## MVP — What We Build First

### Included in MVP
1. Seller registration → instant subdomain
2. Product management (add, edit, delete, availability toggle)
3. Customer-facing store page (mobile friendly)
4. Order form (Name, Phone, Address, Quantity, Note)
5. Unique order ID per store (e.g. ARJ-0042)
6. Order management dashboard
7. Order status tracking (Pending → Confirmed → Shipped → Delivered)
8. SMS to customer on order placed
9. SMS to seller on new order received

### NOT in MVP (Future Versions)
- Payment gateway (bKash/Nagad integration)
- Delivery partner integration
- Facebook comment auto-reply
- Customer accounts
- Analytics and reports
- Mobile app
- Marketplace discovery page

### MVP Success Metric
> 10 real sellers actively managing real orders through the dashboard.

Not revenue. Not signups. **Real usage.**

---

## Tech Stack

| Layer | Technology | Why |
|-------|-----------|-----|
| Frontend | Next.js | SEO for store pages, subdomain routing |
| Backend | FastAPI (Python) | Fast, clean, async, Python ecosystem for future AI |
| Database | PostgreSQL | Strong relational structure, Row Level Security |
| ORM | SQLAlchemy + Alembic | Battle tested, full control, clean migrations |
| Auth | NextAuth.js + JWT | Industry standard, secure |
| SMS | Bulk SMS BD | Local BD provider, simple API |
| Domain | storehubbd.com (not yet purchased) | Buy before deployment |
| Payment | Manual bKash/COD | No gateway needed for MVP |
| Delivery | Manual | No integration needed for MVP |

---

## Architecture Summary

```
*.storehubbd.com
        ↓
     Nginx
        ↓
   Next.js App
   ├── storehubbd.com     → Landing page
   ├── app.storehubbd.com → Seller dashboard
   └── *.storehubbd.com   → Customer store (dynamic per subdomain)
        ↓
   FastAPI Backend
        ↓
   PostgreSQL Database
```

---

## Data Isolation Principle

**This is the most critical rule of the entire system:**

> A seller can NEVER see, touch, or affect another seller's data.

Every database query is filtered by `seller_id` extracted from the JWT token.
PostgreSQL Row Level Security adds a second layer of protection.

---

## The Seller Experience (What They Feel)

Before StoreHubBD:
- Overwhelmed, chaotic, unprofessional

After StoreHubBD:
- "I have my own website"
- "I can see all my orders in one place"
- "My customers get automatic confirmations"
- "I look like a real business"

**That feeling is the product.**

---

## The Customer Experience (What They Feel)

- Visits a clean, fast store page
- Sees products clearly with prices
- Places order in 30 seconds
- Gets an SMS confirmation with order ID
- Feels they ordered from a real professional shop

---

## Monthly Running Cost

| Stage | Estimated Cost |
|-------|---------------|
| Development only | ~700-1000 BDT/month |
| MVP live (10 sellers) | ~1500-2500 BDT/month |
| Growing (50 sellers) | ~4000-6000 BDT/month |

**One paying seller covers a significant portion of costs.**

---

## What We Must Never Forget

1. **Simplicity is the product** — sellers are not technical people
2. **Mobile first** — most users in BD are on phones
3. **Speed matters** — slow store = lost orders
4. **Seller trust is everything** — one bad experience spreads fast
5. **Don't over-engineer** — build what's needed, nothing more
6. **Real usage over vanity metrics** — 10 active sellers beats 1000 signups

---

## North Star Reminder

When confused about a feature or direction, ask:

> "Does this directly help a Facebook seller manage their orders more cleanly?"

If yes — build it.
If no — it's not for MVP.
