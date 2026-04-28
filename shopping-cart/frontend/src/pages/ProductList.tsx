import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Search, SlidersHorizontal } from 'lucide-react'
import { fetchProducts } from '../api/productApi'
import ProductCard from '../components/ProductCard'
import type { Product, Category } from '../types'

const CATEGORIES: Category[] = ['全部', '3C', '服飾', '食品']
const PAGE_SIZE = 12

export default function ProductList() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [products, setProducts] = useState<Product[]>([])
  const [filtered, setFiltered] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState<Category>('全部')
  const [search, setSearch] = useState(searchParams.get('search') ?? '')
  const [showCount, setShowCount] = useState(PAGE_SIZE)

  // 載入所有商品
  useEffect(() => {
    setLoading(true)
    fetchProducts().then(data => {
      setProducts(data)
      setLoading(false)
    })
  }, [])

  // 前端篩選（分類 + 搜尋）
  useEffect(() => {
    let result = [...products]

    if (activeCategory !== '全部') {
      result = result.filter(p => p.category === activeCategory)
    }

    const term = search.trim().toLowerCase()
    if (term) {
      result = result.filter(
        p =>
          p.name.toLowerCase().includes(term) ||
          p.description.toLowerCase().includes(term),
      )
    }

    setFiltered(result)
    setShowCount(PAGE_SIZE)
  }, [products, activeCategory, search])

  // 同步 URL 搜尋參數
  useEffect(() => {
    const urlSearch = searchParams.get('search') ?? ''
    setSearch(urlSearch)
  }, [searchParams])

  const handleCategoryChange = (cat: Category) => {
    setActiveCategory(cat)
    setSearch('')
    setSearchParams({})
  }

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (search.trim()) {
      setSearchParams({ search: search.trim() })
    } else {
      setSearchParams({})
    }
  }

  const visibleProducts = filtered.slice(0, showCount)
  const hasMore = showCount < filtered.length

  return (
    <main className="min-h-screen">
      {/* ── Hero Section（112px 呼吸空間） ─────────────────────────── */}
      <section className="pt-36 pb-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-accent text-sm font-medium tracking-widest uppercase mb-4">
            精選好物，每日更新
          </p>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-[1.1] tracking-tight">
            探索你喜歡的
            <br />
            <span className="text-white/50">每一件商品</span>
          </h1>
          <p className="mt-6 text-white/50 text-lg max-w-xl mx-auto leading-relaxed">
            3C 科技、質感服飾、台灣食品，一站購足。品質保證，快速到貨。
          </p>
        </div>
      </section>

      {/* ── 篩選列 ───────────────────────────────────────────────── */}
      <section className="px-6 pb-10">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            {/* 分類 Tabs */}
            <div className="flex items-center gap-2 flex-wrap">
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  onClick={() => handleCategoryChange(cat)}
                  className={`px-4 py-1.5 rounded-token-full text-sm font-medium transition-colors duration-200 cursor-pointer ${
                    activeCategory === cat
                      ? 'bg-white text-black'
                      : 'bg-white/5 text-white/70 hover:bg-white/10 border border-[rgba(255,255,255,0.08)]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* 搜尋列 */}
            <form
              onSubmit={handleSearchSubmit}
              className="flex items-center gap-2 bg-white/5 border border-[rgba(255,255,255,0.08)] rounded-token-md px-4 py-2 sm:ml-auto sm:w-64"
            >
              <Search className="w-4 h-4 text-white/40 shrink-0" />
              <input
                type="text"
                placeholder="搜尋商品..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="bg-transparent text-white text-sm placeholder:text-white/30 outline-none flex-1 min-w-0"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => {
                    setSearch('')
                    setSearchParams({})
                  }}
                  className="text-white/30 hover:text-white/60 transition-colors cursor-pointer text-xs"
                >
                  ✕
                </button>
              )}
            </form>
          </div>

          {/* 結果統計 */}
          <p className="mt-4 text-white/40 text-sm flex items-center gap-2">
            <SlidersHorizontal className="w-3.5 h-3.5" />
            共 {filtered.length} 件商品
            {search && (
              <span>
                ，搜尋「<span className="text-white/70">{search}</span>」
              </span>
            )}
          </p>
        </div>
      </section>

      {/* ── 商品格線 ─────────────────────────────────────────────── */}
      <section className="px-6 pb-28">
        <div className="max-w-7xl mx-auto">
          {loading ? (
            /* 骨架屏 */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="bg-[#111111] rounded-token-lg overflow-hidden animate-pulse"
                >
                  <div className="aspect-[4/3] bg-white/5" />
                  <div className="p-4 space-y-2">
                    <div className="h-4 bg-white/5 rounded w-3/4" />
                    <div className="h-4 bg-white/5 rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-24">
              <p className="text-white/30 text-lg">找不到符合的商品</p>
              <button
                onClick={() => {
                  setSearch('')
                  setActiveCategory('全部')
                  setSearchParams({})
                }}
                className="mt-4 text-accent text-sm cursor-pointer hover:text-accent-dark transition-colors"
              >
                清除篩選條件
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {visibleProducts.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              {/* 載入更多 */}
              {hasMore && (
                <div className="mt-12 text-center">
                  <button
                    onClick={() => setShowCount(c => c + PAGE_SIZE)}
                    className="px-8 py-3 border border-[rgba(255,255,255,0.15)] text-white/70 hover:text-white hover:border-[rgba(255,255,255,0.3)] rounded-token-md text-sm font-medium transition-colors duration-200 cursor-pointer"
                  >
                    載入更多（還有 {filtered.length - showCount} 件）
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </main>
  )
}
