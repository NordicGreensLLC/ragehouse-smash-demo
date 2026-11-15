(function () {
  'use strict';
  var canvas = document.getElementById('smash-demo');
  if (!canvas || !canvas.getContext) return;
  var ctx = canvas.getContext('2d');
  var TAU = Math.PI * 2;
  var W = 0, H = 0, DPR = 1;

  function resize() {
    DPR = Math.min(window.devicePixelRatio || 1, 2.5);
    W = canvas.clientWidth || window.innerWidth;
    H = canvas.clientHeight || window.innerHeight;
    canvas.width = Math.max(1, Math.round(W * DPR));
    canvas.height = Math.max(1, Math.round(H * DPR));
  }
  window.addEventListener('resize', resize);
  resize();

  function rand(a, b) { return a + Math.random() * (b - a); }
  function clamp(v, a, b) { return v < a ? a : v > b ? b : v; }
  function gravity() { return 2.6 * H; }           // px / s^2
  function unit() { return clamp(Math.min(W, H) * 0.15, 40, 150); }

  /* ---------- item artwork (local coords, centred on 0,0) ---------- */
  function drawGlass(c, h) {
    // foot
    c.beginPath();
    c.ellipse(0, 0.455 * h, 0.2 * h, 0.04 * h, 0, 0, TAU);
    c.fillStyle = 'rgba(205,230,248,0.45)';
    c.fill();
    c.lineWidth = 0.012 * h; c.strokeStyle = 'rgba(60,90,110,0.40)'; c.stroke();
    c.lineWidth = 0.006 * h; c.strokeStyle = 'rgba(255,255,255,0.75)'; c.stroke();
    // stem
    c.beginPath();
    c.moveTo(-0.04 * h, 0.06 * h);
    c.quadraticCurveTo(-0.012 * h, 0.1 * h, -0.011 * h, 0.2 * h);
    c.lineTo(-0.012 * h, 0.38 * h);
    c.quadraticCurveTo(-0.016 * h, 0.43 * h, -0.07 * h, 0.45 * h);
    c.lineTo(0.07 * h, 0.45 * h);
    c.quadraticCurveTo(0.016 * h, 0.43 * h, 0.012 * h, 0.38 * h);
    c.lineTo(0.011 * h, 0.2 * h);
    c.quadraticCurveTo(0.012 * h, 0.1 * h, 0.04 * h, 0.06 * h);
    c.closePath();
    var sg = c.createLinearGradient(-0.03 * h, 0, 0.03 * h, 0);
    sg.addColorStop(0, 'rgba(235,248,255,0.65)');
    sg.addColorStop(0.5, 'rgba(190,215,235,0.30)');
    sg.addColorStop(1, 'rgba(235,248,255,0.55)');
    c.fillStyle = sg; c.fill();
    c.lineWidth = 0.008 * h; c.strokeStyle = 'rgba(60,90,110,0.35)'; c.stroke();
    // bowl
    c.beginPath();
    c.moveTo(-0.29 * h, -0.5 * h);
    c.bezierCurveTo(-0.31 * h, -0.2 * h, -0.22 * h, 0.03 * h, -0.04 * h, 0.065 * h);
    c.lineTo(0.04 * h, 0.065 * h);
    c.bezierCurveTo(0.22 * h, 0.03 * h, 0.31 * h, -0.2 * h, 0.29 * h, -0.5 * h);
    c.closePath();
    var bg = c.createLinearGradient(-0.3 * h, 0, 0.3 * h, 0);
    bg.addColorStop(0, 'rgba(215,238,252,0.50)');
    bg.addColorStop(0.45, 'rgba(185,215,238,0.18)');
    bg.addColorStop(0.8, 'rgba(200,228,248,0.30)');
    bg.addColorStop(1, 'rgba(225,244,255,0.55)');
    c.fillStyle = bg; c.fill();
    c.lineWidth = 0.016 * h; c.strokeStyle = 'rgba(40,65,85,0.6)'; c.stroke();
    c.lineWidth = 0.006 * h; c.strokeStyle = 'rgba(255,255,255,0.8)'; c.stroke();
    // rim
    c.beginPath();
    c.ellipse(0, -0.5 * h, 0.29 * h, 0.035 * h, 0, 0, TAU);
    c.fillStyle = 'rgba(230,245,255,0.14)'; c.fill();
    c.lineWidth = 0.01 * h; c.strokeStyle = 'rgba(60,90,110,0.35)'; c.stroke();
    c.lineWidth = 0.005 * h; c.strokeStyle = 'rgba(255,255,255,0.85)'; c.stroke();
    // highlights
    c.lineCap = 'round';
    c.beginPath();
    c.moveTo(-0.215 * h, -0.42 * h);
    c.quadraticCurveTo(-0.25 * h, -0.27 * h, -0.19 * h, -0.1 * h);
    c.lineWidth = 0.028 * h; c.strokeStyle = 'rgba(255,255,255,0.72)'; c.stroke();
    c.beginPath();
    c.moveTo(-0.16 * h, -0.44 * h);
    c.quadraticCurveTo(-0.18 * h, -0.36 * h, -0.165 * h, -0.3 * h);
    c.lineWidth = 0.01 * h; c.strokeStyle = 'rgba(255,255,255,0.45)'; c.stroke();
    c.beginPath();
    c.moveTo(0.205 * h, -0.4 * h);
    c.quadraticCurveTo(0.225 * h, -0.3 * h, 0.2 * h, -0.22 * h);
    c.lineWidth = 0.014 * h; c.strokeStyle = 'rgba(255,255,255,0.38)'; c.stroke();
    c.beginPath();
    c.moveTo(-0.004 * h, 0.12 * h); c.lineTo(-0.004 * h, 0.36 * h);
    c.lineWidth = 0.005 * h; c.strokeStyle = 'rgba(255,255,255,0.7)'; c.stroke();
  }

  function drawPlate(c, d) {
    // underside / thickness
    c.beginPath();
    c.ellipse(0, 0.022 * d, 0.5 * d, 0.18 * d, 0, 0, TAU);
    c.fillStyle = '#a9a8a3'; c.fill();
    // top face
    c.beginPath();
    c.ellipse(0, 0, 0.5 * d, 0.18 * d, 0, 0, TAU);
    var tg = c.createLinearGradient(-0.4 * d, -0.18 * d, 0.4 * d, 0.18 * d);
    tg.addColorStop(0, '#ffffff');
    tg.addColorStop(0.6, '#f1f0ec');
    tg.addColorStop(1, '#dddcd6');
    c.fillStyle = tg; c.fill();
    // rim edge line
    c.beginPath();
    c.ellipse(0, 0, 0.475 * d, 0.168 * d, 0, 0, TAU);
    c.lineWidth = 0.004 * d; c.strokeStyle = 'rgba(0,0,0,0.07)'; c.stroke();
    // well
    c.beginPath();
    c.ellipse(0, 0.012 * d, 0.31 * d, 0.106 * d, 0, 0, TAU);
    var wg = c.createLinearGradient(0, -0.1 * d, 0, 0.12 * d);
    wg.addColorStop(0, '#d2d1cb');
    wg.addColorStop(0.35, '#ecebe6');
    wg.addColorStop(1, '#fbfaf7');
    c.fillStyle = wg; c.fill();
    c.lineWidth = 0.006 * d; c.strokeStyle = 'rgba(0,0,0,0.09)'; c.stroke();
    // rim shine
    c.beginPath();
    c.ellipse(0, 0, 0.42 * d, 0.145 * d, 0, Math.PI * 1.08, Math.PI * 1.5);
    c.lineCap = 'round';
    c.lineWidth = 0.02 * d; c.strokeStyle = 'rgba(255,255,255,0.9)'; c.stroke();
    c.beginPath();
    c.ellipse(0, 0, 0.5 * d, 0.18 * d, 0, 0, TAU);
    c.lineWidth = 0.004 * d; c.strokeStyle = 'rgba(0,0,0,0.12)'; c.stroke();
  }

  function vasePath(c, h) {
    c.beginPath();
    c.moveTo(-0.165 * h, -0.49 * h);
    c.bezierCurveTo(-0.12 * h, -0.45 * h, -0.1 * h, -0.41 * h, -0.1 * h, -0.36 * h);
    c.bezierCurveTo(-0.1 * h, -0.24 * h, -0.335 * h, -0.2 * h, -0.335 * h, 0.03 * h);
    c.bezierCurveTo(-0.335 * h, 0.25 * h, -0.22 * h, 0.42 * h, -0.17 * h, 0.5 * h);
    c.lineTo(0.17 * h, 0.5 * h);
    c.bezierCurveTo(0.22 * h, 0.42 * h, 0.335 * h, 0.25 * h, 0.335 * h, 0.03 * h);
    c.bezierCurveTo(0.335 * h, -0.2 * h, 0.1 * h, -0.24 * h, 0.1 * h, -0.36 * h);
    c.bezierCurveTo(0.1 * h, -0.41 * h, 0.12 * h, -0.45 * h, 0.165 * h, -0.49 * h);
    c.closePath();
  }
  function drawVase(c, h) {
    vasePath(c, h);
    var cg = c.createLinearGradient(0, -0.5 * h, 0, 0.5 * h);
    cg.addColorStop(0, '#2b8fa6');
    cg.addColorStop(0.45, '#1c5f8c');
    cg.addColorStop(1, '#122e57');
    c.fillStyle = cg; c.fill();
    c.save();
    c.clip();
    var sh = c.createLinearGradient(-0.34 * h, 0, 0.34 * h, 0);
    sh.addColorStop(0, 'rgba(0,0,0,0.55)');
    sh.addColorStop(0.22, 'rgba(0,0,0,0.05)');
    sh.addColorStop(0.36, 'rgba(255,255,255,0.18)');
    sh.addColorStop(0.55, 'rgba(0,0,0,0)');
    sh.addColorStop(1, 'rgba(0,0,0,0.6)');
    c.fillStyle = sh;
    c.fillRect(-0.4 * h, -0.55 * h, 0.8 * h, 1.1 * h);
    // foot band
    c.fillStyle = 'rgba(0,0,0,0.25)';
    c.fillRect(-0.4 * h, 0.465 * h, 0.8 * h, 0.04 * h);
    // specular streaks
    c.lineCap = 'round';
    c.beginPath();
    c.moveTo(-0.2 * h, -0.14 * h);
    c.quadraticCurveTo(-0.25 * h, 0.03 * h, -0.2 * h, 0.22 * h);
    c.lineWidth = 0.035 * h; c.strokeStyle = 'rgba(255,255,255,0.45)'; c.stroke();
    c.beginPath();
    c.moveTo(-0.205 * h, -0.08 * h);
    c.quadraticCurveTo(-0.235 * h, 0.03 * h, -0.205 * h, 0.12 * h);
    c.lineWidth = 0.012 * h; c.strokeStyle = 'rgba(255,255,255,0.8)'; c.stroke();
    c.beginPath();
    c.moveTo(-0.065 * h, -0.44 * h); c.lineTo(-0.07 * h, -0.33 * h);
    c.lineWidth = 0.014 * h; c.strokeStyle = 'rgba(255,255,255,0.35)'; c.stroke();
    c.restore();
    vasePath(c, h);
    c.lineWidth = 0.006 * h; c.strokeStyle = 'rgba(8,20,40,0.6)'; c.stroke();
    // lip / opening
    c.beginPath();
    c.ellipse(0, -0.49 * h, 0.165 * h, 0.03 * h, 0, 0, TAU);
    c.fillStyle = '#0a1a2c'; c.fill();
    c.lineWidth = 0.012 * h; c.strokeStyle = '#3aa2bb'; c.stroke();
  }

  var ITEMS = [
    { draw: drawGlass, glass: true, size: 1.0, hw: 0.32, hh: 0.5, spin: 7,
      rays: 30, rings: 8, ringPow: 1.7, split: 0.45, rebound: 1.0,
      edge: 'rgba(255,255,255,0.8)', edgeW: 0.8, edgeDark: 'rgba(30,55,75,0.5)' },
    { draw: drawPlate, glass: false, size: 1.15, hw: 0.5, hh: 0.21, spin: 10,
      rays: 16, rings: 6, ringPow: 1.25, split: 0.3, rebound: 0.8,
      edge: 'rgba(255,255,255,0.55)', edgeW: 1.1, dust: ['236,234,228', '210,208,200'] },
    { draw: drawVase, glass: false, size: 1.2, hw: 0.34, hh: 0.5, spin: 5,
      rays: 11, rings: 4, ringPow: 1.1, split: 0.2, rebound: 0.75,
      edge: 'rgba(238,226,208,0.7)', edgeW: 1.4, dust: ['230,220,205', '43,120,150', '28,80,120'] }
  ];

  /* ---------- state ---------- */
  var idx = 0, throwNo = 0, state = 'pause', timer = 0.4;
  var cur = null, shards = [], parts = [], flash = null;

  function startThrow() {
    var it = ITEMS[idx];
    var s = unit() * it.size;
    var g = gravity();
    var dir = (throwNo++ % 2 === 0) ? 1 : -1;      // 1: left->right wall, -1: right->left wall
    var baseT = clamp(0.45 + W / 3600, 0.55, 1.0);
    var T, y0, yHit, vy, tries = 0;
    do {                                            // random launch height + arc, apex kept on screen
      T = baseT * rand(0.8, 1.25);
      y0 = H * rand(0.15, 0.8);
      yHit = H * rand(0.15, 0.75);
      vy = (yHit - y0 - 0.5 * g * T * T) / T;
    } while (++tries < 30 && (vy >= 0 || y0 - vy * vy / (2 * g) < 0.06 * H));
    var x0 = dir > 0 ? -0.6 * s : W + 0.6 * s;
    var xWall = dir > 0 ? W : 0;
    cur = {
      it: it, s: s, x: x0, y: y0, dir: dir,
      vx: (xWall - x0) / T,
      vy: vy,
      rot: rand(0, TAU),
      spin: it.spin * (Math.random() < 0.5 ? -1 : 1) * rand(0.8, 1.2)
    };
    state = 'fly';
  }

  function extentX(c) {
    var co = Math.abs(Math.cos(c.rot)), si = Math.abs(Math.sin(c.rot));
    return c.it.hw * c.s * co + c.it.hh * c.s * si;
  }
  function extentY(c) {
    var co = Math.abs(Math.cos(c.rot)), si = Math.abs(Math.sin(c.rot));
    return c.it.hw * c.s * si + c.it.hh * c.s * co;
  }

  function pointInPoly(x, y, p) {
    var inside = false;
    for (var i = 0, j = p.length - 1; i < p.length; j = i++) {
      var xi = p[i][0], yi = p[i][1], xj = p[j][0], yj = p[j][1];
      if (((yi > y) !== (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi)) inside = !inside;
    }
    return inside;
  }

  function fracture(cx, cy, R, it) {
    var M = it.rays, N = it.rings, V = [], i, j;
    var base = Math.random() * TAU, step = TAU / M, angs = [];
    for (i = 0; i < M; i++) angs.push(base + i * step + rand(-0.3, 0.3) * step);
    for (j = 0; j <= N; j++) {
      V[j] = [];
      for (i = 0; i < M; i++) {
        if (j === 0) { V[j][i] = [cx, cy]; continue; }
        var r = R * Math.pow(j / N, it.ringPow) * (j === N ? 1 : rand(0.8, 1.2));
        var a = angs[i] + (j < N ? rand(-0.2, 0.2) * step : 0);
        V[j][i] = [cx + Math.cos(a) * r, cy + Math.sin(a) * r];
      }
    }
    var polys = [];
    for (j = 0; j < N; j++) {
      for (i = 0; i < M; i++) {
        var i2 = (i + 1) % M;
        var A = V[j][i], B = V[j][i2], C = V[j + 1][i2], D = V[j + 1][i];
        if (j === 0) polys.push([A, C, D]);
        else if (Math.random() < it.split) {
          if (Math.random() < 0.5) { polys.push([A, B, C]); polys.push([A, C, D]); }
          else { polys.push([A, B, D]); polys.push([B, C, D]); }
        } else polys.push([A, B, C, D]);
      }
    }
    return polys;
  }

  function shatter() {
    var c = cur, it = c.it;
    var ex = extentX(c), ey = extentY(c), pad = 4;
    var ow = Math.ceil(2 * ex + pad * 2), oh = Math.ceil(2 * ey + pad * 2);
    var off = document.createElement('canvas');
    off.width = Math.ceil(ow * DPR); off.height = Math.ceil(oh * DPR);
    var o = off.getContext('2d');
    o.scale(DPR, DPR);
    o.translate(ow / 2, oh / 2);
    o.rotate(c.rot);
    it.draw(o, c.s);
    var data = o.getImageData(0, 0, off.width, off.height).data;
    var pw = off.width, ph = off.height;

    // contact point = right-most opaque column
    var dir = c.dir, rx = -1, sumY = 0, nY = 0, x, y;
    for (x = dir > 0 ? pw - 1 : 0; x >= 0 && x < pw && rx < 0; x -= dir) {
      for (y = 0; y < ph; y++) {
        if (data[(y * pw + x) * 4 + 3] > 30) { rx = x; sumY += y; nY++; }
      }
    }
    if (rx < 0) { rx = dir > 0 ? pw - 1 : 0; sumY = ph / 2; nY = 1; }
    var ipx = rx / DPR, ipy = (sumY / nY) / DPR;
    var impX = dir > 0 ? W : 0;
    var ox = impX - ipx, oy = c.y - oh / 2;  // offscreen origin in world, contact touching the wall
    var impY = oy + ipy;

    var polys = fracture(ipx, ipy, Math.hypot(Math.max(ipx, ow - ipx), Math.max(ipy, oh - ipy)) * 1.02, it);
    var stride = Math.max(1, Math.round(DPR * 1.25));
    var minPx = 2.5 * DPR * DPR / (stride * stride);
    var vin = Math.abs(c.vx);
    shards = [];
    for (var k = 0; k < polys.length; k++) {
      var p = polys[k];
      var minx = 1e9, miny = 1e9, maxx = -1e9, maxy = -1e9;
      for (var q = 0; q < p.length; q++) {
        if (p[q][0] < minx) minx = p[q][0]; if (p[q][0] > maxx) maxx = p[q][0];
        if (p[q][1] < miny) miny = p[q][1]; if (p[q][1] > maxy) maxy = p[q][1];
      }
      var x0 = Math.max(0, Math.floor(minx * DPR)), x1 = Math.min(pw - 1, Math.ceil(maxx * DPR));
      var y0 = Math.max(0, Math.floor(miny * DPR)), y1 = Math.min(ph - 1, Math.ceil(maxy * DPR));
      if (x1 < x0 || y1 < y0) continue;
      var cnt = 0, sx = 0, sy = 0;
      for (y = y0; y <= y1; y += stride) {
        for (x = x0; x <= x1; x += stride) {
          var al = data[(y * pw + x) * 4 + 3];
          if (al > 25 && pointInPoly(x / DPR, y / DPR, p)) { cnt++; sx += x; sy += y; }
        }
      }
      if (cnt < minPx) continue;
      var pcx = sx / cnt / DPR, pcy = sy / cnt / DPR;   // visible centroid (offscreen coords)
      var bx = Math.floor(Math.max(0, minx)) - 1, by = Math.floor(Math.max(0, miny)) - 1;
      var bw = Math.ceil(Math.min(ow, maxx)) + 1 - bx, bh = Math.ceil(Math.min(oh, maxy)) + 1 - by;
      var sc = document.createElement('canvas');
      sc.width = Math.max(1, Math.ceil(bw * DPR)); sc.height = Math.max(1, Math.ceil(bh * DPR));
      var g2 = sc.getContext('2d');
      g2.scale(DPR, DPR);
      g2.translate(-bx, -by);
      g2.beginPath();
      g2.moveTo(p[0][0], p[0][1]);
      for (q = 1; q < p.length; q++) g2.lineTo(p[q][0], p[q][1]);
      g2.closePath();
      g2.save(); g2.clip();
      g2.drawImage(off, 0, 0, ow, oh);
      g2.restore();
      g2.globalCompositeOperation = 'source-atop';
      if (it.edgeDark) { g2.lineWidth = 2; g2.strokeStyle = it.edgeDark; g2.stroke(); }
      g2.lineWidth = it.edgeW; g2.strokeStyle = it.edge; g2.stroke();
      var area = cnt * stride * stride / (DPR * DPR);
      var size = Math.sqrt(area);
      var wx = ox + pcx, wy = oy + pcy;
      var dx = wx - impX, dy = wy - impY, dl = Math.hypot(dx, dy) || 1;
      var vx = -dir * vin * rand(0.03, 0.17) * it.rebound + (dx / dl) * vin * rand(0, 0.12);
      if (-dir * vx < vin * 0.02) vx = -dir * vin * rand(0.02, 0.05);   // always away from the wall
      var vy = c.vy * 0.35 + (dy / dl) * vin * rand(0, 0.14) + vin * rand(-0.07, 0.04);
      shards.push({
        img: sc, w: bw, h: bh, px: pcx - bx, py: pcy - by,
        x: wx, y: wy, vx: vx, vy: vy, rot: 0,
        spin: rand(-1, 1) * clamp(110 / size, 2, 18),
        k: clamp(4 / size, 0.03, 0.8),
        rad: Math.hypot(bw, bh), glass: it.glass, ph: rand(0, TAU)
      });
    }

    // fine particles: glass slivers or ceramic dust
    parts = [];
    var n = it.glass ? 45 : 55;
    for (var m = 0; m < n; m++) {
      var col = it.glass ? '235,247,255' : it.dust[Math.floor(Math.random() * it.dust.length)];
      parts.push({
        x: impX - dir * rand(1, 10), y: impY + rand(-0.15, 0.15) * c.s,
        vx: -dir * rand(0.02, 0.2) * vin, vy: rand(-0.12, 0.04) * vin,
        r: it.glass ? rand(0.6, 1.6) : rand(0.7, 2.2),
        k: it.glass ? 1.3 : 2.8, col: col, a: it.glass ? rand(0.5, 0.95) : rand(0.45, 0.85),
        glass: it.glass, ph: rand(0, TAU)
      });
    }
    flash = { t: 0, dur: 0.16, x: impX, y: impY, s: c.s, rays: [] };
    for (m = 0; m < 12; m++) flash.rays.push({ a: (dir > 0 ? Math.PI : 0) + rand(-1.35, 1.35), l: rand(0.35, 0.9) });
    cur = null;
    state = 'debris';
  }

  function step(dt) {
    var g = gravity(), i;
    if (state === 'pause') {
      timer -= dt;
      if (timer <= 0) startThrow();
    } else if (state === 'fly') {
      var c = cur;
      c.vy += g * dt; c.x += c.vx * dt; c.y += c.vy * dt; c.rot += c.spin * dt;
      if (c.dir > 0 && c.x + extentX(c) >= W) { c.x = W - extentX(c); shatter(); }
      else if (c.dir < 0 && c.x - extentX(c) <= 0) { c.x = extentX(c); shatter(); }
    } else if (state === 'debris') {
      var alive = 0;
      for (i = 0; i < shards.length; i++) {
        var s = shards[i];
        if (s.dead) continue;
        s.vy += g * dt;
        s.vx -= s.vx * s.k * dt; s.vy -= s.vy * s.k * dt;
        s.x += s.vx * dt; s.y += s.vy * dt; s.rot += s.spin * dt;
        if (s.y - s.rad > H) s.dead = true; else alive++;
      }
      for (i = 0; i < parts.length; i++) {
        var p = parts[i];
        if (p.dead) continue;
        p.vy += g * dt;
        p.vx -= p.vx * p.k * dt; p.vy -= p.vy * p.k * dt;
        p.x += p.vx * dt; p.y += p.vy * dt; p.ph += dt * 9;
        if (p.y - p.r > H) p.dead = true; else alive++;
      }
      if (flash) { flash.t += dt; if (flash.t > flash.dur) flash = null; }
      if (!alive && !flash) {
        shards = []; parts = [];
        idx = (idx + 1) % ITEMS.length;
        state = 'pause'; timer = 0.8;
      }
    }
  }

  function render() {
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    var i;
    if (cur) {
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
      ctx.translate(cur.x, cur.y);
      ctx.rotate(cur.rot);
      cur.it.draw(ctx, cur.s);
      ctx.lineCap = 'butt';
    }
    for (i = 0; i < shards.length; i++) {
      var s = shards[i];
      if (s.dead) continue;
      var co = Math.cos(s.rot) * DPR, si = Math.sin(s.rot) * DPR;
      ctx.setTransform(co, si, -si, co, s.x * DPR, s.y * DPR);
      ctx.globalAlpha = 1;
      ctx.drawImage(s.img, -s.px, -s.py, s.w, s.h);
      if (s.glass) {
        var gl = Math.pow(Math.max(0, Math.sin(s.rot * 2 + s.ph)), 14);
        if (gl > 0.04) {
          ctx.globalCompositeOperation = 'lighter';
          ctx.globalAlpha = gl * 0.9;
          ctx.drawImage(s.img, -s.px, -s.py, s.w, s.h);
          ctx.globalCompositeOperation = 'source-over';
          ctx.globalAlpha = 1;
        }
      }
    }
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    for (i = 0; i < parts.length; i++) {
      var p = parts[i];
      if (p.dead) continue;
      var a = p.a;
      if (p.glass) a *= 0.45 + 0.55 * Math.abs(Math.sin(p.ph));
      ctx.fillStyle = 'rgba(' + p.col + ',' + a.toFixed(3) + ')';
      ctx.fillRect(p.x - p.r, p.y - p.r, p.r * 2, p.r * 2);
    }
    if (flash) {
      var f = flash, u = f.t / f.dur, fa = (1 - u) * (1 - u);
      var rr = f.s * (0.45 + 0.6 * u);
      var rg = ctx.createRadialGradient(f.x, f.y, 0, f.x, f.y, rr);
      rg.addColorStop(0, 'rgba(255,252,240,' + (0.95 * fa).toFixed(3) + ')');
      rg.addColorStop(0.35, 'rgba(255,244,215,' + (0.45 * fa).toFixed(3) + ')');
      rg.addColorStop(1, 'rgba(255,240,210,0)');
      ctx.fillStyle = rg;
      ctx.beginPath(); ctx.arc(f.x, f.y, rr, 0, TAU); ctx.fill();
      ctx.lineCap = 'round';
      ctx.strokeStyle = 'rgba(255,255,255,' + (0.9 * fa).toFixed(3) + ')';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      for (i = 0; i < f.rays.length; i++) {
        var ry = f.rays[i], r0 = f.s * 0.12 * (1 + u * 2), r1 = r0 + f.s * ry.l * (0.3 + 0.7 * u);
        ctx.moveTo(f.x + Math.cos(ry.a) * r0, f.y + Math.sin(ry.a) * r0);
        ctx.lineTo(f.x + Math.cos(ry.a) * r1, f.y + Math.sin(ry.a) * r1);
      }
      ctx.stroke();
      ctx.lineCap = 'butt';
    }
    ctx.globalAlpha = 1;
  }

  var last = null;
  function frame(ts) {
    if (last === null) last = ts;
    var dt = Math.min(0.05, Math.max(0, (ts - last) / 1000));
    last = ts;
    if (canvas.clientWidth !== W || canvas.clientHeight !== H) resize();
    step(dt);
    render();
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
})();
