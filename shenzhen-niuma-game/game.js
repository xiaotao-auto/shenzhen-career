/**
 * 深圳牛马狂扁老板 v2.0 - 像素街机发泄游戏
 * ============================================
 * 🎮 复古像素风 · 热梗解压 · 办公室场景
 * 
 * 6种热梗武器：🧦臭袜子🤮 · 🥧画大饼🐷 · 📝改方案👨‍🦲 · 👠穿小鞋😭 · 🧠PUA☁️ · 👗穿女装💃
 * 6阶段渐进伤情：傲慢→红肿→鼻青脸肿→满头绷带→全身骨折→社会性死亡
 * 每种武器都有独特惩罚视觉！
 * 作者：唐小涛
 */

// ==================== 游戏主逻辑 ====================

const GAME_WIDTH = 750;
const GAME_HEIGHT = 1334;
const PX = 4;

// ==================== 音效系统 ====================
class PixelAudio {
  constructor() {
    this.ctx = null;
    try { this.ctx = wx.createInnerAudioContext(); } catch(e) {}
  }
  playHit() {
    if (!this.ctx) return;
    try { const osc = this._createOsc(); if (osc) { osc.frequency.setValueAtTime(220, 0); osc.frequency.exponentialRampToValueAtTime(80, 0.1); } } catch(e) {}
  }
  playCoin() {
    if (!this.ctx) return;
    try { const osc = this._createOsc(); if (osc) { osc.frequency.setValueAtTime(523, 0); osc.frequency.setValueAtTime(659, 0.05); osc.frequency.setValueAtTime(784, 0.1); } } catch(e) {}
  }
  playCombo() {
    if (!this.ctx) return;
    try { const osc = this._createOsc(); if (osc) { osc.frequency.setValueAtTime(440, 0); osc.frequency.exponentialRampToValueAtTime(880, 0.15); } } catch(e) {}
  }
}

// ==================== 粒子系统 ====================
class Particle {
  constructor(x, y, color, type) {
    this.x = x; this.y = y;
    this.vx = (Math.random() - 0.5) * 12;
    this.vy = -Math.random() * 10 - 3;
    this.gravity = 0.4;
    this.life = 1;
    this.decay = 0.02 + Math.random() * 0.03;
    this.size = PX * (1 + Math.random() * 2);
    this.color = color;
    this.type = type || 'square';
    this.text = '';
    this.rotation = Math.random() * Math.PI * 2;
    this.rotSpeed = (Math.random() - 0.5) * 0.3;
  }
  update() {
    this.x += this.vx; this.vy += this.gravity; this.y += this.vy;
    this.life -= this.decay; this.rotation += this.rotSpeed;
    return this.life > 0;
  }
}

// ==================== 6种热梗武器 ====================
const TOOLS = [
  { id:'sock', name:'臭袜子', emoji:'🧦', damage:12, speed:1.2, color:'#6b8e23', desc:'毒气弹武器', particleColor:'#9acd32', hitText:['毒气弹!','生化武器!','臭死了!','熏晕了!'], effect:'vomit' },
  { id:'pie', name:'画大饼', emoji:'🥧', damage:15, speed:1.0, color:'#d4a017', desc:'越吃越胖', particleColor:'#ffd700', hitText:['大饼真香!','再吃一口!','撑死了!','饼太大了!'], effect:'fat' },
  { id:'doc', name:'改方案', emoji:'📝', damage:18, speed:0.8, color:'#7c3aed', desc:'越改越秃', particleColor:'#a78bfa', hitText:['再改一版!','第99版!','推翻重来!','需求变了!'], effect:'bald' },
  { id:'shoe', name:'穿小鞋', emoji:'👠', damage:20, speed:0.7, color:'#e74c3c', desc:'痛不欲生', particleColor:'#ff6b6b', hitText:['夹脚!','走不动!','太小了!','脚断了!'], effect:'pain' },
  { id:'pua', name:'PUA话术', emoji:'🧠', damage:25, speed:0.5, color:'#2d3436', desc:'精神暴击', particleColor:'#636e72', hitText:['你不行!','为你好!','别人都行!','想太多!'], effect:'depress' },
  { id:'dress', name:'穿女装', emoji:'👗', damage:30, speed:0.3, color:'#fd79a8', desc:'社会性死亡', particleColor:'#fab1a0', hitText:['美不美!','小裙子!','真好看!','大变样!'], effect:'crossdress' },
];

// ==================== 老板台词 ====================
const BOSS_LINES = {
  phase0: ['来加班吧~', '这个需求很急', '996是福报', 'PPT改一下', '年轻人多吃苦', '对齐一下颗粒度'],
  phase1: ['哎哟!', '你敢打我?!', '小心绩效!', '我可是总监!', '你等着!', 'HR会找你的!'],
  phase2: ['别打了别打了!', '我脸都肿了!', '工伤!工伤!', '我要告你!', '呜呜呜...', '算我求你!'],
  phase3: ['求求了...', '我投降...', '不画饼了...', '我不敢了...', '放我走吧...', '工资照发...'],
  phase4: ['...呜...', '(已失去意识)', '(全身骨折)', '(只剩一口气)', '(白旗投降)'],
  phase5: ['......', '(已社会性死亡)', '(求放过)', '(再无颜面)', '(彻底崩溃)'],
};

const PHASE_NAMES = ['傲慢', '红肿', '鼻青脸肿', '满头绷带', '全身骨折', '社会性死亡'];
const PHASE_COLORS = ['#aaaaaa', '#ff9f43', '#e74c3c', '#9b59b6', '#8e44ad', '#6c3483'];
const SKIN_COLORS = ['#f5cba7', '#f0a080', '#e08070', '#c090a0', '#b0a0b0', '#908090'];

// ==================== 游戏主类 ====================
class Game {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.width = GAME_WIDTH;
    this.height = GAME_HEIGHT;

    this.state = 'menu';
    this.score = 0; this.combo = 0; this.maxCombo = 0; this.totalHits = 0;
    this.lastHitTime = 0; this.comboTimer = 0;

    this.bossHP = 1200; this.bossMaxHP = 1200;
    this.bossX = this.width / 2; this.bossY = this.height * 0.35;
    this.bossPhase = 0;
    this.bossShakeX = 0; this.bossShakeY = 0;
    this.bossFlashTimer = 0; this.bossScale = 1;
    this.bossHitAnim = 0;
    this.bossDialog = '来加班吧~'; this.bossDialogTimer = 0;
    this.bossTremble = 0;

    this.bruises = []; this.bandages = [];
    this.currentTool = TOOLS[0];
    this.particles = []; this.floatingTexts = [];
    this.attackAnim = 0; this.attackX = 0; this.attackY = 0;
    this.screenShake = 0;

    // 武器特效状态
    this.effectVomit = 0; this.effectFat = 0; this.effectBald = 0;
    this.effectPain = 0; this.effectDepress = 0; this.effectDress = 0;
    this.baldProgress = 0; this.fatProgress = 0;
    this.depressAura = 0; this.painTears = 0;

    this.touching = false; this.touchX = 0; this.touchY = 0;
    this.time = 0;
    this.officeClock = 0;

    this.stars = [];
    for (let i = 0; i < 30; i++) {
      this.stars.push({ x: Math.random() * this.width, y: Math.random() * this.height * 0.3, size: PX * (0.5 + Math.random()), blink: Math.random() * Math.PI * 2 });
    }

    this.bindEvents();
    this.loop();
  }

  bindEvents() {
    wx.onTouchStart((e) => {
      const touch = e.touches[0];
      this.touchX = touch.clientX * (this.width / wx.getSystemInfoSync().windowWidth);
      this.touchY = touch.clientY * (this.height / wx.getSystemInfoSync().windowHeight);
      this.touching = true;
      this.handleTap(this.touchX, this.touchY);
    });
    wx.onTouchMove((e) => {
      const touch = e.touches[0];
      this.touchX = touch.clientX * (this.width / wx.getSystemInfoSync().windowWidth);
      this.touchY = touch.clientY * (this.height / wx.getSystemInfoSync().windowHeight);
      if (this.state === 'playing') {
        const now = Date.now();
        if (now - this.lastHitTime > 100) this.attack(this.touchX, this.touchY);
      }
    });
    wx.onTouchEnd(() => { this.touching = false; });
  }

  handleTap(x, y) {
    if (this.state === 'menu') {
      if (x > this.width * 0.1 && x < this.width * 0.9 && y > this.height * 0.55 && y < this.height * 0.65) this.startGame();
      return;
    }
    if (this.state === 'gameover') {
      if (x > this.width * 0.2 && x < this.width * 0.8 && y > this.height * 0.68 && y < this.height * 0.76) this.state = 'menu';
      return;
    }
    if (this.state === 'playing') {
      const toolBarY = this.height * 0.78;
      if (y > toolBarY) { this.selectTool(x, y); return; }
      this.attack(x, y);
    }
  }

  selectTool(x, y) {
    const pad = 20, cols = 3, gap = 10;
    const toolBarStartY = this.height * 0.80;
    const toolW = (this.width - pad * 2 - gap * 2) / cols;
    for (let i = 0; i < TOOLS.length; i++) {
      const row = Math.floor(i / cols), col = i % cols;
      const tx = pad + col * (toolW + gap), ty = toolBarStartY + row * (toolW * 0.7);
      if (x > tx && x < tx + toolW && y > ty && y < ty + toolW * 0.65) {
        this.currentTool = TOOLS[i];
        this.bossDialog = `你选了${TOOLS[i].name}？！`;
        this.bossDialogTimer = 60;
        return;
      }
    }
  }

  startGame() {
    this.state = 'playing';
    this.score = 0; this.combo = 0; this.maxCombo = 0; this.totalHits = 0;
    this.bossHP = this.bossMaxHP; this.bossPhase = 0;
    this.bossDialog = '来加班吧~'; this.bossTremble = 0;
    this.particles = []; this.floatingTexts = [];
    this.bruises = []; this.bandages = [];
    this.currentTool = TOOLS[0];
    this.effectVomit = 0; this.effectFat = 0; this.effectBald = 0;
    this.effectPain = 0; this.effectDepress = 0; this.effectDress = 0;
    this.baldProgress = 0; this.fatProgress = 0;
    this.depressAura = 0; this.painTears = 0;
  }

  attack(x, y) {
    if (this.state !== 'playing' || this.bossHP <= 0) return;
    const dx = x - this.bossX, dy = y - this.bossY;
    if (dx * dx + dy * dy > 300 * 300) return;

    const now = Date.now();
    if (now - this.lastHitTime < 1500) { this.combo++; if (this.combo > this.maxCombo) this.maxCombo = this.combo; }
    else { this.combo = 1; }
    this.lastHitTime = now; this.comboTimer = 60;

    const comboBonus = Math.min(this.combo * 0.1, 2.0);
    const damage = Math.floor(this.currentTool.damage * (1 + comboBonus));
    this.bossHP = Math.max(0, this.bossHP - damage);
    this.score += damage * this.combo; this.totalHits++;

    this.attackAnim = 15; this.attackX = x; this.attackY = y;
    this.screenShake = 10 + Math.min(this.combo, 10);
    this.bossFlashTimer = 8; this.bossHitAnim = 12;
    this.bossShakeX = (Math.random() - 0.5) * 20;
    this.bossShakeY = (Math.random() - 0.5) * 20;

    // 武器特效
    const eff = this.currentTool.effect;
    if (eff === 'vomit') this.effectVomit = 90;
    else if (eff === 'fat') { this.effectFat = 120; this.fatProgress = Math.min(1, this.fatProgress + 0.2); }
    else if (eff === 'bald') { this.effectBald = 150; this.baldProgress = Math.min(1, this.baldProgress + 0.25); }
    else if (eff === 'pain') { this.effectPain = 90; this.painTears = 60; }
    else if (eff === 'depress') { this.effectDepress = 120; this.depressAura = 1; }
    else if (eff === 'crossdress') this.effectDress = 150;

    // 更新阶段
    const hpR = this.bossHP / this.bossMaxHP;
    const prevPhase = this.bossPhase;
    if (hpR <= 0.0) this.bossPhase = 5;
    else if (hpR <= 0.05) this.bossPhase = 4;
    else if (hpR <= 0.20) this.bossPhase = 3;
    else if (hpR <= 0.45) this.bossPhase = 2;
    else if (hpR <= 0.70) this.bossPhase = 1;
    else this.bossPhase = 0;

    if (this.bossPhase > prevPhase) {
      this.screenShake = 18;
      for (let k = 0; k < 20; k++) {
        const p = new Particle(this.bossX + (Math.random() - 0.5) * 120, this.bossY + (Math.random() - 0.5) * 80, '#ffffff', 'square');
        p.vx = (Math.random() - 0.5) * 8; p.vy = -Math.random() * 6 - 2; p.gravity = 0.15; p.size = PX * (2 + Math.random() * 3);
        this.particles.push(p);
      }
    }

    if (this.bossPhase >= 1 && this.bruises.length < 15) {
      this.bruises.push({ ox: (Math.random() - 0.5) * 16 * PX, oy: (Math.random() - 0.8) * 12 * PX, sz: PX * (1 + Math.random() * 2.5), alpha: 0.6 + Math.random() * 0.4 });
    }
    if (this.bossPhase >= 3 && this.bandages.length < 10) {
      this.bandages.push({ ox: (Math.random() - 0.5) * 18 * PX, oy: (Math.random() - 0.5) * 18 * PX, w: PX * (2 + Math.random() * 5), h: PX * (1 + Math.random()) });
    }

    this.bossTremble = [0, 1.5, 2.5, 4, 6, 8][this.bossPhase];

    const phaseKey = 'phase' + this.bossPhase;
    const lines = BOSS_LINES[phaseKey];
    this.bossDialog = lines[Math.floor(Math.random() * lines.length)];
    this.bossDialogTimer = 50;

    // 粒子
    const pCount = 8 + this.bossPhase * 4;
    for (let i = 0; i < pCount; i++) this.particles.push(new Particle(x, y, this.currentTool.particleColor, 'square'));

    // 武器特效粒子
    if (eff === 'vomit') {
      for (let i = 0; i < 10; i++) {
        const p = new Particle(this.bossX + (Math.random() - 0.5) * 30, this.bossY - 2 * PX, i % 2 === 0 ? '#7cfc00' : '#9acd32', 'square');
        p.vx = (Math.random() - 0.5) * 6; p.vy = Math.random() * 4 + 2; p.gravity = 0.4; p.size = PX * (2 + Math.random() * 3);
        this.particles.push(p);
      }
    } else if (eff === 'fat') {
      for (let i = 0; i < 8; i++) {
        const p = new Particle(this.bossX + (Math.random() - 0.5) * 40, this.bossY - 8 * PX, i % 2 === 0 ? '#ffd700' : '#d4a017', 'square');
        p.vx = (Math.random() - 0.5) * 4; p.vy = Math.random() * 3 + 1; p.gravity = 0.2; p.size = PX * (2 + Math.random() * 2);
        this.particles.push(p);
      }
    } else if (eff === 'bald') {
      for (let i = 0; i < 6; i++) {
        const p = new Particle(this.bossX + (Math.random() - 0.5) * 40, this.bossY - 22 * PX, '#1a1a2e', 'square');
        p.vx = (Math.random() - 0.5) * 8; p.vy = -Math.random() * 6 - 2; p.gravity = 0.1; p.size = PX * (1 + Math.random());
        this.particles.push(p);
      }
    } else if (eff === 'pain') {
      for (let i = 0; i < 8; i++) {
        const p = new Particle(this.bossX + (Math.random() - 0.5) * 30, this.bossY - 10 * PX, '#5dade2', 'square');
        p.vx = (Math.random() - 0.5) * 4; p.vy = Math.random() * 6 + 2; p.gravity = 0.3; p.size = PX * (1 + Math.random());
        this.particles.push(p);
      }
    } else if (eff === 'depress') {
      for (let i = 0; i < 8; i++) {
        const angle = Math.random() * 6.28;
        const p = new Particle(this.bossX + Math.cos(angle) * 60, this.bossY + Math.sin(angle) * 50, '#2d3436', 'square');
        p.vx = -Math.cos(angle) * 2; p.vy = -Math.sin(angle) * 2; p.gravity = 0; p.size = PX * (3 + Math.random() * 3);
        this.particles.push(p);
      }
    } else if (eff === 'crossdress') {
      const sparkles = ['#ff69b4', '#ffb6c1', '#ffd700', '#fff'];
      for (let i = 0; i < 10; i++) {
        const p = new Particle(this.bossX + (Math.random() - 0.5) * 80, this.bossY + (Math.random() - 0.5) * 80, sparkles[Math.floor(Math.random() * sparkles.length)], 'square');
        p.vx = (Math.random() - 0.5) * 6; p.vy = -Math.random() * 5 - 1; p.gravity = 0.1; p.size = PX * (1.5 + Math.random() * 2);
        this.particles.push(p);
      }
    }

    // 伤害数字
    this.floatingTexts.push({
      x: x + (Math.random() - 0.5) * 60, y: y - 40,
      text: `-${damage}`, color: this.combo >= 5 ? '#ffd700' : this.combo >= 3 ? '#ff6b6b' : '#ffffff',
      size: 20 + Math.min(this.combo * 3, 30), life: 1, vy: -3,
    });

    if (this.combo >= 2) {
      const ht = this.currentTool.hitText;
      this.floatingTexts.push({
        x: this.bossX + (Math.random() - 0.5) * 120, y: this.bossY - 140,
        text: ht[Math.floor(Math.random() * ht.length)], color: this.currentTool.color, size: 28, life: 1, vy: -3,
      });
    }

    if (this.bossHP <= 0) {
      this.bossPhase = 5; this.bossDialog = '(社会性死亡)...'; this.bossDialogTimer = 999; this.bossTremble = 10;
      const colors = ['#ff6b6b', '#ffd700', '#4a9eff', '#66bb6a', '#ff69b4', '#9b59b6'];
      for (let i = 0; i < 80; i++) {
        const p = new Particle(this.width / 2 + (Math.random() - 0.5) * 500, this.height * 0.3, colors[Math.floor(Math.random() * colors.length)], 'square');
        p.vy = -Math.random() * 16 - 5; p.vx = (Math.random() - 0.5) * 16;
        this.particles.push(p);
      }
      setTimeout(() => { this.state = 'gameover'; }, 2500);
    }
  }

  update() {
    this.time++;
    if (this.state !== 'playing') return;

    this.particles = this.particles.filter(p => p.update());
    this.floatingTexts = this.floatingTexts.filter(t => { t.y += t.vy; t.life -= 0.025; return t.life > 0; });
    this.bossShakeX *= 0.85; this.bossShakeY *= 0.85;
    if (this.bossFlashTimer > 0) this.bossFlashTimer--;
    if (this.bossHitAnim > 0) this.bossHitAnim--;
    if (this.screenShake > 0) this.screenShake *= 0.8;
    if (this.attackAnim > 0) this.attackAnim--;
    if (this.comboTimer > 0) this.comboTimer--;
    if (this.bossDialogTimer > 0) this.bossDialogTimer--;

    if (this.effectVomit > 0) this.effectVomit--;
    if (this.effectFat > 0) this.effectFat--;
    if (this.effectBald > 0) this.effectBald--;
    if (this.effectPain > 0) { this.effectPain--; this.painTears--; }
    if (this.effectDepress > 0) { this.effectDepress--; this.depressAura = Math.max(0, this.depressAura - 0.008); }
    if (this.effectDress > 0) this.effectDress--;

    const breathe = Math.sin(this.time * 0.06) * 0.03;
    const tremble = this.bossTremble > 0 ? (Math.random() - 0.5) * this.bossTremble : 0;
    this.bossScale = 1 + breathe;
    this.bossX = this.width / 2 + tremble;
  }

  render() {
    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.width, this.height);
    ctx.save();
    if (this.screenShake > 0.5) ctx.translate((Math.random() - 0.5) * this.screenShake, (Math.random() - 0.5) * this.screenShake);

    if (this.state === 'menu') { this.drawOffice(ctx); this.renderMenu(ctx); }
    else { this.renderGame(ctx); if (this.state === 'gameover') this.renderGameOver(ctx); }

    ctx.restore();
  }

  // ==================== 办公室背景 ====================
  drawOffice(ctx) {
    // 墙壁
    const wallG = ctx.createLinearGradient(0, 0, 0, this.height * 0.55);
    wallG.addColorStop(0, '#e8e0d8'); wallG.addColorStop(1, '#d5ccc3');
    ctx.fillStyle = wallG;
    ctx.fillRect(0, 0, this.width, this.height * 0.55);

    // 地板
    const floorG = ctx.createLinearGradient(0, this.height * 0.55, 0, this.height * 0.72);
    floorG.addColorStop(0, '#8b7355'); floorG.addColorStop(1, '#6b5540');
    ctx.fillStyle = floorG;
    ctx.fillRect(0, this.height * 0.55, this.width, this.height * 0.17);

    // 地板纹理
    ctx.fillStyle = 'rgba(0,0,0,0.06)';
    for (let x = 0; x < this.width; x += 60) ctx.fillRect(x, this.height * 0.55, 2, this.height * 0.17);
    for (let y = this.height * 0.55; y < this.height * 0.72; y += 30) ctx.fillRect(0, y, this.width, 2);

    // 踢脚线
    ctx.fillStyle = '#a09080';
    ctx.fillRect(0, this.height * 0.53, this.width, 10);

    // 窗户
    ctx.fillStyle = '#87CEEB';
    ctx.fillRect(this.width * 0.65, this.height * 0.03, 120, 80);
    ctx.fillStyle = '#6bb7d0';
    ctx.fillRect(this.width * 0.65 + 3, this.height * 0.03 + 3, 55, 36);
    ctx.fillRect(this.width * 0.65 + 62, this.height * 0.03 + 3, 55, 36);
    ctx.fillRect(this.width * 0.65 + 3, this.height * 0.03 + 42, 55, 36);
    ctx.fillRect(this.width * 0.65 + 62, this.height * 0.03 + 42, 55, 36);
    ctx.fillStyle = '#f5f0eb';
    ctx.fillRect(this.width * 0.65, this.height * 0.03, 120, 4);
    ctx.fillRect(this.width * 0.65, this.height * 0.03 + 76, 120, 4);
    ctx.fillRect(this.width * 0.65, this.height * 0.03, 4, 80);
    ctx.fillRect(this.width * 0.65 + 116, this.height * 0.03, 4, 80);
    ctx.fillRect(this.width * 0.65 + 57, this.height * 0.03, 4, 80);
    ctx.fillRect(this.width * 0.65, this.height * 0.03 + 38, 120, 4);

    // 时钟
    this.officeClock = (this.officeClock + 0.02) % 6.28;
    ctx.fillStyle = '#fff';
    ctx.beginPath(); ctx.arc(this.width * 0.3, this.height * 0.08, 24, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = '#333'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.arc(this.width * 0.3, this.height * 0.08, 24, 0, Math.PI * 2); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(this.width * 0.3, this.height * 0.08);
    ctx.lineTo(this.width * 0.3 + Math.cos(this.officeClock) * 14, this.height * 0.08 + Math.sin(this.officeClock) * 14);
    ctx.stroke();

    // 书架
    ctx.fillStyle = '#8b6f47';
    ctx.fillRect(10, this.height * 0.14, 80, 140);
    ctx.fillStyle = '#a08060';
    ctx.fillRect(14, this.height * 0.18, 72, 4);
    ctx.fillRect(14, this.height * 0.48, 72, 4);
    const bookColors = ['#e74c3c','#3498db','#2ecc71','#f39c12','#9b59b6'];
    for (let i = 0; i < 5; i++) { ctx.fillStyle = bookColors[i]; ctx.fillRect(18 + i * 12, this.height * 0.22, 10, 24); }
    for (let i = 0; i < 4; i++) { ctx.fillStyle = bookColors[(i+2)%5]; ctx.fillRect(20 + i * 14, this.height * 0.52, 12, 20); }

    // 办公桌
    ctx.fillStyle = '#5c3d2e';
    ctx.fillRect(this.width * 0.05, this.height * 0.46, this.width * 0.9, 24);
    ctx.fillRect(this.width * 0.08, this.height * 0.46 + 24, 12, 50);
    ctx.fillRect(this.width * 0.87, this.height * 0.46 + 24, 12, 50);

    // 显示器
    ctx.fillStyle = '#2c3e50';
    ctx.fillRect(this.width * 0.12, this.height * 0.39, 80, 56);
    ctx.fillStyle = '#1a252f';
    ctx.fillRect(this.width * 0.12 + 4, this.height * 0.39 + 4, 72, 44);
    ctx.fillStyle = '#e74c3c'; ctx.fillRect(this.width * 0.12 + 10, this.height * 0.39 + 30, 12, 12);
    ctx.fillStyle = '#f39c12'; ctx.fillRect(this.width * 0.12 + 26, this.height * 0.39 + 24, 12, 18);
    ctx.fillStyle = '#2ecc71'; ctx.fillRect(this.width * 0.12 + 42, this.height * 0.39 + 18, 12, 24);

    // 键盘
    ctx.fillStyle = '#444';
    ctx.fillRect(this.width * 0.22, this.height * 0.438, 60, 16);
    ctx.fillStyle = '#555';
    for (let r = 0; r < 3; r++) for (let c = 0; c < 8; c++) ctx.fillRect(this.width * 0.22 + 4 + c * 6.5, this.height * 0.438 + 3 + r * 4, 5, 3);

    // 咖啡
    ctx.fillStyle = '#fff';
    ctx.fillRect(this.width * 0.72, this.height * 0.43, 20, 28);
    ctx.fillStyle = '#6b3a1f';
    ctx.fillRect(this.width * 0.72 + 3, this.height * 0.43 + 3, 14, 14);

    // 便利贴
    ctx.fillStyle = '#ffd700';
    ctx.fillRect(this.width * 0.50, this.height * 0.40, 32, 32);
    ctx.fillStyle = '#333'; ctx.font = '8px sans-serif'; ctx.textAlign = 'left';
    ctx.fillText('DDL:', this.width * 0.50 + 3, this.height * 0.40 + 12);
    ctx.fillText('今天!', this.width * 0.50 + 3, this.height * 0.40 + 22);

    // 标语
    ctx.fillStyle = '#fff';
    ctx.fillRect(this.width * 0.30, this.height * 0.03, 120, 28);
    ctx.strokeStyle = '#e74c3c'; ctx.lineWidth = 2;
    ctx.strokeRect(this.width * 0.30, this.height * 0.03, 120, 28);
    ctx.fillStyle = '#e74c3c'; ctx.font = 'bold 12px sans-serif'; ctx.textAlign = 'center';
    ctx.fillText('奋斗才是福报', this.width * 0.30 + 60, this.height * 0.03 + 18);
  }

  // ==================== 超大老板 + 武器特效 ====================
  drawBoss(ctx, x, y, phase, sc) {
    ctx.save();
    ctx.translate(x + this.bossShakeX, y + this.bossShakeY);
    ctx.scale(sc, sc);

    const flash = this.bossFlashTimer > 0;
    const hit = this.bossHitAnim > 0;
    if (hit) { const hitProg = this.bossHitAnim / 12; ctx.rotate(-0.2 * hitProg); ctx.translate(0, -8 * hitProg); }

    const p = PX;
    const skinC = flash ? '#fff' : SKIN_COLORS[phase];
    const isDress = this.effectDress > 0;
    const suitC = flash ? '#fff' : (isDress ? '#ff69b4' : '#2c3e50');
    const shirtC = flash ? '#fff' : (isDress ? '#ffb6c1' : '#ecf0f1');
    const tieC = flash ? '#fff' : (isDress ? '#ff1493' : '#e74c3c');
    const hairC = flash ? '#fff' : '#1a1a2e';
    const fatScale = 1 + this.fatProgress * 0.8;

    // 抑郁暗黑气场
    if (this.effectDepress > 0 || this.depressAura > 0) {
      const auraA = Math.max(this.effectDepress > 0 ? 0.4 : 0, this.depressAura);
      if (auraA > 0) {
        ctx.fillStyle = `rgba(30,30,50,${auraA * 0.5})`;
        ctx.beginPath(); ctx.arc(0, 0, 28 * p, 0, Math.PI * 2); ctx.fill();
        for (let i = 0; i < 6; i++) {
          const da = this.time * 0.05 + i * 1.047;
          const dr = (20 + Math.sin(this.time * 0.03 + i) * 5) * p;
          ctx.fillStyle = `rgba(20,20,40,${auraA * 0.3})`;
          ctx.fillRect(Math.cos(da) * dr - 3*p, Math.sin(da) * dr - 3*p, 6*p, 6*p);
        }
      }
    }

    // 头发 + 秃头效果
    ctx.fillStyle = hairC;
    const baldFactor = this.baldProgress;
    if (phase >= 3) {
      if (baldFactor < 0.8) {
        ctx.fillRect(-10*p, -24*p, 20*p * (1-baldFactor*0.5), 3*p);
        ctx.fillRect(-11*p, -21*p, 22*p * (1-baldFactor*0.5), 2*p);
      }
      ctx.fillStyle = skinC;
      ctx.fillRect(-4*p, -24*p, 8*p * baldFactor, 3*p);
      if (baldFactor > 0.5) { ctx.fillStyle = 'rgba(255,255,255,0.3)'; ctx.fillRect(-2*p, -24*p, 4*p, 2*p); }
    } else if (baldFactor > 0.1) {
      const hairDrawW = 20 * p * (1 - baldFactor * 0.7);
      ctx.fillRect(-hairDrawW/2, -24*p, hairDrawW, 3*p);
      ctx.fillRect(-hairDrawW/2 - p, -21*p, hairDrawW + 2*p, 2*p);
      if (baldFactor > 0.3) {
        ctx.fillStyle = skinC;
        const baldW = 10 * p * baldFactor;
        ctx.fillRect(-baldW/2, -24*p, baldW, 3*p);
        ctx.fillStyle = `rgba(255,255,255,${baldFactor * 0.4})`;
        ctx.fillRect(-baldW/4, -24*p, baldW/2, 2*p);
      }
      if (baldFactor < 0.7) { ctx.fillStyle = hairC; ctx.fillRect(5*p * (1-baldFactor), -27*p, 2*p, 3*p); }
    } else {
      ctx.fillRect(-11*p, -24*p, 22*p, 3*p);
      ctx.fillRect(-12*p, -21*p, 24*p, 2*p);
    }

    // 女装蝴蝶结
    if (isDress) {
      ctx.fillStyle = '#ff1493';
      ctx.fillRect(-14*p, -25*p, 6*p, 3*p);
      ctx.fillRect(8*p, -25*p, 6*p, 3*p);
      ctx.fillRect(-4*p, -26*p, 8*p, 3*p);
      ctx.fillStyle = '#ff69b4';
      ctx.fillRect(-2*p, -26*p, 4*p, 2*p);
    }

    // 脸 (大+变胖)
    ctx.fillStyle = skinC;
    const faceW = 10 * p * fatScale;
    ctx.fillRect(-faceW, -21*p, faceW * 2, 18 * p);
    if (phase >= 2) { ctx.fillRect(-faceW - p, -19*p, 2*p, 14*p); ctx.fillRect(faceW - p, -19*p, 2*p, 14*p); }
    if (this.fatProgress > 0.3) ctx.fillRect(-faceW + p, -5*p, faceW * 2 - 2*p, 3*p * this.fatProgress);

    // 淤青
    if (phase >= 1 && !flash) {
      for (let i = 0; i < this.bruises.length; i++) {
        const b = this.bruises[i];
        ctx.fillStyle = `rgba(80,40,120,${b.alpha * 0.6})`;
        ctx.fillRect(b.ox, b.oy, b.sz, b.sz);
        ctx.fillStyle = `rgba(180,60,60,${b.alpha * 0.4})`;
        ctx.fillRect(b.ox - p, b.oy, p, b.sz);
        ctx.fillRect(b.ox + b.sz, b.oy, p, b.sz);
      }
    }

    // 黑眼圈
    if (phase >= 1 && !flash) {
      const eyeBagAlpha = [0, 0.3, 0.5, 0.7, 0.9, 1.0][phase];
      ctx.fillStyle = `rgba(60,30,80,${eyeBagAlpha})`;
      ctx.fillRect(-9*p, -16*p, 7*p, 5*p);
      ctx.fillRect(2*p, -16*p, 7*p, 5*p);
    }

    // 眼睛
    if (this.effectDepress > 0) {
      ctx.fillStyle = '#555'; ctx.fillRect(-8*p, -14*p, 6*p, 2*p); ctx.fillRect(2*p, -14*p, 6*p, 2*p);
      ctx.fillStyle = '#888'; ctx.fillRect(-6*p, -14*p, 2*p, 2*p); ctx.fillRect(4*p, -14*p, 2*p, 2*p);
    } else if (phase >= 4) {
      ctx.fillStyle = '#000';
      ctx.fillRect(-8*p, -16*p, 6*p, p); ctx.fillRect(-7*p, -15*p, 5*p, p); ctx.fillRect(-7*p, -13*p, 5*p, p); ctx.fillRect(-6*p, -12*p, 4*p, p);
      ctx.fillRect(2*p, -16*p, 6*p, p); ctx.fillRect(3*p, -15*p, 5*p, p); ctx.fillRect(3*p, -13*p, 5*p, p); ctx.fillRect(4*p, -12*p, 4*p, p);
    } else if (phase >= 3) {
      ctx.fillStyle = '#fff'; ctx.fillRect(-8*p, -15*p, 6*p, 4*p); ctx.fillRect(2*p, -15*p, 6*p, 4*p);
      ctx.fillStyle = '#000';
      ctx.fillRect(-7*p, -14*p, p, p); ctx.fillRect(-6*p, -15*p, p, p); ctx.fillRect(-5*p, -14*p, p, p); ctx.fillRect(-4*p, -13*p, p, p);
      ctx.fillRect(3*p, -14*p, p, p); ctx.fillRect(4*p, -15*p, p, p); ctx.fillRect(5*p, -14*p, p, p); ctx.fillRect(6*p, -13*p, p, p);
    } else if (phase >= 2) {
      ctx.fillStyle = '#000'; ctx.fillRect(-8*p, -14*p, 6*p, p); ctx.fillRect(2*p, -14*p, 6*p, p);
      if (!flash) { ctx.fillStyle = '#5dade2'; ctx.fillRect(-8*p, -13*p, p, 4*p); ctx.fillRect(7*p, -13*p, p, 4*p); }
      if (this.painTears > 0 || phase >= 2) { ctx.fillRect(-9*p, -12*p, p, 6*p); ctx.fillRect(8*p, -12*p, p, 6*p); }
    } else if (phase >= 1) {
      ctx.fillStyle = '#000'; ctx.fillRect(-8*p, -15*p, 6*p, 3*p); ctx.fillRect(2*p, -15*p, 6*p, 3*p);
      ctx.fillRect(-9*p, -17*p, 7*p, p); ctx.fillRect(2*p, -17*p, 7*p, p);
    } else {
      ctx.fillStyle = '#000'; ctx.fillRect(-8*p, -15*p, 6*p, 3*p); ctx.fillRect(2*p, -15*p, 6*p, 3*p);
      ctx.fillRect(-9*p, -17*p, 7*p, p); ctx.fillRect(2*p, -17*p, 7*p, p);
    }

    // 鼻子
    if (phase >= 2 && !flash) {
      ctx.fillStyle = '#e74c3c'; ctx.fillRect(-2*p, -11*p, 5*p, 4*p);
      ctx.fillStyle = '#c0392b'; ctx.fillRect(-p, -7*p, p, 5*p); ctx.fillRect(2*p, -7*p, p, 4*p);
    } else {
      ctx.fillStyle = '#e0b090'; ctx.fillRect(-p, -11*p, 3*p, 3*p);
    }

    // 嘴巴
    if (this.effectVomit > 0) {
      ctx.fillStyle = '#000'; ctx.fillRect(-6*p, -7*p, 12*p, 6*p);
      ctx.fillStyle = '#7cfc00'; ctx.fillRect(-4*p, -5*p, 8*p, 3*p);
      ctx.fillRect(-3*p, -4*p, 4*p, 8*p);
      ctx.fillStyle = '#9acd32'; ctx.fillRect(-5*p, -3*p, 3*p, 10*p); ctx.fillRect(p, -3*p, 3*p, 8*p);
    } else if (this.effectPain > 0) {
      ctx.fillStyle = '#000'; ctx.fillRect(-6*p, -7*p, 12*p, 5*p);
      ctx.fillStyle = '#fff'; ctx.fillRect(-5*p, -7*p, 3*p, p); ctx.fillRect(2*p, -7*p, 3*p, p); ctx.fillRect(-p, -7*p, 2*p, p);
      ctx.fillStyle = '#5dade2'; ctx.fillRect(-9*p, -11*p, p, 8*p); ctx.fillRect(8*p, -11*p, p, 8*p);
      ctx.fillStyle = 'rgba(93,173,226,0.6)'; ctx.fillRect(-4*p, -20*p, p, 3*p); ctx.fillRect(5*p, -20*p, p, 3*p);
    } else if (phase >= 3) {
      ctx.fillStyle = '#000'; ctx.fillRect(-5*p, -7*p, 10*p, 4*p);
      ctx.fillStyle = '#fff'; ctx.fillRect(-3*p, -7*p, 2*p, p); ctx.fillRect(1*p, -7*p, 2*p, p);
      ctx.fillStyle = '#000'; ctx.fillRect(-p, -7*p, 2*p, p);
      if (!flash) { ctx.fillStyle = '#5dade2'; ctx.fillRect(-4*p, -3*p, p, 4*p); }
    } else if (phase >= 2) {
      ctx.fillStyle = '#000'; ctx.fillRect(-5*p, -7*p, 10*p, 5*p);
      ctx.fillStyle = '#c0392b'; ctx.fillRect(-4*p, -6*p, 8*p, 3*p);
    } else if (phase >= 1) {
      ctx.fillStyle = '#000'; ctx.fillRect(-4*p, -6*p, 8*p, 3*p);
      ctx.fillStyle = '#fff'; ctx.fillRect(-3*p, -6*p, 6*p, p);
    } else {
      ctx.fillStyle = '#c0392b'; ctx.fillRect(-3*p, -5*p, 6*p, p);
    }

    // 呕吐物
    if (this.effectVomit > 0) {
      ctx.fillStyle = '#7cfc00'; ctx.fillRect(-8*p * fatScale, 20*p, 16*p * fatScale, 4*p);
      ctx.fillStyle = '#9acd32'; ctx.fillRect(-6*p * fatScale, 22*p, 12*p * fatScale, 3*p);
    }

    // 绷带
    if (phase >= 3 && !flash) {
      ctx.fillStyle = '#f5f5dc';
      ctx.fillRect(-11*p, -22*p, 22*p, 2*p); ctx.fillRect(-p, -24*p, 2*p, 20*p);
      if (phase >= 4) { ctx.fillRect(-10*p, -17*p, 20*p, 2*p); ctx.fillRect(-11*p, -12*p, 2*p, 8*p); ctx.fillRect(9*p, -12*p, 2*p, 8*p); }
      for (let i = 0; i < this.bandages.length; i++) { const bd = this.bandages[i]; ctx.fillRect(bd.ox, bd.oy, bd.w, bd.h); }
    }

    // 身体
    const bodyW = 10 * p * fatScale;
    ctx.fillStyle = suitC; ctx.fillRect(-bodyW, -3*p, bodyW * 2, 18*p);
    ctx.fillStyle = shirtC; ctx.fillRect(-bodyW + 4*p, -3*p, (bodyW - 4*p) * 2, 14*p);

    if (isDress) {
      ctx.fillStyle = tieC; ctx.fillRect(-4*p, -4*p, 8*p, 3*p); ctx.fillRect(-2*p, -3*p, 4*p, 4*p);
    } else {
      ctx.fillStyle = tieC; ctx.fillRect(-p, -3*p, 2*p, 12*p); ctx.fillRect(-2*p, -3*p, 4*p, 2*p);
    }

    if (!flash && !isDress) {
      ctx.fillStyle = '#34495e'; ctx.fillRect(-bodyW, -3*p, 4*p, 8*p); ctx.fillRect(bodyW - 4*p, -3*p, 4*p, 8*p);
    }

    // 女装裙子
    if (isDress) {
      ctx.fillStyle = '#ff69b4'; ctx.fillRect(-bodyW - 2*p, 10*p, (bodyW + 2*p) * 2, 10*p);
      ctx.fillStyle = '#ffb6c1'; ctx.fillRect(-bodyW - 2*p, 18*p, (bodyW + 2*p) * 2, 2*p);
      ctx.fillStyle = '#ff1493'; ctx.fillRect(-3*p, 8*p, 6*p, 2*p);
    }

    // 手臂
    ctx.fillStyle = suitC;
    if (phase >= 5) {
      ctx.fillRect(-bodyW - 5*p, 8*p, 5*p, 3*p); ctx.fillRect(bodyW, 8*p, 5*p, 3*p);
      ctx.fillStyle = skinC; ctx.fillRect(-bodyW - 7*p, 8*p, 3*p, 2*p); ctx.fillRect(bodyW + 4*p, 8*p, 3*p, 2*p);
    } else if (phase >= 4) {
      ctx.fillRect(-bodyW - 5*p, -2*p, 4*p, 16*p);
      ctx.fillStyle = '#8B4513'; ctx.fillRect(-bodyW - 8*p, -10*p, 2*p, 26*p); ctx.fillRect(-bodyW - 9*p, -10*p, 4*p, 2*p);
      ctx.fillStyle = suitC; ctx.fillRect(bodyW + 2*p, -8*p, 4*p, 10*p);
      ctx.fillStyle = skinC; ctx.fillRect(bodyW + 2*p, -10*p, 4*p, 3*p);
      ctx.fillStyle = '#fff'; ctx.fillRect(bodyW + 6*p, -20*p, 14*p, 10*p);
    } else if (phase >= 3) {
      ctx.fillRect(-bodyW - 5*p, -12*p, 4*p, 3*p); ctx.fillRect(-bodyW - 6*p, -16*p, 3*p, 6*p);
      ctx.fillRect(bodyW + 2*p, -12*p, 4*p, 3*p); ctx.fillRect(bodyW + 4*p, -16*p, 3*p, 6*p);
      ctx.fillStyle = skinC; ctx.fillRect(-bodyW - 7*p, -17*p, 5*p, 3*p); ctx.fillRect(bodyW + 3*p, -17*p, 5*p, 3*p);
    } else if (phase >= 2) {
      ctx.fillRect(-bodyW - 5*p, -10*p, 4*p, 3*p); ctx.fillRect(-bodyW - 4*p, -13*p, 4*p, 4*p);
      ctx.fillStyle = skinC; ctx.fillRect(-bodyW - 5*p, -14*p, 5*p, 4*p);
      ctx.fillStyle = suitC; ctx.fillRect(bodyW + 2*p, -8*p, 4*p, 6*p);
      ctx.fillStyle = skinC; ctx.fillRect(bodyW + 3*p, -10*p, 4*p, 4*p);
    } else if (phase >= 1) {
      ctx.fillRect(-bodyW - 5*p, 0, 5*p, 3*p); ctx.fillRect(-bodyW - 5*p, -5*p, 3*p, 6*p);
      ctx.fillStyle = skinC; ctx.fillRect(-bodyW - 6*p, -6*p, 4*p, 3*p);
      ctx.fillStyle = suitC; ctx.fillRect(bodyW + 2*p, -10*p, 4*p, 3*p); ctx.fillRect(bodyW + 5*p, -10*p, 5*p, p);
      ctx.fillStyle = skinC; ctx.fillRect(bodyW + 9*p, -10*p, 3*p, p);
    } else {
      ctx.fillRect(-bodyW - 5*p, 0, 5*p, 3*p); ctx.fillRect(-bodyW - 5*p, -5*p, 3*p, 6*p);
      ctx.fillRect(bodyW + 2*p, 0, 5*p, 3*p); ctx.fillRect(bodyW + 4*p, -5*p, 3*p, 6*p);
      ctx.fillStyle = skinC; ctx.fillRect(-bodyW - 6*p, -6*p, 4*p, 3*p); ctx.fillRect(bodyW + 3*p, -6*p, 4*p, 3*p);
    }

    // 痛苦高跟鞋
    if (this.effectPain > 0) {
      ctx.fillStyle = '#e74c3c'; ctx.fillRect(-6*p, 14*p, 5*p, 4*p); ctx.fillRect(1*p, 14*p, 5*p, 4*p);
      ctx.fillStyle = '#c0392b'; ctx.fillRect(-6*p, 18*p, 2*p, 3*p); ctx.fillRect(4*p, 18*p, 2*p, 3*p);
    }

    // 女装拿包
    if (isDress && phase < 3) {
      ctx.fillStyle = '#ff1493'; ctx.fillRect(bodyW + 8*p, 0, 8*p, 6*p); ctx.fillRect(bodyW + 9*p, -2*p, 6*p, 2*p);
      ctx.fillStyle = '#d4a017'; ctx.fillRect(bodyW + 11*p, -2*p, 2*p, 2*p);
    }

    // 晕星
    if (phase >= 2) {
      ctx.fillStyle = '#ffd700';
      const starCount = phase >= 4 ? 6 : phase >= 3 ? 5 : 3;
      for (let i = 0; i < starCount; i++) {
        const a = this.time * 0.12 + i * (6.283 / starCount);
        const sy = -26*p + Math.sin(a) * 5*p, sx = Math.cos(a) * 14*p;
        ctx.fillRect(sx - p, sy, 3*p, p); ctx.fillRect(sx, sy - p, p, 3*p);
      }
    }

    // 抑郁乌云+雨
    if (this.effectDepress > 0) {
      ctx.fillStyle = '#555';
      ctx.fillRect(-10*p, -30*p, 20*p, 5*p); ctx.fillRect(-12*p, -28*p, 24*p, 4*p); ctx.fillRect(-8*p, -25*p, 16*p, 2*p);
      ctx.fillStyle = '#5dade2';
      const rainOff = this.time % 20;
      for (let i = 0; i < 5; i++) ctx.fillRect(-8*p + i * 4*p, -23*p + ((rainOff + i * 7) % 15) * p, p, 3*p);
      ctx.fillStyle = 'rgba(0,0,0,0.15)'; ctx.fillRect(-faceW, -21*p, faceW * 2, 18*p);
    }

    // 阶段标签
    if (phase >= 1) {
      ctx.font = 'bold ' + (11 + phase * 2) + 'px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillStyle = PHASE_COLORS[phase];
      ctx.fillText(PHASE_NAMES[phase] + '!', 0, -28*p - (this.baldProgress > 0.3 ? 8 : 0));
    }

    ctx.restore();
  }

  // ==================== 菜单 ====================
  renderMenu(ctx) {
    ctx.save(); ctx.textAlign = 'center';
    ctx.fillStyle = '#000'; ctx.font = 'bold 52px "PingFang SC",monospace';
    ctx.fillText('深圳牛马', this.width / 2 + 3, this.height * 0.10 + 3);
    ctx.fillText('狂扁老板', this.width / 2 + 3, this.height * 0.18 + 3);
    ctx.fillStyle = '#ffd700'; ctx.fillText('深圳牛马', this.width / 2, this.height * 0.10);
    ctx.fillStyle = '#ff6b6b'; ctx.fillText('狂扁老板', this.width / 2, this.height * 0.18);

    ctx.font = '16px sans-serif'; ctx.fillStyle = '#e74c3c';
    ctx.fillText('🧦臭袜子🤮 · 🥧画大饼🐷 · 📝改方案👨‍🦲', this.width / 2, this.height * 0.23);
    ctx.fillText('👠穿小鞋😭 · 🧠PUA☁️ · 👗穿女装💃', this.width / 2, this.height * 0.27);
    ctx.font = '14px sans-serif'; ctx.fillStyle = '#999';
    ctx.fillText('每把武器都有独特惩罚效果！', this.width / 2, this.height * 0.31);

    this.drawBoss(ctx, this.width / 2, this.height * 0.45, 0, 2.5);

    const btnX = this.width * 0.1, btnY = this.height * 0.55, btnW = this.width * 0.8, btnH = 56;
    ctx.fillStyle = '#cc4400'; this.drawPixelRect(ctx, btnX + 4, btnY + 4, btnW, btnH, 14);
    const gradient = ctx.createLinearGradient(btnX, btnY, btnX, btnY + btnH);
    gradient.addColorStop(0, '#ff6b35'); gradient.addColorStop(1, '#e8503a');
    ctx.fillStyle = gradient; this.drawPixelRect(ctx, btnX, btnY, btnW, btnH, 14);
    ctx.font = 'bold 30px "PingFang SC",monospace'; ctx.fillStyle = '#fff';
    ctx.fillText('开扁!', this.width / 2, btnY + btnH * 0.64);

    ctx.font = '14px sans-serif'; ctx.fillStyle = '#777';
    ctx.fillText('点/拖老板疯狂攻击 · 6种热梗武器', this.width / 2, this.height * 0.70);
    ctx.fillText('臭袜子→呕吐 · 画大饼→变胖 · 改方案→秃头', this.width / 2, this.height * 0.73);
    ctx.fillText('穿小鞋→痛苦 · PUA→抑郁 · 穿女装→变身', this.width / 2, this.height * 0.76);

    ctx.font = '14px monospace'; ctx.fillStyle = '#555';
    ctx.fillText('v2.0 · by 唐小涛', this.width / 2, this.height * 0.94);
    ctx.restore();
  }

  // ==================== 游戏场景 ====================
  renderGame(ctx) {
    this.drawOffice(ctx);
    this.drawHPBar(ctx);
    this.drawBoss(ctx, this.bossX + this.bossShakeX, this.bossY + this.bossShakeY, this.bossPhase, this.bossScale);
    if (this.bossDialogTimer > 0) this.drawDialogBubble(ctx);

    this.particles.forEach(p => {
      ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rotation);
      ctx.globalAlpha = p.life; ctx.fillStyle = p.color;
      ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size); ctx.restore();
    });

    this.floatingTexts.forEach(t => {
      ctx.save(); ctx.globalAlpha = t.life;
      ctx.font = `bold ${t.size}px "PingFang SC",monospace`; ctx.textAlign = 'center';
      ctx.fillStyle = '#000'; ctx.fillText(t.text, t.x + 2, t.y + 2);
      ctx.fillStyle = t.color; ctx.fillText(t.text, t.x, t.y); ctx.restore();
    });

    if (this.attackAnim > 0) this.drawAttackEffect(ctx);
    this.drawScoreUI(ctx);
    this.drawToolBar(ctx);
  }

  drawHPBar(ctx) {
    const barX = 50, barY = 40, barW = this.width - 100, barH = 30;
    ctx.save();
    ctx.fillStyle = 'rgba(0,0,0,0.7)'; this.drawPixelRect(ctx, barX, barY, barW, barH, 6);
    const hpRatio = this.bossHP / this.bossMaxHP;
    const hpW = (barW - 6) * hpRatio;
    let hpColor = hpRatio > 0.5 ? '#e74c3c' : hpRatio > 0.25 ? '#e67e22' : '#f1c40f';
    if (hpW > 0) { ctx.fillStyle = hpColor; this.drawPixelRect(ctx, barX + 3, barY + 3, hpW, barH - 6, 4); }
    ctx.font = 'bold 14px monospace'; ctx.fillStyle = '#fff'; ctx.textAlign = 'center';
    ctx.fillText(`BOSS HP ${this.bossHP}/${this.bossMaxHP}`, this.width / 2, barY + barH / 2 + 5);
    ctx.font = 'bold 16px "PingFang SC",monospace'; ctx.textAlign = 'left';
    ctx.fillStyle = PHASE_COLORS[this.bossPhase]; ctx.fillText(PHASE_NAMES[this.bossPhase] + '老板', barX, barY - 8);
    ctx.restore();
  }

  drawDialogBubble(ctx) {
    const bx = this.bossX + 70, by = this.bossY - 120 * this.bossScale;
    ctx.save(); ctx.font = 'bold 16px "PingFang SC",monospace';
    const metrics = ctx.measureText(this.bossDialog);
    const tw = metrics.width + 24, th = 36;
    ctx.fillStyle = '#fff'; this.drawPixelRect(ctx, bx - tw / 2, by - th / 2, tw, th, 8);
    ctx.strokeStyle = this.bossPhase >= 3 ? '#e74c3c' : '#333'; ctx.lineWidth = 2;
    ctx.strokeRect(bx - tw / 2 + 0.5, by - th / 2 + 0.5, tw - 1, th - 1);
    ctx.fillStyle = this.bossPhase >= 3 ? '#e74c3c' : '#333'; ctx.textAlign = 'center';
    ctx.fillText(this.bossDialog, bx, by + 6); ctx.restore();
  }

  drawAttackEffect(ctx) {
    const progress = 1 - this.attackAnim / 15, alpha = 1 - progress;
    ctx.save(); ctx.globalAlpha = alpha;
    ctx.strokeStyle = this.currentTool.color; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.arc(this.attackX, this.attackY, progress * 80, 0, Math.PI * 2); ctx.stroke();
    ctx.strokeStyle = '#fff'; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.arc(this.attackX, this.attackY, progress * 50, 0, Math.PI * 2); ctx.stroke();
    ctx.restore();
  }

  drawScoreUI(ctx) {
    ctx.save();
    ctx.font = 'bold 24px monospace'; ctx.textAlign = 'left'; ctx.fillStyle = '#ffd700';
    ctx.fillText(`$ ${this.score.toLocaleString()}`, 30, 100);
    if (this.combo > 1) {
      const comboScale = 1 + Math.sin(this.time * 0.2) * 0.1;
      ctx.save(); ctx.translate(this.width - 30, 100); ctx.scale(comboScale, comboScale);
      ctx.textAlign = 'right'; ctx.font = 'bold 28px monospace';
      ctx.fillStyle = this.combo >= 10 ? '#ff6b6b' : this.combo >= 5 ? '#ffd700' : '#ff9f43';
      ctx.fillText(`${this.combo}x`, 0, 0);
      ctx.font = 'bold 14px "PingFang SC",monospace'; ctx.fillStyle = '#fff'; ctx.fillText('连击!', 0, 20);
      ctx.restore();
    }
    ctx.textAlign = 'center'; ctx.font = 'bold 16px "PingFang SC",monospace';
    ctx.fillStyle = this.currentTool.color;
    ctx.fillText(`${this.currentTool.emoji} ${this.currentTool.name} · DMG ${this.currentTool.damage}`, this.width / 2, this.height * 0.74);
    // 武器效果提示
    var effectHint = '';
    if (this.effectVomit > 0) effectHint = '🤮 呕吐中!';
    else if (this.effectFat > 0) effectHint = '🐷 变胖中!';
    else if (this.effectBald > 0) effectHint = '👨‍🦲 秃头中!';
    else if (this.effectPain > 0) effectHint = '😭 痛苦中!';
    else if (this.effectDepress > 0) effectHint = '☁️ 抑郁中!';
    else if (this.effectDress > 0) effectHint = '💃 女装中!';
    if (effectHint) { ctx.font = 'bold 14px sans-serif'; ctx.fillStyle = this.currentTool.color; ctx.fillText(effectHint, this.width / 2, this.height * 0.71); }
    ctx.restore();
  }

  drawToolBar(ctx) {
    const toolBarY = this.height * 0.78;
    ctx.fillStyle = 'rgba(0,0,0,0.8)'; ctx.fillRect(0, toolBarY, this.width, this.height - toolBarY);
    ctx.fillStyle = '#555'; ctx.fillRect(0, toolBarY, this.width, 2);
    const pad = 20, cols = 3, gap = 10;
    const toolW = (this.width - pad * 2 - gap * 2) / cols;
    const toolH = (this.height - toolBarY - pad * 2 - gap) / 2;
    for (let i = 0; i < TOOLS.length; i++) {
      const tool = TOOLS[i];
      const row = Math.floor(i / cols), col = i % cols;
      const tx = pad + col * (toolW + gap), ty = toolBarY + pad + row * (toolH + gap);
      const sel = tool.id === this.currentTool.id;
      if (sel) {
        ctx.fillStyle = tool.color + '50'; this.drawPixelRect(ctx, tx, ty, toolW, toolH, 10);
        ctx.strokeStyle = tool.color; ctx.lineWidth = 2.5; ctx.strokeRect(tx + 1, ty + 1, toolW - 2, toolH - 2);
      } else {
        ctx.fillStyle = 'rgba(255,255,255,0.08)'; this.drawPixelRect(ctx, tx, ty, toolW, toolH, 10);
      }
      ctx.font = '28px sans-serif'; ctx.textAlign = 'center'; ctx.fillStyle = '#fff';
      ctx.fillText(tool.emoji, tx + toolW / 2, ty + toolH * 0.35);
      ctx.font = 'bold 12px "PingFang SC",monospace'; ctx.fillStyle = sel ? tool.color : '#ccc';
      ctx.fillText(tool.name, tx + toolW / 2, ty + toolH * 0.58);
      ctx.font = '10px monospace'; ctx.fillStyle = '#888';
      ctx.fillText(`DMG:${tool.damage}`, tx + toolW / 2, ty + toolH * 0.76);
    }
  }

  renderGameOver(ctx) {
    ctx.fillStyle = 'rgba(0,0,0,0.88)'; ctx.fillRect(0, 0, this.width, this.height);
    ctx.save(); ctx.textAlign = 'center';
    ctx.font = 'bold 40px "PingFang SC",monospace'; ctx.fillStyle = '#ffd700';
    ctx.fillText('老板社会性死亡!', this.width / 2, this.height * 0.15);
    this.drawBoss(ctx, this.width / 2, this.height * 0.35, 5, 2.0);
    ctx.font = '20px "PingFang SC",monospace'; ctx.fillStyle = '#fff';
    ctx.fillText(`总得分: ${this.score.toLocaleString()}`, this.width / 2, this.height * 0.52);
    ctx.fillText(`最大连击: ${this.maxCombo}x`, this.width / 2, this.height * 0.56);
    ctx.fillText(`总攻击: ${this.totalHits} 次`, this.width / 2, this.height * 0.60);
    let rank = '';
    if (this.score >= 60000) rank = '传说级牛马!';
    else if (this.score >= 40000) rank = '顶级打工人!';
    else if (this.score >= 20000) rank = '资深社畜!';
    else if (this.score >= 8000) rank = '普通牛马';
    else rank = '卧底吧?';
    ctx.font = 'bold 24px "PingFang SC",monospace'; ctx.fillStyle = '#ff9f43';
    ctx.fillText(rank, this.width / 2, this.height * 0.65);
    const btnX = this.width * 0.2, btnY = this.height * 0.68, btnW = this.width * 0.6, btnH = 48;
    ctx.fillStyle = '#cc4400'; this.drawPixelRect(ctx, btnX + 4, btnY + 4, btnW, btnH, 14);
    const g = ctx.createLinearGradient(btnX, btnY, btnX, btnY + btnH);
    g.addColorStop(0, '#ff6b35'); g.addColorStop(1, '#e8503a');
    ctx.fillStyle = g; this.drawPixelRect(ctx, btnX, btnY, btnW, btnH, 14);
    ctx.font = 'bold 24px "PingFang SC",monospace'; ctx.fillStyle = '#fff';
    ctx.fillText('再扁一次!', this.width / 2, btnY + btnH * 0.64);
    ctx.restore();
  }

  drawPixelRect(ctx, x, y, w, h, r) {
    if (!r) { ctx.fillRect(x, y, w, h); return; }
    r = Math.min(r, w / 2, h / 2);
    ctx.beginPath(); ctx.moveTo(x + r, y); ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r); ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h); ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r); ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y); ctx.closePath(); ctx.fill();
  }

  loop() { this.update(); this.render(); requestAnimationFrame(() => this.loop()); }
}

const canvas = wx.createCanvas();
const game = new Game(canvas);