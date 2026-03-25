import { CartProvider } from "@/components/store/CartContext"
import CartDrawer from "@/components/store/CartDrawer"

export default async function StoreLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ store: string }>
}) {
  const { store: storeName } = await params
  return (
    <CartProvider>
      {children}
      <CartDrawer storeName={storeName} />
    </CartProvider>
  )
}
