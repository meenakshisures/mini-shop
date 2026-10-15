---
name: failure-analyzer
description: Diagnoses failed Mini Shop Playwright runs and repairs only locator or timing issues, and is used after a test fails.
---

# Failure analyzer

- Read the failed test’s `reports/results/<id>.json`, its error output, screenshot, trace, spec, and relevant page objects before deciding what failed.
- Classify the cause as exactly one of: `locator problem`, `timing problem`, or `real application bug`. Explain the evidence; do not treat an assertion mismatch as a locator problem without evidence.
- When a locator breaks, re-inspect the live page using the Playwright MCP tools (navigate/snapshot as appropriate) before changing a locator. Follow the project locator rules: test id first, then role/label; product detail quantity and add button use role/label because they have no test id.
- Repair only locator or timing problems. Prefer correct locators and auto-waiting/web-first assertions; never add fixed sleeps.
- Allow at most 3 total test attempts, including the initial run. Stop once passing or after the third attempt; do not exceed this limit.
- Never weaken, delete, skip, or loosen an assertion to make a test pass. If observed app behavior contradicts the specified expected result, stop and report a failed test with the reason; do not edit the expected result or application.
- Known real application bugs from the README: “Price high-low” puts the most expensive item last; Express shipping adds $1 instead of $10. Mark matching failures as known bugs and do not attempt to repair the app or test.
- After every attempt, update the result JSON: append an `attempts` entry with attempt number, classification, what changed (or “no change”), and why; update final `status` and error/artifact details from the run. Keep failed results failed when the app is at fault.
