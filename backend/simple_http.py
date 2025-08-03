import http.server
import socketserver
import json
from datetime import datetime

class MCPHandler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        if self.path == '/mcp/test':
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            
            response = {
                "message": "MCP is working!",
                "timestamp": datetime.now().isoformat(),
                "endpoints": ["/mcp/test", "/mcp/health"]
            }
            
            self.wfile.write(json.dumps(response).encode())
        elif self.path == '/mcp/health':
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            
            response = {
                "status": "healthy",
                "timestamp": datetime.now().isoformat()
            }
            
            self.wfile.write(json.dumps(response).encode())
        else:
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            
            response = {
                "message": "Simple HTTP Server is running",
                "timestamp": datetime.now().isoformat()
            }
            
            self.wfile.write(json.dumps(response).encode())

if __name__ == "__main__":
    PORT = 8008
    with socketserver.TCPServer(("", PORT), MCPHandler) as httpd:
        print(f"Server running on port {PORT}")
        print(f"Test with: http://localhost:{PORT}/mcp/test")
        httpd.serve_forever() 