# FSMSocial

> **FSMSocial**, Fatih Sultan Mehmet Vakıf Üniversitesi öğrencileri ve kulüpleri için geliştirilmiş, ekip yönetimi, devre takibi ve sosyal etkileşimi bir arada sunan tam yığın (full-stack) mobil uygulama platformudur.

---

## 📑 İçindekiler

- [Özellikler](#-özellikler)
- [Teknoloji Yığını](#-teknoloji-yığını)
- [Proje Yapısı](#-proje-yapısı)
- [Kurulum](#-kurulum)
- [Ortam Değişkenleri](#-ortam-değişkenleri)
- [API Dokümantasyonu](#-api-dokümantasyonu)
- [Mimari](#-mimari)
- [Test](#-test)
- [Katkı Sağlama](#-katkı-sağlama)

---

## ✨ Özellikler

| Modül | Açıklama |
|---|---|
| 🔐 **Kimlik Doğrulama** | JWT tabanlı kayıt / giriş, token yenileme |
| 👥 **Ekip Yönetimi** | Ekip oluşturma, üye ekleme/çıkarma, lider rolleri |
| 🔄 **Devre Takibi** | Dönem bazlı devre yönetimi ve arşivleme |
| 📝 **Gönderi Akışı** | Gönderi oluşturma, beğeni, yorum ve paylaşım |
| 🔔 **Bildirimler** | Gerçek zamanlı Socket.IO bildirimleri |
| 📊 **Dashboard** | Ekip ve üye istatistikleri, analitik görünümler |
| 🛡️ **Rol Tabanlı Yetkilendirme** | Admin, Lider ve Üye rollerinin ayrıştırılması |
| 🌗 **Tema Desteği** | Açık / Koyu tema (Zustand ile global durum yönetimi) |

---

## 🛠 Teknoloji Yığını

### Backend
| Teknoloji | Versiyon | Kullanım Amacı |
|---|---|---|
| Node.js | ≥ 18 | Çalışma ortamı |
| Express | ^4.22 | HTTP sunucusu |
| MongoDB / Mongoose | ^9.3 | Veritabanı & ODM |
| Socket.IO | ^4.8 | Gerçek zamanlı iletişim |
| Redis / ioredis | ^5.10 | Önbellekleme & Socket adapter |
| JWT | ^9.0 | Kimlik doğrulama |
| bcryptjs | ^3.0 | Parola hashing |
| Joi / Zod | - | Girdi doğrulama |
| Winston | ^3.19 | Loglama |
| Helmet | ^8.1 | HTTP güvenlik başlıkları |
| Vitest | ^4.1 | Birim testleri |

### Frontend (Mobil)
| Teknoloji | Versiyon | Kullanım Amacı |
|---|---|---|
| React Native | 0.81 | Mobil arayüz |
| Expo | ~54.0 | Geliştirme platformu |
| Expo Router | ~6.0 | Dosya tabanlı navigasyon |
| Zustand | ^5.0 | Global durum yönetimi |
| React Navigation | ^7.x | Tab ve stack navigasyon |
| AsyncStorage | 2.2 | Yerel depolama |

---

## 📁 Proje Yapısı

```
fsmsocial/
├── backend/                    # Node.js + Express API sunucusu
│   ├── index.js                # Sunucu giriş noktası
│   ├── src/
│   │   ├── config/             # Veritabanı & Redis bağlantıları
│   │   ├── controller/         # HTTP istek işleyicileri
│   │   ├── service/            # İş mantığı katmanı
│   │   │   └── __tests__/      # Servis birim testleri
│   │   ├── repository/         # Veritabanı erişim katmanı
│   │   ├── models/             # Mongoose şemaları
│   │   │   ├── user/
│   │   │   ├── ekip/
│   │   │   ├── devre/
│   │   │   ├── posts/
│   │   │   └── notification/
│   │   ├── routes/             # API rotaları
│   │   │   ├── authRoute.js
│   │   │   ├── ekipRoute.js
│   │   │   ├── devreRoute.js
│   │   │   ├── postRoute.js
│   │   │   ├── notificationRoute.js
│   │   │   └── adminRoute.js
│   │   ├── middleware/         # Express middleware'leri
│   │   │   ├── auth.middleware.js
│   │   │   ├── authorize.middleware.js
│   │   │   ├── rateLimiter.middleware.js
│   │   │   ├── sanitize.middleware.js
│   │   │   ├── validate.middleware.js
│   │   │   ├── profilTamamla.middleware.js
│   │   │   └── errorHandler.middleware.js
│   │   ├── validations/        # Joi/Zod şema doğrulamaları
│   │   ├── lib/                # Yardımcı kütüphaneler
│   │   ├── shared/             # Paylaşılan sabitler ve tipler
│   │   ├── utils/              # Yardımcı fonksiyonlar
│   │   └── test/               # Test altyapısı (in-memory DB)
│   └── vitest.config.js
│
└── social/                     # Expo React Native uygulaması
    ├── app/
    │   ├── (auth)/             # Kimlik doğrulama ekranları
    │   │   ├── index.jsx       # Giriş ekranı
    │   │   └── signup.jsx      # Kayıt ekranı
    │   └── (tabs)/             # Ana tab navigasyonu
    │       ├── mainMenu.jsx    # Ana akış
    │       ├── dashboard.jsx   # İstatistik paneli
    │       ├── postCreate.jsx  # Gönderi oluşturma
    │       ├── profile.jsx     # Profil sayfası
    │       └── settings.jsx    # Ayarlar sayfası
    ├── components/             # Yeniden kullanılabilir bileşenler
    ├── store/                  # Zustand store'ları
    │   └── themeStore.js       # Tema yönetimi
    ├── hooks/                  # Özel React hook'ları
    ├── constants/              # Sabit değerler
    └── assets/                 # Görseller, fontlar
```

---

## 🚀 Kurulum

### Gereksinimler

- **Node.js** ≥ 18.x
- **MongoDB** (yerel veya Atlas)
- **Redis** (yerel veya bulut)
- **Expo CLI** (`npm install -g expo-cli`)

### 1. Depoyu Klonla

```bash
git clone https://github.com/alperenaykutlu/fsmsocial.git
cd fsmsocial
```

### 2. Backend Kurulumu

```bash
cd backend
npm install
```

`.env` dosyasını oluştur (bkz. [Ortam Değişkenleri](#-ortam-değişkenleri)):

```bash
cp .env.example .env
```

Geliştirme sunucusunu başlat:

```bash
npm run dev
```

> Sunucu varsayılan olarak `http://localhost:3000` adresinde çalışır.

### 3. Frontend (Mobil) Kurulumu

```bash
cd social
npm install
npx expo start
```

Terminalde görünen QR kodu, **Expo Go** uygulaması ile tarayarak fiziksel cihazınızda çalıştırabilirsiniz.

| Komut | Platform |
|---|---|
| `npx expo start --android` | Android emülatörü |
| `npx expo start --ios` | iOS simülatörü (macOS) |
| `npx expo start --web` | Web tarayıcısı |

---

## 🔑 Ortam Değişkenleri

`backend/.env` dosyasına aşağıdaki değişkenleri ekleyin:

```env
# Sunucu
PORT=3000
NODE_ENV=development

# MongoDB
MONGO_URI=mongodb+srv://<kullanici>:<sifre>@cluster.mongodb.net/fsmsocial

# Redis
REDIS_URL=redis://localhost:6379

# JWT
JWT_SECRET=<gizli-anahtar>
JWT_REFRESH_SECRET=<yenileme-gizli-anahtari>
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# CORS
CLIENT_URL=http://localhost:8081
```

---

## 📡 API Dokümantasyonu

### Temel URL

```
http://localhost:3000/api
```

### Kimlik Doğrulama

| Yöntem | Endpoint | Açıklama |
|---|---|---|
| `POST` | `/auth/register` | Yeni kullanıcı kaydı |
| `POST` | `/auth/login` | Giriş (JWT döner) |
| `POST` | `/auth/refresh` | Token yenileme |
| `POST` | `/auth/logout` | Oturumu sonlandırma |

### Kullanıcı

| Yöntem | Endpoint | Açıklama |
|---|---|---|
| `GET` | `/user/me` | Kendi profilini getir |
| `PUT` | `/user/me` | Profili güncelle |

### Ekip (Kulüp)

| Yöntem | Endpoint | Açıklama |
|---|---|---|
| `GET` | `/ekip` | Tüm ekipleri listele |
| `POST` | `/ekip` | Yeni ekip oluştur |
| `GET` | `/ekip/:id` | Ekip detayı |
| `PUT` | `/ekip/:id` | Ekip güncelle |
| `DELETE` | `/ekip/:id` | Ekip sil |
| `POST` | `/ekip/:id/uye` | Üye ekle |
| `DELETE` | `/ekip/:id/uye/:uyeId` | Üye çıkar |

### Devre

| Yöntem | Endpoint | Açıklama |
|---|---|---|
| `GET` | `/devre` | Devre listesi |
| `POST` | `/devre` | Yeni devre başlat |
| `GET` | `/devre/:id` | Devre detayı |
| `PUT` | `/devre/:id` | Devre güncelle |
| `DELETE` | `/devre/:id` | Devreyi sil |

### Gönderi

| Yöntem | Endpoint | Açıklama |
|---|---|---|
| `GET` | `/post` | Gönderi akışı |
| `POST` | `/post` | Yeni gönderi |
| `DELETE` | `/post/:id` | Gönderi sil |

### Bildirimler

| Yöntem | Endpoint | Açıklama |
|---|---|---|
| `GET` | `/notification` | Bildirimleri getir |
| `PUT` | `/notification/read` | Okundu işaretle |

### Yetkilendirme

Korumalı endpointler için `Authorization` header'ı gereklidir:

```
Authorization: Bearer <access_token>
```

---

## 🏗 Mimari

```
┌─────────────────────────────────────────────────────┐
│              React Native (Expo Router)              │
│         Auth Screens │ Tabs │ Components             │
│              Zustand (Global State)                  │
└──────────────────────┬──────────────────────────────┘
                       │ HTTP / WebSocket
┌──────────────────────▼──────────────────────────────┐
│                   Express.js API                     │
│  Routes → Middleware → Controller → Service → Repo   │
│   (JWT Auth, Rate Limit, Sanitize, RBAC)             │
└──────────┬──────────────────────┬────────────────────┘
           │                      │
┌──────────▼──────┐    ┌──────────▼──────┐
│    MongoDB       │    │     Redis        │
│  (Mongoose ODM)  │    │  (Cache/Socket)  │
└─────────────────┘    └─────────────────┘
```

### Katmanlı Mimari (Backend)

```
Controller  →  doğrulama, HTTP katmanı
  Service   →  iş mantığı, kurallar
Repository  →  veritabanı sorguları (Mongoose)
   Model    →  Mongoose şemaları
```

---

## 🧪 Test

Backend birim testlerini çalıştır:

```bash
cd backend
npm test
```

- **Test çerçevesi:** Vitest
- **In-memory DB:** mongodb-memory-server
- **HTTP testi:** Supertest
- Test dosyaları `src/service/__tests__/` klasöründe yer alır.

---

## 🔐 Güvenlik

- **Helmet** – HTTP güvenlik başlıkları
- **express-rate-limit** – Brute-force koruması
- **express-mongo-sanitize** – NoSQL injection önleme
- **xss** – XSS filtreleme
- **bcryptjs** – Parola hashing
- **JWT** – Erişim ve yenileme token'ları

---

## 🤝 Katkı Sağlama

1. Bu repoyu fork'layın (`git fork`)
2. Yeni bir branch oluşturun (`git checkout -b feature/yeni-ozellik`)
3. Değişikliklerinizi commit edin (`git commit -m 'feat: yeni özellik eklendi'`)
4. Branch'inizi push edin (`git push origin feature/yeni-ozellik`)
5. Pull Request açın

---

## 📜 Lisans

Bu proje [ISC](LICENSE) lisansı altında dağıtılmaktadır.

---

<div align="center">
  <p>FSMSocial — Fatih Sultan Mehmet Ergin İzci Ocağı</p>
</div>
