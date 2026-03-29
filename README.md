# FSMSocial - İzci ve Sosyal Paylaşım Uygulaması
FSMSocial, izci grupları ve kullanıcıların bir araya gelerek etkinlikler düzenleyebileceği, profillerini yönetebileceği ve takım/ekip/devre süreçlerini takip edebileceği tam yığın (full-stack) bir mobil uygulamadır. 
Özellikle sistemin arkaplan (backend) kurgusu, karmaşık izcilik hiyerarşisini (Ekipler, Devreler, Liderlikler) profesyonelce yönetebilmek adına üst düzey tasarım desenleriyle (Design Patterns) geliştirilmiştir.
---
## 🏗️ Mimari Tasarım (Backend - Katmanlı Mimari)
Backend tarafında temiz kod (Clean Code) ve SOLID prensiplerine sadık kalarak, kodun ileride kolayca genişletilebilir (Scalable) olması adına **Katmanlı Mimari (N-Tier Architecture)** ve **Repository Pattern** kullanılmıştır. 
### Backend Klasör Yapısı (`/backend/src`)
Proje aşağıdaki ayrıştırılmış (decoupled) bileşenlerden oluşmaktadır:
- **`models/`**: MongoDB koleksiyonlarına karşılık gelen Mongoose şemalarının bulunduğu veri modelleme katmanı (Kullanıcı, Ekip, Devre, Post/Etkinlik, Bildirimler).
- **`repository/`**: Sadece veritabanı sorgularının yapıldığı, veriye erişim katmanı (Data Access Layer). Bu sayede iş kuralları veritabanı sorgularından ayrılmıştır.
- **`service/`**: Uygulamanın tüm iş mantığının (Business Logic) yer aldığı katman. (Örn: Bir kullanıcının eklenebileceği ekibin doğrulanması, devre liderliği atamaları vs.)
- **`controller/`**: Sadece Client (Mobil uygulama) tarafına verilecek HTTP yanıtlarının ve status kodlarının yönetildiği, servis katmanıyla haberleşen köprü katmanı.
- **`routes/`**: API endpoint'lerinin (Örn: `/api/ekip`, `/api/devre`) tanımlanıp router'ların yönetildiği yer.
- **`validations/`**: Gelen HTTP isteklerinin (body, params) Zod ve Joi ile doğrulandığı katman (Validation Layer).
- **`middleware/`**: JWT doğrulama (Auth), rate-limit (Hız sınırlandırıcı), xss/mongo-sanitize (Güvenlik) gibi araya giren fonksiyonların tanımlandığı bölüm.
- **`utils/`, `shared/` ve `lib/`**: Loglayıcılar (Winston), enum tanımları ve yardımcı araçların bulunduğu ortak klasörler.
Bu mimari sayesinde proje, "Domain-Driven Design (DDD)" prensiplerine yakın, test edilebilir ve her modülü bağımsız çalışabilir bir yapıya kavuşturulmuştur.
---
## 🚀 Öne Çıkan Özellikler
1. **Gelişmiş Ekip ve Devre Yönetimi**: 
   - İzcilik hiyerarşisindeki "Ekip"ler ve takımların bağlı bulunduğu "Devre"lerin birbiriyle ilişkisel olarak yönetilmesi.
   - İlgili servis ve repository'ler üzerinden lider/üye atama dinamikleri.
2. **Kullanıcı & Cihaz Yönetimi**: 
   - JWT tabanlı güvenli giriş ve yetkilendirme sistemi.
3. **Profil ve Medya (Cloudinary) Yönetimi**: 
   - Sistem yükünü azaltmak ve bağımsız medya sunucusu kullanmak için Cloudinary entegrasyonu.
4. **Etkinlik & Sosyal Paylaşım (Posts)**: 
   - Etkinlik oluşturma (`etkinlikRepository`), durum paylaşma ve bunlara katılma işlemleri.
5. **Bildirim Sistemi (Notifications)**:
   - Sistem içi aktivitelerden anında haberdar olma.
---
## 🛠️ Kullanılan Teknolojiler
### Backend REST API (`/backend`)
- **Çatı**: Node.js & Express.js
- **Veritabanı**: MongoDB & Mongoose
- **Mimari Kalıp**: N-Tier Architecture, Repository/Service Pattern
- **Güvenlik**: `helmet`, `express-rate-limit`, `express-mongo-sanitize`, `xss`
- **Şifreleme ve Auth Katmanı**: JWT (`jsonwebtoken`) ve Parola Kriptolama (`bcryptjs/bcrypt`)
- **Validasyon**: `zod` ve `joi`
- **Loglama ve Task Yönetimi**: `winston` (İstek/Hata logları) ve `cron` (Zamanlanmış görevler)
- **Gerçek Zamanlı İletişim**: `socket.io` (Anlık bildirimler, eşzamanlı sohbet ve etkinlik canlı akışı)
- **Önbellekleme (Caching)**: `redis` (Sık okunan verilerin önbelleklenerek veritabanı performansının artırılması)
### Mobil İlk Yüz (Frontend - `/social`)
- **Çatı**: React Native & Expo (v54)
- **Navigasyon**: Expo Router & React Navigation
- **Durum (State) Yönetimi**: Zustand
- **Veri Tipi Güvenliği**: TypeScript
- **Yerel Depolama**: AsyncStorage 
---
## 💻 Kurulum ve Geliştirme Ortamı
**Adım 1: Projenin Klonlanması**
```bash
git clone https://github.com/alperenaykutlu/fsmsocial.git
cd fsmsocial
```
**Adım 2: Backend'in Ayağa Kaldırılması**
```bash
cd backend
npm install
```
`.env` dosyanızı `backend` dizininde oluşturduktan sonra (PORT, MONGODB_URI, JWT_SECRET, CLOUDINARY keyleri ile) sunucuyu çalıştırın:
```bash
npm run dev
```
**Adım 3: Mobil Uygulamanın Başlatılması**
```bash
cd ../social
npm install
npx expo start
```
QR kodunu okutarak uygulamanızı test edebilirsiniz.
