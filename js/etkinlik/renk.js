/* Renkli Karıncalar — kitap s. 10 (turuncu, kahverengi ve siyah karıncaları
   kendi renginde çembere al) · kılavuz 12 (Rengârenk Karıncalar: renk
   karıştırma, karıncanın şeffaf midesi).

   1. Renkleri bul: Tombiş bir renk söyler, çocuklar o renkteki karıncalara
      dokunur, karınca o renkte bir halkayla işaretlenir ve sayılır.
   2. Renk karıştır: iki şişe seçilir, kapta yeni renk oluşur, bir karınca
      gelip içer ve karnı o renge boyanır. */

T.etkinlik({
  kod: 'renk',
  ad: 'Renkli Karıncalar',
  kaynak: 'Kitap s. 10 · Kılavuz 12',
  ikon: 'gorsel/ik-renk.webp',
  arka: 'gorsel/arka-zemin.webp',
  sesler: ['ren_giris', 'ren_turuncu', 'ren_kahverengi', 'ren_siyah', 'ren_bu_turuncu', 'ren_bu_kahverengi', 'ren_bu_siyah',
    'ren_karistir', 'ren_oldu_turuncu', 'ren_oldu_yesil', 'ren_oldu_mor', 'ren_son', 'sayi_1', 'sayi_2', 'sayi_3', 'sayi_4', 'sayi_5'],

  kur: function (api) {
    var R = Cizim.RENK;
    var HER_RENK = 5;

    /* ——— 1. Renkleri bul ——— */
    function renkleriBul() {
      var sahne = T.el('div', 'renk-sahne', api.alan);
      var halkalar = T.el('div', 'halka-kat', sahne);
      var RENKLER = ['turuncu', 'kahverengi', 'siyah'];

      // Karıncaları birbirine değmeyecek şekilde dağıt
      var yerler = [];
      var deneme = 0;
      while (yerler.length < HER_RENK * 3 && deneme < 5000) {
        deneme++;
        var p = { x: T.rastgele(380, 1600), y: T.rastgele(430, 990) };
        if (p.x < 520 && p.y > 760) continue; // boya kalemi köşesi
        if (yerler.every(function (q) { return T.uzaklik(p, q) > 165; })) yerler.push(p);
      }
      var karincalar = yerler.map(function (p, i) {
        var renk = RENKLER[i % 3];
        var k = Cizim.karinca({ renk: R[renk] });
        var s = api.sprite(k.el, p.x, p.y, 150, null, sahne);
        s.a = T.rastgele(0, 360);
        s.ciz();
        return { k: k, s: s, renk: renk, bulundu: false, hiz: T.rastgele(0.2, 0.5) };
      });
      api.dongu(function (dt) { karincalar.forEach(function (a) { a.k.adim(dt * a.hiz, 10); }); });

      var kalem = T.el('div', 'renk-kalemi', sahne);

      function halkaCiz(a, renk) {
        var h = Cizim.svg('<svg viewBox="0 0 200 200" width="200" height="200"><ellipse cx="100" cy="100" rx="86" ry="80" fill="none" stroke="' + R[renk] +
          '" stroke-width="11" stroke-linecap="round" pathLength="100" stroke-dasharray="100" stroke-dashoffset="100" transform="rotate(-80 100 100)"/></svg>');
        h.style.position = 'absolute';
        h.style.left = (a.s.x - 100) + 'px';
        h.style.top = (a.s.y - 100) + 'px';
        halkalar.appendChild(h);
        var e = h.querySelector('ellipse');
        api.tween(450, function (t) { e.setAttribute('stroke-dashoffset', (100 - t * 104).toFixed(1)); }, T.kolay.cik);
      }

      function tur(i) {
        if (i >= RENKLER.length) return Promise.resolve();
        var renk = RENKLER[i];
        kalem.innerHTML = '';
        kalem.appendChild(Cizim.boya(R[renk]));
        T.oynat(kalem, 'sek', 500);
        var sayac = 0;
        api.talimat('ren_' + renk);
        api.ipucu(function () {
          var a = karincalar.filter(function (x) { return x.renk === renk && !x.bulundu; })[0];
          if (a) api.el(a.s.x, a.s.y);
        });
        return new Promise(function (coz) {
          var kaldir = karincalar.map(function (a) {
            return api.dokun(a.s.el, function () {
              if (a.bulundu) return;
              if (a.renk === renk) {
                a.bulundu = true;
                sayac++;
                halkaCiz(a, renk);
                T.oynat(a.s.ic, 'sek', 400);
                Efekt.pop();
                api.say(sayac);
                if (sayac === HER_RENK) {
                  kaldir.forEach(function (f) { f(); });
                  api.bekle(900).then(function () { return api.aferin(); }).then(coz);
                }
              } else {
                T.oynat(a.s.ic, 'salla', 520);
                Efekt.yanlis();
                api.soyle('ren_bu_' + a.renk);
              }
            });
          });
        }).then(function () { return tur(i + 1); });
      }

      return api.soyle('ren_giris').then(function () { return tur(0); }).then(function () {
        api.ipucu(null);
        return api.tween(500, function (t) { sahne.style.opacity = 1 - t; });
      }).then(function () { sahne.remove(); });
    }

    /* ——— 2. Renk karıştır ——— */
    function karistir() {
      var sahne = T.el('div', 'renk-sahne', api.alan);
      var KARISIM = { 'kirmizi+sari': 'turuncu', 'mavi+sari': 'yesil', 'kirmizi+mavi': 'mor' };
      var siseler = ['kirmizi', 'sari', 'mavi'].map(function (ad, i) {
        var s = api.sprite(Cizim.sise(R[ad]), 330 + i * 230, 800, 170, 'sise', sahne);
        s.ad = ad;
        return s;
      });
      var kap = Cizim.kap();
      var kapS = api.sprite(kap, 1250, 850, 380, null, sahne);
      var sivi = kap.querySelector('.sivi'), yuzey = kap.querySelector('.yuzey');
      function kapRengi(c) {
        sivi.setAttribute('fill', c || '#EAF6FF');
        yuzey.setAttribute('fill', c ? Cizim.kat(c, 0.25) : '#F6FBFF');
      }

      var secilen = [], mesgul = false, yapilan = {};
      var galeri = 0;

      function damla(s, renk) {
        var d = T.el('div', 'renk-damla', sahne);
        d.style.background = renk;
        var x0 = s.x, y0 = s.y - 120, x1 = kapS.x, y1 = kapS.y - 60;
        Efekt.damla();
        return api.tween(550, function (t) {
          d.style.transform = 'translate(' + (x0 + (x1 - x0) * t - 22) + 'px,' + (y0 + (y1 - y0) * t - Math.sin(t * Math.PI) * 200 - 22) + 'px)';
        }, T.kolay.gir).then(function () { d.remove(); });
      }

      function icer(renkAd) {
        mesgul = true;
        var k = Cizim.karinca({});
        var ks = api.sprite(k.el, 2050, 820, 170, null, sahne);
        ks.a = 180;
        ks.ciz();
        var d = api.dongu(function (dt) { k.adim(dt, 16); });
        return api.tween(1200, function (t) { ks.git(2050 - t * 590, 820); }, T.kolay.cik).then(function () {
          d.dur();
          k.dur();
          // İçerken başını eğip kaldırır
          return api.tween(900, function (t) { ks.o = 1 + Math.sin(t * Math.PI * 3) * 0.04; ks.ciz(); });
        }).then(function () {
          k.karinRengi(R[renkAd]);
          kapRengi(null);
          T.oynat(ks.ic, 'sek', 400);
          Efekt.dogru();
          // Galeriye yürür
          var hx = 760 + (galeri % 6) * 200, hy = 460;
          galeri++;
          var x0 = ks.x, y0 = ks.y;
          ks.a = Math.atan2(hy - y0, hx - x0) * 180 / Math.PI;
          var d2 = api.dongu(function (dt) { k.adim(dt, 16); });
          return api.tween(1300, function (t) { ks.o = 1 - t * 0.2; ks.git(x0 + (hx - x0) * t, y0 + (hy - y0) * t); }, T.kolay.gircik)
            .then(function () { d2.dur(); k.dur(); ks.a = 0; ks.ciz(); });
        }).then(function () {
          siseler.forEach(function (s) { s.ic.classList.remove('parla'); });
          secilen = [];
          mesgul = false;
        });
      }

      return api.talimat('ren_karistir').then(function () {
        return new Promise(function (coz) {
          api.ipucu(function () {
            var s = siseler.filter(function (x) { return secilen.indexOf(x.ad) < 0; })[0];
            if (s) api.el(s.x, s.y);
          });
          siseler.forEach(function (s) {
            api.dokun(s.el, function () {
              if (mesgul) return;
              var yer = secilen.indexOf(s.ad);
              if (yer >= 0) { secilen.splice(yer, 1); s.ic.classList.remove('parla'); if (!secilen.length) kapRengi(null); return; }
              secilen.push(s.ad);
              s.ic.classList.add('parla');
              if (secilen.length === 1) {
                damla(s, R[s.ad]).then(function () { kapRengi(Cizim.kat(R[s.ad], 0.35)); });
                return;
              }
              mesgul = true;
              var anahtar = secilen.slice().sort().join('+');
              var sonuc = KARISIM[anahtar];
              damla(s, R[s.ad]).then(function () {
                kapRengi(R[sonuc]);
                T.oynat(kapS.ic, 'sek', 450);
                return api.soyle('ren_oldu_' + sonuc);
              }).then(function () { return icer(sonuc); }).then(function () {
                yapilan[sonuc] = true;
                if (Object.keys(yapilan).length === 3) { api.ipucu(null); coz(); }
              });
            });
          });
        });
      });
    }

    renkleriBul()
      .then(karistir)
      .then(function () { api.kutla(1160, 460, 50); return api.soyle('ren_son'); })
      .then(function () { api.bitti({}); });
  }
});
