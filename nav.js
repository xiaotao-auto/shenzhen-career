/**
 * nav.js — 唐小涛网站群 · 左侧纵向滑出导航 v4
 * 平时只显示左侧一条细线+小圆点，hover/点击后纵向滑出导航列表
 * 无署名，只保留站点切换功能
 */
(function () {
  const BASE = 'https://xiaotao-auto.github.io/shenzhen-career';
  const PAGES = [
    { key: 'graduate',  emoji: '🎓', label: '毕业生指南',   url: BASE + '/graduate-guide.html' },
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
    return '';
  }

  const cur = currentKey();

  const style = document.createElement('style');
  style.textContent = `
    /* ── 左侧触发条 ── */
    #snav-trigger {
      position: fixed;
      left: 0; top: 50%;
      transform: translateY(-50%);
      z-index: 9999;
      display: flex;
      align-items: center;
      cursor: pointer;
      -webkit-tap-highlight-color: transparent;
    }
    /* 细线 */
    #snav-trigger .snav-line {
      width: 4px;
      height: 64px;
      background: rgba(88,166,255,0.25);
      border-radius: 0 4px 4px 0;
      transition: height 0.3s ease, background 0.2s;
    }
    #snav-trigger:hover .snav-line,
    #snav-trigger.active .snav-line {
      height: 80px;
      background: rgba(88,166,255,0.6);
    }
    /* 小圆点 */
    #snav-trigger .snav-dot {
      width: 8px; height: 8px;
      border-radius: 50%;
      background: #58a6ff;
      margin-left: 3px;
      box-shadow: 0 0 6px rgba(88,166,255,0.7);
      animation: snav-pulse2 2.5s ease-in-out infinite;
    }
    @keyframes snav-pulse2 {
      0%,100% { transform: scale(1);   opacity: 0.7; }
      50%      { transform: scale(1.4); opacity: 1;   }
    }
    #snav-trigger .snav-emoji-mini {
      font-size: 14px;
      margin-left: 5px;
      opacity: 0;
      transition: opacity 0.2s;
      pointer-events: none;
    }
    #snav-trigger:hover .snav-emoji-mini,
    #snav-trigger.active .snav-emoji-mini {
      opacity: 1;
    }

    /* ── 滑出面板 ── */
    #snav-panel {
      position: fixed;
      left: -220px;
      top: 0;
      bottom: 0;
      width: 220px;
      z-index: 9998;
      background: rgba(13,17,23,0.96);
      border-right: 1px solid rgba(88,166,255,0.18);
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
      display: flex;
      flex-direction: column;
      padding: 80px 0 40px 0;
      gap: 2px;
      transition: left 0.32s cubic-bezier(0.22,1,0.36,1);
      box-shadow: 4px 0 24px rgba(0,0,0,0.4);
    }
    #snav-panel.open {
      left: 0;
    }

    /* ── 面板内标题 ── */
    #snav-panel .snav-panel-title {
      padding: 0 20px 16px;
      font-size: 11px;
      font-weight: 700;
      color: #4a6a8a;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      border-bottom: 1px solid rgba(88,166,255,0.10);
      margin-bottom: 8px;
    }

    /* ── 导航项 ── */
    #snav-panel .snav-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 11px 20px;
      text-decoration: none;
      color: #8b949e;
      font-size: 14px;
      font-weight: 500;
      transition: background 0.15s, color 0.15s, padding-left 0.2s;
      border-left: 3px solid transparent;
      position: relative;
    }
    #snav-panel .snav-item:hover {
      background: rgba(88,166,255,0.08);
      color: #c9d1d9;
      padding-left: 24px;
    }
    #snav-panel .snav-item.active {
      color: #79c0ff;
      background: rgba(88,166,255,0.10);
      border-left-color: #58a6ff;
    }
    #snav-panel .snav-item .snav-item-emoji {
      font-size: 18px;
      width: 24px;
      text-align: center;
      flex-shrink: 0;
    }
    #snav-panel .snav-item .snav-item-label {
      flex: 1;
    }
    #snav-panel .snav-item .snav-item-num {
      font-size: 10px;
      color: #3a5a7a;
      font-weight: 700;
    }
    #snav-panel .snav-item.active .snav-item-num {
      color: #58a6ff;
    }
    /* 当前页发光小点 */
    #snav-panel .snav-item .snav-item-active-dot {
      width: 6px; height: 6px;
      border-radius: 50%;
      background: #58a6ff;
      box-shadow: 0 0 6px #58a6ff;
      animation: snav-glow 2s ease-in-out infinite;
      flex-shrink: 0;
    }
    @keyframes snav-glow {
      0%,100% { box-shadow: 0 0 4px #58a6ff; }
      50%      { box-shadow: 0 0 10px #58a6ff; }
    }
    #snav-panel .snav-item:not(.active) .snav-item-active-dot {
      display: none;
    }

    /* ── 遮罩 ── */
    #snav-backdrop {
      display: none;
      position: fixed; inset: 0;
      z-index: 9997;
      background: rgba(0,0,0,0.3);
    }
    #snav-backdrop.show { display: block; }

    /* 移动端：面板变顶部滑出 */
    @media (max-width: 600px) {
      #snav-panel {
        left: auto;
        right: auto;
        top: auto;
        bottom: -100%;
        width: 100%;
        height: auto;
        flex-direction: row;
        padding: 12px 16px;
        border-right: none;
        border-top: 1px solid rgba(88,166,255,0.18);
        transition: bottom 0.32s cubic-bezier(0.22,1,0.36,1);
        box-shadow: 0 -4px 24px rgba(0,0,0,0.4);
      }
      #snav-panel.open { bottom: 0; }
      #snav-panel .snav-panel-title { display: none; }
      #snav-panel .snav-item {
        flex-direction: column;
        gap: 4px;
        padding: 10px 14px;
        border-left: none;
        border-top: 3px solid transparent;
        font-size: 12px;
        text-align: center;
      }
      #snav-panel .snav-item:hover { padding-left: 14px; }
      #snav-panel .snav-item.active { border-left: none; border-top-color: #58a6ff; }
      #snav-trigger { display: none; }
    }
  `;
  document.head.appendChild(style);

  /* ─── DOM ─── */
  const backdrop = document.createElement('div');
  backdrop.id = 'snav-backdrop';

  const trigger = document.createElement('div');
  trigger.id = 'snav-trigger';
  trigger.setAttribute('role', 'button');
  trigger.setAttribute('tabindex', '0');
  trigger.setAttribute('aria-label', '站内导航');
  const curPage = PAGES.find(p => p.key === cur);
  trigger.innerHTML = `
    <div class="snav-line"></div>
    <div class="snav-dot"></div>
    <span class="snav-emoji-mini">${curPage ? curPage.emoji : '🗂️'}</span>
  `;

  const panel = document.createElement('div');
  panel.id = 'snav-panel';
  panel.innerHTML = `
    <div class="snav-panel-title">唐小涛 · 网站群</div>
    ${PAGES.map((p, i) => `
      <a class="snav-item${p.key === cur ? ' active' : ''}"
         href="${p.url}"
         ${p.key === cur ? 'aria-current="page"' : ''}>
        <span class="snav-item-emoji">${p.emoji}</span>
        <span class="snav-item-label">${p.label}</span>
        <span class="snav-item-num">${i + 1}</span>
        ${p.key === cur ? '<span class="snav-item-active-dot"></span>' : ''}
      </a>
    `).join('')}
  `;

  /* ─── 交互 ─── */
  let isOpen = false;
  function toggle() {
    isOpen = !isOpen;
    panel.classList.toggle('open', isOpen);
    backdrop.classList.toggle('show', isOpen);
    trigger.classList.toggle('active', isOpen);
  }
  function close() {
    if (!isOpen) return;
    isOpen = false;
    panel.classList.remove('open');
    backdrop.classList.remove('show');
    trigger.classList.remove('active');
  }

  trigger.addEventListener('click', (e) => { e.stopPropagation(); toggle(); });
  backdrop.addEventListener('click', close);
  trigger.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); }
    if (e.key === 'Escape') close();
  });

  /* 鼠标靠近左侧自动滑出（桌面端） */
  let hoverTimer;
  if (window.innerWidth > 600) {
    document.addEventListener('mousemove', (e) => {
      if (isOpen) return;
      if (e.clientX < 18) {
        clearTimeout(hoverTimer);
        hoverTimer = setTimeout(toggle, 80);
      }
    });
    panel.addEventListener('mouseleave', () => {
      if (isOpen) {
        clearTimeout(hoverTimer);
        hoverTimer = setTimeout(close, 600);
      }
    });
    trigger.addEventListener('mouseenter', () => {
      if (!isOpen) {
        clearTimeout(hoverTimer);
        hoverTimer = setTimeout(toggle, 120);
      }
    });
  }

  /* 注入 */
  function inject() {
    document.body.appendChild(backdrop);
    document.body.appendChild(trigger);
    document.body.appendChild(panel);
  }
  if (document.body) { inject(); }
  else { document.addEventListener('DOMContentLoaded', inject); }
})();
