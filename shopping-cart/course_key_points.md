# 🛒 購物車系統 × 課程章節對應重點整理

> **閱讀方式**：左欄是課程教的技巧，右欄是購物車系統的具體示範動作。
> 每節都能回答學員最常問的問題：「這個功能用 Claude Code 怎麼做？」

---

## 第 1 段：Git、GitHub 與 Claude Code 起手式（50 mins）

---

### 1-1 環境安裝、登入與操作模式（15 mins）

**課程教什麼**

| 主題 | 重點 |
|---|---|
| 安裝與登入 | `npm install -g @anthropic-ai/claude-code` → `claude doctor` 確認環境 |
| 操作模式 | 5 種模式：逐步確認 / 自動編輯 / Plan Mode / Auto Mode / Bypass |
| VS Code vs CLI | 插件自動感知開啟檔案；CLI 需明確 `@` 參照 |
| 模型切換 | `/model sonnet` 日常用；`/model opus` 架構決策用 |

**購物車對應示範**

```
🎬 示範動作：
1. 執行 claude doctor → 確認環境 OK
2. 輸入 /login 登入帳號
3. 切換 Plan Mode → 輸入「幫我設計一個購物車系統的資料模型」
   → Claude 只讀、不寫程式，只提計畫
4. 切回一般模式，準備開始開發
```

> **講師話術**：「你看，同樣的需求，Plan Mode 下 Claude 先分析再問你，不會直接亂動你的程式碼——這就是你控制 AI 的方式。」

---

### 1-2 Git 常用操作與 gh CLI（20 mins）

**課程教什麼**

| 指令 | 用途 |
|---|---|
| `git status / add / commit / push / pull` | 五個核心操作 |
| Claude 幫寫 commit message | 讓 AI 讀 diff，整理語意化的 commit 說明 |
| `gh repo create` | 終端機建立遠端 Repo |
| `gh issue list / view` | 讓 Claude 讀 Issue 直接開發 |
| `gh pr create` | 搭配 Claude 自動生成 PR 說明 |

**購物車對應示範**

```
🎬 示範動作：
1. gh repo create shopping-cart --public
   → 不開瀏覽器，直接在終端機建好 Repo

2. 建立 GitHub Issue：「購物車結帳時需要檢查庫存」
   → gh issue list 查看
   → 讓 Claude 讀 issue：「請根據 issue #1 實作庫存檢查」

3. 完成 spec.md 後：
   git add spec.md
   → 讓 Claude 產生 commit message：
     「docs: add shopping cart spec with checkout flow and stock rules」
   git push
```

> **講師話術**：「gh CLI 讓你整個工作流不需要離開終端機——從讀需求、寫程式、到發 PR，Claude 都在同一個地方陪你完成。」

---

### 1-3 SDD 文件驅動開發（15 mins）

**課程教什麼**

| 主題 | 重點 |
|---|---|
| SDD 是什麼 | 先寫規格、再寫程式；規格是「你與 Claude 的共識契約」 |
| spec.md 的作用 | 每次任務前 `@spec.md` 讓 Claude 取得完整上下文 |
| CLAUDE.md 設定 | 宣告技術棧規則、MCP server、Hooks |

**購物車對應示範**

```
🎬 示範動作（Plan Mode 先行）：

提示詞：「請根據以下需求，產出購物車系統的 spec.md，
格式包含：資料模型、狀態機、API 端點清單、關鍵業務規則。
需求：
- 使用者可以瀏覽商品並加入購物車
- 結帳時需要檢查庫存，不足則拋出錯誤
- 下單後的商品價格需快照，不受日後改價影響
- 可以取消訂單，已扣庫存需歸還
不要開始寫程式，先讓我確認規格。」

spec.md 產出後，補充 CLAUDE.md：
- 宣告 playwright MCP server
- 加入「庫存扣減只能在 CartService.checkout() 執行」等禁止規則
```

> **購物車節點產出**：`spec.md` 完整版、`CLAUDE.md` 初始版

---

## 第 2 段：全端主線實作（75 mins）

---

### 2-1 後端生成、TDD 先行與自主修正循環（25 mins）

**課程教什麼**

| 主題 | 重點 |
|---|---|
| TDD 三循環 | Red（寫測試）→ Green（實作）→ Refactor |
| 為什麼 AI 適合 TDD | 測試是最精確的規格說明，Claude 不猜測 |
| TDD Prompt 範本 | 「先寫測試，**不要實作**，等確認再開始」 |
| Auto Mode 閉環 | Claude 自主「測試→修正→再測試」不需每步確認 |

**購物車對應示範**

```
🎬 TDD 流程示範（最關鍵的橋段）：

Step 1 — 先寫測試（Prompt）：
「請依據 @spec.md 針對 CartService.checkout() 撰寫 JUnit 5 測試，
**不要實作**，等我確認後再開始：
1. 結帳成功：Product.stock 應正確扣減
2. 庫存不足（任一商品）：所有庫存都不應被扣（@Transactional rollback）
3. 結帳後：Cart.status 應變為 CHECKED_OUT
4. 結帳後改 Product.price：舊訂單 OrderItem.unitPrice 不變
請先只給我測試程式碼。」

Step 2 — 確認測試邏輯正確

Step 3 — 讓 Claude 實作

Step 4 — mvn test → RED（庫存扣減邏輯尚未實作）

Step 5 — Auto Mode：
「請自主執行 mvn test，讀取錯誤並修正，直到全部 GREEN」
→ Claude 自主跑完 3-4 輪修正循環
```

| JUnit 測試場景 | 對應業務規則 |
|---|---|
| `checkout_success_decreasesStock` | 結帳扣庫存 |
| `checkout_insufficientStock_rollsBackAll` | 並發安全 + 全部 rollback |
| `checkout_setsCartStatusToCheckedOut` | Cart 狀態機 |
| `priceChange_doesNotAffectExistingOrder` | unitPrice 快照 |
| `cancelPaidOrder_restoresStock` | 取消退庫存 |
| `cancelPendingOrder_doesNotRestoreStock` | 狀態判斷邊界 |

---

### 2-2 前端鷹架、API 串接與 Playwright 驗證（25 mins）

**課程教什麼**

| 主題 | 重點 |
|---|---|
| React + Vite 鷹架 | 依 spec.md 快速落 UI，不隨意生成 |
| `@` 跨層參照 | 同時參照後端 Controller 和前端 api.ts |
| Playwright MCP | `browser_snapshot` 分析頁面結構（非截圖） |
| E2E 腳本 | 讓 Claude 產出可納入 CI 的 Playwright 測試 |

**購物車對應示範**

```
🎬 前端串接示範：

Step 1 — 假資料先跑起 UI：
「請根據 @spec.md 建立 ProductList.tsx，先用假資料，
確保商品卡片有顯示：名稱、價格、庫存狀態、加入購物車按鈕」

Step 2 — 串接 API：
「請同時參照 @ProductController.java 和 @productApi.ts，
把假資料改為呼叫 GET /api/products，並處理 loading 和 error 狀態」

Step 3 — Playwright MCP 驗證：
「請用 playwright 打開 localhost:5173：
1. 驗證商品列表有至少 6 筆商品顯示
2. 點擊第一筆商品的『加入購物車』按鈕
3. 確認導覽列的購物車 badge 數字從 0 變為 1
4. 前往 /cart，確認剛才商品出現在購物車清單中」

Step 4 — 讓 Claude 產出 E2E 腳本（存進 e2e/ 目錄）
```

> **為什麼 `browser_snapshot` 比截圖好**：
> Claude 看到的是頁面的無障礙語意樹（role、text、state），
> 可以精確判斷「按鈕是否可點擊」、「文字內容是否正確」，
> 而非猜測像素。

---

### 2-3 真實除錯與上下文管理（25 mins）

**課程教什麼**

| Slash Command | 用途 | 時機 |
|---|---|---|
| `/bug` | 切出除錯上下文，讓 Claude 聚焦 | 遇到難定位的 bug |
| `/rewind` | 回退到上一個方向 | 覺得走偏了 |
| `/compact` | 壓縮長對話 | 修完一個 bug 後 |
| `/clear` | 清空脈絡 | 開始完全不同的任務 |

**購物車對應示範（三個真實錯誤）**

```
🐛 錯誤 1：CORS 問題
症狀：Vite 前端呼叫 Spring Boot API 時 console 出現 CORS error
示範：
/bug「結帳 API 出現 CORS error，錯誤訊息如下：[貼上 console]
     請分析原因並修正 Spring Boot 的 CORS 設定」

🐛 錯誤 2：購物車 badge 數量不即時更新
症狀：加入購物車後，badge 數字不更新，要 reload 才正確
示範：
/bug「加入購物車後 CartBadge 不即時更新，
     請同時參照 @cartApi.ts @CartBadge.tsx @CartContext.tsx 找出原因」
修完後：/compact 壓縮掉這段除錯記錄

🐛 錯誤 3：結帳後購物車仍顯示舊商品
症狀：POST /api/cart/checkout 成功後，前端購物車沒有清空
示範：
@cartApi.ts「checkout 成功後需要清空本地 cartItems state，
             請找出是哪裡沒有觸發清空邏輯」
```

---

## 第 3 段：企業 Skill、輔助技能與背景 Agent（60 mins）

---

### 3-1 用 `skill-creator` 製作資安規範 Skill（25 mins）

**課程教什麼**

| 主題 | 重點 |
|---|---|
| Skill 的結構 | 輸入格式、檢查清單、輸出模板 |
| skill-creator 用法 | 讓 Claude 協助把規範轉成可重用 Skill |
| Hooks 概念 | `PreToolUse` 在寫入前自動觸發 Skill |

**購物車對應示範**

```
🛡 資安 Skill 設計（電商版）：

Prompt：「我要建立一個電商資安規範 Skill，
請幫我設計 security-check.skill.md，輸入是 Java Service 檔，
需要檢查以下電商常見漏洞：
1. JWT Secret 有無硬編碼
2. /checkout 端點有無驗證使用者身份（防止他人幫別人結帳）
3. totalAmount 有無防止客戶端傳入偽造（應伺服器計算）
4. CartService.checkout() 有無 @Transactional 防並發超賣
5. OrderItem.unitPrice 有無可能被客戶端直接傳入覆蓋
輸出格式：🔴高風險 / 🟡中風險 / 🟢通過」

立刻套用：
「請使用 security-check Skill 掃描 @CartService.java 和 @OrderController.java」

預期發現：
→ 🔴 OrderController 缺少身份驗證（任何人都能取消別人的訂單）
→ 🔴 CheckoutRequest 接受 totalAmount 欄位（可被偽造）
→ 🟡 CartService.checkout() 缺少 @Transactional
```

> **Hooks 說明**：
> 把 security-check Skill 設為 `PreToolUse` Hook，
> 每次 Claude 要寫入 `.java` 檔前自動觸發，
> 讓資安規範變成機械化保護，不依賴開發者記得執行。

---

### 3-2 開發輔助技能分類導覽（15 mins）

**課程教什麼**：何時「用 Skill」vs 何時「直接下 prompt」

**購物車各場景 Skill 選用**

| 場景 | 使用哪個 Skill | 原因 |
|---|---|---|
| 掃描後端安全漏洞 | `security-check`（自製） | 固定規範，需重複使用 |
| 查 Spring Boot `@Transactional` 最新用法 | `firecrawl` | 需要即時文件，避免知識截止問題 |
| 產出《購物車系統設計書》DOCX | `docx` | 模板固定，適合 Skill |
| 閱讀廠商提供的 API PDF 規格書 | `pdf` | 單次任務，直接下 prompt 即可 |
| 生成符合設計系統的 React 按鈕元件 | `reactcomponents` | 有固定風格規範，適合 Skill |
| 臨時問「`useEffect`  cleanup 怎麼寫」 | 直接問 Claude | 一次性探索，不需 Skill |

---

### 3-3 `/agent` 背景長任務（20 mins）

**課程教什麼**

| 主題 | 重點 |
|---|---|
| 適合背景 Agent 的工作 | 假資料生成、log 分析、大量搜尋、規格比對 |
| 任務邊界設計 | 明確定義輸出格式、存放路徑、不得修改主線 |
| Git Worktrees | 多 Agent 在不同分支平行工作 |

**購物車對應示範**

```
背景 Agent 任務 1：生成商品假資料
/agent「請按照 @spec.md 的 Product 資料模型，
生成 30 筆商品假資料：
- 分 3C / 服飾 / 食品 三個 category，各 10 筆
- name 和 description 要用真實商品描述風格
- 其中 5 筆 stock < 5（觸發庫存警示），2 筆 stock=0（售完）
- 輸出到 src/test/resources/seed-products.json
完成後回報：生成了幾筆、各 category 分別幾筆」

主線持續開發（示範同時在修購物車 UI）

背景 Agent 任務 2：Git Worktrees 示範
git worktree add ../shopping-cart-feature feature/coupon-system
→ 另一個 Agent 在 feature/coupon-system 分支開發優惠券功能
→ 主線繼續改購物車 UI，兩者互不干擾
```

---

## 第 4 段：Review、程式優化與收尾（25 mins）

---

### 4-1 `/review` 與 `/simplify`（10 mins）

**課程教什麼**

| 指令 | 觸發時機 | 三個維度 |
|---|---|---|
| `/review` | 完成功能後、PR 前 | 正確性 / 安全性 / 可讀性 |
| `/simplify` | 測試通過後重構 | 不改邏輯，只改結構 |

**購物車對應示範**

```
🎬 完整收尾迴圈：

Step 1 — 針對最複雜的 Service 做 review：
/review @src/service/CartService.java

預期 Claude 發現：
→ 正確性：checkout() 沒有處理 CartItem 數量為 0 的邊界
→ 安全性：缺少 @Transactional 導致並發超賣風險  
→ 可讀性：checkout() 方法過長，建議拆出 buildOrderFromCart()

Step 2 — 修正後 simplify：
/simplify @src/service/CartService.java
→ Claude 把 60 行的 checkout() 拆成 3 個語意清晰的私有方法

Step 3 — 驗證重構沒有破壞邏輯：
mvn test → 仍然全 GREEN ✅

Step 4 — 再一次 review 確認無誤：
/review @src/service/CartService.java
→ 無高嚴重性問題 ✅
```

---

### 4-2 Slash Commands 完整工作流總覽（15 mins）

**購物車專案完整工作流回顧**

```mermaid
flowchart LR
  A["/init\n設定 CLAUDE.md"] --> B["/plan\n設計 spec.md"]
  B --> C["開發循環\n@spec.md 驅動"]
  C --> D["/bug\n除錯 CORS\n購物車 badge"]
  D --> E["/compact\n壓縮除錯記錄"]
  E --> F["/review\n審查 CartService"]
  F --> G["/simplify\n重構結帳邏輯"]
  G --> H["gh pr create\nClaude 生成 PR 說明"]
```

**最終版本控制收尾**

```
Claude 幫你做：
1. 整理這次所有 diff 的語意化 commit message
2. 生成 PR 說明（包含：改了什麼 / 怎麼測試 / 注意事項）

你執行：
git add . && git commit -m "feat: complete checkout flow with stock management"
gh pr create  ← 貼上 Claude 生成的 PR body
gh pr checks  ← 確認 JUnit + ESLint + Playwright 三道全過
```

---

## 第 5 段：Harness Engineering（20 mins）

---

### 5-1 ~ 5-4 Harness 概念整合

**課程教什麼**：把前四段做過的事對應到 Harness 框架

**購物車專案的 Harness 對應表**

| 購物車做過的事 | 對應 Harness 組件 |
|---|---|
| `CLAUDE.md`（「庫存扣減只能在 CartService」） | 靜態上下文層（Single Source of Truth） |
| JUnit 結帳測試（Red → Green） | 錯誤恢復與回饋迴路 |
| `PreToolUse` Hook 觸發資安 Skill | 架構約束與自動驗證閘門 |
| `/agent` 生成假資料 + Git Worktrees | 工具協調層、並行 Agent 隔離 |
| Playwright MCP 驗證購物車 badge | 可觀測性與自動化驗收 |
| `/review` + `/simplify` CartService | 熵管理（防止程式碼庫劣化） |
| Plan Mode → 確認 spec → 開始實作 | Human-in-the-Loop 檢查點 |

**Harness 升級路徑（購物車版）**

| 層級 | 今日就能做 | 1~2 天 | 生產級 |
|---|---|---|---|
| **Level 1** | 建 `CLAUDE.md`：「結帳邏輯只在 CartService」 | — | — |
| **Level 2** | — | `AGENTS.md`：Agent 禁止修改 CartService；CI 強制 JUnit + E2E | — |
| **Level 3** | — | — | 超賣偵測中間件；熵管理 Agent 定期掃描 spec/code 不一致 |

---

## 快速對照表（講師備用）

| 課程節次 | 購物車關鍵動作 | Claude Code 指令 |
|---|---|---|
| 1-1 | `claude doctor` + Plan Mode 示範 | `claude doctor` / `Shift+Tab` |
| 1-2 | `gh repo create` + Claude 寫 commit message | `gh repo create` / `gh pr create` |
| 1-3 | 自然語言需求 → `spec.md` | Plan Mode + `@spec.md` |
| 2-1 | 結帳測試先寫，Auto Mode 跑完 RED→GREEN | TDD Prompt + Auto Mode |
| 2-2 | Playwright 驗購物車 badge 更新 | `browser_snapshot` |
| 2-3 | 修 CORS + badge 不更新 + 購物車未清空 | `/bug` / `/rewind` / `/compact` |
| 3-1 | 資安 Skill 掃 CartService | `skill-creator` + `PreToolUse` Hook |
| 3-2 | 各場景 Skill 選用說明 | `firecrawl` / `docx` / `reactcomponents` |
| 3-3 | `/agent` 生成假商品資料 + Git Worktrees | `/agent` + `git worktree` |
| 4-1 | `/review` + `/simplify` CartService | `/review` / `/simplify` |
| 4-2 | 完整工作流回顧 + 最終 PR | `gh pr create` + `gh pr checks` |
| 5-x | Harness 升級路徑說明 | 整合 CLAUDE.md / AGENTS.md |
