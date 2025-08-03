# DealNDone 2025 - Men's Garments POS System

A modern Point of Sale (POS) system for men's garments with a FastAPI backend and responsive web frontend.

## Features

- ✅ **FastAPI Backend**: RESTful API with SQLite database
- ✅ **Modern Frontend**: Responsive web interface with real-time API status
- ✅ **Sales Processing**: Handle shirt sales at $25 per unit
- ✅ **Database Storage**: SQLite database for sales tracking
- ✅ **Error Handling**: Comprehensive error handling and validation
- ✅ **CORS Support**: Frontend-backend communication enabled
- ✅ **Health Checks**: API status monitoring

## Quick Start

### 1. Install Dependencies
```bash
cd backend
pip install -r requirements.txt
```

### 2. Start the Server
```bash
cd backend
python main.py
```
The API will be available at `http://localhost:8000`

### 3. Open the Frontend
Open `frontend/index.html` in your web browser or serve it with a local server.

## API Endpoints

### GET `/`
- **Description**: Root endpoint
- **Response**: API status and version

### GET `/health`
- **Description**: Health check endpoint
- **Response**: API and database status

### POST `/sales`
- **Description**: Process a sale
- **Request Body**:
```json
{
  "items": [
    {
      "id": "shirt_001",
      "quantity": 2
    }
  ]
}
```
- **Response**:
```json
{
  "status": "success",
  "total": 50.0,
  "items_processed": 1,
  "message": "Processed 1 items"
}
```

## Database Schema

The system uses SQLite with the following table:

```sql
CREATE TABLE sales (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    product_id TEXT,
    quantity INTEGER,
    total REAL
);
```

## Testing

Run the test script to verify API functionality:
```bash
cd backend
python test_api.py
```

## Project Structure

```
dealndone2025/
├── backend/
│   ├── main.py              # FastAPI server
│   ├── requirements.txt     # Python dependencies
│   ├── test_api.py         # API test script
│   └── dealndone.db        # SQLite database
├── frontend/
│   └── index.html          # Web interface
└── # DealNDone POS System

A simple, modern Point of Sale (POS) system for men's garments retail, built with FastAPI backend and vanilla HTML/CSS/JavaScript frontend.

## 🚀 Quick Start

### Option 1: Automatic Setup (Recommended)
```bash
cd backend
python start_simple.py
```

### Option 2: Manual Setup
```bash
# Install dependencies
cd backend
pip install fastapi uvicorn pydantic

# Start the server
python simple_main.py
```

### Option 3: Windows PowerShell
```powershell
cd backend
.\start_simple.ps1
```

## 📱 Access the Application

- **Frontend**: Open `frontend/index.html` in your browser
- **API**: http://localhost:8000
- **Health Check**: http://localhost:8000/health
- **Products**: http://localhost:8000/products

## ✨ Features

### ✅ Working Features
- **Health Check**: API status monitoring
- **Product Management**: Pre-loaded with 5 sample products
- **Sales Processing**: Complete sale workflow with stock updates
- **Stock Management**: Automatic stock deduction
- **Sales History**: Track all processed sales
- **Error Handling**: Comprehensive error messages
- **CORS Support**: Frontend-backend communication
- **Real-time Status**: Live API connection status

### 📦 Sample Products
- `shirt_001` - Dress Shirt ($25.00)
- `shirt_002` - Casual Shirt ($20.00) 
- `shirt_003` - Polo Shirt ($22.50)
- `pants_001` - Dress Pants ($35.00)
- `jacket_001` - Blazer ($75.00)

## 🛠️ Technical Stack

- **Backend**: FastAPI (Python)
- **Database**: SQLite
- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **API**: RESTful with JSON responses

## 🧪 Testing

Run the test suite:
```bash
cd backend
python test_simple.py
```

**Happy Selling! 🛍️**               # This file
```

## Development

### Adding New Products
1. Modify the frontend to include product selection
2. Update the backend to handle different product types and prices
3. Add product inventory tracking

### Production Deployment
1. Use a production WSGI server (Gunicorn)
2. Set up proper CORS origins
3. Use environment variables for configuration
4. Add authentication and authorization
5. Implement proper logging

## Technologies Used

- **Backend**: FastAPI, SQLite, Pydantic
- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Testing**: Python requests library

## License

This project is part of the DealNDone 2025 initiative.
