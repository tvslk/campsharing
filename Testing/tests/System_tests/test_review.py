import time
from playwright.sync_api import sync_playwright, Page, expect

def test_add_and_verify_review(page: Page):
    page.goto("https://reactwebappcampsharing.azurewebsites.net/")
    time.sleep(1)
    page.locator('button:has-text("Recenzie a skúsenosti")').click()
    expect(page).to_have_url("https://reactwebappcampsharing.azurewebsites.net/reviews")

    page.locator('textarea._textInput_1olfn_56').fill("Skvelý zážitok, určite odporúčam!")
    page.locator('button:has-text("Odoslať")').click()
    time.sleep(1)
    page.locator('p:has_text("Skvelý zážitok, určite odporúčam!")')

with sync_playwright() as p:
    browser = p.chromium.launch(headless=False)
    context = browser.new_context()
    page = context.new_page()

    test_add_and_verify_review(page)

    browser.close()
