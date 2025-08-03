#!/usr/bin/env python3
"""
Create test accounts for Deal n Done POS System
"""

import sqlite3
import hashlib
import secrets
from datetime import datetime

def hash_password(password):
    """Hash password using SHA-256"""
    return hashlib.sha256(password.encode()).hexdigest()

def create_test_accounts():
    """Create test accounts in the database"""
    
    # Connect to database
    conn = sqlite3.connect('backend/dealndone.db')
    cursor = conn.cursor()
    
    # Test accounts data
    test_accounts = [
        {
            'store_name': 'teststore',
            'email': 'test@dealndone.com',
            'password': 'Test123!',
            'phone': '+1 (555) 123-4567',
            'business_type': 'retail',
            'plan_type': 'basic',
            'subdomain': 'teststore.dealndone.com'
        },
        {
            'store_name': 'prostore',
            'email': 'pro@dealndone.com',
            'password': 'Pro123!',
            'phone': '+1 (555) 234-5678',
            'business_type': 'retail',
            'plan_type': 'professional',
            'subdomain': 'prostore.dealndone.com'
        },
        {
            'store_name': 'enterprise',
            'email': 'enterprise@dealndone.com',
            'password': 'Enterprise123!',
            'phone': '+1 (555) 345-6789',
            'business_type': 'wholesale',
            'plan_type': 'enterprise',
            'subdomain': 'enterprise.dealndone.com'
        },
        {
            'store_name': 'honey',
            'email': 'honey@dealndone.com',
            'password': 'Honey123!',
            'phone': '+1 (555) 456-7890',
            'business_type': 'retail',
            'plan_type': 'professional',
            'subdomain': 'honey.dealndone.com'
        },
        {
            'store_name': 'dealndone',
            'email': 'ceo@dealndone.com',
            'password': 'CEO2025!',
            'phone': '+1 (555) 999-9999',
            'business_type': 'platform',
            'plan_type': 'custom',
            'subdomain': 'dealndone.dealndone.com'
        }
    ]
    
    try:
        for account in test_accounts:
            # Generate IDs
            user_id = secrets.token_hex(16)
            org_id = secrets.token_hex(16)
            
            # Hash password
            hashed_password = hash_password(account['password'])
            
            # Insert organization
            cursor.execute('''
                INSERT OR REPLACE INTO organizations 
                (id, store_name, business_type, plan_type, owner_id, created_at)
                VALUES (?, ?, ?, ?, ?, ?)
            ''', (
                org_id,
                account['store_name'],
                account['business_type'],
                account['plan_type'],
                user_id,
                datetime.now().isoformat()
            ))
            
            # Insert user
            cursor.execute('''
                INSERT OR REPLACE INTO users 
                (id, email, store_name, business_type, plan_type, password_hash, role, created_at)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            ''', (
                user_id,
                account['email'],
                account['store_name'],
                account['business_type'],
                account['plan_type'],
                hashed_password,
                'ceo' if account['store_name'] == 'dealndone' else 'retailer',
                datetime.now().isoformat()
            ))
            
            # Insert usage tracking for outlets
            cursor.execute('''
                INSERT OR REPLACE INTO usage_tracking 
                (org_id, feature, current_usage, limit_value, updated_at)
                VALUES (?, ?, ?, ?, ?)
            ''', (
                org_id,
                'outlets',
                0,  # current_usage
                999999 if account['plan_type'] == 'custom' else (1 if account['plan_type'] == 'basic' else 2 if account['plan_type'] == 'professional' else 5),  # limit_value
                datetime.now().isoformat()
            ))
            
            # Insert usage tracking for products
            cursor.execute('''
                INSERT OR REPLACE INTO usage_tracking 
                (org_id, feature, current_usage, limit_value, updated_at)
                VALUES (?, ?, ?, ?, ?)
            ''', (
                org_id,
                'products',
                0,  # current_usage
                999999 if account['plan_type'] == 'custom' else (1000 if account['plan_type'] == 'basic' else 10000 if account['plan_type'] == 'professional' else 999999),  # limit_value
                datetime.now().isoformat()
            ))
            
            print(f"✅ Created account: {account['store_name']} ({account['email']})")
        
        # Commit changes
        conn.commit()
        print("\n🎉 All test accounts created successfully!")
        print("\n📋 Test Accounts:")
        for account in test_accounts:
            print(f"  • {account['store_name']} - {account['email']} - {account['password']}")
        
    except Exception as e:
        print(f"❌ Error creating accounts: {e}")
        conn.rollback()
    
    finally:
        conn.close()

if __name__ == "__main__":
    print("🚀 Creating test accounts for Deal n Done POS System...")
    create_test_accounts()
    print("\n✨ Done! You can now use these accounts to test the system.") 