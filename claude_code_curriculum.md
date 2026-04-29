# Claude Code 課程資源清單

> **本文件定位**：本清單對齊 `claude_code_syllabus.md`（5 段式 4.5～5 小時課綱）的所有主題，整理「**內部專案資料 + 外部官方文件**」雙線資源。每段課綱旁都標註對應的資源來源，方便講師備課與學員回查。

---

## 📂 內部專案核心文件（課程主資料）

| 檔案 | 用途 | 對應段落 |
|---|---|---|
| [claude_code_syllabus.md](./claude_code_syllabus.md) | 課綱單一源（學員交付） | 全課 |
| [claude_code_syllabus.docx](./claude_code_syllabus.docx) | Word 版講義（生成輸出物） | 全課 |
| [claude_code_project_plan.md](./claude_code_project_plan.md) | 講師備課教案（教學決策、節奏、示範細節） | 全課 |
| [spec.md](./spec.md) | 規格定義（SDD 示範用） | 2-1 |
| [api.md](./api.md) | API 文件（Restful） | 2-2、2-3 |
| [todolist.md](./todolist.md) | 任務追蹤 | 全課 |
| [CLAUDE.md](./CLAUDE.md) | 專案規則 + Claude 共識契約 | 1-2、5-2 |
| [shopping-cart/](./shopping-cart/) | 主專案實作目錄（Spring Boot + React 全端） | 第 2-4 段 |

---

## 📚 內部主題資料（深度補充）

### Context 管理與長期記憶

- [x] **[Claude Code 進階上下文控制指令操作指南](./claude-code-context-guide.md)**
  - 涵蓋 `/clear` `/compact` `/context` `/rewind` `/resume` `/rename` `/fork` 完整指令系統，以及 CLAUDE.md / `/memory` / `@path` 長期記憶三件套。
  - **對應段落**：1-2（CLAUDE.md 寫法與長期記憶）、2-4（Context 管理與會話控制）、4-2（slash commands 工作流）

### Permission Modes 權限模式

- [x] **[Claude Code 開啟 Auto Mode 與 Bypass Mode](./claude-code-permission-modes.md)**
  - Auto Mode 啟用前提（方案 / 模型 / 組織層級）、CLI 三種啟用方式、Bypass Mode 灰色地帶（`.git`/`.vscode`/`.idea` 仍提示）、Auto vs Bypass 對照表、管理員 disable 設定。
  - **對應段落**：1-1（五種權限模式）、2-2（Auto Mode 配合 TDD 自主迴圈）

### Harness Engineering 治理框架

- [x] **[Harness Engineering 學術論文與工程實踐](./harness-engineering-paper.md)**
  - LangChain Terminal Bench 2.0 從 52.8% → 66.5% 的 Harness 優化案例、OpenAI 三人團隊五個月百萬行程式碼的工程實踐、七大類 Harness 分類學術依據。
  - **對應段落**：第 5 段全段（Harness Engineering 概念整合收尾）

### superpowers 開發紀律技能套組

- [x] **superpowers plugin（obra/superpowers-marketplace 社群維護）**
  - 安裝（須兩步驟）：`/plugin marketplace add obra/superpowers-marketplace` → `/plugin install superpowers@superpowers-marketplace`
  - 8 個關鍵技能：`brainstorming` / `writing-plans` / `executing-plans` / `test-driven-development` / `systematic-debugging` / `verification-before-completion` / `requesting-code-review` / `finishing-a-development-branch`
  - **三條 Iron Laws**（課程記憶錨點）：
    - 🔴 `NO PRODUCTION CODE WITHOUT A FAILING TEST FIRST`
    - 🔴 `NO COMPLETION CLAIMS WITHOUT FRESH VERIFICATION EVIDENCE`
    - 🔴 `Evidence before claims, always`
  - **對應段落**：3-3（技能分類預告）、4-3（spec → TDD → e2e 完整管線）

### agent-browser 瀏覽器自動化

- [x] **agent-browser 技能（inference.sh）**
  - 安裝：`curl -fsSL https://cli.inference.sh | sh && infsh login`
  - 支援錄影輸出（`.webm`）+ 紅點游標視覺化
  - **對應段落**：3-1（自動截圖、錄影與 SOP 文件產出）

---

## 🛒 主專案：購物車系統參考資料

### 技術棧文件對照

| 層 | 技術 | 對應段落 |
|---|---|---|
| 後端 | Spring Boot 3 + Spring Data JPA + PostgreSQL 16 | 1-3、2-2 |
| 前端 | React 18 + Vite + TypeScript | 2-3 |
| 測試 | JUnit 5（後端）、Playwright MCP（前端 E2E） | 2-2、2-3 |
| 容器 | Docker Desktop / Docker Compose | 1-3 |
| 版控 | Git + GitHub CLI（gh） | 1-4 |

### 課程實作 Bug 三件組（2-4 段除錯實戰）

| Bug | 教學示範 Context 指令 |
|---|---|
| CORS 錯誤 | `/bug` → `/compact focus on cart API contract` |
| badge 不即時更新 | 同時 `@CartContext.tsx @CartBadge.tsx` |
| 數量改後合計未刷新 | `Esc Esc` → **Restore code only** |

---

## 🔰 基礎先修與核心概念

- [x] **[The Ultimate Beginner's Guide to Claude (2026 年 3 月)](./datasource/claude-beginners-guide-2026-03.md)**
  - 課程前置必備：涵蓋 3 段式 Prompt 公式、模型選擇矩陣 (Sonnet 4.6 / Opus 4.7 / Haiku 4.5 使用時機)，以及 Projects 專案記憶與即將到來的 Cowork 工具介紹。
  - **對應段落**：1-1（模型選擇策略）

---

## 📖 核心教學與指南

- [x] **[Claude Code Starter Pack (入門與進階合輯)](./datasource/claude-code-starter-pack-2026-01.md)**
  - 涵蓋 15 分鐘上手指南、最佳 Prompt、設定教學 (CLAUDE.md)、學習路徑以及工具市集等。
  - **對應段落**：1-1、1-2

- [x] **[Ultimate Claude Starter Pack](./datasource/claude-ultimate-starter-pack-2026-02.md)**
  - 提供 Claude Code 的官方最佳實踐、Boris (創建者) 的設定藍圖、Slash Commands 技巧以及進階學習資源。
  - **對應段落**：1-2、4-2

- [x] **[Anthropic 官方教學連結清單](./datasource/官方教學.md)**
  - 包含 Anthropic 官方的「Claude Code 實戰」等課程連結。
  - **對應段落**：全課

---

## 🛠 技巧與最佳實踐

- [x] **[50 個 Claude Code 最佳實踐與實用技巧](./datasource/claude-code-tips-50-2026-01.md)**
  - 深入探討專案記憶 (Project Memory)、子代理程式 (Subagents)、Plan Mode、錯誤除錯與自動化工作流設定。
  - **對應段落**：2-2（TDD + Auto Mode）、2-4（Context 管理）、3-4（/agent）

- [x] **[50 個被低估的 Claude 技巧 (重點擷取 Claude Code 部分)](./datasource/claude-underrated-tips-50-2026-01.md)**
  - 涵蓋了 `/doctor`、`/compact` 及 `/clear` 等指令的運用，以及模型堆疊測試和 MCP 的冷門但實用的技巧。
  - **對應段落**：1-1、2-4、4-2

---

## 🏢 團隊真實案例與洞察 (內部報告與文件)

- [x] **[Anthropic 團隊如何使用 Claude Code (報告網頁)](./anthropic-teams.html)**
  - 深度訪談 10 個不同團隊（包含基礎設施、安全工程、數據科學等）使用 Claude Code 的真實場景與生產力提升數據。
  - **對應段落**：3-2（企業 Skill 應用情境）、第 5 段（Harness 升級路徑）

- [x] **Lessons from Building Claude Code (技術洞察)**
  - 從產品構建者的角度，分享代理人 (Agent) 動作空間設計、問答工具及任務系統的底層邏輯。
  - **對應段落**：5-1（Harness Engineering 工程定義）

- [x] **How-Anthropic-teams-use-Claude-Code_v2.pdf**
  - 提供團隊實踐的詳細 PDF 報告檔案。
  - **對應段落**：3-2、5-4

---

## 🔗 外部官方資源連結

| 資源 | 連結 | 對應段落 |
|---|---|---|
| Claude Code 官方文件 | https://code.claude.com/docs | 全課 |
| Permission Modes 官方文件 | https://code.claude.com/docs/en/permission-modes | 1-1 |
| Auto Mode 公告 | https://claude.com/blog/auto-mode | 1-1、2-2 |
| Auto Mode 工程深入解析 | https://www.anthropic.com/engineering/claude-code-auto-mode | 1-1、2-2 |
| Anthropic 官方 plugins（含 superpowers） | https://github.com/anthropics/claude-plugins | 4-3 |
| MCP 協議規範 | https://modelcontextprotocol.io | 1-2、3-3 |
| inference.sh CLI（agent-browser） | https://cli.inference.sh | 3-1 |

---

## 📋 段落 ↔ 資源速查表

| 段落 | 主題 | 主要參考資料 |
|---|---|---|
| **1-1** | 環境安裝、登入與五種操作模式 | beginners-guide / permission-modes / Auto Mode 官方公告 |
| **1-2** | 介面導覽、設定、CLAUDE.md、長期記憶 | starter-pack / context-guide / ultimate-starter-pack |
| **1-3** | Docker 與 AI 操作資料庫 | shopping-cart/ docker-compose 範本 |
| **1-4** | Git 常用操作 + gh CLI | tips-50（gh 工作流） |
| **2-1** | SDD 規格先行 | spec.md 範本 / starter-pack |
| **2-2** | 後端生成、TDD 自主迴圈、Auto Mode | tips-50 / Auto Mode 工程文件 / superpowers TDD |
| **2-3** | 前端鷹架與 API 串接 | shopping-cart/ React 範本 / api.md |
| **2-4** | Context 管理、會話控制與真實除錯 | **context-guide**（核心）/ underrated-tips-50 |
| **3-1** | agent-browser 截圖錄影 SOP | inference.sh 文件 |
| **3-2** | skill-creator 企業資安 Skill | anthropic-teams 報告（資安情境） |
| **3-3** | 開發輔助技能分類導覽 | tips-50 / superpowers plugin |
| **3-4** | /agent 背景任務 + Git Worktrees | tips-50（subagents） |
| **4-1** | /review + /simplify 內建品質指令 | starter-pack |
| **4-2** | slash commands 完整工作流總覽 | underrated-tips-50 / context-guide（4 個工作流組合） |
| **4-3** | superpowers spec → TDD → e2e 管線 | **superpowers plugin**（核心）/ Anthropic 官方 plugins repo |
| **5-1** | Harness Engineering 是什麼 + 7 種類型 | **harness-engineering-paper**（核心）/ Lessons from Building Claude Code |
| **5-2** | 課程實踐 ↔ Harness 對應 | 全課內容彙整 |
| **5-3** | 三大支柱（Context / Constraints / Entropy） | harness-engineering-paper |
| **5-4** | Harness 升級路徑 Level 1-3 | anthropic-teams 報告 / Anthropic engineering blog |

---

*註：以下純 Claude 對話/UI 教學檔案已被排除在課程清單外（與 Claude Code 主軸無關）：*

- *claude-elite-prompting-guide-2026-01.md（一般 Prompt 工程）*
- *claude-skills-guide-2026-01.md（一般 Skills 面板功能）*
