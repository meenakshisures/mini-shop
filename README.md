# Mini Shop

A small React + Vite + TypeScript shop app. It exists as a **target application for the AI Playwright test automation agent (POC)**. It has no backend. Data is fixed and deterministic, and state is kept in localStorage.

## Requirements

- **Node.js 20 or higher** (Playwright refuses to run on older versions). Check with `node -v`. With nvm: `nvm install 24` then `nvm use 24`, and open a new terminal.
- VS Code with GitHub Copilot (Agent mode).

## Run the app

```
npm install
npm run dev
```

Open http://localhost:5173

## Test users

| Username | Password | Behaviour |
|---|---|---|
| `standard_user` | `test123` | Logs in normally |
| `locked_user` | `test123` | Error: "This user has been locked out." |
| `slow_user` | `test123` | Logs in after a 3 second delay; button shows "Signing in..." |

Other login cases:

| Input | Message |
|---|---|
| Wrong password | Invalid username or password. |
| Empty username | Username is required. |
| Empty password | Password is required. |

## Pages

| Route | Notes |
|---|---|
| `/login` | Login form |
| `/products` | 8 products, 1.5s loading spinner, search, sort, Add to cart / Remove |
| `/products/:id` | Detail page, quantity 1-5, Add to cart |
| `/cart` | Items, total, Checkout (disabled when empty) |
| `/checkout` | Form validation, shipping options, confirm modal, 2s order placement |
| `/order-success` | "Thank you for your order!" and order number ORD-0001, ORD-0002, ... |
| `/settings` | UI version toggle (v1/v2), Reset app data, Logout |

All pages except `/login` need a logged-in user, otherwise they redirect to `/login`.

## Locator rules

- Every interactive element and message has a `data-testid` in kebab-case (for example `login-button`, `error-message`, `cart-badge`).
- **Exception:** on the product detail page, the quantity selector and the "Add to cart" button have **no** `data-testid`. Use role or label locators there (for example `getByLabel('Quantity')`, `getByRole('button', { name: 'Add to cart' })`).
- Inputs have labels. Buttons are real `<button>` elements.

## UI version v2 (for testing self-healing)

Switch with `?ui=v2` in the URL, or on the Settings page. The choice is remembered. Use `?ui=v1` to go back.

In v2:
- The "Login" button becomes "Sign in" (`data-testid="signin-button"`).
- "Add to cart" becomes "Add to basket" (`data-testid="add-to-basket-<id>"`).
- The product list loads after 4s instead of 1.5s.

## Known bugs (deliberate, do not fix)

These are planted to check that the agent reports real failures instead of hiding them.

1. Sort "Price high-low" puts the most expensive item last instead of first.
2. In checkout, Express shipping adds $1 instead of $10.

A test that fails because of one of these is a **correct** failure of the app, not a script problem.

## Running the tests

```
npm install
npx playwright install      # chromium, firefox, webkit
npm test                    # setup login + all 3 browsers
npm run test:chromium       # one browser only
npm run report              # open the HTML report (screenshots + traces)
```

- **Automatic login:** `tests/specs/auth.setup.ts` logs in once and saves the session to `playwright/.auth/user.json`; all browser projects reuse it. Logged-out tests use `test.use({ storageState: { cookies: [], origins: [] } })`.
- **Multi-browser:** projects `chromium`, `firefox`, `webkit` in `playwright.config.ts`.
- **Evidence:** screenshots and traces are captured on every run into `test-results/`; the HTML report is in `playwright-report/`; JSON results in `reports/playwright-results.json`; per-case summary in `reports/summary.md`.
- **Locators:** defined once per page object in `tests/pages/`.
- **Coverage:** every sample case is automated end to end (browsing, search, sort, add to cart, checkout, settings, v2 UI): `TC-001`..`TC-023` and `PROMPT-001`..`PROMPT-010` in `tests/specs/`. Items are added to the cart through the UI inside each test.
- **Per-case report:** after `npm test`, run `npm run reports` to rebuild `reports/results/<id>.json` and `reports/summary.md` (status per browser, failure reason, links to screenshots and traces).
- **Expected failures:** TC-012, TC-020 and PROMPT-008 fail on purpose (deliberate app bugs). They are reported as failed, marked as known app bugs.
- **CSV parsing:** `npm run parse:csv` converts every CSV row into `test-cases/parsed/<TestID>.json`.

## Playwright MCP

`.vscode/mcp.json` registers the Playwright MCP server for GitHub Copilot in VS Code.

1. Open Copilot Chat, choose **Agent** mode and the **playwright-test-agent** agent, and send any short message first (the server cannot start before the chat session exists).
2. Open `.vscode/mcp.json` and click **Start** above the `playwright` entry. It should change to **Running**.

**Windows:** VS Code cannot launch `npx` directly (it is `npx.cmd`), so the config runs it through `cmd`:
`"command": "cmd", "args": ["/c", "npx", "@playwright/mcp@latest"]`. On macOS/Linux use `"command": "npx", "args": ["@playwright/mcp@latest"]`.

If it shows **Error**, open the **Output** panel and pick the MCP server's log from the dropdown. If you changed Node versions, fully restart VS Code.
