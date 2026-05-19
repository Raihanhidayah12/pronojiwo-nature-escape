<div align="center">

# 🌿 Pronojiwo Nature Escape

**Platform wisata alam digital untuk menjelajahi surga tersembunyi Pronojiwo, Lumajang, Jawa Timur.**

Sistem pemesanan tiket online, dasbor manajemen penuh, galeri destinasi, dan ulasan pengunjung — semuanya dalam satu aplikasi web modern.

[![Laravel](https://img.shields.io/badge/Laravel-12.x-FF2D20?style=for-the-badge&logo=laravel&logoColor=white)](https://laravel.com)
[![React](https://img.shields.io/badge/React-18.x-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org)
[![Inertia.js](https://img.shields.io/badge/Inertia.js-2.x-7C3AED?style=for-the-badge&logo=inertia&logoColor=white)](https://inertiajs.com)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.x-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![MySQL](https://img.shields.io/badge/MySQL-8.x-4479A1?style=for-the-badge&logo=mysql&logoColor=white)](https://mysql.com)
[![Vercel](https://img.shields.io/badge/Vercel-Deploy-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://vercel.com)

</div>

---

## 📖 Tentang Proyek

**Pronojiwo Nature Escape** adalah aplikasi web full-stack yang dibangun untuk mempromosikan dan memfasilitasi kunjungan wisata alam di Kecamatan Pronojiwo, Kabupaten Lumajang, Jawa Timur.

Pronojiwo merupakan kawasan alam yang kaya dengan Air Terjun Tumpak Sewu — sering dijuluki *"Niagara-nya Indonesia"* — sebagai daya tarik utamanya. Proyek ini hadir sebagai solusi digital untuk mengelola dan mempopulerkan destinasi-destinasi wisata yang ada di kawasan ini.

### Fitur Unggulan

| Modul | Deskripsi |
|-------|-----------|
| 🌄 **Landing Page Modern** | Halaman beranda premium dengan hero section, wave divider, parallax effect, dan filter destinasi dinamis |
| 🎟️ **E-Tiket Online** | Sistem pemesanan tiket dengan kalkulasi biaya instan, upload bukti bayar, dan status tracking |
| 👤 **Multi-Role Auth** | Autentikasi berlapis: Pengunjung / Admin / Super Admin dengan akses terkontrol |
| 📊 **Dashboard Admin** | Pengelolaan data destinasi (CRUD penuh dengan kategori), verifikasi pembayaran, dan manajemen pengguna |
| 🧑‍💼 **Dashboard Pengunjung** | Riwayat booking, status e-tiket, upload bukti pembayaran, dan penulisan ulasan |
| ⭐ **Sistem Ulasan** | Rating bintang dan ulasan teks per destinasi, hanya bisa dilakukan oleh pengunjung yang sudah memesan |
| 🖼️ **Galeri Destinasi** | Foto utama setiap destinasi yang bisa dikelola langsung dari dasbor admin |
| 🏷️ **Kode Promo** | Sistem diskon berbasis kode dengan batasan persentase, tanggal kadaluarsa, dan destinasi tertentu |
| 📬 **Pesan Instan** | Formulir kontak pengunjung dengan fitur balasan email langsung dari admin |

---

## 🏞️ Destinasi Wisata

| Destinasi | Kategori | Estimasi Harga |
|-----------|----------|---------------|
| Air Terjun Tumpak Sewu | Air Terjun | Rp 20.000 |
| Panorama Kapas Biru | Panorama / Viewpoint | Rp 15.000 |
| Air Terjun Kapas Biru | Air Terjun | Rp 15.000 |
| Kabut Pelangi | Air Terjun | Rp 10.000 |
| Hutan Pinus Pronojiwo | Hutan Pinus / Alam | Rp 10.000 |
| Bukit Sriti | Panorama / Viewpoint | Rp 15.000 |

> Kategori destinasi kini bisa diatur langsung oleh admin melalui dasbor (Air Terjun, Panorama, Hutan, Gunung, Edukasi).

---

## 🛠️ Tech Stack

### Backend
| Teknologi | Versi | Kegunaan |
|-----------|-------|----------|
| **Laravel** | 12.x | PHP Framework — routing, ORM, auth, validasi |
| **Inertia.js** | 2.x | Jembatan Laravel ↔ React tanpa REST API terpisah |
| **MySQL** | 8.x | Database relasional utama |
| **Laravel Breeze** | — | Starter kit autentikasi |
| **Laravel Mail** | — | Pengiriman email balasan pesan admin |
| **Vercel PHP** | 0.7.3 | Serverless runtime untuk deployment di Vercel |

### Frontend
| Teknologi | Versi | Kegunaan |
|-----------|-------|----------|
| **React** | 18.x | UI Library berbasis komponen |
| **Vite** | 7.x | Build tool & dev server cepat |
| **TailwindCSS** | 3.x | Utility-first CSS framework |
| **Lucide React** | latest | Icon set yang ringan dan konsisten |

---

## 🗄️ Skema Database

```
users
├── id_user         (PK)
├── nama_lengkap
├── email           (unique)
├── password
├── no_telepon      (nullable)
├── role            (enum: pengunjung | admin | super_admin)
├── remember_token
└── timestamps

destinasis
├── id_destinasi    (PK)
├── nama_wisata
├── kategori        (Air Terjun | Panorama | Hutan | Gunung | Edukasi)
├── deskripsi
├── lokasi_rute
├── harga_tiket
├── kapasitas_harian
├── fasilitas       (pisahkan dengan koma)
├── rating_asli
├── status          (aktif | non-aktif)
└── timestamps

bookings
├── id_booking      (PK)
├── id_user         (FK → users)
├── id_destinasi    (FK → destinasis)
├── tanggal_kunjungan
├── jumlah_tiket
├── total_harga
├── status_booking  (menunggu | dikonfirmasi | dibatalkan)
└── timestamps

pembayarans
├── id_pembayaran   (PK)
├── id_booking      (FK → bookings)
├── metode_pembayaran
├── bukti_pembayaran
├── status_pembayaran (menunggu_verifikasi | lunas | gagal)
├── tanggal_bayar
└── timestamps

reviews
├── id_review       (PK)
├── id_user         (FK → users)
├── id_destinasi    (FK → destinasis)
├── id_booking      (FK → bookings, nullable)
├── rating          (1–5)
├── ulasan
└── timestamps

galeris
├── id_galeri       (PK)
├── id_destinasi    (FK → destinasis)
├── url_foto
├── keterangan
└── timestamps

pesans
├── id_pesan        (PK)
├── nama_lengkap
├── email
├── subjek
├── pesan
├── balasan
├── status          (belum_dibalas | sudah_dibalas)
└── timestamps

discounts
├── id_diskon       (PK)
├── kode_diskon     (unique)
├── persentase
├── status          (aktif | tidak_aktif)
├── id_destinasi    (FK → destinasis, nullable)
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
│   │   │   ├── Auth/                        # Login, Register, Password Reset
│   │   │   ├── AdminDashboardController.php # CRUD destinasi, booking, ulasan, dll
│   │   │   ├── DestinasiController.php      # Data untuk landing page publik
│   │   │   └── ...
│   │   └── Requests/Auth/LoginRequest.php
│   ├── Mail/BalasanPesanMail.php            # Template email balasan admin
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
│   ├── migrations/                          # Skema tabel
│   └── seeders/DestinasiSeeder.php
├── resources/
│   └── js/
│       └── Pages/
│           ├── index.jsx                    # Landing page utama (publik)
│           ├── UserDashboard.jsx            # Dashboard pengunjung
│           ├── Admin/
│           │   └── AdminDashboard.jsx       # Dashboard admin/super admin
│           └── Auth/
│               ├── Login.jsx
│               └── Register.jsx
├── routes/
│   ├── web.php
│   └── auth.php
├── public/
│   └── images/download.jpg                 # Foto hero Pronojiwo
└── vercel.json                             # Konfigurasi deployment Vercel
```

---

## 👥 Role Pengguna

| Role | Akses |
|------|-------|
| `pengunjung` | Melihat destinasi, memesan tiket, upload bukti bayar, menulis ulasan, kirim pesan |
| `admin` | Kelola destinasi (CRUD + kategori), verifikasi pembayaran, balas pesan, kelola ulasan |
| `super_admin` | Semua akses admin + manajemen akun pengguna, kode promo, dan log aktivitas |

> Akun dengan role `admin` atau `super_admin` secara otomatis diarahkan ke **Admin Dashboard** setelah login.

---

## ✨ Fitur Detail

### 🔐 Autentikasi
- Registrasi dengan: nama lengkap, email, nomor telepon, password
- Role otomatis `pengunjung` saat mendaftar
- Login dengan validasi pesan kontekstual (email tidak ditemukan / password salah / rate limit)
- Remember Me & Reset Password
- Proteksi route berbasis role (middleware)

### 🗺️ Landing Page
- Hero section fullscreen dengan foto lokal + parallax mouse effect + gradient overlay
- Wave divider SVG animatif yang memisahkan antar section
- Statistik animasi: total destinasi, ulasan, dan rata-rata rating (data real dari database)
- Kartu destinasi dengan filter kategori dinamis (data kategori langsung dari DB)
- Section testimoni slider otomatis
- Form kontak yang terkirim ke inbox admin

### 📊 Dashboard Admin
- Kartu metrik real-time: pendapatan bulan ini, tiket terjual, antrean verifikasi, destinasi aktif
- **CRUD Destinasi** lengkap: nama, kategori (dropdown), deskripsi, harga, kapasitas, fasilitas, rating, foto upload
- Tabel verifikasi pembayaran dengan modal detail (foto bukti, data booking, tombol Terima/Tolak)
- Manajemen ulasan pengunjung
- Inbox pesan dengan fitur balas (otomatis kirim email ke pengirim)
- **Super Admin:** manajemen akun user, kode promo, dan log aktivitas sistem

### 🧑‍💼 Dashboard Pengunjung
- Kartu ringkasan: total booking, tiket aktif, destinasi dikunjungi
- Riwayat booking lengkap dengan status real-time
- Upload bukti transfer pembayaran
- Penulisan ulasan per destinasi (hanya bisa 1x per booking)

---

## 🚀 Instalasi Lokal

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

# 2. Install dependensi PHP
composer install

# 3. Install dependensi Node.js
npm install

# 4. Salin file konfigurasi
cp .env.example .env

# 5. Generate application key
php artisan key:generate
```

### Konfigurasi Database

Edit file `.env`:

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

# 7. Jalankan kedua server secara bersamaan (dua terminal terpisah)
php artisan serve     # → http://127.0.0.1:8000
npm run dev           # → Vite HMR dev server
```

### URL Akses

| URL | Keterangan |
|-----|------------|
| `http://127.0.0.1:8000` | Landing page publik |
| `http://127.0.0.1:8000/login` | Halaman masuk |
| `http://127.0.0.1:8000/register` | Halaman daftar |
| `http://127.0.0.1:8000/dashboard` | Dashboard (butuh login) |

---

## ☁️ Deployment ke Vercel

Proyek ini sudah dikonfigurasi untuk berjalan di Vercel menggunakan runtime `vercel-php`.

### `vercel.json`

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

### Langkah Deploy

1. Push kode ke GitHub
2. Import repository di [vercel.com](https://vercel.com)
3. Set **Environment Variables** berikut di dashboard Vercel:

```
APP_NAME=Pronojiwo Nature Escape
APP_ENV=production
APP_KEY=base64:...         ← hasil php artisan key:generate
APP_DEBUG=false
APP_URL=https://your-domain.vercel.app

DB_CONNECTION=mysql
DB_HOST=your-db-host
DB_PORT=3306
DB_DATABASE=your_db
DB_USERNAME=your_user
DB_PASSWORD=your_password

MAIL_MAILER=smtp
MAIL_HOST=...
MAIL_PORT=587
MAIL_USERNAME=...
MAIL_PASSWORD=...
```

4. Klik **Deploy** — Vercel akan otomatis menjalankan build

> ⚠️ **Catatan:** Vercel bersifat *stateless*, sehingga file upload disarankan menggunakan layanan penyimpanan eksternal (seperti Cloudinary atau AWS S3) untuk produksi.

---

## 🤝 Kontribusi

1. Fork repository ini
2. Buat branch baru: `git checkout -b fitur/nama-fitur`
3. Commit perubahan: `git commit -m 'feat: tambah fitur X'`
4. Push ke branch: `git push origin fitur/nama-fitur`
5. Buat Pull Request

---

## 📄 Lisensi

Proyek ini dibuat untuk keperluan akademik dan pengembangan pariwisata lokal Kecamatan Pronojiwo, Kabupaten Lumajang, Jawa Timur.

---

## 📍 Tentang Pronojiwo

**Kecamatan Pronojiwo, Kabupaten Lumajang, Jawa Timur, Indonesia**

Pronojiwo adalah kecamatan yang terletak di kaki Gunung Semeru dengan kekayaan alam luar biasa. Kawasan ini menjadi rumah bagi Air Terjun Tumpak Sewu yang monumental, hutan pinus yang asri, dan panorama pegunungan yang memukau — menjadikannya salah satu destinasi ekowisata terbaik di Jawa Timur.

---

<div align="center">
  <p>Dibuat dengan ❤️ untuk mempromosikan keindahan alam Pronojiwo</p>
  <p><strong>© 2026 Pronojiwo Nature Escape</strong></p>
</div>
