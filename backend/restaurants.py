"""
Restaurants Pipeline Stub for DealNDone 2025
Basic restaurant management functionality
"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
import sqlite3

router = APIRouter(prefix="/restaurants", tags=["restaurants"])

class Restaurant(BaseModel):
    id: Optional[int] = None
    name: str
    address: str
    phone: str
    email: str
    cuisine_type: str
    rating: Optional[float] = None
    is_active: bool = True
    created_at: Optional[datetime] = None

class MenuItem(BaseModel):
    id: Optional[int] = None
    restaurant_id: int
    name: str
    description: str
    price: float
    category: str
    is_available: bool = True

class Order(BaseModel):
    id: Optional[int] = None
    restaurant_id: int
    customer_name: str
    customer_phone: str
    items: List[dict]  # List of menu items with quantities
    total_amount: float
    status: str = "pending"  # pending, confirmed, preparing, ready, delivered
    order_time: Optional[datetime] = None

# Database setup for restaurants
def init_restaurant_db():
    """Initialize restaurant database tables"""
    conn = sqlite3.connect('dealndone.db', check_same_thread=False)
    cursor = conn.cursor()
    
    # Create restaurants table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS restaurants (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            address TEXT NOT NULL,
            phone TEXT NOT NULL,
            email TEXT NOT NULL,
            cuisine_type TEXT NOT NULL,
            rating REAL DEFAULT 0.0,
            is_active BOOLEAN DEFAULT 1,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    # Create menu_items table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS menu_items (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            restaurant_id INTEGER NOT NULL,
            name TEXT NOT NULL,
            description TEXT,
            price REAL NOT NULL,
            category TEXT NOT NULL,
            is_available BOOLEAN DEFAULT 1,
            FOREIGN KEY (restaurant_id) REFERENCES restaurants (id)
        )
    ''')
    
    # Create orders table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS restaurant_orders (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            restaurant_id INTEGER NOT NULL,
            customer_name TEXT NOT NULL,
            customer_phone TEXT NOT NULL,
            items TEXT NOT NULL,  -- JSON string of items
            total_amount REAL NOT NULL,
            status TEXT DEFAULT 'pending',
            order_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (restaurant_id) REFERENCES restaurants (id)
        )
    ''')
    
    conn.commit()
    conn.close()

# Initialize database
init_restaurant_db()

@router.post("/", response_model=Restaurant)
async def create_restaurant(restaurant: Restaurant):
    """Create a new restaurant"""
    try:
        conn = sqlite3.connect('dealndone.db', check_same_thread=False)
        cursor = conn.cursor()
        
        cursor.execute('''
            INSERT INTO restaurants (name, address, phone, email, cuisine_type)
            VALUES (?, ?, ?, ?, ?)
        ''', (restaurant.name, restaurant.address, restaurant.phone, 
              restaurant.email, restaurant.cuisine_type))
        
        restaurant_id = cursor.lastrowid
        conn.commit()
        conn.close()
        
        restaurant.id = restaurant_id
        restaurant.created_at = datetime.now()
        return restaurant
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to create restaurant: {str(e)}")

@router.get("/", response_model=List[Restaurant])
async def get_restaurants():
    """Get all restaurants"""
    try:
        conn = sqlite3.connect('dealndone.db', check_same_thread=False)
        cursor = conn.cursor()
        
        cursor.execute('SELECT * FROM restaurants WHERE is_active = 1')
        rows = cursor.fetchall()
        conn.close()
        
        restaurants = []
        for row in rows:
            restaurants.append(Restaurant(
                id=row[0],
                name=row[1],
                address=row[2],
                phone=row[3],
                email=row[4],
                cuisine_type=row[5],
                rating=row[6],
                is_active=bool(row[7]),
                created_at=datetime.fromisoformat(row[8]) if row[8] else None
            ))
        
        return restaurants
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get restaurants: {str(e)}")

@router.get("/{restaurant_id}", response_model=Restaurant)
async def get_restaurant(restaurant_id: int):
    """Get a specific restaurant by ID"""
    try:
        conn = sqlite3.connect('dealndone.db', check_same_thread=False)
        cursor = conn.cursor()
        
        cursor.execute('SELECT * FROM restaurants WHERE id = ? AND is_active = 1', (restaurant_id,))
        row = cursor.fetchone()
        conn.close()
        
        if not row:
            raise HTTPException(status_code=404, detail="Restaurant not found")
        
        return Restaurant(
            id=row[0],
            name=row[1],
            address=row[2],
            phone=row[3],
            email=row[4],
            cuisine_type=row[5],
            rating=row[6],
            is_active=bool(row[7]),
            created_at=datetime.fromisoformat(row[8]) if row[8] else None
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get restaurant: {str(e)}")

@router.post("/{restaurant_id}/menu", response_model=MenuItem)
async def add_menu_item(restaurant_id: int, menu_item: MenuItem):
    """Add a menu item to a restaurant"""
    try:
        conn = sqlite3.connect('dealndone.db', check_same_thread=False)
        cursor = conn.cursor()
        
        cursor.execute('''
            INSERT INTO menu_items (restaurant_id, name, description, price, category)
            VALUES (?, ?, ?, ?, ?)
        ''', (restaurant_id, menu_item.name, menu_item.description, 
              menu_item.price, menu_item.category))
        
        menu_item_id = cursor.lastrowid
        conn.commit()
        conn.close()
        
        menu_item.id = menu_item_id
        menu_item.restaurant_id = restaurant_id
        return menu_item
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to add menu item: {str(e)}")

@router.get("/{restaurant_id}/menu", response_model=List[MenuItem])
async def get_restaurant_menu(restaurant_id: int):
    """Get menu items for a restaurant"""
    try:
        conn = sqlite3.connect('dealndone.db', check_same_thread=False)
        cursor = conn.cursor()
        
        cursor.execute('SELECT * FROM menu_items WHERE restaurant_id = ? AND is_available = 1', (restaurant_id,))
        rows = cursor.fetchall()
        conn.close()
        
        menu_items = []
        for row in rows:
            menu_items.append(MenuItem(
                id=row[0],
                restaurant_id=row[1],
                name=row[2],
                description=row[3],
                price=row[4],
                category=row[5],
                is_available=bool(row[6])
            ))
        
        return menu_items
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get menu: {str(e)}")

@router.post("/{restaurant_id}/orders", response_model=Order)
async def create_order(restaurant_id: int, order: Order):
    """Create a new order for a restaurant"""
    try:
        import json
        
        conn = sqlite3.connect('dealndone.db', check_same_thread=False)
        cursor = conn.cursor()
        
        # Convert items to JSON string
        items_json = json.dumps(order.items)
        
        cursor.execute('''
            INSERT INTO restaurant_orders (restaurant_id, customer_name, customer_phone, items, total_amount, status)
            VALUES (?, ?, ?, ?, ?, ?)
        ''', (restaurant_id, order.customer_name, order.customer_phone, 
              items_json, order.total_amount, order.status))
        
        order_id = cursor.lastrowid
        conn.commit()
        conn.close()
        
        order.id = order_id
        order.restaurant_id = restaurant_id
        order.order_time = datetime.now()
        return order
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to create order: {str(e)}")

@router.get("/{restaurant_id}/orders", response_model=List[Order])
async def get_restaurant_orders(restaurant_id: int):
    """Get all orders for a restaurant"""
    try:
        import json
        
        conn = sqlite3.connect('dealndone.db', check_same_thread=False)
        cursor = conn.cursor()
        
        cursor.execute('SELECT * FROM restaurant_orders WHERE restaurant_id = ? ORDER BY order_time DESC', (restaurant_id,))
        rows = cursor.fetchall()
        conn.close()
        
        orders = []
        for row in rows:
            orders.append(Order(
                id=row[0],
                restaurant_id=row[1],
                customer_name=row[2],
                customer_phone=row[3],
                items=json.loads(row[4]),
                total_amount=row[5],
                status=row[6],
                order_time=datetime.fromisoformat(row[7]) if row[7] else None
            ))
        
        return orders
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get orders: {str(e)}")

@router.put("/orders/{order_id}/status")
async def update_order_status(order_id: int, status: str):
    """Update order status"""
    try:
        conn = sqlite3.connect('dealndone.db', check_same_thread=False)
        cursor = conn.cursor()
        
        cursor.execute('UPDATE restaurant_orders SET status = ? WHERE id = ?', (status, order_id))
        conn.commit()
        conn.close()
        
        return {"status": "success", "message": f"Order {order_id} status updated to {status}"}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to update order status: {str(e)}")

# Restaurant pipeline status endpoint
@router.get("/pipeline/status")
async def get_pipeline_status():
    """Get restaurants pipeline status"""
    try:
        conn = sqlite3.connect('dealndone.db', check_same_thread=False)
        cursor = conn.cursor()
        
        # Get restaurant count
        cursor.execute('SELECT COUNT(*) FROM restaurants WHERE is_active = 1')
        restaurant_count = cursor.fetchone()[0]
        
        # Get order count
        cursor.execute('SELECT COUNT(*) FROM restaurant_orders')
        order_count = cursor.fetchone()[0]
        
        # Get menu item count
        cursor.execute('SELECT COUNT(*) FROM menu_items WHERE is_available = 1')
        menu_item_count = cursor.fetchone()[0]
        
        conn.close()
        
        return {
            "pipeline": "restaurants",
            "status": "active",
            "restaurants_count": restaurant_count,
            "orders_count": order_count,
            "menu_items_count": menu_item_count,
            "last_updated": datetime.now().isoformat()
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get pipeline status: {str(e)}") 