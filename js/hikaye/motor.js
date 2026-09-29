/* Tombiş'in Hikâyeleri — seçmeli çizgi film motoru.

   Her hafta bir bölüm. Bölüm sahnelerden oluşur; her sahne bir işlev ve
   bir sonraki sahnenin adını (Promise ile) döndürür. Hikâye durduğunda
   iki resimli bir seçim çıkar; sınıf el kaldırarak oylar, bir çocuk
   dokunur ve hikâye o yöne akar. Aralarda sayma, dikkat, hareket ve sohbet
   molaları var: bir bölüm yaklaşık 30-35 dakikalık bir dersi doldurur.

   Hikaye.hafta({...}) ile bölüm kaydedilir, Hikaye.ac(no) ile açılır.
   Sahne işlevine gelen h nesnesinin yardımcıları dosyanın ortasında.

   KURAL: Karışkan konuşmaz, yalnızca ses çıkarır. Konuşanı metin
   anahtarının ilk harfi söyler (t_ Tombiş, k_ Kökçe, p_ Pırıltı). */

window.Hikaye = (function () {
  var G = 1920, Y = 1080;
  var haftalar = [];
  var KISI = { t: 'tombis', k: 'kokce', p: 'pirilti', c: 'cingoz' };

  var POZ = {
    tombis: {
      selam: 'gorsel/tombis-selam.webp', sevinc: 'gorsel/tombis-sevinc.webp', dusun: 'gorsel/tombis-dusun.webp',
      yuru: 'hikaye/gorsel/t-yuru.webp', dus: 'hikaye/gorsel/t-dus.webp', agla: 'hikaye/gorsel/t-agla.webp',
      sarili: 'hikaye/gorsel/t-sarili.webp', topal: 'hikaye/gorsel/t-topal.webp', kizak: 'hikaye/gorsel/t-kizak.webp',
      pasta: 'hikaye/gorsel/t-pasta.webp', saskin: 'hikaye/gorsel/t-saskin.webp', yalniz: 'hikaye/gorsel/t-yalniz.webp',
      top: 'hikaye/gorsel/t-top.webp', boya: 'hikaye/gorsel/t-boya.webp', tohum: 'hikaye/gorsel/t-tohum.webp',
      kaz: 'hikaye/gorsel/t-kaz.webp', sula: 'hikaye/gorsel/t-sula.webp', bekle: 'hikaye/gorsel/t-bekle.webp',
      salincak: 'hikaye/gorsel/t-salincak.webp', cicek: 'hikaye/gorsel/t-cicek.webp', uza: 'hikaye/gorsel/t-uza.webp'
    },
    kokce: {
      selam: 'hikaye/gorsel/k-selam.webp', kos: 'hikaye/gorsel/k-kos.webp', yardim: 'hikaye/gorsel/k-yardim.webp',
      uzgun: 'hikaye/gorsel/k-uzgun.webp', ozur: 'hikaye/gorsel/k-ozur.webp', sevinc: 'hikaye/gorsel/k-sevinc.webp',
      pasta: 'hikaye/gorsel/k-pasta.webp', tohum: 'hikaye/gorsel/k-tohum.webp', top: 'hikaye/gorsel/k-top.webp',
      kurek: 'hikaye/gorsel/k-kurek.webp', anlat: 'hikaye/gorsel/k-anlat.webp', sula: 'hikaye/gorsel/k-sula.webp',
      bekle: 'hikaye/gorsel/k-bekle.webp', saskin: 'hikaye/gorsel/k-saskin.webp', cicek: 'hikaye/gorsel/k-cicek.webp'
    },
    pirilti: {
      uc: 'hikaye/gorsel/p-uc.webp', saril: 'hikaye/gorsel/p-saril.webp',
      top: 'hikaye/gorsel/p-top.webp', uzgun: 'hikaye/gorsel/p-uzgun.webp', sevinc: 'hikaye/gorsel/p-sevinc.webp'
    },
    cingoz: {
      uc: 'hikaye/gorsel/c-uc.webp', selam: 'hikaye/gorsel/c-selam.webp', saskin: 'hikaye/gorsel/c-saskin.webp',
      git: 'hikaye/gorsel/c-git.webp', sevinc: 'hikaye/gorsel/c-sevinc.webp', bak: 'hikaye/gorsel/c-bak.webp'
    },
    kariskan: { ufle: 'gorsel/kariskan-ufle.webp', uzgun: 'gorsel/kariskan-uzgun.webp', it: 'gorsel/kariskan-it.webp' }
  };

  function hafta(t) { haftalar.push(t); }
  function bul(no) { for (var i = 0; i < haftalar.length; i++) if (haftalar[i].no === no) return haftalar[i]; }
  function gorsel(ad) { return ad.indexOf('/') >= 0 ? ad : 'hikaye/gorsel/' + ad + '.webp'; }

  /* ——— Hangi seçimler yapıldı, hangi bölüm bitti (bu tahtada) ——— */

  var ANAHTAR = 'tombis.hikaye';
  function kayit() { try { return JSON.parse(localStorage.getItem(ANAHTAR) || '{}'); } catch (e) { return {}; } }
  function kaydet(no, yol) {
    var k = kayit();
    k['h' + no] = { yol: yol, zaman: Date.now() };
    try { localStorage.setItem(ANAHTAR, JSON.stringify(k)); } catch (e) {}
  }

  /* Bölümün resimlerini baştan yükler; sahne geçişinde arka plan ve
     pozlar beklemesin. Hafta kendi görsellerini gorseller listesinde verir. */
  var yuklenen = {};
  function gorselleriHazirla(h) {
    var liste = [];
    for (var kim in POZ) for (var p in POZ[kim]) liste.push(POZ[kim][p]);
    (h.gorseller || []).forEach(function (ad) { liste.push(gorsel(ad)); });
    liste.forEach(function (src) {
      if (yuklenen[src]) return;
      var i = new Image();
      i.src = src;
      yuklenen[src] = i;
    });
  }

  /* ——— Bölümü aç ——— */

  function ac(no) {
    var h = bul(no);
    if (!h || !h.sahneler) return menuAc();
    Ses.hazirla(h.sesler || []);
    gorselleriHazirla(h);
    T.sahneAc(function (api) { return calistir(api, h); },
      { kod: 'hikaye' + no, ad: no + '. hafta: ' + h.ad, kaynak: 'Değer: ' + h.deger, arka: 'gorsel/arka-zemin.webp', ikon: h.ikon });
  }

  function calistir(api, bolum) {
    var sahneEl = document.getElementById('sahne');
    sahneEl.classList.add('hikaye-modu');
    T.rehberGoster(false);

    var el = T.el;
    var set = el('div', 'h-set', api.alan);
    var arkaImg = el('img', 'h-arka', set);
    arkaImg.alt = '';
    arkaImg.draggable = false;
    var oyuncular = el('div', 'h-oyuncular', set);
    var efektKat = el('div', 'h-efekt', set);
    var ui = el('div', 'h-ui', api.alan);
    var kamera = { z: 1, x: 960, y: 540 };
    var aktorler = {};
    var yol = [];
    var secimSayisi = 0;
    var durum = {};   // bölümün kendi değişkenleri (hangi yol seçildi vb.)

    /* ——— Kamera ——— */

    function kameraCiz() {
      var z = kamera.z;
      var tx = Math.min(0, Math.max(G - G * z, G / 2 - kamera.x * z));
      var ty = Math.min(0, Math.max(Y - Y * z, Y / 2 - kamera.y * z));
      set.style.transform = 'translate(' + tx.toFixed(1) + 'px,' + ty.toFixed(1) + 'px) scale(' + z.toFixed(4) + ')';
    }
    kameraCiz();

    /* ——— Oyuncu: ayak ortası (x, y) noktasında durur ——— */

    function aktor(kim, poz, x, y, boy) {
      var d = el('div', 'h-aktor', oyuncular);
      var yon = el('div', 'h-yon', d);
      var img = el('img', null, yon);
      img.alt = '';
      img.draggable = false;
      d.style.width = (boy || 300) + 'px';
      var a = {
        kim: kim, el: d, img: img, x: x, y: y, dy: 0, r: 0, o: 1, gorunur: true,
        ciz: function () {
          d.style.transform = 'translate(' + a.x.toFixed(1) + 'px,' + (a.y + a.dy).toFixed(1) + 'px) translate(-50%,-100%) rotate(' + a.r.toFixed(1) + 'deg) scale(' + a.o.toFixed(3) + ')';
          return a;
        },
        poz: function (p) { img.src = (POZ[kim] && POZ[kim][p]) || gorsel(p); return a; },
        bak: function (sag) { yon.style.transform = sag ? '' : 'scaleX(-1)'; return a; },
        boy: function (b) { d.style.width = b + 'px'; return a; },
        gizle: function () { d.style.display = 'none'; a.gorunur = false; return a; },
        goster: function () { d.style.display = ''; a.gorunur = true; return a; },
        sil: function () { d.remove(); if (aktorler[kim] === a) delete aktorler[kim]; },
        /* Yürür (sallanarak), koşar (hızlı sallanır) ya da uçar (dalgalanır) */
        git: function (x2, y2, ms, stil) {
          var x1 = a.x, y1 = a.y;
          if (x2 !== x1) a.bak(x2 > x1);
          var adim = stil === 'kos' ? 7 : stil === 'uc' ? 1.5 : 4;
          var yuk = stil === 'kos' ? 26 : stil === 'uc' ? 40 : 16;
          return api.tween(ms || 1400, function (t, ham) {
            a.x = x1 + (x2 - x1) * t;
            a.y = y1 + (y2 - y1) * t;
            a.dy = stil === 'uc' ? Math.sin(ham * Math.PI * 2 * adim) * yuk : -Math.abs(Math.sin(ham * Math.PI * adim)) * yuk;
            a.r = stil === 'uc' ? 0 : Math.sin(ham * Math.PI * adim * 2) * 3;
            a.ciz();
          }, stil === 'uc' ? T.kolay.gircik : T.kolay.dogrusal).then(function () { a.dy = 0; a.r = 0; a.ciz(); });
        },
        zipla: function (kez, yuk) {
          kez = kez || 1;
          return api.tween(420 * kez, function (t, ham) {
            a.dy = -Math.abs(Math.sin(ham * Math.PI * kez)) * (yuk || 80);
            a.ciz();
          }, T.kolay.dogrusal).then(function () { a.dy = 0; a.ciz(); });
        },
        salla: function () { T.oynat(img, 'h-titre', 600); return api.bekle(600); },
        belir: function (ms) {
          a.goster();
          return api.tween(ms || 450, function (t) { a.o = t; a.ciz(); }, T.kolay.zipla);
        }
      };
      a.poz(poz).ciz();
      aktorler[kim] = a;
      return a;
    }

    /* ——— Konuşma: konuşanın resmi hafifçe esner ——— */

    function soyle(k) {
      var kim = KISI[k.charAt(0)];
      var a = kim && aktorler[kim];
      if (a) a.img.classList.add('h-konus');
      altyaziKim(kim);
      return api.soyle(k).then(function () { if (a) a.img.classList.remove('h-konus'); });
    }
    function altyaziKim(kim) {
      var alt = sahneEl.querySelector('.altyazi');
      if (alt) alt.setAttribute('data-kim', kim || 'tombis');
    }

    /* Adımları sırayla çalıştırır. Adım bir metin anahtarıysa söylenir,
       işlevse çağrılır (Promise döndürebilir). */
    function dizi(adimlar) {
      return adimlar.reduce(function (onceki, adim) {
        return onceki.then(function () {
          if (typeof adim === 'string') return soyle(adim);
          return adim();
        });
      }, Promise.resolve());
    }

    function arka(ad) { arkaImg.src = gorsel(ad); }

    function temizle() {
      oyuncular.innerHTML = '';
      efektKat.innerHTML = '';
      ui.innerHTML = '';
      aktorler = {};
      kamera = { z: 1, x: 960, y: 540 };
      kameraCiz();
    }

    function kameraGit(z, x, y, ms) {
      var z0 = kamera.z, x0 = kamera.x, y0 = kamera.y;
      return api.tween(ms || 1200, function (t) {
        kamera.z = z0 + (z - z0) * t;
        kamera.x = x0 + (x - x0) * t;
        kamera.y = y0 + (y - y0) * t;
        kameraCiz();
      });
    }

    /* Sahne geçişi: çizgi filmlerdeki gibi daralan daire */
    function gecis(fn) {
      var d = el('div', 'h-gecis', api.alan);
      return api.tween(380, function (t) { d.style.setProperty('--r', ((1 - t) * 120) + '%'); }, T.kolay.gir)
        .then(function () { Ses.dur(); temizle(); if (fn) fn(); return api.bekle(40); })
        .then(function () { return api.tween(420, function (t) { d.style.setProperty('--r', (t * 120) + '%'); }, T.kolay.cik); })
        .then(function () { d.remove(); });
    }

    /* ——— Başlık kartı ——— */

    function baslik(ust, ad, k) {
      var p = el('div', 'h-baslik', ui);
      el('small', null, p, ust);
      el('b', null, p, ad);
      Efekt.kutlama();
      return (k ? soyle(k) : api.bekle(2200)).then(function () { return api.bekle(600); })
        .then(function () { p.classList.add('git'); return api.bekle(500); })
        .then(function () { p.remove(); });
    }

    /* ——— Seçim: iki büyük resim ——— */

    function secim(s) {
      secimSayisi++;
      var perde = el('div', 'h-secim', ui);
      var kartlar = [s.a, s.b].map(function (sec, i) {
        var k = el('div', 'h-secim-kart', perde);
        k.style.left = (i === 0 ? 540 : 1380) + 'px';
        var cer = el('div', 'resim', k);
        var img = el('img', sec.kucuk ? 'kucuk' : null, cer);
        img.src = (sec.kim && POZ[sec.kim] && POZ[sec.kim][sec.resim]) || gorsel(sec.resim);
        img.alt = '';
        img.draggable = false;
        el('div', 'etiket', k, sec.etiket);
        el('div', 'harf', k, i === 0 ? 'A' : 'B');
        return k;
      });
      var not = el('div', 'kucuk-not h-not', perde, 'Öğretmene: Sınıf el kaldırarak oylasın, çok el kalkan resme bir çocuk dokunsun.');
      Efekt.pop();
      T.sonTalimat(null);
      return new Promise(function (coz) {
        var bitti = false;
        kartlar.forEach(function (k, i) {
          api.dokun(k, function () {
            if (bitti) return;
            bitti = true;
            Ses.dur();
            var sec = i === 0 ? s.a : s.b;
            yol.push({ soru: s.baslik, secim: sec.etiket });
            k.classList.add('secildi');
            kartlar[1 - i].classList.add('secilmedi');
            not.remove();
            Efekt.dogru();
            api.kutla(i === 0 ? 540 : 1380, 560, 40);
            soyle(secimSayisi % 2 ? 't_hk_sec1' : 't_hk_sec2')
              .then(function () { perde.classList.add('git'); return api.bekle(400); })
              .then(function () { perde.remove(); coz(sec.git); });
          });
        });
        // Soruyu söyle; ilk seçimde nasıl oylanacağını da anlat
        var zincir = soyle(s.soru);
        if (secimSayisi === 1) zincir = zincir.then(function () { if (!bitti) return soyle('t_hk_oyla'); });
      });
    }

    /* ——— Sayaçlı mola panosu (sohbet ya da hareket) ——— */

    function pano(tur, k, saniye, sinif) {
      var p = el('div', 'h-pano ' + (sinif || ''), ui);
      el('small', null, p, tur);
      el('div', 'metin', p, Ses.metin(k));
      var saat = el('div', 'h-saat', p);
      saat.innerHTML = '<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="42" class="iz"/><circle cx="50" cy="50" r="42" class="dolu"/></svg><span></span>';
      var dolu = saat.querySelector('.dolu'), yazi = saat.querySelector('span');
      var CEVRE = 2 * Math.PI * 42;
      dolu.style.strokeDasharray = CEVRE;
      var bas = Date.now();
      var d = api.dongu(function () {
        var gecen = (Date.now() - bas) / 1000;
        var kalan = Math.max(0, saniye - gecen);
        dolu.style.strokeDashoffset = (CEVRE * (1 - kalan / saniye)).toFixed(1);
        var dk = Math.floor(kalan / 60), sn = Math.ceil(kalan % 60);
        if (sn === 60) { dk++; sn = 0; }
        yazi.textContent = kalan <= 0 ? '✓' : (dk ? dk + ':' + (sn < 10 ? '0' : '') + sn : sn);
      });
      return { el: p, dur: function () { d.dur(); }, bas: bas };
    }

    /* Sohbet: soru panoda kalır, sayaç öğretmene yol gösterir, Devam'a
       dokununca geçilir (süre dolunca da bekler, öğretmen karar verir). */
    function sohbet(k, saniye) {
      var p = pano('Sohbet zamanı', k, saniye || 90, 'sohbet');
      T.sonTalimat(null);
      return soyle(k).then(function () {
        return new Promise(function (coz) {
          var b = api.dugme({ x: 1740, y: 930, ikon: 'ileri', sinif: 'yesil kucuk', etiket: 'Devam', ebeveyn: ui, fn: function () {
            b.remove();
            Efekt.pop();
            p.dur();
            p.el.classList.add('git');
            api.bekle(350).then(function () { p.el.remove(); coz(); });
          } });
          api.zamanla((saniye || 90) * 1000, function () { b.classList.add('parla'); });
        });
      });
    }

    /* Hareket molası: bütün sınıf ayakta. Süre dolunca kendiliğinden
       geçer, öğretmen Devam ile erken bitirebilir. oynat(t) her karede. */
    function hareket(k, saniye, oynat) {
      var p = pano('Hareket zamanı', k, saniye || 30, 'hareket');
      T.sonTalimat(null);
      var d = oynat ? api.dongu(function (dt, t) { oynat(t); }) : null;
      return new Promise(function (coz) {
        var bitti = false;
        function son() {
          if (bitti) return;
          bitti = true;
          if (d) d.dur();
          b.remove();
          p.dur();
          p.el.classList.add('git');
          api.bekle(350).then(function () { p.el.remove(); coz(); });
        }
        soyle(k).then(function () { api.zamanla((saniye || 30) * 1000, son); });
        var b = api.dugme({ x: 1740, y: 930, ikon: 'ileri', sinif: 'yesil kucuk', etiket: 'Devam', ebeveyn: ui, fn: function () { Ses.dur(); son(); } });
      });
    }

    /* ——— Oyunlar ——— */

    function oge(resim, x, y, boy, sinif) {
      var d = el('div', 'h-oge' + (sinif ? ' ' + sinif : ''), ui);
      d.style.left = x + 'px';
      d.style.top = y + 'px';
      d.style.width = (boy || 150) + 'px';
      var i = el('img', null, d);
      i.src = gorsel(resim);
      i.alt = '';
      i.draggable = false;
      return d;
    }

    function uc(d, x2, y2, ms, kucul) {
      var x1 = parseFloat(d.style.left), y1 = parseFloat(d.style.top);
      return api.tween(ms || 650, function (t) {
        d.style.left = (x1 + (x2 - x1) * t) + 'px';
        d.style.top = (y1 + (y2 - y1) * t - Math.sin(t * Math.PI) * 160) + 'px';
        if (kucul) d.style.transform = 'translate(-50%,-50%) scale(' + (1 - t * 0.6) + ')';
      }, T.kolay.gircik);
    }

    /* Sayarak topla: her öğeye dokunulunca hedefe uçar, Tombiş sayar.
       s: { resim, noktalar:[{x,y}], boy, hedef:{x,y}, talimat } */
    function topla(s) {
      var ogeler = s.noktalar.map(function (n) { return oge(s.resim, n.x, n.y, s.boy || 150, 'dokunulur belir' + (s.parla ? ' parla' : '')); });
      var sayi = 0, konusma = Promise.resolve();
      api.talimat(s.talimat);
      api.ipucu(function () {
        for (var i = 0; i < ogeler.length; i++) if (!ogeler[i].classList.contains('alindi')) { api.el(s.noktalar[i].x, s.noktalar[i].y); return; }
      });
      return new Promise(function (coz) {
        ogeler.forEach(function (d) {
          api.dokun(d, function () {
            if (d.classList.contains('alindi')) return;
            d.classList.add('alindi');
            sayi++;
            var n = sayi;
            Efekt.pop();
            uc(d, s.hedef.x, s.hedef.y, 650, true).then(function () { d.remove(); if (s.her) s.her(n); });
            konusma = konusma.then(function () { return api.say(n); });
            if (n === ogeler.length) {
              api.ipucu(null);
              T.sonTalimat(null);
              konusma.then(function () { Efekt.dogru(); api.kutla(s.hedef.x, s.hedef.y - 60, 40); return api.bekle(500); }).then(coz);
            }
          });
        });
      });
    }

    /* Dokun ve say: öğeler yerinde kalır (karıncalar, arkadaşlar). Her
       dokunuşta hepsine birer kez: say(n) + isteğe bağlı iş. */
    function dokunSay(s) {
      var sayi = 0, konusma = Promise.resolve();
      api.talimat(s.talimat);
      s.hedefler.forEach(function (h) { h.el.classList.add('h-dokunulur'); });
      api.ipucu(function () {
        for (var i = 0; i < s.hedefler.length; i++) if (!s.hedefler[i].sayildi) { var h = s.hedefler[i]; api.el(h.x, h.y - 120); return; }
      });
      return new Promise(function (coz) {
        s.hedefler.forEach(function (h) {
          api.dokun(h.el, function () {
            if (h.sayildi) return;
            h.sayildi = true;
            h.el.classList.remove('h-dokunulur');
            sayi++;
            var n = sayi;
            Efekt.pop();
            if (h.zipla) h.zipla(1, 60);
            if (s.her) s.her(h, n);
            konusma = konusma.then(function () { return api.say(n); });
            if (n === s.hedefler.length) {
              api.ipucu(null);
              T.sonTalimat(null);
              konusma.then(function () { Efekt.dogru(); return api.bekle(400); }).then(coz);
            }
          });
        });
      });
    }

    /* Noktalı taşlar: 1'den n'e sırayla. s: { noktalar, talimat, git(n, nokta) } */
    function sira(s) {
      var n = s.noktalar.length;
      var sayilar = T.karistir(s.noktalar.map(function (_, i) { return i + 1; }));
      var taslar = s.noktalar.map(function (p, i) {
        var d = oge('tas', p.x, p.y, 230, 'dokunulur h-tas');
        var nk = el('div', 'noktalar n' + sayilar[i], d);
        for (var j = 0; j < sayilar[i]; j++) el('i', null, nk);
        d.sayi = sayilar[i];
        return d;
      });
      var beklenen = 1, yanlis = 0, konusma = Promise.resolve();
      api.talimat(s.talimat);
      function dogruTas() { for (var i = 0; i < n; i++) if (taslar[i].sayi === beklenen) return i; }
      api.ipucu(function () { taslar[dogruTas()].classList.add('parla'); });
      return new Promise(function (coz) {
        taslar.forEach(function (d, i) {
          api.dokun(d, function () {
            if (d.classList.contains('basildi') || beklenen > n) return;
            if (d.sayi === beklenen) {
              d.classList.remove('parla');
              d.classList.add('basildi');
              yanlis = 0;
              var k = beklenen++;
              Efekt.pop();
              konusma = konusma.then(function () { return Promise.all([api.say(k), s.git ? s.git(k, s.noktalar[i]) : null]); });
              if (k === n) {
                api.ipucu(null);
                T.sonTalimat(null);
                konusma.then(function () { Efekt.dogru(); return api.bekle(300); }).then(coz);
              }
            } else {
              T.oynat(d, 'salla', 520);
              if (++yanlis >= 2) taslar[dogruTas()].classList.add('parla');
              api.tekrar();
            }
          });
        });
      });
    }

    /* Karışkan'ı yakala (dikkat): birkaç yerde kısa süre görünür, çocuklar
       görünce dokunur. s: { noktalar, kez, talimat, sure } */
    function yakala(s) {
      var kez = s.kez || 3, bulunan = 0, sira = 0;
      var d = oge('gorsel/kariskan-ufle.webp', -500, -500, s.boy || 210, 'h-saklanan dokunulur');
      api.talimat(s.talimat);
      var tur;
      return new Promise(function (coz) {
        function goster() {
          if (bulunan >= kez) return;
          var p = s.noktalar[sira++ % s.noktalar.length];
          d.style.left = p.x + 'px';
          d.style.top = p.y + 'px';
          d.classList.remove('yakalandi');
          d.classList.add('cik');
          Efekt.hisir();
          var ben = tur = {};
          api.zamanla(s.sure || 2600, function () {
            if (tur !== ben) return;
            d.classList.remove('cik');
            api.zamanla(700, goster);
          });
        }
        api.ipucu(function () { if (d.classList.contains('cik')) api.el(parseFloat(d.style.left), parseFloat(d.style.top)); });
        api.dokun(d, function () {
          if (!d.classList.contains('cik')) return;
          tur = null;
          bulunan++;
          d.classList.add('yakalandi');
          d.classList.remove('cik');
          Efekt.dogru();
          api.kutla(parseFloat(d.style.left), parseFloat(d.style.top), 30);
          if (bulunan >= kez) {
            api.ipucu(null);
            T.sonTalimat(null);
            api.bekle(500).then(function () { d.remove(); coz(); });
          } else {
            api.say(bulunan);
            api.zamanla(1100, goster);
          }
        });
        api.bekle(600).then(goster);
      });
    }

    /* Hep birlikte bağır: öğretmen ya da bir çocuk her bağırışta düğmeye
       dokunur. yakinlas(i) her seferinde çağrılır. */
    function bagir(k, etiket, kez, yakinlas) {
      return soyle(k).then(function () {
        return new Promise(function (coz) {
          var i = 0;
          var b = el('button', 'h-bagir', ui, etiket);
          b.type = 'button';
          api.dokun(b, function () {
            i++;
            Efekt.kutlama();
            T.oynat(b, 'sek', 450);
            if (yakinlas) yakinlas(i);
            if (i >= kez) { b.remove(); coz(); }
          });
        });
      });
    }

    /* Toz bulutu */
    function toz(x, y) {
      for (var i = 0; i < 7; i++) {
        var t = el('div', 'h-toz', efektKat);
        t.style.left = (x + (i - 3) * 38) + 'px';
        t.style.top = y + 'px';
        t.style.animationDelay = (i % 3) * 60 + 'ms';
      }
      api.zamanla(1200, function () { [].slice.call(efektKat.querySelectorAll('.h-toz')).forEach(function (t) { t.remove(); }); });
    }

    /* Karışkan gelir, kıkırdar, gider */
    function kariskanGec(x1, y1, x2, y2, ms) {
      var k = aktor('kariskan', 'ufle', x1, y1, 220);
      Efekt.hisir();
      return k.git(x2, y2, ms || 1600, 'uc').then(function () { k.sil(); });
    }

    function tik() { Efekt.davul(0); Efekt.davul(0.2); }

    /* Şarkı: çalarken karakterler dans eder, Devam ile geçilir */
    function sarki(k, dansedenler) {
      var p = pano('Şarkı zamanı', k, 90, 'hareket');
      p.el.querySelector('.h-saat').style.display = 'none';
      var d = api.dongu(function (dt, t) {
        dansedenler.forEach(function (a, i) {
          a.dy = -Math.abs(Math.sin(t / 260 + i)) * 50;
          a.r = Math.sin(t / 300 + i) * 8;
          a.ciz();
        });
      });
      return new Promise(function (coz) {
        var bitti = false;
        function son() {
          if (bitti) return;
          bitti = true;
          d.dur();
          b.remove();
          Ses.dur();
          p.dur();
          dansedenler.forEach(function (a) { a.dy = 0; a.r = 0; a.ciz(); });
          p.el.classList.add('git');
          api.bekle(350).then(function () { p.el.remove(); coz(); });
        }
        api.soyle(k).then(son);
        var b = api.dugme({ x: 1740, y: 930, ikon: 'ileri', sinif: 'yesil kucuk', etiket: 'Devam', ebeveyn: ui, fn: son });
      });
    }

    /* Rozet: kocaman kalp (ya da yıldız) */
    var ROZET = {
      kalp: '<svg viewBox="0 0 200 180"><path d="M100 170C40 125 8 92 8 55 8 25 32 6 58 6c18 0 33 9 42 24C109 15 124 6 142 6c26 0 50 19 50 49 0 37-32 70-92 115z" fill="#FC5F42" stroke="#fff" stroke-width="10"/><path d="M52 48c6-14 20-20 32-16" stroke="#FFD0C4" stroke-width="10" stroke-linecap="round" fill="none"/></svg>',
      tohum: '<svg viewBox="0 0 200 200"><path d="M100 60c18-4 36 6 40 24" stroke="#57B26B" stroke-width="12" stroke-linecap="round" fill="none"/><path d="M100 96V52" stroke="#57B26B" stroke-width="12" stroke-linecap="round"/><path d="M100 52c-4-26-24-40-50-38 2 26 22 42 50 38z" fill="#7BCB6A" stroke="#fff" stroke-width="7"/><path d="M100 52c4-26 24-40 50-38-2 26-22 42-50 38z" fill="#7BCB6A" stroke="#fff" stroke-width="7"/><ellipse cx="100" cy="140" rx="74" ry="54" fill="#A67C52" stroke="#fff" stroke-width="10"/><path d="M100 96v88" stroke="#8C6239" stroke-width="7" stroke-linecap="round"/><circle cx="76" cy="132" r="7" fill="#5A3A26"/><circle cx="124" cy="132" r="7" fill="#5A3A26"/><path d="M84 152q16 14 32 0" stroke="#5A3A26" stroke-width="6" stroke-linecap="round" fill="none"/></svg>',
      yildiz: '<svg viewBox="0 0 200 190"><path d="M100 8l27 58 63 7-47 43 13 63-56-32-56 32 13-63L10 73l63-7z" fill="#FFC940" stroke="#fff" stroke-width="10" stroke-linejoin="round"/><circle cx="82" cy="88" r="7" fill="#5A3A26"/><circle cx="118" cy="88" r="7" fill="#5A3A26"/><path d="M84 110q16 14 32 0" stroke="#5A3A26" stroke-width="6" stroke-linecap="round" fill="none"/></svg>'
    };
    function rozet(ad, k, sekil) {
      var p = el('div', 'h-rozet', ui);
      p.innerHTML = ROZET[sekil] || ROZET.kalp;
      el('b', null, p, ad);
      Efekt.kutlama();
      api.kutla(960, 420, 70);
      return soyle(k).then(function () { return api.bekle(800); }).then(function () { p.classList.add('git'); return api.bekle(400); }).then(function () { p.remove(); });
    }

    /* ——— Bölüm sonu: seçimlerin haritası ——— */

    function son() {
      kaydet(bolum.no, yol);
      var p = el('div', 'h-son', ui);
      el('h2', null, p, 'Bugünkü hikâyemiz');
      var liste = el('div', 'yol', p);
      yol.forEach(function (y, i) {
        var s = el('div', 'durak', liste);
        el('span', 'no', s, String(i + 1));
        el('small', null, s, y.soru);
        el('b', null, s, y.secim);
      });
      if (bolum.sonraki) el('div', 'sonraki', p, 'Gelecek hafta: ' + bolum.sonraki);
      api.dugme({ x: 690, y: 860, ikon: 'yeniden', sinif: 'mavi kucuk', etiket: 'Başka seçimlerle izle', ebeveyn: p, fn: function () { ac(bolum.no); } });
      api.dugme({ x: 1230, y: 860, ikon: 'ev', sinif: 'sari kucuk', etiket: 'Hikâyeler', ebeveyn: p, fn: function () { menuAc(); } });
      Efekt.kutlama();
    }

    /* ——— h: sahne işlevlerinin eli ——— */

    var h = {
      api: api, G: G, Y: Y, durum: durum,
      arka: arka, aktor: aktor, kisi: function (k) { return aktorler[k]; },
      soyle: soyle, dizi: dizi, bekle: api.bekle, tween: api.tween,
      kamera: kameraGit, gecis: gecis, baslik: baslik, secim: secim,
      sohbet: sohbet, hareket: hareket, topla: topla, dokunSay: dokunSay, sira: sira,
      yakala: yakala, bagir: bagir, oge: oge, uc: uc, toz: toz, kariskanGec: kariskanGec,
      tik: tik, sarki: sarki, rozet: rozet, ui: ui, efektKat: efektKat,
      sahneAl: function (id) { return bolum.sahneler[id]; }
    };

    function git(id, ilk) {
      if (!id) { son(); return; }
      var f = bolum.sahneler[id];
      if (!f) { son(); return; }
      var hazir = ilk ? Promise.resolve(temizle()) : gecis();
      hazir.then(function () { return f(h); }).then(function (sonraki) { git(sonraki); });
    }
    git(bolum.baslangic, true);

    return { yikil: function () { sahneEl.classList.remove('hikaye-modu'); } };
  }

  /* ——— Hikâye menüsü: altı hafta ——— */

  function menuAc() {
    T.sahneAc(function (api) {
      var a = api.alan;
      T.el('div', 'menu-zemin', a);
      var k = kayit();
      var baslik = T.el('div', 'baslik-yazi', a, 'Tombiş\'in Hikâyeleri');
      baslik.style.left = '960px';
      baslik.style.top = '190px';
      baslik.style.fontSize = '86px';
      PLAN.forEach(function (p, i) {
        var s = i % 3, r = Math.floor(i / 3);
        var x = 960 + (s - 1) * 560, y = 470 + r * 340;
        var hazir = !!(bul(p.no) && bul(p.no).sahneler);
        var kutu = T.el('div', 'h-hafta' + (hazir ? '' : ' kilitli'), a);
        kutu.style.left = x + 'px';
        kutu.style.top = y + 'px';
        kutu.style.setProperty('--renk', p.renk);
        T.el('small', null, kutu, p.no + '. hafta');
        T.el('b', null, kutu, p.ad);
        T.el('span', 'deger', kutu, p.deger);
        if (!hazir) T.el('span', 'yakinda', kutu, 'Yakında');
        if (k['h' + p.no]) {
          var t = T.el('div', 'tamam', kutu);
          t.appendChild(Cizim.ikon('tamam', '#fff', 3.4));
        }
        if (hazir) api.dokun(kutu, function () { Efekt.pop(); ac(p.no); });
      });
      var oyunlar = T.el('button', 'h-gecis-dugme', a, 'Oyunlar');
      oyunlar.type = 'button';
      api.dokun(oyunlar, function () { Efekt.pop(); T.menuAc(); });
    }, { ad: 'Hikâyeler', arka: 'gorsel/arka-cayir.webp' });
  }

  /* Altı haftanın planı (menüde görünen). Ayrıntı: HIKAYE.md */
  var PLAN = [
    { no: 1, ad: 'Tombiş Düştü!', deger: 'Yardımlaşma', renk: '#FC5F42' },
    { no: 2, ad: 'Tombiş\'e Ziyaret', deger: 'Paylaşma', renk: '#FFB020' },
    { no: 3, ad: 'Kökçe\'nin Tohumu', deger: 'Sabır ve sıra beklemek', renk: '#4FB477' },
    { no: 4, ad: 'Kırılan Kristal', deger: 'Dürüstlük ve özür dilemek', renk: '#8B7BE0' },
    { no: 5, ad: 'Karışkan Yalnız', deger: 'Arkadaşlık ve oyuna katmak', renk: '#4FA3E0' },
    { no: 6, ad: 'Büyük Şenlik', deger: 'İş birliği ve teşekkür', renk: '#E0609A' }
  ];

  // Öğretmen şeridindeki "baştan başlat" hikâyede de çalışsın
  var eskiOyna = T.oyna;
  T.oyna = function (kod) {
    var m = /^hikaye(\d+)$/.exec(kod || '');
    if (m) return ac(+m[1]);
    return eskiOyna(kod);
  };

  return { hafta: hafta, ac: ac, menuAc: menuAc, kayit: kayit, PLAN: PLAN };
})();
