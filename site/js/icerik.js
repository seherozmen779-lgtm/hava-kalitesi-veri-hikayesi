const ICERIK = {
  baslik: "Türkiye'de hava çoğu yerleşimde biraz temizlendi, ama neredeyse hiçbiri WHO sınırına inemedi",
  altbaslik: "2019–2024 arasında PM2.5 ölçülen 65 yerleşimde kim düştü, kim yükseldi, kim yerinde saydı?",
  yazar: "Seher Özmen",
  tarih: "14 Ekim 2026",

  baglam: [
    "PM2.5, çapı 2,5 mikrondan küçük havadaki partiküllere verilen ad. Bu parçacıklar o kadar ufaktır ki akciğerlerin derinlerine kadar inebilir. Dünya Sağlık Örgütü (WHO) bu yüzden yıllık ortalama için bir rehber değer belirliyor: 5 µg/m³.",
    "Bu çalışma, WHO'nun Haziran 2026 sürümlü hava kalitesi veri tabanındaki Türkiye kayıtlarına dayanıyor. Veri, ülkelerin bildirdiği yerleşim bazlı yıllık ortalamalardan oluşuyor. Aşağıda, 2019–2024 arasında en az beş yıl ölçüm yapılan 65 yerleşimin hikâyesini izleyeceksiniz: hangilerinde PM2.5 düştü, hangilerinde yükseldi, hangileri yerinde saydı."
  ],

  adimlar: [
    "Her çizgi bir yerleşimi gösteriyor. Ortadaki yerleşimin, yani medyanın, PM2.5 düzeyi 2019'da 20,8 µg/m³ iken 2024'te 17,3'e indi. Çizgilerin çoğu aşağı yönlü.",
    "WHO'ya göre yıllık ortalama en fazla 5 µg/m³ olmalı. Ölçümü güvenilir 88 yerleşimin 87'si 2024'te bu sınırın üzerindeydi. Ortadaki değer, sınırın yaklaşık 3,3 katı.",
    "65 yerleşimin 39'unda PM2.5 yılda en az 0,5 µg/m³ azaldı, yani her beş yerleşimden yaklaşık üçünde.",
    "Sekiz yerleşimde ise PM2.5 yükseldi. Yalova, Arnavutköy ve Bilecik bunların arasında. Veri artışın nedenini söylemiyor, yalnızca ölçülen değerin yükseldiğini gösteriyor.",
    "En büyük düşüş Erzurum'da: 2019'da 53,8 olan değer 2024'te 18,9 µg/m³'e indi. Yine de bu, WHO sınırının hâlâ yaklaşık 3,8 katı.",
    "18 yerleşimde değişim yılda 0,5 µg/m³'ün içinde kaldı, yani bu yerleşimler pratikte yerinde sayıyor. Düşüşün her yerde aynı olmaması da bir bulgu.",
    "Çizgileri sadeleştirelim: her yerleşimin ilk ve son ölçümünü birleştirdik. 65 yerleşimin 54'ünde son değer ilkinin altında kaldı.",
    "Veri her yıl eşit sağlam değil. 2018'de ölçümlerin yaklaşık yarısı, yeterli ölçüm kapsamı olmadığı için analizden çıkarıldı. Bu yüzden eğilimleri 2019 sonrasına dayandırdık.",
    "Eğim analizine giremeyenler tek hikâye anlatmıyor. Keşan'da PM2.5 sert düştü, Iğdır'da yüksekte kaldı. İkisinin de 2019–2024'te beş yıldan az ölçümü var."
  ],

  kesif: "Merak ettiğiniz yerleşimleri seçin, yıl aralığını daraltın ve kendi eğilimlerini WHO sınırıyla karşılaştırın.",

  sonuc: [
    "Özetle, ölçüm yapılan yerleşimlerin çoğunda PM2.5 düşüyor: 65 yerleşimin 39'unda belirgin düşüş var, 8'inde artış, 18'inde değişim yok. Ama düşüş bile sorunu çözmüyor, çünkü 2024'te ölçümü güvenilir 88 yerleşimin yalnızca biri (Kuyulusebil) WHO sınırının altında kaldı.",
    "Bu bulguların sınırları var. Her yıl aynı yerleşimler ölçülmüyor ve eğilimler 5–6 yıllık veriye dayanıyor. İstasyon türleri karışık (kentsel, trafik, sanayi, kırsal), bir yerleşimdeki değişim istasyonun değişmesinden de kaynaklanabilir. Eğim analizine girmeyen Iğdır gibi yerleşimler (2024'te 50,3 µg/m³) ayrı bir hikâye anlatıyor. Düşüşün nedenini ise bu veriyle söyleyemeyiz."
  ],

  yontem: [
    ["Veri", "WHO Ambient Air Quality Database, V8.0 (Haziran 2026). Erişim tarihi: 12 Ekim 2026. Bağlantı: https://www.who.int/publications/m/item/who-ambient-air-quality-database-(update-jun-2026)"],
    ["Lisans", "WHO, yayınlarını CC BY-NC-SA 3.0 IGO lisansıyla sunuyor (who.int/copyright). Veri sayfasında ayrıca yalnızca '© World Health Organization 2026' yazıyor. Bu çalışma ticari değildir, WHO logosu kullanılmamıştır. Çalışma WHO tarafından hazırlanmamıştır ve WHO'nun onayını göstermez. Analiz ve grafikler yazara aittir, aynı lisans koşullarıyla paylaşılır."], 
    ["Seçim", "Türkiye kayıtları alındı. PM2.5 verisi 2015'ten itibaren mevcut. 2025 kayıtlarında ölçüm kapsaması bilgisi bulunmadığı için analiz 2015–2024 ile sınırlı tutuldu. Zaman kapsaması %75'in altında olan 142 satır çıkarıldı."],
    ["Kümeler ve eşik", "Eğilim analizi için 2019–2024 arasında en az 5 yıllık ölçümü olan 65 yerleşim kullanıldı. Her yerleşimin eğimi, yıl ile PM2.5 arasındaki doğrusal eğilim çizgisinin eğimi olarak hesaplandı. Yılda ±0,5 µg/m³ içinde kalan değişim 'belirgin değişim yok' sayıldı. Eşik 0,3 olsaydı gruplar 44/11/10, 1,0 olsaydı 23/40/2 olurdu."],
    ["Veri sorunları", "Dosyadaki satırlar bozuk biçimde kaydedilmişti. Biçim bozukluğu nedeniyle yalnızca Kamboçya'ya ait 3 kayıt okunamadı. Türkiye kayıtları etkilenmedi."],
    ["Araçlar", "Analiz: Python (pandas) ve Jupyter. Site: D3.js ve Scrollama.js. Scrollama'nın açık kaynak örnek kodları referans alındı."],
    ["Yapay zekâ beyanı", "Kod yazımı, hata ayıklama ve metin taslakları için Claude (Anthropic) kullanıldı. Analiz kararlarını ve nihai metinleri ben gözden geçirip onayladım."]
  ],

  yazarMetin: "Veriyi anlama, anlamlandırma yolculuğundayım. Manisa Celal Bayar Üniversitesi Büyük Veri Analistliği öğrencisiyim. Python, SQL ve veri görselleştirme alanlarında projeler geliştirerek analitik becerilerimi ilerletiyorum",
  baglantilar: [
    ["Portfolyo", "https://PORTFOLYO-ADRESINIZ"],
    ["LinkedIn", "https://www.linkedin.com/in/KULLANICI"],
    ["GitHub", "https://github.com/KULLANICI"],
    ["E-posta", "mailto:ADRES@ORNEK.COM"]
  ]
};