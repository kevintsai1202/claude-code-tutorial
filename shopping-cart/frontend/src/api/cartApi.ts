import type { CheckoutFormData } from '../types'

/** 結帳：送出表單到後端，後端驗證並清空購物車 */
export async function submitCheckout(
  formData: CheckoutFormData,
): Promise<{ success: boolean; orderId: string }> {
  const res = await fetch('/api/cart/checkout', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(formData),
  })

  if (!res.ok) {
    const data = await res.json().catch(() => ({}))
    throw new Error((data as { error?: string }).error ?? '結帳失敗，請稍後再試')
  }

  return res.json() as Promise<{ success: boolean; orderId: string }>
}
