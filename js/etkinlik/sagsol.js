/* Sağ-Sol — kitap s. 12 ("İki elimizin işaret parmağını noktaların üzerine
   yerleştirelim. Aynı anda çizgileri takip ederek karıncaları yapraklara
   ulaştıralım.")

   Akıllı tahta çok dokunuşlu: iki parmak aynı anda iki karıncayı yürütür.
   Bir karınca ötekinden fazla öne geçemez, arkadaşını bekler; böylece iki el
   birlikte çalışır. Tek dokunuşlu tahtada sırayla yürütmek de işe yarar.
   İki çocuk yan yana da oynayabilir. */

T.etkinlik({
  kod: 'sagsol',
  ad: 'Sağ-Sol',
  kaynak: 'Kitap s. 12',
  ikon: 'gorsel/ik-sagsol.webp',
  arka: 'gorsel/arka-zemin.webp',
  sesler: ['ss_giris', 'ss_bekle', 'ss_son'],

  kur: function (api) {
    var SX = 700, DX = 1220, Y1 = 430, Y2 = 920;
    var FARK = 20; // bir karınca ötekinden en fazla bu kadar nokta önde olabilir
    var TURLAR = [
      function (x, yon) { return [{ x: x, y: Y1 }, { x: x, y: Y2 }]; },
      function (x, yon) { return Yol.dalga(x, Y1, x, Y2, 62 * yon, 1.5); },
      function (x, yon) { return Yol.zikzak(x, Y1, x, Y2, 52 * yon, 3); }
    ];

    var eller = [
      api.sprite(Cizim.el(), 520, 470, 120, 'sol-el'),
      api.sprite(Cizim.el(), 1400, 470, 120, 'sag-el')
    ];
    eller[0].ic.style.transform = 'scaleX(-1)';

    var uyarildi = false;

    function tur(i) {
      if (i >= TURLAR.length) return Promise.resolve();
      var sahne = T.el('div', 'tur', api.alan);
      var yollar = [Yol.esitle(TURLAR[i](SX, 1), 6), Yol.esitle(TURLAR[i](DX, -1), 6)];
      var taraflar = yollar.map(function (n, j) {
        var katman = Yol.katman(sahne, n, { genislik: 100 });
        var yaprak = T.sprite('gorsel/yaprak.webp', n[n.length - 1].x, n[n.length - 1].y + 40, 170, sahne);
        var k = Cizim.karinca({ renk: j ? Cizim.RENK.siyah : Cizim.RENK.karinca });
        var s = T.sprite(k.el, n[0].x, n[0].y, 124, sahne);
        return { n: n, katman: katman, yaprak: yaprak, k: k, s: s, gx: n[0].x, gy: n[0].y, bekleme: 0 };
      });
      taraflar[0].t = Yol.takipci({ noktalar: yollar[0], tolerans: 85, pencere: 26, yakalama: 130,
        sinir: function () { return taraflar[1].t.indeks() + FARK; } });
      taraflar[1].t = Yol.takipci({ noktalar: yollar[1], tolerans: 85, pencere: 26, yakalama: 130,
        sinir: function () { return taraflar[0].t.indeks() + FARK; } });

      return new Promise(function (coz) {
        var kaldir = [];
        kaldir.push(api.olay(api.alan, 'pointerdown', function (e) {
          var p = api.nokta(e);
          // Önce yakın olan karıncayı dene
          var sira = T.uzaklik(p, taraflar[0].t.bas()) <= T.uzaklik(p, taraflar[1].t.bas()) ? [0, 1] : [1, 0];
          for (var j = 0; j < 2; j++) {
            if (taraflar[sira[j]].t.basla(e.pointerId, p)) {
              try { api.alan.setPointerCapture(e.pointerId); } catch (x) {}
              eller.forEach(function (el) { el.el.style.opacity = '0'; });
              break;
            }
          }
        }));
        kaldir.push(api.olay(api.alan, 'pointermove', function (e) {
          var p = api.nokta(e);
          taraflar.forEach(function (tr) {
            if (tr.t.parmak() !== e.pointerId) return;
            tr.son = p;
            tr.t.hareket(e.pointerId, p);
          });
        }));
        function birak(e) { taraflar.forEach(function (tr) { tr.t.birak(e.pointerId); }); }
        kaldir.push(api.olay(api.alan, 'pointerup', birak));
        kaldir.push(api.olay(api.alan, 'pointercancel', birak));

        if (i === 0) api.talimat('ss_giris');
        api.ipucu(function () {
          api.elKaydir(taraflar[0].n.slice(0, 50), 1200);
          api.elKaydir(taraflar[1].n.slice(0, 50), 1200);
        });

        var bitti = false;
        var d = api.dongu(function (dt) {
          taraflar.forEach(function (tr, j) {
            var b = tr.t.bas();
            var dx = b.x - tr.gx, dy = b.y - tr.gy;
            tr.gx += dx * 0.3;
            tr.gy += dy * 0.3;
            var diger = taraflar[1 - j].t;
            var sinirda = tr.t.tutuluyor() && tr.t.indeks() >= diger.indeks() + FARK - 1 && tr.son && T.uzaklik(tr.son, b) > 70;
            if (Math.abs(dx) + Math.abs(dy) > 0.8) { tr.k.adim(dt, 16); tr.s.a = tr.t.aci(); }
            else if (sinirda) { tr.s.a = tr.t.aci() + Math.sin(Date.now() / 90) * 14; }
            tr.s.git(tr.gx, tr.gy);
            tr.katman.doldur(tr.t.oran());
            // Arkadaşını uzun süre beklerse Tombiş bir kez hatırlatır
            tr.bekleme = sinirda ? tr.bekleme + dt : 0;
            if (tr.bekleme > 1.4 && !uyarildi) { uyarildi = true; api.soyle('ss_bekle'); }
          });
          if (!bitti && taraflar[0].t.bitti() && taraflar[1].t.bitti()) {
            bitti = true;
            d.dur();
            kaldir.forEach(function (f) { f(); });
            api.ipucu(null);
            taraflar.forEach(function (tr) {
              var y0 = tr.yaprak.o;
              api.tween(700, function (t) { tr.yaprak.o = y0 - t * 0.35; tr.yaprak.ciz(); });
              api.kutla(tr.gx, tr.gy, 24);
            });
            api.aferin().then(function () { sahne.remove(); coz(); });
          }
        });
      }).then(function () { return tur(i + 1); });
    }

    tur(0).then(function () { return api.soyle('ss_son'); })
      .then(function () { api.bitti({}); });
  }
});
