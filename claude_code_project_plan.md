# Claude Code 3 小時實戰專案：AI 問題追蹤與客服系統 (AI Issue Tracker & Support System)

為了完美搭配 3 小時的「從零打造全端專案」教學大綱，並且能充分展示 Claude Code 的極限火力，我們設計了一個具有中高複雜度、貼近真實業務場景的專案：**「AI 問題追蹤與客服系統」**。

它絕不是簡單的 Todo List。它包含了關聯資料庫設計 (Ticket, User, Comment)、圖表分析、拖曳看板，以及實際串接 AI 分析的情境。

**專案技術棧 (建議)**：
*   **後端**：Spring Boot 3 + Spring Data JPA + H2 記憶體資料庫 (或 PostgreSQL)。適合展示 Claude 處理複雜 ORM 關聯與分層架構 (Controller-Service-Repository) 的能力。
*   **前端**：React (Vite) + Tailwind CSS + shadcn/ui。快速生成企業級介面。

---

## 教學步驟與開發對應指南

1.  **方案介紹、環境安裝與版控起手式**：
    *   **方案與登入教學**：解說 Beta 計費模式，以及使用 `/login` 切換 Claude.ai (訂閱制) 或 Claude Console (API 計費) 的機制。推薦搭配 VS Code (配合 MCP) 與現代化終端機。
    *   **原生安裝與 VS Code 整合**：
        *   實機示範原生安裝指令：`curl -fsSL https://claude.ai/install.sh | bash` 或 `irm https://claude.ai/install.ps1 | iex`。
        *   執行 `claude doctor` 確認系統狀態。
        *   **VS Code 深度整合**：
            1.  在 **VS Code 內建終端機 (Integrated Terminal)** 直接啟動 `claude`，示範邊看大綱邊指揮。
            2.  安裝 **VS Code 官方擴充套件**：展示透過側邊欄 UI 直接啟動對話與專案級別指令。
    *   **啟動與指令導覽**：啟動並展示 `@` 參照能力。使用 `/help` 與 `/cost` 建立可用指令認知。並解說 `/clear` 保持對話乾淨的重要性。提及進階使用的 `--dangerously-skip-permissions` 權限旗標。
    *   使用 `/init` 生成 `CLAUDE.md`，宣告：「我們是一個 Spring Boot 3 專案，使用 Java 21。請遵循 Controller/Service/DTO/Repository 分層架構，並使用 Lombok」。
    *   **Git/GH 實戰**：下達指令「請幫我 `git init`，並使用 `gh repo create ai-issue-tracker --private` 在 GitHub 建立私人專案，然後提交初始 commit。」展示 Agent 直接操作版控的威力。
2.  **文件先行 (Doc-First) 與 Context7 即時學習**：
    *   **Context7 實戰**：透過 Context7 搜尋並讀取 Spring Boot 3 與 Spring Data JPA 的最新官方文件，確保模型知識最新。
    *   **指令 (Plan Mode)**：讓 Claude 扮演 System Architect 產出 `spec.md`，規劃 `Ticket`、`User` 與 `Comment` 的關聯 Entity，以及 REST API 定義。
    *   **文件產出 (`docx` Skill 首秀)**：立刻調用 `docx` 技能，下達 Mega Prompt：「身為技術總監，請讀取剛剛的 `spec.md`，自動寫出並排版一份專業的 `.docx` 專案初期規格書」。在一開始就展現 AI 兼具工程與文書的強大實力。
    *   **Mega Prompt**：接著根據 `spec.md` 產出一份完整的 `test-plan.md`，定義單元測試與 API 測試情境。展示「不先寫程式，先寫測試與規格」的高階心法。
3.  **展示 Agent 自主 TDD 運作與除錯指令**：
    *   **設計情境**：依照 `test-plan.md`，下達 Prompt 讓 Claude 寫 Service 單元測試並實作商業邏輯。
    *   **展示重點 (自主運作)**：要求 Claude「寫完測試後自動執行 `mvn test`。如遇錯誤，請自行分析 Console Log 並修正代碼，持續重試直到測試通過」。展示 Agent 能自我回饋、自動跑指令修正的自主循環。
    *   **除錯指令示範**：如果在其他手動環節遇到預期外錯誤。
        *   立刻使用 `/bug` 讓 Claude 切換為除錯專家模式。遇到卡關時，使用 `/rewind` 退回重試，避免無意義的消耗。
        *   修復完成後，示範使用 `/compact` 指令，將落落長的除錯過程壓縮回憶，釋放 Context Window 空間。

### 第 2 小時：前端開發與全端整合
**教學目標**：展示前端快速產出能力 (Auto-accept)、專業 UI 技能導入與 Subagent 委派。

1.  **TDD 前端鷹架、`ui-ux-pro-max` 與視覺驗證**：
    *   **指令**：請在 `/frontend` 目錄建立 Vite React 專案。先請 Claude 使用 Vitest 寫好「案件儀表板」的 UI 測試案例。
    *   **官方專業技能導入**：調用 `ui-ux-pro-max` 技能，指定產出具備 Glassmorphism 風格的 shadcn/ui 控制面板。**開啟 Auto-accept (`Shift+Tab`)**，雙手離開鍵盤，讓觀眾看著企業級 Tailwind 代碼飛速生成。
    *   **`webapp-testing` Skill 驗證**：調用此技能，讓 Claude 打開瀏覽器直接前往 `localhost:5173` 截圖並點擊驗證，展示 AI 突破純文字框架的視覺除錯能力。
2.  **前後端資料串接與 `/agent` 指令展示**：
    *   **實作**：將 React 前端假資料換成打 Spring Boot API 取回的真實資料。
    *   **技巧展示 (`@` 檔案參照)**：遇到 CORS 錯誤時，利用 `@ControllerName.java` 與 `@ApiUtils.ts` 將關鍵檔案拉入 Context，讓 Claude 精確跨目錄檢查，一次修改兩邊完成整合。
    *   **獨立委派 (`/agent`)**：開發當下，下達 `/agent 請寫一支 Python 腳本塞入 100 筆測試用的 Ticket 到資料庫中`。展示背景 Agent 獨立處理瑣事，維持主對話視窗乾淨的高階技巧。
3.  **自訂 Skill 製作 (`skill-creator`)**：
    *   **實作**：發現組件的 Tailwind 色碼需要大範圍統整。
    *   **展示重點**：現場給予 `skill-creator` 文件，讓 Claude 幫本專案寫出一個專屬的「品牌色系檢查清單」Skill，展示如何把好的 Prompt 固化成工具。

### 第 3 小時：進階除錯、Agent 應用與完美結案
**教學目標**：精簡內容，聚焦全域除錯、`/agent` 外部日誌解析與官方技能總結。

1.  **環境除錯挑戰 (`/bug` & `/rewind`)**：
    *   **情境**：前端 UI 更新狀態後，一重新整理資料又倒退回去（DB 沒寫入或快取未更新）。
    *   **展示重點**：直接使用 `/bug` 進入除錯模式。結合前端 `webapp-testing` 視覺報錯與後端 Console Log 找出根本原因。若 LLM 鬼打牆，果斷使用 `/rewind` 時光倒流。修復完畢後使用 `/compact` 釋放 Context Window 空間。
2.  **管線指令 (`claude -p`) 處理外部日誌分析**：
    *   **情境與展示**：客戶臨時要求新增一個緊急功能：「希望系統能看懂純文字的錯誤日誌」。
    *   **實機展示**：不進入互動模式，直接使用終端機管線指令 `cat ~/Desktop/app-crash.log | claude -p "分析這份日誌，找出錯誤並回傳 JSON 摘要"`。展現 Claude CLI 可被腳本化的強大潛力。
    *   隨後進入主 Agent，接收到精煉回報後，立刻寫出建立 Ticket 的 API。展現實戰中極限的協作模式。
3.  **官方技能 (`docx`) 結案與版本推進 (Git/GH PR)**：
    *   **自動產出 `.docx`**：利用官方 `docx` Skill，讀取 `spec.md` 與程式碼產出專案結案報告，展現文書處理實力。
    *   **一條龍發布 (GitHub PR)**：完成後使用 `/commit` 讓 Claude 生成優雅的 Commit Message，並下達 `gh pr create` 生成一個 Pull Request。
    *   **指令總複習**：重點整理 `/clear`, `/bug`, `/compact`, `/rewind`, `/agent` 的實戰守則，完美收尾。
