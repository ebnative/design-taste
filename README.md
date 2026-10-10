# Design Taste
Sanat/tasarım bilgisini öğrenmeye, gerekçeli görsel yönlere ve düzenlenebilir Adobe üretimine bağlayan yerel repo.

## Proje kimliği
Project ID: `design-taste` · Sürüm: `0.1.0` · Sorumlu hesap: `ebnative`  
Profil: Python + beceri paketleri + bilgi tabanı · Proje standardı: `1.0.0`  
[Kapsam ve kabul ölçütleri](docs/project.md) · [Mimari](docs/architecture.md) · [İşletim](docs/operations.md)

## Gereksinimler ve kurulum
Python 3.10+ ve Git. Ek Python bağımlılığı yok; pip kurulumu gerekmez.
Betikler doğrudan Python ile çalıştırılır. Repo pip paketi değildir.

## İlk sürüm
27 başlangıç atlas kaydı, 60 kaynak künyesi, 12 öğrenme modülü ve TR/EN arama.
Kaynaklar sağlanan araştırma raporundan aktarılmıştır; yeniden inceleme ve kapsam genişletme devam eder.
Bu sürüm tüm sanat akımlarını kapsamaz. Görsel, font ve kitap dosyası dağıtmaz.

## Beceriler
- Design Taste: kişisel anlatım ve görsel yön.
- Art & Design Atlas: öğrenme ve kaynaklı araştırma.
- Design Critic: brief ve gerçek görsele dayalı eleştiri.
- Photoshop Designer: mevcut masaüstü yöntemini koruyan katmanlı üretim.
- Illustrator Designer: mevcut COM/ExtendScript runner'ını koruyan vektör üretim.
- After Effects Designer, InDesign Designer, Premiere Pro Designer: üretim rehberleri; bağlantıları canlı doğrulanmadı.

## Kullanım
Python 3, yalnız standart kütüphane:
```powershell
python search/query.py 'sürrealizm' --type movement --asset cover --json
python search/query.py 'fotomontaj' --type technique
python scripts/check.py
python scripts/install.py --dest '<skill-directory>' --skill design-taste --skill art-design-atlas --skill design-critic
```
Kurulum ortak veriyi her seçilen skill'in bundle/ klasörüne türetir. Repo tek kaynak otoritesidir.
Mevcut hedefte durur; --update ile doğrulanmış yedek ve özel hafızayı koruyan güncelleme yapılır.
Photoshop'un eski makine adını otomatik emekliye ayırmaz; mevcut iki Adobe becerisi ayrıca korundu.

## İlk pilot
“Beni anlatan bir portfolyo kapağı için görsel yön geliştir.”
Anlatılacak anlam → metafor → kompozisyon/renk/tipografi → kullanıcı seçimi → gerçek üretim.
Özel kullanıcı ve müşteri verileri repo dışında tutulur. Onay yalnız açık geri bildirimle kaydedilir.

## Yapılandırma ve doğrulama
İsteğe bağlı `DESIGN_TASTE_PRIVATE_ROOT`, repo dışındaki özel kullanıcı hafızasını belirtir.
[.env.example](.env.example) otomatik yüklenmez. Arama için API anahtarı gerekmez.
`python scripts/check.py`: syntax, içerik/bağlantı ve 9 işlev testi.
[GitHub Actions](.github/workflows/ci.yml) Windows/Linux ve Python 3.10/3.12 için kontrolleri tanımlar.
Canlı Adobe üretim testleri ayrı yapılır.

## Proje bağlantıları
[GitHub](https://github.com/ebnative/design-taste) · [Görevler](https://github.com/ebnative/design-taste/issues)
[Proje standardı](docs/project-standard.json) · [Mimari kararı](docs/decisions/0001-project-standard.md)

## Durum
Çalışan başlangıç sürümü. GitHub'da özel repo olarak saklanır. Canlı Adobe üretim testleri tamamlanmadı.
Kod ve içerik için açık kaynak lisansı henüz seçilmemiştir. [Haklar](docs/sources-and-rights.md).
