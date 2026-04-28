import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, CheckCircle, Loader2 } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { submitCheckout } from '../api/cartApi'
import type { CheckoutFormData } from '../types'

const INITIAL_FORM: CheckoutFormData = {
  name: '',
  email: '',
  phone: '',
  address: '',
}

export default function Checkout() {
  const { items, totalAmount, clearCart } = useCart()
  const navigate = useNavigate()
  const [form, setForm] = useState<CheckoutFormData>(INITIAL_FORM)
  const [errors, setErrors] = useState<Partial<CheckoutFormData>>({})
  const [submitting, setSubmitting] = useState(false)
  const [orderId, setOrderId] = useState<string | null>(null)

  // 前端表單驗證
  const validate = (): boolean => {
    const newErrors: Partial<CheckoutFormData> = {}
    if (!form.name.trim()) newErrors.name = '姓名為必填欄位'
    if (!form.email.trim()) {
      newErrors.email = 'Email 為必填欄位'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = 'Email 格式不正確'
    }
    if (!form.phone.trim()) {
      newErrors.phone = '電話為必填欄位'
    } else if (!/^[0-9\-+\s]{8,15}$/.test(form.phone)) {
      newErrors.phone = '電話格式不正確'
    }
    if (!form.address.trim()) newErrors.address = '地址為必填欄位'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    setSubmitting(true)
    try {
      const result = await submitCheckout(form)
      setOrderId(result.orderId)
      clearCart()
    } catch {
      setErrors({ name: '結帳失敗，請稍後再試' })
    } finally {
      setSubmitting(false)
    }
  }

  const handleChange = (field: keyof CheckoutFormData) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({ ...prev, [field]: e.target.value }))
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: undefined }))
  }

  // 結帳成功畫面
  if (orderId) {
    return (
      <main className="min-h-screen pt-24 pb-28 px-6 flex items-center justify-center">
        <div className="max-w-md w-full text-center space-y-6">
          <CheckCircle className="w-16 h-16 text-accent mx-auto" />
          <div>
            <h1 className="text-white text-2xl font-bold">訂單送出成功！</h1>
            <p className="text-white/50 mt-2 text-sm">感謝您的購買，我們將盡快為您出貨。</p>
          </div>
          <div className="bg-[#111111] rounded-token-lg p-4 border border-[rgba(255,255,255,0.08)]">
            <p className="text-white/40 text-xs">訂單編號</p>
            <p className="text-white font-mono text-sm mt-1">{orderId}</p>
          </div>
          <button
            onClick={() => navigate('/')}
            className="w-full bg-white text-black py-3.5 rounded-token-md font-medium text-sm hover:bg-white/90 transition-colors cursor-pointer"
          >
            繼續購物
          </button>
        </div>
      </main>
    )
  }

  // 購物車為空時導引回首頁
  if (items.length === 0) {
    return (
      <main className="min-h-screen pt-24 pb-28 px-6 flex flex-col items-center justify-center gap-4">
        <p className="text-white/40">購物車是空的，請先選購商品</p>
        <Link to="/" className="text-accent text-sm hover:text-accent-dark transition-colors">
          前往商品列表
        </Link>
      </main>
    )
  }

  return (
    <main className="min-h-screen pt-24 pb-28">
      {/* 頁首 */}
      <div className="px-6 mb-8">
        <div className="max-w-5xl mx-auto">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-white/40 hover:text-white/70 text-sm transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            返回購物
          </Link>
          <h1 className="text-white text-2xl font-bold mt-4">結帳</h1>
        </div>
      </div>

      {/* ── 主體：表單 + 訂單摘要 ──────────────────────────────── */}
      <section className="px-6">
        <div className="max-w-5xl mx-auto grid lg:grid-cols-[1fr_380px] gap-10">
          {/* 收件表單 */}
          <form onSubmit={handleSubmit} noValidate className="space-y-6">
            <h2 className="text-white text-lg font-semibold">收件資料</h2>

            {[
              { field: 'name' as const, label: '姓名', type: 'text', placeholder: '王小明' },
              { field: 'email' as const, label: 'Email', type: 'email', placeholder: 'example@mail.com' },
              { field: 'phone' as const, label: '電話', type: 'tel', placeholder: '0912 345 678' },
              { field: 'address' as const, label: '地址', type: 'text', placeholder: '台北市中正區信義路一段 1 號' },
            ].map(({ field, label, type, placeholder }) => (
              <div key={field}>
                <label
                  htmlFor={field}
                  className="block text-white/70 text-sm mb-1.5 font-medium"
                >
                  {label}
                  <span className="text-accent ml-0.5">*</span>
                </label>
                <input
                  id={field}
                  type={type}
                  placeholder={placeholder}
                  value={form[field]}
                  onChange={handleChange(field)}
                  className={`w-full bg-[#111111] border rounded-token-md px-4 py-3 text-white text-sm placeholder:text-white/25 outline-none transition-colors ${
                    errors[field]
                      ? 'border-red-500/60 focus:border-red-500'
                      : 'border-[rgba(255,255,255,0.08)] focus:border-[rgba(255,255,255,0.25)]'
                  }`}
                  aria-describedby={errors[field] ? `${field}-error` : undefined}
                />
                {errors[field] && (
                  <p id={`${field}-error`} className="mt-1.5 text-red-400 text-xs">
                    {errors[field]}
                  </p>
                )}
              </div>
            ))}

            {/* 送出按鈕（桌面版） */}
            <div className="hidden lg:block pt-2">
              <SubmitButton submitting={submitting} />
            </div>
          </form>

          {/* 訂單摘要 */}
          <aside>
            <div className="bg-[#111111] rounded-token-lg border border-[rgba(255,255,255,0.08)] p-6 sticky top-24">
              <h2 className="text-white text-base font-semibold mb-5">訂單摘要</h2>

              {/* 商品清單 */}
              <div className="space-y-4 mb-5">
                {items.map(item => (
                  <div key={item.id} className="flex items-center gap-3">
                    <img
                      src={item.product.imageUrl}
                      alt={item.product.name}
                      className="w-12 h-12 rounded-token-md object-cover bg-[#1a1a1a] shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-xs font-medium leading-snug line-clamp-2">
                        {item.product.name}
                      </p>
                      <p className="text-white/40 text-xs mt-0.5">× {item.quantity}</p>
                    </div>
                    <p className="text-white text-sm font-medium shrink-0">
                      NT${(item.product.price * item.quantity).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>

              {/* 分隔線 */}
              <div className="border-t border-[rgba(255,255,255,0.08)] my-4" />

              {/* 合計 */}
              <div className="flex items-center justify-between">
                <span className="text-white/60 text-sm">總計</span>
                <span className="text-white text-xl font-bold">
                  NT${totalAmount.toLocaleString()}
                </span>
              </div>

              {/* 送出按鈕（行動版） */}
              <div className="lg:hidden mt-5">
                <SubmitButton submitting={submitting} onClick={handleSubmit} />
              </div>
            </div>
          </aside>
        </div>
      </section>
    </main>
  )
}

function SubmitButton({
  submitting,
  onClick,
}: {
  submitting: boolean
  onClick?: (e: React.MouseEvent) => void
}) {
  return (
    <button
      type={onClick ? 'button' : 'submit'}
      onClick={onClick}
      disabled={submitting}
      className="w-full bg-white text-black py-3.5 rounded-token-md font-medium text-sm hover:bg-white/90 disabled:opacity-60 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2 cursor-pointer"
    >
      {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
      {submitting ? '處理中...' : '確認送出'}
    </button>
  )
}
