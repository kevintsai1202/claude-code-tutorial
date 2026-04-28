import { pool } from '../db'

interface ProductRow {
  id: number
  name: string
  description: string
  price: number
  category: string
  image_url: string
  rating: string
}

/**
 * 將資料庫列轉換為 API 回應格式
 * image_url → imageUrl，rating 字串轉數字
 */
function toProduct(row: ProductRow) {
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    price: row.price,
    category: row.category,
    imageUrl: row.image_url,
    rating: parseFloat(row.rating),
  }
}

/** 查詢商品列表，支援分類篩選與關鍵字搜尋 */
export async function findAll(category?: string, search?: string) {
  const conditions: string[] = []
  const params: unknown[] = []

  if (category) {
    params.push(category)
    conditions.push(`category = $${params.length}`)
  }

  if (search) {
    params.push(`%${search}%`)
    conditions.push(`name ILIKE $${params.length}`)
  }

  const where = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : ''
  const { rows } = await pool.query<ProductRow>(`SELECT * FROM product ${where} ORDER BY id`, params)
  const products = rows.map(toProduct)
  return { products, total: products.length }
}

/** 依 ID 查詢單一商品，不存在時回傳 null */
export async function findById(id: number) {
  const { rows } = await pool.query<ProductRow>('SELECT * FROM product WHERE id = $1', [id])
  if (rows.length === 0) return null
  return toProduct(rows[0])
}
