# Mini Shop Copilot Skills

These skills are stored beside the repository's source and are loaded by Copilot when a task matches their descriptions. They guide the Mini Shop test workflow; they do not run automatically as a test suite. Follow the linked `SKILL.md` for each skill's detailed rules.

## Skills and workflow

| Skill | When to use it | What it does |
|---|---|---|
| [test-case-parser](./test-case-parser/SKILL.md) | A test scenario or CSV case needs preparing | Converts one scenario into a structured case saved under `test-cases/parsed/`. |
| [playwright-script-generator](./playwright-script-generator/SKILL.md) | A parsed case needs an automated test | Creates a Playwright spec and, when needed, reusable page objects under `tests/`. |
| [test-executor](./test-executor/SKILL.md) | A test spec needs to be run | Runs the requested spec, records its result, and captures available artifacts. |
| [failure-analyzer](./failure-analyzer/SKILL.md) | A Playwright run failed | Classifies the failure and may repair locator or timing issues without weakening assertions. |
| [report-generator](./report-generator/SKILL.md) | Test results need a summary | Builds `reports/summary.md` from the saved result JSON files. |
| [playwright-testgen](./playwright-testgen/SKILL.md) | A standalone suite is needed for a user-provided application and test case | Collects the URL, test case, and authentication choice, then generates and runs a separate suite. |

For the Mini Shop workflow, the usual order is:

1. Parse the test case.
2. Generate its Playwright script.
3. Execute the script.
4. Analyze a failed run if needed.
5. Generate or refresh the report.

The standalone `playwright-testgen` skill is a separate workflow; it does not use the Mini Shop parsed-case pipeline.

## Median POC copy

The standalone generator is also copied to [median poc/skill/playwright-testgen/SKILL.md](../../median%20poc/skill/playwright-testgen/SKILL.md). Its instructions collect a target URL, a local PDF/CSV/text test-case path, and either a `.env` path for authentication or an explicit `skip`. It generates each suite in a new folder under `C:\Users\TVM0881\playwright-test-suites`, avoids overwriting existing suites, and requires credentials to remain out of source files and logs.

The copy is intended to match the repo's [playwright-testgen skill](./playwright-testgen/SKILL.md). Update both files if that workflow changes.

## Project conventions

- Mini Shop tests use the project configuration and deterministic application data.
- The test-generation and execution instructions require accessible, stable locators and web-first assertions; do not use fixed sleeps to hide timing issues.
- The two documented application bugs (price high-to-low ordering and Express shipping total) are intentional test cases. The skills preserve the expected behavior and report failures rather than changing the app or weakening assertions.
