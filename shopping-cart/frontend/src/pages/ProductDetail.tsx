import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Star, ShoppingCart, Package } from 'lucide-react'
import { fetchProductById } from '../api/productApi'
import { useCart } from '../context/CartContext'
import type { Product } from '../types'

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [added, setAdded] = useState(false)
  const { addToCart, openCart } = useCart()

  useEffect(() => {
    if (!id) return
    setLoading(true)
    fetchProductById(Number(id)).then(data => {
      setProduct(data)
      setLoading(false)
    })
  }, [id])

  const handleAddToCart = () => {
    if (!product) return
    addToCart(product)
    setAdded(true)
    setTimeout(() => setAdded(false), 1500)
  }

  const handleAddAndOpen = () => {
    if (!product) return
    addToCart(product)
    openCart()
  }

  if (loading) {
    return (
      <main className="min-h-screen pt-24 px-6">
        <div className="max-w-5xl mx-auto grid lg:grid-cols-2 gap-12 animate-pulse">
          <div className="aspect-[4/3] bg-[#111111] rounded-token-lg" />
          <div className="space-y-4 pt-4">
            <div className="h-6 bg-[#111111] rounded w-1/3" />
            <div className="h-10 bg-[#111111] rounded w-full" />
            <div className="h-10 bg-[#111111] rounded w-4/5" />
            <div className="h-20 bg-[#111111] rounded w-full" />
          </div>
        </div>
      </main>
    )
  }

  if (!product) {
    return (
      <main className="min-h-screen pt-24 px-6 flex flex-col items-center justify-center gap-4">
        <Package className="w-12 h-12 text-white/20" />
        <p className="text-white/40">找不到此商品</p>
        <Link to="/" className="text-accent text-sm hover:text-accent-dark transition-colors">
          返回商品列表
        </Link>
      </main>
    )
  }

  return (
    <main className="min-h-screen pt-24 pb-28">
      {/* 麵包屑 */}
      <div className="px-6 mb-8">
        <div className="max-w-5xl mx-auto">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-white/40 hover:text-white/70 text-sm transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            返回商品列表
          </Link>
        </div>
      </div>

      {/* ── 商品主體（圖片 + 資訊雙欄） ─────────────────────────────── */}
      <section className="px-6">
        <div className="max-w-5xl mx-auto grid lg:grid-cols-2 gap-12">
          {/* 商品圖片 */}
          <div className="relative">
            <div className="aspect-[4/3] rounded-token-lg overflow-hidden bg-[#111111]">
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* 分類標籤 */}
            <span className="absolute top-4 left-4 bg-black/70 backdrop-blur-sm text-white/90 text-xs px-3 py-1 rounded-token-full font-medium">
              {product.category}
            </span>
          </div>

          {/* 商品資訊 */}
          <div className="flex flex-col gap-6">
            {/* 評分 */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.round(product.rating)
                        ? 'text-amber-400 fill-amber-400'
                        : 'text-white/20'
                    }`}
                  />
                ))}
              </div>
              <span className="text-white/50 text-sm">{product.rating.toFixed(1)} / 5.0</span>
            </div>

            {/* 商品名稱 */}
            <h1 className="text-white text-2xl md:text-3xl font-bold leading-snug">
              {product.name}
            </h1>

            {/* 價格 */}
            <div>
              <p className="text-white/40 text-xs mb-1">售價</p>
              <p className="text-white text-4xl font-bold">
                NT${product.price.toLocaleString()}
              </p>
            </div>

            {/* 商品描述 */}
            <p className="text-white/60 text-sm leading-relaxed">{product.description}</p>

            {/* 標籤 */}
            <div className="flex flex-wrap gap-2">
              <span className="text-xs text-white/50 bg-white/5 px-3 py-1 rounded-token-full border border-[rgba(255,255,255,0.08)]">
                快速到貨
              </span>
              <span className="text-xs text-white/50 bg-white/5 px-3 py-1 rounded-token-full border border-[rgba(255,255,255,0.08)]">
                品質保證
              </span>
              <span className="text-xs text-white/50 bg-white/5 px-3 py-1 rounded-token-full border border-[rgba(255,255,255,0.08)]">
                7 天鑑賞期
              </span>
            </div>

            {/* CTA 按鈕組 */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                onClick={handleAddToCart}
                className={`flex-1 flex items-center justify-center gap-2 py-3.5 rounded-token-md font-medium text-sm transition-all duration-200 cursor-pointer ${
                  added
                    ? 'bg-accent text-white'
                    : 'bg-accent hover:bg-accent-dark text-white'
                }`}
                aria-label="加入購物車"
              >
                <ShoppingCart className="w-4 h-4" />
                {added ? '已加入 ✓' : '加入購物車'}
              </button>

              <button
                onClick={handleAddAndOpen}
                className="flex-1 py-3.5 rounded-token-md font-medium text-sm bg-white text-black hover:bg-white/90 transition-colors cursor-pointer"
              >
                立即購買
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
