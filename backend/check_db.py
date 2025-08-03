import sqlite3

conn = sqlite3.connect('dealndone.db')
cursor = conn.cursor()

# Check tables
cursor.execute("SELECT name FROM sqlite_master WHERE type='table'")
tables = cursor.fetchall()
print("Tables:", tables)

# Check users table structure
cursor.execute("PRAGMA table_info(users)")
users_columns = cursor.fetchall()
print("Users table columns:", users_columns)

# Check organizations table structure
cursor.execute("PRAGMA table_info(organizations)")
orgs_columns = cursor.fetchall()
print("Organizations table columns:", orgs_columns)

# Check sample data
cursor.execute("SELECT * FROM users LIMIT 1")
user_data = cursor.fetchone()
print("Sample user data:", user_data)

cursor.execute("SELECT * FROM organizations LIMIT 1")
org_data = cursor.fetchone()
print("Sample org data:", org_data)

conn.close() 