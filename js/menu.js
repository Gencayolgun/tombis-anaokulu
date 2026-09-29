/* Tombiş — Karınca Yuvası: giriş, oyun haritası ve final.

   Oyun Tombiş evreninde geçer: Çemberbahçe'nin Tohum Çayırı'nın altındaki
   Karınca Yuvası. Karışkan yuvadaki her şeyi karıştırmıştır; her oyun bir
   şeyi yerine koyar. Finalde Karışkan da yardım eder. */

(function () {
  var GORSELLER = [
    'arka-cayir', 'arka-yuva', 'arka-zemin', 'tombis-selam', 'tombis-sevinc', 'tombis-dusun',
    'kariskan-ufle', 'kariskan-uzgun', 'kariskan-it', 'karinca-on', 'karinca-yan', 'karinca-siyah',
    'rol-ciftci', 'rol-terzi', 'rol-bekci', 'rol-isci', 'rol-kralice', 'rol-bakici',
    'is-mantar', 'is-dikis', 'is-kapi', 'is-kiler', 'is-taht', 'is-bebek', 'cilek', 'yaprak',
    'bocek-ugur', 'bocek-cekirge', 'bocek-yusufcuk', 'bocek-sinek', 'bocek-yaprak', 'bocek-asker',
    'ik-vucut', 'ik-kactane', 'ik-ciz', 'ik-oruntu', 'ik-meslek', 'ik-terzi', 'ik-yol', 'ik-hareket',
    'ik-flut', 'ik-mutfak', 'ik-duygu', 'ik-masal', 'ik-renk', 'ik-sagsol', 'ik-tasima', 'ik-final'
  ];

  function onYukle() {
    return Promise.all(GORSELLER.map(function (ad) {
      return new Promise(function (coz) {
        var i = new Image();
        i.onload = i.onerror = coz;
        i.src = 'gorsel/' + ad + '.webp';
      });
    }));
  }

  /* ——— Giriş ——— */

  T.girisAc = function () {
    T.sahneAc(function (api) {
      T.rehberGoster(false);
      var a = api.alan;

      var alt = T.el('div', 'baslik-yazi', a, 'Tombiş ile Çemberbahçe\'de');
      alt.style.left = '960px';
      alt.style.top = '300px';
      alt.style.fontSize = '96px';

      var tombis = api.sprite('gorsel/tombis-selam.webp', 470, 770, 360);
      var karincalar = [
        api.sprite('gorsel/rol-isci.webp', 1360, 800, 170),
        api.sprite('gorsel/rol-kralice.webp', 1560, 760, 200),
        api.sprite('gorsel/rol-ciftci.webp', 1750, 820, 160)
      ];
      var kariskan = api.sprite('gorsel/kariskan-ufle.webp', 2200, 560, 260);

      var hazirlaniyor = T.el('div', 'kucuk-not', a, 'Hazırlanıyor…');
      hazirlaniyor.style.left = '900px';
      hazirlaniyor.style.top = '780px';

      // Tombiş hafifçe nefes alsın
      api.dongu(function (dt, t) {
        tombis.o = 1 + Math.sin(t / 500) * 0.015;
        tombis.ciz();
      });

      onYukle().then(function () {
        if (!api.canli()) return;
        hazirlaniyor.remove();
        var hikayeler = null;
        var basla = api.dugme({ x: window.Hikaye ? 840 : 960, y: 780, ikon: 'oynat', etiket: 'Başla', fn: function () {
          basla.remove();
          if (hikayeler) hikayeler.remove();
          Efekt.ac();
          if (!(document.fullscreenElement || document.webkitFullscreenElement)) T.tamEkran();
          hikaye();
        } });
        basla.classList.add('sek');
        // Haftalık seçmeli çizgi filmler, doğrudan giriş sayfasından
        if (window.Hikaye) {
          hikayeler = api.dugme({ x: 1100, y: 780, ikon: 'kitap', sinif: 'mavi', etiket: 'Hikâyeler', fn: function () {
            Efekt.ac();
            Efekt.pop();
            if (!(document.fullscreenElement || document.webkitFullscreenElement)) T.tamEkran();
            Hikaye.menuAc();
          } });
        }
      });

      function hikaye() {
        T.dugme('ev').hidden = false;
        tombis.ic.src = 'gorsel/tombis-selam.webp';
        api.soyle('giris_1')
          .then(function () {
            // Karışkan gelir, üfler, karıncalar dağılır
            Efekt.hisir();
            return api.tween(900, function (t) { kariskan.git(2200 - t * 1150, 560 - Math.sin(t * Math.PI) * 80); }, T.kolay.cik);
          })
          .then(function () {
            api.kutla(1050, 560, 40);
            Efekt.ruzgar();
            karincalar.forEach(function (k, i) {
              var x0 = k.x, y0 = k.y;
              api.tween(900, function (t) { k.a = t * (i % 2 ? -200 : 220); k.git(x0 + t * (i - 1) * 120, y0 - Math.sin(t * Math.PI) * 140); });
            });
            tombis.ic.src = 'gorsel/tombis-dusun.webp';
            return api.soyle('giris_2');
          })
          .then(function () {
            return api.tween(700, function (t) { kariskan.git(1050 + t * 1200, 560 - t * 200); }, T.kolay.gir);
          })
          .then(function () { return api.bekle(300); })
          .then(function () { T.menuAc(); });
      }
    }, null);
  };

  /* ——— Oyun haritası ——— */

  T.menuAc = function () {
    T.sahneAc(function (api) {
      var a = api.alan;
      var liste = T.etkinlikler();
      var biten = T.bitenler();
      var SUTUN = 5;
      T.el('div', 'menu-zemin', a);

      liste.forEach(function (e, i) {
        var s = i % SUTUN, r = Math.floor(i / SUTUN);
        var x = 960 + (s - (SUTUN - 1) / 2) * 345;
        var y = 400 + r * 238;
        var k = T.el('div', 'menu-kutu', a);
        k.style.left = x + 'px';
        k.style.top = y + 'px';
        var img = T.el('img', null, k);
        img.src = e.ikon;
        img.alt = '';
        img.draggable = false;
        T.el('div', 'ad', k, e.ad);
        T.el('div', 'kaynak', k, e.kaynak);
        if (biten.indexOf(e.kod) >= 0) {
          var t = T.el('div', 'tamam', k);
          t.appendChild(Cizim.ikon('tamam', '#fff', 3.4));
        }
        api.dokun(k, function () {
          Efekt.pop();
          T.oyna(e.kod);
        });
      });

      // Öğretmen için: kaç oyun bitti, yeni sınıf için sıfırla
      var not = T.el('div', 'kucuk-not', a, liste.length + ' oyunun ' + biten.filter(function (k) {
        return liste.some(function (e) { return e.kod === k; });
      }).length + ' tanesi tamamlandı');
      not.style.left = '40px';
      not.style.top = '1030px';

      var sifir = T.el('button', 'ikon-dugme', a);
      sifir.type = 'button';
      sifir.title = 'Yeni sınıf: işaretleri sıfırla';
      sifir.style.position = 'absolute';
      sifir.style.left = '1810px';
      sifir.style.top = '980px';
      sifir.appendChild(Cizim.ikon('sifirla'));
      var sor = null;
      api.dokun(sifir, function () {
        if (!sor) {
          sor = T.el('div', 'kucuk-not', a, 'Yeni sınıf için işaretler silinsin mi? Bir daha dokun.');
          sor.style.right = '130px';
          sor.style.top = '1005px';
          api.zamanla(3500, function () { if (sor) { sor.remove(); sor = null; } });
          return;
        }
        T.sifirla();
        T.menuAc();
      });

      // Haftalık seçmeli çizgi filmler
      if (window.Hikaye) {
        var hk = T.el('button', 'h-gecis-dugme', a, 'Hikâyeler');
        hk.type = 'button';
        api.dokun(hk, function () { Efekt.pop(); Hikaye.menuAc(); });
      }

      api.talimat('menu');
    }, null);
  };

  /* ——— Final: Karışkan da yardım ediyor ——— */

  T.finalAc = function () {
    T.sahneAc(function (api) {
      T.rehberGoster(false);
      var roller = ['rol-ciftci', 'rol-terzi', 'rol-bekci', 'rol-isci', 'rol-kralice', 'rol-bakici'];
      var cilek = api.sprite('gorsel/cilek.webp', 960, 720, 300);
      var tombis = api.sprite('gorsel/tombis-sevinc.webp', 960, 430, 300);
      var kariskan = api.sprite('gorsel/kariskan-it.webp', 2150, 480, 260);
      roller.forEach(function (r, i) {
        var x = i < 3 ? 250 + i * 190 : 1290 + (i - 3) * 190;
        var s = api.sprite('gorsel/' + r + '.webp', x, 1300, 180);
        api.bekle(i * 160).then(function () {
          return api.tween(700, function (t) { s.git(x, 1300 - t * 450); }, T.kolay.zipla);
        });
      });
      api.dongu(function (dt, t) {
        tombis.y = 430 - Math.abs(Math.sin(t / 300)) * 40;
        tombis.ciz();
      });
      api.bekle(1200).then(function () {
        Efekt.hisir();
        return api.tween(1000, function (t) { kariskan.git(2150 - t * 520, 480); }, T.kolay.cik);
      }).then(function () {
        Efekt.kutlama();
        api.kutla(960, 520, 70);
        return api.soyle('final');
      }).then(function () {
        api.kutla(500, 600, 40);
        api.kutla(1420, 600, 40);
        api.dugme({ x: 960, y: 950, ikon: 'ev', sinif: 'sari kucuk', etiket: 'Oyunlar', fn: function () { T.menuAc(); } });
      });
      cilek.ic.classList.add('parla');
    }, { ad: 'Final', arka: 'gorsel/arka-cayir.webp' });
  };
})();
