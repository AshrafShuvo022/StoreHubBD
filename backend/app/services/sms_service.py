import httpx

from app.core.config import settings


def send_sms(phone: str, message: str) -> bool:
    """Send SMS via Bulk SMS BD. Returns True if sent, False if failed."""
    if not settings.BULK_SMS_API_KEY:
        print(f"[SMS DISABLED] To: {phone} | Message: {message}")
        return False

    try:
        response = httpx.post(
            "https://bulksmsbd.net/api/smsapi",
            params={
                "api_key": settings.BULK_SMS_API_KEY,
                "type": "text",
                "number": phone,
                "senderid": settings.BULK_SMS_SENDER_ID,
                "message": message,
            },
            timeout=10,
        )
        data = response.json()
        # Bulk SMS BD returns response_code 202 on success
        return str(data.get("response_code")) == "202"
    except Exception as e:
        print(f"[SMS ERROR] {e}")
        return False
