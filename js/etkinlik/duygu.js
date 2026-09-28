/* Duygular — kılavuz 9 (Çorap Karıncalar: karıncanın yüzünü farklı
   duygularda çizmek; mutlu, üzgün, şaşkın, yorgun; duygunun sebebini
   konuşmak).

   Önce yüz bulma, sonra "karınca şunu yaşadı, nasıl hisseder?" ve en sonda
   "sen bugün nasıl hissediyorsun?" Son soruda yanlış yok. */

T.etkinlik({
  kod: 'duygu',
  ad: 'Duygular',
  kaynak: 'Kılavuz 9',
  ikon: 'gorsel/ik-duygu.webp',
  arka: 'gorsel/arka-zemin.webp',
  sesler: ['duy_giris', 'duy_mutlu', 'duy_uzgun', 'duy_saskin', 'duy_yorgun', 'duy_cilek', 'duy_yagmur', 'duy_cekirge', 'duy_tasidi', 'duy_sen', 'duy_tesekkur'],

  kur: function (api) {
    var DUYGULAR = ['mutlu', 'uzgun', 'saskin', 'yorgun'];
    var ETIKET = { mutlu: 'Mutlu', uzgun: 'Üzgün', saskin: 'Şaşkın', yorgun: 'Yorgun' };
    var kartlar = [];
    var sahne = null;

    function temizle() {
      kartlar.forEach(function (k) { k.remove(); });
      kartlar = [];
      if (sahne) { sahne.remove(); sahne = null; }
    }

    function yuzler(liste, gen, y) {
      var ara = gen + 60;
      return liste.map(function (d, j) {
        var x = 960 + (j - (liste.length - 1) / 2) * ara;
        return api.kart({ x: x, y: y, w: gen, h: gen + 40, icerik: Cizim.yuz(d), etiket: ETIKET[d], sinif: 'yuz-kart' });
      });
    }

    /* 1. Yüzü bul: hedef + iki farklı duygu */
    function bul(i, sira) {
      if (i >= sira.length) return Promise.resolve();
      temizle();
      var hedef = sira[i];
      var secenek = T.karistir([hedef].concat(T.karistir(DUYGULAR.filter(function (d) { return d !== hedef; })).slice(0, 2)));
      kartlar = yuzler(secenek, 300, 760);
      api.talimat('duy_' + hedef);
      return api.secim(kartlar, secenek.indexOf(hedef)).then(function () { return api.aferin(); })
        .then(function () { return bul(i + 1, sira); });
    }

    /* 2. Ne yaşadı, nasıl hisseder? */
    function durumCiz(ad) {
      sahne = T.el('div', 'durum', api.alan);
      var ant = T.sprite('gorsel/karinca-on.webp', 860, 450, 170, sahne);
      if (ad === 'cilek') {
        T.sprite('gorsel/cilek.webp', 1080, 450, 230, sahne);
      } else if (ad === 'yagmur') {
        T.sprite('gorsel/is-kapi.webp', 1080, 470, 210, sahne);
        var bulut = T.el('div', 'kucuk-bulut', sahne);
        bulut.appendChild(Cizim.svg('<svg viewBox="0 0 400 220"><path d="M80 150a60 60 0 0 1 10-118 80 80 0 0 1 150-10 62 62 0 0 1 90 58 50 50 0 0 1-20 70z" fill="#fff" stroke="#BFD6E6" stroke-width="8"/>' +
          [70, 130, 190, 250, 310].map(function (x, i) { return '<path d="M' + x + ' ' + (178 + (i % 2) * 14) + ' q-8 16 0 24 q8-8 0-24z" fill="#5FB2F0"/>'; }).join('') + '</svg>'));
      } else if (ad === 'cekirge') {
        var c = T.sprite('gorsel/bocek-cekirge.webp', 1090, 420, 200, sahne);
        api.tween(700, function (t) { c.git(1090, 420 - Math.sin(t * Math.PI) * 90); });
      } else if (ad === 'tasidi') {
        ant.el.remove();
        T.sprite('gorsel/rol-isci.webp', 960, 450, 190, sahne);
      }
    }

    function durum(i) {
      var DURUMLAR = [['cilek', 'mutlu'], ['yagmur', 'uzgun'], ['cekirge', 'saskin'], ['tasidi', 'yorgun']];
      if (i >= DURUMLAR.length) return Promise.resolve();
      temizle();
      durumCiz(DURUMLAR[i][0]);
      var sira = T.karistir(DUYGULAR);
      kartlar = yuzler(sira, 260, 820);
      api.talimat('duy_' + DURUMLAR[i][0]);
      return api.secim(kartlar, sira.indexOf(DURUMLAR[i][1])).then(function () { return api.aferin(); })
        .then(function () { return durum(i + 1); });
    }

    /* 3. Sen nasılsın? Her cevap doğru. */
    function sen() {
      temizle();
      kartlar = yuzler(DUYGULAR, 260, 780);
      api.talimat('duy_sen');
      return new Promise(function (coz) {
        var bitti = false;
        kartlar.forEach(function (k) {
          api.dokun(k, function () {
            if (bitti) return;
            bitti = true;
            api.ipucu(null);
            kartlar.forEach(function (x) { if (x !== k) x.classList.add('pasif'); });
            k.classList.add('dogru');
            Efekt.dogru();
            api.soyle('duy_tesekkur').then(coz);
          });
        });
      });
    }

    api.soyle('duy_giris')
      .then(function () { return bul(0, T.karistir(DUYGULAR)); })
      .then(function () { return durum(0); })
      .then(sen)
      .then(function () { return api.bekle(400); })
      .then(function () { api.bitti({}); });
  }
});
