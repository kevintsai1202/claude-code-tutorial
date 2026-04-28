# 購物車系統 API 文件

**Base URL：** `http://localhost:3001/api`
**格式：** JSON
**Session：** HTTP-only Cookie（`shopcart_session`，UUID，由後端自動建立）

---

## 商品 API

### GET /api/products

取得商品列表，支援分類篩選與關鍵字搜尋。

**Query Parameters**

| 參數 | 類型 | 必填 | 說明 |
| --- | --- | --- | --- |
| `category` | string | 否 | `3C` \| `服飾` \| `食品` |
| `search` | string | 否 | 模糊搜尋商品名稱與描述 |
| `page` | integer | 否 | 分頁（預設 0，每頁 12 筆） |

**Response 200**
```json
{
  "products": [
    {
      "id": 1,
      "name": "Sony WH-1000XM5 無線降噪耳機",
      "description": "業界頂級主動降噪...",
      "price": 9900,
      "category": "3C",
      "imageUrl": "https://...",
      "rating": 4.8
    }
  ],
  "total": 30,
  "page": 0,
  "pageSize": 12
}
```

---

### GET /api/products/:id

取得單一商品詳情。

**Response 200**
```json
{
  "id": 1,
  "name": "Sony WH-1000XM5 無線降噪耳機",
  "description": "...",
  "price": 9900,
  "category": "3C",
  "imageUrl": "https://...",
  "rating": 4.8
}
```

**Response 404**
```json
{ "error": "商品不存在" }
```

---

## 購物車 API

> 所有購物車 API 透過 Cookie `shopcart_session` 識別使用者，首次請求自動建立 Session。

### GET /api/cart

取得目前購物車（含明細與伺服器計算的合計金額）。

**Response 200**
```json
{
  "id": 1,
  "sessionId": "a1b2c3d4-...",
  "items": [
    {
      "id": 10,
      "product": {
        "id": 1,
        "name": "Sony WH-1000XM5",
        "price": 9900,
        "imageUrl": "https://..."
      },
      "quantity": 2
    }
  ],
  "totalAmount": 19800
}
```

---

### POST /api/cart/items

加入商品至購物車。同一商品自動合併數量（+1），上限 99 件。

**Request Body**
```json
{ "productId": 1 }
```

**Response 200** — 回傳更新後的完整購物車
```json
{ "id": 1, "items": [...], "totalAmount": 9900 }
```

**Response 404**
```json
{ "error": "商品不存在" }
```

---

### PUT /api/cart/items/:itemId

修改購物車明細數量。`quantity = 0` 時自動移除。

**Request Body**
```json
{ "quantity": 3 }
```

**Response 200** — 回傳更新後的完整購物車
```json
{ "id": 1, "items": [...], "totalAmount": 29700 }
```

**Response 404**
```json
{ "error": "購物車項目不存在" }
```

---

### DELETE /api/cart/items/:itemId

移除單一購物車明細。

**Response 200** — 回傳更新後的完整購物車
```json
{ "id": 1, "items": [...], "totalAmount": 0 }
```

---

### DELETE /api/cart

清空整個購物車（保留 Session，不刪除 Cart）。

**Response 200**
```json
{ "id": 1, "items": [], "totalAmount": 0 }
```

---

### POST /api/cart/checkout

送出結帳資料，清空購物車，回傳訂單確認。

> ⚠️ 伺服器不接受客戶端傳入 `totalAmount`，金額由後端重新計算。

**Request Body**
```json
{
  "name": "王小明",
  "email": "wang@example.com",
  "phone": "0912345678",
  "address": "台北市中正區信義路一段 1 號"
}
```

**Response 200**
```json
{
  "success": true,
  "orderId": "ORD-1714000000000",
  "message": "訂單送出成功，感謝您的購買！"
}
```

**Response 400**（驗證失敗）
```json
{
  "error": "驗證失敗",
  "fields": {
    "email": "Email 格式不正確",
    "phone": "電話為必填欄位"
  }
}
```

---

## 錯誤格式

所有錯誤統一格式：

```json
{
  "error": "錯誤描述",
  "fields": {}   // 選填，表單驗證時使用
}
```

| HTTP 狀態碼 | 情境 |
| --- | --- |
| 200 | 成功 |
| 400 | 請求格式或驗證錯誤 |
| 404 | 資源不存在 |
| 500 | 伺服器內部錯誤 |
