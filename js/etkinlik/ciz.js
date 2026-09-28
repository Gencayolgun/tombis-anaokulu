/* Karınca Çiz — kitap s. 1 ("Karınca resmi çizelim") ve s. 3 ("Karıncaların
   toplanma sebebini düşünelim, boş alana resimleyelim") · kılavuz 1.

   Tahtada parmakla boyama. Birden çok çocuk aynı anda çizebilir. Birinci
   sayfada noktalı bir karınca rehberi var; ikinci sayfada karıncalar bir
   halka olmuş, ortası boş: çocuklar sebebini çizer ya da resim koyar. */

T.etkinlik({
  kod: 'ciz',
  ad: 'Karınca Çiz',
  kaynak: 'Kitap s. 1, 3 · Kılavuz 1',
  ikon: 'gorsel/ik-ciz.webp',
  arka: 'gorsel/arka-zemin.webp',
  sesler: ['ciz_giris', 'ciz_toplanma', 'ciz_bitti'],

  kur: function (api) {
    var KX = 360, KY = 300, KW = 1200, KH = 620;
    var RENKLER = ['#34302E', '#8C5634', '#E23B2E', '#F5891F', '#FFC928', '#43B15A', '#2F8FE0'];
    var DAMGALAR = ['cilek', 'is-kiler', 'yaprak', 'bocek-ugur'];
    var k = Math.min(2, Math.max(1, (window.devicePixelRatio || 1) * window.innerWidth / 1920));

    var kagit = T.el('div', 'kagit', api.alan);
    kagit.style.left = KX + 'px';
    kagit.style.top = KY + 'px';
    kagit.style.width = KW + 'px';
    kagit.style.height = KH + 'px';

    function tuval() {
      var c = T.el('canvas', null, kagit);
      c.width = KW * k;
      c.height = KH * k;
      c.style.width = KW + 'px';
      c.style.height = KH + 'px';
      var x = c.getContext('2d');
      x.scale(k, k);
      x.lineCap = 'round';
      x.lineJoin = 'round';
      return x;
    }
    var rehber = tuval();
    var damgaKat = T.el('div', 'damga-kat', kagit);
    var halkaKat = T.el('div', 'damga-kat', kagit);
    var boya = tuval();
    boya.canvas.classList.add('boya-tuval');

    // ——— Rehber çizimleri ———
    function kesik(c) { c.setLineDash([16, 18]); c.lineWidth = 8; c.strokeStyle = 'rgba(90,58,38,.32)'; }
    function karincaRehberi(c) {
      kesik(c);
      var Y = 330;
      [[420, 120], [600, 62], [750, 88]].forEach(function (d) { c.beginPath(); c.arc(d[0], Y, d[1], 0, Math.PI * 2); c.stroke(); });
      [-1, 1].forEach(function (s) {
        [[620, 700, 780], [600, 610, 590], [580, 500, 420]].forEach(function (b) {
          c.beginPath();
          c.moveTo(b[0], Y + s * 50);
          c.lineTo(b[1], Y + s * 150);
          c.lineTo(b[2], Y + s * 230);
          c.stroke();
        });
        c.beginPath();
        c.moveTo(800, Y + s * 50);
        c.quadraticCurveTo(870, Y + s * 110, 930, Y + s * 140);
        c.stroke();
      });
      c.setLineDash([]);
    }
    function halkaRehberi(c) {
      kesik(c);
      c.beginPath();
      c.arc(KW / 2, KH / 2, 175, 0, Math.PI * 2);
      c.stroke();
      c.setLineDash([]);
    }

    // ——— Palet ———
    var secili = 0, mod = 'kalem', seciliDamga = null;
    var boyalar = RENKLER.map(function (r, i) {
      var b = T.el('div', 'boya-kalem', api.alan);
      b.appendChild(Cizim.boya(r));
      b.style.left = (470 + i * 150) + 'px';
      b.style.top = '905px';
      api.dokun(b, function () {
        secili = i;
        mod = 'kalem';
        Efekt.tik();
        isaretle();
      });
      return b;
    });
    var damgalar = DAMGALAR.map(function (ad, i) {
      var d = api.kart({ x: 190, y: 420 + i * 150, w: 130, h: 130, resim: 'gorsel/' + ad + '.webp', sinif: 'gizli' });
      api.dokun(d, function () {
        mod = 'damga';
        seciliDamga = ad;
        Efekt.tik();
        isaretle();
      });
      return d;
    });
    function isaretle() {
      boyalar.forEach(function (b, i) { b.classList.toggle('secili', mod === 'kalem' && i === secili); });
      damgalar.forEach(function (d, i) { d.classList.toggle('secili', mod === 'damga' && DAMGALAR[i] === seciliDamga); });
    }
    isaretle();

    // ——— Çizim: her parmağın kendi çizgisi ———
    var parmaklar = {};
    function kagitNoktasi(e) {
      var p = api.nokta(e);
      return { x: p.x - KX, y: p.y - KY };
    }
    api.olay(boya.canvas, 'pointerdown', function (e) {
      e.preventDefault();
      var p = kagitNoktasi(e);
      if (mod === 'damga' && seciliDamga) {
        var s = T.sprite('gorsel/' + seciliDamga + '.webp', p.x, p.y, 140, damgaKat, 'damga');
        s.o = 0.4; s.ciz();
        api.tween(260, function (t) { s.o = 0.4 + 0.6 * t; s.ciz(); }, T.kolay.zipla);
        Efekt.pop();
        return;
      }
      parmaklar[e.pointerId] = p;
      boya.fillStyle = RENKLER[secili];
      boya.beginPath();
      boya.arc(p.x, p.y, 10, 0, Math.PI * 2);
      boya.fill();
      try { boya.canvas.setPointerCapture(e.pointerId); } catch (x) {}
    });
    api.olay(boya.canvas, 'pointermove', function (e) {
      var once = parmaklar[e.pointerId];
      if (!once) return;
      var p = kagitNoktasi(e);
      boya.strokeStyle = RENKLER[secili];
      boya.lineWidth = 20;
      boya.beginPath();
      boya.moveTo(once.x, once.y);
      boya.lineTo(p.x, p.y);
      boya.stroke();
      parmaklar[e.pointerId] = p;
    });
    function birak(e) { delete parmaklar[e.pointerId]; }
    api.olay(boya.canvas, 'pointerup', birak);
    api.olay(boya.canvas, 'pointercancel', birak);

    function temizle() {
      boya.clearRect(0, 0, KW, KH);
      damgaKat.innerHTML = '';
    }

    // ——— Öğretmen düğmeleri: sil ve kaydet ———
    var sil = T.el('button', 'ikon-dugme kose', api.alan);
    sil.type = 'button';
    sil.title = 'Temizle';
    sil.style.left = '1620px';
    sil.style.top = '322px';
    sil.appendChild(Cizim.ikon('sil'));
    api.dokun(sil, function () { temizle(); Efekt.hisir(); });

    var kaydet = T.el('button', 'ikon-dugme kose', api.alan);
    kaydet.type = 'button';
    kaydet.title = 'Resmi kaydet';
    kaydet.style.left = '1620px';
    kaydet.style.top = '426px';
    kaydet.appendChild(Cizim.ikon('kaydet'));
    api.dokun(kaydet, function () { indir(); });

    /* Resmi PNG olarak indirir (öğretmenin portfolyosu için). Dosyadan
       açıldığında damga resimleri tuvali "kirletebilir"; o zaman damgasız
       kaydedilir. */
    function indir() {
      function birlestir(damgaliMi) {
        var c = document.createElement('canvas');
        c.width = KW;
        c.height = KH;
        var x = c.getContext('2d');
        x.fillStyle = '#fff';
        x.fillRect(0, 0, KW, KH);
        x.drawImage(rehber.canvas, 0, 0, KW, KH);
        [].slice.call(halkaKat.querySelectorAll('.sprite')).forEach(function (s) {
          // Halka karıncaları basit bir işaretle
          var m = /translate\(([-\d.]+)px,([-\d.]+)px\)/.exec(s.style.transform);
          if (!m) return;
          x.fillStyle = '#8C5634';
          x.beginPath(); x.arc(+m[1], +m[2], 16, 0, Math.PI * 2); x.fill();
        });
        if (damgaliMi) {
          [].slice.call(damgaKat.querySelectorAll('.sprite')).forEach(function (s) {
            var m = /translate\(([-\d.]+)px,([-\d.]+)px\)/.exec(s.style.transform);
            var img = s.querySelector('img');
            if (!m || !img || !img.naturalWidth) return;
            var w = 140, h = w * img.naturalHeight / img.naturalWidth;
            x.drawImage(img, +m[1] - w / 2, +m[2] - h / 2, w, h);
          });
        }
        x.drawImage(boya.canvas, 0, 0, KW, KH);
        return c.toDataURL('image/png');
      }
      var veri;
      try { veri = birlestir(true); } catch (e) {
        try { veri = birlestir(false); } catch (e2) { return; }
      }
      var a = document.createElement('a');
      a.href = veri;
      a.download = 'karinca-resmi-' + new Date().toISOString().slice(0, 10) + '.png';
      document.body.appendChild(a);
      a.click();
      a.remove();
      Efekt.dogru();
    }

    // ——— Sayfalar ———
    var tamam = null;
    function tamamBekle() {
      return new Promise(function (coz) {
        tamam = api.dugme({ x: 1740, y: 930, ikon: 'tamam', sinif: 'yesil kucuk', etiket: 'Bitti', fn: function () {
          tamam.remove();
          coz();
        } });
      });
    }

    function sayfa1() {
      karincaRehberi(rehber);
      api.talimat('ciz_giris');
      api.ipucu(function () {
        api.elKaydir([{ x: KX + 300, y: KY + 330 }, { x: KX + 420, y: KY + 210 }, { x: KX + 540, y: KY + 330 }, { x: KX + 420, y: KY + 450 }], 1600);
      });
      return tamamBekle();
    }

    function sayfa2() {
      temizle();
      rehber.clearRect(0, 0, KW, KH);
      halkaRehberi(rehber);
      damgalar.forEach(function (d) { d.classList.remove('gizli'); });
      // Karıncalar ortaya bakan bir halka olur
      var halka = [];
      for (var i = 0; i < 14; i++) {
        var a = i / 14 * Math.PI * 2;
        var kar = Cizim.karinca({ renk: i % 3 ? Cizim.RENK.karinca : Cizim.RENK.siyah });
        var s = T.sprite(kar.el, KW / 2 + Math.cos(a) * 262, KH / 2 + Math.sin(a) * 262, 96, halkaKat);
        s.a = a * 180 / Math.PI + 180;
        s.ciz();
        halka.push({ s: s, k: kar, a: a });
      }
      api.talimat('ciz_toplanma');
      api.ipucu(function () { api.el(KX + KW / 2, KY + KH / 2); });
      return tamamBekle().then(function () {
        api.ipucu(null);
        // Karıncalar ortaya doğru sevinçle yaklaşıp geri çekilir
        var d = api.dongu(function (dt) { halka.forEach(function (h) { h.k.adim(dt, 12); }); });
        return api.tween(900, function (t) {
          var r = 262 - Math.sin(t * Math.PI) * 50;
          halka.forEach(function (h) { h.s.git(KW / 2 + Math.cos(h.a) * r, KH / 2 + Math.sin(h.a) * r); });
        }).then(function () { d.dur(); halka.forEach(function (h) { h.k.dur(); }); });
      });
    }

    function kutla() {
      api.ipucu(null);
      api.kutla(KX + KW / 2, KY + 200, 50);
      Efekt.kutlama();
      T.rehberPoz('sevinc', 2500);
      return api.soyle('ciz_bitti');
    }

    sayfa1()
      .then(kutla)
      .then(sayfa2)
      .then(kutla)
      .then(function () { api.bitti({}); });
  }
});
