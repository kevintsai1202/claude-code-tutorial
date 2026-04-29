# Claude Code 課綱教學網站待辦

## 任務清單

| ID | 任務 | 狀態 | 備註 |
|---|---|---|---|
| TW-01 | 盤點 `claude_code_syllabus.md`、章節圖片與互動需求 | 完成 | 圖片來源為 `image/claude_code_syllabus/teaching-diagrams` |
| TW-02 | 更新 `spec.md` 與 `api.md` 使其對齊互動教學網頁交付 | 完成 | 明確記錄章節收折、圖片彈窗、程式區塊樣式 |
| TW-03 | 實作靜態教學網頁與章節互動效果 | 完成 | 已產出 `claude_code_teaching_website.html` 與 PowerShell 產生器 |
| TW-04 | 本機驗證頁面結構與互動行為 | 完成 | 已完成結構驗證；完整瀏覽器 smoke test 受本機 Node/CSPRNG 與 provider 限制影響 |
| TW-05 | 補上側邊欄章節導覽與行動版章節清單 | 完成 | 已加入固定側欄、章節小節連結與行動版切換按鈕 |
| TW-06 | 提升整體色彩反差與程式區塊可讀性 | 完成 | 已加深文字、卡片邊線、inline code 與深色 code block 對比 |
| TW-07 | 強化 code block 內層文字反差 | 完成 | 已覆寫 `pre code` 與 `.command-block code` 顏色、字重、字級與陰影 |
| TW-08 | 修正章節與小節編號來源 | 完成 | 已改為從標題數字解析，不使用陣列索引 |
| TW-09 | 重整首頁首屏版面分區 | 完成 | 第一區塊僅保留課程名稱/描述/目標，圖片與快速入口已獨立到下一區塊 |
| TW-10 | 移除首頁圖片區塊重複連結並統一圖片互動 | 完成 | 已移除快速超連結，主視覺圖片改用與章節圖相同的放大/收折模式 |
| TW-11 | 移除課程主專案區塊中的 SDD 示範 Prompt | 完成 | 已在渲染流程排除提示文字與其引用內容 |
| DOC-01 | 盤點 `claude_code_syllabus.md` 與 `shopping-cart` 文件中的後端技術棧衝突 | 完成 | 已確認主要衝突為 Spring Boot、PostgreSQL、JUnit、Maven 與 Java 範例 |
| DOC-02 | 更新 `spec.md` 與 `api.md`，定義 Node.js 文件轉向範圍 | 完成 | 已將本輪任務明確改為文件重構 |
| DOC-03 | 將課綱與 `shopping-cart` 文件的後端主線改為 Node.js | 完成 | 已同步更新課綱、spec、api、講義、實作計畫、作品說明與 CLAUDE.md |
| DOC-04 | 將資料庫口徑改回 PostgreSQL，並強化 AI 控制 Docker 安裝資料庫教學 | 完成 | 後端維持 Node.js，資料儲存已改為 PostgreSQL + Docker Compose，1-3 節改為 Docker 主示範 |
| IMG-01 | 更新 4-3 superpowers 流程圖以對齊新版鐵律 | 完成 | 已覆蓋 `image/claude_code_syllabus/teaching-diagrams/4-3-superpowers-pipeline.png`，課綱引用路徑維持不變 |
| INST-01 | 同步官方最新 CLI 安裝方式（Native Install 為主、Homebrew --cask、WinGet） | 完成 | 課綱 1-1 節與工具表、HTML、docx 已同步更新 |
| INST-02 | 移除課綱標題括號內文字「（4 小時線上錄影課大綱）」 | 完成 | 標題已精簡，HTML 與 docx 同步重新生成 |
| EDU-01 | 在 3-2 之前新增「Agent Skills 與 Hooks 概念入門」節，並順延原 3-2/3-3/3-4 為 3-3/3-4/3-5 | 完成 | 嵌入 Anthropic 官方 hooks-lifecycle.svg、hook-resolution.svg；第 3 段時數 75 → 85 mins |
| INST-03 | 修正 superpowers 安裝指令為兩步驟（先 add marketplace，再 install plugin） | 完成 | 同步課綱 4-3、project_plan、curriculum、generate_syllabus、portfolio_implementation_plan；HTML 與 docx 重生成 |
| EDU-02 | 補上 Hook 5 種 type（command/http/mcp_tool/prompt/agent）並用 3 大類分組（確定性執行/LLM 判斷/Subagent 驗證） | 完成 | 寫入 3-2 概念入門節，HTML 與 docx 重生成 |
| WEB-12 | 主視覺區（hero-media-card）精簡為僅顯示圖片，移除左側 eyebrow / h2 / 描述段，避免文字與圖片並列雜亂 | 完成 | PS1 移除 `.hero-media-copy` 樣式與對應 HTML，shell 改 single column |
| WEB-13 | 整合互動教學網頁為雙網站並存模式：interactive.html / tutorial.v4.js 放根目錄與主講義同層、共用 image/，主網站 hero 與 sidebar 各加跳轉 CTA，互動網頁加返回連結；deploy-pages.yml 同步部署 | 完成 | GitHub Pages 部署同時提供 `/`、`/interactive.html`、`/claude_code_teaching_website.html` 三條入口 |
| WEB-14 | 修復側邊欄 wrapper + collapser 收折結構（c6aa79e 直接改 HTML 沒同步 PS1，重生時被洗掉） | 完成 | PS1 補上 .sidebar-wrapper / .sidebar-collapser 樣式、HTML 結構與 collapser JS（含 localStorage 持久化）|
| WEB-15 | 雙網站錨點關聯：互動網站補 7 個 subsection ID、5 個 chapter 加「看完整講義」連結；PS1 為有對應的小節自動注入「🎮 互動體驗版」連結 | 完成 | 講義 badge → 互動 anchor 對應表（INTERACTIVE_MAP），3-2 純概念無對應、3-3/3-4/3-5 對應互動的 s3-2/s3-3/s3-4 |

## 當前任務

- SHOP-01：CartContext 的 `addToCart` / `updateQuantity` 待使用者實作（`shopping-cart/frontend/src/context/CartContext.tsx`）

## 購物車前端任務（2026-04-28）

| ID | 任務 | 狀態 | 備註 |
| --- | --- | --- | --- |
| SHOP-01 | 實作 CartContext addToCart / updateQuantity | **待使用者實作** | 見 CartContext.tsx TODO 注解 |
| SHOP-02 | 前端骨架建置（React 18 + Vite + TypeScript） | 完成 | `shopping-cart/frontend/` |
| SHOP-03 | 設計系統（Tailwind + CSS Token + 深色 Premium 主題） | 完成 | Emerald Accent #10b981 |
| SHOP-04 | 30 筆 Mock 商品資料（3C/服飾/食品各 10 筆） | 完成 | `src/data/mockProducts.ts` |
| SHOP-05 | UI 元件（Navbar/ProductCard/CartDrawer/QuantityInput） | 完成 | 含 data-testid |
| SHOP-06 | 頁面（ProductList/ProductDetail/Checkout） | 完成 | 含表單驗證/骨架屏/成功畫面 |
| SHOP-07 | TypeScript + Vite 生產建置驗證 | 完成 | 0 errors, build 2.63s |

## 完成紀錄
- `2026-04-28`：完成課綱圖解生成與回填驗證。
- `2026-04-28`：切換為互動教學網頁任務，已同步更新規格與待辦。
- `2026-04-28`：完成 PowerShell 版教學網頁產生器與 HTML 交付，並完成結構驗證。
- `2026-04-28`：完成側邊欄章節導覽與行動版章節清單補強。
- `2026-04-28`：完成色彩反差與程式區塊可讀性補強。
- `2026-04-28`：完成 code block 內層文字反差強化。
- `2026-04-28`：完成章節與小節編號改為依標題數字解析。
- `2026-04-28`：完成首頁首屏改為文字區與圖片區分離。
- `2026-04-28`：完成首頁圖片區移除重複連結並統一圖片互動。
- `2026-04-28`：完成課程主專案區塊移除 SDD 示範 Prompt。
- `2026-04-28`：完成 `claude_code_syllabus.md` 與 `shopping-cart` 文件的後端主線改為 Node.js + Express + SQLite，並同步測試與指令口徑。
- `2026-04-28`：完成資料庫主線改回 PostgreSQL，並將第 1-3 節改為用 AI 控制 Docker 安裝與啟動資料庫。
- `2026-04-28`：完成新版 4-3 superpowers 流程圖回填，保留原檔名供課綱與教學網站共用。
- `2026-04-28`：在 3-3 技能分類導覽表新增 `ui-ux-pro-max` 說明，並補充與 `reactcomponents` 的定位差異說明。
- `2026-04-28`：將 3-2 Hooks 段落改為「送 PR 前強制資安掃描」實戰，包含 settings.json 結構與製作 Hook 的示範 Prompt。
- `2026-04-28`：同步官方最新 CLI 安裝方式（Native Install 為推薦主流、Homebrew 加 --cask、WinGet 新增），並更新 Node.js 前提說明；HTML 與 docx 同步重新生成。
- `2026-04-28`：移除課綱標題括號內文字「（4 小時線上錄影課大綱）」，HTML 與 docx 同步重新生成。
- `2026-04-29`：在 3-2 前插入「Agent Skills 與 Hooks 概念入門」（10 mins），原 3-2/3-3/3-4 順延為 3-3/3-4/3-5；嵌入 Anthropic 官方 `hooks-lifecycle.svg` 與 `hook-resolution.svg`；第 3 段時數 75 → 85 mins。
- `2026-04-29`：修正 superpowers 安裝指令為兩步驟（先 `/plugin marketplace add obra/superpowers-marketplace` → `/plugin install superpowers@superpowers-marketplace`），同步 syllabus、project_plan、curriculum、generate_syllabus、portfolio_implementation_plan；HTML 與 docx 重新生成。
- `2026-04-29`：補上 Hook 5 種 type（command/http/mcp_tool/prompt/agent），歸納為 3 大類（確定性執行/LLM 判斷/Subagent 驗證），加上 5 種型式的最小 JSON 範例與共通欄位說明。
- `2026-04-29`：主視覺區（hero-media-card）精簡為僅顯示圖片，移除左側標題與描述文字，避免與右側圖片並列造成視覺雜亂。
- `2026-04-29`：整合互動教學網頁為雙網站並存模式：`interactive.html` + `tutorial.v4.js` 放根目錄與主講義同層、共用 `image/`；主網站 hero 區與 sidebar 各加跳轉 CTA，互動網頁回程加「返回完整講義」連結；`deploy-pages.yml` 加 paths trigger 與 cp 指令，部署後 `/`、`/interactive.html`、`/claude_code_teaching_website.html` 三條入口皆可用。
- `2026-04-29`：修復側邊欄 wrapper + collapser 收折結構（c6aa79e 直接改 HTML 沒同步到 PS1，導致重生 HTML 後收折按鈕消失），改寫進 PS1 單一源並補上 localStorage 持久化。
- `2026-04-29`：建立雙網站錨點關聯。互動網站補 7 個 subsection ID（s3-1~s3-4、s4-1~s4-3）、5 個 chapter 加「📖 看完整講義」返回連結；PS1 加 `INTERACTIVE_MAP` 為有互動對應的小節自動注入「🎮 互動體驗版」連結；3-2（Agent Skills 與 Hooks 概念入門）為純概念，互動無對應，刻意不注入。
