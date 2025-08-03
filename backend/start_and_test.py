import subprocess
import time
import requests
import sys
import os

def start_server():
    """Start the server in background"""
    print("🚀 Starting server...")
    try:
        # Start server in background
        process = subprocess.Popen([sys.executable, "main.py"], 
                                 stdout=subprocess.PIPE, 
                                 stderr=subprocess.PIPE)
        return process
    except Exception as e:
        print(f"❌ Error starting server: {e}")
        return None

def test_endpoints():
    """Test the MCP endpoints"""
    base_url = "http://127.0.0.1:8005"
    
    print("\n🧪 Testing endpoints...")
    
    # Test basic health
    try:
        response = requests.get(f"{base_url}/health", timeout=5)
        print(f"✅ /health: {response.status_code} - {response.json()}")
    except Exception as e:
        print(f"❌ /health failed: {e}")
        return False
    
    # Test MCP health
    try:
        response = requests.get(f"{base_url}/mcp/health", timeout=5)
        print(f"✅ /mcp/health: {response.status_code} - {response.json()}")
    except Exception as e:
        print(f"❌ /mcp/health failed: {e}")
    
    # Test MCP test
    try:
        response = requests.get(f"{base_url}/mcp/test", timeout=5)
        print(f"✅ /mcp/test: {response.status_code} - {response.json()}")
    except Exception as e:
        print(f"❌ /mcp/test failed: {e}")
    
    # Test MCP settings
    try:
        response = requests.get(f"{base_url}/mcp/resources/settings?org_id=test123", 
                              headers={"user_id": "testuser"}, timeout=5)
        print(f"✅ /mcp/resources/settings: {response.status_code} - {response.json()}")
    except Exception as e:
        print(f"❌ /mcp/resources/settings failed: {e}")
    
    return True

def main():
    print("🎯 DealNDone MCP Test")
    print("=" * 40)
    
    # Start server
    process = start_server()
    if not process:
        return
    
    # Wait for server to start
    print("⏳ Waiting for server to start...")
    time.sleep(5)
    
    # Test endpoints
    test_endpoints()
    
    # Stop server
    print("\n🛑 Stopping server...")
    process.terminate()
    process.wait()
    
    print("\n✅ Test complete!")

if __name__ == "__main__":
    main() 