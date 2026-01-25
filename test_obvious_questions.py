#!/usr/bin/env python3
"""Test script to verify that obvious questions are avoided."""

import sys
import os
sys.path.append(os.path.join(os.path.dirname(__file__), 'backend'))

from backend.math_generator import generate_question
from backend.schemas import Constraints, QuestionType

def test_multiplication_no_ones():
    """Test that multiplication questions don't have multiplier = 1."""
    print("Testing multiplication questions for multiplier = 1...")

    constraints = Constraints(digits=2, multiplicandDigits=2, multiplierDigits=2)

    obvious_count = 0
    total_tests = 50

    for i in range(total_tests):
        question = generate_question(
            question_id=i,
            question_type=QuestionType.multiplication,
            constraints=constraints,
            seed=None
        )

        multiplier = question.operands[1]
        if multiplier == 1:
            obvious_count += 1
            print(f"Found obvious question: {question.operands[0]} × {question.operands[1]} = {question.answer}")

    print(f"Multiplication: {obvious_count}/{total_tests} obvious questions found")
    return obvious_count == 0

def test_division_no_ones():
    """Test that division questions don't have divisor = 1."""
    print("Testing division questions for divisor = 1...")

    constraints = Constraints(digits=2, dividendDigits=2, divisorDigits=2)

    obvious_count = 0
    total_tests = 50

    for i in range(total_tests):
        question = generate_question(
            question_id=i + 100,  # Different IDs
            question_type=QuestionType.division,
            constraints=constraints,
            seed=None
        )

        divisor = question.operands[1]
        if divisor == 1:
            obvious_count += 1
            print(f"Found obvious question: {question.operands[0]} ÷ {question.operands[1]} = {question.answer}")

    print(f"Division: {obvious_count}/{total_tests} obvious questions found")
    return obvious_count == 0

if __name__ == "__main__":
    print("Testing math question generation for obvious questions...")

    mult_pass = test_multiplication_no_ones()
    div_pass = test_division_no_ones()

    if mult_pass and div_pass:
        print("\n✅ All tests passed! No obvious questions found.")
        sys.exit(0)
    else:
        print("\n❌ Some tests failed. Obvious questions were still generated.")
        sys.exit(1)






