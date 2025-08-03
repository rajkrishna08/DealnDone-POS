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

# Create comprehensive test accounts
conn = sqlite3.connect('dealndone.db')
cursor = conn.cursor()

# Test accounts with different roles
test_accounts = [
    {
        "store": "honeyhq",
        "email": "ceo@honey.com", 
        "password": "password123",
        "business_type": "Franchise",
        "plan_type": "enterprise",
        "role": "ceo",
        "description": "CEO (Franchisor) - Honey Tailors HQ"
    },
    {
        "store": "honeydowntown",
        "email": "franchisee@honey.com",
        "password": "password123", 
        "business_type": "Retail",
        "plan_type": "pro",
        "role": "franchisee",
        "description": "Franchisee - Honey Downtown Store"
    },
    {
        "store": "tailorjohn",
        "email": "john@honey.com",
        "password": "password123",
        "business_type": "Services", 
        "plan_type": "basic",
        "role": "employee",
        "description": "Employee - Tailor John"
    },
    {
        "store": "securityadmin",
        "email": "security@honey.com",
        "password": "password123",
        "business_type": "Security",
        "plan_type": "enterprise", 
        "role": "security_officer",
        "description": "Security Officer - System Admin"
    }
]

print("🚀 Creating Franchise Test Accounts")
print("=" * 50)

for account in test_accounts:
    # Check if user already exists
    cursor.execute('SELECT 1 FROM users WHERE store_name = ? OR email = ?', 
                   (account["store"], account["email"]))
    
    if cursor.fetchone():
        print(f"⚠️  Account already exists: {account['store']} ({account['description']})")
    else:
        # Create user
        user_id = generate_user_id()
        org_id = generate_org_id()
        password_hash = hash_password(account["password"])
        
        cursor.execute('''
            INSERT INTO users (id, email, store_name, business_type, plan_type, password_hash, role, email_verified, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (user_id, account["email"], account["store"], account["business_type"], 
              account["plan_type"], password_hash, account["role"], True, datetime.now().isoformat()))
        
        # Create organization
        cursor.execute('''
            INSERT INTO organizations (id, store_name, business_type, plan_type, owner_id, created_at)
            VALUES (?, ?, ?, ?, ?, ?)
        ''', (org_id, account["store"], account["business_type"], account["plan_type"], 
              user_id, datetime.now().isoformat()))
        
        # Create usage tracking based on plan
        if account["plan_type"] == "enterprise":
            limits = [("outlets", 10), ("products", 10000), ("employees", 50)]
        elif account["plan_type"] == "pro":
            limits = [("outlets", 3), ("products", 5000), ("employees", 10)]
        else:  # basic
            limits = [("outlets", 1), ("products", 1000), ("employees", 3)]
        
        for feature, limit in limits:
            cursor.execute('''
                INSERT INTO usage_tracking (org_id, feature, current_usage, limit_value)
                VALUES (?, ?, ?, ?)
            ''', (org_id, feature, 0, limit))
        
        print(f"✅ Created: {account['store']} ({account['description']})")
        print(f"   Email: {account['email']}")
        print(f"   Password: {account['password']}")
        print(f"   Role: {account['role']}")
        print(f"   Plan: {account['plan_type']}")
        print(f"   URL: http://{account['store']}.localhost:3000")
        print()

conn.commit()
conn.close()

print("🎉 All franchise test accounts created!")
print("\n📋 Test Account Summary:")
print("=" * 30)
print("1. CEO (Franchisor): honeyhq")
print("   - Enterprise plan, full access")
print("   - Can manage all franchises")
print()
print("2. Franchisee: honeydowntown") 
print("   - Pro plan, 3 outlets")
print("   - Can manage their store")
print()
print("3. Employee: tailorjohn")
print("   - Basic plan, limited access")
print("   - Can view inventory, process sales")
print()
print("4. Security Officer: securityadmin")
print("   - Enterprise plan, security focus")
print("   - Can audit logs, manage access")
print()
print("🔗 Login URLs:")
print("- http://localhost:3000/login")
print("- Use any account above to test different roles") 