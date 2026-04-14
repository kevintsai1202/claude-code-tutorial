# 📦 課程實作主線：小組訂單 + 庫存管理系統

---

## 一句話描述

> **一個讓小型團隊管理商品、下訂單、追蹤出貨、監控庫存的訂單管理系統。**

---

## 為什麼選這個？

| 評估標準 | 說明 |
|---|---|
| ✅ 非常常見 | 任何人都知道「下訂單」是什麼 |
| ✅ 難度適中 | 庫存扣減、多品項訂單、狀態機是真實複雜度 |
| ✅ TDD 天然適合 | 「庫存不足不能確認訂單」是完美測試場景 |
| ✅ 前後端都有亮點 | 商品目錄、訂單追蹤頁、庫存警示 Dashboard |
| ✅ 企業感強 | 資安 Skill 掃「金額計算有無被竄改」很有感 |

---

## 系統畫面示意

```
┌──────────────────────────────────────────────────────────┐
│  📦 Order Manager                      👤 Admin ▼        │
├────────────┬─────────────────────────────────────────────┤
│            │  📊 Dashboard                               │
│  🧭 選單   │                                             │
│            │  本月訂單   庫存警示   待出貨   本月營收    │
│  商品管理  │  [ 142 ]   [ 3項 ]    [ 28 ]  [$48,200]   │
│  訂單列表  │                                             │
│  庫存報表  │  ─────────────────────────────────────────  │
│            │  ⚠️ 庫存不足警示                           │
│            │  • 藍芽耳機 剩 2 件 (最低安全庫存: 10)     │
│            │  • 滑鼠墊  剩 0 件  ← 已售完               │
│            │                                             │
│            │  📋 最新訂單                                 │
│            │  #0089  Alice  3 件  待確認  [確認] [取消]  │
│            │  #0088  Bob    1 件  出貨中  ─────────────  │
│            │  #0087  Carol  5 件  已完成  ─────────────  │
└────────────┴─────────────────────────────────────────────┘
```

---

## 核心實體

```
Product（商品）
├── id, name, description, price
├── stock            ← 現有庫存數量
├── minStock         ← 最低安全庫存（低於此值發警示）
└── category         ← 商品分類

Order（訂單）
├── id, orderNumber  ← 自動產生如 #0089
├── customer (User)
├── status: PENDING → CONFIRMED → SHIPPED → DELIVERED → CANCELLED
├── totalAmount      ← 自動計算（各 item 加總）
└── items[]          ← 一筆訂單可含多種商品

OrderItem（訂單明細）
├── order, product
├── quantity
└── unitPrice        ← 下單當下的售價快照（價格可能之後改變）

User（客戶/管理員）
├── id, username, email, role(ADMIN|CUSTOMER)
```

---

## 商業邏輯（讓它「不只是 CRUD」的地方）

### 狀態機與庫存聯動
```
下訂單          確認訂單           出貨              送達
PENDING    →   CONFIRMED   →    SHIPPED      →   DELIVERED
               ↑ 此時扣庫存                      
               庫存不足 → 拋出 InsufficientStockException

PENDING → CANCELLED（取消，不扣庫存）
CONFIRMED → CANCELLED（取消，庫存歸還）
```

### 金額計算規則
- `unitPrice` = 下單當下的 Product.price（快照，不受日後改價影響）
- `totalAmount` = Σ (quantity × unitPrice)
- 超過 $5000 自動套用 9 折優惠碼折扣

### 庫存警示
- 任何操作導致 `stock < minStock` → 回應附加 `stockAlert: true`
- `stock == 0` → 商品自動標記 `outOfStock: true`，前端禁止下單

---

## API 端點

```
# 商品
GET    /api/products              ← 列表（可過濾 category/outOfStock）
POST   /api/products              ← 新增商品（ADMIN）
PUT    /api/products/{id}         ← 修改價格/庫存（ADMIN）
GET    /api/products/{id}         ← 詳情

# 訂單
POST   /api/orders                ← 下訂單（含多品項 items[]）
GET    /api/orders                ← 訂單列表（ADMIN 看全部，客戶看自己）
GET    /api/orders/{id}           ← 訂單詳情
PUT    /api/orders/{id}/confirm   ← 確認訂單（ADMIN，扣庫存）
PUT    /api/orders/{id}/ship      ← 出貨（ADMIN）
PUT    /api/orders/{id}/deliver   ← 確認送達
PUT    /api/orders/{id}/cancel    ← 取消訂單（自動歸還庫存）

# 報表
GET    /api/reports/inventory     ← 庫存現況 + 警示清單
GET    /api/reports/sales         ← 月銷售報表（?year=2026&month=4）
```

---

## 前端頁面

| 頁面 | 重點功能 |
|---|---|
| 🏠 Dashboard | 本月統計 + 庫存警示 Banner + 最新 5 筆訂單 |
| 📦 商品列表 | 商品卡片 + 庫存數量進度條 + 售完標示 |
| 🛒 下訂單 | 選商品 + 填數量 + 即時計算金額 + 超過$5000自動折扣提示 |
| 📋 訂單列表 | 狀態篩選 + 顏色標籤 + 一鍵確認/出貨/取消 |
| 📊 庫存報表 | 庫存量 Bar Chart + 警示清單 |

---

## 各 Milestone 對應

| Milestone | 做什麼 |
|---|---|
| **M1** | spec.md 定義狀態機、庫存聯動規則、金額計算快照邏輯 |
| **M2** | TDD：「確認訂單時庫存不足應拋出例外」「取消已確認訂單庫存歸還」 |
| **M3** | Dashboard + 訂單列表串接，Playwright 驗證庫存警示 Banner 出現 |
| **M4** | 資安 Skill 掃「金額計算有無可被偽造」，Agent 生成 50 筆假訂單 |
| **M5** | `/review` OrderService，`/simplify` 庫存計算邏輯，最終 PR |

---

> 💡 **讓學員有感的一句話**：
> 「這套系統你在便利商店後台或任何電商都能看到同樣的邏輯——庫存聯動、多品項、取消退庫存——Claude Code 幫你一次講清楚。」
