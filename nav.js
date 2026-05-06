/**
 * nav.js — 唐小涛网站群 · 浮动导航小挂件 v3
 * 导航顺序：毕业生指南(1) > 城市房价地图(2) > 深圳职业图谱(3) > 访客留言板(4)
 */
(function () {
  const BASE = 'https://xiaotao-auto.github.io/shenzhen-career';
  const PAGES = [
    { key: 'graduate',  emoji: '🎓', label: '毕业生指南',    url: BASE + '/graduate-guide.html' },
    { key: 'housing',   emoji: '🏠', label: '城市房价地图',  url: BASE + '/housing-price-viz/' },
    { key: 'career',    emoji: '🏙️', label: '深圳职业图谱',  url: BASE + '/shenzhen-career.html' },
    { key: 'guestbook', emoji: '💬', label: '访客留言板',    url: BASE + '/guestbook.html' },
  ];

  function currentKey() {
    const p = location.pathname;
    if (p.includes('graduate-guide'))       return 'graduate';
    if (p.includes('housing-price-viz'))    return 'housing';
    if (p.includes('shenzhen-career.html')) return 'career';
    if (p.includes('guestbook'))            return 'guestbook';
    if (p.endsWith('/') || p.endsWith('index.html')) return 'career';
    return '';
  }

  const cur = currentKey();

  /* ─── Styles ─── */
  const style = document.createElement('style');
  style.textContent = `
    /* ── 整体容器 ── */
    #snav-wrap {
      position: fixed;
      right: 18px;
      bottom: 80px;
      z-index: 9999;
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      gap: 0;
      user-select: none;
      font-family: 'PingFang SC','Helvetica Neue','Arial',sans-serif;
    }

    /* ── 展开的菜单列表 ── */
    #snav-menu {
      display: flex;
      flex-direction: column;
      gap: 8px;
      margin-bottom: 12px;
      transform-origin: bottom right;
      transform: scale(0.65) translateY(16px);
      opacity: 0;
      pointer-events: none;
      transition: transform 0.30s cubic-bezier(0.34,1.56,0.64,1),
                  opacity 0.22s ease;
    }
    #snav-menu.open {
      transform: scale(1) translateY(0);
      opacity: 1;
      pointer-events: auto;
    }

    /* 每个菜单项依次延迟入场 */
    #snav-menu.open .snav-item:nth-child(1) { animation: snav-slide 0.28s 0.00s both cubic-bezier(0.34,1.56,0.64,1); }
    #snav-menu.open .snav-item:nth-child(2) { animation: snav-slide 0.28s 0.04s both cubic-bezier(0.34,1.56,0.64,1); }
    #snav-menu.open .snav-item:nth-child(3) { animation: snav-slide 0.28s 0.08s both cubic-bezier(0.34,1.56,0.64,1); }
    #snav-menu.open .snav-item:nth-child(4) { animation: snav-slide 0.28s 0.12s both cubic-bezier(0.34,1.56,0.64,1); }
    @keyframes snav-slide {
      from { opacity:0; transform: translateX(12px) scale(0.9); }
      to   { opacity:1; transform: translateX(0)    scale(1);   }
    }

    /* ── 单条导航项 ── */
    .snav-item {
      display: flex;
      align-items: center;
      gap: 8px;
      background: rgba(13,17,23,0.92);
      border: 1px solid rgba(88,166,255,0.20);
      border-radius: 28px;
      padding: 9px 16px 9px 11px;
      text-decoration: none;
      cursor: pointer;
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
      transition: background 0.16s, border-color 0.16s, transform 0.16s, box-shadow 0.16s;
      white-space: nowrap;
      box-shadow: 0 2px 14px rgba(0,0,0,0.40);
      min-width: 136px;
    }
    .snav-item:hover {
      background: rgba(88,166,255,0.16);
      border-color: rgba(88,166,255,0.50);
      transform: translateX(-4px);
      box-shadow: 0 4px 18px rgba(88,166,255,0.15);
    }
    .snav-item.active {
      background: linear-gradient(135deg, rgba(88,166,255,0.22), rgba(188,140,255,0.12));
      border-color: rgba(88,166,255,0.65);
      box-shadow: 0 0 0 1px rgba(88,166,255,0.20), 0 4px 16px rgba(88,166,255,0.18);
    }
    .snav-emoji {
      font-size: 16px;
      line-height: 1;
      width: 22px;
      text-align: center;
      flex-shrink: 0;
    }
    .snav-label {
      font-size: 13px;
      font-weight: 600;
      color: #c9d1d9;
      letter-spacing: 0.02em;
      flex: 1;
    }
    .snav-item.active .snav-label { color: #79c0ff; }
    .snav-dot {
      width: 6px; height: 6px; border-radius: 50%;
      background: #58a6ff;
      flex-shrink: 0;
      box-shadow: 0 0 6px #58a6ff;
      animation: snav-dot-glow 2s ease-in-out infinite;
    }
    @keyframes snav-dot-glow {
      0%,100% { box-shadow: 0 0 4px #58a6ff; }
      50%      { box-shadow: 0 0 10px #58a6ff; }
    }
    .snav-item:not(.active) .snav-dot { display: none; }

    /* ── 序号标签 ── */
    .snav-num {
      font-size: 10px;
      font-weight: 700;
      color: #4a6a8a;
      flex-shrink: 0;
      line-height: 1;
    }
    .snav-item.active .snav-num { color: #58a6ff; }

    /* ── 触发按钮（小挂件） ── */
    #snav-trigger {
      width: 50px;
      height: 50px;
      border-radius: 50%;
      background: linear-gradient(135deg, #1c2333 0%, #21262d 100%);
      border: 1.5px solid rgba(88,166,255,0.30);
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      box-shadow: 0 4px 20px rgba(0,0,0,0.50), 0 0 0 0 rgba(88,166,255,0);
      transition: transform 0.22s cubic-bezier(0.34,1.56,0.64,1),
                  box-shadow 0.22s ease,
                  border-color 0.22s ease;
      position: relative;
      overflow: visible;
      -webkit-tap-highlight-color: transparent;
    }
    #snav-trigger:hover {
      transform: scale(1.12);
      border-color: rgba(88,166,255,0.65);
      box-shadow: 0 6px 26px rgba(0,0,0,0.55), 0 0 18px rgba(88,166,255,0.28);
    }
    #snav-trigger.active-open {
      transform: scale(1.06) rotate(18deg);
      border-color: rgba(88,166,255,0.80);
      box-shadow: 0 6px 28px rgba(0,0,0,0.55), 0 0 22px rgba(88,166,255,0.38);
    }

    /* 触发按钮里的内容 */
    #snav-trigger-icon {
      font-size: 22px;
      line-height: 1;
      transition: transform 0.30s cubic-bezier(0.34,1.56,0.64,1), opacity 0.2s;
      display: block;
      position: relative;
      z-index: 1;
    }
    #snav-trigger.active-open #snav-trigger-icon {
      transform: rotate(-18deg) scale(0.88);
    }

    /* 呼吸光圈 */
    #snav-trigger::before {
      content: '';
      position: absolute;
      inset: -5px;
      border-radius: 50%;
      border: 1.5px solid rgba(88,166,255,0.28);
      animation: snav-pulse 2.8s ease-in-out infinite;
      pointer-events: none;
    }
    #snav-trigger::after {
      content: '';
      position: absolute;
      inset: -10px;
      border-radius: 50%;
      border: 1px solid rgba(88,166,255,0.12);
      animation: snav-pulse 2.8s ease-in-out 0.6s infinite;
      pointer-events: none;
    }
    @keyframes snav-pulse {
      0%,100% { transform: scale(1);    opacity: 0.7; }
      50%      { transform: scale(1.22); opacity: 0;   }
    }

    /* 小序号 badge */
    #snav-badge {
      position: absolute;
      top: -2px; right: -2px;
      width: 15px; height: 15px;
      border-radius: 50%;
      background: linear-gradient(135deg, #58a6ff, #79c0ff);
      border: 2px solid #0d1117;
      font-size: 8px;
      color: #0d1117;
      display: flex; align-items: center; justify-content: center;
      font-weight: 900;
      box-shadow: 0 0 8px rgba(88,166,255,0.65);
      z-index: 2;
    }

    /* 悬停提示文字 */
    #snav-hint {
      position: absolute;
      right: 58px;
      top: 50%;
      transform: translateY(-50%);
      background: rgba(13,17,23,0.92);
      border: 1px solid rgba(88,166,255,0.22);
      border-radius: 8px;
      padding: 5px 10px;
      font-size: 11px;
      color: #8b949e;
      white-space: nowrap;
      pointer-events: none;
      opacity: 0;
      transition: opacity 0.2s;
      backdrop-filter: blur(8px);
      z-index: 2;
    }
    #snav-trigger:hover #snav-hint { opacity: 1; }

    /* ── 遮罩（点击空白关闭） ── */
    #snav-backdrop {
      display: none;
      position: fixed; inset: 0;
      z-index: 9998;
    }
    #snav-backdrop.show { display: block; }

    /* 移动端 */
    @media (max-width: 600px) {
      #snav-wrap { right: 14px; bottom: 68px; }
      .snav-item { min-width: 124px; padding: 8px 14px 8px 10px; }
      .snav-label { font-size: 12px; }
      #snav-trigger { width: 46px; height: 46px; }
      #snav-trigger-icon { font-size: 20px; }
    }
  `;
  document.head.appendChild(style);

  /* ─── DOM 构建 ─── */
  const backdrop = document.createElement('div');
  backdrop.id = 'snav-backdrop';

  const wrap = document.createElement('div');
  wrap.id = 'snav-wrap';

  const menu = document.createElement('div');
  menu.id = 'snav-menu';

  PAGES.forEach((page, idx) => {
    const a = document.createElement('a');
    a.className = 'snav-item' + (page.key === cur ? ' active' : '');
    a.href = page.url;
    a.innerHTML = `
      <span class="snav-emoji">${page.emoji}</span>
      <span class="snav-label">${page.label}</span>
      <span class="snav-num">${idx + 1}</span>
      ${page.key === cur ? '<span class="snav-dot"></span>' : ''}
    `;
    if (page.key === cur) a.setAttribute('aria-current', 'page');
    menu.appendChild(a);
  });

  const curPage  = PAGES.find(p => p.key === cur);
  const badgeNum = PAGES.findIndex(p => p.key === cur) + 1 || '✦';
  const triggerEmoji = curPage ? curPage.emoji : '🗂️';

  const trigger = document.createElement('div');
  trigger.id = 'snav-trigger';
  trigger.setAttribute('role', 'button');
  trigger.setAttribute('tabindex', '0');
  trigger.setAttribute('aria-label', '站内导航');
  trigger.innerHTML = `
    <span id="snav-trigger-icon">${triggerEmoji}</span>
    <span id="snav-badge">${badgeNum}</span>
    <span id="snav-hint">站内导航</span>
  `;

  wrap.appendChild(menu);
  wrap.appendChild(trigger);

  /* ─── 交互逻辑 ─── */
  let isOpen = false;
  function toggleMenu() {
    isOpen = !isOpen;
    menu.classList.toggle('open', isOpen);
    trigger.classList.toggle('active-open', isOpen);
    backdrop.classList.toggle('show', isOpen);
  }
  function closeMenu() {
    if (!isOpen) return;
    isOpen = false;
    menu.classList.remove('open');
    trigger.classList.remove('active-open');
    backdrop.classList.remove('show');
  }

  trigger.addEventListener('click', (e) => { e.stopPropagation(); toggleMenu(); });
  backdrop.addEventListener('click', closeMenu);
  trigger.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleMenu(); }
    if (e.key === 'Escape') closeMenu();
  });

  /* 注入到 body */
  function inject() {
    document.body.appendChild(backdrop);
    document.body.appendChild(wrap);
    // 入场弹跳
    trigger.style.transform = 'scale(0)';
    trigger.style.transition = 'none';
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        trigger.style.transition = 'transform 0.55s cubic-bezier(0.34,1.56,0.64,1)';
        trigger.style.transform  = 'scale(1)';
      });
    });
  }

  if (document.body) { inject(); }
  else { document.addEventListener('DOMContentLoaded', inject); }
})();
