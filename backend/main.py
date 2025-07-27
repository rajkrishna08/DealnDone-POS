from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import sqlite3
from pydantic import BaseModel

app = FastAPI()
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])

def get_db_conn():
    conn = sqlite3.connect("dealndone.db", check_same_thread=False)
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()
    return conn, cursor

# Initialize database (garment example)
def init_db():
    conn, cursor = get_db_conn()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS products (
            id TEXT PRIMARY KEY,
            name TEXT,
            price REAL,
            stock INTEGER
        )
    ''')
    cursor.execute("INSERT OR IGNORE INTO products VALUES ('test1', 'Dress Shirt', 25.00, 10)")
    conn.commit()
    conn.close()

init_db()

class Item(BaseModel):
    id: str
    quantity: int

class Sale(BaseModel):
    items: list[Item]

@app.post("/sales")
async def process_sale(sale: Sale):
    total = 0
    conn, cursor = get_db_conn()
    try:
        for item in sale.items:
            cursor.execute("SELECT price, stock, name FROM products WHERE id = ?", (item.id,))
            result = cursor.fetchone()
            if not result:
                raise HTTPException(status_code=404, detail="Product not found")
            price, stock, name = result
            if stock < item.quantity:
                raise HTTPException(status_code=400, detail=f"Insufficient stock for {name}")
            total += price * item.quantity
            cursor.execute("UPDATE products SET stock = stock - ? WHERE id = ?", (item.quantity, item.id))
        conn.commit()
        return {"status": "success", "total": total, "items": [{"product_id": item.id, "name": name, "quantity": item.quantity, "subtotal": price * item.quantity}]}
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        conn.close()

# Test endpoint
if __name__ == "__main__":
    from fastapi.testclient import TestClient
    client = TestClient(app)
    # TC3: Valid sale
    response = client.post("/sales", json={"items": [{"id": "test1", "quantity": 1}]})
    print("TC3:", response.status_code, response.json())
    # TC4: Insufficient stock
    response = client.post("/sales", json={"items": [{"id": "test1", "quantity": 100}]})
    print("TC4:", response.status_code, response.json())