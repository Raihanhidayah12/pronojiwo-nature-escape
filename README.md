# 🌿 Pronojiwo Nature Escape

> Platform wisata alam digital untuk menjelajahi surga tersembunyi Pronojiwo, Lumajang, Jawa Timur — dilengkapi sistem pemesanan tiket online, ulasan pengunjung, dan galeri destinasi.

![Laravel](https://img.shields.io/badge/Laravel-12.x-FF2D20?style=for-the-badge&logo=laravel&logoColor=white)
![React](https://img.shields.io/badge/React-18.x-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Inertia.js](https://img.shields.io/badge/Inertia.js-2.x-7C3AED?style=for-the-badge)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.x-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-8.x-4479A1?style=for-the-badge&logo=mysql&logoColor=white)

---

## 📖 Tentang Proyek

**Pronojiwo Nature Escape** adalah aplikasi web full-stack yang dibangun untuk mempromosikan dan memfasilitasi kunjungan wisata alam di Kecamatan Pronojiwo, Lumajang. Proyek ini mencakup:

- 🗺️ **Halaman Landing Page** informatif dengan informasi destinasi wisata
- 🎟️ **Sistem E-Tiket** untuk pemesanan tiket masuk secara online
- 👤 **Autentikasi Pengguna** dengan role-based access (Pengunjung / Admin / Super Admin)
- ⭐ **Sistem Ulasan** dari para pengunjung destinasi
- 🖼️ **Galeri Destinasi** untuk menampilkan foto-foto wisata
- 📊 **Dashboard Admin** untuk pengelolaan data

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
├── deskripsi
├── lokasi_rute
├── harga_tiket
├── kapasitas
├── foto
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
```

---

## 📁 Struktur Proyek

```
pronojiwo-nature-escape/
├── app/
│   ├── Http/
│   │   ├── Controllers/
│   │   │   ├── Auth/               # Autentikasi (Login, Register, dll)
│   │   │   ├── DestinasiController.php
│   │   │   ├── BookingController.php
│   │   │   ├── PembayaranController.php
│   │   │   ├── ReviewController.php
│   │   │   └── GaleriController.php
│   │   └── Requests/
│   │       └── Auth/
│   │           └── LoginRequest.php  # Custom login validation
│   └── Models/
│       ├── User.php
│       ├── Destinasi.php
│       ├── Booking.php
│       ├── Pembayaran.php
│       ├── Review.php
│       └── Galeri.php
├── database/
│   ├── migrations/               # Skema tabel database
│   └── seeders/
│       └── DestinasiSeeder.php   # Data awal destinasi
├── resources/
│   ├── css/
│   │   └── app.css               # Global styles
│   └── js/
│       └── Pages/
│           ├── index.jsx         # Landing page utama
│           ├── Dashboard.jsx     # Dashboard user
│           └── Auth/
│               ├── Login.jsx     # Halaman login (redesign premium)
│               └── Register.jsx  # Halaman daftar (redesign premium)
├── public/
│   └── images/
│       └── download.jpg          # Foto hero Pronojiwo
└── routes/
    ├── web.php                   # Route utama
    └── auth.php                  # Route autentikasi
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

### 🗺️ Landing Page
- Hero section dengan foto lokal Pronojiwo + parallax effect
- Kartu destinasi dengan filter kategori (Air Terjun, Panorama, Hutan)
- Form pemesanan tiket inline dengan kalender custom
- Animated stats counter
- Testimoni pengunjung
- Formulir kontak

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

## 👥 Role Pengguna

| Role | Akses |
|------|-------|
| `pengunjung` | Melihat destinasi, memesan tiket, menulis ulasan |
| `admin` | Kelola destinasi, booking, ulasan, galeri |
| `super_admin` | Akses penuh termasuk manajemen admin |

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
