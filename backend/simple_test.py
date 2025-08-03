import sys
import os

# Add the current directory to Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Import the main app
from main import app

print("🎯 DealNDone MCP Endpoint Check")
print("=" * 40)

# Check if the app has the expected routes
routes = [route.path for route in app.routes]

print("📋 Available routes:")
for route in routes:
    if route.startswith("/mcp"):
        print(f"  ✅ {route}")
    elif route in ["/health", "/"]:
        print(f"  ✅ {route}")

mcp_routes = [route for route in routes if route.startswith("/mcp")]
print(f"\n📊 Found {len(mcp_routes)} MCP routes")

if len(mcp_routes) > 0:
    print("🎉 MCP endpoints are defined and ready!")
else:
    print("❌ No MCP endpoints found")

print("\n✅ App import successful - no syntax errors") 