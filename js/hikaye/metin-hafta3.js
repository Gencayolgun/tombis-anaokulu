/* Tombiş'in Hikâyeleri — 3. hafta "Kökçe'nin Tohumu" (değer: sabır ve sıra beklemek).

   Anahtarın ilk harfi konuşanı söyler: t_ Tombiş, k_ Kökçe, p_ Pırıltı,
   c_ Cingöz. Karışkan konuşmaz. Metni değiştirirsen o satırı aynı sesle
   yeniden seslendir (bkz. HIKAYE.md). */

(function () {
  var M = {
    /* ——— Açılış ——— */
    t_h3_a1: 'Merhaba çocuklar! Bakın, dizim iyileşti, yine koşabiliyorum! Geçen hafta Kökçe bana bir tohum vermişti. Bugün onu ekeceğim.',
    t_h3_a2: 'Hikâyeye yine siz karar vereceksiniz: iki resim çıkınca elinizi kaldırın, bir arkadaşınız dokunsun. Hazır mısınız?',
    t_h3_baslik: 'Üçüncü bölüm: Kökçe\'nin Tohumu',

    /* ——— Nereye ekelim? ——— */
    k_h3_b1: 'Günaydın Tombiş! Tohumu ekmeye hazır mısın? Ama önce nereye ekeceğimize karar verelim.',
    t_h3_b2: 'Tohumu nereye ekelim çocuklar? Güneşli yere mi, yoksa ağacın altındaki gölgeye mi?',
    k_h3_c1: 'Güneşli yer! Tohumlar güneşi ve sıcağı sever. Çok doğru seçtiniz.',
    k_h3_d1: 'Hmm, gölgede tohum üşür ve güneşi göremez. Hadi onu güneşli yere taşıyalım.',
    t_h3_d2: 'Tamam, güneşli yere ekelim!',

    /* ——— Ekme ——— */
    k_h3_e1: 'Ekmenin bir sırası var: önce kürekle toprağı kazarız, sonra tohumu koyarız, sonra sularız. Sırayla dokunun: kürek, tohum, su!',
    t_h3_e2: 'Kazdım, koydum, suladım! Hadi çiçek aç! Aç hadi! Neden açmıyor?',
    k_h3_e3: 'Tombiş, tohumun büyümesi zaman alır. Her gün biraz su, biraz güneş, biraz da sabır gerekir.',
    t_h3_e4: 'Sabır mı? Ben hemen çiçek istiyorum! Çocuklar, ne yapalım? Her gün birazcık mı sulayalım, yoksa bütün suyu şimdi bir kerede mi dökelim?',

    /* ——— Bütün suyu dök ——— */
    t_h3_f1: 'Hepsini dökelim, daha çabuk büyür!',
    k_h3_f2: 'Aaa, dur! Toprak göle döndü, tohum yüzüyor! Çok su da zarar verir Tombiş.',
    t_h3_f3: 'Ay... Acele ettim. Çocuklar, sizce neden acele etmemeliyim? Biraz konuşalım.',
    k_h3_f4: 'Toprak biraz dinlensin. Yarından başlayarak her gün birazcık sularız, olur mu?',
    t_h3_f5: 'Olur. Bu sefer sabırlı olacağım.',

    /* ——— Her gün sula: günleri say ——— */
    t_h3_g1: 'Her gün birazcık sulayacağım. Her gün için sulama kabına bir kez dokunun, günleri birlikte sayalım!',
    t_h3_g2: 'Üç gün geçti ama hiçbir şey görünmüyor. Acaba tohum orada mı? Kazıp bakalım mı, yoksa bekleyelim mi?',

    /* Kaz */
    t_h3_h1: 'Kazıp bakalım!',
    k_h3_h2: 'Bak, tohum çatlamış, minicik bir kök çıkmış! Ama kökler karanlıkta, toprağın altında büyür. Onu rahatsız ettik. Hemen yeniden örtelim: toprağa üç kez dokunun!',
    t_h3_h3: 'Özür dilerim küçük tohum! Üstünü örttüm. Bir daha kazmayacağım.',

    /* Bekle */
    k_h3_i1: 'Beklemek zor, biliyorum. Ama toprağın altında sihirli şeyler oluyor: kök uzuyor, tohum çatlıyor.',
    t_h3_i2: 'Tamam, bekliyorum. Beklerken hep birlikte sabır dansı yapalım! Ayağa kalkın: yavaş yavaş kök gibi uzayın, kollarınızı yaprak gibi açın!',

    /* ——— Park: salıncak sırası ——— */
    k_h3_j1: 'Beklerken parka gidelim mi? Salıncağa bineriz.',
    t_h3_j2: 'Parka geldik! Salıncakta sıra var: Pırıltı ve karıncalar bekliyor. Sırada kaç kişi var? Bekleyenlere dokunun, sayalım!',
    t_h3_j3: 'Dört kişi! Salıncağa çok binmek istiyorum. Çocuklar, ne yapalım? Sıranın önüne mi geçelim, sıraya mı girelim?',
    t_h3_k1: 'Ben önce bineyim!',
    p_h3_k2: 'Tombiş! Sıra bizdeydi! Öne geçmek hiç adil değil.',
    t_h3_k3: 'Haklısınız... Özür dilerim. Sıranın sonuna geçiyorum. Herkes sırasını bekleyecek, ben de bekleyeceğim.',
    p_h3_l1: 'Aferin Tombiş! Sıraya girdin. Herkes sırayla binecek, sen de bineceksin.',
    t_h3_l2: 'Şimdi sırayla binelim! Sırası kimdeyse ona dokunun, salıncağa binsin. Birlikte sayalım!',
    t_h3_m1: 'Sıra bana geldi! Hep birlikte sallanalım: ayağa kalkın, kollarınızı açın, öne... arkaya... öne... arkaya!',
    t_h3_m2: 'Beklemeye değdi! Sırayla binince herkes mutlu oluyor.',

    /* ——— Dönüş: filiz ve çiçek ——— */
    t_h3_n1: 'Bahçeye döndük. Bakın! Toprakta minicik yeşil bir filiz var!',
    k_h3_n2: 'Gördün mü Tombiş? Sabrettin, filiz çıktı. Ama daha bitmedi, büyümeye devam edecek.',
    t_h3_n3: 'Günleri saymaya devam edelim! Her gün için sulama kabına dokunun.',
    t_h3_n4: 'Yedi gün! Ve... Çiçek açtı! Kocaman, pembe bir çiçek!',
    k_h3_o1: 'Bitkinin büyüme sırasını hatırlayalım: önce tohum, sonra filiz, sonra fidan, en son çiçek. Küçükten büyüğe sırayla dokunun!',
    t_h3_o2: 'Tohum, filiz, fidan, çiçek! Küçükten büyüğe, sırayla!',

    /* ——— Çiçeği ne yapalım? ——— */
    t_h3_p1: 'Çiçeğim çok güzel! Çocuklar, ne yapalım? Çiçeği koparıp Kökçe\'ye hediye mi edelim, yoksa bahçede bırakıp herkes görsün mü?',
    k_h3_q1: 'Teşekkür ederim Tombiş, ama koparırsan çiçek birkaç saatte solar. Bahçede kalırsa haftalarca açar, arılar gelir, yeni tohumlar verir.',
    t_h3_q2: 'O zaman bahçede kalsın! Herkes gelip baksın.',
    k_h3_r1: 'Çok güzel bir karar! Çiçek bahçede kalınca herkes onu görür, arılar gelir, yeni tohumlar verir.',
    t_h3_r2: 'Bir tohumdan bir sürü tohum! Sabrın karşılığı bu.',

    /* ——— Cingöz gelir ——— */
    c_h3_s1: 'Vaaay! Bu çiçek ne kadar güzel! Merhaba, ben Cingöz! Çok hızlı uçarım!',
    t_h3_s2: 'Merhaba Cingöz! Bu çiçeği Kökçe\'nin tohumundan büyüttük. Tam yedi gün bekledik.',
    c_h3_s3: 'Yedi gün mü? Ben yedi saniye bile bekleyemem! Bunu hemen Krista\'ya göstermeliyim! Hoşça kalın!',

    /* ——— Kapanış ——— */
    t_h3_t1: 'Bugün ne öğrendik? Bazı şeyler zaman alır. Tohum bir günde büyümez, salıncakta sıra beklemek gerekir. Sabredince güzel şeyler olur.',
    t_h3_t2: 'Şimdi sıra sizde! Siz en çok neyi beklerken zorlanıyorsunuz? Beklerken ne yapıyorsunuz? Anlatın bakalım.',
    t_h3_t3: 'Bugün hepiniz Sabır Tohumu rozeti kazandınız!',
    t_h3_t4: 'Hadi ayağa kalkalım, Sabır şarkımızla dans edelim!',
    muzik_h3_sarki: '♪ Bekle bekle, sabırla bekle! Tohum büyür, çiçek açar, sıra sana da gelir! ♪',
    t_h3_t5: 'Cingöz çok hızlı gitti... Umarım koşarken bir şeye çarpmaz! Bunu gelecek hafta göreceğiz. Hoşça kalın çocuklar!'
  };
  for (var k in M) if (M.hasOwnProperty(k)) window.METIN[k] = M[k];
})();
