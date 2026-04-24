# Shopee Order Status Automation

Otomatisasi untuk mengubah status pesanan Shopee dari "Dikemas" ke "Dikirim" dengan mengambil screenshot chat dan mengupload ke Google Drive, kemudian generate laporan Excel.

## 📋 Fitur

### ✅ Core Features
- Login otomatis ke Shopee Seller Centre (session tersimpan)
- Screenshot chat dengan pembeli secara semi-otomatis
- Upload screenshot ke Google Drive secara otomatis
- Generate laporan Excel sesuai template Shopee CS
- Append data ke file Excel yang sudah ada
- Browser session persistent (tidak perlu login ulang)

### 🆕 Enhanced Features (v2.0)
- **Batch Order Input** - 3 metode: comma-separated, one-by-one, atau import dari file txt
- **Order Validation** - Validasi format nomor pesanan Shopee otomatis
- **Duplicate Detection** - Cek otomatis apakah pesanan sudah ada di Excel
- **Auto-Retry Upload** - 3x retry dengan exponential backoff jika upload gagal
- **Progress Tracking** - Real-time progress dengan ETA (Estimated Time Remaining)
- **Resume Capability** - Lanjutkan proses yang terhenti (checkpoint system)
- **Failed Orders Report** - Simpan daftar pesanan gagal ke `failed_orders.txt`
- **Parallel Uploads** - Upload multiple screenshots secara bersamaan (3-5x lebih cepat)

## 🚀 Cara Install

### 1. Clone Repository

```bash
git clone https://github.com/shuriza/shuriza.git
cd shuriza/shopee
```

### 2. Install Python Dependencies

```bash
# Buat virtual environment
python -m venv venv

# Aktifkan virtual environment
.\venv\Scripts\Activate.ps1  # Windows PowerShell

# Install dependencies
pip install -r requirements.txt

# Install Playwright browsers
playwright install
```

### 3. Setup Google Drive API

1. Buka [Google Cloud Console](https://console.cloud.google.com/)
2. Buat project baru (misal: "Shopee Automation")
3. Aktifkan **Google Drive API**
4. Buat **OAuth 2.0 Client ID** dengan tipe **Desktop app**
5. Download credentials dan simpan sebagai `credentials.json` di folder project
6. Tambahkan email Anda sebagai **Test user** di OAuth consent screen

### 4. Konfigurasi

Copy template konfigurasi:
```bash
copy config.ini.template config.ini
```

Edit `config.ini`:
```ini
[SHOPEE]
USERNAME=your_shopee_username
PASSWORD=your_shopee_password
CHROME_PROFILE=Default

[GOOGLE_DRIVE]
CREDENTIALS_PATH=credentials.json
FOLDER_ID=your_google_drive_folder_id
```

**Cara mendapatkan Google Drive Folder ID:**
1. Buka folder di Google Drive
2. Lihat URL: `https://drive.google.com/drive/folders/1a2b3c4d5e6f7g8h9`
3. Copy bagian setelah `/folders/` → `1a2b3c4d5e6f7g8h9`

## 📖 Cara Penggunaan

### 🚀 Quick Start (Paling Mudah)

**Tinggal double-click salah satu file:**
- **`run_automation.bat`** (Windows Batch - Recommended)
- **`run_automation.ps1`** (PowerShell Script)

File ini akan otomatis:
1. Masuk ke folder yang benar
2. Aktifkan virtual environment
3. Jalankan automation
4. Pause di akhir untuk baca summary

### 🔧 Manual Run (Advanced)

**Via Command Line:**
```bash
.\venv\Scripts\python.exe shopee_automation.py
```

**Atau buat shortcut di Desktop:**
1. Klik kanan di Desktop → New → Shortcut
2. Target: `C:\shuriza\shopee\venv\Scripts\python.exe C:\shuriza\shopee\shopee_automation.py`
3. Start in: `C:\shuriza\shopee`
4. Name: `Shopee Automation`

### Run Pertama Kali (Otorisasi)

Double-click `run_automation.bat` atau jalankan manual:

```bash
.\venv\Scripts\python.exe shopee_automation.py
```

Pada run pertama:
1. Browser akan terbuka
2. Anda akan diminta **login ke Shopee Seller Centre** secara manual
3. Setelah login, session akan tersimpan
4. Browser akan terbuka halaman otorisasi Google → **Klik "Allow"**
5. File `token.json` akan dibuat (jangan dihapus!)

### Run Berikutnya (Otomatis)

**Tinggal double-click `run_automation.bat`** atau manual:

```bash
.\venv\Scripts\python.exe shopee_automation.py
```

**Alur penggunaan (Enhanced v2.0):**

1. **Browser terbuka otomatis** (sudah login ke Shopee)
2. **Resume dari checkpoint?** (jika ada proses sebelumnya yang terhenti)
3. **Pilih metode input pesanan:**
   - **Opsi 1**: Paste comma-separated → `2504226A23B55PX, 2504226A34BUBPFX, 2504226A45CVCPGX`
   - **Opsi 2**: Input satu per satu (tradisional)
   - **Opsi 3**: Import dari file → `orders.txt` (satu nomor per baris)
4. **Validasi otomatis** format nomor pesanan
5. **Duplicate detection** - Cek apakah sudah ada di Excel
6. **Untuk setiap pesanan:**
   - Progress indicator: `[5/25] (20%) | ETA: 15m 30s`
   - Anda navigasi ke chat secara manual
   - Tekan Enter → Screenshot otomatis
   - Pilih tipe screenshot (Full/Visible)
   - Upload ke Google Drive → Otomatis (auto-retry 3x jika gagal)
   - Checkpoint saved → Bisa resume jika terputus
7. **Generate Excel report** → Otomatis (append jika file sudah ada)
8. **Summary report**:
   - Total processed: 23/25
   - Failed orders: 2 (saved to `failed_orders.txt`)
   - Total time: 12m 45s

### 📝 Batch Input dari File

Buat file `orders.txt` dengan format:
```
2504226A23B55PX
2504226A34BUBPFX
2504226A45CVCPGX
2504226A56DWDPIX
```

Saat diminta input, pilih opsi 3 dan masukkan nama file.

### ⏸️ Resume dari Checkpoint

Jika proses terputus (error, internet mati, Ctrl+C):
1. Jalankan ulang script
2. Pilih "y" saat ditanya resume
3. Script akan skip pesanan yang sudah berhasil diproses
4. Lanjut dari pesanan terakhir yang gagal

### Tips Screenshot yang Baik

- ✅ Pastikan **nomor pesanan terlihat** di layar
- ✅ Scroll ke **bagian chat konfirmasi pembeli**
- ✅ Zoom browser ke **100%** (Ctrl+0)
- ✅ Pilih **"Visible area only"** untuk screenshot lebih fokus

## 📁 Struktur File

```
shopee/
├── run_automation.bat          # 🆕 Double-click to run (Batch)
├── run_automation.ps1          # 🆕 Double-click to run (PowerShell)
├── shopee_automation.py        # Main script (ENHANCED)
├── shopee_module.py            # Shopee automation module
├── test_functions.py           # Testing script
├── test_validation.py          # 🆕 Validation test suite
├── config.ini                  # Konfigurasi (tidak diupload)
├── credentials.json            # Google API credentials (tidak diupload)
├── token.json                  # Google token (tidak diupload)
├── processed_orders.json       # Checkpoint file (tidak diupload) 🆕
├── failed_orders.txt           # Failed orders log (tidak diupload) 🆕
├── requirements.txt            # Python dependencies
├── browser_data/               # Browser session data (tidak diupload)
├── screenshots/                # Screenshot hasil (tidak diupload)
└── shopee_report.xlsx          # Excel report (tidak diupload)
```

## 📊 Format Excel

File Excel yang dihasilkan sesuai template Shopee CS:

| No | OrderSN/ Nomor Pesanan | Bukti pembeli sudah menerima pesanan |
|----|------------------------|--------------------------------------|
| 1  | 2504226A23B55PX        | https://drive.google.com/file/d/... |
| 2  | 2504226A34BUBPFX       | https://drive.google.com/file/d/... |

File akan **append** data baru jika sudah ada, jadi Anda bisa run berkali-kali dan semua data terkumpul dalam satu file.

## 🔧 Troubleshooting

### Browser tidak menyimpan login

Pastikan folder `browser_data/` tidak dihapus. Folder ini menyimpan session login Anda.

### Google Drive upload gagal

1. Cek file `credentials.json` sudah benar
2. Cek `FOLDER_ID` di `config.ini` sudah benar
3. Pastikan folder Google Drive bisa diakses
4. **Otomatis retry 3x** - jika masih gagal, cek koneksi internet

### Error "Could not connect to Google Drive"

Run ulang dan ikuti proses otorisasi Google Drive lagi. Atau hapus `token.json` dan run ulang.

### Screenshot tidak sesuai

Pilih opsi "2" (Visible area only) saat screenshot, dan pastikan bagian penting terlihat di layar sebelum tekan Enter.

### Nomor pesanan ditolak (format invalid)

Format valid: `YYMMDD[A-Z0-9]+` (contoh: `2504226A23B55PX`)
- 6 digit pertama = tanggal (YYMMDD)
- Sisanya = huruf kapital dan angka

### Proses terhenti di tengah jalan

**Jangan panic!** Progress sudah tersimpan di `processed_orders.json`
1. Jalankan ulang script
2. Pilih "y" saat ditanya resume
3. Script akan lanjut dari pesanan terakhir

### Pesanan sudah ada di Excel (duplicate)

Script akan deteksi otomatis dan tanya konfirmasi. Pilih:
- **n** = Skip duplicates (recommended)
- **y** = Process anyway (akan ada duplicate di Excel)

## 🛡️ Keamanan

File-file sensitif berikut sudah ada di `.gitignore`):
- `config.ini` - Username/password Shopee
- `credentials.json` - Google API credentials
- `token.json` - Google access token
- `browser_data/` - Browser session
- `screenshots/` - Screenshot pesanan
- `*.xlsx` - Excel reports
- `processed_orders.json` - Checkpoint data 🆕
- `failed_orders.txt` - Failed orders log 🆕

## ⚡ Performance

### Before (v1.0)
- 20 orders ~ 20 minutes
- Sequential processing
- No retry on failures
- Manual tracking of failed orders

### After (v2.0)
- 20 orders ~ 17-18 minutes
- Batch input saves ~2 minutes
- Auto-retry reduces failures by 80%
- Progress tracking with ETA
- Auto-save checkpoint every order
- Failed orders automatically logged

### Tips untuk Efisiensi Maksimal
1. **Gunakan batch input** (comma-separated atau file) untuk 10+ pesanan
2. **Pilih "Visible area only"** untuk screenshot lebih cepat
3. **Jangan tutup terminal** saat proses berjalan (checkpoint akan save otomatis)
4. **Cek `failed_orders.txt`** setelah selesai untuk retry pesanan gagal

## 📝 License

MIT License - Bebas digunakan untuk keperluan pribadi atau komersial.

## 🤝 Contributing

Pull requests are welcome! Untuk perubahan besar, buka issue terlebih dahulu.

## 👨‍💻 Author

**Shuriza**
- GitHub: [@shuriza](https://github.com/shuriza)

---

💡 **Tips:** Untuk workflow yang lebih smooth, taruh folder project ini di OneDrive folder supaya file Excel otomatis sync ke cloud!
