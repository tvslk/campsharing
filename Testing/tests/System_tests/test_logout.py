import time

from playwright.sync_api import Page, expect

from tests.System_tests.login import login


def test_logout(page: Page):
    login(page, 'user@info.sk', 'password')

    page.locator('button:has-text("User")').click()
    page.locator('li:has-text("Odhlásiť sa")').click()
    time.sleep(1)
    expect(page).to_have_url("https://reactwebappcampsharing.azurewebsites.net/login")
