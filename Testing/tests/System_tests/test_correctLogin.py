from playwright.sync_api import sync_playwright, Page, expect

from tests.System_tests.login import login


def test_login(page: Page):
    login(page, 'user@info.sk', 'password')
    expect(page.locator('button:has-text("User")')).to_be_visible()
    page.locator('button._registerButton_1i406_72').is_visible()

    # login(page, 'tomas@comas.sk', 'password')
    # expect(page.locator('button:has-text("tomas")')).to_be_visible()


with sync_playwright() as p:
    browser = p.chromium.launch(headless = False)
    context = browser.new_context()
    page = context.new_page()

    test_login(page)

    browser.close()
