/* Karınca Yap — kılavuz 1 (Karıncaları Tanıyorum), 7 (büyük-küçük-büyük
   karınca) · kitap s. 11 (vücut üç bölüm, iki anten, altı bacak).

   Kocaman bir karıncanın hayalet çizgileri parlıyor. Çocuk parlayan yere
   dokundukça parça gelir ve Tombiş sayar: üç parça, iki anten, altı bacak.
   Sıra serbest, yanlış yok. */

T.etkinlik({
  kod: 'vucut',
  ad: 'Karınca Yap',
  kaynak: 'Kılavuz 1, 7 · Kitap s. 11',
  ikon: 'gorsel/ik-vucut.webp',
  arka: 'gorsel/arka-zemin.webp',
  sesler: ['vuc_giris', 'vuc_anten', 'vuc_bacak', 'vuc_son', 'soh_kucuk', 'sayi_1', 'sayi_2', 'sayi_3', 'sayi_4', 'sayi_5', 'sayi_6'],

  kur: function (api) {
    var NS = 'http://www.w3.org/2000/svg';
    var W = 1040, MX = 960, MY = 700;
    var H = W * 100 / 140;

    var karinca = Cizim.karinca({});
    api.sprite(karinca.el, MX, MY, W);

    // Parçalar önce görünmez
    function bul(secici) { return [].slice.call(karinca.el.querySelectorAll(secici)); }
    bul('.karin, .bel, .gogus, .bas, .gozler, .anten, .bacak').forEach(function (p) {
      p.style.opacity = '0';
      p.style.transition = 'opacity .35s';
    });

    // Hayaletler aynı ölçüde üstte ayrı bir katmanda
    var ust = document.createElementNS(NS, 'svg');
    ust.setAttribute('viewBox', '0 0 140 100');
    api.sprite(ust, MX, MY, W);
    var kok = document.createElementNS(NS, 'g');
    kok.setAttribute('transform', 'translate(70 50)');
    ust.appendChild(kok);

    function sahneNoktasi(vx, vy) {
      return { x: MX - W / 2 + (vx + 70) * W / 140, y: MY - H / 2 + (vy + 50) * W / 140 };
    }

    function yap(etiket, nit) {
      var e = document.createElementNS(NS, etiket);
      for (var k in nit) e.setAttribute(k, nit[k]);
      kok.appendChild(e);
      return e;
    }

    /* Bir hayalet: görünen kesik çizgi + geniş, saydam dokunma alanı */
    function hayalet(tanim) {
      var gorunen, alan, merkez;
      if (tanim.elips) {
        var e = tanim.elips;
        gorunen = yap('ellipse', { cx: e[0], cy: e[1], rx: e[2], ry: e[3], fill: 'rgba(255,255,255,.5)', stroke: '#fff', 'stroke-width': 1.6, 'stroke-dasharray': '3 2.2', 'class': 'hayalet' });
        alan = yap('ellipse', { cx: e[0], cy: e[1], rx: e[2] + 5, ry: e[3] + 5, fill: 'transparent', 'class': 'dokunma' });
        merkez = sahneNoktasi(e[0], e[1]);
      } else {
        gorunen = yap('path', { d: tanim.d, fill: 'none', stroke: '#fff', 'stroke-width': 2.4, 'stroke-dasharray': '3 2.4', 'stroke-linecap': 'round', 'class': 'hayalet' });
        alan = yap('path', { d: tanim.d, fill: 'none', stroke: 'transparent', 'stroke-width': 17, 'stroke-linecap': 'round', 'class': 'dokunma' });
        var n = gorunen.getPointAtLength(gorunen.getTotalLength() * 0.6);
        merkez = sahneNoktasi(n.x, n.y);
      }
      return { gorunen: gorunen, alan: alan, merkez: merkez, goster: tanim.goster, tamam: false };
    }

    var anten = bul('.anten');
    var bacak = bul('.bacak');
    var ADIMLAR = [
      { ses: 'vuc_giris', parcalar: [
        { elips: [-33, 0, 25, 19], goster: bul('.karin') },
        { elips: [2, 0, 12.5, 9.5], goster: bul('.gogus, .bel') },
        { elips: [25, 0, 14.5, 13.5], goster: bul('.bas, .gozler') }
      ] },
      { ses: 'vuc_anten', parcalar: anten.map(function (a) { return { d: a.querySelector('path').getAttribute('d'), goster: [a] }; }) },
      { ses: 'vuc_bacak', parcalar: bacak.map(function (b) { return { d: b.getAttribute('d'), goster: [b] }; }) }
    ];

    function adim(i) {
      var tanim = ADIMLAR[i];
      var liste = tanim.parcalar.map(hayalet);
      var sayac = 0;
      api.talimat(tanim.ses);
      api.ipucu(function () {
        for (var j = 0; j < liste.length; j++) {
          if (!liste[j].tamam) { api.el(liste[j].merkez.x, liste[j].merkez.y); return; }
        }
      });
      return new Promise(function (coz) {
        liste.forEach(function (h) {
          api.dokun(h.alan, function () {
            if (h.tamam) return;
            h.tamam = true;
            h.gorunen.remove();
            h.alan.remove();
            h.goster.forEach(function (p) { p.style.opacity = '1'; });
            sayac++;
            Efekt.pop();
            api.say(sayac);
            if (sayac === liste.length) api.bekle(1100).then(coz);
          });
        });
      });
    }

    adim(0)
      .then(function () { return adim(1); })
      .then(function () { return adim(2); })
      .then(function () {
        api.ipucu(null);
        // Karınca canlanır: yerinde yürür, antenlerini oynatır
        api.dongu(function (dt) { karinca.adim(dt, 9); });
        Efekt.kutlama();
        api.kutla(MX, MY - 100, 40);
        T.rehberPoz('sevinc', 2500);
        return api.soyle('vuc_son');
      })
      .then(function () { return api.bekle(500); })
      .then(function () { api.bitti({ sohbet: 'soh_kucuk' }); });
  }
});
