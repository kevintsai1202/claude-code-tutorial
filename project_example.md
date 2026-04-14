# 🎯 課程實作主線：Bug 獵人積分系統 (Bug Hunter Leaderboard)

---

## 一句話描述

> **一個讓開發者透過「修 Bug」賺取積分、互相競爭的遊戲化 Bug 追蹤平台。**

---

## 為什麼選這個？

| 評估標準 | 說明 |
|---|---|
| ❌ 不太常見 | 大多數教學是 Todo / Blog / 電商，這個有遊戲化機制 |
| ✅ 難度適中 | 有狀態機、積分邏輯，但不需要複雜演算法 |
| ✅ 開發者有感 | 就是「修 Bug」這件事本身，對象是開發者 |
| ✅ 功能完整 | CRUD + 狀態流轉 + 計算邏輯 + 排行榜 |
| ✅ 視覺有亮點 | 排行榜、Badge、積分進度條讓前端好看 |

---

## 系統全貌（你最終會做出什麼）

```
┌─────────────────────────────────────────────────────────┐
│              Bug Hunter Leaderboard                      │
├──────────────┬──────────────────────────────────────────┤
│              │  🏆 本月排行榜        本週冠軍 @Alice    │
│  📋 Bug 列表 │  1. Alice     ★ 820 pts                 │
│             │  2. Bob       ★ 650 pts                  │
│  [#001] 登入│  3. Carol     ★ 410 pts                 │
│  頁面閃退   │                                           │
│  🔴 OPEN   │  ──────────────────────────────────────── │
│  嚴重度: 🔥  │  📊 我的統計                             │
│  懸賞: 50pt │  今日: +30 pts  本月: +280 pts           │
│             │  已修: 12 bugs  進行中: 2 bugs            │
│  [#002] API │                                           │
│  回傳 500   │  🏅 Badge 成就                            │
│  🟡 IN PROG │  🥇 Speed Fix  🛡️ Security Pro           │
│  認領: Bob  │  🔥 5連勝      ──未解鎖──                 │
│             │                                           │
│  [#003] 搜尋│                                           │
│  結果排序錯 │                                           │
│  ✅ FIXED   │                                           │
│  修復者:Alice│                                          │
└──────────────┴──────────────────────────────────────────┘
```

---

## 核心實體（你要建的資料庫）

```
Bug（問題單）
├── id, title, description
├── severity: CRITICAL(100pt) / HIGH(50pt) / MEDIUM(20pt) / LOW(5pt)
├── status: OPEN → CLAIMED → IN_REVIEW → FIXED → REJECTED
├── pointBounty          ← 自動依嚴重度換算
├── reporter (User)      ← 誰報的
└── claimedBy (User)     ← 誰在修

User（開發者）
├── id, username, email
├── totalPoints          ← 累積積分
├── monthlyPoints        ← 本月積分
└── badges[]             ← 解鎖的成就

Fix（修復記錄）
├── bug (Bug)
├── fixer (User)
├── fixDescription       ← 怎麼修的
├── pointsEarned         ← 這次拿到幾分
└── createdAt
```

---

## 商業邏輯（讓它「不只是 CRUD」的地方）

### 積分規則
| 嚴重度 | 基礎分 | 24h 內修完 | 連續 3 Bug | 首次回報者 |
|---|---|---|---|---|
| CRITICAL 🔥 | 100 | +50 | +20% | +10 |
| HIGH ⚠️ | 50 | +25 | +20% | +5 |
| MEDIUM 🟡 | 20 | +10 | +20% | +3 |
| LOW 🟢 | 5 | +2 | +20% | +1 |

### 狀態機
```
OPEN → CLAIMED（開發者認領）
CLAIMED → IN_REVIEW（提交修復）
IN_REVIEW → FIXED（審核通過 → 發積分）
IN_REVIEW → REJECTED（打回 → 積分不發）
CLAIMED → OPEN（放棄認領）
```

### Badge 成就
- 🥇 **Speed Fix**：24h 內修完 CRITICAL
- 🛡️ **Bug Slayer**：累積修 50 個 Bug
- 🔥 **On Fire**：連續 5 Bug 未中斷
- 🎯 **Precision**：連續 5 次 IN_REVIEW → FIXED（無 REJECTED）

---

## API 端點（你要實作的後端）

```
POST   /api/bugs              ← 新增 Bug
GET    /api/bugs              ← 列表（可篩選 status/severity）
GET    /api/bugs/{id}         ← 詳情
PUT    /api/bugs/{id}/claim   ← 認領
PUT    /api/bugs/{id}/submit  ← 提交修復（附說明）
PUT    /api/bugs/{id}/approve ← 審核通過（發積分）
PUT    /api/bugs/{id}/reject  ← 打回重來

GET    /api/leaderboard       ← 排行榜（month/all-time）
GET    /api/users/{id}/stats  ← 個人統計
GET    /api/users/{id}/fixes  ← 修復歷史

POST   /api/users/register    ← 註冊
POST   /api/users/login       ← 登入（JWT）
```

---

## 前端畫面（你要做的 React 頁面）

| 頁面 | 功能 |
|---|---|
| 📋 Bug 列表 | 篩選狀態/嚴重度、顯示懸賞積分、一鍵認領 |
| 🔎 Bug 詳情 | 完整描述、狀態歷程、提交修復表單 |
| ➕ 新增 Bug | 填寫標題/說明/嚴重度，自動換算積分 |
| 🏆 排行榜 | 本月 / 全時 Tab，Top 10 開發者 |
| 👤 個人頁面 | 我的積分、Badge 牆、修復歷史 |

---

## 各 Milestone 在這個系統裡對應什麼

| Milestone | 做什麼 |
|---|---|
| **M1 骨架** | 建 Repo、寫 spec.md 定義以上所有欄位與規則 |
| **M2 後端** | TDD 先行：先寫「認領 → 提交 → 審核通過 → 積分發放」的測試 |
| **M3 前端** | Bug 列表 + 詳情頁串接 API，Playwright 驗證列表有顯示 |
| **M4 Skill** | 資安 Skill 掃描（JWT 驗證有無洩漏），Agent 生成 30 筆假 Bug 資料 |
| **M5 收尾** | `/review` TicketService，`/simplify` 積分計算邏輯，發 PR |

---

> 💡 **一句話讓學員有感**：
> 「你在這堂課裡，要用 Claude Code 從零打造一個讓工程師搶著修 Bug 的積分遊戲。」
