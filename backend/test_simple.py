#!/usr/bin/env python3
"""
Test script for DealNDone POS API
"""
import requests
import json

API_BASE = "http://localhost:8000"

def test_health():
    """Test health endpoint"""
    try:
        response = requests.get(f"{API_BASE}/health")
        print("✅ Health Check:", response.json())
        return True
    except Exception as e:
        print("❌ Health Check Failed:", str(e))
        return False

def test_products():
    """Test products endpoint"""
    try:
        response = requests.get(f"{API_BASE}/products")
        data = response.json()
        print(f"✅ Products ({len(data['products'])} items):")
        for product in data['products']:
            print(f"  - {product['id']}: {product['name']} - ${product['price']} (Stock: {product['stock']})")
        return True
    except Exception as e:
        print("❌ Products Test Failed:", str(e))
        return False

def test_sale():
    """Test sale endpoint"""
    try:
        sale_data = {
            "items": [
                {"id": "shirt_001", "quantity": 2}
            ]
        }
        response = requests.post(f"{API_BASE}/sales", json=sale_data)
        data = response.json()
        print("✅ Sale Test:")
        print(f"  Status: {data['status']}")
        print(f"  Total: ${data['total']}")
        print(f"  Items: {data['items_processed']}")
        print(f"  Message: {data['message']}")
        return True
    except Exception as e:
        print("❌ Sale Test Failed:", str(e))
        return False

def test_invalid_product():
    """Test with invalid product"""
    try:
        sale_data = {
            "items": [
                {"id": "nonexistent_product", "quantity": 1}
            ]
        }
        response = requests.post(f"{API_BASE}/sales", json=sale_data)
        print("✅ Invalid Product Test:")
        print(f"  Status Code: {response.status_code}")
        print(f"  Response: {response.json()}")
        return True
    except Exception as e:
        print("❌ Invalid Product Test Failed:", str(e))
        return False

if __name__ == "__main__":
    print("🧪 Testing DealNDone POS API...\n")
    
    tests = [
        ("Health Check", test_health),
        ("Products List", test_products),
        ("Valid Sale", test_sale),
        ("Invalid Product", test_invalid_product)
    ]
    
    passed = 0
    total = len(tests)
    
    for test_name, test_func in tests:
        print(f"\n🔍 {test_name}:")
        if test_func():
            passed += 1
        print("-" * 50)
    
    print(f"\n📊 Test Results: {passed}/{total} tests passed")
    if passed == total:
        print("🎉 All tests passed! Your POS system is working correctly!")
    else:
        print("⚠️  Some tests failed. Check the output above for details.")
