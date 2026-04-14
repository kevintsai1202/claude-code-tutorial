# 🛒 購物車系統 — 課程漸進式實作計畫（5 Milestones）

> **作品**：商品瀏覽 + 購物車管理 + 結帳表單的前後端系統  
> **範圍**：不含訂單狀態機與庫存扣減，聚焦購物車核心流程  
> **技術棧**：Spring Boot 3 + JPA + H2 / React + Vite + TypeScript / JUnit 5 + Playwright MCP

---

## 作品全貌

```mermaid
flowchart LR
  M1["🟢 M1\nRepo + spec.md\n骨架打底"]
  M2["🔵 M2\n商品查詢 + 購物車 CRUD\n後端完工"]
  M3["🟣 M3\n商品列表 + 購物車抽屜\n前端串接"]
  M4["🟠 M4\n資安 Skill\n測試資料 Agent"]
  M5["🔴 M5\nReview + PR\nHarness 收尾"]
  M1 --> M2 --> M3 --> M4 --> M5
```

| Milestone | 課程對應 | 時間目標 | 可展示成果 |
|---|---|---|---|
| **M1** — 骨架打底 | 第 1 段（50 min） | T+50 | Repo + CLAUDE.md + spec.md |
| **M2** — 後端完工 | 第 2-1 段（25 min） | T+75 | 購物車 CRUD + 合計計算 全 GREEN |
| **M3** — 全端串接 | 第 2-2、2-3 段（50 min） | T+125 | 商品列表 + 購物車抽屜 + E2E 驗證 |
| **M4** — 智能強化 | 第 3 段（60 min） | T+185 | 資安 Skill + 30 筆商品測試資料 |
| **M5** — 收尾發布 | 第 4-5 段（45 min） | T+230 | PR 通過 CI + Harness 升級文件 |

---

## 核心資料模型

```
Product（商品）
├── id, name, description
├── price, category（3C / 服飾 / 食品）
├── imageUrl
└── rating（1~5，測試資料帶入）

Cart（購物車）
├── id, sessionId   ← 未登入用 session ID
└── items[]

CartItem（購物車明細）
├── cart, product
└── quantity        ← 上限 99 件

CheckoutRequest（結帳表單資料）
└── name, email, phone, address, cartId
```

---

## 業務規則

```
加入購物車：同商品再次加入 → 數量 +1，不重複新增
修改數量：  quantity = 0 → 自動移除
合計計算：  Σ (quantity × price)，伺服器計算
結帳送出：  驗證欄位不為空 → 清空購物車 → 回傳確認訊息
            （不做庫存扣減、不產生訂單記錄）
```

---

## Milestone 1：骨架打底（第 1 段）

### 📋 任務清單

- [ ] `claude doctor` + `gh repo create shopping-cart --public`
- [ ] `/init` 初始化 `CLAUDE.md`：

```markdown
## 技術棧
- 後端：Spring Boot 3 + Spring Data JPA + H2
- 前端：React + Vite + TypeScript
- 測試：JUnit 5 / Playwright MCP

## 核心規則
- 購物車合計由伺服器計算，禁止接受客戶端傳入 totalAmount
- 同一商品加入購物車時合併數量，不重複新增 CartItem
- session ID 由後端產生，不接受客戶端自定義
```

- [ ] Plan Mode：描述需求 → Claude 產出 `spec.md`
  - 資料模型（Product / Cart / CartItem / CheckoutRequest）
  - 業務規則（合併數量、自動移除、合計計算、結帳清空）
  - API 端點清單
- [ ] 確認 spec.md 後 commit + push

### 🎯 M1 結束產出

```
shopping-cart/
├── CLAUDE.md   ← 技術棧 + 核心規則
├── spec.md     ← 購物車完整規格
└── README.md
```

---

## Milestone 2：後端完工（第 2-1 段）

### 📋 任務清單

**TDD 先行（Prompt 範本）**：
> 「請先依據 @spec.md 針對以下場景撰寫 JUnit 5 測試，**不要實作**：
> 1. 加入商品：購物車新增一筆 CartItem，quantity = 1
> 2. 加入同一商品：已存在的 CartItem.quantity +1，不新增第二筆
> 3. 修改數量為 0：自動移除此 CartItem
> 4. 合計計算：2 種商品各 quantity 不同，totalAmount 正確
> 5. 結帳送出：購物車被清空（CartItem 全部刪除）
> 等我確認測試場景後再開始實作。」

- [ ] 確認測試後建立骨架：

```
src/main/java/com/example/shoppingcart/
├── entity/
│   ├── Product.java
│   ├── Cart.java
│   └── CartItem.java
├── repository/
├── service/
│   ├── ProductService.java     ← 查詢、篩選、搜尋
│   └── CartService.java        ← addItem / updateQuantity / checkout
├── controller/
│   ├── ProductController.java
│   └── CartController.java
└── dto/
    ├── CartResponse.java       ← 含 items[] + totalAmount
    └── CheckoutRequest.java    ← 收件資料驗證
```

- [ ] `mvn test` → RED → Auto Mode 跑完 → GREEN
- [ ] 全部 GREEN 後 commit

### 🎯 M2 結束產出（API 清單）

| 端點 | 功能 |
|---|---|
| `GET /api/products` | 商品列表（`?category=3C&search=耳機&page=0`） |
| `GET /api/products/{id}` | 商品詳情 |
| `GET /api/cart` | 取得購物車（含 items 和 totalAmount） |
| `POST /api/cart/items` | 加入商品（自動合併同商品） |
| `PUT /api/cart/items/{itemId}` | 修改數量（0 自動移除） |
| `DELETE /api/cart/items/{itemId}` | 移除商品 |
| `DELETE /api/cart` | 清空購物車 |
| `POST /api/cart/checkout` | 送出結帳資料 → 清空購物車 |

**JUnit 5 全 GREEN ✅**

---

## Milestone 3：全端串接（第 2-2 + 2-3 段）

### 📋 任務清單

- [ ] 建立 React + Vite 前端：

```
frontend/src/
├── pages/
│   ├── ProductList.tsx    ← 商品列表 + 分類 Tab + 搜尋列
│   ├── ProductDetail.tsx  ← 商品詳情 + 加入購物車
│   └── Checkout.tsx       ← 結帳表單 + 訂單摘要
├── components/
│   ├── CartDrawer.tsx     ← 右側購物車抽屜（含小計）
│   ├── CartBadge.tsx      ← 導覽列購物車數量 badge
│   ├── ProductCard.tsx    ← 商品卡片
│   └── QuantityInput.tsx  ← 數量調整 [-] n [+]
├── context/
│   └── CartContext.tsx    ← 全域購物車狀態管理
└── api/
    ├── productApi.ts
    └── cartApi.ts
```

- [ ] 前端 `mockProducts.ts` 先跑起 UI（假資料階段）
- [ ] 切換串接 Spring Boot API
- [ ] **整合除錯示範（第 2-3 段）**：
  - CORS 錯誤 → `/bug` 模式切入
  - 加入購物車後 badge 不更新 → `@CartContext.tsx @CartBadge.tsx` 找根因  
  - 修改數量後 totalAmount 沒刷新 → `/rewind` 回退，改用正確的狀態更新方式
- [ ] **Playwright MCP 驗證**：
  > 「請用 playwright 打開 localhost:5173：
  > 1. 確認商品列表顯示至少 6 筆商品
  > 2. 點擊第一筆商品的『加入購物車』→ 驗證導覽列 badge 從 0 變為 1
  > 3. 再點一次同一商品 → badge 變為 2（數量合併而非新增）
  > 4. 點擊購物車圖示，確認抽屜打開且顯示正確商品和金額」
- [ ] 讓 Claude 產出 E2E Playwright 腳本
- [ ] `gh pr create`（Claude 生成 PR 說明）

### 🎯 M3 結束產出

```
✅ 商品列表：分類 Tab + 搜尋 + 商品卡片
✅ 購物車抽屜：加入 / 修改數量 / 移除 / 小計
✅ 結帳頁：表單 + 訂單摘要 + 送出成功提示
✅ Playwright E2E 腳本（badge 更新 + 數量合併驗證）
✅ 第一個 PR 發出
```

---

## Milestone 4：智能強化（第 3 段）

### 📋 任務清單

**4-1 資安 Skill（企業規範示範）**

```markdown
# security-check.skill.md（購物車版）
## 檢查清單
- [ ] session ID 有無可被客戶端自定義（應由後端產生）
- [ ] totalAmount 有無防止客戶端傳入偽造
- [ ] /checkout 有無基本的 request body 驗證（name/email 不為空）
- [ ] Cart 是否會跨 session 洩漏（A 的購物車不能被 B 存取）
```

套用掃描 `CartController.java` + `CartService.java`

**4-2 `/agent` 生成測試資料**（課程第 3-3 段重點示範）

> 「/agent：請按照 @spec.md 的 Product 資料模型，
> 生成 30 筆符合台灣電商風格的商品假資料：
> - 3C 10 筆（耳機、鍵盤、滑鼠、手機配件等）
> - 服飾 10 筆（Uniqlo 風格，含尺寸描述）
> - 食品 10 筆（台灣特產、零食、飲品）
> - name 和 description 要像真實電商文案
> - price 要合理（3C $500~$30000、服飾 $300~$3000、食品 $50~$500）
> - rating 介於 3.5~5.0
> - 輸出到 src/test/resources/seed-products.json
> 同時生成對應的 DataInitializer.java，啟動時自動載入」

主線繼續開發結帳頁（示範 Agent 在背景執行，不影響主線）

### 🎯 M4 結束產出

```
✅ security-check.skill.md（購物車電商資安規範）
✅ seed-products.json（30 筆真實電商風格商品資料）
✅ DataInitializer.java（啟動自動載入商品資料）
```

---

## Milestone 5：收尾發布（第 4-5 段）

### 📋 任務清單

- [ ] `/review @src/service/CartService.java`
  - 正確性：合併數量邏輯有沒有漏洞？
  - 安全性：有無 session 跨用戶洩漏風險？
  - 可讀性：addItem 方法是否職責過重？
- [ ] `/simplify @src/service/CartService.java`（精簡合併邏輯）
- [ ] `mvn test` 確認仍全 GREEN
- [ ] Claude 整理 diff → 產生語意化 commit message
- [ ] `gh pr create`（最終 PR）→ `gh pr checks` 追蹤 CI
- [ ] CLAUDE.md 升級至 Level 2 + 產出 `HARNESS.md`

### 🎯 M5 結束產出（完整作品）

```
shopping-cart/
├── CLAUDE.md                ← Level 2 Harness 規則
├── HARNESS.md               ← 升級歷程記錄
├── spec.md                  ← 購物車規格（全程共識基礎）
├── security-check.skill.md  ← 電商資安 Skill
├── backend/src/
│   ├── main/                ← Product / Cart / CartItem
│   └── test/                ← JUnit 全 GREEN（合計、合併、清空）
├── frontend/src/            ← ProductList / CartDrawer / Checkout
├── e2e/                     ← Playwright 腳本
└── .github/workflows/ci.yml ← JUnit + ESLint + Playwright
```

---

## Checkpoint 驗收清單

| Checkpoint | 驗收標準 |
|---|---|
| **M1** | spec.md 有業務規則（合併數量、合計公式） ✅ / Repo push ✅ |
| **M2** | `mvn test` 全 GREEN ✅ / Postman 測試「同商品加入數量合併」正確 ✅ |
| **M3** | badge 數字正確更新 ✅ / 購物車抽屜顯示金額 ✅ / E2E 腳本存在 ✅ |
| **M4** | seed-products.json 30 筆 ✅ / DataInitializer 啟動正常載入 ✅ |
| **M5** | CartService review 無高風險 ✅ / CI 三道全通 ✅ / HARNESS.md 存在 ✅ |
