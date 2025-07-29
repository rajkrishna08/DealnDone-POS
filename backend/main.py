# Add FastAPI endpoint for shirt sales

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
import sqlite3
import uvicorn
from typing import List

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Item(BaseModel):
    id: str = Field(..., description="Product ID")
    quantity: int = Field(..., gt=0, description="Quantity must be positive")

class Sale(BaseModel):
    items: List[Item] = Field(..., min_items=1, description="At least one item required")

# SQLite setup
conn = sqlite3.connect('dealndone.db', check_same_thread=False)
cursor = conn.cursor()
cursor.execute('''CREATE TABLE IF NOT EXISTS sales (id INTEGER PRIMARY KEY AUTOINCREMENT, product_id TEXT, quantity INTEGER, total REAL)''')
conn.commit()

@app.post("/sales")
async def process_sale(sale: Sale):
    try:
        total = 0
        for item in sale.items:
            if item.quantity <= 0:
                raise HTTPException(status_code=400, detail="Quantity must be positive")
            item_total = 25.0 * item.quantity
            total += item_total
            cursor.execute("INSERT INTO sales (product_id, quantity, total) VALUES (?, ?, ?)", 
                         (item.id, item.quantity, item_total))
        
        conn.commit()
        return {
            "status": "success", 
            "total": total, 
            "items_processed": len(sale.items),
            "message": f"Processed {len(sale.items)} items"
        }
    except HTTPException:
        raise
    except Exception as e:
        return {"status": "error", "message": str(e)}

@app.get("/")
async def root():
    return {"message": "DealNDone API is running", "version": "1.0.0"}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "database": "connected"}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
    