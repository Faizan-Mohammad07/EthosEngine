"""
Quick API Testing Script for EthosEngine
Tests backend API endpoints and generates a report
"""

import requests
import json
from datetime import datetime

BACKEND_URL = "http://localhost:8000"

def print_header(text):
    print(f"\n{'='*60}")
    print(f"{text.center(60)}")
    print(f"{'='*60}\n")

def test_health():
    """Test health endpoint"""
    print("Testing: GET /health")
    try:
        response = requests.get(f"{BACKEND_URL}/health", timeout=5)
        print(f"  Status: {response.status_code}")
        print(f"  Response: {response.json()}")
        return response.status_code == 200
    except Exception as e:
        print(f"  ERROR: {e}")
        return False

def test_scan_valid():
    """Test scan with valid input"""
    print("\nTesting: POST /api/scan (Valid Input)")
    
    data = {
        "content": "This is an AI-powered hiring assistant that analyzes resumes and ranks candidates based on qualifications, experience, and cultural fit. It uses natural language processing to extract key information.",
        "scan_type": "comprehensive"
    }
    
    try:
        response = requests.post(
            f"{BACKEND_URL}/api/scan",
            json=data,
            timeout=30
        )
        print(f"  Status: {response.status_code}")
        
        if response.status_code == 200:
            result = response.json()
            print(f"  Trust Score: {result.get('trustScore', 'N/A')}")
            print(f"  Risk Level: {result.get('riskLevel', 'N/A')}")
            print(f"  Response Time: {response.elapsed.total_seconds():.2f}s")
            
            # Verify required fields
            required = ['trustScore', 'riskLevel', 'dataIngredients', 'riskFactors']
            missing = [f for f in required if f not in result]
            if missing:
                print(f"  WARNING: Missing fields: {missing}")
                return False
            return True
        else:
            print(f"  Response: {response.text}")
            return False
            
    except Exception as e:
        print(f"  ERROR: {e}")
        return False

def test_scan_invalid():
    """Test scan with invalid input"""
    print("\nTesting: POST /api/scan (Invalid Input - Too Short)")
    
    data = {
        "content": "Short",
        "scan_type": "comprehensive"
    }
    
    try:
        response = requests.post(
            f"{BACKEND_URL}/api/scan",
            json=data,
            timeout=10
        )
        print(f"  Status: {response.status_code}")
        
        if response.status_code in [400, 422]:
            print(f"  ✓ Correctly rejected invalid input")
            return True
        else:
            print(f"  ✗ Should have rejected but got: {response.status_code}")
            return False
            
    except Exception as e:
        print(f"  ERROR: {e}")
        return False

def test_cors():
    """Test CORS headers"""
    print("\nTesting: CORS Headers")
    
    try:
        response = requests.options(
            f"{BACKEND_URL}/api/scan",
            headers={
                "Origin": "http://127.0.0.1:3000",
                "Access-Control-Request-Method": "POST"
            },
            timeout=5
        )
        
        cors_header = response.headers.get('Access-Control-Allow-Origin', '')
        print(f"  CORS Header: {cors_header}")
        
        if cors_header:
            print(f"  ✓ CORS configured")
            return True
        else:
            print(f"  ✗ CORS not configured")
            return False
            
    except Exception as e:
        print(f"  ERROR: {e}")
        return False

def main():
    print_header("EthosEngine API Quick Test")
    print(f"Backend URL: {BACKEND_URL}")
    print(f"Test Time: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    
    results = {
        "Health Check": test_health(),
        "Valid Scan": test_scan_valid(),
        "Invalid Input Handling": test_scan_invalid(),
        "CORS Configuration": test_cors()
    }
    
    print_header("Test Results Summary")
    
    passed = sum(1 for v in results.values() if v)
    total = len(results)
    
    for test, result in results.items():
        status = "✓ PASS" if result else "✗ FAIL"
        print(f"{status} - {test}")
    
    print(f"\nTotal: {passed}/{total} tests passed ({passed/total*100:.0f}%)")
    
    if passed == total:
        print("\n🎉 All API tests passed! Backend is ready.")
    else:
        print("\n⚠️  Some tests failed. Check the output above.")
    
    return passed == total

if __name__ == "__main__":
    success = main()
    exit(0 if success else 1)

# Made with Bob
