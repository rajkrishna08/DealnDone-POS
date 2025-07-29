# DealNDone 2025 Security Module
# Azure AD (MFA) + OWASP ZAP Implementation

from fastapi import HTTPException, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import jwt
import requests
from typing import Optional
import os

# Security configuration
SECURITY_CONFIG = {
    "azure_ad": {
        "tenant_id": os.getenv("AZURE_AD_TENANT_ID", ""),
        "client_id": os.getenv("AZURE_AD_CLIENT_ID", ""),
        "client_secret": os.getenv("AZURE_AD_CLIENT_SECRET", ""),
        "authority": f"https://login.microsoftonline.com/{os.getenv('AZURE_AD_TENANT_ID', '')}",
        "scope": ["api://your-app-id/access_as_user"],
        "mfa_required": True
    },
    "jwt": {
        "secret_key": os.getenv("JWT_SECRET_KEY", "your-secret-key"),
        "algorithm": "HS256",
        "access_token_expire_minutes": 30
    }
}

# OWASP ZAP Security Headers
SECURITY_HEADERS = {
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "DENY",
    "X-XSS-Protection": "1; mode=block",
    "Strict-Transport-Security": "max-age=31536000; includeSubDomains",
    "Content-Security-Policy": "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline';",
    "Referrer-Policy": "strict-origin-when-cross-origin",
    "Permissions-Policy": "geolocation=(), microphone=(), camera=()"
}

# Security middleware
security = HTTPBearer()

class SecurityManager:
    """DealNDone 2025 Security Manager"""
    
    def __init__(self):
        self.azure_config = SECURITY_CONFIG["azure_ad"]
        self.jwt_config = SECURITY_CONFIG["jwt"]
    
    async def verify_azure_token(self, token: str) -> dict:
        """Verify Azure AD token with MFA"""
        try:
            # Azure AD token verification
            headers = {
                "Authorization": f"Bearer {token}",
                "Content-Type": "application/json"
            }
            
            # Verify token with Azure AD
            response = requests.get(
                f"https://graph.microsoft.com/v1.0/me",
                headers=headers
            )
            
            if response.status_code == 200:
                user_info = response.json()
                
                # Check MFA status
                mfa_response = requests.get(
                    f"https://graph.microsoft.com/v1.0/me/authentication/methods",
                    headers=headers
                )
                
                mfa_enabled = False
                if mfa_response.status_code == 200:
                    methods = mfa_response.json().get("value", [])
                    mfa_enabled = any(method.get("type") in ["microsoftAuthenticator", "phone"] for method in methods)
                
                return {
                    "valid": True,
                    "user_id": user_info.get("id"),
                    "email": user_info.get("userPrincipalName"),
                    "name": user_info.get("displayName"),
                    "mfa_enabled": mfa_enabled
                }
            else:
                return {"valid": False, "error": "Invalid token"}
                
        except Exception as e:
            return {"valid": False, "error": str(e)}
    
    async def verify_jwt_token(self, token: str) -> dict:
        """Verify JWT token"""
        try:
            payload = jwt.decode(
                token, 
                self.jwt_config["secret_key"], 
                algorithms=[self.jwt_config["algorithm"]]
            )
            return {"valid": True, "payload": payload}
        except jwt.ExpiredSignatureError:
            return {"valid": False, "error": "Token expired"}
        except jwt.InvalidTokenError:
            return {"valid": False, "error": "Invalid token"}
    
    def generate_jwt_token(self, user_data: dict) -> str:
        """Generate JWT token"""
        payload = {
            "user_id": user_data.get("user_id"),
            "email": user_data.get("email"),
            "name": user_data.get("name"),
            "exp": jwt.utils.time.time() + (self.jwt_config["access_token_expire_minutes"] * 60)
        }
        return jwt.encode(payload, self.jwt_config["secret_key"], algorithm=self.jwt_config["algorithm"])

# Security dependencies
async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)) -> dict:
    """Get current authenticated user"""
    token = credentials.credentials
    
    # Try Azure AD first
    security_manager = SecurityManager()
    azure_result = await security_manager.verify_azure_token(token)
    
    if azure_result["valid"]:
        return azure_result
    
    # Fallback to JWT
    jwt_result = await security_manager.verify_jwt_token(token)
    
    if jwt_result["valid"]:
        return jwt_result
    
    raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Invalid authentication credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )

async def require_mfa(user: dict = Depends(get_current_user)) -> dict:
    """Require MFA for sensitive operations"""
    # In production, check if user has MFA enabled
    if not user.get("mfa_enabled", False):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Multi-factor authentication required"
        )
    return user

# OWASP ZAP Security Functions
def add_security_headers(response):
    """Add OWASP ZAP security headers"""
    for header, value in SECURITY_HEADERS.items():
        response.headers[header] = value
    return response

def validate_input(data: dict) -> bool:
    """Validate input against OWASP ZAP security rules"""
    # SQL Injection prevention
    dangerous_patterns = [
        "';", "--", "/*", "*/", "xp_", "sp_", 
        "UNION", "SELECT", "INSERT", "UPDATE", "DELETE", "DROP"
    ]
    
    data_str = str(data).lower()
    for pattern in dangerous_patterns:
        if pattern.lower() in data_str:
            return False
    
    return True

def sanitize_input(data: dict) -> dict:
    """Sanitize input data"""
    sanitized = {}
    for key, value in data.items():
        if isinstance(value, str):
            # Remove potentially dangerous characters
            sanitized[key] = value.replace("'", "").replace('"', "").replace(";", "")
        else:
            sanitized[key] = value
    return sanitized

# Rate limiting
from collections import defaultdict
import time

class RateLimiter:
    """Simple rate limiter for API endpoints"""
    
    def __init__(self, max_requests: int = 100, window_seconds: int = 60):
        self.max_requests = max_requests
        self.window_seconds = window_seconds
        self.requests = defaultdict(list)
    
    def is_allowed(self, client_id: str) -> bool:
        """Check if request is allowed"""
        now = time.time()
        client_requests = self.requests[client_id]
        
        # Remove old requests
        client_requests[:] = [req_time for req_time in client_requests 
                            if now - req_time < self.window_seconds]
        
        # Check if under limit
        if len(client_requests) < self.max_requests:
            client_requests.append(now)
            return True
        
        return False

# Global rate limiter
rate_limiter = RateLimiter()

async def check_rate_limit(client_id: str = "default"):
    """Check rate limit for requests"""
    if not rate_limiter.is_allowed(client_id):
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail="Rate limit exceeded"
        ) 