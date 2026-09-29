/* Tombiş'in Hikâyeleri — 2. hafta "Tombiş'e Ziyaret" (değer: paylaşma).

   Anahtarın ilk harfi konuşanı söyler: t_ Tombiş, k_ Kökçe, p_ Pırıltı.
   Karışkan konuşmaz, yalnızca ses çıkarır. Metni değiştirirsen o satırı
   aynı sesle yeniden seslendir (bkz. HIKAYE.md). */

(function () {
  var M = {
    /* ——— Açılış ——— */
    t_h2_a1: 'Merhaba çocuklar! Geçen hafta düşmüştüm, hatırlıyor musunuz? Arkadaşlarım bana yardım etmişti. Dizim hâlâ sarılı, yatağımda dinleniyorum.',
    t_h2_a2: 'Tam o sırada kapı çalmıştı. Kim geldi acaba? Bugün de hikâyeye siz karar vereceksiniz: iki resim çıkınca elinizi kaldırın, bir arkadaşınız dokunsun.',
    t_h2_baslik: 'İkinci bölüm: Tombiş\'e Ziyaret',

    /* ——— Kapı ——— */
    t_h2_b1: 'Şşş! Dinleyin. Kapı kaç kere çalıyor? Her vuruşta birlikte sayalım!',
    t_h2_b2: 'Üç kere! Peki kim geldi? Pencereye bakın, üç gölge var. Hangisi Kökçe? Kökçe\'nin gölgesine dokunun!',
    t_h2_b3: 'Buldunuz! Bu Kökçe\'nin gölgesi. Yanındakiler de Pırıltı ve Karışkan olmalı. Karışkan yine ne yapıyor acaba?',
    t_h2_b4: 'Çocuklar, kapıyı hemen mi açalım, yoksa önce "Kim o?" diye mi soralım?',

    /* ——— A: Önce "Kim o?" ——— */
    t_h2_c1: 'Hadi hep birlikte soralım! Kapıya doğru bağırın: Kim o?',
    k_h2_c2: 'Biziz Tombiş! Kökçe ve Pırıltı! Sana hediyeler getirdik!',
    t_h2_c3: 'Arkadaşlarım gelmiş! Kapıyı açmadan önce kim olduğunu sormak çok akıllıca. Aferin size!',

    /* ——— B: Hemen aç ——— */
    t_h2_d1: 'Aaa! Karışkan! Kapıyı hemen açınca çok korktum. Bir dahaki sefere önce "Kim o?" diye soracağım.',
    k_h2_d2: 'Tombiş! Karışkan bizden önce kapına gelmiş, seni korkutmuş. Biz de geldik, sana hediyeler getirdik!',

    /* ——— Misafirler ——— */
    k_h2_e1: 'Nasılsın Tombiş? Dizin iyi mi? Sana kocaman bir çilekli pasta getirdim!',
    p_h2_e2: 'Ben de sana kırmızı bir top getirdim! Dizin iyileşince hep birlikte oynarız.',
    t_h2_e3: 'Ne güzel hediyeler! Çok teşekkür ederim arkadaşlarım!',
    t_h2_e4: 'Hmm... Pasta kocaman ve çok güzel kokuyor. Ama misafirlerim de var. Çocuklar, ne yapayım? Pastayı herkesle paylaşayım mı, yoksa kendime mi saklayayım?',

    /* ——— Paylaş: herkese bir dilim ——— */
    t_h2_f1: 'Pastayı paylaşalım! Ama herkese bir dilim düşsün. Arkadaşlarıma ve bana sırayla dokunun, her birine bir dilim verelim. Birlikte sayalım!',
    t_h2_f2: 'Altı dilim, altı arkadaş! Herkese bir dilim düştü, kimse açıkta kalmadı. Paylaşınca pasta daha da lezzetli oldu!',

    /* ——— Sakla: kendine ayırır ——— */
    t_h2_g1: 'Bu pasta benim! Hepsini ben yiyeceğim!',
    k_h2_g2: 'Ama Tombiş... Biz de tadına bakmak istemiştik.',
    t_h2_g3: 'Mmm... Ama bir şey eksik gibi. Arkadaşlarım köşede sessizce bakıyor. Kimse gülmüyor, kimse konuşmuyor.',
    t_h2_g4: 'Çocuklar, sizce Tombiş\'in arkadaşları şimdi nasıl hissediyor? Peki Tombiş mutlu mu? Biraz konuşalım.',
    t_h2_g5: 'Tombiş ne yapsın? Özür dileyip pastayı paylaşsın mı, yoksa tek başına yemeye devam mı etsin?',

    /* Özür */
    t_h2_h1: 'Arkadaşlarım, özür dilerim. Pastayı kendime sakladım, hiç güzel olmadı. Hadi birlikte yiyelim!',
    k_h2_h2: 'Özür dilediğin için teşekkürler Tombiş! Birlikte yiyince daha tatlı olur.',

    /* Yalnız */
    t_h2_i1: 'Arkadaşlarım gitti... Pasta hâlâ önümde ama hiç tadı yok. Odam da çok sessiz.',
    t_h2_i2: 'Dışarıdan sesler geliyor. Arkadaşlarım bahçede gülüyor. Ben burada tek başımayım... Ben de paylaşmak istiyorum!',
    t_h2_i3: 'Hadi onları geri çağıralım! Hep birlikte üç kere bağıralım: Arkadaşlar!',

    /* ——— Top: bir top, üç arkadaş ——— */
    p_h2_j1: 'Pasta çok güzeldi! Şimdi bahçede top oynayalım mı? Ama top bir tane, biz üç kişiyiz.',
    k_h2_j2: 'Ben de oynamak istiyorum! Ben! Ben!',
    t_h2_j3: 'Herkes topu istiyor ama top bir tane. Çocuklar, ne yapalım? Sırayla mı oynayalım, yoksa hep birlikte bir oyun mu kuralım?',

    /* Sırayla */
    t_h2_k1: 'Sırayla oynayalım! Önce Pırıltı, sonra Kökçe, sonra ben. Sıra kimdeyse ona dokunun, top ona gitsin!',
    t_h2_k2: 'Herkes sırasını bekledi, herkes oynadı! Sıra beklemek bazen zor ama böyle adil oluyor.',
    t_h2_k3: 'Şimdi siz! Ayağa kalkın. Öğretmeniniz kimi gösterirse o zıplasın, ötekiler beklesin. Beş kere zıpla: Bir, iki, üç, dört, beş! Sonra sıra ötekilerde!',

    /* Birlikte */
    t_h2_l1: 'Hep birlikte oynayalım! Topu birbirimize atalım. Top kimdeyse, kime atacağına dokunun!',
    t_h2_l2: 'Altı pas! Bir topla üç arkadaş oynadık, kimse beklemedi. Paylaşınca oyun daha eğlenceli!',
    t_h2_l3: 'Şimdi siz! Ayağa kalkın, yanınızdaki arkadaşınıza hayali bir top atın. At... Yakala... At... Yakala! Topu herkese ulaştırın!',

    /* ——— Eksik oyuncak ——— */
    t_h2_m1: 'Oyundan sonra odama döndük. Rafımdaki oyuncaklara iyi bakın: top, ayıcık, küpler, araba ve sepet. Beş oyuncak! Aklınızda tutun.',
    t_h2_m2: 'Karışkan yine yaramazlık yaptı! Bir oyuncak kayboldu. Hangisi eksik? Aşağıdaki resimlerden eksik olana dokunun!',
    t_h2_m3: 'Buldunuz! Karışkan onu pencereden geri fırlattı. Galiba Karışkan da oynamak istiyor ama nasıl olacağını bilmiyor.',

    /* ——— Teşekkür ——— */
    t_h2_n1: 'Arkadaşlarım bana hediyeler getirdi, ben de onlara bir şey vermek istiyorum. Ne yapayım? Onlara bir resim mi çizeyim, yoksa hep birlikte şarkı mı söyleyelim?',

    /* Resim: örüntü */
    t_h2_o1: 'Arkadaşlarım için çiçekli bir resim çiziyorum. Çiçekleri sırayla boyuyorum: kırmızı, sarı, kırmızı, sarı... Sonra hangi renk gelmeli? Doğru renge dokunun!',
    t_h2_o2: 'Kırmızı, sarı, kırmızı, sarı, kırmızı, sarı! Örüntüyü tamamladınız. Resim hazır!',
    k_h2_o3: 'Ne güzel bir resim! Teşekkür ederiz Tombiş!',

    /* Şarkı */
    t_h2_p1: 'Hadi hep birlikte Paylaşma şarkımızı söyleyelim! Ayağa kalkın, dans edelim!',
    p_h2_p2: 'Ne güzel şarkı söyledik! Teşekkür ederiz Tombiş!',

    /* ——— Kapanış ——— */
    t_h2_r1: 'Misafirlerim gitmeden önce Kökçe bana bir şey daha verdi.',
    k_h2_r2: 'Tombiş, bu sana son hediyem: küçücük bir tohum. Onu bahçene ek. Ama dikkat, hemen çiçek açmaz. Sabırlı olman gerek!',
    t_h2_r3: 'Bir tohum! Çok merak ettim, içinden ne çıkacak acaba?',
    t_h2_r4: 'Bugün ne öğrendik? Paylaşınca pasta daha tatlı, oyun daha eğlenceli oluyor. Kendime saklasaydım tek başıma kalırdım.',
    t_h2_r5: 'Şimdi sıra sizde! Siz bugün ne paylaştınız? Bir arkadaşınız sizinle bir şey paylaştı mı? Anlatın bakalım.',
    t_h2_r6: 'Bugün hepiniz Paylaşma Yıldızı rozeti kazandınız!',
    t_h2_r7: 'Hadi şimdi ayağa kalkalım ve Paylaşma şarkımızla dans edelim!',
    muzik_h2_sarki: '♪ Paylaş, paylaş, ne varsa paylaş! Bir dilim sana, bir dilim bana, birlikte daha tatlı! ♪',
    t_h2_r8: 'Tohumu yarın sabah ekeceğim. Acaba ne zaman büyür? Bunu gelecek hafta göreceğiz. Hoşça kalın çocuklar!'
  };
  for (var k in M) if (M.hasOwnProperty(k)) window.METIN[k] = M[k];
})();
