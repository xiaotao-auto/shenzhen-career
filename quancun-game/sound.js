/**
 * 半生路 v3.1 · 温暖音效引擎
 * ============================
 * 纯 Web Audio API 程序化合成 — 无版权 · 无外部文件
 * 
 * 风格：温暖家庭 · 钢琴/八音盒/木吉他/口哨
 * 配色对应：暖橙/金/天蓝/珊瑚/大地棕
 * 
 * 音效列表：
 * - BGM：温暖钢琴+木吉他循环曲（96bpm，C大调）
 * - 点击音：清脆八音盒叮咚
 * - 选择确认：温暖和弦叮
 * - 结果出现：轻柔钢琴上行
 * - 阶段切换：温暖渐升和弦
 * - 结局出现：庄重钢琴+弦乐感
 * - 属性上升：亮丽上升音
 * - 属性下降：柔和下降音
 * - 继续按钮：轻巧拨弦
 */

var soundManager = {
  ctx: null,
  masterGain: null,
  bgmGain: null,
  sfxGain: null,
  bgmMuted: false,
  sfxMuted: false,
  bgmTimer: null,
  bgmPlaying: false,
  inited: false,

  // ── 初始化 ──
  init: function() {
    if (this.inited) return;
    try {
      this.ctx = wx.createInnerAudioContext ? null : null;
      // 微信小游戏用 wx.createWebAudioContext
      if (typeof wx !== 'undefined' && wx.createWebAudioContext) {
        this.ctx = wx.createWebAudioContext();
      }
      if (!this.ctx) return;
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.value = 0.6;
      this.masterGain.connect(this.ctx.destination);
      this.bgmGain = this.ctx.createGain();
      this.bgmGain.gain.value = 0.25;
      this.bgmGain.connect(this.masterGain);
      this.sfxGain = this.ctx.createGain();
      this.sfxGain.gain.value = 0.5;
      this.sfxGain.connect(this.masterGain);
      this.inited = true;
    } catch(e) {
      console.log('SoundManager init failed:', e);
    }
  },

  resume: function() {
    if (this.ctx && this.ctx.resume) this.ctx.resume();
  },

  // ── 基础音符播放 ──
  _note: function(freq, type, startT, dur, gain, target) {
    if (!this.inited) return;
    var g = this.ctx.createGain();
    g.gain.setValueAtTime(gain, startT);
    g.gain.exponentialRampToValueAtTime(0.001, startT + dur);
    g.connect(target || this.sfxGain);
    var o = this.ctx.createOscillator();
    o.type = type;
    o.frequency.setValueAtTime(freq, startT);
    o.connect(g);
    o.start(startT);
    o.stop(startT + dur + 0.05);
  },

  // 带泛音的温暖钢琴音色
  _pianoNote: function(freq, startT, dur, vol, target) {
    if (!this.inited) return;
    vol = vol || 0.3;
    target = target || this.sfxGain;
    // 基音
    this._note(freq, 'sine', startT, dur, vol, target);
    // 二次泛音（八度上）
    this._note(freq * 2, 'sine', startT, dur * 0.5, vol * 0.15, target);
    // 三次泛音
    this._note(freq * 3, 'sine', startT, dur * 0.3, vol * 0.05, target);
  },

  // 八音盒音色
  _musicBoxNote: function(freq, startT, dur, vol, target) {
    if (!this.inited) return;
    vol = vol || 0.25;
    target = target || this.sfxGain;
    this._note(freq, 'sine', startT, dur, vol, target);
    this._note(freq * 2, 'sine', startT, dur * 0.3, vol * 0.25, target);
    // 金属感泛音
    this._note(freq * 5, 'sine', startT, dur * 0.1, vol * 0.03, target);
  },

  // 木吉他拨弦音色
  _guitarNote: function(freq, startT, dur, vol, target) {
    if (!this.inited) return;
    vol = vol || 0.2;
    target = target || this.sfxGain;
    var g = this.ctx.createGain();
    g.gain.setValueAtTime(vol, startT);
    g.gain.exponentialRampToValueAtTime(vol * 0.3, startT + 0.05);
    g.gain.exponentialRampToValueAtTime(0.001, startT + dur);
    g.connect(target);
    var o = this.ctx.createOscillator();
    o.type = 'triangle';
    o.frequency.setValueAtTime(freq, startT);
    o.connect(g);
    o.start(startT);
    o.stop(startT + dur + 0.05);
    // 噪声模拟拨弦质感
    var bufLen = Math.floor(this.ctx.sampleRate * 0.04);
    var buf = this.ctx.createBuffer(1, bufLen, this.ctx.sampleRate);
    var data = buf.getChannelData(0);
    for (var i = 0; i < bufLen; i++) data[i] = (Math.random() * 2 - 1) * 0.15;
    var ns = this.ctx.createBufferSource();
    ns.buffer = buf;
    var ng = this.ctx.createGain();
    ng.gain.setValueAtTime(vol * 0.3, startT);
    ng.gain.exponentialRampToValueAtTime(0.001, startT + 0.06);
    ns.connect(ng);
    ng.connect(target);
    ns.start(startT);
    ns.stop(startT + 0.07);
  },

  // ── 音效方法 ──

  // 点击音：八音盒叮咚
  playClick: function() {
    if (this.sfxMuted || !this.inited) return;
    var t = this.ctx.currentTime;
    this._musicBoxNote(1047, t, 0.25, 0.2);       // C6
    this._musicBoxNote(1319, t + 0.06, 0.2, 0.15); // E6
  },

  // 选择确认：温暖和弦叮
  playChoose: function() {
    if (this.sfxMuted || !this.inited) return;
    var t = this.ctx.currentTime;
    this._pianoNote(523, t, 0.5, 0.2);       // C5
    this._pianoNote(659, t + 0.05, 0.45, 0.15); // E5
    this._pianoNote(784, t + 0.1, 0.4, 0.12);  // G5
  },

  // 结果出现：轻柔钢琴上行
  playResult: function() {
    if (this.sfxMuted || !this.inited) return;
    var t = this.ctx.currentTime;
    this._pianoNote(440, t, 0.6, 0.15);         // A4
    this._pianoNote(523, t + 0.15, 0.55, 0.15);  // C5
    this._pianoNote(659, t + 0.3, 0.5, 0.15);    // E5
    this._pianoNote(784, t + 0.45, 0.6, 0.18);   // G5
  },

  // 属性上升：亮丽上升音
  playStatUp: function() {
    if (this.sfxMuted || !this.inited) return;
    var t = this.ctx.currentTime;
    this._musicBoxNote(880, t, 0.2, 0.15);      // A5
    this._musicBoxNote(1047, t + 0.1, 0.25, 0.18); // C6
    this._musicBoxNote(1319, t + 0.2, 0.3, 0.2);   // E6
  },

  // 属性下降：柔和下降音
  playStatDown: function() {
    if (this.sfxMuted || !this.inited) return;
    var t = this.ctx.currentTime;
    this._pianoNote(659, t, 0.3, 0.12);      // E5
    this._pianoNote(523, t + 0.15, 0.35, 0.1); // C5
    this._pianoNote(440, t + 0.3, 0.4, 0.08);  // A4
  },

  // 阶段切换：温暖渐升和弦
  playPhaseChange: function() {
    if (this.sfxMuted || !this.inited) return;
    var t = this.ctx.currentTime;
    // 渐升的大三和弦 C-E-G-C(高)
    this._pianoNote(262, t, 1.5, 0.2);        // C4
    this._pianoNote(330, t + 0.15, 1.3, 0.15); // E4
    this._pianoNote(392, t + 0.3, 1.1, 0.15);  // G4
    this._pianoNote(523, t + 0.5, 1.0, 0.2);   // C5
    this._pianoNote(659, t + 0.65, 0.9, 0.15); // E5
    this._pianoNote(784, t + 0.8, 0.8, 0.18);  // G5
    // 八音盒闪烁
    this._musicBoxNote(1047, t + 1.0, 0.5, 0.1); // C6
    this._musicBoxNote(1319, t + 1.15, 0.5, 0.08); // E6
  },

  // 继续按钮：轻巧拨弦
  playContinue: function() {
    if (this.sfxMuted || !this.inited) return;
    var t = this.ctx.currentTime;
    this._guitarNote(392, t, 0.3, 0.15);    // G4
    this._guitarNote(523, t + 0.08, 0.25, 0.12); // C5
  },

  // 结局出现：庄重钢琴+弦乐感
  playEnding: function() {
    if (this.sfxMuted || !this.inited) return;
    var t = this.ctx.currentTime;
    // 庄重的下行和弦 Am - F - C
    this._pianoNote(440, t, 2.0, 0.18);       // A4
    this._pianoNote(523, t, 2.0, 0.12);        // C5
    this._pianoNote(659, t, 1.8, 0.1);         // E5
    this._pianoNote(349, t + 0.8, 2.0, 0.15);  // F4
    this._pianoNote(440, t + 0.8, 1.8, 0.1);   // A4
    this._pianoNote(523, t + 0.8, 1.6, 0.08);  // C5
    this._pianoNote(262, t + 1.6, 2.5, 0.2);   // C4
    this._pianoNote(330, t + 1.6, 2.3, 0.15);  // E4
    this._pianoNote(392, t + 1.6, 2.1, 0.12);  // G4
    this._pianoNote(523, t + 1.6, 2.0, 0.15);  // C5
    // 最后的高音八音盒
    this._musicBoxNote(1047, t + 2.8, 1.5, 0.1); // C6
    this._musicBoxNote(1319, t + 3.2, 1.2, 0.08); // E6
  },

  // 游戏开始：温暖小前奏
  playStart: function() {
    if (this.sfxMuted || !this.inited) return;
    var t = this.ctx.currentTime;
    this._pianoNote(330, t, 0.4, 0.15);        // E4
    this._pianoNote(392, t + 0.15, 0.4, 0.15);  // G4
    this._pianoNote(523, t + 0.3, 0.5, 0.18);   // C5
    this._musicBoxNote(659, t + 0.45, 0.5, 0.12); // E5
    this._musicBoxNote(784, t + 0.55, 0.6, 0.1);  // G5
  },

  // 重新来过：轻快回落
  playRestart: function() {
    if (this.sfxMuted || !this.inited) return;
    var t = this.ctx.currentTime;
    this._musicBoxNote(784, t, 0.2, 0.12);      // G5
    this._musicBoxNote(659, t + 0.1, 0.2, 0.12); // E5
    this._musicBoxNote(523, t + 0.2, 0.3, 0.15); // C5
    this._guitarNote(392, t + 0.35, 0.4, 0.12);  // G4
  },

  // ── 背景音乐：温暖钢琴+木吉他循环 ──
  startBGM: function() {
    if (this.bgmMuted || !this.inited || this.bgmPlaying) return;
    this.bgmPlaying = true;
    this._playBGMLoop();
  },

  stopBGM: function() {
    this.bgmPlaying = false;
    if (this.bgmTimer) {
      clearTimeout(this.bgmTimer);
      this.bgmTimer = null;
    }
  },

  _playBGMLoop: function() {
    if (!this.bgmPlaying || !this.inited) return;
    var t = this.ctx.currentTime;
    var dur = this._playBGMSection(t);
    var self = this;
    this.bgmTimer = setTimeout(function() {
      if (self.bgmPlaying) self._playBGMLoop();
    }, dur * 1000 - 200);
  },

  _playBGMSection: function(t) {
    if (!this.inited) return 8;
    var bgm = this.bgmGain;
    var pN = this._pianoNote.bind(this);
    var gN = this._guitarNote.bind(this);
    var mN = this._musicBoxNote.bind(this);

    // 96bpm, 一拍 = 0.625秒
    var beat = 0.625;
    // C大调温暖旋律 — 8小节循环
    // 和弦进行: C - Am - F - G - C - Am - Dm - G

    // 第1小节 C (C-E-G)
    gN(131, t, beat * 3.5, 0.12, bgm);        // C3 bass
    pN(262, t + beat * 0, beat * 1.8, 0.1, bgm);  // C4
    pN(330, t + beat * 0, beat * 1.8, 0.07, bgm);  // E4
    pN(392, t + beat * 0, beat * 1.8, 0.06, bgm);  // G4
    mN(523, t + beat * 1, beat * 0.8, 0.05, bgm);  // C5 melody
    mN(587, t + beat * 1.5, beat * 0.5, 0.04, bgm); // D5

    // 第2小节 Am (A-C-E)
    gN(110, t + beat * 4, beat * 3.5, 0.12, bgm);  // A2 bass
    pN(220, t + beat * 4, beat * 1.8, 0.1, bgm);   // A3
    pN(262, t + beat * 4, beat * 1.8, 0.07, bgm);  // C4
    pN(330, t + beat * 4, beat * 1.8, 0.06, bgm);  // E4
    mN(659, t + beat * 5, beat * 0.8, 0.05, bgm);  // E5 melody
    mN(587, t + beat * 5.5, beat * 0.5, 0.04, bgm); // D5

    // 第3小节 F (F-A-C)
    gN(175, t + beat * 8, beat * 3.5, 0.12, bgm);  // F3 bass
    pN(262, t + beat * 8, beat * 1.8, 0.1, bgm);   // C4
    pN(330, t + beat * 8, beat * 1.8, 0.07, bgm);  // E4 (add9色彩)
    pN(349, t + beat * 8, beat * 1.8, 0.06, bgm);  // F4
    mN(523, t + beat * 9, beat * 0.8, 0.05, bgm);  // C5 melody
    mN(440, t + beat * 9.5, beat * 0.5, 0.04, bgm); // A4

    // 第4小节 G (G-B-D)
    gN(196, t + beat * 12, beat * 3.5, 0.12, bgm); // G3 bass
    pN(196, t + beat * 12, beat * 1.8, 0.1, bgm);  // G3
    pN(247, t + beat * 12, beat * 1.8, 0.07, bgm);  // B3
    pN(294, t + beat * 12, beat * 1.8, 0.06, bgm);  // D4
    mN(494, t + beat * 13, beat * 0.8, 0.05, bgm);  // B4 melody
    mN(392, t + beat * 13.5, beat * 0.5, 0.04, bgm); // G4

    // 第5小节 C (C-E-G) — 高八度旋律
    gN(131, t + beat * 16, beat * 3.5, 0.12, bgm);  // C3 bass
    pN(262, t + beat * 16, beat * 1.8, 0.1, bgm);   // C4
    pN(330, t + beat * 16, beat * 1.8, 0.07, bgm);  // E4
    pN(392, t + beat * 16, beat * 1.8, 0.06, bgm);  // G4
    mN(784, t + beat * 17, beat * 0.8, 0.04, bgm);  // G5 melody
    mN(659, t + beat * 17.5, beat * 0.5, 0.03, bgm); // E5

    // 第6小节 Am (A-C-E)
    gN(110, t + beat * 20, beat * 3.5, 0.12, bgm);  // A2 bass
    pN(220, t + beat * 20, beat * 1.8, 0.1, bgm);   // A3
    pN(262, t + beat * 20, beat * 1.8, 0.07, bgm);  // C4
    pN(330, t + beat * 20, beat * 1.8, 0.06, bgm);  // E4
    mN(523, t + beat * 21, beat * 0.8, 0.05, bgm);  // C5 melody
    mN(440, t + beat * 21.5, beat * 0.5, 0.04, bgm); // A4

    // 第7小节 Dm (D-F-A)
    gN(147, t + beat * 24, beat * 3.5, 0.12, bgm);  // D3 bass
    pN(294, t + beat * 24, beat * 1.8, 0.1, bgm);   // D4
    pN(349, t + beat * 24, beat * 1.8, 0.07, bgm);  // F4
    pN(440, t + beat * 24, beat * 1.8, 0.06, bgm);  // A4
    mN(587, t + beat * 25, beat * 0.8, 0.05, bgm);  // D5 melody
    mN(523, t + beat * 25.5, beat * 0.5, 0.04, bgm); // C5

    // 第8小节 G (G-B-D) — 解决回C
    gN(196, t + beat * 28, beat * 3.5, 0.12, bgm);  // G3 bass
    pN(196, t + beat * 28, beat * 1.8, 0.1, bgm);   // G3
    pN(247, t + beat * 28, beat * 1.8, 0.07, bgm);   // B3
    pN(294, t + beat * 28, beat * 1.8, 0.06, bgm);   // D4
    mN(392, t + beat * 29, beat * 0.8, 0.05, bgm);  // G4 melody
    mN(523, t + beat * 29.5, beat * 0.5, 0.04, bgm); // C5 (回到根音)

    // 总时长: 32拍 × 0.625秒 = 20秒
    return beat * 32;
  },

  // ── 控制方法 ──
  toggleBGM: function() {
    this.bgmMuted = !this.bgmMuted;
    if (this.bgmMuted) {
      this.stopBGM();
    } else {
      this.startBGM();
    }
  },

  toggleSFX: function() {
    this.sfxMuted = !this.sfxMuted;
    if (this.sfxGain) {
      this.sfxGain.gain.value = this.sfxMuted ? 0 : 0.5;
    }
  }
};

module.exports = soundManager;
