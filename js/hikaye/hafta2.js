/* 2. hafta — Tombiş'e Ziyaret (değer: paylaşma)

   Kapı çalar: Kökçe, Pırıltı ve karıncalar hediyelerle gelir. Tombiş
   pastayı paylaşır ya da kendine saklar; bir topla üç arkadaş sırayla ya
   da birlikte oynar; sınıf seçer. Aralarda sayma (kapı vuruşu, dilimler,
   paslar), dikkat (gölge eşleme, eksik oyuncak), örüntü (renkler),
   hareket ve sohbet molaları. Sonunda Kökçe bir tohum verir: 3. hafta
   "Kökçe'nin Tohumu" oradan başlar.

   Yaklaşık süre: 30-35 dakika. */

(function () {
  var SESLER = [];
  for (var k in window.METIN) if (/^([tkp]_h2_|muzik_h2_)/.test(k)) SESLER.push(k);

  var ZEMIN = 930;
  var ANT = ['rol-isci', 'rol-kralice', 'rol-ciftci'];

  /* Üç karınca yan yana, ekrana sığacak şekilde */
  function karincalar(h, x0, arasi, boy, sag) {
    return ANT.map(function (r, i) {
      return h.aktor('karinca' + i, 'gorsel/' + r + '.webp', x0 + i * arasi, ZEMIN - (i % 2) * 30, boy).bak(!!sag);
    });
  }

  Hikaye.hafta({
    no: 2,
    ad: 'Tombiş\'e Ziyaret',
    deger: 'Paylaşma',
    ikon: 'hikaye/gorsel/pasta.webp',
    sonraki: 'Kökçe\'nin Tohumu (sabır ve sıra beklemek)',
    sesler: SESLER,
    gorseller: ['arka-oda', 'arka-bahce', 'pasta', 'dilim', 'top', 'ayi', 'kup', 'araba', 'sepet',
      'gorsel/rol-isci.webp', 'gorsel/rol-kralice.webp', 'gorsel/rol-ciftci.webp', 'gorsel/kariskan-ufle.webp'],
    baslangic: 'acilis',

    sahneler: {

      /* ——— Açılış: geçen haftayı hatırla ——— */
      acilis: function (h) {
        h.arka('arka-oda');
        var t = h.aktor('tombis', 'sarili', 420, 820, 260);
        t.o = 0; t.ciz();
        return h.dizi([
          function () { return t.belir(600); },
          't_h2_a1',
          function () { t.poz('dusun'); },
          't_h2_a2',
          function () { return h.baslik('2. Bölüm', 'Tombiş\'e Ziyaret', 't_h2_baslik'); }
        ]).then(function () { return 'kapi'; });
      },

      /* ——— Kapı: vuruşları say, gölgeyi bul ——— */
      kapi: function (h) {
        h.arka('arka-oda');
        var t = h.aktor('tombis', 'sarili', 420, 820, 260);
        return h.dizi([
          't_h2_b1',
          function () { return vurus(h, 3); },
          function () { t.poz('dusun'); },
          function () { return golge(h); },
          't_h2_b3',
          function () {
            return h.secim({
              baslik: 'Kapıyı nasıl açalım?', soru: 't_h2_b4',
              a: { etiket: 'Önce "Kim o?" diyelim', kim: 'tombis', resim: 'dusun', kucuk: true, git: 'kimo' },
              b: { etiket: 'Hemen açalım', kim: 'tombis', resim: 'saskin', kucuk: true, git: 'hemen' }
            });
          }
        ]);
      },

      /* A: önce sor */
      kimo: function (h) {
        h.arka('arka-oda');
        var t = h.aktor('tombis', 'sarili', 700, ZEMIN, 300);
        return h.dizi([
          function () { return h.bagir('t_h2_c1', 'Kim o?', 1); },
          function () { h.tik(); return h.bekle(400); },
          'k_h2_c2',
          function () { t.poz('sevinc'); return t.zipla(2); },
          't_h2_c3'
        ]).then(function () { return 'misafir'; });
      },

      /* B: hemen aç, Karışkan "böö" */
      hemen: function (h) {
        h.arka('arka-oda');
        var t = h.aktor('tombis', 'sarili', 700, ZEMIN, 300);
        var ka = null, k = null;
        return h.dizi([
          function () { h.tik(); return h.bekle(500); },
          function () {
            ka = h.aktor('kariskan', 'ufle', 2200, 700, 240);
            Efekt.hisir();
            return ka.git(1150, 720, 700, 'uc');
          },
          function () { t.poz('saskin'); Efekt.yanlis(); return Promise.all([t.zipla(2, 60), ka.zipla(2, 40)]); },
          't_h2_d1',
          function () { return ka.git(2300, 300, 1100, 'uc'); },
          function () { ka.sil(); k = h.aktor('kokce', 'selam', 2200, ZEMIN, 240); return k.git(1250, ZEMIN, 1300); },
          function () { k.bak(false); t.poz('sevinc'); },
          'k_h2_d2'
        ]).then(function () { return 'misafir'; });
      },

      /* ——— Misafirler ve hediyeler ——— */
      misafir: function (h) {
        h.arka('arka-oda');
        var t = h.aktor('tombis', 'sarili', 620, ZEMIN, 300);
        var k = h.aktor('kokce', 'pasta', 2200, ZEMIN, 250);
        var p = h.aktor('pirilti', 'top', 2400, ZEMIN, 200);
        var antlar = karincalar(h, 2600, 160, 130, true);
        var pasta = null;
        return h.dizi([
          function () {
            return Promise.all([k.git(1100, ZEMIN, 1600), p.git(1420, ZEMIN, 1700)].concat(antlar.map(function (a, i) {
              return a.git(1620 + i * 140, a.y, 1800 + i * 100);
            })));
          },
          function () { k.bak(false); p.bak(false); antlar.forEach(function (a) { a.bak(false); }); },
          'k_h2_e1',
          function () {
            // Pasta masaya konur
            pasta = h.oge('pasta', 1100, 780, 220);
            k.poz('selam');
            return h.uc(pasta, 860, 880, 800);
          },
          'p_h2_e2',
          function () { t.poz('sevinc'); return t.zipla(2); },
          't_h2_e3',
          function () { t.poz('dusun'); },
          function () {
            return h.secim({
              baslik: 'Pastayı ne yapalım?', soru: 't_h2_e4',
              a: { etiket: 'Herkesle paylaşsın', resim: 'dilim', kucuk: true, git: 'paylas' },
              b: { etiket: 'Kendine saklasın', kim: 'tombis', resim: 'pasta', kucuk: true, git: 'sakla' }
            });
          }
        ]);
      },

      /* ——— Paylaş: herkese bir dilim (bire bir eşleme, 6'ya kadar say) ——— */
      paylas: function (h) {
        h.arka('arka-oda');
        var t = h.aktor('tombis', 'sevinc', 480, ZEMIN, 300);
        var k = h.aktor('kokce', 'selam', 900, ZEMIN, 240).bak(false);
        var p = h.aktor('pirilti', 'sevinc', 1170, ZEMIN, 200).bak(false);
        var antlar = karincalar(h, 1420, 140, 130);
        var pasta = h.oge('pasta', 700, 890, 200);
        return h.dizi([
          function () {
            return h.dokunSay({
              talimat: 't_h2_f1', hedefler: [k, p, antlar[0], antlar[1], antlar[2], t],
              her: function (d) {
                var c = h.oge('dilim', 700, 860, 110);
                h.uc(c, d.x, d.y - 230, 650, true).then(function () { c.remove(); });
                if (d.poz && d.kim === 'tombis') d.poz('yalniz');
              }
            });
          },
          function () { t.poz('sevinc'); Efekt.kutlama(); h.api.kutla(960, 600, 60); return Promise.all([t.zipla(2), k.zipla(2), p.zipla(2)]); },
          't_h2_f2'
        ]).then(function () { pasta.remove(); return 'top'; });
      },

      /* ——— Sakla: pasta benim! ——— */
      sakla: function (h) {
        h.arka('arka-oda');
        var t = h.aktor('tombis', 'pasta', 620, ZEMIN, 300);
        var k = h.aktor('kokce', 'selam', 1100, ZEMIN, 240).bak(false);
        var p = h.aktor('pirilti', 'sevinc', 1420, ZEMIN, 200).bak(false);
        var antlar = karincalar(h, 1620, 140, 130);
        return h.dizi([
          't_h2_g1',
          function () { return t.git(300, ZEMIN, 1100); },
          function () { t.bak(true); k.poz('uzgun'); p.poz('uzgun'); },
          'k_h2_g2',
          function () { t.poz('yalniz'); return h.kamera(1.4, 420, 760, 1000); },
          't_h2_g3',
          function () { return h.kamera(1, 960, 540, 800); },
          function () { return h.sohbet('t_h2_g4', 90); },
          function () {
            return h.secim({
              baslik: 'Tombiş ne yapsın?', soru: 't_h2_g5',
              a: { etiket: 'Özür dileyip paylaşsın', resim: 'dilim', kucuk: true, git: 'ozur' },
              b: { etiket: 'Tek başına yesin', kim: 'tombis', resim: 'yalniz', kucuk: true, git: 'yalniz' }
            });
          }
        ]);
      },

      /* Özür diler */
      ozur: function (h) {
        h.arka('arka-oda');
        var t = h.aktor('tombis', 'dusun', 300, ZEMIN, 300);
        var k = h.aktor('kokce', 'uzgun', 1100, ZEMIN, 240).bak(false);
        var p = h.aktor('pirilti', 'uzgun', 1420, ZEMIN, 200).bak(false);
        karincalar(h, 1620, 140, 130);
        return h.dizi([
          function () { return t.git(700, ZEMIN, 1000); },
          function () { t.poz('selam'); },
          't_h2_h1',
          function () { k.poz('sevinc'); p.poz('sevinc'); return Promise.all([k.zipla(2), p.zipla(2)]); },
          'k_h2_h2'
        ]).then(function () { h.durum.ozur = true; return 'paylas'; });
      },

      /* Tek başına: arkadaşlar gider, Tombiş onları geri çağırır */
      yalniz: function (h) {
        h.arka('arka-oda');
        var t = h.aktor('tombis', 'yalniz', 380, ZEMIN, 300);
        var k = h.aktor('kokce', 'uzgun', 1100, ZEMIN, 240);
        var p = h.aktor('pirilti', 'uzgun', 1420, ZEMIN, 200);
        var antlar = karincalar(h, 1620, 140, 130, true);
        var dilim = h.oge('dilim', 560, 900, 150);
        var herkes = [k, p].concat(antlar);
        return h.dizi([
          function () { return Promise.all(herkes.map(function (a, i) { return a.git(2300 + i * 100, a.y, 1800); })); },
          function () { return h.kamera(1.35, 500, 760, 1000); },
          't_h2_i1',
          function () { Efekt.kutlama(); return h.bekle(600); },
          function () { t.poz('dusun'); return h.kamera(1, 960, 540, 800); },
          't_h2_i2',
          function () {
            return h.bagir('t_h2_i3', 'Arkadaşlar!', 3, function (i) {
              herkes.forEach(function (a, j) { a.git(2300 + j * 100 - i * 400, a.y, 500); });
            });
          },
          function () { return Promise.all(herkes.map(function (a, j) { return a.git(1050 + j * 160, a.y, 900); })); },
          function () { herkes.forEach(function (a) { a.bak(false); }); t.poz('selam'); return t.git(700, ZEMIN, 800); },
          't_h2_h1',
          function () { k.poz('sevinc'); p.poz('sevinc'); return Promise.all([k.zipla(2), p.zipla(2)]); },
          'k_h2_h2'
        ]).then(function () { dilim.remove(); h.durum.ozur = true; return 'paylas'; });
      },

      /* ——— Bahçe: bir top, üç arkadaş ——— */
      top: function (h) {
        h.arka('arka-bahce');
        var t = h.aktor('tombis', 'sarili', 640, ZEMIN, 300);
        var k = h.aktor('kokce', 'sevinc', 1000, ZEMIN, 240).bak(false);
        var p = h.aktor('pirilti', 'top', 1350, ZEMIN, 210).bak(false);
        return h.dizi([
          'p_h2_j1',
          function () { return k.zipla(3, 70); },
          'k_h2_j2',
          function () { t.poz('dusun'); },
          function () {
            return h.secim({
              baslik: 'Topla nasıl oynayalım?', soru: 't_h2_j3',
              a: { etiket: 'Sırayla oynayalım', kim: 'pirilti', resim: 'top', kucuk: true, git: 'sira' },
              b: { etiket: 'Birlikte oyun kuralım', kim: 'kokce', resim: 'top', kucuk: true, git: 'birlikte' }
            });
          }
        ]);
      },

      /* Sırayla: sıra kimde? (örüntü: P, K, T, P, K, T) */
      sira: function (h) {
        h.arka('arka-bahce');
        var t = h.aktor('tombis', 'sarili', 480, ZEMIN, 300);
        var k = h.aktor('kokce', 'sevinc', 960, ZEMIN, 240);
        var p = h.aktor('pirilti', 'sevinc', 1440, ZEMIN, 210);
        var topu = h.oge('top', 1440, 760, 130);
        return h.dizi([
          function () { return siraOyunu(h, [p, k, t, p, k, t], topu, 't_h2_k1'); },
          't_h2_k2',
          function () {
            return h.hareket('t_h2_k3', 40, function (z) {
              var kim = Math.floor(z / 2500) % 3;
              [p, k, t].forEach(function (a, i) { a.dy = i === kim ? -Math.abs(Math.sin(z / 200)) * 60 : 0; a.ciz(); });
            });
          }
        ]).then(function () { topu.remove(); h.durum.oyun = 'sira'; return 'oyuncak'; });
      },

      /* Birlikte: pas oyunu, 6 pas */
      birlikte: function (h) {
        h.arka('arka-bahce');
        var t = h.aktor('tombis', 'sarili', 480, ZEMIN, 300);
        var k = h.aktor('kokce', 'sevinc', 960, ZEMIN, 240);
        var p = h.aktor('pirilti', 'sevinc', 1440, ZEMIN, 210);
        var topu = h.oge('top', 480, 760, 130);
        return h.dizi([
          function () { return pasOyunu(h, [t, k, p], topu, 6, 't_h2_l1'); },
          't_h2_l2',
          function () {
            return h.hareket('t_h2_l3', 30, function (z) {
              var i = Math.floor(z / 700) % 3;
              [t, k, p].forEach(function (a, j) { a.dy = j === i ? -40 : 0; a.ciz(); });
              topu.style.left = [480, 960, 1440][i] + 'px';
            });
          }
        ]).then(function () { topu.remove(); h.durum.oyun = 'birlikte'; return 'oyuncak'; });
      },

      /* ——— Eksik oyuncak (dikkat) ——— */
      oyuncak: function (h) {
        h.arka('arka-oda');
        var t = h.aktor('tombis', 'sarili', 380, ZEMIN, 280);
        return h.dizi([
          function () { return eksikOyuncak(h); },
          function () { t.poz('dusun'); },
          't_h2_m3'
        ]).then(function () { return 'tesekkur'; });
      },

      /* ——— Teşekkür: resim mi, şarkı mı? ——— */
      tesekkur: function (h) {
        h.arka('arka-oda');
        var t = h.aktor('tombis', 'dusun', 620, ZEMIN, 300);
        h.aktor('kokce', 'selam', 1050, ZEMIN, 240).bak(false);
        h.aktor('pirilti', 'sevinc', 1350, ZEMIN, 200).bak(false);
        karincalar(h, 1620, 140, 130);
        return h.dizi([
          function () {
            return h.secim({
              baslik: 'Tombiş nasıl teşekkür etsin?', soru: 't_h2_n1',
              a: { etiket: 'Resim çizsin', kim: 'tombis', resim: 'boya', kucuk: true, git: 'resim' },
              b: { etiket: 'Şarkı söylesin', kim: 'pirilti', resim: 'sevinc', kucuk: true, git: 'sarki' }
            });
          }
        ]);
      },

      /* Resim: renk örüntüsü */
      resim: function (h) {
        h.arka('arka-oda');
        var t = h.aktor('tombis', 'boya', 420, ZEMIN, 300);
        var k = null;
        return h.dizi([
          function () { return oruntu(h); },
          function () { t.poz('sevinc'); return t.zipla(2); },
          't_h2_o2',
          function () { k = h.aktor('kokce', 'sevinc', 2200, ZEMIN, 240); return k.git(1500, ZEMIN, 1000, 'kos'); },
          function () { k.bak(false); },
          'k_h2_o3'
        ]).then(function () { h.durum.sarki = false; return 'kapanis'; });
      },

      /* Şarkı */
      sarki: function (h) {
        h.arka('arka-oda');
        var t = h.aktor('tombis', 'sevinc', 640, ZEMIN, 300);
        var k = h.aktor('kokce', 'sevinc', 1000, ZEMIN, 240);
        var p = h.aktor('pirilti', 'sevinc', 1350, ZEMIN, 210);
        return h.dizi([
          't_h2_p1',
          function () { return h.sarki('muzik_h2_sarki', [t, k, p]); },
          'p_h2_p2'
        ]).then(function () { h.durum.sarki = true; return 'kapanis'; });
      },

      /* ——— Kapanış: tohum, sohbet, rozet, kanca ——— */
      kapanis: function (h) {
        h.arka('arka-oda');
        var t = h.aktor('tombis', 'sarili', 620, ZEMIN, 300);
        var k = h.aktor('kokce', 'tohum', 1050, ZEMIN, 240).bak(false);
        return h.dizi([
          't_h2_r1',
          'k_h2_r2',
          function () { t.poz('tohum'); return h.kamera(1.35, 760, 760, 900); },
          't_h2_r3',
          function () { return h.kamera(1, 960, 540, 700); },
          function () { k.poz('selam'); return k.git(2300, ZEMIN, 1500); },
          function () { k.sil(); t.poz('dusun'); },
          't_h2_r4',
          function () { return h.sohbet('t_h2_r5', 120); },
          function () { return h.rozet('Paylaşma Yıldızı', 't_h2_r6', 'yildiz'); },
          function () {
            if (h.durum.sarki) return;
            return h.soyle('t_h2_r7').then(function () {
              var k2 = h.aktor('kokce', 'sevinc', 1050, ZEMIN, 240);
              var p2 = h.aktor('pirilti', 'sevinc', 1400, ZEMIN, 200);
              t.poz('sevinc');
              return h.sarki('muzik_h2_sarki', [t, k2, p2]).then(function () { k2.sil(); p2.sil(); });
            });
          },
          function () { t.poz('tohum'); },
          't_h2_r8'
        ]).then(function () { return null; });
      }
    }
  });

  /* Kapı vuruşları: her vuruşta "Tak!" balonu ve sayı */
  function vurus(h, kez) {
    var i = 0;
    function bir() {
      if (i >= kez) return h.bekle(300);
      i++;
      h.tik();
      var b = T.el('div', 'h-tak', h.ui, 'Tak!');
      b.style.left = (1500 + (i - 2) * 60) + 'px';
      b.style.top = (520 - i * 30) + 'px';
      return h.api.say(i).then(function () { b.classList.add('git'); return h.bekle(400); }).then(function () { b.remove(); return bir(); });
    }
    return bir();
  }

  /* Penceredeki üç gölge: hangisi Kökçe? */
  function golge(h) {
    var kisiler = T.karistir([
      { ad: 'kokce', resim: 'k-selam' },
      { ad: 'pirilti', resim: 'p-uc' },
      { ad: 'kariskan', resim: 'gorsel/kariskan-ufle.webp' }
    ]);
    var golgeler = kisiler.map(function (k, i) {
      return h.oge(k.resim, 700 + i * 380, 470, 220, 'dokunulur h-golge belir');
    });
    h.api.talimat('t_h2_b2');
    var dogru = -1;
    kisiler.forEach(function (k, i) { if (k.ad === 'kokce') dogru = i; });
    h.api.ipucu(function () { golgeler[dogru].classList.add('parla'); });
    return new Promise(function (coz) {
      var bitti = false;
      golgeler.forEach(function (d, i) {
        h.api.dokun(d, function () {
          if (bitti) return;
          if (i !== dogru) { T.oynat(d, 'salla', 520); h.api.tekrar(); return; }
          bitti = true;
          h.api.ipucu(null);
          T.sonTalimat(null);
          Efekt.dogru();
          golgeler.forEach(function (g) { g.classList.remove('h-golge', 'parla'); });
          h.api.kutla(700 + i * 380, 470, 40);
          h.bekle(1600).then(function () { golgeler.forEach(function (g) { g.remove(); }); coz(); });
        });
      });
    });
  }

  /* Sıra kimde: sırası gelen arkadaşa dokun, top ona gider, üç kez zıplar */
  function siraOyunu(h, sira, topu, talimat) {
    var n = 0, yanlis = 0, konusma = Promise.resolve();
    var herkes = [];
    sira.forEach(function (a) { if (herkes.indexOf(a) < 0) herkes.push(a); });
    h.api.talimat(talimat);
    function isaretle() {
      herkes.forEach(function (a) { a.el.classList.remove('h-dokunulur'); });
      if (n < sira.length) sira[n].el.classList.add('h-dokunulur');
    }
    isaretle();
    h.api.ipucu(function () { if (n < sira.length) h.api.el(sira[n].x, sira[n].y - 140); });
    return new Promise(function (coz) {
      herkes.forEach(function (a) {
        h.api.dokun(a.el, function () {
          if (n >= sira.length) return;
          if (a !== sira[n]) { T.oynat(a.el, 'salla', 520); if (++yanlis >= 2) h.api.el(sira[n].x, sira[n].y - 140); h.api.tekrar(); return; }
          yanlis = 0;
          var k = ++n;
          Efekt.pop();
          isaretle();
          h.uc(topu, a.x, a.y - 240, 500).then(function () { return a.zipla(3, 60); });
          konusma = konusma.then(function () { return h.api.say(k); });
          if (k === sira.length) {
            h.api.ipucu(null);
            T.sonTalimat(null);
            konusma.then(function () { Efekt.dogru(); return h.bekle(500); }).then(coz);
          }
        });
      });
    });
  }

  /* Pas oyunu: top kimdeyse, ötekilerden birine dokun; top ona uçar */
  function pasOyunu(h, oyuncular, topu, kez, talimat) {
    var kimde = oyuncular[0], n = 0, konusma = Promise.resolve();
    h.api.talimat(talimat);
    function isaretle() { oyuncular.forEach(function (a) { a.el.classList.toggle('h-dokunulur', a !== kimde && n < kez); }); }
    isaretle();
    h.api.ipucu(function () { var a = oyuncular[(oyuncular.indexOf(kimde) + 1) % oyuncular.length]; h.api.el(a.x, a.y - 140); });
    return new Promise(function (coz) {
      oyuncular.forEach(function (a) {
        h.api.dokun(a.el, function () {
          if (n >= kez) return;
          if (a === kimde) { T.oynat(a.el, 'salla', 520); h.api.tekrar(); return; }
          var k = ++n;
          kimde = a;
          Efekt.pop();
          isaretle();
          h.uc(topu, a.x, a.y - 240, 450).then(function () { return a.zipla(1, 50); });
          konusma = konusma.then(function () { return h.api.say(k); });
          if (k === kez) {
            h.api.ipucu(null);
            T.sonTalimat(null);
            konusma.then(function () { Efekt.dogru(); return h.bekle(500); }).then(coz);
          }
        });
      });
    });
  }

  /* Raftaki beş oyuncaktan biri kaybolur: hangisi? */
  function eksikOyuncak(h) {
    var OYUNCAK = ['top', 'ayi', 'kup', 'araba', 'sepet'];
    var raf = T.el('div', 'h-raf', h.ui);
    var ogeler = OYUNCAK.map(function (o, i) { return h.oge(o, 640 + i * 200, 440, 150, 'belir'); });
    var eksik = Math.floor(Math.random() * OYUNCAK.length);
    var secenekler = null;
    return h.soyle('t_h2_m1')
      .then(function () { return h.bekle(4000); })
      .then(function () { return h.kariskanGec(2200, 300, 700, 380, 1300); })
      .then(function () {
        ogeler[eksik].classList.add('gizli');
        return h.bekle(500);
      })
      .then(function () {
        var adaylar = T.karistir([eksik].concat(T.karistir(OYUNCAK.map(function (_, i) { return i; }).filter(function (i) { return i !== eksik; })).slice(0, 2)));
        secenekler = adaylar.map(function (i, j) { return h.oge(OYUNCAK[i], 640 + j * 320, 880, 180, 'dokunulur belir'); });
        h.api.talimat('t_h2_m2');
        h.api.ipucu(function () { secenekler[adaylar.indexOf(eksik)].classList.add('parla'); });
        return new Promise(function (coz) {
          var bitti = false;
          secenekler.forEach(function (d, j) {
            h.api.dokun(d, function () {
              if (bitti) return;
              if (adaylar[j] !== eksik) { T.oynat(d, 'salla', 520); h.api.tekrar(); return; }
              bitti = true;
              h.api.ipucu(null);
              T.sonTalimat(null);
              Efekt.dogru();
              secenekler.forEach(function (s) { s.remove(); });
              // Karışkan pencereden geri fırlatır
              var geri = h.oge(OYUNCAK[eksik], 1500, 300, 150);
              h.uc(geri, 640 + eksik * 200, 440, 800).then(function () {
                geri.remove();
                ogeler[eksik].classList.remove('gizli');
                h.api.kutla(640 + eksik * 200, 440, 40);
                return h.bekle(900);
              }).then(function () { ogeler.forEach(function (o) { o.remove(); }); raf.remove(); coz(); });
            });
          });
        });
      });
  }

  /* Örüntü: kırmızı, sarı, kırmızı, sarı, ?, ? */
  function oruntu(h) {
    var RENK = { kirmizi: '#FC5F42', sari: '#FFC940', mavi: '#4DA3E8' };
    var kagit = T.el('div', 'h-kagit', h.ui);
    var cicekler = [];
    for (var i = 0; i < 6; i++) {
      var c = T.el('div', 'cicek', kagit);
      c.innerHTML = '<svg viewBox="0 0 100 100"><g class="tac" fill="#F1E9DA"><circle cx="50" cy="22" r="17"/><circle cx="76" cy="40" r="17"/><circle cx="68" cy="70" r="17"/><circle cx="32" cy="70" r="17"/><circle cx="24" cy="40" r="17"/></g><circle cx="50" cy="50" r="14" fill="#fff" stroke="#5A3A26" stroke-width="3"/><path d="M50 65v30" stroke="#57B26B" stroke-width="6" stroke-linecap="round"/></svg>';
      cicekler.push(c);
    }
    var sira = ['kirmizi', 'sari', 'kirmizi', 'sari', 'kirmizi', 'sari'];
    function boya(i, r) { cicekler[i].querySelector('.tac').setAttribute('fill', RENK[r]); cicekler[i].classList.add('boyali'); }
    for (var j = 0; j < 4; j++) boya(j, sira[j]);
    var palet = T.el('div', 'h-palet', h.ui);
    var renkler = T.karistir(['kirmizi', 'sari', 'mavi']).map(function (r) {
      var b = T.el('button', 'renk', palet);
      b.type = 'button';
      b.style.background = RENK[r];
      b.renk = r;
      return b;
    });
    var beklenen = 4;
    h.api.talimat('t_h2_o1');
    h.api.ipucu(function () { renkler.forEach(function (b) { if (b.renk === sira[beklenen]) b.classList.add('parla'); }); });
    return new Promise(function (coz) {
      renkler.forEach(function (b) {
        h.api.dokun(b, function () {
          if (beklenen >= 6) return;
          if (b.renk !== sira[beklenen]) { T.oynat(b, 'salla', 520); h.api.tekrar(); return; }
          renkler.forEach(function (x) { x.classList.remove('parla'); });
          Efekt.pop();
          boya(beklenen, b.renk);
          beklenen++;
          if (beklenen >= 6) {
            h.api.ipucu(null);
            T.sonTalimat(null);
            Efekt.dogru();
            h.api.kutla(1150, 500, 50);
            h.bekle(1200).then(function () { palet.remove(); kagit.classList.add('git'); return h.bekle(400); }).then(function () { kagit.remove(); coz(); });
          }
        });
      });
    });
  }
})();
