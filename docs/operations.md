# Çalıştırma, yayın ve geri dönüş

## Yerel kullanım

Python 3.10+ ve Git. Ek Python bağımlılığı yok; pip kurulumu gerekmez.
`python search/query.py 'fotomontaj' --type technique` arama çalıştırır.
`python scripts/check.py` syntax, kayıt/link ve davranış testlerini çalıştırır.

## Yapılandırma

`DESIGN_TASTE_PRIVATE_ROOT`: kullanıcı tercihleri için isteğe bağlı repo dışı özel konum.
`.env.example` yalnız örnektir ve otomatik yüklenmez. Anahtar/token gerekmeyen yerel arama.
GitHub kimlik bilgileri Git Credential Manager'da tutulur; repo ve commit'e yazılmaz.

## Paketleme

`python scripts/install.py --dest '<new-package-directory>'` sekiz taşınabilir paket üretir.
Mevcut bir beceriyi güncellemek için hedef/skill belirtilerek `--update` kullanılır;
hash doğrulamalı yedek oluşturulur ve style/memory korunur.
Paketleme testleri yalnız dosya/arama davranışını doğrular; Adobe canlı test değildir.

## GitHub

`main` varsayılan dal. Push ve pull request'lerde CI çalışır.
Normal değişiklik: kontrol → commit → push. Hassas/özel içerik commit'e alınmaz.
GitHub yayını native Adobe bağlantısı kurulmuş olduğu anlamına gelmez.

## Geri dönüş

Hatalı kod değişikliğini yeni bir `git revert <commit>` ile geri al; paylaşılmış geçmişi force push ile silme.
Beceri güncellemesinde yedek dosya hashlerini kontrol ederek ilgili paketi geri yükle.
Kullanıcı tercihlerini ve mevcut uygulama dosyalarını koru.
