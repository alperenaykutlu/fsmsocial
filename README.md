# FSM Social Backend API

FSM Social (İzci Yönetim Sistemi / Scout Application) projesinin güçlü, test edilebilir ve ölçeklenebilir backend mimarisini içerir.
Katmanlı mimari (Domain-Driven Design esintileri ile Service - Repository - Controller örüntüsü) etrafında şekillendirilerek inşa edilmiştir.

## 🚀 Teknolojik Yaklaşım ve Kullanılan Teknolojiler

- **Platform:** [Node.js](https://nodejs.org/) & [Express.js](https://expressjs.com/)
- **Veritabanı:** [MongoDB](https://www.mongodb.com/) (ODM: [Mongoose](https://mongoosejs.com/))
- **Güvenlik & Doğrulama:**
  - `bcryptjs` (Şifre hashleme)
  - `jsonwebtoken` (Access & Refresh token rotasyonu)
  - `helmet`, `xss`, `express-mongo-sanitize`, `express-rate-limit` (Gelişmiş Web Güvenliği)
  - `zod` & `joi` (İstek verisi doğrulama / validation)
- **Gerçek Zamanlı İletişim (Real-time):** [Socket.io](https://socket.io/) (Redis-adapter mimarisi ile dağıtık çalışmaya hazır)
- **Test Altyapısı (TDD):**
  - [Vitest](https://vitest.dev/) (Modern & Hızlı Test Runner)
  - `mongodb-memory-server` (İzole, hafızada çalışan test veritabanı)
  - `supertest` (Uçtan uça E2E Controller/Route testleri)
- **Loglama:** Winston modülü üzerinden audit log ve dosya/konsol hata loglama.

---

## 📂 Dizin Yapısı ve Mimari Örüntü

```plaintext
/backend
├── /src
│   ├── /controllers     # HTTP Talepleri karşılanır (Request validator'dan geçer) (Yakında Eklenecek)
│   ├── /middlewares     # Error handler, Logger, Rate-Limiter, Auth middlewares 
│   ├── /models          # Mongoose Şemaları (User, Etkinlik, Devre, Ekip vb.)
│   ├── /repository      # Veritabanı sorguları bu soyutlanmış katmanda işlenir
│   │   ├── __tests__    # Repository seviyesi entegrasyon birim testleri (Populate vb. davranış testleri)
│   ├── /routes          # Express.js endpoint tanımlamaları
│   ├── /service         # Temel E-Ticaret / İş Mantığı kuralları (Business Logic / Validation)
│   │   ├── __tests__    # Service mantık ve iş kurallarını test eden Test Driven Development yapısı
│   ├── /shared          # Global Enums ve Sabit değerler
│   ├── /test            # Her test senaryosunda Mongoose-Memory-Server'ı başlatan/temizleyen izole Db Test setup'ı
│   └── /utils           # AppError vb. ortak araçlar
├── index.js             # Sistemin Entry Point dosyası (Express App ve Socket.io ayağa kaldırılır)
└── package.json         # Proje bağımlılıkları ve modüller (ESModules type: "module")
```

👉 **Design Pattern Avantajı**: `routes` $\rightarrow$ `service` $\rightarrow$ `repository`
Tüm veri işlemleri repository katmanında, tüm iş kuralları servislerde yönetilir. Controller sadece gelen veriyi servise iletir.

---

## 📦 Kurulum ve Çalıştırma

### Ortam Kurulumu
1. Repoyu klonladıktan sonra projeye dahil olun.
2. Aşağıdaki komutla tüm npm paketlerini yükleyin:
```bash
npm install
```

### ENV (Ortam Değişkenleri) Ayarları
Proje kök dizininde `.env` isimli dosyanızı oluşturup minimum şu anahtarları eklemelisiniz:
```env
PORT=3000
MONGODB_URI=mongodb+srv://<user>:<password>@cluster...
JWT_ACCESS_SECRET=your_access_secret_key
JWT_REFRESH_SECRET=your_refresh_secret_key
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
```

### Sunucu Modları
*   **Geliştirici Modunda Başlat (Nodemon eşliğinde, kod değiştikçe Resetler):**
    ```bash
    npm run dev
    ```
*   **Production Standart Başlat:**
    ```bash
    npm start
    ```

---

## 🧪 Gelişmiş Test Yaklaşımı (Vitest)

Proje TDD (Test Driven Development) yaklaşımı ve %100 kapsama giden iş mantığı üzerine kurulmuştur. Gerçek veritabanını bozmadan bellekte (`mongodb-memory-server`) izole test DB'leri kurulur, testler atılır ve bellekten silinir.

Testleri başlatmak için:
```bash
npm test
```
*(Bu komut `vitest run` çalıştırarak backend'deki tüm testleri bulur, Mongoose şema testlerini gerçekleştirir ve test veritabanını temiz bir şekilde serbest bırakır).*

**Test Edilmiş Bileşenler ve Güvence Altına Alınan Mantıklar:**
- Oauth benzeri **Rotation bazlı Access & Refresh Token** güvenliği ve expired yönetimi.
- Kullanıcıların **TC Kimlik validasyonları** ve Exception/Error Handling senaryoları.
- Etkinlik katılım (Rsvp), kota kontrol (Kontenjan limiti null/sınırlı durumları) ve Model Population yapıları.
- Scout hiyerarşisi atama kuralları (Örn: *Yardımcı olan kişi aynı yerde baş olamaz*, *Aynı ekip 2 kere atanamaz* vb.)

---

## 🛡 Hata Yönetimi
Global bir try-catch/error mekanizması oluşturulmuştur. Sistemin içinde herhangi bir yerde kontrollü hata atarken `AppError` sınıfını kullanmanız gerekir:
```javascript
throw new AppError("Bu TC Kimlik zaten alınmış!", 400, "DUPLICATE_ENTRY");
```
Sistem bu hatayı otomatik yakalayıp JSON objesi halinde istemciye standart olarak iletir.

---

> Bu proje izcilerin kampları, devriye ekipleri, rolleri ve sosyalleşebilmeleri için üretilmiş özel ve kapalı devre bir backend omurgasına sahiptir. Geliştirilmeye devam edilmektedir.
