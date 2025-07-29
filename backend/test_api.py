import requests
import json

# Test the API endpoints
base_url = "http://localhost:8000"

def test_root():
    """Test the root endpoint"""
    try:
        response = requests.get(f"{base_url}/")
        print(f"Root endpoint: {response.status_code} - {response.json()}")
        return response.status_code == 200
    except Exception as e:
        print(f"Error testing root endpoint: {e}")
        return False

def test_health():
    """Test the health endpoint"""
    try:
        response = requests.get(f"{base_url}/health")
        print(f"Health endpoint: {response.status_code} - {response.json()}")
        return response.status_code == 200
    except Exception as e:
        print(f"Error testing health endpoint: {e}")
        return False

def test_sales():
    """Test the sales endpoint"""
    try:
        sale_data = {
            "items": [
                {
                    "id": "shirt_001",
                    "quantity": 2
                }
            ]
        }
        response = requests.post(f"{base_url}/sales", json=sale_data)
        print(f"Sales endpoint: {response.status_code} - {response.json()}")
        return response.status_code == 200
    except Exception as e:
        print(f"Error testing sales endpoint: {e}")
        return False

def test_sales_validation():
    """Test sales validation (negative quantity)"""
    try:
        sale_data = {
            "items": [
                {
                    "id": "shirt_001",
                    "quantity": -1
                }
            ]
        }
        response = requests.post(f"{base_url}/sales", json=sale_data)
        print(f"Sales validation test: {response.status_code} - {response.json()}")
        # 422 is the correct status code for validation errors in FastAPI
        return response.status_code == 422
    except Exception as e:
        print(f"Error testing sales validation: {e}")
        return False

if __name__ == "__main__":
    print("Testing DealNDone API...")
    print("=" * 40)
    
    root_ok = test_root()
    health_ok = test_health()
    sales_ok = test_sales()
    validation_ok = test_sales_validation()
    
    print("\n" + "=" * 40)
    if root_ok and health_ok and sales_ok and validation_ok:
        print("✅ All tests passed! API is working correctly.")
    else:
        print("❌ Some tests failed. Check the server logs.")
    
    print(f"\nTest Results:")
    print(f"  Root endpoint: {'✅' if root_ok else '❌'}")
    print(f"  Health endpoint: {'✅' if health_ok else '❌'}")
    print(f"  Sales endpoint: {'✅' if sales_ok else '❌'}")
    print(f"  Validation: {'✅' if validation_ok else '❌'}")
    
    if validation_ok:
        print("\n💡 Note: Validation test 'passed' means the API correctly rejected invalid data!") 