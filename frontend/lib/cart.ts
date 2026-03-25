export interface CartItem {
  id: string           // productId or productId__variantId
  productId: string
  variantId?: string
  name: string
  variantLabel?: string
  price: number
  imageUrl?: string
  quantity: number
}

const CART_KEY = "storehubbd_cart"

export function getCartFromStorage(): CartItem[] {
  if (typeof window === "undefined") return []
  try {
    return JSON.parse(localStorage.getItem(CART_KEY) || "[]")
  } catch {
    return []
  }
}

export function saveCartToStorage(items: CartItem[]) {
  localStorage.setItem(CART_KEY, JSON.stringify(items))
}

export function makeCartItemId(productId: string, variantId?: string): string {
  return variantId ? `${productId}__${variantId}` : productId
}
