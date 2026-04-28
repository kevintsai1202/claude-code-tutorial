import { describe, it, expect, afterAll } from 'vitest'
import request from 'supertest'
import { app } from '../server/app'
import { pool } from '../server/db'

afterAll(async () => {
  await pool.end()
})

describe('GET /api/products', () => {
  it('回傳所有商品列表', async () => {
    const res = await request(app).get('/api/products')
    expect(res.status).toBe(200)
    expect(res.body.products).toBeInstanceOf(Array)
    expect(res.body.products.length).toBeGreaterThan(0)
    expect(res.body.total).toBeGreaterThan(0)
  })

  it('回傳商品包含必要欄位', async () => {
    const res = await request(app).get('/api/products')
    const product = res.body.products[0]
    expect(product).toHaveProperty('id')
    expect(product).toHaveProperty('name')
    expect(product).toHaveProperty('price')
    expect(product).toHaveProperty('category')
    expect(product).toHaveProperty('imageUrl')
    expect(product).toHaveProperty('rating')
  })

  it('依分類篩選（3C）', async () => {
    const res = await request(app).get('/api/products?category=3C')
    expect(res.status).toBe(200)
    expect(res.body.products.length).toBeGreaterThan(0)
    res.body.products.forEach((p: { category: string }) => {
      expect(p.category).toBe('3C')
    })
  })

  it('依關鍵字搜尋商品名稱', async () => {
    const res = await request(app).get('/api/products?search=耳機')
    expect(res.status).toBe(200)
    expect(res.body.products.length).toBeGreaterThan(0)
  })

  it('無結果時回傳空陣列', async () => {
    const res = await request(app).get('/api/products?search=xxxxxxxxxnotfound')
    expect(res.status).toBe(200)
    expect(res.body.products).toHaveLength(0)
    expect(res.body.total).toBe(0)
  })
})

describe('GET /api/products/:id', () => {
  it('回傳單一商品詳情', async () => {
    const res = await request(app).get('/api/products/1')
    expect(res.status).toBe(200)
    expect(res.body.id).toBe(1)
    expect(res.body.name).toContain('Sony')
  })

  it('商品不存在時回傳 404', async () => {
    const res = await request(app).get('/api/products/99999')
    expect(res.status).toBe(404)
    expect(res.body).toHaveProperty('error')
  })
})
