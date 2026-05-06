/**
 * nav.js — 唐小涛网站群 · 浮动导航小挂件 v2
 * 右侧固定，平时收起只显示一个可爱小图标，点击展开竖向导航列表
 */
(function () {
  const BASE = 'https://xiaotao-auto.github.io/shenzhen-career';
  const PAGES = [
    { key: 'career',    emoji: '🏙️', label: '深圳职业图谱', url: BASE + '/shenzhen-career.html' },
    { key: 'housing',   emoji: '🏠', label: '城市房价地图',  url: BASE + '/housing-price-viz/' },
    { key: 'graduate',  emoji: '🎓', label: '毕业生指南',    url: BASE + '/graduate-guide.html' },
    { key: 'guestbook', emoji: '💬', label: '访客留言板',    url: BASE + '/guestbook.html' },
  ];

  function currentKey() {
    const p = location.pathname;
    if (p.includes('shenzhen-career.html')) return 'career';
    if (p.includes('housing-price-viz'))    return 'housing';
    if (p.includes('graduate-guide'))       return 'graduate';
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
      margin-bottom: 10px;
      transform-origin: bottom right;
      transform: scale(0.7) translateY(12px);
      opacity: 0;
      pointer-events: none;
      transition: transform 0.28s cubic-bezier(0.34,1.56,0.64,1),
                  opacity 0.22s ease;
    }
    #snav-menu.open {
      transform: scale(1) translateY(0);
      opacity: 1;
      pointer-events: auto;
    }

    /* ── 单条导航项 ── */
    .snav-item {
      display: flex;
      align-items: center;
      gap: 8px;
      background: rgba(13,17,23,0.92);
      border: 1px solid rgba(88,166,255,0.22);
      border-radius: 24px;
      padding: 8px 14px 8px 10px;
      text-decoration: none;
      cursor: pointer;
      backdrop-filter: blur(14px);
      -webkit-backdrop-filter: blur(14px);
      transition: background 0.15s, border-color 0.15s, transform 0.15s;
      white-space: nowrap;
      box-shadow: 0 2px 12px rgba(0,0,0,0.35);
    }
    .snav-item:hover {
      background: rgba(88,166,255,0.18);
      border-color: rgba(88,166,255,0.55);
      transform: translateX(-3px);
    }
    .snav-item.active {
      background: rgba(88,166,255,0.2);
      border-color: rgba(88,166,255,0.6);
    }
    .snav-emoji {
      font-size: 16px;
      line-height: 1;
      width: 22px;
      text-align: center;
      flex-shrink: 0;
    }
    .snav-label {
      font-size: 12px;
      font-weight: 600;
      color: #c9d1d9;
      letter-spacing: 0.02em;
    }
    .snav-item.active .snav-label { color: #79c0ff; }
    .snav-dot {
      width: 5px; height: 5px; border-radius: 50%;
      background: #58a6ff;
      flex-shrink: 0;
      box-shadow: 0 0 4px #58a6ff;
    }
    .snav-item:not(.active) .snav-dot { display: none; }

    /* ── 触发按钮（小挂件） ── */
    #snav-trigger {
      width: 48px;
      height: 48px;
      border-radius: 50%;
      background: linear-gradient(135deg, #1c2333 0%, #21262d 100%);
      border: 1.5px solid rgba(88,166,255,0.35);
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      box-shadow: 0 4px 20px rgba(0,0,0,0.45), 0 0 0 0 rgba(88,166,255,0);
      transition: transform 0.2s cubic-bezier(0.34,1.56,0.64,1),
                  box-shadow 0.2s ease,
                  border-color 0.2s ease;
      position: relative;
      overflow: visible;
    }
    #snav-trigger:hover {
      transform: scale(1.1);
      border-color: rgba(88,166,255,0.7);
      box-shadow: 0 6px 24px rgba(0,0,0,0.5), 0 0 16px rgba(88,166,255,0.25);
    }
    #snav-trigger.active-open {
      transform: scale(1.05) rotate(20deg);
      border-color: rgba(88,166,255,0.8);
      box-shadow: 0 6px 28px rgba(0,0,0,0.55), 0 0 20px rgba(88,166,255,0.35);
    }

    /* 触发按钮里的内容 */
    #snav-trigger-icon {
      font-size: 22px;
      line-height: 1;
      transition: transform 0.3s cubic-bezier(0.34,1.56,0.64,1), opacity 0.2s;
      display: block;
    }
    #snav-trigger.active-open #snav-trigger-icon {
      transform: rotate(-20deg) scale(0.9);
    }

    /* 呼吸光圈 */
    #snav-trigger::before {
      content: '';
      position: absolute;
      inset: -4px;
      border-radius: 50%;
      border: 1.5px solid rgba(88,166,255,0.3);
      animation: snav-pulse 2.8s ease-in-out infinite;
      pointer-events: none;
    }
    @keyframes snav-pulse {
      0%, 100% { transform: scale(1); opacity: 0.6; }
      50% { transform: scale(1.18); opacity: 0; }
    }

    /* 小红点 badge（当前位置提示） */
    #snav-badge {
      position: absolute;
      top: -2px; right: -2px;
      width: 13px; height: 13px;
      border-radius: 50%;
      background: #58a6ff;
      border: 2px solid #0d1117;
      font-size: 8px;
      color: #0d1117;
      display: flex; align-items: center; justify-content: center;
      font-weight: 900;
      box-shadow: 0 0 6px rgba(88,166,255,0.7);
    }

    /* 弹出的小提示文字 */
    #snav-hint {
      position: absolute;
      right: 56px;
      top: 50%;
      transform: translateY(-50%);
      background: rgba(13,17,23,0.9);
      border: 1px solid rgba(88,166,255,0.25);
      border-radius: 8px;
      padding: 5px 10px;
      font-size: 11px;
      color: #8b949e;
      white-space: nowrap;
      pointer-events: none;
      opacity: 0;
      transition: opacity 0.2s;
      backdrop-filter: blur(8px);
    }
    #snav-trigger:hover #snav-hint { opacity: 1; }

    /* ── 遮罩（点击空白关闭） ── */
    #snav-backdrop {
      display: none;
      position: fixed; inset: 0;
      z-index: 9998;
    }
    #snav-backdrop.show { display: block; }

    /* 移动端微调 */
    @media (max-width: 600px) {
      #snav-wrap { right: 14px; bottom: 64px; }
      .snav-label { font-size: 11px; }
    }
  `;
  document.head.appendChild(style);

  /* ─── DOM ─── */
  const backdrop = document.createElement('div');
  backdrop.id = 'snav-backdrop';

  const wrap = document.createElement('div');
  wrap.id = 'snav-wrap';

  const menu = document.createElement('div');
  menu.id = 'snav-menu';

  PAGES.forEach(page => {
    const a = document.createElement('a');
    a.className = 'snav-item' + (page.key === cur ? ' active' : '');
    a.href = page.url;
    a.innerHTML = `
      <span class="snav-emoji">${page.emoji}</span>
      <span class="snav-label">${page.label}</span>
      ${page.key === cur ? '<span class="snav-dot"></span>' : ''}
    `;
    if (page.key === cur) a.setAttribute('aria-current', 'page');
    menu.appendChild(a);
  });

  const curPage = PAGES.find(p => p.key === cur);
  const triggerEmoji = curPage ? curPage.emoji : '✦';
  const badgeNum = PAGES.findIndex(p => p.key === cur) + 1 || '';

  const trigger = document.createElement('div');
  trigger.id = 'snav-trigger';
  trigger.setAttribute('role', 'button');
  trigger.setAttribute('aria-label', '站内导航');
  trigger.innerHTML = `
    <span id="snav-trigger-icon">${triggerEmoji}</span>
    <span id="snav-badge">${badgeNum}</span>
    <span id="snav-hint">站内导航</span>
  `;

  wrap.appendChild(menu);
  wrap.appendChild(trigger);

  /* ─── 交互 ─── */
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
  // 键盘支持
  trigger.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleMenu(); }
    if (e.key === 'Escape') closeMenu();
  });

  // 入场时微微弹跳
  function inject() {
    document.body.appendChild(backdrop);
    document.body.appendChild(wrap);
    setTimeout(() => {
      trigger.style.transition = 'transform 0.5s cubic-bezier(0.34,1.56,0.64,1)';
      trigger.style.transform = 'scale(1)';
    }, 300);
  }

  if (document.body) { inject(); }
  else { document.addEventListener('DOMContentLoaded', inject); }
})();
