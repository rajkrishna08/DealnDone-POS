#!/usr/bin/env python3
"""
Simple startup script for DealNDone POS
"""
import subprocess
import sys
import os

def install_requirements():
    """Install required packages"""
    try:
        print("Installing required packages...")
        subprocess.run([sys.executable, "-m", "pip", "install", "-r", "simple_requirements.txt"], 
                      check=True, cwd=os.path.dirname(__file__))
        print("✅ Requirements installed successfully!")
        return True
    except subprocess.CalledProcessError as e:
        print(f"❌ Error installing requirements: {e}")
        return False

def start_server():
    """Start the FastAPI server"""
    try:
        print("\n🚀 Starting DealNDone POS Server...")
        print("📱 Frontend: Open frontend/index.html in your browser")
        print("🔗 API: http://localhost:8000")
        print("❤️  Health Check: http://localhost:8000/health")
        print("📦 Products: http://localhost:8000/products")
        print("\nPress Ctrl+C to stop the server\n")
        
        subprocess.run([sys.executable, "simple_main.py"], cwd=os.path.dirname(__file__))
    except KeyboardInterrupt:
        print("\n👋 Server stopped!")
    except Exception as e:
        print(f"❌ Error starting server: {e}")

if __name__ == "__main__":
    if install_requirements():
        start_server()
    else:
        print("❌ Failed to install requirements. Please check your Python environment.")
