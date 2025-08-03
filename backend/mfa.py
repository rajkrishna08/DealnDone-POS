import random
import secrets
import sqlite3
from datetime import datetime, timedelta
from typing import Optional

# In-memory OTP store (use Redis in production)
otp_store = {}

def generate_otp() -> str:
    """Generate a 6-digit OTP"""
    return str(random.randint(100000, 999999))

def send_otp(phone: str, user_id: str) -> bool:
    """Send OTP via SMS (simulated for demo)"""
    try:
        otp = generate_otp()
        expires_at = datetime.now() + timedelta(minutes=5)
        
        # Store OTP with expiration
        otp_store[phone] = {
            "otp": otp,
            "user_id": user_id,
            "expires_at": expires_at,
            "attempts": 0
        }
        
        # In production: Use Twilio
        # from twilio.rest import Client
        # client = Client(account_sid, auth_token)
        # message = client.messages.create(
        #     body=f"Your Honey POS verification code: {otp}",
        #     from_=twilio_number,
        #     to=phone
        # )
        
        print(f"📱 SMS to {phone}: Your verification code is {otp}")
        return True
        
    except Exception as e:
        print(f"Error sending OTP: {e}")
        return False

def verify_otp(phone: str, otp: str) -> dict:
    """Verify OTP and return user info"""
    try:
        stored_data = otp_store.get(phone)
        
        if not stored_data:
            return {"success": False, "message": "No OTP found"}
        
        # Check expiration
        if datetime.now() > stored_data["expires_at"]:
            del otp_store[phone]
            return {"success": False, "message": "OTP expired"}
        
        # Check attempts
        if stored_data["attempts"] >= 3:
            del otp_store[phone]
            return {"success": False, "message": "Too many attempts"}
        
        # Verify OTP
        if stored_data["otp"] == otp:
            user_id = stored_data["user_id"]
            del otp_store[phone]
            
            # Get user info from database
            conn = sqlite3.connect('dealndone.db')
            cursor = conn.cursor()
            
            cursor.execute('''
                SELECT u.id, u.email, u.store_name, u.role, o.plan_type
                FROM users u
                JOIN organizations o ON u.org_id = o.id
                WHERE u.id = ?
            ''', (user_id,))
            
            user_data = cursor.fetchone()
            conn.close()
            
            if user_data:
                return {
                    "success": True,
                    "user_id": user_data[0],
                    "email": user_data[1],
                    "store_name": user_data[2],
                    "role": user_data[3],
                    "plan_type": user_data[4]
                }
            else:
                return {"success": False, "message": "User not found"}
        else:
            # Increment attempts
            stored_data["attempts"] += 1
            return {"success": False, "message": "Invalid OTP"}
            
    except Exception as e:
        return {"success": False, "message": f"Error: {str(e)}"}

def enable_mfa(user_id: str, phone: str) -> bool:
    """Enable MFA for a user"""
    try:
        conn = sqlite3.connect('dealndone.db')
        cursor = conn.cursor()
        
        cursor.execute('''
            UPDATE users 
            SET mfa_enabled = ?, mfa_phone = ?
            WHERE id = ?
        ''', (True, phone, user_id))
        
        conn.commit()
        conn.close()
        return True
        
    except Exception as e:
        print(f"Error enabling MFA: {e}")
        return False

def disable_mfa(user_id: str) -> bool:
    """Disable MFA for a user"""
    try:
        conn = sqlite3.connect('dealndone.db')
        cursor = conn.cursor()
        
        cursor.execute('''
            UPDATE users 
            SET mfa_enabled = ?, mfa_phone = ?
            WHERE id = ?
        ''', (False, None, user_id))
        
        conn.commit()
        conn.close()
        return True
        
    except Exception as e:
        print(f"Error disabling MFA: {e}")
        return False

def is_mfa_enabled(user_id: str) -> bool:
    """Check if MFA is enabled for user"""
    try:
        conn = sqlite3.connect('dealndone.db')
        cursor = conn.cursor()
        
        cursor.execute('''
            SELECT mfa_enabled FROM users WHERE id = ?
        ''', (user_id,))
        
        result = cursor.fetchone()
        conn.close()
        
        return result and result[0]
        
    except Exception as e:
        print(f"Error checking MFA status: {e}")
        return False 