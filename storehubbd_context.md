# StoreHubBD — Full Business & Technical Context

## Business Concept
Multi-tenant SaaS e-commerce platform targeting Bangladeshi Facebook sellers.
- Every seller gets their own subdomain: `arjha.storehubbd.com`
- Sellers list products, receive orders, track everything from one dashboard
- Payment and delivery stay manual (bKash/COD) for MVP
- Eventually evolve into a marketplace (Daraz-like) after 50+ sellers onboard

## The Core Problem Being Solved
Facebook sellers in Bangladesh manage orders through DMs, comments, WhatsApp — pure chaos.
StoreHubBD gives every order a unique ID (e.g. `ARJ-1042`), a dashboard, and status tracking.
**MVP goal: Turn Facebook chaos into clean, tracked, professional orders.**

## Revenue Model (Phased)
| Phase | Sellers | Model |
|-------|---------|-------|
| 0-50 stores | Early adopters | Free — build trust |
| 50-200 stores | Growth | Small flat fee (500-1000 BDT/month) |
| 200+ stores | Scale | Transaction cut (1-2%) OR subscription |
| Marketplace phase | Maturity | Daraz-style + ad revenue |

## MVP Feature List
1. Seller registration → instant subdomain assigned
2. Product management (add/edit/delete, image, price, availability toggle)
3. Customer-facing store page (mobile friendly, SEO optimized)
4. Order form (Name, Phone, Address, Quantity, Note)
5. Order management dashboard (status: Pending → Confirmed → Shipped → Delivered)
6. Unique order ID per store (e.g. ARJ-0042)
7. SMS notification to seller (new order) and customer (confirmation) via Bulk SMS BD

## MVP Success Metric
10 real sellers actively managing real orders through the dashboard.

## What MVP Does NOT Include
- Payment gateway integration
- Delivery integration
- Facebook auto-reply (requires Meta App Review — save for v2)
- Analytics / reports
- Mobile app
- Customer accounts

## Tech Stack (Locked)
| Layer | Technology |
|-------|-----------|
| Frontend | Next.js |
| Backend | FastAPI (Python) |
| Database | PostgreSQL |
| ORM | SQLAlchemy + Alembic |
| Auth | NextAuth.js + JWT |
| SMS | Bulk SMS BD |
| Domain | Not purchased yet — buy before deployment |
| Payment | Manual (bKash/COD) for MVP |
| Delivery | Manual for MVP |

## Authentication Design
- **Sellers**: NextAuth.js (frontend) + JWT (FastAPI backend)
- **Customers**: No login required — just order form
- **Security**: Every API query filters by seller_id from JWT token
- **Subdomain routing**: Next.js middleware reads subdomain → fetches seller data

## Subdomain Routing Flow
```
arjha.storehubbd.com hits server
        ↓
Next.js middleware reads subdomain = "arjha"
        ↓
Fetches seller data for "arjha" from FastAPI
        ↓
Renders arjha's store (no customer login needed)
```

## Local Development (No Domain Yet)
Simulate subdomains via hosts file:
```
127.0.0.1 arjha.localhost
127.0.0.1 test.localhost
```

## Database Schema

### sellers
```sql
id                  UUID PRIMARY KEY
store_name          VARCHAR(100) UNIQUE  -- used for subdomain
owner_name          VARCHAR(100)
email               VARCHAR(150) UNIQUE
password_hash       VARCHAR
phone               VARCHAR(20)
logo_url            VARCHAR
description         TEXT
is_active           BOOLEAN DEFAULT TRUE
created_at          TIMESTAMP
updated_at          TIMESTAMP
```

### products
```sql
id                  UUID PRIMARY KEY
seller_id           UUID FK → sellers.id
name                VARCHAR(200)
description         TEXT
price               DECIMAL(10,2)
image_url           VARCHAR
is_available        BOOLEAN DEFAULT TRUE
created_at          TIMESTAMP
updated_at          TIMESTAMP
```

### orders
```sql
id                  UUID PRIMARY KEY
order_code          VARCHAR(20) UNIQUE  -- e.g. ARJ-1042
seller_id           UUID FK → sellers.id
customer_name       VARCHAR(100)
customer_phone      VARCHAR(20)
customer_address    TEXT
note                TEXT
status              ENUM(pending, confirmed, shipped, delivered, cancelled)
total_amount        DECIMAL(10,2)
created_at          TIMESTAMP
updated_at          TIMESTAMP
```

### order_items
```sql
id                  UUID PRIMARY KEY
order_id            UUID FK → orders.id
product_id          UUID FK → products.id
product_name        VARCHAR(200)  -- snapshot at order time
product_price       DECIMAL(10,2) -- snapshot at order time
quantity            INTEGER
subtotal            DECIMAL(10,2)
```

### notifications
```sql
id                  UUID PRIMARY KEY
seller_id           UUID FK → sellers.id
order_id            UUID FK → orders.id
type                ENUM(sms_seller, sms_customer)
phone               VARCHAR(20)
message             TEXT
status              ENUM(sent, failed)
sent_at             TIMESTAMP
```

## Order Code Generation
```python
def generate_order_code(store_name, order_count):
    prefix = store_name[:3].upper()
    number = str(order_count + 1).zfill(4)
    return f"{prefix}-{number}"
# arjha's 1st order  → ARJ-0001
# arjha's 42nd order → ARJ-0042
```

## Key Design Decisions
- Product name and price are **snapshotted** into order_items at purchase time (price changes don't affect old orders)
- Customers never need an account for MVP
- Seller data is fully isolated — seller_id checked on every query
- PostgreSQL Row Level Security adds extra isolation layer

## Table Relationships
```
sellers
  └── products (one seller, many products)
  └── orders (one seller, many orders)
        └── order_items (one order, many items)
              └── products (reference)
  └── notifications (log of all SMS sent)
```

## SMS Integration (Bulk SMS BD)
```python
import requests

def send_sms(phone, message):
    requests.post("https://bulksmsbd.net/api/smsapi", params={
        "api_key": "your_key",
        "type": "text",
        "number": phone,
        "senderid": "StoreHub",
        "message": message
    })
```

## System Architecture

### High Level Overview
```
                        ┌─────────────────────────────┐
                        │         DNS / Nginx          │
                        │   *.storehubbd.com routing   │
                        └──────────────┬──────────────┘
                                       │
              ┌────────────────────────┼────────────────────────┐
              │                        │                        │
              ▼                        ▼                        ▼
   storehubbd.com          app.storehubbd.com       arjha.storehubbd.com
   (Landing Page)          (Seller Dashboard)        (Customer Store)
              │                        │                        │
              └────────────────────────┼────────────────────────┘
                                       │
                                       ▼
                              ┌─────────────────┐
                              │   Next.js App   │
                              │   (Frontend)    │
                              └────────┬────────┘
                                       │ HTTP / REST
                                       ▼
                              ┌─────────────────┐
                              │   FastAPI App   │
                              │   (Backend)     │
                              └────────┬────────┘
                                       │
                    ┌──────────────────┼──────────────────┐
                    │                  │                  │
                    ▼                  ▼                  ▼
             PostgreSQL           Bulk SMS BD        File Storage
             (Database)           (SMS API)          (Images)
```

## Project Folder Structure
```
StoreHubBD/
├── frontend/                   # Next.js
│   ├── app/
│   │   ├── (landing)/          # storehubbd.com
│   │   │   └── page.tsx
│   │   ├── (dashboard)/        # app.storehubbd.com
│   │   │   ├── layout.tsx
│   │   │   ├── dashboard/
│   │   │   │   └── page.tsx
│   │   │   ├── products/
│   │   │   │   ├── page.tsx
│   │   │   │   └── [id]/page.tsx
│   │   │   └── orders/
│   │   │       ├── page.tsx
│   │   │       └── [id]/page.tsx
│   │   └── (store)/            # arjha.storehubbd.com
│   │       ├── page.tsx        # store home
│   │       ├── [productId]/    # product detail
│   │       │   └── page.tsx
│   │       └── checkout/       # order form
│   │           └── page.tsx
│   ├── middleware.ts            # subdomain routing logic
│   ├── lib/
│   │   ├── api.ts              # FastAPI calls
│   │   └── auth.ts             # NextAuth config
│   └── components/
│       ├── dashboard/
│       └── store/
│
├── backend/                    # FastAPI
│   ├── app/
│   │   ├── main.py             # app entry point
│   │   ├── core/
│   │   │   ├── config.py       # env variables
│   │   │   ├── security.py     # JWT logic
│   │   │   └── database.py     # DB connection
│   │   ├── models/             # SQLAlchemy models
│   │   │   ├── seller.py
│   │   │   ├── product.py
│   │   │   ├── order.py
│   │   │   └── notification.py
│   │   ├── schemas/            # Pydantic schemas
│   │   │   ├── seller.py
│   │   │   ├── product.py
│   │   │   └── order.py
│   │   ├── routers/            # API routes
│   │   │   ├── auth.py
│   │   │   ├── sellers.py
│   │   │   ├── products.py
│   │   │   ├── orders.py
│   │   │   └── store.py        # public store routes
│   │   ├── services/           # business logic
│   │   │   ├── order_service.py
│   │   │   └── sms_service.py
│   │   └── dependencies.py     # shared deps (get_current_seller)
│   ├── alembic/                # migrations
│   └── requirements.txt
│
├── MEMORY.md
├── storehubbd_context.md
└── docker-compose.yml          # local dev setup
```

## Next.js Middleware — Subdomain Routing
```typescript
// frontend/middleware.ts
export function middleware(request: NextRequest) {
  const host = request.headers.get("host") || ""
  const subdomain = host.split(".")[0]

  if (subdomain === "storehubbd" || subdomain === "www") {
    return NextResponse.next()
  }

  if (subdomain === "app") {
    return NextResponse.next()
  }

  // customer store
  return NextResponse.rewrite(
    new URL(`/store/${subdomain}${request.nextUrl.pathname}`, request.url)
  )
}
```

## API Routes Structure
```
/api
├── /auth
│   ├── POST /register          # seller signup
│   ├── POST /login             # seller login → JWT
│   └── POST /refresh           # refresh token
│
├── /seller                     # protected — seller only
│   ├── GET  /me                # get own profile
│   └── PUT  /me                # update profile
│
├── /products                   # protected — seller only
│   ├── GET    /                # list own products
│   ├── POST   /                # create product
│   ├── PUT    /:id             # update product
│   └── DELETE /:id             # delete product
│
├── /orders                     # protected — seller only
│   ├── GET  /                  # list all orders
│   ├── GET  /:id               # single order detail
│   └── PUT  /:id/status        # update order status
│
└── /store                      # public — no auth
    ├── GET  /:store_name               # store info + products
    ├── GET  /:store_name/:product_id   # single product
    └── POST /:store_name/order         # place order
```

## Request Flow Examples

### Customer Places Order
```
Customer fills form on arjha.storehubbd.com/checkout
        ↓
Next.js POST → FastAPI /store/arjha/order
        ↓
FastAPI creates order with code ARJ-0042
        ↓
FastAPI calls Bulk SMS BD → SMS to customer
        ↓
FastAPI calls Bulk SMS BD → SMS to seller
        ↓
Returns order confirmation to frontend
```

### Seller Updates Order Status
```
Seller clicks "Mark as Shipped" on dashboard
        ↓
Next.js PUT → FastAPI /orders/:id/status (JWT in header)
        ↓
FastAPI verifies JWT → extracts seller_id
        ↓
FastAPI checks order belongs to this seller
        ↓
Updates status → sends SMS to customer
        ↓
Returns updated order
```

## Docker Compose (Local Dev)
```yaml
version: "3.8"
services:
  frontend:
    build: ./frontend
    ports:
      - "3000:3000"

  backend:
    build: ./backend
    ports:
      - "8000:8000"
    env_file: .env

  db:
    image: postgres:15
    environment:
      POSTGRES_DB: storehubbd
      POSTGRES_USER: admin
      POSTGRES_PASSWORD: secret
    ports:
      - "5432:5432"
```

## Progress Tracker
- [x] Business model defined
- [x] Tech stack locked
- [x] Auth approach decided
- [x] Database schema designed
- [x] System architecture defined
- [x] Folder structure defined
- [x] API routes defined
- [ ] Start coding

## Founder Info
- Location: Dhaka, Bangladesh
- Role: Software Engineer (has full technical capability)
- Status: Planning complete, ready to start coding. No domain purchased yet.
