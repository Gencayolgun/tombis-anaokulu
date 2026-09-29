/* Tombiş — Karınca Yuvası: akıllı tahta kabuğu.

   Sahne 1920x1080 çizilir, tahtanın ekranına oranı bozulmadan ölçeklenir.
   Etkinlikler T.etkinlik({...}) ile kaydolur; kabuk onlara bir api verir:

     api.alan            etkinliğin çizeceği katman (sahne pikseli)
     api.talimat(k)      Tombiş söyler ve "son talimat" olarak saklar
     api.soyle(k)        Tombiş söyler (Promise, bitince çözülür)
     api.aferin()        rastgele övgü + efekt + Tombiş sevinir
     api.tekrar()        yumuşak "bir daha bakalım"
     api.say(n)          "Bir!", "İki!"...
     api.bekle(ms), api.tween(ms, fn, ease), api.dongu(fn)
     api.dokun(el, fn)   dokunuşu dinler (dokunma olayında)
     api.ipucu(fn)       çocuk bir süre dokunmazsa çağrılır (el gösterir)
     api.el(x, y), api.elKaydir(noktalar)
     api.kart({...}), api.secim(kartlar, dogru)
     api.kutla(x, y)     konfeti
     api.bitti({...})    etkinlik bitti perdesi

   Etkinlik değişince önceki etkinliğin bütün zamanlayıcıları, dinleyicileri
   ve bekleyen sözleri kendiliğinden susar: bekleyen Promise'ler hiç
   çözülmez, böylece eski etkinliğin kodu yeni sahneye dokunamaz.

   KURAL: anlatıcı her zaman Tombiş. */

window.T = (function () {
  var G = 1920, Y = 1080;
  var sahne, katArka, katOyun, katUi, altyazi, rehber, rehberImg, dugmeler = {}, baslikEl;
  var olcek = 1;
  var etkinlikler = [];
  var aktif = null;
  var sonTalimat = null;
  var sonDokunma = Date.now(), bosTekrar = 0;
  var donguler = [];
  var oncekiZaman = 0;

  /* ——— Küçük yardımcılar ——— */

  function el(etiket, sinif, ebeveyn, metin) {
    var d = document.createElement(etiket);
    if (sinif) d.className = sinif;
    if (metin != null) d.textContent = metin;
    if (ebeveyn) ebeveyn.appendChild(d);
    return d;
  }

  function karistir(dizi) {
    var a = dizi.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }

  function rastgele(a, b) { return a + Math.random() * (b - a); }

  var kolay = {
    dogrusal: function (t) { return t; },
    cik: function (t) { return 1 - Math.pow(1 - t, 3); },
    gir: function (t) { return t * t * t; },
    gircik: function (t) { return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; },
    zipla: function (t) { var c = 1.70158 + 1; return 1 + c * Math.pow(t - 1, 3) + 1.70158 * Math.pow(t - 1, 2); }
  };

  /* Sahne pikseline çevirir */
  function nokta(e) {
    var r = sahne.getBoundingClientRect();
    return { x: (e.clientX - r.left) / olcek, y: (e.clientY - r.top) / olcek };
  }

  function uzaklik(a, b) { var dx = a.x - b.x, dy = a.y - b.y; return Math.sqrt(dx * dx + dy * dy); }

  /* Ortası (x,y) olan, transform ile konumlanan parça */
  function sprite(icerik, x, y, gen, ebeveyn, sinif) {
    var d = el('div', 'sprite' + (sinif ? ' ' + sinif : ''), ebeveyn);
    var ic;
    if (typeof icerik === 'string') {
      ic = el('img', null, d);
      ic.src = icerik;
      ic.draggable = false;
      ic.alt = '';
    } else {
      ic = icerik;
      d.appendChild(ic);
    }
    if (gen) d.style.width = gen + 'px';
    var s = {
      el: d, ic: ic, x: x, y: y, o: 1, a: 0,
      ciz: function () {
        d.style.transform = 'translate(' + s.x.toFixed(1) + 'px,' + s.y.toFixed(1) + 'px) translate(-50%,-50%) rotate(' + s.a.toFixed(1) + 'deg) scale(' + s.o.toFixed(3) + ')';
        return s;
      },
      git: function (x2, y2) { s.x = x2; s.y = y2; return s.ciz(); }
    };
    return s.ciz();
  }

  /* Sınıf ekleyip animasyon bitince kaldırır (tekrar tetiklenebilsin) */
  function oynat(hedef, sinif, ms) {
    hedef.classList.remove(sinif);
    void hedef.offsetWidth;
    hedef.classList.add(sinif);
    setTimeout(function () { hedef.classList.remove(sinif); }, ms || 600);
  }

  /* ——— Animasyon döngüsü ——— */

  function kare(t) {
    var dt = oncekiZaman ? Math.min(0.05, (t - oncekiZaman) / 1000) : 0.016;
    oncekiZaman = t;
    var liste = donguler.slice();
    for (var i = 0; i < liste.length; i++) {
      if (liste[i].canli) {
        try { liste[i].fn(dt, t); } catch (e) { if (window.console) console.error(e); }
      }
    }
    requestAnimationFrame(kare);
  }

  function tween(ms, fn, ease, tok) {
    ease = ease || kolay.gircik;
    return new Promise(function (coz) {
      var bas = null;
      var d = { canli: true, fn: function (dt, t) {
        if (tok && !tok.canli) { d.canli = false; return; }
        if (bas === null) bas = t;
        var o = Math.min(1, (t - bas) / ms);
        fn(ease(o), o);
        if (o >= 1) { d.canli = false; coz(); }
      } };
      donguler.push(d);
    });
  }

  function donguTemizle() {
    donguler = donguler.filter(function (d) { return d.canli; });
  }

  /* ——— Ölçek ——— */

  function olcekle() {
    var w = window.innerWidth, h = window.innerHeight;
    olcek = Math.min(w / G, h / Y);
    var ox = (w - G * olcek) / 2, oy = (h - Y * olcek) / 2;
    sahne.style.transform = 'translate(' + ox + 'px,' + oy + 'px) scale(' + olcek + ')';
  }

  /* ——— Tombiş ve altyazı ——— */

  var POZ = { selam: 'gorsel/tombis-selam.webp', sevinc: 'gorsel/tombis-sevinc.webp', dusun: 'gorsel/tombis-dusun.webp' };
  var pozZaman = null;

  function rehberPoz(ad, sure) {
    rehberImg.src = POZ[ad] || POZ.selam;
    rehber.classList.remove('sevinc');
    if (ad === 'sevinc') { void rehber.offsetWidth; rehber.classList.add('sevinc'); }
    clearTimeout(pozZaman);
    if (ad !== 'selam') pozZaman = setTimeout(function () { rehberPoz('selam'); }, sure || 1800);
  }

  function rehberGoster(g) { rehber.style.display = g ? '' : 'none'; }

  function altyaziGoster(k) {
    var m = Ses.metin(k);
    if (!m) return;
    altyazi.textContent = m;
    altyazi.classList.remove('bos', 'soluk');
  }

  /* ——— Dokunma izi, ipucu eli, konfeti ——— */

  function dalga(p) {
    var d = el('div', 'dalga', sahne);
    d.style.left = p.x + 'px';
    d.style.top = p.y + 'px';
    setTimeout(function () { d.remove(); }, 520);
  }

  function elGoster(x, y, tok) {
    var h = el('div', 'ipucu-el', katUi);
    h.appendChild(Cizim.el());
    var gen = 120, uy = gen * 132 / 110;
    var dx = Cizim.EL_UC.x * gen, dy = Cizim.EL_UC.y * uy;
    function yer(px, py, o) {
      h.style.transform = 'translate(' + (px - dx) + 'px,' + (py - dy) + 'px) scale(' + o + ')';
    }
    yer(x + 90, y + 110, 1);
    h.style.opacity = '0';
    return tween(450, function (t) { h.style.opacity = t; yer(x + 90 * (1 - t), y + 110 * (1 - t), 1); }, kolay.cik, tok)
      .then(function () { return tween(300, function (t) { yer(x, y, 1 - Math.sin(t * Math.PI) * 0.18); }, kolay.dogrusal, tok); })
      .then(function () { return tween(300, function (t) { yer(x, y, 1 - Math.sin(t * Math.PI) * 0.18); }, kolay.dogrusal, tok); })
      .then(function () { return tween(350, function (t) { h.style.opacity = 1 - t; }, kolay.dogrusal, tok); })
      .then(function () { h.remove(); }, function () { h.remove(); });
  }

  function elKaydir(noktalar, sure, tok) {
    var h = el('div', 'ipucu-el', katUi);
    h.appendChild(Cizim.el());
    var gen = 120, uy = gen * 132 / 110;
    var dx = Cizim.EL_UC.x * gen, dy = Cizim.EL_UC.y * uy;
    // Toplam uzunluğa göre eşit hızla ilerle
    var boylar = [0];
    for (var i = 1; i < noktalar.length; i++) boylar.push(boylar[i - 1] + uzaklik(noktalar[i - 1], noktalar[i]));
    var toplam = boylar[boylar.length - 1] || 1;
    function yer(t) {
      var hedef = t * toplam, j = 1;
      while (j < boylar.length - 1 && boylar[j] < hedef) j++;
      var a = noktalar[j - 1], b = noktalar[j];
      var parca = (hedef - boylar[j - 1]) / ((boylar[j] - boylar[j - 1]) || 1);
      h.style.transform = 'translate(' + (a.x + (b.x - a.x) * parca - dx) + 'px,' + (a.y + (b.y - a.y) * parca - dy) + 'px)';
    }
    yer(0);
    h.style.opacity = '0';
    return tween(250, function (t) { h.style.opacity = t; }, kolay.dogrusal, tok)
      .then(function () { return tween(sure || 1800, yer, kolay.gircik, tok); })
      .then(function () { return tween(300, function (t) { h.style.opacity = 1 - t; }, kolay.dogrusal, tok); })
      .then(function () { h.remove(); }, function () { h.remove(); });
  }

  function konfeti(x, y, adet) {
    adet = adet || 46;
    for (var i = 0; i < adet; i++) {
      var k = el('div', 'konfeti', katUi);
      k.style.background = Cizim.KONFETI[i % Cizim.KONFETI.length];
      var aci = rastgele(-Math.PI * 0.95, -Math.PI * 0.05);
      var guc = rastgele(260, 620);
      var hx = Math.cos(aci) * guc, hy = Math.sin(aci) * guc;
      var don = rastgele(-720, 720);
      if (k.animate) {
        var a = k.animate([
          { transform: 'translate(' + x + 'px,' + y + 'px) rotate(0deg)', opacity: 1 },
          { transform: 'translate(' + (x + hx) + 'px,' + (y + hy) + 'px) rotate(' + (don / 2) + 'deg)', opacity: 1, offset: 0.45 },
          { transform: 'translate(' + (x + hx * 1.3) + 'px,' + (y + hy + 520) + 'px) rotate(' + don + 'deg)', opacity: 0 }
        ], { duration: rastgele(1300, 2000), easing: 'cubic-bezier(.2,.7,.4,1)' });
        a.onfinish = (function (d) { return function () { d.remove(); }; })(k);
      } else {
        setTimeout((function (d) { return function () { d.remove(); }; })(k), 50);
      }
    }
  }

  /* ——— Etkinlik api'si ——— */

  function apiOlustur(tok, alan, tanim) {
    var dinleyiciler = [], zamanlayicilar = [];

    function sarmala(p) {
      return new Promise(function (coz, reddet) {
        p.then(function (v) { if (tok.canli) coz(v); }, function (e) { if (tok.canli) reddet(e); });
      });
    }

    var sonOvgu = -1, sonTekrar = 0;

    var api = {
      alan: alan,
      tanim: tanim,
      G: G, Y: Y,
      canli: function () { return tok.canli; },
      bekle: function (ms) {
        return sarmala(new Promise(function (r) { zamanlayicilar.push(setTimeout(r, ms)); }));
      },
      zamanla: function (ms, fn) {
        var id = setTimeout(function () { if (tok.canli) fn(); }, ms);
        zamanlayicilar.push(id);
        return id;
      },
      tween: function (ms, fn, ease) { return sarmala(tween(ms, fn, ease, tok)); },
      dongu: function (fn) {
        var d = { canli: true, fn: function (dt, t) { if (!tok.canli) { d.canli = false; return; } fn(dt, t); } };
        donguler.push(d);
        return { dur: function () { d.canli = false; } };
      },
      /* Dinleyici ekler; kaldırmak için dönen işlevi çağır */
      olay: function (hedef, tip, fn, secenek) {
        hedef.addEventListener(tip, fn, secenek);
        dinleyiciler.push([hedef, tip, fn, secenek]);
        return function () { hedef.removeEventListener(tip, fn, secenek); };
      },
      dokun: function (hedef, fn) {
        return api.olay(hedef, 'pointerdown', function (e) {
          if (!tok.canli) return;
          e.preventDefault();
          fn(e, nokta(e));
        });
      },
      nokta: nokta,
      soyle: function (k) { return sarmala(Ses.soyle(k)); },
      talimat: function (k) { sonTalimat = k; return api.soyle(k); },
      aferin: function () {
        var n;
        do { n = 1 + Math.floor(Math.random() * 5); } while (n === sonOvgu);
        sonOvgu = n;
        Efekt.dogru();
        rehberPoz('sevinc');
        return api.soyle('aferin_' + n);
      },
      tekrar: function () {
        Efekt.yanlis();
        rehberPoz('dusun', 2200);
        sonTekrar = sonTekrar === 1 ? 2 : 1;
        return api.soyle('tekrar_' + sonTekrar);
      },
      say: function (n) { return api.soyle('sayi_' + n); },
      ipucu: function (fn) { tok.ipucu = fn; },
      el: function (x, y) { return elGoster(x, y, tok); },
      elKaydir: function (noktalar, sure) { return elKaydir(noktalar, sure, tok); },
      kutla: function (x, y, adet) { konfeti(x, y, adet); },
      rehber: rehberPoz,
      sprite: function (icerik, x, y, gen, sinif, ebeveyn) { return sprite(icerik, x, y, gen, ebeveyn || alan, sinif); },

      /* Ortası (x,y) olan beyaz kart */
      kart: function (s) {
        var k = el('div', 'kart' + (s.sinif ? ' ' + s.sinif : ''), s.ebeveyn || alan);
        var w = s.w || 260, h = s.h || w;
        k.style.width = w + 'px';
        k.style.height = h + 'px';
        k.style.left = (s.x - w / 2) + 'px';
        k.style.top = (s.y - h / 2) + 'px';
        if (s.renk) k.style.background = s.renk;
        if (s.resim) {
          var i = el('img', null, k);
          i.src = s.resim;
          i.alt = '';
          i.draggable = false;
        }
        if (s.icerik) k.appendChild(s.icerik);
        if (s.etiket) el('div', 'etiket', k, s.etiket);
        return k;
      },

      /* Büyük yuvarlak düğme */
      dugme: function (s) {
        var b = el('button', 'buyuk-dugme' + (s.sinif ? ' ' + s.sinif : ''), s.ebeveyn || alan);
        b.type = 'button';
        b.style.left = s.x + 'px';
        b.style.top = s.y + 'px';
        b.appendChild(Cizim.ikon(s.ikon, '#fff', 2.8));
        if (s.etiket) el('span', 'etiket', b, s.etiket);
        if (s.fn) api.dokun(b, s.fn);
        return b;
      },

      /* Kartlardan doğru olanı bekler. Yanlışta kart sallanır, Tombiş
         "bir daha bakalım" der; iki yanlıştan sonra doğru kart parlar. */
      secim: function (kartlar, dogru, secenek) {
        secenek = secenek || {};
        var dogruMu = typeof dogru === 'function' ? dogru : function (i) { return i === dogru; };
        var dogruIndex = -1;
        for (var i = 0; i < kartlar.length; i++) if (dogruMu(i)) { dogruIndex = i; break; }
        return sarmala(new Promise(function (coz) {
          var bitti = false, yanlis = 0, kaldir = [];
          kartlar.forEach(function (k, i) {
            k.classList.remove('dogru', 'parla');
            kaldir.push(api.dokun(k, function () {
              if (bitti || k.classList.contains('pasif')) return;
              if (dogruMu(i)) {
                bitti = true;
                kaldir.forEach(function (f) { f(); });
                kartlar.forEach(function (x) { x.classList.remove('parla'); });
                k.classList.add('dogru');
                tok.ipucu = null;
                coz(i);
              } else {
                yanlis++;
                oynat(k, 'salla', 520);
                if (secenek.yanlis) secenek.yanlis(i); else api.tekrar();
                if (yanlis >= 2 && dogruIndex >= 0) kartlar[dogruIndex].classList.add('parla');
              }
            }));
          });
          if (dogruIndex >= 0 && secenek.ipucu !== false) {
            tok.ipucu = function () { kartlar[dogruIndex].classList.add('parla'); };
          }
        }));
      },

      bitti: function (secenek) { bitisPerdesi(tok, tanim, alan, secenek || {}); }
    };

    tok.temizle = function () {
      dinleyiciler.forEach(function (d) { d[0].removeEventListener(d[1], d[2], d[3]); });
      zamanlayicilar.forEach(clearTimeout);
    };
    return api;
  }

  /* ——— Sahne yönetimi ——— */

  function sahneAc(kurucu, tanim) {
    if (aktif) {
      aktif.tok.canli = false;
      aktif.tok.temizle();
      if (aktif.yikil) { try { aktif.yikil(); } catch (e) {} }
    }
    Ses.dur();
    donguTemizle();
    katOyun.innerHTML = '';
    [].slice.call(katUi.querySelectorAll('.ipucu-el, .konfeti')).forEach(function (d) { d.remove(); });
    altyazi.classList.add('bos');
    sonTalimat = null;
    bosTekrar = 0;
    sonDokunma = Date.now();
    rehberPoz('selam');
    rehberGoster(true);

    var alan = el('div', 'alan', katOyun);
    var tok = { canli: true, ipucu: null };
    var api = apiOlustur(tok, alan, tanim);
    aktif = { tok: tok, api: api, tanim: tanim };

    ogretmenSeridi(tanim);
    var sonuc = kurucu(api);
    if (sonuc && sonuc.yikil) aktif.yikil = sonuc.yikil;
    return api;
  }

  function ogretmenSeridi(tanim) {
    var etkinlikte = !!(tanim && tanim.kod);
    dugmeler.ev.hidden = !tanim;
    dugmeler.yeniden.hidden = !etkinlikte;
    baslikEl.innerHTML = '';
    if (etkinlikte) {
      el('b', null, baslikEl, tanim.ad);
      baslikEl.appendChild(document.createTextNode(tanim.kaynak || ''));
    }
    katArka.style.backgroundImage = 'url(' + ((tanim && tanim.arka) || 'gorsel/arka-cayir.webp') + ')';
  }

  /* ——— Etkinlik kaydı ve ilerleme ——— */

  var ANAHTAR = 'tombis.karinca.bitenler';
  function bitenler() {
    try { return JSON.parse(localStorage.getItem(ANAHTAR) || '[]'); } catch (e) { return []; }
  }
  function bitenYaz(kod) {
    var b = bitenler();
    if (b.indexOf(kod) < 0) b.push(kod);
    try { localStorage.setItem(ANAHTAR, JSON.stringify(b)); } catch (e) {}
  }
  function sifirla() { try { localStorage.removeItem(ANAHTAR); } catch (e) {} }

  function etkinlik(tanim) { etkinlikler.push(tanim); }
  function bul(kod) { for (var i = 0; i < etkinlikler.length; i++) if (etkinlikler[i].kod === kod) return etkinlikler[i]; }
  function sonraki(kod) {
    for (var i = 0; i < etkinlikler.length; i++) if (etkinlikler[i].kod === kod) return etkinlikler[i + 1];
  }

  function oyna(kod) {
    var tanim = bul(kod);
    if (!tanim) return menu();
    Ses.hazirla(tanim.sesler || []);
    sahneAc(function (api) { return tanim.kur(api); }, tanim);
  }

  /* ——— Bitiş perdesi ——— */

  function bitisPerdesi(tok, tanim, alan, secenek) {
    if (!tok.canli) return;
    tok.ipucu = null;
    bitenYaz(tanim.kod);
    var p = el('div', 'perde', alan);
    var yildiz = el('div', 'yildizlar', p);
    yildiz.appendChild(Cizim.svg('<svg viewBox="-100 -100 200 200">' + [0, 1, 2, 3, 4, 5, 6, 7].map(function (i) {
      var a = i * Math.PI / 4, r = 88;
      return '<path transform="translate(' + (Math.cos(a) * r).toFixed(1) + ' ' + (Math.sin(a) * r).toFixed(1) + ') scale(.5)" d="M0-20l6 13 14 2-10 10 2 14L0 13l-12 6 2-14-10-10 14-2z" fill="' + Cizim.KONFETI[i % 6] + '"/>';
    }).join('') + '</svg>'));
    var rozet = el('div', 'rozet', p);
    var ri = el('img', null, rozet);
    ri.src = tanim.ikon;
    ri.alt = '';
    Efekt.kutlama();
    rehberPoz('sevinc', 3000);
    konfeti(960, 440, 60);

    var menuDugme, sonrakiDugme, tekrarDugme;
    var api = aktif.api;
    function dugmeleriGoster() {
      tekrarDugme = api.dugme({ x: 690, y: 850, ikon: 'yeniden', sinif: 'mavi kucuk', etiket: 'Tekrar', ebeveyn: p, fn: function () { oyna(tanim.kod); } });
      menuDugme = api.dugme({ x: 960, y: 850, ikon: 'ev', sinif: 'sari kucuk', etiket: 'Oyunlar', ebeveyn: p, fn: function () { menu(); } });
      var s = sonraki(tanim.kod);
      sonrakiDugme = api.dugme({ x: 1230, y: 850, ikon: 'ileri', sinif: 'yesil kucuk', etiket: s ? s.ad : 'Final', ebeveyn: p, fn: function () {
        if (s) oyna(s.kod); else final();
      } });
    }
    api.soyle('bitti').then(function () {
      if (secenek.sohbet) {
        var kutu = el('div', 'sohbet', p);
        el('small', null, kutu, 'Sohbet zamanı');
        kutu.appendChild(document.createTextNode(Ses.metin(secenek.sohbet)));
        sonTalimat = secenek.sohbet;
        dugmeleriGoster();
        return api.soyle(secenek.sohbet);
      }
      dugmeleriGoster();
    });
  }

  /* ——— Kurulum ——— */

  function kur() {
    sahne = document.getElementById('sahne');
    katArka = el('div', 'katman', sahne); katArka.id = 'kat-arka';
    katOyun = el('div', 'katman', sahne); katOyun.id = 'kat-oyun';
    katUi = el('div', 'katman', sahne); katUi.id = 'kat-ui';

    rehber = el('div', 'rehber', katUi);
    rehberImg = el('img', null, rehber);
    rehberImg.src = POZ.selam;
    rehberImg.alt = 'Tombiş';
    rehberImg.draggable = false;
    rehber.addEventListener('pointerdown', function (e) {
      e.preventDefault();
      e.stopPropagation();
      if (sonTalimat && aktif) aktif.api.soyle(sonTalimat);
    });

    altyazi = el('div', 'altyazi bos', katUi);

    var serit = el('div', 'ogretmen', katUi);
    function ikonDugme(ad, ikon, baslik, fn) {
      var b = el('button', 'ikon-dugme', serit);
      b.type = 'button';
      b.title = baslik;
      b.setAttribute('aria-label', baslik);
      b.appendChild(Cizim.ikon(ikon));
      b.addEventListener('pointerdown', function (e) { e.preventDefault(); e.stopPropagation(); fn(); });
      dugmeler[ad] = b;
      return b;
    }
    ikonDugme('ev', 'ev', 'Oyunlar', function () { menu(); });
    ikonDugme('yeniden', 'yeniden', 'Baştan başlat', function () { if (aktif && aktif.tanim && aktif.tanim.kod) T.oyna(aktif.tanim.kod); });
    ikonDugme('ses', Ses.acik() ? 'ses' : 'sessiz', 'Ses', function () {
      Ses.ac(!Ses.acik());
      dugmeler.ses.innerHTML = '';
      dugmeler.ses.appendChild(Cizim.ikon(Ses.acik() ? 'ses' : 'sessiz'));
    });
    ikonDugme('tamekran', 'tamekran', 'Tam ekran', tamEkran);
    baslikEl = el('div', 'ogretmen-baslik', katUi);

    Ses.dinle(function (olay, k) {
      if (olay === 'basla') {
        altyaziGoster(k);
        rehber.classList.add('konusuyor');
      } else {
        rehber.classList.remove('konusuyor');
        altyazi.classList.add('soluk');
      }
    });

    // Her dokunuşta iz bırak ve boşta sayacını sıfırla
    sahne.addEventListener('pointerdown', function (e) {
      sonDokunma = Date.now();
      bosTekrar = 0;
      dalga(nokta(e));
    }, true);
    // Uzun basışta çıkan sağ tık menüsünü, sürüklemeyi ve seçimi engelle
    ['contextmenu', 'dragstart', 'selectstart'].forEach(function (t) {
      document.addEventListener(t, function (e) { e.preventDefault(); });
    });

    // Çocuk bir süre dokunmazsa talimatı yinele ve ipucu göster
    setInterval(function () {
      if (!aktif || !aktif.tok.canli) return;
      if (Ses.konusuyor() || document.hidden) { sonDokunma = Math.max(sonDokunma, Date.now() - 4000); return; }
      if (Date.now() - sonDokunma < 9000 || bosTekrar >= 3) return;
      sonDokunma = Date.now();
      bosTekrar++;
      if (sonTalimat) aktif.api.soyle(sonTalimat);
      if (aktif.tok.ipucu) { try { aktif.tok.ipucu(); } catch (e) {} }
    }, 1000);

    window.addEventListener('resize', olcekle);
    document.addEventListener('fullscreenchange', olcekle);
    document.addEventListener('webkitfullscreenchange', olcekle);
    olcekle();
    requestAnimationFrame(kare);
  }

  function tamEkran() {
    var d = document, e = d.documentElement;
    var acik = d.fullscreenElement || d.webkitFullscreenElement;
    try {
      if (acik) (d.exitFullscreen || d.webkitExitFullscreen).call(d);
      else (e.requestFullscreen || e.webkitRequestFullscreen).call(e);
    } catch (x) {}
  }

  /* Menü, giriş ve final menu.js içinde tanımlanır; burada yalnızca adları */
  function menu() { if (T.menuAc) T.menuAc(); }
  function final() { if (T.finalAc) T.finalAc(); }

  return {
    G: G, Y: Y,
    kur: kur,
    el: el,
    sprite: sprite,
    oynat: oynat,
    karistir: karistir,
    rastgele: rastgele,
    uzaklik: uzaklik,
    kolay: kolay,
    tween: tween,
    etkinlik: etkinlik,
    etkinlikler: function () { return etkinlikler; },
    bitenler: bitenler,
    sifirla: sifirla,
    oyna: oyna,
    menu: menu,
    final: final,
    sahneAc: sahneAc,
    tamEkran: tamEkran,
    konfeti: konfeti,
    rehberPoz: rehberPoz,
    rehberGoster: rehberGoster,
    dugme: function (ad) { return dugmeler[ad]; },
    sonTalimat: function (k) { sonTalimat = k; }
  };
})();
