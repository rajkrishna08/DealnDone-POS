"""
DealNDone 2025 Settings Management System
Comprehensive settings management with hierarchy, encryption, and audit logging
"""

import os
import json
import sqlite3
from datetime import datetime
from typing import Dict, Any, Optional, List
from cryptography.fernet import Fernet
import jwt
from fastapi import HTTPException, Depends
from pydantic import BaseModel
import redis
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Settings Models
class GlobalSetting(BaseModel):
    key: str
    value: Any
    encrypted: bool = False
    description: Optional[str] = None

class OrganizationSetting(BaseModel):
    org_id: str
    key: str
    value: Any
    encrypted: bool = False
    description: Optional[str] = None

class UserPreference(BaseModel):
    user_id: str
    key: str
    value: Any
    description: Optional[str] = None

class AuditLog(BaseModel):
    user_id: Optional[str]
    org_id: Optional[str]
    action: str
    resource_type: str
    resource_id: str
    old_value: Optional[Any]
    new_value: Optional[Any]
    ip_address: Optional[str]
    user_agent: Optional[str]

class FeatureFlag(BaseModel):
    flag_name: str
    enabled: bool = False
    rollout_percentage: float = 0.0
    targeting_rules: Optional[Dict] = None

class SettingsManager:
    """Comprehensive Settings Management System"""
    
    def __init__(self):
        self.db_path = "dealndone.db"
        # Make Redis optional - use in-memory cache if Redis is not available
        try:
            self.redis_client = redis.Redis(host='localhost', port=6379, db=0, decode_responses=True)
            self.redis_client.ping()  # Test connection
            self.use_redis = True
        except:
            self.redis_client = None
            self.use_redis = False
            logger.warning("Redis not available, using in-memory cache")
        
        self.encryption_key = os.getenv("SETTINGS_ENCRYPTION_KEY", Fernet.generate_key())
        self.cipher_suite = Fernet(self.encryption_key)
        self.init_database()
    
    def init_database(self):
        """Initialize settings database tables"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        # Global settings table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS global_settings (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                key TEXT UNIQUE NOT NULL,
                value TEXT NOT NULL,
                encrypted BOOLEAN DEFAULT FALSE,
                description TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        ''')
        
        # Organization settings table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS organization_settings (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                org_id TEXT NOT NULL,
                key TEXT NOT NULL,
                value TEXT NOT NULL,
                encrypted BOOLEAN DEFAULT FALSE,
                description TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                UNIQUE(org_id, key)
            )
        ''')
        
        # User preferences table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS user_preferences (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id TEXT NOT NULL,
                key TEXT NOT NULL,
                value TEXT NOT NULL,
                description TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                UNIQUE(user_id, key)
            )
        ''')
        
        # Audit logs table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS audit_logs (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id TEXT,
                org_id TEXT,
                action TEXT NOT NULL,
                resource_type TEXT NOT NULL,
                resource_id TEXT NOT NULL,
                old_value TEXT,
                new_value TEXT,
                ip_address TEXT,
                user_agent TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        ''')
        
        # Feature flags table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS feature_flags (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                flag_name TEXT UNIQUE NOT NULL,
                enabled BOOLEAN DEFAULT FALSE,
                rollout_percentage FLOAT DEFAULT 0.0,
                targeting_rules TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        ''')
        
        # Initialize default global settings
        self._init_default_global_settings(cursor)
        
        conn.commit()
        conn.close()
    
    def _init_default_global_settings(self, cursor):
        """Initialize default global settings"""
        default_settings = [
            ("mfa_required", "false", False, "Require MFA for all users"),
            ("session_timeout", "3600", False, "Session timeout in seconds"),
            ("max_login_attempts", "5", False, "Maximum login attempts"),
            ("password_min_length", "8", False, "Minimum password length"),
            ("audit_log_retention_days", "365", False, "Audit log retention period"),
            ("default_currency", "USD", False, "Default currency"),
            ("default_timezone", "UTC", False, "Default timezone"),
            ("smtp_host", "", True, "SMTP server host"),
            ("smtp_port", "587", False, "SMTP server port"),
            ("smtp_username", "", True, "SMTP username"),
            ("smtp_password", "", True, "SMTP password"),
            ("stripe_secret_key", "", True, "Stripe secret key"),
            ("stripe_publishable_key", "", True, "Stripe publishable key"),
            ("azure_tenant_id", "", True, "Azure AD tenant ID"),
            ("azure_client_id", "", True, "Azure AD client ID"),
            ("azure_client_secret", "", True, "Azure AD client secret"),
        ]
        
        for key, value, encrypted, description in default_settings:
            try:
                cursor.execute('''
                    INSERT OR IGNORE INTO global_settings (key, value, encrypted, description)
                    VALUES (?, ?, ?, ?)
                ''', (key, value, encrypted, description))
            except sqlite3.IntegrityError:
                pass  # Setting already exists
    
    def encrypt_value(self, value: str) -> str:
        """Encrypt sensitive setting values"""
        return self.cipher_suite.encrypt(value.encode()).decode()
    
    def decrypt_value(self, encrypted_value: str) -> str:
        """Decrypt sensitive setting values"""
        return self.cipher_suite.decrypt(encrypted_value.encode()).decode()
    
    def get_setting(self, org_id: str, key: str, user_id: Optional[str] = None) -> Any:
        """
        Get setting value with hierarchy: User > Org > Global > Default
        """
        # Check cache first
        cache_key = f"settings:{org_id}:{key}"
        if user_id:
            cache_key = f"settings:{org_id}:{user_id}:{key}"

        if self.use_redis:
            cached_value = self.redis_client.get(cache_key)
            if cached_value:
                return json.loads(cached_value)
        
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        # Try user preference first
        if user_id:
            cursor.execute('''
                SELECT value FROM user_preferences 
                WHERE user_id = ? AND key = ?
            ''', (user_id, key))
            result = cursor.fetchone()
            if result:
                value = json.loads(result[0])
                if self.use_redis:
                    self.redis_client.setex(cache_key, 300, json.dumps(value))  # 5 min cache
                conn.close()
                return value
        
        # Try organization setting
        cursor.execute('''
            SELECT value, encrypted FROM organization_settings 
            WHERE org_id = ? AND key = ?
        ''', (org_id, key))
        result = cursor.fetchone()
        if result:
            value_str, encrypted = result
            if encrypted:
                value = json.loads(self.decrypt_value(value_str))
            else:
                value = json.loads(value_str)
            if self.use_redis:
                self.redis_client.setex(cache_key, 300, json.dumps(value))
            conn.close()
            return value
        
        # Try global setting
        cursor.execute('''
            SELECT value, encrypted FROM global_settings 
            WHERE key = ?
        ''', (key,))
        result = cursor.fetchone()
        if result:
            value_str, encrypted = result
            if encrypted:
                value = json.loads(self.decrypt_value(value_str))
            else:
                value = json.loads(value_str)
            if self.use_redis:
                self.redis_client.setex(cache_key, 300, json.dumps(value))
            conn.close()
            return value
        
        conn.close()
        return None
    
    def set_global_setting(self, key: str, value: Any, encrypted: bool = False, 
                          description: Optional[str] = None) -> bool:
        """Set global setting"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        value_str = json.dumps(value)
        if encrypted:
            value_str = self.encrypt_value(value_str)
        
        cursor.execute('''
            INSERT OR REPLACE INTO global_settings (key, value, encrypted, description, updated_at)
            VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)
        ''', (key, value_str, encrypted, description))
        
        conn.commit()
        conn.close()
        
        # Invalidate cache
        self._invalidate_cache(key)
        return True
    
    def set_organization_setting(self, org_id: str, key: str, value: Any, 
                                encrypted: bool = False, description: Optional[str] = None) -> bool:
        """Set organization setting"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        value_str = json.dumps(value)
        if encrypted:
            value_str = self.encrypt_value(value_str)
        
        cursor.execute('''
            INSERT OR REPLACE INTO organization_settings (org_id, key, value, encrypted, description, updated_at)
            VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
        ''', (org_id, key, value_str, encrypted, description))
        
        conn.commit()
        conn.close()
        
        # Invalidate cache
        self._invalidate_cache(key, org_id)
        return True
    
    def set_user_preference(self, user_id: str, key: str, value: Any, 
                           description: Optional[str] = None) -> bool:
        """Set user preference"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        value_str = json.dumps(value)
        
        cursor.execute('''
            INSERT OR REPLACE INTO user_preferences (user_id, key, value, description, updated_at)
            VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)
        ''', (user_id, key, value_str, description))
        
        conn.commit()
        conn.close()
        
        # Invalidate cache
        self._invalidate_cache(key, user_id=user_id)
        return True
    
    def _invalidate_cache(self, key: str, org_id: Optional[str] = None, 
                         user_id: Optional[str] = None):
        """Invalidate settings cache"""
        if not self.use_redis:
            return
            
        if user_id and org_id:
            cache_key = f"settings:{org_id}:{user_id}:{key}"
            self.redis_client.delete(cache_key)
        elif org_id:
            cache_key = f"settings:{org_id}:{key}"
            self.redis_client.delete(cache_key)
        else:
            # Invalidate all caches for this key
            pattern = f"settings:*:{key}"
            keys = self.redis_client.keys(pattern)
            if keys:
                self.redis_client.delete(*keys)
    
    def log_audit_event(self, audit_log: AuditLog):
        """Log audit event"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        cursor.execute('''
            INSERT INTO audit_logs (user_id, org_id, action, resource_type, resource_id, 
                                  old_value, new_value, ip_address, user_agent)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (
            audit_log.user_id, audit_log.org_id, audit_log.action, 
            audit_log.resource_type, audit_log.resource_id,
            json.dumps(audit_log.old_value) if audit_log.old_value else None,
            json.dumps(audit_log.new_value) if audit_log.new_value else None,
            audit_log.ip_address, audit_log.user_agent
        ))
        
        conn.commit()
        conn.close()
    
    def get_audit_logs(self, org_id: str, limit: int = 100, 
                       offset: int = 0) -> List[Dict]:
        """Get audit logs for organization"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        cursor.execute('''
            SELECT user_id, action, resource_type, resource_id, old_value, 
                   new_value, ip_address, user_agent, created_at
            FROM audit_logs 
            WHERE org_id = ?
            ORDER BY created_at DESC
            LIMIT ? OFFSET ?
        ''', (org_id, limit, offset))
        
        results = []
        for row in cursor.fetchall():
            results.append({
                'user_id': row[0],
                'action': row[1],
                'resource_type': row[2],
                'resource_id': row[3],
                'old_value': json.loads(row[4]) if row[4] else None,
                'new_value': json.loads(row[5]) if row[5] else None,
                'ip_address': row[6],
                'user_agent': row[7],
                'created_at': row[8]
            })
        
        conn.close()
        return results
    
    def create_feature_flag(self, flag: FeatureFlag) -> bool:
        """Create or update feature flag"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        cursor.execute('''
            INSERT OR REPLACE INTO feature_flags (flag_name, enabled, rollout_percentage, 
                                                targeting_rules, updated_at)
            VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)
        ''', (flag.flag_name, flag.enabled, flag.rollout_percentage, 
              json.dumps(flag.targeting_rules) if flag.targeting_rules else None))
        
        conn.commit()
        conn.close()
        return True
    
    def is_feature_enabled(self, org_id: str, flag_name: str) -> bool:
        """Check if feature flag is enabled for organization"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        cursor.execute('''
            SELECT enabled, rollout_percentage, targeting_rules
            FROM feature_flags 
            WHERE flag_name = ?
        ''', (flag_name,))
        
        result = cursor.fetchone()
        conn.close()
        
        if not result:
            return False
        
        enabled, rollout_percentage, targeting_rules = result
        
        if not enabled:
            return False
        
        if rollout_percentage < 100.0:
            # Simple hash-based rollout (in production, use better algorithm)
            org_hash = hash(org_id) % 100
            if org_hash >= rollout_percentage:
                return False
        
        if targeting_rules:
            rules = json.loads(targeting_rules)
            # Apply targeting rules (implement based on requirements)
            pass
        
        return True

# Global settings manager instance
settings_manager = SettingsManager() 