/* Tombiş — Karınca Yuvası: bütün konuşmalar.

   KURAL: Anlatıcı her zaman Tombiş. Karıncalar kendini tanıtmaz, Tombiş
   tanıtır. Karışkan konuşmaz, yalnızca ses çıkarır.

   Her satır ses/<anahtar>.mp3 olarak seslendirilir (bkz. OKU-BENI.md). Ses
   dosyası yoksa aynı metin altyazı olarak görünür ve tarayıcı Türkçe
   okuyabiliyorsa okunur. Metni değiştirirsen o satırı yeniden seslendir. */

window.METIN = {
  /* ——— Genel ——— */
  giris_1: 'Merhaba! Ben Tombiş. Bugün seninle Çemberbahçe\'deki Karınca Yuvası\'na gidiyoruz!',
  giris_2: 'Aaa, bak! Karışkan yine her şeyi karıştırmış. Karıncalara birlikte yardım edelim mi?',
  menu: 'Hangi oyunla başlayalım?',
  aferin_1: 'Aferin sana!',
  aferin_2: 'Harika!',
  aferin_3: 'Çok güzel!',
  aferin_4: 'Süpersin!',
  aferin_5: 'Bravo!',
  tekrar_1: 'Hmm, bir daha bakalım.',
  tekrar_2: 'Olmadı ama sorun değil. Bir daha dene!',
  bitti: 'Yaşasın! Bu oyunu bitirdik!',
  final: 'Karınca Yuvası\'nda her şey yerli yerine oturdu. Karışkan da artık yardım ediyor. Teşekkürler, görüşürüz!',
  sayi_0: 'Sıfır!',
  sayi_1: 'Bir!',
  sayi_2: 'İki!',
  sayi_3: 'Üç!',
  sayi_4: 'Dört!',
  sayi_5: 'Beş!',
  sayi_6: 'Altı!',
  sayi_7: 'Yedi!',
  sayi_8: 'Sekiz!',
  sayi_9: 'Dokuz!',
  sayi_10: 'On!',

  /* ——— Karınca Yap (kılavuz 1, 7 · kitap s. 11) ——— */
  vuc_giris: 'Hadi birlikte bir karınca yapalım! Karıncanın vücudu üç parçadır. Parlayan yerlere dokun.',
  vuc_anten: 'Şimdi antenler! Karıncanın iki anteni var.',
  vuc_bacak: 'Şimdi bacaklar! Karıncanın altı bacağı var.',
  vuc_son: 'Karıncamız hazır! Üç parça, iki anten, altı bacak.',
  soh_kucuk: 'Karınca kadar minicik olsaydın, en çok neyi yapmakta zorlanırdın?',

  /* ——— Kaç Tane? (kılavuz 1, 11) ——— */
  kac_giris: 'Şimdi sayma oyunu! Ben soracağım, sen doğru halkaya dokun.',
  kac_karinca_goz: 'Karıncanın kaç gözü var?',
  kac_sen_goz: 'Peki senin kaç gözün var?',
  kac_karinca_bacak: 'Karıncanın kaç bacağı var?',
  kac_sen_ayak: 'Senin kaç ayağın var?',
  kac_karinca_anten: 'Karıncanın kaç anteni var?',
  kac_sen_anten: 'Senin kaç antenin var?',
  kac_son: 'Tablomuz doldu! Karıncanın altı bacağı var, bizim iki ayağımız var.',

  /* ——— Çiz (kitap s. 1, 3) ——— */
  ciz_giris: 'Hadi bir karınca resmi çizelim! Bir boya seç, noktaların üstünden git.',
  ciz_toplanma: 'Karıncalar bir araya toplanmış. Sence neden? Ortaya çiz ya da bir resim koy.',
  ciz_bitti: 'Ne güzel bir resim oldu!',

  /* ——— Örüntü (kılavuz 2 · kitap s. 2) ——— */
  oru_giris: 'Uğur böcekleri ve karıncalar sıraya dizilmiş. Sırada kim var?',
  oru_soru: 'Sırada kim var? Dokun!',
  oru_son: 'Örüntüleri tamamladın!',

  /* ——— Meslekler (kılavuz 3, 10 · kitap s. 5, 6, 9) ——— */
  mes_giris: 'Karıncaların da meslekleri var! Kartlara dokun, onlarla tanış.',
  mes_ciftci: 'Bu çiftçi karınca. Yuvanın bahçesinde mantar yetiştirir.',
  mes_terzi: 'Bu terzi karınca. Yaprakları birbirine diker.',
  mes_bekci: 'Bu bekçi karınca. Kapıda durur, yuvayı korur.',
  mes_isci: 'Bu işçi karınca. Yiyecekleri taşır, ambara götürür.',
  mes_kralice: 'Bu kraliçe karınca. Yuvadaki yumurtaları o yumurtlar.',
  mes_bakici: 'Bu bakıcı karınca. Minik yavrulara o bakar.',
  mes_esle: 'Şimdi herkesi işinin başına gönderelim!',
  mes_soru_ciftci: 'Çiftçi karınca nereye gitmeli?',
  mes_soru_terzi: 'Terzi karınca nereye gitmeli?',
  mes_soru_bekci: 'Bekçi karınca nereye gitmeli?',
  mes_soru_isci: 'İşçi karınca nereye gitmeli?',
  mes_soru_kralice: 'Kraliçe karınca nereye gitmeli?',
  mes_soru_bakici: 'Bakıcı karınca nereye gitmeli?',
  mes_son: 'Herkes işinin başında! Birlikte çalışınca yuva çok güzel oluyor.',
  mes_sohbet: 'Sen büyüyünce hangi mesleği seçmek istersin?',

  /* ——— Yaprak Dik (kılavuz 3) ——— */
  dik_giris: 'Terzi karınca yuva yapıyor. Yaprakları birlikte dikelim! İğneyi noktalı yolda yürüt.',
  dik_bilgi: 'Biliyor musun? Terzi karıncalar yaprakları yavrularının ipeğiyle diker.',
  dik_son: 'Yaprak yuva hazır!',

  /* ——— Yuvaya Giden Yol (kılavuz 5 · kitap s. 4) ——— */
  yol_giris: 'Karıncalar yuvaya dönmek istiyor. Parmağını karıncanın üstüne koy, noktalı yolu takip et.',
  yol_ipucu: 'Parmağını kaldırmadan, yavaşça yürüt.',
  yol_son: 'Yuvaya vardılar! Arkadaşlarla yolculuk daha güzel.',

  /* ——— Karınca Olalım (kılavuz 4, 8) ——— */
  har_giris: 'Şimdi hepimiz karınca oluyoruz! Ben söyleyeceğim, siz yapacaksınız. Hazır mısınız?',
  har_ruzgar: 'Rüzgâr esiyor! Sıkı tutunun!',
  har_gunes: 'Güneş açtı. Biraz dinlenin.',
  har_yagmur: 'Yağmur yağıyor! Yuvaya dolan suyu için!',
  har_tehlike: 'Tehlike! Hemen yuvanıza dönün!',
  har_yiyecek: 'Yiyecek buldunuz! Antenlerinizle arkadaşlarınıza haber verin!',
  har_tasima: 'Ağır bir yük var. Birlikte taşıyın!',
  har_zipla: 'Lider karınca zıplıyor. Siz de zıplayın!',
  har_don: 'Lider karınca dönüyor. Siz de dönün!',
  har_alkis: 'Lider karınca el çırpıyor. Siz de çırpın!',
  har_son: 'Harika karıncalardınız! Şimdi yerlerimize dönelim.',

  /* ——— Uzundan Kısaya (kılavuz 6) ——— */
  flu_giris: 'Pipetlerle bir flüt yapalım! En uzun pipeti bul ve ona dokun.',
  flu_sonraki: 'Şimdi kalanların en uzununu bul!',
  flu_uzun_degil: 'Daha uzun bir pipet var. Bir daha bak!',
  flu_cal: 'Flütümüz hazır! Pipetlere dokun, müzik yap!',

  /* ——— Mutfakta (kılavuz 7) ——— */
  mut_giris: 'Karıncalar mutfakta! Bu bisküvi bir bütün. Ortasına dokun, ikiye bölelim.',
  mut_yarim: 'İki yarım oldu! Bir daha dokun.',
  mut_dort: 'Şimdi dört parça! Karıncalar kırıntıları taşıyor.',
  mut_bardak: 'Şimdi bardaklara bakalım.',
  mut_dolu: 'Dolu bardağa dokun!',
  mut_bos: 'Boş bardağa dokun!',
  mut_yarimbardak: 'Yarım bardağa dokun!',
  mut_son: 'Boş, dolu ve yarımı öğrendik!',

  /* ——— Duygular (kılavuz 9) ——— */
  duy_giris: 'Karıncaların da duyguları var. Hadi bulalım!',
  duy_mutlu: 'Mutlu karıncayı bul!',
  duy_uzgun: 'Üzgün karıncayı bul!',
  duy_saskin: 'Şaşkın karıncayı bul!',
  duy_yorgun: 'Yorgun karıncayı bul!',
  duy_cilek: 'Karınca kocaman bir çilek buldu. Nasıl hisseder?',
  duy_yagmur: 'Yağmur yuvasını ıslattı. Nasıl hisseder?',
  duy_cekirge: 'Önüne birden bir çekirge zıpladı! Nasıl hisseder?',
  duy_tasidi: 'Bütün gün yük taşıdı. Nasıl hisseder?',
  duy_sen: 'Peki sen bugün nasıl hissediyorsun? Bir yüze dokun.',
  duy_tesekkur: 'Anlattığın için teşekkürler!',

  /* ——— Masal Kartları (kitap s. 7 · kılavuz 10, 11) ——— */
  mas_giris: 'Karıncanın böcek arkadaşları var. Üç kart seç, birlikte masal yapalım!',
  mas_ugur: 'Uğur böceği! Kırmızı sırtında siyah benekler var.',
  mas_cekirge: 'Çekirge! Uzun bacaklarıyla hop hop zıplar.',
  mas_yusufcuk: 'Yusufçuk! İnce kanatlarıyla suyun üstünde uçar.',
  mas_sinek: 'Sinek! Vızz diye uçar.',
  mas_yaprak: 'Yaprak böceği! Tıpkı bir yaprak gibi, saklanmayı çok sever.',
  mas_asker: 'Asker böceği! Kırmızı siyah desenli, kalabalık gezer.',
  mas_hazir: 'Kartlar hazır! Masalı başlatmak için oynat düğmesine dokun.',
  mas_1: 'Bir varmış, bir yokmuş... Küçük bir karınca varmış.',
  mas_2: 'Karınca bir gün yolda biriyle karşılaşmış. Kiminle karşılaşmış?',
  mas_3: 'Sonra ne olmuş?',
  mas_4: 'En sonunda ne olmuş?',
  mas_son: 'Ve hep birlikte mutlu olmuşlar. Masalımız burada bitti!',

  /* ——— Renkli Karıncalar (kitap s. 10 · kılavuz 12) ——— */
  ren_giris: 'Karıncalar tatlı şerbet içmiş, renk renk olmuşlar!',
  ren_turuncu: 'Turuncu karıncaları bul!',
  ren_kahverengi: 'Kahverengi karıncaları bul!',
  ren_siyah: 'Siyah karıncaları bul!',
  ren_bu_turuncu: 'Bu turuncu.',
  ren_bu_kahverengi: 'Bu kahverengi.',
  ren_bu_siyah: 'Bu siyah.',
  ren_karistir: 'Karıncaların midesi şeffaftır, içtikleri renk görünür! İki şişeye dokun, renkleri karıştıralım.',
  ren_oldu_turuncu: 'Turuncu oldu!',
  ren_oldu_yesil: 'Yeşil oldu!',
  ren_oldu_mor: 'Mor oldu!',
  ren_son: 'Rengârenk karıncalar oldu!',

  /* ——— Sağ-Sol (kitap s. 12) ——— */
  ss_giris: 'İki elini de kullan! İki parmağını iki karıncanın üstüne koy. Birlikte aşağı indir, yapraklara ulaştır.',
  ss_bekle: 'Karınca arkadaşını bekliyor. Birlikte!',
  ss_son: 'İki karınca da yaprağa ulaştı!',

  /* ——— Birlikte Taşıyalım (kitap s. 3, 4 · kılavuz 4) ——— */
  tas_giris: 'Karıncalar kocaman bir çilek buldu! Ama çok ağır. Yere dokunarak karıncaları yardıma çağır!',
  tas_kariskan: 'Bak! Karışkan da yardım etmek istiyor!',
  tas_hep: 'Hep birlikte, hooop!',
  tas_son: 'Birlikte taşıdık! Birbirimize yardım edince her şey kolaylaşıyor.',
  soh_yuk: 'Sen hiç çok ağır bir şey taşıdın mı? Kim sana yardım etti?'
};
