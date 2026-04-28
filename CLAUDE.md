# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 專案概要

此專案為 **Claude Code 4 小時線上課程**的教材開發與管理系統。核心目標是透過一個完整的全端購物車專案，展示 Claude Code 在日常開發流程中的應用（版本控制、SDD/TDD、Skill 設計、背景 Agent、多模式操作等）。

**課程交付物**：
- `claude_code_syllabus.md` — 馬克當語文課綱源檔
- `claude_code_syllabus.docx` — 生成後的 Word 講義（講師用）
- `claude_code_project_plan.md` — 強師實戰教案與情境補充

---

## 常用指令

### 環境設置
```powershell
# 安裝依賴
npm install

# 檢查 Node.js 版本（需 v14+）
node --version
```

### 課綱文件生成
```powershell
# 將 claude_code_syllabus.md 轉換為 .docx
node generate_syllabus.js

# 驗證：輸出檔應為 claude_code_syllabus.docx
# 文件應包含所有 Heading 1-3、段落、表格、超連結
```

### 文件驗證工作流
```powershell
# 1. 編輯 spec.md 定義改版需求
# 2. 更新 claude_code_syllabus.md 主要課綱內容
# 3. 更新 claude_code_project_plan.md 教案補充
# 4. 執行生成指令: node generate_syllabus.js
# 5. 查驗 .docx 輸出（格式、時數、主題一致性）
```

---

## 程式碼架構

### 核心模組

**`generate_syllabus.js`** — 課綱轉換引擎  
- 讀取 `claude_code_syllabus.md` 的馬克當結構
- 使用 `docx` 函式庫產生 Word 文件  
- 對應 Heading、段落、列表、表格、超連結等元素
- 輸出 `claude_code_syllabus.docx`

**輔助函式** (generate_syllabus.js 內)：
```javascript
h1(text)      // 生成 Heading 1（分段標題）
h2(text)      // 生成 Heading 2（子題）
p(text)       // 生成段落
bullet(text)  // 生成項目列表
table(rows)   // 生成表格
link(text, url) // 生成超連結
```

### 文件管理層級

| 檔案 | 目的 | 職責 | 更新時機 |
|------|------|------|----------|
| `spec.md` | 規格定義 | 記錄改版需求、目標、資料模型、系統流程 | 新需求提出時 |
| `api.md` | API 文件 | 定義後端 API 端點（本專案無後端，記錄為「無新增」） | 有 API 異動時 |
| `todolist.md` | 任務追蹤 | 記錄開發進度（已完成/進行中/未開始） | 每次任務變更 |
| `claude_code_syllabus.md` | 課綱源檔 | 馬克當格式的完整課程內容與時數配置 | 課程內容修改時 |
| `claude_code_project_plan.md` | 教案補充 | 強師備課用的教學情境、示範 prompt、專案實例 | 教學策略調整時 |
| `generate_syllabus.js` | 轉換腳本 | Node.js 程式，讀 MD 轉 DOCX，套用格式與樣式 | 需要新增文件元素時 |

---

## 關鍵概念

### SDD（Spec-Driven Development）
課程本身示範 SDD 工作流：先定義規格（`spec.md`）再開始開發，每次實作時透過 `@spec.md` 取得上下文，確保團隊對需求有共識。

### 課程主線：購物車系統（Shopping Cart）
- **後端**：Spring Boot 3 + PostgreSQL（Docker）
- **前端**：React + Vite
- **測試**：JUnit 5（後端）、Playwright MCP（前端 E2E）
- **功能**：商品瀏覽、加購、數量管理、結帳

所有課程範例、實作與示範均圍繞此主線展開。

---

## 開發規範

### 課綱編寫
- 所有課程內容須在 `claude_code_syllabus.md` 中維護（單一源）
- 使用馬克當標準語法（Heading #-###、列表、表格、程式碼塊）
- 每個分段應包含**時長**（分鐘）、**目標**、**主要議題**
- 時數總和應與課程定位一致（當前為 3.5～4 小時）

### 檔案修改流程
1. **更新需求評估** → 修改 `spec.md`（明確範圍、資料模型、關鍵流程）
2. **內容編寫** → 修改 `claude_code_syllabus.md` 和 `claude_code_project_plan.md`
3. **同步 API 文件** → 若有後端異動則更新 `api.md`（目前無新增）
4. **任務追蹤** → 更新 `todolist.md` 記錄完成狀態
5. **文件生成** → 執行 `node generate_syllabus.js` 產生 `.docx`
6. **驗證輸出** → 檢查 `.docx` 格式、超連結、表格、時數一致性

### 每次任務前確認
- 閱讀 `spec.md` 確保理解改版方向
- 查閱 `todolist.md` 了解當前進度
- 若有疑義，先與專案負責人確認需求邊界

---

## 生成流程詳解

`generate_syllabus.js` 執行邏輯：

1. **讀檔**：載入 `claude_code_syllabus.md`
2. **解析**：逐行識別馬克當元素（標題、段落、列表、表格）
3. **轉換**：對應 `docx` 函式庫 API，套用樣式（顏色、間距、對齊）
4. **輸出**：產生 `claude_code_syllabus.docx` 至專案根目錄

**常見樣式設定**：
- Heading 1：藍色、粗體、頁面分隔符
- Heading 2：深藍、標準字重
- 表格：灰色表頭、邊框、內容置中
- 段落：預設間距、行高 1.5 倍

---

## 注意事項

### 不要做的事
- ❌ 直接編輯 `.docx` 文件（不追蹤版本，下次生成會覆蓋）
- ❌ 在 `generate_syllabus.js` 中硬編碼課程內容（應在 `.md` 檔中維護）
- ❌ 跳過 `spec.md` 直接修改課綱（無法溯源需求變更原因）

### 該做的事
- ✅ 所有課程內容都在 `claude_code_syllabus.md`（馬克當單一源）
- ✅ 每次修改後執行 `node generate_syllabus.js`，提交 `.docx` 同步
- ✅ 在 `spec.md` 和 `todolist.md` 中詳細記錄進度與決策

---

## 測試與驗證

### 課綱內容驗證清單
- [ ] 所有分段時數加總符合課程時限
- [ ] 每個分段都有清晰的「目標」和「議題」
- [ ] 程式碼範例與購物車專案主線一致
- [ ] 超連結正確且指向有效資源
- [ ] 表格欄位對齊、資料完整
- [ ] 無語法錯誤或格式破損

### 生成文件驗證
```powershell
# 執行轉換
node generate_syllabus.js

# 檢查輸出
# - 文件大小正常（>100KB）
# - 可在 Word / Google Docs 中正常開啟
# - 所有馬克當元素正確轉換為 docx 元素
```

---

## 常見問題

**Q：修改課綱後 `.docx` 沒有更新**  
A：確認已執行 `node generate_syllabus.js`，並檢查是否有文件寫入權限。

**Q：如何新增課綱的新分段？**  
A：在 `claude_code_syllabus.md` 中新增 `## 第 N 段` 區塊，包含時長、目標、議題；再執行生成指令。

**Q：表格/程式碼在 `.docx` 中顯示破損**  
A：檢查馬克當語法（表格需完整，程式碼塊需用三個反引號 ` ``` `）；修正後重新生成。

**Q：我需要改變文件樣式（顏色、字型、間距）**  
A：在 `generate_syllabus.js` 中的 `const C = {...}` 和樣式函式中調整；建議先提交 `spec.md` 說明樣式需求。

---

## 資源連結

- **購物車範例實作**：`./shopping-cart/` 目錄
- **課程資源清單**：`./claude_code_curriculum.md`
- **專案計畫**：`./claude_code_project_plan.md`
- **Node.js docx 函式庫**：https://github.com/dolanmiu/docx

---

## 最後提醒

此專案遵循以下原則：
1. **版本控制驅動**：所有課程內容在 `.md` 檔中，`.docx` 是輸出物，不直接編輯
2. **文件即代碼**：`spec.md` 和 `todolist.md` 是需求與進度的唯一真源
3. **可復現性**：任何時刻執行 `node generate_syllabus.js` 都應產出一致的 `.docx` 版本
4. **教學優先**：課程內容決策應優先考慮學習效果，而非技術炫耀或功能堆砌
