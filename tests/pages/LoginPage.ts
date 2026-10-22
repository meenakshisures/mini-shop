import type { Locator, Page } from '@playwright/test'

export class LoginPage {
  readonly usernameInput: Locator
  readonly passwordInput: Locator
  readonly loginButton: Locator
  readonly signinButton: Locator
  readonly errorMessage: Locator

  constructor(private readonly page: Page) {
    this.usernameInput = page.getByTestId('username-input')
    this.passwordInput = page.getByTestId('password-input')
    this.loginButton = page.getByTestId('login-button')
    this.signinButton = page.getByTestId('signin-button')
    this.errorMessage = page.getByTestId('error-message')
  }

  async open(path = '/login') {
    await this.page.goto(path)
  }

  async login(username: string, password: string) {
    await this.usernameInput.fill(username)
    await this.passwordInput.fill(password)
    await this.loginButton.click()
  }

  /** v2 UI: same form, the button is renamed to "Sign in". */
  async signIn(username: string, password: string) {
    await this.usernameInput.fill(username)
    await this.passwordInput.fill(password)
    await this.signinButton.click()
  }
}
