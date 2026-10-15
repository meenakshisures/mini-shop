---
name: report-generator
description: Summarizes Mini Shop test result JSON files in a complete Markdown report, and is used after test runs.
---

# Report generator

- Read every `reports/results/*.json` file and include each test case exactly once. Do not omit, hide, or reclassify failures.
- Produce `reports/summary.md`, creating `reports/` if needed. Include totals for passed and failed tests and pass rate (`passed / total`, as a percentage; use 0% when there are no cases).
- Include a Markdown table with one row per case and these columns: `TestID`, `title`, `status`, `attempts`, `failure reason`, `script path`, `screenshot/trace link`.
- Show the failure reason plainly for every failed test; use `—` for not applicable values. Count attempts from the recorded run/attempt history without implying additional runs.
- Mark a failure as a known app bug only when the result evidence matches a documented bug: Price high-low puts the most expensive product last, or Express shipping adds $1 instead of $10. Make the marker visible in its failure reason (for example, `Known app bug: ...`).
- Link script, screenshot, and trace using repository-relative paths when they exist. In the final column, include both screenshot and trace links if available; otherwise show the available artifact or `—`.
- Derive status and totals from saved result files, not from memory or expected outcomes. Preserve failed status even if the failure is expected because of a deliberate app bug.
