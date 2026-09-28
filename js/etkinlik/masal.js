/* Masal Kartları — kitap s. 7 ("Masal kartlarını keserek masal
   oluşturalım") · kılavuz 10, 11 (karıncaların hikâyesi, hikâye sonrası
   canlandırma).

   Çocuklar üç böcek kartı seçer, kartlar masal şeridine dizilir. Tombiş
   masalı başlatır, her durakta sınıf devam ettirir; öğretmen ya da bir çocuk
   "ileri"ye dokununca bir sonraki kareye geçilir. Masalı çocuklar kurar. */

T.etkinlik({
  kod: 'masal',
  ad: 'Masal Kartları',
  kaynak: 'Kitap s. 7 · Kılavuz 10, 11',
  ikon: 'gorsel/ik-masal.webp',
  arka: 'gorsel/arka-cayir.webp',
  sesler: ['mas_giris', 'mas_ugur', 'mas_cekirge', 'mas_yusufcuk', 'mas_sinek', 'mas_yaprak', 'mas_asker', 'mas_hazir', 'mas_1', 'mas_2', 'mas_3', 'mas_4', 'mas_son'],

  kur: function (api) {
    var BOCEKLER = [
      { kod: 'ugur', ad: 'Uğur böceği' },
      { kod: 'cekirge', ad: 'Çekirge' },
      { kod: 'yusufcuk', ad: 'Yusufçuk' },
      { kod: 'sinek', ad: 'Sinek' },
      { kod: 'yaprak', ad: 'Yaprak böceği' },
      { kod: 'asker', ad: 'Asker böceği' }
    ];
    var YUVA_X = [420, 800, 1180, 1560], YUVA_Y = 470;

    T.el('div', 'masal-serit', api.alan);

    // Masal şeridi: ilk karede kahramanımız karınca
    var yuvalar = YUVA_X.map(function (x, i) {
      if (i === 0) return api.kart({ x: x, y: YUVA_Y, w: 260, h: 280, resim: 'gorsel/karinca-on.webp', etiket: 'Karınca', sinif: 'masal-kare' });
      var k = api.kart({ x: x, y: YUVA_Y, w: 260, h: 280, sinif: 'masal-kare bos-yuva' });
      T.el('span', 'yuva-no', k, String(i));
      return k;
    });
    yuvalar.forEach(function (k) { k.style.pointerEvents = 'none'; });
    [0, 1, 2].forEach(function (i) {
      var ok = T.el('div', 'masal-ok', api.alan);
      ok.style.left = (YUVA_X[i] + 190 - 60) + 'px';
      ok.style.top = (YUVA_Y - 30) + 'px';
      ok.appendChild(Cizim.ikon('ileri', '#fff', 3.2));
    });

    var secilen = [];
    var kartlar = BOCEKLER.map(function (b, j) {
      return api.kart({ x: 285 + j * 270, y: 870, w: 230, h: 250, resim: 'gorsel/bocek-' + b.kod + '.webp', etiket: b.ad });
    });

    function secim() {
      api.talimat('mas_giris');
      api.ipucu(function () {
        for (var j = 0; j < kartlar.length; j++) {
          if (!kartlar[j].classList.contains('pasif')) {
            api.el(parseFloat(kartlar[j].style.left) + 115, parseFloat(kartlar[j].style.top) + 125);
            return;
          }
        }
      });
      return new Promise(function (coz) {
        kartlar.forEach(function (k, j) {
          api.dokun(k, function () {
            if (k.classList.contains('pasif') || secilen.length >= 3) return;
            var b = BOCEKLER[j];
            secilen.push(b);
            k.classList.add('pasif');
            Efekt.pop();
            var hedef = yuvalar[secilen.length];
            var r1 = { x: parseFloat(k.style.left) + 115, y: parseFloat(k.style.top) + 110 };
            var r2 = { x: parseFloat(hedef.style.left) + 130, y: YUVA_Y - 10 };
            var ucan = api.sprite('gorsel/bocek-' + b.kod + '.webp', r1.x, r1.y, 170);
            var son = secilen.length === 3;
            api.tween(600, function (t) {
              ucan.git(r1.x + (r2.x - r1.x) * t, r1.y + (r2.y - r1.y) * t - Math.sin(t * Math.PI) * 180);
            }, T.kolay.gircik).then(function () {
              ucan.el.remove();
              hedef.classList.remove('bos-yuva');
              hedef.innerHTML = '';
              var img = T.el('img', null, hedef);
              img.src = 'gorsel/bocek-' + b.kod + '.webp';
              img.alt = '';
              T.el('div', 'etiket', hedef, b.ad);
              T.oynat(hedef, 'sek', 450);
            });
            api.soyle('mas_' + b.kod).then(function () { if (son) coz(); });
          });
        });
      });
    }

    function ileriBekle() {
      return new Promise(function (coz) {
        var b = api.dugme({ x: 960, y: 880, ikon: 'ileri', sinif: 'yesil kucuk', etiket: 'Devam', fn: function () {
          b.remove();
          Efekt.pop();
          coz();
        } });
      });
    }

    function kare(i, ses) {
      yuvalar.forEach(function (y) { y.classList.remove('anlatiliyor'); });
      if (i != null) {
        yuvalar[i].classList.add('anlatiliyor');
        T.oynat(yuvalar[i], 'sek', 450);
      }
      return api.soyle(ses);
    }

    secim().then(function () {
      api.ipucu(null);
      kartlar.forEach(function (k) { k.classList.add('gizli'); });
      api.talimat('mas_hazir');
      return new Promise(function (coz) {
        var oynat = api.dugme({ x: 960, y: 870, ikon: 'oynat', etiket: 'Masalı başlat', fn: function () { oynat.remove(); coz(); } });
      });
    })
      .then(function () { return kare(0, 'mas_1'); })
      .then(ileriBekle)
      .then(function () { return kare(1, 'mas_2'); })
      .then(ileriBekle)
      .then(function () { return kare(2, 'mas_3'); })
      .then(ileriBekle)
      .then(function () { return kare(3, 'mas_4'); })
      .then(ileriBekle)
      .then(function () {
        yuvalar.forEach(function (y, i) { api.zamanla(i * 180, function () { T.oynat(y, 'sek', 450); }); });
        api.kutla(960, 470, 50);
        return kare(null, 'mas_son');
      })
      .then(function () { api.bitti({}); });
  }
});
