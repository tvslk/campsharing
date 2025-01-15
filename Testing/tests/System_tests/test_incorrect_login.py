import time

from playwright.sync_api import sync_playwright, Page, expect

from tests.System_tests.login import login


def test_wrong_email_and_password(page: Page):
    login(page, 'wronguser@info.sk', 'wrongpassword')

    error_message = page.locator('[class="_errorMessage_11xmx_46 error-message"]')
    expect(error_message).to_be_visible()

    expect(error_message).to_have_text("Invalid credentials")

    print("Error message found: ", error_message.inner_text())

    expect(error_message).to_be_visible()
    time.sleep(1)


# def test_invalid_email(page: Page):
#     login(page, 'wronguserinfo.sk', 'wrongpassword')
#
#     with page.expect_popup() as popup_info:
#         page.locator('button[type="submit"]').click()
#     alert = popup_info.value
#     expect(alert.inner_text()).to_contain("Uveďte v e-mailovej adrese znak @. V adrese wronguserinfo.sk znak @ chýba.")
#     time.sleep(1)


def test_wrong_password(page: Page):
    login(page, 'user@info.sk', 'wrongpassword')
    error_message = page.locator('[class="_errorMessage_11xmx_46 error-message"]')
    expect(error_message).to_be_visible()

    expect(error_message).to_have_text("Invalid credentials")
    print("Error message found: ", error_message.inner_text())

    expect(error_message).to_be_visible()
    time.sleep(1)


def test_empty_email(page: Page):
    login(page, '', 'password')
    error_message = page.locator('[class="_errorMessage_11xmx_46 error-message"]')
    expect(error_message).to_be_visible()

    expect(error_message).to_have_text("Invalid credentials")
    print("Error message found: ", error_message.inner_text())

    expect(error_message).to_be_visible()
    time.sleep(1)


def test_empty_password(page: Page):
    login(page, 'user@info.sk', '')
    page.locator('button[type="submit"]').click()
    error_message = page.locator('[class="_errorMessage_11xmx_46 error-message"]')
    expect(error_message).to_be_visible()

    expect(error_message).to_have_text("Password cannot be empty")
    print("Error message found: ", error_message.inner_text())
    expect(error_message).to_be_visible()
    time.sleep(1)


def run_tests():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless = False)
        context = browser.new_context()
        page = context.new_page()

        test_wrong_email_and_password(page)
        # test_invalid_email(page)
        test_wrong_password(page)
        test_empty_email(page)
        test_empty_password(page)

        browser.close()


run_tests()
