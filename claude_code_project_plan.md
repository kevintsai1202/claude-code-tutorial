# Claude Code 4 小時實戰專案：講師備課教案

> **本文件定位**：這份教案是 `claude_code_syllabus.md` 的講師備課版——**不重複課綱內容**，只補充每段的教學決策、示範節奏、學員可能會卡的點、為什麼這樣設計、以及實機示範時要強調的細節。
>
> **配合閱讀順序**：先讀 `claude_code_syllabus.md` 了解每段內容、時數、主題，再回來讀這份教案了解「怎麼教」。

---

## 主專案：購物車系統（Shopping Cart）

### 為什麼選購物車而非 Issue Tracker

| 面向 | 購物車 | Issue Tracker（舊版） |
|---|---|---|
| 領域熟悉度 | 學員都用過電商，零學習成本 | 需先解釋工單流程 |
| 商業邏輯密度 | 合計計算、合併數量、清空——足夠 TDD 練習 | CRUD 為主，TDD 點較少 |
| Bug 製造空間 | CORS、即時更新、合計刷新——三個經典前後端整合 bug | Bug 類型較單調 |
| Skill 應用情境 | 資安規範（信用卡、totalAmount 防偽）非常具體 | 較難設計具體規範 |

> **教學決策**：選購物車是因為「**領域低門檻 × 邏輯複雜度高 × Bug 情境豐富 × Skill 場景具體**」四項都拿滿分。

### 主專案技術棧（建議）

* **後端**：Spring Boot 3 + Spring Data JPA + PostgreSQL（Docker）
* **前端**：React (Vite) + TypeScript
* **測試**：JUnit 5（後端）、Playwright MCP（前端 E2E）
* **文件與技能**：`docx`、`skill-creator`、`reactcomponents`、`firecrawl`、`superpowers` plugin

### 核心實體與功能範圍

* `Product`（商品）、`Cart`（購物車）、`CartItem`（購物車明細）
* 五個關鍵商業規則：(1) 加入購物車、(2) 相同商品合併數量、(3) 數量改 0 自動移除、(4) 合計伺服器計算、(5) 結帳清空——這五條就是 2-2 段 TDD 的測試場景。

---

## 第 1 段：Git、GitHub 與 Claude Code 起手式（60 mins）

### 1-1 環境安裝、登入與操作模式（20 mins）

**教學節奏建議**：

1. **5 mins**：安裝 + `claude doctor`（不要花太多時間，學員多數已裝好）
2. **3 mins**：訂閱方案表格快速帶過，重點放在「個人 Pro / 企業 Team」兩條路線怎麼選
3. **3 mins**：模型別名表，**Sonnet 4.6 是日常主力**，Opus 留給架構決策、Haiku 給 subagent
4. **4 mins**：VS Code vs CLI 對照，現場切換給看
5. **5 mins**：**五種權限模式（Auto/Bypass 是亮點）**——這段最容易讓學員「眼睛一亮」的是 Auto Mode 的分類器把關概念

**示範 Prompt（強調用「自然語言」而非死背指令）**：

> 「請幫我檢查 Claude Code 安裝狀態，並告訴我目前用的是哪個模型。」

**容易卡的點**：

* 學員會問「Auto Mode 跟 Bypass Mode 哪個比較危險？」——強調 Auto 有 classifier 把關，Bypass 完全裸奔；個人開發推薦 Auto，CI 容器才用 Bypass。
* Auto Mode 需要 Team / Enterprise / API 方案——個人 Pro 用戶會失望，要說明可改用 acceptEdits + Plan Mode 替代。

**Harness 視角預埋**：權限模式 = Safety Harness。第 5 段會回頭收束。

---

### 1-2 介面導覽：CLI vs VS Code 插件、設定與 CLAUDE.md（15 mins）

**教學節奏建議**：

1. **3 mins**：CLI 介面快速導覽（Shift+Tab、↑↓、Ctrl+C）
2. **3 mins**：VS Code 插件介面（Diff 預覽、模式選擇器點擊切換）
3. **3 mins**：Global vs Project 設定層級表
4. **6 mins**：**CLAUDE.md 實機示範 + 長期記憶三件套**——這段是第 1 段的重頭戲

**CLAUDE.md 實機示範重點**：

* 在課程 demo repo 開啟 VS Code，現場敲 `/init`，觀察 Claude 自動掃描專案後產出的初版 CLAUDE.md
* 講師補上「禁止行為」段落（例：禁止 hardcode DB 密碼），讓學員看到「禁止」比「盡量避免」有效
* 強調「合計由伺服器算」這條規則——後續 TDD 段會看到這條規則如何讓 Claude 不走偏

**長期記憶三件套教學重點**：

* `CLAUDE.md` `/compact` 後會從磁碟重載——**這是「為什麼一次性指示寫對話、長期規則寫 CLAUDE.md」的根本原因**
* `/memory` 超過 200 行會降遵循度——這個「冷知識」很多人不知道
* `@path` 匯入避免 CLAUDE.md 過長——示範用 `@docs/coding-style.md` 的寫法

**容易卡的點**：

* 學員會問「巢狀 CLAUDE.md（子目錄的）什麼時候會載入？」——回答：**只有 Claude 讀取該目錄下的檔案時才會載入，且 `/compact` 後不會自動重載**。

---

### 1-3 Docker 安裝與 AI 操作資料庫（5 mins）

**教學節奏建議**：

* 這段是「橋接段」，主要目的是讓 PostgreSQL 跑起來給後段 TDD 用
* 不要花時間講 Docker 原理，直接示範「用自然語言下指令給 Claude」

**示範 Prompt 兩條對照（單容器 vs Compose）**：

* 單容器：「請幫我用 Docker 啟動一個 PostgreSQL 16 容器，DB 名稱 `shoppingcart`，帳號 `admin`，密碼 `secret`。」
* Compose：「請幫我建立 `docker-compose.yml`，包含 PostgreSQL 16…」

**教學決策**：兩條都示範是因為個人專案 vs 團隊專案的選擇不同——個人快測用單容器，團隊版控用 Compose。

---

### 1-4 Git 常用操作與 gh CLI 協作模式（20 mins）

**教學節奏建議**：

1. **5 mins**：Git + gh 安裝（截圖快速帶過）
2. **3 mins**：5 個 Git 常用操作快速講解
3. **12 mins**：**兩個實機示範**

**兩個實機示範**：

1. **gh repo create 一鍵建 repo**：講師現場敲一句自然語言 prompt，Claude 自動 init / add / commit / 建遠端 / push，全程不離開 terminal
2. **commit + 開新分支**：示範 Conventional Commits 自動格式化、`feature/add-to-cart` 分支建立——為後續開發鋪路

**容易卡的點**：

* 學員會問「Claude 會自動 push 嗎？」——強調預設模式會詢問，Auto Mode 才會自動執行
* 學員會擔心「Claude 寫的 commit message 不夠精準」——示範如何 follow-up 讓它重寫

---

## 第 2 段：全端主線實作（105 mins）

### 2-1 SDD 規格先行：與 Claude 共同撰寫 spec.md（15 mins）

**教學決策**：先做 SDD 才能讓後續 TDD 有依據。SDD ≠ 寫 Word 文件，而是「**把共識寫進 Claude 看得到的地方**」。

**示範 Prompt**：

> 「請根據以下需求產出 `spec.md`：使用者可瀏覽商品並加入購物車；加入相同商品自動合併數量；數量改為 0 則自動移除；購物車合計由伺服器計算；結帳時填收件資料後清空購物車。**請先只產出規格，不要寫程式**。」

**強調「不要寫程式」這四個字的力量**——很多學員問「為什麼 Claude 沒直接動手」，答：因為你先約束它了。

**spec.md 應該包含**：

* 資料模型（Product / Cart / CartItem 欄位）
* API 端點（`GET /api/products` / `POST /api/cart/items` / `POST /api/checkout`）
* 商業規則（5 條合計 / 合併 / 移除 / 清空）
* 頁面行為（商品列表、購物車抽屜、結帳頁）

**容易卡的點**：學員會問「規格寫完之後呢？」——答：**每次任務都用 `@spec.md` 帶入**，這是「共識契約」的具體用法。

---

### 2-2 後端生成、TDD 先行與自主修正循環（30 mins）

**教學節奏建議**：

1. **2 mins**：TDD 三循環快講（Red → Green → Refactor）
2. **3 mins**：說明「為什麼 AI 開發特別適合 TDD」——Claude 不猜測、測試是最精確規格
3. **15 mins**：**TDD 完整實機示範**（這段是課程靈魂）
4. **5 mins**：Auto Mode 自主迴圈示範
5. **5 mins**：依 spec.md 生成後端骨架（Entity / Repo / Service / Controller / DTO）

**TDD 實機示範完整流程**：

```
Step 1: 講師輸入 TDD prompt（包含 5 個測試場景）
Step 2: Claude 產出 CartServiceTest.java（5 個 @Test）
Step 3: 講師確認測試意圖正確
Step 4: 「請開始實作 CartService 讓上述測試通過」
Step 5: 跑 mvn test → 全 RED（沒有實作）
Step 6: Claude 寫實作 → 跑 mvn test → 還有 1 個 RED
Step 7: Claude 讀錯誤訊息 → 修正 → 全 GREEN
```

**Auto Mode 教學重點**：

* 啟動：`claude --enable-auto-mode`，Shift+Tab 切到 auto
* **為什麼這裡選 Auto 而非 Bypass**：TDD 迴圈需執行 `mvn test` 與檔案修改，Auto 由分類器把關，Bypass 在本機開發環境裸奔風險過高
* 強調前提（Team / Enterprise / API + Sonnet 4.6 以上）

**容易卡的點**：學員會問「如果測試本身寫錯怎麼辦？」——回答：**先確認測試意圖再開始實作**就是為了這個。這也是 4-3 段 superpowers `verification-before-completion` 要強化的點。

---

### 2-3 前端鷹架與 API 串接（15 mins）

**教學節奏建議**：

1. **5 mins**：React + Vite 建商品列表 + 購物車抽屜
2. **5 mins**：先用 mockProducts.ts 跑 UI（避免後端干擾）
3. **5 mins**：切換串接後端 API，示範同時 `@CartController.java @cartApi.ts`

**教學決策**：先 mock 再串 API 是為了「**單變數除錯**」——如果一開始就串 API，bug 出現時不知道是前端問題還是 API 問題。

**示範 Prompt（跨層整合）**：

> 「請參考 `@CartController.java` 與 `@cartApi.ts`，把目前商品列表頁的『加入購物車』按鈕串接到後端 `POST /api/cart/items`。」

---

### 2-4 Context 管理、會話控制與真實除錯（35 mins）

> **本節是第 2 段的高潮**——除錯之所以困難，不只是「找不到 bug」，更常是「Claude 在錯誤的上下文中打轉」。本節同步教兩件事。

**教學節奏建議**：

1. **5 mins**：為什麼要管理 Context（context rot 概念）
2. **10 mins**：Context 三大操作指令（`/clear` `/compact` `/context` + MCP 隱藏成本）
3. **10 mins**：會話狀態控制（`/rewind` 五選項、`/resume` `/rename` `/fork`）
4. **10 mins**：**購物車三個真實 bug 配合 context 指令實戰**

**三個真實 bug 教學設計**：

| Bug | 教學重點 |
|---|---|
| **CORS 錯誤** | 示範「修完就 `/compact focus on cart API contract`」——避免錯誤訊息持續佔 context |
| **badge 不即時更新** | 示範「兩個小檔同時 `@`」——上下文剛好夠的場景 |
| **數量改後合計未刷新** | 示範 **`Esc Esc` → Restore code only**——Claude 走錯方向，但對話分析過 5 種可能性，砍掉太可惜 |

**容易卡的點**：

* 學員會問「`/clear` 跟 `/compact` 差在哪？」——回答：clear = 砍掉重練、compact = 壓縮成摘要、context = 只看不動
* 學員會問「`/rewind` 五個選項記不住」——強調 **Restore code only** 這個殺手級用法（保留對話脈絡只退回檔案）

**長期記憶三件套呼應第 1 段**：強調 `/memory` 超過 200 行會降遵循度、巢狀 CLAUDE.md `/compact` 後不重載。

---

## 第 3 段：自動化、Skill 與背景 Agent（75 mins）

### 3-1 agent-browser 技能：自動截圖、錄影與產生 SOP（15 mins）

**教學決策**：放在第 3 段開頭是因為「視覺衝擊力」——學員看到 Claude 自動操作瀏覽器、紅點游標跟隨、最後產出 .webm 影片，會立刻理解「Claude Code 不只能寫程式」。

**對照 Playwright MCP（第 2 段已用過）**：

* agent-browser 適合 **SOP 製作 / 教學錄影**（有錄影 + 紅點游標）
* Playwright MCP 適合 **開發中 UI 驗證**（無錄影但反應快）

**示範 Prompt（結帳流程完整錄影）**：見 syllabus 3-1。

**企業應用場景**：系統操作手冊、新人培訓、QA Bug 復現、教學影片——這四個情境都很有共鳴。

---

### 3-2 用 skill-creator 製作企業資安規範檢查 Skill（25 mins）

**教學節奏建議**：

1. **5 mins**：企業情境設定（電商資安規範三條）
2. **10 mins**：技能拆解方法（輸入 / 檢查清單 / 輸出格式 / 修正模板）
3. **8 mins**：**實機產出 `security-check.skill.md` + 立即掃 CartController.java**
4. **2 mins**：Hooks 概念（PreToolUse 自動觸發資安檢查）

**實機示範亮點**：

* 預先在 CartController 埋一個高風險寫法（例：`totalAmount` 直接接受客戶端傳入）
* 用新做的 Skill 掃描 → 預期會發現 `🔴` 高風險項目
* 現場修正 → 再掃 → 通過

**教學決策**：用「埋雷 → Skill 找雷 → 修雷 → 再驗」的閉環，比單純講「Skill 可以做什麼」更有說服力。

---

### 3-3 開發輔助技能分類導覽（15 mins）

**教學節奏建議**：

1. **8 mins**：講解技能分類表（開發輔助 / **開發紀律 superpowers** / 文件 / 前端 / 測試 / AI 整合）
2. **5 mins**：強調 **superpowers 系列定位**——預告第 4-3 會集中講
3. **2 mins**：判斷原則（什麼時候叫 Skill、什麼時候直接下 prompt）

**教學決策**：把 superpowers 列在「開發紀律」分類但只簡介，是為了**讓學員先知道「有這套東西」，到 4-3 才深入講完整管線**——避免一次塞太多。

---

### 3-4 深入講解 /agent 背景長任務（20 mins）

**教學節奏建議**：

1. **5 mins**：適合背景 Agent 的工作（假資料生成、log 分析、規格比對）
2. **10 mins**：**實機示範**（生成 30 筆台灣電商風格商品假資料）
3. **3 mins**：Git Worktrees 平行 Session
4. **2 mins**：進階觀念（不要把所有工作都丟出去）

**示範 Prompt**：見 syllabus 3-4。

**教學亮點**：

* 主線講師繼續改結帳頁面 UI
* 同時 `/agent` 在背景生成商品假資料
* 講師講完一段後切回去看 agent 進度——「**不打斷主線就能完成側翼任務**」

---

## 第 4 段：Review、程式優化與收尾（39 mins）

### 4-1 /review 與 /simplify 內建品質指令（10 mins）

**教學節奏建議**：

1. **5 mins**：`/review` 三維度（正確性 / 安全性 / 可讀性）+ 實機示範
2. **5 mins**：`/simplify` 重構精簡 + 完整收尾迴圈（review → simplify → review）

**實機示範亮點**：

* 預先在 CartService 埋兩個小問題：(a) `addItem()` 未處理 `quantity <= 0`、(b) 合計用 `float` 有精度風險
* 用 `/review @src/service/CartService.java` → Claude 應該找出兩個問題
* 現場修正 → 再 review

---

### 4-2 slash commands 完整工作流總覽（17 mins）

**教學節奏建議**：

1. **5 mins**：常用指令清單（11 個 slash commands）
2. **8 mins**：**四個經典 Context 工作流組合（A/B/C/D）**
3. **2 mins**：5 條黃金守則口訣
4. **2 mins**：收尾流程（diff → commit message → gh PR）

**四個工作流組合**：

* **A. Review-then-Rollback**：`/diff` → 不滿意 → `Esc Esc` → Restore code only
* **B. 階段交接**：完成第一階段 → `/compact focus on the API contract` → 進第二階段
* **C. Context 體檢**：`/context` → 發現 MCP 佔 40% → `/mcp` 停用 → `/context` 再確認
* **D. 跨天接續**：下班 `/rename cart-checkout-day1` + `/compact`；隔天 `/resume` 找回

**教學決策**：用「組合」而非「單一指令」呈現，是因為**指令清單背不起來，工作流組合卻能直接套用**。

---

### 4-3 superpowers：spec → TDD → e2e 完整開發控管管線（12 mins）

> **本節是第 4 段的高潮**——前面教「Claude 能做什麼」，這節教「**怎麼強迫 Claude 守紀律**」。

**教學節奏建議**：

1. **2 mins**：為什麼需要紀律技能（AI 最大風險不是寫錯，而是自信地寫錯然後說完成）
2. **3 mins**：**三條 Iron Laws**（背下來、貼牆上）
3. **4 mins**：spec → TDD → e2e → PR 8 階段對應表 + 流程圖
4. **3 mins**：實機示範（套到 CartService 完整流程）

**三條 Iron Laws（強調這是課程記憶錨點）**：

> 🔴 **Iron Law 1（TDD）**：`NO PRODUCTION CODE WITHOUT A FAILING TEST FIRST`
> 🔴 **Iron Law 2（Verification）**：`NO COMPLETION CLAIMS WITHOUT FRESH VERIFICATION EVIDENCE`
> 🔴 **Iron Law 3（Evidence）**：`Evidence before claims, always`（禁用 should / probably / seems to）

**完整管線 8 個技能**：

* `brainstorming`（發想）→ `writing-plans`（拆 2-5 分鐘 bite-sized tasks）→ `executing-plans`（一 task 一 commit）
* `test-driven-development`（Red → Green → Refactor）↔ `systematic-debugging`（強制系統化假設驗證）
* `verification-before-completion`（跑驗證指令、看真實輸出）
* `requesting-code-review`（結構化 review 請求）→ `finishing-a-development-branch`（標準 PR 收尾）

**實機示範 Prompt（Plan 文件成為審計軌跡）**：

> 「請使用 `superpowers:writing-plans`，根據 `@spec.md` 為 CartService 產出實作計畫，存到 `docs/superpowers/plans/2026-04-22-cart-service.md`。每 task 限 2-5 分鐘、一 task 一 commit、TDD 先行。」
>
> 接下來：「請使用 `superpowers:executing-plans` 執行該計畫，每 task 結束時用 `superpowers:verification-before-completion` 確認，禁止使用『should』『probably』。」

**企業價值**：Iron Laws 是**可審計契約**——當 Claude 違反時可指著 SKILL.md 追責，遠比口頭規範有效。

**容易卡的點**：

* 學員會問「superpowers 跟 `/review` `/simplify` 有什麼不同？」——回答：**superpowers 不取代它們，而是讓它們真正被執行**
* 學員會問「怎麼安裝？」——必須兩步驟：先 `/plugin marketplace add obra/superpowers-marketplace`，再 `/plugin install superpowers@superpowers-marketplace`；省略第一步會找不到 plugin。

---

## 第 5 段：Harness Engineering：你一直在做的事，現在有了名字（23 mins）

> **本節是課程的「概念整合」收尾節點**。學員前四段已接觸所有 Harness 元件，本節讓他們理解這些實踐共同構成一套完整 Harness。

### 5-1 Harness Engineering 是什麼（8 mins）

**教學節奏建議**：

1. **2 mins**：馬具比喻 + 工程定義
2. **2 mins**：關鍵數據（LangChain Terminal Bench 從 52.8% → 66.5%、OpenAI 三人五個月百萬行）
3. **3 mins**：**七種常見類型表格**（重點段）
4. **1 mins**：三個診斷問題（你的 Harness 缺哪一類？）

**七種類型強調記憶法**——每類對應一個問題：

* Context Harness = Agent **看到什麼**？
* Tool Harness = 能用什麼工具？
* Control Flow Harness = 怎麼決策？
* Verification Harness = 做對沒？
* State Harness = 記得什麼？
* Observability Harness = 在做什麼？
* Safety Harness = 不能做什麼？

加上第 8 類（進階）Multi-Agent Orchestration Harness。

---

### 5-2 課程實踐 ↔ Harness 類型對應（5 mins）

**教學決策**：用 11 行對應表把所有課程實踐映射到 7 類 Harness——讓學員一眼看到「我學的每個招式各屬於哪一類」。

**核心洞察**：

1. 你從課程第一天就在做 Harness Engineering，只是現在有了名字
2. 這堂課七大類**全部覆蓋到了**——多數團隊只實作 2-3 類就上線

---

### 5-3 三大支柱的工程意涵（5 mins）

**三大支柱**：

1. **上下文工程**（Context Engineering）：靜態 vs 動態上下文
2. **架構約束**（Architectural Constraints）：用 Hooks 機械性強制執行
3. **熵管理**（Entropy Management）：`/review` `/simplify` 防程式碼庫劣化

---

### 5-4 你的 Harness 升級路徑（5 mins）

**三層升級路徑**：

* **Level 1（30 分鐘）**：建立 CLAUDE.md
* **Level 2（1-2 天）**：新增 AGENTS.md、CI 強制架構約束
* **Level 3（1-2 週）**：死循環偵測、可觀測性 Dashboard、熵管理 Agent 排程

**陷阱提示**：

* CLAUDE.md 是 Harness 核心——把它當程式碼一樣維護
* 不要過度設計控制流——要設計成「可拆卸」的
* 從嚴格約束開始，隨 Agent 表現成熟再放寬

---

## 課程總結教學重點

**收束三層次**：

1. **一句話收束**：核心不是「AI 幫你寫更多 code」，而是「設計一條更穩定的開發工作流」
2. **四種能力**（共識 / 紀律 / 治理 / 延伸）對應段落
3. **明天就能做的三件事**（30 分鐘 CLAUDE.md / 卡住先 `/context` / 走錯按 `Esc Esc`）

**最後一句記得強調**：「Claude 會持續變強，但能拉開差距的不是『會用哪個指令』，而是『有沒有把工作流設計成可長期維護的 Harness』」——讓學員從「工具導向」轉向「方法論導向」。

---

## 為什麼這樣設計（教學決策總覽）

| 設計決策 | 原因 |
|---|---|
| **主專案改為購物車** | 領域低門檻、邏輯複雜度高、Bug 情境豐富、Skill 場景具體 |
| **Git 只講常用 5 個** | 降低入門門檻，把注意力放在 Claude 強化版控 |
| **加入 gh CLI** | 打通「寫完 → 發 PR」工作流，學員不需離開終端機 |
| **SDD 放第 1 段** | 規格先行成為課程骨幹，每個示範都有共識依據 |
| **強化 TDD + Auto Mode** | AI 開發特別需要測試先行，TDD 是最有效約束機制 |
| **Context 管理放第 2 段獨立小節** | 除錯困難不只是找不到 bug，更常是 context 失控 |
| **Permission Mode 在 1-1 + 2-2 雙重出現** | spaced reactivation：先學機制，再到實戰場景再啟動 |
| **superpowers 集中放第 4 段** | 紀律技能屬於「沉澱階段」，與 Review/收尾主題一致 |
| **Harness Engineering 收尾** | 把零散技巧升級成方法論，給學員一套可演化的心智模型 |
| **七種 Harness 分類** | 給學員回去後可用的「團隊缺口診斷工具」，而非死記分類 |

---

## 課前準備清單（講師專用）

> **註**：以下安裝指令同時提供 Windows 與 macOS 版本，講師備課時可依實機平台選用；課堂上**雙平台都示範**或至少投影對照表，避免只 demo 單一平台。

* [ ] 安裝 Claude Code、登入 Team / Enterprise / API 方案（為了 Auto Mode 示範）
  * Windows：`npm install -g @anthropic-ai/claude-code`（需 Node.js v18+）
  * macOS：`brew install claude-code` 或 `npm install -g @anthropic-ai/claude-code`
* [ ] 安裝 superpowers plugin（**跨平台共用，須兩步驟**）：先 `/plugin marketplace add obra/superpowers-marketplace`，再 `/plugin install superpowers@superpowers-marketplace`
* [ ] 安裝 agent-browser：`curl -fsSL https://cli.inference.sh | sh && infsh login`（**跨平台共用**，Windows 用 PowerShell 7+ 或 Git Bash）
* [ ] 準備 Docker Desktop 已啟動
  * Windows：[Docker Desktop for Windows](https://www.docker.com/products/docker-desktop)（需 WSL 2）
  * macOS：`brew install --cask docker` 或下載 Apple Silicon / Intel 版本
* [ ] 安裝 Java JDK 21（LTS）——後端 Spring Boot 3 必備
  * Windows：下載 Temurin JDK 21 `.msi`（adoptium.net）→ 預設安裝
  * macOS：`brew install --cask temurin@21`
  * 驗證：`java -version` 應顯示 21.x
  * Maven 不需另裝，Spring Boot 3 用 `mvnw` Wrapper
* [ ] 準備 demo repo（含初版 spec.md、CLAUDE.md 範本）
* [ ] 預先在 CartController 埋兩個 bug（quantity <= 0、float 精度），供 4-1 `/review` 示範
* [ ] 預先在 CartController 埋一個資安問題（totalAmount 接客戶端傳入），供 3-2 Skill 示範
* [ ] 準備 30 筆商品假資料 prompt（3-4 `/agent` 示範）
* [ ] 確認 Playwright MCP、firecrawl MCP 已連線
* [ ] 準備 三條 Iron Laws 投影片（4-3 段重點）
* [ ] 準備 Harness 七種類型投影片（5-1 段重點）
