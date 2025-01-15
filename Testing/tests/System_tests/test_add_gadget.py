from playwright.sync_api import sync_playwright, Page, expect

from tests.System_tests.login import login


def test_add_equipment_form(page: Page):
    page.goto("https://reactwebappcampsharing.azurewebsites.net/")

    page.locator('button:has-text("ZAČAŤ ZDIEĽAŤ")').click()

    login(page, 'user@info.sk', 'password')

    page.locator('button:has-text("ZAČAŤ ZDIEĽAŤ")').click()
    expect(page).to_have_url("https://reactwebappcampsharing.azurewebsites.net/addgadgets")

    page.locator('#gadgetName').fill("Stan")
    page.locator('#gadgetDescription').fill("Veľký stan pre 4 osoby")
    page.locator('#pricePerDay').fill("10")
    page.locator('#width').fill("3")
    page.locator('#height').fill("2")
    page.locator('#depth').fill("5")
    page.locator('#weight').fill("10")
    page.locator('#materials').fill("Plast, kov")

    page.locator('label[for="imageInput"]').click()
    page.locator('input[type="file"]').set_input_files('C:/Users/admin/Desktop/Campsharing/Testing/stan.jpg')

    # page.locator('button:has-text("Pridať")').click()

    expect(page.locator('button:has-text("Pridať")')).to_be_visible()


with sync_playwright() as p:
    browser = p.chromium.launch(headless = False)
    context = browser.new_context()
    page = context.new_page()

    test_add_equipment_form(page)

    browser.close()
