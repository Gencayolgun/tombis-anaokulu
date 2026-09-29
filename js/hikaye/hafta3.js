/* 3. hafta — Kökçe'nin Tohumu (değer: sabır ve sıra beklemek)

   Tombiş'in dizi iyileşmiştir; Kökçe'nin verdiği tohumu eker ve hemen
   çiçek açsın ister. Nereye ekilecek, nasıl sulanacak, kazılıp bakılacak
   mı, parkta salıncak sırasına girilecek mi; sınıf seçer. Aralarda
   ekme sırası, günleri sayma (1–7), sıradakileri sayma, küçükten büyüğe
   sıralama (tohum-filiz-fidan-çiçek), hareket ve sohbet molaları. Sonunda
   çiçek açar, Cingöz görür ve Krista'ya göstermeye koşar: 4. hafta
   "Kırılan Kristal" oradan başlar.

   Yaklaşık süre: 30-35 dakika. */

(function () {
  var SESLER = [];
  for (var k in window.METIN) if (/^([tkpc]_h3_|muzik_h3_)/.test(k)) SESLER.push(k);

  var ZEMIN = 930;
  var TARLA = { x: 1470, y: 745 };        // çiçek tarhı (arka-tohum), ortası
  var AGAC = { x: 520, y: 900 };          // ağacın gölgesi
  var SALINCAK = { x: 1580, y: 285, L: 385 }; // park: salıncak çubuğu ve ip boyu
  var ANT = ['rol-isci', 'rol-kralice', 'rol-ciftci'];

  function karincalar(h, x0, arasi, boy, sag) {
    return ANT.map(function (r, i) {
      return h.aktor('karinca' + i, 'gorsel/' + r + '.webp', x0 + i * arasi, ZEMIN - (i % 2) * 20, boy).bak(!!sag);
    });
  }

  Hikaye.hafta({
    no: 3,
    ad: 'Kökçe\'nin Tohumu',
    deger: 'Sabır ve sıra beklemek',
    ikon: 'hikaye/gorsel/cicek.webp',
    sonraki: 'Kırılan Kristal (dürüstlük)',
    sesler: SESLER,
    gorseller: ['arka-tohum', 'arka-park', 'tohum', 'filiz', 'fidan', 'cicek', 'sulama', 'kurek', 'salincak',
      'camur', 'gunes', 'damla', 'toprak', 'kova',
      'gorsel/rol-isci.webp', 'gorsel/rol-kralice.webp', 'gorsel/rol-ciftci.webp'],
    baslangic: 'acilis',

    sahneler: {

      /* ——— Açılış: dizi iyileşti ——— */
      acilis: function (h) {
        h.arka('arka-tohum');
        var t = h.aktor('tombis', 'yuru', 700, ZEMIN, 300);
        t.o = 0; t.ciz();
        return h.dizi([
          function () { return t.belir(600); },
          function () { t.poz('sevinc'); return t.zipla(3, 70); },
          't_h3_a1',
          function () { t.poz('tohum'); },
          't_h3_a2',
          function () { return h.baslik('3. Bölüm', 'Kökçe\'nin Tohumu', 't_h3_baslik'); }
        ]).then(function () { return 'yer'; });
      },

      /* ——— Nereye ekelim? ——— */
      yer: function (h) {
        h.arka('arka-tohum');
        var t = h.aktor('tombis', 'tohum', 800, ZEMIN, 300);
        var k = h.aktor('kokce', 'selam', 2200, ZEMIN, 240);
        return h.dizi([
          function () { return k.git(1150, ZEMIN, 1400); },
          function () { k.bak(false); },
          'k_h3_b1',
          function () { t.poz('dusun'); },
          function () {
            return h.secim({
              baslik: 'Tohumu nereye ekelim?', soru: 't_h3_b2',
              a: { etiket: 'Güneşli yere', resim: 'gunes', kucuk: true, git: 'gunesli' },
              b: { etiket: 'Ağacın gölgesine', resim: 'toprak', kucuk: true, git: 'golge' }
            });
          }
        ]);
      },

      gunesli: function (h) {
        h.arka('arka-tohum');
        var t = h.aktor('tombis', 'tohum', 800, ZEMIN, 300);
        var k = h.aktor('kokce', 'sevinc', 1150, ZEMIN, 240).bak(false);
        return h.dizi([
          function () { return k.zipla(2); },
          'k_h3_c1',
          function () { return Promise.all([t.git(TARLA.x - 330, ZEMIN, 1200), k.git(TARLA.x - 600, ZEMIN, 1200)]); }
        ]).then(function () { return 'ekme'; });
      },

      golge: function (h) {
        h.arka('arka-tohum');
        var t = h.aktor('tombis', 'tohum', 800, ZEMIN, 300);
        var k = h.aktor('kokce', 'selam', 1150, ZEMIN, 240).bak(false);
        return h.dizi([
          function () { return t.git(AGAC.x, ZEMIN, 1000); },
          function () { t.poz('bekle'); return h.bekle(500); },
          function () { k.poz('anlat'); },
          'k_h3_d1',
          function () { t.poz('sevinc'); },
          't_h3_d2',
          function () { return Promise.all([t.git(TARLA.x - 330, ZEMIN, 1800), k.git(TARLA.x - 600, ZEMIN, 1600)]); }
        ]).then(function () { h.durum.golge = true; return 'ekme'; });
      },

      /* ——— Ekme sırası: kürek, tohum, su ——— */
      ekme: function (h) {
        h.arka('arka-tohum');
        var t = h.aktor('tombis', 'tohum', TARLA.x - 330, ZEMIN, 300);
        var k = h.aktor('kokce', 'anlat', TARLA.x - 600, ZEMIN, 240);
        var toprak = null;
        return h.dizi([
          function () {
            return ekmeSirasi(h, t, function (n) {
              if (n === 1) { t.poz('kaz'); h.toz(TARLA.x, TARLA.y - 40); }
              if (n === 2) { t.poz('tohum'); var s = h.oge('tohum', t.x, t.y - 200, 70); h.uc(s, TARLA.x, TARLA.y - 30, 600, true).then(function () { s.remove(); toprak = h.oge('toprak', TARLA.x, TARLA.y - 40, 220, 'belir'); }); }
              if (n === 3) { t.poz('sula'); damlalar(h, TARLA.x, TARLA.y - 160); }
            });
          },
          function () { t.poz('sevinc'); return t.zipla(2); },
          't_h3_e2',
          function () { t.poz('bekle'); return h.bekle(400); },
          function () { k.poz('anlat'); },
          'k_h3_e3',
          function () { t.poz('dusun'); },
          function () {
            return h.secim({
              baslik: 'Nasıl sulayalım?', soru: 't_h3_e4',
              a: { etiket: 'Her gün birazcık', resim: 'sulama', kucuk: true, git: 'hergun' },
              b: { etiket: 'Bütün suyu şimdi', resim: 'kova', kucuk: true, git: 'hepsi' }
            });
          }
        ]);
      },

      /* Bütün suyu dök: toprak göle döner */
      hepsi: function (h) {
        h.arka('arka-tohum');
        var t = h.aktor('tombis', 'sevinc', TARLA.x - 330, ZEMIN, 300);
        var k = h.aktor('kokce', 'bekle', TARLA.x - 600, ZEMIN, 240);
        h.oge('toprak', TARLA.x, TARLA.y - 40, 220);
        var kova = null, camur = null;
        return h.dizi([
          't_h3_f1',
          function () {
            kova = h.oge('kova', t.x + 120, t.y - 220, 150, 'belir');
            return h.bekle(500);
          },
          function () {
            return h.uc(kova, TARLA.x, TARLA.y - 260, 700).then(function () {
              kova.style.transform = 'translate(-50%,-50%) rotate(-80deg)';
              damlalar(h, TARLA.x, TARLA.y - 160, 14);
              return h.bekle(900);
            });
          },
          function () {
            kova.remove();
            camur = h.oge('camur', TARLA.x, TARLA.y - 45, 360, 'belir');
            Efekt.yanlis();
            k.poz('saskin');
            return k.zipla(2, 50);
          },
          'k_h3_f2',
          function () { t.poz('saskin'); return h.kamera(1.35, TARLA.x - 150, 760, 900); },
          function () { return h.kamera(1, 960, 540, 700); },
          function () { t.poz('dusun'); return h.sohbet('t_h3_f3', 90); },
          function () { k.poz('anlat'); },
          'k_h3_f4',
          function () { t.poz('selam'); },
          't_h3_f5',
          function () { camur.classList.add('gizli'); return h.bekle(700); }
        ]).then(function () { h.durum.acele = true; return 'hergun'; });
      },

      /* ——— Her gün sula: 1, 2, 3 ——— */
      hergun: function (h) {
        h.arka('arka-tohum');
        var t = h.aktor('tombis', 'sula', TARLA.x - 330, ZEMIN, 300);
        var k = h.aktor('kokce', 'bekle', TARLA.x - 600, ZEMIN, 240);
        h.oge('toprak', TARLA.x, TARLA.y - 40, 220);
        var gunler = gunlerPanosu(h);
        return h.dizi([
          function () { return sulama(h, gunler, 0, 3, 't_h3_g1', t); },
          function () { t.poz('bekle'); k.poz('anlat'); return h.bekle(500); },
          function () {
            return h.secim({
              baslik: 'Tohum orada mı?', soru: 't_h3_g2',
              a: { etiket: 'Kazıp bakalım', resim: 'kurek', kucuk: true, git: 'kaz' },
              b: { etiket: 'Bekleyelim', kim: 'tombis', resim: 'bekle', kucuk: true, git: 'bekle' }
            });
          }
        ]).then(function (id) { gunler.kaldir(); return id; });
      },

      /* Kaz: kök rahatsız olur, yeniden örtülür */
      kaz: function (h) {
        h.arka('arka-tohum');
        var t = h.aktor('tombis', 'kaz', TARLA.x - 330, ZEMIN, 300);
        var k = h.aktor('kokce', 'bekle', TARLA.x - 600, ZEMIN, 240);
        var toprak = h.oge('toprak', TARLA.x, TARLA.y - 40, 220);
        var tohum = null;
        return h.dizi([
          't_h3_h1',
          function () { h.toz(TARLA.x, TARLA.y - 40); toprak.classList.add('gizli'); return h.bekle(400); },
          function () {
            tohum = h.oge('tohum', TARLA.x, TARLA.y - 60, 110, 'belir');
            var kok = T.el('div', 'h-kok', tohum);
            kok.innerHTML = '<svg viewBox="0 0 60 60"><path d="M30 4v30M30 18c-8 4-12 12-14 22M30 22c8 4 12 12 14 22" stroke="#F1E9DA" stroke-width="5" stroke-linecap="round" fill="none"/></svg>';
            return h.kamera(1.5, TARLA.x - 60, 800, 900);
          },
          function () { k.poz('saskin'); },
          function () { return h.bekle(300); },
          function () { return h.kamera(1, 960, 540, 600); },
          function () { k.poz('anlat'); return ortme(h, toprak, tohum, 'k_h3_h2', 3); },
          function () { t.poz('selam'); },
          't_h3_h3'
        ]).then(function () { h.durum.kazdi = true; return 'park'; });
      },

      /* Bekle: sabır dansı */
      bekle: function (h) {
        h.arka('arka-tohum');
        var t = h.aktor('tombis', 'bekle', TARLA.x - 330, ZEMIN, 300);
        var k = h.aktor('kokce', 'anlat', TARLA.x - 600, ZEMIN, 240);
        h.oge('toprak', TARLA.x, TARLA.y - 40, 220);
        return h.dizi([
          'k_h3_i1',
          function () { t.poz('uza'); k.poz('sevinc'); },
          function () {
            return h.hareket('t_h3_i2', 40, function (z) {
              var s = 0.85 + Math.abs(Math.sin(z / 900)) * 0.25;
              t.o = s; t.ciz();
              k.dy = -Math.abs(Math.sin(z / 450)) * 30; k.ciz();
            });
          },
          function () { t.o = 1; t.poz('sevinc'); t.ciz(); }
        ]).then(function () { return 'park'; });
      },

      /* ——— Park: salıncak sırası ——— */
      park: function (h) {
        h.arka('arka-park');
        var salincak = salincakKur(h);
        var t = h.aktor('tombis', 'yuru', -300, ZEMIN, 260);
        var k = h.aktor('kokce', 'selam', -600, ZEMIN, 240);
        var p = h.aktor('pirilti', 'sevinc', 1150, ZEMIN, 200);
        var antlar = karincalar(h, 640, 170, 130, true);
        return h.dizi([
          function () { k.poz('selam'); return h.bekle(200); },
          'k_h3_j1',
          function () { return Promise.all([t.git(380, ZEMIN, 1500), k.git(150, ZEMIN, 1500)]); },
          function () {
            return h.dokunSay({
              talimat: 't_h3_j2', hedefler: [p, antlar[2], antlar[1], antlar[0]],
              her: function (d) { if (d.zipla) d.zipla(1, 60); }
            });
          },
          function () { t.poz('dusun'); },
          function () {
            return h.secim({
              baslik: 'Salıncakta ne yapalım?', soru: 't_h3_j3',
              a: { etiket: 'Öne geçsin', kim: 'tombis', resim: 'saskin', kucuk: true, git: 'onegec' },
              b: { etiket: 'Sıraya girsin', kim: 'tombis', resim: 'bekle', kucuk: true, git: 'siraya' }
            });
          }
        ]).then(function (id) { salincak.remove(); return id; });
      },

      /* Öne geçer: Pırıltı kızar, Tombiş sıranın sonuna geçer */
      onegec: function (h) {
        h.arka('arka-park');
        var salincak = salincakKur(h);
        var t = h.aktor('tombis', 'yuru', 380, ZEMIN, 260);
        var k = h.aktor('kokce', 'selam', 150, ZEMIN, 240);
        var p = h.aktor('pirilti', 'sevinc', 1150, ZEMIN, 200);
        var antlar = karincalar(h, 640, 170, 130, true);
        return h.dizi([
          't_h3_k1',
          function () { return t.git(SALINCAK.x, ZEMIN, 1300, 'kos'); },
          function () { t.poz('salincak'); salincak.style.display = 'none'; t.y = SALINCAK.y + SALINCAK.L; t.ciz(); return h.bekle(300); },
          function () { p.poz('uzgun'); antlar.forEach(function (a) { a.bak(true); }); return p.zipla(2, 40); },
          'p_h3_k2',
          function () { t.poz('saskin'); return h.bekle(400); },
          function () { t.y = ZEMIN; t.poz('dusun'); t.ciz(); salincak.style.display = ''; },
          't_h3_k3',
          function () { return t.git(470, ZEMIN, 1200); },
          function () { t.bak(true); p.poz('sevinc'); k.poz('sevinc'); return p.zipla(2); }
        ]).then(function () { salincak.remove(); h.durum.onegecti = true; return 'sallan'; });
      },

      /* Sıraya girer */
      siraya: function (h) {
        h.arka('arka-park');
        var salincak = salincakKur(h);
        var t = h.aktor('tombis', 'yuru', 380, ZEMIN, 260);
        var k = h.aktor('kokce', 'selam', 150, ZEMIN, 240);
        var p = h.aktor('pirilti', 'sevinc', 1150, ZEMIN, 200);
        karincalar(h, 640, 170, 130, true);
        return h.dizi([
          function () { return t.git(470, ZEMIN, 900); },
          function () { t.bak(true); p.bak(false); return p.zipla(2); },
          'p_h3_l1',
          function () { p.bak(true); k.poz('sevinc'); }
        ]).then(function () { salincak.remove(); return 'sallan'; });
      },

      /* Sırayla salıncak: kim binecek? */
      sallan: function (h) {
        h.arka('arka-park');
        var salincak = salincakKur(h);
        var t = h.aktor('tombis', 'yuru', 470, ZEMIN, 260).bak(true);
        var k = h.aktor('kokce', 'sevinc', 150, ZEMIN, 240);
        var p = h.aktor('pirilti', 'sevinc', 1150, ZEMIN, 200);
        var antlar = karincalar(h, 640, 170, 130, true);
        return h.dizi([
          function () { return salincakSirasi(h, [p, antlar[2], antlar[1], antlar[0], t], salincak, 't_h3_l2'); },
          function () { t.poz('salincak'); t.x = SALINCAK.x; t.y = SALINCAK.y + SALINCAK.L; t.ciz(); },
          function () {
            return h.hareket('t_h3_m1', 30, function (z) {
              var a = Math.sin(z / 500) * 22;
              salincak.style.transform = 'translate(-50%,0) rotate(' + a.toFixed(1) + 'deg)';
              t.r = a; t.x = SALINCAK.x + Math.sin(a * Math.PI / 180) * SALINCAK.L; t.y = SALINCAK.y + SALINCAK.L - (1 - Math.cos(a * Math.PI / 180)) * SALINCAK.L; t.ciz();
              k.dy = -Math.abs(Math.sin(z / 400)) * 30; k.ciz();
            });
          },
          function () { t.r = 0; t.x = SALINCAK.x; t.y = SALINCAK.y + SALINCAK.L; t.ciz(); return t.zipla(2, 40); },
          't_h3_m2'
        ]).then(function () { salincak.remove(); return 'filiz'; });
      },

      /* ——— Bahçeye dönüş: filiz, 4-7. günler, çiçek ——— */
      filiz: function (h) {
        h.arka('arka-tohum');
        var t = h.aktor('tombis', 'yuru', -300, ZEMIN, 300);
        var k = h.aktor('kokce', 'selam', -560, ZEMIN, 240);
        var toprak = h.oge('toprak', TARLA.x, TARLA.y - 40, 220);
        var bitki = null, gunler = null;
        return h.dizi([
          function () { return Promise.all([t.git(TARLA.x - 330, ZEMIN, 1600), k.git(TARLA.x - 600, ZEMIN, 1600)]); },
          function () {
            toprak.classList.add('gizli');
            bitki = h.oge('filiz', TARLA.x, TARLA.y - 90, 170, 'belir');
            t.poz('cicek');
            return h.kamera(1.4, TARLA.x - 120, 780, 900);
          },
          't_h3_n1',
          function () { return h.kamera(1, 960, 540, 700); },
          function () { k.poz('anlat'); },
          'k_h3_n2',
          function () {
            t.poz('sula');
            gunler = gunlerPanosu(h, 3);
            return sulama(h, gunler, 3, 7, 't_h3_n3', t, function (gun) {
              if (gun === 5) { bitki.remove(); bitki = h.oge('fidan', TARLA.x, TARLA.y - 160, 250, 'belir'); }
              if (gun === 7) { bitki.remove(); bitki = h.oge('cicek', TARLA.x, TARLA.y - 200, 280, 'belir'); Efekt.kutlama(); h.api.kutla(TARLA.x, TARLA.y - 300, 70); }
            });
          },
          function () { gunler.kaldir(); t.poz('cicek'); k.poz('sevinc'); return Promise.all([t.zipla(3, 70), k.zipla(3, 60)]); },
          't_h3_n4',
          function () { k.poz('anlat'); return buyumeSirasi(h, 'k_h3_o1'); },
          function () { t.poz('sevinc'); },
          't_h3_o2'
        ]).then(function () { return 'cicekne'; });
      },

      /* ——— Çiçeği ne yapalım? ——— */
      cicekne: function (h) {
        h.arka('arka-tohum');
        var t = h.aktor('tombis', 'cicek', TARLA.x - 380, ZEMIN, 300);
        h.aktor('kokce', 'selam', TARLA.x - 600, ZEMIN, 240);
        h.oge('cicek', TARLA.x, TARLA.y - 200, 280);
        return h.dizi([
          function () { t.poz('dusun'); },
          function () {
            return h.secim({
              baslik: 'Çiçeği ne yapalım?', soru: 't_h3_p1',
              a: { etiket: 'Koparıp hediye etsin', kim: 'kokce', resim: 'cicek', kucuk: true, git: 'kopar' },
              b: { etiket: 'Bahçede bıraksın', resim: 'cicek', kucuk: true, git: 'birak' }
            });
          }
        ]);
      },

      kopar: function (h) {
        h.arka('arka-tohum');
        var t = h.aktor('tombis', 'sevinc', TARLA.x - 380, ZEMIN, 300);
        var k = h.aktor('kokce', 'selam', TARLA.x - 650, ZEMIN, 240);
        var cicek = h.oge('cicek', TARLA.x, TARLA.y - 200, 280);
        return h.dizi([
          function () { return h.uc(cicek, k.x + 60, k.y - 260, 800, true); },
          function () { k.poz('cicek'); cicek.style.opacity = 0; return h.bekle(300); },
          'k_h3_q1',
          function () { t.poz('dusun'); return h.bekle(300); },
          function () { k.poz('selam'); cicek.style.opacity = 1; cicek.style.transform = ''; return h.uc(cicek, TARLA.x, TARLA.y - 200, 800); },
          function () { t.poz('sevinc'); },
          't_h3_q2',
          function () { k.poz('sevinc'); return k.zipla(2); }
        ]).then(function () { h.durum.kopardi = true; return 'cingoz'; });
      },

      birak: function (h) {
        h.arka('arka-tohum');
        var t = h.aktor('tombis', 'sevinc', TARLA.x - 380, ZEMIN, 300);
        var k = h.aktor('kokce', 'sevinc', TARLA.x - 600, ZEMIN, 240);
        h.oge('cicek', TARLA.x, TARLA.y - 200, 280);
        return h.dizi([
          function () { return k.zipla(2); },
          'k_h3_r1',
          function () { t.poz('cicek'); },
          't_h3_r2'
        ]).then(function () { return 'cingoz'; });
      },

      /* ——— Cingöz gelir ve Krista'ya koşar ——— */
      cingoz: function (h) {
        h.arka('arka-tohum');
        var t = h.aktor('tombis', 'sevinc', TARLA.x - 380, ZEMIN, 300);
        var k = h.aktor('kokce', 'sevinc', TARLA.x - 600, ZEMIN, 240);
        h.oge('cicek', TARLA.x, TARLA.y - 200, 280);
        var c = h.aktor('cingoz', 'uc', -400, 300, 260);
        return h.dizi([
          function () { Efekt.hisir(); return c.git(TARLA.x - 640, 480, 1500, 'uc'); },
          function () { c.poz('saskin'); t.poz('saskin'); k.poz('saskin'); return c.zipla(2, 40); },
          function () { c.poz('selam'); },
          'c_h3_s1',
          function () { t.poz('selam'); k.poz('selam'); },
          't_h3_s2',
          function () { c.poz('sevinc'); return c.zipla(3, 50); },
          'c_h3_s3',
          function () { c.poz('git'); c.bak(true); return c.git(2400, -200, 1100, 'uc'); },
          function () { c.sil(); t.poz('dusun'); k.poz('bekle'); }
        ]).then(function () { return 'kapanis'; });
      },

      /* ——— Kapanış: sohbet, rozet, şarkı, kanca ——— */
      kapanis: function (h) {
        h.arka('arka-tohum');
        var t = h.aktor('tombis', 'dusun', TARLA.x - 380, ZEMIN, 300);
        var k = h.aktor('kokce', 'bekle', TARLA.x - 600, ZEMIN, 240);
        h.oge('cicek', TARLA.x, TARLA.y - 200, 280);
        return h.dizi([
          function () { return Promise.all([t.git(760, ZEMIN, 1200), k.git(1100, ZEMIN, 1200)]); },
          function () { k.bak(false); t.poz('selam'); },
          't_h3_t1',
          function () { return h.sohbet('t_h3_t2', 120); },
          function () { return h.rozet('Sabır Tohumu', 't_h3_t3', 'tohum'); },
          function () {
            t.poz('sevinc'); k.poz('sevinc');
            return h.soyle('t_h3_t4').then(function () {
              var p = h.aktor('pirilti', 'sevinc', 420, ZEMIN, 200);
              return h.sarki('muzik_h3_sarki', [t, k, p]).then(function () { p.sil(); });
            });
          },
          function () { t.poz('dusun'); },
          't_h3_t5'
        ]).then(function () { return null; });
      }
    }
  });

  /* Su damlaları: sulama kabından toprağa */
  function damlalar(h, x, y, adet) {
    var n = adet || 6;
    for (var i = 0; i < n; i++) {
      (function (i) {
        var d = h.oge('damla', x - 60 + (i % 4) * 40, y - 40, 44, 'h-damla');
        d.style.animationDelay = (i * 90) + 'ms';
        h.api.zamanla(1100 + i * 90, function () { d.remove(); });
      })(i);
    }
  }

  /* Ekme sırası: kürek, tohum, su — sırayla dokun (3 resim karışık) */
  function ekmeSirasi(h, t, adim) {
    var SIRA = ['kurek', 'tohum', 'sulama'];
    var yerler = T.karistir([560, 960, 1360]);
    var ogeler = SIRA.map(function (r, i) { return h.oge(r, yerler[i], 330, 170, 'dokunulur belir h-kart'); });
    var beklenen = 0, yanlis = 0, konusma = Promise.resolve();
    h.api.talimat('k_h3_e1');
    h.api.ipucu(function () { if (beklenen < 3) ogeler[beklenen].classList.add('parla'); });
    return new Promise(function (coz) {
      ogeler.forEach(function (d, i) {
        h.api.dokun(d, function () {
          if (beklenen >= 3 || d.classList.contains('alindi')) return;
          if (i !== beklenen) { T.oynat(d, 'salla', 520); if (++yanlis >= 2) ogeler[beklenen].classList.add('parla'); h.api.tekrar(); return; }
          yanlis = 0;
          d.classList.remove('parla');
          d.classList.add('alindi');
          var n = ++beklenen;
          Efekt.pop();
          h.uc(d, 300 + n * 130, 150, 500, true);
          adim(n);
          konusma = konusma.then(function () { return h.api.say(n); });
          if (n === 3) {
            h.api.ipucu(null);
            T.sonTalimat(null);
            konusma.then(function () { Efekt.dogru(); return h.bekle(700); }).then(function () { ogeler.forEach(function (o) { o.remove(); }); coz(); });
          }
        });
      });
    });
  }

  /* Gün panosu: 7 daire, dolanlar yeşil */
  function gunlerPanosu(h, dolu) {
    var p = T.el('div', 'h-gunler belir', h.ui);
    var daireler = [];
    for (var i = 1; i <= 7; i++) {
      var d = T.el('div', 'gun' + (i <= (dolu || 0) ? ' dolu' : ''), p, String(i));
      daireler.push(d);
    }
    return {
      el: p,
      doldur: function (n) { daireler[n - 1].classList.add('dolu'); T.oynat(daireler[n - 1], 'sek', 450); },
      kaldir: function () { p.classList.add('git'); h.api.zamanla(400, function () { p.remove(); }); }
    };
  }

  /* Sulama: sulama kabına her dokunuş bir gün; güneş gökyüzünden geçer */
  function sulama(h, gunler, bas, son, talimat, t, her) {
    var kap = h.oge('sulama', t.x + 170, t.y - 330, 190, 'dokunulur belir parla');
    var gun = bas, mesgul = false, konusma = Promise.resolve();
    h.api.talimat(talimat);
    h.api.ipucu(function () { h.api.el(parseFloat(kap.style.left), parseFloat(kap.style.top)); });
    return new Promise(function (coz) {
      h.api.dokun(kap, function () {
        if (mesgul || gun >= son) return;
        mesgul = true;
        var n = ++gun;
        Efekt.pop();
        gunler.doldur(n);
        damlalar(h, TARLA.x, TARLA.y - 160);
        kap.style.transform = 'translate(-50%,-50%) rotate(-35deg)';
        h.api.zamanla(500, function () { kap.style.transform = ''; });
        // Bir gün geçer: güneş doğar, batar
        var g = h.oge('gunes', 200, 900, 150, 'h-gunes');
        h.tween(1300, function (z) {
          g.style.left = (200 + 1500 * z) + 'px';
          g.style.top = (900 - Math.sin(z * Math.PI) * 800) + 'px';
        }, T.kolay.dogrusal).then(function () { g.remove(); mesgul = false; });
        if (her) her(n);
        konusma = konusma.then(function () { return h.api.say(n); });
        if (n === son) {
          h.api.ipucu(null);
          T.sonTalimat(null);
          kap.classList.remove('parla');
          Promise.all([konusma, h.bekle(1400)]).then(function () { Efekt.dogru(); kap.remove(); return h.bekle(400); }).then(coz);
        }
      });
    });
  }

  /* Yeniden örtme: toprağa üç kez dokun */
  function ortme(h, toprak, tohum, talimat, kez) {
    var yer = h.oge('toprak', TARLA.x, TARLA.y - 40, 220, 'dokunulur h-soluk');
    var n = 0, konusma = Promise.resolve();
    h.api.talimat(talimat);
    h.api.ipucu(function () { h.api.el(TARLA.x, TARLA.y - 40); });
    return new Promise(function (coz) {
      h.api.dokun(yer, function () {
        if (n >= kez) return;
        n++;
        Efekt.pop();
        yer.style.opacity = (0.3 + n * 0.25).toFixed(2);
        h.toz(TARLA.x, TARLA.y - 40);
        var k = n;
        konusma = konusma.then(function () { return h.api.say(k); });
        if (n === kez) {
          h.api.ipucu(null);
          T.sonTalimat(null);
          konusma.then(function () { Efekt.dogru(); tohum.remove(); yer.remove(); toprak.classList.remove('gizli'); return h.bekle(500); }).then(coz);
        }
      });
    });
  }

  /* Salıncak: oturak ve ipler (arka planda yalnız çerçeve var) */
  function salincakKur(h) {
    return h.oge('salincak', SALINCAK.x, SALINCAK.y, 260, 'h-salincak');
  }

  /* Sırayla salıncak: sırası gelene dokun, o biner ve sallanır */
  function salincakSirasi(h, sira, salincak, talimat) {
    var n = 0, yanlis = 0, konusma = Promise.resolve();
    h.api.talimat(talimat);
    function isaretle() {
      sira.forEach(function (a) { a.el.classList.remove('h-dokunulur'); });
      if (n < sira.length) sira[n].el.classList.add('h-dokunulur');
    }
    isaretle();
    h.api.ipucu(function () { if (n < sira.length) h.api.el(sira[n].x, sira[n].y - 140); });
    return new Promise(function (coz) {
      sira.forEach(function (a) {
        h.api.dokun(a.el, function () {
          if (n >= sira.length) return;
          if (a !== sira[n]) { T.oynat(a.el, 'salla', 520); if (++yanlis >= 2) h.api.el(sira[n].x, sira[n].y - 140); h.api.tekrar(); return; }
          yanlis = 0;
          var k = ++n;
          Efekt.pop();
          isaretle();
          var eskiX = a.x, eskiY = a.y;
          konusma = konusma.then(function () { return h.api.say(k); });
          var son = k === sira.length;
          var bin = a.git(SALINCAK.x, SALINCAK.y + SALINCAK.L, 600, 'kos').then(function () {
            if (a.kim === 'tombis') { a.poz('salincak'); salincak.style.display = 'none'; }
            return h.tween(1500, function (t) {
              var ac = Math.sin(t * Math.PI * 3) * 18;
              salincak.style.transform = 'translate(-50%,0) rotate(' + ac.toFixed(1) + 'deg)';
              a.r = ac; a.x = SALINCAK.x + Math.sin(ac * Math.PI / 180) * SALINCAK.L; a.y = SALINCAK.y + SALINCAK.L - (1 - Math.cos(ac * Math.PI / 180)) * SALINCAK.L; a.ciz();
            }, T.kolay.dogrusal);
          }).then(function () {
            salincak.style.transform = '';
            a.r = 0; a.x = SALINCAK.x; a.y = SALINCAK.y + SALINCAK.L; a.ciz();
            if (son) return;
            if (a.kim === 'tombis') a.poz('yuru');
            // Sallananlar Kökçe'nin yanına, izlemeye geçer
            return a.git(250 + k * 130, ZEMIN + 20, 1100).then(function () { a.bak(true); });
          });
          if (son) Promise.all([konusma, bin]).then(function () { h.api.ipucu(null); T.sonTalimat(null); Efekt.dogru(); return h.bekle(400); }).then(coz);
          else bin.then(function () {
            // Sıradakiler bir adım ilerler
            sira.slice(k).forEach(function (b) { b.git(b.x + 170, b.y, 500); });
          });
        });
      });
    });
  }

  /* Küçükten büyüğe: tohum, filiz, fidan, çiçek */
  function buyumeSirasi(h, talimat) {
    var SIRA = ['tohum', 'filiz', 'fidan', 'cicek'];
    var yerler = T.karistir([420, 780, 1140, 1500]);
    var ogeler = SIRA.map(function (r, i) { return h.oge(r, yerler[i], 330, 160 + i * 40, 'dokunulur belir h-kart'); });
    var beklenen = 0, yanlis = 0, konusma = Promise.resolve();
    h.api.talimat(talimat);
    h.api.ipucu(function () { if (beklenen < 4) ogeler[beklenen].classList.add('parla'); });
    return new Promise(function (coz) {
      ogeler.forEach(function (d, i) {
        h.api.dokun(d, function () {
          if (beklenen >= 4 || d.classList.contains('alindi')) return;
          if (i !== beklenen) { T.oynat(d, 'salla', 520); if (++yanlis >= 2) ogeler[beklenen].classList.add('parla'); h.api.tekrar(); return; }
          yanlis = 0;
          d.classList.remove('parla');
          d.classList.add('alindi');
          var n = ++beklenen;
          Efekt.pop();
          h.uc(d, 360 + n * 220, 640, 500);
          konusma = konusma.then(function () { return h.api.say(n); });
          if (n === 4) {
            h.api.ipucu(null);
            T.sonTalimat(null);
            konusma.then(function () { Efekt.dogru(); h.api.kutla(960, 600, 50); return h.bekle(1400); }).then(function () { ogeler.forEach(function (o) { o.remove(); }); coz(); });
          }
        });
      });
    });
  }
})();
