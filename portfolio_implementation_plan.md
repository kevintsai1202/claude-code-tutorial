# 🛒 購物車系統 — 課程漸進式實作計畫（5 Milestones）

> **作品**：具備商品瀏覽、購物車管理、結帳下單、訂單追蹤的電商購物車系統  
> **技術棧**：Spring Boot 3 + JPA + H2（後端）/ React + Vite + TypeScript（前端）  
> **測試**：JUnit 5 + Playwright MCP（E2E）

---

## 作品全貌

```mermaid
flowchart LR
  M1["🟢 M1\nRepo + spec.md\n骨架打底"]
  M2["🔵 M2\n商品 + 購物車 + 結帳\n後端完工"]
  M3["🟣 M3\n商品列表 + 購物車頁\n前端串接"]
  M4["🟠 M4\n資安 Skill\n假資料 Agent"]
  M5["🔴 M5\nReview + PR\nHarness 收尾"]
  M1 --> M2 --> M3 --> M4 --> M5
```

| Milestone | 課程對應 | 時間目標 | 可展示成果 |
|---|---|---|---|
| **M1** — 骨架打底 | 第 1 段（50 min） | T+50 | Repo + CLAUDE.md + spec.md |
| **M2** — 後端完工 | 第 2-1 段（25 min） | T+75 | 購物車結帳 + 庫存聯動 全 GREEN |
| **M3** — 全端串接 | 第 2-2、2-3 段（50 min） | T+125 | 商品列表 + 購物車頁 + E2E 驗證 |
| **M4** — 智能強化 | 第 3 段（60 min） | T+185 | 資安 Skill + 假商品 / 訂單 Agent |
| **M5** — 收尾發布 | 第 4-5 段（45 min） | T+230 | PR 通過 CI + Harness 升級文件 |

---

## 核心資料模型

```
Product（商品）
├── id, name, description, price, imageUrl
├── stock           ← 庫存數量
├── minStock        ← 安全庫存（低於此值顯示警示）
└── category        ← 商品分類（3C / 服飾 / 食品）

Cart（購物車）
├── id, user(User)
├── status: ACTIVE | CHECKED_OUT | ABANDONED
└── items[]         ← CartItem 清單

CartItem（購物車明細）
├── cart, product
└── quantity

Order（訂單）
├── id, orderNumber ← 自動產生 #0001
├── user(User)
├── status: PENDING → PAID → SHIPPED → DELIVERED / CANCELLED
├── totalAmount     ← 伺服器計算，不接受客戶端傳入
└── items[]         ← OrderItem 清單（含 unitPrice 快照）

OrderItem（訂單明細）
├── order, product
├── quantity
└── unitPrice       ← 下單當下 product.price 的快照

User（會員）
├── id, username, email
└── role: ADMIN | CUSTOMER
```

---

## 關鍵業務規則

```
加入購物車：stock == 0 → 拋 OutOfStockException
結帳：       CartItem 每項扣 stock
             stock < quantity → 拋 InsufficientStockException（全部 rollback）
             結帳成功 → Cart.status = CHECKED_OUT → 建立 Order
取消訂單：   status == PAID → stock 歸還
             status == PENDING → 不退（未實際扣）
金額快照：   OrderItem.unitPrice 從 Product.price 複製，改價不影響舊訂單
```

---

## Milestone 1：骨架打底（第 1 段）

### 📋 任務清單

- [ ] `claude doctor` 確認環境 + Claude Code 安裝
- [ ] `gh repo create shopping-cart --public` 建立遠端 Repo
- [ ] `/init` → 初始化 `CLAUDE.md`

```markdown
## 技術棧
- 後端：Spring Boot 3 + Spring Data JPA + H2
- 前端：React + Vite + TypeScript
- 測試：JUnit 5 / Playwright MCP

## 核心規則（不可違反）
- 庫存扣減只能在 CartService.checkout() 中執行
- OrderItem.unitPrice 必須在結帳時從 Product.price 快照
- totalAmount 由伺服器計算，禁止接受客戶端傳入
- 不得硬編碼 JWT Secret 或資料庫密碼
```

- [ ] 自然語言描述購物車需求 → 讓 Claude 用 Plan Mode 產出 `spec.md`
  - 資料模型（Product / Cart / CartItem / Order / OrderItem / User）
  - 狀態機（Cart、Order 各自的狀態流轉）
  - API 端點清單（含 HTTP method 和路徑）
  - 關鍵業務規則（結帳扣庫存、快照、取消退庫存）
- [ ] 與 Claude 確認 spec.md 細節後 commit + push

### 🎯 M1 結束產出

```
shopping-cart/
├── CLAUDE.md   ← 技術棧 + 禁止行為規則
├── spec.md     ← 購物車完整規格
└── README.md
```

---

## Milestone 2：後端完工（第 2-1 段）

### 📋 任務清單

**TDD 先行 Prompt 範本**：
> 「請先依據 @spec.md 針對以下場景撰寫 JUnit 5 測試，**不要實作程式碼**：
> 1. 加入購物車：stock==0 時應拋出 OutOfStockException
> 2. 結帳成功：每個 CartItem 對應的 Product.stock 應正確扣減
> 3. 結帳失敗：某商品庫存不足時，所有庫存都不應被扣（全部 rollback）
> 4. 結帳後：Cart.status 應變為 CHECKED_OUT，且建立了一筆新 Order
> 5. 改變 Product.price 後，舊訂單的 OrderItem.unitPrice 應保持不變
> 6. 取消 PAID 訂單後，庫存應歸還；取消 PENDING 訂單不歸還
> 等我確認測試場景後再開始實作。」

- [ ] 確認測試後，Claude 建立 Spring Boot 骨架：

```
src/main/java/com/example/shoppingcart/
├── entity/            ← Product, Cart, CartItem, Order, OrderItem, User
├── repository/        ← JPA Repositories
├── service/
│   ├── ProductService.java
│   ├── CartService.java    ← addItem / removeItem / checkout
│   └── OrderService.java   ← cancel（含庫存歸還）
├── controller/
│   ├── ProductController.java
│   ├── CartController.java
│   └── OrderController.java
├── dto/               ← CartItemRequest / CheckoutResponse / OrderResponse
└── exception/
    ├── OutOfStockException.java
    └── InsufficientStockException.java
```

- [ ] `mvn test` → RED（預期失敗）
- [ ] Auto Mode：Claude 自主「讀錯誤 → 修正 → 再測試」直到 GREEN
- [ ] 全部 GREEN 後 commit

### 🎯 M2 結束產出（API 清單）

| 端點 | 功能 |
|---|---|
| `GET /api/products` | 商品列表（可過濾 category / `?inStock=true`） |
| `GET /api/products/{id}` | 商品詳情 |
| `POST /api/products` | 新增商品（ADMIN） |
| `GET /api/cart` | 取得目前購物車（含 items） |
| `POST /api/cart/items` | 加入商品（含數量） |
| `PUT /api/cart/items/{itemId}` | 修改數量 |
| `DELETE /api/cart/items/{itemId}` | 移除商品 |
| `POST /api/cart/checkout` | 結帳 → 建立 Order + 扣庫存 + 清空 Cart |
| `GET /api/orders` | 訂單列表（ADMIN 全部 / 客戶自己） |
| `GET /api/orders/{id}` | 訂單詳情 |
| `PUT /api/orders/{id}/cancel` | 取消訂單（含庫存歸還邏輯） |

**JUnit 5 全 GREEN ✅（含庫存邊界、快照、rollback）**

---

## Milestone 3：全端串接（第 2-2 + 2-3 段）

### 📋 任務清單

- [ ] 建立 React + Vite 前端：

```
frontend/src/
├── pages/
│   ├── ProductList.tsx    ← 商品列表 + 分類篩選 + 加入購物車
│   ├── ProductDetail.tsx  ← 商品詳情 + 庫存狀態 + 加入購物車
│   ├── CartPage.tsx       ← 購物車明細 + 數量調整 + 結帳按鈕
│   └── OrderHistory.tsx   ← 我的訂單列表 + 狀態進度條
├── components/
│   ├── CartBadge.tsx      ← 導覽列購物車圖示（顯示商品數量）
│   ├── StockStatus.tsx    ← 現貨 / 庫存不足 / 售完 三種狀態
│   ├── OrderStatus.tsx    ← PENDING/PAID/SHIPPED 顏色標籤
│   └── PriceSummary.tsx   ← 小計 + 折扣 + 總計
└── api/
    ├── productApi.ts
    ├── cartApi.ts
    └── orderApi.ts
```

- [ ] 先用假資料跑起 UI
- [ ] 切換為串接 Spring Boot API
  - 同時 `@CartController.java @cartApi.ts` 讓 Claude 一次看到串接點
- [ ] **整合錯誤示範（第 2-3 段）**：
  - CORS 錯誤 → Claude 分析修正 `WebMvcConfigurer`
  - 購物車數量顯示不即時更新（React state 問題）→ `/bug` 模式切入
  - 結帳後購物車未清空（前端快取問題）→ `@` 參照前端 context 找根因
- [ ] **Playwright MCP 驗證**：
  > 「請用 playwright 打開 localhost:5173：
  > 1. 驗證商品列表有至少 6 筆商品
  > 2. 點擊任一「加入購物車」按鈕，確認導覽列的購物車 badge 數字 +1
  > 3. 前往購物車頁，確認剛加入的商品有顯示在清單中」
- [ ] 讓 Claude 產出 Playwright E2E 腳本
- [ ] `gh pr create`（Claude 自動生成 PR 說明）

### 🎯 M3 結束產出

```
✅ 商品列表：分類篩選 + 庫存狀態 + 加入購物車
✅ 購物車頁：數量調整 + 小計計算 + 一鍵結帳
✅ 訂單頁：訂單列表 + 狀態進度條
✅ Playwright E2E 腳本（加入購物車 badge 更新驗證）
✅ 第一個 PR 發出
```

---

## Milestone 4：智能強化（第 3 段）

### 📋 任務清單

**4-1 資安 Skill**

`security-check.skill.md` 掃描重點：
```
- [ ] JWT Secret 有無硬編碼
- [ ] /checkout 端點有無驗證使用者身份
- [ ] totalAmount 有無防止客戶端偽造（應伺服器計算）
- [ ] CartService.checkout() 有無 @Transactional 防並發超賣
- [ ] OrderItem.unitPrice 有無可能被客戶端直接傳入
```

**4-2 背景 Agent（/agent）**
> 「生成 seed 資料到 src/test/resources/：
> - seed-products.json：30 筆商品（分 3C / 服飾 / 食品），其中 5 筆 stock < 5
> - seed-orders.json：20 筆訂單，status 分佈 PENDING/PAID/SHIPPED/DELIVERED 各 5 筆」

### 🎯 M4 結束產出

```
✅ security-check.skill.md（可重用於其他電商專案）
✅ seed-products.json（30 筆，含庫存邊界案例）
✅ seed-orders.json（20 筆，status 分佈合理）
✅ DataInitializer.java（啟動自動載入）
```

---

## Milestone 5：收尾發布（第 4-5 段）

### 📋 任務清單

- [ ] `/review @src/service/CartService.java`（正確性 + 安全性 + 可讀性）
- [ ] `/simplify @src/service/CartService.java`（精簡結帳邏輯）
- [ ] `mvn test` 確認仍全 GREEN
- [ ] Claude 整理 diff、生成語意化 commit message
- [ ] `gh pr create`（最終 PR + CI 三道關卡）
- [ ] 更新 `CLAUDE.md` 至 Harness Level 2 + 產出 `HARNESS.md`

### 🎯 M5 結束產出（完整作品）

```
shopping-cart/
├── CLAUDE.md                ← Level 2 Harness 規則
├── HARNESS.md               ← 升級歷程記錄
├── spec.md                  ← 購物車規格（全程共識基礎）
├── security-check.skill.md  ← 電商資安 Skill
├── backend/src/
│   ├── main/                ← Product / Cart / Order 全功能後端
│   └── test/                ← JUnit 全 GREEN（結帳邊界 + 快照 + rollback）
├── frontend/src/            ← ProductList / Cart / OrderHistory
├── e2e/                     ← Playwright 腳本
└── .github/workflows/ci.yml ← JUnit + ESLint + Playwright
```

---

## Checkpoint 驗收清單

| Checkpoint | 驗收標準 |
|---|---|
| **M1** | spec.md 有狀態機 + 庫存規則 ✅ / Repo 已 push ✅ |
| **M2** | `mvn test` 全 GREEN ✅ / `POST /api/cart/checkout` 庫存不足回 400 ✅ |
| **M3** | 加入購物車後 badge 數字更新 ✅ / E2E 腳本存在 ✅ / 第一個 PR 發出 ✅ |
| **M4** | security-check.skill.md 存在 ✅ / seed 資料 50 筆合理 ✅ |
| **M5** | CartService review 無高風險 ✅ / CI 三道全通 ✅ / HARNESS.md 存在 ✅ |
