import time

from playwright.sync_api import sync_playwright, Page, expect

from tests.System_tests.login import login


def test_navbar_and_buttons(page: Page):
    page.goto("https://reactwebappcampsharing.azurewebsites.net/")

    nav_links = {
        "Ako to funguje": ("https://reactwebappcampsharing.azurewebsites.net/how-it-works", "Ako to funguje"),
        "Kontakt": ("https://reactwebappcampsharing.azurewebsites.net/contact", "Kontaktujte nás")
    }

    for link_name, (expected_url, expected_heading) in nav_links.items():
        page.locator(f'[aria-label="{link_name}"]').click()
        expect(page).to_have_url(expected_url)
        expect(page.locator("h1")).to_have_text(expected_heading)

        page.locator('[aria-label="Domov"]').click()
        expect(page).to_have_url("https://reactwebappcampsharing.azurewebsites.net/")


    page.locator('[aria-label="Kontakt"]').click()
    page.locator('[aria-label="Domovská stránka"]').click()
    expect(page).to_have_url("https://reactwebappcampsharing.azurewebsites.net/")



def test_footer_buttons(page: Page):
    page.goto("https://reactwebappcampsharing.azurewebsites.net/")

    page.locator('button:has-text("Populárne miesta")').click()
    expect(page.locator('h1')).to_have_text("Populárne miesta")
    expect(page).to_have_url("https://reactwebappcampsharing.azurewebsites.net/popular-camps")

    page.locator('[aria-label="Domov"]').click()


    page.locator('button:has-text("Kempingové vybavenie")').click()
    time.sleep(1)
    expect(page.locator('h2').nth(0)).to_have_text("available")
    expect(page.locator('h2').nth(1)).to_have_text("borrowed")

    expect(page).to_have_url("https://reactwebappcampsharing.azurewebsites.net/gadgets")

    page.locator('[aria-label="Domov"]').click()


    page.locator('button:has-text("Recenzie a skúsenosti")').click()
    expect(page.locator('h1')).to_have_text("Recenzie a Skúsenosti")
    page.locator('[aria-label="Domov"]').click()


    page.locator('button:has-text("Doplnkové služby")').click()
    expect(page.locator('h1')).to_have_text("Doplnkové služby")
    expect(page).to_have_url("https://reactwebappcampsharing.azurewebsites.net/additional-services")

    page.locator('[aria-label="Domov"]').click()


    expect(page).to_have_url("https://reactwebappcampsharing.azurewebsites.net/")
    page.locator('button:has-text("NÁJSŤ MIESTO")').click()
    login_if_needed(page, "user@info.sk", "password")
    page.locator('button:has-text("NÁJSŤ MIESTO")').click()
    expect(page).to_have_url("https://reactwebappcampsharing.azurewebsites.net/find-place")

    page.locator('[class="leaflet-control-zoom-in"]').click()

    expect(page.locator('[class="leaflet-control-zoom-in"]')).to_be_visible()

    page.locator('[class="leaflet-control-zoom-out"]').click()

    expect(page.locator('[class="leaflet-control-zoom-out"]')).to_be_visible()


    page.locator('button:has-text("Domov")').click()


    expect(page).to_have_url("https://reactwebappcampsharing.azurewebsites.net/")
    page.locator('button:has-text("ZAČAŤ ZDIEĽAŤ")').click()
    login_if_needed(page, "user@info.sk", "password")
    if page.url == "https://reactwebappcampsharing.azurewebsites.net":
        page.locator('button:has-text("ZAČAŤ ZDIEĽAŤ")').click()
    expect(page).to_have_url("https://reactwebappcampsharing.azurewebsites.net/addgadgets")
    expect(page.locator('input#gadgetName')).to_be_visible()

    page.locator('button:has-text("Domov")').click()



def login_if_needed(page: Page, username: str, password: str):
    if (page.url == "https://reactwebappcampsharing.azurewebsites.net/login?redirect=/find-place"
            or page.url == "https://reactwebappcampsharing.azurewebsites.net/login?redirect=/addgadgets"):
        login(page, username, password)


with sync_playwright() as p:
    browser = p.chromium.launch(headless = False)
    context = browser.new_context()
    page = context.new_page()

    test_navbar_and_buttons(page)
    test_footer_buttons(page)

    browser.close()
