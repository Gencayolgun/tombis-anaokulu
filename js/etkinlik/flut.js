/* Uzundan Kısaya — kılavuz 6 (Karınca Olsam: pipetleri uzundan kısaya
   sıralayıp pan flüt yapma).

   Karışık duran beş pipetten her seferinde en uzununu bulmak: sıralamanın
   4 yaş için en kolay yolu. Pipetler sırayla flüte dizilir, sonunda her
   pipet bir nota çalar; uzun pipet kalın, kısa pipet ince ses. */

T.etkinlik({
  kod: 'flut',
  ad: 'Uzundan Kısaya',
  kaynak: 'Kılavuz 6',
  ikon: 'gorsel/ik-flut.webp',
  arka: 'gorsel/arka-zemin.webp',
  sesler: ['flu_giris', 'flu_sonraki', 'flu_uzun_degil', 'flu_cal'],

  kur: function (api) {
    var ZEMIN = 990;
    var PIPETLER = [
      { renk: '#E23B2E', boy: 430, nota: 523.25 },
      { renk: '#F5891F', boy: 360, nota: 587.33 },
      { renk: '#FFC928', boy: 290, nota: 659.25 },
      { renk: '#43B15A', boy: 220, nota: 783.99 },
      { renk: '#2F8FE0', boy: 150, nota: 880.0 }
    ];

    var raf = T.el('div', 'raf', api.alan);
    raf.style.top = ZEMIN + 'px';
    var yerler = T.el('div', 'flut-yeri', api.alan);
    for (var y = 0; y < 5; y++) {
      var iz = T.el('div', 'flut-iz', yerler);
      iz.style.left = (1170 + y * 118 - 48) + 'px';
    }

    function yerlestir(p, x) {
      p.x = x;
      p.el.style.left = (x - 55) + 'px';
      p.el.style.top = (ZEMIN - p.boy - 20) + 'px';
    }

    var karisik = T.karistir(PIPETLER.map(function (p, i) { return i; }));
    // Karışık sıra zaten sıralı çıkarsa bir kez daha karıştır
    while (karisik.join() === '0,1,2,3,4') karisik = T.karistir(karisik);

    var pipetler = PIPETLER.map(function (t, i) {
      var el = T.el('div', 'pipet', api.alan);
      el.appendChild(Cizim.pipet(t.renk, t.boy));
      el.style.width = '110px';
      el.style.height = (t.boy + 20) + 'px';
      var p = { el: el, boy: t.boy, nota: t.nota, i: i, dizildi: false };
      yerlestir(p, 320 + karisik.indexOf(i) * 150);
      return p;
    });

    function enUzun() {
      var kalan = pipetler.filter(function (p) { return !p.dizildi; });
      return kalan.length ? kalan[0] : null; // PIPETLER uzundan kısaya
    }

    var sira = 0, ilkKez = true, sesli = false;

    function tasi(p) {
      var x0 = p.x, x1 = 1170 + sira * 118;
      var top0 = ZEMIN - p.boy - 20;
      sira++;
      return api.tween(600, function (t) {
        p.el.style.left = (x0 + (x1 - x0) * t - 55) + 'px';
        p.el.style.top = (top0 - Math.sin(t * Math.PI) * 140) + 'px';
      }, T.kolay.gircik).then(function () { yerlestir(p, x1); });
    }

    function cal(p) {
      Efekt.nota(p.nota, 0.55);
      T.oynat(p.el, 'sek', 400);
    }

    var bitti = false;
    function siralamaBitti() {
      api.ipucu(null);
      var bant = T.el('div', 'bant', api.alan);
      bant.style.left = '1110px';
      bant.style.top = (ZEMIN - 130) + 'px';
      T.oynat(bant, 'sek', 400);
      // Önce Tombiş çalıp gösterir
      var gam = [0, 1, 2, 3, 4, 3, 2, 1, 0];
      gam.forEach(function (j, k) { api.zamanla(500 + k * 330, function () { cal(pipetler[j]); }); });
      api.bekle(500 + gam.length * 330 + 300).then(function () {
        sesli = true;
        api.talimat('flu_cal');
        var b = api.dugme({ x: 640, y: 780, ikon: 'tamam', sinif: 'yesil kucuk', etiket: 'Bitti', fn: function () {
          if (bitti) return;
          bitti = true;
          b.remove();
          api.kutla(1400, 700, 50);
          api.bitti({});
        } });
      });
    }

    pipetler.forEach(function (p) {
      api.dokun(p.el, function () {
        if (sesli) { cal(p); return; }
        if (p.dizildi) { cal(p); return; }
        var dogru = enUzun();
        if (p === dogru) {
          p.dizildi = true;
          Efekt.nota(p.nota, 0.4);
          tasi(p).then(function () {
            if (!enUzun()) return siralamaBitti();
            if (ilkKez) { ilkKez = false; api.talimat('flu_sonraki'); }
            else { Efekt.dogru(); T.rehberPoz('sevinc'); }
          });
        } else {
          T.oynat(p.el, 'salla', 520);
          Efekt.yanlis();
          T.rehberPoz('dusun', 2000);
          api.soyle('flu_uzun_degil');
        }
      });
    });

    api.talimat('flu_giris');
    api.ipucu(function () {
      var p = enUzun();
      if (p) api.el(p.x, ZEMIN - p.boy / 2);
    });
  }
});
