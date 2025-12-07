"""
Check if Chrome debugging port is accessible
"""
import requests
import json

def check_debugging_port():
    """Check if Chrome is listening on debugging port"""
    print("Checking Chrome debugging port...")
    print("="*70)
    
    urls = [
        "http://127.0.0.1:9222/json/version",
        "http://localhost:9222/json/version"
    ]
    
    for url in urls:
        try:
            print(f"\nTrying: {url}")
            response = requests.get(url, timeout=2)
            if response.status_code == 200:
                data = response.json()
                print(f"✓ SUCCESS! Chrome is running with debugging")
                print(f"  Browser: {data.get('Browser', 'Unknown')}")
                print(f"  WebSocket: {data.get('webSocketDebuggerUrl', 'N/A')}")
                return True
        except requests.exceptions.ConnectionError:
            print(f"  ✗ Connection refused - Chrome not listening here")
        except Exception as e:
            print(f"  ✗ Error: {e}")
    
    print("\n" + "="*70)
    print("✗ Chrome debugging port is NOT accessible!")
    print("\nPossible issues:")
    print("1. Chrome was not started with --remote-debugging-port=9222")
    print("2. Firewall is blocking port 9222")
    print("3. Chrome failed to start properly")
    print("\nSolution:")
    print("1. Close ALL Chrome windows completely")
    print("2. Run: python start_chrome.py")
    print("3. Wait 5 seconds")
    print("4. Run this check again: python check_chrome.py")
    return False

if __name__ == "__main__":
    check_debugging_port()
