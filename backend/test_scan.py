"""
Test script for IBM Granite Guardian integration
Run this to verify the /api/scan endpoint is working correctly
"""

import requests
import json

# API endpoint
BASE_URL = "http://localhost:8000"

def test_health():
    """Test health check endpoint"""
    print("Testing health check...")
    response = requests.get(f"{BASE_URL}/health")
    print(f"Status: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2)}\n")

def test_scan(content: str, scan_type: str = "comprehensive"):
    """Test scan endpoint"""
    print(f"Testing scan with type: {scan_type}")
    print(f"Content: {content[:100]}...\n")
    
    response = requests.post(
        f"{BASE_URL}/api/scan",
        json={
            "content": content,
            "scan_type": scan_type
        }
    )
    
    print(f"Status: {response.status_code}")
    if response.status_code == 200:
        result = response.json()
        print(f"Success: {result['success']}")
        print(f"Message: {result['message']}")
        
        data = result.get('data', {})
        print(f"\nTrust Score: {data.get('trustScore', 'N/A')}")
        print(f"Risk Level: {data.get('riskLevel', 'N/A')}")
        print(f"\nBias Analysis:")
        print(f"  Score: {data.get('biasAnalysis', {}).get('score', 'N/A')}")
        print(f"  Types: {data.get('biasAnalysis', {}).get('types', [])}")
        print(f"\nSafety Analysis:")
        print(f"  Score: {data.get('safetyAnalysis', {}).get('score', 'N/A')}")
        print(f"  Risk Level: {data.get('safetyAnalysis', {}).get('riskLevel', 'N/A')}")
        print(f"  Categories: {data.get('safetyAnalysis', {}).get('categoriesDetected', [])}")
    else:
        print(f"Error: {response.text}")
    print("\n" + "="*80 + "\n")

if __name__ == "__main__":
    print("="*80)
    print("IBM Granite Guardian Integration Test")
    print("="*80 + "\n")
    
    # Test health check
    try:
        test_health()
    except Exception as e:
        print(f"Health check failed: {e}\n")
    
    # Test scenarios
    test_scenarios = [
        {
            "content": "This is a neutral AI model that provides helpful information to users without any bias or harmful content.",
            "scan_type": "comprehensive"
        },
        {
            "content": "An AI hiring assistant that evaluates candidates based on their qualifications and experience.",
            "scan_type": "bias_only"
        },
        {
            "content": "A content moderation system that filters inappropriate language and harmful content.",
            "scan_type": "safety_only"
        }
    ]
    
    for i, scenario in enumerate(test_scenarios, 1):
        print(f"Scenario {i}:")
        try:
            test_scan(scenario["content"], scenario["scan_type"])
        except Exception as e:
            print(f"Test failed: {e}\n")
            print("="*80 + "\n")
    
    print("Testing complete!")

# Made with Bob
