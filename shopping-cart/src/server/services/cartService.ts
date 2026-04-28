import { randomUUID } from 'crypto'
import { pool } from '../db'

/** 購物車 API 回應格式 */
export interface CartResponse {
  items: CartItemResponse[]
  totalAmount: number
}

interface CartItemResponse {
  id: number
  quantity: number
  product: {
    id: number
    name: string
    description: string
    price: number
    category: string
    imageUrl: string
    rating: number
  }
}

/** 資料庫查詢結果列型別 */
interface CartItemRow {
  id: number
  quantity: number
  product_id: number
  name: string
  description: string
  price: number
  category: string
  image_url: string
  rating: string
}

/** 查詢購物車所有項目（含商品資訊），並計算合計金額 */
export async function getCart(cartId: number): Promise<CartResponse> {
  const { rows } = await pool.query<CartItemRow>(`
    SELECT ci.id, ci.quantity,
           p.id AS product_id, p.name, p.description,
           p.price, p.category, p.image_url, p.rating
    FROM cart_item ci
    JOIN product p ON p.id = ci.product_id
    WHERE ci.cart_id = $1
    ORDER BY ci.id
  `, [cartId])

  const items: CartItemResponse[] = rows.map(row => ({
    id: row.id,
    quantity: row.quantity,
    product: {
      id: row.product_id,
      name: row.name,
      description: row.description,
      price: row.price,
      category: row.category,
      imageUrl: row.image_url,
      rating: parseFloat(row.rating),
    },
  }))

  // 合計金額在 JS 計算，避免 SQL SUM 空集回傳 NULL
  const totalAmount = items.reduce((sum, item) => sum + item.quantity * item.product.price, 0)
  return { items, totalAmount }
}

/** 依 session_id 取得或建立購物車，回傳 cart.id */
export async function getOrCreateCart(sessionId: string): Promise<number> {
  const existing = await pool.query<{ id: number }>(
    'SELECT id FROM cart WHERE session_id = $1',
    [sessionId],
  )
  if (existing.rows.length > 0) return existing.rows[0].id

  const created = await pool.query<{ id: number }>(
    'INSERT INTO cart (session_id) VALUES ($1) RETURNING id',
    [sessionId],
  )
  return created.rows[0].id
}

/**
 * 加入商品到購物車
 * 若商品已存在則 quantity +1（上限 99），不存在則新增
 * 商品不存在時回傳 null
 */
export async function addItem(cartId: number, productId: number): Promise<CartResponse | null> {
  const productCheck = await pool.query('SELECT id FROM product WHERE id = $1', [productId])
  if (productCheck.rows.length === 0) return null

  // ON CONFLICT 處理「同商品加購」的合併邏輯
  await pool.query(`
    INSERT INTO cart_item (cart_id, product_id, quantity)
    VALUES ($1, $2, 1)
    ON CONFLICT (cart_id, product_id)
    DO UPDATE SET quantity = LEAST(cart_item.quantity + 1, 99)
  `, [cartId, productId])

  return getCart(cartId)
}

/** 修改購物車項目數量；quantity = 0 時自動移除 */
export async function updateQuantity(
  itemId: number,
  cartId: number,
  quantity: number,
): Promise<CartResponse> {
  if (quantity <= 0) {
    await pool.query('DELETE FROM cart_item WHERE id = $1 AND cart_id = $2', [itemId, cartId])
  } else {
    await pool.query(
      'UPDATE cart_item SET quantity = LEAST($1, 99) WHERE id = $2 AND cart_id = $3',
      [quantity, itemId, cartId],
    )
  }
  return getCart(cartId)
}

/** 移除單一購物車項目 */
export async function removeItem(itemId: number, cartId: number): Promise<CartResponse> {
  await pool.query('DELETE FROM cart_item WHERE id = $1 AND cart_id = $2', [itemId, cartId])
  return getCart(cartId)
}

/** 清空購物車所有項目 */
export async function clearCart(cartId: number): Promise<CartResponse> {
  await pool.query('DELETE FROM cart_item WHERE cart_id = $1', [cartId])
  return getCart(cartId)
}

/** 驗證結帳表單並執行結帳（清空購物車，產生訂單 ID） */
export async function checkout(
  cartId: number,
  form: { name: string; email: string; phone: string; address: string },
): Promise<{ success: true; orderId: string }> {
  await clearCart(cartId)
  const orderId = `ORD-${randomUUID().replace(/-/g, '').slice(0, 8).toUpperCase()}`
  return { success: true, orderId }
}
