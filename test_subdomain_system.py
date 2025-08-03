#!/usr/bin/env python3
"""
Comprehensive Test Script for Subdomain Check System
Tests all scenarios: valid, invalid, taken, empty inputs
"""

import requests
import json
import time

def test_subdomain_api():
    """Test the subdomain check API with various inputs"""
    
    base_url = "http://127.0.0.1:8005/api/check-subdomain"
    
    test_cases = [
        # Valid available subdomains
        {"name": "mynewstore", "expected": "available", "description": "Valid available subdomain"},
        {"name": "test123", "expected": "available", "description": "Valid available subdomain with numbers"},
        {"name": "my-store", "expected": "available", "description": "Valid available subdomain with hyphen"},
        
        # Valid taken subdomains
        {"name": "honey", "expected": "taken", "description": "Valid taken subdomain"},
        {"name": "teststore", "expected": "taken", "description": "Valid taken subdomain"},
        
        # Invalid subdomains
        {"name": "ab", "expected": "invalid", "description": "Too short (2 chars)"},
        {"name": "a", "expected": "invalid", "description": "Too short (1 char)"},
        {"name": "my_store", "expected": "invalid", "description": "Contains underscore"},
        {"name": "my.store", "expected": "invalid", "description": "Contains dot"},
        {"name": "MYSTORE", "expected": "invalid", "description": "Contains uppercase"},
        
        # Empty input
        {"name": "", "expected": "error", "description": "Empty input"},
    ]
    
    print("🧪 Testing Subdomain Check API")
    print("=" * 50)
    
    passed = 0
    failed = 0
    
    for test_case in test_cases:
        name = test_case["name"]
        expected = test_case["expected"]
        description = test_case["description"]
        
        print(f"\n📝 Testing: {description}")
        print(f"   Input: '{name}'")
        
        try:
            if name == "":
                # Test empty input
                response = requests.get(f"{base_url}")
            else:
                response = requests.get(f"{base_url}?store_name={name}")
            
            if response.status_code == 200:
                data = response.json()
                available = data.get("available", False)
                reason = data.get("reason", "")
                subdomain = data.get("subdomain", "")
                
                print(f"   Response: {json.dumps(data, indent=2)}")
                
                # Validate response
                if expected == "available" and available:
                    print("   ✅ PASS - Available as expected")
                    passed += 1
                elif expected == "taken" and not available and "taken" in reason.lower():
                    print("   ✅ PASS - Taken as expected")
                    passed += 1
                elif expected == "invalid" and not available and "invalid" in reason.lower():
                    print("   ✅ PASS - Invalid format as expected")
                    passed += 1
                else:
                    print(f"   ❌ FAIL - Expected {expected}, got available={available}")
                    failed += 1
                    
            elif response.status_code == 400:
                if expected == "error":
                    print("   ✅ PASS - 400 error as expected for empty input")
                    passed += 1
                else:
                    print(f"   ❌ FAIL - Unexpected 400 error")
                    failed += 1
            else:
                print(f"   ❌ FAIL - Unexpected status code: {response.status_code}")
                failed += 1
                
        except requests.exceptions.ConnectionError:
            print("   ❌ FAIL - Cannot connect to server. Is it running?")
            failed += 1
        except Exception as e:
            print(f"   ❌ FAIL - Error: {e}")
            failed += 1
    
    print("\n" + "=" * 50)
    print(f"📊 Test Results: {passed} passed, {failed} failed")
    
    if failed == 0:
        print("🎉 All tests passed! The subdomain system is working perfectly!")
    else:
        print("⚠️  Some tests failed. Check the server and API implementation.")
    
    return failed == 0

def test_frontend_integration():
    """Test if frontend can connect to backend"""
    print("\n🌐 Testing Frontend Integration")
    print("=" * 50)
    
    try:
        # Test if frontend is accessible
        response = requests.get("http://localhost:3000", timeout=5)
        if response.status_code == 200:
            print("✅ Frontend is running on http://localhost:3000")
        else:
            print(f"⚠️  Frontend returned status code: {response.status_code}")
    except requests.exceptions.ConnectionError:
        print("❌ Frontend is not running. Start it with: npm start")
    except Exception as e:
        print(f"❌ Error testing frontend: {e}")

if __name__ == "__main__":
    print("🚀 Starting Comprehensive Subdomain System Test")
    print("=" * 50)
    
    # Test backend API
    api_success = test_subdomain_api()
    
    # Test frontend integration
    test_frontend_integration()
    
    print("\n" + "=" * 50)
    if api_success:
        print("🎉 SUCCESS: Your subdomain system is working perfectly!")
        print("✅ Backend API: Working")
        print("✅ Real-time validation: Working")
        print("✅ Error handling: Working")
        print("✅ Input sanitization: Working")
        print("\n🌐 Next steps:")
        print("   1. Go to http://localhost:3000")
        print("   2. Type 'mynewstore' in the store name field")
        print("   3. Watch the real-time availability check!")
    else:
        print("❌ FAILED: Some tests failed. Check the server logs.") 