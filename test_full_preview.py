#!/usr/bin/env python3
"""Test the full preview functionality."""
import sys
import os
import requests
import threading
import time
sys.path.append(os.path.join(os.path.dirname(__file__), 'backend'))

from backend.main import app
from backend.schemas import PaperConfig, BlockConfig, Constraints
import json
import uvicorn

def start_server():
    """Start the FastAPI server in a thread."""
    uvicorn.run(app, host="127.0.0.1", port=8000, log_level="info")

def test_api():
    """Test the API endpoints."""
    time.sleep(2)  # Wait for server to start

    try:
        # Test health endpoint
        print("Testing health endpoint...")
        response = requests.get("http://127.0.0.1:8000/health")
        print(f"Health: {response.status_code} - {response.json()}")

        # Test presets endpoint
        print("\nTesting presets endpoint...")
        response = requests.get("http://127.0.0.1:8000/presets/AB-1")
        print(f"Presets: {response.status_code}")
        if response.status_code == 200:
            presets = response.json()
            print(f"Loaded {len(presets)} preset blocks for AB-1")
        else:
            print(f"Error: {response.text}")

        # Test preview endpoint
        print("\nTesting preview endpoint...")
        config = PaperConfig(
            level="AB-1",
            title="Test Paper",
            blocks=[]  # Should load from presets
        )

        response = requests.post(
            "http://127.0.0.1:8000/papers/preview",
            json=config.model_dump(),
            headers={"Content-Type": "application/json"}
        )
        print(f"Preview: {response.status_code}")
        if response.status_code == 200:
            data = response.json()
            print(f"Generated {len(data.get('blocks', []))} blocks with seed {data.get('seed')}")
        else:
            print(f"Error: {response.text}")

    except Exception as e:
        print(f"Test error: {e}")

if __name__ == "__main__":
    # Start server in background thread
    server_thread = threading.Thread(target=start_server, daemon=True)
    server_thread.start()

    # Run tests
    test_api()
