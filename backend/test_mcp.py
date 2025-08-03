from fastapi import FastAPI
from datetime import datetime

app = FastAPI(title="MCP Test Server", version="1.0.0")

@app.get("/")
async def root():
    return {"message": "MCP Test Server is running"}

@app.get("/mcp/health")
async def mcp_health():
    return {
        "status": "healthy",
        "database": "healthy",
        "redis": "unavailable",
        "timestamp": datetime.now().isoformat()
    }

@app.get("/mcp/test")
async def mcp_test():
    return {
        "message": "MCP is working!",
        "timestamp": datetime.now().isoformat(),
        "endpoints": [
            "/mcp/health",
            "/mcp/test"
        ]
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8007) 