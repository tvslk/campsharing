from playwright.sync_api import Page, expect

def login(page: Page, email: str, password: str):
    page.goto("https://reactwebappcampsharing.azurewebsites.net/")
    page.locator('[aria-label="Prihlásiť sa"]').click()
    expect(page).to_have_url("https://reactwebappcampsharing.azurewebsites.net/login")

    page.locator('input[name="email"]').fill(email)
    page.locator('input[name="password"]').fill(password)

    page.locator('button[type="submit"]').click()
