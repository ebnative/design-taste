# Ortak bilgiye erişim
Repo sürümünde bu dosyadan ../../../knowledge/records.json, ../../../search/query.py ve ../../../workflows/ yollarını kullan.
Kurulu pakette skill kökünün bundle/ klasörü aynı ortak veriyi içerir; önce onun varlığını kontrol et.
Python 3 ile: <repo-or-bundle>/search/query.py "sorgu" --type movement --asset cover --json
Tek konulu TR/EN sorgu kullan. Filtreler çağdaş önerilen kullanımları belirtir; tarihsel kapsam değildir.
Sonuçtaki path atlas kaydına gider. Kaynak id'lerini knowledge/sources.json içinde çöz.
Önce brief ve varsa BRAND.md/DESIGN.md; sonra yalnız ilgili kayıt, workflow ve uygulama tarifi.
Arama skoru metinsel ilgililiktir, kalite veya kullanıcı beğenisi değildir.
Sonuç yoksa bir kez terimi daralt/değiştir; yine yoksa bilgi tabanında eşleşme olmadığını söyle.
Tarih, hak ve uygulama desteği gibi eksik alanları uydurma. Özel hafıza repo dışında tutulur.
