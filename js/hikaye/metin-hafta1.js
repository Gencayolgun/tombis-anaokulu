/* Tombiş'in Hikâyeleri — 1. hafta "Tombiş Düştü!" (değer: yardımlaşma).

   Anahtarın ilk harfi konuşanı söyler: t_ Tombiş, k_ Kökçe, p_ Pırıltı.
   Karışkan konuşmaz, yalnızca ses çıkarır. Metni değiştirirsen o satırı
   aynı sesle yeniden seslendir (bkz. HIKAYE.md). */

(function () {
  var M = {
    /* ——— Bütün haftalarda ortak ——— */
    t_hk_sec1: 'Tamam, öyle yapalım!',
    t_hk_sec2: 'Güzel seçim! Bakalım şimdi ne olacak?',
    t_hk_oyla: 'Hangisini istiyorsunuz? Elinizi kaldırın! En çok el kalkan resme bir arkadaşınız dokunsun.',
    t_hk_devam: 'Hazır olunca Devam düğmesine dokunun.',

    /* ——— Açılış ——— */
    t_h1_a1: 'Merhaba çocuklar! Ben Tombiş. Bugün size bir çizgi film izleteceğim. Ama bu çizgi filmde ne olacağına siz karar vereceksiniz!',
    t_h1_a2: 'Hikâye durunca iki resim çıkacak. Hangisini isterseniz elinizi kaldırın. Sonra bir arkadaşınız o resme dokunsun.',
    t_h1_a3: 'Hazır mısınız? Hep birlikte sayalım: Bir, iki, üç... Hikâye başlasın!',
    t_h1_baslik: 'Birinci bölüm: Tombiş Düştü!',

    /* ——— Sabah ——— */
    t_h1_b1: 'Günaydın! Bugün çok güzel bir gün. Sepetim çilek dolu!',
    k_h1_b2: 'Günaydın Tombiş! Nereye gidiyorsun öyle?',
    t_h1_b3: 'Karınca Yuvası\'na! Karıncalar bu akşam şölen yapacak. Onlara çilek götürüyorum.',
    k_h1_b4: 'Ben de geleyim mi? Birlikte gidelim!',
    t_h1_b5: 'Karınca Yuvası\'na iki yol gidiyor: çiçekli yol ve dere yolu. Sizce hangisinden gidelim?',

    /* ——— Çiçekli yol ——— */
    t_h1_c1: 'Ooo, ne çok çiçek var! Karıncalara çiçek de götürelim. Beş papatya toplayalım. Papatyalara dokunun, birlikte sayalım!',
    t_h1_c2: 'Beş papatya! Aferin size.',
    t_h1_c3: 'Şşş! Çiçeklerin arasında biri saklanıyor. Kim o? Görünce hemen dokunun!',
    t_h1_c4: 'Karışkan! Yine bir yaramazlık mı yapıyorsun?',

    /* ——— Dere yolu ——— */
    t_h1_d1: 'Dereden geçmek için taşlara basmalıyız. Taşların üstünde noktalar var. Önce bir noktalı taşa, sonra iki noktalıya... Sırayla dokunun!',
    t_h1_d2: 'Geçtik! Siz çok dikkatlisiniz.',
    t_h1_d3: 'Şşş! Bakın, bir taş kendi kendine sallanıyor. Hangi taş sallanıyor? Bulun bakalım!',
    t_h1_d4: 'Karışkan! Taşın altına sen mi saklandın?',

    /* ——— Düşme ——— */
    t_h1_e1: 'Karınca Yuvası\'nı görüyorum! Az kaldı!',
    t_h1_e2: 'Ahh! Ayağım takıldı, düştüm! Dizim çok acıyor... Çileklerim de dağıldı.',
    k_h1_e3: 'Ama şölen başlamak üzere... Hemen gitmezsem geç kalırım...',
    t_h1_e4: 'Çocuklar, Kökçe ne yapsın? Bana yardım mı etsin, yoksa şölene mi koşsun?',

    /* ——— Yardım yolu ——— */
    k_h1_f1: 'Tombiş! İyi misin? Dur, sana yardım edeyim. Elimi tut!',
    t_h1_f2: 'Hadi hep birlikte ayağa kalkalım ve Kökçe\'ye yardım edelim! Elinizi uzatın... Bir, iki, üç, kalk!',
    t_h1_f3: 'Teşekkür ederim Kökçe. Ama dizim hâlâ acıyor. Ne yapalım?',
    k_h1_g1: 'Şu büyük yapraklarla dizini saralım! Yapraklara dokunun!',
    t_h1_g2: 'Üç yaprak! Dizim sarıldı. Çok daha iyi oldum!',
    t_h1_h1: 'Pırıltı çok uzakta. Onu hep birlikte çağıralım! Üç kere bağıralım: Pı-rıl-tı!',
    p_h1_h2: 'Buradayım! Tombiş, sana şifalı bir yaprak getirdim. Hadi dizine saralım.',
    t_h1_h3: 'Teşekkür ederim Pırıltı! Artık çok daha iyiyim.',

    /* ——— Koşma yolu ——— */
    t_h1_i1: 'Kökçe koşa koşa çilek tarlasına gitti. Ama bakın... Burada kimse yok. Arkadaşları olmadan şölen başlamamış.',
    k_h1_i2: 'Hmm... Tek başıma hiç eğlenceli değil. Tombiş\'i de yerde bıraktım.',
    t_h1_i3: 'Çocuklar, sizce Tombiş şimdi nasıl hissediyor? Peki Kökçe nasıl hissediyor? Biraz konuşalım.',
    t_h1_i4: 'Kökçe ne yapsın? Geri dönüp özür mü dilesin, yoksa burada tek başına mı beklesin?',
    k_h1_j1: 'Tombiş, seni bırakıp gittim. Özür dilerim. Sana yardım edebilir miyim?',
    t_h1_j2: 'Tabii ki! Özür dilediğin için teşekkür ederim Kökçe.',
    t_h1_k1: 'Bakın! Karınca Yuvası\'ndan karıncalar geliyor! Beni görmüşler, yardıma koşuyorlar! Karıncalara dokunun, sayalım!',
    t_h1_k2: 'Altı karınca! Birlikte olunca her şey kolaylaşıyor.',
    k_h1_k3: 'Herkes Tombiş\'e yardım ediyor... Ben de yardım etmek istiyorum!',
    k_h1_k4: 'Tombiş, seni bıraktığım için özür dilerim. Ben de yardım edebilir miyim?',

    /* ——— Çilek toplama ——— */
    t_h1_l1: 'Şimdi dağılan çilekleri toplayalım! Her çileğe dokunun, sepete atalım. Hep birlikte sayalım!',
    t_h1_l2: 'Sekiz çilek! Ama dur... Bir çilek daha vardı. Dokuzuncu çilek nerede? Karışkan\'ı görünce hemen dokunun!',
    t_h1_l3: 'Buldunuz! Karışkan çileği geri verdi. Bakın, biraz mahcup oldu.',
    t_h1_l4: 'Ama benim dizim hâlâ biraz acıyor. Karınca Yuvası\'na nasıl gidelim?',

    /* ——— Yuvaya gidiş ——— */
    t_h1_m1: 'Hadi hepimiz ayağa kalkalım. Arkadaşımızın koluna girmiş gibi yavaş yavaş yürüyelim. Yavaş... Yavaş... Dikkatli...',
    t_h1_m2: 'Yavaş yavaş ama birlikte geldik!',
    t_h1_n1: 'Hep birlikte ipi çekelim! Ellerinizle çekin: Çek, çek, çek! Hooop!',
    t_h1_n2: 'Kızakla kaya kaya geldik! Ne eğlenceliydi!',

    /* ——— Karınca Yuvası ——— */
    t_h1_o1: 'Karınca Yuvası\'na geldik! Karıncalar çileklere çok sevindi.',
    t_h1_o2: 'Bugün arkadaşlarım bana yardım etti. Onlara teşekkür etmek istiyorum. Nasıl teşekkür edelim?',
    t_h1_p1: 'Teşekkür ederim arkadaşlarım! Hadi hepiniz kendinize kocaman sarılın. Sımsıkı!',
    t_h1_p2: 'Teşekkür ederim arkadaşlarım! Size birer çilek ikram edeyim. Arkadaşlarıma dokunun, herkese bir tane!',
    t_h1_p3: 'Herkes bir çilek aldı! Paylaşınca daha da tatlı oluyor.',

    /* ——— Kapanış ——— */
    t_h1_r1: 'Akşam oldu. Dizim sarılı, yatağımda dinleniyorum. Bugün ne öğrendik? Birisi düşünce ya da zorlanınca ona yardım ederiz. Yardımlaşınca her şey kolaylaşır!',
    t_h1_r2: 'Şimdi sıra sizde! Siz hiç birine yardım ettiniz mi? Size kim yardım etti? Anlatın bakalım.',
    t_h1_r3: 'Bugün hepiniz Yardım Kalbi rozeti kazandınız!',
    t_h1_r4: 'Hadi şimdi ayağa kalkalım ve Yardımlaşma şarkımızla dans edelim!',
    t_h1_r5: 'Ama dizim iyileşene kadar birkaç gün evde kalmam gerekiyor. Tek başıma belki biraz sıkılırım...',
    muzik_h1_sarki: '♪ Yardım et, yardım et, el ele verelim! Yardım et, yardım et, birlikte güçlüyüz biz! ♪',
    t_h1_r6: 'Aaa, kapı çalıyor! Acaba kim geldi? Bunu gelecek hafta göreceğiz. Hoşça kalın çocuklar!'
  };
  for (var k in M) if (M.hasOwnProperty(k)) window.METIN[k] = M[k];
})();
