import secrets
import jwt
from datetime import datetime, timedelta
from typing import Optional, Dict, Any
from fastapi import Request, HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import json

# Security configuration
SECRET_KEY = "your-secret-key-change-in-production"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

# In-memory session store (use Redis in production)
sessions = {}
security = HTTPBearer()

class SecurityMiddleware:
    def __init__(self):
        self.mfa_required_orgs = set()
        self.role_permissions = {
            "admin": ["read", "write", "delete", "settings"],
            "manager": ["read", "write", "settings"],
            "user": ["read"],
            "viewer": ["read"]
        }
    
    def create_access_token(self, data: dict, expires_delta: Optional[timedelta] = None):
        to_encode = data.copy()
        if expires_delta:
            expire = datetime.utcnow() + expires_delta
        else:
            expire = datetime.utcnow() + timedelta(minutes=15)
        to_encode.update({"exp": expire})
        encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
        return encoded_jwt
    
    def verify_token(self, token: str) -> Dict[str, Any]:
        try:
            payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
            return payload
        except jwt.PyJWTError:
            raise HTTPException(status_code=401, detail="Invalid token")
    
    def create_session(self, user_id: str, role: str, org_id: str) -> str:
        session_id = secrets.token_urlsafe(32)
        expires = datetime.utcnow() + timedelta(minutes=30)
        sessions[session_id] = {
            "user_id": user_id,
            "role": role,
            "org_id": org_id,
            "expires": expires,
            "mfa_verified": False
        }
        return session_id
    
    def validate_session(self, session_id: str) -> Optional[Dict[str, Any]]:
        session = sessions.get(session_id)
        if not session:
            return None
        if datetime.utcnow() > session["expires"]:
            del sessions[session_id]
            return None
        return session
    
    def require_mfa(self, org_id: str) -> bool:
        """Check if organization requires MFA"""
        return org_id in self.mfa_required_orgs
    
    def check_permission(self, role: str, permission: str) -> bool:
        """Check if role has specific permission"""
        return permission in self.role_permissions.get(role, [])

# Global security middleware instance
security_middleware = SecurityMiddleware()

async def get_current_user(request: Request) -> Dict[str, Any]:
    """Extract current user from request"""
    try:
        # Try to get from session
        session_id = request.cookies.get("session_id")
        if session_id:
            session = security_middleware.validate_session(session_id)
            if session:
                return {
                    "user_id": session["user_id"],
                    "role": session["role"],
                    "org_id": session["org_id"],
                    "mfa_verified": session.get("mfa_verified", False)
                }
        
        # Try to get from Authorization header
        auth_header = request.headers.get("Authorization")
        if auth_header and auth_header.startswith("Bearer "):
            token = auth_header.split(" ")[1]
            payload = security_middleware.verify_token(token)
            return {
                "user_id": payload.get("user_id"),
                "role": payload.get("role", "user"),
                "org_id": payload.get("org_id"),
                "mfa_verified": payload.get("mfa_verified", False)
            }
        
        # Fallback to headers
        return {
            "user_id": request.headers.get("X-User-ID", "anonymous"),
            "role": request.headers.get("X-Role", "user"),
            "org_id": request.headers.get("X-Org-ID", "default"),
            "mfa_verified": request.headers.get("X-MFA-Verified", "false").lower() == "true"
        }
    except Exception as e:
        raise HTTPException(status_code=401, detail=f"Authentication failed: {str(e)}")

async def require_authentication(request: Request):
    """Require basic authentication"""
    user = await get_current_user(request)
    if not user["user_id"] or user["user_id"] == "anonymous":
        raise HTTPException(status_code=401, detail="Authentication required")
    return user

async def require_mfa(request: Request):
    """Require MFA verification"""
    user = await get_current_user(request)
    
    # Check if org requires MFA
    if security_middleware.require_mfa(user["org_id"]):
        if not user.get("mfa_verified", False):
            raise HTTPException(
                status_code=403, 
                detail="Multi-factor authentication required"
            )
    return user

def require_role(required_role: str):
    """Decorator to require specific role"""
    async def role_checker(request: Request):
        user = await get_current_user(request)
        if user["role"] != required_role:
            raise HTTPException(
                status_code=403, 
                detail=f"Role '{required_role}' required"
            )
        return user
    return role_checker

def require_permission(permission: str):
    """Decorator to require specific permission"""
    async def permission_checker(request: Request):
        user = await get_current_user(request)
        if not security_middleware.check_permission(user["role"], permission):
            raise HTTPException(
                status_code=403, 
                detail=f"Permission '{permission}' required"
            )
        return user
    return permission_checker

# MFA Functions
def generate_mfa_secret() -> str:
    """Generate a new MFA secret"""
    return secrets.token_hex(16)

def verify_mfa_code(secret: str, code: str) -> bool:
    """Verify MFA code (simplified - use pyotp in production)"""
    # This is a simplified verification
    # In production, use pyotp library for TOTP verification
    try:
        expected_code = str(hash(secret + str(int(datetime.utcnow().timestamp() / 30)) % 1000000).zfill(6))
        return code == expected_code
    except:
        return False

# Session Management
def create_user_session(user_id: str, role: str, org_id: str) -> str:
    """Create a new user session"""
    return security_middleware.create_session(user_id, role, org_id)

def validate_user_session(session_id: str) -> Optional[Dict[str, Any]]:
    """Validate a user session"""
    return security_middleware.validate_session(session_id)

def revoke_session(session_id: str):
    """Revoke a user session"""
    if session_id in sessions:
        del sessions[session_id]

# Security Policies
def set_org_mfa_requirement(org_id: str, required: bool):
    """Set MFA requirement for an organization"""
    if required:
        security_middleware.mfa_required_orgs.add(org_id)
    else:
        security_middleware.mfa_required_orgs.discard(org_id)

def get_security_policies(org_id: str) -> Dict[str, Any]:
    """Get security policies for an organization"""
    return {
        "mfa_required": org_id in security_middleware.mfa_required_orgs,
        "session_timeout_minutes": 30,
        "max_login_attempts": 5,
        "password_policy": {
            "min_length": 8,
            "require_uppercase": True,
            "require_lowercase": True,
            "require_numbers": True,
            "require_special": True
        }
    } 