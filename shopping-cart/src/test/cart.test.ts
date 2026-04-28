import { describe, it, expect, beforeEach, afterAll } from 'vitest'
import request from 'supertest'
import { app } from '../server/app'
import { pool } from '../server/db'

// agent 保留 Cookie，模擬同一個使用者的連線
const agent = request.agent(app)

// 每個測試前清空購物車，確保隔離
beforeEach(async () => {
  await agent.delete('/api/cart')
})

afterAll(async () => {
  await pool.end()
})

describe('GET /api/cart', () => {
  it('首次取得購物車，items 為空陣列', async () => {
    const res = await agent.get('/api/cart')
    expect(res.status).toBe(200)
    expect(res.body.items).toHaveLength(0)
    expect(res.body.totalAmount).toBe(0)
  })
})

describe('POST /api/cart/items', () => {
  it('加入商品：購物車新增一筆 CartItem，quantity = 1', async () => {
    const res = await agent.post('/api/cart/items').send({ productId: 1 })
    expect(res.status).toBe(200)
    expect(res.body.items).toHaveLength(1)
    expect(res.body.items[0].quantity).toBe(1)
    expect(res.body.items[0].product.id).toBe(1)
  })

  it('加入同一商品：已存在的 CartItem.quantity +1，不新增第二筆', async () => {
    await agent.post('/api/cart/items').send({ productId: 1 })
    const res = await agent.post('/api/cart/items').send({ productId: 1 })
    expect(res.status).toBe(200)
    expect(res.body.items).toHaveLength(1)      // 只有 1 種商品
    expect(res.body.items[0].quantity).toBe(2)  // 數量變 2
  })

  it('加入不同商品：購物車出現 2 筆 CartItem', async () => {
    await agent.post('/api/cart/items').send({ productId: 1 })
    const res = await agent.post('/api/cart/items').send({ productId: 2 })
    expect(res.status).toBe(200)
    expect(res.body.items).toHaveLength(2)
  })

  it('加入不存在的商品回傳 404', async () => {
    const res = await agent.post('/api/cart/items').send({ productId: 99999 })
    expect(res.status).toBe(404)
  })
})

describe('PUT /api/cart/items/:itemId', () => {
  it('修改數量為 0：自動移除此 CartItem', async () => {
    const addRes = await agent.post('/api/cart/items').send({ productId: 1 })
    const itemId = addRes.body.items[0].id

    const res = await agent.put(`/api/cart/items/${itemId}`).send({ quantity: 0 })
    expect(res.status).toBe(200)
    expect(res.body.items).toHaveLength(0)
  })

  it('修改數量為正數', async () => {
    const addRes = await agent.post('/api/cart/items').send({ productId: 1 })
    const itemId = addRes.body.items[0].id

    const res = await agent.put(`/api/cart/items/${itemId}`).send({ quantity: 5 })
    expect(res.status).toBe(200)
    expect(res.body.items[0].quantity).toBe(5)
  })

  it('數量上限 99：超過時保持 99', async () => {
    const addRes = await agent.post('/api/cart/items').send({ productId: 1 })
    const itemId = addRes.body.items[0].id

    const res = await agent.put(`/api/cart/items/${itemId}`).send({ quantity: 150 })
    expect(res.status).toBe(200)
    expect(res.body.items[0].quantity).toBe(99)
  })
})

describe('合計計算', () => {
  it('2 種商品各不同數量，totalAmount 正確', async () => {
    // product 1: price = 9900，product 2: price = 7490
    await agent.post('/api/cart/items').send({ productId: 1 }) // 9900 × 1
    await agent.post('/api/cart/items').send({ productId: 2 }) // 7490 × 1

    const cartRes = await agent.get('/api/cart')
    const item2Id = cartRes.body.items.find((i: { product: { id: number } }) => i.product.id === 2).id

    await agent.put(`/api/cart/items/${item2Id}`).send({ quantity: 3 })

    const res = await agent.get('/api/cart')
    // 9900 × 1 + 7490 × 3 = 9900 + 22470 = 32370
    expect(res.body.totalAmount).toBe(32370)
  })
})

describe('DELETE /api/cart/items/:itemId', () => {
  it('移除單一商品', async () => {
    await agent.post('/api/cart/items').send({ productId: 1 })
    await agent.post('/api/cart/items').send({ productId: 2 })
    const cartRes = await agent.get('/api/cart')
    const itemId = cartRes.body.items[0].id

    const res = await agent.delete(`/api/cart/items/${itemId}`)
    expect(res.status).toBe(200)
    expect(res.body.items).toHaveLength(1)
  })
})

describe('DELETE /api/cart', () => {
  it('清空購物車', async () => {
    await agent.post('/api/cart/items').send({ productId: 1 })
    await agent.post('/api/cart/items').send({ productId: 2 })

    const res = await agent.delete('/api/cart')
    expect(res.status).toBe(200)
    expect(res.body.items).toHaveLength(0)
    expect(res.body.totalAmount).toBe(0)
  })
})

describe('POST /api/cart/checkout', () => {
  it('結帳送出：購物車被清空，回傳 orderId', async () => {
    await agent.post('/api/cart/items').send({ productId: 1 })

    const res = await agent.post('/api/cart/checkout').send({
      name: '王小明',
      email: 'wang@test.com',
      phone: '0912345678',
      address: '台北市中正區信義路一段 1 號',
    })
    expect(res.status).toBe(200)
    expect(res.body.success).toBe(true)
    expect(res.body.orderId).toMatch(/^ORD-/)

    // 結帳後購物車應被清空
    const cartRes = await agent.get('/api/cart')
    expect(cartRes.body.items).toHaveLength(0)
  })

  it('結帳欄位驗證：空 email 回傳 400', async () => {
    await agent.post('/api/cart/items').send({ productId: 1 })
    const res = await agent.post('/api/cart/checkout').send({
      name: '王小明',
      email: '',
      phone: '0912345678',
      address: '台北市',
    })
    expect(res.status).toBe(400)
    expect(res.body.fields).toHaveProperty('email')
  })
})
