# DealNDone 2025 - Complete Setup Guide

## 🎯 **Project Overview**

**DealNDone 2025** is an enterprise-grade omnichannel SaaS Point of Sale (POS) system designed to handle 1M+ customers across multiple retail locations. This guide will help you set up the complete system for development and production use.

---

## 🚀 **Quick Start Options**

### **Option 1: Automatic Setup (Recommended for Windows)**
1. **Start Backend**: Double-click `start_backend.bat`
2. **Start Frontend**: Double-click `start_frontend.bat` (in a new window)
3. **Open Browser**: Go to `http://localhost:3000`

### **Option 2: PowerShell Setup (Windows)**
```powershell
# Navigate to project
cd C:\Users\keert\Documents\dealndone2025

# Start backend
cd backend
python main.py

# Start frontend (new terminal)
cd frontend
npm start
```

### **Option 3: Manual Setup (Cross-platform)**
```bash
# 1. Clone the Repository
git clone https://github.com/your-org/dealndone2025.git
cd dealndone2025

# 2. Backend Setup
cd backend
pip install -r requirements.txt
python main.py

# 3. Frontend Setup (in new terminal)
cd frontend
npm install
npm start
```

---

## 📋 **Prerequisites**

### **System Requirements**
- **Operating System**: Windows 10/11, macOS, or Linux
- **Node.js**: Version 16 or higher
- **Python**: Version 3.12 or higher
- **Git**: Latest version
- **npm or yarn**: Package managers

### **Installation Commands**
```bash
# Install Node.js (if not installed)
# Download from https://nodejs.org/

# Install Python (if not installed)
# Download from https://python.org/

# Verify installations
node --version
npm --version
python --version
pip --version
```

---

## 🔧 **Detailed Setup Instructions**

### **Step 1: Backend Setup**

#### **Install Python Dependencies**
```bash
cd backend
pip install -r requirements.txt
```

#### **Environment Configuration**
Create a `.env` file in the backend directory:
```env
# Database Configuration
DATABASE_URL=sqlite:///./dealndone.db
COSMOS_DB_CONNECTION_STRING=your_cosmos_db_connection

# Security
SECRET_KEY=your_secret_key_here
JWT_SECRET=your_jwt_secret_here

# Azure Configuration
AZURE_CLIENT_ID=your_azure_client_id
AZURE_TENANT_ID=your_azure_tenant_id

# API Configuration
API_HOST=0.0.0.0
API_PORT=8000
CORS_ORIGINS=http://localhost:3000
```

#### **Start Backend Server**
```bash
cd backend
python main.py
```

**Expected Output**: 
```
INFO:     Uvicorn running on http://0.0.0.0:8000 (Press CTRL+C to quit)
INFO:     Started reloader process [12345] using WatchFiles
INFO:     Started server process [12346]
INFO:     Waiting for application startup.
INFO:     Application startup complete.
```

### **Step 2: Frontend Setup**

#### **Install Node.js Dependencies**
```bash
cd frontend
npm install
```

#### **Start Frontend Development Server**
```bash
cd frontend
npm start
```

**Expected Output**: Browser automatically opens to `http://localhost:3000`

---

## 📁 **Project Structure**

```
dealndone2025/
├── frontend/                          # React frontend application
│   ├── src/
│   │   ├── components/               # React components
│   │   │   ├── POSScreen.jsx        # Main POS interface
│   │   │   ├── ProductCard.jsx      # Product display component
│   │   │   ├── Login.jsx            # Authentication component
│   │   │   ├── Dashboard.jsx        # Analytics dashboard
│   │   │   ├── ModernPOS.jsx        # Modern POS interface
│   │   │   ├── MobilePOS.jsx        # Mobile POS interface
│   │   │   └── ...                  # Additional components
│   │   ├── data/
│   │   │   └── dummyData.js         # Sample data for development
│   │   ├── utils/
│   │   │   └── settingsService.js   # Settings management
│   │   ├── App.js                   # Main app component
│   │   └── index.js                 # React entry point
│   ├── public/                      # Static assets
│   ├── package.json                 # Frontend dependencies
│   └── tailwind.config.js          # Tailwind configuration
├── backend/                         # FastAPI backend application
│   ├── ai/                         # AI and ML components
│   │   └── orchestrator.py         # AI orchestration
│   ├── main.py                     # FastAPI server entry point
│   ├── security.py                 # Security middleware
│   ├── monitoring.py               # Application monitoring
│   ├── auth_main.py                # Authentication system
│   ├── franchise_endpoints.py      # Multi-location management
│   ├── requirements.txt            # Python dependencies
│   └── Dockerfile                  # Backend containerization
├── start_backend.bat               # Windows backend starter
├── start_frontend.bat              # Windows frontend starter
├── start_system.bat                # Complete system starter
├── start_system.ps1                # PowerShell system starter
└── README.md                       # Main documentation
```

---

## 🧪 **Testing the Setup**

### **Backend API Testing**
```bash
cd backend
python test_api.py
```

**Expected Output**:
```
✅ Health check passed
✅ Products endpoint working
✅ Sales processing working
✅ Database operations working
```

### **Frontend Testing**
1. Open `http://localhost:3000`
2. Click on a shirt product
3. Adjust quantity using +/- buttons
4. Click "Sell Shirt" button
5. Check for success message

### **API Endpoint Testing**
```bash
# Test health endpoint
curl http://localhost:8000/health

# Test products endpoint
curl http://localhost:8000/products

# Test sales endpoint
curl -X POST http://localhost:8000/sales \
  -H "Content-Type: application/json" \
  -d '{"items":[{"id":"shirt_001","quantity":2}]}'
```

---

## 🔧 **Troubleshooting**

### **Backend Issues**

#### **Port 8000 Already in Use**
```bash
# Find process using port 8000
netstat -ano | findstr :8000

# Kill the process
taskkill /PID <process_id> /F

# Or change port in backend/main.py
```

#### **Missing Dependencies**
```bash
cd backend
pip install -r requirements.txt
```

#### **Database Errors**
```bash
# Delete and recreate database
cd backend
rm dealndone.db
python main.py
```

#### **Python Version Issues**
```bash
# Check Python version
python --version

# Should be 3.12 or higher
# If not, install Python 3.12+
```

### **Frontend Issues**

#### **Port 3000 Already in Use**
React will automatically suggest another port (e.g., 3001)

#### **Missing Dependencies**
```bash
cd frontend
npm install
```

#### **API Connection Errors**
1. Ensure backend is running on `localhost:8000`
2. Check CORS settings in backend
3. Verify API endpoints in frontend configuration

#### **Node.js Version Issues**
```bash
# Check Node.js version
node --version

# Should be 16 or higher
# If not, install Node.js 16+
```

### **General Issues**

#### **Permission Errors**
```bash
# Windows: Run as Administrator
# Linux/Mac: Use sudo if needed
```

#### **Network Issues**
```bash
# Check if ports are accessible
telnet localhost 8000
telnet localhost 3000
```

---

## 🚀 **Production Deployment**

### **Docker Deployment**
```bash
# Build and run with Docker Compose
docker-compose up --build
```

### **Azure Container Apps**
```bash
# Build frontend
cd frontend
npm run build

# Deploy to Azure Container Apps
az containerapp up --name dealndone-frontend --source .
```

### **Manual Production Setup**
```bash
# Backend production
cd backend
pip install -r requirements.txt
gunicorn main:app -w 4 -k uvicorn.workers.UvicornWorker

# Frontend production
cd frontend
npm run build
# Serve build folder with nginx or similar
```

---

## 📊 **Verification Checklist**

### **✅ Backend Verification**
- [ ] FastAPI server starts without errors
- [ ] Health endpoint responds: `http://localhost:8000/health`
- [ ] Products endpoint works: `http://localhost:8000/products`
- [ ] Database operations function correctly
- [ ] CORS is properly configured
- [ ] Authentication endpoints are accessible

### **✅ Frontend Verification**
- [ ] React app starts without errors
- [ ] UI loads at `http://localhost:3000`
- [ ] Product selection works
- [ ] Quantity controls function
- [ ] Sales processing works
- [ ] API connection status shows "Connected"
- [ ] Responsive design works on different screen sizes

### **✅ Integration Verification**
- [ ] Frontend can communicate with backend
- [ ] Sales transactions are processed correctly
- [ ] Inventory updates in real-time
- [ ] Error handling works properly
- [ ] Data persistence functions correctly

---

## 🎯 **Features Working**

### **✅ Core Features**
- **🛍️ Product Management**: Browse and search through available garments
- **🔍 Advanced Search**: Search by product name, SKU, or category
- **📊 Real-time Inventory**: Live stock level monitoring
- **💳 Sales Processing**: Complete checkout workflow
- **📱 Responsive Design**: Works on desktop, tablet, and mobile
- **🔗 API Integration**: Robust FastAPI backend
- **🔐 Authentication**: Secure login system
- **📈 Analytics Dashboard**: Real-time metrics
- **🏪 Multi-location Support**: Multiple store management
- **👥 User Management**: Role-based access

### **✅ Technical Features**
- **Backend**: FastAPI with SQLite database
- **Frontend**: React with Tailwind CSS
- **API Integration**: Real-time communication
- **Product Selection**: Click to select products
- **Quantity Control**: +/- buttons for quantity
- **Search**: Find products by name/SKU
- **Stock Display**: Shows available inventory
- **Error Handling**: Proper validation
- **Responsive Design**: Works on all devices

---

## 🚀 **Your POS System is Ready!**

### **Access Points**
1. **Frontend**: http://localhost:3000
2. **Backend API**: http://localhost:8000
3. **API Documentation**: http://localhost:8000/docs
4. **Health Check**: http://localhost:8000/health

### **Sample Products Available**
- `shirt_001` - Dress Shirt ($25.00)
- `shirt_002` - Casual Shirt ($20.00)
- `shirt_003` - Polo Shirt ($22.50)
- `pants_001` - Dress Pants ($35.00)
- `jacket_001` - Blazer ($75.00)

### **Next Steps**
1. **Test the system** using the verification checklist
2. **Explore the features** by processing sample sales
3. **Review the documentation** for advanced features
4. **Deploy to production** when ready

**Congratulations! Your DealNDone 2025 POS system is fully operational!** 🎉

---

## 📞 **Support & Help**

### **Documentation**
- [Main README](README.md) - Complete project overview
- [Architecture Guide](ARCHITECTURE.md) - System architecture
- [API Documentation](http://localhost:8000/docs) - Interactive API docs

### **Troubleshooting**
- Check the troubleshooting section above
- Review error logs in terminal output
- Verify all prerequisites are installed

### **Getting Help**
- **GitHub Issues**: Report bugs and feature requests
- **Documentation**: Comprehensive guides and tutorials
- **Community**: Developer community and forums

---

*Last updated: July 28, 2025* 