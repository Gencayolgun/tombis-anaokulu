/* Örüntü — kitap s. 2 (boş alana doğru hayvanı yerleştir) · kılavuz 2
   ("Karınca mı uğur böceği mi?": boyalı taşlarla örüntü).

   Sınıfta boyanan taşlar burada da taş: kırmızı benekli uğur böceği taşı,
   siyah karınca taşı. Son turda kılavuzun önerdiği gibi yeni bir hayvan
   (çekirge) eklenir. */

T.etkinlik({
  kod: 'oruntu',
  ad: 'Örüntü',
  kaynak: 'Kitap s. 2 · Kılavuz 2',
  ikon: 'gorsel/ik-oruntu.webp',
  arka: 'gorsel/arka-zemin.webp',
  sesler: ['oru_giris', 'oru_soru', 'oru_son'],

  kur: function (api) {
    var TUR = { A: 'ugur', B: 'karinca', C: 'cekirge' };
    var TURLAR = [
      { dizi: 'ABAB', cevap: 'A' },
      { dizi: 'BABA', cevap: 'B' },
      { dizi: 'AABBA', cevap: 'A' },
      { dizi: 'ABBAB', cevap: 'B' },
      { dizi: 'AABAA', cevap: 'B' },
      { dizi: 'ABCAB', cevap: 'C' }
    ];
    var ARALIK = 232, SIRA_Y = 560;

    var sahne = T.el('div', 'oruntu', api.alan);

    function kutu(harf, x) {
      var d = T.el('div', 'tas-kutu', sahne);
      d.style.left = (x - 105) + 'px';
      d.style.top = (SIRA_Y - 95) + 'px';
      if (harf) d.appendChild(Cizim.tas(TUR[harf]));
      else {
        d.classList.add('bos-kutu');
        T.el('span', null, d, '?');
      }
      return d;
    }

    function tur(i) {
      if (i >= TURLAR.length) return bitir();
      var t = TURLAR[i];
      sahne.innerHTML = '';
      var n = t.dizi.length + 1;
      var x0 = 960 - (n - 1) * ARALIK / 2;
      var kutular = [];
      for (var j = 0; j < t.dizi.length; j++) kutular.push(kutu(t.dizi[j], x0 + j * ARALIK));
      var bos = kutu(null, x0 + t.dizi.length * ARALIK);
      kutular.forEach(function (k, j) { k.style.animationDelay = (j * 0.08) + 's'; k.classList.add('gir'); });

      var secenekler = t.dizi.indexOf('C') >= 0 ? ['A', 'B', 'C'] : ['A', 'B'];
      secenekler = T.karistir(secenekler);
      var kartlar = secenekler.map(function (h, j) {
        var x = 960 + (j - (secenekler.length - 1) / 2) * 330;
        return api.kart({ x: x, y: 880, w: 260, h: 220, icerik: Cizim.tas(TUR[h]), ebeveyn: sahne });
      });

      api.talimat(i === 0 ? 'oru_giris' : 'oru_soru');
      return api.secim(kartlar, secenekler.indexOf(t.cevap)).then(function (k) {
        // Seçilen taş boşluğa uçar
        var kaynak = kartlar[k];
        var r1 = { x: parseFloat(kaynak.style.left) + 130, y: parseFloat(kaynak.style.top) + 110 };
        var r2 = { x: parseFloat(bos.style.left) + 105, y: SIRA_Y };
        var ucan = T.sprite(Cizim.tas(TUR[t.cevap]), r1.x, r1.y, 200, sahne);
        Efekt.pop();
        return api.tween(550, function (o) {
          ucan.git(r1.x + (r2.x - r1.x) * o, r1.y + (r2.y - r1.y) * o - Math.sin(o * Math.PI) * 160);
        }, T.kolay.gircik).then(function () {
          ucan.el.remove();
          bos.classList.remove('bos-kutu');
          bos.innerHTML = '';
          bos.appendChild(Cizim.tas(TUR[t.cevap]));
          kutular.push(bos);
          // Örüntüyü ritimle "okuyalım": her taş sırayla zıplar
          kutular.forEach(function (kt, j) {
            api.zamanla(j * 260, function () { T.oynat(kt, 'sek', 450); Efekt.tik(); });
          });
          return api.bekle(kutular.length * 260 + 200);
        });
      }).then(function () { return api.aferin(); })
        .then(function () { return tur(i + 1); });
    }

    function bitir() {
      api.ipucu(null);
      return api.soyle('oru_son').then(function () { api.bitti({}); });
    }

    tur(0);
  }
});
