/* 1. hafta — Tombiş Düştü! (değer: yardımlaşma)

   Tombiş Karınca Yuvası'ndaki şölene çilek götürürken düşer. Kökçe ona
   yardım eder ya da etmez; sınıf seçer. Beş seçim, dokuz farklı yol.
   Aralarda sayma (papatya, noktalı taş, karınca, çilek), dikkat (Karışkan'ı
   yakala, sallanan taş), hareket ve sohbet molaları. Sonunda kapı çalar:
   2. hafta "Tombiş'e Ziyaret" oradan başlar.

   Yaklaşık süre: 30-35 dakika (sohbetlerin uzunluğuna göre). */

(function () {
  var SESLER = [];
  for (var k in window.METIN) if (/^([tkp]_(h1|hk)_|muzik_h1_)/.test(k)) SESLER.push(k);

  var ZEMIN = 930;   // karakterlerin ayak hizası

  Hikaye.hafta({
    no: 1,
    ad: 'Tombiş Düştü!',
    deger: 'Yardımlaşma',
    ikon: 'hikaye/gorsel/t-agla.webp',
    sonraki: 'Tombiş\'e Ziyaret (paylaşma)',
    sesler: SESLER,
    gorseller: ['arka-ev-onu', 'arka-cicek-yolu', 'arka-dere-yolu', 'arka-cilek-tarlasi', 'arka-oda', 'gorsel/arka-cayir.webp',
      'sepet', 'papatya', 'tas', 'kizak', 'gorsel/cilek.webp', 'gorsel/yaprak.webp', 'gorsel/rol-isci.webp', 'gorsel/rol-kralice.webp',
      'gorsel/rol-ciftci.webp', 'gorsel/rol-terzi.webp', 'gorsel/rol-bekci.webp', 'gorsel/rol-bakici.webp'],
    baslangic: 'acilis',

    sahneler: {

      /* ——— Açılış: nasıl oynanır ——— */
      acilis: function (h) {
        h.arka('arka-ev-onu');
        var t = h.aktor('tombis', 'selam', 960, ZEMIN, 380);
        t.o = 0; t.ciz();
        return h.dizi([
          function () { return t.belir(600); },
          't_h1_a1',
          function () { t.poz('sevinc'); return t.zipla(2); },
          function () { t.poz('selam'); },
          't_h1_a2',
          't_h1_a3',
          function () { return h.baslik('1. Bölüm', 'Tombiş Düştü!', 't_h1_baslik'); }
        ]).then(function () { return 'sabah'; });
      },

      /* ——— Sabah: Tombiş evden çıkar, Kökçe gelir ——— */
      sabah: function (h) {
        h.arka('arka-ev-onu');
        var t = h.aktor('tombis', 'yuru', 340, 640, 190);
        var k = h.aktor('kokce', 'kos', 2150, ZEMIN, 240);
        return h.dizi([
          function () { return h.kamera(1.35, 520, 640, 10); },
          function () { return h.bekle(500); },
          function () { t.boy(250); return t.git(560, 760, 1600); },
          't_h1_b1',
          function () { return Promise.all([h.kamera(1, 960, 540, 1400), t.git(760, ZEMIN, 1200)]); },
          function () { t.boy(300); return k.git(1260, ZEMIN, 1300, 'kos'); },
          function () { k.poz('selam').bak(false); },
          'k_h1_b2',
          function () { t.poz('selam').bak(true); },
          't_h1_b3',
          function () { k.poz('sevinc'); return k.zipla(2); },
          'k_h1_b4',
          function () { t.poz('dusun'); k.poz('selam'); },
          't_h1_b5',
          function () {
            return h.secim({
              baslik: 'Hangi yoldan gidelim?', soru: 't_h1_b5',
              a: { etiket: 'Çiçekli yol', resim: 'arka-cicek-yolu', git: 'cicek' },
              b: { etiket: 'Dere yolu', resim: 'arka-dere-yolu', git: 'dere' }
            });
          }
        ]).then(function (id) { return id; });
      },

      /* ——— Çiçekli yol: 5 papatya say, Karışkan'ı yakala ——— */
      cicek: function (h) {
        h.durum.yol = 'cicek';
        h.arka('arka-cicek-yolu');
        var t = h.aktor('tombis', 'yuru', -200, ZEMIN, 300);
        var k = h.aktor('kokce', 'kos', -420, ZEMIN, 240);
        var sepet = h.oge('sepet', 1560, 880, 200);
        return h.dizi([
          function () { return Promise.all([t.git(520, ZEMIN, 1800), k.git(290, ZEMIN, 1900)]); },
          function () { t.poz('sevinc'); k.poz('sevinc'); },
          function () {
            return h.topla({
              // Papatyalar yolun üstünde durur: arka plandaki çiçeklerle karışmasın
              resim: 'papatya', boy: 150, parla: true, hedef: { x: 1560, y: 860 }, talimat: 't_h1_c1',
              noktalar: [{ x: 760, y: 840 }, { x: 910, y: 980 }, { x: 1060, y: 800 }, { x: 1210, y: 950 }, { x: 1350, y: 810 }]
            });
          },
          't_h1_c2',
          function () { t.poz('dusun'); k.poz('selam'); },
          function () {
            return h.yakala({
              talimat: 't_h1_c3', kez: 1, boy: 200,
              noktalar: [{ x: 1480, y: 560 }, { x: 330, y: 540 }, { x: 900, y: 600 }]
            });
          },
          't_h1_c4',
          function () {
            // Karışkan kıkırdar, yola bir kök çıkarır, uçup gider
            return h.kariskanGec(1100, 560, 2200, 300, 1500);
          },
          function () { sepet.remove(); return 'dusme'; }
        ]).then(function () { return 'dusme'; });
      },

      /* ——— Dere yolu: noktalı taşlar 1-5, sallanan taş ——— */
      dere: function (h) {
        h.durum.yol = 'dere';
        h.arka('arka-dere-yolu');
        var t = h.aktor('tombis', 'yuru', -200, ZEMIN, 280);
        var k = h.aktor('kokce', 'kos', -420, ZEMIN, 230);
        var TASLAR = [{ x: 420, y: 900 }, { x: 700, y: 830 }, { x: 980, y: 910 }, { x: 1260, y: 830 }, { x: 1540, y: 900 }];
        return h.dizi([
          function () { return Promise.all([t.git(180, ZEMIN, 1300), k.git(80, 960, 1400)]); },
          function () { t.poz('dusun'); },
          function () {
            return h.sira({
              noktalar: TASLAR, talimat: 't_h1_d1',
              git: function (n, p) {
                t.poz('yuru');
                var x1 = t.x, y1 = t.y;
                return h.tween(520, function (s) {
                  t.x = x1 + (p.x - x1) * s;
                  t.y = y1 + (p.y + 20 - y1) * s;
                  t.dy = -Math.sin(s * Math.PI) * 150;
                  t.bak(p.x >= x1);
                  t.ciz();
                }).then(function () { t.dy = 0; t.ciz(); });
              }
            });
          },
          function () { t.poz('sevinc'); return k.git(1300, ZEMIN, 1200, 'kos'); },
          't_h1_d2',
          function () { return sallananTas(h); },
          't_h1_d4',
          function () { return h.kariskanGec(1100, 600, 2200, 250, 1500); }
        ]).then(function () { return 'dusme'; });
      },

      /* ——— Düşme ——— */
      dusme: function (h) {
        var cicek = h.durum.yol === 'cicek';
        h.arka(cicek ? 'arka-cicek-yolu' : 'arka-dere-yolu');
        var tas = cicek ? null : h.aktor('tas', 'tas', 900, ZEMIN + 20, 150);
        var t = h.aktor('tombis', 'yuru', -150, ZEMIN, 300);
        var k = h.aktor('kokce', 'kos', 250, ZEMIN, 240);
        return h.dizi([
          function () { return Promise.all([k.git(1500, ZEMIN, 2400, 'kos'), t.git(820, ZEMIN, 2400)]); },
          function () { k.poz('selam').bak(false); },
          't_h1_e1',
          function () { return t.git(930, ZEMIN, 500); },
          function () {
            // Takıldı!
            t.poz('dus');
            Efekt.yanlis();
            return h.tween(420, function (s) { t.x = 930 + s * 120; t.r = s * 25; t.ciz(); });
          },
          function () {
            Efekt.davul();
            h.toz(1060, ZEMIN - 30);
            t.poz('agla'); t.r = 0; t.ciz();
            // Çilekler dağılır
            var noktalar = [{ x: 700, y: 820 }, { x: 1300, y: 760 }, { x: 1500, y: 900 }, { x: 560, y: 940 }];
            noktalar.forEach(function (p) {
              var c = h.oge('gorsel/cilek.webp', 1050, 800, 90);
              h.uc(c, p.x, p.y, 700);
              h.bekle(2400).then(function () { c.remove(); });
            });
            return h.kamera(1.4, 1060, 760, 900);
          },
          't_h1_e2',
          function () { return h.kamera(1, 960, 540, 900); },
          function () { k.poz('uzgun'); },
          'k_h1_e3',
          function () {
            return h.secim({
              baslik: 'Kökçe ne yapsın?', soru: 't_h1_e4',
              a: { etiket: 'Yardım etsin', kim: 'kokce', resim: 'yardim', kucuk: true, git: 'yardim' },
              b: { etiket: 'Şölene koşsun', kim: 'kokce', resim: 'kos', kucuk: true, git: 'kos' }
            });
          }
        ]).then(function (id) { if (tas) tas.sil(); return id; });
      },

      /* ——— A: Kökçe yardım eder ——— */
      yardim: function (h) {
        yolArka(h);
        var t = h.aktor('tombis', 'agla', 1060, ZEMIN, 300);
        var k = h.aktor('kokce', 'kos', 1650, ZEMIN, 240);
        return h.dizi([
          function () { return k.git(1290, ZEMIN, 900, 'kos'); },
          function () { k.poz('yardim').bak(false); },
          'k_h1_f1',
          function () {
            return h.hareket('t_h1_f2', 20, function (zaman) {
              k.dy = -Math.abs(Math.sin(zaman / 400)) * 20; k.ciz();
            });
          },
          function () { t.poz('topal'); Efekt.dogru(); return t.zipla(1, 50); },
          't_h1_f3',
          function () {
            return h.secim({
              baslik: 'Tombiş\'in dizine ne yapalım?', soru: 't_h1_f3',
              a: { etiket: 'Yaprakla saralım', resim: 'gorsel/yaprak.webp', kucuk: true, git: 'sar' },
              b: { etiket: 'Pırıltı\'yı çağıralım', kim: 'pirilti', resim: 'uc', kucuk: true, git: 'pirilti' }
            });
          }
        ]);
      },

      /* Yaprakla sar: 3 yaprak say */
      sar: function (h) {
        yolArka(h);
        var t = h.aktor('tombis', 'topal', 960, ZEMIN, 300);
        var k = h.aktor('kokce', 'yardim', 1250, ZEMIN, 240).bak(false);
        return h.dizi([
          'k_h1_g1',
          function () {
            return h.topla({
              resim: 'gorsel/yaprak.webp', boy: 170, hedef: { x: 940, y: 860 }, talimat: 'k_h1_g1',
              noktalar: [{ x: 360, y: 700 }, { x: 1600, y: 640 }, { x: 560, y: 900 }]
            });
          },
          function () { t.poz('sarili'); k.poz('sevinc'); return Promise.all([t.zipla(1, 40), k.zipla(2)]); },
          't_h1_g2'
        ]).then(function () { h.durum.pirilti = false; return 'topla'; });
      },

      /* Pırıltı'yı çağır: hep birlikte 3 kez bağır */
      pirilti: function (h) {
        yolArka(h);
        var t = h.aktor('tombis', 'topal', 960, ZEMIN, 300);
        var k = h.aktor('kokce', 'selam', 1250, ZEMIN, 240).bak(false);
        var p = h.aktor('pirilti', 'uc', 1750, 260, 60);
        return h.dizi([
          function () {
            return h.bagir('t_h1_h1', 'Pı-rıl-tı!', 3, function (i) {
              p.boy(60 + i * 60);
              p.zipla(1, 30);
            });
          },
          function () { return p.git(1500, 700, 1400, 'uc'); },
          function () { p.boy(230); return p.zipla(1, 40); },
          'p_h1_h2',
          function () {
            p.poz('saril');
            var y = h.oge('gorsel/yaprak.webp', 1500, 560, 150);
            return h.uc(y, 940, 860, 800, true).then(function () { y.remove(); });
          },
          function () { t.poz('sarili'); Efekt.kutlama(); h.api.kutla(960, 700, 40); return t.zipla(1, 40); },
          't_h1_h3'
        ]).then(function () { h.durum.pirilti = true; return 'topla'; });
      },

      /* ——— B: Kökçe şölene koşar ——— */
      kos: function (h) {
        h.arka('arka-cilek-tarlasi');
        var k = h.aktor('kokce', 'kos', -200, ZEMIN, 260);
        return h.dizi([
          function () { return k.git(960, ZEMIN, 1800, 'kos'); },
          function () { k.poz('selam'); return h.bekle(300); },
          't_h1_i1',
          function () { k.poz('uzgun'); return h.kamera(1.35, 960, 760, 1200); },
          'k_h1_i2',
          function () { return h.kamera(1, 960, 540, 800); },
          function () { return h.sohbet('t_h1_i3', 90); },
          function () {
            return h.secim({
              baslik: 'Kökçe ne yapsın?', soru: 't_h1_i4',
              a: { etiket: 'Geri dönüp özür dilesin', kim: 'kokce', resim: 'ozur', kucuk: true, git: 'ozur' },
              b: { etiket: 'Burada beklesin', kim: 'kokce', resim: 'uzgun', kucuk: true, git: 'karinca' }
            });
          }
        ]);
      },

      /* B1: geri döner, özür diler, birlikte kaldırırlar, yaprakla sarar */
      ozur: function (h) {
        yolArka(h);
        var t = h.aktor('tombis', 'agla', 1060, ZEMIN, 300);
        var k = h.aktor('kokce', 'kos', 2100, ZEMIN, 240);
        return h.dizi([
          function () { return k.git(1330, ZEMIN, 1400, 'kos'); },
          function () { k.poz('ozur').bak(false); },
          'k_h1_j1',
          function () { t.poz('selam'); },
          't_h1_j2',
          function () { k.poz('yardim'); },
          function () { return h.hareket('t_h1_f2', 20); },
          function () { t.poz('topal'); Efekt.dogru(); return t.zipla(1, 50); }
        ]).then(function () { return 'sar'; });
      },

      /* B2: karıncalar yardıma gelir (6 karınca say), Kökçe de döner */
      karinca: function (h) {
        yolArka(h);
        var t = h.aktor('tombis', 'agla', 700, ZEMIN, 300);
        var roller = ['rol-isci', 'rol-ciftci', 'rol-bekci', 'rol-terzi', 'rol-bakici', 'rol-isci'];
        var karincalar = roller.map(function (r, i) {
          var a = h.aktor('karinca' + i, 'gorsel/' + r + '.webp', 2100 + i * 160, ZEMIN - (i % 2) * 40, 150);
          return a;
        });
        var k = null;
        return h.dizi([
          function () {
            return Promise.all(karincalar.map(function (a, i) {
              return h.bekle(i * 150).then(function () { return a.git(1000 + i * 150, a.y, 1800); });
            }));
          },
          function () {
            return h.dokunSay({ talimat: 't_h1_k1', hedefler: karincalar });
          },
          function () { t.poz('topal'); karincalar.forEach(function (a) { a.zipla(1, 40); }); },
          't_h1_k2',
          function () { k = h.aktor('kokce', 'uzgun', -150, ZEMIN, 230); return k.git(300, ZEMIN, 1300); },
          function () { k.bak(true); },
          'k_h1_k3',
          function () { return k.git(480, ZEMIN, 700, 'kos'); },
          function () { k.poz('ozur'); },
          'k_h1_k4',
          function () { t.poz('selam').bak(false); },
          't_h1_j2',
          function () { k.poz('sevinc'); return k.zipla(2); }
        ]).then(function () { h.durum.karinca = true; return 'topla'; });
      },

      /* ——— Buluşma: 8 çilek say, 9.'yu Karışkan'da bul ——— */
      topla: function (h) {
        yolArka(h);
        var t = h.aktor('tombis', h.durum.karinca ? 'topal' : 'sarili', 840, ZEMIN, 300);
        var k = h.aktor('kokce', 'selam', 1100, ZEMIN, 230).bak(false);
        var yardimcilar = [];
        if (h.durum.pirilti) yardimcilar.push(h.aktor('pirilti', 'uc', 1350, 600, 200));
        if (h.durum.karinca) ['rol-isci', 'rol-ciftci', 'rol-bekci'].forEach(function (r, i) {
          yardimcilar.push(h.aktor('karinca' + i, 'gorsel/' + r + '.webp', 1350 + i * 170, ZEMIN, 140));
        });
        var sepetYeri = { x: 960, y: 1000 };
        var sepet = h.oge('sepet', sepetYeri.x, sepetYeri.y - 40, 190);
        return h.dizi([
          function () {
            return h.topla({
              resim: 'gorsel/cilek.webp', boy: 120, hedef: sepetYeri, talimat: 't_h1_l1',
              noktalar: [{ x: 230, y: 620 }, { x: 520, y: 520 }, { x: 420, y: 860 }, { x: 760, y: 600 },
                         { x: 1250, y: 560 }, { x: 1560, y: 660 }, { x: 1760, y: 880 }, { x: 1480, y: 950 }],
              her: function () { T.oynat(sepet, 'sek', 400); }
            });
          },
          function () { k.poz('sevinc'); return k.zipla(1); },
          function () {
            return h.yakala({
              talimat: 't_h1_l2', kez: 3, boy: 190, sure: 2400,
              noktalar: [{ x: 1700, y: 560 }, { x: 250, y: 600 }, { x: 1250, y: 470 }, { x: 600, y: 520 }]
            });
          },
          function () {
            // Karışkan mahcup, çileği geri getirir
            var ka = h.aktor('kariskan', 'uzgun', 2150, 700, 200);
            return ka.git(1500, 820, 1500, 'uc').then(function () {
              var c = h.oge('gorsel/cilek.webp', 1480, 700, 110);
              return h.uc(c, sepetYeri.x, sepetYeri.y, 700, true).then(function () { c.remove(); T.oynat(sepet, 'sek', 400); });
            });
          },
          't_h1_l3',
          function () { var ka = h.kisi('kariskan'); return ka.git(2200, 400, 1300, 'uc'); },
          function () { t.poz('dusun'); },
          function () {
            return h.secim({
              baslik: 'Yuvaya nasıl gidelim?', soru: 't_h1_l4',
              a: { etiket: 'Koluna girelim', kim: 'tombis', resim: 'topal', kucuk: true, git: 'kol' },
              b: { etiket: 'Yaprak kızakla', kim: 'tombis', resim: 'kizak', kucuk: true, git: 'kizak' }
            });
          }
        ]);
      },

      /* Koluna girip yavaş yavaş (hareket molası) */
      kol: function (h) {
        h.arka('gorsel/arka-cayir.webp');
        var t = h.aktor('tombis', 'topal', 200, ZEMIN, 280);
        var k = h.aktor('kokce', 'yardim', 20, ZEMIN, 220);
        return h.dizi([
          function () {
            return h.hareket('t_h1_m1', 40, function (zaman) {
              var x = 200 + ((zaman / 40) % 1100);
              t.x = x; k.x = x - 190;
              t.dy = -Math.abs(Math.sin(zaman / 500)) * 12; k.dy = -Math.abs(Math.sin(zaman / 500 + 1)) * 12;
              t.r = Math.sin(zaman / 500) * 4;
              t.ciz(); k.ciz();
            });
          },
          function () { return Promise.all([t.git(1250, ZEMIN, 1500), k.git(1050, ZEMIN, 1500)]); },
          function () { t.poz('sarili'); k.poz('sevinc'); },
          't_h1_m2'
        ]).then(function () { h.durum.gidis = 'kol'; return 'yuva'; });
      },

      /* Yaprak kızakla (hareket molası: ipi çek) */
      kizak: function (h) {
        h.arka('gorsel/arka-cayir.webp');
        var t = h.aktor('tombis', 'kizak', 200, ZEMIN, 300);
        var k = h.aktor('kokce', 'kos', 480, ZEMIN, 220);
        return h.dizi([
          function () {
            return h.hareket('t_h1_n1', 35, function (zaman) {
              var x = 200 + ((zaman / 30) % 1000);
              t.x = x; k.x = x + 290;
              k.r = Math.sin(zaman / 180) * 6;
              t.dy = -Math.abs(Math.sin(zaman / 250)) * 8;
              t.ciz(); k.ciz();
            });
          },
          function () { return Promise.all([t.git(1100, ZEMIN, 1300), k.git(1380, ZEMIN, 1300)]); },
          function () { k.poz('sevinc'); return k.zipla(2); },
          't_h1_n2'
        ]).then(function () { h.durum.gidis = 'kizak'; return 'yuva'; });
      },

      /* ——— Karınca Yuvası: nasıl teşekkür edelim? ——— */
      yuva: function (h) {
        h.arka('gorsel/arka-cayir.webp');
        var t = h.aktor('tombis', 'sarili', 760, ZEMIN, 300);
        var k = h.aktor('kokce', 'sevinc', 520, ZEMIN, 230);
        var karincalar = ['rol-kralice', 'rol-isci', 'rol-ciftci', 'rol-bakici'].map(function (r, i) {
          return h.aktor('karinca' + i, 'gorsel/' + r + '.webp', 1150 + i * 180, ZEMIN - (i % 2) * 30, i === 0 ? 190 : 150);
        });
        var sepet = h.oge('sepet', 960, 950, 170);
        return h.dizi([
          function () { karincalar.forEach(function (a, i) { h.bekle(i * 120).then(function () { a.zipla(2, 60); }); }); Efekt.kutlama(); },
          't_h1_o1',
          function () {
            return h.secim({
              baslik: 'Nasıl teşekkür edelim?', soru: 't_h1_o2',
              a: { etiket: 'Kocaman sarılalım', resim: 'p-saril', kucuk: true, git: 'sarilma' },
              b: { etiket: 'Çilek ikram edelim', resim: 'sepet', kucuk: true, git: 'ikram' }
            });
          }
        ]).then(function (id) { h.durum.sepet = sepet; return id; });
      },

      sarilma: function (h) {
        h.arka('gorsel/arka-cayir.webp');
        var t = h.aktor('tombis', 'sevinc', 860, ZEMIN, 300);
        var k = h.aktor('kokce', 'sevinc', 620, ZEMIN, 230);
        return h.dizi([
          function () {
            return h.hareket('t_h1_p1', 15, function (zaman) {
              var s = 1 + Math.sin(zaman / 300) * 0.04;
              t.o = s; k.o = s; t.ciz(); k.ciz();
            });
          },
          function () { h.api.kutla(760, 600, 60); Efekt.kutlama(); return h.bekle(800); }
        ]).then(function () { return 'kapanis'; });
      },

      /* Çilek ikram: arkadaşlara dokun, birer çilek (bire bir eşleme) */
      ikram: function (h) {
        h.arka('gorsel/arka-cayir.webp');
        var t = h.aktor('tombis', 'sevinc', 760, ZEMIN, 280);
        var sepet = h.oge('sepet', 760, 700, 150);
        var dostlar = [h.aktor('kokce', 'selam', 330, ZEMIN, 220)];
        ['rol-kralice', 'rol-isci', 'rol-ciftci', 'rol-bakici'].forEach(function (r, i) {
          dostlar.push(h.aktor('karinca' + i, 'gorsel/' + r + '.webp', 1150 + i * 180, ZEMIN, i === 0 ? 180 : 150));
        });
        return h.dizi([
          function () {
            return h.dokunSay({
              talimat: 't_h1_p2', hedefler: dostlar,
              her: function (d) {
                var c = h.oge('gorsel/cilek.webp', 760, 680, 90);
                h.uc(c, d.x, d.y - 200, 650, true).then(function () { c.remove(); });
              }
            });
          },
          't_h1_p3'
        ]).then(function () { sepet.remove(); return 'kapanis'; });
      },

      /* ——— Kapanış: sohbet, rozet, şarkı, merak kancası ——— */
      kapanis: function (h) {
        h.arka('arka-oda');
        var t = h.aktor('tombis', 'sarili', 420, 820, 260);
        return h.dizi([
          't_h1_r1',
          function () { return h.sohbet('t_h1_r2', 120); },
          function () { return h.rozet('Yardım Kalbi', 't_h1_r3'); },
          't_h1_r4',
          function () {
            var k = h.aktor('kokce', 'sevinc', 1100, ZEMIN, 220);
            var p = h.aktor('pirilti', 'uc', 1450, 700, 180);
            t.poz('sevinc');
            return h.sarki('muzik_h1_sarki', [t, k, p]).then(function () { k.sil(); p.sil(); });
          },
          function () { t.poz('sarili'); },
          't_h1_r5',
          function () { h.tik(); return h.bekle(700); },
          function () { h.tik(); t.poz('dusun'); return h.kamera(1.5, 1700, 640, 1200); },
          't_h1_r6',
          function () { return h.kamera(1, 960, 540, 800); }
        ]).then(function () { return null; });
      }
    }
  });

  /* Tombiş'in düştüğü yolun arka planı */
  function yolArka(h) { h.arka(h.durum.yol === 'dere' ? 'arka-dere-yolu' : 'arka-cicek-yolu'); }

  /* Dere yolunda: dört taş, biri sallanıyor; altından Karışkan çıkar */
  function sallananTas(h) {
    var yerler = [{ x: 420, y: 700 }, { x: 800, y: 720 }, { x: 1180, y: 700 }, { x: 1560, y: 720 }];
    var dogru = Math.floor(Math.random() * 4);
    var taslar = yerler.map(function (p, i) {
      var d = h.oge('tas', p.x, p.y, 210, 'dokunulur' + (i === dogru ? ' h-sallan' : ''));
      return d;
    });
    h.api.talimat('t_h1_d3');
    h.soyle('t_h1_d3');
    h.api.ipucu(function () { taslar[dogru].classList.add('parla'); });
    return new Promise(function (coz) {
      var bitti = false;
      taslar.forEach(function (d, i) {
        h.api.dokun(d, function () {
          if (bitti) return;
          if (i !== dogru) { T.oynat(d, 'salla', 520); h.api.tekrar(); return; }
          bitti = true;
          h.api.ipucu(null);
          T.sonTalimat(null);
          d.classList.remove('h-sallan', 'parla');
          Efekt.hisir();
          var ka = h.aktor('kariskan', 'ufle', yerler[i].x, yerler[i].y + 60, 200);
          ka.o = 0.3; ka.ciz();
          h.tween(500, function (s) { ka.o = 0.3 + s * 0.7; ka.dy = -s * 120; ka.ciz(); }, T.kolay.zipla).then(function () {
            h.api.kutla(yerler[i].x, yerler[i].y - 60, 30);
            taslar.forEach(function (x) { x.remove(); });
            ka.sil();
            coz();
          });
        });
      });
    });
  }
})();
