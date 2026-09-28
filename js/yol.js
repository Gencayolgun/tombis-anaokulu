/* Tombiş — Karınca Yuvası: parmakla yol takibi.

   Sarmal yol, yaprak dikme ve iki elle yürütme aynı mantığı kullanır: yol
   eşit aralıklı noktalara bölünür, karınca (ya da iğne) parmağın yakınındaki
   bir sonraki noktaya ilerler. Parmak yoldan çok uzaklaşırsa karınca bekler;
   geri gelince kaldığı yerden devam eder. Geri gitmek yok, düşmek yok. */

window.Yol = (function () {
  /* Çoklu çizgiyi eşit adımlı noktalara çevirir */
  function esitle(noktalar, adim) {
    adim = adim || 6;
    var sonuc = [{ x: noktalar[0].x, y: noktalar[0].y }];
    var kalan = 0;
    for (var i = 1; i < noktalar.length; i++) {
      var a = noktalar[i - 1], b = noktalar[i];
      var dx = b.x - a.x, dy = b.y - a.y;
      var boy = Math.sqrt(dx * dx + dy * dy);
      var t = adim - kalan;
      while (t <= boy) {
        sonuc.push({ x: a.x + dx * t / boy, y: a.y + dy * t / boy });
        t += adim;
      }
      kalan = boy - (t - adim);
    }
    var son = noktalar[noktalar.length - 1];
    if (T.uzaklik(sonuc[sonuc.length - 1], son) > 1) sonuc.push({ x: son.x, y: son.y });
    return sonuc;
  }

  function d(noktalar) {
    var s = 'M' + noktalar[0].x.toFixed(1) + ' ' + noktalar[0].y.toFixed(1);
    for (var i = 1; i < noktalar.length; i++) s += 'L' + noktalar[i].x.toFixed(1) + ' ' + noktalar[i].y.toFixed(1);
    return s;
  }

  /* ——— Hazır yol biçimleri ——— */

  /* Dışarıdan içe Arşimet sarmalı */
  function sarmal(mx, my, disR, icR, tur, basAci) {
    var p = [], adet = Math.round(tur * 180);
    basAci = basAci || 0;
    for (var i = 0; i <= adet; i++) {
      var t = i / adet;
      var a = basAci + t * tur * Math.PI * 2;
      var r = disR + (icR - disR) * t;
      p.push({ x: mx + Math.cos(a) * r, y: my + Math.sin(a) * r });
    }
    return p;
  }

  /* Dalga: (x1,y1)'den (x2,y2)'ye, genlik ve dalga sayısıyla */
  function dalga(x1, y1, x2, y2, genlik, sayi) {
    var p = [], adet = 120;
    var dx = x2 - x1, dy = y2 - y1, boy = Math.sqrt(dx * dx + dy * dy);
    var nx = -dy / boy, ny = dx / boy;
    for (var i = 0; i <= adet; i++) {
      var t = i / adet;
      var s = Math.sin(t * Math.PI * 2 * sayi) * genlik;
      p.push({ x: x1 + dx * t + nx * s, y: y1 + dy * t + ny * s });
    }
    return p;
  }

  /* Zikzak */
  function zikzak(x1, y1, x2, y2, genlik, sayi) {
    var p = [];
    var dx = x2 - x1, dy = y2 - y1, boy = Math.sqrt(dx * dx + dy * dy);
    var nx = -dy / boy, ny = dx / boy;
    p.push({ x: x1, y: y1 });
    for (var i = 1; i < sayi * 2; i++) {
      var t = i / (sayi * 2);
      var s = (i % 2 ? 1 : -1) * genlik;
      p.push({ x: x1 + dx * t + nx * s, y: y1 + dy * t + ny * s });
    }
    p.push({ x: x2, y: y2 });
    return p;
  }

  /* ——— Takipçi ———
     secenek: noktalar, tolerans (parmağın yoldan uzaklığı), pencere (bir
     hamlede en fazla kaç nokta ileri), yakalama (başlamak için karıncaya
     ne kadar yakın dokunmalı), sinir() (en fazla hangi noktaya kadar) */
  function takipci(secenek) {
    var n = secenek.noktalar;
    var tol = secenek.tolerans || 80;
    var pencere = secenek.pencere || 40;
    var yakala = secenek.yakalama || 120;
    var i = 0;
    var parmak = null;
    var bitti = false;

    function bas() { return n[i]; }

    return {
      noktalar: n,
      indeks: function () { return i; },
      oran: function () { return i / (n.length - 1); },
      bas: bas,
      tutuluyor: function () { return parmak !== null; },
      parmak: function () { return parmak; },
      bitti: function () { return bitti; },
      aci: function () {
        var a = n[Math.max(0, i - 4)], b = n[Math.min(n.length - 1, i + 4)];
        if (a === b) return 0;
        return Math.atan2(b.y - a.y, b.x - a.x) * 180 / Math.PI;
      },
      /* Dokunuş karıncanın yakınındaysa bu parmağı sahiplen */
      basla: function (id, p) {
        if (bitti || parmak !== null) return false;
        if (T.uzaklik(p, bas()) > yakala) return false;
        parmak = id;
        return true;
      },
      /* Parmak hareket etti: ilerleyebildiyse true */
      hareket: function (id, p) {
        if (bitti || id !== parmak) return false;
        var sinir = secenek.sinir ? secenek.sinir() : n.length - 1;
        var enIyi = -1, enYakin = tol;
        var son = Math.min(n.length - 1, i + pencere, sinir);
        for (var j = i; j <= son; j++) {
          var u = T.uzaklik(p, n[j]);
          if (u < enYakin) { enYakin = u; enIyi = j; }
        }
        if (enIyi > i) {
          i = enIyi;
          if (i >= n.length - 1) { bitti = true; parmak = null; if (secenek.bitince) secenek.bitince(); }
          return true;
        }
        return false;
      },
      birak: function (id) { if (id === parmak) parmak = null; },
      sifirla: function () { i = 0; parmak = null; bitti = false; }
    };
  }

  /* ——— SVG yol katmanı: geniş toprak şerit + noktalı rehber + dolan iz ——— */
  function katman(ebeveyn, noktalar, secenek) {
    secenek = secenek || {};
    var ns = 'http://www.w3.org/2000/svg';
    var s = document.createElementNS(ns, 'svg');
    s.setAttribute('viewBox', '0 0 1920 1080');
    s.setAttribute('width', '1920');
    s.setAttribute('height', '1080');
    s.style.position = 'absolute';
    s.style.left = '0';
    s.style.top = '0';
    s.style.pointerEvents = 'none';
    var yol = d(noktalar);
    function p(sinif, stil) {
      var e = document.createElementNS(ns, 'path');
      e.setAttribute('d', yol);
      e.setAttribute('fill', 'none');
      e.setAttribute('stroke-linecap', 'round');
      e.setAttribute('stroke-linejoin', 'round');
      for (var k in stil) e.setAttribute(k, stil[k]);
      s.appendChild(e);
      return e;
    }
    p('serit', { stroke: secenek.serit || 'rgba(214,176,120,.55)', 'stroke-width': secenek.genislik || 110 });
    p('kenar', { stroke: 'rgba(255,255,255,.55)', 'stroke-width': (secenek.genislik || 110) - 26 });
    var iz = p('iz', { stroke: secenek.iz || '#FFB23E', 'stroke-width': 30, pathLength: 1000, 'stroke-dasharray': '1000 1000', 'stroke-dashoffset': 1000 });
    p('nokta', { stroke: secenek.nokta || '#8A5A3C', 'stroke-width': 13, 'stroke-dasharray': '0.1 26' });
    ebeveyn.appendChild(s);
    return {
      el: s,
      doldur: function (oran) { iz.setAttribute('stroke-dashoffset', (1000 * (1 - oran)).toFixed(1)); }
    };
  }

  return { esitle: esitle, d: d, sarmal: sarmal, dalga: dalga, zikzak: zikzak, takipci: takipci, katman: katman };
})();
