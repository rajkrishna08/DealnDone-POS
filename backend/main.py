# Add FastAPI endpoint for shirt sales

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
import sqlite3
import uvicorn
from typing import List
from datetime import datetime
from currency import get_currency_manager, convert_total_price, format_price_display
from cosmos_config import get_cosmos_service, is_cosmos_available
from restaurants import router as restaurants_router

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include restaurants router
app.include_router(restaurants_router)

class Item(BaseModel):
    id: str = Field(..., description="Product ID")
    quantity: int = Field(..., gt=0, description="Quantity must be positive")

class Sale(BaseModel):
    items: List[Item] = Field(..., min_items=1, description="At least one item required")
    currency: str = Field(default="USD", description="Currency for the sale")

class CurrencyResponse(BaseModel):
    supported_currencies: List[str]
    current_rates: dict
    last_updated: str

# SQLite setup
conn = sqlite3.connect('dealndone.db', check_same_thread=False)
cursor = conn.cursor()
cursor.execute('''CREATE TABLE IF NOT EXISTS sales (id INTEGER PRIMARY KEY AUTOINCREMENT, product_id TEXT, quantity INTEGER, total REAL)''')
conn.commit()

@app.post("/sales")
async def process_sale(sale: Sale):
    try:
        currency_manager = get_currency_manager()
        total_usd = 0
        total_converted = 0
        
        for item in sale.items:
            if item.quantity <= 0:
                raise HTTPException(status_code=400, detail="Quantity must be positive")
            
            # Calculate in USD first
            item_total_usd = 25.0 * item.quantity
            total_usd += item_total_usd
            
            # Convert to requested currency
            item_total_converted = convert_total_price(25.0, item.quantity, "USD", sale.currency)
            total_converted += item_total_converted
            
            cursor.execute("INSERT INTO sales (product_id, quantity, total) VALUES (?, ?, ?)", 
                         (item.id, item.quantity, item_total_usd))
        
        conn.commit()
        
        # Try to save to Cosmos DB if available
        cosmos_service = get_cosmos_service()
        if is_cosmos_available():
            try:
                from cosmos_config import POSOrder
                order = POSOrder(
                    order_id=f"order_{datetime.now().strftime('%Y%m%d_%H%M%S')}",
                    store_id="store_001",  # Default store
                    items=[{"id": item.id, "quantity": item.quantity, "price": 25.0} for item in sale.items],
                    total=total_converted,
                    currency=sale.currency
                )
                cosmos_service.create_pos_order(order)
            except Exception as e:
                print(f"Failed to save to Cosmos DB: {e}")
        
        return {
            "status": "success", 
            "total_usd": total_usd,
            "total_converted": total_converted,
            "currency": sale.currency,
            "formatted_total": format_price_display(total_converted, sale.currency),
            "items_processed": len(sale.items),
            "message": f"Processed {len(sale.items)} items in {sale.currency}",
            "cosmos_db_saved": is_cosmos_available()
        }
    except HTTPException:
        raise
    except Exception as e:
        return {"status": "error", "message": str(e)}

@app.get("/currency/rates")
async def get_currency_rates():
    """Get current exchange rates and supported currencies"""
    try:
        currency_manager = get_currency_manager()
        
        # Update rates if needed
        if currency_manager.should_update_rates():
            currency_manager.update_exchange_rates()
        
        return CurrencyResponse(
            supported_currencies=currency_manager.get_supported_currencies(),
            current_rates=currency_manager.exchange_rates,
            last_updated=currency_manager.last_update.isoformat() if currency_manager.last_update else None
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get currency rates: {str(e)}")

@app.get("/products")
async def get_products():
    """Get all products for the products page"""
    try:
        # Sample products data - in production this would come from database
        products = [
            {
                "id": 1,
                "name": "Printed Cotton Jacket",
                "price": "$45.00",
                "stock": 999,
                "tags": ["Unisex", "Bag"],
                "image": "https://lh3.googleusercontent.com/aida-public/AB6AXuBc2-0RRlpoVIj72SwUQyf7MZI0wFjpsArvtVoE77rhSOWy815pswQV2_bHq8WxDxeTXV2Jb5dIVMNgXzryE0mdOaGg_1FJbz1sbOSkByyYbCWIl6Ko1seWE_dt7UK5eOIJbZinPNKLvDAYicDTAT2bQObmn7YuTtC5NiS2p1OGudLqTnFkmvIZDIAHF5pEd8EivxihyPrLZ5_n_br4ks03SKVGfN8P4f9kXYdtLJHjlhKuBwLhXbyvNM4H40rDCkjL8i2bMg27Lg"
            },
            {
                "id": 2,
                "name": "Blue Faux Leather",
                "price": "$25.00",
                "stock": 102,
                "tags": ["Unisex", "Bag"],
                "image": "https://lh3.googleusercontent.com/aida-public/AB6AXuBc2-0RRlpoVIj72SwUQyf7MZI0wFjpsArvtVoE77rhSOWy815pswQV2_bHq8WxDxeTXV2Jb5dIVMNgXzryE0mdOaGg_1FJbz1sbOSkByyYbCWIl6Ko1seWE_dt7UK5eOIJbZinPNKLvDAYicDTAT2bQObmn7YuTtC5NiS2p1OGudLqTnFkmvIZDIAHF5pEd8EivxihyPrLZ5_n_br4ks03SKVGfN8P4f9kXYdtLJHjlhKuBwLhXbyvNM4H40rDCkjL8i2bMg27Lg"
            },
            {
                "id": 3,
                "name": "Classic White Shirt",
                "price": "$35.00",
                "stock": 250,
                "tags": ["Men", "Shirt"],
                "image": "https://lh3.googleusercontent.com/aida-public/AB6AXuBc2-0RRlpoVIj72SwUQyf7MZI0wFjpsArvtVoE77rhSOWy815pswQV2_bHq8WxDxeTXV2Jb5dIVMNgXzryE0mdOaGg_1FJbz1sbOSkByyYbCWIl6Ko1seWE_dt7UK5eOIJbZinPNKLvDAYicDTAT2bQObmn7YuTtC5NiS2p1OGudLqTnFkmvIZDIAHF5pEd8EivxihyPrLZ5_n_br4ks03SKVGfN8P4f9kXYdtLJHjlhKuBwLhXbyvNM4H40rDCkjL8i2bMg27Lg"
            },
            {
                "id": 4,
                "name": "Premium Denim Jacket",
                "price": "$65.00",
                "stock": 75,
                "tags": ["Unisex", "Jacket"],
                "image": "https://lh3.googleusercontent.com/aida-public/AB6AXuBc2-0RRlpoVIj72SwUQyf7MZI0wFjpsArvtVoE77rhSOWy815pswQV2_bHq8WxDxeTXV2Jb5dIVMNgXzryE0mdOaGg_1FJbz1sbOSkByyYbCWIl6Ko1seWE_dt7UK5eOIJbZinPNKLvDAYicDTAT2bQObmn7YuTtC5NiS2p1OGudLqTnFkmvIZDIAHF5pEd8EivxihyPrLZ5_n_br4ks03SKVGfN8P4f9kXYdtLJHjlhKuBwLhXbyvNM4H40rDCkjL8i2bMg27Lg"
            },
            {
                "id": 5,
                "name": "Casual Summer Dress",
                "price": "$40.00",
                "stock": 120,
                "tags": ["Women", "Dress"],
                "image": "https://lh3.googleusercontent.com/aida-public/AB6AXuBc2-0RRlpoVIj72SwUQyf7MZI0wFjpsArvtVoE77rhSOWy815pswQV2_bHq8WxDxeTXV2Jb5dIVMNgXzryE0mdOaGg_1FJbz1sbOSkByyYbCWIl6Ko1seWE_dt7UK5eOIJbZinPNKLvDAYicDTAT2bQObmn7YuTtC5NiS2p1OGudLqTnFkmvIZDIAHF5pEd8EivxihyPrLZ5_n_br4ks03SKVGfN8P4f9kXYdtLJHjlhKuBwLhXbyvNM4H40rDCkjL8i2bMg27Lg"
            }
        ]
        
        return {"products": products, "total": len(products)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get products: {str(e)}")

@app.get("/")
async def root():
    return {"message": "DealNDone API is running", "version": "1.0.0"}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "database": "connected"}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
    