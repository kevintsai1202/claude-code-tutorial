# Claude Code：從零打造全端專案 (3 小時線上錄影課大綱)

**課程定位**：這是一堂純展示（Demo-heavy）的線上錄製課程。講師將帶領學員「從無到有」實作一個完整的全端專案（包含前後端與資料庫），在真實的開發情境中，完整展示如何與 Claude Code 深度協作、除錯與優化。課程不包含實作等待時間，節奏緊湊。

**參考資料**：
- Claude Code Tutorials (Starter Pack, 50 Tips)
- Anthropic Teams Insights (聚焦於開發流程、自動化與除錯心法)

---

## 第 1 小時：專案啟動與後端基礎建置

**目標**：展示如何安裝、設定 Agent 工作環境，介紹計費方案與搭配工具，並實踐「文件驅動開發 (Doc-Driven Development)」，從產出規格與測試計畫開始，再自動搭建後端架構。

### 1-1 方案介紹、環境安裝與版控起手式 (20 mins)
*   **Claude Code 方案與登入機制**：
    *   介紹 Claude Code 的 Beta 計費模式，以及使用 `/login` 切換 Claude.ai (訂閱制) 或 Claude Console (API 計費) 的概念。
    *   推薦常用搭配工具：VS Code (搭配 MCP)、iTerm2/Windows Terminal。
*   **原生安裝與 VS Code 完美整合**：
    *   實機示範原生腳本安裝：`curl -fsSL https://claude.ai/install.sh | bash` 或 `irm https://claude.ai/install.ps1 | iex` (Windows)。
    *   **VS Code 整合 (核心展示)**：
        1.  展示在 VS Code **內建終端機 (Integrated Terminal)** 中直接喚醒 `claude`，邊看程式碼樹狀圖邊指揮。
        2.  安裝與展示 **Claude VS Code 官方擴充套件 (插件)**：示範透過 UI 側邊欄與 Agent 直接互動，將編輯器徹底升級為 AI IDE。
    *   執行 `claude doctor` 檢查安裝健康度與版本資訊。
    *   啟動與指令導覽：展示 `@` 參照能力，並使用 `/help`、`/cost` 監控消耗。
*   **展示概念**：你不是在寫扣，你是在發包。程式開發最重要的是版本控制，而 Claude Code 是你最強的 Git 助手。
*   **重要觀念 (Context 記憶) 與 權限 (`--dangerously-skip-permissions`)**：
    *   展示 `/clear` 保持對話乾淨。
    *   說明正式環境下，若有自動化需求可搭配權限忽略旗標的觀念。
*   **核心起手與版控實戰**：
    *   使用 `/init` 生成 `CLAUDE.md` 定義架構（Spring Boot 3 + React）。
    *   下達指令「請幫我 `git init`，並使用 `gh repo create` 建立專案然後 commit。」

### 1-2 文件先行與 Context7 即時學習 (25 mins)
*   **實機展示：Context7 架構檢索**：
    *   **情境**：為了確保我們採用最新的 Spring Boot 3 與 Java 21 最佳實踐，避免 LLM 幻覺。
    *   **展示**：使用 `context7` MCP 搜尋並讀取 Spring Data JPA 的最新官方文件。
*   **實機展示：規格生成與首秀 Docx Skill**：
    *   **指令 (Plan Mode)**：讓 Claude 依據剛學習的文件，扮演 System Architect 產出 `spec.md` (包含 Ticket 與 User 關聯架構與 API 定義)。
    *   **Docx Skill 首戰**：立刻調用 `docx` 技能，下達指令：「有了 `spec.md` 後，請你自動幫我排版出一份 `.docx` 格式的正式系統規格書草稿」。在一開始就展現出令人驚豔的企業級文件實力。
*   **實機展示：測試計畫先行**：
    *   **Mega Prompt**：讓 Claude 根據 `spec.md` 產出一份完整的 `test-plan.md`，定義所有單元與 API 測試情境。

### 1-3 搭建 Spring Boot 後端與 Agent 循環運作 (20 mins)
*   **實作**：根據剛剛產出的 `spec.md` 與 `test-plan.md`，請 Claude 啟動後端生成。
    *   讓 Claude 先自動建立 JPA Entity、Repository。
*   **展示 Agent 自主 TDD 運作**：
    *   **核心指令**：對 Claude 說「請先寫出 `TicketService` 的 JUnit 5 測試案例。寫完後自動執行 `mvn test`，如果失敗，請自行閱讀錯誤訊息並修改實作代碼，直到測試通過為止。」
    *   **畫面展示**：讓觀眾看著 Claude Code **自主跑指令 -> 發現紅燈 -> 修改代碼 -> 再次跑指令 -> 最終綠燈** 的完整閉環，完全不需人類介入。
*   **真實除錯演練與記憶體管理**：在此過程中製造（或自然發生）一個啟動錯誤。
    *   當遇到錯誤：展示使用 `/bug` 指令，立刻建立一條抓蟲任務。
    *   示範如何用 **步驟隔離 (Step Isolation)**，讓 Claude 逐行閱讀錯誤 Log 並解釋邏輯。遇到走入死胡同時，果斷使用 `/rewind` 或連按兩次 `ESC` 退回上一步歷史，不要糾纏。
    *   **重要指令 (`/compact` 與提示詞回滾)**：解決問題後，展示使用 `/compact` 指令總結並清理剛才除錯時產生的大量無用對話紀錄，保持 Context Window 乾淨。

---

## 第 2 小時：前端開發與全端整合

**目標**：展示在前端 UI 建置與前後端串接時，如何利用 Auto-accept 與 MCP 工具大幅提升產能。

### 2-1 前端鷹架、Auto-accept 與企業級 UI 技能 (20 mins)
*   **實機展示**：
    *   請 Claude 在同一個 Monorepo 中初始化 Vite React 專案，並使用 Vitest 寫出 UI 測試案例。
    *   **導入官方專業技能 (`ui-ux-pro-max`)**：指令調用 `ui-ux-pro-max` 技能，套用 glassmorphism 或企業級 dashboard 樣式，精準產出高質感介面，打破 AI 介面簡陋的刻板印象。
    *   **Auto-Accept 模式體驗**：開啟自動接受模式體驗 80% 工作自主完成的流暢感。
*   **瀏覽器自動化測試 (`webapp-testing` Skill)**：
    *   展示視覺驗證能力：調用 `webapp-testing` 官方技能 (Playwright)，指令：「請打開瀏覽器前往 localhost:5173，點擊案件列表並且截圖證明畫面沒有跑版。」

### 2-2 前後端資料串接與 Subagent 多工處理 (20 mins)
*   **串接挑戰**：讓 Claude 負責實作前端打 API 取資料的邏輯。
    *   這部分常遇到 Spring Boot 經典的 CORS 錯誤或分頁 (Pagination) JSON 結構不符問題。
    *   **技巧展示 (`@` 檔案參照)**：展示如何在 Prompt 中精確使用 `@ControllerName.java` 與 `@ApiUtils.ts` 把特定檔案拉入背景脈絡，避免調查範圍無限發散。一次修改兩邊完成整合。
*   **導入 `/agent` (子探員) 指令**：
    *   **展示重點**：當我們在前台調整介面時，不想污染當前 Context，輸入 `/agent 請在背景幫我寫一支 Python 腳本，塞入 100 筆假資料到 H2 資料庫`。展示 Subagent 獨立運作、不會干擾主對話的極致多工能力。

### 2-3 Claude Skills 製作與效率提升 (20 mins)
*   **Skill 製作方法論 (`skill-creator`)**：
    *   展示給予 Claude `skill-creator` 的教學文件，引導它為這個專案寫出一個專屬的「檢查並確保所有按鈕符合 Tailwind 品牌色規範」的自訂 Skill。
*   **實機展示**：
    *   執行自己剛寫好的這支 Skill，體驗工作流自動化的威力。

---

## 第 3 小時：進階除錯、Agent 應用與完美結案

**目標**：精簡收尾，聚焦於高階除錯指令、Agent 委派與官方技能的整合應用。

### 3-1 終極除錯與 Subagent 協作 (30 mins)
*   **情境設計**：整合後發現深層 Bug（如：寫入時序錯誤），外加客戶臨時丟來一份系統日誌。
*   **高階除錯指令 (`/bug`, `/rewind`)**：
    *   遭遇跨板塊錯誤時，使用 `/bug` 隔離除錯上下文。若 Agent 走入死胡同，果斷使用 `/rewind` 退回，省去無效生成。修復完後以 `/compact` 總結。
*   **`/agent` 輔助日誌分析**：
    *   不切換視窗，運用 `/agent 讀取我桌面的 app-crash.log 並抓出 Root Cause`。讓 Subagent 去分析落落長的日誌，主 Agent 根據其回報直接生成修補程式。展現主副協同的高階開發模式。

### 3-2 官方技能收尾與 PR 發布 (30 mins)
*   **官方技能大串連**：
    *   **`docx` 產出結案**：調用官方 `docx` 技能，下達 Mega Prompt：「讀取 `spec.md` 與完成的程式碼，排版出一份 `.docx` 結案規格書」。
*   **專案部署與指令回顧**：
    *   使用 `/commit` 讓 Claude 生成優雅的 Git Commit 訊息。
    *   指令：「請幫我用 `gh pr create` 生成 Pull Request」，完成發布。
    *   **總結神級指令**：快速回顧 `/init`, `/cost`, `/bug`, `/compact`, `/clear`, `/rewind`, `/agent` 的正確使用時機。
