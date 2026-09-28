/* Kaç Tane? — kılavuz 1 ("Kaç tane" halka oyunu: 1, 2, 6, 0) ve
   kılavuz 11 (insan ile karıncanın vücut karşılaştırma tablosu).

   Sınıfta bahçeye çizilen halkalar burada tahtada: 0, 1, 2, 6. Tombiş sorar,
   çocuk doğru halkaya dokunur; cevap "Sen / Karınca" tablosuna yazılır. */

T.etkinlik({
  kod: 'kactane',
  ad: 'Kaç Tane?',
  kaynak: 'Kılavuz 1, 11',
  ikon: 'gorsel/ik-kactane.webp',
  arka: 'gorsel/arka-zemin.webp',
  sesler: ['kac_giris', 'kac_karinca_goz', 'kac_sen_goz', 'kac_karinca_bacak', 'kac_sen_ayak', 'kac_karinca_anten', 'kac_sen_anten', 'kac_son', 'sayi_0', 'sayi_1', 'sayi_2', 'sayi_6'],

  kur: function (api) {
    var X = { ikon: 700, sen: 950, karinca: 1210 };
    var BASLIK_Y = 322, SATIR_Y = [444, 548, 652];
    var SAYILAR = [0, 1, 2, 6];

    // ——— Tablo ———
    var senBas = api.kart({ x: X.sen, y: BASLIK_Y, w: 230, h: 120, sinif: 'tablo-baslik', icerik: Cizim.cocuk(), etiket: 'Sen' });
    var karBas = api.kart({ x: X.karinca, y: BASLIK_Y, w: 230, h: 120, sinif: 'tablo-baslik', resim: 'gorsel/karinca-on.webp', etiket: 'Karınca' });
    [senBas, karBas].forEach(function (k) { k.style.pointerEvents = 'none'; });

    var hucre = {};
    ['goz', 'ayak', 'anten'].forEach(function (ad, r) {
      var ik = api.kart({ x: X.ikon, y: SATIR_Y[r], w: 150, h: 92, sinif: 'hucre', icerik: Cizim.tabloIkon(ad) });
      ik.style.pointerEvents = 'none';
      hucre[r] = {
        sen: api.kart({ x: X.sen, y: SATIR_Y[r], w: 230, h: 92, sinif: 'hucre' }),
        karinca: api.kart({ x: X.karinca, y: SATIR_Y[r], w: 230, h: 92, sinif: 'hucre' })
      };
      hucre[r].sen.style.pointerEvents = 'none';
      hucre[r].karinca.style.pointerEvents = 'none';
    });

    // ——— Halkalar ———
    var halkalar = SAYILAR.map(function (n, i) {
      return api.kart({ x: 510 + i * 300, y: 890, w: 250, h: 250, sinif: 'saydam', icerik: Cizim.halka(n) });
    });

    var SORULAR = [
      { ses: 'kac_karinca_goz', satir: 0, kim: 'karinca', cevap: 2 },
      { ses: 'kac_sen_goz', satir: 0, kim: 'sen', cevap: 2 },
      { ses: 'kac_karinca_bacak', satir: 1, kim: 'karinca', cevap: 6 },
      { ses: 'kac_sen_ayak', satir: 1, kim: 'sen', cevap: 2 },
      { ses: 'kac_karinca_anten', satir: 2, kim: 'karinca', cevap: 2 },
      { ses: 'kac_sen_anten', satir: 2, kim: 'sen', cevap: 0 }
    ];

    function hucreYaz(k, n) {
      k.innerHTML = '';
      var s = T.el('span', 'hucre-sayi', k, String(n));
      var noktalar = T.el('span', 'hucre-noktalar', k);
      for (var i = 0; i < n; i++) T.el('i', null, noktalar);
      if (n === 0) T.el('i', 'bos', noktalar);
      T.oynat(k, 'sek', 500);
      return s;
    }

    function sor(i) {
      if (i >= SORULAR.length) return bitir();
      var s = SORULAR[i];
      var hedef = hucre[s.satir][s.kim];
      hedef.classList.add('aktif');
      (s.kim === 'sen' ? senBas : karBas).classList.add('aktif');
      api.talimat(s.ses);
      return api.secim(halkalar, SAYILAR.indexOf(s.cevap)).then(function () {
        hedef.classList.remove('aktif');
        senBas.classList.remove('aktif');
        karBas.classList.remove('aktif');
        hucreYaz(hedef, s.cevap);
        Efekt.dogru();
        T.rehberPoz('sevinc');
        return api.say(s.cevap);
      }).then(function () {
        return i % 2 ? api.aferin() : api.bekle(300);
      }).then(function () {
        halkalar.forEach(function (h) { h.classList.remove('dogru'); });
        return sor(i + 1);
      });
    }

    function bitir() {
      api.ipucu(null);
      return api.soyle('kac_son').then(function () { api.bitti({}); });
    }

    api.soyle('kac_giris').then(function () { return sor(0); });
  }
});
