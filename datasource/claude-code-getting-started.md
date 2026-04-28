# Claude Code 完全入門指南：從安裝到實作

> 本文依據 2026-02-16 可取得之官方文件撰寫。

Claude Code 是一套「代理式（agentic）」的編碼工具：它能在終端機理解你的整個程式碼庫、直接編輯檔案、執行命令並協助處理 Git 工作流，把「描述需求 → 產出可執行變更」的流程帶回你最熟悉的 CLI 環境。

本教學聚焦「從 0 到 1」：用官方文件為主的方式，整理 Windows/macOS/Linux 的支援範圍與系統需求、推薦安裝路線（含更新策略）、必要環境變數、登入/憑證與 API 金鑰設定、常用 CLI/互動指令的逐步示例，以及一個可直接照做的小型專案實作，最後附上常見錯誤排除與安全性最佳實務。

**讀者定位與前置知識**

本篇適合以下讀者：你已經會在終端機（Terminal / PowerShell / WSL / Bash）基本操作，並且手上有一個可用的程式碼專案（或願意跟著本文建立範例專案）。你不必熟悉 Claude Code 的進階能力（MCP、hooks、plugins、subagents 等），但至少需要理解「環境變數」「PATH」「基本 Git」與「套件管理（pip / npm / Homebrew / winget 之一）」概念，以便完成安裝與排除常見錯誤。

---

## 平台支援與系統需求

### 官方支援範圍

官方在「設定 Claude Code」中明確列出最低系統需求：macOS 13.0+、Ubuntu 20.04+/Debian 10+、Windows 10+（可透過 WSL 1/WSL 2 或 Git for Windows），並建議在 Bash 或 Zsh 的 shell 體驗最佳；另要求具備網際網路連線，且使用地區需在可用範圍內。

### 系統需求與建議配置表

| 類別 | Windows | macOS | Linux |
| --- | --- | --- | --- |
| 官方最低支援作業系統 | Windows 10+（WSL 1/WSL 2 或 Git for Windows） | macOS 13.0+ | Ubuntu 20.04+/Debian 10+ |
| 官方最低硬體 | RAM 4GB+ | RAM 4GB+ | RAM 4GB+ |
| CPU / 磁碟空間 | 未指定 | 未指定 | 未指定 |
| 網路 | 需要網際網路連線 | 需要網際網路連線 | 需要網際網路連線 |
| Shell 建議 | Git Bash 或 WSL 的 Bash/Zsh | Bash/Zsh 效果最佳 | Bash/Zsh 效果最佳 |
| Node.js 版本 | 僅在「npm 安裝（已棄用）」時需要 Node.js 18+ | 同左 | 同左 |
| Python 版本 | 未指定（Claude Code 本體不要求） | 未指定 | 未指定 |
| 建議硬體（推論） | 大型程式碼庫建議 ≥8GB RAM；大型 monorepo 或多會話並行建議 16GB+ | 同左 | 同左 |

> **為什麼會提「建議 RAM」**：官方指出 Claude Code 在大型程式碼庫可能消耗大量資源，並提供降低負擔的建議（例如定期 `/compact`）。因此本文的硬體建議屬「風險管理型」的推論，而非官方最低門檻。

---

## 安裝與環境設置

### 安裝方式比較

官方「概述」與「設定」文件列出三條主要安裝路線：原生安裝（推薦）、Homebrew、WinGet；並補充原生安裝可在背景自動更新，而 Homebrew / WinGet 則需手動升級。

| 安裝方式 | 適用系統 | 指令入口 | 更新策略 | 何時選它 |
| --- | --- | --- | --- | --- |
| 原生安裝（推薦） | macOS / Linux / WSL / Windows | install.sh / install.ps1 / install.cmd | 背景自動更新（預設） | 一般個人開發機、希望減少維護成本 |
| Homebrew | macOS（典型） | `brew install --cask claude-code` | 不自動更新，需 `brew upgrade claude-code` | 你習慣以 Homebrew 管理 GUI/CLI |
| WinGet | Windows（典型） | `winget install Anthropic.ClaudeCode` | 不自動更新，需 `winget upgrade Anthropic.ClaudeCode` | 你習慣 WinGet、公司政策允許 |
| npm（已棄用） | 全平台 | `npm install -g @anthropic-ai/claude-code` | 隨 npm 版本管理；常見權限/Path 問題 | 僅在你無法使用原生安裝時（且理解風險） |

### 逐平台安裝步驟

#### macOS / Linux / WSL：原生安裝

官方在概述文件提供一行式安裝：

```bash
curl -fsSL https://claude.ai/install.sh | bash
```

**預期輸出（範例）**：

```text
Downloading Claude Code...
Installing to ~/.local/bin/claude
Installation complete.
```

安裝後，官方建議執行 `claude doctor` 用於檢查安裝類型與版本資訊：

```bash
claude doctor
```

**預期輸出（範例）**：

```text
Claude Code doctor
- installMethod: native
- version: 1.x.x
- shell: zsh
- status: OK
```

> 若你用的是 Alpine Linux 或其他 musl/uClibc 發行版，官方指出原生安裝器需要 `libgcc`、`libstdc++`、`ripgrep`，並對 Alpine 給出 `apk add ...` 與 `USE_BUILTIN_RIPGREP=0` 的處理方式。

#### Windows：原生安裝（PowerShell / CMD）

PowerShell：

```powershell
irm https://claude.ai/install.ps1 | iex
```

CMD：

```bat
curl -fsSL https://claude.ai/install.cmd -o install.cmd && install.cmd && del install.cmd
```

安裝後建議執行健康檢查：

```powershell
claude doctor
```

**若出現 `claude` 找不到**，官方的排除方式是把以下路徑加入使用者 PATH（並重啟終端機）：

```text
%USERPROFILE%\.local\bin
```

#### Windows 的終端環境選擇：WSL vs Git Bash

官方對 Windows 提供兩種主要路線：在 WSL（支援 WSL1/WSL2）中使用，或在原生 Windows 透過 Git Bash 使用（需要 Git for Windows）。

若你選擇「原生 Windows + Git Bash」，而 Claude Code 沒有偵測到 Git Bash，官方提供以環境變數指定 `bash.exe` 路徑的方式：

```powershell
$env:CLAUDE_CODE_GIT_BASH_PATH="C:\Program Files\Git\bin\bash.exe"
```

### 版本固定、通道與更新控制

官方指出原生安裝器可接受 `latest`/`stable` 通道或指定版本號（例：`1.0.58`），且安裝時選擇的通道會成為自動更新預設。

安裝 stable 通道（macOS/Linux）：

```bash
curl -fsSL https://claude.ai/install.sh | bash -s stable
```

Windows PowerShell（stable）：

```powershell
& ([scriptblock]::Create((irm https://claude.ai/install.ps1))) stable
```

若你需要停用自動更新，官方提供 `DISABLE_AUTOUPDATER=1` 這個環境變數；也可透過設定檔（settings.json）或 `/config` 調整更新通道。

### 環境變數與企業網路

在企業環境（代理、防火牆、憑證）中，官方強調 Claude Code 透過環境變數支援 HTTP/HTTPS 代理、NO_PROXY 排除、以及自訂 CA / mTLS 等；同時列出需要白名單放行的主機（如 `api.anthropic.com`、`claude.ai`、`platform.claude.com`）。

典型代理設定（範例）：

```bash
export HTTPS_PROXY=https://proxy.example.com:8080
export NO_PROXY="localhost,127.0.0.1,.example.com"
```

**預期效果（範例）**：Claude Code 的對外連線（模型請求、登入）會走代理；若公司防火牆未放行必要網域，登入/請求會失敗或逾時。

### 開發容器（devcontainer）

官方提供一個「預先配置」的 Claude Code devcontainer 參考實作與 Dockerfile，並說明它相容於 VS Code Dev Containers 等工具；同時指出容器內以更強隔離與防火牆規則，讓你可以在特定情境使用 `claude --dangerously-skip-permissions` 進行無人值守操作，但仍警告：即使在 devcontainer 中，若你對不受信任的專案使用跳過權限，仍可能發生資料外洩（包含 Claude Code 認證）。

官方「4 步快速入門」摘要如下：安裝 VS Code 與 Dev Containers 擴充、複製參考儲存庫、用 VS Code 開啟並「Reopen in Container」。

---

## 認證與 API 金鑰設定

官方快速入門明確表示：Claude Code 在互動工作階段需要登入，並提供兩種帳戶來源：Claude.ai（訂閱計畫，推薦）或 Claude Console（具備預付額度的 API 存取）。

### 互動模式登入步驟（最常見）

1. 在專案目錄啟動 Claude Code：

```bash
cd /path/to/your/project
claude
```

2. 首次登入：

```text
/login
```

**預期輸出（範例）**：

```text
Please choose a login method:
1) Claude.ai
2) Claude Console
Open browser to authenticate...
Login successful.
```

### API 金鑰與環境變數（用於 SDK / CI / 特定部署）

Claude Code 的設定參考列出與 API 金鑰高度相關的環境變數：

- `ANTHROPIC_API_KEY`：作為 `X-Api-Key` 標頭送出（典型用於 Claude SDK；互動使用可執行 `/login`）。
- `ANTHROPIC_AUTH_TOKEN`：自訂 `Authorization` 標頭值（會加上 `Bearer` 前綴）。

範例：

```bash
export ANTHROPIC_API_KEY="sk-ant-..."
```

### 如何取得 API 金鑰（Claude Console）

平台文件多處指出：要使用 Claude API，需要 Claude Console 帳戶與 API 金鑰。

> **注意**：你在 Claude Console 建立 API 金鑰時，金鑰會受到「工作區（workspace）」範圍限制：官方說明 API 金鑰限定於特定工作區，且部分資源（如 Files/Batch/Skills）也以工作區隔離。透過 Console 做 Claude Code 的 OAuth 連線時，系統會建立「Claude Code」工作區，但你「無法」為該 Claude Code 工作區建立 API 金鑰（它專門用於 Claude Code 使用與成本追蹤）。

---

## 基礎指令與 CLI 範例

本節分成兩個層次：

- **第一層**：「你每天真的會用到的指令」（互動模式、一次性模式、會話恢復、更新）
- **第二層**：「理解 CLI 旗標」：哪些旗標改變權限/輸出/模型/會話行為，避免踩到安全雷

### 指令對照速查表

| 情境 | 指令 | 核心參數/行為 | 預期輸出（範例） |
| --- | --- | --- | --- |
| 開始互動式工作階段 | `claude` | 啟動 REPL | 顯示歡迎畫面；未登入則提示登入 |
| 帶初始提示開 REPL | `claude "query"` | 以初始提示啟動 REPL | 先執行 query，再進入互動 |
| 一次性查詢（列印模式） | `claude -p "query"` | 查詢後退出；可配 `--output-format` | 直接把回應印到 stdout |
| 管道輸入摘要/解釋 | `cat file \| claude -p "query"` | 適合 logs/patch 摘要 | 輸出對檔案內容的分析 |
| 繼續最近對話 | `claude -c` / `--continue` | 在目前目錄載入最近對話 | 回到先前 session |
| 恢復指定會話 | `claude -r "<session>" "query"` | 用 ID/名稱恢復並附 query | 恢復後執行 query |
| 更新版本 | `claude update` | 更新到最新版本 | 下載並提示重啟/生效 |
| 健康檢查 | `claude doctor` / `/doctor` | 檢查安裝健康狀態 | 顯示版本/安裝方式等 |

### 互動模式：Slash 命令（最常用）

官方「互動模式」文件提供常用內建命令表（並提醒：輸入 `/` 可在 UI 中瀏覽完整列表）。以下挑最常用、對新手最有價值的：

| 命令 | 用途 | 新手建議用法 | 預期輸出（範例） |
| --- | --- | --- | --- |
| `/help` | 取得使用說明 | 卡住就先看它 | 列出可用命令與快捷鍵 |
| `/config` | 開啟設定介面 | 先把「權限/模型/更新」看過一遍 | 顯示分頁式設定 |
| `/doctor` | 檢查健康狀況 | 出問題前先跑一次 | 顯示診斷摘要 |
| `/permissions` | 檢視/更新權限 | 想減少重複提示時使用 | 顯示 allow/ask/deny 規則 |
| `/compact [instructions]` | 壓縮對話降低上下文 | 長對話或大 repo 時常用 | 對話被摘要後變短 |
| `/init` | 初始化 CLAUDE.md | 新 repo 建議第一天就做 | 生成/更新 CLAUDE.md |
| `/logout` | 登出 | 驗證壞掉時先登出再重登 | 清除登入狀態 |

### 列印模式 `-p`：可腳本化的核心

`claude -p`（等同 `--print`）是讓 Claude Code 走向「可組合、可腳本化」的關鍵。

基本用法：

```bash
claude -p "Explain what this repository does"
```

**預期輸出（範例）**：

```text
This repository appears to be...
Key components:
- ...
```

把輸出變成可機器讀（`--output-format json`）：

```bash
claude -p "Summarize the changes" --output-format json
```

**預期輸出（範例）**：

```json
{
  "summary": "…",
  "risk": "…",
  "next_steps": ["…"]
}
```

> 注意：若你希望「JSON 一定符合結構」，CLI 也提供 `--json-schema` 產出符合 JSON Schema 的結果（僅列印模式）。

### 權限與危險旗標：新手必懂的安全邊界

官方安全性文件強調：Claude Code 預設嚴格唯讀；當需要做「編輯檔案、執行測試、執行命令」等動作時，會要求明確授權，使用者可選擇一次性批准或建立允許規則。

CLI 也提供 `--dangerously-skip-permissions` 直接略過權限提示，官方在 CLI 參考中特別標註「謹慎使用」。如果你一定要跑無人值守自動化，官方更傾向用「受控的隔離環境」：例如官方 devcontainer 以防火牆與隔離機制支持該用法，但仍警告只應用在受信任 repo。

---

## 範例專案：從建立到執行

本示例目標：用最少檔案，展示「建立專案 → 執行 → 讓 Claude Code 協助改需求 → 再執行」的閉環。範例語言以 Python 示範，你也可以換成 Node/其他語言，Claude Code 的操作概念一致。

### 專案檔案結構

| 路徑 | 內容 | 目的 |
| --- | --- | --- |
| `app.py` | 一個簡單 CLI 程式 | 示範讀檔/改檔/執行 |
| `tests/test_app.py` | pytest 測試 | 示範「改完要驗證」 |
| `requirements.txt` | `pytest` | 最小依賴 |
| `.gitignore` | 忽略 `.venv/` 等 | 避免污染 repo |

### 建立專案與初版程式

**macOS / Linux / WSL：**

```bash
mkdir cc-hello && cd cc-hello
python -m venv .venv
source .venv/bin/activate
python -m pip install -U pip
```

**Windows PowerShell：**

```powershell
mkdir cc-hello; cd cc-hello
python -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install -U pip
```

建立依賴檔：

```bash
cat > requirements.txt << 'EOF'
pytest==8.3.0
EOF
```

安裝依賴：

```bash
pip install -r requirements.txt
```

**預期輸出（範例）**：

```text
Collecting pytest==8.3.0
...
Successfully installed pytest-8.3.0 ...
```

寫入 `app.py`（初版：只有 `--name`）：

```python
# app.py
import argparse

def greet(name: str) -> str:
    return f"Hello, {name}!"

def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--name", default="World")
    args = parser.parse_args()
    print(greet(args.name))
    return 0

if __name__ == "__main__":
    raise SystemExit(main())
```

寫入測試：

```python
# tests/test_app.py
from app import greet

def test_greet_default():
    assert greet("World") == "Hello, World!"

def test_greet_name():
    assert greet("Ada") == "Hello, Ada!"
```

執行測試：

```bash
pytest -q
```

**預期輸出（範例）**：

```text
2 passed in 0.0Xs
```

### 用 Claude Code 改需求：加入 `--times` 重複輸出

1. 啟動 Claude Code（此時若未登入，會要求登入；或你可先 `/login`）：

```bash
claude
```

2. 在互動模式輸入以下任務（這是「你對 Claude 的提示」，不是 shell 命令）：

```text
> 請幫我把 app.py 的 CLI 增加一個 --times 參數（整數，預設 1）。
> 執行時請重複輸出 greeting 指定次數。
> 同時更新 tests，確保行為正確，並請你跑 pytest。
```

你會看到 Claude Code 依序：找到檔案 → 顯示建議變更 → 要求你批准 → 編輯檔案 →（如你允許）執行測試。官方 quickstart 明確描述了這種「提出變更 → 需要你批准」的互動邏輯。

3. 符合需求的參考版本：

```python
# app.py（參考結果）
import argparse

def greet(name: str) -> str:
    return f"Hello, {name}!"

def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--name", default="World")
    parser.add_argument("--times", type=int, default=1)
    args = parser.parse_args()

    if args.times < 1:
        raise SystemExit("--times must be >= 1")

    for _ in range(args.times):
        print(greet(args.name))
    return 0

if __name__ == "__main__":
    raise SystemExit(main())
```

測試也可擴充為：

```python
# tests/test_app.py（參考增補）
import pytest
from app import greet

def test_greet_default():
    assert greet("World") == "Hello, World!"

def test_greet_name():
    assert greet("Ada") == "Hello, Ada!"

def test_times_validation():
    with pytest.raises(SystemExit):
        raise SystemExit("--times must be >= 1")
```

4. 最終執行程式：

```bash
python app.py --name Ada --times 3
```

**預期輸出**：

```text
Hello, Ada!
Hello, Ada!
Hello, Ada!
```

> 你可以把「常用命令（build/test/lint）」寫進 `CLAUDE.md`，減少 Claude Code 每次都重新探索；官方建議用 `/init` 生成入門版 CLAUDE.md，再逐步精煉。

---

## 常見問題、故障排除與最佳實務

### 常見錯誤與排除清單

| 症狀 | 常見原因 | 官方解法/建議 |
| --- | --- | --- |
| Windows 安裝後 `claude` 找不到 | `claude` 不在 PATH | 把 `%USERPROFILE%\.local\bin` 加入使用者 PATH，重開終端機後再跑 `claude doctor` 驗證。 |
| Windows 顯示「Claude Code on Windows requires git-bash」 | 原生 Windows 需要 Git Bash | 安裝 Git for Windows；必要時設定 `CLAUDE_CODE_GIT_BASH_PATH` 指向 `bash.exe`。 |
| WSL 安裝/執行行為怪、OS 偵測錯誤 | WSL 撿到 Windows 的 `npm/node` | 先 `npm config set os linux`，或改走原生安裝（不依賴 npm/Node）。 |
| 驗證問題（登入失敗或狀態壞掉） | OAuth token/本機狀態異常 | 官方流程：`/logout` → 關閉 Claude Code → 重新 `claude` 登入；仍不行則刪除 `~/.config/claude-code/auth.json` 強制乾淨登入。 |
| 常常要重複批准同一類命令 | 權限規則未配置 | 用 `/permissions` 建立 allow 規則，減少提示疲勞。 |
| WSL 搜尋慢或結果不完整 | 跨檔案系統存取效能問題（例如專案放在 `/mnt/c/`） | 專案移到 Linux 檔案系統（如 `/home/...`），或改用原生 Windows 模式以改善檔案系統效能。 |
| 高 CPU / 高記憶體使用 | 大型程式碼庫、多輪上下文膨脹 | 官方建議：定期 `/compact`、任務間重啟、把大型 build 目錄放進 `.gitignore`。 |

### 最佳實務：把 Claude Code 當成「可驗證」的代理

官方最佳實踐文件把 Claude Code 定位為「能探索、規劃、實作」的代理式環境，並建議將工作拆成**探索 → 規劃 → 實作 → 提交**的階段（尤其當你不熟悉程式碼或改動跨多檔時）。

這對新手最重要的意涵是：不要只要求「幫我改好」，而要要求「改好後用測試/命令驗證」，讓結果可檢查、可重複。

在日常操作上，三個高 ROI 的習慣是：

1. 用 `/init` 建 CLAUDE.md，把 build/test/lint 命令、程式碼風格、命名規則寫進去（保持精簡）。
2. 長對話用 `/compact` 主動控上下文成本與效能。
3. 把「必須每次都做的事」寫成 hooks，而不是只靠提示（例如每次 edit 後自動跑 formatter/linters）。

---

## 延伸學習資源與參考來源

### 入門與指令

- [Claude Code 概述（繁中）](https://code.claude.com/docs/zh-TW/overview)
- [快速入門（繁中）](https://code.claude.com/docs/zh-TW/quickstart)
- [設定/安裝（繁中）](https://code.claude.com/docs/zh-TW/setup)
- [CLI 參考（繁中）](https://code.claude.com/docs/zh-TW/cli-reference)
- [互動模式（繁中）](https://code.claude.com/docs/zh-TW/interactive-mode)

### 配置與團隊協作

- [Claude Code 設定（繁中）](https://code.claude.com/docs/zh-TW/settings)
- [記憶體/CLAUDE.md（繁中）](https://code.claude.com/docs/zh-TW/memory)
- [常見工作流程（繁中）](https://code.claude.com/docs/zh-TW/common-workflows)
- [最佳實踐（繁中）](https://code.claude.com/docs/zh-TW/best-practices)

### 安全與企業環境

- [安全性（繁中）](https://code.claude.com/docs/zh-TW/security)
- [故障排除（繁中）](https://code.claude.com/docs/zh-TW/troubleshooting)
- [企業網路配置（繁中）](https://code.claude.com/docs/zh-TW/network-config)
- [開發容器 devcontainer（繁中）](https://code.claude.com/docs/zh-TW/devcontainer)

### Claude API 與金鑰觀念

- [開始使用 Claude API](https://platform.claude.com/docs/zh-TW/get-started)
- [Agent SDK 快速入門（含 .env / ANTHROPIC_API_KEY 示範）](https://platform.claude.com/docs/zh-TW/agent-sdk/quickstart)
- [工作區與金鑰範圍](https://platform.claude.com/docs/zh-TW/build-with-claude/workspaces)

### 官方來源連結

- **安裝腳本**：`https://claude.ai/install.sh`、`https://claude.ai/install.ps1`、`https://claude.ai/install.cmd`
- **官方產品頁**：[https://claude.com/product/claude-code](https://claude.com/product/claude-code)
- **原始專案**：[https://github.com/anthropics/claude-code](https://github.com/anthropics/claude-code)
- **npm 套件**：[https://www.npmjs.com/package/@anthropic-ai/claude-code](https://www.npmjs.com/package/@anthropic-ai/claude-code)

---

*原文來源：[ui-code.com/archives/841](https://ui-code.com/archives/841)*
