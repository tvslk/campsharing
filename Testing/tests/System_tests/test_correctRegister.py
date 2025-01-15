from playwright.sync_api import sync_playwright, Page, expect


def test_registration(page: Page):
    page.goto("https://reactwebappcampsharing.azurewebsites.net/")

    page.locator('[aria-label="Registrácia"]').click()
    expect(page).to_have_url("https://reactwebappcampsharing.azurewebsites.net/register")

    page.locator('[name="name"]').fill("Test User")
    page.locator('[name="email"]').fill("testuser17@example.com")
    page.locator('[name="password"]').fill("password123")
    page.locator('[name="passwordRepeat"]').fill("password123")

    page.locator('button[type="submit"]').click()
    page.goto("https://reactwebappcampsharing.azurewebsites.net/")
    expect(page).to_have_url("https://reactwebappcampsharing.azurewebsites.net/")


with sync_playwright() as p:
    browser = p.chromium.launch(headless = False)
    context = browser.new_context()
    page = context.new_page()

    test_registration(page)

    browser.close()
