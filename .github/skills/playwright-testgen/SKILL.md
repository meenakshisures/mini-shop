---
name: playwright-testgen
description: "Collect a target URL, local test-case path, and required authentication choice, then generate and run a standalone Playwright TypeScript suite."
argument-hint: "Provide the target URL, test-case path, and a .env path or explicitly type skip."
user-invocable: true
disable-model-invocation: false
---

# Playwright Test Suite Generator

Use this workflow when the user invokes `/playwright-testgen`. It is application-agnostic: do not assume a particular app, framework, repository, or URL.

## Collect inputs before acting

Ask for exactly these three inputs before inspecting the site or creating files. Collect them as values in normal chat messages; do not request file attachments. All three inputs are required.

1. **Target application base URL** — the user types the URL in chat.
2. **Test case document path** — the user enters a local file path to a PDF, CSV, or plain-text file containing test steps and expected results. Do not treat the URL or `.env` file as the test case.
3. **Authentication context (required)** — the user enters a local path to a `.env` file containing `MS_USERNAME` and `MS_PASSWORD`, and may provide MFA instructions; or explicitly replies `skip` to confirm that the test must not authenticate.

Do not proceed until inputs 1, 2, and 3 have each been answered. A missing input 3 is not equivalent to `skip`; ask the user to provide the `.env` path or explicitly type `skip`. Never repeat or reveal secret values in chat.

## Generate the suite

1. Read and parse the test case at the user-provided local path. Confirm the file exists and is a supported PDF, CSV, or plain-text file. Ask for clarification if steps or expected outcomes are ambiguous; never invent expected behavior.
2. Inspect the target application using available browser tools when useful. Select stable accessible locators (`getByRole`, `getByLabel`, `getByTestId`) and avoid brittle XPath/CSS where accessible locators work.
3. Generate clean, runnable TypeScript using `@playwright/test`, web-first assertions for each expected result, and correctly awaited asynchronous calls. Use Page Object Model where useful.
4. Save each suite into a new, application/test-specific folder under `C:\Users\TVM0881\playwright-test-suites`. Never overwrite an existing suite; add a unique suffix if needed.
5. Include the `.spec.ts` file(s), `playwright.config.ts`, `package.json` with run scripts, any needed page objects, a concise `README.md` with prerequisites/setup/run commands, and a `.gitignore` that excludes `.env`, `node_modules`, and test outputs. Use `BASE_URL` for the target URL when practical.
6. Do not copy application source or unrelated project files into the suite folder.

## Credentials and authentication

- Treat the user-provided `.env` path as sensitive. Read only the `MS_USERNAME` and `MS_PASSWORD` keys needed for the explicitly requested login flow. Never print, quote, log, commit, include in source, screenshots, traces, or reports the values.
- Do not copy the `.env` file into the suite. Generate `.env.example` with variable names only and ignore `.env` in `.gitignore`. The test should read secrets from `process.env`; document how the user can provide their own `.env` path for repeatable local runs.
- Missing required keys must cause a clear error naming the missing key, never its value. Do not use credentials if authentication input was skipped.
- Before entering credentials, inspect the login page and redirect destination. Only submit credentials to the user-provided application and its expected authorized authentication flow. If the flow redirects to an unexpected identity-provider origin, stop and ask for confirmation before entering credentials.
- If dynamic TOTP is explicitly required, use `otplib` with `process.env.MFA_SECRET`; never hardcode or log the secret. Document required packages and environment variables.
- Prefer Playwright `storageState` for authenticated tests unless the test explicitly requests login steps. Use a user-provided state path, or document the conventional `playwright/.auth/user.json` if none is given.

## Execute and report

Verify the saved files and run the test when dependencies, browser, and required authorized authentication are available. Never claim a test passed unless it actually ran successfully. If blocked, explain the specific blocker and provide the exact command the user can run.

In the final response, include the generated spec in one TypeScript code block, link the saved suite and spec, summarize setup and run commands, and state the actual execution outcome.
