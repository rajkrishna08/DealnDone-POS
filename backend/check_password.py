import sqlite3
import hashlib

conn = sqlite3.connect('dealndone.db')
cursor = conn.cursor()
cursor.execute('SELECT store_name, password_hash FROM users WHERE store_name = "test2"')
row = cursor.fetchone()
print(f'Store: {row[0]}, Hash: {row[1]}')

# Test some common passwords
common_passwords = ['password123', 'Test123!', 'test123', 'password', '123456', 'admin']
for pwd in common_passwords:
    hash_pwd = hashlib.sha256(pwd.encode()).hexdigest()
    if hash_pwd == row[1]:
        print(f'Password found: {pwd}')
        break
else:
    print('Password not found in common passwords')

conn.close() 