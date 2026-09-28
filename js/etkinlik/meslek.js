/* Meslekler — kitap s. 5-6 (meslek kartları), s. 9 (meslekleri doğru yere
   yapıştır) · kılavuz 3 (meslekler), 8 (yuvanın odaları), 10 (her sayfada
   bir karınca mesleği).

   Önce kartlar açılır, Tombiş her karıncayı tanıtır. Sonra karıncalar
   yuvadaki doğru odaya gönderilir. Karıncalar konuşmaz; anlatan Tombiş. */

T.etkinlik({
  kod: 'meslek',
  ad: 'Meslekler',
  kaynak: 'Kitap s. 5, 6, 9 · Kılavuz 3, 8, 10',
  ikon: 'gorsel/ik-meslek.webp',
  arka: 'gorsel/arka-yuva.webp',
  sesler: ['mes_giris', 'mes_ciftci', 'mes_terzi', 'mes_bekci', 'mes_isci', 'mes_kralice', 'mes_bakici', 'mes_esle',
    'mes_soru_ciftci', 'mes_soru_terzi', 'mes_soru_bekci', 'mes_soru_isci', 'mes_soru_kralice', 'mes_soru_bakici', 'mes_son', 'mes_sohbet'],

  kur: function (api) {
    var ROLLER = [
      { kod: 'ciftci', ad: 'Çiftçi', is: 'is-mantar' },
      { kod: 'terzi', ad: 'Terzi', is: 'is-dikis' },
      { kod: 'bekci', ad: 'Bekçi', is: 'is-kapi' },
      { kod: 'isci', ad: 'İşçi', is: 'is-kiler' },
      { kod: 'kralice', ad: 'Kraliçe', is: 'is-taht' },
      { kod: 'bakici', ad: 'Bakıcı', is: 'is-bebek' }
    ];

    /* ——— 1. Tanışma: ters kartlar ——— */
    function tanisma() {
      var acilan = 0, bitti = false;
      api.talimat('mes_giris');
      return new Promise(function (coz) {
        var kartlar = ROLLER.map(function (r, i) {
          var x = 560 + (i % 3) * 400, y = 520 + Math.floor(i / 3) * 330;
          var k = api.kart({ x: x, y: y, w: 300, h: 290, sinif: 'ters-kart' });
          var arka = T.el('div', 'kart-arka', k);
          T.el('span', null, arka, '?');
          k.acik = false;
          api.dokun(k, function () {
            Efekt.pop();
            if (!k.acik) {
              k.acik = true;
              acilan++;
              // Kart döner: yarıda içerik değişir
              api.tween(180, function (t) { k.style.transform = 'scaleX(' + (1 - t) + ')'; }).then(function () {
                k.classList.remove('ters-kart');
                k.innerHTML = '';
                var img = T.el('img', null, k);
                img.src = 'gorsel/rol-' + r.kod + '.webp';
                img.alt = '';
                T.el('div', 'etiket', k, r.ad + ' Karınca');
                return api.tween(220, function (t) { k.style.transform = 'scaleX(' + t + ')'; }, T.kolay.cik);
              }).then(function () { k.style.transform = ''; });
            }
            api.soyle('mes_' + r.kod).then(function () {
              if (acilan === ROLLER.length && !bitti) {
                bitti = true;
                coz(kartlar);
              }
            });
          });
          return k;
        });
        api.ipucu(function () {
          for (var i = 0; i < kartlar.length; i++) {
            if (!kartlar[i].acik) {
              api.el(parseFloat(kartlar[i].style.left) + 150, parseFloat(kartlar[i].style.top) + 145);
              return;
            }
          }
        });
      });
    }

    /* ——— 2. Eşleştirme: herkes işinin başına ——— */
    function esleme(kartlar) {
      api.ipucu(null);
      kartlar.forEach(function (k) {
        k.style.pointerEvents = 'none';
        k.style.transition = 'opacity .4s, transform .4s';
        k.style.opacity = '0';
        k.style.transform = 'scale(.6)';
        api.zamanla(450, function () { k.remove(); });
      });
      var odalar = {};
      ROLLER.forEach(function (r, i) {
        var o = T.el('div', 'oda', api.alan);
        var x = 460 + i * 200;
        o.style.left = (x - 85) + 'px';
        o.style.top = '345px';
        var img = T.el('img', null, o);
        img.src = 'gorsel/' + r.is + '.webp';
        img.alt = '';
        odalar[r.kod] = { el: o, x: x, y: 430 };
      });

      var sira = T.karistir(ROLLER);
      function sor(i) {
        if (i >= sira.length) return Promise.resolve();
        var r = sira[i];
        var karinca = api.sprite('gorsel/rol-' + r.kod + '.webp', 330, 1300, 280);
        return api.tween(500, function (t) { karinca.git(330, 1300 - t * 520); }, T.kolay.zipla).then(function () {
          // Doğru iş yeri + iki farklı iş yeri
          var digerleri = T.karistir(ROLLER.filter(function (x) { return x !== r; })).slice(0, 2);
          var secenek = T.karistir([r].concat(digerleri));
          var isKartlari = secenek.map(function (s, j) {
            return api.kart({ x: 820 + j * 350, y: 820, w: 290, h: 290, resim: 'gorsel/' + s.is + '.webp' });
          });
          api.talimat('mes_soru_' + r.kod);
          return api.secim(isKartlari, secenek.indexOf(r)).then(function () {
            Efekt.dogru();
            var oda = odalar[r.kod];
            var x0 = karinca.x, y0 = karinca.y;
            return api.tween(750, function (t) {
              karinca.o = 1 - t * 0.55;
              karinca.git(x0 + (oda.x + 40 - x0) * t, y0 + (oda.y + 30 - y0) * t - Math.sin(t * Math.PI) * 180);
            }, T.kolay.gircik).then(function () {
              oda.el.classList.add('dolu');
              T.oynat(oda.el, 'sek', 500);
              isKartlari.forEach(function (k) { k.remove(); });
              return api.aferin();
            });
          });
        }).then(function () { return sor(i + 1); });
      }
      return sor(0);
    }

    tanisma()
      .then(function (kartlar) { return api.soyle('mes_esle').then(function () { return esleme(kartlar); }); })
      .then(function () {
        api.ipucu(null);
        api.kutla(960, 420, 60);
        return api.soyle('mes_son');
      })
      .then(function () { api.bitti({ sohbet: 'mes_sohbet' }); });
  }
});
