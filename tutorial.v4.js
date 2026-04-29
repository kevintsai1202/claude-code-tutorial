/* ============================================
   Claude Code 互動教學 · 互動邏輯
   ============================================ */

/* ---------- Lightbox for diagrams ---------- */
const lb = document.getElementById('lightbox');
const lbImg = document.getElementById('lightboxImg');
document.querySelectorAll('.figure').forEach(f => {
  f.addEventListener('click', () => {
    lbImg.src = f.dataset.zoom || f.querySelector('img').src;
    lb.classList.add('open');
  });
});
lb.addEventListener('click', () => lb.classList.remove('open'));
document.addEventListener('keydown', e => { if (e.key === 'Escape') lb.classList.remove('open'); });

/* ---------- Sidebar nav active state + progress ---------- */
const navLinks = document.querySelectorAll('.nav a[data-target]');
const sectionIds = ['hero','s1','s1-1','s1-2','s1-3','s1-4','s2','s2-1','s2-2','s2-3','s2-4','s3','s4','s5'];
const visited = new Set(JSON.parse(localStorage.getItem('cc_visited') || '[]'));

function updateProgress() {
  const total = sectionIds.length;
  const done = sectionIds.filter(id => visited.has(id)).length;
  const pct = Math.round(done / total * 100);
  document.getElementById('progressPct').textContent = pct + '%';
  document.getElementById('progressBar').style.width = pct + '%';
  navLinks.forEach(a => {
    if (visited.has(a.dataset.target)) a.classList.add('done');
  });
}
updateProgress();

const observer = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      const id = e.target.id;
      navLinks.forEach(a => a.classList.toggle('active', a.dataset.target === id));
      visited.add(id);
      localStorage.setItem('cc_visited', JSON.stringify([...visited]));
      updateProgress();
    }
  });
}, { rootMargin: '-30% 0px -60% 0px' });
sectionIds.forEach(id => { const el = document.getElementById(id); if (el) observer.observe(el); });

/* ============================================
   DEMO 1: PERMISSION MODES
   ============================================ */
const PM_DATA = {
  ask: {
    name: '逐步確認 · Ask before edits',
    cli: 'claude  (預設)',
    meta: '每次編輯前詢問 — 適合探索與學習',
    flow: [
      '› 修改 cartService.ts，加入 quantity ≤ 0 的判斷',
      'Claude: 我想修改 src/server/services/cartService.ts',
      '       新增第 24-30 行的條件判斷',
      '       <span style="color:#f0c884">[ 1 ] 接受  [ 2 ] 拒絕  [ 3 ] 看 diff</span>',
      '› 1',
      '<span style="color:#88b59a">✓ 已寫入 cartService.ts</span>'
    ]
  },
  edit: {
    name: '自動編輯 · Edit automatically',
    cli: 'claude --permission-mode acceptEdits',
    meta: '自動接受檔案編輯，不需手動確認每次修改',
    flow: [
      '› 在 cartRepo.ts 補上 findByCartId 方法',
      'Claude: 寫入 src/server/repos/cartRepo.ts',
      '<span style="color:#88b59a">✓ +12 行 / -0 行</span>',
      'Claude: 寫入 src/server/services/cartService.ts',
      '<span style="color:#88b59a">✓ +4 行 / -1 行</span>',
      '<span style="color:#8a7f70">// 不再逐次詢問，但工具呼叫（bash 等）仍會詢問</span>'
    ]
  },
  plan: {
    name: '規劃模式 · Plan mode',
    cli: 'claude --permission-mode plan',
    meta: '只讀不寫：探索程式碼、提出計畫，再切模式執行',
    flow: [
      '› 我想新增「結帳前驗證庫存」流程',
      'Claude: <span style="color:#f0c884">📋 計畫（只讀）</span>',
      '  1. 在 productRepo 加 findStockById',
      '  2. 在 checkout flow 插入庫存檢查',
      '  3. 不足則回 409 + 友善訊息',
      '  影響：cart.routes.ts / checkoutService.ts',
      '<span style="color:#8a7f70">// 確認方向 → Shift+Tab 切到 acceptEdits 開工</span>'
    ]
  },
  auto: {
    name: '自動模式 · Auto mode',
    cli: 'claude --enable-auto-mode',
    meta: '由背景 classifier 模型審核每個操作 · 需 Team / Enterprise / API + Sonnet 4.6 / Opus 4.7',
    flow: [
      '› 跑 TDD 直到 cartService 全綠',
      '<span style="color:#8a7f70">[classifier] ✓ npm test  — 安全</span>',
      '<span style="color:#e07a6a">FAIL  ✗ adds new item</span>',
      '<span style="color:#8a7f70">[classifier] ✓ 寫入 cartService.ts — 安全</span>',
      '<span style="color:#88b59a">PASS  ✓ adds new item</span>',
      '<span style="color:#e07a6a">[classifier] ✗ curl | bash — 阻擋</span>',
      '<span style="color:#88b59a">✓ 五個場景全綠 · 共 3 次自主修正</span>'
    ]
  },
  bypass: {
    name: '全開模式 · Bypass permissions',
    cli: 'claude --dangerously-skip-permissions',
    meta: '⚠ 跳過所有權限提示，僅應在隔離容器 / VM 中使用',
    flow: [
      '<span style="color:#e07a6a">⚠ 你已停用所有安全檢查</span>',
      '› 重設整個 db schema',
      '<span style="color:#88b59a">✓ DROP TABLE cart_items</span>',
      '<span style="color:#88b59a">✓ DROP TABLE products</span>',
      '<span style="color:#88b59a">✓ migrate reset</span>',
      '<span style="color:#8a7f70">// 工具呼叫立即執行，僅 .git/.vscode/.idea 仍提示</span>',
      '<span style="color:#f0c884">建議：除非沙盒，請優先使用 Auto Mode</span>'
    ]
  }
};
const pmTabs = document.getElementById('pmTabs');
const pmExplain = document.getElementById('pmExplain');
const pmFlow = document.getElementById('pmFlow');
function renderPm(mode) {
  const d = PM_DATA[mode];
  pmExplain.innerHTML = `
    <h4>${d.name}</h4>
    <div class="pm-cli">$ ${d.cli}</div>
    <div class="pm-meta">${d.meta}</div>`;
  pmFlow.innerHTML = d.flow.map(line => `<div class="pm-step">${line}</div>`).join('');
}
pmTabs.addEventListener('click', e => {
  const btn = e.target.closest('.pm-tab');
  if (!btn) return;
  pmTabs.querySelectorAll('.pm-tab').forEach(b => b.classList.toggle('active', b === btn));
  renderPm(btn.dataset.mode);
});
renderPm('ask');

/* ============================================
   DEMO 2: CLI SIMULATOR
   ============================================ */
const cliSim = document.getElementById('cliSim');
const cliInput = document.getElementById('cliInput');

function cliPrint(html, cls = '') {
  const div = document.createElement('div');
  div.className = 'cli-line' + (cls ? ' ' + cls : '');
  div.innerHTML = html;
  cliSim.appendChild(div);
  cliSim.scrollTop = cliSim.scrollHeight;
}

function cliBoot() {
  cliSim.innerHTML = '';
  cliPrint('<span class="cli-dim">╭─ Claude Code v2.5.0 ────────────────────────╮</span>');
  cliPrint('<span class="cli-dim">│</span>  <span class="cli-hi">claude</span> · <span class="cli-ok">sonnet 4.6</span> · 195k context');
  cliPrint('<span class="cli-dim">│</span>  cwd: <span class="cli-hi">~/projects/shopping-cart</span>');
  cliPrint('<span class="cli-dim">│</span>  載入 <span class="cli-ok">CLAUDE.md</span> ✓ (4.2k tokens)');
  cliPrint('<span class="cli-dim">╰─────────────────────────────────────────────╯</span>');
  cliPrint('');
  cliPrint('<span class="cli-dim">輸入 /help 看可用指令，或 @path 引入檔案</span>');
  cliPrint('');
}
cliBoot();

const CLI_RESPONSES = {
  '/help': () => {
    cliPrint('<span class="cli-hi">可用 slash commands：</span>');
    cliPrint('  <span class="cli-ok">/init</span>      初始化 CLAUDE.md');
    cliPrint('  <span class="cli-ok">/model</span>     切換模型 (sonnet / opus / haiku / opusplan)');
    cliPrint('  <span class="cli-ok">/context</span>   顯示 context 用量');
    cliPrint('  <span class="cli-ok">/clear</span>     清空對話');
    cliPrint('  <span class="cli-ok">/compact</span>   壓縮對話歷史成摘要');
    cliPrint('  <span class="cli-ok">/rewind</span>    回到對話某時間點');
    cliPrint('  <span class="cli-ok">/resume</span>    恢復先前 session');
    cliPrint('  <span class="cli-ok">/review</span>    程式碼審查');
    cliPrint('  <span class="cli-ok">/simplify</span>  重構精簡');
    cliPrint('  <span class="cli-ok">/agent</span>     交給背景 agent 執行');
    cliPrint('  <span class="cli-ok">/plan</span>      切換規劃模式');
  },
  '/init': () => {
    cliPrint('<span class="cli-hi">⠋</span> 掃描專案結構...');
    setTimeout(() => cliPrint('<span class="cli-hi">⠋</span> 偵測到 Node.js + Express + React + Vite'), 200);
    setTimeout(() => cliPrint('<span class="cli-hi">⠋</span> 偵測到 docker-compose.yml (PostgreSQL 16)'), 400);
    setTimeout(() => cliPrint('<span class="cli-hi">⠋</span> 偵測到 vitest.config.ts'), 600);
    setTimeout(() => {
      cliPrint('<span class="cli-ok">✓ CLAUDE.md 已生成於專案根目錄 (87 行)</span>');
      cliPrint('<span class="cli-dim">  → 包含技術棧、命名規範、禁止行為、常用指令</span>');
    }, 800);
  },
  '/context': () => {
    cliPrint('<span class="cli-hi">Context · 98k / 200k tokens (49%)</span>');
    cliPrint('');
    cliPrint('  <span style="color:#d97757">█████████</span> 系統 Prompt        14k  (7%)');
    cliPrint('  <span style="color:#88b59a">██████</span>      CLAUDE.md           4k  (2%)');
    cliPrint('  <span style="color:#f0c884">████████</span>    MCP 工具定義        9k  (4.5%)');
    cliPrint('  <span style="color:#5a6f8c">██████████████</span> 對話歷史       42k  (21%)');
    cliPrint('  <span style="color:#c79134">█████████</span>   讀過的檔案         29k  (14.5%)');
    cliPrint('');
    cliPrint('<span class="cli-dim">  剩餘可用：102k tokens</span>');
    cliPrint('<span class="cli-dim">  💡 MCP 佔 4.5% · 用 /mcp 停用閒置 server</span>');
  },
  '/clear': () => { cliBoot(); },
  'clear':  () => { cliBoot(); },
  '/compact': () => {
    cliPrint('<span class="cli-hi">⠋</span> 壓縮對話歷史中...');
    setTimeout(() => {
      cliPrint('<span class="cli-ok">✓ 壓縮完成</span>');
      cliPrint('<span class="cli-dim">  原 42k → 6.8k tokens (-84%)</span>');
      cliPrint('<span class="cli-dim">  保留：spec 共識 / TDD 失敗修正 / 當前 CartService 實作</span>');
    }, 600);
  },
  '/rewind': () => {
    cliPrint('<span class="cli-hi">/rewind</span> · 選擇要回到的時間點：');
    cliPrint('  <span class="cli-ok">[1]</span> 10:51  cartService 全綠');
    cliPrint('  <span class="cli-ok">[2]</span> 10:34  產出 cartService.ts');
    cliPrint('  <span class="cli-ok">[3]</span> 10:18  寫好五個測試');
    cliPrint('  <span class="cli-ok">[4]</span> 10:02  需求討論完成');
    cliPrint('<span class="cli-dim">  選擇後可選：Restore code / conversation / both</span>');
  },
  '/resume': () => {
    cliPrint('<span class="cli-hi">最近的 session：</span>');
    cliPrint('  <span class="cli-ok">●</span> cart-checkout-day1   昨天 18:32   (42 條訊息)');
    cliPrint('  <span class="cli-ok">●</span> auth-refactor        2 天前       (87 條訊息)');
    cliPrint('  <span class="cli-ok">●</span> seed-products        3 天前       (12 條訊息)');
  },
  '/review': () => {
    cliPrint('<span class="cli-hi">⠋</span> 審查 src/server/services/cartService.ts...');
    setTimeout(() => {
      cliPrint('<span class="cli-err">⚠ 正確性</span>  L24 addItem() 未處理 quantity ≤ 0 的輸入');
      cliPrint('<span class="cli-err">⚠ 安全性</span>  L41 totalAmount 直接從 req.body 取出');
      cliPrint('<span class="cli-hi">○ 可讀性</span>  L67 巢狀 if 太深，建議抽 guard clause');
    }, 700);
  },
  '/simplify': () => {
    cliPrint('<span class="cli-hi">⠋</span> 分析重複片段與可合併條件...');
    setTimeout(() => {
      cliPrint('<span class="cli-ok">✓</span> findOrCreate() 與 upsert() 邏輯重複 → 合併為一');
      cliPrint('<span class="cli-ok">✓</span> 三個 if 可改 early-return guard 風格');
      cliPrint('<span class="cli-dim">  /simplify 不改邏輯，僅改結構。配合 TDD 確保測試仍通過。</span>');
    }, 600);
  },
  '/plan': () => {
    cliPrint('<span class="cli-hi">→ 切換到 Plan mode（只讀不寫）</span>');
    cliPrint('<span class="cli-dim">  Claude 將先提出計畫，等你確認再執行</span>');
  }
};

function handleCli(raw) {
  const cmd = raw.trim();
  if (!cmd) return;
  cliPrint(`<span class="cli-prompt">›</span> ${escapeHtml(cmd)}`);

  // model
  if (cmd.startsWith('/model')) {
    const m = cmd.split(/\s+/)[1] || '';
    if (!m) cliPrint('<span class="cli-hi">當前模型：sonnet · 4.6</span>');
    else if (['sonnet','opus','haiku','opusplan','sonnet[1m]','opus[1m]'].includes(m)) {
      cliPrint(`<span class="cli-ok">✓ 已切換到 ${m}</span>`);
    } else cliPrint(`<span class="cli-err">未知別名：${m}</span>`);
    return;
  }

  // /agent
  if (cmd.startsWith('/agent')) {
    const task = cmd.slice(7).trim() || '描述任務';
    cliPrint(`<span class="cli-hi">⠋</span> 派遣背景 agent → "${escapeHtml(task)}"`);
    setTimeout(() => cliPrint('<span class="cli-dim">  agent 在獨立 worktree 執行 · 你可繼續主線開發</span>'), 300);
    setTimeout(() => cliPrint('<span class="cli-ok">✓ 完成 · 寫入 src/server/seeds/seed-products.json (30 筆)</span>'), 1500);
    return;
  }

  // @file
  if (cmd.startsWith('@')) {
    const path = cmd.slice(1).split(/\s+/)[0];
    cliPrint(`<span class="cli-ok">✓ 已引入 ${path}</span> <span class="cli-dim">(讀入 context)</span>`);
    return;
  }

  // claude doctor
  if (cmd === 'claude doctor') {
    cliPrint('<span class="cli-ok">✓</span> Claude Code v2.5.0');
    cliPrint('<span class="cli-ok">✓</span> Node.js v20.11.0');
    cliPrint('<span class="cli-ok">✓</span> OAuth 已登入 · Pro 方案');
    cliPrint('<span class="cli-ok">✓</span> 網路連線正常');
    return;
  }

  if (CLI_RESPONSES[cmd]) { CLI_RESPONSES[cmd](); return; }
  if (CLI_RESPONSES[cmd.split(/\s+/)[0]]) { CLI_RESPONSES[cmd.split(/\s+/)[0]](); return; }

  // natural language
  cliPrint('<span class="cli-hi">⠋</span> Claude 思考中...');
  setTimeout(() => {
    const replies = [
      '我會 (1) 讀 spec.md (2) 寫對應測試 (3) 等你確認後再實作',
      '建議先 /plan 看計畫；要直接開工請按 Shift+Tab 切到 acceptEdits',
      '已參考 CLAUDE.md 的命名規範與技術棧版本，準備產出'
    ];
    cliPrint(`<span class="cli-dim">  ${replies[Math.floor(Math.random()*replies.length)]}</span>`);
  }, 600);
}

cliInput.addEventListener('keydown', e => {
  if (e.key === 'Enter') {
    handleCli(cliInput.value);
    cliInput.value = '';
  }
});
document.querySelectorAll('.cli-chip').forEach(c => {
  c.addEventListener('click', () => { handleCli(c.dataset.cmd); cliInput.focus(); });
});
function escapeHtml(s) { return s.replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }

/* ============================================
   DEMO 3: SLASH / SKILLS CHEATSHEET
   ============================================ */
const SLASH = [
  // Context 管理 (極大影響)
  { cat:'context', cmd:'/clear',     impact:5, purpose:'完全清空對話歷史，開始全新 session',                        when:'切換到無關的新任務' },
  { cat:'context', cmd:'/compact',   impact:4, purpose:'壓縮對話歷史成摘要，保留關鍵資訊繼續使用',                  when:'階段完成但需保留脈絡' },
  { cat:'context', cmd:'/compact <指令>', impact:4, purpose:'帶提示的壓縮：保留你關心的面向（如 cart API contract）', when:'壓縮但要鎖定特定主題' },
  { cat:'context', cmd:'/context',   impact:1, purpose:'顯示彩色網格，告訴你 context 被什麼佔用（系統/MCP/檔案/對話）', when:'覺得變慢時先診斷' },
  // 長期記憶 (跨 session)
  { cat:'memory', cmd:'CLAUDE.md',   impact:5, purpose:'專案層的 Markdown 共識契約 · 每次 session 啟動都自動載入', when:'寫架構決策、命名規範、禁止行為' },
  { cat:'memory', cmd:'/memory',     impact:3, purpose:'開啟 memory 編輯器，瀏覽 Claude 記得的所有事',              when:'想看 Claude 記住了什麼' },
  { cat:'memory', cmd:'@path',       impact:2, purpose:'把指定檔/資料夾匯入 context，避開 CLAUDE.md 本體膨脹',     when:'單次需要某個檔案' },
  // 會話控制 (/rewind 系列 + resume)
  { cat:'flow', cmd:'/resume',       impact:4, purpose:'瀏覽並恢復先前的 session（可選 5 個最近）',                when:'跨天接續上次的工作' },
  { cat:'flow', cmd:'/rewind',       impact:5, purpose:'回到對話某時間點，可分別處理對話與程式碼',                  when:'Claude 走錯方向（Esc Esc 快捷）' },
  { cat:'flow', cmd:'/fork',         impact:3, purpose:'從當前點分支出去試另一種作法，不影響主線',                  when:'想比較兩種方案' },
  { cat:'flow', cmd:'/rename',       impact:1, purpose:'幫當前 session 取個可讀名稱',                               when:'下班前命名 + /compact' },
  // 效能優化 (model / mcp / agent)
  { cat:'perf', cmd:'/model',        impact:2, purpose:'切換 Opus / Sonnet / Haiku（不同情境用不同模型）',          when:'規劃用 Opus、實作用 Sonnet' },
  { cat:'perf', cmd:'/effort',       impact:2, purpose:'設定推理深度 low / medium / high / max / auto',             when:'簡單任務不需要 max' },
  { cat:'perf', cmd:'/mcp',          impact:4, purpose:'管理 MCP 伺服器連線（停用閒置 server 可釋放 token）',       when:'/context 顯示 MCP 過大' },
  { cat:'perf', cmd:'/agents',       impact:3, purpose:'啟用 subagent 用獨立 context 執行任務',                     when:'長任務交背景，主線不卡' },
  { cat:'perf', cmd:'/permissions',  impact:2, purpose:'管理 Claude 可自動執行的動作範圍',                          when:'切換 ask / accept / plan' },
  // 監控診斷 (/cost / /status / /doctor)
  { cat:'observe', cmd:'/cost',      impact:2, purpose:'查看 token 用量、session 時長、程式碼變更量',               when:'想知道這次花了多少' },
  { cat:'observe', cmd:'/status',    impact:1, purpose:'查看帳號、模型、權限資訊',                                  when:'確認當前模型沒切錯' },
  { cat:'observe', cmd:'/stats',     impact:2, purpose:'用量統計與分析報表',                                        when:'每週/月看自己用得對不對' },
  { cat:'observe', cmd:'/doctor',    impact:3, purpose:'檢查安裝健康狀態（Node / OAuth / 網路）',                   when:'裝完或出問題時' },
  { cat:'observe', cmd:'/diff',      impact:2, purpose:'互動式檢視未 commit 的變更',                                when:'PR 前最後檢查' }
];

/* 影響度量 → 顏色與標籤 */
const IMPACT = {
  5: { name:'極大影響', color:'#c94f3c' },
  4: { name:'大影響',   color:'#d97757' },
  3: { name:'中影響',   color:'#c79134' },
  2: { name:'小影響',   color:'#88a07a' },
  1: { name:'低影響',   color:'#7a8aa0' }
};

const slashGrid = document.getElementById('slashGrid');
const slashFilter = document.getElementById('slashFilter');
function renderSlash(cat) {
  const items = cat === 'all' ? SLASH : SLASH.filter(s => s.cat === cat);
  // sort by impact desc within filter
  items.sort((a,b) => b.impact - a.impact);
  slashGrid.innerHTML = items.map(s => {
    const imp = IMPACT[s.impact];
    return `
    <div class="slash-card" data-impact="${s.impact}">
      <div class="slash-card-top">
        <div class="slash-cmd">${s.cmd}</div>
        <span class="slash-impact" style="background:${imp.color}1f;color:${imp.color};border-color:${imp.color}55;">${imp.name}</span>
      </div>
      <div class="slash-purpose">${s.purpose}</div>
      <div class="slash-when"><b>時機：</b>${s.when}</div>
    </div>`;
  }).join('');
}
slashFilter.addEventListener('click', e => {
  const btn = e.target.closest('.slash-pill');
  if (!btn) return;
  slashFilter.querySelectorAll('.slash-pill').forEach(p => p.classList.toggle('active', p === btn));
  renderSlash(btn.dataset.cat);
});
renderSlash('all');

/* ============================================
   DEMO 4: CONTEXT VIZ
   ============================================ */
const CTX_INIT = [
  { key:'system',  label:'系統 Prompt',   val:14, color:'#d97757' },
  { key:'claudemd',label:'CLAUDE.md',     val: 4, color:'#88b59a' },
  { key:'mcp',     label:'MCP 工具定義',  val: 3, color:'#f0c884' },
  { key:'chat',    label:'對話歷史',      val: 8, color:'#5a6f8c' },
  { key:'files',   label:'讀過的檔案',    val: 6, color:'#c79134' }
];
let CTX = JSON.parse(JSON.stringify(CTX_INIT));
const ctxMeter  = document.getElementById('ctxMeter');
const ctxLegend = document.getElementById('ctxLegend');
const ctxUsed   = document.getElementById('ctxUsed');
const ctxPct    = document.getElementById('ctxPct');
const ctxTip    = document.getElementById('ctxTip');
function renderCtx() {
  const total = CTX.reduce((s,x) => s + x.val, 0);
  ctxMeter.innerHTML = CTX.map(c =>
    `<div class="ctx-seg" style="background:${c.color}; flex:${c.val} 1 0;" title="${c.label} ${c.val}k"></div>`
  ).join('') + `<div class="ctx-seg" style="background:#3a342d; flex:${Math.max(0,200-total)} 1 0;"></div>`;
  ctxLegend.innerHTML = CTX.map(c =>
    `<div class="ctx-legend-row"><span class="ctx-swatch" style="background:${c.color}"></span><span>${c.label}</span><span style="margin-left:auto;color:#8a7f70;">${c.val}k</span></div>`
  ).join('');
  ctxUsed.textContent = total;
  ctxPct.textContent  = Math.round(total/200*100);
}
renderCtx();
document.querySelector('.ctx-actions').addEventListener('click', e => {
  const btn = e.target.closest('.ctx-btn');
  if (!btn) return;
  const a = btn.dataset.action;
  if (a === 'add-mcp')   { CTX.find(x=>x.key==='mcp').val += 6;   ctxTip.textContent = '⚠ 多開 3 個 MCP server，工具定義佔了 9k token。閒置的請用 /mcp 停用。'; }
  if (a === 'add-files') { CTX.find(x=>x.key==='files').val += 12; ctxTip.textContent = '讀進 5 個檔案 (+12k)。Claude 不會自動移除已讀檔案，需要 /clear 或 /compact。'; }
  if (a === 'long-chat') { CTX.find(x=>x.key==='chat').val  += 30; ctxTip.textContent = '半小時對話累積了 +30k。Context rot 開始發生—Claude 變慢、重複問已答過的問題。'; }
  if (a === 'compact')   {
    CTX.find(x=>x.key==='chat').val  = Math.max(2, Math.round(CTX.find(x=>x.key==='chat').val * 0.15));
    CTX.find(x=>x.key==='files').val = Math.max(2, Math.round(CTX.find(x=>x.key==='files').val * 0.4));
    ctxTip.textContent = '✓ /compact 完成。對話與檔案被壓成摘要，保留關鍵脈絡。CLAUDE.md 不變（從磁碟重新注入）。';
  }
  if (a === 'clear')     {
    CTX = JSON.parse(JSON.stringify(CTX_INIT)); CTX.find(x=>x.key==='chat').val = 0; CTX.find(x=>x.key==='files').val = 0;
    ctxTip.textContent = '✓ /clear 完成。對話與讀檔全清空，CLAUDE.md 仍會在下次 session 重新載入。';
  }
  if (a === 'reset')     { CTX = JSON.parse(JSON.stringify(CTX_INIT)); ctxTip.textContent = '已重置初始狀態。'; }
  renderCtx();
});

/* ============================================
   DEMO 5: TDD ANIMATION
   ============================================ */
const TDD_STEPS = [
  { phase:'red',   angle: 60,  title:'RED · 寫失敗測試', code:
`<span class="tdd-step-tag red">RED</span>cartService.test.ts
<span style="color:#8a7f70;">// 場景 1：加入新商品 → 新增一筆 CartItem</span>
test('adds new item', () =&gt; {
  const cart = createCart()
  addItem(cart, { id: 1, qty: 2 })
  expect(cart.items).toHaveLength(1)
})

<span style="color:#e07a6a;">$ npm test
✗ adds new item
  ReferenceError: addItem is not defined</span>` },
  { phase:'green', angle: 180, title:'GREEN · 讓它通過', code:
`<span class="tdd-step-tag green">GREEN</span>cartService.ts
export function addItem(cart, item) {
  cart.items.push(item)
}

<span style="color:#88b59a;">$ npm test
✓ adds new item   (4ms)</span>
<span style="color:#8a7f70;">// 最簡實作 — 還沒處理合併、qty&lt;=0 等場景</span>` },
  { phase:'red',   angle: 60,  title:'RED · 加入「合併」場景', code:
`<span class="tdd-step-tag red">RED</span>新測試
test('merges duplicate', () =&gt; {
  const cart = createCart()
  addItem(cart, { id: 1, qty: 1 })
  addItem(cart, { id: 1, qty: 2 })
  expect(cart.items).toHaveLength(1)
  expect(cart.items[0].qty).toBe(3)
})

<span style="color:#e07a6a;">$ npm test
✗ merges duplicate
  expected 2 to equal 1</span>` },
  { phase:'green', angle: 180, title:'GREEN · 補上合併邏輯', code:
`<span class="tdd-step-tag green">GREEN</span>cartService.ts
export function addItem(cart, item) {
  const exist = cart.items.find(x =&gt; x.id === item.id)
  if (exist) exist.qty += item.qty
  else cart.items.push(item)
}

<span style="color:#88b59a;">$ npm test
✓ adds new item
✓ merges duplicate</span>` },
  { phase:'blue',  angle: 300, title:'REFACTOR · 重構但保持綠燈', code:
`<span class="tdd-step-tag blue">REFACTOR</span>cartService.ts
export function addItem(cart, item) {
  const i = cart.items.findIndex(x =&gt; x.id === item.id)
  i &gt;= 0
    ? cart.items[i].qty += item.qty
    : cart.items.push(item)
}

<span style="color:#88b59a;">$ npm test
✓ adds new item
✓ merges duplicate
<span style="color:#f0c884;">// /simplify 過 — 邏輯沒變，結構更乾淨</span></span>` }
];
let tddIdx = -1;
const tddCenter = document.getElementById('tddCenter');
const tddMarker = document.getElementById('tddMarker');
const tddPanel  = document.getElementById('tddPanel');
const tddCycle  = document.getElementById('tddCycle');
const tddNext   = document.getElementById('tddNext');
const tddStart  = document.getElementById('tddStart');
function tddRender(idx) {
  if (idx < 0) {
    tddCenter.textContent = '準備開始';
    tddMarker.style.left = '50%'; tddMarker.style.top = '0%';
    tddPanel.innerHTML = '<span style="color:#8a7f70;">// 點擊「開始」啟動 TDD 自主迴圈</span>';
    tddCycle.classList.remove('active');
    return;
  }
  tddCycle.classList.add('active');
  const s = TDD_STEPS[idx];
  // place marker on the conic ring at angle
  const a = (s.angle - 90) * Math.PI / 180;
  const r = 50; // % from center
  const x = 50 + r * Math.cos(a);
  const y = 50 + r * Math.sin(a);
  tddMarker.style.left = x + '%';
  tddMarker.style.top  = y + '%';
  tddCenter.textContent = s.title.split(' · ')[0];
  tddCenter.style.color = s.phase === 'red' ? 'var(--red)' : s.phase === 'green' ? 'var(--green)' : 'var(--blue)';
  tddPanel.innerHTML = s.code;
}
tddRender(-1);
tddStart.addEventListener('click', () => {
  tddIdx = 0; tddRender(0); tddNext.disabled = false;
  tddStart.textContent = '迴圈進行中…';
});
tddNext.addEventListener('click', () => {
  tddIdx = (tddIdx + 1) % TDD_STEPS.length;
  tddRender(tddIdx);
});
document.getElementById('tddReset').addEventListener('click', () => {
  tddIdx = -1; tddRender(-1); tddNext.disabled = true;
  tddStart.textContent = '▶ 開始 TDD 迴圈';
});

/* ============================================
   DEMO 6: HARNESS 7 CATEGORIES
   ============================================ */
const HARNESS = [
  { key:'context', icon:'📖', name:'Context Harness',     q:'Agent 看到什麼？',
    detail:'<h5>上下文 Harness · Agent 看到什麼？</h5>把規則、架構、慣例寫進磁碟，讓每次 session 都自動載入。',
    impl:'課程實踐：CLAUDE.md（合計伺服器計算 / 合併不重複）、spec.md、@import、RAG 檢索增強' },
  { key:'tool', icon:'🛠', name:'Tool Harness',         q:'Agent 能用什麼工具？',
    detail:'<h5>工具 Harness · Agent 能用什麼工具？</h5>定義 Agent 可呼叫的工具邊界 — MCP server、function calling、權限白名單。',
    impl:'課程實踐：Playwright MCP（瀏覽器自動化）、firecrawl、自訂 Skill、權限白名單' },
  { key:'flow', icon:'🔀', name:'Control Flow Harness', q:'Agent 怎麼決策與執行？',
    detail:'<h5>控制流 Harness · Agent 怎麼決策與執行？</h5>決定 Agent 的決策路徑、執行順序、人類審批閘門。',
    impl:'課程實踐：Plan Mode（先看計畫再執行）、Auto Mode、PreToolUse Hook（送 PR 前資安掃描）' },
  { key:'verify', icon:'✓', name:'Verification Harness', q:'Agent 做對沒？',
    detail:'<h5>驗證 Harness · Agent 做對沒？</h5>用測試、CI、review 命令把「宣稱完成」變成「驗證完成」。',
    impl:'課程實踐：TDD Vitest 迴圈、Playwright E2E、/review 三維度、/simplify 重構' },
  { key:'state', icon:'🧠', name:'State / Memory Harness', q:'Agent 記得什麼？',
    detail:'<h5>狀態 / 記憶 Harness · Agent 記得什麼？</h5>主動管理 Agent 的工作記憶，避免 context rot。',
    impl:'課程實踐：/clear、/compact、/rewind（時光機）、/resume（跨 session 接續）' },
  { key:'observe', icon:'👁', name:'Observability Harness', q:'Agent 在做什麼？',
    detail:'<h5>可觀測性 Harness · Agent 在做什麼？</h5>把執行過程、token 用量、成本變得可見。',
    impl:'課程實踐：/context（看 token 怎麼被吃）、/cost、/stats、LangSmith / Phoenix tracing' },
  { key:'safety', icon:'🛡', name:'Safety Harness',       q:'Agent 不能做什麼？',
    detail:'<h5>安全 Harness · Agent 不能做什麼？</h5>用權限模式、分類器、沙盒劃出絕對不能跨越的邊界。',
    impl:'課程實踐：Auto Mode 分類器把關、Bypass Mode 沙盒、disableBypassPermissionsMode 管理員設定' }
];
const harnessWheel = document.getElementById('harnessWheel');
const harnessDetail = document.getElementById('harnessDetail');
harnessWheel.innerHTML = HARNESS.map(h => `
  <button class="harness-card" data-key="${h.key}">
    <div class="harness-emoji">${h.icon}</div>
    <div class="harness-name">${h.name}</div>
    <div class="harness-q">${h.q}</div>
  </button>`).join('');
harnessWheel.addEventListener('click', e => {
  const card = e.target.closest('.harness-card');
  if (!card) return;
  harnessWheel.querySelectorAll('.harness-card').forEach(c => c.classList.toggle('active', c === card));
  const h = HARNESS.find(x => x.key === card.dataset.key);
  harnessDetail.innerHTML = `${h.detail}<div class="hd-impl">${h.impl}</div>`;
  harnessDetail.classList.add('show');
});

/* ============================================
   DEMO 7: REWIND TIMELINE
   ============================================ */
const RW_TIMELINE = [
  { time:'10:02', label:'需求討論',   conv:'• 確認 5 個購物車場景\n• 決定合計由 server 算',
    file:'<span style="color:#8a7f70;">// (尚未產生)</span>' },
  { time:'10:18', label:'寫測試',     conv:'• 五個 Vitest 測試已寫\n• 確認場景覆蓋',
    file:'<span style="color:#8a7f70;">// 還沒實作</span>\nexport function addItem() {}' },
  { time:'10:34', label:'產 Service', conv:'• 實作 addItem / merge\n• 處理 qty &lt;= 0',
    file:'function addItem(cart, item) {\n  const i = cart.items\n    .findIndex(...)\n  ...\n}' },
  { time:'10:51', label:'綠燈',       conv:'• 五個測試全綠\n• 準備 review',
    file:'function addItem(cart, item) {\n  const i = cart.items\n    .findIndex(...)\n  ...\n}\n<span style="color:#88b59a;">// ✓ 5/5 tests pass</span>' },
  { time:'11:07', label:'走錯方向',   conv:'• Claude 提了 Redux 重寫\n• 加了不必要的 middleware\n• 對話分析了 5 種替代方案\n<span style="color:#f0c884;">(分析有價值，想保留)</span>',
    file:'<span style="color:#e07a6a;">// 已被改成 Redux 版本</span>\n<span style="color:#e07a6a;">// 弄壞了測試</span>\nfunction cartReducer(state, action){\n  switch(action.type) {\n    ...\n  }\n}' }
];
let rwIdx = 4;
const rwConv = document.getElementById('rwConv');
const rwFile = document.getElementById('rwFile');
const rwFill = document.getElementById('rwFill');
const rwConvLen = document.getElementById('rwConvLen');
const rwFileVer = document.getElementById('rwFileVer');
function rwRender() {
  const t = RW_TIMELINE[rwIdx];
  rwConv.innerHTML = t.conv;
  rwFile.innerHTML = t.file;
  rwConvLen.textContent = (rwIdx + 1) + ' 條';
  rwFileVer.textContent = 'v' + (rwIdx + 1);
  rwFill.style.width = ((rwIdx) / (RW_TIMELINE.length - 1) * 100) + '%';
  document.querySelectorAll('.rw-event').forEach((el, i) => {
    el.classList.toggle('passed', i < rwIdx);
    el.classList.toggle('current', i === rwIdx);
  });
}
rwRender();
document.getElementById('rwEvents').addEventListener('click', e => {
  const evt = e.target.closest('.rw-event');
  if (!evt) return;
  rwIdx = parseInt(evt.dataset.step);
  rwRender();
});
// Snapshot v4 (走錯方向) so we can mutate per-button and reset cleanly.
const RW_V4_ORIG = { conv: RW_TIMELINE[4].conv, file: RW_TIMELINE[4].file };
const rwBanner = document.getElementById('rwBanner');
function rwShowBanner(html, tone) {
  if (!rwBanner) return;
  rwBanner.className = 'rw-banner ' + (tone || '');
  rwBanner.innerHTML = html;
  rwBanner.style.display = 'block';
}
document.querySelector('.rw-actions').addEventListener('click', e => {
  const btn = e.target.closest('.rw-action');
  if (!btn) return;
  const k = btn.dataset.rw;

  if (k === 'reset') {
    RW_TIMELINE[4].conv = RW_V4_ORIG.conv;
    RW_TIMELINE[4].file = RW_V4_ORIG.file;
    rwIdx = 4; rwRender();
    if (rwBanner) rwBanner.style.display = 'none';
    return;
  }
  if (k === 'all') {
    // Restore everything — equivalent to landing on v4 of green-light state.
    RW_TIMELINE[4].conv = RW_TIMELINE[3].conv;
    RW_TIMELINE[4].file = RW_TIMELINE[3].file;
    rwIdx = 4; rwRender();
    rwShowBanner('<b>✓ Restore code & conversation</b><br>對話與檔案都回到 10:51 綠燈狀態。推理脈絡會一起消失——最徹底但也最浪費。', 'all');
    return;
  }
  if (k === 'conv') {
    // Conversation rolls back to v4 (green light), file stays broken (Redux mess kept).
    RW_TIMELINE[4].conv = RW_TIMELINE[3].conv;
    RW_TIMELINE[4].file = RW_V4_ORIG.file;
    rwIdx = 4; rwRender();
    rwShowBanner('<b>✓ Restore conversation only</b><br>對話回到 10:51 綠燈狀態，但 Claude 改壞的檔案保留。適合「想保留改好的程式但重新討論方向」。', 'conv');
    return;
  }
  if (k === 'code') {
    // File rolls back to green light; conversation (5 種分析) preserved.
    RW_TIMELINE[4].file = RW_TIMELINE[3].file;
    RW_TIMELINE[4].conv = RW_V4_ORIG.conv;
    rwIdx = 4; rwRender();
    rwShowBanner('<b>✓ Restore code only（最常用）</b><br>檔案回到 10:51 綠燈狀態，但「Claude 分析的 5 種方案」對話保留——讓 Claude 帶著「已知排除的 4 個方向」重新提案。', 'code');
    return;
  }
});

/* ============================================
   DEMO 8: BUG DEBUG
   ============================================ */
const BUGS = {
  cors: {
    symptom: `<div class="bug-symptom"><b>瀏覽器 Console：</b><br>
      <code style="color:#c94f3c;">Access to fetch at 'http://localhost:3000/api/cart'<br>
      from origin 'http://localhost:5173' has been blocked by CORS policy</code></div>
      <p>React (5173) 呼叫 Express (3000) API 時被擋下，加入購物車按鈕完全沒反應。</p>`,
    fix: `<p><b>Context 操作策略：</b></p>
      <div class="bug-cmd">/bug</div> 切除錯模式，聚焦 API 端
      <p style="margin-top:10px;">指引 Claude 加 <code>cors</code> middleware：</p>
      <div class="bug-cmd">@src/server/app.ts</div>
      <p>修完立即壓縮，避免 CORS 紅字佔住 context：</p>
      <div class="bug-cmd">/compact focus on cart API contract</div>
      <div class="bug-fix"><b>修法：</b>app.ts 加 <code>app.use(cors({ origin: 'http://localhost:5173' }))</code> + 重啟 server。</div>`
  },
  badge: {
    symptom: `<div class="bug-symptom"><b>使用者回報：</b><br>
      點「加入購物車」後，右上角 badge 數字沒變，要重新整理才會跳到正確數字。</div>
      <p>後端有正確接到請求、購物車資料也正確存進去——只有前端 badge 沒跟著刷。</p>`,
    fix: `<p><b>Context 操作策略：</b></p>
      <p>兩個檔案就夠 — 不用 /bug、不用 /compact，直接同時引入：</p>
      <div class="bug-cmd">@CartContext.tsx @CartBadge.tsx</div>
      <p>Claude 一次看到兩邊就能找到根因。</p>
      <div class="bug-fix"><b>修法：</b>CartContext 的 setState 沒觸發 re-render — useState 用了陣列突變，改回 spread <code>setItems([...items, newItem])</code>。</div>`
  },
  total: {
    symptom: `<div class="bug-symptom"><b>使用者回報：</b><br>
      購物車裡按 + / − 改數量，品項小計變了，但<b>整體合計沒跟著變</b>。<br>
      只有第一次 render 是正確的。</div>
      <p>Claude 在對話中分析了 5 種可能方向（useEffect 依賴、memoization、context provider、Redux 重寫、後端推送）。</p>`,
    fix: `<p><b>Context 操作策略（最高難度）：</b></p>
      <p>Claude 已經改了一輪，方向錯了——但對話中的 5 種分析有價值，捨不得砍：</p>
      <div class="bug-cmd">Esc Esc → Restore code only</div>
      <p>檔案回到改之前，<b>對話保留</b>。Claude 在帶著「已知排除的 4 種方向」重新提案。</p>
      <div class="bug-fix"><b>根因：</b>合計用了 <code>cart.total</code>（停留在舊值），應改用 <code>useMemo</code> 從 items 重算 — 第二輪 Claude 一發就中。</div>`
  }
};
const bugTabs = document.getElementById('bugTabs');
const bugSymptom = document.getElementById('bugSymptom');
const bugFix     = document.getElementById('bugFix');
function renderBug(k) {
  bugSymptom.innerHTML = BUGS[k].symptom;
  bugFix.innerHTML     = BUGS[k].fix;
}
bugTabs.addEventListener('click', e => {
  const btn = e.target.closest('.bug-tab');
  if (!btn) return;
  bugTabs.querySelectorAll('.bug-tab').forEach(b => b.classList.toggle('active', b === btn));
  renderBug(btn.dataset.bug);
});
renderBug('cors');

/* ============================================
   DEMO 9: IRON LAWS FLIP CARDS
   ============================================ */
const IRON = [
  { num:'IRON LAW · 01', title:'TDD 鐵律',
    law:'NO PRODUCTION CODE WITHOUT A FAILING TEST FIRST',
    skill:'superpowers:test-driven-development',
    why:'<h6>強制做的事</h6><ul><li>先寫測試 → 跑測試確認失敗 → 才寫實作</li><li>沒看到測試失敗 = 不知道測試在測什麼</li><li>已經寫了？刪掉重來，不准「拿來參考」</li></ul>'},
  { num:'IRON LAW · 02', title:'驗證鐵律',
    law:'NO COMPLETION CLAIMS WITHOUT FRESH VERIFICATION EVIDENCE',
    skill:'superpowers:verification-before-completion',
    why:'<h6>強制做的事</h6><ul><li>宣稱「完成」前必須當場執行驗證指令</li><li>必須貼出真實輸出 — 不接受「應該對」「看起來通過」</li><li>禁止使用 "should" / "probably"</li></ul>'},
  { num:'IRON LAW · 03', title:'除錯鐵律',
    law:'NO FIXES WITHOUT ROOT CAUSE INVESTIGATION FIRST',
    skill:'superpowers:systematic-debugging',
    why:'<h6>強制做的事</h6><ul><li>沒有找到根本原因就不准動程式</li><li>禁止「試試看」式除錯</li><li>每個修正都需先確立假設並驗證</li></ul>'}
];
const ironGrid = document.getElementById('ironGrid');
ironGrid.innerHTML = IRON.map((i) => `
  <div class="iron-card">
    <div class="iron-card-inner">
      <div class="iron-front">
        <div>
          <div class="iron-num">${i.num}</div>
          <h5>${i.title}</h5>
        </div>
        <div class="iron-law">🔴 ${i.law}</div>
        <div class="iron-flip-hint">點卡片翻面 →</div>
      </div>
      <div class="iron-back">
        ${i.why}
        <div class="iron-skill">${i.skill}</div>
      </div>
    </div>
  </div>`).join('');
ironGrid.addEventListener('click', e => {
  const c = e.target.closest('.iron-card');
  if (c) c.classList.toggle('flipped');
});

/* ============================================
   DEMO: GIT VISUALIZER
   ============================================ */
function initGitDemo() {
  const svg = document.getElementById('gitSvg');
  const gitLogEl = document.getElementById('gitLog');
  const gitControls = document.querySelector('.git-controls');
  if (!svg || !gitLogEl || !gitControls) { console.warn('git demo elements missing'); return; }

  const W = 720, H = 320;
  const LANE = { main: 90, feature: 200, remote: 90 };
  const RIGHT = 560; // x position for remote column
  const STEP = 70;   // x distance per commit
  const START_X = 80;
  const NS = 'http://www.w3.org/2000/svg';

  const COLOR = { main: '#88b59a', feature: '#f0c884', remote: '#5a6f8c', edge: '#3a342d', label: '#f0e6d8' };

  let state;
  function reset() {
    state = {
      mainCommits: [{ id: 'a1', x: START_X, msg: 'init' }],
      featureCommits: [],
      remoteCommits: [],
      headBranch: 'main',
      branchExists: false,
      pushed: false,
      pr: false,
      counter: 1,
      logs: []
    };
    appendLog('<span class="gl">$ git init && git commit -m "init"</span>');
    appendLog('<span class="gl-ok">  ✓ main: a1 (init)</span>');
    render();
  }

  function appendLog(html) {
    state.logs.push(html);
    gitLogEl.innerHTML = state.logs.slice(-12).join('<br>');
    gitLogEl.scrollTop = gitLogEl.scrollHeight;
  }

  function el(tag, attrs, text) {
    const e = document.createElementNS(NS, tag);
    for (const k in attrs) e.setAttribute(k, attrs[k]);
    if (text != null) e.textContent = text;
    return e;
  }

  function render() {
    svg.innerHTML = '';
    // Lane labels
    const labels = [
      { y: 60, text: 'local · main' },
      { y: 170, text: 'local · feature/cart' },
      { y: 280, text: 'origin (GitHub)' }
    ];
    labels.forEach(l => svg.appendChild(el('text', { x: 12, y: l.y - 14, fill: '#8a7f70', 'font-size': 11, 'font-family': 'JetBrains Mono, monospace' }, l.text)));

    // separators
    [110, 220].forEach(y => svg.appendChild(el('line', { x1: 0, x2: W, y1: y, y2: y, stroke: '#2a2520', 'stroke-dasharray': '3,4' })));

    drawLane(state.mainCommits, 60, COLOR.main, state.headBranch === 'main');
    drawLane(state.featureCommits, 170, COLOR.feature, state.headBranch === 'feature');
    drawLane(state.remoteCommits, 280, COLOR.remote, false);

    // Branch arrow from main → feature
    if (state.branchExists && state.featureCommits.length > 0) {
      const lastMain = state.mainCommits[state.mainCommits.length - 1];
      const firstFeat = state.featureCommits[0];
      svg.appendChild(el('path', {
        d: `M ${lastMain.x} 70 Q ${(lastMain.x + firstFeat.x)/2} 130 ${firstFeat.x} 160`,
        stroke: COLOR.feature, 'stroke-width': 2, fill: 'none', 'stroke-dasharray': '4,3'
      }));
    } else if (state.branchExists) {
      const lastMain = state.mainCommits[state.mainCommits.length - 1];
      svg.appendChild(el('circle', { cx: lastMain.x, cy: 170, r: 6, fill: 'none', stroke: COLOR.feature, 'stroke-width': 2 }));
      svg.appendChild(el('text', { x: lastMain.x + 12, y: 174, fill: COLOR.feature, 'font-size': 10, 'font-family': 'JetBrains Mono, monospace' }, 'HEAD'));
    }

    // Push lines from local main to remote
    state.mainCommits.forEach(c => {
      const isPushed = state.remoteCommits.find(r => r.id === c.id);
      if (isPushed) {
        svg.appendChild(el('line', { x1: c.x, x2: c.x, y1: 70, y2: 270, stroke: COLOR.remote, 'stroke-width': 1, 'stroke-dasharray': '2,4', opacity: 0.5 }));
      }
    });

    // PR arrow
    if (state.pr && state.featureCommits.length > 0) {
      const last = state.featureCommits[state.featureCommits.length - 1];
      svg.appendChild(el('path', {
        d: `M ${last.x} 180 Q ${last.x + 60} 230 ${RIGHT} 270`,
        stroke: '#d97757', 'stroke-width': 2, fill: 'none', 'marker-end': 'url(#arr)'
      }));
      // PR badge
      const g = el('g', {});
      g.appendChild(el('rect', { x: RIGHT - 30, y: 240, width: 80, height: 22, rx: 11, fill: '#d97757' }));
      g.appendChild(el('text', { x: RIGHT + 10, y: 255, fill: '#fff', 'font-size': 11, 'font-weight': 700, 'text-anchor': 'middle', 'font-family': 'JetBrains Mono, monospace' }, 'PR #1'));
      svg.appendChild(g);
    }

    // arrow marker def
    const defs = el('defs', {});
    const m = el('marker', { id: 'arr', viewBox: '0 0 10 10', refX: 8, refY: 5, markerWidth: 6, markerHeight: 6, orient: 'auto' });
    m.appendChild(el('path', { d: 'M 0 0 L 10 5 L 0 10 z', fill: '#d97757' }));
    defs.appendChild(m);
    svg.appendChild(defs);
  }

  function drawLane(commits, y, color, isHead) {
    if (commits.length === 0) return;
    // line
    if (commits.length > 1) {
      svg.appendChild(el('line', {
        x1: commits[0].x, x2: commits[commits.length - 1].x, y1: y + 10, y2: y + 10,
        stroke: color, 'stroke-width': 2.5
      }));
    }
    commits.forEach((c, i) => {
      const isLast = i === commits.length - 1;
      svg.appendChild(el('circle', {
        cx: c.x, cy: y + 10, r: 11,
        fill: color, stroke: isLast && isHead ? '#fff' : '#1f1a16', 'stroke-width': isLast && isHead ? 3 : 2
      }));
      svg.appendChild(el('text', {
        x: c.x, y: y + 14, 'text-anchor': 'middle', fill: '#1f1a16',
        'font-size': 10, 'font-weight': 700, 'font-family': 'JetBrains Mono, monospace'
      }, c.id));
      svg.appendChild(el('text', {
        x: c.x, y: y - 6, 'text-anchor': 'middle', fill: '#8a7f70',
        'font-size': 10, 'font-family': 'JetBrains Mono, monospace'
      }, c.msg));
    });
  }

  function lastX(arr) { return arr.length ? arr[arr.length - 1].x : START_X - STEP; }
  function newId() { state.counter++; return String.fromCharCode(96 + state.counter) + state.counter; }

  gitControls.addEventListener('click', e => {
    const btn = e.target.closest('.git-btn');
    if (!btn) return;
    const a = btn.dataset.git;
    if (a === 'reset') { reset(); return; }
    if (a === 'commit') {
      if (state.headBranch === 'main') {
        const id = newId();
        state.mainCommits.push({ id, x: lastX(state.mainCommits) + STEP, msg: 'work' });
        appendLog('<span class="gl-cmd">$ git commit -m "work"</span>');
        appendLog(`<span class="gl-ok">  ✓ main: ${id}</span>`);
      } else {
        const id = newId();
        state.featureCommits.push({ id, x: lastX(state.featureCommits) + STEP, msg: 'feat' });
        appendLog('<span class="gl-cmd">$ git commit -m "feat: cart"</span>');
        appendLog(`<span class="gl-ok">  ✓ feature/cart: ${id}</span>`);
      }
    }
    if (a === 'branch') {
      if (state.branchExists) { appendLog('<span class="gl">// 已在 feature/cart 分支</span>'); state.headBranch='feature'; render(); return; }
      state.branchExists = true;
      state.headBranch = 'feature';
      const lastMain = state.mainCommits[state.mainCommits.length - 1];
      // feature branch starts where main was
      state.featureCommits = [];
      appendLog('<span class="gl-cmd">$ git checkout -b feature/cart</span>');
      appendLog(`<span class="gl-ok">  ✓ HEAD → feature/cart (從 ${lastMain.id} 分出)</span>`);
    }
    if (a === 'commit-feat') {
      if (!state.branchExists) { appendLog('<span class="gl">// 請先建立 feature 分支</span>'); return; }
      state.headBranch = 'feature';
      const id = newId();
      const baseX = state.featureCommits.length ? lastX(state.featureCommits) : lastX(state.mainCommits);
      state.featureCommits.push({ id, x: baseX + STEP, msg: 'feat' });
      appendLog('<span class="gl-cmd">$ git commit -m "feat: add cart"</span>');
      appendLog(`<span class="gl-ok">  ✓ feature/cart: ${id}</span>`);
    }
    if (a === 'merge') {
      if (state.featureCommits.length === 0) { appendLog('<span class="gl">// feature 上沒有 commit 可合併</span>'); return; }
      // merge commit on main
      const id = newId();
      const x = Math.max(lastX(state.mainCommits), lastX(state.featureCommits)) + STEP;
      state.mainCommits.push({ id, x, msg: 'merge' });
      state.headBranch = 'main';
      appendLog('<span class="gl-cmd">$ git checkout main && git merge feature/cart</span>');
      appendLog(`<span class="gl-ok">  ✓ Merge commit: ${id} on main</span>`);
    }
    if (a === 'push') {
      const unpushed = state.mainCommits.filter(c => !state.remoteCommits.find(r => r.id === c.id));
      if (unpushed.length === 0) { appendLog('<span class="gl">// 沒有要 push 的 commit</span>'); return; }
      unpushed.forEach(c => state.remoteCommits.push({ id: c.id, x: c.x, msg: c.msg }));
      state.pushed = true;
      appendLog('<span class="gl-cmd">$ git push origin main</span>');
      appendLog(`<span class="gl-ok">  ✓ ${unpushed.length} commit(s) → origin</span>`);
    }
    if (a === 'pr') {
      if (state.featureCommits.length === 0) { appendLog('<span class="gl">// 需先在 feature 分支 commit</span>'); return; }
      // also push feature commits to remote conceptually
      state.pr = true;
      appendLog('<span class="gl-cmd">$ gh pr create --base main --head feature/cart</span>');
      appendLog('<span class="gl-ok">  ✓ Pull Request #1 opened</span>');
      appendLog('<span class="gl">  → 等 review，合併後 main 就會推進</span>');
    }
    render();
  });

  reset();
}
try { initGitDemo(); } catch(e) { console.error('gitDemo failed:', e); }

/* ============================================
   SIDEBAR COLLAPSE
   ============================================ */
function initSidebarCollapse() {
  const aside = document.getElementById('nav');
  if (!aside) return;
  const btn = document.createElement('button');
  btn.id = 'navToggle';
  btn.innerHTML = '◧';
  btn.title = '收折側欄';
  btn.style.cssText = 'position:fixed;top:16px;left:16px;z-index:60;width:36px;height:36px;border-radius:8px;border:1px solid var(--line-strong);background:var(--bg-card);cursor:pointer;font-size:16px;display:grid;place-items:center;box-shadow:0 4px 12px -4px rgba(0,0,0,.15);transition:left .25s;';
  document.body.appendChild(btn);

  const collapsed = localStorage.getItem('cc_nav_collapsed') === '1';
  function apply(state) {
    if (state) {
      document.querySelector('.layout').style.gridTemplateColumns = '0 1fr';
      aside.style.transform = 'translateX(-100%)';
      aside.style.transition = 'transform .25s';
      btn.style.left = '16px';
      btn.innerHTML = '☰';
      btn.title = '展開側欄';
    } else {
      document.querySelector('.layout').style.gridTemplateColumns = '';
      aside.style.transform = '';
      btn.style.left = '296px';
      btn.innerHTML = '◧';
      btn.title = '收折側欄';
    }
  }
  apply(collapsed);
  btn.addEventListener('click', () => {
    const cur = localStorage.getItem('cc_nav_collapsed') === '1';
    localStorage.setItem('cc_nav_collapsed', cur ? '0' : '1');
    apply(!cur);
  });
}
try { initSidebarCollapse(); } catch(e) { console.error('sidebar failed:', e); }

/* ============================================
   TWEAKS
   ============================================ */
const tweakFab = document.getElementById('tweakFab');
const tweakPanel = document.getElementById('tweakPanel');
tweakFab.addEventListener('click', () => tweakPanel.classList.toggle('open'));
document.addEventListener('click', e => {
  if (!tweakPanel.contains(e.target) && e.target !== tweakFab) tweakPanel.classList.remove('open');
});

const fsRange = document.getElementById('fsRange');
const fsLabel = document.getElementById('fsLabel');
const savedFs = localStorage.getItem('cc_fs');
if (savedFs) { fsRange.value = savedFs; document.documentElement.style.setProperty('--fs-base', savedFs + 'px'); fsLabel.textContent = savedFs + 'px'; }
fsRange.addEventListener('input', () => {
  const v = fsRange.value;
  document.documentElement.style.setProperty('--fs-base', v + 'px');
  fsLabel.textContent = v + 'px';
  localStorage.setItem('cc_fs', v);
});

const savedAccent = localStorage.getItem('cc_accent') || 'orange';
document.documentElement.setAttribute('data-accent', savedAccent);
document.querySelectorAll('.tweak-swatch').forEach(s => {
  s.classList.toggle('active', s.dataset.v === savedAccent);
  s.addEventListener('click', () => {
    document.querySelectorAll('.tweak-swatch').forEach(x => x.classList.toggle('active', x === s));
    document.documentElement.setAttribute('data-accent', s.dataset.v);
    localStorage.setItem('cc_accent', s.dataset.v);
  });
});
