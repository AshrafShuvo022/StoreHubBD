"use client"

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react"
import { CartItem, getCartFromStorage, saveCartToStorage } from "@/lib/cart"

interface CartContextType {
  items: CartItem[]
  addItem: (item: CartItem) => void
  removeItem: (id: string) => void
  updateQty: (id: string, qty: number) => void
  clearCart: () => void
  total: number
  count: number
  isOpen: boolean
  openCart: () => void
  closeCart: () => void
}

const CartContext = createContext<CartContextType | null>(null)

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    setItems(getCartFromStorage())
  }, [])

  const addItem = useCallback((item: CartItem) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.id === item.id)
      const updated = existing
        ? prev.map((i) => i.id === item.id ? { ...i, quantity: i.quantity + item.quantity } : i)
        : [...prev, item]
      saveCartToStorage(updated)
      return updated
    })
    setIsOpen(true)
  }, [])

  const removeItem = useCallback((id: string) => {
    setItems((prev) => {
      const updated = prev.filter((i) => i.id !== id)
      saveCartToStorage(updated)
      return updated
    })
  }, [])

  const updateQty = useCallback((id: string, qty: number) => {
    if (qty < 1) return
    setItems((prev) => {
      const updated = prev.map((i) => i.id === id ? { ...i, quantity: qty } : i)
      saveCartToStorage(updated)
      return updated
    })
  }, [])

  const clearCart = useCallback(() => {
    setItems([])
    saveCartToStorage([])
  }, [])

  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0)
  const count = items.reduce((sum, i) => sum + i.quantity, 0)

  return (
    <CartContext.Provider value={{
      items, addItem, removeItem, updateQty, clearCart,
      total, count,
      isOpen,
      openCart: () => setIsOpen(true),
      closeCart: () => setIsOpen(false),
    }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error("useCart must be used inside CartProvider")
  return ctx
}
