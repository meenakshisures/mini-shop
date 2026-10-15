# Mini Shop – sample app for Playwright test automation

This app exists to be tested by an AI Playwright agent. Testability matters more than looks.

## Tech
- React + Vite + TypeScript, react-router-dom. No backend: data in src/data/*.ts, state in React context + localStorage.
- Plain CSS, simple clean layout.

## Testability rules (always follow)
- Every interactive element and every message gets a stable data-testid in kebab-case (e.g. login-button, error-message, cart-badge).
- EXCEPTION: on the Product Detail page, do NOT add data-testid to the quantity selector and the "Add to cart" button (agent must use role/label locators there).
- Inputs always have a <label htmlFor>. Buttons are real <button>s. No clickable divs.
- Messages are exact, fixed strings defined in src/data/messages.ts. Never randomize text or ids.
- Same data every time (deterministic). Prices are fixed.

## Users (src/data/users.ts)
- standard_user / test123 → logs in
- locked_user / test123 → error "This user has been locked out."
- slow_user / test123 → logs in after a 3 second delay with a "Signing in..." button state
- wrong password → "Invalid username or password."
- empty username → "Username is required." ; empty password → "Password is required."

## Pages
1. /login
2. /products – 8 fixed products, loads after 1.5s with a spinner (data-testid="loading-spinner"); search box; sort dropdown (Name A-Z, Name Z-A, Price low-high, Price high-low); "Add to cart" / "Remove" toggle per item; cart badge in header shows count.
3. /products/:id – name, price, description, quantity selector (1-5), Add to cart.
4. /cart – table of items (name, qty, price, subtotal, remove button), total, "Continue shopping", "Checkout". Empty cart shows "Your cart is empty." and Checkout disabled.
5. /checkout – full name, email, address, shipping radio (Standard/Express +$10), "I accept the terms" checkbox; validation messages per field; "Place order" opens a confirm modal; confirm → "Placing order..." 2s → /order-success showing "Thank you for your order!" and an order number ORD-0001, ORD-0002...
6. /settings – UI version toggle (v1/v2), "Reset app data" button (clears cart, orders, logs out) with toast "App data has been reset.", Logout.
- Header on all logged-in pages: app name, Products link, cart icon+badge, Settings link, Logout. Not logged in → redirect to /login.

## UI version v2 (for testing the agent's self-healing)
When UI version is v2 (settings toggle or ?ui=v2): rename "Login" button to "Sign in" and its data-testid to signin-button; "Add to cart" becomes "Add to basket" (data-testid add-to-basket-<id>); product list delay becomes 4s. Everything else unchanged.

## Deliberate bugs (documented, do NOT fix)
1. Sort "Price high-low" places the most expensive item last instead of first.
2. In checkout, Express shipping total adds $1 instead of $10.
Mark both with a code comment: // DELIBERATE BUG for test validation.