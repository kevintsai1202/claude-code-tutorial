/** 商品分類 */
export type Category = '全部' | '3C' | '服飾' | '食品'

/** 商品實體 */
export interface Product {
  id: number
  name: string
  description: string
  price: number
  category: '3C' | '服飾' | '食品'
  imageUrl: string
  rating: number
}

/** 購物車明細 */
export interface CartItem {
  id: number
  product: Product
  quantity: number
}

/** 結帳表單欄位 */
export interface CheckoutFormData {
  name: string
  email: string
  phone: string
  address: string
}
