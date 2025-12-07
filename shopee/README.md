# Shopee Order Status Automation

Otomatisasi untuk mengubah status pesanan Shopee dari "Dikemas" ke "Dikirim" dengan mengambil screenshot chat dan mengupload ke Google Drive, kemudian generate laporan Excel.

## 📋 Fitur

- ✅ Login otomatis ke Shopee Seller Centre (session tersimpan)
- ✅ Screenshot chat dengan pembeli secara semi-otomatis
- ✅ Upload screenshot ke Google Drive secara otomatis
- ✅ Generate laporan Excel sesuai template Shopee CS
- ✅ Append data ke file Excel yang sudah ada
- ✅ Browser session persistent (tidak perlu login ulang)

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

### Run Pertama Kali (Otorisasi)

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

```bash
.\venv\Scripts\python.exe shopee_automation.py
```

**Alur penggunaan:**

1. **Browser terbuka otomatis** (sudah login ke Shopee)
2. **Navigasi ke halaman pesanan** → Otomatis
3. **Input nomor pesanan:**
   - Ketik/paste nomor pesanan satu per satu
   - Tekan Enter setelah setiap nomor
   - Tekan Enter kosong untuk selesai
4. **Untuk setiap pesanan:**
   - Anda navigasi ke chat secara manual
   - Tekan Enter → Screenshot otomatis
   - Pilih tipe screenshot (Full/Visible)
   - Upload ke Google Drive → Otomatis
5. **Generate Excel report** → Otomatis

### Tips Screenshot yang Baik

- ✅ Pastikan **nomor pesanan terlihat** di layar
- ✅ Scroll ke **bagian chat konfirmasi pembeli**
- ✅ Zoom browser ke **100%** (Ctrl+0)
- ✅ Pilih **"Visible area only"** untuk screenshot lebih fokus

## 📁 Struktur File

```
shopee/
├── shopee_automation.py      # Main script
├── shopee_module.py           # Shopee automation module
├── test_functions.py          # Testing script
├── config.ini                 # Konfigurasi (tidak diupload)
├── credentials.json           # Google API credentials (tidak diupload)
├── token.json                 # Google token (tidak diupload)
├── requirements.txt           # Python dependencies
├── browser_data/              # Browser session data (tidak diupload)
├── screenshots/               # Screenshot hasil (tidak diupload)
└── shopee_report.xlsx         # Excel report (tidak diupload)
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

### Error "Could not connect to Google Drive"

Run ulang dan ikuti proses otorisasi Google Drive lagi. Atau hapus `token.json` dan run ulang.

### Screenshot tidak sesuai

Pilih opsi "2" (Visible area only) saat screenshot, dan pastikan bagian penting terlihat di layar sebelum tekan Enter.

## 🛡️ Keamanan

File-file sensitif berikut **TIDAK** akan diupload ke GitHub (sudah ada di `.gitignore`):
- `config.ini` - Username/password Shopee
- `credentials.json` - Google API credentials
- `token.json` - Google access token
- `browser_data/` - Browser session
- `screenshots/` - Screenshot pesanan
- `*.xlsx` - Excel reports

## 📝 License

MIT License - Bebas digunakan untuk keperluan pribadi atau komersial.

## 🤝 Contributing

Pull requests are welcome! Untuk perubahan besar, buka issue terlebih dahulu.

## 👨‍💻 Author

**Shuriza**
- GitHub: [@shuriza](https://github.com/shuriza)

---

💡 **Tips:** Untuk workflow yang lebih smooth, taruh folder project ini di OneDrive folder supaya file Excel otomatis sync ke cloud!
