"""Quick test for response formatter risk levels"""
from utils.response_formatter import ResponseFormatter

print("Risk Level Boundary Tests:")
print("-" * 40)

test_scores = [
    (25, "red"),
    (40, "red"),
    (41, "yellow"),
    (70, "yellow"),
    (71, "green"),
    (100, "green")
]

for score, expected in test_scores:
    result = ResponseFormatter._determine_risk_level(score)
    status = "PASS" if result == expected else "FAIL"
    print(f"{status} Score {score}: {result} (expected: {expected})")

print("\nAll tests passed!" if all(
    ResponseFormatter._determine_risk_level(s) == e for s, e in test_scores
) else "\nSome tests failed!")

# Made with Bob
