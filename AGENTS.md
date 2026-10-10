# Design Taste çalışma sözleşmesi
Önce brief ve mevcut proje kararlarını oku. Yalnız gerekli atlas kayıtlarını ve workflow'u yükle.
Kaynaklı tarih, tasarım uyarlaması, kişisel tercih ve canlı üretim kanıtını ayrı tut.
BRAND.md, DESIGN.md, MOTION.md, EXPORTS.md ve PROCESS.md varsa ilgili olanları oku.
Kullanıcı/müşteri verisi, özel hafıza, kişisel mutlak yollar, token, font ve lisansı belirsiz görsel repoya girmez.
knowledge/records.json arama indeksidir; atlas markdown kayıtlarını güncellerken onu da güncelle.
Üretim erişimini gerçek oturumdan doğrula. Bir skill veya dosya varlığı uygulama bağlantısı kanıtı değildir.
Tüm sanatı kapsadığını iddia etme; atlas/coverage.json ve araştırma kuyruğunu koru.
Yeni kayıt ve arama değişikliklerinde scripts/validate.py ile tests testlerini çalıştır.

## Proje standardı 1.0.0
Bu repo kullanıcı tarafından onaylanan standart proje sözleşmesini uygular; docs/project-standard.json kaynak kaydıdır.
Proje kimliği/kapsam: docs/project.md. Dizinin sorumlulukları: docs/architecture.md. Yayın/geri dönüş: docs/operations.md.
Python 3.10+; ek bağımlılık yok. Arama: `python search/query.py 'fotomontaj' --type technique`.
Doğrulama: `python scripts/check.py`. Paketleme: `python scripts/install.py --dest '<new-package-directory>'`.
Geçici dosyalar .work/ veya repo dışında; kişisel hafıza repo dışında. .env.example güvenli örnektir.
Tek görev kaynağı GitHub Issues; ayrı TODO/ROADMAP listeleri çoğaltma.
Domain dizinlerini koru; yolları değiştiren bir refactor'da arama ve paket taşıma testlerini çalıştır.
Üçüncü taraf uygulama, yayın ve kullanıcı verileri için mevcut kullanıcı yetkisini ve araç sınırlarını koru.
Tamamlanma raporunda yapılan işi, gerçekten çalıştırılan kontrolleri ve kalan sınırları belirt.
