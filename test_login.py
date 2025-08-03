#!/usr/bin/env python3
"""
Simple login test script for Deal n Done POS System
"""

import requests
import json

def test_login():
    """Test login with existing test accounts"""
    
    # Test accounts from create_test_accounts.py
    test_accounts = [
        {
            "storeName": "honey",
            "email": "honey@dealndone.com",
            "password": "Honey123!"
        },
        {
            "storeName": "teststore",
            "email": "test@dealndone.com", 
            "password": "Test123!"
        },
        {
            "storeName": "prostore",
            "email": "pro@dealndone.com",
            "password": "Pro123!"
        },
        {
            "storeName": "enterprise",
            "email": "enterprise@dealndone.com",
            "password": "Enterprise123!"
        },
        {
            "storeName": "dealndone",
            "email": "ceo@dealndone.com",
            "password": "CEO2025!"
        }
    ]
    
    print("🔐 Testing Login Functionality")
    print("=" * 50)
    
    for i, account in enumerate(test_accounts, 1):
        print(f"\n{i}. Testing login for {account['storeName']}...")
        
        try:
            response = requests.post(
                'http://127.0.0.1:8000/api/auth/login',
                headers={'Content-Type': 'application/json'},
                json=account,
                timeout=5
            )
            
            if response.status_code == 200:
                data = response.json()
                print(f"   ✅ SUCCESS: {account['storeName']}")
                if 'user' in data:
                    print(f"   📧 Email: {data['user']['email']}")
                    print(f"   🏪 Store: {data['user']['storeName']}")
                    print(f"   👤 Role: {data['user']['role']}")
                    print(f"   📋 Plan: {data['user']['planType']}")
                else:
                    print(f"   📧 Response: {data}")
            else:
                print(f"   ❌ FAILED: {account['storeName']}")
                print(f"   📝 Error: {response.text}")
                
        except requests.exceptions.ConnectionError:
            print(f"   ❌ CONNECTION ERROR: Backend server not running")
            print(f"   💡 Start the backend with: cd backend && python main.py")
            break
        except Exception as e:
            print(f"   ❌ ERROR: {str(e)}")
    
    print("\n" + "=" * 50)
    print("🎯 Login Test Complete!")
    print("\n💡 To use these accounts in the frontend:")
    print("   1. Go to http://localhost:3000")
    print("   2. Click 'Login'")
    print("   3. Use any of the test accounts above")

if __name__ == "__main__":
    test_login() 