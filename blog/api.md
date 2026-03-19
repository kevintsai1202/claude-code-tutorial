# Blog API 規格

## 1. 架構與選型
- 本次 `Claude Cowork Starter Pack` 教學頁屬於純靜態內容頁，不新增後端服務、API Gateway 或資料儲存。
- 專案仍以靜態 HTML 發佈，因此 API 文件的主要用途是明確記錄「無新增 API」，避免後續誤判需要串接資料源。

## 2. 資料模型
- `StaticArticlePage`
  - `slug`
  - `sourceTweetId`
  - `sourceArticleId`
  - `renderMode`: `static`
  - `dataSource`: `manual-curation`

## 3. 關鍵流程
```mermaid
flowchart TD
  A[編輯來源內容] --> B[人工整理為 HTML]
  B --> C[部署靜態頁]
  C --> D[瀏覽器直接讀取]
```

## 4. 虛擬碼
```text
if request is for claude-cowork-starter-pack page:
  serve static html file from blog directory
no network fetch or runtime api call is required
```

## 5. 系統脈絡圖
```mermaid
flowchart LR
  Browser[Browser] --> StaticFile[blog/claude-cowork-starter-pack.html]
```

## 6. 容器/部署概觀
```mermaid
flowchart TD
  StaticHost[Static Host] --> HtmlFile[HTML]
  StaticHost --> InlineAssets[Inline CSS / JS]
```

## 7. 模組關係圖（Backend / Frontend）
```mermaid
flowchart TD
  Frontend[blog HTML 頁面] --> NoBackend[無後端 API]
```

## 8. 序列圖
```mermaid
sequenceDiagram
  participant U as User
  participant B as Browser
  participant S as Static Host
  U->>B: 開啟頁面 URL
  B->>S: GET /blog/claude-cowork-starter-pack.html
  S-->>B: 回傳靜態 HTML
  B-->>U: 呈現內容
```

## 9. ER 圖
```mermaid
erDiagram
  STATIC_PAGE {
    string slug
    string sourceTweetId
    string sourceArticleId
  }
```

## 10. 類別圖（後端關鍵類別）
```mermaid
classDiagram
  class StaticArticlePage {
    +string slug
    +string renderMode
    +string dataSource
  }
```

## 11. 流程圖
```mermaid
flowchart TD
  A[收到頁面請求] --> B[讀取靜態檔案]
  B --> C[回傳內容]
```

## 12. 狀態圖
```mermaid
stateDiagram-v2
  [*] --> Defined
  Defined --> Served
  Served --> [*]
```

---

## Claude Code Skills Lessons 備註
- `blog/claude-code-skills-lessons.html` 與前一篇同樣為純靜態頁，不新增 API。
- 內容資料來源為人工整理後直接寫入 HTML，瀏覽器不會在執行階段向外部服務抓取文章內容。

## Claude Cowork AI 員工軍團頁備註
- `blog/claude-cowork-ai-workforce.html` 為純靜態教學頁，不新增 API。
- 頁面內容於編輯階段寫入 HTML，執行階段不對外抓取文章全文。

## Claude Code Skills 精簡策略頁備註
- `blog/claude-code-skills-shortlist.html` 為純靜態教學頁，不新增 API。
- 頁面內容於編輯階段寫入 HTML，執行階段不對外抓取文章全文。
