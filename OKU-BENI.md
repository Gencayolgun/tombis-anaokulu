# Karınca Yuvası — Tombiş ile akıllı tahta oyunu

4 yaş (48+ ay) için, sınıfta akıllı tahtada oynanan bir oyun. Karınca ünitesi
derste nasıl işleniyorsa oyun da öyle ilerliyor. İki kaynağa dayanıyor:

- **Karıncanın Dünyası** etkinlik kitabı (Multibem, 13 sayfa)
- **Öğretmen Kılavuzu, Karınca ünitesi** (12 etkinlik, s. 51–62)

Oyun **Tombiş evreninde** geçiyor. Yeri Çemberbahçe'deki Tohum Çayırı'nın
altındaki **Karınca Yuvası**. Karışkan yuvadaki her şeyi karıştırmış; her oyun
bir şeyi yerine koyuyor, finalde Karışkan da yardım ediyor.

> **Kural: anlatıcı her zaman Tombiş.** Karıncalar kendini tanıtmaz, Tombiş
> tanıtır ("Bu çiftçi karınca…"). Karışkan konuşmaz, yalnızca ses çıkarır.
> Yeni bir satır yazarken bu kurala uy.

---

## Tahtada açmak

1. `anaokulu/` klasörünü tahtanın bilgisayarına kopyala. USB bellek yeterli.
2. `index.html` dosyasını Chrome ya da Edge ile aç. Sunucu ya da kurulum gerekmez.
3. **Başla**'ya dokun. Oyun tam ekrana geçer ve Tombiş konuşmaya başlar.

Sahne her zaman 1920×1080 çizilir ve ekrana sığdırılır. 4K tahtada da, 4:3
ya da 5:4 ekranda da oranı bozulmaz.

### Seslendirme

Tombiş'in 131 repliği NatureCo ile Türkçe, çocuk sesiyle (MiniMax `Sweet_Girl_2`) seslendirildi ve NatureCo
galerisinde duruyor. Oyun her satırı şu sırayla dener:

1. `ses/<anahtar>.mp3`: tahtaya kopyalanmış dosya, internet gerekmez.
2. NatureCo galerisi: tahta internete bağlıysa kendiliğinden çalar.
3. Tarayıcının Türkçe sesi: bilgisayarda Türkçe ses paketi varsa.
4. Yalnız altyazı: süre metnin uzunluğundan hesaplanır, akış bozulmaz.

**Tahta internetsizse** sesleri bir kez indir. İnternet olan bir bilgisayarda
şunu çalıştır:

```
node anaokulu/araclar/ses-indir.mjs
```

Sonra `anaokulu/` klasörünü tahtaya kopyala. Node 18 ya da sonrası gerekir.

Metinlerin hepsi `js/metinler.js` içinde, galeri adresleri `js/ses-kaynak.js`
içinde. Bir metni değiştirirsen o satırı NatureCo'da yeniden seslendir ve
adresi güncelle.

---

## Öğretmen için

- **Sağ üstteki düğmeler:** oyunlar (menü), baştan başlat, ses aç/kapa, tam ekran.
  Bu şerit tahtanın üstünde durur, çocukların eli yetişmez.
- **Tombiş'e dokun:** son talimatı yeniden söyler.
- **Çocuk 9 saniye dokunmazsa** Tombiş talimatı tekrarlar ve bir el nereye
  dokunulacağını gösterir. Bu en fazla üç kez olur.
- **Menüdeki yeşil işaret:** o oyunun bu tahtada bitirildiğini gösterir.
  Sağ alttaki düğmeye iki kez dokunursan işaretler yeni sınıf için silinir.
- **Kısayol:** adresin sonuna `#oyun=renk` gibi bir kod eklersen oyun doğrudan
  o etkinlikle açılır. Kodlar aşağıdaki tabloda.
- **Sohbet zamanı:** bazı oyunların sonunda Tombiş sınıfa bir soru sorar.
  Bunlar kitaptaki not kâğıtlarındaki soruların karşılığı.
- **Resmi kaydet:** "Karınca Çiz"de indirme düğmesi çizimi PNG olarak kaydeder
  (portfolyo için).

---

## Tombiş'in Hikâyeleri (seçmeli çizgi film)

Menüdeki **Hikâyeler** düğmesi 6 haftalık bir çizgi film dizisini açar
(kısayol `#hikaye=1`). Hikâye önemli anlarda durur, sınıf iki resimden
birini seçer ve hikâye o yönde değişir. Her bölüm bir değer öğretir ve
30–35 dakikalık bir dersi doldurur. Plan, öğretmen notları ve yeni hafta
ekleme: [HIKAYE.md](HIKAYE.md).

---

## Etkinlikler

Menüdeki sıra ders akışını izliyor.

| # | Oyun (kod) | Kitap | Kılavuz | Tahtada ne oluyor | Beceri |
|---|---|---|---|---|---|
| 1 | Karınca Yap (`vucut`) | s. 11 | 1, 7 | Parlayan parçalara dokunarak karınca kurulur; Tombiş sayar: 3 parça, 2 anten, 6 bacak | Vücut bölümleri, sayma |
| 2 | Kaç Tane? (`kactane`) | — | 1, 11 | Bahçe halkaları gibi 0-1-2-6 halkaları; "Karıncanın kaç bacağı var? Senin kaç ayağın var?" Cevaplar "Sen / Karınca" tablosuna yazılır | Sayı-miktar, karşılaştırma |
| 3 | Karınca Çiz (`ciz`) | s. 1, 3 | 1 | Parmakla boyama. 1. sayfa noktalı karınca rehberi, 2. sayfa halka olmuş karıncaların ortasına çizim ya da resim | İnce motor, ifade |
| 4 | Örüntü (`oruntu`) | s. 2 | 2 | Boyalı taşlarla örüntü (uğur böceği / karınca); son turda çekirge eklenir | Örüntü |
| 5 | Meslekler (`meslek`) | s. 5, 6, 9 | 3, 8, 10 | Kartlar açılır, Tombiş altı mesleği tanıtır; sonra her karınca yuvadaki odasına gönderilir | Meslekler, eşleştirme |
| 6 | Yaprak Dik (`dikis`) | — | 3 | İğne parmakla dikiş yolunda yürütülür: düz, zikzak, dalga. Sonunda yaprak yuva | İnce motor |
| 7 | Yuvaya Giden Yol (`yol`) | s. 4 | 5 | Karınca noktalı yolda yuvaya götürülür; yoldaki arkadaşlar trene katılır. Kıvrım, kısa sarmal, uzun sarmal | Yazıya hazırlık çizgileri |
| 8 | Karınca Olalım (`hareket`) | — | 4, 8 | Bütün sınıf ayakta: rüzgâr, güneş, yağmur, tehlike, yiyecek, yük; lider karıncayı taklit (zıpla, dön, el çırp) | Büyük motor, drama |
| 9 | Uzundan Kısaya (`flut`) | — | 6 | Her seferinde en uzun pipet bulunur, flüt kurulur, sonra pipetlerle müzik yapılır | Sıralama, ses yüksekliği |
| 10 | Mutfakta (`mutfak`) | — | 7 | Bisküvi: bütün, iki yarım, dört parça. Bardaklar: boş, yarım, dolu | Bütün-yarım, boş-dolu |
| 11 | Duygular (`duygu`) | — | 9 | Yüz bulma, "ne yaşadı, nasıl hisseder?", "sen bugün nasılsın?" | Duygu tanıma |
| 12 | Masal Kartları (`masal`) | s. 7 | 10, 11 | Üç böcek kartı seçilir, Tombiş masalı başlatır, her durakta sınıf devam ettirir | Dil, hikâye kurma |
| 13 | Renkli Karıncalar (`renk`) | s. 10 | 12 | Turuncu, kahverengi, siyah karıncalar halkaya alınır; sonra iki şişe karıştırılır, karınca içer, şeffaf midesi renklenir | Renkler, renk karışımı |
| 14 | Sağ-Sol (`sagsol`) | s. 12 | — | İki parmakla iki karınca aynı anda yapraklara indirilir; biri öne geçerse arkadaşını bekler | İki el koordinasyonu |
| 15 | Birlikte Taşıyalım (`tasima`) | s. 3, 4 | 4 | Dokunuşla karıncalar çileğe koşar, Tombiş 1'den 10'a sayar; Karışkan da yardıma gelir, çilek yuvaya taşınır. Ardından final | İş birliği, sayma |

Kılavuzun bahçe, mutfak ve malzeme gerektiren kısımları (taş boyama,
bisküvi yoğurma, çorap karınca, kavanozda gözlem) sınıfta yapılmaya devam
eder. Oyun bu etkinliklerin tahtadaki tamamlayıcısı, yerine geçmez.

---

## 4 yaş ve akıllı tahta için tasarım kuralları

- **Okuma gerekmez.** Her yönerge sesli; altyazı öğretmen içindir.
- **Kaybetmek yok.** Süre, can ve puan yok. Yanlış dokunuşta kart sallanır,
  Tombiş "bir daha bakalım" der; iki yanlıştan sonra doğru kart parlar.
- **Erişim bölgesi.** Dokunulacak her şey ekranın alt üçte ikisinde, çünkü
  duvardaki tahtanın üstüne 4 yaşın eli yetişmez.
- **Büyük hedefler.** En küçük dokunma alanı yaklaşık 130 sahne pikseli.
  Çizgi takibinde yoldan sapma payı geniş, sapınca karınca bekler, düşmez.
- **Çok dokunuş.** Sağ-Sol, Çiz ve Birlikte Taşıyalım aynı anda birden çok
  parmağı kabul eder; iki çocuk yan yana oynayabilir. Tek dokunuşlu eski
  tahtalarda da oynanabilir.
- **Uzun basış** tahtalarda sağ tık menüsü açar; oyun bunu engeller.
- **Reklam yok, izleme yok, hesap yok.** Mobil Tombiş'teki reklam kodu bu
  pakette yok. Kaydedilen tek şey tahtadaki "bitti" işaretleri.

---

## Görseller ve telif

Bütün karakterler, sahneler ve ikonlar NatureCo ile, mevcut Tombiş maskotu
referans verilerek üretildi (`gorsel/`). Rengi değişen, yürüyen ya da parça
parça kurulan şeyler kodla çiziliyor (`js/cizim.js`). Kitabın fotoğrafları,
çizimleri ve cümleleri kopyalanmadı. Etkinlik fikirleri kitaptan ve
kılavuzdan, metinler ve görseller özgün.

Karakter ve nesne sayfaları düz magenta zeminde üretilip kesildi. Yeni
görsel eklemek için:

```
python3 araclar/gorsel-hazirla.py kes <sayfa.webp> gorsel ad1,ad2,... --boy 420 --birlestir 20
python3 araclar/gorsel-hazirla.py arka <resim.webp> gorsel/arka-yeni.webp
```

### Kitapta fark ettiklerim

- **s. 5** kartında "Bakıcı Karınca", **s. 9** kutusunda "Dadı Karınca"
  yazıyor. Çocuk kartı kesip yapıştırırken iki yazı eşleşmiyor. Oyunda
  "Bakıcı" kullanıldı.
- **s. 7**'deki kırmızı-siyah böceğin kitapta adı yok; oyunda "asker böceği".

---

## Klasör

```
index.html               giriş; etkinlik sırası buradaki script sırası
css/tahta.css            tasarım
js/metinler.js           Tombiş'in bütün replikleri (seslendirmenin kaynağı)
js/ses-kaynak.js         repliklerin NatureCo galeri adresleri
js/ses.js                ses zinciri + Web Audio efektleri (dosyasız)
js/tahta.js              kabuk: ölçek, sahne, öğretmen şeridi, ipucu, bitiş
js/cizim.js              kodla çizilenler: karınca, yüzler, taşlar, pipet...
js/yol.js                parmakla yol takibi (yol, dikiş, sağ-sol)
js/menu.js               giriş, oyun haritası, final
js/etkinlik/*.js         15 etkinlik
gorsel/                  NatureCo görselleri (webp)
ses/                     indirilen seslendirmeler (ses-indir.mjs doldurur)
yazi/                    Nunito yazı tipi (SIL OFL)
araclar/                 gorsel-hazirla.py, ses-indir.mjs
```

## Yeni etkinlik ya da yeni kitap eklemek

Seride 16 "…'nın Dünyası" kitabı var; aynı kabuk hepsine yetiyor. Yeni bir
etkinlik için `js/etkinlik/` altına bir dosya açıp `T.etkinlik({...})` çağır
ve `index.html`'e ekle:

```js
T.etkinlik({
  kod: 'ornek', ad: 'Örnek', kaynak: 'Kitap s. 3 · Kılavuz 2',
  ikon: 'gorsel/ik-ornek.webp', arka: 'gorsel/arka-zemin.webp',
  sesler: ['ornek_giris'],
  kur: function (api) {
    api.talimat('ornek_giris');                        // Tombiş söyler
    var k = api.kart({ x: 960, y: 800, resim: 'gorsel/cilek.webp' });
    api.secim([k], 0).then(function () { api.bitti({}); });
  }
});
```

`api`'nin bütün yardımcıları `js/tahta.js` başında listeli. Etkinlik
değişince zamanlayıcılar, dinleyiciler ve bekleyen sözler kendiliğinden
susar.

## Test

Headless Chromium'da (Playwright) denendi:

- **15 etkinliğin hepsi** otomatik dokunuşlarla baştan sona oynandı ve
  bitiş perdesine ulaştı; JavaScript hatası yok.
- **Sağ-Sol** iki parmakla gerçek çoklu dokunuş olaylarıyla oynandı.
- **Ekran boyutları:** 1920×1080, 1366×768, 1280×1024 ve 3840×2160'ta sahne
  sığıyor ve dokunuş doğru yere düşüyor.
- **Ses dosyası ve internet yokken** giriş, süreli altyazıyla menüye ulaşıyor.
- **İpucu eli** her etkinlikte yaklaşık 9,5 saniye sonra çıkıyor.

Henüz denenmedi:

- NatureCo seslerinin gerçekten çalınması (test ortamının ağı kapalıydı).
- Gerçek bir akıllı tahtanın kızılötesi ya da kapasitif dokunmatiği ve
  Android tabanlı tahta tarayıcıları.
