$ErrorActionPreference = "Stop"

$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$syllabusPath = Join-Path $root "claude_code_syllabus.md"
$outputPath = Join-Path $root "claude_code_teaching_website.html"
$heroImage = "image/claude_code_syllabus/hero/claude-code-shopping-cart-course-hero.png"

# 解析課綱標題與課程定位，供主視覺區使用。
$markdown = Get-Content -Raw -Path $syllabusPath
$titleMatch = [regex]::Match($markdown, '^#\s+(.+)$', [System.Text.RegularExpressions.RegexOptions]::Multiline)
$subtitleMatch = [regex]::Match($markdown, '^\*\*課程定位\*\*：(.+)$', [System.Text.RegularExpressions.RegexOptions]::Multiline)
$pageTitle = if ($titleMatch.Success) { $titleMatch.Groups[1].Value.Trim() } else { "Claude Code 教學網頁" }
$pageSubtitle = if ($subtitleMatch.Success) { $subtitleMatch.Groups[1].Value.Trim() } else { "" }

# 已嵌回 Markdown 的圖片不直接沿用，改由前端互動層重新掛載。
$cleanMarkdown = ($markdown -split "\r?\n" | Where-Object { $_ -notmatch '^\!\[.*\]\(.*\)$' }) -join "`n"
# 移除課程主專案區塊中不需要展示的 SDD 示範 Prompt 與其引用內容。
$cleanMarkdown = [regex]::Replace(
  $cleanMarkdown,
  "(?ms)^\*\*SDD 示範 Prompt\*\*（第 1 段示範）：\s*\r?\n\r?\n>\s*「.*?」\s*\r?\n",
  ""
)
$tempMarkdownPath = Join-Path ([System.IO.Path]::GetTempPath()) "claude-code-syllabus-web-temp.md"
Set-Content -Path $tempMarkdownPath -Value $cleanMarkdown -Encoding UTF8
$converted = ConvertFrom-Markdown -Path $tempMarkdownPath
$contentHtml = $converted.Html

$imageMap = [ordered]@{
  "課程主專案：購物車系統（Shopping Cart）" = $heroImage
  "📦 本章工具一覽（先看清單，再進細節）" = "image/claude_code_syllabus/teaching-diagrams/1-overview-kickoff.png"
  "1-1 環境安裝、登入與操作模式（20 mins）" = "image/claude_code_syllabus/teaching-diagrams/1-1-environment-login-modes.png"
  "1-2 介面導覽：CLI vs VS Code 插件、設定與 CLAUDE.md（15 mins）" = "image/claude_code_syllabus/teaching-diagrams/1-2-cli-vscode-claude-md.png"
  "1-3 Docker 安裝與 AI 操作資料庫（5 mins）" = "image/claude_code_syllabus/teaching-diagrams/1-3-docker-database.png"
  "1-4 Git 常用操作與 gh CLI 協作模式（20 mins）" = "image/claude_code_syllabus/teaching-diagrams/1-4-git-gh-cli.png"
  "2-1 SDD 規格先行：與 Claude 共同撰寫 spec.md（15 mins）" = "image/claude_code_syllabus/teaching-diagrams/2-1-sdd-spec-md.png"
  "2-2 後端生成、TDD 先行與自主修正循環（30 mins）" = "image/claude_code_syllabus/teaching-diagrams/2-2-backend-tdd-loop.png"
  "2-3 前端鷹架與 API 串接（15 mins）" = "image/claude_code_syllabus/teaching-diagrams/2-3-frontend-api-integration.png"
  "2-4 Context 管理、會話控制與真實除錯（35 mins）" = "image/claude_code_syllabus/teaching-diagrams/2-4-context-debugging.png"
  "3-1 agent-browser 技能：自動截圖、錄影與產生 SOP（15 mins）" = "image/claude_code_syllabus/teaching-diagrams/3-1-agent-browser-sop.png"
  "3-3 用 skill-creator 製作企業資安規範檢查 Skill（25 mins）" = "image/claude_code_syllabus/teaching-diagrams/3-2-skill-creator-security.png"
  "3-4 開發輔助技能分類導覽（15 mins）" = "image/claude_code_syllabus/teaching-diagrams/3-3-skill-categories.png"
  "3-5 深入講解 /agent 背景長任務（20 mins）" = "image/claude_code_syllabus/teaching-diagrams/3-4-agent-background-tasks.png"
  "4-1 /review 與 /simplify 內建品質指令（10 mins）" = "image/claude_code_syllabus/teaching-diagrams/4-1-review-simplify.png"
  "4-2 slash commands 完整工作流總覽（17 mins）" = "image/claude_code_syllabus/teaching-diagrams/4-2-slash-commands-workflow.png"
  "4-3 superpowers：spec → TDD → e2e 完整開發控管管線（12 mins）" = "image/claude_code_syllabus/teaching-diagrams/4-3-superpowers-pipeline.png"
  "5-1 Harness Engineering 是什麼（8 mins）" = "image/claude_code_syllabus/teaching-diagrams/5-1-harness-engineering.png"
  "5-2 課程實踐 ↔ Harness 類型對應（5 mins）" = "image/claude_code_syllabus/teaching-diagrams/5-2-course-to-harness-mapping.png"
  "5-3 三大支柱的工程意涵（5 mins）" = "image/claude_code_syllabus/teaching-diagrams/5-3-three-pillars.png"
  "5-4 你的 Harness 升級路徑（5 mins）" = "image/claude_code_syllabus/teaching-diagrams/5-4-harness-upgrade-path.png"
}
$imageMapJson = $imageMap | ConvertTo-Json -Compress

$safeTitle = [System.Net.WebUtility]::HtmlEncode($pageTitle)
$safeSubtitle = [System.Net.WebUtility]::HtmlEncode($pageSubtitle)

$template = @'
<!DOCTYPE html>
<html lang="zh-Hant">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>__TITLE__｜互動教學網頁</title>
  <style>
    :root {
      --bg: #f6f0e5;
      --ink: #0d2240;
      --muted: #344761;
      --navy: #14386f;
      --teal: #0f746a;
      --orange: #d96c18;
      --surface: rgba(255, 251, 245, 0.97);
      --surface-strong: #fffdf8;
      --line: rgba(13, 34, 64, 0.18);
      --shadow: 0 28px 72px rgba(21, 34, 52, 0.14);
      --radius-xl: 34px;
      --radius-lg: 26px;
      --radius-md: 18px;
      --duration: 240ms;
      --content-width: 1240px;
    }

    * { box-sizing: border-box; }
    html { scroll-behavior: smooth; }
    body {
      margin: 0;
      font-family: "Segoe UI", "PingFang TC", "Noto Sans TC", sans-serif;
      color: var(--ink);
      line-height: 1.75;
      background:
        radial-gradient(circle at left top, rgba(21,124,114,0.14), transparent 28%),
        radial-gradient(circle at right top, rgba(230,125,47,0.15), transparent 34%),
        linear-gradient(180deg, #fffbf4 0%, #f2ebdf 100%);
    }

    a { color: inherit; }

    .shell {
      width: min(var(--content-width), calc(100vw - 28px));
      margin: 0 auto;
    }

    .page-layout {
      display: grid;
      grid-template-columns: 290px minmax(0, 1fr);
      gap: 24px;
      align-items: start;
      padding: 24px 0 48px;
      transition: grid-template-columns var(--duration), gap var(--duration);
    }

    /* 側邊欄收折後，第一欄縮成 collapser 按鈕寬，主內容自動填滿 */
    .page-layout.is-sidebar-collapsed {
      grid-template-columns: 18px minmax(0, 1fr);
      gap: 12px;
    }

    /* wrapper 負責 sticky，sidebar 負責 overflow:hidden，按鈕在 wrapper 內與 sidebar 同層 */
    .sidebar-wrapper {
      display: flex;
      align-items: flex-start;
      position: sticky;
      top: 18px;
      align-self: start;
    }

    .sidebar {
      display: grid;
      gap: 14px;
      width: 290px;
      min-width: 0;
      overflow: hidden;
      transition: width var(--duration);
      flex-shrink: 0;
    }

    .sidebar.is-collapsed {
      width: 0;
    }

    .sidebar-card {
      min-width: 290px; /* 防止收折時內容自行縮排 */
      background: rgba(255, 252, 247, 0.98);
      border: 1px solid var(--line);
      border-radius: 28px;
      box-shadow: 0 14px 36px rgba(34, 50, 74, 0.08);
      padding: 18px;
    }

    .sidebar-collapser {
      flex-shrink: 0;
      align-self: flex-start;
      margin-top: 14px;
      width: 18px;
      height: 56px;
      padding: 0;
      border: 1px solid var(--line);
      border-left: none;
      border-radius: 0 10px 10px 0;
      background: var(--surface-strong);
      box-shadow: 3px 2px 8px rgba(0,0,0,0.07);
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background var(--duration);
    }

    .sidebar-collapser:hover {
      background: rgba(20,56,111,0.09);
    }

    .sidebar-collapser-icon {
      display: block;
      font-style: normal;
      font-size: 0.85rem;
      color: var(--navy);
      line-height: 1;
      transition: transform var(--duration);
      margin-left: -1px;
    }

    .sidebar.is-collapsed + .sidebar-collapser .sidebar-collapser-icon {
      transform: rotate(180deg);
    }

    .sidebar-card h2,
    .sidebar-card h3 {
      margin: 0 0 10px;
      font-size: 1rem;
      color: var(--navy);
    }

    .sidebar-card p {
      margin: 0;
      color: var(--muted);
      font-size: 0.92rem;
      line-height: 1.6;
    }

    .sidebar-toggle {
      display: none;
      min-height: 44px;
      padding: 12px 16px;
      border: none;
      border-radius: 999px;
      background: rgba(20,56,111,0.14);
      color: var(--navy);
      font: inherit;
      cursor: pointer;
    }

    .sidebar-nav {
      display: grid;
      gap: 6px;
      max-height: calc(100vh - 220px);
      overflow: auto;
      padding-right: 4px;
    }

    .sidebar-link,
    .sidebar-sublink {
      display: block;
      text-decoration: none;
      border-radius: 16px;
      transition: background var(--duration), color var(--duration), transform var(--duration);
      cursor: pointer;
    }

    .sidebar-link {
      padding: 10px 12px;
      color: var(--ink);
      background: rgba(20,56,111,0.08);
      font-weight: 600;
    }

    .sidebar-sublinks {
      display: grid;
      gap: 4px;
      padding: 4px 0 10px 12px;
    }

    .sidebar-sublink {
      padding: 8px 10px;
      color: #233854;
      font-size: 0.93rem;
    }

    .sidebar-link:hover,
    .sidebar-link:focus-visible,
    .sidebar-sublink:hover,
    .sidebar-sublink:focus-visible,
    .sidebar-link.is-active,
    .sidebar-sublink.is-active {
      outline: none;
      transform: translateX(2px);
      background: rgba(15,116,106,0.16);
      color: #0f315f;
    }

    .main-column {
      min-width: 0;
    }

    .hero {
      padding: 28px 0 44px;
    }

    .hero-card {
      overflow: hidden;
      border-radius: 38px;
      background: linear-gradient(140deg, rgba(11,29,58,0.98), rgba(23,58,114,0.94));
      color: #f8fafc;
      box-shadow: var(--shadow);
    }

    .hero-grid {
      display: block;
      padding: 34px;
    }

    .eyebrow {
      display: inline-flex;
      width: fit-content;
      align-items: center;
      gap: 10px;
      padding: 8px 14px;
      border-radius: 999px;
      background: rgba(255,255,255,0.12);
      color: #ffd9b5;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      font-size: 0.84rem;
    }

    .hero-copy h1 {
      margin: 18px 0 12px;
      font-size: clamp(2.3rem, 4vw, 4.4rem);
      line-height: 1.08;
      letter-spacing: -0.04em;
    }

    .hero-copy p {
      margin: 0;
      color: rgba(248,250,252,0.92);
      max-width: 66ch;
      font-size: 1.03rem;
    }

    .hero-points {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 14px;
      margin-top: 22px;
    }

    .hero-point {
      padding: 16px 18px;
      border-radius: 22px;
      background: rgba(255,255,255,0.12);
      border: 1px solid rgba(255,255,255,0.16);
    }

    .hero-point strong {
      display: block;
      margin-bottom: 6px;
      font-size: 1rem;
    }

    .hero-point p {
      font-size: 0.94rem;
    }

    .hero-media-card {
      margin-top: 22px;
      overflow: hidden;
      border-radius: 34px;
      background: linear-gradient(140deg, rgba(11,29,58,0.98), rgba(23,58,114,0.94));
      color: #f8fafc;
      box-shadow: var(--shadow);
    }

    .hero-media-shell {
      display: block;
      padding: 24px;
    }

    .hero-cta-row {
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
      margin-top: 24px;
    }

    .hero-cta {
      display: inline-flex;
      align-items: center;
      gap: 10px;
      padding: 14px 22px;
      border-radius: 999px;
      background: var(--orange);
      color: #fffdf8;
      font-weight: 700;
      font-size: 1rem;
      text-decoration: none;
      box-shadow: 0 12px 30px rgba(217, 108, 24, 0.35);
      transition: transform .15s ease, box-shadow .15s ease, background .15s ease;
    }

    .hero-cta:hover {
      transform: translateY(-2px);
      background: #e9791f;
      box-shadow: 0 18px 40px rgba(217, 108, 24, 0.5);
    }

    .hero-cta .hero-cta-arrow {
      font-size: 1.15rem;
      line-height: 1;
    }

    .hero-cta-note {
      font-size: 0.85rem;
      color: rgba(248,250,252,0.75);
      align-self: center;
    }

    .hero-visual-slot .visual-preview {
      margin: 0;
      min-height: 520px;
    }

    .intro-card,
    .chapter-shell,
    .section-shell {
      background: var(--surface);
      border: 1px solid var(--line);
      box-shadow: 0 16px 38px rgba(30, 43, 63, 0.1);
    }

    .intro-card {
      border-radius: var(--radius-xl);
      padding: 28px;
    }

    .intro-card h2 {
      margin: 0 0 12px;
      font-size: 1.6rem;
    }

    .chapter-list {
      display: grid;
      gap: 30px;
      padding: 24px 0 48px;
    }

    .chapter-shell {
      border-radius: 30px;
      padding: 24px;
    }

    .chapter-head {
      display: flex;
      align-items: end;
      justify-content: space-between;
      gap: 18px;
      margin-bottom: 16px;
    }

    .chapter-head h2 {
      margin: 8px 0 0;
      font-size: clamp(1.8rem, 3vw, 2.8rem);
      line-height: 1.14;
    }

    .chapter-head p {
      margin: 0;
      max-width: 44ch;
      color: #2f4765;
    }

    .chapter-sections {
      display: grid;
      gap: 18px;
    }

    .section-shell {
      border-radius: 28px;
      padding: 22px;
      overflow: hidden;
    }

    .section-topline,
    .section-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
    }

    .section-topline { margin-bottom: 12px; }

    .section-badge {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-width: 58px;
      min-height: 36px;
      padding: 0 12px;
      border-radius: 999px;
      background: rgba(20,56,111,0.12);
      color: var(--navy);
      font-weight: 700;
    }

    .section-topline small {
      color: #2f4765;
      font-size: 0.94rem;
    }

    .section-interactive-link {
      margin-left: auto;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 6px 14px;
      border-radius: 999px;
      background: rgba(217, 108, 24, 0.14);
      color: var(--orange);
      font-size: 0.85rem;
      font-weight: 700;
      text-decoration: none;
      border: 1px solid rgba(217, 108, 24, 0.32);
      transition: background .15s ease, transform .15s ease;
    }

    .section-interactive-link:hover {
      background: rgba(217, 108, 24, 0.22);
      transform: translateY(-1px);
    }

    .section-heading h3 {
      margin: 0;
      font-size: clamp(1.26rem, 2.4vw, 1.95rem);
      line-height: 1.24;
    }

    .section-heading p {
      margin: 8px 0 0;
      color: #334a66;
    }

    .section-toggle,
    .visual-preview__close,
    .visual-preview__chip,
    .visual-preview__frame,
    .lightbox__close {
      border: none;
      font: inherit;
      cursor: pointer;
    }

    .section-toggle,
    .lightbox__close,
    .visual-preview__close {
      min-height: 44px;
      padding: 10px 16px;
      border-radius: 999px;
    }

    .section-toggle {
      background: rgba(20,56,111,0.12);
      color: var(--navy);
      transition: background var(--duration), transform var(--duration);
    }

    .section-toggle:hover,
    .section-toggle:focus-visible {
      outline: none;
      background: rgba(20,56,111,0.2);
      transform: translateY(-1px);
    }

    .visual-preview {
      position: relative;
      margin: 18px 0 22px;
      min-height: 94px;
    }

    .visual-preview__expanded {
      position: relative;
      opacity: 1;
      transform: scale(1);
      transform-origin: top left;
      transition: opacity var(--duration), transform var(--duration);
    }

    .visual-preview:not(.is-open) .visual-preview__expanded {
      opacity: 0;
      transform: scale(0.82);
      pointer-events: none;
      position: absolute;
      inset: 0;
    }

    .visual-preview__close {
      position: absolute;
      top: 16px;
      right: 16px;
      z-index: 2;
      background: rgba(11,29,58,0.78);
      color: #fff;
      backdrop-filter: blur(6px);
    }

    .visual-preview__frame {
      width: 100%;
      padding: 0;
      display: block;
      overflow: hidden;
      border-radius: 24px;
      background: transparent;
      box-shadow: var(--shadow);
    }

    .visual-preview__frame img {
      display: block;
      width: 100%;
      height: auto;
    }

    .visual-preview__chip {
      display: inline-flex;
      align-items: center;
      gap: 10px;
      min-height: 52px;
      padding: 8px 14px 8px 8px;
      border-radius: 999px;
      background: rgba(255,255,255,0.98);
      border: 1px solid rgba(13,34,64,0.18);
      box-shadow: 0 10px 24px rgba(34,50,74,0.1);
      opacity: 0;
      transform: scale(0.8);
      transition: opacity var(--duration), transform var(--duration), border-color var(--duration);
      pointer-events: none;
    }

    .visual-preview:not(.is-open) .visual-preview__chip {
      opacity: 1;
      transform: scale(1);
      pointer-events: auto;
    }

    .visual-preview__chip:hover,
    .visual-preview__chip:focus-visible {
      outline: none;
      border-color: rgba(21,124,114,0.48);
    }

    .visual-preview__chip img {
      width: 62px;
      height: 40px;
      object-fit: cover;
      border-radius: 999px;
      display: block;
    }

    .section-content {
      display: grid;
      grid-template-rows: 1fr;
      opacity: 1;
      transform: scaleY(1);
      transform-origin: top center;
      transition: grid-template-rows 280ms ease, opacity 280ms ease, transform 280ms ease;
    }

    .section-content:not(.is-open) {
      grid-template-rows: 0fr;
      opacity: 0;
      transform: scaleY(0.96);
    }

    .section-content__inner {
      overflow: hidden;
    }

    .section-content__inner > *:first-child { margin-top: 0; }
    .section-content__inner > *:last-child { margin-bottom: 0; }

    .section-content p,
    .intro-card p {
      margin: 0 0 14px;
      color: #0f2441;
    }

    .section-content h4 {
      margin: 18px 0 10px;
      font-size: 1.08rem;
      color: var(--navy);
    }

    .section-content ul,
    .section-content ol {
      margin: 0 0 16px;
      padding-left: 1.2rem;
    }

    .section-content li + li {
      margin-top: 8px;
    }

    blockquote {
      margin: 0 0 16px;
      padding: 18px 20px;
      border-left: 4px solid var(--orange);
      background: rgba(217,108,24,0.12);
      border-radius: 0 20px 20px 0;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      min-width: 720px;
    }

    .table-wrap {
      overflow-x: auto;
      margin: 0 0 18px;
      border: 1px solid var(--line);
      border-radius: 20px;
      background: rgba(255,255,255,0.9);
    }

    th,
    td {
      padding: 14px 16px;
      text-align: left;
      border-bottom: 1px solid rgba(17,38,66,0.08);
      vertical-align: top;
    }

    th {
      background: rgba(20,56,111,0.12);
      color: var(--navy);
      font-weight: 700;
    }

    pre {
      margin: 0 0 18px;
      padding: 16px 18px;
      border-radius: 22px;
      overflow: auto;
      background: #10294d;
      color: #f6fbff;
      border: 1px solid rgba(132, 184, 255, 0.18);
      border-left: 4px solid #25b3a4;
      font-family: "Cascadia Code", "JetBrains Mono", Consolas, monospace;
      font-size: 1rem;
      line-height: 1.76;
      font-weight: 600;
      white-space: pre-wrap;
      text-shadow: 0 1px 0 rgba(0,0,0,0.18);
    }

    code {
      font-family: "Cascadia Code", "JetBrains Mono", Consolas, monospace;
    }

    pre code,
    .command-block code {
      color: #ffffff !important;
      font-weight: 600;
      letter-spacing: 0.01em;
      -webkit-text-fill-color: #ffffff;
    }

    p code,
    li code,
    td code,
    blockquote code {
      display: inline-block;
      padding: 0.08rem 0.45rem;
      border-radius: 999px;
      background: rgba(20,56,111,0.14);
      color: #123867;
      font-size: 0.92em;
    }

    .command-block {
      white-space: pre-wrap;
    }

    .lightbox {
      position: fixed;
      inset: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
      background: rgba(6,14,28,0.78);
      backdrop-filter: blur(8px);
      opacity: 0;
      pointer-events: none;
      transition: opacity var(--duration);
      z-index: 60;
    }

    .lightbox.is-open {
      opacity: 1;
      pointer-events: auto;
    }

    .lightbox__dialog {
      width: min(1120px, 100%);
      max-height: calc(100vh - 40px);
      overflow: auto;
      border-radius: 28px;
      background: var(--surface-strong);
      box-shadow: var(--shadow);
      transform: translateY(18px) scale(0.96);
      transition: transform var(--duration);
    }

    .lightbox.is-open .lightbox__dialog {
      transform: translateY(0) scale(1);
    }

    .lightbox__toolbar {
      display: flex;
      justify-content: space-between;
      gap: 14px;
      align-items: center;
      padding: 14px 16px;
      border-bottom: 1px solid var(--line);
    }

    .lightbox__toolbar h4 {
      margin: 0;
      font-size: 1rem;
    }

    .lightbox__close {
      background: rgba(20,56,111,0.16);
      color: #123867;
    }

    .lightbox__dialog img {
      display: block;
      width: 100%;
      height: auto;
    }

    @media (max-width: 980px) {
      .page-layout {
        grid-template-columns: 1fr;
      }

      .sidebar-wrapper {
        position: static;
        display: block;
      }

      .sidebar {
        width: auto !important;
        overflow: visible;
      }

      .sidebar-card {
        min-width: 0;
      }

      .sidebar-collapser {
        display: none;
      }

      .sidebar-toggle {
        display: inline-flex;
        align-items: center;
        justify-content: center;
      }

      .sidebar-nav {
        display: none;
        max-height: none;
      }

      .sidebar.is-open .sidebar-nav {
        display: grid;
      }

      .hero-visual-slot .visual-preview {
        min-height: 300px;
      }

      .chapter-head,
      .section-header,
      .section-topline {
        flex-direction: column;
        align-items: start;
      }
    }

    @media (max-width: 720px) {
      .shell {
        width: min(var(--content-width), calc(100vw - 18px));
      }

      .hero-grid,
      .hero-media-shell {
        padding-left: 18px;
        padding-right: 18px;
      }

      .hero-points {
        grid-template-columns: 1fr;
      }
    }

    @media (prefers-reduced-motion: reduce) {
      html { scroll-behavior: auto; }
      *,
      *::before,
      *::after {
        animation: none !important;
        transition: none !important;
      }
    }
  </style>
</head>
<body>
  <div class="shell">
    <div class="page-layout">
      <div class="sidebar-wrapper">
        <aside class="sidebar" id="chapter-sidebar">
          <div class="sidebar-card">
            <h2>章節導覽</h2>
            <p>固定顯示章節與小節，方便授課時快速跳轉。</p>
          </div>
          <div class="sidebar-card">
            <button class="sidebar-toggle" type="button" id="sidebar-toggle" aria-expanded="false">展開章節目錄</button>
            <nav class="sidebar-nav" aria-label="側邊欄章節目錄" id="sidebar-nav"></nav>
          </div>
          <div class="sidebar-card">
            <h3>互動體驗版</h3>
            <p>另開分頁，跑 CLI 模擬器、TDD 動畫、Context 管理 demo 等可互動內容。</p>
            <a class="hero-cta" style="margin-top:10px;width:100%;justify-content:center;font-size:0.95rem;padding:11px 18px;" href="interactive.html" target="_blank" rel="noopener">
              <span aria-hidden="true">🎮</span>
              <span>開啟互動體驗</span>
              <span class="hero-cta-arrow" aria-hidden="true">→</span>
            </a>
          </div>
        </aside>
        <button class="sidebar-collapser" id="sidebar-collapser" aria-label="收折側邊欄" title="收折側邊欄">
          <i class="sidebar-collapser-icon">‹</i>
        </button>
      </div>

      <div class="main-column">
        <header class="hero">
          <div class="hero-card">
            <div class="hero-grid">
              <div class="hero-copy">
                <span class="eyebrow">Interactive Teaching Website</span>
                <h1>__TITLE__</h1>
                <p>__SUBTITLE__</p>
                <div class="hero-cta-row">
                  <a class="hero-cta" href="interactive.html" target="_blank" rel="noopener">
                    <span aria-hidden="true">🎮</span>
                    <span>進入互動體驗版</span>
                    <span class="hero-cta-arrow" aria-hidden="true">→</span>
                  </a>
                  <span class="hero-cta-note">CLI 模擬器、TDD 動畫、Context 管理示範等課堂互動 demo</span>
                </div>
                <div class="hero-points">
                  <div class="hero-point">
                    <strong>課程目標</strong>
                    <p>使用 Claude Code 帶著學員完成一個購物車系統，串起規格、程式、測試與驗證。</p>
                  </div>
                  <div class="hero-point">
                    <strong>教學體驗</strong>
                    <p>每章先看圖解，再進入可收折的課綱內容與指令區塊，適合授課與自學。</p>
                  </div>
                  <div class="hero-point">
                    <strong>互動重點</strong>
                    <p>章節圖片可先彈出展示，關閉後縮成圖示，再次點擊即可重新展開。</p>
                  </div>
                  <div class="hero-point">
                    <strong>內容型態</strong>
                    <p>表格、說明、流程、指令與程式碼都在同一頁中以明確視覺層級整理。</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <section class="hero-media-card" aria-label="課程主視覺">
            <div class="hero-media-shell">
              <div class="hero-visual-slot" id="hero-visual-slot">
              </div>
            </div>
          </section>
        </header>

        <section class="intro-card">
          <h2>課程導讀</h2>
          <div id="intro-root"></div>
        </section>

        <main class="chapter-list" id="lesson-root"></main>
      </div>
    </div>
  </div>

  <div class="lightbox" id="lightbox" aria-hidden="true">
    <div class="lightbox__dialog" role="dialog" aria-modal="true" aria-labelledby="lightbox-title">
      <div class="lightbox__toolbar">
        <h4 id="lightbox-title">教學圖解</h4>
        <button class="lightbox__close" type="button" id="lightbox-close">關閉</button>
      </div>
      <img id="lightbox-image" src="" alt="">
    </div>
  </div>

  <template id="raw-syllabus">
__CONTENT__
  </template>

  <script>
    const HERO_IMAGE = "__HERO__";
    const IMAGE_MAP = __IMAGEMAP__;

    function normalizeText(value) {
      return value.replace(/\s+/g, " ").replace(/[`]/g, "").trim();
    }

    function extractChapterNumber(title, fallbackNumber) {
      const normalized = normalizeText(title);
      const match = normalized.match(/^第\s*(\d+)\s*段/);
      return match ? Number(match[1]) : fallbackNumber;
    }

    function extractSectionBadge(title, chapterNumber, fallbackIndex) {
      const normalized = normalizeText(title);
      const sectionMatch = normalized.match(/^(\d+)-(\d+)/);
      if (sectionMatch) {
        return `${sectionMatch[1]}.${sectionMatch[2]}`;
      }
      return `${chapterNumber}.${fallbackIndex}`;
    }

    function shouldSkipNode(chapterTitle, node) {
      if (!chapterTitle) {
        return false;
      }

      const normalizedChapter = normalizeText(chapterTitle);
      const text = normalizeText(node.textContent || "");
      if (normalizedChapter.includes("課程主專案：購物車系統") && text.includes("SDD 示範 Prompt")) {
        return true;
      }
      if (normalizedChapter.includes("課程主專案：購物車系統") && node.tagName === "BLOCKQUOTE") {
        return true;
      }
      return false;
    }

    function createVisualPreview(imagePath, label) {
      if (!imagePath) {
        return null;
      }

      const root = document.createElement("div");
      root.className = "visual-preview is-open";
      root.innerHTML = `
        <div class="visual-preview__expanded">
          <button class="visual-preview__close" type="button">關閉預覽</button>
          <button class="visual-preview__frame" type="button">
            <img src="${imagePath}" alt="${label} 教學圖解">
          </button>
        </div>
        <button class="visual-preview__chip" type="button">
          <img src="${imagePath}" alt="${label} 縮圖">
          <span>教學圖</span>
        </button>
      `;

      const frameButton = root.querySelector(".visual-preview__frame");
      const chipButton = root.querySelector(".visual-preview__chip");
      const closeButton = root.querySelector(".visual-preview__close");

      closeButton.addEventListener("click", (event) => {
        event.stopPropagation();
        root.classList.remove("is-open");
      });

      function openPreview() {
        root.classList.add("is-open");
        openLightbox(imagePath, label);
      }

      frameButton.addEventListener("click", openPreview);
      chipButton.addEventListener("click", openPreview);
      return root;
    }

    /* 講義小節 badge → 互動體驗版的對應 anchor。3.2（Agent Skills 與 Hooks 概念入門）為純概念，互動網頁無對應。 */
    const INTERACTIVE_MAP = {
      "1.1": "s1-1", "1.2": "s1-2", "1.3": "s1-3", "1.4": "s1-4",
      "2.1": "s2-1", "2.2": "s2-2", "2.3": "s2-3", "2.4": "s2-4",
      "3.1": "s3-1", "3.3": "s3-2", "3.4": "s3-3", "3.5": "s3-4",
      "4.1": "s4-1", "4.2": "s4-2", "4.3": "s4-3"
    };

    function createSectionCard(sectionData, sectionNumber, chapterTitle) {
      const shell = document.createElement("section");
      shell.className = "section-shell";
      shell.dataset.sectionLabel = normalizeText(sectionData.title);

      const header = document.createElement("div");
      header.innerHTML = `
        <div class="section-topline">
          <span class="section-badge">${sectionNumber}</span>
          <small>${chapterTitle}</small>
        </div>
        <div class="section-header">
          <div class="section-heading">
            <h3>${sectionData.title}</h3>
            <p>整合課綱說明、操作步驟、架構與命令內容。</p>
          </div>
          <button class="section-toggle" type="button" aria-expanded="true"><span>收折章節</span></button>
        </div>
      `;
      shell.appendChild(header);

      /* 若該節有對應的互動體驗，於 section-topline 加跳轉連結（用 DOM API 建構，避免 XSS） */
      const interactiveAnchor = INTERACTIVE_MAP[sectionNumber];
      if (interactiveAnchor) {
        const topline = header.querySelector(".section-topline");
        const link = document.createElement("a");
        link.className = "section-interactive-link";
        link.href = "interactive.html#" + interactiveAnchor;
        link.target = "_blank";
        link.rel = "noopener";
        link.title = "另開分頁進入此節的互動體驗";
        const icon = document.createElement("span");
        icon.setAttribute("aria-hidden", "true");
        icon.textContent = "🎮";
        const label = document.createElement("span");
        label.textContent = "互動體驗版";
        const arrow = document.createElement("span");
        arrow.setAttribute("aria-hidden", "true");
        arrow.textContent = "→";
        link.append(icon, label, arrow);
        topline.appendChild(link);
      }

      const imagePath = IMAGE_MAP[normalizeText(sectionData.title)];
      const preview = createVisualPreview(imagePath, normalizeText(sectionData.title));
      if (preview) {
        shell.appendChild(preview);
      }

      const content = document.createElement("div");
      content.className = "section-content is-open";
      content.innerHTML = `<div class="section-content__inner"></div>`;
      const inner = content.firstElementChild;
      sectionData.nodes.forEach((node) => inner.appendChild(node));
      shell.appendChild(content);

      const toggleButton = shell.querySelector(".section-toggle");
      toggleButton.addEventListener("click", () => {
        const expanded = toggleButton.getAttribute("aria-expanded") === "true";
        toggleButton.setAttribute("aria-expanded", String(!expanded));
        toggleButton.querySelector("span").textContent = expanded ? "展開章節" : "收折章節";
        content.classList.toggle("is-open", !expanded);
      });

      return shell;
    }

    function createSidebarEntry(chapter) {
      const wrapper = document.createElement("div");
      const chapterLink = document.createElement("a");
      chapterLink.className = "sidebar-link";
      chapterLink.href = `#chapter-${chapter.number}`;
      chapterLink.textContent = chapter.title;
      wrapper.appendChild(chapterLink);

      const sublinks = document.createElement("div");
      sublinks.className = "sidebar-sublinks";
      chapter.sections.forEach((section) => {
        const sectionLink = document.createElement("a");
        sectionLink.className = "sidebar-sublink";
        sectionLink.href = `#section-${section.badge}`;
        sectionLink.textContent = normalizeText(section.title);
        sublinks.appendChild(sectionLink);
      });
      wrapper.appendChild(sublinks);
      return wrapper;
    }

    function wrapTables(scope) {
      scope.querySelectorAll("table").forEach((table) => {
        const wrapper = document.createElement("div");
        wrapper.className = "table-wrap";
        table.parentNode.insertBefore(wrapper, table);
        wrapper.appendChild(table);
      });
    }

    function transformCommandParagraphs(scope) {
      const keywordPattern = /(claude|npm|node|git|gh|curl|brew|docker|java|python|mvnw|localhost:|PowerShell|Terminal)/i;
      scope.querySelectorAll("p, blockquote").forEach((element) => {
        if (element.closest("pre")) {
          return;
        }
        const codeCount = element.querySelectorAll("code").length;
        if (codeCount === 0) {
          return;
        }
        const text = element.textContent.trim();
        if (codeCount >= 2 || (codeCount >= 1 && keywordPattern.test(text))) {
          const pre = document.createElement("pre");
          pre.className = "command-block";
          pre.textContent = text;
          element.replaceWith(pre);
        }
      });
    }

    function openLightbox(src, label) {
      const lightbox = document.getElementById("lightbox");
      document.getElementById("lightbox-image").src = src;
      document.getElementById("lightbox-image").alt = label + " 教學圖解";
      document.getElementById("lightbox-title").textContent = label;
      lightbox.classList.add("is-open");
      lightbox.setAttribute("aria-hidden", "false");
    }

    function closeLightbox() {
      const lightbox = document.getElementById("lightbox");
      lightbox.classList.remove("is-open");
      lightbox.setAttribute("aria-hidden", "true");
    }

    function buildLessonLayout() {
      const rawTemplate = document.getElementById("raw-syllabus");
      const staging = document.createElement("div");
      staging.innerHTML = rawTemplate.innerHTML.trim();
      wrapTables(staging);
      transformCommandParagraphs(staging);

      const introRoot = document.getElementById("intro-root");
      const lessonRoot = document.getElementById("lesson-root");
      const sidebarNav = document.getElementById("sidebar-nav");
      const heroVisualSlot = document.getElementById("hero-visual-slot");

      const children = Array.from(staging.children);
      const introNodes = [];
      const chapters = [];
      let currentChapter = null;
      let currentSection = null;

      children.forEach((node) => {
        const tag = node.tagName;
        if (tag === "H1") {
          return;
        }

        if (tag === "H2") {
          currentChapter = {
            title: node.textContent.trim(),
            number: 0,
            sections: [],
            introNodes: []
          };
          currentSection = null;
          chapters.push(currentChapter);
          return;
        }

        if (!currentChapter) {
          introNodes.push(node);
          return;
        }

        if (tag === "H3") {
          currentSection = {
            title: node.textContent.trim(),
            nodes: []
          };
          currentChapter.sections.push(currentSection);
          return;
        }

        if (shouldSkipNode(currentChapter.title, node)) {
          return;
        }

        if (currentSection) {
          currentSection.nodes.push(node);
        } else {
          currentChapter.introNodes.push(node);
        }
      });

      introNodes.forEach((node) => introRoot.appendChild(node));
      const heroPreview = createVisualPreview(HERO_IMAGE, "課程主視覺");
      if (heroPreview) {
        heroVisualSlot.appendChild(heroPreview);
      }

      chapters.forEach((chapter, chapterIndex) => {
        chapter.number = extractChapterNumber(chapter.title, chapterIndex + 1);
        const chapterShell = document.createElement("section");
        chapterShell.className = "chapter-shell";
        chapterShell.id = `chapter-${chapter.number}`;

        const head = document.createElement("div");
        head.className = "chapter-head";
        head.innerHTML = `
          <div>
            <span class="eyebrow">Chapter ${chapter.number}</span>
            <h2>${chapter.title}</h2>
          </div>
          <p>點開章節即可閱讀完整內容；所有對應圖片都可重新展開大圖檢視。</p>
        `;
        chapterShell.appendChild(head);

        const sectionContainer = document.createElement("div");
        sectionContainer.className = "chapter-sections";

        if (chapter.sections.length === 0) {
          chapter.sections.push({
            title: chapter.title,
            nodes: chapter.introNodes
          });
          chapter.introNodes = [];
        }

        if (chapter.introNodes.length > 0) {
          const introBadge = `${chapter.number}.0`;
          const introSection = createSectionCard({
            title: chapter.title + "｜章節導讀",
            nodes: chapter.introNodes
          }, introBadge, chapter.title);
          introSection.id = `section-${introBadge}`;
          sectionContainer.appendChild(introSection);
        }

        chapter.sections.forEach((section, sectionIndex) => {
          section.badge = extractSectionBadge(section.title, chapter.number, sectionIndex + 1);
          const card = createSectionCard(section, section.badge, chapter.title);
          card.id = `section-${section.badge}`;
          sectionContainer.appendChild(card);

        });

        sidebarNav.appendChild(createSidebarEntry(chapter));

        chapterShell.appendChild(sectionContainer);
        lessonRoot.appendChild(chapterShell);
      });
    }

    function setupSidebarState() {
      const sidebar = document.getElementById("chapter-sidebar");
      const toggle = document.getElementById("sidebar-toggle");
      const collapser = document.getElementById("sidebar-collapser");
      const sidebarLinks = Array.from(document.querySelectorAll(".sidebar-link, .sidebar-sublink"));
      const observedTargets = Array.from(document.querySelectorAll(".chapter-shell, .section-shell"));

      /* 桌面版收折按鈕 */
      if (collapser) {
        const pageLayout = document.querySelector(".page-layout");
        const applyCollapsed = (collapsed) => {
          sidebar.classList.toggle("is-collapsed", collapsed);
          if (pageLayout) {
            pageLayout.classList.toggle("is-sidebar-collapsed", collapsed);
          }
          collapser.setAttribute("aria-label", collapsed ? "展開側邊欄" : "收折側邊欄");
          collapser.title = collapsed ? "展開側邊欄" : "收折側邊欄";
          try { localStorage.setItem("sidebar-collapsed", String(collapsed)); } catch (_) {}
        };

        collapser.addEventListener("click", () => {
          applyCollapsed(!sidebar.classList.contains("is-collapsed"));
        });

        /* 還原上次狀態 */
        try {
          if (localStorage.getItem("sidebar-collapsed") === "true") {
            applyCollapsed(true);
          }
        } catch (_) {}
      }

      toggle.addEventListener("click", () => {
        const expanded = toggle.getAttribute("aria-expanded") === "true";
        toggle.setAttribute("aria-expanded", String(!expanded));
        toggle.textContent = expanded ? "展開章節目錄" : "收起章節目錄";
        sidebar.classList.toggle("is-open", !expanded);
      });

      sidebarLinks.forEach((link) => {
        link.addEventListener("click", () => {
          if (window.innerWidth <= 980) {
            sidebar.classList.remove("is-open");
            toggle.setAttribute("aria-expanded", "false");
            toggle.textContent = "展開章節目錄";
          }
        });
      });

      const observer = new IntersectionObserver((entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (!visible) {
          return;
        }

        const targetId = visible.target.id;
        sidebarLinks.forEach((link) => {
          link.classList.toggle("is-active", link.getAttribute("href") === `#${targetId}`);
        });
      }, { rootMargin: "-15% 0px -65% 0px", threshold: [0.15, 0.4, 0.7] });

      observedTargets.forEach((target) => observer.observe(target));
    }

    buildLessonLayout();
    setupSidebarState();

    const lightbox = document.getElementById("lightbox");
    const closeButton = document.getElementById("lightbox-close");
    closeButton.addEventListener("click", closeLightbox);
    lightbox.addEventListener("click", (event) => {
      if (event.target === lightbox) {
        closeLightbox();
      }
    });
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && lightbox.classList.contains("is-open")) {
        closeLightbox();
      }
    });
  </script>
</body>
</html>
'@

$html = $template.Replace("__TITLE__", $safeTitle)
$html = $html.Replace("__SUBTITLE__", $safeSubtitle)
$html = $html.Replace("__HERO__", $heroImage)
$html = $html.Replace("__CONTENT__", $contentHtml.Trim())
$html = $html.Replace("__IMAGEMAP__", $imageMapJson)

Set-Content -Path $outputPath -Value $html -Encoding UTF8
Write-Host "Generated: $outputPath"
