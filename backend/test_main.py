import pytest
import requests
import json
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

# TC1: Test root endpoint
def test_root_endpoint():
    """TC1: Test root endpoint returns correct message"""
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert data["message"] == "DealNDone API is running"
    assert data["version"] == "1.0.0"

# TC2: Test health endpoint
def test_health_endpoint():
    """TC2: Test health endpoint returns healthy status"""
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert data["database"] == "connected"

# TC3: Test $25 shirt sale (main functionality)
def test_shirt_sale():
    """TC3: Test $25 shirt sale functionality"""
    sale_data = {
        "items": [
            {
                "id": "shirt_001",
                "quantity": 2
            }
        ]
    }
    response = client.post("/sales", json=sale_data)
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "success"
    assert data["total"] == 50.0  # 2 shirts * $25
    assert data["items_processed"] == 1

# TC4: Test multiple items sale
def test_multiple_items_sale():
    """TC4: Test sale with multiple items"""
    sale_data = {
        "items": [
            {"id": "shirt_001", "quantity": 1},
            {"id": "shirt_002", "quantity": 2}
        ]
    }
    response = client.post("/sales", json=sale_data)
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "success"
    assert data["total"] == 75.0  # (1 + 2) * $25
    assert data["items_processed"] == 2

# TC5: Test validation - negative quantity
def test_negative_quantity_validation():
    """TC5: Test validation rejects negative quantity"""
    sale_data = {
        "items": [
            {"id": "shirt_001", "quantity": -1}
        ]
    }
    response = client.post("/sales", json=sale_data)
    assert response.status_code == 422  # Validation error

# TC6: Test validation - zero quantity
def test_zero_quantity_validation():
    """TC6: Test validation rejects zero quantity"""
    sale_data = {
        "items": [
            {"id": "shirt_001", "quantity": 0}
        ]
    }
    response = client.post("/sales", json=sale_data)
    assert response.status_code == 422  # Validation error

# TC7: Test validation - empty items list
def test_empty_items_validation():
    """TC7: Test validation rejects empty items list"""
    sale_data = {"items": []}
    response = client.post("/sales", json=sale_data)
    assert response.status_code == 422  # Validation error

# TC8: Test CORS headers
def test_cors_headers():
    """TC8: Test CORS headers are present"""
    response = client.options("/sales")
    assert "access-control-allow-origin" in response.headers

# TC9: Test database storage
def test_database_storage():
    """TC9: Test that sales are stored in database"""
    sale_data = {
        "items": [
            {"id": "shirt_001", "quantity": 1}
        ]
    }
    response = client.post("/sales", json=sale_data)
    assert response.status_code == 200
    
    # Verify data is stored (this would require database query in real implementation)
    # For now, we just verify the response indicates success
    data = response.json()
    assert data["status"] == "success"

# TC10: Test error handling
def test_error_handling():
    """TC10: Test error handling for malformed requests"""
    # Test with missing required fields
    malformed_data = {"items": [{"id": "shirt_001"}]}  # Missing quantity
    response = client.post("/sales", json=malformed_data)
    assert response.status_code == 422

# TC11: Test API documentation
def test_api_docs():
    """TC11: Test API documentation is accessible"""
    response = client.get("/docs")
    assert response.status_code == 200

# TC12: Test OpenAPI schema
def test_openapi_schema():
    """TC12: Test OpenAPI schema is accessible"""
    response = client.get("/openapi.json")
    assert response.status_code == 200
    schema = response.json()
    assert "paths" in schema
    assert "/sales" in schema["paths"]

# Performance tests
def test_sale_performance():
    """Test sale endpoint performance"""
    import time
    sale_data = {
        "items": [
            {"id": "shirt_001", "quantity": 1}
        ]
    }
    start_time = time.time()
    response = client.post("/sales", json=sale_data)
    end_time = time.time()
    
    assert response.status_code == 200
    assert (end_time - start_time) < 1.0  # Should complete in under 1 second

# Load test simulation
def test_multiple_concurrent_sales():
    """Test multiple concurrent sales"""
    import threading
    import time
    
    results = []
    
    def make_sale():
        sale_data = {
            "items": [
                {"id": "shirt_001", "quantity": 1}
            ]
        }
        response = client.post("/sales", json=sale_data)
        results.append(response.status_code)
    
    # Create 10 concurrent sales
    threads = []
    for _ in range(10):
        thread = threading.Thread(target=make_sale)
        threads.append(thread)
        thread.start()
    
    # Wait for all threads to complete
    for thread in threads:
        thread.join()
    
    # All sales should succeed
    assert all(status == 200 for status in results)
    assert len(results) == 10

if __name__ == "__main__":
    pytest.main([__file__, "-v"]) 