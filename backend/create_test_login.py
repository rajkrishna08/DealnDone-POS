import sqlite3
import hashlib
import secrets
from datetime import datetime

def hash_password(password: str) -> str:
    """Hash password using SHA-256"""
    return hashlib.sha256(password.encode()).hexdigest()

def generate_user_id() -> str:
    """Generate unique user ID"""
    return f"user_{secrets.token_hex(8)}"

def generate_org_id() -> str:
    """Generate unique organization ID"""
    return f"org_{secrets.token_hex(8)}"

# Create test account
conn = sqlite3.connect('dealndone.db')
cursor = conn.cursor()

# Test credentials
test_store = "logintest"
test_email = "login@test.com"
test_password = "password123"

# Check if user already exists
cursor.execute('SELECT 1 FROM users WHERE store_name = ? OR email = ?', (test_store, test_email))
if cursor.fetchone():
    print(f"Test account already exists: {test_store}")
else:
    # Create user
    user_id = generate_user_id()
    org_id = generate_org_id()
    password_hash = hash_password(test_password)
    
    cursor.execute('''
        INSERT INTO users (id, email, store_name, business_type, plan_type, password_hash, role, email_verified, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    ''', (user_id, test_email, test_store, 'Retail', 'basic', password_hash, 'retailer', True, datetime.now().isoformat()))
    
    # Create organization
    cursor.execute('''
        INSERT INTO organizations (id, store_name, business_type, plan_type, owner_id, created_at)
        VALUES (?, ?, ?, ?, ?, ?)
    ''', (org_id, test_store, 'Retail', 'basic', user_id, datetime.now().isoformat()))
    
    # Create usage tracking
    cursor.execute('''
        INSERT INTO usage_tracking (org_id, feature, current_usage, limit_value)
        VALUES (?, 'outlets', 0, 1), (?, 'products', 0, 1000), (?, 'employees', 0, 3)
    ''', (org_id, org_id, org_id))
    
    conn.commit()
    print(f"✅ Test account created successfully!")
    print(f"   Store: {test_store}")
    print(f"   Email: {test_email}")
    print(f"   Password: {test_password}")
    print(f"   Login URL: http://{test_store}.localhost:3000")

conn.close() 