# 除錯教學示範 — Bug Cheat Sheet

> ⚠️ **本檔僅供講師備課使用，請勿在課堂上提前發給學員。**
>
> 內含**刻意注入**的邏輯錯誤位置、現象、推薦的除錯流程、以及對應 Claude Code 指令。
> 用於課程章節 **2-4「Context 管理、會話控制與真實除錯」** 的實機示範。

---

## Bug #1 — 購物車抽屜小計顯示錯誤

### 注入位置

| 項目 | 內容 |
|---|---|
| 檔案 | `frontend/src/components/CartDrawer.tsx` |
| 函式 | `CartDrawer()` 元件本體（在 `if (!isDrawerOpen) return null;` 之後） |
| 注入版次 | 2026-04-28 |

### Bug 程式碼（已注入）

```tsx
// 為了即時反應，先在本地計算小計，避免等待 server response
// TODO: 之後評估是否可拿掉，直接用 totalAmount（伺服器版）
const localTotal = items.reduce(
  (sum, it) => sum + (it.product.price + it.quantity),  // ← 應為 *
  0
);

// ...footer 內：
<span data-testid="cart-total">{formatPrice(localTotal)}</span>
```

### 兩層錯誤（學員應全部找到）

| 層級 | 問題 | 嚴重性 |
|---|---|---|
| **L1：數學** | 用 `+` 連接 `price` 與 `quantity`，應該是 `*` | 直接導致金額不對 |
| **L2：架構** | 不該前端自算合計，違反 spec.md「合計由伺服器計算」核心規則 | 設計層次錯誤，比 L1 更值得修 |

只修 L1 會讓金額看起來對，但仍違反 spec.md。理想修正是直接用 `totalAmount`（從 `useCart()` destructure 回來）。

---

## 預期現象

### 操作步驟

1. 打開 [http://localhost:5173](http://localhost:5173)
2. 加入「Sony WH-1000XM5 無線降噪耳機」（NT$ 9,900）→ 1 件
3. 打開購物車抽屜（右上 🛒 按鈕）

### 學員會看到

| UI 顯示 | 實際正確值 | 差異 |
|---|---|---|
| **小計：NT$ 9,901** | NT$ 9,900 | +1（quantity 被誤加） |

加到 2 件時：
- UI：NT$ 9,902（9900 + 2）
- 正確：NT$ 19,800（9900 × 2）

---

## 講師示範流程（建議 5 分鐘）

### Step 1 — 喚起問題意識（30 秒）

```
講師話術：
「這個購物車跑起來了，但我們先做一個真實工程師都會做的事——
 加一個商品，看看金額對不對。」
```

加入耳機 1 件 → 打開抽屜 → 故作驚訝：「**奇怪，9,900 怎麼變 9,901？**」

### Step 2 — 用 DevTools 對比前後端（1 分鐘）

打開 Network 面板，看 `POST /api/cart/items` 的 response：

```json
{
  "items": [{ "subtotal": 9900, ... }],
  "totalAmount": 9900,        ← 伺服器回的合計是對的
  "totalQuantity": 1
}
```

**關鍵教學點**：
> 「Server 回的 `totalAmount` 是對的，但 UI 顯示卻不對——
>  代表 bug 在前端某處不信任 server 的回應、自己又算了一遍。」

### Step 3 — 切到除錯模式 + 用 Claude 找根因（2 分鐘）

```
/bug
@frontend/src/components/CartDrawer.tsx

CartDrawer 顯示的小計是 9901，但 GET /api/cart 回傳的 totalAmount 是 9900。
請找出哪裡計算錯誤，並比對 spec.md 的業務規則第 4 條（合計伺服器計算）。
```

Claude 預期回應：
1. 指出 `localTotal` 用 `+` 而非 `*`
2. 指出整段違反 spec.md「合計伺服器計算」
3. 建議修正方式：刪除 `localTotal`，從 `useCart()` 拿回 `totalAmount` 直接用

### Step 4 — 修正並驗證（1 分鐘）

修正後的 CartDrawer.tsx 應該長這樣：

```tsx
const {
  items,
  isDrawerOpen,
  closeDrawer,
  totalQuantity,
  totalAmount,           // ← 加回 destructure
  updateQuantityById,
  removeByItemId,
  clear,
  error,
} = useCart();

// （刪除 localTotal）

// footer 內：
<span data-testid="cart-total">{formatPrice(totalAmount)}</span>
```

熱重載後抽屜小計變回 9,900 ✅

### Step 5 — 收尾教學金句（30 秒）

```
講師話術：
「這個 bug 不是 Claude 寫錯，是工程師習慣性的『本地優化』陷阱。
 課程教的兩件事：
 1. spec.md 的核心規則（合計伺服器計算）必須有物理保證——
    程式碼應該『沒辦法不照規則做』，而不是『記得照規則做』。
 2. /bug + @檔案 的組合，讓 Claude 在乾淨上下文找根因，
    比一個個檔案讀過快十倍。」
```

---

## 進階教學選項

### 變化 A：搭配 `/rewind` 實作呼應

學員可以先試錯——讓 Claude 改一個錯方向，然後 `Esc Esc` → **Restore code only**，保留討論脈絡換方向重做。對應課程 2-4「會話狀態控制」。

### 變化 B：搭配 superpowers:systematic-debugging

進階班可以套用 `superpowers:systematic-debugging` 技能，強制學員列出「3 個可能假設」再驗證，避免「亂試運氣」式除錯。對應課程 4-3「Iron Laws」。

### 變化 C：寫一個 Playwright E2E 防止回歸

加完修法後，讓 Claude 產出對應 E2E：
```typescript
test('購物車抽屜小計應與 server totalAmount 一致', async ({ page }) => {
  await page.goto('http://localhost:5173');
  await page.locator('[data-testid="add-to-cart"]').first().click();
  await page.locator('[data-testid="cart-icon"]').click();

  const drawerTotal = await page.locator('[data-testid="cart-total"]').textContent();
  // 從 sessionId 拿到 server 真實 cart
  const apiTotal = await page.evaluate(async () => {
    const res = await fetch('/api/cart');
    return (await res.json()).totalAmount;
  });

  expect(drawerTotal).toContain(apiTotal.toLocaleString('zh-TW'));
});
```

這對應課程 2-3「Playwright MCP 驗證」+ 4-3「verification-before-completion」。

---

## 重設 bug 狀態

若已修正、想重新示範：

```bash
cd shopping-cart
git restore frontend/src/components/CartDrawer.tsx
```

或重新注入：把本檔「Bug 程式碼」段的 diff 套回去。

---

## 注入 bug 的設計理由

| 原則 | 說明 |
|---|---|
| **與 spec.md 規則綁定** | bug 不是隨機，而是違反某條核心業務規則。修正路徑同時鞏固規則記憶。 |
| **兩層錯誤疊加** | L1（數學）容易找、L2（架構）需要反思。學員修完 L1 還會發現 L2。 |
| **TS 編譯通過** | 邏輯錯誤的本質是「型別對、語意錯」。如果連 TS 都擋住，學不到「測試的價值」。 |
| **TODO 註解誤導** | 真實 anti-pattern 常伴隨「合理化的註解」，訓練學員識別這類陷阱。 |
| **影響範圍可控** | bug 僅影響 CartDrawer 的顯示，Checkout 頁仍用 server `totalAmount` —— 學員可以對比兩處差異作為線索。 |
