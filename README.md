# FSMSocial - İzci ve Sosyal Paylaşım Uygulaması
FSMSocial, izci grupları ve kullanıcıların bir araya gelerek etkinlikler düzenleyebileceği, profillerini yönetebileceği ve takım/ekip süreçlerini takip edebileceği tam yığın (full-stack) bir mobil uygulamadır. 
Proje iki ana bileşenden oluşmaktadır:
- **Frontend (`/social`)**: React Native ve Expo kullanılarak geliştirilmiştir.
- **Backend (`/backend`)**: Node.js, Express.js ve MongoDB(Mongoose) ile geliştirilmiştir.
## 🚀 Özellikler
- **Kullanıcı Yönetimi**: Cihaz kayıtları, JWT tabanlı giriş işlemleri.
- **Profil Yönetimi**: Kullanıcı profili güncelleme ve **Cloudinary** entegrasyonu ile fotoğraf yükleme.
- **Etkinlik & Durum Paylaşımı**: Kullanıcıların etkinliklere kayıt olması, onay/red durumları ve durum paylaşımları.
- **Ekip ve Takım Yönetimi**: İzcilik ekipleri (troops), ekip liderleri ve takım süreçlerini yönetmeyi sağlayan DDD (Domain-Driven Design) prensiplerine uygun servisler.
## 🛠️ Kullanılan Teknolojiler
### Frontend (Mobil)
- **React Native & Expo**: Çapraz platform mobil uygulama geliştirme.
- **Zustand**: Global durum (state) yönetimi.
- **Zod & React Hook Form**: Form validasyonları (varsa).
- **Expo Router**: Sayfalar arası geçiş ve yönlendirmeler.
### Backend
- **Node.js & Express.js**: RESTful API altyapısı.
- **MongoDB & Mongoose**: NoSQL veritabanı yönetimi ve ODM.
- **Cloudinary**: Medya ve görsel yönetimi.
- **Bcrypt.js & JSONWebToken (JWT)**: Parola şifreleme ve yetkilendirme işlemleri.
### 🔮 Gelecekte Eklenecek Teknolojiler (Roadmap)
- **Socket.io**: Kullanıcılara anlık bildirimler, eşzamanlı mesajlaşma ve duyuru iletimi sağlamak için eklenecektir.
- **Redis**: Sık erişilen verilerin önbelleklenmesi (caching) ve uygulamanın genel performansının artırılması amacıyla entegre edilecektir.
---
## 💻 Kurulum ve Çalıştırma
### 1. Depoyu Klonlayın
```bash
git clone https://github.com/alperenaykutlu/fsmsocial.git
cd fsmsocial
```
### 2. Backend Kurulumu ve Çalıştırılması
`backend` klasörüne giderek gerekli bağımlılıkları indirin:
```bash
cd backend
npm install
```
`backend` dizini içerisine bir `.env` dosyası oluşturun ve aşağıdaki ortam değişkenlerini ayarlayın:
```env
PORT=5000
MONGODB_URI=sizin_mongodb_baglanti_dizginiz
JWT_SECRET=gizli_anahtariniz
CLOUDINARY_CLOUD_NAME=cloudinary_adiniz
CLOUDINARY_API_KEY=api_anaharitniz
CLOUDINARY_API_SECRET=gizli_api_anahtariniz
```
Sunucuyu başlatın:
```bash
npm run dev
# veya
nodemon index.js
```
### 3. Frontend (Mobil App) Kurulumu ve Çalıştırılması
Ayrı bir terminal açıp `social` klasörüne gidin:
```bash
cd fsmsocial/social
npm install
```
Expo geliştirme sunucusunu başlatın:
```bash
npx expo start
```
Açılan terminaldeki QR kodu Expo Go mobil uygulamasından okutarak veya bir emülatör (Android/iOS) başlatarak uygulamayı test edebilirsiniz.
---
## 📂 Proje Dizini
```plaintext
fsmsocial/
├── backend/ # Node.js ve Express tabanlı REST API
│ ├── src/ 
│ ├── index.js
│ ├── .env
│ └── package.json
├── social/ # React Native & Expo Mobil Uygulaması
│ ├── app/ # Expo Router sayfaları
│ ├── components/ # Yeniden kullanılabilir React bileşenleri
│ ├── store/ # Zustand state yönetim dosyaları
│ └── package.json
└── README.md
```
## 📜 Lisans
Bu proje geliştirme aşamasındadır ve kapalı/özel depodur. Her hakkı saklıdır.
