/* Tombiş — Karınca Yuvası: kodla çizilen her şey.

   Karakterler (Tombiş, Karışkan, meslek karıncaları, böcekler) NatureCo ile
   üretilmiş görseller. Rengi değişmesi, parça parça kurulması ya da yürümesi
   gereken şeyler ise burada SVG olarak çiziliyor: yukarıdan görünen karınca,
   duygu yüzleri, boyalı taşlar, pipetler, bardaklar, ikonlar. Hepsi aynı yüz
   ailesinde: iri parlak gözler, yumuşak gölgeli gövde. */

window.Cizim = (function () {
  var sayac = 0;
  function kimlik(on) { return (on || 'c') + (++sayac); }

  function svg(metin) {
    var d = document.createElement('div');
    d.innerHTML = metin.trim();
    return d.firstChild;
  }

  function hex(c) {
    c = c.replace('#', '');
    return [parseInt(c.substr(0, 2), 16), parseInt(c.substr(2, 2), 16), parseInt(c.substr(4, 2), 16)];
  }
  function kat(c, oran) {
    // oran > 0 açar, < 0 koyulaştırır
    var r = hex(c);
    var s = r.map(function (v) {
      var y = oran > 0 ? v + (255 - v) * oran : v * (1 + oran);
      return Math.max(0, Math.min(255, Math.round(y)));
    });
    return '#' + s.map(function (v) { return ('0' + v.toString(16)).slice(-2); }).join('');
  }

  function yumusak(id, renk) {
    return '<radialGradient id="' + id + '" cx="36%" cy="30%" r="78%">' +
      '<stop offset="0" stop-color="' + kat(renk, 0.38) + '"/>' +
      '<stop offset=".62" stop-color="' + renk + '"/>' +
      '<stop offset="1" stop-color="' + kat(renk, -0.28) + '"/></radialGradient>';
  }

  var RENK = {
    karinca: '#B4532E',
    turuncu: '#F5891F',
    kahverengi: '#8C5634',
    siyah: '#34302E',
    kirmizi: '#E23B2E',
    sari: '#FFC928',
    mavi: '#2F8FE0',
    yesil: '#43B15A',
    mor: '#8E54C9'
  };

  /* ——— Yukarıdan görünen karınca (sağa bakar) ———
     viewBox 0 0 140 100, merkez (70,50). Bacaklar tripod yürüyüşüyle oynar. */
  var BACAKLAR = [
    // [bağlantı x, y, diz x, y, uç x, y, takım]
    [8, -7, 17, -21, 29, -29, 'a'], [2, -8.5, 4, -25, -2, -40, 'b'], [-4, -7, -16, -22, -30, -31, 'a'],
    [8, 7, 17, 21, 29, 29, 'b'], [2, 8.5, 4, 25, -2, 40, 'a'], [-4, 7, -16, 22, -30, 31, 'b']
  ];

  function karinca(secenek) {
    secenek = secenek || {};
    var renk = secenek.renk || RENK.karinca;
    var g1 = kimlik('kg'), g2 = kimlik('kg');
    var bacak = kat(renk, -0.42);
    var s = '<svg viewBox="0 0 140 100" class="karinca-svg"><defs>' +
      yumusak(g1, renk) + yumusak(g2, kat(renk, 0.05)) + '</defs><g transform="translate(70 50)">';
    BACAKLAR.forEach(function (b, i) {
      s += '<path class="bacak" data-i="' + i + '" d="M' + b[0] + ' ' + b[1] + ' L' + b[2] + ' ' + b[3] + ' L' + b[4] + ' ' + b[5] +
        '" fill="none" stroke="' + bacak + '" stroke-width="4.6" stroke-linecap="round" stroke-linejoin="round"/>';
    });
    [-1, 1].forEach(function (y) {
      s += '<g class="anten"><path d="M34 ' + (6 * y) + ' Q43 ' + (12 * y) + ' 45 ' + (24 * y) + ' Q47 ' + (31 * y) + ' 55 ' + (33 * y) +
        '" fill="none" stroke="' + bacak + '" stroke-width="3.6" stroke-linecap="round"/>' +
        '<circle cx="55" cy="' + (33 * y) + '" r="3.6" fill="' + bacak + '"/></g>';
    });
    s += '<ellipse class="karin" cx="-33" cy="0" rx="25" ry="19" fill="url(#' + g1 + ')"/>' +
      '<ellipse class="bel" cx="-11" cy="0" rx="5.5" ry="4.2" fill="' + kat(renk, -0.2) + '"/>' +
      '<ellipse class="gogus" cx="2" cy="0" rx="12.5" ry="9.5" fill="url(#' + g2 + ')"/>' +
      '<ellipse class="bas" cx="25" cy="0" rx="14.5" ry="13.5" fill="url(#' + g2 + ')"/>' +
      '<g class="gozler">' +
      '<circle cx="31" cy="-6.5" r="5.4" fill="#fff"/><circle cx="33" cy="-6.3" r="3.1" fill="#2a1a12"/><circle cx="33.9" cy="-7.4" r="1.1" fill="#fff"/>' +
      '<circle cx="31" cy="6.5" r="5.4" fill="#fff"/><circle cx="33" cy="6.7" r="3.1" fill="#2a1a12"/><circle cx="33.9" cy="5.6" r="1.1" fill="#fff"/>' +
      '</g></g></svg>';
    var el = svg(s);
    var bacaklar = [].slice.call(el.querySelectorAll('.bacak'));
    var faz = Math.random() * 6;
    var nesne = {
      el: el,
      karin: el.querySelector('.karin'),
      /* Yürüyüş: her karede dt kadar ilerlet */
      adim: function (dt, hiz) {
        faz += dt * (hiz || 14);
        var a = Math.sin(faz) * 13;
        bacaklar.forEach(function (p, i) {
          var b = BACAKLAR[i];
          var aci = b[6] === 'a' ? a : -a;
          p.setAttribute('transform', 'rotate(' + aci.toFixed(1) + ' ' + b[0] + ' ' + b[1] + ')');
        });
      },
      dur: function () {
        bacaklar.forEach(function (p) { p.removeAttribute('transform'); });
      },
      /* Karın rengini değiştirir (renkli şerbet) */
      karinRengi: function (c) {
        var id = kimlik('kr');
        var defs = el.querySelector('defs');
        defs.insertAdjacentHTML('beforeend', yumusak(id, c));
        el.querySelector('.karin').setAttribute('fill', 'url(#' + id + ')');
      }
    };
    return nesne;
  }

  /* ——— Önden görünen karınca yüzü: duygular ——— */
  function yuz(duygu, renk) {
    renk = renk || RENK.karinca;
    var g = kimlik('yg');
    var koyu = kat(renk, -0.45);
    var s = '<svg viewBox="0 0 200 200" class="yuz-svg"><defs>' + yumusak(g, renk) + '</defs>';
    s += '<path d="M78 58 Q70 30 52 18" fill="none" stroke="' + koyu + '" stroke-width="7" stroke-linecap="round"/>' +
      '<circle cx="50" cy="16" r="9" fill="' + koyu + '"/>' +
      '<path d="M122 58 Q130 30 148 18" fill="none" stroke="' + koyu + '" stroke-width="7" stroke-linecap="round"/>' +
      '<circle cx="150" cy="16" r="9" fill="' + koyu + '"/>' +
      '<circle cx="100" cy="112" r="80" fill="url(#' + g + ')"/>' +
      '<ellipse cx="54" cy="138" rx="14" ry="9" fill="#FF7E7E" opacity=".55"/>' +
      '<ellipse cx="146" cy="138" rx="14" ry="9" fill="#FF7E7E" opacity=".55"/>';
    var goz = function (x, y, ry, py, pr) {
      return '<ellipse cx="' + x + '" cy="' + y + '" rx="17" ry="' + ry + '" fill="#fff"/>' +
        '<circle cx="' + (x + 2) + '" cy="' + py + '" r="' + pr + '" fill="#2a1a12"/>' +
        '<circle cx="' + (x + 6) + '" cy="' + (py - 5) + '" r="4" fill="#fff"/>';
    };
    var kas = function (d) { return '<path d="' + d + '" fill="none" stroke="#3a2418" stroke-width="6" stroke-linecap="round"/>'; };
    if (duygu === 'mutlu') {
      s += goz(70, 102, 20, 106, 11) + goz(130, 102, 20, 106, 11) +
        '<path d="M74 138 Q100 176 126 138 Q100 150 74 138 Z" fill="#7A2A1C"/>' +
        '<path d="M88 152 Q100 164 112 152 Q100 148 88 152 Z" fill="#FF8A8A"/>';
    } else if (duygu === 'uzgun') {
      s += goz(70, 106, 17, 112, 10) + goz(130, 106, 17, 112, 10) +
        kas('M50 84 L84 74') + kas('M150 84 L116 74') +
        '<path d="M78 160 Q100 138 122 160" fill="none" stroke="#7A2A1C" stroke-width="7" stroke-linecap="round"/>' +
        '<path d="M48 124 Q40 138 48 146 Q58 138 48 124 Z" fill="#7CC8FF"/>';
    } else if (duygu === 'saskin') {
      s += goz(70, 100, 24, 100, 8) + goz(130, 100, 24, 100, 8) +
        kas('M52 64 Q70 52 88 62') + kas('M112 62 Q130 52 148 64') +
        '<ellipse cx="100" cy="152" rx="12" ry="16" fill="#7A2A1C"/>';
    } else if (duygu === 'yorgun') {
      s += '<path d="M53 106 Q70 116 87 106" fill="none" stroke="#2a1a12" stroke-width="7" stroke-linecap="round"/>' +
        '<path d="M113 106 Q130 116 147 106" fill="none" stroke="#2a1a12" stroke-width="7" stroke-linecap="round"/>' +
        kas('M54 90 L84 94') + kas('M146 90 L116 94') +
        '<path d="M82 154 Q91 148 100 154 Q109 160 118 154" fill="none" stroke="#7A2A1C" stroke-width="7" stroke-linecap="round"/>' +
        '<path d="M156 66 Q146 82 156 90 Q166 82 156 66 Z" fill="#7CC8FF"/>';
    }
    s += '</svg>';
    return svg(s);
  }

  /* ——— İpucu eli ——— (parmak ucu (38,8) noktasında) */
  function el() {
    return svg('<svg viewBox="0 0 110 132" class="el-svg"><path d="M38 8c7 0 12 5 12 12v34l4-1c2-9 16-9 17 1l3-1c3-8 15-7 16 3l1 2c4-6 15-3 15 6v22c0 20-14 34-34 34H56C40 120 28 110 22 96L8 68c-3-7 5-14 12-8l6 6V20c0-7 5-12 12-12z" fill="#fff" stroke="#5A3A26" stroke-width="6" stroke-linejoin="round"/><path d="M50 54v20M71 53v20M90 57v16" stroke="#E7D3C0" stroke-width="4" stroke-linecap="round"/></svg>');
  }
  var EL_UC = { x: 38 / 110, y: 8 / 132 };

  /* ——— Öğretmen ve düğme ikonları ——— */
  var IKON = {
    ev: '<path d="M4 11.5 12 4l8 7.5M6.5 10v9.5h4v-5h3v5h4V10"/>',
    yeniden: '<path d="M19.5 12a7.5 7.5 0 1 1-2.2-5.3"/><path d="M19.5 4.5v4.8h-4.8"/>',
    ses: '<path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z"/><path d="M15.5 9a4 4 0 0 1 0 6M18 6.5a7.6 7.6 0 0 1 0 11"/>',
    sessiz: '<path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z"/><path d="m16 9.5 5 5m0-5-5 5"/>',
    tamekran: '<path d="M4 9V4h5M15 4h5v5M20 15v5h-5M9 20H4v-5"/>',
    ileri: '<path d="M5 12h13M12.5 5.5 19 12l-6.5 6.5"/>',
    tamam: '<path d="m5 12.5 4.5 4.5L19 7.5"/>',
    sil: '<path d="M4 7h16M9.5 7V4.5h5V7M6.5 7l1 13h9l1-13"/>',
    kaydet: '<path d="M12 4v11M7.5 10.5 12 15l4.5-4.5M5 19.5h14"/>',
    sifirla: '<path d="M4.5 12a7.5 7.5 0 1 0 2.2-5.3"/><path d="M4.5 4.5v4.8h4.8"/>'
  };
  function ikon(ad, renk, kalinlik) {
    if (ad === 'oynat') {
      return svg('<svg viewBox="0 0 24 24"><path d="M8 4.8v14.4a1 1 0 0 0 1.5.9l11.2-7.2a1 1 0 0 0 0-1.8L9.5 3.9A1 1 0 0 0 8 4.8z" fill="' + (renk || '#fff') + '"/></svg>');
    }
    return svg('<svg viewBox="0 0 24 24" fill="none" stroke="' + (renk || '#5A3A26') + '" stroke-width="' + (kalinlik || 2.4) +
      '" stroke-linecap="round" stroke-linejoin="round">' + IKON[ad] + '</svg>');
  }

  /* ——— Boyalı taşlar (kılavuz 2: örüntü taşları) ——— */
  function tas(tur) {
    var g = kimlik('tg'), b = kimlik('tb');
    var s = '<svg viewBox="0 0 200 160"><defs>' + yumusak(g, '#A89A8C') + yumusak(b, tur === 'ugur' ? RENK.kirmizi : tur === 'cekirge' ? '#5DB94C' : '#3A3533') + '</defs>' +
      '<ellipse cx="100" cy="146" rx="78" ry="10" fill="rgba(60,40,20,.18)"/>' +
      '<path d="M18 92c0-42 34-72 84-72s82 28 82 68-36 58-84 58-82-12-82-54z" fill="url(#' + g + ')"/>';
    if (tur === 'ugur') {
      s += '<path d="M44 92c0-32 26-58 62-58s60 26 60 58-26 44-62 44-60-12-60-44z" fill="url(#' + b + ')"/>' +
        '<path d="M22 92a26 26 0 0 1 26-26h4v52h-4a26 26 0 0 1-26-26z" fill="#2a2220"/>' +
        '<path d="M52 92h112" stroke="#2a2220" stroke-width="5"/>' +
        '<circle cx="86" cy="64" r="11" fill="#2a2220"/><circle cx="86" cy="118" r="11" fill="#2a2220"/>' +
        '<circle cx="128" cy="60" r="12" fill="#2a2220"/><circle cx="128" cy="122" r="12" fill="#2a2220"/>' +
        '<circle cx="152" cy="92" r="9" fill="#2a2220"/>' +
        '<circle cx="33" cy="82" r="5.5" fill="#fff"/><circle cx="33" cy="102" r="5.5" fill="#fff"/>' +
        '<circle cx="34" cy="82" r="2.6" fill="#2a2220"/><circle cx="34" cy="102" r="2.6" fill="#2a2220"/>';
    } else if (tur === 'cekirge') {
      s += '<path d="M24 92c0-38 32-64 78-64s76 26 76 62-32 52-78 52-76-12-76-50z" fill="url(#' + b + ')"/>' +
        '<g fill="none" stroke="#1F6A2A" stroke-width="7" stroke-linecap="round" stroke-linejoin="round">' +
        '<path d="M60 94h78"/><path d="M104 90 132 60 150 110"/><path d="M84 96l-10 22M96 96l2 22"/>' +
        '<path d="M140 88q14-22 28-26M140 96q16-6 30 2"/></g>' +
        '<circle cx="140" cy="92" r="11" fill="#1F6A2A"/><circle cx="144" cy="89" r="3.5" fill="#fff"/>';
    } else {
      s += '<path d="M24 92c0-38 32-64 78-64s76 26 76 62-32 52-78 52-76-12-76-50z" fill="url(#' + b + ')"/>' +
        '<g fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round" stroke-linejoin="round">' +
        '<path d="M92 84 82 62 70 58M100 84l2-24M108 86l14-20 14-2"/>' +
        '<path d="M92 100 82 122 70 126M100 100l2 24M108 98l14 20 14 2"/>' +
        '<path d="M140 84q10-18 22-20M140 100q12 12 24 10"/></g>' +
        '<ellipse cx="66" cy="92" rx="22" ry="17" fill="#fff"/><ellipse cx="100" cy="92" rx="12" ry="10" fill="#fff"/>' +
        '<circle cx="132" cy="92" r="14" fill="#fff"/>' +
        '<circle cx="137" cy="86" r="3.6" fill="#3A3533"/><circle cx="137" cy="98" r="3.6" fill="#3A3533"/>';
    }
    return svg(s + '</svg>');
  }

  /* ——— Pipet (kılavuz 6) ——— */
  function pipet(renk, boy) {
    var g = kimlik('pg');
    return svg('<svg viewBox="0 0 80 ' + (boy + 20) + '" width="80" height="' + (boy + 20) + '"><defs>' +
      '<linearGradient id="' + g + '" x1="0" x2="1"><stop offset="0" stop-color="' + kat(renk, -0.15) + '"/><stop offset=".35" stop-color="' + kat(renk, 0.3) + '"/><stop offset="1" stop-color="' + kat(renk, -0.2) + '"/></linearGradient></defs>' +
      '<rect x="10" y="10" width="60" height="' + boy + '" rx="26" fill="url(#' + g + ')"/>' +
      '<ellipse cx="40" cy="22" rx="20" ry="7" fill="' + kat(renk, -0.45) + '"/>' +
      '<rect x="24" y="36" width="8" height="' + Math.max(0, boy - 60) + '" rx="4" fill="#fff" opacity=".45"/></svg>');
  }

  /* ——— Bardak (kılavuz 7): doluluk 0, 0.5, 1 ——— */
  function bardak(doluluk) {
    var ust = 38, alt = 250, h = alt - ust;
    var sivi = alt - 8 - (h - 16) * doluluk;
    var g = kimlik('bg');
    var s = '<svg viewBox="0 0 200 270"><defs><clipPath id="' + g + '"><path d="M34 34h132l-14 212a12 12 0 0 1-12 11H60a12 12 0 0 1-12-11z"/></clipPath></defs>' +
      '<ellipse cx="100" cy="262" rx="70" ry="8" fill="rgba(60,40,20,.15)"/>';
    if (doluluk > 0) {
      // Süt: açık mavi kartın üstünde net görünsün diye beyaz, yüzeyi çizgili
      s += '<g clip-path="url(#' + g + ')"><rect x="20" y="' + sivi + '" width="160" height="260" fill="#FFFFFF"/>' +
        '<rect x="20" y="' + (sivi + 14) + '" width="160" height="260" fill="#F4EBDD" opacity=".55"/>' +
        '<ellipse cx="100" cy="' + sivi + '" rx="74" ry="9" fill="#FFFFFF" stroke="#D9C9AE" stroke-width="4"/></g>';
    }
    s += '<path d="M34 34h132l-14 212a12 12 0 0 1-12 11H60a12 12 0 0 1-12-11z" fill="rgba(210,236,250,.28)" stroke="#8FB9D6" stroke-width="7" stroke-linejoin="round"/>' +
      '<path d="M56 60l8 170" stroke="#fff" stroke-width="8" stroke-linecap="round" opacity=".7"/>';
    return svg(s + '</svg>');
  }

  /* ——— Bisküvi: dört çeyrek, ayrı ayrı oynatılabilir ——— */
  function biskuvi() {
    var g = kimlik('bk');
    var s = '<svg viewBox="-150 -150 300 300"><defs>' + yumusak(g, '#7A4A2C') + '</defs>';
    var ceyrekler = ['M0 0 L0 -120 A120 120 0 0 1 120 0 Z', 'M0 0 L120 0 A120 120 0 0 1 0 120 Z', 'M0 0 L0 120 A120 120 0 0 1 -120 0 Z', 'M0 0 L-120 0 A120 120 0 0 1 0 -120 Z'];
    var cipler = [[40, -60], [70, -24], [30, -28], [60, 40], [26, 74], [36, 22], [-46, 60], [-78, 20], [-30, 30], [-60, -44], [-30, -80], [-24, -34]];
    ceyrekler.forEach(function (d, i) {
      s += '<g class="ceyrek" data-i="' + i + '"><path d="' + d + '" fill="url(#' + g + ')" stroke="#5C341E" stroke-width="3"/>';
      cipler.slice(i * 3, i * 3 + 3).forEach(function (c) {
        s += '<ellipse cx="' + c[0] + '" cy="' + c[1] + '" rx="11" ry="9" fill="#3A1F10"/>';
      });
      s += '</g>';
    });
    return svg(s + '</svg>');
  }

  /* ——— Şişe ve kap (kılavuz 12: renk karıştırma) ——— */
  function sise(renk) {
    var g = kimlik('sg');
    return svg('<svg viewBox="0 0 160 240"><defs>' + yumusak(g, renk) + '</defs>' +
      '<ellipse cx="80" cy="232" rx="56" ry="8" fill="rgba(60,40,20,.16)"/>' +
      '<rect x="56" y="10" width="48" height="30" rx="10" fill="#B98B5E"/>' +
      '<path d="M62 38h36v26c0 10 34 22 34 60v88a16 16 0 0 1-16 16H44a16 16 0 0 1-16-16v-88c0-38 34-50 34-60z" fill="rgba(230,245,255,.55)" stroke="#9CC3DA" stroke-width="6"/>' +
      '<path d="M34 128c0-18 14-28 46-28s46 10 46 28v84a12 12 0 0 1-12 12H46a12 12 0 0 1-12-12z" fill="url(#' + g + ')"/>' +
      '<path d="M50 120v84" stroke="#fff" stroke-width="8" stroke-linecap="round" opacity=".55"/></svg>');
  }
  function kap() {
    return svg('<svg viewBox="0 0 280 220"><ellipse cx="140" cy="206" rx="110" ry="12" fill="rgba(60,40,20,.16)"/>' +
      '<path class="sivi" d="M40 70h200l-22 110a26 26 0 0 1-26 20H88a26 26 0 0 1-26-20z" fill="#EAF6FF"/>' +
      '<ellipse class="yuzey" cx="140" cy="70" rx="100" ry="16" fill="#F6FBFF"/>' +
      '<path d="M26 58h228l-24 124a30 30 0 0 1-30 24H80a30 30 0 0 1-30-24z" fill="none" stroke="#9CC3DA" stroke-width="8" stroke-linejoin="round"/>' +
      '<path d="M66 84l14 88" stroke="#fff" stroke-width="9" stroke-linecap="round" opacity=".7"/></svg>');
  }

  /* ——— Pastel boya ——— */
  function boya(renk) {
    return svg('<svg viewBox="0 0 90 260"><path d="M20 70 45 8l25 62z" fill="' + kat(renk, 0.15) + '"/>' +
      '<path d="M36 30 45 8l9 22z" fill="' + kat(renk, -0.3) + '"/>' +
      '<rect x="18" y="66" width="54" height="186" rx="12" fill="' + renk + '"/>' +
      '<rect x="18" y="110" width="54" height="80" fill="' + kat(renk, 0.45) + '" opacity=".8"/>' +
      '<rect x="18" y="116" width="54" height="8" fill="' + kat(renk, -0.25) + '"/><rect x="18" y="176" width="54" height="8" fill="' + kat(renk, -0.25) + '"/>' +
      '<rect x="28" y="76" width="10" height="170" rx="5" fill="#fff" opacity=".35"/></svg>');
  }

  /* ——— Kaç Tane: tebeşir halka, rakam ve noktalar ——— */
  function halka(n) {
    var s = '<svg viewBox="0 0 240 240"><circle cx="120" cy="120" r="104" fill="rgba(255,255,255,.55)" stroke="#fff" stroke-width="10" stroke-dasharray="26 12" stroke-linecap="round"/>' +
      '<text x="120" y="126" text-anchor="middle" font-family="Nunito, ui-rounded, sans-serif" font-weight="900" font-size="112" fill="#5A3A26">' + n + '</text>';
    var noktalar = { 0: [], 1: [[120, 184]], 2: [[100, 184], [140, 184]], 6: [[80, 176], [120, 176], [160, 176], [80, 202], [120, 202], [160, 202]] }[n] || [];
    noktalar.forEach(function (p) { s += '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="11" fill="#FC5F42"/>'; });
    if (n === 0) s += '<circle cx="120" cy="190" r="14" fill="none" stroke="#FC5F42" stroke-width="5" stroke-dasharray="5 6"/>';
    return svg(s + '</svg>');
  }

  /* ——— Tablo ikonları: göz, ayak, anten; çocuk ve karınca yüzü ——— */
  function tabloIkon(ad) {
    var s = '<svg viewBox="0 0 120 120">';
    if (ad === 'goz') {
      s += '<path d="M12 60q48-50 96 0-48 50-96 0z" fill="#fff" stroke="#5A3A26" stroke-width="7" stroke-linejoin="round"/>' +
        '<circle cx="60" cy="60" r="20" fill="#4FA3E0"/><circle cx="60" cy="60" r="10" fill="#2a1a12"/><circle cx="66" cy="54" r="5" fill="#fff"/>';
    } else if (ad === 'ayak') {
      s += '<path d="M44 14h28v58c0 4 4 6 10 8l18 6c8 3 10 18-2 20H40c-8 0-12-4-12-12V38c0-14 6-24 16-24z" fill="#FFB38A" stroke="#5A3A26" stroke-width="6" stroke-linejoin="round"/>';
    } else if (ad === 'anten') {
      s += '<path d="M46 108C44 76 36 50 20 30M74 108c2-32 10-58 26-78" fill="none" stroke="#5A3A26" stroke-width="8" stroke-linecap="round"/>' +
        '<circle cx="20" cy="26" r="11" fill="#FC5F42"/><circle cx="100" cy="26" r="11" fill="#FC5F42"/>';
    }
    return svg(s + '</svg>');
  }
  function cocuk() {
    return svg('<svg viewBox="0 0 160 160"><circle cx="80" cy="84" r="62" fill="#FFD2B0"/>' +
      '<path d="M18 80c0-40 28-62 62-62s62 22 62 62c-10-16-28-26-48-26 6 8 6 14 4 18-16-14-44-18-80 8z" fill="#6B3E26"/>' +
      '<circle cx="58" cy="92" r="8" fill="#2a1a12"/><circle cx="102" cy="92" r="8" fill="#2a1a12"/>' +
      '<circle cx="61" cy="89" r="3" fill="#fff"/><circle cx="105" cy="89" r="3" fill="#fff"/>' +
      '<ellipse cx="44" cy="110" rx="10" ry="6" fill="#FF8C8C" opacity=".6"/><ellipse cx="116" cy="110" rx="10" ry="6" fill="#FF8C8C" opacity=".6"/>' +
      '<path d="M64 116q16 16 32 0" fill="none" stroke="#7A2A1C" stroke-width="6" stroke-linecap="round"/></svg>');
  }

  /* ——— Konfeti renkleri ve küçük yardımcılar ——— */
  var KONFETI = ['#FC5F42', '#FFC940', '#4FB477', '#4FA3E0', '#B07CE8', '#FF8FB1'];

  return {
    svg: svg,
    kat: kat,
    RENK: RENK,
    KONFETI: KONFETI,
    karinca: karinca,
    yuz: yuz,
    el: el,
    EL_UC: EL_UC,
    ikon: ikon,
    tas: tas,
    pipet: pipet,
    bardak: bardak,
    biskuvi: biskuvi,
    sise: sise,
    kap: kap,
    boya: boya,
    halka: halka,
    tabloIkon: tabloIkon,
    cocuk: cocuk
  };
})();
