import sqlite3
import time

def update_franchise_schema():
    start = time.time()
    print("🔧 Updating database schema for franchise support...")
    
    conn = sqlite3.connect("dealndone.db")
    cursor = conn.cursor()
    
    # Add franchise columns to organizations table
    try:
        cursor.execute("ALTER TABLE organizations ADD COLUMN franchise_role TEXT DEFAULT 'standard'")
        print("✅ Added franchise_role to organizations")
    except sqlite3.OperationalError as e:
        if "duplicate column name" in str(e):
            print("ℹ️  franchise_role column already exists")
        else:
            print(f"⚠️  Error adding franchise_role: {e}")
    
    try:
        cursor.execute("ALTER TABLE organizations ADD COLUMN royalty_rate DECIMAL(5,2) DEFAULT 5.0")
        print("✅ Added royalty_rate to organizations")
    except sqlite3.OperationalError as e:
        if "duplicate column name" in str(e):
            print("ℹ️  royalty_rate column already exists")
        else:
            print(f"⚠️  Error adding royalty_rate: {e}")
    
    try:
        cursor.execute("ALTER TABLE organizations ADD COLUMN parent_org_id TEXT")
        print("✅ Added parent_org_id to organizations")
    except sqlite3.OperationalError as e:
        if "duplicate column name" in str(e):
            print("ℹ️  parent_org_id column already exists")
        else:
            print(f"⚠️  Error adding parent_org_id: {e}")
    
    try:
        cursor.execute("ALTER TABLE organizations ADD COLUMN territory TEXT")
        print("✅ Added territory to organizations")
    except sqlite3.OperationalError as e:
        if "duplicate column name" in str(e):
            print("ℹ️  territory column already exists")
        else:
            print(f"⚠️  Error adding territory: {e}")
    
    # Create franchise-specific indexes
    try:
        cursor.execute("CREATE INDEX IF NOT EXISTS idx_orgs_franchise_role ON organizations(franchise_role)")
        cursor.execute("CREATE INDEX IF NOT EXISTS idx_orgs_parent_id ON organizations(parent_org_id)")
        cursor.execute("CREATE INDEX IF NOT EXISTS idx_orgs_territory ON organizations(territory)")
        print("✅ Created franchise indexes")
    except Exception as e:
        print(f"⚠️  Error creating franchise indexes: {e}")
    
    # Create franchise audit table
    try:
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS franchise_audit (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                org_id TEXT,
                action TEXT,
                details TEXT,
                amount DECIMAL(10,2),
                period_start TEXT,
                period_end TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (org_id) REFERENCES organizations(id)
            )
        """)
        print("✅ Created franchise_audit table")
    except Exception as e:
        print(f"⚠️  Error creating franchise_audit table: {e}")
    
    # Create franchise performance table
    try:
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS franchise_performance (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                org_id TEXT,
                period_start TEXT,
                period_end TEXT,
                revenue DECIMAL(10,2),
                expenses DECIMAL(10,2),
                royalty_paid DECIMAL(10,2),
                performance_score INTEGER,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (org_id) REFERENCES organizations(id)
            )
        """)
        print("✅ Created franchise_performance table")
    except Exception as e:
        print(f"⚠️  Error creating franchise_performance table: {e}")
    
    conn.commit()
    conn.close()
    
    print(f"✅ Franchise schema updated in {time.time() - start:.2f} seconds!")

if __name__ == "__main__":
    update_franchise_schema() 