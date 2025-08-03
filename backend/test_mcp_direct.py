import sys
import os
from fastapi.testclient import TestClient

# Add the current directory to Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Import the main app
from main import app

# Create a test client
client = TestClient(app)

def test_health():
    """Test the health endpoint directly"""
    print("🧪 Testing /health endpoint...")
    response = client.get("/health")
    print(f"Status: {response.status_code}")
    print(f"Response: {response.json()}")
    return response.status_code == 200

def test_mcp_health():
    """Test the MCP health endpoint directly"""
    print("\n🧪 Testing /mcp/health endpoint...")
    response = client.get("/mcp/health")
    print(f"Status: {response.status_code}")
    print(f"Response: {response.json()}")
    return response.status_code == 200

def test_mcp_test():
    """Test the MCP test endpoint directly"""
    print("\n🧪 Testing /mcp/test endpoint...")
    response = client.get("/mcp/test")
    print(f"Status: {response.status_code}")
    print(f"Response: {response.json()}")
    return response.status_code == 200

def test_mcp_settings():
    """Test the MCP settings endpoint directly"""
    print("\n🧪 Testing /mcp/resources/settings endpoint...")
    response = client.get("/mcp/resources/settings?org_id=test123", 
                         headers={"user_id": "testuser"})
    print(f"Status: {response.status_code}")
    print(f"Response: {response.json()}")
    return response.status_code == 200

def main():
    print("🎯 DealNDone MCP Direct Test")
    print("=" * 40)
    
    # Test all endpoints
    health_ok = test_health()
    mcp_health_ok = test_mcp_health()
    mcp_test_ok = test_mcp_test()
    mcp_settings_ok = test_mcp_settings()
    
    print("\n" + "=" * 40)
    print("📊 Test Results:")
    print(f"  /health: {'✅' if health_ok else '❌'}")
    print(f"  /mcp/health: {'✅' if mcp_health_ok else '❌'}")
    print(f"  /mcp/test: {'✅' if mcp_test_ok else '❌'}")
    print(f"  /mcp/resources/settings: {'✅' if mcp_settings_ok else '❌'}")
    
    if health_ok and mcp_health_ok and mcp_test_ok and mcp_settings_ok:
        print("\n🎉 All tests passed! MCP endpoints are working correctly.")
    else:
        print("\n❌ Some tests failed. Check the implementation.")

if __name__ == "__main__":
    main() 