#!/usr/bin/env python3
"""
Debug server script to identify startup issues
"""

import sys
import traceback
import uvicorn
from fastapi import FastAPI

print("=== DEBUG SERVER STARTUP ===")
print(f"Python version: {sys.version}")
print(f"Python executable: {sys.executable}")

try:
    print("1. Importing FastAPI...")
    from fastapi import FastAPI
    print("   ✅ FastAPI imported successfully")
    
    print("2. Creating FastAPI app...")
    app = FastAPI()
    print("   ✅ FastAPI app created successfully")
    
    print("3. Adding test endpoint...")
    @app.get("/test")
    def test_endpoint():
        return {"message": "Debug server is working!", "status": "success"}
    print("   ✅ Test endpoint added successfully")
    
    print("4. Starting uvicorn server...")
    print("   Host: 127.0.0.1")
    print("   Port: 8000")
    print("   Log level: info")
    
    uvicorn.run(
        app, 
        host="127.0.0.1", 
        port=8000, 
        log_level="info",
        access_log=True
    )
    
except Exception as e:
    print(f"❌ ERROR: {e}")
    print("=== FULL TRACEBACK ===")
    traceback.print_exc()
    sys.exit(1) 