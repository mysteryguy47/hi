#!/usr/bin/env python3
"""Test the preview API directly."""
import sys
import os
import requests
import json
sys.path.append(os.path.join(os.path.dirname(__file__), 'backend'))

def test_preview_api():
    """Test the preview API endpoint."""
    # Test data that mimics what the frontend sends
    test_config = {
        "level": "AB-1",
        "title": "Test Paper",
        "totalQuestions": "20",
        "blocks": [],  # Empty blocks for preset loading
        "orientation": "portrait"
    }

    print("Testing preview API with config:")
    print(json.dumps(test_config, indent=2))

    try:
        response = requests.post(
            "http://127.0.0.1:8000/papers/preview",
            json=test_config,
            headers={"Content-Type": "application/json"}
        )

        print(f"\nResponse status: {response.status_code}")
        print(f"Response headers: {dict(response.headers)}")

        if response.status_code == 200:
            data = response.json()
            print("✅ Success!")
            print(f"Blocks: {len(data.get('blocks', []))}")
            print(f"Seed: {data.get('seed')}")
        else:
            print("❌ Error!")
            print(f"Response text: {response.text}")

    except Exception as e:
        print(f"Request failed: {e}")

if __name__ == "__main__":
    test_preview_api()
