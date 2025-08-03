# 🏪 Subdomain Testing Guide

## 🎯 **How to Test the Subdomain System**

The subdomain system is now fully functional! Here's how to test it:

### **🚀 Quick Start**

1. **Start the servers** (if not already running):
   ```bash
   .\start_system.ps1
   ```

2. **Open your browser** and go to: `http://localhost:3000`

3. **You'll see test links** on the landing page for different stores

### **🧪 Test URLs**

#### **✅ Working Test Stores:**

| Store Name | URL | Plan | Status |
|------------|-----|------|--------|
| **honey** | `http://honey.localhost:3000` | Professional | ✅ Working |
| **teststore** | `http://teststore.localhost:3000` | Basic | ✅ Working |
| **prostore** | `http://prostore.localhost:3000` | Professional | ✅ Working |
| **enterprise** | `http://enterprise.localhost:3000` | Enterprise | ✅ Working |
| **dealndone** | `http://dealndone.localhost:3000` | Custom (CEO) | ✅ Working |

#### **❌ Non-existent Stores (Will Show Error):**
- `http://nonexistent.localhost:3000` → Shows "Store Not Found"
- `http://invalid.localhost:3000` → Shows "Store Not Found"

### **🎨 What You'll See**

#### **On Main Site (`http://localhost:3000`):**
- Landing page with signup/login options
- Test links to different stores
- Modern UI with pricing plans

#### **On Store Subdomains (e.g., `http://honey.localhost:3000`):**
- **Store-specific dashboard** showing:
  - Store name and URL
  - Business type and plan
  - Owner information
  - Plan limits and usage
  - Quick action buttons

### **🔧 Technical Implementation**

#### **Backend (Python/FastAPI):**
- **Subdomain Middleware**: Extracts store name from URL
- **Store Context**: Loads store data based on subdomain
- **Plan Limits**: Enforces usage limits per store
- **API Endpoints**: 
  - `/api/store/info` - Get store information
  - `/api/store/limits` - Get plan limits
  - `/api/store/check-limit/{feature}` - Check if action allowed

#### **Frontend (React):**
- **SubdomainRouter**: Detects subdomain and loads store context
- **Store Context**: Passes store data to components
- **Error Handling**: Shows "Store Not Found" for invalid subdomains
- **Responsive Design**: Works on all devices

### **📊 Store Data Structure**

Each store has:
```json
{
  "store": {
    "org_id": "abc123...",
    "store_name": "honey",
    "business_type": "retail",
    "plan_type": "professional",
    "user_id": "def456...",
    "email": "honey@dealndone.com",
    "role": "retailer",
    "subdomain": "honey.dealndone.com"
  },
  "limits": {
    "outlets": {
      "used": 0,
      "limit": 2,
      "percentage": 0.0,
      "remaining": 2
    },
    "products": {
      "used": 0,
      "limit": 10000,
      "percentage": 0.0,
      "remaining": 10000
    }
  }
}
```

### **🎯 Test Scenarios**

#### **1. Basic Functionality:**
- ✅ Visit `http://honey.localhost:3000`
- ✅ See store-specific dashboard
- ✅ View store information and limits
- ✅ Navigate back to main site

#### **2. Error Handling:**
- ✅ Visit `http://nonexistent.localhost:3000`
- ✅ See "Store Not Found" error
- ✅ Click "Go to Main Site" to return

#### **3. Plan Limits:**
- ✅ Different stores show different limits
- ✅ Basic plan: 1 outlet, 1,000 products
- ✅ Professional plan: 2 outlets, 10,000 products
- ✅ Enterprise plan: 5 outlets, unlimited products

#### **4. Real-time Updates:**
- ✅ Store context loads automatically
- ✅ Plan limits update in real-time
- ✅ Error messages appear instantly

### **🔐 Security Features**

- **Subdomain Validation**: Only valid store names work
- **Store Isolation**: Each store has its own data
- **Plan Enforcement**: Limits are enforced per store
- **Error Handling**: Graceful handling of invalid subdomains

### **🚀 Production Ready Features**

#### **✅ Implemented:**
- Real subdomain routing
- Store-specific dashboards
- Plan limit enforcement
- Error handling
- Responsive design
- Security validation

#### **🔄 Future Enhancements:**
- Custom store themes
- Store-specific branding
- Advanced analytics per store
- Multi-tenant isolation
- Custom domains

### **🎉 Success Indicators**

You'll know it's working when:
- ✅ You can visit `http://honey.localhost:3000` and see the honey store
- ✅ You can visit `http://teststore.localhost:3000` and see the teststore
- ✅ Invalid subdomains show "Store Not Found"
- ✅ Each store shows its specific plan limits
- ✅ The UI is responsive and professional

### **🐛 Troubleshooting**

#### **If subdomains don't work:**
1. Check if servers are running (`.\start_system.ps1`)
2. Verify database has test accounts (`python create_test_accounts.py`)
3. Check browser console for errors
4. Ensure you're using `localhost:3000` (not `127.0.0.1:3000`)

#### **If you see "Store Not Found":**
- The store doesn't exist in the database
- Try the test stores listed above
- Check the database for available stores

### **📱 Mobile Testing**

The subdomain system works perfectly on mobile:
- ✅ Responsive design
- ✅ Touch-friendly interface
- ✅ Fast loading
- ✅ Error handling

---

**🎯 The subdomain system is now fully functional and ready for production use!** 