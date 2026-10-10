# Photoshop komut rehberi — Windows

Araştırma: 10 Ekim 2026. Bu seçki portfolyo ve grafik tasarım görevlerinde sık gereken komutları kapsar; Adobe tarafından yayımlanmış bir kullanım sıklığı sıralaması değildir. Menü adları İngilizce arayüze göredir. Kaynak bağlantıları [Adobe kaynak kaydında](adobe-kaynaklari.md) bulunur.

## Kısayollar

Adobe'nin [kısayol PDF'sinden](https://helpx.adobe.com/content/dam/help/en/photoshop/using/default-keyboard-shortcuts/photoshop-keyboard-shortcuts.pdf) seçki. Tuval odağı ve aktif araç önemlidir; metin yazarken harf kısayollarını gönderme. Araç grupları için Shift+harf davranışı tercihlere bağlıdır. Atamaları Edit > Keyboard Shortcuts üzerinden incele; kullanıcının atamalarını kendiliğinden değiştirme.

| İşlem | Windows varsayılanı |
|---|---|
| Taşı | V |
| Dikdörtgen/elips seçim | M |
| Kement | L |
| Nesne/hızlı seçim grubu | W |
| Kırp | C |
| Çerçeve | K |
| Damlalık | I |
| Rötuş grubu | J |
| Fırça | B |
| Klon damga | S |
| Degrade/dolgu | G |
| Kalem | P |
| Metin | T |
| Yol seçimi | A |
| Şekil grubu | U |
| El | H |
| Yakınlaştır | Z |
| Dönüştür | Ctrl+T |
| Yeni katman | Ctrl+Shift+N |
| Kopyayla katman | Ctrl+J |
| Grup | Ctrl+G |
| Grubu çöz | Ctrl+Shift+G |
| Kırpma maskesi | Ctrl+Alt+G |
| Varsayılan renkler | D |
| Renkleri değiştir | X |
| Fırça küçült/büyüt | [ / ] |
| Ekrana sığdır | Ctrl+0 |
| %100 görünüm | Ctrl+1 |
| Panel görünürlüğü | Tab |
| Diyaloğu iptal et | Escape |

Ctrl+J, aktif seçim varsa yalnız seçili pikselleri kopyalayabilir. W veya J bir grubu temsil eder; istenen aracı araç çubuğundaki etiketten doğrula. Türkçe klavye düzeninde köşeli parantez çalışmazsa fırça boyutunu seçenek çubuğundan ayarla. Otomasyonda örneğin Ctrl+T, `sky.press_key` için `Control_L+t` olarak gönderilir; güncel Computer Use API'si esastır.

## Dosya ve çalışma güvenliği

[Kaydetme yardımı](https://helpx.adobe.com/photoshop/desktop/save-and-export/save-files/save-your-work.html).

| Komut | Kullanım / kontrol |
|---|---|
| File > Open | Hedef dosyayı aç; doğru belge sekmesini doğrula. |
| File > New | Amaçla uyumlu ölçü, renk modu ve profil belirle. |
| File > Save | Yalnız çalışma kopyasını mevcut konumuna kaydet. |
| File > Save As | Yeni isim/konum ve katmanlı PSD çalışma sürümü. |
| File > Save a Copy | Ana belgeyi koruyarak ayrı teslim kopyası. |
| Image > Duplicate | Bellekte alternatif belge; sonra ayrıca diske kaydet. |
| Window > History | Düzenleme geçmişini incele. |
| History > Snapshot | Geçici karşılaştırma noktası; kalıcı yedek değildir. |

Yeni belge ayarları tasarım kararlarıdır: webde piksel ölçüsünü, baskıda fiziksel ölçü ve gerekli çözünürlüğü belirle. Kaydetmenin yerel mi bulut mu olduğunu ekranda kontrol et.

## Katman ve ton

[Katman oluşturma](https://helpx.adobe.com/photoshop/desktop/create-manage-layers/create-layer-compositions/create-layers-and-layer-groups.html), [ayar katmanları](https://helpx.adobe.com/photoshop/desktop/create-manage-layers/color-adjustment-fill-layers/work-with-adjustment-and-fill-layers.html).

| Komut / panel | Karar |
|---|---|
| Window > Layers | Aktif katman, sıra, kilit, göz simgesi ve maskeyi incele. |
| Layer > New > Layer | Rötuşu veya yeni grafiği ayrı tut. |
| Layer > New > Group | Birlikte yönetilecek tasarım parçalarını adlandır. |
| Layers: Opacity / blend mode | Saydamlık veya yüzeyle birleşme; sonucu görerek ayarla. |
| Create/Release Clipping Mask | Üstteki içeriği alttaki şeklin opak alanıyla sınırla. |
| Create new fill or adjustment layer | Pikselleri değiştirmeden ton/renk düzenle. |
| Levels / Curves | Ton aralığı ve kontrast. |
| Hue/Saturation / Color Balance | Seçili bölgenin renk uyumu. |
| Brightness/Contrast / Exposure | Işık düzeni. |
| Solid Color / Gradient / Pattern | Düzenlenebilir arka plan veya dolgu. |
| Black & White / Gradient Map | İstenen görsel yön için ton eşlemesi. |

Ayarın hedefini maske veya clipping mask ile sınırla. Marka rengi üzerinde genel ton düzeltmesinin etkisini ayrıca kontrol et. Flatten veya Rasterize komutunu sırf sonraki adım kolaylaşsın diye kullanma.

## Seçim ve maskeler

[Maske ekleme](https://helpx.adobe.com/photoshop/desktop/create-masks/layer-masks/add-layer-masks.html), [maske düzenleme](https://helpx.adobe.com/photoshop/desktop/create-masks/layer-masks/edit-and-refine-layer-masks.html), [kenar inceltme](https://helpx.adobe.com/photoshop/desktop/make-selections/refine-modify-selections/refine-your-selection-and-mask.html).

| Komut / araç | Kullanım |
|---|---|
| Marquee / Lasso / Object Selection | Geometrik, serbest veya nesne temelli ilk seçim. |
| Select > Subject | Otomatik başlangıç; final maske sayma. |
| Select > Select and Mask | Kenarı ve görünüm modunu incele. |
| Layer > Layer Mask > Reveal Selection | Seçili alanı görünür tut. |
| Layer > Layer Mask > Hide Selection | Seçili alanı gizle. |
| Add Layer Mask | Seçim yokken tümünü gösteren maske. |
| Alt+Add Layer Mask | Seçime bağlı olarak gizleyen maske. |
| Mask thumbnail + Brush | Siyah gizler, beyaz gösterir, gri kısmen geçirir. |
| Properties: Density / Feather | Maskenin şiddeti ve kenar yumuşaklığı. |
| Alt+mask thumbnail | Maskeyi tek başına incele. |
| Shift+mask thumbnail | Maskeyi geçici devre dışı bırakıp karşılaştır. |

Tuval yerine maskenin küçük resminin aktif olduğunu doğrula. Saç/tüyü hem açık hem koyu zeminde kontrol et; aşırı feather konturu bulanıklaştırır. Clipping mask ile layer mask aynı işlev değildir.

## Metin

[Metin katmanları](https://helpx.adobe.com/photoshop/desktop/text-typography/type-layers-creation/type-layers-in-photoshop.html).

| Araç / panel | Kullanım |
|---|---|
| Horizontal Type | Kısa başlık için tıklayarak point type. |
| Type ile kutu çizme | Uzun metin için paragraph type. |
| Window > Character | Font, ağırlık, boyut, leading, tracking ve kerning. |
| Window > Paragraph | Hizalama ve paragraf düzeni. |
| Type on a path | Gerektiğinde eğri/yol üstünde düzenlenebilir metin. |
| Type layer / Layer Styles | Metni pikselleştirmeden efekt. |

Yazı katmanındaki T simgesini koru. Türkçe/Almanca karakterleri ve gerçek başlığı kontrol et; kutuya sığmayan metni saklama. Font bulunmuyorsa alternatif seçimini mevcut marka ve lisans üzerinden çöz.

## Görsel yerleşimi, boyut ve smart object

[Yerleştirme](https://helpx.adobe.com/photoshop/desktop/create-open-import-images/import-files/place-a-file-in-photoshop.html), [dönüşüm](https://helpx.adobe.com/photoshop/desktop/crop-resize-transform/resize-adjust-resolution/transform-images-shapes-and-paths.html), [içerik değiştirme](https://helpx.adobe.com/photoshop/desktop/create-manage-layers/smart-objects/replace-the-contents-of-a-smart-object.html).

| Komut | Kullanım |
|---|---|
| File > Place Embedded | İçerik PSD içinde; taşınabilir teslim. |
| File > Place Linked | Dış dosyaya bağlı içerik; kaynak çalışma kopyası olmalı. |
| Layer > Smart Objects > Convert to Smart Object | Düzenlenebilir dönüşüm ve filtre yapısı. |
| Edit > Free Transform | Ölçek, konum, dönüş; sayısal alanlarla hassas yerleşim. |
| Transform: Distort / Perspective / Warp | Gerçek yüzey geometrisine göre mockup. |
| Layer > Smart Objects > Edit Contents | Kaynak içeriği düzenleyip kaydederek ana belgeyi güncelle. |
| Smart Object: Replace Contents | Yeni tasarımı mevcut dönüşümlere yerleştir. |
| Embed Linked / Embed All Linked | Teslimi dış dosyalardan bağımsızlaştır. |
| Image > Image Size | Piksel/çözünürlük; resampling kararını kontrol et. |
| Image > Canvas Size | Kompozisyon alanını genişlet/daralt; görseli ölçeklemek değildir. |
| Crop Tool | Kadraj; kaynak piksellerini korumak için Delete Cropped Pixels ayarını kontrol et. |

Free Transform oran kilidi son kullanılan ayara bağlı olabilir; Shift davranışını varsayma. Smart object tekrar dönüştürmede kaynak verisini korur; yetersiz kaynak çözünürlüğünden yeni ayrıntı üretmez. Edit Contents, AI/PDF içeriğinde Illustrator açabilir: uygulama ve kaynak yolunu yeniden doğrula. Replace Contents sonrası en/boy, kırpma ve tüm bağlı örnekleri kontrol et.

## Rötuş ve teslim

[Remove tool](https://helpx.adobe.com/ca/photoshop/using/tool-techniques/remove-tool.html), [çok katmanlı örnekleme](https://helpx.adobe.com/photoshop/desktop/create-manage-layers/get-started-layers/sample-from-all-visible-layers.html), [Export As](https://helpx.adobe.com/photoshop/desktop/save-and-export/export-files-to-different-formats/fine-tune-your-export-settings-using-the-export-as-option.html).

| Komut / araç | Kullanım / kontrol |
|---|---|
| Spot Healing / Healing Brush | Küçük kusur; ayrı rötuş katmanı ve uygun sampling. |
| Clone Stamp | Kontrollü doku kopyalama; tekrar deseni ve kaynak noktasını kontrol et. |
| Remove Tool | İstenmeyen bölge; AI on/off/auto modunu gözle. |
| Sample All Layers | Görünür katmanlardan örnekle, sonucu aktif rötuş katmanına uygula. |
| File > Export > Export As | Ölçü, format, kalite, şeffaflık ve görünen renk seçenekleri. |
| File > Export > Quick Export as… | Önceden ayarlanmış formatla çıktı; mevcut ayarları doğrula. |

PNG şeffaf grafikler, JPEG fotoğraf ağırlıklı sunumlar için değerlendir. Photoshop'un görünen format listesinde WebP/AVIF/SVG bulunacağını varsayma; gerekirse ayrı format hazırlığını web-assets iş akışına aktar. PSD ile yayın görselini ayrı teslim et; çıktıyı yeniden açarak ölçü, görünüm ve metinleri kontrol et.
