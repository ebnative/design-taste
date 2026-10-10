---
name: photoshop-designer
description: Work in local Windows Photoshop on PSD layers, masks, text, mockups and portfolio exports using the available Computer Use plugin. Use for desktop Photoshop requests rather than Adobe cloud workflows.
---

# Photoshop Designer

Kullanıcının bilgisayarındaki Photoshop ile çalış. Bu beceri özgün proje talimatıdır; bir Photoshop MCP sunucusu kurmaz. İşe uygun olduğunda otomatik seçilir.

## Göreve göre rehber seçimi

- Yeni görsel yön, stil, renk veya tipografi seçimi için [ortak tasarım rehberini](references/pro-max-design.md) oku. Design Taste atlasından ilgili kayıtları getir; tarihsel kaynakla çağdaş uyarlamayı ayır. Tasarım kararlarını mevcut masaüstü çalışma yöntemiyle uygula.
- Başlangıçta [tarz profilini](../../workflows/private-memory.md) oku. Kullanıcının geri bildirimi veya onayı sonrası [öğrenme kurallarına](references/style-learning.md) göre dar kapsamlı profil güncellemesi yap. Açık proje talimatı genel tarzdan, kullanıcının doğrulanmış tarzı veritabanı önerisinden önce gelir.

- Komut, kısayol, katman, seçim, metin veya dışa aktarma işi için [komut rehberinin](references/komut-rehberi.md) ilgili bölümünü oku. Windows varsayılanları kullanıcı tarafından değiştirilebilir; yanlış kısayolu tekrarlamak yerine menüden doğrula.
- Katmanlı kompozisyon, tipografi, dekupe, görsel yerleşimi veya mockup için [tasarım iş akışlarını](references/tasarim-is-akislari.md) oku; oradaki göreve uygun tasarım becerilerini birlikte seç.
- Yeni veya AI özelliği gerekiyorsa [sürüm ve yenilik rehberini](references/surum-ve-yenilikler.md) oku; kurulu build'i Help > About Photoshop üzerinden ve gereken komutu uygulamada doğrula. [Kaynak kayıtları](references/adobe-kaynaklari.md) resmî yardım bağlantılarını içerir.
- Belgeler 10 Ekim 2026 tarihinde araştırıldı. Rehber, uygulama testinin yerine geçmez; yeni bir özellik gerektiğinde ilgili resmî sayfayı yeniden kontrol et. Talep tüm kılavuzu yüklemeyi gerektirmiyorsa yalnız ilgili bölümü kullan.

## Erişim ve hedef

- Windows kontrolünden önce mevcut `computer-use:computer-use` becerisini ve onun gerekli guidance, API ve confirmations belgelerini oku. Yerel uygulama işlemlerini bu becerinin `node_repl` ve `@oai/sky` API'siyle yap. Bu oturumda yerel kontrol mevcut değilse erişimi çalışıyor sayma; erişim sınırını belirt ve uygulanabilir üretim planını hazırla.
- Photoshop'u dönen uygulama/pencere listesinden seç; sürüm, pencere kimliği ve koordinatları önceki oturumdan sabitleme. Hedef pencereyi öne getir ve gerçek Photoshop ekranını doğrula.
- Her gözlemden sonra tek girdi işlemi yapıp durumu yenile. Photoshop menülerinin erişilebilirlik etiketleri yanlış konuma işaret edebilir; görünen menü başlığını kontrol et, uyuşmazlık varsa yeni ekran görüntüsündeki koordinatları kullan. Ekran dışındaki pencere için önce görünür konumu düzelt.
- Dosya açma/kaydetme diyaloğunda alanın odağını doğrulamadan yol yazma. Terminal, COM, özel yardımcı program veya ExtendScript enjeksiyonuyla bu kontrol yolunu değiştirme.

## Dosyalar ve düzenleme

- `<user-source-assets>` kaynaklarını değiştirme. Düzenleme için çalışma alanında kopya oluştur; denemeleri `work/`, teslimleri `outputs/` altında tut.
- Kullanıcı açık belgeden söz ediyorsa önce belge adını ve mevcut kaydedilmemiş değişiklikleri incele. Kullanıcının işini kapatma veya üzerine kaydetme. Hedef belirsizse ilgili dosyayı belirlemeden düzenleme yapma.
- Başlamadan hedef belge, aktif katman, seçim, boyut ve görünür kompozisyonu incele. Yalnız gözlenen bilgileri raporla; katman içeriğini dosya adından çıkarma.
- Metin düzeltmesini metin katmanında yap; logo ve yazıları yeniden boyayarak taklit etme. Düzenlenebilir yapıyı korumak için uygun olduğunda ayar katmanı, maske ve smart object kullan. Kaynak font eksikse sessizce font değiştirme.
- Mockup yerleşiminde gerçek tasarımı kullan; perspektif, oran ve kırpmayı kontrol et. AI ile tasarımın kendisini değiştirmeyi kullanıcı talebinden çıkarma.
- Katmanlı çalışma kopyasını PSD olarak, istenen yayın türevini ayrı dosya olarak kaydet. Web çıktısında uygun boyut, sRGB, şeffaflık ve formatı seç; baskı profilini kaynakta koru. Toplu portfolyo varlığı hazırlığında `ebru-portfolio-web-assets` becerisini birlikte kullan.

## Doğrulama ve sonuç

Önemli değişiklikten sonra görünür tuvali, doğru katmanı ve metinleri kontrol et. Kaydetme sonrası gerçek çıktı dosyasının varlığını ve mümkünse yeniden açılmış görünümünü doğrula. Raporunda yapılan değişikliği, teslim yollarını ve sınanmış erişimin sınırını belirt. Pencere kontrolü başarılı olsa bile tüm Photoshop özelliklerini veya toplu otomasyonu sınanmış sayma. Erişim kaybolursa temel becerinin sınırlı kurtarma akışını uygula; başarı uydurma.

## Çalışmalardan öğrenme

Kullanıcı bu sohbette tasarım becerilerinin açık geri bildirimlerden ve onaylanan çalışmalardan gelişmesini istedi. Bu kapsamda stil belleğini güncelle; kaynak eserleri veya başka becerileri kendiliğinden değiştirme. Yeni bir işlem gerçekten uygulanıp doğrulanmışsa yöntem/sürüm/kanıt/sınırıyla `references/dogrulanmis-tarifler.md` dosyasına kaydet. Henüz denenmemiş öneriyi başarılı yöntem diye kaydetme. Öğrenme etkin çalışma sırasında gerçekleşir, arka planda kendiliğinden işlemez.

## Paket içindeki ortak yollar
Repo sürümünde ../../workflows ve ../../curriculum kullanılır. Kurulumda bu yollar bundle/workflows ve bundle/curriculum olur; [ortak rehber](references/shared-design.md) üzerinden çöz.
