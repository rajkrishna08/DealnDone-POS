# DealNDone 2025 - Setup Guide

## 🚀 Quick Start

### Option 1: Use Batch Files (Windows)
1. **Start Backend**: Double-click `start_backend.bat`
2. **Start Frontend**: Double-click `start_frontend.bat` (in a new window)
3. **Open Browser**: Go to `http://localhost:3000`

### Option 2: Manual Commands

#### Start Backend Server
```powershell
cd backend
python main.py
```
**Expected Output**: `Uvicorn running on http://0.0.0.0:8000`

#### Start Frontend Server
```powershell
cd frontend
npm start
```
**Expected Output**: Browser opens to `http://localhost:3000`

## 📁 Project Structure
```
dealndone2025/
├── backend/
│   ├── main.py              # FastAPI server
│   ├── requirements.txt     # Python dependencies
│   ├── test_api.py         # API tests
│   └── dealndone.db        # SQLite database
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── POSScreen.jsx
│   │   │   └── ProductCard.jsx
│   │   ├── App.js
│   │   ├── index.js
│   │   └── index.css
│   ├── package.json
│   └── tailwind.config.js
├── start_backend.bat       # Windows backend starter
├── start_frontend.bat      # Windows frontend starter
└── README.md
```

## 🔧 Troubleshooting

### Backend Issues
1. **Port 8000 in use**: Change port in `backend/main.py` line 68
2. **Missing dependencies**: Run `pip install -r backend/requirements.txt`
3. **Database errors**: Delete `backend/dealndone.db` and restart

### Frontend Issues
1. **Port 3000 in use**: React will automatically suggest another port
2. **Missing dependencies**: Run `npm install` in `frontend/` directory
3. **API connection errors**: Make sure backend is running on `localhost:8000`

### PowerShell Commands
```powershell
# Navigate to project
cd C:\Users\keert\Documents\dealndone2025

# Start backend
cd backend; python main.py

# Start frontend (new terminal)
cd frontend; npm start
```

## 🧪 Testing

### Test Backend API
```powershell
cd backend
python test_api.py
```

### Test Frontend
1. Open `http://localhost:3000`
2. Click on a shirt product
3. Adjust quantity
4. Click "Sell Shirt"
5. Check for success message

## 📊 API Endpoints

- `GET /` - API status
- `GET /health` - Health check
- `POST /sales` - Process sales

## 🎯 Features Working

✅ **Backend**: FastAPI with SQLite database  
✅ **Frontend**: React with Tailwind CSS  
✅ **API Integration**: Real-time communication  
✅ **Product Selection**: Click to select shirts  
✅ **Quantity Control**: +/- buttons  
✅ **Search**: Find products by name/SKU  
✅ **Stock Display**: Shows available inventory  
✅ **Error Handling**: Proper validation  
✅ **Responsive Design**: Works on all devices  

## 🚀 Your POS System is Ready!

1. **Backend**: Running on `http://localhost:8000`
2. **Frontend**: Running on `http://localhost:3000`
3. **Database**: SQLite storing all sales
4. **UI**: Modern, responsive interface

**Congratulations! Your DealNDone 2025 POS system is fully operational!** 🎉 