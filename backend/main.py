# Add FastAPI endpoint for shirt sales

from fastapi import FastAPI, HTTPException, Depends, Request, WebSocket, WebSocketDisconnect, Header
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
import sqlite3
import json
from datetime import datetime, timedelta
import random
import os
from dotenv import load_dotenv
from settings import settings_manager, GlobalSetting, OrganizationSetting, UserPreference, AuditLog, FeatureFlag
from security_middleware import require_authentication, require_mfa, require_role, require_permission
from subdomain_middleware import get_store_context, require_store_access, get_store_limits, check_store_limit
import json
import traceback
import re
import hashlib
import secrets
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import redis
import jwt

# Load environment variables
load_dotenv()

# Import franchise endpoints
try:
    from franchise_endpoints import router as franchise_router
    FRANCHISE_AVAILABLE = True
except ImportError:
    FRANCHISE_AVAILABLE = False
    print("Warning: Franchise endpoints not available.")

app = FastAPI(title="Deal n Done API", version="1.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:3001", 
        "http://localhost:3002",
        "http://localhost:3003",
        "http://localhost:3004",
        "http://localhost:3005",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:3001",
        "http://127.0.0.1:3002",
        "http://127.0.0.1:3003",
        "http://127.0.0.1:3004",
        "http://127.0.0.1:3005"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Redis for rate limiting (MCP Feature)
try:
    redis_client = redis.Redis(host='localhost', port=6379, db=0, decode_responses=True)
    redis_client.ping()  # Test connection
    REDIS_AVAILABLE = True
except:
    REDIS_AVAILABLE = False
    print("Warning: Redis not available. Rate limiting will be disabled.")

# JWT Secret Key (MCP Security)
SECRET_KEY = os.getenv("JWT_SECRET_KEY", "your-secret-key-change-in-production")

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

# Settings API Models
class SettingsResponse(BaseModel):
    key: str
    value: Any
    source: str  # "user", "organization", "global", "default"
    encrypted: bool = False
    description: Optional[str] = None

class SettingsUpdateRequest(BaseModel):
    value: Any
    encrypted: bool = False
    description: Optional[str] = None

# New Settings Models for Store Settings
class StoreSettings(BaseModel):
    store_name: str
    store_url: str
    business_type: str
    plan_type: str
    email: str
    phone: Optional[str] = None
    address: Optional[str] = None
    website: Optional[str] = None
    timezone: str = "America/New_York"
    currency: str = "USD"
    language: str = "English"
    tax_rate: float = 8.5
    business_hours: Dict[str, Dict[str, Any]] = {}
    receipt_header: str = ""
    receipt_footer: str = ""
    notifications: Dict[str, bool] = {}
    system_settings: Dict[str, Any] = {}

class PlanLimits(BaseModel):
    outlets: Dict[str, int]  # {"limit": 1, "used": 0}
    products: Dict[str, int]  # {"limit": 1000, "used": 0}
    employees: Dict[str, int]  # {"limit": 3, "used": 1}
    storage: Dict[str, int]  # {"limit": 10, "used": 2} GB
    api_calls: Dict[str, int]  # {"limit": 10000, "used": 1500}

class StoreSettingsUpdateRequest(BaseModel):
    settings: Dict[str, Any]
    section: str  # "store_info", "regional", "business_hours", "receipts", "notifications", "system"

# MCP Models (Management Control Plane)
class MCPResourceRequest(BaseModel):
    org_id: str
    resource_type: str  # "settings", "inventory", "customers"

class MCPToolRequest(BaseModel):
    org_id: str
    tool_name: str  # "create_outlet", "send_email", "update_setting"
    parameters: Dict[str, Any]

class MCPAuditLog(BaseModel):
    org_id: str
    user_id: str
    action: str
    resource_type: str
    resource_id: str
    details: str
    success: bool
    timestamp: str

class AuditLogResponse(BaseModel):
    user_id: Optional[str]
    action: str
    resource_type: str
    resource_id: str
    old_value: Optional[Any]
    new_value: Optional[Any]
    ip_address: Optional[str]
    user_agent: Optional[str]
    created_at: str

class FeatureFlagResponse(BaseModel):
    flag_name: str
    enabled: bool
    rollout_percentage: float
    targeting_rules: Optional[Dict] = None

# Authentication Models
class SignupRequest(BaseModel):
    storeName: str
    email: str
    phone: Optional[str] = None
    businessType: str
    planType: str
    password: str
    confirmPassword: str
    agreeToTerms: bool

class LoginRequest(BaseModel):
    identifier: str  # Can be store_name, email, or username
    password: str

class SubdomainCheckRequest(BaseModel):
    storeName: str

class User(BaseModel):
    id: str
    email: str
    storeName: str
    businessType: str
    planType: str
    role: str
    created_at: str
    email_verified: bool = False
    subdomain: Optional[str] = None

# Helper function to get user info from request
def get_user_info(request: Request) -> Dict[str, str]:
    """Extract user information from request headers or JWT token"""
    try:
        # For now, we'll use a simple approach
        # In production, you'd decode JWT tokens here
        auth_header = request.headers.get("Authorization")
        if auth_header and auth_header.startswith("Bearer "):
            # Decode JWT token here
            pass
        
        # Fallback to basic auth or session
        return {
            "user_id": request.headers.get("X-User-ID", "default_user"),
            "org_id": request.headers.get("X-Org-ID", "default_org"),
            "store_name": request.headers.get("X-Store-Name", "default_store")
        }
    except Exception as e:
        print(f"Error getting user info: {e}")
        return {
            "user_id": "default_user",
            "org_id": "default_org", 
            "store_name": "default_store"
        }

# MCP Helper Functions
def validate_mcp_request(authorization: str, org_id: str, user_id: str) -> Dict[str, Any]:
    """
    Validate MCP request with JWT token and rate limiting
    Returns: Decoded JWT payload if valid
    Raises: HTTPException if invalid
    """
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(401, "Missing or invalid authorization header")
    
    try:
        token = authorization.replace("Bearer ", "")
        payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        
        if payload.get("user_id") != user_id:
            raise HTTPException(403, "User ID mismatch")
        
        if payload.get("org_id") != org_id:
            raise HTTPException(403, "Organization ID mismatch")
            
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(401, "Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(401, "Invalid token")

def check_rate_limit(user_id: str, limit: int = 100, window: int = 60) -> bool:
    """
    Check rate limiting for MCP requests
    Returns: True if within limit, False if exceeded
    """
    if not REDIS_AVAILABLE:
        return True  # Skip rate limiting if Redis not available
    
    try:
        rate_key = f"mcp_rate:{user_id}"
        current_count = redis_client.get(rate_key)
        
        if current_count and int(current_count) >= limit:
            return False
        
        # Increment counter
        redis_client.incr(rate_key)
        redis_client.expire(rate_key, window)
        return True
    except Exception as e:
        print(f"Rate limiting error: {e}")
        return True  # Allow request if rate limiting fails

async def log_mcp_audit_action(
    org_id: str, 
    user_id: str, 
    action: str, 
    resource_type: str, 
    resource_id: str, 
    details: str, 
    success: bool
):
    """
    Log MCP audit action to database
    """
    try:
        conn = get_db()
        cursor = conn.cursor()
        
        cursor.execute('''
            INSERT INTO audit_logs (org_id, user_id, action, resource_type, resource_id, new_value, created_at)
            VALUES (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
        ''', (org_id, user_id, action, resource_type, resource_id, details))
        
        conn.commit()
        conn.close()
    except Exception as e:
        print(f"Error logging MCP audit action: {e}")

def extract_outlet_name(message: str) -> Optional[str]:
    """
    Extract outlet name from natural language message
    Example: "create outlet downtown" -> "downtown"
    """
    import re
    
    # Common patterns for outlet creation
    patterns = [
        r"create outlet (\w+)",
        r"add outlet (\w+)",
        r"new outlet (\w+)",
        r"outlet (\w+)"
    ]
    
    for pattern in patterns:
        match = re.search(pattern, message.lower())
        if match:
            return match.group(1).title()
    
    return None

def get_user_token(user_id: str) -> str:
    """
    Generate JWT token for user (mock implementation)
    In production, this would use proper JWT generation
    """
    payload = {
        "user_id": user_id,
        "org_id": "org_1584dcb8b2679a87",  # Mock org ID
        "exp": datetime.utcnow() + timedelta(hours=24)
    }
    return jwt.encode(payload, SECRET_KEY, algorithm="HS256")

# Database initialization
def init_db():
    conn = get_db()
    cursor = conn.cursor()
    
    # Create users table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id TEXT PRIMARY KEY,
            email TEXT UNIQUE NOT NULL,
            store_name TEXT UNIQUE NOT NULL,
            business_type TEXT NOT NULL,
            plan_type TEXT NOT NULL DEFAULT 'free',
            password_hash TEXT NOT NULL,
            role TEXT NOT NULL DEFAULT 'retailer',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            email_verified BOOLEAN DEFAULT FALSE,
            subdomain TEXT
        )
    ''')
    
    # Create organizations table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS organizations (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            store_name TEXT UNIQUE NOT NULL,
            business_type TEXT NOT NULL,
            plan_type TEXT NOT NULL DEFAULT 'free',
            owner_id TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            subdomain TEXT,
            FOREIGN KEY (owner_id) REFERENCES users (id)
        )
    ''')
    
    # Create usage_tracking table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS usage_tracking (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            org_id TEXT NOT NULL,
            feature TEXT NOT NULL,
            current_usage INTEGER DEFAULT 0,
            limit_value INTEGER DEFAULT 0,
            last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (org_id) REFERENCES organizations (id)
        )
    ''')
    
    # Create store_settings table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS store_settings (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            org_id TEXT NOT NULL,
            section TEXT NOT NULL,
            key TEXT NOT NULL,
            value TEXT,
            encrypted BOOLEAN DEFAULT FALSE,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (org_id) REFERENCES organizations (id),
            UNIQUE(org_id, section, key)
        )
    ''')
    
    # Create audit_logs table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS audit_logs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id TEXT,
            org_id TEXT NOT NULL,
            action TEXT NOT NULL,
            resource_type TEXT NOT NULL,
            resource_id TEXT NOT NULL,
            old_value TEXT,
            new_value TEXT,
            ip_address TEXT,
            user_agent TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (org_id) REFERENCES organizations (id)
        )
    ''')
    
    # Create feature_flags table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS feature_flags (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            flag_name TEXT UNIQUE NOT NULL,
            enabled BOOLEAN DEFAULT FALSE,
            rollout_percentage REAL DEFAULT 0.0,
            targeting_rules TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    # Create products table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS products (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            org_id TEXT NOT NULL,
            name TEXT NOT NULL,
            price REAL NOT NULL,
            category TEXT,
            stock INTEGER DEFAULT 0,
            image TEXT,
            barcode TEXT,
            sku TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (org_id) REFERENCES organizations (id)
        )
    ''')
    
    # Create orders table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS orders (
            id TEXT PRIMARY KEY,
            org_id TEXT NOT NULL,
            customer_name TEXT,
            items TEXT NOT NULL,
            total REAL NOT NULL,
            status TEXT DEFAULT 'pending',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (org_id) REFERENCES organizations (id)
        )
    ''')
    
    # Create inventory_locations table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS inventory_locations (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            org_id TEXT NOT NULL,
            product_id TEXT NOT NULL,
            location TEXT NOT NULL,
            stock INTEGER DEFAULT 0,
            last_counted TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (org_id) REFERENCES organizations (id)
        )
    ''')
    
    # Create stock_taking_sessions table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS stock_taking_sessions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            org_id TEXT NOT NULL,
            session_id TEXT UNIQUE NOT NULL,
            taken_by TEXT NOT NULL,
            status TEXT DEFAULT 'in_progress',
            started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            completed_at TIMESTAMP,
            FOREIGN KEY (org_id) REFERENCES organizations (id)
        )
    ''')
    
    # Create stock_taking_items table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS stock_taking_items (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            session_id TEXT NOT NULL,
            product_id TEXT NOT NULL,
            expected_quantity INTEGER,
            actual_quantity INTEGER,
            difference INTEGER,
            notes TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (session_id) REFERENCES stock_taking_sessions (session_id)
        )
    ''')
    
    conn.commit()
    conn.close()

# Password hashing with bcrypt
def hash_password(password: str) -> str:
    """Hash password using bcrypt"""
    import bcrypt
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(password.encode('utf-8'), salt).decode('utf-8')

def verify_password(password: str, hashed: str) -> bool:
    """Verify password using bcrypt"""
    import bcrypt
    return bcrypt.checkpw(password.encode('utf-8'), hashed.encode('utf-8'))

def generate_user_id() -> str:
    return f"user_{secrets.token_hex(8)}"

def generate_org_id() -> str:
    return f"org_{secrets.token_hex(8)}"

def validate_subdomain(store_name: str) -> bool:
    """Validate subdomain format and reserved names"""
    if not store_name:
        return False
    
    # Check length
    if len(store_name) < 3 or len(store_name) > 63:
        return False
    
    # Check format (alphanumeric and hyphens only)
    if not re.match(r'^[a-z0-9-]+$', store_name):
        return False
    
    # Check for reserved names
    reserved_names = {
        'www', 'api', 'admin', 'login', 'logout', 'signup', 'signin',
        'mail', 'ftp', 'smtp', 'pop', 'imap', 'ns1', 'ns2', 'dns',
        'test', 'dev', 'staging', 'prod', 'app', 'web', 'mobile',
        'support', 'help', 'docs', 'blog', 'news', 'forum', 'shop',
        'store', 'cart', 'checkout', 'payment', 'billing', 'account',
        'profile', 'settings', 'dashboard', 'analytics', 'reports'
    }
    
    if store_name.lower() in reserved_names:
        return False
    
    return True

def get_plan_limits(plan_type: str) -> Dict[str, int]:
    """Get feature limits for a plan type"""
    limits = {
        'basic': {
            'outlets': 1,
            'products': 500,
            'employees': 2,
            'storage': 5,  # GB
            'api_calls': 10000,
            'price': 29
        },
        'professional': {
            'outlets': 3,
            'products': 5000,
            'employees': 10,
            'storage': 20,  # GB
            'api_calls': 50000,
            'price': 79
        },
        'enterprise': {
            'outlets': 10,
            'products': -1,  # Unlimited
            'employees': -1,  # Unlimited
            'storage': 100,  # GB
            'api_calls': 100000,
            'price': 199
        },
        'custom': {
            'outlets': -1,  # Unlimited
            'products': -1,  # Unlimited
            'employees': -1,  # Unlimited
            'storage': -1,  # Unlimited
            'api_calls': -1,  # Unlimited
            'price': 0  # Contact for pricing
        }
    }
    
    return limits.get(plan_type, limits['basic'])

# Email verification functions
def send_verification_email(email: str, token: str, store_name: str) -> bool:
    """Send verification email (mock implementation)"""
    try:
        # In production, use a real email service like SendGrid
        print(f"Verification email sent to {email} for store {store_name}")
        print(f"Token: {token}")
        return True
    except Exception as e:
        print(f"Error sending verification email: {e}")
        return False

def verify_email_token(token: str) -> Optional[str]:
    """Verify email token (mock implementation)"""
    try:
        # In production, verify against stored tokens
        # For now, just return a mock user ID
        return "user_verified"
    except Exception as e:
        print(f"Error verifying email token: {e}")
        return None

# Initialize database
init_db()

# Settings API endpoints
@app.get("/api/settings/global", response_model=List[SettingsResponse])
async def get_global_settings(user: dict = Depends(require_authentication)):
    """Get global settings"""
    try:
        conn = get_db()
        cursor = conn.cursor()
        
        cursor.execute('''
            SELECT key, value, 'global' as source, encrypted, description
            FROM store_settings 
            WHERE org_id = 'global' AND section = 'global'
        ''')
        
        settings = []
        for row in cursor.fetchall():
            settings.append(SettingsResponse(
                key=row['key'],
                value=json.loads(row['value']) if row['value'] else None,
                source=row['source'],
                encrypted=bool(row['encrypted']),
                description=row['description']
            ))
        
        conn.close()
        return settings
    except Exception as e:
        print(f"Error getting global settings: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

@app.put("/api/settings/global/{key}")
async def update_global_setting(
    key: str, 
    request: SettingsUpdateRequest, 
    req: Request,
    user: dict = Depends(require_permission("settings"))
):
    """Update global setting"""
    try:
        conn = get_db()
        cursor = conn.cursor()
        
        # Check if setting exists
        cursor.execute('''
            SELECT value FROM store_settings 
            WHERE org_id = 'global' AND section = 'global' AND key = ?
        ''', (key,))
        
        existing = cursor.fetchone()
        old_value = existing['value'] if existing else None
        
        # Insert or update setting
        cursor.execute('''
            INSERT OR REPLACE INTO store_settings (org_id, section, key, value, encrypted, description, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
        ''', ('global', 'global', key, json.dumps(request.value), request.encrypted, request.description))
        
        # Log the change
        cursor.execute('''
            INSERT INTO audit_logs (user_id, org_id, action, resource_type, resource_id, old_value, new_value, ip_address, user_agent)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (
            user.get('user_id'), 'global', 'UPDATE', 'setting', key,
            old_value, json.dumps(request.value),
            req.client.host, req.headers.get('user-agent')
        ))
        
        conn.commit()
        conn.close()
        
        return {"success": True, "message": "Setting updated successfully"}
    except Exception as e:
        print(f"Error updating global setting: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

@app.get("/api/settings/organization/{org_id}", response_model=List[SettingsResponse])
async def get_organization_settings(org_id: str):
    """Get organization settings"""
    try:
        conn = get_db()
        cursor = conn.cursor()
        
        cursor.execute('''
            SELECT key, value, 'organization' as source, encrypted, description
            FROM store_settings 
            WHERE org_id = ? AND section != 'global'
        ''', (org_id,))
        
        settings = []
        for row in cursor.fetchall():
            settings.append(SettingsResponse(
                key=row['key'],
                value=json.loads(row['value']) if row['value'] else None,
                source=row['source'],
                encrypted=bool(row['encrypted']),
                description=row['description']
            ))
        
        conn.close()
        return settings
    except Exception as e:
        print(f"Error getting organization settings: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

@app.put("/api/settings/organization/{org_id}/{key}")
async def update_organization_setting(org_id: str, key: str, request: SettingsUpdateRequest, req: Request):
    """Update organization setting"""
    try:
        conn = get_db()
        cursor = conn.cursor()
        
        # Check if setting exists
        cursor.execute('''
            SELECT value FROM store_settings 
            WHERE org_id = ? AND key = ?
        ''', (org_id, key))
        
        existing = cursor.fetchone()
        old_value = existing['value'] if existing else None
        
        # Insert or update setting
        cursor.execute('''
            INSERT OR REPLACE INTO store_settings (org_id, section, key, value, encrypted, description, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
        ''', (org_id, 'organization', key, json.dumps(request.value), request.encrypted, request.description))
        
        # Log the change
        cursor.execute('''
            INSERT INTO audit_logs (user_id, org_id, action, resource_type, resource_id, old_value, new_value, ip_address, user_agent)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (
            'system', org_id, 'UPDATE', 'setting', key,
            old_value, json.dumps(request.value),
            req.client.host, req.headers.get('user-agent')
        ))
        
        conn.commit()
        conn.close()
        
        return {"success": True, "message": "Setting updated successfully"}
    except Exception as e:
        print(f"Error updating organization setting: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

@app.get("/api/settings/user/{user_id}", response_model=List[SettingsResponse])
async def get_user_preferences(user_id: str):
    """Get user preferences"""
    try:
        conn = get_db()
        cursor = conn.cursor()
        
        cursor.execute('''
            SELECT key, value, 'user' as source, encrypted, description
            FROM store_settings 
            WHERE org_id = ? AND section = 'user'
        ''', (user_id,))
        
        settings = []
        for row in cursor.fetchall():
            settings.append(SettingsResponse(
                key=row['key'],
                value=json.loads(row['value']) if row['value'] else None,
                source=row['source'],
                encrypted=bool(row['encrypted']),
                description=row['description']
            ))
        
        conn.close()
        return settings
    except Exception as e:
        print(f"Error getting user preferences: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

@app.put("/api/settings/user/{user_id}/{key}")
async def update_user_preference(user_id: str, key: str, request: SettingsUpdateRequest, req: Request):
    """Update user preference"""
    try:
        conn = get_db()
        cursor = conn.cursor()
        
        # Check if setting exists
        cursor.execute('''
            SELECT value FROM store_settings 
            WHERE org_id = ? AND section = 'user' AND key = ?
        ''', (user_id, key))
        
        existing = cursor.fetchone()
        old_value = existing['value'] if existing else None
        
        # Insert or update setting
        cursor.execute('''
            INSERT OR REPLACE INTO store_settings (org_id, section, key, value, encrypted, description, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
        ''', (user_id, 'user', key, json.dumps(request.value), request.encrypted, request.description))
        
        # Log the change
        cursor.execute('''
            INSERT INTO audit_logs (user_id, org_id, action, resource_type, resource_id, old_value, new_value, ip_address, user_agent)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (
            user_id, user_id, 'UPDATE', 'preference', key,
            old_value, json.dumps(request.value),
            req.client.host, req.headers.get('user-agent')
        ))
        
        conn.commit()
        conn.close()
        
        return {"success": True, "message": "Preference updated successfully"}
    except Exception as e:
        print(f"Error updating user preference: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

@app.get("/api/settings/resolved/{org_id}/{key}")
async def get_resolved_setting(org_id: str, key: str, user_id: Optional[str] = None):
    """Get resolved setting value (user > org > global > default)"""
    try:
        conn = get_db()
        cursor = conn.cursor()
        
        # Check user preference first
        if user_id:
            cursor.execute('''
                SELECT value FROM store_settings 
                WHERE org_id = ? AND section = 'user' AND key = ?
            ''', (user_id, key))
            user_setting = cursor.fetchone()
            if user_setting:
                return {"value": json.loads(user_setting['value']), "source": "user"}
        
        # Check organization setting
        cursor.execute('''
            SELECT value FROM store_settings 
            WHERE org_id = ? AND key = ?
        ''', (org_id, key))
        org_setting = cursor.fetchone()
        if org_setting:
            return {"value": json.loads(org_setting['value']), "source": "organization"}
        
        # Check global setting
        cursor.execute('''
            SELECT value FROM store_settings 
            WHERE org_id = 'global' AND section = 'global' AND key = ?
        ''', (key,))
        global_setting = cursor.fetchone()
        if global_setting:
            return {"value": json.loads(global_setting['value']), "source": "global"}
        
        conn.close()
        return {"value": None, "source": "default"}
    except Exception as e:
        print(f"Error getting resolved setting: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

@app.get("/api/settings/audit-logs/{org_id}", response_model=List[AuditLogResponse])
async def get_audit_logs(org_id: str, limit: int = 100, offset: int = 0):
    """Get audit logs for organization"""
    try:
        conn = get_db()
        cursor = conn.cursor()
        
        cursor.execute('''
            SELECT user_id, action, resource_type, resource_id, old_value, new_value, 
                   ip_address, user_agent, created_at
            FROM audit_logs 
            WHERE org_id = ? 
            ORDER BY created_at DESC 
            LIMIT ? OFFSET ?
        ''', (org_id, limit, offset))
        
        logs = []
        for row in cursor.fetchall():
            logs.append(AuditLogResponse(
                user_id=row['user_id'],
                action=row['action'],
                resource_type=row['resource_type'],
                resource_id=row['resource_id'],
                old_value=row['old_value'],
                new_value=row['new_value'],
                ip_address=row['ip_address'],
                user_agent=row['user_agent'],
                created_at=row['created_at']
            ))
        
        conn.close()
        return logs
    except Exception as e:
        print(f"Error getting audit logs: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

@app.get("/api/settings/feature-flags", response_model=List[FeatureFlagResponse])
async def get_feature_flags():
    """Get all feature flags"""
    try:
        conn = get_db()
        cursor = conn.cursor()
        
        cursor.execute('''
            SELECT flag_name, enabled, rollout_percentage, targeting_rules
            FROM feature_flags
        ''')
        
        flags = []
        for row in cursor.fetchall():
            flags.append(FeatureFlagResponse(
                flag_name=row['flag_name'],
                enabled=bool(row['enabled']),
                rollout_percentage=float(row['rollout_percentage']),
                targeting_rules=json.loads(row['targeting_rules']) if row['targeting_rules'] else None
            ))
        
        conn.close()
        return flags
    except Exception as e:
        print(f"Error getting feature flags: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

@app.post("/api/settings/feature-flags")
async def create_feature_flag(flag: FeatureFlag):
    """Create a new feature flag"""
    try:
        conn = get_db()
        cursor = conn.cursor()
        
        cursor.execute('''
            INSERT INTO feature_flags (flag_name, enabled, rollout_percentage, targeting_rules)
            VALUES (?, ?, ?, ?)
        ''', (flag.flag_name, flag.enabled, flag.rollout_percentage, json.dumps(flag.targeting_rules)))
        
        conn.commit()
        conn.close()
        
        return {"success": True, "message": "Feature flag created successfully"}
    except Exception as e:
        print(f"Error creating feature flag: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

@app.get("/api/settings/feature-flags/{flag_name}/check/{org_id}")
async def check_feature_flag(flag_name: str, org_id: str):
    """Check if a feature flag is enabled for an organization"""
    try:
        conn = get_db()
        cursor = conn.cursor()
        
        cursor.execute('''
            SELECT enabled, rollout_percentage, targeting_rules
            FROM feature_flags 
            WHERE flag_name = ?
        ''', (flag_name,))
        
        flag = cursor.fetchone()
        if not flag:
            return {"enabled": False, "reason": "Flag not found"}
        
        enabled = bool(flag['enabled'])
        rollout_percentage = float(flag['rollout_percentage'])
        targeting_rules = json.loads(flag['targeting_rules']) if flag['targeting_rules'] else None
        
        # Simple rollout logic (in production, use more sophisticated targeting)
        if enabled and rollout_percentage > 0:
            # Use org_id hash to determine if org gets the feature
            org_hash = hash(org_id) % 100
            enabled = org_hash < rollout_percentage
        
        conn.close()
        return {"enabled": enabled, "rollout_percentage": rollout_percentage}
    except Exception as e:
        print(f"Error checking feature flag: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

# Health check endpoint
@app.get("/health")
async def health_check():
    return {"status": "healthy", "timestamp": datetime.now().isoformat()}

# Store information endpoints
@app.get("/api/store/info")
async def get_store_info(request: Request):
    """Get store information based on subdomain"""
    try:
        context = get_store_context(request)
        if not context.get("is_subdomain"):
            raise HTTPException(status_code=400, detail="Not a subdomain request")
        
        store_name = context.get("store_name")
        if not store_name:
            raise HTTPException(status_code=404, detail="Store not found")
        
        conn = get_db()
        cursor = conn.cursor()
        
        # Get organization info
        cursor.execute('''
            SELECT o.*, u.email, u.role
            FROM organizations o
            JOIN users u ON o.owner_id = u.id
            WHERE o.store_name = ?
        ''', (store_name,))
        
        org = cursor.fetchone()
        if not org:
            raise HTTPException(status_code=404, detail="Store not found")
        
        # Get plan limits
        plan_limits = get_plan_limits(org['plan_type'])
        
        # Get current usage
        cursor.execute('''
            SELECT feature, current_usage, limit_value
            FROM usage_tracking
            WHERE org_id = ?
        ''', (org['id'],))
        
        usage = {}
        for row in cursor.fetchall():
            usage[row['feature']] = {
                "used": row['current_usage'],
                "limit": row['limit_value']
            }
        
        conn.close()
        
        return {
            "store_name": org['store_name'],
            "business_type": org['business_type'],
            "plan_type": org['plan_type'],
            "email": org['email'],
            "role": org['role'],
            "subdomain": f"{org['store_name']}.dealndone.com",
            "plan_limits": plan_limits,
            "usage": usage
        }
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error getting store info: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

@app.get("/api/store/limits")
async def get_store_limits_endpoint(request: Request):
    """Get store usage limits"""
    try:
        context = get_store_context(request)
        store_name = context.get("store_name")
        
        if not store_name:
            raise HTTPException(status_code=404, detail="Store not found")
        
        return get_store_limits(store_name)
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error getting store limits: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

@app.post("/api/store/check-limit/{feature}")
async def check_store_limit_endpoint(feature: str, request: Request):
    """Check if store can use a feature"""
    try:
        context = get_store_context(request)
        store_name = context.get("store_name")
        
        if not store_name:
            raise HTTPException(status_code=404, detail="Store not found")
        
        return check_store_limit(store_name, feature)
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error checking store limit: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

# New Store Settings API endpoints
@app.get("/api/store/settings/{org_id}")
async def get_store_settings(org_id: str):
    """Get all store settings for an organization"""
    try:
        conn = get_db()
        cursor = conn.cursor()
        
        # Get organization info
        cursor.execute('''
            SELECT o.*, u.email
            FROM organizations o
            JOIN users u ON o.owner_id = u.id
            WHERE o.id = ?
        ''', (org_id,))
        
        org = cursor.fetchone()
        if not org:
            raise HTTPException(status_code=404, detail="Organization not found")
        
        # Get all settings
        cursor.execute('''
            SELECT section, key, value, encrypted
            FROM store_settings 
            WHERE org_id = ?
            ORDER BY section, key
        ''', (org_id,))
        
        settings = {}
        for row in cursor.fetchall():
            section = row['section']
            if section not in settings:
                settings[section] = {}
            
            value = json.loads(row['value']) if row['value'] else None
            settings[section][row['key']] = {
                "value": value,
                "encrypted": bool(row['encrypted'])
            }
        
        # Get plan limits
        plan_limits = get_plan_limits(org['plan_type'])
        
        # Get current usage
        cursor.execute('''
            SELECT feature, current_usage, limit_value
            FROM usage_tracking
            WHERE org_id = ?
        ''', (org_id,))
        
        usage = {}
        for row in cursor.fetchall():
            usage[row['feature']] = {
                "used": row['current_usage'],
                "limit": row['limit_value']
            }
        
        conn.close()
        
        return {
            "store_info": {
                "store_name": org['store_name'],
                "store_url": f"{org['store_name']}.dealndone.com",
                "business_type": org['business_type'],
                "plan_type": org['plan_type'],
                "email": org['email']
            },
            "plan_limits": plan_limits,
            "usage": usage,
            "settings": settings
        }
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error getting store settings: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

@app.put("/api/store/settings/{org_id}")
async def update_store_settings(org_id: str, request: StoreSettingsUpdateRequest, req: Request):
    """Update store settings"""
    try:
        conn = get_db()
        cursor = conn.cursor()
        
        # Validate organization exists
        cursor.execute('SELECT id FROM organizations WHERE id = ?', (org_id,))
        if not cursor.fetchone():
            raise HTTPException(status_code=404, detail="Organization not found")
        
        # Update settings
        for key, value in request.settings.items():
            # Get old value for audit log
            cursor.execute('''
                SELECT value FROM store_settings 
                WHERE org_id = ? AND section = ? AND key = ?
            ''', (org_id, request.section, key))
            
            existing = cursor.fetchone()
            old_value = existing['value'] if existing else None
            
            # Insert or update setting
            cursor.execute('''
                INSERT OR REPLACE INTO store_settings (org_id, section, key, value, updated_at)
                VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)
            ''', (org_id, request.section, key, json.dumps(value)))
            
            # Log the change
            cursor.execute('''
                INSERT INTO audit_logs (user_id, org_id, action, resource_type, resource_id, old_value, new_value, ip_address, user_agent)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            ''', (
                'system', org_id, 'UPDATE', 'setting', f"{request.section}.{key}",
                old_value, json.dumps(value),
                req.client.host, req.headers.get('user-agent')
            ))
        
        conn.commit()
        conn.close()
        
        return {"success": True, "message": "Settings updated successfully"}
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error updating store settings: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

@app.get("/api/store/plan/{org_id}")
async def get_store_plan(org_id: str):
    """Get store plan information and limits"""
    try:
        conn = get_db()
        cursor = conn.cursor()
        
        # Get organization info
        cursor.execute('''
            SELECT plan_type FROM organizations WHERE id = ?
        ''', (org_id,))
        
        org = cursor.fetchone()
        if not org:
            raise HTTPException(status_code=404, detail="Organization not found")
        
        # Get plan limits
        plan_limits = get_plan_limits(org['plan_type'])
        
        # Get current usage
        cursor.execute('''
            SELECT feature, current_usage, limit_value
            FROM usage_tracking
            WHERE org_id = ?
        ''', (org_id,))
        
        usage = {}
        for row in cursor.fetchall():
            usage[row['feature']] = {
                "used": row['current_usage'],
                "limit": row['limit_value']
            }
        
        conn.close()
        
        return {
            "plan_type": org['plan_type'],
            "limits": plan_limits,
            "usage": usage
        }
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error getting store plan: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

@app.post("/api/store/upgrade/{org_id}")
async def upgrade_store_plan(org_id: str, new_plan: str, req: Request):
    """Upgrade store plan"""
    try:
        conn = get_db()
        cursor = conn.cursor()
        
        # Validate plan type
        valid_plans = ['basic', 'professional', 'enterprise', 'custom']
        if new_plan not in valid_plans:
            raise HTTPException(status_code=400, detail="Invalid plan type")
        
        # Get current plan
        cursor.execute('''
            SELECT plan_type FROM organizations WHERE id = ?
        ''', (org_id,))
        
        org = cursor.fetchone()
        if not org:
            raise HTTPException(status_code=404, detail="Organization not found")
        
        old_plan = org['plan_type']
        
        # Update plan
        cursor.execute('''
            UPDATE organizations SET plan_type = ? WHERE id = ?
        ''', (new_plan, org_id))
        
        # Update usage limits
        new_limits = get_plan_limits(new_plan)
        for feature, limit in new_limits.items():
            cursor.execute('''
                INSERT OR REPLACE INTO usage_tracking (org_id, feature, limit_value, last_updated)
                VALUES (?, ?, ?, CURRENT_TIMESTAMP)
            ''', (org_id, feature, limit))
        
        # Log the change
        cursor.execute('''
            INSERT INTO audit_logs (user_id, org_id, action, resource_type, resource_id, old_value, new_value, ip_address, user_agent)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (
            'system', org_id, 'UPGRADE', 'plan', 'subscription',
            old_plan, new_plan,
            req.client.host, req.headers.get('user-agent')
        ))
        
        conn.commit()
        conn.close()
        
        return {"success": True, "message": f"Plan upgraded to {new_plan}"}
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error upgrading store plan: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

# Authentication Endpoints
@app.post("/api/auth/signup")
async def signup(request: SignupRequest):
    """User signup endpoint"""
    try:
        conn = get_db()
        cursor = conn.cursor()
        
        # Validate input
        if request.password != request.confirmPassword:
            raise HTTPException(status_code=400, detail="Passwords do not match")
        
        if not request.agreeToTerms:
            raise HTTPException(status_code=400, detail="You must agree to the Terms of Service")
        
        # Validate subdomain
        if not validate_subdomain(request.storeName):
            raise HTTPException(status_code=400, detail="Invalid store name. Use only letters, numbers, and hyphens (3+ characters)")
        
        # Check if store name already exists
        cursor.execute("SELECT 1 FROM users WHERE store_name = ?", (request.storeName,))
        if cursor.fetchone():
            raise HTTPException(status_code=400, detail="Store name already taken")
        
        # Check if email already exists
        cursor.execute("SELECT 1 FROM users WHERE email = ?", (request.email,))
        if cursor.fetchone():
            raise HTTPException(status_code=400, detail="Email already registered")
        
        # Generate user and org IDs
        user_id = generate_user_id()
        org_id = generate_org_id()
        
        # Hash password
        password_hash = hash_password(request.password)
        
        # Generate verification token
        verification_token = secrets.token_urlsafe(32)
        
        # Create user
        cursor.execute('''
            INSERT INTO users (id, email, store_name, business_type, plan_type, password_hash, role, verification_token)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        ''', (user_id, request.email, request.storeName, request.businessType, request.planType, password_hash, 'retailer', verification_token))
        
        # Create organization
        cursor.execute('''
            INSERT INTO organizations (id, store_name, business_type, plan_type, owner_id)
            VALUES (?, ?, ?, ?, ?)
        ''', (org_id, request.storeName, request.businessType, request.planType, user_id))
        
        # Initialize usage tracking
        plan_limits = get_plan_limits(request.planType)
        for feature, limit in plan_limits.items():
            cursor.execute('''
                INSERT INTO usage_tracking (org_id, feature, current_usage, limit_value)
                VALUES (?, ?, ?, ?)
            ''', (org_id, feature, 0, limit))
        
        conn.commit()
        conn.close()
        
        # Send verification email
        send_verification_email(request.email, verification_token, request.storeName)
        
        return {
            "success": True,
            "message": "Account created successfully",
            "user": {
                "id": user_id,
                "org_id": org_id,
                "email": request.email,
                "storeName": request.storeName,
                "businessType": request.businessType,
                "planType": request.planType,
                "role": "retailer",
                "subdomain": f"{request.storeName}.dealndone.com"
            }
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Signup failed: {str(e)}")

@app.post("/api/auth/login")
async def login(request: LoginRequest):
    """Enhanced login with proper schema and validation"""
    try:
        conn = get_db()
        cursor = conn.cursor()
        
        # Try login by store_name (via organizations)
        cursor.execute('''
            SELECT u.id, u.email, u.store_name, u.password_hash, u.role, u.mfa_enabled, u.mfa_phone,
                   o.id as org_id, o.plan_type, o.max_outlets, o.max_registers, o.max_products, o.max_employees
            FROM users u
            JOIN organizations o ON u.org_id = o.id
            WHERE o.store_name = ? AND u.email_verified = 1
        ''', (request.identifier,))
        user_data = cursor.fetchone()
        
        if not user_data:
            # Try by email
            cursor.execute('''
                SELECT u.id, u.email, u.store_name, u.password_hash, u.role, u.mfa_enabled, u.mfa_phone,
                       o.id as org_id, o.plan_type, o.max_outlets, o.max_registers, o.max_products, o.max_employees
                FROM users u
                JOIN organizations o ON u.org_id = o.id
                WHERE u.email = ? AND u.email_verified = 1
            ''', (request.identifier,))
            user_data = cursor.fetchone()
        
        conn.close()
        
        if not user_data:
            raise HTTPException(status_code=401, detail="Invalid credentials")
        
        # Verify password with bcrypt
        if not verify_password(request.password, user_data[3]):
            raise HTTPException(status_code=401, detail="Invalid credentials")
        
        # Check if MFA is enabled
        if user_data[5]:  # mfa_enabled
            # Return MFA challenge
            from mfa import send_otp
            if send_otp(user_data[6], user_data[0]):  # phone, user_id
                return {
                    "requires_mfa": True,
                    "message": "Please enter the verification code sent to your phone",
                    "user_id": user_data[0]
                }
            else:
                raise HTTPException(status_code=500, detail="Failed to send verification code")
        
        # Generate JWT token
        token = get_user_token(user_data[0])
        
        # Return enhanced user info with plan limits
        return {
            "token": token,
            "user": {
                "id": user_data[0],
                "email": user_data[1],
                "store_name": user_data[2],
                "role": user_data[4],
                "org_id": user_data[7],
                "plan": {
                    "type": user_data[8],
                    "limits": {
                        "outlets": user_data[9],
                        "registers": user_data[10],
                        "products": user_data[11],
                        "employees": user_data[12]
                    }
                }
            },
            "message": "Login successful",
            "redirect": f"http://{user_data[2]}.dealndone.com"
        }
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"Login error: {e}")
        raise HTTPException(status_code=500, detail="Login failed")

@app.post("/api/auth/verify-mfa")
async def verify_mfa(user_id: str, otp: str):
    """Verify MFA OTP and complete login"""
    try:
        from mfa import verify_otp
        
        # Get user's phone number
        conn = get_db()
        cursor = conn.cursor()
        cursor.execute('SELECT mfa_phone FROM users WHERE id = ?', (user_id,))
        phone = cursor.fetchone()[0]
        conn.close()
        
        if not phone:
            raise HTTPException(status_code=400, detail="No phone number found")
        
        # Verify OTP
        result = verify_otp(phone, otp)
        
        if result["success"]:
            # Generate JWT token
            token = get_user_token(user_id)
            
            return {
                "token": token,
                "user": {
                    "id": result["user_id"],
                    "email": result["email"],
                    "store_name": result["store_name"],
                    "role": result["role"],
                    "plan_type": result["plan_type"]
                },
                "message": "MFA verification successful"
            }
        else:
            raise HTTPException(status_code=401, detail=result["message"])
            
    except HTTPException:
        raise
    except Exception as e:
        print(f"MFA verification error: {e}")
        raise HTTPException(status_code=500, detail="MFA verification failed")

@app.post("/api/auth/check-subdomain")
async def check_subdomain(request: SubdomainCheckRequest):
    """Check if subdomain is available"""
    try:
        conn = get_db()
        cursor = conn.cursor()
        
        # Validate subdomain format
        if not validate_subdomain(request.storeName):
            return {
                "available": False,
                "message": "Invalid store name. Use only lowercase letters, numbers, and hyphens (3+ characters)"
            }
        
        # Check if already exists
        cursor.execute("SELECT 1 FROM organizations WHERE store_name = ?", (request.storeName,))
        exists = cursor.fetchone() is not None
        
        conn.close()
        
        if exists:
            return {
                "available": False,
                "subdomain": f"{request.storeName}.dealndone.com",
                "message": f"'{request.storeName}' is already taken. Try '{request.storeName}-store' or '{request.storeName}-retail'"
            }
        else:
            return {
                "available": True,
                "subdomain": f"{request.storeName}.dealndone.com",
                "message": f"'{request.storeName}.dealndone.com' is available!"
            }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Check failed: {str(e)}")

@app.get("/api/auth/usage/{org_id}")
async def get_usage(org_id: str):
    """Get current usage for an organization"""
    try:
        conn = get_db()
        cursor = conn.cursor()
        
        cursor.execute('''
            SELECT feature, current_usage, limit_value
            FROM usage_tracking WHERE org_id = ?
        ''', (org_id,))
        
        usage_data = cursor.fetchall()
        conn.close()
        
        usage = {}
        for row in usage_data:
            feature = row['feature']
            current = row['current_usage']
            limit = row['limit_value']
            percentage = (current / limit * 100) if limit > 0 else 0
            
            usage[feature] = {
                "used": current,
                "limit": limit,
                "percentage": round(percentage, 1)
            }
        
        return usage
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get usage: {str(e)}")

@app.get("/api/auth/verify-email")
async def verify_email(token: str):
    """Verify email address with token"""
    try:
        user_id = verify_email_token(token)
        if not user_id:
            raise HTTPException(status_code=400, detail="Invalid or expired verification token")
        
        return {
            "success": True,
            "message": "Email verified successfully! You can now log in to your account."
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Verification failed: {str(e)}")

@app.post("/api/auth/check-limit/{org_id}/{feature}")
async def check_limit(org_id: str, feature: str):
    """Check if user can perform an action based on plan limits"""
    try:
        conn = get_db()
        cursor = conn.cursor()
        
        # Get current usage and limit
        cursor.execute('''
            SELECT current_usage, limit_value FROM usage_tracking 
            WHERE org_id = ? AND feature = ?
        ''', (org_id, feature))
        
        result = cursor.fetchone()
        if not result:
            raise HTTPException(status_code=404, detail="Feature not found")
        
        current_usage = result['current_usage']
        limit = result['limit_value']
        
        # Check if limit would be exceeded
        if current_usage >= limit:
            return {
                "allowed": False,
                "message": f"Plan limit reached for {feature}. Please upgrade your plan.",
                "current_usage": current_usage,
                "limit": limit
            }
        
        conn.close()
        
        return {
            "allowed": True,
            "current_usage": current_usage,
            "limit": limit,
            "remaining": limit - current_usage
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Check failed: {str(e)}")

# WebSocket for real-time settings updates
class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)

    async def send_personal_message(self, message: str, websocket: WebSocket):
        await websocket.send_text(message)

    async def broadcast(self, message: str):
        for connection in self.active_connections:
            try:
                await connection.send_text(message)
            except:
                # Remove dead connections
                self.active_connections.remove(connection)

manager = ConnectionManager()

@app.websocket("/ws/settings")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            data = await websocket.receive_text()
            # Parse the incoming message
            try:
                import json
                message = json.loads(data)
                
                # Handle different types of messages
                if message.get("type") == "settings_update":
                    # Broadcast settings update to all clients
                    await manager.broadcast(json.dumps({
                        "type": "settings_updated",
                        "key": message.get("key"),
                        "value": message.get("value"),
                        "timestamp": datetime.now().isoformat()
                    }))
                elif message.get("type") == "ping":
                    await websocket.send_text(json.dumps({"type": "pong"}))
                else:
                    # Echo back for testing
                    await websocket.send_text(f"Received: {data}")
                    
            except json.JSONDecodeError:
                await websocket.send_text(f"Invalid JSON: {data}")
                
    except WebSocketDisconnect:
        manager.disconnect(websocket)

@app.get("/test-db")
async def test_database():
    """Test database connection and settings tables"""
    try:
        conn = sqlite3.connect("dealndone.db")
        cursor = conn.cursor()
        
        # Check if global_settings table exists
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='global_settings'")
        table_exists = cursor.fetchone() is not None
        
        if table_exists:
            # Count records
            cursor.execute("SELECT COUNT(*) FROM global_settings")
            count = cursor.fetchone()[0]
            
            # Get sample data
            cursor.execute("SELECT key, value, encrypted FROM global_settings LIMIT 3")
            sample_data = cursor.fetchall()
            
            conn.close()
            
            return {
                "status": "success",
                "table_exists": table_exists,
                "record_count": count,
                "sample_data": [{"key": row[0], "value": row[1], "encrypted": bool(row[2])} for row in sample_data]
            }
        else:
            conn.close()
            return {"status": "error", "message": "global_settings table does not exist"}
            
    except Exception as e:
        return {"status": "error", "message": f"Database error: {str(e)}"}

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
    """DealBot AI Assistant endpoint for handling natural language requests with MCP integration"""
    
    message = request.message.lower()
    
    # Get org_id and user_id from request context (mock for now)
    org_id = "org_1584dcb8b2679a87"  # Get from auth context
    user_id = "user_4379886d5864ad65"  # Get from auth context
    
    # MCP Integration for outlet creation
    if "create outlet" in message or "add outlet" in message:
        try:
            outlet_name = extract_outlet_name(message) or "New Outlet"
            
            # Call MCP endpoint
            response = await mcp_create_outlet(
                org_id=org_id,
                outlet_data={"name": outlet_name},
                authorization="Bearer " + get_user_token(user_id),
                x_user_id=user_id
            )
            
            if response.get("status") == "success":
                return DealBotResponse(
                    response=f"✅ Outlet '{outlet_name}' created successfully!\n\nYou can now manage this outlet from your dashboard.",
                    options=[
                        {"text": "View All Outlets", "action": "view_outlets"},
                        {"text": "Create Another", "action": "create_outlet"},
                        {"text": "Back to Dashboard", "action": "dashboard"}
                    ]
                )
            else:
                return DealBotResponse(
                    response=f"❌ Failed to create outlet: {response.get('message', 'Unknown error')}\n\nYou may need to upgrade your plan to add more outlets.",
                    options=[
                        {"text": "Check Plan Limits", "action": "check_limits"},
                        {"text": "Upgrade Plan", "action": "upgrade_plan"},
                        {"text": "Try Again", "action": "create_outlet"}
                    ]
                )
        except Exception as e:
            return DealBotResponse(
                response=f"❌ Error creating outlet: {str(e)}\n\nPlease try again or contact support if the issue persists.",
                options=[
                    {"text": "Contact Support", "action": "support"},
                    {"text": "Try Again", "action": "create_outlet"}
                ]
            )
    
    # MCP Integration for email sending
    elif "send email" in message or "email" in message:
        try:
            # Extract email details from message (basic implementation)
            email_data = {
                "to": "customer@example.com",  # Extract from message
                "subject": "Notification from Deal n Done",
                "body": "Thank you for your business!"
            }
            
            response = await mcp_send_email(
                org_id=org_id,
                email_data=email_data,
                authorization="Bearer " + get_user_token(user_id),
                x_user_id=user_id
            )
            
            if response.get("status") == "success":
                return DealBotResponse(
                    response=f"✅ Email sent successfully!\n\nEmail ID: {response.get('email_id')}",
                    options=[
                        {"text": "Send Another", "action": "send_email"},
                        {"text": "View Email Logs", "action": "email_logs"},
                        {"text": "Back to Dashboard", "action": "dashboard"}
                    ]
                )
            else:
                return DealBotResponse(
                    response=f"❌ Failed to send email: {response.get('message', 'Unknown error')}",
                    options=[
                        {"text": "Try Again", "action": "send_email"},
                        {"text": "Contact Support", "action": "support"}
                    ]
                )
        except Exception as e:
            return DealBotResponse(
                response=f"❌ Error sending email: {str(e)}",
                options=[
                    {"text": "Try Again", "action": "send_email"},
                    {"text": "Contact Support", "action": "support"}
                ]
            )
    
    # Order management
    elif "order" in message and ("return" in message or "refund" in message):
        return handle_order_return(message)
    
    elif "order" in message and "update" in message:
        return handle_order_update(message)
    
    elif "order" in message and "status" in message:
        return handle_order_status(message)
    
    # Inventory management
    elif "inventory" in message or "stock" in message:
        return handle_inventory_query(message)
    
    # Sales analytics
    elif "sales" in message or "report" in message:
        return handle_sales_query(message)
    
    # Customer management
    elif "customer" in message or "segment" in message:
        return handle_customer_query(message)
    
    # Default response with MCP capabilities
    else:
        return DealBotResponse(
            response="I'm here to help! You can ask me about:\n\n• **Create new outlets** - Add new store locations\n• **Send email notifications** - Contact customers or staff\n• **Order Returns/Refunds** - Process customer returns\n• **Order Updates** - Modify existing orders\n• **Order Status** - Check order progress\n• **Inventory** - Check stock levels\n• **Sales Reports** - Get analytics\n• **Customer Management** - Handle customer data\n\nWhat would you like to do?",
            options=[
                {"text": "Create Outlet", "action": "create_outlet"},
                {"text": "Send Email", "action": "send_email"},
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

# MCP Endpoints (Management Control Plane)
@app.get("/mcp/resources/settings")
async def mcp_settings(
    org_id: str, 
    authorization: str = Header(...),
    x_user_id: str = Header(...)
):
    """
    MCP Resource: Get organization settings
    Used by AI agents to read store settings
    """
    try:
        # Rate limiting
        if not check_rate_limit(x_user_id, limit=100, window=60):
            raise HTTPException(429, "Rate limit exceeded")
        
        # JWT validation
        payload = validate_mcp_request(authorization, org_id, x_user_id)
        
        # Get settings using existing function
        settings = await get_store_settings(org_id)
        
        # Log the action
        await log_mcp_audit_action(
            org_id=org_id,
            user_id=x_user_id,
            action="read_settings",
            resource_type="settings",
            resource_id=org_id,
            details="AI agent read organization settings",
            success=True
        )
        
        return {"status": "success", "data": settings}
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error in MCP settings: {e}")
        raise HTTPException(500, f"Error fetching settings: {str(e)}")

@app.get("/mcp/resources/inventory")
async def mcp_inventory(
    org_id: str, 
    authorization: str = Header(...),
    x_user_id: str = Header(...)
):
    """
    MCP Resource: Get inventory data
    Used by AI agents to read inventory information
    """
    try:
        # Rate limiting
        if not check_rate_limit(x_user_id, limit=100, window=60):
            raise HTTPException(429, "Rate limit exceeded")
        
        # JWT validation
        payload = validate_mcp_request(authorization, org_id, x_user_id)
        
        # Get inventory data
        conn = get_db()
        cursor = conn.cursor()
        
        cursor.execute('''
            SELECT id, name, price, category, stock, image
            FROM products 
            WHERE org_id = ?
        ''', (org_id,))
        
        products = []
        for row in cursor.fetchall():
            products.append({
                "id": row['id'],
                "name": row['name'],
                "price": row['price'],
                "category": row['category'],
                "stock": row['stock'],
                "image": row['image']
            })
        
        conn.close()
        
        # Log the action
        await log_mcp_audit_action(
            org_id=org_id,
            user_id=x_user_id,
            action="read_inventory",
            resource_type="inventory",
            resource_id=org_id,
            details=f"AI agent read inventory ({len(products)} products)",
            success=True
        )
        
        return {"status": "success", "data": {"products": products}}
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error in MCP inventory: {e}")
        raise HTTPException(500, f"Error fetching inventory: {str(e)}")

@app.post("/mcp/tools/create-outlet")
async def mcp_create_outlet(
    org_id: str, 
    outlet_data: dict,
    authorization: str = Header(...),
    x_user_id: str = Header(...)
):
    """
    MCP Tool: Create a new outlet
    Used by AI agents to create outlets for the store
    """
    try:
        # Rate limiting
        if not check_rate_limit(x_user_id, limit=50, window=60):
            raise HTTPException(429, "Rate limit exceeded")
        
        # JWT validation
        payload = validate_mcp_request(authorization, org_id, x_user_id)
        
        # Check plan limits using existing function
        plan_info = await get_store_plan(org_id)
        current_outlets = plan_info.get("usage", {}).get("outlets", {}).get("used", 0)
        max_outlets = plan_info.get("limits", {}).get("outlets", 1)
        
        if current_outlets >= max_outlets:
            # Log failed attempt
            await log_mcp_audit_action(
                org_id=org_id,
                user_id=x_user_id,
                action="create_outlet",
                resource_type="outlet",
                resource_id="failed",
                details=f"Failed to create outlet: plan limit reached ({current_outlets}/{max_outlets})",
                success=False
            )
            return {"status": "error", "message": "Plan limit reached for outlets"}
        
        # Create outlet (mock implementation)
        outlet_id = f"outlet_{secrets.token_hex(8)}"
        outlet_name = outlet_data.get('name', 'New Outlet')
        
        # Log the successful action
        await log_mcp_audit_action(
            org_id=org_id,
            user_id=x_user_id,
            action="create_outlet",
            resource_type="outlet",
            resource_id=outlet_id,
            details=f"AI created outlet: {outlet_name}",
            success=True
        )
        
        return {
            "status": "success", 
            "outlet_id": outlet_id,
            "outlet_name": outlet_name,
            "message": f"Outlet '{outlet_name}' created successfully"
        }
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error in MCP create outlet: {e}")
        raise HTTPException(500, f"Error creating outlet: {str(e)}")

@app.post("/mcp/tools/send-email")
async def mcp_send_email(
    org_id: str, 
    email_data: dict,
    authorization: str = Header(...),
    x_user_id: str = Header(...)
):
    """
    MCP Tool: Send email notification
    Used by AI agents to send emails to customers or staff
    """
    try:
        # Rate limiting
        if not check_rate_limit(x_user_id, limit=20, window=60):
            raise HTTPException(429, "Rate limit exceeded")
        
        # JWT validation
        payload = validate_mcp_request(authorization, org_id, x_user_id)
        
        # Extract email data
        to_email = email_data.get('to')
        subject = email_data.get('subject', 'Notification from Deal n Done')
        body = email_data.get('body', '')
        
        if not to_email:
            return {"status": "error", "message": "Recipient email is required"}
        
        # Mock email sending (in production, use real email service)
        print(f"Email sent to {to_email}")
        print(f"Subject: {subject}")
        print(f"Body: {body}")
        
        # Log the action
        await log_mcp_audit_action(
            org_id=org_id,
            user_id=x_user_id,
            action="send_email",
            resource_type="email",
            resource_id=f"email_{secrets.token_hex(8)}",
            details=f"AI sent email to {to_email}: {subject}",
            success=True
        )
        
        return {
            "status": "success",
            "message": f"Email sent to {to_email}",
            "email_id": f"email_{secrets.token_hex(8)}"
        }
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error in MCP send email: {e}")
        raise HTTPException(500, f"Error sending email: {str(e)}")

@app.get("/mcp/audit-logs/{org_id}")
async def get_mcp_audit_logs(
    org_id: str,
    limit: int = 100,
    offset: int = 0
):
    """
    Get MCP audit logs for an organization
    Used by MCP Dashboard to display AI action history
    """
    try:
        conn = get_db()
        cursor = conn.cursor()
        
        cursor.execute('''
            SELECT user_id, action, resource_type, resource_id, new_value, created_at
            FROM audit_logs 
            WHERE org_id = ? 
            ORDER BY created_at DESC 
            LIMIT ? OFFSET ?
        ''', (org_id, limit, offset))
        
        logs = []
        for row in cursor.fetchall():
            logs.append({
                "user_id": row['user_id'],
                "action": row['action'],
                "resource_type": row['resource_type'],
                "resource_id": row['resource_id'],
                "details": row['new_value'],
                "created_at": row['created_at'],
                "success": "error" not in row['new_value'].lower() if row['new_value'] else True
            })
        
        conn.close()
        
        return {"status": "success", "logs": logs}
    except Exception as e:
        print(f"Error getting MCP audit logs: {e}")
        raise HTTPException(500, f"Error fetching audit logs: {str(e)}")

@app.get("/mcp/health")
async def mcp_health():
    """
    MCP Health Check
    Used by MCP Dashboard to monitor system health
    """
    try:
        # Check database connection
        conn = get_db()
        cursor = conn.cursor()
        cursor.execute("SELECT 1")
        db_healthy = cursor.fetchone() is not None
        conn.close()
        
        # Check Redis connection
        redis_healthy = REDIS_AVAILABLE
        if REDIS_AVAILABLE:
            try:
                redis_client.ping()
                redis_healthy = True
            except:
                redis_healthy = False
        
        return {
            "status": "healthy" if db_healthy and redis_healthy else "degraded",
            "database": "healthy" if db_healthy else "unhealthy",
            "redis": "healthy" if redis_healthy else "unavailable",
            "timestamp": datetime.now().isoformat()
        }
    except Exception as e:
        print(f"Error in MCP health check: {e}")
        return {
            "status": "unhealthy",
            "error": str(e),
            "timestamp": datetime.now().isoformat()
        }

# Simple test endpoint without authentication
@app.get("/mcp/test")
async def mcp_test():
    """
    Simple MCP test endpoint - no authentication required
    """
    return {
        "message": "MCP is working!",
        "timestamp": datetime.now().isoformat(),
        "endpoints": [
            "/mcp/health",
            "/mcp/resources/settings",
            "/mcp/resources/inventory",
            "/mcp/tools/create-outlet",
            "/mcp/tools/send-email"
        ]
    }

# Master Orchestrator Endpoints
from ai.orchestrator import get_orchestrator

@app.post("/ai/orchestrator/plan")
async def create_orchestration_plan(goal: str):
    """
    Create a delegation plan for a given goal
    Used by Master Orchestrator to break down tasks
    """
    try:
        orchestrator = get_orchestrator()
        plan = orchestrator.create_delegation_plan(goal)
        
        return {
            "status": "success",
            "goal": goal,
            "plan": plan,
            "tasks": len(plan),
            "agents": list(set(task["agent"] for task in plan))
        }
    except Exception as e:
        print(f"Error creating orchestration plan: {e}")
        raise HTTPException(500, f"Error creating plan: {str(e)}")

@app.post("/ai/orchestrator/execute")
async def execute_orchestration_plan(goal: str):
    """
    Execute a delegation plan for a given goal
    Used by Master Orchestrator to assign tasks to sub-agents
    """
    try:
        orchestrator = get_orchestrator()
        result = orchestrator.execute_plan(goal)
        
        return {
            "status": "success",
            "result": result
        }
    except Exception as e:
        print(f"Error executing orchestration plan: {e}")
        raise HTTPException(500, f"Error executing plan: {str(e)}")

@app.get("/ai/orchestrator/logs")
async def get_orchestrator_logs(limit: int = 100, offset: int = 0):
    """
    Get orchestration action logs
    Used by Orchestrator Monitor to display AI coordination history
    """
    try:
        conn = get_db()
        cursor = conn.cursor()
        
        cursor.execute('''
            SELECT user_id, action, details, created_at
            FROM audit_logs 
            WHERE action LIKE 'orchestrator_%'
            ORDER BY created_at DESC 
            LIMIT ? OFFSET ?
        ''', (limit, offset))
        
        logs = []
        for row in cursor.fetchall():
            details = json.loads(row['details']) if row['details'] else {}
            logs.append({
                "user_id": row['user_id'],
                "action": row['action'].replace('orchestrator_', ''),
                "details": details,
                "created_at": row['created_at'],
                "success": "error" not in str(details).lower()
            })
        
        conn.close()
        
        return {"status": "success", "logs": logs}
    except Exception as e:
        print(f"Error getting orchestrator logs: {e}")
        raise HTTPException(500, f"Error fetching logs: {str(e)}")

@app.get("/ai/orchestrator/health")
async def orchestrator_health():
    """
    Orchestrator Health Check
    Used by Orchestrator Monitor to check AI coordination health
    """
    try:
        orchestrator = get_orchestrator()
        
        # Check if orchestrator is working
        test_plan = orchestrator.create_delegation_plan("Test Goal")
        
        return {
            "status": "healthy",
            "orchestrator": "working",
            "sub_agents": len(orchestrator.sub_agents),
            "timestamp": datetime.now().isoformat()
        }
    except Exception as e:
        print(f"Error in orchestrator health check: {e}")
        return {
            "status": "unhealthy",
            "error": str(e),
            "timestamp": datetime.now().isoformat()
        }

# Mobile POS API Endpoints
@app.post("/api/pos/process-payment")
async def process_payment(request: Request):
    """Process payment for mobile POS"""
    try:
        data = await request.json()
        items = data.get("items", [])
        total = data.get("total", 0)
        payment_method = data.get("payment_method", "card")
        
        # Generate transaction ID
        transaction_id = f"txn_{secrets.token_hex(8)}"
        
        # Log transaction
        conn = get_db()
        cursor = conn.cursor()
        
        cursor.execute('''
            INSERT INTO transactions (id, total, payment_method, status, created_at)
            VALUES (?, ?, ?, ?, ?)
        ''', (transaction_id, total, payment_method, "completed", datetime.now().isoformat()))
        
        # Log transaction items
        for item in items:
            cursor.execute('''
                INSERT INTO transaction_items (transaction_id, product_id, quantity, price)
                VALUES (?, ?, ?, ?)
            ''', (transaction_id, item["id"], item["quantity"], item["price"]))
        
        conn.commit()
        conn.close()
        
        return {
            "success": True,
            "transaction_id": transaction_id,
            "total": total,
            "message": "Payment processed successfully"
        }
    except Exception as e:
        return {
            "success": False,
            "error": str(e)
        }

@app.get("/api/pos/products")
async def get_mobile_products():
    """Get products for mobile POS"""
    try:
        conn = get_db()
        cursor = conn.cursor()
        
        cursor.execute('''
            SELECT id, name, price, category, stock, image
            FROM products 
            ORDER BY name
        ''')
        
        products = []
        for row in cursor.fetchall():
            products.append({
                "id": row[0],
                "name": row[1],
                "price": row[2],
                "category": row[3],
                "stock": row[4],
                "image": row[5]
            })
        
        conn.close()
        return {"products": products}
    except Exception as e:
        return {"error": str(e)}

@app.post("/api/pos/scan-barcode")
async def scan_barcode(request: Request):
    """Scan barcode for mobile POS"""
    try:
        data = await request.json()
        barcode = data.get("barcode", "")
        
        # Search product by barcode
        conn = get_db()
        cursor = conn.cursor()
        
        cursor.execute('''
            SELECT id, name, price, category, stock, image
            FROM products 
            WHERE barcode = ?
        ''', (barcode,))
        
        product = cursor.fetchone()
        conn.close()
        
        if product:
            return {
                "success": True,
                "product": {
                    "id": product[0],
                    "name": product[1],
                    "price": product[2],
                    "category": product[3],
                    "stock": product[4],
                    "image": product[5]
                }
            }
        else:
            return {
                "success": False,
                "message": "Product not found"
            }
    except Exception as e:
        return {"error": str(e)}

@app.get("/api/pos/transactions/{org_id}")
async def get_mobile_transactions(org_id: str, limit: int = 50):
    """Get recent transactions for mobile POS"""
    try:
        conn = get_db()
        cursor = conn.cursor()
        
        cursor.execute('''
            SELECT id, total, payment_method, status, created_at
            FROM transactions 
            WHERE org_id = ?
            ORDER BY created_at DESC
            LIMIT ?
        ''', (org_id, limit))
        
        transactions = []
        for row in cursor.fetchall():
            transactions.append({
                "id": row[0],
                "total": row[1],
                "payment_method": row[2],
                "status": row[3],
                "created_at": row[4]
            })
        
        conn.close()
        return {"transactions": transactions}
    except Exception as e:
        return {"error": str(e)}

@app.post("/api/pos/offline-sync")
async def offline_sync(request: Request):
    """Sync offline transactions when connection is restored"""
    try:
        data = await request.json()
        offline_transactions = data.get("transactions", [])
        
        conn = get_db()
        cursor = conn.cursor()
        
        synced_count = 0
        for transaction in offline_transactions:
            try:
                cursor.execute('''
                    INSERT INTO transactions (id, total, payment_method, status, created_at, org_id)
                    VALUES (?, ?, ?, ?, ?, ?)
                ''', (
                    transaction["id"],
                    transaction["total"],
                    transaction["payment_method"],
                    "completed",
                    transaction["created_at"],
                    transaction["org_id"]
                ))
                synced_count += 1
            except Exception as e:
                print(f"Failed to sync transaction {transaction['id']}: {e}")
        
        conn.commit()
        conn.close()
        
        return {
            "success": True,
            "synced_count": synced_count,
            "total_count": len(offline_transactions)
        }
    except Exception as e:
        return {"error": str(e)}

@app.get("/api/check-subdomain")
async def check_subdomain_availability(store_name: str):
    """
    Check if a subdomain is available.
    Example: honey.dealndone.com
    """
    try:
        # Validate input
        if not store_name:
            raise HTTPException(400, "Store name is required")
        
        # Sanitize input (convert to lowercase, remove spaces)
        store_name = store_name.lower().strip().replace(' ', '-')
        
        # Validate subdomain format
        if not validate_subdomain(store_name):
            return {
                "available": False,
                "reason": "Invalid format. Use only letters, numbers, and hyphens (3-63 characters)."
            }
        
        # Check database for existing store
        conn = get_db()
        cursor = conn.cursor()
        
        cursor.execute('''
            SELECT 1 FROM organizations 
            WHERE store_name = ?
        ''', (store_name,))
        
        exists = cursor.fetchone() is not None
        conn.close()
        
        if exists:
            return {
                "available": False,
                "subdomain": f"{store_name}.dealndone.com",
                "reason": "This store name is already taken."
            }
        
        return {
            "available": True,
            "subdomain": f"{store_name}.dealndone.com",
            "message": "Available!"
        }
        
    except HTTPException:
        raise
    except Exception as e:
        return {
            "available": False,
            "reason": f"Error checking availability: {str(e)}"
        }

# Include franchise router if available
if FRANCHISE_AVAILABLE:
    app.include_router(franchise_router)
    print("✅ Franchise endpoints loaded")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8005)
    