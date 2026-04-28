import { Minus, Plus } from 'lucide-react'

interface QuantityInputProps {
  quantity: number
  onDecrease: () => void
  onIncrease: () => void
  min?: number
  max?: number
}

/** 數量調整元件：[-] n [+]，符合 WCAG 標準按鈕尺寸 */
export default function QuantityInput({
  quantity,
  onDecrease,
  onIncrease,
  min = 0,
  max = 99,
}: QuantityInputProps) {
  return (
    <div className="flex items-center gap-1">
      <button
        onClick={onDecrease}
        disabled={quantity <= min}
        className="w-7 h-7 flex items-center justify-center rounded-token-sm bg-white/5 hover:bg-white/10 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
        aria-label="減少數量"
      >
        <Minus className="w-3.5 h-3.5 text-white" />
      </button>

      <span
        data-testid="item-quantity"
        className="w-8 text-center text-white text-sm font-medium tabular-nums"
      >
        {quantity}
      </span>

      <button
        onClick={onIncrease}
        disabled={quantity >= max}
        className="w-7 h-7 flex items-center justify-center rounded-token-sm bg-white/5 hover:bg-white/10 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
        aria-label="增加數量"
      >
        <Plus className="w-3.5 h-3.5 text-white" />
      </button>
    </div>
  )
}
