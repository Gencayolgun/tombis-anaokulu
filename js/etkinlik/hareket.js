/* Karınca Olalım — kılavuz 4 (karınca dansı, lideri taklit) ve kılavuz 8
   (drama: "Rüzgâr var sıkı tutunun", "Yağmur yağıyor suları için"...).

   Tahta bu kez dokunulmaz; bütün sınıf ayağa kalkar. Tombiş bir komut
   söyler, lider karınca tahtada gösterir, çocuklar yapar. Her komut birkaç
   saniye sürer ve kendiliğinden geçer; öğretmen "ileri" ile atlayabilir. */

T.etkinlik({
  kod: 'hareket',
  ad: 'Karınca Olalım',
  kaynak: 'Kılavuz 4, 8',
  ikon: 'gorsel/ik-hareket.webp',
  arka: 'gorsel/arka-cayir.webp',
  sesler: ['har_giris', 'har_ruzgar', 'har_gunes', 'har_yagmur', 'har_tehlike', 'har_yiyecek', 'har_tasima', 'har_zipla', 'har_don', 'har_alkis', 'har_son'],

  kur: function (api) {
    var LX = 900, LY = 760;
    var efekt = T.el('div', 'efekt-kat', api.alan);
    var lider = api.sprite('gorsel/karinca-on.webp', LX, LY, 330);
    var hal = 'bos', halT = 0, ritim = 0;

    api.dongu(function (dt) {
      halT += dt;
      if (hal === 'tehlike') return; // koşuyu kendi tween'i yönetir
      var ic = lider.ic;
      lider.a = 0; lider.o = 1;
      var x = lider.x, y = LY, sx = 1, sy = 1;
      if (hal === 'ruzgar') { lider.a = -12 + Math.sin(halT * 22) * 2.5; }
      else if (hal === 'gunes') { lider.a = Math.sin(halT * 1.4) * 5; sy = 0.93; }
      else if (hal === 'yagmur') { y = LY + Math.abs(Math.sin(halT * 4)) * 18; }
      else if (hal === 'yiyecek') { lider.a = Math.sin(halT * 18) * 6; }
      else if (hal === 'tasima') { x = LX + Math.sin(halT * 1.6) * 160; y = LY - Math.abs(Math.sin(halT * 5)) * 12; }
      else if (hal === 'zipla') { y = LY - Math.abs(Math.sin(halT * Math.PI * 1.25)) * 170; }
      else if (hal === 'don') { lider.a = (halT * 260) % 360; }
      else if (hal === 'alkis') { var v = Math.abs(Math.sin(halT * Math.PI * 2)); sx = 1 + v * 0.1; sy = 1 - v * 0.08; }
      else if (hal === 'bos') { sy = 1 + Math.sin(halT * 2.5) * 0.015; }
      lider.x = x;
      lider.y = y;
      ic.style.transform = 'scale(' + sx.toFixed(3) + ',' + sy.toFixed(3) + ')';
      lider.ciz();

      // Dans hareketlerinde ritim
      if (hal === 'zipla' || hal === 'don' || hal === 'alkis') {
        ritim += dt;
        if (ritim >= 0.5) { ritim = 0; if (hal === 'alkis') Efekt.pop(); else Efekt.davul(); }
      }
    });

    function parca(sinif, sayi, ayar) {
      for (var i = 0; i < sayi; i++) {
        var p = T.el('div', sinif, efekt);
        ayar(p, i);
      }
    }

    var ETKI = {
      ruzgar: function () {
        parca('esinti', 10, function (p, i) {
          p.style.top = (330 + i * 64) + 'px';
          p.style.animationDelay = (i * 0.23 % 1.2) + 's';
        });
        Efekt.ruzgar();
        api.zamanla(1800, Efekt.ruzgar);
      },
      gunes: function () {
        var g = T.el('div', 'gunes', efekt);
        g.appendChild(Cizim.svg('<svg viewBox="-110 -110 220 220">' + [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map(function (i) {
          return '<rect x="-7" y="-104" width="14" height="36" rx="7" fill="#FFB020" transform="rotate(' + (i * 30) + ')"/>';
        }).join('') + '<circle r="62" fill="#FFD54A" stroke="#FFB020" stroke-width="8"/>' +
          '<circle cx="-22" cy="-8" r="8" fill="#5A3A26"/><circle cx="22" cy="-8" r="8" fill="#5A3A26"/>' +
          '<path d="M-22 18 Q0 38 22 18" fill="none" stroke="#5A3A26" stroke-width="7" stroke-linecap="round"/></svg>'));
        T.el('div', 'sicak', efekt);
      },
      yagmur: function () {
        T.el('div', 'bulut', efekt).appendChild(Cizim.svg('<svg viewBox="0 0 400 200"><path d="M80 170a60 60 0 0 1 10-118 80 80 0 0 1 150-10 62 62 0 0 1 90 58 50 50 0 0 1-20 70z" fill="#fff" stroke="#BFD6E6" stroke-width="8"/></svg>'));
        parca('damla', 46, function (p, i) {
          p.style.left = (380 + Math.random() * 1200) + 'px';
          p.style.animationDelay = (Math.random() * 1.2) + 's';
          p.style.animationDuration = (0.8 + Math.random() * 0.5) + 's';
        });
        api.zamanla(400, Efekt.damla);
        api.zamanla(1300, Efekt.damla);
        api.zamanla(2200, Efekt.damla);
      },
      tehlike: function () {
        T.el('div', 'tehlike-cerceve', efekt);
        var x0 = lider.x;
        api.tween(700, function (t) { lider.x = x0 + (1660 - x0) * t; lider.y = LY - 120 * t; lider.o = 1 - t * 0.5; lider.ciz(); })
          .then(function () { return api.bekle(2200); })
          .then(function () { return api.tween(700, function (t) { lider.x = 1660 + (LX - 1660) * t; lider.y = LY - 120 * (1 - t); lider.ciz(); }); });
      },
      yiyecek: function () {
        var c = api.sprite('gorsel/cilek.webp', 1320, 820, 200, null, efekt);
        T.oynat(c.el, 'sek', 500);
        [0, 1].forEach(function (j) {
          var k = api.sprite('gorsel/karinca-yan.webp', -150, 900 - j * 70, 150, null, efekt);
          api.bekle(900 + j * 500).then(function () {
            return api.tween(1600, function (t) { k.git(-150 + t * (560 + j * 120), 900 - j * 70 - Math.abs(Math.sin(t * 12)) * 8); }, T.kolay.cik);
          });
        });
      },
      tasima: function () {
        var tohum = T.el('div', 'tasinan', efekt);
        tohum.appendChild(Cizim.svg('<svg viewBox="0 0 200 140"><ellipse cx="100" cy="74" rx="92" ry="60" fill="#C98A4B" stroke="#8A5A2C" stroke-width="8"/><path d="M40 60 Q100 30 160 60" fill="none" stroke="#E7B77E" stroke-width="10" stroke-linecap="round"/></svg>'));
        var d = api.dongu(function () {
          tohum.style.transform = 'translate(' + (lider.x - 110) + 'px,' + (lider.y - 300) + 'px)';
        });
        api.zamanla(6500, function () { d.dur(); });
      },
      zipla: function () {},
      don: function () {},
      alkis: function () {}
    };

    var DURUMLAR = T.karistir(['ruzgar', 'gunes', 'yagmur', 'tehlike', 'yiyecek', 'tasima']);
    var SIRA = ['zipla'].concat(DURUMLAR.slice(0, 3), ['alkis'], DURUMLAR.slice(3), ['don']);

    var gec = null;
    var ileri = T.el('button', 'ikon-dugme kose', api.alan);
    ileri.type = 'button';
    ileri.title = 'Sonraki komut';
    ileri.style.left = '1790px';
    ileri.style.top = '960px';
    ileri.appendChild(Cizim.ikon('ileri'));
    api.dokun(ileri, function () { if (gec) gec(); });

    function komut(i) {
      if (i >= SIRA.length) return Promise.resolve();
      var ad = SIRA[i];
      efekt.innerHTML = '';
      lider.x = LX; lider.o = 1;
      hal = ad;
      halT = 0;
      ETKI[ad]();
      T.rehberPoz(ad === 'tehlike' ? 'dusun' : 'sevinc', 2000);
      return new Promise(function (coz) {
        var bitti = false;
        function son() { if (!bitti) { bitti = true; gec = null; coz(); } }
        gec = son;
        api.talimat('har_' + ad).then(function () { return api.bekle(ad === 'tehlike' ? 4200 : 4000); }).then(son);
      }).then(function () {
        hal = 'bos';
        return komut(i + 1);
      });
    }

    api.soyle('har_giris')
      .then(function () { return api.bekle(400); })
      .then(function () { return komut(0); })
      .then(function () {
        efekt.innerHTML = '';
        ileri.remove();
        api.kutla(960, 600, 60);
        return api.soyle('har_son');
      })
      .then(function () { api.bitti({}); });
  }
});
