# Harness Engineering：AI Agent 時代的新興工程學科

**— 從提示工程到系統治理的典範轉移**

---

> **摘要**
>
> 隨著 AI Agent 技術的成熟，僅靠提升模型能力已無法解決生產環境中的可靠性問題。2025 年末至 2026 年初，OpenAI、Anthropic 等頭部機構相繼提出「Harness Engineering（驾馭工程）」概念，標誌著 AI 工程實踐進入新階段。本文彙整多方技術文獻，系統性地探討 Harness Engineering 的定義、核心架構、主要支柱、業界實踐案例、與鄰接學科的關係，以及對未來軟體工程職能的深遠影響，旨在為工程師提供理解並落地這一新興學科的完整參考。

---

## 目錄

1. 前言：為何 Harness Engineering 在 2026 年突然崛起
2. 核心定義：什麼是 Harness Engineering
3. 根本問題：沒有 Harness，AI Agent 為何失控
4. 概念辨析：Harness 與相關概念的關係
5. 三大支柱：Harness Engineering 的核心架構
6. 六大組件：成熟 Harness 的完整構成
7. 業界實踐：大廠如何落地 Harness Engineering
8. 構建指南：從零打造你的第一個 Agent Harness
9. 工具生態：2026 年主流框架與平台
10. 與鄰接學科的比較
11. 工程師角色的典範轉移
12. 常見陷阱與血淚教訓
13. 結論
14. 參考文獻

---

## 一、前言：為何 Harness Engineering 在 2026 年突然崛起

2025 年下半年，一個現象悄然發生：各主流模型（GPT-4.5、Claude 3.5、Gemini 2.0）在程式設計任務上的表現差距越來越小，**模型本身正在成為大宗商品**。與此同時，工程師發現提升 prompt 品質的邊際效益也在遞減。

真正的分水嶺出現在兩個節點：

- **2025 年 11 月**：Anthropic 公開討論「長時間運行 Agent 的有效 Harness」，核心問題是跨多個 context window 的任務連續性。
- **2026 年 2 月**：OpenAI 發布《Harness Engineering: Leveraging Codex in an Agent-First World》，揭露一個震驚業界的事實——三名工程師，五個月，**100 萬行程式碼**，沒有一行是人手寫的。生產環境已在運行，持續迭代中。

![OpenAI Codex 案例](https://developer.qcloudimg.com/http-save/yehe-1055266/084eab22c782e2ee6003c33af4208be6.png)
*圖 1：OpenAI Codex 團隊利用 Harness Engineering 達成的生產成果*

幾天後，HashiCorp 聯合創始人 Mitchell Hashimoto 在自己的文章中也將某一工程階段直接命名為「Engineer the Harness」。業界共識逐漸清晰：

> **2025 年大家比的是模型和 prompt；2026 年真正拉開差距的，是模型外面的系統設計。**

---

## 二、核心定義：什麼是 Harness Engineering

### 2.1 詞源與比喻

「Harness」一詞源自馬術裝備——韁繩、馬鞍、車轅的整套配件。這個比喻極為精準：

> 馬強大而快速，但若沒有韁繩與馬鞍，它只會隨心所欲地奔跑。AI 模型就是那匹馬。Harness 是將其力量轉化為生產力的一切。工程師則是提供方向的騎手。

![馬具比喻](https://developer.qcloudimg.com/http-save/yehe-1055266/e80e14ac3ce87187eac2baa53154b20d.png)
*圖 2：Harness 的馬具比喻——將 AI 原始能力引導為可靠生產力*

### 2.2 技術定義

**Harness Engineering** 是一門設計系統、約束和回饋迴路的學科，這些元素圍繞著 AI Agent，使其在生產環境中保持可靠。

一個更工程化的定義（Salesforce）：

> **Harness = 圍繞 LLM/Agent 的執行與治理層（Operational Software Layer）**，負責管理 AI 的工具、記憶體與安全，從而讓自主任務執行更可靠。

Martin Fowler 則將其定義為：用於約束 AI Agent 的工具和實踐，但其範圍遠不止安全性——**設計良好的 Harness 不僅防止 Agent 出錯，還能透過在正確時機提供正確的 context、工具和約束，使其更具能力。**

OpenAI 的工程定義更具體：在 Codex 體系中，Harness 包含 **核心 Agent loop + 執行邏輯 + 客戶端/Runtime 整合**；它不是單次對話，而是能驅動工具調用、狀態流轉、事件流、客戶端互動的長期運行系統。

---

## 三、根本問題：沒有 Harness，AI Agent 為何失控

裸模型（Raw LLM）有四大硬傷，導致其在生產環境無法直接使用：

| 硬傷 | 具體表現 | Harness 如何補救 |
|------|---------|----------------|
| **無記憶** | 會話之間不保留狀態，每次從零開始 | 持久化狀態管理、檢查點機制 |
| **自信的錯誤** | 不說「不知道」，產出看似合理但錯誤的輸出 | 驗證迴路、自我檢查機制 |
| **無邊界工具存取** | 可能刪除文件、覆蓋資料庫、洩漏 credentials | 權限邊界、沙箱隔離 |
| **規模放大錯誤** | 十個 Agent 並行的連鎖失敗幾乎無法 debug | 可觀測性層、熵管理機制 |

此外，Anthropic 的研究指出：跨多個 context window 工作的長時間任務，每次新會話就像「新工程師接班」——**沒有任何前情記憶**。沒有 Harness 管理這種跨會話的連續性，Agent 無法勝任複雜的長期任務。

---

## 四、概念辨析：Harness 與相關概念的關係

這是理解 Harness 最容易混淆的部分：

### 4.1 Harness 不是 Prompt

Prompt 只是給模型的文字說明（單輪輸入品質）。

Harness 負責的是：什麼時候給什麼 prompt、何時壓縮 context、何時調用工具、失敗後如何恢復、哪些動作需要人類審批。

> 若說 prompt engineering 是「右轉」這個指令，那麼 harness engineering 就是道路、護欄、標誌和交通系統，允許十輛車同時安全行駛。

### 4.2 三種工程典範的演進

```
Prompt Engineering   →  教模型這一輪怎麼答
Context Engineering  →  給模型這一輪喂什麼上下文
Harness Engineering  →  設計整個系統，讓模型在很多輪、很多工具、很長時間裡都能穩定完成任務
```

![三種工程典範演進](https://i-blog.csdnimg.cn/img_convert/ca5d5bb964a44a1a66be1c922f073985.jpeg)
*圖 3：從 Prompt Engineering 到 Harness Engineering 的演進脈絡*

### 4.3 Harness 不等於 Agent

Agent 通常指「會規劃、會調用工具、會迭代執行」的智能體行為。  
Harness 則是 **Agent 背後的基礎設施**——它不是 Agent 本身，而是管理 Agent 如何運作的完整環境。

### 4.4 Harness 不等於 Framework

框架是「開發工具箱」；Harness 是「真正跑在線上的運行環境」。  
Salesforce 明確區分：framework 提供構建 Agent 的函式庫，harness 是現實世界中約束、管理和運行 Agent 的實際 runtime system。

### 4.5 Harness 也不只是 Workflow

Workflow 是流程；Harness 不僅管流程，還管**狀態、記憶體、權限、恢復、驗證、日誌、審批、客戶端協議**。

---

## 五、三大支柱：Harness Engineering 的核心架構

根據 OpenAI 的官方框架，Harness Engineering 由三大支柱支撐：

![三大支柱](https://developer.qcloudimg.com/http-save/yehe-1055266/22743f6bf9337b205f3796972c5e075f.png)
*圖 4：Harness Engineering 三大支柱*

### 5.1 支柱一：上下文工程（Context Engineering）

**核心原則：Agent 應當恰好獲得當前任務所需的上下文，不多不少。**

![上下文工程](https://developer.qcloudimg.com/http-save/yehe-1055266/bb38991d1c29f585d664488351020e72.png)
*圖 5：靜態與動態上下文的雙層設計*

#### 靜態上下文（寫進程式碼庫的）
- `AGENTS.md` 或 `CLAUDE.md` 文件（類似 README，但專門給 AI 看的「入職培訓手冊」）
- 架構規範文件
- API 契約
- 程式碼風格指南

#### 動態上下文（運行時提供的）
- 啟動時自動掃描並映射目錄結構
- 即時日誌、指標、鏈路追蹤數據
- CI/CD 流水線狀態和測試結果
- 其他 Agent 的工作進度

#### 關鍵洞察

> **從 Agent 的視角看：任何它在上下文中存取不到的資訊，就等於不存在。**  
> 寫在 Confluence 裡的文件？不存在。Slack 裡的討論？不存在。  
> **程式碼庫必須是唯一的真相源（Single Source of Truth）。**

---

### 5.2 支柱二：架構約束（Architectural Constraints）

**這是 Harness Engineering 最反直覺的部分：限制越多，效率越高。**

![架構約束](https://developer.qcloudimg.com/http-save/yehe-1055266/67f3637ca7de37ad18b8d19af9be6368.png)
*圖 6：分層架構約束示意——每一層只能依賴左側層級*

典型規則：
- 每一層只能 import 相鄰的層
- 絕對不能跨層調用
- 不能循環依賴

這些規則透過以下機制**機械性強制執行**：
- **確定性 Linter**：自訂規則，自動檢查違規
- **LLM 審計員**：專門有個 Agent 審查其他 Agent 的程式碼
- **結構性測試**：類似 ArchUnit，針對 AI 生成的程式碼
- **Pre-commit Hook**：程式碼提交前自動檢查

#### 為何約束反而提高效率？

**場景 A（無約束）**：Agent 接到任務「實現一個用戶服務」  
→ 它要思考：放哪個目錄？依賴哪些模組？用什麼命名規範？  
→ 花了 30% 的 token 在探索可能性上

**場景 B（強約束）**：同樣的任務  
→ 架構明確規定：Service 層，依賴 Repo 和 Config，遵循 XX 命名規範  
→ 100% 的 token 都用在解決問題上

> **約束不是限制創造力，是消除決策疲勞。**

OpenAI 的 Codex 團隊亦印證：當 Agent 在由 linter 和 validator 強制執行的嚴格架構邊界內運作時，表現會顯著提升。

---

### 5.3 支柱三：熵管理（Entropy Management）

**這是最容易被忽視、但最重要的部分。**

#### 什麼是熵？

AI 生成的程式碼庫會隨時間積累「混亂」：
- 文件和程式碼不一致
- 命名風格越來越不統一
- 死程式碼越積越多
- 架構約束被悄悄打破

若不管理，程式碼庫會迅速劣化。

![熵管理](https://developer.qcloudimg.com/http-save/yehe-1055266/73809c18b37d650d3ed6486d429ecba5.png)
*圖 7：定期運行清理 Agent 的熵管理機制*

#### 如何管理？

定期運行專門的「清理 Agent」：

| 清理 Agent 類型 | 執行頻率 | 任務內容 |
|---------------|---------|---------|
| 文件一致性 Agent | 每天凌晨 2 點 | 掃描文件是否匹配當前程式碼 |
| 約束違規掃描 Agent | 每週 | 找出繞過檢查的漏網之魚 |
| 模式執行 Agent | 事件觸發 | 發現並修復不符合設計模式的程式碼 |
| 依賴審計 Agent | 每週 | 追蹤並清理循環依賴和多餘依賴 |

---

## 六、六大組件：成熟 Harness 的完整構成

結合 OpenAI、Anthropic、Salesforce 的公開工程文章，一個成熟的 Harness 包含以下六層：

```
┌─────────────────────────────────────────────┐
│              Human Approval Layer            │  ← 人類審批閘門
├─────────────────────────────────────────────┤
│           Observability & Logging            │  ← 可觀測性層
├─────────────────────────────────────────────┤
│         Safety / Permissions Wrapper         │  ← 安全與權限
├─────────────────────────────────────────────┤
│           Memory / State Manager             │  ← 記憶體與狀態
├─────────────────────────────────────────────┤
│              Tool Layer                      │  ← 工具協調層
├─────────────────────────────────────────────┤
│              Agent Loop                      │  ← 核心執行迴路
└─────────────────────────────────────────────┘
```

### 6.1 Agent Loop（核心執行迴路）
「用戶輸入 → 模型思考 → 請求工具 → 執行工具 → 觀察結果 → 再思考 → 輸出」的循環。OpenAI 將此稱為 Codex 的核心邏輯。

### 6.2 Tool Layer（工具協調層）
給模型接上 shell、程式碼編輯器、瀏覽器、資料庫、API、文件系統等能力，並校驗工具調用是否合法。沒有這層，模型只能聊天。

### 6.3 Memory / State（記憶體與狀態管理）
保存中間狀態、任務進度、摘要、待辦、檢查點。這是解決長任務「做著做著就忘了」的關鍵。Anthropic 明確指出：跨 context window 工作的 Agent 必須彌補「新會話沒有前情記憶」的問題。

### 6.4 Safety / Permissions（安全與權限邊界）
限制模型能存取什麼、能改什麼、什麼動作必須審批、如何過濾輸入輸出。Salesforce 直接將 Harness 描述為模型的 security wrapper。

### 6.5 Lifecycle / Recovery（生命週期與恢復）
任務崩潰後能否續跑，重啟後能否接著執行，長任務能否跨小時甚至跨天繼續。這是生產環境可靠性的底線保障。

### 6.6 Client / Runtime Integration（客戶端整合）
在產品化場景中，Harness 還要對接 CLI、IDE、Web、後台容器。OpenAI 的 Codex App Server 就是將 Harness 以穩定協議暴露給不同客戶端。

---

## 七、業界實踐：大廠如何落地 Harness Engineering

### 7.1 OpenAI：零人工程式碼模式

OpenAI 的 Codex 團隊建立了一個超過百萬行程式碼的生產應用，其 Harness 核心組件包括：

- **AGENTS.md 文件**：機器可讀的指令，告訴 Agent 如何在 repository 中工作——運行什麼指令、遵循什麼規範、使用什麼模式
- **可重複的開發環境**：具有一鍵啟動和每個 worktree 隔離功能，防止跨任務污染
- **CI 中的機械不變量**：在每個邊緣強制執行架構邊界、格式化規則和資料驗證

工程師角色的完整轉型：

| 傳統工程師 | Harness 工程師 |
|-----------|--------------|
| 寫程式碼 | 從不寫程式碼 |
| 偶爾設計架構 | 主要工作就是設計架構 |
| 最後補文件 | 文件是核心基礎設施 |
| 審查程式碼 | 審查 Agent 輸出 + 評估 Harness 效果 |
| 調試程式碼 | 分析 Agent 行為模式 |
| 寫測試 | 設計測試策略，Agent 執行 |

### 7.2 Stripe：規模化「小跟班」

Stripe 內部的程式設計 Agent 名為 **Minions**，每週產生 **1000+ 合併的 PR**。

工作流程：
1. 開發者在 Slack 發任務
2. Minion 寫程式碼
3. Minion 跑 CI
4. Minion 開 PR
5. 人類審查並合併

**第 1 步和第 5 步之間，完全不需要人類參與。** Harness 處理了一切：測試、CI、程式碼風格、文件更新。

### 7.3 LangChain：中間件優先策略

LangChain 最具說服力的是一個量化成果：

> 在 Terminal Bench 2.0 排行榜上，LangChain 的程式設計 Agent：
> - **優化前**：52.8% 得分，排名 Top 30
> - **優化後**：66.5% 得分，排名 Top 5
> - **做了什麼？模型沒換。** 只優化了 Harness。

具體優化措施：
- 加入「完成前檢查清單」中間件
- 啟動時自動映射目錄結構
- 實現死循環偵測機制
- 優化推理資源的分配策略

這個案例完美說明：**同樣的模型，不同的 Harness，天壤之別的結果。**

### 7.4 Claude Code 與 Anthropic

Anthropic 的 Claude Code 透過其權限模型和 hooks 系統實現 Harness：

- **預設立場唯讀**：直到用戶給予明確批准
- **自動快照（Snapshots）**：每次文件編輯均可還原
- **Hooks 系統**：允許在 Agent 生命週期關鍵點注入自定義腳本（安全掃描、linting、策略執行）
- **CLAUDE.md 文件**：為 Agent 提供持久性專案特定 context

### 7.5 Cursor

Cursor 透過 `.cursor/rules` 文件實現 Harness——這些基於 Markdown 的配置文件提供持久指令，塑造 Agent 處理程式碼的方式。規則受版本控制、針對特定文件模式且始終開啟，為程式碼生成提供一致的引導，無需重複提示。

---

## 八、構建指南：從零打造你的第一個 Agent Harness

Harness Engineering 可以循序漸進，分三個層級：

![實操指南](https://developer.qcloudimg.com/http-save/yehe-1055266/361f40c22dfe9c90f1fd64effb1edde1.png)
*圖 8：Harness 建設的三個層級*

### Level 1：單人 Harness（1-2 小時搭建）
**適合**：個人開發者，使用 Cursor、Claude Code 等工具

最小配置：
1. **專案規則文件**（`.cursorrules` 或 `CLAUDE.md`）——記錄規範、目錄結構、測試指令和架構約束
2. **Pre-commit Hook**——提交前自動執行 lint 和測試
3. **測試套件**——確保 Agent 能自己跑測試驗證
4. **清晰的目錄結構**——一致的命名規範

**效果**：防止最常見的 Agent 錯誤

---

### Level 2：團隊 Harness（1-2 天搭建）
**適合**：3-10 人團隊

在 Level 1 基礎上增加：
1. **`AGENTS.md` 文件**（團隊級約定）
2. **CI 強制執行的架構約束**（循環依賴檢查、分層規則腳本）
3. **共享的 Prompt 模板**（實現新 API、修復 bug、重構模組等標準任務模板）
4. **文件即程式碼**（Markdown 文件納入版本控制，Linter 檢查文件是否過期）
5. **Agent 生成 PR 的審查清單**（lint 通過、測試覆蓋率不下降、文件已更新、符合架構約束）

**效果**：團隊內 Agent 行為一致

---

### Level 3：生產級 Harness（1-2 週搭建）
**適合**：工程組織，數十個並發 Agent

在 Level 2 基礎上增加：
1. **自定義中間件層**（死循環偵測、推理資源優化）
2. **可觀測性整合**（Agent 能讀取日誌和指標、Dashboard 監控 Agent 性能）
3. **熵管理 Agent 調度**（每天凌晨運行文件檢查、每週運行架構審計）
4. **Harness 版本化和 A/B 測試**（不同專案用不同版本 Harness，對比效果持續優化）
5. **升級策略**（Agent 卡住時自動通知人類、定義清晰的 escalation policy）

**效果**：Agent 成為自主貢獻者

---

## 九、工具生態：2026 年主流框架與平台

| 工具/框架 | Harness 特性 | 適用場景 |
|----------|------------|---------|
| **OpenAI Codex** | AGENTS.md 配置、沙箱執行、CI 整合驗證 | 生產級大型程式碼庫 |
| **LangChain / LangGraph** | 有狀態圖編排、工具路由、記憶體持久化、檢查點恢復 | 自定義多步 Agent 工作流 |
| **CrewAI** | 多 Agent 協作、事件驅動編排（Flows 功能） | 需要多個專業 Agent 協同的任務 |
| **Claude Code + Agent SDK** | 內建權限模型、Hooks 系統、跨會話 context 橋接 | 長時間運行的多會話 Agent |
| **Cursor** | 規則文件、內建循環偵測、模型特定 prompt 適配 | IDE 整合的程式設計 Agent |

---

## 十、與鄰接學科的比較

### 10.1 Harness Engineering vs. Prompt Engineering

Prompt engineering 專注於為**單次**模型調用設計有效輸入。Harness engineering 涵蓋圍繞 Agent 的整個系統：工具編排、狀態管理、錯誤恢復、可觀測性以及多會話協調。

Prompt engineering 是 harness engineering 的一個組件，而不是其代名詞。

### 10.2 Harness Engineering vs. MLOps

MLOps 涵蓋機器學習模型的生命週期（訓練、部署、監控、重新訓練、治理）；Harness engineering 專門針對生產環境中 AI Agent 的編排。在監控和可觀測性有重疊，但 MLOps 關注模型隨時間的表現，Harness engineering 關注 Agent 在實時執行中的行為。

### 10.3 Harness Engineering vs. DevOps

DevOps 專注於軟體交付流水線（CI/CD、基礎設施即代碼、部署自動化）。Harness engineering 大量借鑑 DevOps 原則，但將其應用於 Agent 行為而非軟體部署。在許多組織中，Harness 工程師與 DevOps 團隊並肩工作，而非取代他們。

---

## 十一、工程師角色的典範轉移

![思維轉變](https://developer.qcloudimg.com/http-save/yehe-1055266/19731d815d31d6d4a9ce47f291343242.png)
*圖 9：從「寫程式碼」到「設計環境」的思維轉變*

Harness Engineering 帶來三個根本性的思維轉變：

### 轉變一：從「寫程式碼」到「設計環境」

傳統工程師：「這個功能我要怎麼寫？」  
Harness 工程師：「我要設計什麼樣的環境，才能讓 Agent 可靠地寫出這個功能？」

### 轉變二：從「審查程式碼」到「審查系統」

傳統工程師：「這段程式碼有沒有 bug？」  
Harness 工程師：「為什麼 Harness 沒有防止這個 bug？需要增加什麼約束？」

### 轉變三：從「人適應工具」到「工具適應人」

傳統模式：工程師學習怎麼用 AI 工具  
Harness 模式：AI 工具學習怎麼在工程師的環境裡工作

### 哪些能力不會被取代？

| 不會被取代的能力 | 說明 |
|---------------|------|
| 系統設計能力 | 設計 Harness 比寫程式碼更難 |
| 問題拆解能力 | 把模糊需求變成清晰任務 |
| 品質判斷能力 | 評估 Agent 輸出的優劣 |
| 架構演進能力 | 隨業務發展調整 Harness |

### 哪些能力會逐漸式微？

- 純體力型的 CRUD 程式碼
- 沒有創造力的重複勞動
- 依賴記憶力的 API 調用

未來工程師更像是：**產品經理（定義要做什麼）+ 架構師（設計怎麼做）+ 教練（訓練 Agent）+ 品質主管（確保輸出品質）**。

---

## 十二、常見陷阱與血淚教訓

![開始構建](https://developer.qcloudimg.com/http-save/yehe-1055266/637dbe30dcc7bba0c936e861a3c7cebf.png)
*圖 10：Harness 建設路上的四大常見陷阱*

### 陷阱一：過度設計控制流

> 「如果你把控制流設計得太複雜，下一個模型更新就會讓你的系統報廢。」

2024 年需要複雜 pipeline 實現的功能，2025 年模型一個 prompt 就能搞定。

**建議**：Harness 要設計成「可拆卸」的，當模型變聰明後能輕鬆移除不必要的控制邏輯。

### 陷阱二：把 Harness 當成靜態系統

Harness 需要**持續演進**：
- 模型能力提升了 → Harness 要簡化
- 團隊規模擴大了 → Harness 要加強
- 程式碼庫變複雜了 → Harness 要增加約束

**建議**：每週回顧 Harness 的效果，持續迭代。

### 陷阱三：忽視文件的「基礎設施」屬性

很多人把 `AGENTS.md` 當成普通文件，寫完就忘。這是大錯特錯——`AGENTS.md` 是 Harness 的核心組件，是 Agent 的「入職培訓手冊」。

**建議**：每次 Agent 犯錯，都要更新 `AGENTS.md`；把它當成程式碼一樣維護。

### 陷阱四：約束不足或約束過度

- **約束不足**：Agent 漫無目的，產出混亂
- **約束過度**：Agent 束手束腳，無法創新

**建議**：從最小約束集開始，根據 Agent 的實際表現逐步調整，定期問「這個約束還有必要嗎？」

---

## 十三、結論

Harness Engineering 是對一個核心問題的系統性回答：**如何讓 AI Agent 足夠可靠地在生產環境中被信任？**

答案不是更好的模型。三個關鍵數據已充分說明：

1. **LangChain** 在保持模型不變的情況下，僅改進 Harness，讓 Agent 從排名 Top 30 躍升至 Top 5
2. **OpenAI** 的三人團隊透過設計良好的 Harness，在五個月內交付百萬行程式碼的生產系統
3. **Anthropic** 的研究表明，結構化的 Harness 使 Agent 能夠跨越數小時乃至數天的會話有效工作

這個領域仍在快速成熟。但其原則已確立：

> **約束 Agent 可以做的事，告知它們應該做的事，驗證它們的工作，糾正它們的錯誤，並在關鍵決策點上讓人介入。**

無論你是使用 Codex、Claude Code、Cursor 還是 LangChain 進行開發，你都在實踐 Harness Engineering。唯一的問題是：**你是否是有意識地這樣做？**

---

## 參考文獻

1. Fowler, M. (2026). *Harness Engineering*. martinfowler.com. https://martinfowler.com/articles/exploring-gen-ai/harness-engineering.html

2. OpenAI Engineering Team. (2026). *Harness Engineering: Leveraging Codex in an Agent-First World*. openai.com. https://openai.com/index/harness-engineering/

3. OpenAI Engineering Team. (2026). *Unlocking the Codex Harness: How We Built the App Server*. openai.com. https://openai.com/index/unlocking-the-codex-harness/

4. Anthropic Engineering Team. (2025). *Effective Harnesses for Long-Running Agents*. anthropic.com. https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents

5. LangChain Team. (2026). *Improving Deep Agents with Harness Engineering*. blog.langchain.com. https://blog.langchain.com/improving-deep-agents-with-harness-engineering/

6. NxCode Team. (2026). *什麼是 Harness Engineering？AI Agent 開發完整指南 (2026)*. nxcode.io. https://www.nxcode.io/zh-TW/resources/news/what-is-harness-engineering-complete-guide-2026

7. 碼森林. (2026). *別卷模型了！OpenAI 工程師都在偷偷用的「Harness Engineering」，才是 AI 程式設計的終極殺器*. 騰訊雲開發者社群. https://cloud.tencent.com/developer/article/2648322

8. 程序猿李巡天. (2026). *AI 圈突然都在說 Harness，它到底是什麼？一篇給你講透*. CSDN. https://blog.csdn.net/m0_59235945/article/details/159655249

9. Parallel Web Systems. (2026). *What Is an Agent Harness*. parallel.ai. https://parallel.ai/articles/what-is-an-agent-harness

10. InfoQ. (2026). *OpenAI Introduces Harness Engineering*. infoq.com. https://www.infoq.com/news/2026/02/openai-harness-engineering-codex/

---

*本文整理自多方公開技術文獻，圖片來源各原始出處。僅供學術研究與技術學習使用。*
