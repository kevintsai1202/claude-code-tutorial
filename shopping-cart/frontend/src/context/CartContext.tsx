import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  type ReactNode,
} from 'react'
import type { CartItem, Product } from '../types'

interface CartResponse {
  items: CartItem[]
  totalAmount: number
}

interface CartContextType {
  items: CartItem[]
  totalAmount: number
  totalItems: number
  isCartOpen: boolean
  addToCart: (product: Product) => void
  updateQuantity: (itemId: number, quantity: number) => void
  removeItem: (itemId: number) => void
  clearCart: () => void
  openCart: () => void
  closeCart: () => void
}

const CartContext = createContext<CartContextType | null>(null)

/** 呼叫購物車 API 並更新 items state 的通用 helper */
async function cartFetch(
  url: string,
  options: RequestInit | undefined,
  setItems: React.Dispatch<React.SetStateAction<CartItem[]>>,
) {
  try {
    const res = await fetch(url, options)
    if (!res.ok) return
    const data = (await res.json()) as CartResponse
    setItems(data.items)
  } catch (err) {
    console.error('購物車 API 錯誤', err)
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [isCartOpen, setIsCartOpen] = useState(false)

  // 頁面載入時從後端取得購物車（session cookie 自動帶入）
  useEffect(() => {
    cartFetch('/api/cart', undefined, setItems)
  }, [])

  /** 加入購物車：若已存在則 quantity +1（最多 99） */
  const addToCart = useCallback((product: Product) => {
    cartFetch(
      '/api/cart/items',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: product.id }),
      },
      setItems,
    )
  }, [])

  /** 修改數量：quantity = 0 時後端會自動移除 */
  const updateQuantity = useCallback((itemId: number, quantity: number) => {
    cartFetch(
      `/api/cart/items/${itemId}`,
      {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quantity }),
      },
      setItems,
    )
  }, [])

  /** 移除單一商品 */
  const removeItem = useCallback((itemId: number) => {
    cartFetch(`/api/cart/items/${itemId}`, { method: 'DELETE' }, setItems)
  }, [])

  /** 清空購物車 */
  const clearCart = useCallback(() => {
    cartFetch('/api/cart', { method: 'DELETE' }, setItems)
  }, [])

  const openCart = useCallback(() => setIsCartOpen(true), [])
  const closeCart = useCallback(() => setIsCartOpen(false), [])

  /** 購物車總金額（由 items 衍生） */
  const totalAmount = useMemo(
    () => items.reduce((sum, item) => sum + item.product.price * item.quantity, 0),
    [items],
  )

  /** 購物車商品總件數 */
  const totalItems = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items],
  )

  return (
    <CartContext.Provider
      value={{
        items,
        totalAmount,
        totalItems,
        isCartOpen,
        addToCart,
        updateQuantity,
        removeItem,
        clearCart,
        openCart,
        closeCart,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart 必須在 CartProvider 內使用')
  return ctx
}
