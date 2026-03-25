from collections import defaultdict
from datetime import datetime, timedelta, timezone

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.dependencies import get_current_seller
from app.models.order import Order
from app.models.seller import Seller

router = APIRouter(tags=["analytics"])


@router.get("/api/analytics")
def get_analytics(
    db: Session = Depends(get_db),
    current_seller: Seller = Depends(get_current_seller),
):
    orders = (
        db.query(Order)
        .filter(Order.seller_id == current_seller.id)
        .all()
    )

    non_cancelled = [o for o in orders if o.status.value != "cancelled"]

    # ── KPIs ─────────────────────────────────────────────────────────────────
    total_revenue = sum(float(o.total_amount) for o in non_cancelled)

    now = datetime.now(timezone.utc)
    month_start = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
    monthly_revenue = sum(
        float(o.total_amount) for o in non_cancelled
        if o.created_at >= month_start
    )

    # ── Status breakdown ─────────────────────────────────────────────────────
    status_breakdown: dict[str, int] = defaultdict(int)
    for o in orders:
        status_breakdown[o.status.value] += 1

    # ── Daily revenue — last 30 days ─────────────────────────────────────────
    thirty_ago = now - timedelta(days=29)
    daily_map: dict[str, dict] = defaultdict(lambda: {"revenue": 0.0, "orders": 0})

    for o in non_cancelled:
        created = o.created_at
        if created.tzinfo is None:
            created = created.replace(tzinfo=timezone.utc)
        if created >= thirty_ago:
            day = created.strftime("%Y-%m-%d")
            daily_map[day]["revenue"] += float(o.total_amount)
            daily_map[day]["orders"] += 1

    daily_revenue = []
    for i in range(30):
        day = (thirty_ago + timedelta(days=i)).strftime("%Y-%m-%d")
        daily_revenue.append({
            "date": day,
            "revenue": round(daily_map[day]["revenue"], 2),
            "orders": daily_map[day]["orders"],
        })

    # ── Top 5 products by revenue ─────────────────────────────────────────────
    product_map: dict[str, dict] = defaultdict(lambda: {"name": "", "orders": 0, "revenue": 0.0})
    for o in non_cancelled:
        for item in o.items:
            key = str(item.product_id) if item.product_id else item.product_name
            product_map[key]["name"] = item.product_name
            product_map[key]["orders"] += item.quantity
            product_map[key]["revenue"] += float(item.subtotal)

    top_products = sorted(
        [
            {"name": v["name"], "orders": v["orders"], "revenue": round(v["revenue"], 2)}
            for v in product_map.values()
        ],
        key=lambda x: x["revenue"],
        reverse=True,
    )[:5]

    # ── Recent 8 orders ───────────────────────────────────────────────────────
    recent = sorted(orders, key=lambda o: o.created_at, reverse=True)[:8]

    return {
        "total_revenue": round(total_revenue, 2),
        "monthly_revenue": round(monthly_revenue, 2),
        "total_orders": len(orders),
        "pending_orders": status_breakdown.get("pending", 0),
        "status_breakdown": dict(status_breakdown),
        "daily_revenue": daily_revenue,
        "top_products": top_products,
        "recent_orders": [
            {
                "id": str(o.id),
                "order_code": o.order_code,
                "customer_name": o.customer_name,
                "total_amount": float(o.total_amount),
                "status": o.status.value,
                "created_at": o.created_at.isoformat(),
            }
            for o in recent
        ],
    }
