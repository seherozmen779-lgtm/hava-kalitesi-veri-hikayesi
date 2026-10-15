# Türkiye'de PM2.5 değişimi (2019–2024): bir veri hikâyesi

**Canlı site:** https://turkiye-pm25.netlify.app

## Proje özeti

Çalışma sorusu: Türkiye'deki yerleşimlerde PM2.5 seviyeleri 2015–2024 arasında nasıl değişti; hangilerinde düştü, hangilerinde yükseldi?

WHO verisinde Türkiye için PM2.5 ölçümleri 2015'ten itibaren bulunuyor. Eğilim analizi, 2019–2024 arasında en az 5 yıl ölçümü olan 65 yerleşimle yapıldı. Bulgular:

- 65 yerleşimin 39'unda PM2.5 düştü, 18'inde belirgin değişim yok, 8'inde arttı (eşik: yılda ±0,5 µg/m³).
- 2024'te ölçümü güvenilir 88 yerleşimin 87'si WHO'nun yıllık rehber değerinin (5 µg/m³) üzerinde.

Sonuçlar, D3.js ve Scrollama ile hazırlanmış tek sayfalık, kaydırmalı bir web sitesinde anlatılıyor.

## Veri kaynağı ve lisansı

- Veri: WHO Ambient Air Quality Database, V8.0 (Haziran 2026)
- Bağlantı: https://www.who.int/publications/m/item/who-ambient-air-quality-database-(update-jun-2026)
- Erişim tarihi: 12 Ekim 2026
- Lisans: WHO yayınlarını CC BY-NC-SA 3.0 IGO lisansıyla sunar (who.int/copyright). Veri sayfasında ayrıca yalnızca "© World Health Organization 2026" yazar. Bu çalışma ticari değildir, WHO tarafından hazırlanmamıştır ve WHO'nun onayını göstermez.

## Klasör yapısı

```
├── README.md
├── data/
│   ├── raw/          WHO'nun ham Excel dosyası
│   └── processed/    sitede kullanılan özet CSV dosyaları
├── notebooks/
│   └── analiz.ipynb  temizleme, analiz ve dışa aktarım
├── site/
│   ├── index.html
│   ├── css/
│   ├── js/
│   ├── data/         sitenin okuduğu CSV'ler
│   └── img/          paylaşım görseli
└── docs/
    └── storyboard.pdf
```

## Projeyi yerelde çalıştırma

**Analiz**

1. Python 3 kurun, ardından: `pip install pandas numpy openpyxl notebook`
2. `data/raw/` klasöründe WHO'nun Excel dosyasının bulunduğundan emin olun (yoksa yukarıdaki bağlantıdan indirin).
3. `notebooks/analiz.ipynb` dosyasını Jupyter'da açın ve **Kernel → Restart Kernel and Run All Cells** deyin. Özet dosyalar `data/processed/` klasörüne yazılır.

**Site**

1. `site` klasöründe bir terminal açın ve `python -m http.server 8000` yazın.
2. Tarayıcıda http://localhost:8000 adresini açın. (CSV dosyaları okunduğu için `index.html` dosyasına çift tıklayarak açmak yeterli olmaz.)

## Kullanılan kütüphaneler

- Python: pandas, numpy, openpyxl, Jupyter
- JavaScript: D3.js 7.9.0, Scrollama 3.2.0 (CDN üzerinden)

## Kod kaynakları

- Scrollama (https://github.com/russellsamora/scrollama): kaydırma adımlarının yönetimi, açık kaynak kütüphane
- D3.js (https://d3js.org): grafikler
- Sayfa yapısı, grafikler, içerik ve tasarım yazara aittir.

## Yapay zekâ kullanım beyanı

Kod yazımı, hata ayıklama ve metin taslakları için Claude (Anthropic) kullanıldı. Analiz kararlarını ve nihai metinleri yazar gözden geçirip onayladı.

## Sınırlılıklar

Her yıl aynı yerleşimler ölçülmüyor, eğilimler 5–6 yıllık veriye dayanıyor, istasyon türleri karışık ve istasyon değişikliği olabilir. Düşüşün nedeni bu veriyle söylenemez.

## Yazar

Seher Özmen, Manisa Celal Bayar Üniversitesi. Portfolyo: [https://seher-portfolio-v2-fogjweoeu-seher-projects.vercel.app/] · LinkedIn: [https://www.linkedin.com/in/seher-%C3%B6zmen-8b7891401/?isSelfProfile=true] · GitHub: https://github.com/seherozmen779-lgtm
