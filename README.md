# Taubat & Hijrah - Islamic Spiritual Journey Tracker

Aplikasi web komprehensif yang membantu umat Muslim menjaga konsistensi dalam perjalanan spiritual taubat dan hijrah dari maksiat, khususnya dalam menjauhi zina dan dosa-dosa lainnya.

## ✨ Fitur Utama

### 🕌 **Tracking Ibadah Harian**
- **Shalat Fardhu**: Tracking 5 waktu shalat wajib (Subuh, Dzuhur, Ashar, Maghrib, Isya)
- **Shalat Sunnah**: Dhuha, Tahajud, Witir, Taubat, dan Rawatib
- **Validasi Waktu**: Sistem hanya mengizinkan absen shalat setelah waktu masuk
- **Niat Shalat**: Dilengkapi bacaan niat dalam Arab, Latin, dan artinya

### 📿 **Amalan Spiritual**
- **Tilawah Al-Quran**: Tracking bacaan harian Al-Quran
- **Dzikir & Istighfar**: Monitor sesi dzikir dan istighfar
- **Tasbih Digital**: Counter tasbih dengan berbagai pilihan dzikir
- **Doa Harian**: Pengingat untuk membaca doa-doa harian
- **Amal Kebaikan**: Tracking sedekah dan perbuatan baik lainnya

### 🧭 **Fitur Navigasi Islami**
- **Arah Kiblat**: Kompas kiblat otomatis berdasarkan lokasi GPS
- **Waktu Shalat**: Jadwal shalat akurat sesuai koordinat lokasi
- **Zona Waktu**: Support WIB, WITA, dan WIT
- **Deteksi Otomatis**: Auto-detect timezone berdasarkan longitude

### 📊 **Progress & Analytics**
- **Visualisasi Progress**: Circular progress indicators yang indah
- **Streak Counter**: Hitung hari berturut-turut konsisten
- **Daily Reports**: Laporan harian lengkap
- **Motivational Quotes**: Ayat Quran dan hadits harian

### 🤖 **Integrasi Telegram Bot**
- **Laporan Otomatis**: Kirim progress harian ke Telegram
- **Motivasi Spiritual**: Pesan motivasi berbasis Al-Quran dan Hadits
- **Pengingat**: Notifikasi untuk menjaga konsistensi
- **Real-time Updates**: Update milestone spiritual instant

### 🎨 **Desain Islami**
- **Estetika Autentik**: Pola geometris dan kaligrafi Arab
- **Warna Sejuk**: Palet hijau, biru, dan earth tones
- **Responsive Design**: Optimal di semua perangkat
- **Kulturally Sensitive**: Representasi nilai-nilai Islam yang sopan

## 🔧 Setup Telegram Bot

### Prasyarat
Bot sudah tersedia dan siap digunakan:
- **Bot Username**: @Arcyyybot
- **Bot Link**: https://t.me/Arcyyybot

### Cara Mendapatkan Chat ID

1. **Buka bot Telegram**: 
   - Klik link: https://t.me/Arcyyybot
   - Atau cari `@Arcyyybot` di Telegram

2. **Mulai chat dengan bot**:
   - Klik tombol **START** atau kirim `/start`
   - ⚠️ **Penting**: Bot tidak bisa mengirim pesan jika belum di-start

3. **Dapatkan Chat ID**:
   - Kirim pesan `/id` ke bot
   - Bot akan membalas dengan Chat ID Anda
   - Chat ID berbentuk angka (contoh: `965058766`)

4. **Gunakan di Aplikasi**:
   - Copy Chat ID (hanya angka saja)
   - Paste ke kolom Chat ID di aplikasi
   - Klik **Hubungkan**

### Perintah Bot
```
/start - Memulai bot dan aktivasi fitur
/id - Mendapatkan Chat ID untuk koneksi
/help - Bantuan penggunaan bot
```

## 🚀 Installation & Development

### Requirements
- Node.js 18+
- npm atau yarn
- Browser dengan support GPS (untuk fitur kiblat)

### Setup Lokal

1. **Clone repository**:
   ```bash
   git clone <repository-url>
   cd taubat-hijrah-tracker
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start development server**:
   ```bash
   npm run dev
   ```

4. **Build untuk production**:
   ```bash
   npm run build
   ```

5. **Preview production build**:
   ```bash
   npm run preview
   ```

### Build Commands
```bash
npm run dev      # Development server
npm run build    # Production build
npm run preview  # Preview production build
npm run lint     # ESLint check
```

## 📁 Struktur Proyek

```
src/
├── components/              # React components
│   ├── Header.tsx          # Header dengan kalender Hijriyah
│   ├── HabitTracker.tsx    # Tracker ibadah harian
│   ├── ProgressSummary.tsx # Visualisasi progress
│   ├── MotivationalQuotes.tsx # Ayat & hadits motivasi
│   ├── PrayerTimes.tsx     # Jadwal waktu shalat
│   ├── QiblaDirection.tsx  # Kompas arah kiblat
│   ├── TasbihCounter.tsx   # Counter tasbih digital
│   ├── ReflectionJournal.tsx # Jurnal muhasabah
│   ├── TelegramIntegration.tsx # Kontrol Telegram bot
│   └── NotificationBanner.tsx # Banner notifikasi
├── services/               # API services
│   └── telegramService.ts  # Telegram Bot API
├── utils/                  # Utility functions
│   └── storage.ts          # localStorage management
├── types/                  # TypeScript definitions
│   └── index.ts            # Type definitions
├── styles/                 # Styling
│   └── islamic-patterns.css # Pola desain Islami
└── App.tsx                 # Komponen utama aplikasi
```

## ⚙️ Konfigurasi

### Telegram Bot Configuration
Bot sudah dikonfigurasi dengan:
- **Bot Token**: Sudah di-embed dalam kode
- **API Endpoint**: https://api.telegram.org/bot{token}
- **Supported Commands**: /start, /id, /help

### Prayer Times API
Menggunakan Aladhan API:
- **Endpoint**: https://api.aladhan.com/v1/timings
- **Method**: 20 (Institute of Geophysics, University of Tehran)
- **Auto Timezone**: Berdasarkan longitude koordinat

### Geolocation
- **High Accuracy**: Enabled untuk precision tinggi
- **Timeout**: 15 detik
- **Cache**: 5 menit untuk performa

## 🌟 Fitur Unggulan

### 1. **Validasi Waktu Shalat**
- Absen shalat hanya bisa dilakukan setelah waktu masuk
- Countdown timer untuk shalat selanjutnya
- Validasi khusus untuk shalat malam (Tahajud, Witir)
- Warning untuk waktu-waktu terlarang shalat sunnah

### 2. **Kompas Kiblat Interaktif**
- Real-time compass dengan animasi smooth
- Akurasi tinggi berdasarkan GPS coordinates
- Visual indicator arah mata angin
- Support device orientation untuk mobile

### 3. **Progress Tracking Comprehensive**
- Daily completion percentage
- Streak counter untuk konsistensi
- Historical data dengan localStorage
- Visual feedback dengan colors & animations

### 4. **Motivational System**
- Rotating quotes dari Al-Quran dan Hadits Sahih
- Context-aware notifications
- Reminder berbasis timing
- Arabic text dengan transliterasi dan terjemahan

## 🔒 Privacy & Keamanan

- **Data Lokal**: Semua data personal tersimpan di browser
- **No Tracking**: Tidak ada analytics atau tracking scripts
- **Secure API**: Telegram communication encrypted
- **No Data Mining**: Tidak mengumpulkan data personal
- **Open Source**: Kode transparan dan dapat diaudit

## 🕌 Compliance Syariah

Aplikasi ini dirancang sesuai prinsip-prinsip Islam:
- ✅ Mendorong amal saleh dan pertumbuhan spiritual
- ✅ Menggunakan ayat Quran dan hadits sahih
- ✅ Menghormati kalender dan waktu shalat Islam
- ✅ Mempromosikan akuntabilitas dan komunitas
- ✅ Bebas dari unsur riba, judi, atau haram lainnya
- ✅ Content yang sopan dan sesuai adab Islam
- 
## 📱 Browser Support

### Desktop
- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

### Mobile
- ✅ Chrome Mobile 90+
- ✅ Safari iOS 14+
- ✅ Samsung Internet 15+
- ✅ Firefox Mobile 88+

### Required Features
- **Geolocation API**: Untuk kiblat dan waktu shalat
- **Device Orientation**: Untuk compass (optional)
- **Local Storage**: Untuk menyimpan progress
- **Fetch API**: Untuk Telegram dan prayer times

## 🤝 Contributing

Kontribusi yang meningkatkan pengalaman spiritual sangat diterima:

### Cara Berkontribusi
1. **Fork repository**
2. **Buat feature branch**: `git checkout -b feature/islamic-calendar`
3. **Implement changes** sesuai guidelines Islam
4. **Test thoroughly** dengan berbagai use case
5. **Submit pull request** dengan deskripsi jelas

### Contribution Guidelines
- Pastikan semua konten Islam autentik dan bersumber sahih
- Gunakan bahasa yang sopan dan sesuai adab
- Test integrasi Telegram secara menyeluruh
- Update dokumentasi untuk fitur baru
- Follow existing code style dan patterns
- Tidak menambahkan konten yang bertentangan dengan syariah

## 🐛 Troubleshooting

### Telegram Bot Issues
**Problem**: "Unauthorized" error
- **Solution**: Pastikan sudah `/start` bot terlebih dahulu

**Problem**: "Chat not found"
- **Solution**: Verifikasi Chat ID benar dan bot tidak di-block

**Problem**: Permission denied
- **Solution**: Check browser permission untuk notifications

### Geolocation Issues
**Problem**: "Location access denied"
- **Solution**: Enable location permission di browser settings

**Problem**: "Location timeout"
- **Solution**: Coba di area dengan GPS signal baik

**Problem**: Inaccurate qibla direction
- **Solution**: Calibrate device compass, check GPS accuracy

### Performance Issues
**Problem**: Slow loading
- **Solution**: Clear browser cache, check internet connection

**Problem**: High memory usage
- **Solution**: Close other tabs, restart browser

## 📞 Support & Community

### Mendapatkan Bantuan
- **Issues**: Laporkan bug di GitHub Issues
- **Discussions**: Join community discussions
- **Documentation**: Baca dokumentasi lengkap
- **Telegram**: Contact melalui bot untuk support

### Community Guidelines
- Hormati sesama pengguna dan nilai-nilai Islam
- Berikan feedback yang konstruktif
- Share pengalaman positif dalam perjalanan spiritual
- Bantu sesama dalam belajar dan berkembang

## 📜 License

Project ini open source dan tersedia di bawah [MIT License](LICENSE).

## 🙏 Acknowledgments

- Para ulama dan ustadz yang memberikan guidance spiritual
- Telegram Bot API untuk fitur komunikasi
- Aladhan API untuk calculation waktu shalat
- Islamic geometric art untuk inspirasi desain
- Open source community dan contributors
- Beta testers dan early adopters

## 🤲 Doa Penutup

**Semoga Allah SWT menerima usaha kita dan menjadikan aplikasi ini bermanfaat bagi umat Islam dalam menjaga diri dari maksiat dan mendekatkan diri kepada-Nya. Aamiin.**

---

*"Dan barangsiapa bertakwa kepada Allah niscaya Dia akan mengadakan baginya jalan keluar."* - **QS. At-Talaq: 2**

**Jazakallahu Khairan** untuk menggunakan aplikasi ini dalam perjalanan spiritual Anda! 🌟
