#!/usr/bin/env python3
"""Debug script to check question generation issues."""

import sys
import os
sys.path.append(os.path.join(os.path.dirname(__file__), 'backend'))

from backend.math_generator import generate_question
from backend.schemas import Constraints, QuestionType

def debug_question(question_type, question_id=1):
    """Generate and debug a question."""
    constraints = Constraints(digits=2, rows=2)

    try:
        question = generate_question(
            question_id=question_id,
            question_type=question_type,
            constraints=constraints,
            seed=None
        )

        print(f"Question Type: {question_type}")
        print(f"ID: {question.id}")
        print(f"Text: {repr(question.text)}")
        print(f"Operands: {question.operands}")
        print(f"Operator: {repr(question.operator)}")
        print(f"Operators: {question.operators}")
        print(f"Answer: {question.answer}")
        print(f"Is Vertical: {question.isVertical}")
        print("---")

    except Exception as e:
        print(f"Exception for {question_type}: {e}")
        print("---")

if __name__ == "__main__":
    # Test different question types
    question_types = [
        "addition",
        "subtraction",
        "multiplication",
        "division",
        "add_sub",
        "decimal_add_sub"
    ]

    for qt in question_types:
        debug_question(qt)






