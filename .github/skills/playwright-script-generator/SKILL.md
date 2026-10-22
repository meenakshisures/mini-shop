---
name: playwright-script-generator
description: Generates Page Object-based TypeScript Playwright tests from parsed Mini Shop cases, and is used when creating a test script.
---

# Playwright script generator

- Read the parsed case and project README before writing code. Use TypeScript Playwright and the existing repository configuration and conventions.
- Put reusable page classes in `tests/pages/` and the case spec in `tests/specs/<id>.spec.ts`. Create only the files needed for the case; do not generate tests until a parsed case is supplied.
- Implement interactions through page objects, with clearly named methods and locators. Keep test-specific expected outcomes in the spec.
- Prefer `page.getByTestId(...)` first; then use `getByRole(...)` or `getByLabel(...)` when no suitable test id exists. Mini Shop uses stable kebab-case test ids for interactive controls and messages.
- Product detail exception: quantity and its “Add to cart” button have no `data-testid`; locate them with `getByLabel('Quantity')` and `getByRole('button', { name: 'Add to cart' })` (or the exact accessible UI label).
- Login is automatic. `tests/specs/auth.setup.ts` logs in once as `standard_user` and every browser project starts with that saved session, so do NOT log in inside tests that just need a logged-in user. Tests that need a logged-out user (login cases, protected-page redirect, v2 login) must add `test.use({ storageState: { cookies: [], origins: [] } })` at the top of the spec. Cases that need another user (e.g. `slow_user`) also opt out and log in themselves.
- Specify locators explicitly: define every locator once as a named, readonly property of the page object (e.g. `loginButton = page.getByTestId('login-button')`), never inline selectors in specs. List the locators a test uses in its result JSON under `locators`.
- Do not clear localStorage manually. Playwright gives every test a fresh browser context, so cart and order counter always start clean (login comes from the saved session). Never use `addInitScript` to clear storage, because it runs on every page load and would wipe the login during navigation or reload. Complete login/setup as required by the test case.
- Use Playwright auto-waiting and web-first assertions such as `toBeVisible()`, `toHaveText()`, and `toHaveURL()`. Never use fixed sleeps such as `waitForTimeout`.
- Include at least one assertion directly verifying the stated expected result, using the exact expected message/text where one is specified. Never omit, soften, or substitute that assertion.
- Base URLs are `http://localhost:5173`. Account for v2 only when the case selects it: login becomes “Sign in” (`signin-button`), list add controls become “Add to basket” (`add-to-basket-<id>`), and product-list loading takes 4 seconds.
- Keep tests deterministic. Treat Price high-low and Express shipping as deliberate bugs: assert the case’s correct expected result and allow the test to fail rather than adapting it to faulty behavior.
