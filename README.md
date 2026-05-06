# BKK App (Bursa Kerja Khusus)

Aplikasi Bursa Kerja Khusus (BKK) adalah platform berbasis web yang dirancang untuk memfasilitasi informasi lowongan pekerjaan, manajemen perusahaan, dan kebutuhan operasional BKK lainnya. Proyek ini dibangun menggunakan **Laravel**, **Inertia.js**, dan **React**, dengan desain antarmuka responsif menggunakan **Tailwind CSS**.

## Persyaratan Sistem

Sebelum menginstal dan menjalankan proyek ini, pastikan komputer Anda telah memenuhi persyaratan berikut:
- **PHP** versi **8.2**
- **Composer** (untuk manajemen package PHP)
- **Node.js** dan **npm** (untuk manajemen package JavaScript)
- **Database Server** (contoh: MySQL melalui XAMPP/Laragon, MariaDB, atau SQLite)

## Langkah-langkah Instalasi

Ikuti panduan langkah demi langkah di bawah ini untuk menjalankan proyek di komputer lokal Anda:

### 1. Clone Repositori Proyek
Buka terminal (Command Prompt / PowerShell / Git Bash) di komputer Anda, lalu jalankan perintah berikut untuk mengunduh proyek (ganti `<url-repository>` dengan URL git proyek ini):
```bash
git clone https://github.com/my-crimson/bkk-app.git
cd bkk-app
```

### 2. Instal Dependensi PHP (Composer)
Jalankan perintah berikut untuk mengunduh semua library PHP yang dibutuhkan aplikasi:
```bash
composer install
```

### 3. Instal Dependensi JavaScript (NPM)
Selanjutnya, jalankan perintah ini untuk mengunduh library antarmuka pengguna (React, Tailwind, dll):
```bash
npm install
```

### 4. Konfigurasi Environment (File .env)
Aplikasi membutuhkan file konfigurasi lingkungan (environment).
1. Copy (salin) file `.env.example` dan ubah namanya menjadi `.env`.
   - *Di terminal, Anda bisa mengetik:* `cp .env.example .env` (atau `copy .env.example .env` di Windows).
2. Buka file `.env` di text editor (seperti VS Code atau Notepad).
3. Cari bagian pengaturan database, dan sesuaikan dengan database Anda:
   ```env
   DB_CONNECTION=mysql
   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_DATABASE=nama_database_bkk  # Ganti dengan nama database kosong yang sudah Anda buat
   DB_USERNAME=root               # Biasanya root (bawaan XAMPP)
   DB_PASSWORD=                   # Kosongkan jika tidak ada password
   ```
*(Pastikan Anda sudah membuat database kosong tersebut di phpMyAdmin).*

### 5. Generate Application Key
Jalankan perintah ini untuk membuat kunci keamanan unik untuk aplikasi Anda:
```bash
php artisan key:generate
```

### 6. Jalankan Migrasi Database
Untuk membuat struktur tabel di database Anda, jalankan perintah:
```bash
php artisan migrate
```
*(Jika ada file seeder untuk data awal, Anda bisa menjalankan: `php artisan migrate --seed`)*

### 7. Jalankan Server Lokal
Aplikasi ini membutuhkan dua server yang berjalan bersamaan (server backend Laravel dan server frontend Vite).
Buka **dua jendela terminal yang berbeda** (keduanya harus berada di dalam folder proyek `bkk-app`):

**Di Terminal Pertama (Jalankan server PHP):**
```bash
php artisan serve
```

**Di Terminal Kedua (Jalankan server Vite untuk React/CSS):**
```bash
npm run dev
```

### 8. Buka Aplikasi di Browser
Buka browser (Google Chrome, Firefox, dll.) dan ketikkan alamat berikut:
```
http://localhost:8000
```

Selamat! Aplikasi BKK App sekarang sudah berjalan di komputer Anda.
