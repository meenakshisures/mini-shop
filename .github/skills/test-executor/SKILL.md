---
name: test-executor
description: Runs one Mini Shop Playwright spec and saves its status and artifacts, and is used after a test script is generated or updated.
---

# Test executor

- Ensure the app is reachable at `http://localhost:5173` before testing. If it is not, start it with `npm run dev` in the repository and verify the URL responds before continuing. Do not silently proceed against an unavailable server.
- Run the requested case with `npx playwright test tests/specs/<id>.spec.ts` from the repository root. This runs the `setup` login project and then all three browsers (chromium, firefox, webkit). Use `--project=<name>` only when the user asks for a single browser.
- After the run, `npm run reports` rebuilds `reports/results/*.json` and `reports/summary.md` from `reports/playwright-results.json`.
- Screenshots and traces are captured for every run (pass and fail). The HTML report is written to `playwright-report/` (open with `npm run report`) and machine-readable results to `reports/playwright-results.json`.
- Capture the final pass/fail status, full useful error output for failures, and paths to any screenshots and traces produced by Playwright. Resolve artifact paths from the runner output/configuration; do not claim a missing artifact exists.
- Save or update `reports/results/<id>.json`, creating parent directories as necessary. Use valid JSON with at least:

```json
{
  "id": "<id>",
  "title": "<title>",
  "status": "passed",
  "locators": {},
  "browsers": {
    "chromium": { "status": "passed", "screenshot": "test-results/...png", "trace": "test-results/.../trace.zip", "error": null },
    "firefox": {},
    "webkit": {}
  },
  "attempts": [],
  "error": null
}
```

- Overall `status` is `"passed"` only if all browsers pass. Fill `locators` from the page objects the spec uses (name → locator expression). Read per-browser results and attachment paths from `reports/playwright-results.json`.
- Set `status` to `"failed"` and include the error text when the test fails. Record real repository-relative screenshot and trace paths, or `null` if not generated.
- Preserve any prior `attempts` entries when updating an existing result. The failure analyzer appends each repair attempt and reason to this array.
- Report the command, status, error summary if applicable, result JSON path, and artifact paths. Never convert a failed run into a pass or suppress its failure.
