import sqlite3
from datetime import datetime

def update_database_schema():
    """Update database schema to match Grok's plan requirements"""
    
    print("🔄 Updating Database Schema for Grok's Plan")
    print("=" * 50)
    
    conn = sqlite3.connect('dealndone.db')
    cursor = conn.cursor()
    
    try:
        # Add missing columns to organizations table
        print("📊 Updating organizations table...")
        
        # Check if columns exist
        cursor.execute("PRAGMA table_info(organizations)")
        columns = [column[1] for column in cursor.fetchall()]
        
        # Add missing columns
        if 'max_outlets' not in columns:
            cursor.execute('ALTER TABLE organizations ADD COLUMN max_outlets INTEGER DEFAULT 1')
            print("✅ Added max_outlets column")
        
        if 'max_registers' not in columns:
            cursor.execute('ALTER TABLE organizations ADD COLUMN max_registers INTEGER DEFAULT 1')
            print("✅ Added max_registers column")
        
        if 'max_products' not in columns:
            cursor.execute('ALTER TABLE organizations ADD COLUMN max_products INTEGER DEFAULT 50')
            print("✅ Added max_products column")
        
        if 'max_employees' not in columns:
            cursor.execute('ALTER TABLE organizations ADD COLUMN max_employees INTEGER DEFAULT 3')
            print("✅ Added max_employees column")
        
        if 'billing_email' not in columns:
            cursor.execute('ALTER TABLE organizations ADD COLUMN billing_email TEXT')
            print("✅ Added billing_email column")
        
        # Add missing columns to users table
        print("👥 Updating users table...")
        
        cursor.execute("PRAGMA table_info(users)")
        user_columns = [column[1] for column in cursor.fetchall()]
        
        if 'mfa_enabled' not in user_columns:
            cursor.execute('ALTER TABLE users ADD COLUMN mfa_enabled BOOLEAN DEFAULT FALSE')
            print("✅ Added mfa_enabled column")
        
        if 'mfa_phone' not in user_columns:
            cursor.execute('ALTER TABLE users ADD COLUMN mfa_phone TEXT')
            print("✅ Added mfa_phone column")
        
        if 'last_login' not in user_columns:
            cursor.execute('ALTER TABLE users ADD COLUMN last_login TEXT')
            print("✅ Added last_login column")
        
        if 'login_attempts' not in user_columns:
            cursor.execute('ALTER TABLE users ADD COLUMN login_attempts INTEGER DEFAULT 0')
            print("✅ Added login_attempts column")
        
        # Create transactions table if it doesn't exist
        print("💳 Creating transactions table...")
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS transactions (
                id TEXT PRIMARY KEY,
                org_id TEXT NOT NULL,
                total REAL NOT NULL,
                payment_method TEXT NOT NULL,
                status TEXT DEFAULT 'completed',
                created_at TEXT NOT NULL,
                items TEXT,  -- JSON string of transaction items
                customer_email TEXT,
                customer_phone TEXT
            )
        ''')
        print("✅ Transactions table ready")
        
        # Create transaction_items table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS transaction_items (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                transaction_id TEXT NOT NULL,
                product_id INTEGER NOT NULL,
                quantity INTEGER NOT NULL,
                price REAL NOT NULL,
                FOREIGN KEY (transaction_id) REFERENCES transactions (id)
            )
        ''')
        print("✅ Transaction items table ready")
        
        # Update existing organizations with plan-based limits
        print("📈 Updating plan limits...")
        
        cursor.execute('SELECT id, plan_type FROM organizations')
        orgs = cursor.fetchall()
        
        for org_id, plan_type in orgs:
            if plan_type == 'enterprise':
                limits = {'max_outlets': 10, 'max_registers': 5, 'max_products': 10000, 'max_employees': 50}
            elif plan_type == 'pro':
                limits = {'max_outlets': 3, 'max_registers': 2, 'max_products': 5000, 'max_employees': 10}
            elif plan_type == 'basic':
                limits = {'max_outlets': 1, 'max_registers': 1, 'max_products': 1000, 'max_employees': 3}
            else:  # free
                limits = {'max_outlets': 1, 'max_registers': 1, 'max_products': 50, 'max_employees': 1}
            
            cursor.execute('''
                UPDATE organizations 
                SET max_outlets = ?, max_registers = ?, max_products = ?, max_employees = ?
                WHERE id = ?
            ''', (limits['max_outlets'], limits['max_registers'], 
                  limits['max_products'], limits['max_employees'], org_id))
        
        print(f"✅ Updated {len(orgs)} organizations with plan limits")
        
        # Commit changes
        conn.commit()
        print("✅ Database schema updated successfully!")
        
        # Show summary
        print("\n📊 Database Schema Summary:")
        print("-" * 30)
        
        cursor.execute("PRAGMA table_info(organizations)")
        org_columns = cursor.fetchall()
        print(f"Organizations table: {len(org_columns)} columns")
        
        cursor.execute("PRAGMA table_info(users)")
        user_columns = cursor.fetchall()
        print(f"Users table: {len(user_columns)} columns")
        
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table'")
        tables = cursor.fetchall()
        print(f"Total tables: {len(tables)}")
        
        print("\n🎉 Database ready for Grok's enhanced plan!")
        
    except Exception as e:
        print(f"❌ Error updating schema: {e}")
        conn.rollback()
    finally:
        conn.close()

if __name__ == "__main__":
    update_database_schema() 