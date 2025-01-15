from playwright.sync_api import sync_playwright, Page, expect


def fill_registration_form(page: Page, name: str, email: str, password: str, password_repeat: str):
    page.locator('[id="name"]').fill(name)
    page.locator('[id="email"]').fill(email)
    page.locator('[id="password"]').fill(password)
    page.locator('[id="passwordRepeat"]').fill(password_repeat)


def test_empty_fields(page: Page):
    page.goto("https://reactwebappcampsharing.azurewebsites.net/register")
    page.locator('button[type="submit"]').click()
    errors = page.locator('p._error_gosmi_34')
    expect(errors).to_contain_text(["Meno je povinné.", "Email je povinný.", "Heslo je povinné."])


def test_password_too_short(page: Page):
    page.goto("https://reactwebappcampsharing.azurewebsites.net/register")
    fill_registration_form(page, "Test User", "testuser@example.com", "short", "short")
    page.locator('button[type="submit"]').click()
    errors = page.locator('p._error_gosmi_34')
    expect(errors).to_contain_text("Heslo musí mať minimálne 8 znakov.")


def test_passwords_do_not_match(page: Page):
    page.goto("https://reactwebappcampsharing.azurewebsites.net/register")
    fill_registration_form(page, "Test User", "testuser@example.com", "password123", "password124")
    page.locator('button[type="submit"]').click()
    errors = page.locator('p._error_gosmi_34')
    expect(errors).to_contain_text("Heslá sa nezhodujú.")


def test_empty_name(page: Page):
    page.goto("https://reactwebappcampsharing.azurewebsites.net/register")
    fill_registration_form(page, "", "testuser@example.com", "password123", "password123")
    page.locator('button[type="submit"]').click()
    errors = page.locator('p._error_gosmi_34')
    expect(errors).to_contain_text("Meno je povinné.")


with sync_playwright() as p:
    browser = p.chromium.launch(headless = False)
    context = browser.new_context()
    page = context.new_page()

    test_empty_fields(page)
    test_password_too_short(page)
    test_passwords_do_not_match(page)
    test_empty_name(page)

    browser.close()
