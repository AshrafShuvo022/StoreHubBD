from sqlalchemy.orm import Session

from app.models.order import Order
from app.models.notification import Notification, NotificationStatus, NotificationType
from app.models.seller import Seller
from app.services.sms_service import send_sms


def generate_order_code(store_name: str, db: Session, seller_id) -> str:
    """Generate order code like ARJ-0042 based on total orders for this seller."""
    count = db.query(Order).filter(Order.seller_id == seller_id).count()
    prefix = store_name[:3].upper()
    number = str(count + 1).zfill(4)
    return f"{prefix}-{number}"


def send_and_log_sms(
    db: Session,
    seller_id,
    order_id,
    phone: str,
    message: str,
    sms_type: NotificationType,
) -> None:
    success = send_sms(phone, message)
    log = Notification(
        seller_id=seller_id,
        order_id=order_id,
        type=sms_type,
        phone=phone,
        message=message,
        status=NotificationStatus.sent if success else NotificationStatus.failed,
    )
    db.add(log)
    db.commit()


def notify_new_order(db: Session, order: Order, seller: Seller) -> None:
    # SMS to customer
    customer_msg = (
        f"Dear {order.customer_name}, your order {order.order_code} has been placed "
        f"at {seller.store_name}. Total: {order.total_amount} BDT. "
        f"We will confirm soon."
    )
    send_and_log_sms(
        db, seller.id, order.id,
        order.customer_phone, customer_msg,
        NotificationType.sms_customer,
    )

    # SMS to seller
    if seller.phone:
        seller_msg = (
            f"New order {order.order_code} from {order.customer_name} "
            f"({order.customer_phone}). Total: {order.total_amount} BDT. "
            f"Check your dashboard."
        )
        send_and_log_sms(
            db, seller.id, order.id,
            seller.phone, seller_msg,
            NotificationType.sms_seller,
        )


def notify_status_update(db: Session, order: Order, seller: Seller) -> None:
    status_messages = {
        "confirmed": f"Good news! Your order {order.order_code} has been confirmed by {seller.store_name}.",
        "shipped": f"Your order {order.order_code} has been shipped. It's on the way!",
        "delivered": f"Your order {order.order_code} has been delivered. Thank you for shopping at {seller.store_name}!",
        "cancelled": f"Your order {order.order_code} has been cancelled. Contact {seller.store_name} for details.",
    }
    message = status_messages.get(order.status.value)
    if message:
        send_and_log_sms(
            db, seller.id, order.id,
            order.customer_phone, message,
            NotificationType.sms_customer,
        )
