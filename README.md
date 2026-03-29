# FSMSocial - İzci ve Sosyal Paylaşım Uygulaması
FSMSocial, izci grupları ve kullanıcıların bir araya gelerek etkinlikler düzenleyebileceği, profillerini yönetebileceği ve takım/ekip/devre süreçlerini takip edebileceği tam yığın (full-stack) bir mobil uygulamadır. 
Projenin mimarisi, izcilik teşkilat yapısındaki "Ekipler (Troops)", "Devreler" ve "Liderler" arasındaki ilişkiyi DDD (Domain-Driven Design) mantığına uygun bir şekilde yönetebilmek üzere tasarlanmıştır.
## 🚀 Öne Çıkan Özellikler
- **Kullanıcı & Cihaz Yönetimi**: JWT tabanlı güvenli giriş ve yetkilendirme sistemi.
- **Profil ve Medya Yönetimi**: **Cloudinary** entegrasyonu ile kesintisiz ve güvenli profil/fotoğraf yükleme altyapısı.
- **Etkinlik & Sosyal Paylaşım**: Kullanıcıların etkinlik detaylarını görebilmesi, etkinliklere kayıt olup onay/red durumlarını takip edebilmesi ve durum paylaşımları yapabilmesi.
- **Ekip ve Devre Hiyerarşisi**: Ekip repo servisi ve devre yönetimi standartları ile kullanıcıların takımlar arası ilişkilerinin yönetilmesi.
---
## 🛠️ Kullanılan Teknolojiler
Projemiz, modern web ve mobil standartlarında güncel kütüphanelerle geliştirilmiştir.
### Frontend (Mobil Uygulama - `/social`)
- **React Native & Expo (v54)**: Uygulamanın çapraz platform (iOS & Android) omurgası.
- **Expo Router & React Navigation**: Uygulama içi akıcı yönlendirmeler ve sekmeler (Bottom Tabs) için.
- **Zustand**: Sürdürülebilir ve hafif global state (durum) yönetimi.
- **TypeScript**: Hataları henüz yazım aşamasındayken yakalamak ve tip güvenliği sağlamak için.
- **AsyncStorage**: Cihaz üzerinde token vb. verilerin güvenli ve kalıcı olarak tutulması için.
- **Expo Image & Picker**: Uygulama içi yüksek performanslı görsel optimizasyonu ve resim seçimi.
### Backend (REST API - `/backend`)
- **Node.js & Express.js**: Sunucu tabanlı API arayüzü.
- **MongoDB & Mongoose**: Esnek (NoSQL) veritabanı yapısı ve ORM çözümü.
- **Güvenlik Katmanı**: `helmet`, `express-rate-limit`, `express-mongo-sanitize` ve `xss` kullanılarak uygulamanın temel siber saldırılara (DDoS, XSS, NoSQL Injection) karşı korunması.
- **Kimlik Doğrulama**: `jsonwebtoken` (JWT) ve `bcryptjs` aracılığıyla şifre hashlama ve kullanıcı yetkilendirme.
- **Validasyon**: Gelen HTTP isteklerindeki body/params doğrulamaları için `zod` ve `joi`.
- **Loglama ve Görev Yönetimi**: `winston` ile API isteklerinin hata takip amaçlı kayıt altına alınması, `cron` ile arka plan ve zamanlanmış görev yönetimi.
---
## 🔮 Gelecekte Eklenecek Teknolojiler (Roadmap)
Projenin ölçeği büyüdüğünde ve etkileşim arttığında sisteme entegre edilmesi planlanan hedefler:
- **Socket.io**: Kullanıcılara yeni etkinlik onayları, ekip atamaları veya sistem duyuruları geldiğinde anlık (real-time) bildirimler verebilmek ve eşzamanlı bir haberleşme/mesajlaşma ağı kurmak.
- **Redis (Caching)**: Veritabanı sorgularının yükünü hafifletmek adına çok sık erişilen verilerin (Örn: aktif ekiplerin listesi, genel duyurular) milisaniyelik hızlarda RAM üzerinden sunulmasını sağlamak ve performansı uç noktaya taşımak.
---
## 💻 Kurulum ve Çalıştırma
### 1. Deponun Sisteme Kurulması
Projeyi Github üzerinden klonlayın:
```bash
git clone https://github.com/alperenaykutlu/fsmsocial.git
cd fsmsocial
```
### 2. Backend Geliştirme Ortamı
API sunucusunu başlatmak için ilgili klasöre gidip paketleri indirin:
```bash
cd backend
npm install
```
`backend` dizininde bir `.env` dosyası oluşturarak aşağıdaki ortam parametrelerini projenize göre girin:
```env
PORT=5000
MONGODB_URI=sizin_mongodb_baglanti_dizginiz
JWT_SECRET=gizli_anahtariniz
CLOUDINARY_CLOUD_NAME=cloudinary_adiniz
CLOUDINARY_API_KEY=api_anaharitniz
CLOUDINARY_API_SECRET=gizli_api_anahtariniz
```
Sunucuyu ayağa kaldırın:
```bash
npm run dev
```
### 3. Frontend (Mobil) Geliştirme Ortamı
Yeni bir terminal/CMD penceresinde `social` dizinine ilerleyin:
```bash
cd fsmsocial/social
npm install
```
Expo sunucusunu başlatarak kodu derleyin:
```bash
npx expo start
```
> Terminalde beliren QR kodu Expo Go (iOS/Android) uygulaması ile cihazınızda okutabilir veya `a` / `i` tuşları ile sanal cihaz emülatörü üzerinden projenizi çalıştırabilirsiniz.
