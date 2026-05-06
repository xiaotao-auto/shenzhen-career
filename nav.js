/**
 * nav.js — 唐小涛网站群 · 统一导航栏
 * 自动插入到 <body> 顶部，适配所有页面
 */
(function () {
  const BASE = 'https://xiaotao-auto.github.io/shenzhen-career';
  const NAV_PAGES = [
    { key: 'career',   label: '🏙️ 深圳职业图谱', url: BASE + '/shenzhen-career.html' },
    { key: 'housing',  label: '🏠 城市房价地图',  url: BASE + '/housing-price-viz/' },
    { key: 'graduate', label: '🎓 毕业生指南',    url: BASE + '/graduate-guide.html' },
    { key: 'guestbook',label: '💬 访客留言板',    url: BASE + '/guestbook.html' },
  ];

  // 判断当前页面 key
  function currentKey() {
    const p = location.pathname;
    if (p.includes('shenzhen-career.html')) return 'career';
    if (p.includes('housing-price-viz'))    return 'housing';
    if (p.includes('graduate-guide'))       return 'graduate';
    if (p.includes('guestbook'))            return 'guestbook';
    // index.html → career
    if (p.endsWith('/') || p.endsWith('index.html')) return 'career';
    return '';
  }

  const cur = currentKey();

  const style = document.createElement('style');
  style.textContent = `
    #site-nav {
      position: fixed; top: 0; left: 0; right: 0; z-index: 9999;
      background: rgba(13,17,23,0.95);
      backdrop-filter: blur(14px);
      -webkit-backdrop-filter: blur(14px);
      border-bottom: 1px solid rgba(48,54,61,0.8);
      display: flex; align-items: center; gap: 4px;
      padding: 0 16px; height: 48px;
      font-family: 'PingFang SC','Helvetica Neue','Arial',sans-serif;
      box-shadow: 0 2px 16px rgba(0,0,0,0.3);
    }
    #site-nav .nav-brand {
      font-size: 13px; font-weight: 800; color: #58a6ff;
      margin-right: 8px; white-space: nowrap; flex-shrink: 0;
      letter-spacing: 0.02em;
    }
    #site-nav .nav-links {
      display: flex; gap: 2px; align-items: center; flex: 1;
      overflow-x: auto; scrollbar-width: none;
    }
    #site-nav .nav-links::-webkit-scrollbar { display: none; }
    #site-nav .nav-link {
      display: inline-flex; align-items: center; gap: 5px;
      padding: 6px 12px; border-radius: 8px;
      font-size: 12px; font-weight: 500; white-space: nowrap;
      text-decoration: none; color: #8b949e;
      border: 1px solid transparent;
      transition: background 0.15s, color 0.15s, border-color 0.15s;
      cursor: pointer;
    }
    #site-nav .nav-link:hover {
      background: rgba(88,166,255,0.1);
      color: #58a6ff;
      border-color: rgba(88,166,255,0.25);
    }
    #site-nav .nav-link.active {
      background: rgba(88,166,255,0.18);
      color: #79c0ff;
      border-color: rgba(88,166,255,0.4);
      font-weight: 700;
    }
    #site-nav .nav-divider {
      width: 1px; height: 20px;
      background: rgba(48,54,61,0.8);
      flex-shrink: 0; margin: 0 4px;
    }
    /* 为 body 增加顶部 padding，防止内容被遮挡 */
    body.has-site-nav { padding-top: 48px !important; }
    @media (max-width: 600px) {
      #site-nav { padding: 0 10px; gap: 2px; }
      #site-nav .nav-brand { font-size: 12px; margin-right: 4px; }
      #site-nav .nav-link { padding: 5px 8px; font-size: 11px; }
    }
  `;
  document.head.appendChild(style);

  const nav = document.createElement('nav');
  nav.id = 'site-nav';

  const brand = document.createElement('div');
  brand.className = 'nav-brand';
  brand.textContent = '✦ 唐小涛';
  nav.appendChild(brand);

  const divider = document.createElement('div');
  divider.className = 'nav-divider';
  nav.appendChild(divider);

  const links = document.createElement('div');
  links.className = 'nav-links';
  NAV_PAGES.forEach(page => {
    const a = document.createElement('a');
    a.className = 'nav-link' + (page.key === cur ? ' active' : '');
    a.href = page.url;
    a.textContent = page.label;
    if (page.key === cur) a.setAttribute('aria-current', 'page');
    links.appendChild(a);
  });
  nav.appendChild(links);

  // 插入到 body 最前面
  function inject() {
    document.body.insertBefore(nav, document.body.firstChild);
    document.body.classList.add('has-site-nav');
  }

  if (document.body) {
    inject();
  } else {
    document.addEventListener('DOMContentLoaded', inject);
  }
})();
