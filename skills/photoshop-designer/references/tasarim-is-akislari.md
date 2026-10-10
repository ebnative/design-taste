# Photoshop ve tasarım becerilerini birlikte kullanma

Bu belge portfolyo üretimi için uygulama rehberidir. Photoshop işlemleri `photoshop-designer` + `computer-use:computer-use` ile yapılır. Tasarım becerileri hedefi belirler; yerel katmanları kontrol eden araç Computer Use'dır. Yalnız görev için gereken SKILL.md dosyalarını yükle.

## Görev yönlendirme

| İstenen iş | Tamamlayıcı beceri | Photoshop'ta uygulama | Çıktı kontrolü |
|---|---|---|---|
| Katmanlı afiş/kapak/kompozisyon | ebru-portfolio-art-direction | Grid, adlandırılmış gruplar, smart object görseller, ayar katmanları | Hiyerarşi, boşluk, marka renkleri |
| Başlık ve gövde metni | ebru-portfolio-typography | Type, Character, Paragraph | Gerçek metin, glifler, taşma ve font |
| Arka plan ayırma/maske | ebru-portfolio-web-assets | Nesne seçimi, Select and Mask, layer mask | Açık/koyu zemin, saç/tüy, şeffaflık |
| Görsel yerleştirme/kolaj | ebru-portfolio-art-direction + web-assets | Place Embedded, Free Transform, clipping mask | Oran, kırpma, çözünürlük |
| PSD mockup | ebru-portfolio-art-direction + web-assets | Edit Contents/Replace Contents, yüzey dönüşümü, ışık katmanları | Logo/metin doğruluğu, perspektif |
| Proje anlatımlı sunum | ebru-portfolio-storytelling | Doğrulanmış metinleri düzenlenebilir katmanlara yerleştir | Brief/rol/sonuç uydurulmamış |
| Portfolyo sayfası görsel taslağı | ebru-portfolio-wireframes + art-direction | Akışa göre bölüm kompozisyonu | PSD taslağı responsive site sayma |
| Gerçek web galeri davranışı | ebru-portfolio-interactions | Önce statik taslak gerekiyorsa Photoshop | Etkileşim uygulaması site kodunda |
| Animasyon/video sunumu | ebru-portfolio-motion | Gerekli poster/tekil kare varlıkları | Statik PSD'yi çalışan animasyon sayma |

## 1. Katmanlı kompozisyon

Talepteki boyut, hedef kitle, metin ve gerçek kaynak eserleri kullan. Kullanıcının seçtiği yön varsa sürdür; yoksa işten çıkarılabilen makul yönü seç ve önemli varsayımı belirt. Örnek grup yapısı: `Arka plan`, `Görseller`, `Metin`, `Efektler`. Grup sayısı zorunlu değildir. Görselleri smart object, metinleri Type, tonları ayar katmanı olarak tut. İlk kompozisyonu tam görünümde, ayrıntıları %100'de incele. Başlık, odak görseli ve ikincil bilgi arasındaki önceliği değerlendir.

## 2. Metin ve tipografi

Metni yetkili kaynaklardan al. Tipografi becerisiyle font/ağırlık, hiyerarşi ve satır uzunluğunu seç; Photoshop'ta Character ve Paragraph alanlarına uygula. Kısa başlığı point type, uzun açıklamayı paragraph type yap. Önce belge rengini ve aktif metin katmanını kontrol et; yazmayı bitirip odak değişmeden araç kısayolu gönderme. `İ ı Ş ş Ğ ğ Ç ç Ö ö Ü ü Ä ä ß` örneğini yalnız gerekiyorsa çalışma kopyasında dene. Metni taşırmak veya aşırı küçültmek yerine kutu/grid düzenini düzelt. Font araştırması gerektiğinde `adobe-fonts` becerisini oku; bağlantıyı doğrula. Fontu indirmiş/etkinleştirmiş sayma.

## 3. Maske ve dekupe

Web-assets becerisiyle kullanım alanı, ölçü ve şeffaflık ihtiyacını belirle. Nesne seçimini başlangıç al; Select and Mask ile uygun görünüm modunda kenarı incele. Çıktıyı düzenlenebilir layer mask olarak oluştur. Saç/tüy, yarı saydam bölge ve ürün iç boşluklarını farklı zeminlerde kontrol et. Gerekirse maske üstünde düşük yoğunluklu fırçayla yerel düzeltme yap. Görüntü katmanına yanlışlıkla boya uygulanırsa son işlemi geri alıp maskeyi yeniden seç. Kesin logo konturunda AI kenar düzeltmesi yerine kaynak şekli/vektör veya hassas seçim değerlendir.

## 4. Görsel yerleşimi

Kaynak dosyayla envanter eşlemesini kur. Taşınabilir çıktı için Place Embedded tercih et; çok belgeye bağlı güncelleme gerçekten gerekiyorsa proje içindeki çalışma kopyasını Place Linked kullan. Oran kilidiyle boyutlandır, seçenek çubuğunda mümkünse sayısal koordinat/ölçü gir, Enter ile onayla. Alan içinde kadraj için clipping mask veya frame kullan. Logo veya kişinin biçimini alanı doldurmak için esnetme. Kullanım ölçüsündeki netliği kontrol et; web formatını daha sonra web-assets ile hazırla.

## 5. Mockup

Önce eldeki PSD şablonunun kullanım lisansını ve yer tutucu katmanını incele. Kaynak şablonun kopyasında çalış. Yer tutucu smart object'i Edit Contents ile aç; gerçek logo/tasarımı yerleştirip içerik belgesini kaydet. Bağlı kaynak E: altındaysa önce bağımsız çalışma kopyası oluştur veya embedded içerik kullan. İçerik değiştirme mevcut dönüşümleri korusa bile oran ve kadraj değişebilir; ana PSD'de kontrol et. Yüzey geometrisi için Distort/Perspective/Warp; doğal birleşme için şablonun gölge, ışık, doku ve maskelerini koru. Bağımsız varyantta aynı smart object'in diğer örneklerinin güncellenmesini ayrıca kontrol et.

Şablon yoksa mevcut lisanslı yüzey fotoğrafına gerçek tasarımı ayrı smart object olarak yerleştir. Silindir/kumaş gibi karmaşık yüzeylerde düz perspektifin yetmediğini görsel kontrolde değerlendir; gerekli warp ve maske düzeltmesini yap. Logo ve okunacak yazıları üretken AI ile yeniden çizme. Teslim: katmanlı PSD + sunum PNG/JPEG; mockup olduğunu belirt.

`adobe-create-mockups` farklı bir Firefly bulut üretim akışıdır. Kullanıcı bu akışı veya AI sahnesini istediğinde ilgili beceriyi oku ve bağlantısını doğrula; mevcut masaüstü talebini kendiliğinden bulut üretimine dönüştürme. Yerel Photoshop işlerinde o becerinin Firefly Board oluşturma adımları uygulanmaz. Figma/Canva/Express becerilerini yalnız bu uygulamalarda çıktı istendiğinde veya somut bir bağımlılık olduğunda kullan.

## 6. Çıkış ve doğrulama

İstenen işi uygun komutlarla uygula, büyük değişiklikten sonra görünümü incele, yerel çalışma PSD'sini kaydet. Görsel yayın türevini ayrı üret. Aktif belge, çıktı adı, boyut, renk profili, şeffaflık ve okunabilirlik kontrolü yap. Sonuçta yalnız yapılan işlem ve gerçek teslim yollarını bildir. Kaydedilen dosyayı açıp katman/metin yapısını incelemek, yalnız dosya varlığına göre başarı bildirmekten daha güçlü kanıttır.

## Davranış denemeleri için plan

Sonraki gerçek görevlerde veya kullanıcı istediğinde `work/` altında özgün test belgesiyle sırasıyla: metin+şekil katmanlı afiş, açık/koyu zeminde maske, iki görselle smart object yerleşimi, bir mockup ve PSD+PNG tekrar açma denemeleri yap. Her denemeyi `başarılı`, `kısmi` veya `engellendi` olarak gözleme dayalı kaydet. Bu belge bu denemelerin yapılmış olduğu anlamına gelmez.

