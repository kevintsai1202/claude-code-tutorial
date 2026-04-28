# Claude Code 課綱與 Shopping Cart 文件 Node.js + PostgreSQL 規格

## 1. 架構與選型
- 本輪工作聚焦文件重構，不改動課綱教學網站的互動邏輯。
- `claude_code_syllabus.md` 與 `shopping-cart` 目錄下的文件，需把後端主線統一為 `Node.js + Express + PostgreSQL`。
- 文件口徑以「保留 Node.js 低門檻開發體驗，同時把資料庫教學重點放在 AI 控制 Docker 安裝與啟動 PostgreSQL」為主。
- 課程中的後端測試、啟動指令、資料初始化、API 串接範例、Skill 掃描案例與 Review 範例，都需同步改成 Node.js 生態。
- 第 `1-3` 節需明確改成：用自然語言指揮 Claude 產出 `docker-compose.yml`、啟動 PostgreSQL 容器、驗證 healthy 狀態、再回填後端連線設定。
- 課綱章節圖若因內容更新而重生，需保留既有檔名與引用路徑，優先覆蓋對應圖檔，避免 `claude_code_syllabus.md` 與教學網站失聯。

## 2. 資料模型
- `CourseBackendProfile`
  - `runtime`
  - `framework`
  - `storage`
  - `testStack`
  - `commands[]`
- `DocumentTarget`
  - `path`
  - `scope`
  - `status`
  - `notes`

## 3. 關鍵流程
```mermaid
flowchart TD
  A[盤點 claude_code_syllabus.md 與 shopping-cart 文件] --> B[找出 Java Spring Boot 相關敘述]
  B --> C[定義 Node.js Express PostgreSQL 統一口徑]
  C --> D[同步改寫課綱與專案文件]
  D --> E[檢查 API 測試 啟動指令與範例是否一致]
  E --> F[完成文件驗證]
```

## 4. 虛擬碼
```text
read syllabus and shopping-cart docs
find backend references tied to Java, Spring Boot, PostgreSQL, Maven, and JUnit
replace them with Node.js, Express, PostgreSQL, Docker Compose, npm, Vitest, and Supertest equivalents
normalize examples, commands, and architecture diagrams
verify no major document still describes the old backend as the primary path
```

## 5. 系統脈絡圖
```mermaid
flowchart LR
  User[講師 / 學員] --> Syllabus[claude_code_syllabus.md]
  User --> CartDocs[shopping-cart 文件組]
  Syllabus --> BackendProfile[Node.js + Express + PostgreSQL]
  CartDocs --> BackendProfile
```

## 6. 容器/部署概觀
```mermaid
flowchart TD
  Repo[Git Repository] --> SourceDocs[claude_code_syllabus.md]
  Repo --> CartDocs[shopping-cart/*.md]
  CartDocs --> Browser[文件閱讀與教學使用]
```

## 7. 模組關係圖（Backend / Frontend）
```mermaid
flowchart TD
  SyllabusMd[claude_code_syllabus.md] --> BackendProfile[Node.js + PostgreSQL 課程口徑]
  CartSpec[shopping-cart/spec.md] --> BackendProfile
  CartApi[shopping-cart/api.md] --> BackendProfile
  CartPlan[shopping-cart/portfolio_implementation_plan.md] --> BackendProfile
  Todo[todolist.md] --> BackendProfile
```

## 8. 序列圖
```mermaid
sequenceDiagram
  participant U as User
  participant D as Documents
  participant E as Editor
  participant V as Validator
  U->>D: 指定後端改為 Node.js
  D->>E: 同步改寫課綱與 shopping-cart 文件
  E->>V: 檢查技術棧與指令一致性
  V-->>U: 回報完成
```

## 9. ER 圖
```mermaid
erDiagram
  COURSE_BACKEND_PROFILE ||--o{ DOCUMENT_TARGET : applies_to
  COURSE_BACKEND_PROFILE {
    string runtime
    string framework
    string storage
    string testStack
  }
  DOCUMENT_TARGET {
    string path
    string scope
    string status
  }
```

## 10. 類別圖（後端關鍵類別）
```mermaid
classDiagram
  class CourseBackendProfile {
    +string runtime
    +string framework
    +string storage
    +string testStack
  }
  class DocumentTarget {
    +string path
    +string scope
    +string status
  }
  CourseBackendProfile --> DocumentTarget
```

## 11. 流程圖
```mermaid
flowchart TD
  A[開始] --> B[更新 spec.md api.md todolist.md]
  B --> C[盤點課綱與 shopping-cart 文件]
  C --> D[改寫後端技術棧與範例]
  D --> E[驗證文件一致性]
  E --> F[完成]
```

## 12. 狀態圖
```mermaid
stateDiagram-v2
  [*] --> Planned
  Planned --> Updated
  Updated --> Verified
  Verified --> [*]
```
