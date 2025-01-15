import time

from playwright.sync_api import sync_playwright, Page, expect

from tests.System_tests.login import login


def test_admin_dashboard_equipment_update(page: Page):
    login(page, "user@info.sk", "password")

    expect(page).to_have_url("https://reactwebappcampsharing.azurewebsites.net/")
    page.locator('button._registerButton_1i406_72').click()
    page.locator('li:has-text("Prehľad")').click()

    expect(page).to_have_url("https://reactwebappcampsharing.azurewebsites.net/admin-dashboard")
    expect(page.locator('p:has-text("kusov vybavenia")')).to_be_visible()
    expect(page.locator('p:has-text("aktívne prenájmy")')).to_be_visible()
    expect(page.locator('p:has-text("registrovaných užívateľov")')).to_be_visible()
    page.locator('button:has-text("+ Zobraziť Viac")').nth(0).click()
    time.sleep(1)
    expect(page).to_have_url("https://reactwebappcampsharing.azurewebsites.net/show-more/equipment")
    expect(page.locator('h2:has-text("Vybavenie")')).to_be_visible()
    page.locator('button.edit').nth(0).click()
    expect(page).to_have_url("https://reactwebappcampsharing.azurewebsites.net/edit-gadget/1")
    page.locator('#gadgetName').fill("Stan 4 miestny")
    page.locator('#gadgetDescription').fill("Veľký stan pre 4 osoby na dlhé výlety.")
    page.locator('#pricePerDay').fill("15")


    page.locator('button:has_text("Uložiť")')
    page.goto("https://reactwebappcampsharing.azurewebsites.net/")
    expect(page).to_have_url("https://reactwebappcampsharing.azurewebsites.net/")
    page.locator('button:has-text("User")').click()
    page.locator('li:has-text("Odhlásiť sa")').click()
    expect(page).to_have_url("https://reactwebappcampsharing.azurewebsites.net/login")


def test_admin_dashboard_reservation_update(page: Page):
    login(page, "user@info.sk", "password")
    expect(page).to_have_url("https://reactwebappcampsharing.azurewebsites.net/")

    page.locator('button._registerButton_1i406_72').click()

    page.locator('li:has-text("Prehľad")').click()

    expect(page).to_have_url("https://reactwebappcampsharing.azurewebsites.net/admin-dashboard")
    expect(page.locator('p:has-text("kusov vybavenia")')).to_be_visible()
    expect(page.locator('p:has-text("aktívne prenájmy")')).to_be_visible()
    expect(page.locator('p:has-text("registrovaných užívateľov")')).to_be_visible()

    page.locator('button:has-text("+ Zobraziť Viac")').nth(1).click()
    time.sleep(1)
    expect(page).to_have_url("https://reactwebappcampsharing.azurewebsites.net/show-more/reservations")
    expect(page.locator('h2:has-text("Rezervácie")')).to_be_visible()

    page.locator('button.edit').nth(0).click()

    expect(page).to_have_url("https://reactwebappcampsharing.azurewebsites.net/edit-reservation/2")

    page.locator('button._day_3s3ni_13:has-text("10")').click()
    page.locator('button._day_3s3ni_13:has-text("20")').click()

    page.locator('button:has_text("Uložiť")')
    page.goto("https://reactwebappcampsharing.azurewebsites.net/")
    expect(page).to_have_url("https://reactwebappcampsharing.azurewebsites.net/")


with sync_playwright() as p:
    browser = p.chromium.launch(headless = False)
    context = browser.new_context()
    page = context.new_page()

    test_admin_dashboard_equipment_update(page)
    test_admin_dashboard_reservation_update(page)

    browser.close()
