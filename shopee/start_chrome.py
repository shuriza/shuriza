"""
Helper script to start Chrome with remote debugging enabled
Run this first before running shopee_automation.py
"""
import subprocess
import os
import time
import sys

def check_chrome_running():
    """Check if Chrome is already running"""
    import psutil
    for proc in psutil.process_iter(['name']):
        if 'chrome.exe' in proc.info['name'].lower():
            return True
    return False

def start_chrome_with_debugging():
    """Start Chrome with remote debugging port"""
    
    chrome_paths = [
        r"C:\Program Files\Google\Chrome\Application\chrome.exe",
        r"C:\Program Files (x86)\Google\Chrome\Application\chrome.exe",
        os.path.expanduser(r"~\AppData\Local\Google\Chrome\Application\chrome.exe")
    ]
    
    chrome_path = None
    for path in chrome_paths:
        if os.path.exists(path):
            chrome_path = path
            break
    
    if not chrome_path:
        print("✗ Chrome not found!")
        return
    
    print("="*70)
    print("STARTING CHROME WITH REMOTE DEBUGGING")
    print("="*70)
    
    # Check if Chrome is already running
    try:
        import psutil
        if check_chrome_running():
            print("\n⚠ WARNING: Chrome is already running!")
            print("Please close ALL Chrome windows first, then run this script again.")
            input("\nPress Enter after closing all Chrome windows...")
            if check_chrome_running():
                print("✗ Chrome is still running. Please close it completely.")
                return
    except ImportError:
        print("\n⚠ Cannot check if Chrome is running (psutil not installed)")
        print("Please make sure ALL Chrome windows are closed before continuing.")
        input("Press Enter to continue...")
    
    print("\nStarting Chrome with debugging enabled...")
    print("Remote debugging port: 9222")
    print("\nIMPORTANT: Keep this Chrome window open!")
    print("="*70)
    
    # Start Chrome with remote debugging
    user_data = os.path.expanduser(r"~\AppData\Local\Google\Chrome\User Data")
    
    cmd = [
        chrome_path,
        f'--remote-debugging-port=9222',
        f'--user-data-dir={user_data}',
        '--remote-allow-origins=*'
    ]
    
    try:
        process = subprocess.Popen(cmd, shell=False)
        time.sleep(3)  # Wait for Chrome to start
        
        print("\n✓ Chrome started!")
        print(f"✓ Process ID: {process.pid}")
        print(f"✓ Debugging port: 9222")
        print("\nYou can now run in another terminal:")
        print("  python shopee_automation.py")
        print("\n⚠ Don't close this Chrome window until automation is done!")
        
        # Keep script running
        print("\nPress Ctrl+C to stop (this will close Chrome)")
        try:
            process.wait()
        except KeyboardInterrupt:
            print("\n\nStopping Chrome...")
            process.terminate()
            
    except Exception as e:
        print(f"✗ Error: {e}")

if __name__ == "__main__":
    start_chrome_with_debugging()
