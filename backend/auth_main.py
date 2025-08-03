from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import sqlite3
from pydantic import BaseModel, EmailStr
from typing import List, Optional, Dict, Any
from datetime import datetime, timedelta
import jwt
import bcrypt
import secrets
from enum import Enum

app = FastAPI(title="DealNDone POS API", version="2.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Security
security = HTTPBearer()
SECRET_KEY = "your-super-secret-key-change-in-production"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

# Enums for better type safety
class PlanType(str, Enum):
    BASIC = "basic"
    PROFESSIONAL = "professional"
    ENTERPRISE = "enterprise"
    CUSTOM = "custom"

class UserRole(str, Enum):
    OWNER = "owner"
    MANAGER = "manager"
    EMPLOYEE = "employee"

# Database connection
def get_db():
    conn = sqlite3.connect("dealndone_auth.db", check_same_thread=False)
    conn.row_factory = sqlite3.Row
    return conn

# Pydantic models
class UserSignup(BaseModel):
    business_name: str
    email: EmailStr
    password: str
    confirm_password: str
    plan_type: PlanType
    subdomain: str
    phone: Optional[str] = None
    address: Optional[str] = None

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str
    user_info: Dict[str, Any]

class User(BaseModel):
    id: int
    business_name: str
    email: str
    plan_type: str
    subdomain: str
    phone: Optional[str]
    address: Optional[str]
    is_active: bool
    created_at: str

class PlanInfo(BaseModel):
    name: str
    price: float
    features: List[str]
    limits: Dict[str, int]

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

# Plan configurations
PLANS = {
    PlanType.BASIC: PlanInfo(
        name="Basic Plan",
        price=29.00,
        features=[
            "Up to 500 products",
            "Basic sales tracking",
            "Email support",
            "2 user accounts",
            "Basic reporting"
        ],
        limits={
            "products": 500,
            "users": 2,
            "monthly_sales": 5000
        }
    ),
    PlanType.PROFESSIONAL: PlanInfo(
        name="Professional Plan", 
        price=79.00,
        features=[
            "Up to 5000 products",
            "Advanced analytics",
            "Priority support",
            "10 user accounts",
            "Inventory management",
            "Custom reports",
            "API access"
        ],
        limits={
            "products": 5000,
            "users": 10,
            "monthly_sales": 25000
        }
    ),
    PlanType.ENTERPRISE: PlanInfo(
        name="Enterprise Plan",
        price=199.00,
        features=[
            "Unlimited products",
            "Custom integrations",
            "24/7 phone support",
            "Unlimited users",
            "Advanced reporting",
            "Multi-location support",
            "White-label branding",
            "Dedicated account manager"
        ],
        limits={
            "products": -1,  # Unlimited
            "users": -1,     # Unlimited
            "monthly_sales": -1  # Unlimited
        }
    ),
    PlanType.CUSTOM: PlanInfo(
        name="Custom Plan",
        price=0.00,  # Contact for pricing
        features=[
            "Everything in Enterprise",
            "Custom development",
            "On-premise deployment",
            "Custom SLA",
            "Dedicated infrastructure",
            "Custom integrations"
        ],
        limits={
            "products": -1,  # Unlimited
            "users": -1,     # Unlimited
            "monthly_sales": -1  # Unlimited
        }
    )
}

# Password hashing
def hash_password(password: str) -> str:
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(password.encode('utf-8'), salt).decode('utf-8')

def verify_password(password: str, hashed: str) -> bool:
    return bcrypt.checkpw(password.encode('utf-8'), hashed.encode('utf-8'))

# JWT token functions
def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

def verify_token(credentials: HTTPAuthorizationCredentials = Depends(security)):
    try:
        payload = jwt.decode(credentials.credentials, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: int = payload.get("sub")
        if user_id is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid authentication credentials"
            )
        return user_id
    except jwt.PyJWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials"
        )

def get_current_user(user_id: int = Depends(verify_token)):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM users WHERE id = ? AND is_active = 1", (user_id,))
    user = cursor.fetchone()
    conn.close()
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found or inactive"
        )
    return dict(user)

# Initialize databases
def init_auth_db():
    conn = get_db()
    cursor = conn.cursor()
    
    # Users table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            business_name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password_hash TEXT NOT NULL,
            plan_type TEXT NOT NULL,
            subdomain TEXT UNIQUE NOT NULL,
            phone TEXT,
            address TEXT,
            is_active BOOLEAN DEFAULT 1,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    # Products table (per user)
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS products (
            id TEXT PRIMARY KEY,
            user_id INTEGER,
            name TEXT NOT NULL,
            price REAL NOT NULL,
            stock INTEGER NOT NULL,
            category TEXT DEFAULT 'clothing',
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users (id)
        )
    ''')
    
    # Sales table (per user)
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS sales (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            product_id TEXT,
            quantity INTEGER,
            total REAL,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users (id),
            FOREIGN KEY (product_id) REFERENCES products (id)
        )
    ''')
    
    conn.commit()
    conn.close()
    print("Authentication database initialized successfully!")

def init_sample_products_for_user(user_id: int):
    """Initialize sample products for a new user"""
    conn = get_db()
    cursor = conn.cursor()
    
    products = [
        ('shirt_001', user_id, 'Dress Shirt', 25.00, 50),
        ('shirt_002', user_id, 'Casual Shirt', 20.00, 30),
        ('shirt_003', user_id, 'Polo Shirt', 22.50, 25),
        ('pants_001', user_id, 'Dress Pants', 35.00, 20),
        ('jacket_001', user_id, 'Blazer', 75.00, 15)
    ]
    
    cursor.executemany(
        "INSERT OR REPLACE INTO products (id, user_id, name, price, stock) VALUES (?, ?, ?, ?, ?)",
        products
    )
    
    conn.commit()
    conn.close()

# Initialize database on startup
init_auth_db()

# Authentication endpoints
@app.post("/auth/signup", response_model=Token)
async def signup(user_data: UserSignup):
    # Validate password confirmation
    if user_data.password != user_data.confirm_password:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Passwords do not match"
        )
    
    # Validate password strength
    if len(user_data.password) < 6:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Password must be at least 6 characters long"
        )
    
    # Validate subdomain format
    if not user_data.subdomain or len(user_data.subdomain) < 3:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Subdomain must be at least 3 characters long"
        )
    
    # Clean subdomain (remove spaces, convert to lowercase, allow only alphanumeric and hyphens)
    import re
    clean_subdomain = re.sub(r'[^a-zA-Z0-9-]', '', user_data.subdomain.lower().replace(' ', '-'))
    if clean_subdomain != user_data.subdomain.lower():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Subdomain can only contain letters, numbers, and hyphens"
        )
    
    conn = get_db()
    cursor = conn.cursor()
    
    # Check if email already exists
    cursor.execute("SELECT id FROM users WHERE email = ?", (user_data.email,))
    if cursor.fetchone():
        conn.close()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Check if subdomain already exists
    cursor.execute("SELECT id FROM users WHERE subdomain = ?", (clean_subdomain,))
    if cursor.fetchone():
        conn.close()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Subdomain already taken"
        )
    
    # Hash password and create user
    password_hash = hash_password(user_data.password)
    
    cursor.execute('''
        INSERT INTO users (business_name, email, password_hash, plan_type, subdomain, phone, address)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    ''', (
        user_data.business_name,
        user_data.email,
        password_hash,
        user_data.plan_type.value,
        clean_subdomain,
        user_data.phone,
        user_data.address
    ))
    
    user_id = cursor.lastrowid
    conn.commit()
    conn.close()
    
    # Initialize sample products for new user
    init_sample_products_for_user(user_id)
    
    # Create access token
    access_token = create_access_token(data={"sub": user_id})
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user_info": {
            "id": user_id,
            "business_name": user_data.business_name,
            "email": user_data.email,
            "plan_type": user_data.plan_type.value,
            "subdomain": clean_subdomain
        }
    }

@app.post("/auth/login", response_model=Token)
async def login(user_data: UserLogin):
    conn = get_db()
    cursor = conn.cursor()
    
    cursor.execute(
        "SELECT id, business_name, email, password_hash, plan_type, is_active FROM users WHERE email = ?",
        (user_data.email,)
    )
    user = cursor.fetchone()
    conn.close()
    
    if not user or not verify_password(user_data.password, user['password_hash']):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )
    
    if not user['is_active']:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Account is deactivated. Please contact support."
        )
    
    # Create access token
    access_token = create_access_token(data={"sub": user['id']})
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user_info": {
            "id": user['id'],
            "business_name": user['business_name'],
            "email": user['email'],
            "plan_type": user['plan_type']
        }
    }

# User and subscription endpoints
@app.get("/auth/me", response_model=User)
async def get_current_user_info(current_user: dict = Depends(get_current_user)):
    return User(
        id=current_user['id'],
        business_name=current_user['business_name'],
        email=current_user['email'],
        plan_type=current_user['plan_type'],
        subdomain=current_user['subdomain'],
        phone=current_user['phone'],
        address=current_user['address'],
        is_active=current_user['is_active'],
        created_at=current_user['created_at']
    )

@app.get("/plans")
async def get_plans():
    return {plan.value: plan_info.dict() for plan, plan_info in PLANS.items()}

@app.get("/auth/check-subdomain/{subdomain}")
async def check_subdomain(subdomain: str):
    # Clean subdomain (same logic as signup)
    import re
    clean_subdomain = re.sub(r'[^a-zA-Z0-9-]', '', subdomain.lower().replace(' ', '-'))
    
    # Validate format
    if not clean_subdomain or len(clean_subdomain) < 3:
        return {
            "available": False,
            "message": "Subdomain must be at least 3 characters long",
            "suggested": None
        }
    
    # Check if available
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT id FROM users WHERE subdomain = ?", (clean_subdomain,))
    exists = cursor.fetchone()
    conn.close()
    
    if exists:
        # Generate suggestion
        import random
        suggestions = [
            f"{clean_subdomain}{random.randint(10, 99)}",
            f"{clean_subdomain}-store",
            f"{clean_subdomain}-shop",
            f"my-{clean_subdomain}"
        ]
        return {
            "available": False,
            "message": "Subdomain already taken",
            "suggested": suggestions[0]
        }
    
    return {
        "available": True,
        "message": "Subdomain available",
        "suggested": None
    }

@app.get("/subscription")
async def get_subscription(current_user: dict = Depends(get_current_user)):
    plan_info = PLANS[PlanType(current_user['plan_type'])]
    
    # Get usage statistics
    conn = get_db()
    cursor = conn.cursor()
    
    # Count products for this user
    cursor.execute("SELECT COUNT(*) FROM products WHERE user_id = ?", (current_user['id'],))
    product_count = cursor.fetchone()[0]
    
    # Count sales for this month
    cursor.execute("""
        SELECT COUNT(*) FROM sales 
        WHERE user_id = ? AND date(timestamp) >= date('now', 'start of month')
    """, (current_user['id'],))
    monthly_sales = cursor.fetchone()[0]
    
    # For now, user count is 1 (could be extended for multi-user support)
    user_count = 1
    
    conn.close()
    
    return {
        "current_plan": current_user['plan_type'],
        "plan_details": plan_info.dict(),
        "user_info": {
            "business_name": current_user['business_name'],
            "email": current_user['email'],
            "subdomain": current_user['subdomain'],
            "created_at": current_user['created_at']
        },
        "usage": {
            "products": product_count,
            "users": user_count,
            "monthly_sales": monthly_sales
        }
    }

@app.put("/subscription/upgrade")
async def upgrade_subscription(
    request: dict,
    current_user: dict = Depends(get_current_user)
):
    new_plan = PlanType(request.get("new_plan"))
    conn = get_db()
    cursor = conn.cursor()
    
    cursor.execute(
        "UPDATE users SET plan_type = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?",
        (new_plan.value, current_user['id'])
    )
    
    conn.commit()
    conn.close()
    
    return {
        "message": f"Successfully upgraded to {PLANS[new_plan].name}",
        "new_plan": new_plan.value,
        "plan_details": PLANS[new_plan].dict()
    }

# Protected POS endpoints
@app.get("/health")
async def health_check():
    return {"status": "healthy", "timestamp": datetime.now().isoformat()}

@app.get("/products")
async def get_products(current_user: dict = Depends(get_current_user)):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM products WHERE user_id = ? AND stock > 0", (current_user['id'],))
    products = [dict(row) for row in cursor.fetchall()]
    conn.close()
    return {"products": products}

@app.get("/products/{product_id}")
async def get_product(product_id: str, current_user: dict = Depends(get_current_user)):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM products WHERE id = ? AND user_id = ?", (product_id, current_user['id']))
    product = cursor.fetchone()
    conn.close()
    
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    return dict(product)

@app.post("/sales", response_model=SaleResponse)
async def process_sale(sale: SaleRequest, current_user: dict = Depends(get_current_user)):
    conn = get_db()
    cursor = conn.cursor()
    
    try:
        total = 0.0
        items_processed = 0
        sale_details = []
        
        # Check plan limits
        plan_limits = PLANS[PlanType(current_user['plan_type'])].limits
        if plan_limits.get("monthly_sales", -1) != -1:
            # Check monthly sales count (simplified check)
            cursor.execute('''
                SELECT COUNT(*) as sales_count FROM sales 
                WHERE user_id = ? AND date(timestamp) >= date('now', 'start of month')
            ''', (current_user['id'],))
            monthly_sales = cursor.fetchone()['sales_count']
            
            if monthly_sales >= plan_limits["monthly_sales"]:
                conn.close()
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail=f"Monthly sales limit ({plan_limits['monthly_sales']}) reached. Please upgrade your plan."
                )
        
        # Process each item in the sale
        for item in sale.items:
            # Get product details
            cursor.execute(
                "SELECT name, price, stock FROM products WHERE id = ? AND user_id = ?",
                (item.id, current_user['id'])
            )
            product = cursor.fetchone()
            
            if not product:
                conn.close()
                raise HTTPException(status_code=404, detail=f"Product {item.id} not found")
            
            name, price, stock = product['name'], product['price'], product['stock']
            
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
                "UPDATE products SET stock = stock - ? WHERE id = ? AND user_id = ?", 
                (item.quantity, item.id, current_user['id'])
            )
            
            # Record sale
            cursor.execute(
                "INSERT INTO sales (user_id, product_id, quantity, total) VALUES (?, ?, ?, ?)",
                (current_user['id'], item.id, item.quantity, item_total)
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

@app.get("/sales/history")
async def get_sales_history(current_user: dict = Depends(get_current_user)):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("""
        SELECT s.*, p.name as product_name 
        FROM sales s 
        JOIN products p ON s.product_id = p.id 
        WHERE s.user_id = ?
        ORDER BY s.timestamp DESC 
        LIMIT 50
    """, (current_user['id'],))
    sales = [dict(row) for row in cursor.fetchall()]
    conn.close()
    return {"sales": sales}

if __name__ == "__main__":
    import uvicorn
    print("Starting DealNDone POS Server with Authentication...")
    print("Signup: POST /auth/signup")
    print("Login: POST /auth/login") 
    print("Frontend should be accessible at: http://localhost:3000")
    print("API Health Check: http://localhost:8001/health")
    uvicorn.run(app, host="0.0.0.0", port=8002)
