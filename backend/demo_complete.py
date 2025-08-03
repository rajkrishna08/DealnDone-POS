#!/usr/bin/env python3
"""
Complete Demo Script for DealNDone POS Authentication System
This script demonstrates the complete workflow:
1. Signup with plan selection
2. Login and authentication
3. View subscription details
4. Upgrade plan
5. Make sales with plan limits
"""
import requests
import json
import time

API_BASE = "http://localhost:8002"

def demo_complete_workflow():
    print("🏪 DealNDone POS - Complete Authentication Demo")
    print("=" * 60)
    
    # Step 1: Test different plan signups
    test_users = [
        {
            "business_name": "Basic Store",
            "email": "basic@demo.com", 
            "password": "demo123",
            "plan_type": "basic",
            "subdomain": "basic-store"
        },
        {
            "business_name": "Professional Business",
            "email": "professional@demo.com",
            "password": "demo123", 
            "plan_type": "professional",
            "subdomain": "professional-biz"
        },
        {
            "business_name": "Enterprise Corp",
            "email": "enterprise@demo.com",
            "password": "demo123",
            "plan_type": "enterprise",
            "subdomain": "enterprise-corp"
        },
        {
            "business_name": "Custom Solutions",
            "email": "custom@demo.com",
            "password": "demo123",
            "plan_type": "custom",
            "subdomain": "custom-solutions"
        }
    ]
    
    tokens = {}
    
    print("\n🔐 STEP 1: Creating test accounts for each plan...")
    for user in test_users:
        print(f"\n📝 Signing up: {user['business_name']} ({user['plan_type'].upper()} plan)")
        
        signup_data = {
            **user,
            "confirm_password": user["password"]
        }
        
        try:
            response = requests.post(f"{API_BASE}/auth/signup", json=signup_data)
            
            if response.status_code == 200:
                data = response.json()
                tokens[user['plan_type']] = {
                    'token': data['access_token'],
                    'user_info': data['user_info']
                }
                print(f"✅ {user['business_name']} signed up successfully!")
                print(f"   Plan: {data['user_info']['plan_type'].upper()}")
            else:
                # User might already exist, try login
                login_response = requests.post(f"{API_BASE}/auth/login", json={
                    "email": user["email"],
                    "password": user["password"]
                })
                if login_response.status_code == 200:
                    data = login_response.json()
                    tokens[user['plan_type']] = {
                        'token': data['access_token'],
                        'user_info': data['user_info']
                    }
                    print(f"✅ {user['business_name']} logged in successfully!")
                else:
                    print(f"❌ Failed to create/login {user['business_name']}")
        except Exception as e:
            print(f"❌ Error with {user['business_name']}: {e}")
    
    # Step 2: Show plan details for each user
    print("\n📊 STEP 2: Viewing subscription details...")
    for plan_type, auth_data in tokens.items():
        print(f"\n👤 {auth_data['user_info']['business_name']}:")
        
        headers = {"Authorization": f"Bearer {auth_data['token']}"}
        
        try:
            response = requests.get(f"{API_BASE}/subscription", headers=headers)
            if response.status_code == 200:
                sub_data = response.json()
                plan_details = sub_data['plan_details']
                
                print(f"   📋 Plan: {plan_details['name']}")
                print(f"   💰 Price: ${plan_details['price']}/month")
                print(f"   🎯 Features: {', '.join(plan_details['features'][:3])}...")
                
                # Show limits
                limits = plan_details['limits']
                print(f"   📦 Product Limit: {limits['products'] if limits['products'] != -1 else 'Unlimited'}")
                print(f"   👥 User Limit: {limits['users'] if limits['users'] != -1 else 'Unlimited'}")
                print(f"   📈 Monthly Sales Limit: {limits['monthly_sales'] if limits['monthly_sales'] != -1 else 'Unlimited'}")
        except Exception as e:
            print(f"   ❌ Error getting subscription: {e}")
    
    # Step 3: Demonstrate plan upgrades
    print("\n⬆️  STEP 3: Demonstrating plan upgrades...")
    
    if 'basic' in tokens:
        print(f"\n🔄 Upgrading Basic Store from BASIC to PROFESSIONAL...")
        headers = {"Authorization": f"Bearer {tokens['basic']['token']}"}
        
        try:
            response = requests.put(f"{API_BASE}/subscription/upgrade", 
                                  headers=headers,
                                  json={"new_plan": "professional"})
            if response.status_code == 200:
                result = response.json()
                print(f"✅ {result['message']}")
                print(f"   New Plan: {result['plan_details']['name']}")
                print(f"   New Price: ${result['plan_details']['price']}/month")
            else:
                print(f"❌ Upgrade failed: {response.json()}")
        except Exception as e:
            print(f"❌ Upgrade error: {e}")
    
    # Step 4: Test sales and plan limits
    print("\n💰 STEP 4: Testing sales functionality...")
    
    for plan_type, auth_data in tokens.items():
        print(f"\n🛒 Making a sale for {auth_data['user_info']['business_name']}:")
        
        headers = {"Authorization": f"Bearer {auth_data['token']}"}
        
        # First, check available products
        try:
            products_response = requests.get(f"{API_BASE}/products", headers=headers)
            if products_response.status_code == 200:
                products = products_response.json()['products']
                if products:
                    # Make a sale
                    sale_data = {
                        "items": [
                            {"id": products[0]['id'], "quantity": 1}
                        ]
                    }
                    
                    sale_response = requests.post(f"{API_BASE}/sales", 
                                                headers=headers, 
                                                json=sale_data)
                    
                    if sale_response.status_code == 200:
                        result = sale_response.json()
                        print(f"   ✅ Sale successful! Total: ${result['total']}")
                        print(f"   📦 {result['message']}")
                    else:
                        error = sale_response.json()
                        print(f"   ❌ Sale failed: {error['detail']}")
                else:
                    print(f"   ⚠️  No products available")
        except Exception as e:
            print(f"   ❌ Sales error: {e}")
    
    # Step 5: Show sales history
    print("\n📊 STEP 5: Viewing sales history...")
    
    for plan_type, auth_data in tokens.items():
        print(f"\n📈 Sales history for {auth_data['user_info']['business_name']}:")
        
        headers = {"Authorization": f"Bearer {auth_data['token']}"}
        
        try:
            response = requests.get(f"{API_BASE}/sales/history", headers=headers)
            if response.status_code == 200:
                sales = response.json()['sales']
                if sales:
                    print(f"   📊 Total sales: {len(sales)}")
                    for sale in sales[:3]:  # Show last 3 sales
                        print(f"   💰 ${sale['total']} - {sale['product_name']} (Qty: {sale['quantity']}) - {sale['timestamp'][:16]}")
                else:
                    print(f"   📭 No sales yet")
        except Exception as e:
            print(f"   ❌ Error getting sales history: {e}")
    
    print("\n🎉 Demo completed!")
    print("=" * 60)
    print("✅ Authentication System Features Demonstrated:")
    print("   • User signup with plan selection")
    print("   • Secure login with JWT tokens")
    print("   • Plan-based feature restrictions")
    print("   • Subscription management") 
    print("   • Plan upgrades")
    print("   • Protected POS operations")
    print("   • Sales tracking per user")
    print("   • Plan limit enforcement")
    
    print(f"\n🌐 Frontend URLs:")
    print(f"   • Authentication: file:///c:/Users/keert/Documents/dealndone2025/frontend/auth.html")
    print(f"   • POS System: file:///c:/Users/keert/Documents/dealndone2025/frontend/pos.html")
    print(f"   • API Server: {API_BASE}")

if __name__ == "__main__":
    demo_complete_workflow()
