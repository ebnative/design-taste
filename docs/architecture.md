# Mimari

`atlas/`: okunabilir konu kayıtları ve araştırma kuyruğu.  
`knowledge/`: kaynak künyeleri, aliases, ilişkiler ve arama indeksi.  
`curriculum/`: öğrenme yolu, alıştırmalar ve eleştiri ölçütleri.  
`skills/`: üç bilgi becerisi ve beş uygulama üretim becerisi.  
`adapters/`: gerçek uygulama erişiminin test durumu ve yöntem sınırları.  
`search/query.py`: standard-library lexical/BM25 araması.  
`scripts/`: doğrulama ve taşınabilir beceri kurulum/paketleme.  
`tests/`: retrieval ve kurulum davranışı.  
`workflows/`: çıktı türüne göre üretim rehberleri.  
`.github/workflows/ci.yml`: Linux/Windows üzerinde Python kontrolleri.

Brief → ilgili kayıt → çağdaş tasarım kararı → uygun üretim becerisi → native çıktı → gerçek önizleme.
Arama yalnız ilgili veriyi getirir; uygulamayı kontrol etmez.
Repo kaynak otoritesidir. Her kurulum ortak dosyaları bir skill'in `bundle/` alanına türetir;
bağımsız paket repo dışında taşındığında aynı bilgiye erişir.
Kişisel tercihler, müşteriler ve kaynak Adobe dosyaları repo dışında kalır.

Bu proje dağıtılabilir bir Python kütüphanesi veya web uygulaması değildir. Mevcut betikleri
`src/` altına taşımak çalıştırma/kurulum yollarını bozacağı için amaç odaklı dizinleri korur.
Bu istisna ortak standarttaki teknolojiye uygun düzen ilkesiyle uyumludur.
