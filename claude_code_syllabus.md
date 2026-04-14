# Claude Code：全端專案實作與 AI 開發工作流（3.5 小時線上錄影課大綱）

**課程定位**：講師將帶領學員以一個真實的全端專案為主線，完整展示如何把 Claude Code 放進日常開發流程。課程聚焦在版本控制、文件驅動、SDD/TDD 開發紀律、Skill 設計、背景 Agent、多模式操作與高效率除錯，讓學員學會一套可以直接搬進工作的做法。

---

## 第 1 段：Git、GitHub 與 Claude Code 起手式（50 mins）

**目標**：先建立正確的開發起手式，讓學員理解 Claude Code 不是取代版本控制，而是強化版本控制與專案治理。

### 1-1 環境安裝、登入與操作模式（15 mins）

* **Claude Code 安裝與登入**：

  * 示範 Windows PowerShell 7+ 安裝方式與 `claude doctor` 健檢。
  * 介紹 `/login`、模型切換與基本指令：`@` 參照檔案、`/help`、`/init`。
* **訂閱方案與費用**：

  | 方案            | 定位         | Claude Code 預設模型 | 備註                    |
  | --------------- | ------------ | -------------------- | ----------------------- |
  | Pro             | 個人開發者   | Sonnet 4.6           | 含 Claude Code 基本用量 |
  | Max 5x / 20x    | 重度個人用戶 | Opus 4.6             | 用量為 Pro 的 5x / 20x  |
  | Team Standard   | 團隊協作     | Sonnet 4.6           | 含管理控制台            |
  | Team Premium    | 團隊重度使用 | Opus 4.6（預設）     | Opus 1M 上下文已含      |
  | Enterprise      | 企業合規     | Opus 4.6（可設定）   | SSO、自訂政策、合規 API |
  | API（按量付費） | 開發者整合   | 自選                 | 依 token 計費           |


  * **API 用量成本**：平均約 **$6／開發者／天**，90% 使用者每日低於 $12；月平均 **$100–200／人**（使用 Sonnet 4.6）。
  * **額度重置規則**：達到用量上限後，**每 5 小時重置一次**（非固定時間點）。超出部份可開啟「Extra Usage」以 API 計費延續使用，每日上限 $2,000。
* **可用模型與選擇策略**：

  | 別名                          | 對應模型                   | 適合場景               |
  | ----------------------------- | -------------------------- | ---------------------- |
  | `sonnet`                    | Claude Sonnet 4.6          | 日常編程（性價比最高） |
  | `opus`                      | Claude Opus 4.6            | 複雜架構決策、多步推理 |
  | `haiku`                     | Claude Haiku 4.5           | 簡單子任務、Agent 分工 |
  | `opusplan`                  | 規劃用 Opus，執行切 Sonnet | 大型任務兼顧品質與成本 |
  | `sonnet[1m]` / `opus[1m]` | 同上 + 100 萬 token 上下文 | 超大型程式碼庫         |


  * **模型切換**：session 中用 `/model <別名>`，啟動時用 `--model <別名>`，或在 `/config` 設定預設。
  * **Effort 等級**：`/effort low/medium/high/max` 調整推理深度，預設 `medium`；提示詞中加 `ultrathink` 可單次觸發 high effort。
* **VS Code 插件 vs CLI 模式差異**：

  | 面向       | VS Code 插件              | CLI（Terminal）    |
  | ---------- | ------------------------- | ------------------ |
  | 啟動方式   | 側邊欄面板 / Ctrl+Shift+C | `claude` 指令    |
  | 檔案參照   | 自動感知當前開啟檔案      | 需明確 `@` 參照  |
  | 適合場景   | UI 開發、邊寫邊問         | 自動化任務、長流程 |
  | 上下文感知 | 與編輯器同步              | 從終端機角度操作   |
* **五種權限／操作模式**（VS Code 插件選單 + CLI 對應）：

  | 模式     | VS Code 名稱       | CLI 對應                                                                         | 說明                                                                                                                                 |
  | -------- | ------------------ | -------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
  | 逐步確認 | Ask before edits   | 預設互動模式（`default`）                                                      | 每次編輯前詢問，適合探索與學習                                                                                                       |
  | 自動編輯 | Edit automatically | `--permission-mode acceptEdits`                                                | 自動接受檔案編輯，不需手動確認每次修改                                                                                               |
  | 規劃模式 | Plan mode          | `--permission-mode plan`                                                       | 只讀不寫：探索程式碼、提出計畫，再切換模式執行；session 內可用 `/plan` 前綴觸發                                                    |
  | 自動模式 | Auto mode          | `--permission-mode auto --enable-auto-mode`                                    | 由背景 classifier 模型審核每個操作，合法才自動執行，無需手動確認；**需 Team / Enterprise / API 方案 + Sonnet 4.6 或 Opus 4.6** |
  | 全開模式 | Bypass permissions | `--permission-mode bypassPermissions`（或 `--dangerously-skip-permissions`） | 跳過所有權限提示，適合已隔離的容器／CI 環境，**需謹慎使用**                                                                    |


  > **如何開啟 Auto 與 Bypass 模式**
  >
  > * **VS Code**：在擴充套件設定中勾選「**Allow dangerously skip permissions**」，兩個模式才會出現在底部模式選單中。
  > * **CLI**：Auto 需加 `--enable-auto-mode`（且須符合方案與模型要求）；Bypass 可直接用 `--permission-mode bypassPermissions`。
  > * **Session 中切換**：按 `Shift+Tab` 循環切換模式（Auto 需在啟動時帶 `--enable-auto-mode` 才會出現在循環中）。
  >

  * **`--print` 非互動模式**：`claude -p "..."` 單次輸出後退出，適合腳本整合與管道操作（獨立於上述權限模式之外）。

### 1-2 Git 常用操作與 gh CLI 協作模式（20 mins）

* **Git 常用 5 個操作**：

  * `git status`、`git add`、`git commit`、`git push`、`git pull` 的實務用途。
  * 不深入原理，直接示範 Claude Code 如何幫你寫 commit message、整理 diff、決定 staging 範圍。
  * 核心觀念：讓 AI 成為你最強的 Git 協作者，而不是取代版控紀律。
* **gh CLI 工作流**（GitHub CLI）：

  * `gh repo create` — 從終端機建立遠端 repo，不需開瀏覽器。
  * `gh issue list` / `gh issue view [號碼]` — 查看 issue，讓 Claude 讀 issue 內容後直接開發。
  * `gh pr create` — 發出 PR，搭配 Claude 自動生成 PR title 與 body。
  * `gh pr status` / `gh pr checks` — 追蹤 CI 狀態。
  * 完整示範：Claude Code 寫完功能 → `gh pr create` 一鍵發出完整 PR。

### 1-3 SDD 文件驅動開發與課程主專案設定（15 mins）

* **什麼是 SDD（Specification-Driven Development）**：

  * 先寫規格、再寫程式的開發紀律。
  * 規格不是給人看的文件，而是「你與 Claude 的共識契約」。
* **Claude Code 的 SDD 做法**：

  1. 用自然語言描述需求 → 讓 Claude 產出 `spec.md`（含資料模型、API 端點、頁面行為）。
  2. 與 Claude 確認規格細節，達成共識後才開始開發。
  3. 每次任務前 `@spec.md` 讓 Claude 取得完整上下文，不重複解釋。
  4. 規格變更時先更新 `spec.md`，再讓 Claude 依新規格調整程式。
* **CLAUDE.md 進階設定**：

  * 說明 `CLAUDE.md` 除了文字規則，還能宣告 MCP server、設定 Hooks。
  * 示範加入 playwright MCP server 設定，為後續測試段落鋪墊。
  * **Harness 視角**：`CLAUDE.md` 不只是「備忘錄」，它是 Harness 的靜態上下文核心——Agent 存取不到的資訊對它等於不存在。養成「把共識寫進 `CLAUDE.md`」的習慣，就是在建造你的第一層 Harness。
* **主專案情境**：

  * 本課實作一個**購物車系統（Shopping Cart）**，涵蓋商品瀏覽、加入購物車、數量管理與結帳表單，後續所有範例（SDD、TDD、Playwright、Skill、Agent）都圍繞這條主線展開。
  * 核心實體：`Product`（商品）、`Cart`（購物車）、`CartItem`（購物車明細）。
  * **SDD 示範 Prompt**：「請根據以下需求產出 `spec.md`：使用者可瀏覽商品並加入購物車；加入相同商品自動合併數量；數量改為 0 則自動移除；購物車合計由伺服器計算；結帳時填收件資料後清空購物車。請先只產出規格，不要寫程式。」

---

## 第 2 段：全端主線實作（75 mins）

**目標**：用全端專案實作展示 Claude Code 如何參與設計、撰寫、測試、修正與整合，而不是只做片段生成。

### 2-1 後端生成、TDD 先行與自主修正循環（25 mins）

* **TDD 概念（2 分鐘快講）**：

  * Red → Green → Refactor 三循環的實際意義。
  * 為什麼 AI 開發特別適合 TDD：Claude 不「猜測」需求，測試就是最精確的規格說明。
* **Claude Code 的 TDD 做法**：

  * Prompt 範本：「請先針對 `CartService` 的購物車邏輯撰寫 JUnit 5 測試，**不要實作**，等我確認後再開始。測試場景包含：(1) 加入新商品 → 新增一筆 CartItem；(2) 加入相同商品 → 已有的 CartItem 數量 +1，不重複新增；(3) 數量改為 0 → 自動移除；(4) 合計計算正確；(5) 結帳後購物車清空。」
  * 確認測試意圖後，下指令開始實作 → 執行 `mvn test` → 看到 RED。
  * 示範 Claude 讀錯誤 → 修正程式 → 再次執行直到全部 GREEN 的完整閉環。
  * 搭配 Auto Mode：讓 Claude 自主跑完「測試 → 修正 → 再測試」迴圈，不需每步確認。
* **根據 spec.md 生成後端骨架**：

  * 建立 Spring Boot 3 專案、`Product` / `Cart` / `CartItem` Entity、Repository、`CartService`、`ProductController` / `CartController` 與 DTO。

### 2-2 前端鷹架、API 串接與 Playwright 畫面驗證（25 mins）

* **建立前端主畫面**：

  * 以 React + Vite 建立商品列表頁（分類篩選 + 商品卡片）、購物車抽屜（CartDrawer）與結帳頁。
  * 先以 `mockProducts.ts` 假資料跑起 UI，確認視覺層後再切換串接 API。
  * 展示如何讓 Claude 配合 `spec.md` 快速落 UI，而不是隨意生成。
* **前後端整合**：

  * 將假資料改為串接 Spring Boot API（`GET /api/products`、`POST /api/cart/items`）。
  * 示範同時 `@CartController.java @cartApi.ts`，讓 Claude 一次理解串接上下文。
* **Playwright MCP 畫面驗證**：

  * 下指令：「請用 playwright 打開 localhost:5173：驗證商品列表有至少 6 筆；點擊『加入購物車』後導覽列 badge 從 0 變為 1；再點同一商品，badge 變為 2（數量合併而非兩筆）。」
  * Claude 呼叫 `browser_snapshot`（無障礙樹）分析頁面結構 → 回報結果或發現 bug。
  * 說明為何 `browser_snapshot` 比截圖更適合 Claude 理解頁面（可讀結構，非像素）。
  * 進階：讓 Claude 寫 Playwright E2E 測試腳本（加入購物車 badge 更新驗證），納入 CI 管道。

### 2-3 真實除錯與上下文管理（25 mins）

* **購物車三個真實整合錯誤**（按出現順序）：

  * **CORS 錯誤**：React 呼叫 Spring Boot API 時 console 出現紅字 → `/bug` 模式切入，Claude 分析並修正 `WebMvcConfigurer`。
  * **badge 不即時更新**：加入購物車後數字沒變，reload 才對 → 同時 `@CartContext.tsx @CartBadge.tsx` 讓 Claude 找到 state 未正確更新的根因。
  * **數量修改後合計未刷新**：拉動 `-` `+` 後小計沒變 → `/rewind` 回退，重新用正確方式更新 CartContext。
* **Slash Commands 實戰**：

  * `/bug`：切出專門除錯上下文，讓 Claude 聚焦。
  * `/rewind`：當探索方向錯了，快速回退。
  * `/compact`：修完問題後壓縮長對話，避免 context 被雜訊吃掉。
* **關鍵觀念**：

  * slash commands 的價值不在「知道名稱」，而在「知道什麼時機切換工作模式」。

---

## 第 3 段：企業 Skill、輔助技能與背景 Agent（60 mins）

**目標**：讓學員看到 Claude Code 不只會寫程式，還能把規則、研究與長任務轉成可重用工作流。

### 3-1 用 `skill-creator` 製作企業資安規範檢查 Skill（25 mins）

* **企業情境設定**：

  * 假設團隊有一套電商資安規範：禁止硬編碼敏感資訊、購物車合計不可由客戶端傳入、結帳端點必須驗證身份。
* **技能拆解方法**：

  * 示範如何把規範整理成 Skill 的輸入、檢查清單、輸出格式與建議修正模板。
* **實機展示**：

  * 讓 Claude 協助產出 `security-check.skill.md`（購物車電商版）：檢查項目包含 session ID 是否可被偽造、`totalAmount` 是否防止客戶端傳入、`/checkout` 是否有收件資料驗證。用此 Skill 立即掃描 `CartController.java`，預計發現 `🔴` 高風險項目後現場修正。
* **Hooks 概念（搭配說明）**：

  * 介紹 `PreToolUse` / `PostToolUse` hook 的應用場景，例如：寫入檔案前自動觸發資安檢查。

### 3-2 開發輔助技能分類導覽（15 mins）

| 類別     | 技能                                | 使用時機                                         |
| -------- | ----------------------------------- | ------------------------------------------------ |
| 開發輔助 | `skill-creator`                   | 把重複流程固化成可重用工具                       |
| 開發輔助 | `firecrawl`                       | 爬文件、查最新 API、補充 Claude 知識截止後的資料 |
| 文件     | `docx`                            | 產出規格文件、結案報告                           |
| 文件     | `pdf`                             | 閱讀與摘要 PDF 規格書或技術文件                  |
| 前端     | `reactcomponents`                 | 快速生成符合專案風格的 React 元件                |
| 前端     | `web-perf`                        | 效能分析與優化建議                               |
| 測試     | `webapp-testing` + Playwright MCP | UI 自動化驗證、E2E 測試、瀏覽器自動化控制        |
| AI 整合  | `claude-api`                      | 在應用程式中呼叫 Claude API，實作 AI 功能        |
| AI 整合  | `agents-sdk`                      | 建立多代理工作流，協同多個 Agent 完成複雜任務    |

* **判斷原則**：何時「叫 Skill」vs 何時「直接下 prompt」——Skill 適合有固定流程、需重複使用的任務。

### 3-3 深入講解 `/agent` 背景長任務（20 mins）

* **適合交給背景 Agent 的工作**：

  * 假資料生成、資料清理、大量網頁搜尋、log 分析、規格比對。
* **不干擾主線的工作法**：

  * 示範 Prompt：「/agent：請按照 @spec.md 的 Product 資料模型，生成 30 筆符合台灣電商風格的商品假資料（3C / 服飾 / 食品各 10 筆），name 與 description 要像真實電商文案，輸出到 `src/test/resources/seed-products.json`，並產出 `DataInitializer.java` 在啟動時自動載入，完成後回報筆數。」
  * Agent 在背景執行時，主線繼續改結帳頁面 UI，互不干擾。
  * 說明如何定義任務邊界（不得修改 `CartService`）、預期輸出格式與回報格式。
* **Git Worktrees 與平行 Session**：

  * 介紹 git worktree 讓多個 Agent 在不同分支同時工作，互不干擾。
  * 適合場景：主線 Agent 繼續改購物車 UI，另一個 Agent 在 `feature/coupon` 分支開發優惠券功能。
* **進階觀念**：

  * `/agent` 的價值是把耗時與高噪音工作切出去，而不是把所有工作都丟出去。

---

## 第 4 段：Review、程式優化與收尾（25 mins）

**目標**：建立一套寫完程式後的自我審查與優化流程，讓 Claude Code 變成可長期維護的工程夥伴。

### 4-1 `/review` 與 `/simplify` 內建品質指令（10 mins）

* **`/review`（程式碼審查）**：

  * 觸發時機：完成一段功能後、提交 PR 前。
  * 三個審查維度：**正確性**（邏輯 bug、邊界條件）、**安全性**（輸入驗證、注入風險）、**可讀性**（命名、結構）。
  * 進階用法：`/review @src/service/CartService.java` 針對特定檔案審查；課程示範 Claude 找出「`addItem()` 未處理 `quantity <= 0` 輸入」與「合計使用 `float` 有精度風險」兩個問題。
  * 展示：Claude 給出 review 結果後，如何用 follow-up prompt 追問細節或直接要求修正。
* **`/simplify`（重構精簡）**：

  * 觸發時機：功能通過測試後，進行重構階段。
  * Claude 會找出：過度設計的抽象、重複代碼、可合併的判斷條件。
  * 強調：`/simplify` 不改邏輯，只改結構，配合 TDD 確保重構後測試仍通過。
  * 示範完整收尾迴圈：`/review` → `/simplify` → 再 `/review` → 確認無誤。

### 4-2 slash commands 完整工作流總覽（15 mins）

* **常用指令與最佳時機**（依開發工作流順序）：

  * `/init`：在專案一開始定義規則與技術棧。
  * `/plan`：大任務開始前讓 Claude 先規劃，避免直接亂改。
  * `/review`：品質把關，PR 前必跑。
  * `/simplify`：功能完成後的重構精簡。
  * `/bug`：聚焦抓 bug，切換除錯上下文。
  * `/compact`：長任務中段或除錯後壓縮上下文。
  * `/clear`：開始新任務前清空脈絡。
  * `/rewind`：當推理走偏時快速回退。
* **收尾流程**：

  * 讓 Claude 整理 diff、生成 commit message。
  * 搭配 `gh pr create` 發出 PR，Claude 自動生成 PR 說明（含本次購物車功能的改動摘要）。
  * 回顧整堂課的工作流：規格（SDD `spec.md`）→ 開發（TDD `CartService`）→ 測試（Playwright badge 驗證）→ 假資料（`/agent` 生成商品）→ review / simplify → 版本控制（gh）。

---

## 第 5 段：Harness Engineering：你一直在做的事，現在有了名字（20 mins）

> **本節定位**：這是課程的「概念整合」收尾節點。學員在前四段已接觸 CLAUDE.md、Hooks、/agent、Git Worktrees、TDD 迴圈、/review 與 /simplify——本節幫助他們理解這些實踐共同構成一套 Harness，並提供升級 Harness 的心智模型。

### 5-1 Harness Engineering 是什麼（5 mins）

* 馬具比喻：AI 模型是千里馬，Harness 是韁繩、馬鞍、車轅的整套配備——把馬的力量引導成生產力。
* 工程定義：**圍繞 Agent 的執行與治理層**，包含工具協調、狀態管理、權限邊界、錯誤恢復、可觀測性與人類審批閘門。
* 關鍵數據：LangChain 在不換模型的情況下只優化 Harness，Agent 在 Terminal Bench 2.0 的得分從 52.8% 躍升至 66.5%；OpenAI 三人團隊靠 Harness Engineering 在五個月內交付 100 萬行生產程式碼。

### 5-2 課程實踐 ↔ Harness 對應（5 mins）

| 課程中做過的事 | 對應的 Harness 組件 |
| --- | --- |
| `CLAUDE.md`（「合計伺服器計算」「合併不重複」）、`spec.md` | 靜態上下文層（Single Source of Truth） |
| JUnit TDD 迴圈（CartService 合計 / 合併 / 清空測試） | 錯誤恢復與回饋迴路 |
| `PreToolUse` Hook 觸發 `security-check` Skill | 架構約束與自動驗證閘門 |
| `/agent` 生成 30 筆商品假資料 + Git Worktrees | 工具協調層、並行 Agent 隔離 |
| Playwright MCP 驗證購物車 badge 更新 | 可觀測性與自動化驗收 |
| `/review` + `/simplify` CartService | 熵管理（防止程式碼庫劣化） |
| Plan Mode → 確認 spec.md → 實作 | Human-in-the-Loop 檢查點 |

> **核心洞察**：你從課程第一天就在做 Harness Engineering，只是現在有了名字與框架。

### 5-3 三大支柱的工程意涵（5 mins）

1. **上下文工程（Context Engineering）**：`CLAUDE.md` 是靜態上下文；CI 測試結果、日誌、其他 Agent 進度是動態上下文。Agent 存取不到的資訊等於不存在——文件必須住在 repo 裡。
2. **架構約束（Architectural Constraints）**：越多約束，決策疲勞越少，Token 利用率越高。用 Hooks 把約束機械性強制執行，而不是靠「善意」。
3. **熵管理（Entropy Management）**：AI 生成的程式碼庫會隨時間劣化（文件與程式碼不一致、命名風格混亂）。定期用 `/review`、`/simplify` 或排程 Agent 執行「清理迴圈」。

### 5-4 你的 Harness 升級路徑（5 mins）

| 層級 | 時間 | 核心工作 |
| --- | --- | --- |
| **Level 1（今天就能做）** | 30 分鐘 | 建立 `CLAUDE.md`，寫清架構規範、禁止動作、命名規則，設定 pre-commit hook 執行 lint + test |
| **Level 2（1-2 天）** | 1-2 天 | 新增 `AGENTS.md`（團隊級約定），CI 強制架構約束，定義 Agent 生成 PR 的審查清單 |
| **Level 3（生產級）** | 1-2 週 | 死循環偵測中間件、可觀測性 Dashboard、熵管理 Agent 排程、Harness A/B 測試 |

* **陷阱提示**：
  * `CLAUDE.md` 是 Harness 核心——每次 Agent 犯錯，就更新它，把它當程式碼一樣維護。
  * 不要過度設計控制流：Harness 要設計成「可拆卸」的，當模型變聰明後能輕鬆移除不必要的控制邏輯。
  * 從嚴格約束開始，隨著 Agent 表現成熟再放寬，而不是反過來。

---

## 課程總結

* 這堂課的核心不是「AI 幫你寫更多 code」，而是「你如何設計一條更穩定的開發工作流」。
* 學員結束後應具備：
  * 用 SDD 規格先行、TDD 測試驅動，配合 Claude Code 推進全端專案的能力。
  * 把規則轉成 Skill、把長任務丟給 `/agent` 的能力。
  * 用 Playwright MCP 讓 Claude 自主驗證 UI 的能力。
  * 在版本控制（git + gh）、review（`/review` + `/simplify`）與 slash commands 上建立更成熟工作習慣的能力。
