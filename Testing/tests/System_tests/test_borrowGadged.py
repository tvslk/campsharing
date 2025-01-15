from playwright.sync_api import sync_playwright, Page, expect

from tests.System_tests.login import login


def test_gadget_reservation(page: Page):
    login(page, 'tomas@comas.sk', 'password')
    expect(page).to_have_url("https://reactwebappcampsharing.azurewebsites.net/")
    page.locator('button:has-text("Kempingové vybavenie")').click()
    expect(page).to_have_url("https://reactwebappcampsharing.azurewebsites.net/gadgets")

    page.locator('button._addButton_puxms_128').first.click()
    expect(page).to_have_url("https://reactwebappcampsharing.azurewebsites.net/gadget-reservation/1")

    page.locator('button._day_3s3ni_13').first.click()

    page.locator('label:has-text("Zostavenie stanu na mieste kempovania")').locator('input').check()
    page.locator('label:has-text("Zabezpečenie základných kempingových potrieb (príbor, poháre, atď.)")').locator('input').check()
    page.locator('label:has-text("Poskytnutie vybavenia na založenie ohňa")').locator('input').check()

    page.locator('button:has-text("Prenajať")').click()
    expect(page).to_have_url("https://reactwebappcampsharing.azurewebsites.net/success")

    expect(page.locator('div._successTitle_qq3s1_39')).to_be_visible()
    page.locator('button:has-text("Späť na hlavnú stránku")').click()

    expect(page).to_have_url("https://reactwebappcampsharing.azurewebsites.net/")

with sync_playwright() as p:
    browser = p.chromium.launch(headless=False)
    context = browser.new_context()
    page = context.new_page()
    test_gadget_reservation(page)
    browser.close()
