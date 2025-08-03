# 🎯 Test Accounts for Deal n Done POS System

## 📋 **Ready-to-Use Test Accounts**

### **👑 CEO/Stakeholder Account (Full Access)**
- **Store Name**: `dealndone`
- **Email**: `ceo@dealndone.com`
- **Password**: `CEO2025!`
- **Plan**: Custom (Unlimited Everything)
- **Role**: CEO/Administrator
- **Subdomain**: `dealndone.dealndone.com`
- **Features**: Unlimited outlets, products, employees, all admin features

### **🏪 Basic Plan Store**
- **Store Name**: `teststore`
- **Email**: `test@dealndone.com`
- **Password**: `Test123!`
- **Plan**: Basic ($29/month)
- **Subdomain**: `teststore.dealndone.com`

### **🏢 Professional Plan Store**
- **Store Name**: `prostore`
- **Email**: `pro@dealndone.com`
- **Password**: `Pro123!`
- **Plan**: Professional ($79/month)
- **Subdomain**: `prostore.dealndone.com`

### **🏭 Enterprise Plan Store**
- **Store Name**: `enterprise`
- **Email**: `enterprise@dealndone.com`
- **Password**: `Enterprise123!`
- **Plan**: Enterprise ($199/month)
- **Subdomain**: `enterprise.dealndone.com`

### **🛍️ Retail Store Example**
- **Store Name**: `honey`
- **Email**: `honey@dealndone.com`
- **Password**: `Honey123!`
- **Plan**: Professional
- **Subdomain**: `honey.dealndone.com`

## 🚀 **How to Use These Accounts**

### **Option 1: Sign Up New Account**
1. Go to `http://localhost:3000`
2. Click "Start Free Trial"
3. Use any of the store names above
4. Fill in the form with the credentials
5. Click "Create My Store"

### **Option 2: Login with Existing Account**
1. Go to `http://localhost:3000`
2. Click "Login"
3. Enter store name and email
4. Enter password
5. Click "Login to Store"

## 🔧 **Quick Start Commands**

```bash
# Start both servers
npm run dev

# Or use the startup script
.\start_system.ps1
```

## 📱 **Access URLs**
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs

## 🎯 **Test Scenarios**

### **CEO/Stakeholder Testing**
- Login with `dealndone` account
- Test unlimited features
- Access all administrative functions
- Test platform-level settings
- Monitor all stores and users

### **Basic Plan Testing**
- Login with `teststore` account
- Test 1 outlet limit
- Test 1,000 product limit
- Try to add more outlets (should be blocked)

### **Professional Plan Testing**
- Login with `prostore` account
- Test 2 outlets
- Test 10,000 products
- Test advanced features

### **Enterprise Plan Testing**
- Login with `enterprise` account
- Test unlimited features
- Test all advanced capabilities

## 🔐 **Security Notes**
- These are test accounts only
- Passwords are simple for testing
- In production, use strong passwords
- All data is stored locally in SQLite

## 🎨 **Features to Test**
- ✅ Modern landing page
- ✅ Real-time subdomain preview
- ✅ Enhanced signup form
- ✅ Plan selection and validation
- ✅ Login functionality
- ✅ Dashboard access
- ✅ Plan limit enforcement
- ✅ Usage tracking
- ✅ CEO/Admin privileges 