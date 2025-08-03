#!/usr/bin/env python3
"""
Test script for DealNDone POS Authentication System
"""
import requests
import json

API_BASE = "http://localhost:8001"

def test_signup():
    """Test user signup"""
    print("🧪 Testing Signup...")
    
    signup_data = {
        "business_name": "Test Business",
        "email": "test@example.com",
        "phone": "+1234567890",
        "password": "testpass123",
        "confirm_password": "testpass123",
        "plan_type": "business"
    }
    
    try:
        response = requests.post(f"{API_BASE}/auth/signup", json=signup_data)
        print(f"Status Code: {response.status_code}")
        data = response.json()
        print(f"Response: {json.dumps(data, indent=2)}")
        
        if response.status_code == 200:
            print("✅ Signup successful!")
            return data["access_token"]
        else:
            print("❌ Signup failed!")
            return None
    except Exception as e:
        print(f"❌ Signup error: {e}")
        return None

def test_login():
    """Test user login"""
    print("\n🧪 Testing Login...")
    
    login_data = {
        "email": "test@example.com",
        "password": "testpass123"
    }
    
    try:
        response = requests.post(f"{API_BASE}/auth/login", json=login_data)
        print(f"Status Code: {response.status_code}")
        data = response.json()
        
        if response.status_code == 200:
            print("✅ Login successful!")
            print(f"User Info: {json.dumps(data['user_info'], indent=2)}")
            return data["access_token"]
        else:
            print(f"❌ Login failed: {data}")
            return None
    except Exception as e:
        print(f"❌ Login error: {e}")
        return None

def test_authenticated_endpoints(token):
    """Test endpoints that require authentication"""
    print("\n🧪 Testing Authenticated Endpoints...")
    
    headers = {"Authorization": f"Bearer {token}"}
    
    # Test /auth/me
    try:
        response = requests.get(f"{API_BASE}/auth/me", headers=headers)
        print(f"GET /auth/me - Status: {response.status_code}")
        if response.status_code == 200:
            print(f"User Info: {json.dumps(response.json(), indent=2)}")
        else:
            print(f"Error: {response.json()}")
    except Exception as e:
        print(f"❌ /auth/me error: {e}")
    
    # Test /subscription
    try:
        response = requests.get(f"{API_BASE}/subscription", headers=headers)
        print(f"GET /subscription - Status: {response.status_code}")
        if response.status_code == 200:
            data = response.json()
            print(f"Current Plan: {data['current_plan']}")
            print(f"Plan Name: {data['plan_details']['name']}")
            print(f"Plan Price: ${data['plan_details']['price']}/month")
        else:
            print(f"Error: {response.json()}")
    except Exception as e:
        print(f"❌ /subscription error: {e}")
    
    # Test /products
    try:
        response = requests.get(f"{API_BASE}/products", headers=headers)
        print(f"GET /products - Status: {response.status_code}")
        if response.status_code == 200:
            data = response.json()
            print(f"Products: {len(data['products'])} items")
            for product in data['products'][:3]:  # Show first 3
                print(f"  - {product['name']}: ${product['price']} (Stock: {product['stock']})")
        else:
            print(f"Error: {response.json()}")
    except Exception as e:
        print(f"❌ /products error: {e}")

def test_plans():
    """Test plans endpoint (public)"""
    print("\n🧪 Testing Plans Endpoint...")
    
    try:
        response = requests.get(f"{API_BASE}/plans")
        print(f"GET /plans - Status: {response.status_code}")
        if response.status_code == 200:
            data = response.json()
            print("Available Plans:")
            for plan_key, plan_data in data.items():
                print(f"  {plan_key.upper()}: {plan_data['name']} - ${plan_data['price']}/month")
                print(f"    Features: {', '.join(plan_data['features'][:3])}...")
        else:
            print(f"Error: {response.json()}")
    except Exception as e:
        print(f"❌ /plans error: {e}")

def test_upgrade_plan(token):
    """Test plan upgrade"""
    print("\n🧪 Testing Plan Upgrade...")
    
    headers = {"Authorization": f"Bearer {token}"}
    
    try:
        response = requests.put(f"{API_BASE}/subscription/upgrade", 
                              headers=headers, 
                              json="enterprise")
        print(f"PUT /subscription/upgrade - Status: {response.status_code}")
        if response.status_code == 200:
            data = response.json()
            print(f"✅ {data['message']}")
            print(f"New Plan: {data['new_plan']}")
        else:
            print(f"Error: {response.json()}")
    except Exception as e:
        print(f"❌ Upgrade error: {e}")

def test_sale(token):
    """Test making a sale"""
    print("\n🧪 Testing Sale...")
    
    headers = {"Authorization": f"Bearer {token}"}
    sale_data = {
        "items": [
            {"id": "shirt_001", "quantity": 2}
        ]
    }
    
    try:
        response = requests.post(f"{API_BASE}/sales", 
                               headers=headers, 
                               json=sale_data)
        print(f"POST /sales - Status: {response.status_code}")
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Sale successful!")
            print(f"Total: ${data['total']}")
            print(f"Items: {data['items_processed']}")
            print(f"Message: {data['message']}")
        else:
            print(f"Error: {response.json()}")
    except Exception as e:
        print(f"❌ Sale error: {e}")

if __name__ == "__main__":
    print("🏪 DealNDone POS Authentication System Tests\n")
    
    # Test public endpoints
    test_plans()
    
    # Test signup (this will create a new user or fail if exists)
    token = test_signup()
    if not token:
        # If signup fails (user exists), try login
        token = test_login()
    
    if token:
        print(f"\n🔑 Auth Token: {token[:50]}...")
        
        # Test authenticated endpoints
        test_authenticated_endpoints(token)
        
        # Test plan upgrade
        test_upgrade_plan(token)
        
        # Test sale
        test_sale(token)
        
        print("\n🎉 All tests completed!")
    else:
        print("\n❌ Authentication failed. Cannot test protected endpoints.")
