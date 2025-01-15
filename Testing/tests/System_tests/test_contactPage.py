import time

from playwright.sync_api import sync_playwright, Page, expect


def fill_contact_form(page: Page, name: str, email: str, inquiry_type: str, message: str):
    page.locator('[id="name"]').fill(name)
    page.locator('[id="email"]').fill(email)
    page.locator('[id="inquiryType"]').wait_for(state = "visible")
    page.locator('[id="inquiryType"]').select_option(value = inquiry_type)
    page.locator('[id="message"]').fill(message)


def test_send_contact_message(page: Page):
    page.goto("https://reactwebappcampsharing.azurewebsites.net/")
    page.locator('button:has-text("Kontakt")').click()
    expect(page).to_have_url("https://reactwebappcampsharing.azurewebsites.net/contact")
    fill_contact_form(page, "Test User", "testuser@example.com", "Technická podpora", "This is a test message.")
    page.locator('button:has-text("Odoslať správu")').click()
    time.sleep(1)

    def handle_dialog(dialog):
        expect(dialog.message).to_contain("Správa bola odoslaná!")
        dialog.accept()

    page.on("dialog", handle_dialog)

with sync_playwright() as p:
    browser = p.chromium.launch(headless = False)
    context = browser.new_context()
    page = context.new_page()
    test_send_contact_message(page)
    browser.close()
