import sqlite3

def test_organizations():
    try:
        conn = sqlite3.connect("dealndone.db")
        conn.row_factory = sqlite3.Row
        cursor = conn.cursor()
        
        # Check organizations table
        cursor.execute('SELECT * FROM organizations')
        orgs = cursor.fetchall()
        
        print(f"Found {len(orgs)} organizations:")
        for org in orgs:
            print(f"  - ID: {org['id']}")
            print(f"    Store Name: {org['store_name']}")
            print(f"    Business Type: {org['business_type']}")
            print(f"    Plan Type: {org['plan_type']}")
            print(f"    Owner ID: {org['owner_id']}")
            print()
        
        # Check users table
        cursor.execute('SELECT * FROM users')
        users = cursor.fetchall()
        
        print(f"Found {len(users)} users:")
        for user in users:
            print(f"  - ID: {user['id']}")
            print(f"    Email: {user['email']}")
            print(f"    Store Name: {user['store_name']}")
            print(f"    Role: {user['role']}")
            print()
        
        conn.close()
        
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    test_organizations() 