# Claude Code 進階上下文控制指令操作指南

> 一份涵蓋 context 管理、長期記憶、會話狀態與回滾策略的完整參考手冊

---

## 目錄

1. [核心觀念：為什麼要管理 Context](#1-核心觀念為什麼要管理-context)
2. [直接操作當前 Context 的指令](#2-直接操作當前-context-的指令)
3. [長期記憶：跨 Session 持久化](#3-長期記憶跨-session-持久化)
4. [會話狀態控制（`/re` 系列）](#4-會話狀態控制re-系列)
5. [切換模型與能力](#5-切換模型與能力)
6. [監控與診斷](#6-監控與診斷)
7. [實務策略：何時用哪個指令](#7-實務策略何時用哪個指令)
8. [常見工作流程組合](#8-常見工作流程組合)
9. [快速查詢對照表](#9-快速查詢對照表)

---

## 1. 核心觀念：為什麼要管理 Context

Claude Code 的 **context window**（上下文視窗）是它的「工作記憶」——每次 session 開始都是全新的，所有對話、讀過的檔案、工具輸出、MCP 回應都會不斷累積在裡面。

### 三個關鍵事實

- **Context 有限且邊際遞減**：塞越多 ≠ 效果越好。無關內容會讓 Claude 注意力分散，產生所謂的 **context rot**（上下文腐化）。
- **徵兆**：session 開了一段時間後，Claude 變慢、重複問已經回答過的問題、建議跟先前實作衝突的作法。
- **主動管理 > 被動等待**：官方建議在「階段邊界」主動壓縮或清除，而不是等系統自動觸發（自動觸發常打斷任務節奏）。

---

## 2. 直接操作當前 Context 的指令

| 指令 | 用途 | 使用時機 |
|---|---|---|
| `/clear` | 完全清空對話歷史，開始全新 session（檔案和程式碼變更不受影響） | 切換到**無關的新任務**，最乾淨的選項 |
| `/compact` | 將對話歷史壓縮成摘要，保留關鍵資訊繼續使用 | 一個階段完成但**需要保留脈絡**繼續下一步時 |
| `/compact <指令>` | 帶指示的壓縮，例如 `/compact focus on the API layer` | 想明確告訴 Claude 壓縮時**保留哪些重點** |
| `/context` | 顯示彩色網格，告訴你 context 被什麼佔用（檔案、對話、系統 prompt、MCP 等） | 覺得變慢或想在 compact 前先**診斷空間去向** |

### 差異整理

- `/clear` = 砍掉重練（連續性為零）
- `/compact` = 壓縮成摘要（保留脈絡但變精簡）
- `/context` = 只看不動（診斷工具）

---

## 3. 長期記憶：跨 Session 持久化

| 機制 | 用途 | 關鍵特性 |
|---|---|---|
| `CLAUDE.md` | 專案根目錄的 Markdown，每次 session 開始自動載入 | 寫入編碼規範、架構決定、工具偏好；**`/compact` 後會從磁碟重新注入** |
| `/memory` | 開啟 memory 檔案編輯器，瀏覽 Claude 自動記下的筆記 | Claude 會根據你的糾正自動累積學習；檔案超過 200 行會影響遵循度 |
| `@path` 匯入 | 在 CLAUDE.md 內引入其他檔案 | 把細節拆到獨立檔案，避免 CLAUDE.md 本身過長 |

### CLAUDE.md 實務建議

- 放專案層級的穩定規則（例：使用 TypeScript strict mode、元件命名慣例、禁用套件清單）。
- 不要把「一次性任務細節」塞進去，那該寫在對話裡或獨立 markdown。
- 巢狀的 CLAUDE.md（子目錄的）**不會**在 `/compact` 後自動重載，只有當 Claude 再次讀取該目錄下的檔案時才會重新載入。
- 如果發現某個指示在 compact 後消失了，通常就是它只存在於對話中，解方是把它搬進 CLAUDE.md。

---

## 4. 會話狀態控制（`/re` 系列）

這組指令處理「時間軸」層面的 context 操作——跨 session 取回、在 session 內回滾。

| 指令 | 作用 | 對 Context 的影響 |
|---|---|---|
| `/resume` | 瀏覽並恢復之前的 session（按上下鍵選，或用搜尋框找） | **載入舊 context**，把當時的對話歷史重新裝回工作記憶 |
| `/rewind` | 回滾到對話中的某個時間點（也可用 `Esc` 連按兩下觸發） | **選擇性刪除 context**：可分開處理對話與程式碼 |
| `/review` | 內建的程式碼審查技能 | 讀取 diff 內容進 context，產出審查意見 |
| `/rename` | 幫當前 session 取個可讀名稱（例如 `/rename auth-refactor`） | 不影響 context 內容，方便日後 `/resume` 時找到 |

### `/rewind` 的五個選項（這個最需要懂）

按 `Esc` `Esc` 進入 rewind 模式，用上鍵捲到想回去的點，按 Enter 後出現：

- **Restore code and conversation** — 程式碼跟對話都回滾（最徹底）
- **Restore conversation** — 只回滾對話，**程式碼保留**
- **Restore code** — 只回滾檔案，**對話保留**（很實用：Claude 改壞了但推理過程還想留著參考）
- **Summarize from here** — 把這個點之後的內容壓縮成摘要
- **Never mind** — 取消

### `/rewind` vs `/clear` vs `/compact` 的關鍵差異

- `/clear` = 全部砍光，從零開始
- `/compact` = 壓縮成摘要，保留重點但失真
- `/rewind` = **時光機**，精準回到某時刻，而且能分別處理程式碼和對話
- `/resume` = 從**不同 session** 把舊 context 叫回來

---

## 5. 切換模型與能力

這些指令不直接改 context 內容，但會影響 context 的處理效率與容量使用。

| 指令 | 用途 |
|---|---|
| `/model` | 切換 Opus / Sonnet / Haiku，影響 context 處理能力與成本 |
| `/effort` | 設定推理深度（low / medium / high / max / auto） |
| `/mcp` | 管理 MCP 伺服器連線，**停用不需要的 MCP 可釋放大量 context** |
| `/agents` | 啟用 subagent，用獨立 context 執行子任務，避免污染主對話 |
| `/permissions` | 管理 Claude 可自動執行的動作範圍 |

### MCP 的隱藏成本

每個連線中的 MCP server 都會注入工具定義到 context 裡，很容易佔掉幾千 token 卻沒在用。定期用 `/context` 檢查，把閒置的用 `/mcp` 關掉。

### Subagent 的妙用

Subagent 在**獨立的 context** 裡執行，跑完只回傳結果給主對話。適合用來跑「會讀一堆檔案但你只需要結論」的任務（例如程式碼搜尋、測試執行），避免污染主 context。

---

## 6. 監控與診斷

| 指令 | 用途 |
|---|---|
| `/cost` | 查看 token 用量、session 時長、程式碼變更量（API 計費用戶最有用） |
| `/status` | 查看版本、模型、帳號資訊（Pro/Max 訂閱用戶應優先看這個） |
| `/stats` | 查看使用統計 |
| `/doctor` | 檢查安裝健康狀態 |
| `/diff` | 互動式檢視未 commit 的變更（取代 `git diff`） |

---

## 7. 實務策略：何時用哪個指令

```
想做的事                        →  該用什麼
──────────────────────────────────────────────
開完全無關的新任務              →  /clear
階段收尾要繼續下一階段          →  /compact
感覺變慢/不準先診斷             →  /context
Claude 改壞了想退回去           →  /rewind
想保留推理但退回檔案狀態        →  /rewind → Restore code
接續昨天的工作                  →  /resume
想讓下次開 session 還記得       →  寫進 CLAUDE.md
MCP 佔太多空間                  →  /mcp 停用閒置的
跑大量檔案掃描不想污染主對話    →  /agents 派 subagent
```

### 黃金守則

- 🟢 **開新任務前先 `/clear`** — 比你想像中更能救回應品質
- 🟡 **階段切換時 `/compact`** — 不要等自動觸發
- 🔵 **覺得卡就 `/context`** — 看哪裡在吃空間
- 🟣 **一次性指示寫對話、長期規則寫 CLAUDE.md**
- 🔴 **Claude 走錯路就 `/rewind`** — 比手動還原檔案快十倍

---

## 8. 常見工作流程組合

### 組合 A：Review-then-Rollback（審查後決定去留）

```
/diff          # 看 Claude 改了什麼
   ↓
不滿意？
   ↓
/rewind        # 退回去重試
   ↓
選擇 Restore code only（保留對話脈絡當參考）
```

### 組合 B：階段交接（Phase Handoff）

```
完成第一階段
   ↓
/compact focus on the API contract and remaining tasks
   ↓
繼續第二階段（context 變輕但重點還在）
```

### 組合 C：Context 體檢

```
/context                 # 看總覽
   ↓
發現 MCP 佔 40%？
   ↓
/mcp                     # 停用沒用到的
   ↓
/context                 # 再確認一次
```

### 組合 D：跨天接續工作

```
下班前：
   /rename auth-refactor-day1
   /compact（留個乾淨的摘要）

隔天：
   /resume
   搜尋「auth-refactor」
   繼續做
```

### 組合 E：安全實驗（搭配 `/fork`）

```
/rename main-approach
/fork                    # 分支出去試另一種作法
試完後 /resume 回主線
   → 兩個方案都在，可以比較
```

---

## 9. 快速查詢對照表

### 按功能分類

**🗑 清除類**
- `/clear` — 全清
- `/compact` — 壓縮
- `/rewind` — 時光機

**💾 記憶類**
- `CLAUDE.md` — 專案長期記憶
- `/memory` — 自動記憶編輯
- `@path` — 檔案匯入

**🔄 會話類**
- `/resume` — 接續舊 session
- `/rename` — 命名 session
- `/fork` — 分支實驗
- `/branch` — 平行對話

**🔍 診斷類**
- `/context` — 空間用量
- `/cost` — token 成本
- `/status` — 帳號資訊
- `/diff` — 檔案變更

**⚙️ 設定類**
- `/model` — 切換模型
- `/effort` — 推理深度
- `/mcp` — MCP 管理
- `/agents` — 子代理
- `/permissions` — 權限

### 按 context 影響程度排序

| 影響強度 | 指令 | 說明 |
|---|---|---|
| 🔴 極大 | `/clear` | 全部清空 |
| 🔴 極大 | `/resume` | 載入整個舊 session |
| 🟠 大 | `/compact` | 壓縮整段歷史 |
| 🟠 大 | `/rewind` | 移除一整段時間軸 |
| 🟡 中 | `/mcp` 停用 | 釋放工具定義空間 |
| 🟡 中 | `/agents` | 把任務轉到獨立 context |
| 🟢 小 | `/model` 切換 | 改變處理能力但不變內容 |
| 🟢 小 | `/context` | 只讀取，不改動 |

---

## 附錄：鍵盤快速鍵

- `Esc` 一次 — 中斷 Claude 的當前回應（要繼續就輸入 `go`）
- `Esc` `Esc` — 進入 rewind 模式
- `Ctrl + S` — 把當前輸入暫存起來（想先插入其他問題時）
- `Alt + P` — 切換模型但保留當前輸入

---

## 自訂指令補充

除了內建指令，你可以在 `.claude/commands/` 放 markdown 檔建立自己的 slash command：

```
.claude/commands/
├── refactor.md        # /refactor
├── review-pr.md       # /review-pr
└── frontend/
    └── component.md   # /component
```

檔案內容就是 prompt，可選用 YAML frontmatter 預先核准工具、設定模型、加描述：

```yaml
---
description: Pre-commit check for debug artifacts
allowed-tools: Bash(git *), Bash(grep *), Read, Glob
---
```

新版本推薦改用 `.claude/skills/<name>/SKILL.md`，同樣支援 `/name` 呼叫，**額外支援 Claude 自動判斷何時使用**（skills 和 slash commands 的核心差異）。

---

*參考來源：Claude Code 官方文件、Anthropic 部落格、社群實務整理（2026 年 4 月）*
