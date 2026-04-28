import { Link } from 'react-router-dom'
import { Star, ShoppingCart } from 'lucide-react'
import { useCart } from '../context/CartContext'
import type { Product } from '../types'

interface ProductCardProps {
  product: Product
}

/** 商品卡片：圖片佔 70%+ 面積，文字資訊極簡化 */
export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart()

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault() // 防止觸發 Link 導航
    addToCart(product)
  }

  return (
    <Link
      to={`/products/${product.id}`}
      className="group block bg-[#111111] rounded-token-lg overflow-hidden border border-[rgba(255,255,255,0.06)] hover:border-[rgba(255,255,255,0.12)] transition-colors duration-200"
    >
      {/* 商品圖片區（佔卡片 72% 高度） */}
      <div className="aspect-[4/3] relative overflow-hidden bg-[#1a1a1a]">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          loading="lazy"
        />

        {/* 分類標籤 */}
        <span className="absolute top-3 left-3 bg-black/60 backdrop-blur-sm text-white/90 text-xs px-2.5 py-1 rounded-token-full font-medium">
          {product.category}
        </span>

        {/* 快速加入購物車按鈕（hover 才出現） */}
        <button
          onClick={handleAddToCart}
          data-testid="add-to-cart"
          className="absolute bottom-3 right-3 bg-accent hover:bg-accent-dark text-white px-3 py-2 rounded-token-md text-xs font-medium flex items-center gap-1.5 opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0 transition-all duration-200 cursor-pointer shadow-lg"
          aria-label={`加入 ${product.name} 到購物車`}
        >
          <ShoppingCart className="w-3.5 h-3.5" />
          加入購物車
        </button>
      </div>

      {/* 商品資訊（精簡，只顯示必要資訊） */}
      <div className="p-4">
        <h3 className="text-white text-sm font-medium leading-snug line-clamp-2 min-h-[2.5rem]">
          {product.name}
        </h3>

        <div className="flex items-center justify-between mt-3">
          {/* 價格 */}
          <span className="text-white font-semibold text-base">
            NT${product.price.toLocaleString()}
          </span>

          {/* 評分 */}
          <div className="flex items-center gap-1">
            <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <span className="text-white/60 text-xs">{product.rating.toFixed(1)}</span>
          </div>
        </div>
      </div>
    </Link>
  )
}
