/* Yuvaya Giden Yol — kitap s. 4 (sarmal çizgiyi birleştirerek karıncalara
   yardım) · kılavuz 5 (yuvaya giden yollar, merkeze ulaşma).

   Çocuk karıncayı parmağıyla noktalı yolda yürütür. Yolda bekleyen
   arkadaşlar karıncanın arkasına takılır ("birbirimize yardım ederiz").
   Tur tur zorlaşır: kıvrım, kısa sarmal, kitaptaki gibi uzun sarmal. */

T.etkinlik({
  kod: 'yol',
  ad: 'Yuvaya Giden Yol',
  kaynak: 'Kitap s. 4 · Kılavuz 5',
  ikon: 'gorsel/ik-yol.webp',
  arka: 'gorsel/arka-zemin.webp',
  sesler: ['yol_giris', 'yol_ipucu', 'yol_son'],

  kur: function (api) {
    var TURLAR = [
      { yol: function () { return Yol.dalga(430, 930, 1400, 660, 70, 1); }, kapi: { x: 1510, y: 630 } },
      { yol: function () { return Yol.sarmal(960, 700, 300, 72, 1.25, Math.PI); }, kapi: { x: 960, y: 700 } },
      { yol: function () { return Yol.sarmal(960, 700, 320, 62, 2.1, Math.PI); }, kapi: { x: 960, y: 700 } }
    ];
    var ARA = 22; // trende iki karınca arası (nokta)

    function tur(i) {
      if (i >= TURLAR.length) return Promise.resolve();
      var tanim = TURLAR[i];
      var sahne = T.el('div', 'tur', api.alan);
      var noktalar = Yol.esitle(tanim.yol(), 6);
      var katman = Yol.katman(sahne, noktalar, {});
      var kapi = api.sprite('gorsel/is-kapi.webp', tanim.kapi.x, tanim.kapi.y, 170, null, sahne);
      var takip = Yol.takipci({ noktalar: noktalar, tolerans: 80, pencere: 30, yakalama: 130 });

      function karinca(renk, gen, indeks) {
        var k = Cizim.karinca({ renk: renk });
        var p = noktalar[indeks];
        var s = T.sprite(k.el, p.x, p.y, gen, sahne);
        return { k: k, s: s, gx: p.x, gy: p.y };
      }

      var lider = karinca(Cizim.RENK.karinca, 124, 0);
      var tren = [];
      var bekleyen = [0.3, 0.56, 0.8].map(function (oran, j) {
        var ind = Math.round(oran * (noktalar.length - 1));
        var b = karinca(j === 1 ? Cizim.RENK.siyah : Cizim.RENK.karinca, 104, ind);
        b.ind = ind;
        b.s.a = Math.atan2(noktalar[ind + 1].y - noktalar[ind].y, noktalar[ind + 1].x - noktalar[ind].x) * 180 / Math.PI + 180;
        b.s.ciz();
        return b;
      });

      return new Promise(function (coz) {
        var kaldir = [];
        kaldir.push(api.olay(api.alan, 'pointerdown', function (e) {
          if (takip.basla(e.pointerId, api.nokta(e))) {
            try { api.alan.setPointerCapture(e.pointerId); } catch (x) {}
          }
        }));
        kaldir.push(api.olay(api.alan, 'pointermove', function (e) { takip.hareket(e.pointerId, api.nokta(e)); }));
        function birak(e) { takip.birak(e.pointerId); }
        kaldir.push(api.olay(api.alan, 'pointerup', birak));
        kaldir.push(api.olay(api.alan, 'pointercancel', birak));

        if (i === 0) api.talimat('yol_giris');
        else { T.sonTalimat('yol_ipucu'); Efekt.pop(); }
        api.ipucu(function () { api.elKaydir(noktalar.slice(0, Math.min(noktalar.length, 60)), 1500); });

        function yurut(a, hedef, dt, hiz) {
          var dx = hedef.x - a.gx, dy = hedef.y - a.gy;
          var yol = Math.sqrt(dx * dx + dy * dy);
          a.gx += dx * 0.3;
          a.gy += dy * 0.3;
          if (yol > 0.8) {
            a.s.a = Math.atan2(dy, dx) * 180 / Math.PI;
            a.k.adim(dt, hiz || 16);
          }
          a.s.git(a.gx, a.gy);
        }

        var bitti = false;
        var d = api.dongu(function (dt) {
          var ind = takip.indeks();
          yurut(lider, noktalar[ind], dt);
          katman.doldur(takip.oran());

          // Lider yanından geçince bekleyen arkadaş trene katılır
          bekleyen.forEach(function (b) {
            if (!b.katildi && ind >= b.ind - 4) {
              b.katildi = true;
              tren.push(b);
              Efekt.pop();
              T.oynat(b.s.el, 'sek', 400);
            } else if (!b.katildi) {
              b.k.adim(dt * 0.3, 8);
            }
          });
          tren.forEach(function (b, j) {
            yurut(b, noktalar[Math.max(0, ind - ARA * (j + 1))], dt);
          });

          if (takip.bitti() && !bitti) {
            bitti = true;
            d.dur();
            kaldir.forEach(function (f) { f(); });
            api.ipucu(null);
            katman.doldur(1);
            // Hepsi yuvaya girer
            var hepsi = [lider].concat(tren);
            var bas = hepsi.map(function (a) { return { x: a.gx, y: a.gy }; });
            api.tween(900, function (t) {
              hepsi.forEach(function (a, j) {
                var gecik = Math.max(0, Math.min(1, t * 1.6 - j * 0.2));
                a.s.o = 1 - gecik;
                a.s.git(bas[j].x + (tanim.kapi.x - bas[j].x) * gecik, bas[j].y + (tanim.kapi.y - bas[j].y) * gecik);
              });
            }).then(function () {
              T.oynat(kapi.el, 'sek', 500);
              api.kutla(tanim.kapi.x, tanim.kapi.y, 36);
              return api.aferin();
            }).then(function () {
              sahne.remove();
              coz();
            });
          }
        });
      }).then(function () { return tur(i + 1); });
    }

    tur(0).then(function () { return api.soyle('yol_son'); })
      .then(function () { api.bitti({}); });
  }
});
