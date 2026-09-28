/* Birlikte Taşıyalım — kitap s. 3 ("Acil bir durum olduğunda hep bir araya
   toplanırız"), s. 4 ("Birbirimize yardım ederiz", "Senin taşıyabildiğin en
   ağır yük neydi?") · kılavuz 4 (iş birliği, su taşıma oyunu).

   Sınıfın son oyunu. Çocuklar tahtaya dokundukça karıncalar çileğin
   yanına koşar, Tombiş sayar. Dokuz karınca yetmez; Karışkan da yardıma
   gelir ve hep birlikte çilek yuvaya taşınır. Birden çok çocuk aynı anda
   dokunabilir. */

T.etkinlik({
  kod: 'tasima',
  ad: 'Birlikte Taşıyalım',
  kaynak: 'Kitap s. 3, 4 · Kılavuz 4',
  ikon: 'gorsel/ik-tasima.webp',
  arka: 'gorsel/arka-cayir.webp',
  sesler: ['tas_giris', 'tas_kariskan', 'tas_hep', 'tas_son', 'soh_yuk', 'sayi_1', 'sayi_2', 'sayi_3', 'sayi_4', 'sayi_5', 'sayi_6', 'sayi_7', 'sayi_8', 'sayi_9', 'sayi_10'],

  kur: function (api) {
    var CX = 820, CY = 800;
    var YUVA = { x: 1640, y: 620 };
    var arkaSira = T.el('div', 'kat', api.alan);
    var cilek = api.sprite('gorsel/cilek.webp', CX, CY, 330);
    var onSira = T.el('div', 'kat', api.alan);

    // Dokuz yer: dört arkada (çileğin arkasında), beş önde
    var YERLER = [
      { x: -170, y: 150, on: true }, { x: -85, y: 165, on: true }, { x: 0, y: 172, on: true }, { x: 85, y: 165, on: true }, { x: 170, y: 150, on: true },
      { x: -210, y: 70, on: false }, { x: -120, y: 100, on: false }, { x: 120, y: 100, on: false }, { x: 210, y: 70, on: false }
    ];
    var gelenler = [];
    var toplanma = true, sayac = 0;
    var sonDokunus = {};

    function karincaGetir(p) {
      if (!toplanma || sayac >= YERLER.length) return;
      var yer = YERLER[sayac];
      sayac++;
      var hedef = { x: CX + yer.x, y: CY + yer.y };
      var resim = sayac % 3 === 0 ? 'gorsel/karinca-siyah.webp' : 'gorsel/karinca-yan.webp';
      var s = api.sprite(resim, p.x, p.y, 150, null, yer.on ? onSira : arkaSira);
      s.ic.style.transform = hedef.x > p.x ? 'scaleX(-1)' : '';
      s.o = 0.3;
      s.ciz();
      var a = { s: s, dx: yer.x, dy: yer.y };
      gelenler.push(a);
      Efekt.pop();
      api.say(sayac);
      var x0 = p.x, y0 = p.y;
      api.tween(900, function (t) {
        s.o = Math.min(1, 0.3 + t * 2);
        s.git(x0 + (hedef.x - x0) * t, y0 + (hedef.y - y0) * t - Math.abs(Math.sin(t * Math.PI * 4)) * 12);
      }, T.kolay.cik).then(function () {
        s.ic.style.transform = 'scaleX(-1)';
        T.oynat(cilek.el, 'salla', 520);
        if (a === gelenler[YERLER.length - 1]) kariskanGelir();
      });
    }

    api.olay(api.alan, 'pointerdown', function (e) {
      var p = api.nokta(e);
      if (p.y < 360) return;
      // Aynı parmağın çift sayılmasını önle
      var simdi = Date.now();
      if (sonDokunus[e.pointerId] && simdi - sonDokunus[e.pointerId] < 220) return;
      sonDokunus[e.pointerId] = simdi;
      karincaGetir(p);
    });

    api.talimat('tas_giris');
    api.ipucu(function () { api.el(CX - 300, CY - 40); });

    function kariskanGelir() {
      toplanma = false;
      api.ipucu(null);
      // Dokuz karınca çekiyor, çilek yerinden kıpırdıyor ama kalkmıyor
      api.bekle(500).then(function () {
        return api.tween(900, function (t) { cilek.y = CY - Math.abs(Math.sin(t * Math.PI * 3)) * 16; cilek.ciz(); });
      }).then(function () {
        T.rehberPoz('dusun', 2500);
        return api.soyle('tas_kariskan');
      }).then(function () {
        var k = api.sprite('gorsel/kariskan-it.webp', -300, CY - 30, 260);
        Efekt.hisir();
        return api.tween(1100, function (t) { k.git(-300 + t * (CX - 300 + 300 - 60), CY - 30 - Math.sin(t * Math.PI) * 120); }, T.kolay.cik)
          .then(function () { Efekt.pop(); return api.say(10); })
          .then(function () { return api.soyle('tas_hep'); })
          .then(function () { return tasi(k); });
      }).then(function () {
        Efekt.kutlama();
        api.kutla(YUVA.x, YUVA.y, 60);
        T.rehberPoz('sevinc', 3000);
        return api.soyle('tas_son');
      }).then(function () { api.bitti({ sohbet: 'soh_yuk' }); });
    }

    function tasi(k) {
      var kx0 = k.x, ky0 = k.y;
      var bas = gelenler.map(function (a) { return { x: a.s.x, y: a.s.y }; });
      return api.tween(3200, function (t, ham) {
        var x = CX + (YUVA.x - CX) * t, y = CY + (YUVA.y - CY) * t;
        var kalk = Math.min(1, ham * 5) * 60;
        var sek = Math.abs(Math.sin(ham * Math.PI * 12)) * 10;
        var olcek = 1 - Math.max(0, ham - 0.75) * 3.2;
        cilek.o = Math.max(0.05, olcek);
        cilek.git(x, y - kalk - sek);
        gelenler.forEach(function (a, j) {
          a.s.o = Math.max(0.05, olcek);
          a.s.git(bas[j].x + (x - CX) - sek * (j % 2), bas[j].y + (y - CY) - sek * ((j + 1) % 2));
        });
        k.o = Math.max(0.05, olcek);
        k.git(kx0 + (x - CX), ky0 + (y - CY) - kalk * 0.5);
      }, T.kolay.gircik).then(function () {
        cilek.el.style.opacity = '0';
        k.el.style.opacity = '0';
        gelenler.forEach(function (a) { a.s.el.style.opacity = '0'; });
      });
    }
  }
});
