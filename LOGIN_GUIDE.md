# 🔐 Login Guide - Deal n Done POS System

## 🚀 **Quick Start**

### **Step 1: Start the Servers**
```bash
.\start_system.ps1
```

### **Step 2: Open the Application**
Go to: `http://localhost:3000`

### **Step 3: Login**
Click "Login" and use any of these test accounts:

## 📋 **Test Accounts**

| Store Name | Email | Password | Plan | Role |
|------------|-------|----------|------|------|
| **honey** | `honey@dealndone.com` | `Honey2025!` | Professional | Retailer |
| **teststore** | `test@dealndone.com` | `Test2025!` | Basic | Retailer |
| **prostore** | `pro@dealndone.com` | `Pro2025!` | Professional | Retailer |
| **enterprise** | `enterprise@dealndone.com` | `Enterprise2025!` | Enterprise | Retailer |
| **dealndone** | `ceo@dealndone.com` | `CEO2025!` | Custom | CEO |

## 🎯 **Login Process**

1. **Go to**: `http://localhost:3000`
2. **Click**: "Login" button
3. **Enter**:
   - **Store Name**: `honey` (or any test store)
   - **Email**: `honey@dealndone.com` (or corresponding email)
   - **Password**: `Honey2025!` (or corresponding password)
4. **Click**: "Login"
5. **Result**: You'll be redirected to the dashboard

## 🔧 **Troubleshooting**

### **If "Failed to fetch" error:**
- Make sure backend server is running: `cd backend && python main.py`
- Check if port 8000 is available
- Try refreshing the page

### **If "Invalid credentials" error:**
- Double-check the email and password
- Make sure you're using the correct store name
- Try a different test account

### **If servers won't start:**
- Check if ports 3000 and 8000 are free
- Try stopping other applications using these ports
- Restart your computer if needed

## 🧪 **Test Login Script**

Run this to test all accounts:
```bash
python test_login.py
```

## 🎉 **Success Indicators**

You'll know it's working when:
- ✅ Login form accepts credentials
- ✅ No "Failed to fetch" errors
- ✅ Redirects to dashboard after login
- ✅ Shows store information in dashboard

---

**💡 Tip**: Use the **honey** account for the best experience - it has the Professional plan with all features enabled! 