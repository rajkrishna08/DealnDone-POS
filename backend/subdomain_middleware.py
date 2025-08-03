from fastapi import Request, HTTPException
from typing import Dict, Optional
import sqlite3

def get_db():
    """Get database connection"""
    try:
        conn = sqlite3.connect("dealndone.db")
        conn.row_factory = sqlite3.Row
        return conn
    except Exception as e:
        print(f"Database connection error: {e}")
        raise

def get_store_context(request: Request) -> Dict[str, str]:
    """Extract store context from subdomain"""
    hostname = request.headers.get("host", "")
    if not hostname:
        return {}
    
    # Extract subdomain from hostname
    parts = hostname.split(".")
    if len(parts) >= 2 and parts[0] != "localhost":
        store_name = parts[0]
        return {"store_name": store_name, "subdomain": f"{store_name}.dealndone.com"}
    
    return {}

def require_store_access(request: Request):
    """Middleware to require store access"""
    store_context = get_store_context(request)
    if not store_context:
        raise HTTPException(status_code=400, detail="Store context required")
    return store_context

def get_store_limits(store_name: str) -> Dict[str, int]:
    """Get store limits based on plan"""
    try:
        conn = get_db()
        cursor = conn.cursor()
        
        # Get organization info
        cursor.execute("""
            SELECT plan_type FROM organizations 
            WHERE store_name = ?
        """, (store_name,))
        
        result = cursor.fetchone()
        conn.close()
        
        if not result:
            return {}
        
        plan_type = result[0]
        
        # Define plan limits
        limits = {
            "free": {"outlets": 1, "registers": 1, "products": 50, "employees": 1},
            "basic": {"outlets": 1, "registers": 1, "products": 500, "employees": 3},
            "professional": {"outlets": 3, "registers": 2, "products": 5000, "employees": 10},
            "enterprise": {"outlets": 10, "registers": 5, "products": -1, "employees": 25},
            "custom": {"outlets": 50, "registers": 20, "products": -1, "employees": 100}
        }
        
        return limits.get(plan_type.lower(), limits["free"])
        
    except Exception as e:
        print(f"Error getting store limits: {e}")
        return {}

def check_store_limit(store_name: str, feature: str, current_usage: int = 0) -> Dict[str, any]:
    """Check if store can add more of a feature"""
    limits = get_store_limits(store_name)
    
    if not limits:
        return {"allowed": False, "message": "Store not found"}
    
    limit = limits.get(feature, 0)
    
    if limit == -1:  # Unlimited
        return {"allowed": True, "limit": -1, "current": current_usage}
    
    if current_usage >= limit:
        return {
            "allowed": False, 
            "limit": limit, 
            "current": current_usage,
            "message": f"Limit reached: {current_usage}/{limit} {feature}"
        }
    
    return {
        "allowed": True, 
        "limit": limit, 
        "current": current_usage,
        "remaining": limit - current_usage
    } 