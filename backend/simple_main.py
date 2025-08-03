from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import sqlite3
from pydantic import BaseModel
from typing import List
from datetime import datetime

app = FastAPI(title="DealNDone POS API", version="1.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Database connection
def get_db():
    conn = sqlite3.connect("dealndone.db", check_same_thread=False)
    conn.row_factory = sqlite3.Row
    return conn

# Pydantic models
class SaleItem(BaseModel):
    id: str
    quantity: int

class SaleRequest(BaseModel):
    items: List[SaleItem]

class SaleResponse(BaseModel):
    status: str
    total: float
    items_processed: int
    message: str

# Initialize database with correct product data
def init_db():
    conn = get_db()
    cursor = conn.cursor()
    
    # Create products table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS products (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            price REAL NOT NULL,
            stock INTEGER NOT NULL,
            category TEXT DEFAULT 'clothing'
        )
    ''')
    
    # Create sales table for tracking
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS sales (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            product_id TEXT,
            quantity INTEGER,
            total REAL,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (product_id) REFERENCES products (id)
        )
    ''')
    
    # Insert sample products that match frontend expectations
    products = [
        ('shirt_001', 'Dress Shirt', 25.00, 50),
        ('shirt_002', 'Casual Shirt', 20.00, 30),
        ('shirt_003', 'Polo Shirt', 22.50, 25),
        ('pants_001', 'Dress Pants', 35.00, 20),
        ('jacket_001', 'Blazer', 75.00, 15)
    ]
    
    cursor.executemany(
        "INSERT OR REPLACE INTO products (id, name, price, stock) VALUES (?, ?, ?, ?)",
        products
    )
    
    conn.commit()
    conn.close()
    print("Database initialized successfully!")

# Initialize database on startup
init_db()

# Health check endpoint
@app.get("/health")
async def health_check():
    return {"status": "healthy", "timestamp": datetime.now().isoformat()}

# Get all products
@app.get("/products")
async def get_products():
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM products WHERE stock > 0")
    products = [dict(row) for row in cursor.fetchall()]
    conn.close()
    return {"products": products}

# Get specific product
@app.get("/products/{product_id}")
async def get_product(product_id: str):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM products WHERE id = ?", (product_id,))
    product = cursor.fetchone()
    conn.close()
    
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    return dict(product)

# Process sale - Main endpoint that frontend calls
@app.post("/sales", response_model=SaleResponse)
async def process_sale(sale: SaleRequest):
    conn = get_db()
    cursor = conn.cursor()
    
    try:
        total = 0.0
        items_processed = 0
        sale_details = []
        
        # Process each item in the sale
        for item in sale.items:
            # Get product details
            cursor.execute("SELECT name, price, stock FROM products WHERE id = ?", (item.id,))
            product = cursor.fetchone()
            
            if not product:
                conn.close()
                raise HTTPException(status_code=404, detail=f"Product {item.id} not found")
            
            name, price, stock = product
            
            # Check stock availability
            if stock < item.quantity:
                conn.close()
                raise HTTPException(
                    status_code=400, 
                    detail=f"Insufficient stock for {name}. Available: {stock}, Requested: {item.quantity}"
                )
            
            # Calculate item total
            item_total = price * item.quantity
            total += item_total
            items_processed += item.quantity
            
            # Update stock
            cursor.execute(
                "UPDATE products SET stock = stock - ? WHERE id = ?", 
                (item.quantity, item.id)
            )
            
            # Record sale
            cursor.execute(
                "INSERT INTO sales (product_id, quantity, total) VALUES (?, ?, ?)",
                (item.id, item.quantity, item_total)
            )
            
            sale_details.append(f"{item.quantity}x {name} = ${item_total:.2f}")
        
        conn.commit()
        conn.close()
        
        message = f"Successfully sold {items_processed} item(s). Details: {', '.join(sale_details)}"
        
        return SaleResponse(
            status="success",
            total=total,
            items_processed=items_processed,
            message=message
        )
        
    except Exception as e:
        conn.rollback()
        conn.close()
        if isinstance(e, HTTPException):
            raise e
        raise HTTPException(status_code=500, detail=f"Sale processing error: {str(e)}")

# Get sales history
@app.get("/sales/history")
async def get_sales_history():
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("""
        SELECT s.*, p.name as product_name 
        FROM sales s 
        JOIN products p ON s.product_id = p.id 
        ORDER BY s.timestamp DESC 
        LIMIT 50
    """)
    sales = [dict(row) for row in cursor.fetchall()]
    conn.close()
    return {"sales": sales}

# Update product stock (for inventory management)
@app.put("/products/{product_id}/stock")
async def update_stock(product_id: str, new_stock: int):
    conn = get_db()
    cursor = conn.cursor()
    
    cursor.execute("SELECT name FROM products WHERE id = ?", (product_id,))
    product = cursor.fetchone()
    
    if not product:
        conn.close()
        raise HTTPException(status_code=404, detail="Product not found")
    
    cursor.execute("UPDATE products SET stock = ? WHERE id = ?", (new_stock, product_id))
    conn.commit()
    conn.close()
    
    return {"message": f"Stock updated for {product[0]} to {new_stock}"}

if __name__ == "__main__":
    import uvicorn
    print("Starting DealNDone POS Server...")
    print("Frontend should be accessible at: http://localhost:3000")
    print("API Health Check: http://localhost:8000/health")
    print("API Products: http://localhost:8000/products")
    uvicorn.run(app, host="0.0.0.0", port=8000)
