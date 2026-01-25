#!/usr/bin/env python3
"""Test the preview functionality."""
import sys
import os
sys.path.append(os.path.join(os.path.dirname(__file__), 'backend'))

from backend.main import app
from backend.schemas import PaperConfig, BlockConfig, Constraints
import json

def test_preview():
    """Test the preview endpoint."""
    # Create a test config for AB-1
    config = PaperConfig(
        level="AB-10",
        title="Test Paper",
        blocks=[]  # Should load from presets
    )

    print("Testing preview with config:")
    print(json.dumps(config.model_dump(), indent=2))

    # Test the preset loading
    from backend.presets import get_preset_blocks
    blocks = get_preset_blocks(config.level)
    print(f"Loaded {len(blocks)} preset blocks for {config.level}")

    # Test generating a single block
    from backend.math_generator import generate_block
    if blocks:
        print("Testing block generation...")
        try:
            gen_block = generate_block(blocks[0], 1, 12345)
            print(f"Generated block with {len(gen_block.questions)} questions")
            print("First question:", gen_block.questions[0].text if gen_block.questions else "No questions")
        except Exception as e:
            print(f"Error generating block: {e}")
            import traceback
            traceback.print_exc()

if __name__ == "__main__":
    test_preview()
