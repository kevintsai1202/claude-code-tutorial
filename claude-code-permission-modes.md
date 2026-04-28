# Claude Code 開啟 Auto Mode 與 Bypass Mode

Claude Code 的權限模式決定 Claude 在執行動作前是否需要使用者確認。本文件說明如何在 CLI、VS Code、Desktop 等介面啟用 **Auto Mode**(自動模式) 與 **Bypass Mode**(略過權限模式),以及兩者的差異與注意事項。

---

## 一、Auto Mode(自動模式)

Auto Mode 讓 Claude 在背景分類器(classifier)的安全檢查下自動執行動作,既能減少權限提示中斷,又比直接略過權限更安全。

### 啟用前提

- **方案限制**:Team、Enterprise 或 API 方案
- **模型限制**:Claude Sonnet 4.6 或 Claude Opus 4.7(不支援 Haiku、claude-3 系列,或 Bedrock、Vertex、Foundry 等第三方供應商)
- **組織層級**:Team 與 Enterprise 需由管理員先在 Claude Code admin settings 中啟用

### CLI 啟用方式

啟動 Claude Code 時加上 `--enable-auto-mode` 旗標,使 auto 可用於 Shift+Tab 的模式循環中:

```bash
claude --enable-auto-mode
```

進入 session 後,按 **Shift+Tab** 循環切換:`default → acceptEdits → plan → auto`。當前模式會顯示在狀態列。

也可以直接以 auto 作為啟動模式:

```bash
claude --permission-mode auto
```

非互動(腳本)執行:

```bash
claude -p "refactor the auth module" --permission-mode auto
```

### VS Code 擴充

先在擴充設定中勾選 **Allow dangerously skip permissions**,「Auto」選項才會出現在送出按鈕旁的模式選擇器中。

### Desktop 與 claude.ai

需先在 Desktop 設定中啟用 Auto Mode,之後會出現在提示框旁的下拉選單中(標籤為「Auto」)。

---

## 二、Bypass Mode(略過所有權限檢查)

Bypass Mode 會 **停用所有權限提示與安全檢查**,工具呼叫會立即執行。僅有 `.git`、`.vscode`、`.idea` 以及部分 `.claude` 子目錄的寫入仍會提示。

> ⚠️ **警告**:此模式對提示詞注入(prompt injection)完全無保護,僅應在隔離環境(容器、VM、devcontainer)中使用。

### CLI 啟用方式

以下兩種指令等效:

```bash
claude --permission-mode bypassPermissions
```

```bash
claude --dangerously-skip-permissions
```

啟動後,`bypassPermissions` 會出現在 Shift+Tab 循環中(位於 plan 與 auto 之間)。

若希望讓 bypass 出現在循環中但不作為起始模式,可搭配 `--allow-dangerously-skip-permissions` 與其他 `--permission-mode` 組合使用:

```bash
claude --allow-dangerously-skip-permissions --permission-mode plan
```

### VS Code 與 Desktop

同樣需先啟用 **Allow dangerously skip permissions**(VS Code)或於 Desktop 設定中啟用,「Bypass permissions」選項才會出現在模式選擇器中。

---

## 三、管理員控制

組織管理員可透過 managed settings 禁用這兩種模式:

- 禁用 Bypass Mode:設定 `permissions.disableBypassPermissionsMode: "disable"`
- 禁用 Auto Mode:設定 `disableAutoMode: "disable"`

---

## 四、兩種模式比較

| 項目 | Auto Mode | Bypass Mode |
|------|-----------|-------------|
| 權限提示 | 無(除非 fallback 觸發) | 無 |
| 安全檢查 | 分類器審查每個指令 | 完全沒有 |
| Token 使用 | 較高(分類器呼叫) | 標準 |
| 適用場景 | 長時間任務、減少中斷 | 僅限隔離容器/VM |
| 風險等級 | 中等 | 高 |

**建議**:除非確實在沙盒環境中,否則優先選擇 Auto Mode 取代 Bypass Mode。Auto Mode 在背景由分類器阻擋越權或可疑行為(如 `curl | bash`、生產環境部署、強制推送等),保有安全層;Bypass Mode 則完全裸奔。

---

## 參考資料

- Claude Code 官方權限模式文件:<https://code.claude.com/docs/en/permission-modes>
- Auto Mode 公告:<https://claude.com/blog/auto-mode>
- Auto Mode 工程深入解析:<https://www.anthropic.com/engineering/claude-code-auto-mode>

---

*文件建立日期:2026 年 4 月 22 日*
