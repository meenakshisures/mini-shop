# Sample test cases

| File | Input type | Contents |
|---|---|---|
| `test-cases.csv` | CSV, one row per test case | 23 cases with columns `TestID, Title, Preconditions, Steps, Test Data, Expected Result` |
| `prompts.md` | Free-text prompts | 10 clear prompts and 2 deliberately ambiguous ones |

Test data comes from the README at the repo root (users, products and prices).

## Expected failures (deliberate app bugs)

The expected results describe the **correct** behaviour. These cases should therefore **fail** against the app, and the agent must report them as failures. It must not weaken the assertion to make them pass.

| Test | Why it fails |
|---|---|
| TC-012 (CSV), prompt 8 | "Price high-low" puts the most expensive item last |
| TC-020 (CSV) | Express shipping adds $1 instead of $10 |

All other cases are expected to pass. That's 21 of 23 CSV cases, or about 91%.

## Notes for the agent run

- TC-019 expects order number `ORD-0001`. Order numbers increase across orders, so reset the app data (or clear localStorage) before that run.
- TC-006, TC-008 and TC-023 involve delays (3s, 1.5s, 4s). They test that the generated script waits correctly.
- TC-014 and prompt 6 use the product detail page, which has no `data-testid` on the quantity selector or the Add to cart button. The script needs role or label locators.
- TC-022 and TC-023 use UI v2. They are good cases for testing self-healing: a script written for v1 breaks on the renamed buttons.
