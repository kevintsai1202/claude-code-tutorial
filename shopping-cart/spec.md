# 購物車系統後端規格文件

## 1. 架構與選型

| 層級 | 技術 | 版本 | 理由 |
| --- | --- | --- | --- |
| Runtime | Node.js | 20 LTS | 課程主線，低門檻 |
| Framework | Express | 4.x | 輕量、易測試 |
| 資料庫 | PostgreSQL | 16（Docker） | 生產級關聯式資料庫 |
| ORM | pg（raw SQL） | 8.x | 避免 ORM 隱藏 SQL 邏輯，課程教學清晰 |
| 測試 | Vitest + Supertest | latest | 快速、與 Vite 生態一致 |
| 語言 | TypeScript | 5.x | 與前端型別共享 |

**核心安全規則（寫入 CLAUDE.md）：**
- `totalAmount` 由伺服器計算，拒絕接受客戶端傳入
- `sessionId` 由後端 UUID 產生，不接受客戶端自定義
- 結帳前驗證收件欄位不為空

---

## 2. 資料模型

```
Product（商品）
├── id           SERIAL PRIMARY KEY
├── name         VARCHAR(200) NOT NULL
├── description  TEXT
├── price        INTEGER NOT NULL          ← 元（整數，避免浮點誤差）
├── category     VARCHAR(20) NOT NULL      ← '3C' | '服飾' | '食品'
├── image_url    TEXT
└── rating       NUMERIC(3,1)

Cart（購物車）
├── id           SERIAL PRIMARY KEY
└── session_id   VARCHAR(36) UNIQUE NOT NULL  ← UUID，由後端產生

CartItem（購物車明細）
├── id           SERIAL PRIMARY KEY
├── cart_id      INTEGER REFERENCES cart(id) ON DELETE CASCADE
├── product_id   INTEGER REFERENCES product(id)
└── quantity     INTEGER NOT NULL DEFAULT 1   ← 1~99
  UNIQUE(cart_id, product_id)                 ← 同商品不重複新增
```

---

## 3. 關鍵流程

```mermaid
flowchart TD
  A[Request 進入] --> B{有 session cookie?}
  B -->|否| C[建立新 Cart + 產 UUID session]
  B -->|是| D[查詢既有 Cart]
  C --> E[處理業務邏輯]
  D --> E
  E --> F[加入/修改/移除/結帳]
  F --> G[回傳 CartResponse JSON]
```

### 業務規則

```
加入購物車：
  同一商品（同 cart_id + product_id）→ quantity +1（上限 99）
  新商品 → INSERT CartItem，quantity = 1

修改數量：
  quantity = 0 → DELETE CartItem
  quantity > 99 → 保持 99
  其他 → UPDATE quantity

購物車合計：
  totalAmount = Σ (item.quantity × item.product.price)
  在 SQL JOIN 計算，不在應用層計算

結帳送出：
  1. 驗證 name / email / phone / address 不為空
  2. DELETE 所有 CartItem（保留 Cart session）
  3. 回傳 orderId（UUID）與確認訊息
```

---

## 4. 虛擬碼

```typescript
// cartService.addItem(cartId, productId)
item = db.query('SELECT * FROM cart_item WHERE cart_id=$1 AND product_id=$2', [cartId, productId])
if (item) {
  db.query('UPDATE cart_item SET quantity = LEAST(quantity+1, 99) WHERE id=$1', [item.id])
} else {
  db.query('INSERT INTO cart_item(cart_id, product_id, quantity) VALUES($1,$2,1)', [cartId, productId])
}
return getCart(cartId)  // 回傳含 totalAmount 的完整購物車

// cartService.updateQuantity(itemId, quantity)
if (quantity <= 0) {
  db.query('DELETE FROM cart_item WHERE id=$1', [itemId])
} else {
  db.query('UPDATE cart_item SET quantity=LEAST($1,99) WHERE id=$2', [quantity, itemId])
}
return getCart(cartId)
```

---

## 5. 系統脈絡圖

```mermaid
flowchart LR
  Browser[前端 React\nlocalhost:5173] -->|HTTP API| Express[Express Server\nlocalhost:3001]
  Express -->|SQL| PG[(PostgreSQL 16\nlocalhost:5432)]
  Express -.->|session cookie| Browser
  Docker[Docker Compose] -->|管理| PG
```

---

## 6. 容器/部署概觀

```mermaid
flowchart TD
  DC[docker-compose.yml] --> PG[PostgreSQL 16 容器\nport 5432]
  DC --> Init[init.sql\n建表 + seed 資料]
  PG --> Express[npm run server\nport 3001]
  Vite[npm run dev\nport 5173] -->|proxy /api| Express
```

**docker-compose.yml 重點：**
```yaml
services:
  postgres:
    image: postgres:16-alpine
    environment:
      POSTGRES_DB: shopcart
      POSTGRES_USER: shopcart
      POSTGRES_PASSWORD: shopcart
    ports:
      - "5432:5432"
    volumes:
      - ./src/server/db/init.sql:/docker-entrypoint-initdb.d/init.sql
```

---

## 7. 模組關係圖

```mermaid
flowchart TD
  Routes[routes/\nproducts.routes.ts\ncart.routes.ts] --> Services[services/\nproductService.ts\ncartService.ts]
  Services --> DB[db.ts\nPostgreSQL 連線池]
  Routes --> Middleware[middleware/\nsessionMiddleware.ts]
  App[app.ts] --> Routes
  App --> Middleware
```

---

## 8. 序列圖

```mermaid
sequenceDiagram
  participant FE as 前端 React
  participant EX as Express
  participant DB as PostgreSQL

  FE->>EX: POST /api/cart/items { productId }
  EX->>DB: SELECT cart WHERE session_id=?
  DB-->>EX: cart row
  EX->>DB: SELECT cart_item WHERE cart_id=? AND product_id=?
  DB-->>EX: existing item or null
  alt 已存在
    EX->>DB: UPDATE quantity = LEAST(quantity+1, 99)
  else 新商品
    EX->>DB: INSERT cart_item
  end
  EX->>DB: SELECT cart + items + SUM(price*quantity)
  DB-->>EX: CartResponse
  EX-->>FE: 200 { items[], totalAmount }
```

---

## 9. ER 圖

```mermaid
erDiagram
  PRODUCT {
    int id PK
    varchar name
    text description
    int price
    varchar category
    text image_url
    numeric rating
  }
  CART {
    int id PK
    varchar session_id UK
  }
  CART_ITEM {
    int id PK
    int cart_id FK
    int product_id FK
    int quantity
  }

  CART ||--o{ CART_ITEM : "contains"
  PRODUCT ||--o{ CART_ITEM : "referenced by"
```

---

## 10. 類別圖（後端關鍵模組）

```mermaid
classDiagram
  class ProductService {
    +findAll(category, search, page) Product[]
    +findById(id) Product
  }
  class CartService {
    +getOrCreateCart(sessionId) Cart
    +getCart(cartId) CartResponse
    +addItem(cartId, productId) CartResponse
    +updateQuantity(itemId, quantity, cartId) CartResponse
    +removeItem(itemId, cartId) CartResponse
    +clearCart(cartId) void
    +checkout(cartId, form) string
  }
  class DB {
    +query(sql, params) QueryResult
    +pool Pool
  }
  ProductService --> DB
  CartService --> DB
```

---

## 11. 流程圖（購物車 Session 初始化）

```mermaid
flowchart TD
  Req[Request] --> Check{Cookie\nshopcart_session\n存在?}
  Check -->|是| Find[查詢 cart WHERE session_id]
  Check -->|否| New[產生 UUID]
  New --> Insert[INSERT cart]
  Insert --> SetCookie[Set-Cookie: shopcart_session=UUID]
  Find --> Exist{cart 存在?}
  Exist -->|否| New
  Exist -->|是| Next[繼續業務邏輯]
  SetCookie --> Next
```

---

## 12. 狀態圖（購物車生命週期）

```mermaid
stateDiagram-v2
  [*] --> 空購物車 : 新 Session
  空購物車 --> 有商品 : addItem
  有商品 --> 有商品 : addItem / updateQuantity
  有商品 --> 空購物車 : clearCart / 最後一件移除
  有商品 --> 已結帳 : checkout
  已結帳 --> 空購物車 : 結帳清空後繼續購物
```

---

## 目錄結構

```
shopping-cart/
├── docker-compose.yml
├── package.json
├── tsconfig.json
├── src/
│   └── server/
│       ├── app.ts                  ← Express 入口
│       ├── db.ts                   ← PostgreSQL 連線池
│       ├── db/
│       │   └── init.sql            ← 建表 + seed 30 筆商品
│       ├── routes/
│       │   ├── products.routes.ts
│       │   └── cart.routes.ts
│       ├── services/
│       │   ├── productService.ts
│       │   └── cartService.ts
│       ├── middleware/
│       │   └── sessionMiddleware.ts
│       └── dto/
│           ├── cartResponse.ts
│           └── checkoutRequest.ts
└── src/test/
    ├── products.test.ts
    └── cart.test.ts
```
