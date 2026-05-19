# 🌿 Pronojiwo Nature Escape

> Platform wisata alam digital untuk menjelajahi surga tersembunyi Pronojiwo, Lumajang, Jawa Timur — dilengkapi sistem pemesanan tiket online, ulasan pengunjung, dan galeri destinasi.

![Laravel](https://img.shields.io/badge/Laravel-12.x-FF2D20?style=for-the-badge&logo=laravel&logoColor=white)
![React](https://img.shields.io/badge/React-18.x-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Inertia.js](https://img.shields.io/badge/Inertia.js-2.x-7C3AED?style=for-the-badge)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.x-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-8.x-4479A1?style=for-the-badge&logo=mysql&logoColor=white)
![Headless UI](https://img.shields.io/badge/Headless%20UI-2.x-0F172A?style=for-the-badge)
![Framer Motion](https://img.shields.io/badge/Framer%20Motion-11.x-0055FF?style=for-the-badge)
![Vercel](https://img.shields.io/badge/Vercel-Deploy-000000?style=for-the-badge&logo=vercel&logoColor=white)

---

## 📖 Tentang Proyek

**Pronojiwo Nature Escape** adalah aplikasi web full-stack yang dibangun untuk mempromosikan dan memfasilitasi kunjungan wisata alam di Kecamatan Pronojiwo, Lumajang, Jawa Timur. Proyek ini mencakup:

- 🗺️ **Halaman Landing Page** informatif dengan informasi destinasi wisata
- 🎟️ **Sistem E-Tiket** untuk pemesanan tiket masuk secara online
- 👤 **Autentikasi Pengguna** dengan role-based access (Pengunjung / Admin / Super Admin)
- ⭐ **Sistem Ulasan** dari para pengunjung destinasi
- 🖼️ **Galeri Destinasi** untuk menampilkan foto-foto wisata
- 📊 **Dashboard Admin** untuk pengelolaan data
- 💬 **Sistem Pesan Instan** untuk komunikasi pengunjung dan admin
- 🏷️ **Sistem Kode Promo** untuk diskon khusus

---

## 🏞️ Destinasi Wisata yang Tersedia

| Destinasi | Kategori | Harga |
|-----------|----------|-------|
| Air Terjun Tumpak Sewu | Air Terjun | Rp 20.000 |
| Panorama Kapas Biru | Panorama | Rp 15.000 |
| Air Terjun Kapas Biru | Air Terjun | Rp 15.000 |
| Kabut Pelangi | Air Terjun | Rp 10.000 |
| Hutan Pinus Pronojiwo | Hutan | Rp 10.000 |
| Bukit Sriti | Panorama | Rp 15.000 |

---

## 🛠️ Tech Stack

### Backend
| Teknologi | Versi | Kegunaan |
|-----------|-------|----------|
| **Laravel** | 12.x | PHP Framework utama |
| **Inertia.js** | 2.x | Jembatan Laravel ↔ React (SPA tanpa API) |
| **MySQL** | 8.x | Database relasional |
| **Laravel Breeze** | — | Starter kit autentikasi |
| **Laravel Mail** | — | Pengiriman email balasan pesan admin |
| **Vercel PHP** | 0.7.3 | Serverless Runtime Engine |

### Frontend
| Teknologi | Versi | Kegunaan |
|-----------|-------|----------|
| **React** | 18.x | UI Library |
| **Vite** | 7.x | Build tool & dev server |
| **TailwindCSS** | 3.x | Utility-first CSS |
| **Headless UI** | 2.x | Komponen UI accessible |
| **Framer Motion** | 11.x | Animasi |
| **Lucide React** | latest | Icon library |

---

## 🗄️ Struktur Database

```
users
├── id_user (PK)
├── nama_lengkap
├── email (unique)
├── password
├── no_telepon (nullable)
├── role (enum: pengunjung | admin | super_admin)
├── remember_token
└── timestamps

destinasis
├── id_destinasi (PK)
├── nama_wisata
├── kategori
├── deskripsi
├── lokasi_rute
├── harga_tiket
├── kapasitas_harian
├── status
├── fasilitas
├── rating_asli
└── timestamps

bookings
├── id_booking (PK)
├── id_user (FK → users)
├── id_destinasi (FK → destinasis)
├── tanggal_kunjungan
├── jumlah_tiket
├── total_harga
├── status
└── timestamps

pembayarans
├── id_pembayaran (PK)
├── id_booking (FK → bookings)
├── metode_pembayaran
├── status_pembayaran
├── jumlah_bayar
└── timestamps

reviews
├── id_review (PK)
├── id_user (FK → users)
├── id_destinasi (FK → destinasis)
├── rating
├── ulasan
└── timestamps

galeris
├── id_galeri (PK)
├── id_destinasi (FK → destinasis)
├── foto
└── timestamps

pesans
├── id_pesan (PK)
├── nama_lengkap
├── email
├── subjek
├── pesan
├── balasan
├── status (belum_dibalas | sudah_dibalas)
└── timestamps

discounts
├── id_diskon (PK)
├── kode_diskon (unique)
├── persentase
├── status (aktif | tidak_aktif)
├── id_destinasi (FK → destinasis, nullable)
├── berlaku_sampai
└── timestamps
```

---

## 📁 Struktur Proyek

```
pronojiwo-nature-escape/
├── app/
│   ├── Http/
│   │   ├── Controllers/
│   │   │   ├── Auth/                       # Autentikasi (Login, Register, dll)
│   │   │   ├── AdminDashboardController.php # CRUD destinasi, booking, ulasan, dll
│   │   │   ├── DestinasiController.php      # Data untuk landing page publik
│   │   │   ├── BookingController.php
│   │   │   ├── PembayaranController.php
│   │   │   ├── ReviewController.php
│   │   │   ├── GaleriController.php
│   │   │   ├── PesanController.php
│   │   │   └── DiscountController.php
│   │   └── Requests/
│   │       └── Auth/
│   │           └── LoginRequest.php         # Custom login validation
│   ├── Mail/
│   │   └── BalasanPesanMail.php             # Template email balasan admin
│   └── Models/
│       ├── User.php
│       ├── Destinasi.php
│       ├── Booking.php
│       ├── Pembayaran.php
│       ├── Review.php
│       ├── Galeri.php
│       ├── Pesan.php
│       ├── Discount.php
│       └── LogAktivitas.php
├── database/
│   ├── migrations/                          # Skema tabel database
│   └── seeders/
│       ├── DestinasiSeeder.php              # Data awal destinasi
│       └── DatabaseSeeder.php               # Seed utama
├── resources/
│   ├── css/
│   │   └── app.css                          # Global styles
│   └── js/
│       └── Pages/
│           ├── index.jsx                    # Landing page utama (publik)
│           ├── UserDashboard.jsx            # Dashboard pengunjung
│           ├── Admin/
│   │   │   └── AdminDashboard.jsx           # Dashboard admin/super admin
│   │   └── Auth/
│   │       ├── Login.jsx                    # Halaman login (redesign premium)
│   │       └── Register.jsx                 # Halaman daftar (redesign premium)
├── public/
│   └── images/
│       └── download.jpg                     # Foto hero Pronojiwo
├── routes/
│   ├── web.php                              # Route utama
│   └── auth.php                             # Route autentikasi
└── vercel.json                              # Konfigurasi deployment Vercel
```

---

## ✨ Fitur Utama

### 🔐 Autentikasi
- **Registrasi** dengan field: nama lengkap, email, nomor telepon, password
- **Role otomatis** `pengunjung` saat daftar baru
- **Login** dengan validasi pesan spesifik:
  - Email tidak ditemukan → diarahkan untuk daftar
  - Password salah → notifikasi kuning
  - Rate limiting → 5 percobaan max
- **Remember Me** dengan `remember_token`
- **Reset Password** tersedia

### 🎨 UI/UX Premium
- Split-screen layout pada halaman Login & Register
- Glassmorphism design dengan tema emerald dark
- **Password Strength Meter** di halaman registrasi
- Animasi `fadeUp` bertahap per elemen
- Tidak ada white flash saat navigasi (Inertia SPA)
- Fully responsive (mobile & desktop)

### 🗺️ Landing Page & Dashboard
- Hero section elegan dengan *wave divider* dan efek parallax
- Kartu destinasi dinamis (otomatis sinkron dengan kategori dari database)
- Form pemesanan tiket interaktif dengan kalkulasi instan
- Animated stats counter dan ulasan pengunjung
- Dashboard Admin terpadu untuk kelola data wisata (CRUD dengan form dinamis)
- Dashboard Pengunjung untuk tracking status e-tiket dan pembayaran

### 💬 Sistem Pesan Instan
- Formulir kontak untuk pengunjung
- Admin dapat membalas pesan melalui email langsung
- Status pesan (belum_dibalas / sudah_dibalas)

### 🏷️ Sistem Kode Promo
- Buat kode diskon dengan persentase tertentu
- Tentukan tanggal berlaku
- Terapkan ke destinasi tertentu atau semua destinasi
- Status aktif/tidak aktif

---

## 🚀 Cara Instalasi & Menjalankan

### Prasyarat
- PHP >= 8.2
- Composer
- Node.js >= 18
- MySQL 8.x
- Git

### Langkah Instalasi

```bash
# 1. Clone repository
git clone https://github.com/Raihanhidayah12/pronojiwo-nature-escape.git
cd pronojiwo-nature-escape

# 2. Install dependencies PHP
composer install

# 3. Install dependencies Node.js
npm install

# 4. Salin file environment
cp .env.example .env

# 5. Generate application key
php artisan key:generate
```

### Konfigurasi Database

Edit file `.env` dan sesuaikan dengan konfigurasi database lokal Anda:

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=pronojiwo_nature_escape
DB_USERNAME=root
DB_PASSWORD=
```

```bash
# 6. Jalankan migrasi & seeder
php artisan migrate --seed

# 7. Jalankan server (dua terminal terpisah)
php artisan serve          # Terminal 1 → http://127.0.0.1:8000
npm run dev                # Terminal 2 → Vite dev server
```

### Akses Aplikasi

| URL | Keterangan |
|-----|------------|
| `http://127.0.0.1:8000` | Landing page |
| `http://127.0.0.1:8000/login` | Halaman masuk |
| `http://127.0.0.1:8000/register` | Halaman daftar |
| `http://127.0.0.1:8000/dashboard` | Dashboard (perlu login) |

---

## ☁️ Deployment (Vercel)

Proyek ini sudah dikonfigurasi untuk berjalan di Vercel menggunakan `vercel-php`. File konfigurasi telah disediakan dalam `vercel.json`.

```json
{
  "version": 2,
  "outputDirectory": "public",
  "builds": [
    { "src": "public/index.php", "use": "vercel-php@0.7.3" },
    { "src": "public/**", "use": "@vercel/static" }
  ],
  "routes": [
    { "src": "/build/(.*)", "dest": "/public/build/$1" },
    { "src": "/(css|js|images|assets)/(.*)", "dest": "/public/$1/$2" },
    { "src": "/(.*)", "dest": "/public/index.php" }
  ]
}
```

Pastikan Anda menyetel environment variables (`APP_KEY`, informasi koneksi `DB_*`, dll) pada dashboard Vercel Anda sebelum melakukan deployment.

---

## 👥 Role Pengguna

| Role | Akses |
|------|-------|
| `pengunjung` | Melihat destinasi, memesan tiket, menulis ulasan, mengirim pesan |
| `admin` | Kelola destinasi, booking, ulasan, galeri, verifikasi pembayaran, balas pesan |
| `super_admin` | Akses penuh termasuk manajemen admin, kode promo, dan log aktivitas |

---

## 🤝 Kontribusi

1. Fork repository ini
2. Buat branch fitur: `git checkout -b fitur/nama-fitur`
3. Commit perubahan: `git commit -m 'Tambah fitur X'`
4. Push ke branch: `git push origin fitur/nama-fitur`
5. Buat Pull Request

---

## 📄 Lisensi

Proyek ini dibuat untuk keperluan akademik dan pengembangan wisata lokal Pronojiwo, Lumajang, Jawa Timur.

---

## 📍 Lokasi

**Kecamatan Pronojiwo, Kabupaten Lumajang, Jawa Timur, Indonesia**

Pronojiwo dikenal sebagai salah satu kawasan alam terbaik di Jawa Timur, dengan Air Terjun Tumpak Sewu yang sering dijuluki *"Niagara-nya Indonesia"* sebagai daya tarik utamanya.

---

<div align="center">
  <p>Dibuat dengan ❤️ untuk mempromosikan keindahan alam Pronojiwo</p>
  <p><strong>© 2025 Pronojiwo Nature Escape</strong></p>
</div>