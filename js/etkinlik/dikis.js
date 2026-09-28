/* Yaprak Dik — kılavuz 3 (Terzi Karıncalar: yaprakları dikerek yuva yapma).

   Sınıfta etamin iğnesiyle yapılan dikişin tahtadaki karşılığı: çocuk iğneyi
   parmağıyla noktalı dikiş yolunda yürütür, arkasında ipek iz kalır. Düz,
   zikzak, dalgalı: üç tur. Sonunda Tombiş, terzi karıncaların iğnesiz nasıl
   diktiğini anlatır (kılavuzdaki "İğnesiz nasıl dikerler?" sorusu). */

T.etkinlik({
  kod: 'dikis',
  ad: 'Yaprak Dik',
  kaynak: 'Kılavuz 3',
  ikon: 'gorsel/ik-terzi.webp',
  arka: 'gorsel/arka-zemin.webp',
  sesler: ['dik_giris', 'dik_bilgi', 'dik_son'],

  kur: function (api) {
    var SEAM = 680, X1 = 560, X2 = 1360;
    var TURLAR = [
      function () { return [{ x: X1, y: SEAM }, { x: X2, y: SEAM }]; },
      function () { return Yol.zikzak(X1, SEAM, X2, SEAM, 42, 5); },
      function () { return Yol.dalga(X1, SEAM, X2, SEAM, 44, 2.5); }
    ];

    var terzi = api.sprite('gorsel/rol-terzi.webp', 1650, 780, 250);

    function yapraklar() {
      var s = Cizim.svg('<svg viewBox="0 0 1920 1080" width="1920" height="1080" style="position:absolute;left:0;top:0;pointer-events:none">' +
        '<g class="ust-yaprak"><path d="M500 600 Q960 380 1420 600 Q960 760 500 600 Z" fill="#74C35E" stroke="#3E8A3A" stroke-width="8"/>' +
        '<path d="M520 600 Q960 560 1400 600" fill="none" stroke="#3E8A3A" stroke-width="7"/>' +
        [700, 860, 1020, 1180].map(function (x) { return '<path d="M' + x + ' 595 Q' + (x + 40) + ' 540 ' + (x + 90) + ' 520" fill="none" stroke="#4E9E46" stroke-width="6"/>'; }).join('') + '</g>' +
        '<g class="alt-yaprak"><path d="M500 760 Q960 600 1420 760 Q960 980 500 760 Z" fill="#58AE4C" stroke="#357A33" stroke-width="8"/>' +
        '<path d="M520 762 Q960 800 1400 762" fill="none" stroke="#357A33" stroke-width="7"/>' +
        [700, 860, 1020, 1180].map(function (x) { return '<path d="M' + x + ' 768 Q' + (x + 40) + ' 830 ' + (x + 90) + ' 850" fill="none" stroke="#438F3D" stroke-width="6"/>'; }).join('') + '</g></svg>');
      api.alan.insertBefore(s, api.alan.firstChild);
      return s;
    }

    function igne() {
      return Cizim.svg('<svg viewBox="0 0 220 60"><path d="M10 30 L170 22 Q206 24 212 30 Q206 36 170 38 Z" fill="#D9DEE3" stroke="#7D8A96" stroke-width="4" stroke-linejoin="round"/>' +
        '<ellipse cx="184" cy="30" rx="14" ry="4.5" fill="#fff" stroke="#7D8A96" stroke-width="3"/><path d="M40 27 L160 23" stroke="#fff" stroke-width="3" stroke-linecap="round"/></svg>');
    }

    var yaprakSvg = yapraklar();

    function tur(i) {
      if (i >= TURLAR.length) return Promise.resolve();
      var noktalar = Yol.esitle(TURLAR[i](), 6);
      var katman = Yol.katman(api.alan, noktalar, { serit: 'rgba(255,255,255,.22)', genislik: 92, iz: '#FFF1A8', nokta: '#fff' });
      var takip = Yol.takipci({ noktalar: noktalar, tolerans: 80, pencere: 32, yakalama: 140 });
      var ig = api.sprite(igne(), noktalar[0].x, noktalar[0].y, 200);
      var ucX = 100, gorunen = { x: noktalar[0].x, y: noktalar[0].y };

      return new Promise(function (coz) {
        var kaldir = [];
        kaldir.push(api.olay(api.alan, 'pointerdown', function (e) {
          if (takip.basla(e.pointerId, api.nokta(e))) {
            try { api.alan.setPointerCapture(e.pointerId); } catch (x) {}
          }
        }));
        kaldir.push(api.olay(api.alan, 'pointermove', function (e) {
          if (takip.hareket(e.pointerId, api.nokta(e)) && takip.indeks() % 12 === 0) Efekt.tik();
        }));
        function birak(e) { takip.birak(e.pointerId); }
        kaldir.push(api.olay(api.alan, 'pointerup', birak));
        kaldir.push(api.olay(api.alan, 'pointercancel', birak));

        api.talimat('dik_giris');
        api.ipucu(function () { api.elKaydir(noktalar.slice(0, Math.min(noktalar.length, 70)), 1500); });

        var d = api.dongu(function () {
          var b = takip.bas();
          gorunen.x += (b.x - gorunen.x) * 0.35;
          gorunen.y += (b.y - gorunen.y) * 0.35;
          // İğnenin ucu yolda, gövdesi geride kalsın
          var a = takip.aci() * Math.PI / 180;
          ig.a = takip.aci();
          ig.git(gorunen.x - Math.cos(a) * (ucX - 10), gorunen.y - Math.sin(a) * (ucX - 10));
          katman.doldur(takip.oran());
          if (takip.bitti()) {
            d.dur();
            kaldir.forEach(function (f) { f(); });
            api.ipucu(null);
            katman.doldur(1);
            T.oynat(terzi.ic, 'sek', 500);
            api.kutla(X2, SEAM, 30);
            api.tween(300, function (t) { ig.el.style.opacity = 1 - t; }).then(function () {
              ig.el.remove();
              return api.aferin();
            }).then(function () {
              katman.el.classList.add('dikildi');
              coz();
            });
          }
        });
      }).then(function () {
        // Dikilen iz kalır, sonraki tur için yol katmanı soluklaşır
        katman.el.style.opacity = '.35';
        return tur(i + 1);
      });
    }

    tur(0).then(function () {
      // Yapraklar kapanıp yaprak yuva olur; içinde yavrular
      var ust = yaprakSvg.querySelector('.ust-yaprak'), alt = yaprakSvg.querySelector('.alt-yaprak');
      [].slice.call(api.alan.querySelectorAll('svg')).forEach(function (s) { if (s !== yaprakSvg && !s.closest('.sprite')) s.style.opacity = '0'; });
      return api.tween(900, function (t) {
        ust.setAttribute('transform', 'translate(0 ' + (t * 60) + ')');
        alt.setAttribute('transform', 'translate(0 ' + (-t * 60) + ')');
      }, T.kolay.gircik);
    }).then(function () {
      var yuva = api.sprite('gorsel/is-bebek.webp', 960, 680, 60);
      api.tween(600, function (t) { yuva.el.style.width = (60 + t * 280) + 'px'; }, T.kolay.zipla);
      Efekt.kutlama();
      return api.soyle('dik_bilgi');
    }).then(function () { return api.soyle('dik_son'); })
      .then(function () { api.bitti({}); });
  }
});
