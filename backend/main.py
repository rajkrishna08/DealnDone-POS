# Add FastAPI endpoint for shirt sales

from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
import sqlite3
import json
from datetime import datetime, timedelta
import random
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = FastAPI(title="Deal n Done API", version="1.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Database setup
def get_db():
    try:
        conn = sqlite3.connect("dealndone.db")
        conn.row_factory = sqlite3.Row
        return conn
    except Exception as e:
        print(f"Database connection error: {e}")
        raise

# Pydantic models
class Product(BaseModel):
    id: int
    name: str
    price: float
    category: str
    stock: int
    image: str

class Order(BaseModel):
    id: str
    customer_name: str
    items: List[Dict[str, Any]]
    total: float
    status: str
    date: str

class DealBotRequest(BaseModel):
    message: str
    context: Optional[Dict[str, Any]] = None

class DealBotResponse(BaseModel):
    response: str
    options: Optional[List[Dict[str, str]]] = None
    action: Optional[str] = None
    data: Optional[Dict[str, Any]] = None

class StockTakingRequest(BaseModel):
    store_id: str
    items: List[Dict[str, Any]]
    taken_by: str
    taken_at: str

class InventoryLocation(BaseModel):
    store_id: str
    product_id: str
    location: str
    stock: int
    last_counted: str

# Initialize database
def init_db():
    conn = get_db()
    cursor = conn.cursor()
    
    # Create products table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS products (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            price REAL NOT NULL,
            category TEXT NOT NULL DEFAULT 'General',
            stock INTEGER NOT NULL,
            image TEXT
        )
    ''')
    
    # Add missing columns if they don't exist
    try:
        cursor.execute("ALTER TABLE products ADD COLUMN category TEXT DEFAULT 'General'")
    except:
        pass  # Column already exists
    
    try:
        cursor.execute("ALTER TABLE products ADD COLUMN image TEXT")
    except:
        pass  # Column already exists
    
    # Create orders table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS orders (
            id TEXT PRIMARY KEY,
            customer_name TEXT NOT NULL,
            items TEXT NOT NULL,
            total REAL NOT NULL,
            status TEXT NOT NULL,
            date TEXT NOT NULL
        )
    ''')
    
    # Create inventory locations table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS inventory_locations (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            store_id TEXT NOT NULL,
            product_id TEXT NOT NULL,
            location TEXT NOT NULL,
            stock INTEGER NOT NULL DEFAULT 0,
            last_counted TEXT,
            created_at TEXT NOT NULL,
            updated_at TEXT NOT NULL,
            UNIQUE(store_id, product_id)
        )
    ''')
    
    # Create stock taking sessions table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS stock_taking_sessions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            session_id TEXT UNIQUE NOT NULL,
            store_id TEXT NOT NULL,
            taken_by TEXT NOT NULL,
            taken_at TEXT NOT NULL,
            status TEXT NOT NULL DEFAULT 'in_progress',
            total_items INTEGER DEFAULT 0,
            created_at TEXT NOT NULL
        )
    ''')
    
        # Create stock taking items table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS stock_taking_items (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            session_id TEXT NOT NULL,
            product_id TEXT NOT NULL,
            expected_count INTEGER NOT NULL,
            actual_count INTEGER NOT NULL,
            difference INTEGER NOT NULL,
            scanned_at TEXT NOT NULL,
            FOREIGN KEY (session_id) REFERENCES stock_taking_sessions (session_id)
        )
    ''')
    
    # Insert sample products if table is empty
    cursor.execute("SELECT COUNT(*) FROM products")
    if cursor.fetchone()[0] == 0:
        sample_products = [
            ("Classic White Shirt", 25.00, "Shirts", 45, "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400"),
            ("Blue Oxford Shirt", 30.00, "Shirts", 32, "https://images.unsplash.com/photo-1563630423918-b58f07336ac5?w=400"),
            ("Black Formal Shirt", 35.00, "Shirts", 28, "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400"),
            ("Striped Business Shirt", 28.00, "Shirts", 40, "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400"),
            ("Navy Blue Blazer", 89.99, "Outerwear", 15, "https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?w=400"),
            ("Gray Wool Sweater", 45.00, "Sweaters", 22, "https://images.unsplash.com/photo-1434389677669-e08b4c3e5b6b?w=400"),
            ("Black Dress Pants", 55.00, "Pants", 30, "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=400"),
            ("Brown Leather Belt", 29.99, "Accessories", 50, "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400")
        ]
        cursor.executemany(
            "INSERT INTO products (name, price, category, stock, image) VALUES (?, ?, ?, ?, ?)",
            sample_products
        )
    
    # Insert sample orders if table is empty
    cursor.execute("SELECT COUNT(*) FROM orders")
    if cursor.fetchone()[0] == 0:
        sample_orders = [
            ("ORD-12345", "John Smith", json.dumps([
                {"name": "Classic White Shirt", "quantity": 2, "price": 25.00}
            ]), 50.00, "Delivered", "2025-01-15"),
            ("ORD-12346", "Sarah Johnson", json.dumps([
                {"name": "Blue Oxford Shirt", "quantity": 1, "price": 30.00},
                {"name": "Black Dress Pants", "quantity": 1, "price": 55.00}
            ]), 85.00, "Processing", "2025-01-16"),
            ("ORD-12347", "Mike Wilson", json.dumps([
                {"name": "Navy Blue Blazer", "quantity": 1, "price": 89.99}
            ]), 89.99, "Shipped", "2025-01-17")
        ]
        cursor.executemany(
            "INSERT INTO orders (id, customer_name, items, total, status, date) VALUES (?, ?, ?, ?, ?, ?)",
            sample_orders
        )
    
    conn.commit()
    conn.close()

# Initialize database on startup
init_db()

@app.get("/health")
async def health_check():
    return {"status": "healthy", "timestamp": datetime.now().isoformat()}

@app.get("/products")
async def get_products():
    try:
        conn = get_db()
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM products")
        products = cursor.fetchall()
        conn.close()
        
        return [
            {
                "id": row["id"],
                "name": row["name"],
                "price": row["price"],
                "category": getattr(row, "category", "General"),  # Default to "General" if column doesn't exist
                "stock": row["stock"],
                "image": getattr(row, "image", "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400")  # Default image
            }
            for row in products
        ]
    except Exception as e:
        print(f"Products API error: {e}")
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

@app.get("/orders")
async def get_orders():
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM orders ORDER BY date DESC")
    orders = cursor.fetchall()
    conn.close()
    
    return [
        {
            "id": row["id"],
            "customer_name": row["customer_name"],
            "items": json.loads(row["items"]),
            "total": row["total"],
            "status": row["status"],
            "date": row["date"]
        }
        for row in orders
    ]

@app.get("/orders/{order_id}")
async def get_order(order_id: str):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM orders WHERE id = ?", (order_id,))
    order = cursor.fetchone()
    conn.close()
    
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    
    return {
        "id": order["id"],
        "customer_name": order["customer_name"],
        "items": json.loads(order["items"]),
        "total": order["total"],
        "status": order["status"],
        "date": order["date"]
    }

@app.post("/dealbots/chat", response_model=DealBotResponse)
async def dealbot_chat(request: DealBotRequest):
    """DealBot AI Assistant endpoint for handling natural language requests"""
    
    message = request.message.lower()
    
    # Order management
    if "order" in message and ("return" in message or "refund" in message):
        return handle_order_return(message)
    
    if "order" in message and "update" in message:
        return handle_order_update(message)
    
    if "order" in message and "status" in message:
        return handle_order_status(message)
    
    # Inventory management
    if "inventory" in message or "stock" in message:
        return handle_inventory_query(message)
    
    # Sales analytics
    if "sales" in message or "report" in message:
        return handle_sales_query(message)
    
    # Customer management
    if "customer" in message or "segment" in message:
        return handle_customer_query(message)
    
    # Default response
    return DealBotResponse(
        response="I understand you want to work with orders. I can help you with:\n\n• **Order Returns/Refunds** - Process customer returns\n• **Order Updates** - Modify existing orders\n• **Order Status** - Check order progress\n• **Inventory** - Check stock levels\n• **Sales Reports** - Get analytics\n• **Customer Management** - Handle customer data\n\nWhat would you like to do?",
        options=[
            {"text": "Process Return/Refund", "action": "return_refund"},
            {"text": "Update Order", "action": "update_order"},
            {"text": "Check Order Status", "action": "order_status"},
            {"text": "Inventory Check", "action": "inventory"},
            {"text": "Sales Report", "action": "sales_report"}
        ]
    )

def handle_order_return(message: str) -> DealBotResponse:
    """Handle order return/refund requests"""
    import re
    order_match = re.search(r'order\s+(\w+)', message)
    order_number = order_match.group(1) if order_match else "12345"
    
    return DealBotResponse(
        response=f"I found order #{order_number}. Let me get the details...\n\n**Order #{order_number}**\n• Customer: John Smith\n• Items: 2x Classic White Shirt ($50)\n• Status: Delivered\n• Date: 2025-01-15\n\nWhat would you like to do with this order?",
        options=[
            {"text": "Process Return", "action": "process_return", "orderNumber": order_number},
            {"text": "Issue Refund", "action": "issue_refund", "orderNumber": order_number},
            {"text": "Exchange Items", "action": "exchange_items", "orderNumber": order_number},
            {"text": "Cancel Action", "action": "cancel"}
        ]
    )

def handle_order_update(message: str) -> DealBotResponse:
    """Handle order update requests"""
    import re
    order_match = re.search(r'order\s+(\w+)', message)
    order_number = order_match.group(1) if order_match else "12345"
    
    return DealBotResponse(
        response=f"I found order #{order_number}. Here are the current details:\n\n**Order #{order_number}**\n• Customer: John Smith\n• Items: 2x Classic White Shirt\n• Shipping Address: 123 Main St\n• Status: Processing\n\nWhat would you like to update?",
        options=[
            {"text": "Change Items", "action": "change_items", "orderNumber": order_number},
            {"text": "Update Address", "action": "update_address", "orderNumber": order_number},
            {"text": "Change Quantity", "action": "change_quantity", "orderNumber": order_number},
            {"text": "Cancel Order", "action": "cancel_order", "orderNumber": order_number}
        ]
    )

def handle_order_status(message: str) -> DealBotResponse:
    """Handle order status requests"""
    import re
    order_match = re.search(r'order\s+(\w+)', message)
    order_number = order_match.group(1) if order_match else "12345"
    
    return DealBotResponse(
        response=f"**Order #{order_number} Status**\n\n📦 **Current Status**: Out for Delivery\n🚚 **Carrier**: FedEx\n📍 **Location**: Local Distribution Center\n⏰ **Estimated Delivery**: Today by 8:00 PM\n\nWould you like to:\n• Track this order\n• Update delivery preferences\n• Contact customer\n• Get order details",
        options=[
            {"text": "Track Order", "action": "track_order", "orderNumber": order_number},
            {"text": "Update Delivery", "action": "update_delivery", "orderNumber": order_number},
            {"text": "Contact Customer", "action": "contact_customer", "orderNumber": order_number},
            {"text": "Get Details", "action": "order_details", "orderNumber": order_number}
        ]
    )

def handle_inventory_query(message: str) -> DealBotResponse:
    """Handle inventory queries"""
    return DealBotResponse(
        response="**Current Inventory Status**\n\n📦 **Total Products**: 1,247\n⚠️ **Low Stock Items**: 12\n🔄 **Pending Restock**: 8\n💰 **Inventory Value**: $45,230\n\n**Top Items by Stock Level:**\n• Classic White Shirt: 45 units\n• Blue Oxford Shirt: 32 units\n• Black Formal Shirt: 28 units\n\nWhat would you like to do?",
        options=[
            {"text": "Check Specific Item", "action": "check_item"},
            {"text": "Low Stock Alert", "action": "low_stock"},
            {"text": "Restock Orders", "action": "restock"},
            {"text": "Inventory Report", "action": "inventory_report"}
        ]
    )

def handle_sales_query(message: str) -> DealBotResponse:
    """Handle sales queries"""
    return DealBotResponse(
        response="**Sales Report - Last 30 Days**\n\n💰 **Total Revenue**: $12,450\n📈 **Growth**: +15% vs last month\n🛒 **Orders**: 234\n👥 **New Customers**: 45\n\n**Top Products:**\n• Classic White Shirt: $3,200\n• Blue Oxford Shirt: $2,800\n• Black Formal Shirt: $2,100\n\nWould you like to see more details?",
        options=[
            {"text": "Detailed Report", "action": "detailed_report"},
            {"text": "Customer Analysis", "action": "customer_analysis"},
            {"text": "Product Performance", "action": "product_performance"},
            {"text": "Export Data", "action": "export_sales"}
        ]
    )

def handle_customer_query(message: str) -> DealBotResponse:
    """Handle customer queries"""
    return DealBotResponse(
        response="**Customer Management**\n\n👥 **Total Customers**: 1,234\n🆕 **New This Month**: 89\n💰 **High Value**: 156\n🔄 **Returning**: 892\n\n**Customer Segments:**\n• New Customers: 245\n• Returning Customers: 1,234\n• High Value: 89\n• Inactive: 567\n\nWhat would you like to do?",
        options=[
            {"text": "Customer Search", "action": "customer_search"},
            {"text": "Segment Analysis", "action": "segment_analysis"},
            {"text": "Loyalty Program", "action": "loyalty_program"},
            {"text": "Customer Report", "action": "customer_report"}
        ]
    )

@app.post("/dealbots/action")
async def dealbot_action(action: str, data: Optional[Dict[str, Any]] = None):
    """Handle DealBot action execution"""
    
    if action == "process_return":
        order_number = data.get("orderNumber", "12345")
        return {
            "success": True,
            "message": f"Return processed successfully for order #{order_number}",
            "return_id": f"RT-{datetime.now().strftime('%Y%m%d%H%M%S')}",
            "refund_amount": 50.00,
            "status": "Processing"
        }
    
    elif action == "issue_refund":
        order_number = data.get("orderNumber", "12345")
        return {
            "success": True,
            "message": f"Refund issued for order #{order_number}",
            "refund_amount": 50.00,
            "processing_time": "3-5 business days",
            "method": "Original payment"
        }
    
    elif action == "update_order":
        order_number = data.get("orderNumber", "12345")
        return {
            "success": True,
            "message": f"Order #{order_number} updated successfully",
            "updated_fields": data.get("updates", []),
            "status": "Updated"
        }
    
    else:
        return {
            "success": True,
            "message": "Action completed successfully",
            "action": action
        }

# Integration endpoints for future development
@app.get("/integrations/available")
async def get_available_integrations():
    """Get list of available integrations"""
    return {
        "integrations": [
            {
                "id": "quickbooks",
                "name": "QuickBooks",
                "type": "accounting",
                "status": "available",
                "features": ["sales_sync", "inventory_sync", "customer_sync", "tax_calculation"],
                "setup_required": True
            },
            {
                "id": "shopify",
                "name": "Shopify",
                "type": "ecommerce",
                "status": "available",
                "features": ["inventory_sync", "order_sync", "customer_sync", "product_sync"],
                "setup_required": True
            },
            {
                "id": "woocommerce",
                "name": "WooCommerce",
                "type": "ecommerce",
                "status": "available",
                "features": ["inventory_sync", "order_sync", "customer_sync", "product_sync"],
                "setup_required": True
            },
            {
                "id": "magento",
                "name": "Magento",
                "type": "ecommerce",
                "status": "planned",
                "features": ["inventory_sync", "order_sync", "customer_sync"],
                "setup_required": True
            },
            {
                "id": "custom",
                "name": "Custom Integration",
                "type": "custom",
                "status": "available",
                "features": ["api_access", "webhook_support", "custom_mapping"],
                "setup_required": True
            }
        ]
    }

@app.get("/integrations/{integration_id}/status")
async def get_integration_status(integration_id: str):
    """Get status of a specific integration"""
    # This would check the actual integration status
    return {
        "integration_id": integration_id,
        "status": "not_configured",  # or "active", "error", "disconnected"
        "last_sync": None,
        "sync_frequency": "daily",
        "next_sync": None
    }

@app.post("/integrations/{integration_id}/setup")
async def setup_integration(integration_id: str, config: dict):
    """Setup a new integration"""
    # This would handle the actual integration setup
    return {
        "integration_id": integration_id,
        "status": "setup_in_progress",
        "message": f"Setting up {integration_id} integration..."
    }

@app.get("/integrations/{integration_id}/sync")
async def trigger_sync(integration_id: str):
    """Trigger a manual sync for an integration"""
    # This would trigger the actual sync process
    return {
        "integration_id": integration_id,
        "status": "sync_triggered",
        "message": f"Sync triggered for {integration_id}"
    }

@app.get("/api/export/{format}")
async def export_data(format: str):
    """Export data in various formats"""
    if format not in ["csv", "excel", "json"]:
        raise HTTPException(status_code=400, detail="Unsupported format")
    
    # This would generate the actual export
    return {
        "format": format,
        "status": "export_generated",
        "download_url": f"/downloads/export_{format}_{datetime.now().strftime('%Y%m%d')}.{format}",
        "expires_at": (datetime.now() + timedelta(hours=24)).isoformat()
    }

# Inventory Management APIs
@app.get("/inventory/locations/{store_id}")
async def get_inventory_locations(store_id: str):
    """Get inventory locations for a specific store"""
    try:
        conn = get_db()
        cursor = conn.cursor()
        cursor.execute("""
            SELECT * FROM inventory_locations 
            WHERE store_id = ? 
            ORDER BY location
        """, (store_id,))
        locations = cursor.fetchall()
        conn.close()
        
        return {
            "store_id": store_id,
            "locations": [
                {
                    "product_id": row["product_id"],
                    "location": row["location"],
                    "stock": row["stock"],
                    "last_counted": row["last_counted"]
                }
                for row in locations
            ]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

@app.get("/inventory/product/{product_id}/locations")
async def get_product_locations(product_id: str):
    """Get all locations where a product is stored"""
    try:
        conn = get_db()
        cursor = conn.cursor()
        cursor.execute("""
            SELECT * FROM inventory_locations 
            WHERE product_id = ? 
            ORDER BY store_id, location
        """, (product_id,))
        locations = cursor.fetchall()
        conn.close()
        
        return {
            "product_id": product_id,
            "locations": [
                {
                    "store_id": row["store_id"],
                    "location": row["location"],
                    "stock": row["stock"],
                    "last_counted": row["last_counted"]
                }
                for row in locations
            ]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

@app.post("/inventory/stock-taking")
async def submit_stock_taking(request: StockTakingRequest):
    """Submit stock taking results"""
    try:
        conn = get_db()
        cursor = conn.cursor()
        
        # Generate session ID
        session_id = f"stock_taking_{datetime.now().strftime('%Y%m%d_%H%M%S')}_{request.store_id}"
        
        # Create stock taking session
        cursor.execute("""
            INSERT INTO stock_taking_sessions 
            (session_id, store_id, taken_by, taken_at, total_items, created_at)
            VALUES (?, ?, ?, ?, ?, ?)
        """, (
            session_id,
            request.store_id,
            request.taken_by,
            request.taken_at,
            len(request.items),
            datetime.now().isoformat()
        ))
        
        # Process each scanned item
        for item in request.items:
            # Get expected count from inventory_locations
            cursor.execute("""
                SELECT stock FROM inventory_locations 
                WHERE store_id = ? AND product_id = ?
            """, (request.store_id, item["id"]))
            
            expected_result = cursor.fetchone()
            expected_count = expected_result["stock"] if expected_result else 0
            actual_count = item.get("count", 0)
            difference = actual_count - expected_count
            
            # Insert stock taking item
            cursor.execute("""
                INSERT INTO stock_taking_items 
                (session_id, product_id, expected_count, actual_count, difference, scanned_at)
                VALUES (?, ?, ?, ?, ?, ?)
            """, (
                session_id,
                item["id"],
                expected_count,
                actual_count,
                difference,
                item.get("scannedAt", datetime.now().isoformat())
            ))
            
            # Update inventory location
            if expected_result:
                cursor.execute("""
                    UPDATE inventory_locations 
                    SET stock = ?, last_counted = ?, updated_at = ?
                    WHERE store_id = ? AND product_id = ?
                """, (
                    actual_count,
                    datetime.now().isoformat(),
                    datetime.now().isoformat(),
                    request.store_id,
                    item["id"]
                ))
            else:
                # Create new inventory location record
                cursor.execute("""
                    INSERT INTO inventory_locations 
                    (store_id, product_id, location, stock, last_counted, created_at, updated_at)
                    VALUES (?, ?, ?, ?, ?, ?, ?)
                """, (
                    request.store_id,
                    item["id"],
                    "A1-B1",  # Default location
                    actual_count,
                    datetime.now().isoformat(),
                    datetime.now().isoformat(),
                    datetime.now().isoformat()
                ))
        
        # Update session status
        cursor.execute("""
            UPDATE stock_taking_sessions 
            SET status = 'completed' 
            WHERE session_id = ?
        """, (session_id,))
        
        conn.commit()
        conn.close()
        
        return {
            "session_id": session_id,
            "status": "completed",
            "store_id": request.store_id,
            "total_items": len(request.items),
            "message": "Stock taking completed successfully"
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Stock taking error: {str(e)}")

@app.get("/inventory/stock-taking/sessions/{store_id}")
async def get_stock_taking_sessions(store_id: str):
    """Get stock taking sessions for a store"""
    try:
        conn = get_db()
        cursor = conn.cursor()
        cursor.execute("""
            SELECT * FROM stock_taking_sessions 
            WHERE store_id = ? 
            ORDER BY created_at DESC
        """, (store_id,))
        sessions = cursor.fetchall()
        conn.close()
        
        return {
            "store_id": store_id,
            "sessions": [
                {
                    "session_id": row["session_id"],
                    "taken_by": row["taken_by"],
                    "taken_at": row["taken_at"],
                    "status": row["status"],
                    "total_items": row["total_items"],
                    "created_at": row["created_at"]
                }
                for row in sessions
            ]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

@app.get("/inventory/search/{barcode}")
async def search_product_by_barcode(barcode: str):
    """Search for a product by barcode"""
    try:
        conn = get_db()
        cursor = conn.cursor()
        
        # Search in products table (assuming barcode is stored as a field)
        cursor.execute("""
            SELECT * FROM products 
            WHERE id LIKE ? OR name LIKE ?
        """, (f"%{barcode}%", f"%{barcode}%"))
        
        products = cursor.fetchall()
        conn.close()
        
        if products:
            product = products[0]
            return {
                "found": True,
                "product": {
                    "id": product["id"],
                    "name": product["name"],
                    "price": product["price"],
                    "category": getattr(product, "category", "General"),
                    "stock": product["stock"],
                    "image": getattr(product, "image", "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400"),
                    "barcode": barcode  # In a real system, this would be a separate field
                }
            }
        else:
            return {
                "found": False,
                "barcode": barcode,
                "message": "Product not found"
            }
            
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Search error: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
    