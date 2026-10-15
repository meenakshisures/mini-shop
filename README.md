# Mini Shop

A small React + Vite + TypeScript shop app. It exists as a **target application for the AI Playwright test automation agent (POC)**. It has no backend. Data is fixed and deterministic, and state is kept in localStorage.

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

## Playwright MCP

`.vscode/mcp.json` registers the Playwright MCP server for GitHub Copilot in VS Code. Open that file in VS Code and click **Start** above the `playwright` entry. Then use Copilot Chat in **Agent** mode.
