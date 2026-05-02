"""
Test Error Handling and CORS Configuration
Tests for Task 4 of Priority 2: CORS & Error Handling

This test file verifies:
1. CORS configuration
2. Request validation
3. Error response formatting
4. HTTP exception handling
"""

import pytest
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)


class TestCORSConfiguration:
    """Test CORS middleware configuration."""
    
    def test_cors_headers_present(self):
        """Test that CORS headers are present in responses."""
        response = client.options(
            "/api/scan",
            headers={
                "Origin": "http://localhost:5173",
                "Access-Control-Request-Method": "POST"
            }
        )
        assert "access-control-allow-origin" in response.headers
        assert "access-control-allow-methods" in response.headers
    
    def test_cors_allowed_origin(self):
        """Test that allowed origins are accepted."""
        response = client.get(
            "/health",
            headers={"Origin": "http://localhost:5173"}
        )
        assert response.status_code == 200
        assert response.headers.get("access-control-allow-origin") == "http://localhost:5173"


class TestRequestValidation:
    """Test request validation and error messages."""
    
    def test_empty_content_rejected(self):
        """Test that empty content is rejected."""
        response = client.post(
            "/api/scan",
            json={"content": ""}
        )
        assert response.status_code == 422
        data = response.json()
        assert data["success"] is False
        assert "validation_error" in data["error"]["type"]
    
    def test_whitespace_only_content_rejected(self):
        """Test that whitespace-only content is rejected."""
        response = client.post(
            "/api/scan",
            json={"content": "   "}
        )
        assert response.status_code == 422
        data = response.json()
        assert data["success"] is False
    
    def test_invalid_scan_type_rejected(self):
        """Test that invalid scan_type is rejected."""
        response = client.post(
            "/api/scan",
            json={
                "content": "Test content",
                "scan_type": "invalid_type"
            }
        )
        assert response.status_code == 422
        data = response.json()
        assert data["success"] is False
        assert "validation_error" in data["error"]["type"]
    
    def test_valid_scan_types_accepted(self):
        """Test that valid scan types are accepted."""
        valid_types = ["comprehensive", "safety_only", "bias_only"]
        for scan_type in valid_types:
            response = client.post(
                "/api/scan",
                json={
                    "content": "Test content for scanning",
                    "scan_type": scan_type
                }
            )
            # May fail due to missing IBM credentials, but validation should pass
            assert response.status_code in [200, 503]
    
    def test_content_too_long_rejected(self):
        """Test that content exceeding max length is rejected."""
        long_content = "a" * 10001  # Exceeds 10000 character limit
        response = client.post(
            "/api/scan",
            json={"content": long_content}
        )
        assert response.status_code == 422
        data = response.json()
        assert data["success"] is False
    
    def test_missing_content_field_rejected(self):
        """Test that missing content field is rejected."""
        response = client.post(
            "/api/scan",
            json={"scan_type": "comprehensive"}
        )
        assert response.status_code == 422
        data = response.json()
        assert data["success"] is False


class TestErrorResponses:
    """Test error response formatting."""
    
    def test_validation_error_format(self):
        """Test that validation errors have correct format."""
        response = client.post(
            "/api/scan",
            json={"content": ""}
        )
        data = response.json()
        
        assert "success" in data
        assert data["success"] is False
        assert "error" in data
        assert "type" in data["error"]
        assert "message" in data["error"]
        assert "timestamp" in data["error"]
        assert "details" in data["error"]
    
    def test_http_error_format(self):
        """Test that HTTP errors have correct format."""
        # Test with non-existent endpoint
        response = client.get("/api/nonexistent")
        assert response.status_code == 404
        
        data = response.json()
        assert "success" in data
        assert data["success"] is False
        assert "error" in data
        assert "type" in data["error"]
        assert "message" in data["error"]
        assert "timestamp" in data["error"]
    
    def test_service_unavailable_error(self):
        """Test service unavailable error when IBM credentials missing."""
        response = client.post(
            "/api/scan",
            json={"content": "Test content"}
        )
        
        # If credentials are not configured, should return 503
        if response.status_code == 503:
            data = response.json()
            assert data["success"] is False
            assert "error" in data


class TestHealthEndpoint:
    """Test health check endpoint."""
    
    def test_health_check_success(self):
        """Test that health check returns success."""
        response = client.get("/health")
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "healthy"
        assert "message" in data
    
    def test_health_check_cors(self):
        """Test that health check respects CORS."""
        response = client.get(
            "/health",
            headers={"Origin": "http://localhost:5173"}
        )
        assert response.status_code == 200
        assert "access-control-allow-origin" in response.headers


class TestRootEndpoint:
    """Test root endpoint."""
    
    def test_root_endpoint(self):
        """Test that root endpoint returns API information."""
        response = client.get("/")
        assert response.status_code == 200
        data = response.json()
        assert "name" in data
        assert "version" in data
        assert "endpoints" in data


if __name__ == "__main__":
    print("Running error handling and CORS tests...")
    print("\n" + "="*60)
    print("Test Suite: CORS & Error Handling (Task 4, Priority 2)")
    print("="*60 + "\n")
    
    # Run tests
    pytest.main([__file__, "-v", "--tb=short"])

# Made with Bob
