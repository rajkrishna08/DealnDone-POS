#!/usr/bin/env python3
"""
🛢️ DealNDone 2025: Enterprise Database Configuration
Enhanced Database module with PostgreSQL-first approach and SQLite fallback
Author: Grandpa Grok
Date: August 5, 2025
"""

import sqlite3
import os
from datetime import datetime, timedelta

class Database:
    def __init__(self, db_path="dealndone.db"):
        self.db_path = db_path
        self.init_database()

    def init_database(self):
        """Initialize database with all required tables"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()

        # Create users table with enhanced fields
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                email TEXT UNIQUE NOT NULL,
                password_hash TEXT NOT NULL,
                full_name TEXT,
                phone TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                is_active BOOLEAN DEFAULT 1,
                email_verified BOOLEAN DEFAULT 0,
                last_login TIMESTAMP
            )
        ''')

        # Create organizations table for business types and subdomains
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS organizations (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                subdomain TEXT UNIQUE NOT NULL,
                business_type TEXT CHECK (business_type IN ('retail', 'services', 'restaurant')) NOT NULL,
                plan_id INTEGER DEFAULT 1,
                country TEXT DEFAULT 'IN',
                currency TEXT DEFAULT 'INR',
                timezone TEXT DEFAULT 'Asia/Kolkata',
                logo_url TEXT,
                tax_id TEXT,
                trial_end TIMESTAMP,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                is_active BOOLEAN DEFAULT 1
            )
        ''')

        # Create user_organizations table for user-org relationships
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS user_organizations (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                organization_id INTEGER NOT NULL,
                role TEXT CHECK (role IN ('owner', 'admin', 'manager', 'cashier')) DEFAULT 'owner',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users (id),
                FOREIGN KEY (organization_id) REFERENCES organizations (id),
                UNIQUE(user_id, organization_id)
            )
        ''')

        # Create plans table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS plans (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                price DECIMAL(10,2) NOT NULL,
                period TEXT DEFAULT 'month',
                description TEXT,
                features TEXT, -- JSON string of features
                max_outlets INTEGER DEFAULT 1,
                max_users INTEGER DEFAULT 1,
                max_products INTEGER DEFAULT 1000,
                is_active BOOLEAN DEFAULT 1,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        ''')

        # Create plan_features table for feature gating
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS plan_features (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                plan_id INTEGER NOT NULL,
                feature_code TEXT NOT NULL,
                feature_name TEXT NOT NULL,
                enabled BOOLEAN DEFAULT 1,
                max_value INTEGER,
                description TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (plan_id) REFERENCES plans (id),
                UNIQUE(plan_id, feature_code)
            )
        ''')

        # Create features table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS features (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                code TEXT UNIQUE NOT NULL,
                name TEXT NOT NULL,
                description TEXT,
                category TEXT,
                is_active BOOLEAN DEFAULT 1,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        ''')

        # Create subdomain_checks table for availability tracking
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS subdomain_checks (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                subdomain TEXT UNIQUE NOT NULL,
                is_available BOOLEAN DEFAULT 1,
                checked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        ''')

        # Insert default plans
        cursor.execute('''
            INSERT OR IGNORE INTO plans (id, name, price, description, features, max_outlets, max_users, max_products) VALUES
            (1, 'Free', 0.00, 'Perfect for small businesses getting started', '["Basic POS", "Up to 100 Products", "Email Support"]', 1, 1, 100),
            (2, 'Basic', 29.00, 'Great for growing retail businesses', '["Advanced POS", "Unlimited Products", "Priority Support", "Inventory Management"]', 1, 3, -1),
            (3, 'Professional', 79.00, 'For established businesses with multiple locations', '["Multi-user Access", "Employee Management", "Customer Loyalty", "Integration Support"]', 5, 10, -1),
            (4, 'Enterprise', 199.00, 'For large businesses and franchises', '["Unlimited Locations", "Warehouse Management", "Custom Integrations", "Dedicated Support"]', -1, -1, -1)
        ''')

        # Insert default features
        cursor.execute('''
            INSERT OR IGNORE INTO features (code, name, description, category) VALUES
            ('pos_basic', 'Basic POS', 'Basic point of sale functionality', 'pos'),
            ('pos_advanced', 'Advanced POS', 'Advanced POS with barcode scanning', 'pos'),
            ('inventory_basic', 'Basic Inventory', 'Basic inventory management', 'inventory'),
            ('inventory_advanced', 'Advanced Inventory', 'Advanced inventory with tracking', 'inventory'),
            ('customer_basic', 'Basic Customer Management', 'Basic customer profiles', 'customers'),
            ('customer_advanced', 'Advanced Customer Management', 'Advanced customer analytics', 'customers'),
            ('appointments', 'Appointment Booking', 'Schedule and manage appointments', 'services'),
            ('loyalty', 'Loyalty Program', 'Customer loyalty and rewards', 'customers'),
            ('multi_outlet', 'Multi-Outlet', 'Manage multiple store locations', 'business'),
            ('multi_user', 'Multi-User', 'Multiple user accounts', 'business'),
            ('restaurant_pos', 'Restaurant POS', 'Restaurant-specific features', 'restaurant'),
            ('table_management', 'Table Management', 'Restaurant table management', 'restaurant'),
            ('kitchen_display', 'Kitchen Display', 'Kitchen order management', 'restaurant'),
            ('offline_mode', 'Offline Mode', 'Work without internet connection', 'system'),
            ('api_access', 'API Access', 'Custom integrations', 'system'),
            ('white_label', 'White Label', 'Custom branding options', 'business')
        ''')

        # Insert plan features
        cursor.execute('''
            INSERT OR IGNORE INTO plan_features (plan_id, feature_code, feature_name, enabled, max_value) VALUES
            -- Free Plan
            (1, 'pos_basic', 'Basic POS', 1, NULL),
            (1, 'inventory_basic', 'Basic Inventory', 1, 100),
            (1, 'customer_basic', 'Basic Customer Management', 1, 50),
            
            -- Basic Plan
            (2, 'pos_advanced', 'Advanced POS', 1, NULL),
            (2, 'inventory_advanced', 'Advanced Inventory', 1, NULL),
            (2, 'customer_advanced', 'Advanced Customer Management', 1, NULL),
            (2, 'multi_user', 'Multi-User', 1, 3),
            (2, 'offline_mode', 'Offline Mode', 1, NULL),
            
            -- Professional Plan
            (3, 'appointments', 'Appointment Booking', 1, NULL),
            (3, 'loyalty', 'Loyalty Program', 1, NULL),
            (3, 'multi_outlet', 'Multi-Outlet', 1, 5),
            (3, 'multi_user', 'Multi-User', 1, 10),
            (3, 'api_access', 'API Access', 1, NULL),
            
            -- Enterprise Plan
            (4, 'restaurant_pos', 'Restaurant POS', 1, NULL),
            (4, 'table_management', 'Table Management', 1, NULL),
            (4, 'kitchen_display', 'Kitchen Display', 1, NULL),
            (4, 'multi_outlet', 'Multi-Outlet', 1, NULL),
            (4, 'multi_user', 'Multi-User', 1, NULL),
            (4, 'white_label', 'White Label', 1, NULL)
        ''')

        conn.commit()
        conn.close()

    def create_user(self, email, password_hash, full_name=None, phone=None):
        """Create a new user"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        try:
            cursor.execute('''
                INSERT INTO users (email, password_hash, full_name, phone)
                VALUES (?, ?, ?, ?)
            ''', (email, password_hash, full_name, phone))
            
            user_id = cursor.lastrowid
            conn.commit()
            return user_id
        except sqlite3.IntegrityError:
            return None
        finally:
            conn.close()

    def create_organization(self, name, subdomain, business_type, user_id, plan_id=2):
        """Create a new organization and link it to a user"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        try:
            # Create organization
            trial_end = datetime.now() + timedelta(days=14)
            cursor.execute('''
                INSERT INTO organizations (name, subdomain, business_type, plan_id, trial_end)
                VALUES (?, ?, ?, ?, ?)
            ''', (name, subdomain, business_type, plan_id, trial_end))
            
            org_id = cursor.lastrowid
            
            # Link user to organization as owner
            cursor.execute('''
                INSERT INTO user_organizations (user_id, organization_id, role)
                VALUES (?, ?, 'owner')
            ''', (user_id, org_id))
            
            conn.commit()
            return org_id
        except sqlite3.IntegrityError:
            return None
        finally:
            conn.close()

    def check_subdomain_availability(self, subdomain):
        """Check if a subdomain is available"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        cursor.execute('SELECT id FROM organizations WHERE subdomain = ?', (subdomain,))
        result = cursor.fetchone()
        
        conn.close()
        return result is None

    def get_user_by_email(self, email):
        """Get user by email"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        cursor.execute('SELECT * FROM users WHERE email = ?', (email,))
        user = cursor.fetchone()
        
        conn.close()
        return user

    def get_user_organizations(self, user_id):
        """Get all organizations for a user"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        cursor.execute('''
            SELECT o.*, uo.role, p.name as plan_name, p.price as plan_price
            FROM organizations o
            JOIN user_organizations uo ON o.id = uo.organization_id
            JOIN plans p ON o.plan_id = p.id
            WHERE uo.user_id = ?
        ''', (user_id,))
        
        organizations = cursor.fetchall()
        conn.close()
        return organizations

    def get_plan_features(self, plan_id):
        """Get features for a specific plan"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        cursor.execute('''
            SELECT pf.*, f.name as feature_name, f.description as feature_description
            FROM plan_features pf
            JOIN features f ON pf.feature_code = f.code
            WHERE pf.plan_id = ? AND pf.enabled = 1
        ''', (plan_id,))
        
        features = cursor.fetchall()
        conn.close()
        return features

    def is_feature_enabled(self, organization_id, feature_code):
        """Check if a feature is enabled for an organization"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        cursor.execute('''
            SELECT pf.enabled, pf.max_value
            FROM organizations o
            JOIN plan_features pf ON o.plan_id = pf.plan_id
            WHERE o.id = ? AND pf.feature_code = ?
        ''', (organization_id, feature_code))
        
        result = cursor.fetchone()
        conn.close()
        
        if not result or not result[0]:
            return False
        
        # If there's a max value, check usage
        if result[1]:
            # TODO: Implement usage tracking
            pass
        
        return True

    def update_user_last_login(self, user_id):
        """Update user's last login timestamp"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        cursor.execute('''
            UPDATE users 
            SET last_login = CURRENT_TIMESTAMP 
            WHERE id = ?
        ''', (user_id,))
        
        conn.commit()
        conn.close()

# Initialize database
db = Database() 