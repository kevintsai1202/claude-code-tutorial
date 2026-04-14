# 🛒 購物車系統 × 課程章節對應重點整理

> **閱讀方式**：左欄是課程教的技巧，右欄是購物車系統的具體示範動作。
> 講師可依此對照，確保每一節都有實際可執行的示範橋段。

---

## 第 1 段：Git、GitHub 與 Claude Code 起手式（50 mins）

---

### 1-1 環境安裝、登入與操作模式（15 mins）

| 課程重點 | 購物車示範動作 |
|---|---|
| `claude doctor` 環境健檢 | 安裝完成後立即執行，確認終端機輸出全綠 |
| 5 種操作模式 | 切換 **Plan Mode**：輸入「幫我設計購物車資料模型」→ Claude 只分析不寫程式 |
| VS Code 插件 vs CLI | 開啟 VS Code 插件展示自動感知；切 CLI 展示 `@` 明確參照 |
| 模型切換 | `/model opus` 設計 spec.md；`/model sonnet` 開始實作 |

**講師話術**：
> 「Plan Mode 就像叫 Claude 先畫草圖——它不會動你的程式碼，
> 只會告訴你它打算怎麼做。這讓你在 AI 動手之前有機會喊停。」

---

### 1-2 Git 常用操作與 gh CLI（20 mins）

| 課程重點 | 購物車示範動作 |
|---|---|
| `gh repo create` | `gh repo create shopping-cart --public` 終端機一鍵建好 |
| Claude 產生 commit message | 完成 spec.md 後：讓 Claude 讀 diff，輸出語意化 commit |
| `gh issue list / view` | 建立 issue「購物車加入相同商品應合併數量」→ 讓 Claude 讀 issue 開發 |
| `gh pr create` | M3 完成後發出第一個 PR，Claude 自動生成 PR body |

**示範橋段**：
```bash
# 建立 Repo
gh repo create shopping-cart --public

# 建立 Issue
gh issue create --title "購物車：加入相同商品應合併數量，不重複新增"

# Claude 讀 Issue 開發
# 在 Claude Code 中：「請根據 gh issue view 1 的需求實作合併邏輯」

# 完成後發 PR
gh pr create
# Claude 自動填入 PR 說明
```

---

### 1-3 SDD 文件驅動開發（15 mins）

| 課程重點 | 購物車示範動作 |
|---|---|
| 什麼是 SDD | 用購物車需求說明：先寫規格，再讓 Claude 照著做 |
| spec.md 的作用 | 每次任務前 `@spec.md` → Claude 知道合計怎麼算、結帳做什麼 |
| CLAUDE.md 進階設定 | 加入 playwright MCP server；設定「禁止接受客戶端傳入 totalAmount」規則 |

**示範 Prompt**：
```
「請用 Plan Mode 根據以下需求，產出購物車系統的 spec.md：
- 使用者可以瀏覽商品（分類 / 搜尋 / 分頁）
- 加入購物車：同商品自動合併數量
- 修改數量為 0：自動移除該筆明細
- 購物車合計由伺服器計算
- 結帳：填收件資料 → 送出 → 清空購物車
不要寫程式，只需要產出 spec.md 的草稿。」
```

**節點產出**：`spec.md` + `CLAUDE.md` 初始版

---

## 第 2 段：全端主線實作（75 mins）

---

### 2-1 後端生成、TDD 先行與自主修正循環（25 mins）

| 課程重點 | 購物車示範動作 |
|---|---|
| TDD 為什麼適合 AI 開發 | 「合併數量」規則一句話說不清，寫成測試才精確 |
| TDD Prompt 範本 | 先告訴 Claude 「不要實作」，確認測試後再開始 |
| Auto Mode 閉環 | 讓 Claude 自主跑完 RED → GREEN，不需每步確認 |

**TDD Prompt 範本（逐字稿）**：
```
「請先依據 @spec.md 針對 CartService 撰寫 JUnit 5 測試，
不要實作程式碼，等我確認後再開始：

1. 加入新商品：購物車新增一筆 CartItem，quantity=1
2. 加入同一商品：已有的 CartItem.quantity +1，不新增第二筆
3. 修改數量為 0：CartItem 自動被移除
4. 合計計算：商品A(price=100, qty=2) + 商品B(price=50, qty=3)
              → totalAmount 應為 350
5. 結帳後：購物車所有 CartItem 都被刪除

請先只給我測試程式碼。」
```

**JUnit 測試場景對應表**：

| 測試方法名稱 | 對應業務規則 |
|---|---|
| `addNewItem_createsCartItem` | 加入新商品 |
| `addSameItem_mergesQuantity` | 同商品合併（最關鍵） |
| `updateQuantityToZero_removesItem` | 數量=0 自動移除 |
| `calculateTotal_returnsCorrectAmount` | 合計計算 |
| `checkout_clearsAllCartItems` | 結帳後清空 |

---

### 2-2 前端鷹架、API 串接與 Playwright 驗證（25 mins）

| 課程重點 | 購物車示範動作 |
|---|---|
| spec.md 驅動 UI | `@spec.md` → Claude 知道有哪些頁面要做 |
| 假資料先行 | `mockProducts.ts` 讓 UI 先跑起來，不等後端 |
| `@` 跨層參照 | 同時 `@CartController.java @cartApi.ts` 讓 Claude 看到串接點 |
| Playwright `browser_snapshot` | Claude 讀頁面語意樹驗證功能，而非猜測像素 |

**Playwright MCP 驗證 Prompt**：
```
「請用 playwright 打開 localhost:5173：
1. 確認商品列表顯示至少 6 筆商品
2. 點擊第一筆商品的『加入購物車』按鈕
3. 驗證導覽列購物車 badge 從 0 變為 1
4. 再點一次同一商品的『加入購物車』
5. 驗證 badge 變為 2（數量合併，不是 2 個不同商品）
6. 點購物車圖示，確認抽屜打開且顯示正確商品和金額」
```

**E2E 腳本（讓 Claude 產出）**：
```typescript
// e2e/cart.spec.ts
test('加入相同商品應合併數量', async ({ page }) => {
  await page.goto('http://localhost:5173')
  
  const addBtn = page.locator('[data-testid="add-to-cart"]').first()
  await addBtn.click()
  await expect(page.locator('[data-testid="cart-badge"]')).toHaveText('1')
  
  await addBtn.click()  // 同一個商品再加一次
  await expect(page.locator('[data-testid="cart-badge"]')).toHaveText('2')
  
  await page.locator('[data-testid="cart-icon"]').click()
  const cartItems = page.locator('[data-testid="cart-item"]')
  await expect(cartItems).toHaveCount(1)  // 只有 1 種商品（數量=2）
  await expect(page.locator('[data-testid="item-quantity"]')).toHaveText('2')
})
```

---

### 2-3 真實除錯與上下文管理（25 mins）

**三個預計出現的真實錯誤**（按難度排序）：

| 錯誤 | 現象 | 示範指令 |
|---|---|---|
| CORS 錯誤 | React 呼叫 API 時 console 紅字 | `/bug` + 貼上錯誤訊息 |
| badge 不即時更新 | 加入購物車後數字沒變，reload 才對 | `@CartContext.tsx @CartBadge.tsx` 找根因 |
| 數量修改後金額沒刷新 | 拉動 [-][+] 后小計沒變 | `/rewind` 回退，改正確的 state 更新方式 |

**Slash Command 使用時機對照**：

| 指令 | 購物車示範時機 |
|---|---|
| `/bug` | CORS 錯誤出現時，切出專注除錯模式 |
| `/rewind` | 修金額刷新的方向錯了，快速回到上一步 |
| `/compact` | 修完 badge bug 後壓縮垃圾對話 |
| `/clear` | 開始做結帳頁面前，清掉購物車的除錯記憶 |

---

## 第 3 段：企業 Skill、輔助技能與背景 Agent（60 mins）

---

### 3-1 用 `skill-creator` 製作資安 Skill（25 mins）

**資安 Skill 設計（購物車電商版）**：

```markdown
# security-check.skill.md

## 輸入：Java Service 或 Controller 檔案

## 購物車電商常見漏洞檢查清單
- [ ] session ID 有無可被客戶端自定義（應由後端 UUID 產生）
- [ ] totalAmount 有無防止從客戶端傳入（結帳金額不能讓前端說了算）
- [ ] /checkout 有無驗證收件資料（name/email 不能為空）
- [ ] Cart 有無跨 session 存取保護（A 不能看 B 的購物車）

## 輸出：🔴 高風險 / 🟡 中風險 / 🟢 通過
```

**套用示範**：掃描 `CartController.java`，預期找到：
> 🔴 `POST /api/cart/checkout` 接受 request body 中的 totalAmount 欄位  
> 🟡 session 有效期未設定  

**Hooks 說明**：`PreToolUse` — 每次寫入 `.java` 檔前自動觸發此 Skill

---

### 3-2 開發輔助技能導覽（15 mins）

**購物車開發各場景 Skill 選用**：

| 場景 | 選哪個 Skill | 為什麼 |
|---|---|---|
| 掃描電商安全漏洞 | `security-check`（自製） | 固定規範，會重複使用 |
| 查 Spring Boot `@SessionAttribute` 最新用法 | `firecrawl` | 需要即時文件 |
| 產出《購物車系統規格書》DOCX | `docx` | 輸出格式固定 |
| 快速生成符合設計系統的商品卡片元件 | `reactcomponents` | 有風格規範可套用 |
| 臨時問「`useContext` 怎麼用」 | 直接問 Claude | 一次性探索，不需 Skill |

---

### 3-3 `/agent` 背景長任務（20 mins）

**這節的重點示範**：把「生成測試資料」這件枯燥但必要的事交給背景 Agent

**Agent 任務 Prompt**：
```
/agent「請按照 @spec.md 的 Product 資料模型，
生成 30 筆符合台灣電商風格的商品假資料：
- 3C 10 筆（耳機、鍵盤、滑鼠、手機殼等，price 500~30000）
- 服飾 10 筆（Uniqlo 台灣常見商品風格，price 300~3000）
- 食品 10 筆（台灣特產、零食、飲品，price 50~500）
name 和 description 要像真實電商文案，rating 介於 3.5~5.0
輸出到 src/test/resources/seed-products.json
同時產出 DataInitializer.java，在應用程式啟動時自動載入資料
完成後回報：生成了幾筆、各 category 各幾筆」
```

**主線同時在做**（對話框右邊繼續改結帳頁面 UI）

**講師話術**：
> 「你看，Agent 在背景生成假資料，我這邊繼續改結帳表單的 UI。
> 等它回報完成，我再把資料拉進來——這就是 /agent 的價值：
> 把高噪音、跟你當下任務無關的工作切出去，不打斷你的心流。」

---

## 第 4 段：Review、程式優化與收尾（25 mins）

---

### 4-1 `/review` + `/simplify`（10 mins）

**完整收尾迴圈（購物車版）**：

```
Step 1 — review 最複雜的 Service：
/review @src/service/CartService.java

預期 Claude 發現：
→ 正確性：addItem() 沒有處理 quantity <= 0 的輸入（防呆）
→ 安全性：calculateTotal() 使用 float 可能有精度問題（應用 BigDecimal）
→ 可讀性：addItem() 方法含商品查詢 + 合併判斷 + 存檔三件事，建議拆開

Step 2 — 修正後 simplify：
/simplify @src/service/CartService.java
→ Claude 把 addItem() 拆成 findOrCreateCartItem() + save()

Step 3 — 驗證重構沒壞測試：
mvn test → 全 GREEN ✅

Step 4 — 再 review 確認：
/review @src/service/CartService.java
→ 無高嚴重性問題 ✅
```

---

### 4-2 Slash Commands 完整工作流總覽（15 mins）

**購物車完整開發工作流**：

```mermaid
flowchart LR
  A["/init\nCLAUDE.md"] --> B["/plan\nspec.md"]
  B --> C["開發循環\n@spec.md 驅動"]
  C --> D["/bug\nCORS + badge"]
  D --> E["/compact\n壓縮除錯"]
  E --> F["/review\nCartService"]
  F --> G["/simplify\n精簡邏輯"]
  G --> H["gh pr create\nClaude 生成 PR"]
```

**收尾動作（逐字稿）**：
```
讓 Claude 做：
「請整理目前所有修改的 diff，
給我一個符合 Conventional Commits 格式的 commit message」

→ feat: implement cart with shopping cart core features
  - add product listing with category filter and search
  - add cart item merge logic for duplicate products
  - add checkout with form validation and cart cleanup
  - add Playwright E2E tests for cart badge update

git add .
git commit -m "[上面的訊息]"
gh pr create  ← 貼 Claude 生成的 PR body
gh pr checks  ← 確認 JUnit + ESLint + Playwright 三道全過
```

---

## 第 5 段：Harness Engineering（20 mins）

---

### Harness 對應表（購物車版）

| 購物車做過的事 | 對應 Harness 組件 |
|---|---|
| `CLAUDE.md`（「合計伺服器計算」「合併不重複」） | 靜態上下文層（Single Source of Truth） |
| JUnit 5 合計 / 合併 / 清空測試（Red→Green） | 錯誤恢復與回饋迴路 |
| `PreToolUse` Hook 觸發資安 Skill | 架構約束與自動驗證閘門 |
| `/agent` 生成 30 筆商品假資料 | 工具協調層（長任務委派） |
| Playwright MCP 驗證 badge 更新 | 可觀測性與自動化驗收 |
| `/review` + `/simplify` CartService | 熵管理（防止程式碼劣化） |
| Plan Mode → 確認 spec → 實作 | Human-in-the-Loop 檢查點 |

---

## 快速對照表（講師備課用）

| 節次 | 購物車關鍵操作 | 指令 / 工具 |
|---|---|---|
| 1-1 | `claude doctor` + Plan Mode 示範 | `claude doctor` / `Shift+Tab` |
| 1-2 | `gh repo create` + Claude 寫 commit | `gh repo create` / `gh pr create` |
| 1-3 | 自然語言需求 → `spec.md` | Plan Mode + `@spec.md` |
| 2-1 | TDD：「合併數量」測試先寫 | TDD Prompt + Auto Mode |
| 2-2 | Playwright 驗證 badge 數量合併 | `browser_snapshot` |
| 2-3 | 修 CORS + badge 不更新 + 金額不刷新 | `/bug` / `/rewind` / `/compact` |
| 3-1 | 資安 Skill 掃 CartController | `skill-creator` + `PreToolUse` Hook |
| 3-2 | 各場景 Skill 選用說明 | `firecrawl` / `docx` / `reactcomponents` |
| 3-3 | `/agent` 生成 30 筆商品假資料 | `/agent` |
| 4-1 | `/review` + `/simplify` CartService | `/review` / `/simplify` |
| 4-2 | 完整工作流回顧 + 最終 PR | `gh pr create` + `gh pr checks` |
| 5-x | Harness 升級路徑說明 | CLAUDE.md / AGENTS.md |
