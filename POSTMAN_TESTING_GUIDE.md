# 🧪 **DealNDone 2025 - Postman API Testing Guide**

## 📋 **Table of Contents**
1. [Setup Instructions](#setup-instructions)
2. [Import Postman Collection](#import-postman-collection)
3. [Testing Scenarios](#testing-scenarios)
4. [API Endpoints Overview](#api-endpoints-overview)
5. [Authentication Flow](#authentication-flow)
6. [Testing Checklist](#testing-checklist)
7. [Troubleshooting](#troubleshooting)

---

## 🚀 **Setup Instructions**

### **Prerequisites**
- ✅ **Postman Desktop App** (Download from [postman.com](https://www.postman.com/downloads/))
- ✅ **Backend Server Running** (FastAPI server on port 8000 or 8005)
- ✅ **Database Initialized** (SQLite database with sample data)

### **Backend Server Setup**
```bash
# Navigate to backend directory
cd backend

# Install dependencies
pip install -r requirements.txt

# Start the server (choose one):
# Option 1: Full backend with all features
python auth_main.py

# Option 2: Simple backend for basic testing
python simple_main.py

# Option 3: Using uvicorn directly
uvicorn auth_main:app --host 0.0.0.0 --port 8000 --reload
```

### **Verify Server Status**
```bash
# Test health endpoint
curl http://localhost:8000/health

# Expected response:
{
  "status": "healthy",
  "timestamp": "2025-08-04T12:00:00.000Z"
}
```

---

## 📥 **Import Postman Collection**

### **Step 1: Import Collection**
1. **Open Postman**
2. **Click "Import"** (top left)
3. **Select "Upload Files"**
4. **Choose `DealNDone_API_Collection.json`**
5. **Click "Import"**

### **Step 2: Configure Environment**
1. **Click "Environments"** (left sidebar)
2. **Click "Create Environment"**
3. **Name**: `DealNDone Local`
4. **Add Variables**:
   - `base_url`: `http://localhost:8000`
   - `access_token`: (leave empty, will be auto-filled)

### **Step 3: Select Environment**
1. **Click the environment dropdown** (top right)
2. **Select "DealNDone Local"**

---

## 🧪 **Testing Scenarios**

### **Scenario 1: Basic Health Check**
**Objective**: Verify server is running
1. **Run**: `Health Check`
2. **Expected**: 200 OK with status "healthy"
3. **If Failed**: Check server is running on correct port

### **Scenario 2: User Registration & Authentication**
**Objective**: Test complete user lifecycle
1. **Run**: `User Signup`
   - **Body**: Update email to unique value
   - **Expected**: 200 OK with access_token
2. **Run**: `User Login`
   - **Body**: Use same credentials
   - **Expected**: 200 OK with access_token
3. **Run**: `Get Current User`
   - **Expected**: 200 OK with user details

### **Scenario 3: Store Management**
**Objective**: Test store creation and management
1. **Run**: `Check Subdomain Availability`
   - **Expected**: 200 OK with availability status
2. **Run**: `Create Store`
   - **Body**: Update subdomain to unique value
   - **Expected**: 200 OK with store details
3. **Run**: `Get Store Info`
   - **Expected**: 200 OK with store information

### **Scenario 4: Product Management**
**Objective**: Test CRUD operations for products
1. **Run**: `Get All Products`
   - **Expected**: 200 OK with product list
2. **Run**: `Create Product`
   - **Body**: Customize product details
   - **Expected**: 200 OK with created product
3. **Run**: `Update Product`
   - **Expected**: 200 OK with updated product
4. **Run**: `Delete Product`
   - **Expected**: 200 OK with deletion confirmation

### **Scenario 5: Sales Processing**
**Objective**: Test sales workflow
1. **Run**: `Process Sale`
   - **Body**: Use valid product IDs
   - **Expected**: 200 OK with sale confirmation
2. **Run**: `Get Sales History`
   - **Expected**: 200 OK with sales list

### **Scenario 6: Reports & Analytics**
**Objective**: Test reporting features
1. **Run**: `Get Reports Overview`
   - **Expected**: 200 OK with report summary
2. **Run**: `Get Sales Reports`
   - **Expected**: 200 OK with sales analytics
3. **Run**: `Get AI Predictions`
   - **Expected**: 200 OK with predictions

### **Scenario 7: Enterprise Features**
**Objective**: Test premium features (requires Enterprise plan)
1. **Run**: `Create Franchise`
   - **Expected**: 200 OK or 403 Forbidden (plan dependent)
2. **Run**: `Transfer Stock`
   - **Expected**: 200 OK or 403 Forbidden (plan dependent)

---

## 📊 **API Endpoints Overview**

### **🔐 Authentication (6 endpoints)**
| Endpoint | Method | Description | Auth Required |
|----------|--------|-------------|---------------|
| `/health` | GET | Health check | ❌ |
| `/auth/signup` | POST | User registration | ❌ |
| `/auth/login` | POST | User login | ❌ |
| `/auth/me` | GET | Get current user | ✅ |
| `/auth/check-subdomain/{subdomain}` | GET | Check subdomain | ❌ |
| `/plans` | GET | Get available plans | ❌ |

### **🏪 Store Management (4 endpoints)**
| Endpoint | Method | Description | Auth Required |
|----------|--------|-------------|---------------|
| `/stores/create` | POST | Create store | ❌ |
| `/stores/{subdomain}/info` | GET | Get store info | ❌ |
| `/stores/check-availability/{subdomain}` | GET | Check availability | ❌ |
| `/api/stores/current` | GET | Get current store | ✅ |

### **📦 Products (7 endpoints)**
| Endpoint | Method | Description | Auth Required |
|----------|--------|-------------|---------------|
| `/products` | GET | Get all products | ✅ |
| `/products/{id}` | GET | Get product by ID | ✅ |
| `/api/products` | POST | Create product | ✅ |
| `/api/products/{id}` | PUT | Update product | ✅ |
| `/api/products/{id}` | DELETE | Delete product | ✅ |
| `/products/{id}/stock` | PUT | Update stock | ✅ |

### **💰 Sales (2 endpoints)**
| Endpoint | Method | Description | Auth Required |
|----------|--------|-------------|---------------|
| `/sales` | POST | Process sale | ✅ |
| `/sales/history` | GET | Get sales history | ✅ |

### **📊 Reports (6 endpoints)**
| Endpoint | Method | Description | Auth Required |
|----------|--------|-------------|---------------|
| `/api/reports/overview` | GET | Reports overview | ✅ |
| `/api/reports/sales` | GET | Sales reports | ✅ |
| `/api/reports/products` | GET | Product reports | ✅ |
| `/api/reports/customers` | GET | Customer reports | ✅ |
| `/api/reports/predictions` | GET | AI predictions | ✅ |
| `/api/reports/real-time` | GET | Real-time data | ✅ |

### **🤖 MCP & AI (5 endpoints)**
| Endpoint | Method | Description | Auth Required |
|----------|--------|-------------|---------------|
| `/api/mcp/status` | GET | MCP status | ✅ |
| `/api/mcp/inventory-check` | POST | Trigger inventory check | ✅ |
| `/api/mcp/customer-service` | POST | Trigger customer service | ✅ |
| `/api/mcp/agents/{type}` | GET | Agent status | ✅ |
| `/api/mcp/performance` | GET | Performance metrics | ✅ |

### **⚙️ Features (4 endpoints)**
| Endpoint | Method | Description | Auth Required |
|----------|--------|-------------|---------------|
| `/api/features` | GET | Get user features | ✅ |
| `/api/features/{name}` | GET | Check feature status | ✅ |
| `/api/features/emergency-disable/{name}` | POST | Disable feature | ✅ |
| `/api/features/analytics/{name}` | GET | Feature analytics | ✅ |

### **🏢 Enterprise (2 endpoints)**
| Endpoint | Method | Description | Auth Required |
|----------|--------|-------------|---------------|
| `/api/franchise/create` | POST | Create franchise | ✅ |
| `/api/inventory/transfer` | POST | Transfer stock | ✅ |

### **📋 Categories (4 endpoints)**
| Endpoint | Method | Description | Auth Required |
|----------|--------|-------------|---------------|
| `/api/categories` | GET | Get categories | ✅ |
| `/api/categories` | POST | Create category | ✅ |
| `/api/categories/{id}` | PUT | Update category | ✅ |
| `/api/categories/{id}` | DELETE | Delete category | ✅ |

### **🖼️ Product Images (4 endpoints)**
| Endpoint | Method | Description | Auth Required |
|----------|--------|-------------|---------------|
| `/api/product-images` | GET | Get images | ✅ |
| `/api/product-images` | POST | Create image | ✅ |
| `/api/product-images/{id}` | PUT | Update image | ✅ |
| `/api/product-images/{id}` | DELETE | Delete image | ✅ |

### **💳 Subscription (2 endpoints)**
| Endpoint | Method | Description | Auth Required |
|----------|--------|-------------|---------------|
| `/subscription` | GET | Get subscription | ✅ |
| `/subscription/upgrade` | PUT | Upgrade subscription | ✅ |

---

## 🔐 **Authentication Flow**

### **Step-by-Step Authentication Testing**

1. **Health Check First**
   ```bash
   GET http://localhost:8000/health
   ```

2. **Register New User**
   ```json
   POST http://localhost:8000/auth/signup
   {
     "business_name": "Test Store",
     "email": "test@dealndone.com",
     "password": "TestPassword123!",
     "confirm_password": "TestPassword123!",
     "plan_type": "professional",
     "subdomain": "teststore",
     "phone": "+1234567890",
     "address": "123 Test Street, Test City"
   }
   ```

3. **Login with Credentials**
   ```json
   POST http://localhost:8000/auth/login
   {
     "identifier": "test@dealndone.com",
     "password": "TestPassword123!"
   }
   ```

4. **Verify Token Works**
   ```bash
   GET http://localhost:8000/auth/me
   Authorization: Bearer <access_token>
   ```

### **Token Management**
- **Auto-Save**: Postman automatically saves access tokens
- **Manual Update**: Update `access_token` variable if needed
- **Token Expiry**: Tokens expire after 30 minutes

---

## ✅ **Testing Checklist**

### **Pre-Testing Setup**
- [ ] Postman installed and running
- [ ] Backend server started on correct port
- [ ] Database initialized with sample data
- [ ] Environment variables configured
- [ ] Collection imported successfully

### **Authentication Testing**
- [ ] Health check returns 200 OK
- [ ] User signup creates account successfully
- [ ] User login returns access token
- [ ] Get current user returns user details
- [ ] Subdomain availability check works
- [ ] Plans endpoint returns available plans

### **Store Management Testing**
- [ ] Store creation works with unique subdomain
- [ ] Store info retrieval works
- [ ] Store availability checking works
- [ ] Current store info returns correct data

### **Product Management Testing**
- [ ] Get all products returns product list
- [ ] Create product adds new product
- [ ] Update product modifies existing product
- [ ] Delete product removes product
- [ ] Stock update works correctly

### **Sales Processing Testing**
- [ ] Process sale with valid items
- [ ] Sales history returns transaction list
- [ ] Stock levels update after sale
- [ ] Error handling for invalid products

### **Reports & Analytics Testing**
- [ ] Reports overview returns summary
- [ ] Sales reports return analytics
- [ ] Product reports return performance data
- [ ] Customer reports return customer analytics
- [ ] AI predictions return insights
- [ ] Real-time data returns current metrics

### **MCP & AI Testing**
- [ ] MCP status returns orchestrator info
- [ ] Inventory check triggers AI analysis
- [ ] Customer service triggers AI response
- [ ] Agent status returns specific agent info
- [ ] Performance metrics return MCP data

### **Feature Management Testing**
- [ ] Get user features returns available features
- [ ] Feature status check works
- [ ] Emergency disable works (admin only)
- [ ] Feature analytics returns usage data

### **Enterprise Features Testing**
- [ ] Franchise creation (Enterprise plan only)
- [ ] Stock transfer between locations
- [ ] Plan-based access control works
- [ ] Error handling for unauthorized access

### **Category Management Testing**
- [ ] Get categories returns category list
- [ ] Create category adds new category
- [ ] Update category modifies existing
- [ ] Delete category removes category

### **Product Images Testing**
- [ ] Get product images returns image list
- [ ] Create product image adds new image
- [ ] Update product image modifies existing
- [ ] Delete product image removes image

### **Subscription Testing**
- [ ] Get subscription returns current plan
- [ ] Upgrade subscription changes plan
- [ ] Plan limits are enforced correctly
- [ ] Trial period works as expected

---

## 🔧 **Troubleshooting**

### **Common Issues & Solutions**

#### **1. Server Connection Issues**
**Problem**: `Connection refused` or `Network Error`
**Solutions**:
```bash
# Check if server is running
curl http://localhost:8000/health

# Start server if not running
cd backend
python auth_main.py

# Check port availability
netstat -an | findstr :8000
```

#### **2. Authentication Errors**
**Problem**: `401 Unauthorized` or `403 Forbidden`
**Solutions**:
- Verify access token is valid
- Check token expiration (30 minutes)
- Re-login to get new token
- Verify user has required permissions

#### **3. Database Errors**
**Problem**: `500 Internal Server Error` with database messages
**Solutions**:
```bash
# Reinitialize database
cd backend
python -c "from database import init_database; init_database()"

# Check database file exists
ls -la dealndone.db
```

#### **4. Import Errors**
**Problem**: `ModuleNotFoundError` or missing dependencies
**Solutions**:
```bash
# Install missing dependencies
pip install numpy pandas fastapi uvicorn sqlalchemy

# Check requirements.txt
pip install -r requirements.txt
```

#### **5. CORS Errors**
**Problem**: Browser shows CORS errors
**Solutions**:
- Use Postman instead of browser
- Check CORS middleware is enabled
- Verify server allows all origins

#### **6. Plan Access Errors**
**Problem**: `403 Forbidden` on Enterprise features
**Solutions**:
- Upgrade user to Enterprise plan
- Check plan limits in database
- Verify feature gating middleware

### **Debug Mode**
Enable debug logging:
```bash
# Set environment variable
export LOG_LEVEL=DEBUG

# Start server with debug
python auth_main.py
```

### **Database Inspection**
```bash
# Connect to SQLite database
sqlite3 dealndone.db

# Check tables
.tables

# Check users
SELECT * FROM users;

# Check products
SELECT * FROM products;

# Exit
.quit
```

---

## 📈 **Performance Testing**

### **Load Testing with Postman**
1. **Create Runner Collection**
2. **Set iterations**: 100
3. **Set delay**: 100ms
4. **Run authentication flow**
5. **Monitor response times**

### **Expected Performance**
- **Health Check**: < 50ms
- **Authentication**: < 200ms
- **Product List**: < 100ms
- **Sales Processing**: < 300ms
- **Reports**: < 500ms

---

## 🎯 **Success Criteria**

### **All Tests Pass When**:
- ✅ **Health check returns 200 OK**
- ✅ **Authentication flow works end-to-end**
- ✅ **All CRUD operations succeed**
- ✅ **Plan-based access control works**
- ✅ **Error handling returns proper status codes**
- ✅ **Response times are within acceptable limits**
- ✅ **Data persistence works correctly**

### **Ready for Production When**:
- ✅ **All endpoints tested successfully**
- ✅ **Authentication and authorization work**
- ✅ **Error handling is robust**
- ✅ **Performance meets requirements**
- ✅ **Security measures are in place**
- ✅ **Documentation is complete**

---

## 📞 **Support**

### **If You Need Help**:
1. **Check the troubleshooting section above**
2. **Verify server logs for error messages**
3. **Test with curl commands first**
4. **Check database state**
5. **Review environment configuration**

### **Useful Commands**:
```bash
# Check server status
curl http://localhost:8000/health

# Test authentication
curl -X POST http://localhost:8000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"identifier":"test@dealndone.com","password":"TestPassword123!"}'

# Check database
sqlite3 dealndone.db ".tables"
```

---

**🎉 Happy Testing! Your DealNDone 2025 API is ready for comprehensive validation!** 