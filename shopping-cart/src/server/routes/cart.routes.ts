import { Router } from 'express'
import * as cartService from '../services/cartService'

const router = Router()

/** GET /api/cart — 取得目前購物車 */
router.get('/', async (req, res) => {
  try {
    const cartId = await cartService.getOrCreateCart(req.sessionId)
    const cart = await cartService.getCart(cartId)
    res.json(cart)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

/** POST /api/cart/items — 加入商品（productId） */
router.post('/items', async (req, res) => {
  try {
    const { productId } = req.body as { productId: number }
    const cartId = await cartService.getOrCreateCart(req.sessionId)
    const cart = await cartService.addItem(cartId, productId)
    if (!cart) {
      res.status(404).json({ error: 'Product not found' })
      return
    }
    res.json(cart)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

/** PUT /api/cart/items/:itemId — 更新數量（0 表示移除） */
router.put('/items/:itemId', async (req, res) => {
  try {
    const itemId = parseInt(req.params.itemId)
    const { quantity } = req.body as { quantity: number }
    const cartId = await cartService.getOrCreateCart(req.sessionId)
    const cart = await cartService.updateQuantity(itemId, cartId, quantity)
    res.json(cart)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

/** DELETE /api/cart/items/:itemId — 移除單一項目 */
router.delete('/items/:itemId', async (req, res) => {
  try {
    const itemId = parseInt(req.params.itemId)
    const cartId = await cartService.getOrCreateCart(req.sessionId)
    const cart = await cartService.removeItem(itemId, cartId)
    res.json(cart)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

/** DELETE /api/cart — 清空整個購物車 */
router.delete('/', async (req, res) => {
  try {
    const cartId = await cartService.getOrCreateCart(req.sessionId)
    const cart = await cartService.clearCart(cartId)
    res.json(cart)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

/** POST /api/cart/checkout — 結帳，驗證表單後清空購物車並產生訂單 */
router.post('/checkout', async (req, res) => {
  try {
    const { name, email, phone, address } = req.body as {
      name: string
      email: string
      phone: string
      address: string
    }

    // 欄位驗證
    const fields: Record<string, string> = {}
    if (!name)    fields.name    = '姓名為必填'
    if (!email)   fields.email   = 'Email 為必填'
    if (!phone)   fields.phone   = '電話為必填'
    if (!address) fields.address = '地址為必填'

    if (Object.keys(fields).length > 0) {
      res.status(400).json({ fields })
      return
    }

    const cartId = await cartService.getOrCreateCart(req.sessionId)
    const result = await cartService.checkout(cartId, { name, email, phone, address })
    res.json(result)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

export default router
