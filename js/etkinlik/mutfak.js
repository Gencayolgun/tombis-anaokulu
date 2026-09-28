/* Mutfakta — kılavuz 7 (Karıncalar Mutfakta: bisküviyi ikiye, dörde bölme;
   boş, dolu, tam, yarım kavramları).

   Önce bisküvi: bir bütün, iki yarım, dört parça; karıncalar kırıntıları
   taşır. Sonra bardaklar: boş, yarım, dolu. */

T.etkinlik({
  kod: 'mutfak',
  ad: 'Mutfakta',
  kaynak: 'Kılavuz 7',
  ikon: 'gorsel/ik-mutfak.webp',
  arka: 'gorsel/arka-zemin.webp',
  sesler: ['mut_giris', 'mut_yarim', 'mut_dort', 'mut_bardak', 'mut_dolu', 'mut_bos', 'mut_yarimbardak', 'mut_son'],

  kur: function (api) {
    var BX = 960, BY = 660, BG = 460;
    var BIRIM = BG / 300;

    /* ——— 1. Bisküvi ——— */
    function biskuviBol() {
      var tabak = T.el('div', 'tabak', api.alan);
      tabak.style.left = (BX - 330) + 'px';
      tabak.style.top = (BY + 110) + 'px';
      var b = Cizim.biskuvi();
      var s = api.sprite(b, BX, BY, BG);
      var ceyrek = [].slice.call(b.querySelectorAll('.ceyrek'));
      var konum = [[0, 0], [0, 0], [0, 0], [0, 0]];
      function ayir(hedef, ms) {
        var bas = konum.map(function (k) { return k.slice(); });
        return api.tween(ms, function (t) {
          ceyrek.forEach(function (c, i) {
            konum[i] = [bas[i][0] + (hedef[i][0] - bas[i][0]) * t, bas[i][1] + (hedef[i][1] - bas[i][1]) * t];
            c.setAttribute('transform', 'translate(' + konum[i][0].toFixed(1) + ' ' + konum[i][1].toFixed(1) + ')');
          });
        }, T.kolay.zipla);
      }

      var asama = 0;
      api.talimat('mut_giris');
      api.ipucu(function () { api.el(BX, BY); });
      return new Promise(function (coz) {
        var kaldir = api.dokun(s.el, function () {
          if (asama === 0) {
            asama = 1;
            Efekt.pop();
            ayir([[36, 0], [36, 0], [-36, 0], [-36, 0]], 600);
            api.talimat('mut_yarim');
          } else if (asama === 1) {
            asama = 2;
            kaldir();
            api.ipucu(null);
            Efekt.pop();
            ayir([[46, -36], [46, 36], [-46, 36], [-46, -36]], 600).then(function () {
              return api.soyle('mut_dort');
            }).then(coz);
            // Dört karınca gelir, birer kırıntı alıp gider
            var koseler = [[1900, 380], [1900, 1060], [20, 1060], [20, 380]];
            ceyrek.forEach(function (c, i) {
              var hedef = { x: BX + (i < 2 ? 1 : -1) * 70 * BIRIM, y: BY + (i === 1 || i === 2 ? 1 : -1) * 70 * BIRIM };
              var k = Cizim.karinca({ renk: i % 2 ? Cizim.RENK.siyah : Cizim.RENK.karinca });
              var ks = api.sprite(k.el, koseler[i][0], koseler[i][1], 110);
              var yuk = T.el('div', 'kirinti', ks.el);
              yuk.style.opacity = '0';
              var d = api.dongu(function (dt) { k.adim(dt, 16); });
              var x0 = ks.x, y0 = ks.y;
              ks.a = Math.atan2(hedef.y - y0, hedef.x - x0) * 180 / Math.PI;
              api.bekle(900 + i * 150).then(function () {
                return api.tween(1100, function (t) { ks.git(x0 + (hedef.x - x0) * t, y0 + (hedef.y - y0) * t); }, T.kolay.cik);
              }).then(function () {
                c.style.transition = 'opacity .3s';
                c.style.opacity = '0';
                yuk.style.opacity = '1';
                ks.a += 180;
                ks.ciz();
                return api.tween(1200, function (t) { ks.git(hedef.x + (x0 - hedef.x) * t, hedef.y + (y0 - hedef.y) * t); }, T.kolay.gir);
              }).then(function () { d.dur(); ks.el.remove(); });
            });
          }
        });
      }).then(function () { return api.bekle(1400); }).then(function () {
        s.el.remove();
        tabak.remove();
      });
    }

    /* ——— 2. Bardaklar ——— */
    function bardaklar() {
      var SORULAR = T.karistir(['dolu', 'bos', 'yarimbardak']).concat(T.karistir(['dolu', 'bos', 'yarimbardak']));
      var DOLULUK = { bos: 0, yarimbardak: 0.5, dolu: 1 };
      var kartlar = [];
      function sor(i) {
        kartlar.forEach(function (k) { k.remove(); });
        if (i >= SORULAR.length) return Promise.resolve();
        var sira = T.karistir(['bos', 'yarimbardak', 'dolu']);
        kartlar = sira.map(function (tur, j) {
          return api.kart({ x: 600 + j * 360, y: 760, w: 260, h: 340, renk: '#CFE6F6', icerik: Cizim.bardak(DOLULUK[tur]) });
        });
        api.talimat('mut_' + SORULAR[i]);
        return api.secim(kartlar, sira.indexOf(SORULAR[i])).then(function () {
          return i % 2 ? api.aferin() : (Efekt.dogru(), T.rehberPoz('sevinc'), api.bekle(700));
        }).then(function () { return sor(i + 1); });
      }
      return api.soyle('mut_bardak').then(function () { return sor(0); });
    }

    biskuviBol()
      .then(bardaklar)
      .then(function () { api.ipucu(null); return api.soyle('mut_son'); })
      .then(function () { api.bitti({}); });
  }
});
