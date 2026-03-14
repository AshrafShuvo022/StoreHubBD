# StoreHubBD — MVP Build Plan & Progress Tracker

> North Star: "Does this directly help a Facebook seller manage their orders more cleanly?"
> MVP Success: 10 real sellers actively managing real orders through the dashboard.

---

## Build Order
**Database → Backend → Frontend**
Each phase depends on the previous. Do not skip ahead.

---

## Phase 1 — Project Setup & Infrastructure
**Goal**: Working local environment with all services running.

| # | Task | Status |
|---|------|--------|
| 1.1 | Create folder structure (frontend/, backend/, docker-compose.yml) | ⬜ Todo |
| 1.2 | Initialize FastAPI project + requirements.txt | ⬜ Todo |
| 1.3 | Initialize Next.js project (TypeScript, App Router, Tailwind) | ⬜ Todo |
| 1.4 | Write docker-compose.yml (frontend + backend + postgres) | ⏭️ Skipped (no Docker for now) |
| 1.5 | Create .env files for backend and frontend | ⬜ Todo |
| 1.6 | Verify all services start (uvicorn + npm run dev + postgres) | ⬜ Todo |

---

## Phase 2 — Database Layer
**Goal**: All tables created and verified in PostgreSQL.

| # | Task | Status |
|---|------|--------|
| 2.1 | Write SQLAlchemy models (seller, product, order, order_items, notification) | ⬜ Todo |
| 2.2 | Setup Alembic for migrations | ⬜ Todo |
| 2.3 | Write initial migration (create all tables) | ⬜ Todo |
| 2.4 | Run migration — verify tables in pgAdmin | ⬜ Todo |
| 2.5 | Setup database connection in FastAPI (core/database.py) | ⬜ Todo |

---

## Phase 3 — Backend Auth
**Goal**: Seller can register and login, JWT token returned.

| # | Task | Status |
|---|------|--------|
| 3.1 | Write JWT logic (core/security.py) — create token, verify token | ⬜ Todo |
| 3.2 | Write seller registration endpoint (POST /api/auth/register) | ⬜ Todo |
| 3.3 | Write seller login endpoint (POST /api/auth/login) | ⬜ Todo |
| 3.4 | Write token refresh endpoint (POST /api/auth/refresh) | ⬜ Todo |
| 3.5 | Write get_current_seller dependency (dependencies.py) | ⬜ Todo |
| 3.6 | Test all auth endpoints via FastAPI docs (/docs) | ⬜ Todo |

---

## Phase 4 — Backend Seller & Products
**Goal**: Seller can manage their profile and products via API.

| # | Task | Status |
|---|------|--------|
| 4.1 | Write seller profile endpoints (GET /api/seller/me, PUT /api/seller/me) | ⬜ Todo |
| 4.2 | Write Pydantic schemas for seller and product | ⬜ Todo |
| 4.3 | Write product list endpoint (GET /api/products) | ⬜ Todo |
| 4.4 | Write product create endpoint (POST /api/products) | ⬜ Todo |
| 4.5 | Write product update endpoint (PUT /api/products/:id) | ⬜ Todo |
| 4.6 | Write product delete endpoint (DELETE /api/products/:id) | ⬜ Todo |
| 4.7 | Verify all endpoints protected — seller_id checked from JWT | ⬜ Todo |
| 4.8 | Test all product endpoints via FastAPI docs | ⬜ Todo |

---

## Phase 5 — Backend Public Store
**Goal**: Anyone can view a store and its products via store name.

| # | Task | Status |
|---|------|--------|
| 5.1 | Write get store endpoint (GET /api/store/:store_name) | ⬜ Todo |
| 5.2 | Write get store products (GET /api/store/:store_name/products) | ⬜ Todo |
| 5.3 | Write get single product (GET /api/store/:store_name/:product_id) | ⬜ Todo |
| 5.4 | Handle 404 — store not found | ⬜ Todo |
| 5.5 | Test via FastAPI docs | ⬜ Todo |

---

## Phase 6 — Backend Orders & SMS
**Goal**: Customer places order, seller manages it, SMS sent automatically.

| # | Task | Status |
|---|------|--------|
| 6.1 | Write SMS service (services/sms_service.py) — Bulk SMS BD | ⬜ Todo |
| 6.2 | Write order code generator (ARJ-0042 format) | ⬜ Todo |
| 6.3 | Write place order endpoint (POST /api/store/:store_name/order) | ⬜ Todo |
| 6.4 | On order placed: generate code, save to DB, send SMS to both | ⬜ Todo |
| 6.5 | Write list orders endpoint (GET /api/orders) — seller only | ⬜ Todo |
| 6.6 | Write single order endpoint (GET /api/orders/:id) — seller only | ⬜ Todo |
| 6.7 | Write update order status (PUT /api/orders/:id/status) | ⬜ Todo |
| 6.8 | On status update: send SMS to customer | ⬜ Todo |
| 6.9 | Save SMS log to notifications table | ⬜ Todo |
| 6.10 | Test full order flow via FastAPI docs | ⬜ Todo |

---

## Phase 7 — Frontend Setup & Auth
**Goal**: Next.js running, subdomain routing working, seller can login.

| # | Task | Status |
|---|------|--------|
| 7.1 | Setup Next.js with TypeScript and Tailwind CSS | ⬜ Todo |
| 7.2 | Write subdomain middleware (middleware.ts) | ⬜ Todo |
| 7.3 | Test subdomain routing locally (arjha.localhost → store) | ⬜ Todo |
| 7.4 | Setup NextAuth.js with credentials provider | ⬜ Todo |
| 7.5 | Connect NextAuth to FastAPI login endpoint | ⬜ Todo |
| 7.6 | Write API client (lib/api.ts) with JWT header | ⬜ Todo |
| 7.7 | Write login page | ⬜ Todo |
| 7.8 | Write register page | ⬜ Todo |
| 7.9 | Test seller login — JWT stored, redirect to dashboard | ⬜ Todo |

---

## Phase 8 — Frontend Customer Store
**Goal**: Customer visits store, browses products, places order.

| # | Task | Status |
|---|------|--------|
| 8.1 | Write store home page — fetch seller + products by subdomain | ⬜ Todo |
| 8.2 | Write product grid component | ⬜ Todo |
| 8.3 | Write product detail page | ⬜ Todo |
| 8.4 | Write order form (Name, Phone, Address, Quantity, Note) | ⬜ Todo |
| 8.5 | On submit: POST order → show confirmation with order ID | ⬜ Todo |
| 8.6 | Make all store pages mobile responsive | ⬜ Todo |
| 8.7 | Handle 404 — store not found page | ⬜ Todo |

---

## Phase 9 — Frontend Seller Dashboard
**Goal**: Seller manages products and tracks all orders.

| # | Task | Status |
|---|------|--------|
| 9.1 | Write dashboard layout with sidebar navigation | ⬜ Todo |
| 9.2 | Write dashboard home — order summary counts | ⬜ Todo |
| 9.3 | Write products list page | ⬜ Todo |
| 9.4 | Write add product form | ⬜ Todo |
| 9.5 | Write edit product page | ⬜ Todo |
| 9.6 | Write delete product with confirmation | ⬜ Todo |
| 9.7 | Write orders list page with status badges | ⬜ Todo |
| 9.8 | Write order detail page — full info + customer phone | ⬜ Todo |
| 9.9 | Write one-click order status update | ⬜ Todo |
| 9.10 | Make dashboard mobile responsive | ⬜ Todo |

---

## Phase 10 — Integration & End to End Testing
**Goal**: Full flow verified working end to end.

| # | Task | Status |
|---|------|--------|
| 10.1 | Test full seller journey: Register → Add products → Share link | ⬜ Todo |
| 10.2 | Test full customer journey: Visit → Browse → Order → SMS | ⬜ Todo |
| 10.3 | Test order management: See order → Update status → SMS sent | ⬜ Todo |
| 10.4 | Test data isolation: Seller A cannot access Seller B's data | ⬜ Todo |
| 10.5 | Test multiple store subdomains simultaneously | ⬜ Todo |
| 10.6 | Test 404 for invalid store names | ⬜ Todo |
| 10.7 | Fix all bugs | ⬜ Todo |
| 10.8 | Mobile performance check on store pages | ⬜ Todo |

---

## Status Legend
| Symbol | Meaning |
|--------|---------|
| ⬜ Todo | Not started |
| 🔄 In Progress | Currently being built |
| ✅ Done | Completed and tested |
| ❌ Blocked | Needs attention |

---

## Critical Rules (Never Break These)
1. Always filter queries by `seller_id` — never expose cross-seller data
2. Always snapshot product name + price into order_items at order time
3. Mobile first — test every UI on mobile before marking done
4. No feature outside this plan — scope creep kills MVPs
5. Each phase must be tested before moving to next phase

---

## Current Phase
**Phase 1 — Project Setup** ← Start Here

---

## What I Need From You — Per Phase

This section tells you exactly where your input is required before I can proceed.

---

### Phase 1 — Project Setup
| Task | What I Need From You |
|------|----------------------|
| 1.5 | Confirm your PostgreSQL password (set during installation) so I can write the correct .env files |
| 1.6 | Run `docker-compose up` and tell me if all 3 services start without errors |

**You must have installed:**
- Node.js (for Next.js)
- Python 3.11+ (for FastAPI)
- Docker Desktop (for docker-compose)
- PostgreSQL (already done)

---

### Phase 2 — Database Layer
| Task | What I Need From You |
|------|----------------------|
| 2.4 | Run the migration command I give you, then confirm tables are visible in pgAdmin |

**Nothing else — I write all the code, you just run the commands.**

---

### Phase 3 — Backend Auth
| Task | What I Need From You |
|------|----------------------|
| 3.6 | Open `localhost:8000/docs`, test register + login endpoints, tell me if they work |

---

### Phase 4 — Backend Seller & Products
| Task | What I Need From You |
|------|----------------------|
| 4.8 | Test product endpoints in `/docs`, confirm they work correctly |

---

### Phase 5 — Backend Public Store
| Task | What I Need From You |
|------|----------------------|
| 5.5 | Test store endpoints in `/docs`, confirm correct data returns |

---

### Phase 6 — Backend Orders & SMS
| Task | What I Need From You |
|------|----------------------|
| 6.1 | Provide your **Bulk SMS BD API key** — I cannot write the SMS service without this |
| 6.1 | Provide your **Sender ID** registered with Bulk SMS BD |
| 6.10 | Test full order flow, confirm SMS is received on your phone |

---

### Phase 7 — Frontend Setup & Auth
| Task | What I Need From You |
|------|----------------------|
| 7.3 | Add test subdomains to your Windows hosts file (I will give you exact lines to add) — requires running Notepad as Administrator |
| 7.9 | Test login on browser, confirm redirect to dashboard works |

---

### Phase 8 — Frontend Customer Store
| Task | What I Need From You |
|------|----------------------|
| 8.6 | Review store page on your mobile — confirm it looks good |
| 8.7 | Test with a real order, confirm order confirmation page shows correct order ID |

---

### Phase 9 — Frontend Seller Dashboard
| Task | What I Need From You |
|------|----------------------|
| 9.2 | Review dashboard design — confirm layout feels clean and usable |
| 9.10 | Review dashboard on mobile — confirm it is usable on phone |

---

### Phase 10 — Integration & Testing
| Task | What I Need From You |
|------|----------------------|
| 10.1 | Do the full seller journey yourself — register, add products, share link |
| 10.2 | Do the full customer journey yourself — visit store, place a real order |
| 10.3 | Update an order status — confirm SMS arrives on your phone |
| 10.7 | Report any bugs you find — I will fix them |

---

## One Time Setup — Things You Need Before We Start

| Item | Status |
|------|--------|
| Node.js installed (v22.19.0) | ✅ Done |
| Python installed (v3.11.7) | ✅ Done |
| Conda env `storehubbd` created | ✅ Done — activate with `conda activate storehubbd` |
| Docker Desktop | ⏭️ Skipped — running services directly |
| PostgreSQL installed (port 5432) | ✅ Done |
| Bulk SMS BD account created | ❓ Confirm |
| Bulk SMS BD API key obtained | ❓ Confirm |
