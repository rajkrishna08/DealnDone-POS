import sqlite3

conn = sqlite3.connect('dealndone.db')
cursor = conn.cursor()
cursor.execute('SELECT store_name, email, password_hash FROM users WHERE store_name = "logintest"')
row = cursor.fetchone()
if row:
    print(f'Store: {row[0]}, Email: {row[1]}, Hash: {row[2][:20]}...')
else:
    print('User not found')

conn.close() 