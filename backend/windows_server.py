from fastapi import FastAPI
import uvicorn
import asyncio
import sys

app = FastAPI()

@app.get("/")
def read_root():
    return {"Hello": "World", "platform": sys.platform}

@app.get("/health")
def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    print("Starting Windows-compatible server...")
    try:
        # Windows-specific configuration
        uvicorn.run(
            app, 
            host="127.0.0.1", 
            port=8000, 
            log_level="info",
            access_log=True,
            reload=False
        )
    except Exception as e:
        print(f"Server error: {e}")
        import traceback
        traceback.print_exc() 