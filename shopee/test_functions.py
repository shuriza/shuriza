"""
Test script untuk menguji fungsi upload dan Excel generation
"""
from shopee_automation import get_gdrive_service, upload_to_gdrive, create_excel_report, load_config
import os

def create_dummy_screenshot():
    """Buat file dummy untuk testing upload"""
    dummy_file = "test_screenshot.txt"
    with open(dummy_file, "w", encoding="utf-8") as f:
        f.write("Ini adalah file test untuk simulasi screenshot chat Shopee.\n")
        f.write("Dalam prakteknya, ini akan berupa file gambar (PNG/JPG).\n")
    return dummy_file

def test_upload_and_excel():
    print("="*70)
    print("TESTING UPLOAD & EXCEL GENERATION")
    print("="*70)
    
    # Load config
    config = load_config()
    folder_id = config.get('GOOGLE_DRIVE', 'FOLDER_ID')
    
    # Get Google Drive service
    gdrive_service = get_gdrive_service()
    
    if not gdrive_service:
        print("✗ Tidak bisa terhubung ke Google Drive")
        return
    
    print("\n1. Membuat file dummy untuk testing...")
    dummy_file = create_dummy_screenshot()
    print(f"✓ File dummy dibuat: {dummy_file}")
    
    print("\n2. Testing upload ke Google Drive...")
    gdrive_link = upload_to_gdrive(gdrive_service, dummy_file, folder_id)
    
    if gdrive_link:
        print(f"✓ Upload berhasil!")
        print(f"   Link: {gdrive_link}")
        
        print("\n3. Testing pembuatan Excel report...")
        # Simulasi data pesanan
        test_data = [
            {
                'order_number': '2312070001',
                'gdrive_link': gdrive_link
            },
            {
                'order_number': '2312070002',
                'gdrive_link': gdrive_link
            },
            {
                'order_number': '2312070003',
                'gdrive_link': gdrive_link
            }
        ]
        
        excel_file = create_excel_report(test_data, 'test_report.xlsx')
        print(f"✓ Excel report berhasil dibuat: {excel_file}")
        
        print("\n" + "="*70)
        print("✓ SEMUA TEST BERHASIL!")
        print("="*70)
        print("\nSilakan cek:")
        print(f"1. Google Drive folder Anda - file '{dummy_file}' sudah terupload")
        print(f"2. File 'test_report.xlsx' di folder proyek ini")
        
        # Cleanup
        if os.path.exists(dummy_file):
            os.remove(dummy_file)
            print(f"\n✓ File dummy lokal sudah dihapus: {dummy_file}")
    else:
        print("✗ Upload gagal")

if __name__ == "__main__":
    test_upload_and_excel()
