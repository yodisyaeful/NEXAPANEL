# NexaPanel — Full Stack Web App
**Next.js 15 + Node.js (Express) + MySQL**

---

## Struktur Proyek

```
nexapanel/
├── backend/                # Node.js + Express REST API
│   ├── src/
│   │   ├── config/
│   │   │   └── database.js       # MySQL connection pool
│   │   ├── controllers/
│   │   │   ├── authController.js  # Login, logout, me
│   │   │   └── dashboardController.js
│   │   ├── middleware/
│   │   │   └── auth.js            # JWT middleware
│   │   ├── routes/
│   │   │   ├── auth.js
│   │   │   └── dashboard.js
│   │   └── server.js              # Entry point
│   ├── database.sql               # Schema + seed data
│   └── .env                       # Konfigurasi backend
│
└── frontend/               # Next.js 15 + TypeScript
    ├── src/
    │   ├── app/
    │   │   ├── login/page.tsx     # Halaman login
    │   │   ├── dashboard/
    │   │   │   ├── layout.tsx     # Layout + sidebar
    │   │   │   ├── page.tsx       # Dashboard utama
    │   │   │   ├── analytics/
    │   │   │   ├── users/
    │   │   │   └── ...            # Sub-halaman lainnya
    │   │   └── globals.css
    │   ├── components/
    │   │   └── Sidebar.tsx        # Sidebar collapsible
    │   └── lib/
    │       ├── api.ts             # Axios instance
    │       └── auth.ts            # Token helpers
    └── .env.local                 # Konfigurasi frontend
```

---

## Prasyarat

- **Node.js** >= 18
- **MySQL** >= 8.0

---

## Setup

### 1. Database MySQL

```bash
# Buka MySQL client
mysql -u root -p

# Import schema + seed
mysql -u root -p < backend/database.sql
```

### 2. Backend

```bash
cd backend

# Salin & edit konfigurasi
cp .env .env.local   # (opsional, langsung edit .env)
nano .env
```

Edit `.env`:
```env
PORT=4000
JWT_SECRET=ganti_dengan_string_acak_panjang
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=password_mysql_anda
DB_NAME=nexapanel_db
```

```bash
# Install dependensi
npm install

# Jalankan (development)
npm run dev

# Jalankan (production)
npm start
```

Backend berjalan di: **http://localhost:4000**

### 3. Frontend

```bash
cd frontend

# Edit konfigurasi
nano .env.local
```

`.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:4000/api
```

```bash
# Install dependensi
npm install

# Jalankan development
npm run dev

# Build production
npm run build && npm start
```

Frontend berjalan di: **http://localhost:3000**

---

## Akun Demo

| Email                   | Password  | Role    |
|-------------------------|-----------|---------|
| admin@nexapanel.com     | admin123  | Admin   |
| budi@nexapanel.com      | admin123  | Manager |

---

## API Endpoints

| Method | Endpoint                  | Auth | Deskripsi           |
|--------|---------------------------|------|---------------------|
| POST   | /api/auth/login           | ✗    | Login               |
| GET    | /api/auth/me              | ✓    | Profil user aktif   |
| POST   | /api/auth/logout          | ✓    | Logout              |
| GET    | /api/dashboard/stats      | ✓    | Statistik dashboard |
| GET    | /api/dashboard/users      | ✓    | Daftar pengguna     |
| GET    | /health                   | ✗    | Health check        |

---

## Fitur

- ✅ Halaman Login dengan validasi client & server-side
- ✅ Negative cases: email kosong, format salah, password salah, akun nonaktif, sesi expired
- ✅ JWT Authentication (8 jam)
- ✅ Dashboard dengan statistik & grafik
- ✅ Sidebar collapsible (buka/tutup) dengan tooltip saat collapsed
- ✅ Proteksi route — redirect ke login jika belum auth
- ✅ Auto redirect ke dashboard jika sudah login
- ✅ Tabel pengguna dari database MySQL
