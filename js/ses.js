/* Tombiş — Karınca Yuvası: Tombiş'in sesi ve küçük efektler.

   Bir satır şu sırayla çalınır:
     1. ses/<anahtar>.mp3        (tahtaya kopyalanmış dosya, çevrimdışı)
     2. NatureCo galerisi        (tahta internete bağlıysa)
     3. Tarayıcının Türkçe sesi  (varsa)
     4. Yalnız altyazı           (süre metnin uzunluğundan hesaplanır)
   Hangisi olursa olsun oyun aynı akar; altyazı her zaman görünür. */

window.Ses = (function () {
  var HIZ = 0.96;               // 4 yaş için bir tık yavaş
  var acik = oku() !== '0';
  var oynayan = null;
  var dinleyiciler = [];
  var yerelHata = {}, uzakHata = {};
  var ardArdaYerel = 0, ardArdaUzak = 0;
  var trSes = null;

  function oku() { try { return localStorage.getItem('tombis.karinca.ses'); } catch (e) { return null; } }
  function yaz(d) { try { localStorage.setItem('tombis.karinca.ses', d); } catch (e) {} }

  function sesSec() {
    try {
      var hepsi = window.speechSynthesis.getVoices() || [];
      for (var i = 0; i < hepsi.length; i++) {
        if (/^tr(-|_|$)/i.test(hepsi[i].lang)) { trSes = hepsi[i]; return; }
      }
    } catch (e) {}
  }
  if (window.speechSynthesis) {
    sesSec();
    try { window.speechSynthesis.onvoiceschanged = sesSec; } catch (e) {}
  }

  function metin(k) { return (window.METIN && window.METIN[k]) || ''; }
  function tahminiSure(k) { return Math.max(900, metin(k).length * 62); }

  function adresler(k) {
    var l = [];
    if (!yerelHata[k] && ardArdaYerel < 3) l.push({ tur: 'yerel', src: 'ses/' + k + '.mp3' });
    var K = window.SES_KAYNAK;
    if (K && K.dosya[k] && !uzakHata[k] && ardArdaUzak < 3 && navigator.onLine !== false) {
      l.push({ tur: 'uzak', src: K.kok + K.dosya[k] + '.mp3' });
    }
    return l;
  }

  function duyur(olay, k) {
    for (var i = 0; i < dinleyiciler.length; i++) {
      try { dinleyiciler[i](olay, k); } catch (e) {}
    }
  }

  /* Tek bir kaynağı dener. Çalmaya başlayamazsa reddeder, bitince çözer. */
  function dene(kaynak, is) {
    return new Promise(function (coz, reddet) {
      var a = new Audio();
      var basladi = false, bitti = false;
      function son(f, v) { if (bitti) return; bitti = true; clearTimeout(bekci); f(v); }
      var bekci = setTimeout(function () { if (!basladi) { a.pause(); son(reddet, 'zaman'); } }, kaynak.tur === 'uzak' ? 4500 : 2500);
      a.preload = 'auto';
      a.defaultPlaybackRate = HIZ;
      a.playbackRate = HIZ;
      a.addEventListener('playing', function () { basladi = true; });
      a.addEventListener('ended', function () { son(coz); });
      a.addEventListener('error', function () { if (!basladi) son(reddet, 'hata'); else son(coz); });
      is.iptal = function () { a.pause(); son(coz); };
      a.src = kaynak.src;
      var p = a.play();
      if (p && p.catch) p.catch(function () { if (!basladi) son(reddet, 'izin'); });
    });
  }

  function tarayicidanOku(k, is) {
    return new Promise(function (coz) {
      var bitti = false;
      function son() { if (!bitti) { bitti = true; clearTimeout(bekci); coz(); } }
      var bekci = setTimeout(son, tahminiSure(k) * 2 + 2000);
      try {
        var u = new SpeechSynthesisUtterance(metin(k));
        u.lang = 'tr-TR';
        u.voice = trSes;
        u.rate = 0.9;
        u.pitch = 1.15;
        u.onend = son;
        u.onerror = son;
        is.iptal = function () { try { window.speechSynthesis.cancel(); } catch (e) {} son(); };
        window.speechSynthesis.speak(u);
      } catch (e) { son(); }
    });
  }

  function sadeceBekle(k, is) {
    return new Promise(function (coz) {
      var id = setTimeout(coz, tahminiSure(k));
      is.iptal = function () { clearTimeout(id); coz(); };
    });
  }

  function dur() {
    if (oynayan) { var o = oynayan; oynayan = null; o.iptal(); }
  }

  /* Satırı söyler; bitince (ya da başka bir satır araya girince) çözülür. */
  function soyle(k) {
    dur();
    var is = { iptal: function () {} };
    oynayan = is;
    duyur('basla', k);

    var zincir;
    if (!acik) {
      zincir = sadeceBekle(k, is);
    } else {
      var liste = adresler(k);
      zincir = liste.reduce(function (onceki, kaynak) {
        return onceki.catch(function () {
          if (oynayan !== is) return;
          return dene(kaynak, is).then(function () {
            if (kaynak.tur === 'yerel') ardArdaYerel = 0; else ardArdaUzak = 0;
          }, function (neden) {
            // Tarayıcı izin vermediyse kaynak suçlu değil, işaretleme
            if (neden !== 'izin') {
              if (kaynak.tur === 'yerel') { yerelHata[k] = true; ardArdaYerel++; }
              else { uzakHata[k] = true; ardArdaUzak++; }
            }
            throw neden;
          });
        });
      }, Promise.reject('baslangic')).catch(function () {
        if (oynayan !== is) return;
        if (trSes && window.speechSynthesis) return tarayicidanOku(k, is);
        return sadeceBekle(k, is);
      });
    }
    return zincir.then(function () {
      if (oynayan === is) { oynayan = null; duyur('bitti', k); }
    });
  }

  /* Etkinlik açılırken satırları önceden ısıtır (uzak kaynak önbelleğe girer). */
  function hazirla(anahtarlar) {
    if (!acik) return;
    var K = window.SES_KAYNAK;
    if (!K || navigator.onLine === false) return;
    anahtarlar.forEach(function (k) {
      if (!K.dosya[k]) return;
      var a = new Audio();
      a.preload = 'auto';
      a.src = K.kok + K.dosya[k] + '.mp3';
    });
  }

  return {
    soyle: soyle,
    dur: dur,
    hazirla: hazirla,
    metin: metin,
    konusuyor: function () { return !!oynayan; },
    acik: function () { return acik; },
    ac: function (d) { acik = !!d; yaz(acik ? '1' : '0'); if (!acik) dur(); },
    dinle: function (fn) { dinleyiciler.push(fn); }
  };
})();


/* ——— Efektler: dosya yok, hepsi Web Audio ile üretiliyor ——— */

window.Efekt = (function () {
  var ctx = null, ana = null;

  function hazir() {
    if (!Ses.acik()) return null;
    if (!ctx) {
      var AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      try { ctx = new AC(); } catch (e) { return null; }
      ana = ctx.createGain();
      ana.gain.value = 0.45;
      ana.connect(ctx.destination);
    }
    if (ctx.state === 'suspended') { try { ctx.resume(); } catch (e) {} }
    return ctx;
  }

  function ton(frek, sure, tip, guc, gecikme, bitisFrek) {
    var c = hazir();
    if (!c) return;
    var t = c.currentTime + (gecikme || 0);
    var o = c.createOscillator(), g = c.createGain();
    o.type = tip || 'sine';
    o.frequency.setValueAtTime(frek, t);
    if (bitisFrek) o.frequency.exponentialRampToValueAtTime(bitisFrek, t + sure);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(guc || 0.4, t + 0.012);
    g.gain.exponentialRampToValueAtTime(0.0001, t + sure);
    o.connect(g);
    g.connect(ana);
    o.start(t);
    o.stop(t + sure + 0.05);
  }

  function gurultu(sure, frekBas, frekSon, guc) {
    var c = hazir();
    if (!c) return;
    var n = Math.floor(c.sampleRate * sure);
    var tampon = c.createBuffer(1, n, c.sampleRate);
    var v = tampon.getChannelData(0);
    for (var i = 0; i < n; i++) v[i] = Math.random() * 2 - 1;
    var kaynak = c.createBufferSource();
    kaynak.buffer = tampon;
    var f = c.createBiquadFilter();
    f.type = 'bandpass';
    f.Q.value = 1.4;
    var t = c.currentTime;
    f.frequency.setValueAtTime(frekBas, t);
    f.frequency.exponentialRampToValueAtTime(frekSon, t + sure);
    var g = c.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(guc || 0.5, t + sure * 0.3);
    g.gain.exponentialRampToValueAtTime(0.0001, t + sure);
    kaynak.connect(f);
    f.connect(g);
    g.connect(ana);
    kaynak.start(t);
  }

  return {
    ac: hazir,
    pop: function () { ton(540, 0.12, 'sine', 0.5, 0, 900); },
    tik: function () { ton(1400, 0.035, 'triangle', 0.12); },
    dogru: function () { ton(523, 0.16, 'triangle', 0.4, 0); ton(659, 0.16, 'triangle', 0.4, 0.09); ton(784, 0.26, 'triangle', 0.45, 0.18); },
    yanlis: function () { ton(330, 0.25, 'sine', 0.35, 0, 220); },
    kutlama: function () {
      [523, 659, 784, 1047, 1319].forEach(function (f, i) { ton(f, 0.22, 'triangle', 0.35, i * 0.09); });
      [2093, 2637, 3136].forEach(function (f, i) { ton(f, 0.12, 'sine', 0.12, 0.5 + i * 0.07); });
    },
    hisir: function () { gurultu(0.7, 400, 2600, 0.45); },
    ruzgar: function () { gurultu(1.6, 300, 900, 0.3); },
    damla: function () { ton(900, 0.12, 'sine', 0.3, 0, 1600); },
    davul: function (gecikme) { ton(150, 0.22, 'sine', 0.6, gecikme || 0, 50); },
    nota: function (frek, sure) {
      // Pipet flüt: yumuşak başlayan, hafif titreşimli bir üfleme sesi
      var c = hazir();
      if (!c) return;
      var t = c.currentTime, s = sure || 0.6;
      var o = c.createOscillator(), g = c.createGain(), lfo = c.createOscillator(), lg = c.createGain();
      o.type = 'sine';
      o.frequency.value = frek;
      lfo.frequency.value = 5.5;
      lg.gain.value = frek * 0.008;
      lfo.connect(lg);
      lg.connect(o.frequency);
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(0.45, t + 0.06);
      g.gain.setValueAtTime(0.45, t + s * 0.7);
      g.gain.exponentialRampToValueAtTime(0.0001, t + s);
      o.connect(g);
      g.connect(ana);
      o.start(t); lfo.start(t);
      o.stop(t + s + 0.05); lfo.stop(t + s + 0.05);
      gurultu(Math.min(0.25, s), 1800, 2400, 0.05);
    }
  };
})();
