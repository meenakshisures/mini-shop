# Sample prompt test cases

Free-text inputs for the agent. Each is written the way a tester would type it, without a fixed format.

1. Verify login fails with an invalid password.
2. Check that a locked user cannot log in and sees the correct error message.
3. Test that searching for "mug" on the products page shows only the Ceramic Mug.
4. Make sure that adding the Desk Lamp to the cart increases the cart badge to 1.
5. Verify that an empty cart shows "Your cart is empty." and the checkout button is disabled.
6. Test that the product detail page lets me choose quantity 2 for Wireless Mouse and the cart shows a subtotal of $59.98.
7. Verify a user can complete checkout with Standard shipping and sees an order number on the success page.
8. Check that sorting by "Price high-low" shows the most expensive product first.
9. Verify that logging in with the v2 UI (`/login?ui=v2`) works using the "Sign in" button.
10. Test that resetting app data from Settings shows a toast and logs the user out.

## Intentionally ambiguous prompts

The agent should ask for clarification instead of guessing.

11. Test the checkout. (Which path? Which expected result?)
12. Verify the cart works. (What does "works" mean?)
