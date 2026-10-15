---
name: test-case-parser
description: Parses Mini Shop test prompts or CSV rows into saved structured test cases, and is used whenever a test case needs to be prepared.
---

# Test case parser

Convert one free-text test prompt or one CSV row into this JSON shape:

```json
{
  "id": "TC-001",
  "title": "Descriptive test title",
  "preconditions": [],
  "steps": [],
  "testData": {},
  "expectedResult": "Exact stated outcome"
}
```

- For CSV input, map `TestID`, `Title`, `Preconditions`, `Steps`, `Test Data`, and `Expected Result` to the corresponding fields above. Preserve supplied values; parse steps as an ordered list and test data as key/value entries where possible.
- For prompts, extract the same fields without adding behavior the prompt does not specify. Use a stable, filesystem-safe id (prefer an explicitly supplied test id).
- Mini Shop runs at `http://localhost:5173`. Refer to the root README for fixed users, routes, and v1/v2 details; test data must remain deterministic.
- Ask the user for clarification as a short numbered list if steps or the expected result are missing or ambiguous (for example, “test the checkout”). Do not invent an expected result or save an incomplete test case. Save after clarification.
- State the expected result exactly as supplied or clarified. The README documents two intentional failures: Price high-low sorts incorrectly, and Express shipping adds $1 rather than $10. Do not change expected behavior to match either bug.
- Save each complete case as `test-cases/parsed/<id>.json`, creating the directory if needed. Use valid UTF-8 JSON and the shape above.
