"""
Shopee Seller Centre Automation Module
Handles login, order extraction, and chat screenshot capture
"""
from playwright.sync_api import sync_playwright, TimeoutError as PlaywrightTimeout
import time
import os
from datetime import datetime

class ShopeeAutomation:
    def __init__(self, username, password, headless=False, chrome_profile="Default"):
        """
        Initialize Shopee automation
        
        Args:
            username: Shopee seller username/email/phone
            password: Shopee seller password
            headless: Run browser in headless mode (True/False)
            chrome_profile: Chrome profile name (e.g., "Default", "Profile 1", "Profile 2")
        """
        self.username = username
        self.password = password
        self.headless = headless
        self.chrome_profile = chrome_profile
        self.browser = None
        self.context = None
        self.page = None
        self.playwright = None
        
    def start_browser(self):
        """Start the browser and create a new page"""
        print("Starting browser...")
        self.playwright = sync_playwright().start()
        
        # Use persistent context to save login state
        user_data_dir = os.path.join(os.getcwd(), 'browser_data')
        os.makedirs(user_data_dir, exist_ok=True)
        
        print(f"Using persistent browser session...")
        print(f"Browser data: {user_data_dir}")
        
        try:
            self.browser = self.playwright.chromium.launch_persistent_context(
                user_data_dir=user_data_dir,
                headless=False,
                args=[
                    '--start-maximized',
                    '--disable-blink-features=AutomationControlled'
                ],
                viewport={'width': 1920, 'height': 1080},
                user_agent='Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            )
            self.page = self.browser.pages[0] if self.browser.pages else self.browser.new_page()
            print("✓ Browser started with saved session")
            print("✓ Login state akan disimpan untuk run berikutnya")
        except Exception as e:
            print(f"✗ Error starting browser: {e}")
            raise
        
        print("✓ Browser ready")
        
    def login(self):
        """Login to Shopee Seller Centre"""
        print("\n" + "="*70)
        print("LOGGING IN TO SHOPEE SELLER CENTRE")
        print("="*70)
        
        try:
            # Navigate to Shopee Seller Centre login page for Indonesia
            print("Navigating to Shopee Seller Centre...")
            self.page.goto('https://accounts.shopee.co.id/seller/login?next=https%3A%2F%2Fseller.shopee.co.id%2F', timeout=60000)
            time.sleep(3)
            
            # Check if traffic verification appears
            if 'verify/traffic' in self.page.url:
                print("\n⚠ VERIFIKASI TRAFFIC DIPERLUKAN")
                print("="*70)
                print("Shopee meminta verifikasi traffic.")
                print("Silakan selesaikan verifikasi di browser (puzzle/CAPTCHA).")
                print("="*70)
                input("\nTekan Enter setelah verifikasi selesai...")
                time.sleep(2)
            
            # Check if already logged in
            current_url = self.page.url
            if 'portal' in current_url or 'seller.shopee.co.id' in current_url and 'login' not in current_url:
                print("✓ Already logged in!")
                return True
            
            print("\n⚠ MANUAL LOGIN REQUIRED")
            print("="*70)
            print("Silakan login secara manual di browser yang terbuka.")
            print("Jika ada CAPTCHA atau verifikasi, selesaikan terlebih dahulu.")
            print("Setelah berhasil login dan masuk ke dashboard,")
            print("tekan Enter di sini untuk melanjutkan.")
            print("="*70)
            input("\nTekan Enter setelah Anda berhasil login...")
            
            # Wait a bit for page to stabilize
            time.sleep(2)
            
            # Check again for traffic verification after login
            if 'verify/traffic' in self.page.url:
                print("\n⚠ Verifikasi traffic muncul lagi setelah login.")
                print("Silakan selesaikan verifikasi di browser.")
                input("Tekan Enter setelah verifikasi selesai...")
                time.sleep(2)
            
            # Verify login successful
            current_url = self.page.url
            if 'seller.shopee.co.id' in current_url and '404' not in current_url and 'error' not in current_url:
                print("✓ Login verified!")
                return True
            else:
                print(f"⚠ Current URL: {current_url}")
                print("Login mungkin belum selesai. Pastikan Anda sudah di dashboard.")
                retry = input("Sudah login? (y/n): ").strip().lower()
                return retry == 'y'
                
        except Exception as e:
            print(f"✗ Login error: {e}")
            print("\n⚠ Silakan login secara manual di browser.")
            input("Tekan Enter setelah login berhasil...")
            return True
    
    def get_orders_to_ship(self):
        """
        Get list of orders with status 'Perlu Dikirim' (Ready to Ship)
        
        Returns:
            list: List of order numbers
        """
        print("\n" + "="*70)
        print("GETTING ORDERS WITH STATUS 'PERLU DIKIRIM'")
        print("="*70)
        
        try:
            # Navigate to orders page with correct URL
            url = 'https://seller.shopee.co.id/portal/sale/order?type=toship&source=processed&sort_by=confirmed_date_asc'
            print(f"Navigating to orders page...")
            self.page.goto(url, timeout=30000, wait_until='domcontentloaded')
            time.sleep(5)
            
            print(f"✓ Berhasil akses halaman pesanan")
            print(f"Current URL: {self.page.url}")
            
            # Ask user to manually provide order numbers since structure may vary
            print("\n" + "="*70)
            print("INPUT NOMOR PESANAN")
            print("="*70)
            print("\nSilakan salin nomor pesanan dari halaman Shopee")
            print("dan paste di sini (satu nomor per baris).")
            print("Tekan Enter dua kali (kosong) jika sudah selesai.\n")
            
            order_numbers = []
            while True:
                order = input("Nomor pesanan: ").strip()
                if not order:
                    break
                order_numbers.append(order)
                print(f"  ✓ Ditambahkan: {order}")
            
            if order_numbers:
                print(f"\n✓ Total {len(order_numbers)} pesanan akan diproses")
            else:
                print("\n⚠ Tidak ada nomor pesanan yang diinput")
            
            return order_numbers
            
        except Exception as e:
            print(f"✗ Error: {e}")
            print("\nSilakan input nomor pesanan secara manual:")
            order_numbers = []
            while True:
                order = input("Nomor pesanan (Enter kosong untuk selesai): ").strip()
                if not order:
                    break
                order_numbers.append(order)
            return order_numbers
    
    def take_chat_screenshot(self, order_number, output_folder='screenshots'):
        """
        Navigate to order chat and take screenshot
        
        Args:
            order_number: Order number to screenshot
            output_folder: Folder to save screenshots
            
        Returns:
            str: Path to screenshot file, or None if failed
        """
        try:
            # Create output folder if not exists
            os.makedirs(output_folder, exist_ok=True)
            
            print(f"\nProcessing order: {order_number}")
            
            # Ask user to navigate to the chat
            print(f"\n" + "="*50)
            print(f"MANUAL NAVIGATION REQUIRED")
            print("="*50)
            print(f"\nDi browser yang terbuka:")
            print(f"1. Cari pesanan dengan nomor: {order_number}")
            print(f"2. Buka detail pesanan tersebut")
            print(f"3. Klik tab/tombol 'Chat' (biasanya di pojok kanan)")
            print(f"4. Pastikan chat dengan pembeli terlihat di layar")
            print(f"5. Scroll ke bagian chat yang menunjukkan konfirmasi pembeli")
            print(f"6. Tekan Enter di sini untuk mengambil screenshot")
            print("="*50)
            print("\nTips: Screenshot akan mengambil seluruh halaman yang terlihat")
            print("Pastikan informasi penting (nomor pesanan + chat) terlihat!")
            
            input("\nTekan Enter setelah chat terbuka dan siap di-screenshot...")
            
            # Take screenshot
            timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
            screenshot_filename = f"{order_number}_{timestamp}.png"
            screenshot_path = os.path.join(output_folder, screenshot_filename)
            
            # Give user option for screenshot type
            print("\nPilih tipe screenshot:")
            print("1. Full page (seluruh halaman)")
            print("2. Visible area only (hanya area yang terlihat - RECOMMENDED)")
            choice = input("Pilih (1/2) [default: 2]: ").strip() or "2"
            
            print(f"  → Taking screenshot...")
            if choice == "1":
                self.page.screenshot(path=screenshot_path, full_page=True)
                print(f"  ✓ Full page screenshot saved")
            else:
                self.page.screenshot(path=screenshot_path, full_page=False)
                print(f"  ✓ Visible area screenshot saved")
            
            print(f"  ✓ Screenshot saved: {screenshot_filename}")
            
            return screenshot_path
            
        except Exception as e:
            print(f"  ✗ Error taking screenshot for {order_number}: {e}")
            return None
    
    def close_browser(self):
        """Close the browser"""
        if self.browser:
            self.browser.close()
        if self.playwright:
            self.playwright.stop()
        print("\n✓ Browser closed")
