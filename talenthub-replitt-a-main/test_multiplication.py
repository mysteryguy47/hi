#!/usr/bin/env python3
"""Test multiplication question generation."""

import sys
import os
sys.path.append(os.path.join(os.path.dirname(__file__), 'backend'))

from backend.math_generator import generate_question
from backend.schemas import Constraints, QuestionType

def test_multiplication_digits():
    """Test that multiplication respects digit constraints."""
    print("Testing multiplication digit constraints...")

    # Test 2x1 multiplication
    constraints = Constraints(multiplicandDigits=2, multiplierDigits=1)

    for i in range(10):
        question = generate_question(
            question_id=i,
            question_type=QuestionType.multiplication,
            constraints=constraints,
            seed=42
        )

        multiplicand = question.operands[0]
        multiplier = question.operands[1]

        multiplicand_str = str(multiplicand)
        multiplier_str = str(multiplier)

        print(f"Question {i}: {multiplicand} × {multiplier} = {question.answer}")
        print(f"  Multiplicand digits: {len(multiplicand_str)} (expected: 2)")
        print(f"  Multiplier digits: {len(multiplier_str)} (expected: 1)")

        if len(multiplicand_str) != 2:
            print(f"  ❌ ERROR: Multiplicand has {len(multiplicand_str)} digits, expected 2")
        if len(multiplier_str) != 1:
            print(f"  ❌ ERROR: Multiplier has {len(multiplier_str)} digits, expected 1")

    print("Test completed.")

if __name__ == "__main__":
    test_multiplication_digits()






