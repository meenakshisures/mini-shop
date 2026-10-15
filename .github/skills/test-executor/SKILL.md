---
name: test-executor
description: Runs one Mini Shop Playwright spec and saves its status and artifacts, and is used after a test script is generated or updated.
---

# Test executor

- Ensure the app is reachable at `http://localhost:5173` before testing. If it is not, start it with `npm run dev` in the repository and verify the URL responds before continuing. Do not silently proceed against an unavailable server.
- Run the requested case with `npx playwright test tests/specs/<id>.spec.ts` from the repository root.
- Capture the final pass/fail status, full useful error output for failures, and paths to any screenshots and traces produced by Playwright. Resolve artifact paths from the runner output/configuration; do not claim a missing artifact exists.
- Save or update `reports/results/<id>.json`, creating parent directories as necessary. Use valid JSON with at least:

```json
{
  "id": "<id>",
  "title": "<title>",
  "status": "passed",
  "attempts": [],
  "error": null,
  "screenshot": null,
  "trace": null
}
```

- Set `status` to `"failed"` and include the error text when the test fails. Record real repository-relative screenshot and trace paths, or `null` if not generated.
- Preserve any prior `attempts` entries when updating an existing result. The failure analyzer appends each repair attempt and reason to this array.
- Report the command, status, error summary if applicable, result JSON path, and artifact paths. Never convert a failed run into a pass or suppress its failure.
