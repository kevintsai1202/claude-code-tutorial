# Claude Code 課綱與 Shopping Cart 文件 API 規格

## 1. 架構與選型
- 本輪不新增可執行 API，而是調整文件中的 API 設計口徑。
- `shopping-cart/api.md` 需統一為 Node.js `Express` 版本的 RESTful API。
- 啟動、測試、資料儲存與驗證案例都需同步改成 `npm` / `Vitest` / `Supertest` / `PostgreSQL`，並補上 Docker Compose 啟動資料庫的說明。
- 教學圖更新屬靜態資產回填，不涉及 API 契約變更；但需維持既有 Markdown 路徑穩定。

## 2. 資料模型
- `ApiContractChange`
  - `path`
  - `oldStack`
  - `newStack`
  - `status`

## 3. 關鍵流程
```mermaid
flowchart TD
  A[盤點現有 API 文件] --> B[定位 Java Spring Boot 用語]
  B --> C[改寫為 Express REST API 與 PostgreSQL 敘述]
  C --> D[驗證端點與 payload 未失真]
```

## 4. 虛擬碼
```text
read shopping-cart/api.md
replace backend implementation notes with Node.js + PostgreSQL stack
keep route semantics stable while simplifying runtime and testing instructions
```

## 5. 系統脈絡圖
```mermaid
flowchart LR
  User[講師 / 學員] --> CourseDocs[課綱與 API 文件]
  CourseDocs --> CartApi[shopping-cart/api.md]
```

## 6. 容器/部署概觀
```mermaid
flowchart TD
  Repository[Git Repository] --> CourseDocs[Markdown 文件]
```

## 7. 模組關係圖（Backend / Frontend）
```mermaid
flowchart TD
  CartApi --> ExpressApi[Node.js Express API]
  ExpressApi --> PostgreSQL[(PostgreSQL)]
```

## 8. 序列圖
```mermaid
sequenceDiagram
  participant U as User
  participant D as Documents
  participant A as API Spec
  U->>D: 要求後端改為 Node.js
  D->>A: 更新 API 文件說明
  A-->>U: 輸出新的 API 契約口徑
```

## 9. ER 圖
```mermaid
erDiagram
  API_CONTRACT_CHANGE {
    string path
    string oldStack
    string newStack
    string status
  }
```

## 10. 類別圖（後端關鍵類別）
```mermaid
classDiagram
  class ApiContractChange {
    +string path
    +string oldStack
    +string newStack
    +string status
  }
```

## 11. 流程圖
```mermaid
flowchart TD
  A[開始] --> B[更新 API 契約文件]
  B --> C[確認 Node.js 口徑一致]
  C --> D[完成]
```

## 12. 狀態圖
```mermaid
stateDiagram-v2
  [*] --> Planned
  Planned --> Updated
  Updated --> Verified
  Verified --> [*]
```
