import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ShoppingBag, ShoppingCart, Search, Menu, X } from 'lucide-react'
import { useCart } from '../context/CartContext'

export default function Navbar() {
  const { totalItems, openCart } = useCart()
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [menuOpen, setMenuOpen] = useState(false)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (search.trim()) {
      navigate(`/?search=${encodeURIComponent(search.trim())}`)
      setMenuOpen(false)
    }
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 bg-[#0a0a0a]/90 backdrop-blur-xl border-b border-[rgba(255,255,255,0.08)]">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between gap-4">
        {/* 品牌 Logo */}
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <ShoppingBag className="w-5 h-5 text-accent" />
          <span className="text-white font-semibold text-base tracking-tight">
            ShopCart
          </span>
        </Link>

        {/* 搜尋列（桌面） */}
        <form
          onSubmit={handleSearch}
          className="hidden md:flex items-center gap-2 flex-1 max-w-sm bg-white/5 border border-[rgba(255,255,255,0.08)] rounded-[var(--radius-md)] px-4 py-2"
        >
          <Search className="w-4 h-4 text-white/40 shrink-0" />
          <input
            type="text"
            placeholder="搜尋商品..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="bg-transparent text-white text-sm placeholder:text-white/30 outline-none flex-1 min-w-0"
          />
        </form>

        {/* 右側操作 */}
        <div className="flex items-center gap-2">
          {/* 購物車圖示 */}
          <button
            onClick={openCart}
            data-testid="cart-icon"
            className="relative p-2 rounded-token-md hover:bg-white/5 transition-colors cursor-pointer"
            aria-label={`購物車，共 ${totalItems} 件`}
          >
            <ShoppingCart className="w-5 h-5 text-white" />
            {totalItems > 0 && (
              <span
                data-testid="cart-badge"
                className="absolute -top-1 -right-1 bg-accent text-white text-xs w-5 h-5 rounded-token-full flex items-center justify-center font-semibold leading-none"
              >
                {totalItems > 99 ? '99+' : totalItems}
              </span>
            )}
          </button>

          {/* 行動版漢堡選單 */}
          <button
            onClick={() => setMenuOpen(v => !v)}
            className="md:hidden p-2 rounded-token-md hover:bg-white/5 transition-colors cursor-pointer"
            aria-label="選單"
          >
            {menuOpen ? (
              <X className="w-5 h-5 text-white" />
            ) : (
              <Menu className="w-5 h-5 text-white" />
            )}
          </button>
        </div>
      </div>

      {/* 行動版下拉搜尋列 */}
      {menuOpen && (
        <div className="md:hidden border-t border-[rgba(255,255,255,0.08)] px-6 py-4 bg-[#0a0a0a]">
          <form onSubmit={handleSearch} className="flex items-center gap-2">
            <Search className="w-4 h-4 text-white/40 shrink-0" />
            <input
              type="text"
              placeholder="搜尋商品..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="bg-transparent text-white text-sm placeholder:text-white/30 outline-none flex-1"
              autoFocus
            />
            <button
              type="submit"
              className="text-accent text-sm font-medium cursor-pointer"
            >
              搜尋
            </button>
          </form>
        </div>
      )}
    </nav>
  )
}
