const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  Header, Footer, AlignmentType, LevelFormat, HeadingLevel,
  BorderStyle, WidthType, ShadingType, VerticalAlign, PageNumber
} = require('docx');
const fs = require('fs');

// ── 顏色常數 ──────────────────────────────────────
const C = {
  blue:    '1F4E79',
  blue2:   '2E75B6',
  blue3:   'BDD7EE',
  gray:    'F2F2F2',
  gray2:   'D9D9D9',
  white:   'FFFFFF',
  black:   '000000',
  accent:  '375A7F',
  red:     'C00000',
  green:   '548235',
  yellow:  'BF9000',
};

// ── 邊框樣式 ─────────────────────────────────────
const border1 = { style: BorderStyle.SINGLE, size: 1, color: 'CCCCCC' };
const cellBorders = { top: border1, bottom: border1, left: border1, right: border1 };

// ── 輔助函式 ─────────────────────────────────────
function h1(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_1,
    spacing: { before: 360, after: 120 },
    children: [new TextRun({ text, bold: true })]
  });
}

function h2(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 240, after: 80 },
    children: [new TextRun({ text })]
  });
}

function h3(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_3,
    spacing: { before: 180, after: 60 },
    children: [new TextRun({ text, bold: true, color: C.accent })]
  });
}

function p(runs, spacing = { before: 40, after: 40 }) {
  const children = typeof runs === 'string'
    ? [new TextRun(runs)]
    : runs;
  return new Paragraph({ children, spacing });
}

function bullet(runs, level = 0) {
  const children = typeof runs === 'string' ? [new TextRun(runs)] : runs;
  return new Paragraph({
    numbering: { reference: 'bullet-list', level },
    spacing: { before: 30, after: 30 },
    children
  });
}

function numbered(runs, ref = 'num-list-1') {
  const children = typeof runs === 'string' ? [new TextRun(runs)] : runs;
  return new Paragraph({
    numbering: { reference: ref, level: 0 },
    spacing: { before: 30, after: 30 },
    children
  });
}

function bold(text) { return new TextRun({ text, bold: true }); }
function code(text) { return new TextRun({ text, font: 'Courier New', size: 20, bold: true, color: C.accent }); }
function red(text) { return new TextRun({ text, bold: true, color: C.red }); }

function note(text) {
  return new Paragraph({
    spacing: { before: 60, after: 60 },
    indent: { left: 720 },
    children: [new TextRun({ text, italics: true, color: '555555' })]
  });
}

function quote(text) {
  return new Paragraph({
    spacing: { before: 80, after: 80 },
    indent: { left: 360, right: 360 },
    shading: { fill: C.gray, type: ShadingType.CLEAR },
    children: [new TextRun({ text, italics: true, color: C.accent })]
  });
}

function ironLaw(num, name, rule, hint) {
  return new Paragraph({
    spacing: { before: 80, after: 80 },
    indent: { left: 360, right: 360 },
    shading: { fill: 'FFE6E6', type: ShadingType.CLEAR },
    children: [
      new TextRun({ text: `🔴 Iron Law ${num}（${name}）：`, bold: true, color: C.red }),
      new TextRun({ text: rule, bold: true, font: 'Courier New', size: 20 }),
      new TextRun({ text: ` — ${hint}`, italics: true, color: '555555' })
    ]
  });
}

function codeBlock(text) {
  return new Paragraph({
    spacing: { before: 60, after: 60 },
    indent: { left: 360 },
    shading: { fill: C.gray, type: ShadingType.CLEAR },
    children: [new TextRun({ text, font: 'Courier New', size: 18 })]
  });
}

function makeTable(headers, rows, colWidths) {
  const headerRow = new TableRow({
    tableHeader: true,
    children: headers.map((h, i) => new TableCell({
      borders: cellBorders,
      width: { size: colWidths[i], type: WidthType.DXA },
      shading: { fill: C.blue2, type: ShadingType.CLEAR },
      verticalAlign: VerticalAlign.CENTER,
      children: [new Paragraph({
        spacing: { before: 60, after: 60 },
        children: [new TextRun({ text: h, bold: true, color: C.white, size: 20 })]
      })]
    }))
  });

  const dataRows = rows.map((row, ri) => new TableRow({
    children: row.map((cell, i) => new TableCell({
      borders: cellBorders,
      width: { size: colWidths[i], type: WidthType.DXA },
      shading: { fill: ri % 2 === 0 ? C.white : C.gray, type: ShadingType.CLEAR },
      verticalAlign: VerticalAlign.CENTER,
      children: Array.isArray(cell)
        ? cell
        : [new Paragraph({ spacing: { before: 50, after: 50 }, children: [new TextRun({ text: String(cell), size: 20 })] })]
    }))
  }));

  return new Table({
    columnWidths: colWidths,
    margins: { top: 80, bottom: 80, left: 120, right: 120 },
    rows: [headerRow, ...dataRows]
  });
}

function separator() {
  return new Paragraph({
    spacing: { before: 120, after: 120 },
    border: { bottom: { style: BorderStyle.SINGLE, size: 1, color: C.gray2 } },
    children: [new TextRun('')]
  });
}

// ══════════════════════════════════════════════════
// 文件內容
// ══════════════════════════════════════════════════
const doc = new Document({
  styles: {
    default: {
      document: { run: { font: 'Arial', size: 22 } }
    },
    paragraphStyles: [
      { id: 'Heading1', name: 'Heading 1', basedOn: 'Normal', next: 'Normal', quickFormat: true,
        run: { size: 36, bold: true, color: C.blue, font: 'Arial' },
        paragraph: { spacing: { before: 360, after: 120 }, outlineLevel: 0 } },
      { id: 'Heading2', name: 'Heading 2', basedOn: 'Normal', next: 'Normal', quickFormat: true,
        run: { size: 28, bold: true, color: C.blue2, font: 'Arial' },
        paragraph: { spacing: { before: 240, after: 80 }, outlineLevel: 1 } },
      { id: 'Heading3', name: 'Heading 3', basedOn: 'Normal', next: 'Normal', quickFormat: true,
        run: { size: 24, bold: true, color: C.accent, font: 'Arial' },
        paragraph: { spacing: { before: 180, after: 60 }, outlineLevel: 2 } },
    ]
  },
  numbering: {
    config: [
      { reference: 'bullet-list', levels: [
        { level: 0, format: LevelFormat.BULLET, text: '•', alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 720, hanging: 360 } } } },
        { level: 1, format: LevelFormat.BULLET, text: '◦', alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 1080, hanging: 360 } } } },
      ]},
      { reference: 'num-list-1', levels: [{ level: 0, format: LevelFormat.DECIMAL, text: '%1.', alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
      { reference: 'num-list-2', levels: [{ level: 0, format: LevelFormat.DECIMAL, text: '%1.', alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
      { reference: 'num-list-3', levels: [{ level: 0, format: LevelFormat.DECIMAL, text: '%1.', alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
      { reference: 'num-list-4', levels: [{ level: 0, format: LevelFormat.DECIMAL, text: '%1.', alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
    ]
  },
  sections: [{
    properties: {
      page: { margin: { top: 1080, right: 1080, bottom: 1080, left: 1080 } }
    },
    headers: {
      default: new Header({ children: [new Paragraph({
        alignment: AlignmentType.RIGHT,
        border: { bottom: { style: BorderStyle.SINGLE, size: 1, color: C.gray2 } },
        children: [new TextRun({ text: 'Claude Code：全端專案實作與 AI 開發工作流', color: C.accent, size: 18 })]
      })] })
    },
    footers: {
      default: new Footer({ children: [new Paragraph({
        alignment: AlignmentType.CENTER,
        border: { top: { style: BorderStyle.SINGLE, size: 1, color: C.gray2 } },
        children: [
          new TextRun({ text: '第 ', size: 18, color: '888888' }),
          new TextRun({ children: [PageNumber.CURRENT], size: 18, color: '888888' }),
          new TextRun({ text: ' 頁', size: 18, color: '888888' }),
        ]
      })] })
    },
    children: [

      // ── 封面標題 ──────────────────────────────
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 480, after: 160 },
        children: [new TextRun({ text: 'Claude Code', bold: true, size: 64, color: C.blue, font: 'Arial' })]
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 0, after: 120 },
        children: [new TextRun({ text: '全端專案實作與 AI 開發工作流', bold: true, size: 40, color: C.blue2, font: 'Arial' })]
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 60, after: 480 },
        children: [new TextRun({ text: '4 小時線上錄影課程大綱', size: 26, color: '666666' })]
      }),

      // ── 課程定位 ─────────────────────────────
      new Paragraph({
        spacing: { before: 60, after: 160 },
        shading: { fill: C.blue3, type: ShadingType.CLEAR },
        indent: { left: 360, right: 360 },
        children: [new TextRun({
          text: '課程定位：講師將帶領學員以一個真實的全端專案為主線，完整展示如何把 Claude Code 放進日常開發流程。課程聚焦在版本控制、文件驅動、SDD/TDD 開發紀律、Skill 設計、背景 Agent、多模式操作與高效率除錯，讓學員學會一套可以直接搬進工作的做法。',
          italics: true, size: 20
        })]
      }),

      // ── 主專案簡介 ─────────────────────────────
      h1('🛒 課程主專案：購物車系統（Shopping Cart）'),
      p('本課程所有範例、實作與示範，均圍繞同一個購物車系統主線展開。專案涵蓋商品瀏覽、加入購物車、數量管理與結帳表單，讓學員在真實情境中體驗 SDD、TDD、Playwright 驗證、Skill 製作與背景 Agent 的完整工作流。'),
      bullet([bold('技術棧：'), new TextRun(' 後端 Spring Boot 3 + PostgreSQL（Docker）；前端 React + Vite')]),
      bullet([bold('核心實體：'), code('Product'), new TextRun(' 商品、'), code('Cart'), new TextRun(' 購物車、'), code('CartItem'), new TextRun(' 購物車明細')]),
      bullet([bold('五個關鍵商業規則：'), new TextRun(' 加入購物車 / 相同商品合併數量 / 數量改 0 自動移除 / 合計伺服器計算 / 結帳清空')]),
      quote('SDD 示範 Prompt：「請根據需求產出 spec.md：使用者可瀏覽商品並加入購物車；加入相同商品自動合併數量；數量改為 0 則自動移除；購物車合計由伺服器計算；結帳時填收件資料後清空購物車。請先只產出規格，不要寫程式。」'),

      separator(),

      // ════════════════════════════════════════
      // 第 1 段
      // ════════════════════════════════════════
      h1('第 1 段：Git、GitHub 與 Claude Code 起手式（60 mins）'),
      p([bold('目標：'), new TextRun('先建立正確的開發起手式，讓學員理解 Claude Code 不是取代版本控制，而是強化版本控制與專案治理。')]),

      // ── 本章工具一覽 ─────────────────────────────
      h2('📦 本章工具一覽（先看清單，再進細節）'),
      note('本章會用到以下 7 個工具——詳細安裝方式分散在 1-1 / 1-2 / 1-3 / 1-4 各小節，本表先讓你掌握全貌，避免學到中途才發現缺工具。'),
      p(''),
      makeTable(
        ['#', '工具', '用途', '安裝段落', '必要性'],
        [
          ['1', 'Claude Code（CLI）', '主角；終端機 AI 編程工具', '1-1', '⭐ 必裝'],
          ['2', 'Node.js v18+', 'Claude Code CLI 安裝前提 + 前端 React/Vite 開發', '1-1', '⭐ 必裝'],
          ['3', 'VS Code + Claude Code 插件', '圖形化操作介面（與 CLI 二選一或並用）', '1-2', '🔵 推薦'],
          ['4', 'Docker Desktop', '跑 PostgreSQL（後端資料庫）', '1-3', '⭐ 必裝'],
          ['5', 'Git', '版本控制', '1-4', '⭐ 必裝'],
          ['6', 'GitHub CLI（gh）', '從終端機操作 GitHub（建 repo / 開 PR）', '1-4', '⭐ 必裝'],
          ['7', 'Java JDK 21（LTS）', '後端 Spring Boot 3 執行環境（第 2 段使用）', '工具一覽下方', '⭐ 必裝'],
        ],
        [600, 2400, 3600, 1200, 1360]
      ),
      p(''),
      bullet([bold('終端機環境'), new TextRun('（不需安裝，但要知道用哪個）：')]),
      bullet([bold('Windows：'), new TextRun(' PowerShell 7+ 或 Windows Terminal')], 1),
      bullet([bold('macOS：'), new TextRun(' Terminal.app 或 iTerm2')], 1),

      h3('☕ Java JDK 21 安裝快速參考（雙平台對照）'),
      makeTable(
        ['平台', '安裝方式', '驗證指令'],
        [
          ['Windows', '下載 Eclipse Temurin JDK 21 (.msi) → 預設安裝（會自動加入 PATH）', 'PowerShell：java -version（應顯示 21.x）'],
          ['macOS', 'brew install --cask temurin@21  或下載 Temurin JDK 21 .pkg', 'Terminal：java -version'],
        ],
        [1400, 5760, 2200]
      ),
      p(''),
      bullet([bold('為什麼選 Temurin（而非 Oracle JDK）：'), new TextRun(' 開源、免費商用、由 Eclipse 基金會維護的 OpenJDK 發行版，是企業最常用的選擇。')]),
      bullet([bold('為什麼選 21（而非 17 或 latest）：'), new TextRun(' JDK 21 是 LTS 長期支援版（支援到 2031），Spring Boot 3 推薦版本，與本課示範環境一致。')]),
      bullet([bold('Maven 不需另裝：'), new TextRun(' Spring Boot 3 專案使用 Maven Wrapper（'), code('mvnw'), new TextRun(' / '), code('mvnw.cmd'), new TextRun('），跟著專案 clone 即有。')]),
      quote('🟢 建議課前先把 1～7 全部裝完，課程進行時就能聚焦在操作示範與 Prompt 設計，不會被環境問題打斷。'),

      // ── 1-1 ───────────────────────────────────
      h2('1-1 環境安裝、登入與操作模式（20 mins）'),

      bullet([bold('Claude Code 安裝與登入（雙平台對照）：')]),
      makeTable(
        ['平台', '安裝指令', '備註'],
        [
          ['Windows', 'npm install -g @anthropic-ai/claude-code', '需先裝 Node.js v18+，PowerShell 7+ 執行'],
          ['macOS', 'brew install claude-code  或  npm install -g @anthropic-ai/claude-code', 'brew 為主流；Apple Silicon / Intel 通用'],
        ],
        [1400, 4760, 3200]
      ),
      p(''),
      bullet([new TextRun('安裝後共用：'), code('claude doctor'), new TextRun(' 健檢 → '), code('claude'), new TextRun(' 啟動 → '), code('/login'), new TextRun(' 登入 OAuth。')], 1),
      bullet([new TextRun('介紹 '), code('/login'), new TextRun('、模型切換與基本指令：'), code('@'), new TextRun(' 參照、'), code('/help'), new TextRun('、'), code('/init'), new TextRun('。')], 1),

      h3('訂閱方案與費用'),
      makeTable(
        ['方案', '定位', 'Claude Code 預設模型', '備註'],
        [
          ['Pro', '個人開發者', 'Sonnet 4.6', '含 Claude Code 基本用量'],
          ['Max 5x / 20x', '重度個人用戶', 'Opus 4.7', '用量為 Pro 的 5x / 20x'],
          ['Team Standard', '團隊協作', 'Sonnet 4.6', '含管理控制台'],
          ['Team Premium', '團隊重度使用', 'Opus 4.7（預設）', 'Opus 1M 上下文已含'],
          ['Enterprise', '企業合規', 'Opus 4.7（可設定）', 'SSO、自訂政策、合規 API'],
          ['API（按量付費）', '開發者整合', '自選', '依 token 計費'],
        ],
        [1800, 1800, 2200, 2360]
      ),
      p(''),
      bullet([new TextRun('API 用量成本：平均約 '), bold('$6／開發者／天'), new TextRun('，90% 使用者每日低於 $12；月平均 '), bold('$100–200／人'), new TextRun('（使用 Sonnet 4.6）。')], 1),
      bullet([new TextRun('額度重置規則：達到用量上限後 '), bold('每 5 小時重置一次'), new TextRun('（非固定時間點）。超出可開啟「Extra Usage」延續，每日上限 $2,000。')], 1),

      h3('可用模型與選擇策略'),
      makeTable(
        ['別名', '對應模型', '適合場景'],
        [
          ['sonnet', 'Claude Sonnet 4.6', '日常編程（性價比最高）'],
          ['opus', 'Claude Opus 4.7', '複雜架構決策、多步推理'],
          ['haiku', 'Claude Haiku 4.5', '簡單子任務、Agent 分工'],
          ['opusplan', '規劃用 Opus，執行切 Sonnet', '大型任務兼顧品質與成本'],
          ['sonnet[1m] / opus[1m]', '同上 + 100 萬 token 上下文', '超大型程式碼庫'],
        ],
        [1800, 3600, 3360]
      ),
      p(''),
      bullet([new TextRun('模型切換：session 中用 '), code('/model <別名>'), new TextRun('，啟動時用 '), code('--model <別名>'), new TextRun('，或在 '), code('/config'), new TextRun(' 設定預設。')], 1),
      bullet([new TextRun('Effort 等級：'), code('/effort low/medium/high/max'), new TextRun(' 調整推理深度，預設 medium；提示詞中加 ultrathink 可單次觸發 high effort。')], 1),

      h3('VS Code 插件 vs CLI 模式差異'),
      makeTable(
        ['面向', 'VS Code 插件', 'CLI（Terminal）'],
        [
          ['啟動方式', '側邊欄面板 / Ctrl+Shift+C', 'claude 指令'],
          ['檔案參照', '自動感知當前開啟檔案', '需明確 @ 參照'],
          ['適合場景', 'UI 開發、邊寫邊問', '自動化任務、長流程'],
          ['上下文感知', '與編輯器同步', '從終端機角度操作'],
        ],
        [1800, 3780, 3780]
      ),
      p(''),

      h3('五種權限／操作模式'),
      makeTable(
        ['模式', 'VS Code 名稱', 'CLI 對應', '說明'],
        [
          ['逐步確認', 'Ask before edits', 'default', '每次編輯前詢問，適合探索與學習'],
          ['自動編輯', 'Edit automatically', '--permission-mode acceptEdits', '自動接受檔案編輯'],
          ['規劃模式', 'Plan mode', '--permission-mode plan', '只讀不寫；/plan 觸發'],
          ['自動模式', 'Auto mode', '--permission-mode auto --enable-auto-mode', '需 Team/Enterprise/API + Sonnet/Opus 4.7'],
          ['全開模式', 'Bypass permissions', '--permission-mode bypassPermissions', '跳過所有提示，CI 環境使用'],
        ],
        [1400, 2000, 2760, 3200]
      ),
      p(''),

      h3('如何開啟 Auto 與 Bypass 模式（深入版）'),
      bullet([bold('Auto Mode 啟用前提：')]),
      bullet([bold('方案限制：'), new TextRun(' 需 Team / Enterprise / API 方案（個人 Pro / Max 不可用）')], 1),
      bullet([bold('模型限制：'), new TextRun(' 僅 Sonnet 4.6 或 Opus 4.7（不支援 Haiku、Bedrock / Vertex / Foundry）')], 1),
      bullet([bold('組織層級：'), new TextRun(' Team 與 Enterprise 需管理員先在 Claude Code admin settings 啟用')], 1),

      bullet([bold('Auto Mode CLI 啟用方式：')]),
      codeBlock('# 方法 1：啟用後可用 Shift+Tab 循環切換（推薦）\nclaude --enable-auto-mode\n\n# 方法 2：啟動時直接以 auto 為預設模式\nclaude --permission-mode auto\n\n# 方法 3：非互動腳本執行\nclaude -p "refactor the auth module" --permission-mode auto'),
      p([new TextRun('進入 session 後，按 '), bold('Shift+Tab'), new TextRun(' 循環切換：default → acceptEdits → plan → auto。')]),

      bullet([red('Bypass Mode（⚠️ 危險）：')]),
      bullet([new TextRun('Bypass 會'), bold('停用所有權限提示與安全檢查'), new TextRun('，工具呼叫立即執行。僅 .git / .vscode / .idea / 部分 .claude 子目錄寫入仍會提示。')], 1),
      quote('⚠️ 警告：此模式對提示詞注入（prompt injection）完全無保護，僅應在隔離環境（容器、VM、devcontainer）中使用。'),
      codeBlock('# 兩種等效寫法\nclaude --permission-mode bypassPermissions\nclaude --dangerously-skip-permissions\n\n# 讓 bypass 出現在 Shift+Tab 循環中但不作為起始模式\nclaude --allow-dangerously-skip-permissions --permission-mode plan'),

      h3('Auto vs Bypass 對照（決策依據）'),
      makeTable(
        ['項目', 'Auto Mode', 'Bypass Mode'],
        [
          ['權限提示', '無（除非 fallback 觸發）', '無（少數目錄仍提示）'],
          ['安全檢查', '分類器審查每個指令', '完全沒有'],
          ['Token 使用', '較高（分類器呼叫成本）', '標準'],
          ['適用場景', '長時間任務、減少中斷', '僅限隔離容器 / VM'],
          ['風險等級', '中等', '高'],
        ],
        [1800, 3780, 3780]
      ),
      p(''),
      quote('黃金建議：除非確實在沙盒環境中，否則優先選擇 Auto Mode 取代 Bypass Mode。Auto Mode 由分類器在背景阻擋越權或可疑行為（如 curl | bash、生產環境部署、強制推送），保有安全層；Bypass Mode 則完全裸奔。'),

      bullet([bold('管理員控制：'), new TextRun(' 組織管理員可透過 managed settings 全面禁用：'), code('permissions.disableBypassPermissionsMode: "disable"'), new TextRun(' 與 '), code('disableAutoMode: "disable"'), new TextRun('。')]),

      // ── 1-2 ───────────────────────────────────
      h2('1-2 介面導覽：CLI vs VS Code 插件、設定與 CLAUDE.md（15 mins）'),
      note('目標：讓學員在第一次開啟 Claude Code 後就能找到方向——知道介面在哪、設定怎麼改、以及如何把「共識」寫進 CLAUDE.md 讓 Claude 永遠記住。'),

      h3('CLI 介面導覽'),
      bullet([bold('啟動：'), new TextRun(' 在終端機執行 '), code('claude'), new TextRun('，進入互動式 TUI。')]),
      bullet([bold('Windows：'), new TextRun(' PowerShell 7+（推薦）或 Windows Terminal')], 1),
      bullet([bold('macOS：'), new TextRun(' Terminal.app 或 iTerm2（推薦）')], 1),
      bullet([bold('基本佈局：'), new TextRun(' 上方顯示對話上下文（token 用量、模型）；中間對話區；下方輸入提示列（Shift+Enter 換行）。')]),
      bullet([bold('常用快捷鍵：'), code('Ctrl+C'), new TextRun(' 中斷、'), code('Shift+Tab'), new TextRun(' 切換模式、'), code('↑↓'), new TextRun(' 瀏覽歷史。')]),

      h3('重要 CLI 參數速覽'),
      makeTable(
        ['參數', '說明'],
        [
          ['--model <別名>', '啟動時指定模型'],
          ['--permission-mode acceptEdits', '自動接受檔案編輯'],
          ['--print "..."', '非互動單次輸出（腳本用）'],
          ['--resume', '恢復上次 session'],
        ],
        [3600, 5760]
      ),
      p(''),

      h3('VS Code 插件介面導覽'),
      bullet([bold('安裝：'), new TextRun(' 在 VS Code 擴充套件市集搜尋「Claude Code」並安裝。')]),
      bullet([bold('介面區塊：'), new TextRun(' Chat 面板（'), code('@'), new TextRun(' 參照當前檔案）、底部狀態列（模式切換）、Diff 預覽（逐行接受／拒絕）。')]),
      bullet([bold('與 CLI 關鍵差異：'), new TextRun(' VS Code 自動感知開啟檔案、Inline 建議直接嵌入編輯器，適合 UI 開發。')]),

      h3('設定層級：Global vs Project'),
      makeTable(
        ['層級', '位置', '適合放什麼'],
        [
          ['Global（全域）', '~/.claude/settings.json', '個人偏好（預設模型、語言、顏色主題）'],
          ['Global CLAUDE.md', '~/.claude/CLAUDE.md', '跨所有專案的個人慣例'],
          ['Project（專案）', '<專案根>/.claude/settings.json', '專案限定的工具允許清單、MCP server'],
          ['Project CLAUDE.md', '<專案根>/CLAUDE.md', '本專案的架構規範、禁止行為、技術棧'],
        ],
        [2400, 3360, 3600]
      ),
      p(''),
      quote('優先級：Project 設定 > Global 設定。相同 key 以 Project 為準。'),

      h3('CLAUDE.md 怎麼寫（實機示範）'),
      p('CLAUDE.md 是 Claude 每次啟動都會自動讀取的「共識契約」——把規則寫在這裡，就不用每次對話重複說明。'),
      codeBlock(`# Shopping Cart 專案規範

## 技術棧
- 後端：Spring Boot 3 + Java 21 + PostgreSQL 16
- 前端：React 18 + Vite + TypeScript
- 測試：JUnit 5（後端）、Playwright（E2E）

## 命名規範
- API 路徑：小寫 kebab-case（/api/cart-items）
- Java 類別：PascalCase；方法：camelCase
- React 元件：PascalCase；hooks：use 前綴

## 禁止行為
- 禁止在 Java 程式碼中 hardcode 資料庫密碼或 secret key
- 禁止直接修改 spec.md，需先與人類確認

## 常用指令
- 啟動後端：./mvnw spring-boot:run
- 啟動前端：cd frontend && npm run dev
- 執行測試：./mvnw test`),
      bullet([bold('寫法重點：'), new TextRun(' 架構規範、明確「禁止」優於「盡量避免」、常用指令避免猜錯、技術棧版本避免棄用 API。')]),
      bullet([bold('初始化捷徑：'), new TextRun(' 在新專案執行 '), code('/init'), new TextRun('，Claude 自動掃描後產出初版 CLAUDE.md。')]),

      h3('長期記憶三件套：CLAUDE.md / /memory / @path'),
      quote('核心觀念：Claude 每次 session 都是全新的，所有「你希望它下次還記得」的東西都必須寫進磁碟，否則對話一結束就消失。'),
      makeTable(
        ['機制', '用途', '關鍵特性'],
        [
          ['CLAUDE.md', '專案根目錄 Markdown，每次 session 開始自動載入', '/compact 後會從磁碟重新注入；一次性指示寫對話、長期規則寫 CLAUDE.md'],
          ['/memory', '開啟 memory 編輯器，瀏覽 Claude 自動記下的學習筆記', '檔案超過 200 行會降低遵循度，需定期整理'],
          ['@path 匯入', '在 CLAUDE.md 內以 @docs/coding-style.md 引入其他檔案', '把細節拆到獨立檔案，避免 CLAUDE.md 過長'],
        ],
        [1800, 3360, 4200]
      ),
      p(''),
      bullet([bold('實務注意事項：'), new TextRun(' 巢狀 CLAUDE.md 不會在 /compact 後自動重載；指示「失憶」通常是只存在於對話中，搬進 CLAUDE.md 即可解決。')]),

      // ── 1-3 ───────────────────────────────────
      h2('1-3 Docker 安裝與 AI 操作資料庫（5 mins）'),
      bullet([bold('Docker 安裝（雙平台對照）：')]),
      makeTable(
        ['平台', '安裝方式', '驗證指令'],
        [
          ['Windows', '下載 Docker Desktop for Windows 並安裝（需 WSL 2 後端）', 'PowerShell：docker version'],
          ['macOS', 'brew install --cask docker  或下載 Docker Desktop for Mac（區分 Apple Silicon / Intel）', 'Terminal：docker version'],
        ],
        [1400, 5760, 2200]
      ),
      p(''),
      quote('安裝後皆須啟動 Docker Desktop 應用程式，再回到終端機驗證。'),
      bullet([bold('用 Claude Code 操作 Docker：'), new TextRun(' 不需記憶 Docker 指令，直接用自然語言下指令給 Claude。')]),
      bullet([bold('單容器快速啟動：'), new TextRun(' 「請幫我用 Docker 啟動一個 PostgreSQL 16 容器，DB 名稱 shoppingcart，帳號 admin，密碼 secret，並給我對應 Spring Boot application.yml 設定。」')], 1),
      bullet([bold('Docker Compose 結構化管理：'), new TextRun(' 「請幫我建立 docker-compose.yml，包含 PostgreSQL 16…」Compose 檔可納入版控、共用團隊。')], 1),

      // ── 1-4 ───────────────────────────────────
      h2('1-4 Git 常用操作與 gh CLI 協作模式（20 mins）'),

      h3('Git 與 GitHub CLI 安裝（雙平台對照）'),
      makeTable(
        ['工具', 'Windows', 'macOS'],
        [
          ['Git', '下載 Git for Windows → 預設安裝（勾「Git Bash Here」與「Use Git from CMD」）', 'brew install git  或  xcode-select --install（macOS 內建 Xcode CLT 已含 Git）'],
          ['GitHub CLI（gh）', '下載 gh_*_windows_amd64.msi → 執行 .msi 預設安裝', 'brew install gh'],
        ],
        [1800, 3780, 3780]
      ),
      p(''),
      bullet([bold('首次設定（兩平台共用指令）：')]),
      codeBlock('# 設定全局 Git 帳號（替換成你的 GitHub 資訊）\ngit config --global user.name "Your Name"\ngit config --global user.email "your.email@example.com"\n\n# gh 首次認證（會跳轉瀏覽器驗證）\ngh auth login'),
      bullet([bold('驗證安裝（兩平台共用）：'), new TextRun(' 在 PowerShell（Windows）或 Terminal（Mac）執行：')]),
      codeBlock('git --version\ngh --version\ngh auth status'),

      h3('Git 常用 5 個操作'),
      bullet([code('git status'), new TextRun('、'), code('git add'), new TextRun('、'), code('git commit'), new TextRun('、'), code('git push'), new TextRun('、'), code('git pull'), new TextRun(' 的實務用途。')]),
      bullet('不深入原理，直接示範 Claude Code 如何幫你寫 commit message、整理 diff、決定 staging 範圍。', 1),
      bullet('核心觀念：讓 AI 成為你最強的 Git 協作者，而不是取代版控紀律。', 1),

      h3('AI 互動示範（兩個情境）'),
      quote('示範 1（gh）：「請幫我在 GitHub 建立一個名為 shopping-cart 的公開 repo，描述為『Claude Code 課程實作專案』，並把目前資料夾推送上去當第一個 commit。」'),
      bullet('Claude 自動執行 git init / add / commit / gh repo create --public --source . --remote origin --push / 回報 repo 網址。', 1),
      quote('示範 2（git）：「請把目前所有修改整理成一個 commit，commit message 依照 Conventional Commits 格式，然後開一條新分支 feature/add-to-cart 讓我繼續開發。」'),
      bullet('Claude 自動分析 diff / 執行 git add . + git commit -m "feat(cart): 新增加入購物車功能" / git checkout -b feature/add-to-cart / 回報分支狀態。', 1),

      separator(),

      // ════════════════════════════════════════
      // 第 2 段
      // ════════════════════════════════════════
      h1('第 2 段：全端主線實作（105 mins）'),
      p([bold('目標：'), new TextRun('從規格先行（SDD）出發，用全端專案實作完整展示 Claude Code 如何參與設計、撰寫、測試、修正與整合，而不是只做片段生成。')]),

      // ── 2-1 ───────────────────────────────────
      h2('2-1 SDD 規格先行：與 Claude 共同撰寫 spec.md（15 mins）'),
      bullet([bold('什麼是 SDD（Specification-Driven Development）：'), new TextRun(' 先寫規格、再寫程式的開發紀律。規格不是給人看的文件，而是「你與 Claude 的共識契約」。')]),

      bullet([bold('Claude Code 的 SDD 做法：')]),
      numbered([new TextRun('用自然語言描述需求 → 讓 Claude 產出 '), code('spec.md'), new TextRun('（含資料模型、API 端點、頁面行為）。')], 'num-list-1'),
      numbered('與 Claude 確認規格細節，達成共識後才開始開發。', 'num-list-1'),
      numbered([new TextRun('每次任務前 '), code('@spec.md'), new TextRun(' 讓 Claude 取得完整上下文，不重複解釋。')], 'num-list-1'),
      numbered([new TextRun('規格變更時先更新 '), code('spec.md'), new TextRun('，再讓 Claude 依新規格調整程式。')], 'num-list-1'),
      bullet([bold('實機示範：'), new TextRun(' 講師輸入購物車需求描述，讓 Claude 產出完整 spec.md——學員確認規格符合預期後，後續所有開發均以此為基準。')]),

      // ── 2-2 ───────────────────────────────────
      h2('2-2 後端生成、TDD 先行與自主修正循環（30 mins）'),
      bullet([bold('TDD 概念（2 分鐘快講）：')]),
      bullet('Red → Green → Refactor 三循環的實際意義。', 1),
      bullet('為什麼 AI 開發特別適合 TDD：Claude 不「猜測」需求，測試就是最精確的規格說明。', 1),

      bullet([bold('Claude Code 的 TDD 做法：')]),
      bullet([new TextRun('Prompt 範本：「請先針對 '), code('CartService'), new TextRun(' 的購物車邏輯撰寫 JUnit 5 測試，'), bold('不要實作'), new TextRun('，等我確認後再開始。測試場景包含 5 條商業規則。」')], 1),
      bullet([new TextRun('確認測試意圖後 → 開始實作 → '), code('mvn test'), new TextRun(' → 看到 RED → Claude 讀錯誤 → 修正 → GREEN。')], 1),
      bullet([bold('搭配 Auto Mode：'), new TextRun(' 讓 Claude 自主跑完「測試 → 修正 → 再測試」迴圈，不需每步確認。')], 1),
      bullet([bold('啟動方式：'), code('claude --enable-auto-mode'), new TextRun(' Shift+Tab 切到 auto；或直接 '), code('claude --permission-mode auto'), new TextRun('。')], 1),
      bullet([bold('為什麼這裡選 Auto 而非 Bypass：'), new TextRun(' TDD 迴圈需執行 mvn test 與檔案修改，Auto 由分類器把關每個指令（阻擋 curl | bash、強制推送等可疑行為），保留安全層；Bypass 在本機開發環境裸奔，風險過高。')], 1),
      bullet([bold('前提提醒（呼應 1-1）：'), new TextRun(' 需 Team / Enterprise / API 方案 + Sonnet 4.6 或 Opus 4.7。')], 1),

      bullet([bold('根據 spec.md 生成後端骨架：')]),
      bullet([new TextRun('建立 Spring Boot 3 專案、'), code('Product'), new TextRun(' / '), code('Cart'), new TextRun(' / '), code('CartItem'), new TextRun(' Entity、Repository、'), code('CartService'), new TextRun('、'), code('ProductController'), new TextRun(' / '), code('CartController'), new TextRun(' 與 DTO。')], 1),

      // ── 2-3 ───────────────────────────────────
      h2('2-3 前端鷹架與 API 串接（15 mins）'),
      bullet([bold('建立前端主畫面：')]),
      bullet('以 React + Vite 建立商品列表頁（分類篩選 + 商品卡片）、購物車抽屜（CartDrawer）與結帳頁。', 1),
      bullet([new TextRun('先以 '), code('mockProducts.ts'), new TextRun(' 假資料跑起 UI，確認視覺層後再切換串接 API。')], 1),

      bullet([bold('前後端整合：')]),
      bullet([new TextRun('將假資料改為串接 Spring Boot API（'), code('GET /api/products'), new TextRun('、'), code('POST /api/cart/items'), new TextRun('）。')], 1),
      bullet([new TextRun('示範同時 '), code('@CartController.java @cartApi.ts'), new TextRun('，讓 Claude 一次理解串接上下文。')], 1),

      // ── 2-4 ───────────────────────────────────
      h2('2-4 Context 管理、會話控制與真實除錯（35 mins）'),
      note('本節定位：除錯之所以困難，不只是「找不到 bug」，更常是「Claude 在錯誤的上下文中打轉」。本節同步教兩件事：(1) 主動管理 Context 避免 context rot；(2) 透過購物車三個真實 bug 把 context 指令套用到實戰。'),

      h3('為什麼要管理 Context（5 mins）'),
      quote('Claude Code 的 context window 是它的「工作記憶」——所有對話、讀過的檔案、工具輸出、MCP 回應都會不斷累積在裡面。'),
      bullet([bold('Context 有限且邊際遞減：'), new TextRun(' 塞越多 ≠ 效果越好。無關內容會讓 Claude 注意力分散，產生 '), bold('context rot'), new TextRun('（上下文腐化）。')]),
      bullet([bold('徵兆：'), new TextRun(' Claude 變慢、重複問已答過的問題、建議跟先前實作衝突。')]),
      bullet([bold('主動管理 > 被動等待：'), new TextRun(' 在「階段邊界」主動壓縮或清除，比等系統自動觸發好。')]),

      h3('Context 三大操作指令（10 mins）'),
      makeTable(
        ['指令', '用途', '使用時機'],
        [
          ['/clear', '完全清空對話歷史，開始全新 session（檔案不受影響）', '切換到無關的新任務，最乾淨選項'],
          ['/compact', '將對話歷史壓縮成摘要，保留關鍵資訊繼續使用', '一個階段完成但需要保留脈絡時'],
          ['/compact <指令>', '帶指示的壓縮，例：/compact focus on the API layer', '想明確告訴 Claude 壓縮時保留哪些重點'],
          ['/context', '顯示彩色網格，告訴你 context 被什麼佔用', '覺得變慢或想在 compact 前先診斷空間去向'],
        ],
        [2200, 4200, 4360]
      ),
      p(''),
      bullet([bold('三者差異一句話：'), new TextRun(' /clear = 砍掉重練；/compact = 壓縮成摘要；/context = 只看不動。')]),
      bullet([bold('MCP 隱藏成本：'), new TextRun(' 每個 MCP server 注入工具定義到 context，定期用 '), code('/context'), new TextRun(' 檢查、'), code('/mcp'), new TextRun(' 關掉閒置。')]),

      h3('會話狀態控制：/rewind 與 /resume（10 mins）'),
      makeTable(
        ['指令', '作用', '對 Context 的影響'],
        [
          ['/resume', '瀏覽並恢復之前的 session', '載入舊 context，把當時對話歷史重新裝回工作記憶'],
          ['/rewind', '回滾到對話中某時間點（也可 Esc Esc 觸發）', '選擇性刪除 context：可分開處理對話與程式碼'],
          ['/rename', '幫當前 session 取個可讀名稱', '不影響 context 內容，方便日後 /resume 找到'],
          ['/fork', '從當前點分支出去試另一種作法', '兩個方案都保留，可比較'],
        ],
        [1600, 4200, 4960]
      ),
      p(''),

      h3('/rewind 的五個選項（最需要懂）'),
      makeTable(
        ['選項', '行為', '教學示範時機'],
        [
          ['Restore code and conversation', '程式碼跟對話都回滾', '整段方向錯誤時，最徹底'],
          ['Restore conversation', '只回滾對話，程式碼保留', '想保留 Claude 改好的檔案但重新討論'],
          ['Restore code', '只回滾檔案，對話保留（極實用）', 'Claude 改壞了但推理過程還想留著參考'],
          ['Summarize from here', '把這個點之後內容壓縮成摘要', '探索完成、要進下一階段'],
          ['Never mind', '取消', '—'],
        ],
        [3000, 3780, 3980]
      ),
      p(''),
      bullet([bold('四種「清除/回退」工具關鍵差異：'), new TextRun(' /clear = 全部砍光；/compact = 壓縮成摘要；/rewind = 時光機（精準回到某時刻，能分開處理程式碼與對話）；/resume = 從不同 session 把舊 context 叫回來。')]),

      h3('購物車三個真實整合錯誤實戰（10 mins）'),
      note('教學設計：以下三個 bug 不只示範除錯，更示範「在不同 bug 情境下選對 context 指令」。'),
      makeTable(
        ['Bug', '症狀', '使用的 Context 指令', '為什麼這樣選'],
        [
          ['CORS 錯誤', 'React 呼叫 Spring Boot API 時 console 紅字', '/bug → 修完後 /compact focus on cart API contract', 'bug 解掉就壓縮，避免錯誤訊息與探索路徑佔住 context'],
          ['badge 不即時更新', '加入購物車後數字沒變，reload 才對', '同時 @CartContext.tsx @CartBadge.tsx 直接除錯', '兩個檔小、上下文剛好夠'],
          ['數量改後合計未刷新', '拉 - + 後小計沒變', 'Claude 走錯方向 → Esc Esc → Restore code only', '對話分析過 5 種可能性，砍掉太可惜，只退回檔案讓 Claude 換方向重做'],
        ],
        [2000, 2760, 2800, 2200]
      ),
      p(''),
      bullet([bold('關鍵觀念：'), new TextRun(' slash commands 的價值不在「知道名稱」，而在「知道什麼時機切換工作模式」。除錯的 context 越乾淨，Claude 越能聚焦。')]),

      separator(),

      // ════════════════════════════════════════
      // 第 3 段
      // ════════════════════════════════════════
      h1('第 3 段：自動化、Skill 與背景 Agent（75 mins）'),
      p([bold('目標：'), new TextRun('讓學員看到 Claude Code 不只會寫程式，還能自動操作畫面、將規則無程式化為 Skill，以及把耗時長任務交給背景 Agent。')]),

      // ── 3-1 ───────────────────────────────────
      h2('3-1 agent-browser 技能：自動截圖、錄影與產生 SOP（15 mins）'),
      note('定位：透過 agent-browser 技能（inference.sh），Claude 可完整操作瀏覽器——逐步點擊、填表、截圖、錄影，最後自動整理成 Markdown SOP 文件或輸出操作影片，完全不需人工。'),

      h3('工具選擇：agent-browser vs Playwright MCP'),
      makeTable(
        ['面向', 'agent-browser（本節）', 'Playwright MCP（第 2 段）'],
        [
          ['安裝方式', 'infsh CLI（inference.sh）', 'claude mcp add playwright'],
          ['元素互動', '@e ref 語意標籤系統', 'accessibility tree'],
          ['截圖', '✅ 每步可截圖', '✅ browser_screenshot'],
          ['錄影輸出', '✅ record_video: true → .webm', '❌ 不支援'],
          ['游標視覺化', '✅ show_cursor: true（紅點）', '❌ 不支援'],
          ['適合場景', 'SOP 製作、教學錄影、完整操作記錄', '開發中 UI 驗證、即時除錯'],
        ],
        [1800, 3780, 3780]
      ),
      p(''),

      h3('安裝（雙平台對照）'),
      makeTable(
        ['平台', '安裝指令', '備註'],
        [
          ['Windows', 'curl -fsSL https://cli.inference.sh | sh && infsh login', 'PowerShell 7+ 已內建 curl；若失敗請改用 Git Bash'],
          ['macOS', 'curl -fsSL https://cli.inference.sh | sh && infsh login', 'Terminal / iTerm2 直接執行'],
        ],
        [1400, 4760, 3200]
      ),
      p(''),
      quote('兩平台指令相同，差異僅在執行的終端機環境。'),

      h3('示範 Prompt：結帳流程完整截圖 + SOP 文件'),
      quote('「請用 agent-browser 開啟 localhost:5173，啟用錄影與游標顯示，依序操作：(1) 點擊第一個商品加入購物車；(2) 開啟購物車抽屜確認；(3) 點擊結帳並填收件人資訊；(4) 確認結帳成功畫面。每步截圖並記錄操作，最後整理成 checkout-sop.md 並輸出錄影檔。」'),

      h3('企業應用場景'),
      makeTable(
        ['情境', '說明'],
        [
          ['系統操作手冊', '內部系統上線後，自動截圖各功能操作流程'],
          ['申請/註冊流程', '逐步截圖 + 說明，產出新人培訓手冊'],
          ['QA Bug 復現', '自動重現步驟並截圖，直接貼入 issue ticket'],
          ['教學影片', '紅點游標錄影，直接作為 Demo 影片交付'],
        ],
        [2400, 6960]
      ),
      p(''),
      bullet([bold('意義：'), new TextRun(' 一個 Prompt 可取代手動操作 + 截圖 + 紀錄 + 整理，且錄影可直接用於教學或交付。')]),

      // ── 3-2 ───────────────────────────────────
      h2('3-2 用 skill-creator 製作企業資安規範檢查 Skill（25 mins）'),
      bullet([bold('企業情境設定：'), new TextRun(' 假設團隊有一套電商資安規範：禁止硬編碼敏感資訊、購物車合計不可由客戶端傳入、結帳端點必須驗證身份。')]),
      bullet([bold('技能拆解方法：'), new TextRun(' 示範如何把規範整理成 Skill 的輸入、檢查清單、輸出格式與建議修正模板。')]),
      bullet([bold('實機展示：'), new TextRun(' 讓 Claude 協助產出 '), code('security-check.skill.md'), new TextRun('（購物車電商版）：檢查 session ID 偽造、'), code('totalAmount'), new TextRun(' 客戶端傳入、'), code('/checkout'), new TextRun(' 收件資料驗證。立即掃描 CartController.java，預計發現 🔴 高風險項目後現場修正。')]),
      bullet([bold('Hooks 概念（搭配說明）：'), new TextRun(' 介紹 '), code('PreToolUse'), new TextRun(' / '), code('PostToolUse'), new TextRun(' hook 的應用場景，例如：寫入檔案前自動觸發資安檢查。')]),

      // ── 3-3 ───────────────────────────────────
      h2('3-3 開發輔助技能分類導覽（15 mins）'),
      makeTable(
        ['類別', '技能', '使用時機'],
        [
          ['開發輔助', 'skill-creator', '把重複流程固化成可重用工具'],
          ['開發輔助', 'firecrawl', '爬文件、查最新 API、補充知識截止後資料'],
          ['開發紀律', 'superpowers:brainstorming', '任何創意 / 新功能 / 規格發想前必跑'],
          ['開發紀律', 'superpowers:writing-plans', '把 spec 拆成 2-5 分鐘 bite-sized tasks'],
          ['開發紀律', 'superpowers:test-driven-development', '強制 Red → Green → Refactor'],
          ['開發紀律', 'superpowers:systematic-debugging', '任何 bug / 測試失敗時，強制系統化假設驗證'],
          ['開發紀律', 'superpowers:verification-before-completion', '宣稱「完成」前強制執行驗證命令'],
          ['開發紀律', 'superpowers:requesting-code-review', '完成主要功能、合併前自動產出 review 請求'],
          ['開發紀律', 'superpowers:finishing-a-development-branch', '整合完成、要 PR 收尾時的標準流程'],
          ['文件', 'docx', '產出規格文件、結案報告'],
          ['文件', 'pdf', '閱讀與摘要 PDF 規格書或技術文件'],
          ['前端', 'reactcomponents', '快速生成符合專案風格的 React 元件'],
          ['前端', 'web-perf', '效能分析與優化建議'],
          ['測試', 'webapp-testing + Playwright MCP', 'UI 自動化驗證、E2E 測試、瀏覽器自動化控制'],
          ['AI 整合', 'claude-api', '在應用程式中呼叫 Claude API，實作 AI 功能'],
          ['AI 整合', 'agents-sdk', '建立多代理工作流，協同多個 Agent 完成複雜任務'],
        ],
        [1400, 3600, 4360]
      ),
      p(''),
      bullet([bold('判斷原則：'), new TextRun(' Skill 適合有固定流程、需重複使用的任務。')]),
      bullet([bold('superpowers 系列定位：'), new TextRun(' 一整套「強制紀律」技能，第 4 段 4-3 會集中講完整管線（spec → TDD → e2e → PR）。先在這裡知道有這套，下一段就能組合使用。')]),

      // ── 3-4 ───────────────────────────────────
      h2('3-4 深入講解 /agent 背景長任務（20 mins）'),
      bullet([bold('適合交給背景 Agent 的工作：'), new TextRun(' 假資料生成、資料清理、大量網頁搜尋、log 分析、規格比對。')]),
      bullet([bold('不干擾主線的工作法：')]),
      quote('示範 Prompt：「/agent：請按照 @spec.md 的 Product 資料模型，生成 30 筆符合台灣電商風格的商品假資料（3C / 服飾 / 食品各 10 筆），name 與 description 要像真實電商文案，輸出到 src/test/resources/seed-products.json，並產出 DataInitializer.java 啟動時自動載入，完成後回報筆數。」'),
      bullet([bold('Git Worktrees 平行 Session：'), new TextRun(' 介紹 git worktree 讓多個 Agent 在不同分支同時工作互不干擾。適合場景：主線 Agent 改購物車 UI，另一個 Agent 在 feature/coupon 分支開發優惠券。')]),
      bullet([bold('進階觀念：'), new TextRun(' /agent 的價值是把耗時與高噪音工作切出去，而不是把所有工作都丟出去。')]),

      separator(),

      // ════════════════════════════════════════
      // 第 4 段
      // ════════════════════════════════════════
      h1('第 4 段：Review、程式優化與收尾（39 mins）'),
      p([bold('目標：'), new TextRun('建立一套寫完程式後的自我審查與優化流程，讓 Claude Code 變成可長期維護的工程夥伴。')]),

      // ── 4-1 ───────────────────────────────────
      h2('4-1 /review 與 /simplify 內建品質指令（10 mins）'),
      bullet([bold('/review（程式碼審查）：')]),
      bullet('觸發時機：完成一段功能後、提交 PR 前。', 1),
      bullet([new TextRun('三個審查維度：'), bold('正確性'), new TextRun('（邏輯 bug、邊界條件）、'), bold('安全性'), new TextRun('（輸入驗證、注入風險）、'), bold('可讀性'), new TextRun('（命名、結構）。')], 1),
      bullet([new TextRun('進階用法：'), code('/review @src/service/CartService.java'), new TextRun(' 針對特定檔案；課程示範 Claude 找出「addItem() 未處理 quantity <= 0」與「合計用 float 有精度風險」兩個問題。')], 1),

      bullet([bold('/simplify（重構精簡）：')]),
      bullet('觸發時機：功能通過測試後，進行重構階段。', 1),
      bullet('Claude 會找出：過度設計的抽象、重複代碼、可合併的判斷條件。', 1),
      bullet([new TextRun('強調：'), code('/simplify'), new TextRun(' 不改邏輯，只改結構，配合 TDD 確保重構後測試仍通過。')], 1),
      bullet([new TextRun('完整收尾迴圈：'), code('/review'), new TextRun(' → '), code('/simplify'), new TextRun(' → 再 '), code('/review'), new TextRun(' → 確認無誤。')], 1),

      // ── 4-2 ───────────────────────────────────
      h2('4-2 slash commands 完整工作流總覽（17 mins）'),
      bullet([bold('常用指令與最佳時機（依開發工作流順序）：')]),
      bullet([code('/init'), new TextRun(' 在專案一開始定義規則與技術棧。')], 1),
      bullet([code('/plan'), new TextRun(' 大任務開始前讓 Claude 先規劃。')], 1),
      bullet([code('/review'), new TextRun(' 品質把關，PR 前必跑。')], 1),
      bullet([code('/simplify'), new TextRun(' 功能完成後的重構精簡。')], 1),
      bullet([code('/bug'), new TextRun(' 聚焦抓 bug，切換除錯上下文。')], 1),
      bullet([code('/compact'), new TextRun(' 長任務中段或除錯後壓縮上下文。')], 1),
      bullet([code('/clear'), new TextRun(' 開始新任務前清空脈絡。')], 1),
      bullet([code('/rewind'), new TextRun(' 當推理走偏時快速回退。')], 1),
      bullet([code('/resume'), new TextRun(' 跨天接續上次 session。')], 1),
      bullet([code('/rename'), new TextRun(' 幫 session 命名，方便日後 resume 找回。')], 1),
      bullet([code('/context'), new TextRun(' 診斷 context 空間用量。')], 1),

      h3('四個經典 Context 工作流組合（記下來直接用）'),
      bullet([bold('A. Review-then-Rollback（審查後決定去留）')]),
      codeBlock('/diff          # 看 Claude 改了什麼\n   ↓\n不滿意？\n   ↓\nEsc Esc → Restore code only（保留對話脈絡當參考）'),
      bullet([bold('B. 階段交接（Phase Handoff）')]),
      codeBlock('完成第一階段 → /compact focus on the API contract and remaining tasks\n            → 繼續第二階段（context 變輕但重點還在）'),
      bullet([bold('C. Context 體檢')]),
      codeBlock('/context（看總覽）→ 發現 MCP 佔 40%？→ /mcp（停用沒用到的）→ /context（再確認）'),
      bullet([bold('D. 跨天接續工作')]),
      codeBlock('下班前：/rename cart-checkout-day1 → /compact（留乾淨摘要）\n隔天：  /resume → 搜尋「cart-checkout」→ 繼續做'),

      h3('黃金守則（5 條口訣）'),
      bullet([new TextRun({ text: '🟢 ', color: C.green, bold: true }), bold('開新任務前先 /clear'), new TextRun('——比你想像中更能救回應品質')]),
      bullet([new TextRun({ text: '🟡 ', color: C.yellow, bold: true }), bold('階段切換時 /compact'), new TextRun('——不要等自動觸發')]),
      bullet([new TextRun({ text: '🔵 ', color: C.blue2, bold: true }), bold('覺得卡就 /context'), new TextRun('——看哪裡在吃空間')]),
      bullet([new TextRun({ text: '🟣 ', color: '7030A0', bold: true }), bold('一次性指示寫對話、長期規則寫 CLAUDE.md')]),
      bullet([new TextRun({ text: '🔴 ', color: C.red, bold: true }), bold('Claude 走錯路就 /rewind'), new TextRun('——比手動還原檔案快十倍')]),

      bullet([bold('收尾流程：')]),
      bullet('讓 Claude 整理 diff、生成 commit message。', 1),
      bullet([new TextRun('搭配 '), code('gh pr create'), new TextRun(' 發出 PR，Claude 自動生成 PR 說明（含本次購物車功能改動摘要）。')], 1),
      bullet('回顧整堂課工作流：規格（SDD spec.md）→ 開發（TDD CartService）→ 測試（Playwright badge 驗證）→ 假資料（/agent 生成商品）→ review / simplify → 版本控制（gh）。', 1),

      // ── 4-3 ───────────────────────────────────
      h2('4-3 superpowers：spec → TDD → e2e 完整開發控管管線（12 mins）'),
      note('本節定位：前面教的是「Claude 能做什麼」，這節教「怎麼強迫 Claude 守紀律」。superpowers 是 Anthropic 官方 plugin，把開發紀律寫成一整套強制執行的 Skill——不是建議、不是參考，是 Iron Law。'),

      h3('為什麼需要紀律技能'),
      p('AI 寫程式最大的風險不是「寫錯」，而是「自信地寫錯然後說已經完成」。常見失控模式：'),
      bullet('沒寫測試就改程式，跑了一次「看起來對」就宣稱完成'),
      bullet('改完 bug 沒重新跑測試，只看程式碼「應該對」就 commit'),
      bullet('Review 沒做就直接 PR，寄望人類事後找問題'),
      p([new TextRun('superpowers 用 '), bold('Iron Laws（鐵律）'), new TextRun(' 強制 Claude 守紀律——這些技能在 SKILL.md 中明寫「Violating the letter of the rules is violating the spirit of the rules」，讓 Claude 沒有「就這一次例外」的空間。')]),

      h3('三條 Iron Laws（背下來、貼在牆上）'),
      ironLaw('1', 'TDD', 'NO PRODUCTION CODE WITHOUT A FAILING TEST FIRST', '沒有失敗測試就不准寫實作。先寫了？刪掉重來，不准「拿來參考」'),
      ironLaw('2', 'Verification', 'NO COMPLETION CLAIMS WITHOUT FRESH VERIFICATION EVIDENCE', '沒有當下執行驗證指令的證據，不准說「完成」「通過」「修好了」'),
      ironLaw('3', 'Evidence', 'Evidence before claims, always', '禁用「should」「probably」「seems to」「應該」「大概」「看起來」這類字眼'),

      h3('spec → TDD → e2e → PR 完整管線對應'),
      makeTable(
        ['開發階段', '課程實踐', 'superpowers 技能', '強制做的事'],
        [
          ['發想', '商討購物車功能範圍', 'brainstorming', '任何創意 / 新功能前必跑，先發散再收斂'],
          ['規格', '寫 spec.md', 'writing-plans', '拆成 2-5 分鐘 bite-sized tasks'],
          ['執行', '實作 CartService', 'executing-plans', '一個 task 一個 commit，禁止跳步'],
          ['TDD', 'JUnit 測 5 個場景', 'test-driven-development', '強制 Red → Green → Refactor'],
          ['除錯', 'CORS / badge / 合計三個 bug', 'systematic-debugging', '強制系統化假設驗證，禁止亂試運氣'],
          ['e2e 驗收', 'Playwright 驗 badge 即時更新', 'verification-before-completion', '宣稱完成前必須當場執行驗證指令'],
          ['Review', '完成 CartService + Controller', 'requesting-code-review', '自動產出結構化 review 請求'],
          ['PR 收尾', '推到 feature/add-to-cart 開 PR', 'finishing-a-development-branch', '跑全測試、整理 commit、生 PR body、檢查 CI'],
        ],
        [1200, 2600, 2960, 2600]
      ),
      p(''),

      h3('完整流程圖（背下這條鏈就贏了）'),
      codeBlock(`brainstorming  →  writing-plans  →  executing-plans
（發散收斂）       （拆 bite-sized）    （一 task 一 commit）
                                            ↓
test-driven-development  ←─────  systematic-debugging
（Red → Green → Refactor）  ←  bug 出現
        ↓
verification-before-completion
（跑驗證、看真實輸出，禁止「看起來對」）
        ↓
requesting-code-review  →  finishing-a-development-branch  →  PR`),

      h3('實機示範：套到購物車的 CartService'),
      quote('示範 Prompt：「請使用 superpowers:writing-plans 技能，根據 @spec.md 為 CartService 產出實作計畫，存到 docs/superpowers/plans/2026-04-22-cart-service.md。每個 task 限 2-5 分鐘、一 task 一 commit、TDD 先行。」接下來：「請使用 superpowers:executing-plans 執行該計畫，每個 task 結束時用 superpowers:verification-before-completion 確認，禁止使用 should、probably。」'),
      bullet('學員會看到：Claude 不再跳步——每 task「寫測試 → 跑測試確認失敗 → 寫實作 → 跑測試確認通過 → commit」'),
      bullet('Claude 不再亂宣稱完成——每段結束都會跑指令貼輸出'),
      bullet('Plan 文件本身就是審計軌跡，等於 spec → 實作的可追溯記錄'),

      h3('關鍵觀念'),
      bullet([new TextRun('superpowers '), bold('不取代'), new TextRun(' /review /simplify，而是 '), bold('讓它們真正被執行'), new TextRun('——前者是觸發紀律的開關，後者是紀律執行後的精修。')]),
      bullet([bold('企業價值：'), new TextRun(' Iron Laws 是可審計的契約——當 Claude 違反規則時你可以指著 SKILL.md 說「你違反了 Iron Law 1」，遠比「你怎麼又這樣做」有效。')]),
      bullet([bold('安裝：'), code('claude plugin install superpowers'), new TextRun('，安裝後技能會出現在可用 Skill 清單中。')]),

      separator(),

      // ════════════════════════════════════════
      // 第 5 段
      // ════════════════════════════════════════
      h1('第 5 段：Harness Engineering：你一直在做的事，現在有了名字（23 mins）'),
      note('本節定位：這是課程的「概念整合」收尾節點。學員在前四段已接觸 CLAUDE.md、Hooks、/agent、Git Worktrees、TDD 迴圈、/review 與 /simplify——本節幫助他們理解這些實踐共同構成一套 Harness，並提供升級 Harness 的心智模型。'),

      // ── 5-1 ───────────────────────────────────
      h2('5-1 Harness Engineering 是什麼（8 mins）'),
      bullet([bold('馬具比喻：'), new TextRun(' AI 模型是千里馬，Harness 是韁繩、馬鞍、車轅的整套配備——把馬的力量引導成生產力。')]),
      bullet([bold('工程定義：'), new TextRun(' 圍繞 Agent 的執行與治理層，包含工具協調、狀態管理、權限邊界、錯誤恢復、可觀測性與人類審批閘門。')]),
      bullet([bold('關鍵數據：'), new TextRun(' LangChain 不換模型只優化 Harness，Agent 在 Terminal Bench 2.0 從 52.8% 躍升至 66.5%；OpenAI 三人團隊靠 Harness Engineering 在五個月內交付 100 萬行生產程式碼。')]),

      h3('Harness Engineering 的七種常見類型'),
      note('業界尚無單一權威分類，以下是綜合 Anthropic、LangChain、LangGraph、AutoGen、Devin 等社群實務整理出的最常見 7 大類，每一類都在回答一個明確問題。'),
      makeTable(
        ['類型', '管的核心問題', '業界代表實作'],
        [
          ['Context Harness', 'Agent 看到什麼？', 'Claude CLAUDE.md / AGENTS.md、Cursor Rules、RAG、@import'],
          ['Tool Harness', 'Agent 能用什麼工具？', 'MCP server、OpenAI function calling、LangChain Tools、自訂 slash commands'],
          ['Control Flow Harness', 'Agent 怎麼決策與執行？', 'Plan Mode、Auto Mode、Hooks（PreToolUse / PostToolUse）、LangGraph、ReAct'],
          ['Verification Harness', 'Agent 做對沒？', 'TDD 迴圈、CI/CD、/review、/simplify、Devin auto-test、SWE-bench eval'],
          ['State / Memory Harness', 'Agent 記得什麼？', '/compact、/rewind、/resume、MemGPT、ChromaDB、OpenAI Assistant Memory'],
          ['Observability Harness', 'Agent 在做什麼？', '/context、/cost、/stats、LangSmith、Helicone、Phoenix tracing'],
          ['Safety Harness', 'Agent 不能做什麼？', '權限模式（Auto / Bypass）、classifier、沙盒隔離、NeMo Guardrails、LlamaGuard'],
        ],
        [2400, 2400, 4960]
      ),
      p(''),
      quote('🔸 第 8 類（進階／選配）：Multi-Agent Orchestration Harness——管 Agent 怎麼協作？業界代表：Subagent、Git Worktrees 平行 Agent、CrewAI、AutoGen、Anthropic Multi-Agent Research。當你從「單 Agent」走向「Agent 團隊」時才需要。'),

      h3('三個診斷問題：你的 Harness 缺哪一類？'),
      numbered([bold('Claude 一直忘記某個規則嗎？'), new TextRun(' → 缺 Context Harness（沒寫進 CLAUDE.md）')], 'num-list-2'),
      numbered([bold('Claude 做出來品質不穩定嗎？'), new TextRun(' → 缺 Verification Harness（沒有 TDD 或 /review 守門）')], 'num-list-2'),
      numbered([bold('Claude 偶爾會做出危險動作嗎？'), new TextRun(' → 缺 Safety Harness（沒設權限模式或 sandbox）')], 'num-list-2'),
      quote('觀察心法：完整的 Harness 不是一次到位，七類由弱到強逐步補齊——大多數團隊只會卡在 Context 與 Verification 兩類，先補這兩個就能解掉 80% 問題。'),

      // ── 5-2 ───────────────────────────────────
      h2('5-2 課程實踐 ↔ Harness 類型對應（5 mins）'),
      note('教學設計：把 5-1 的七種類型套到課程實踐上，讓學員一眼看到「我學的每個招式各屬於哪一類 Harness」，回去就能用 7 類分類法盤點團隊缺口。'),
      makeTable(
        ['課程中做過的事', '對應的 Harness 組件', '主要 Harness 類型'],
        [
          ['CLAUDE.md、spec.md、@import', '靜態上下文層（Single Source of Truth）', 'Context Harness'],
          ['/clear /compact /rewind /resume 管理對話記憶', '動態狀態管理', 'State / Memory Harness'],
          ['/context /cost /stats 診斷空間用量', '執行可見性', 'Observability Harness'],
          ['MCP server 編排（Playwright、firecrawl）、自訂 Skill', '工具能力擴充', 'Tool Harness'],
          ['Plan Mode → 確認 spec.md → 實作；Auto Mode 自主 TDD', '決策流控制', 'Control Flow + Human-in-the-Loop'],
          ['PreToolUse Hook 觸發 security-check Skill', '架構約束與自動驗證閘門', 'Control Flow（架構約束）'],
          ['JUnit TDD 迴圈（CartService 5 個場景）', '錯誤恢復與回饋迴路', 'Verification Harness'],
          ['Playwright MCP 驗證購物車 badge 更新', '自動化驗收', 'Verification Harness'],
          ['/review + /simplify CartService', '熵管理（防止程式碼庫劣化）', 'Verification（熵管理子類）'],
          ['權限模式（Auto Mode 分類器把關 / Bypass 沙盒）', '動作授權邊界', 'Safety Harness'],
          ['/agent 30 筆商品假資料 + Git Worktrees', '工具協調層、並行 Agent 隔離', 'Multi-Agent Orchestration（進階）'],
          ['superpowers 套組（brainstorming → ... → finishing-branch）', '強制紀律：Iron Laws 升級為可審計契約', 'Verification + Control Flow + Context 三類同時強化'],
        ],
        [3200, 3200, 3360]
      ),
      p(''),
      quote('核心洞察 1：你從課程第一天就在做 Harness Engineering，只是現在有了名字與框架。'),
      quote('核心洞察 2：這堂課七大類全部覆蓋到了——多數團隊只實作其中 2-3 類就上線，真正能拉開差距的是「七類齊備且持續演化」。'),

      // ── 5-3 ───────────────────────────────────
      h2('5-3 三大支柱的工程意涵（5 mins）'),
      numbered([bold('上下文工程（Context Engineering）：'), new TextRun(' CLAUDE.md 是靜態上下文；CI 測試結果、日誌、其他 Agent 進度是動態上下文。Agent 存取不到的資訊等於不存在——文件必須住在 repo 裡。')], 'num-list-3'),
      numbered([bold('架構約束（Architectural Constraints）：'), new TextRun(' 越多約束，決策疲勞越少，Token 利用率越高。用 Hooks 把約束機械性強制執行，而不是靠「善意」。')], 'num-list-3'),
      numbered([bold('熵管理（Entropy Management）：'), new TextRun(' AI 生成的程式碼庫會隨時間劣化（文件與程式碼不一致、命名風格混亂）。定期用 /review、/simplify 或排程 Agent 執行「清理迴圈」。')], 'num-list-3'),

      // ── 5-4 ───────────────────────────────────
      h2('5-4 你的 Harness 升級路徑（5 mins）'),
      makeTable(
        ['層級', '時間', '核心工作'],
        [
          ['Level 1（今天就能做）', '30 分鐘', '建立 CLAUDE.md，寫清架構規範、禁止動作、命名規則，設定 pre-commit hook 執行 lint + test'],
          ['Level 2（1-2 天）',     '1-2 天',  '新增 AGENTS.md（團隊級約定），CI 強制架構約束，定義 Agent 生成 PR 的審查清單'],
          ['Level 3（生產級）',     '1-2 週',  '死循環偵測中間件、可觀測性 Dashboard、熵管理 Agent 排程、Harness A/B 測試'],
        ],
        [2400, 1200, 5760]
      ),
      p(''),
      bullet([bold('陷阱提示：')]),
      bullet([new TextRun('CLAUDE.md 是 Harness 核心——每次 Agent 犯錯，就更新它，'), bold('把它當程式碼一樣維護'), new TextRun('。')], 1),
      bullet('不要過度設計控制流：Harness 要設計成「可拆卸」的，當模型變聰明後能輕鬆移除不必要的控制邏輯。', 1),
      bullet('從嚴格約束開始，隨著 Agent 表現成熟再放寬，而不是反過來。', 1),

      separator(),

      // ════════════════════════════════════════
      // 課程總結
      // ════════════════════════════════════════
      h1('課程總結'),

      h2('一句話收束'),
      quote('這堂課的核心不是「AI 幫你寫更多 code」，而是「你如何設計一條更穩定的開發工作流」——讓 Claude 變成可預測、可治理、可長期維護的工程夥伴，而不是看心情產出的副駕駛。'),

      h2('你在這 4 小時學會的四種能力'),
      makeTable(
        ['能力', '核心招式', '來自的段落'],
        [
          ['共識能力', '用 SDD 寫 spec.md 與 CLAUDE.md，把「你與 Claude 的共識契約」寫進磁碟', '1-2、2-1'],
          ['紀律能力', 'TDD 三循環 + Auto Mode 自主迴圈 + superpowers Iron Laws（沒測試不寫程式、沒驗證不宣稱完成、禁用「應該」「大概」）', '2-2、4-3'],
          ['治理能力', 'Context 主動管理（/clear /compact /context /rewind）+ 權限模式選擇（Auto vs Bypass），決定 Claude 的「記憶」與「動作授權」', '1-1、1-2、2-4、4-2'],
          ['延伸能力', 'Skill 把規則固化、/agent 把長任務切出去、Playwright MCP 讓 Claude 自主驗證 UI、Git Worktrees 平行作業', '3-1～3-4'],
        ],
        [1600, 6160, 1600]
      ),
      p(''),

      h2('三個關鍵心智轉變'),
      numbered([bold('從「下指令」到「設定環境」：'), new TextRun(' 寫 CLAUDE.md > 重複下 prompt；建 Skill > 一次性教學；定義 Hooks > 事後補救。')], 'num-list-4'),
      numbered([bold('從「被動清理 context」到「主動管理 context」：'), new TextRun(' 在階段邊界 /compact、無關任務前 /clear、走偏方向 /rewind，而不是等 Claude 變慢才反應。')], 'num-list-4'),
      numbered([bold('從「全部自己做」到「分流任務」：'), new TextRun(' 主線用 Plan / Edit 模式精修核心邏輯；長噪音任務丟 /agent；可重複流程做成 Skill；想自治就上 Auto Mode。')], 'num-list-4'),

      h2('明天上班就能做的三件事'),
      bullet([new TextRun({ text: '🟢 ', color: C.green, bold: true }), bold('30 分鐘：'), new TextRun('在你手上的專案根目錄建立 CLAUDE.md，寫清架構規範、禁止行為、技術棧版本、常用指令——Claude 從此不會忘。')]),
      bullet([new TextRun({ text: '🟡 ', color: C.yellow, bold: true }), bold('下一次卡住時：'), new TextRun('先按 /context 看 context 被誰吃了，再決定要 /compact 還是 /clear，而不是直接重開 session。')]),
      bullet([new TextRun({ text: '🔴 ', color: C.red, bold: true }), bold('下一次 Claude 走錯方向：'), new TextRun('按 Esc Esc → 選 Restore code only，保留對話分析脈絡，只退回檔案重做——比手動 git checkout 快十倍。')]),

      h2('收束到 Harness Engineering'),
      p('你在第 5 段學到：上面這些做法不是零散技巧，而是圍繞 Agent 的執行與治理層的具體實踐。CLAUDE.md 是靜態上下文層、TDD 迴圈是錯誤恢復層、Hooks 是架構約束層、/review + /simplify 是熵管理層、Plan Mode 是 Human-in-the-Loop 閘門——你不是在「用 AI 寫程式」，你是在設計一套讓 AI 持續產出高品質程式碼的系統。'),
      quote('這就是 Harness Engineering——你一直在做的事，現在有了名字。'),

      h2('課後行動清單'),
      bullet('☐ 為當前專案建立 CLAUDE.md（含技術棧、禁止行為、常用指令）'),
      bullet('☐ 把一個重複流程做成 Skill（資安檢查 / Code review / 文件生成擇一）'),
      bullet('☐ 為一個長噪音任務（如資料生成、log 分析）開一個 /agent 試水'),
      bullet('☐ 在 PR 流程加入 /review + /simplify 的固定收尾'),
      bullet('☐ 練習 /rewind 的五個選項，特別是 Restore code only'),
      bullet('☐ 評估你的方案是否能用 Auto Mode（Team / Enterprise / API + Sonnet 4.6 以上）'),
      bullet('☐ 安裝 superpowers plugin，至少跑過一次 writing-plans + test-driven-development + verification-before-completion 完整管線'),
      bullet('☐ 把三條 Iron Laws 寫進團隊 CLAUDE.md，把紀律從「個人習慣」升級成「團隊契約」'),

      separator(),
      quote('最後提醒：Claude 會持續變強，但能拉開差距的不是「會用哪個指令」，而是「有沒有把工作流設計成可長期維護的 Harness」。這堂課給你的不是 100 個技巧，而是一套可以持續演化的心智模型。'),

    ]
  }]
});

Packer.toBuffer(doc).then(buffer => {
  fs.writeFileSync('claude_code_syllabus.docx', buffer);
  console.log('✅ claude_code_syllabus.docx 生成成功！');
});
