import sqlite3
import time

def fix_db():
    start = time.time()
    print("🔧 Fixing database schema...")
    
    conn = sqlite3.connect("dealndone.db")
    cursor = conn.cursor()
    
    # Check current tables
    cursor.execute("SELECT name FROM sqlite_master WHERE type='table'")
    tables = cursor.fetchall()
    print(f"📋 Found tables: {[t[0] for t in tables]}")
    
    # Add org_id to users if not exists
    try:
        cursor.execute("ALTER TABLE users ADD COLUMN org_id TEXT")
        print("✅ Added org_id to users table")
    except sqlite3.OperationalError as e:
        if "duplicate column name" in str(e):
            print("ℹ️  org_id column already exists")
        else:
            print(f"⚠️  Error adding org_id: {e}")
    
    # Create indexes for better performance
    try:
        cursor.execute("CREATE INDEX IF NOT EXISTS idx_users_org_id ON users(org_id)")
        cursor.execute("CREATE INDEX IF NOT EXISTS idx_orgs_store_name ON organizations(store_name)")
        cursor.execute("CREATE INDEX IF NOT EXISTS idx_users_store_name ON users(store_name)")
        print("✅ Created database indexes")
    except Exception as e:
        print(f"⚠️  Error creating indexes: {e}")
    
    # Update existing users to link with organizations
    try:
        cursor.execute("""
            UPDATE users 
            SET org_id = (
                SELECT o.id 
                FROM organizations o 
                WHERE o.store_name = users.store_name
            )
            WHERE org_id IS NULL
        """)
        updated_count = cursor.rowcount
        print(f"✅ Linked {updated_count} users to organizations")
    except Exception as e:
        print(f"⚠️  Error linking users: {e}")
    
    conn.commit()
    conn.close()
    
    print(f"✅ Database fixed in {time.time() - start:.2f} seconds!")

if __name__ == "__main__":
    fix_db() 