import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { X, Trash2, ShoppingBag } from 'lucide-react'
import { useCart } from '../context/CartContext'
import QuantityInput from './QuantityInput'

/** 購物車側滑抽屜（從右側滑入），含商品列表與結帳入口 */
export default function CartDrawer() {
  const { items, totalAmount, totalItems, isCartOpen, closeCart, updateQuantity, removeItem } =
    useCart()
  const navigate = useNavigate()

  // 開啟時鎖定背景捲動
  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isCartOpen])

  const handleCheckout = () => {
    closeCart()
    navigate('/checkout')
  }

  return (
    <>
      {/* 半透明背景遮罩 */}
      <div
        className={`fixed inset-0 z-50 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${
          isCartOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={closeCart}
        aria-hidden="true"
      />

      {/* 抽屜本體 */}
      <aside
        className={`fixed right-0 top-0 z-50 h-full w-full max-w-md bg-[#111111] border-l border-[rgba(255,255,255,0.08)] flex flex-col transition-transform duration-300 ease-out ${
          isCartOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        role="dialog"
        aria-label="購物車"
        aria-modal="true"
      >
        {/* 標題列 */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[rgba(255,255,255,0.08)] shrink-0">
          <h2 className="text-white text-lg font-semibold">
            購物車
            {totalItems > 0 && (
              <span className="ml-2 text-white/50 text-sm font-normal">{totalItems} 件</span>
            )}
          </h2>
          <button
            onClick={closeCart}
            className="p-1.5 rounded-token-sm hover:bg-white/5 transition-colors cursor-pointer"
            aria-label="關閉購物車"
          >
            <X className="w-5 h-5 text-white/70" />
          </button>
        </div>

        {/* 商品列表 */}
        <div className="flex-1 overflow-y-auto py-4 px-6 space-y-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
              <ShoppingBag className="w-12 h-12 text-white/20" />
              <p className="text-white/40 text-sm">購物車是空的</p>
              <button
                onClick={closeCart}
                className="text-accent text-sm hover:text-accent-dark transition-colors cursor-pointer"
              >
                繼續購物
              </button>
            </div>
          ) : (
            items.map(item => (
              <div
                key={item.id}
                data-testid="cart-item"
                className="flex gap-4 py-4 border-b border-[rgba(255,255,255,0.06)] last:border-0"
              >
                {/* 商品縮圖 */}
                <img
                  src={item.product.imageUrl}
                  alt={item.product.name}
                  className="w-16 h-16 rounded-token-md object-cover bg-[#1a1a1a] shrink-0"
                />

                {/* 商品資訊 */}
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-medium leading-snug line-clamp-2">
                    {item.product.name}
                  </p>
                  <p className="text-white/60 text-xs mt-1">
                    NT${item.product.price.toLocaleString()} × {item.quantity}
                  </p>

                  <div className="flex items-center justify-between mt-2.5">
                    <QuantityInput
                      quantity={item.quantity}
                      onDecrease={() => updateQuantity(item.id, item.quantity - 1)}
                      onIncrease={() => updateQuantity(item.id, item.quantity + 1)}
                    />

                    <button
                      onClick={() => removeItem(item.id)}
                      className="p-1.5 rounded-token-sm hover:bg-white/5 text-white/40 hover:text-white/70 transition-colors cursor-pointer"
                      aria-label={`移除 ${item.product.name}`}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* 底部結帳區 */}
        {items.length > 0 && (
          <div className="px-6 py-5 border-t border-[rgba(255,255,255,0.08)] shrink-0 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-white/60 text-sm">小計</span>
              <span className="text-white text-xl font-semibold">
                NT${totalAmount.toLocaleString()}
              </span>
            </div>

            <button
              onClick={handleCheckout}
              className="w-full bg-white text-black py-3.5 rounded-token-md font-medium text-sm hover:bg-white/90 transition-colors cursor-pointer"
            >
              前往結帳 →
            </button>
          </div>
        )}
      </aside>
    </>
  )
}
