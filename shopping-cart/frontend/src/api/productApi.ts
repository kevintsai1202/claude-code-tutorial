import type { Product } from '../types'

export interface ProductQuery {
  category?: string
  search?: string
  page?: number
}

/** 取得商品列表（帶分類篩選與搜尋），呼叫後端真實 API */
export async function fetchProducts(query: ProductQuery = {}): Promise<Product[]> {
  const params = new URLSearchParams()
  if (query.category && query.category !== '全部') params.set('category', query.category)
  if (query.search) params.set('search', query.search)

  const res = await fetch(`/api/products?${params}`)
  if (!res.ok) throw new Error('取得商品列表失敗')
  const data = await res.json()
  return data.products as Product[]
}

/** 取得單一商品詳情 */
export async function fetchProductById(id: number): Promise<Product | null> {
  const res = await fetch(`/api/products/${id}`)
  if (res.status === 404) return null
  if (!res.ok) throw new Error('取得商品失敗')
  return res.json() as Promise<Product>
}
