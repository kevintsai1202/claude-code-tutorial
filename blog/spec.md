# Blog 前端規格

## 1. 架構與選型
- 前端採用原生 HTML、CSS、JavaScript 單頁檔案模式，維持 `blog` 目錄既有結構。
- 新文章頁延續現有 `blog` 的 Cyber / Glassmorphism 視覺語言，沿用 Google Fonts：`Orbitron`、`Rajdhani`、`IBM Plex Mono`。
- 內容來源以 `x/2031755971265974632/article.md` 與其對應圖片為基礎，轉為適合閱讀的長文頁。

## 2. 資料模型
- `ArticleMeta`
  - `slug`: `claude-skills-course`
  - `sourceTweetId`: `2031755971265974632`
  - `title`
  - `subtitle`
  - `author`
  - `publishDate`
  - `tags[]`
  - `stats[]`
- `ArticleSection`
  - `id`
  - `label`
  - `heading`
  - `body`
  - `media[]`

## 3. 關鍵流程
```mermaid
flowchart TD
  A[讀取 x 文章內容與圖片] --> B[整理為 blog 長文資訊架構]
  B --> C[建立 blog 獨立文章頁]
  C --> D[在首頁新增文章卡片]
  D --> E[建立 GitHub Pages workflow]
  E --> F[驗證連結與基本響應式]
```

## 4. 虛擬碼
```text
load article markdown and images
group article content into readable sections
build hero, quick stats, section nav, content blocks
render images inline with article sections
add article card to blog index
configure GitHub Pages to deploy only blog directory
verify local links and theme toggle behavior
```

## 5. 系統脈絡圖
```mermaid
flowchart LR
  User[讀者] --> BlogIndex[blog/index.html]
  BlogIndex --> ArticlePage[blog/claude-skills-course.html]
  ArticlePage --> SourceAssets[x/2031755971265974632/*]
```

## 6. 容器/部署概觀
```mermaid
flowchart TD
  StaticHost[靜態網站主機] --> BlogPages[blog/*.html]
  StaticHost --> ArticleAssets[x/2031755971265974632/*]
  GitHubActions[GitHub Actions] --> PagesArtifact[blog 目錄 artifact]
  PagesArtifact --> StaticHost
```

## 7. 模組關係圖（Frontend）
```mermaid
flowchart TD
  IndexPage[index.html] --> ArticleCard[文章卡片入口]
  ArticlePage[claude-skills-course.html] --> ThemeToggle[主題切換]
  ArticlePage --> HeroSection[Hero 區塊]
  ArticlePage --> SectionNav[章節導覽]
  ArticlePage --> ContentSections[內容章節]
```

## 8. 序列圖
```mermaid
sequenceDiagram
  participant U as User
  participant I as blog/index.html
  participant P as blog/claude-skills-course.html
  U->>I: 開啟首頁
  U->>I: 點選文章卡片
  I->>P: 導向長文頁
  P-->>U: 顯示文章內容與圖片
```

## 9. ER 圖
```mermaid
erDiagram
  ARTICLE ||--o{ SECTION : contains
  ARTICLE ||--o{ MEDIA : uses
  SECTION ||--o{ MEDIA : embeds
```

## 10. 類別圖（前端資料結構）
```mermaid
classDiagram
  class ArticleMeta {
    +string slug
    +string title
    +string subtitle
    +string publishDate
  }
  class ArticleSection {
    +string id
    +string heading
    +string body
  }
  class MediaAsset {
    +string src
    +string alt
  }
  ArticleMeta --> ArticleSection
  ArticleSection --> MediaAsset
```

## 11. 流程圖
```mermaid
flowchart TD
  A[開始] --> B[建立頁面骨架]
  B --> C[填入 Hero 與摘要]
  C --> D[填入章節與圖片]
  D --> E[串接首頁卡片]
  E --> F[完成]
```

## 12. 狀態圖
```mermaid
stateDiagram-v2
  [*] --> Draft
  Draft --> Implemented
  Implemented --> Indexed
  Indexed --> Verified
  Verified --> [*]
```
