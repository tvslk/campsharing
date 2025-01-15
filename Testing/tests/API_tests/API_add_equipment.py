import pytest
from playwright.sync_api import APIRequestContext, expect


@pytest.fixture(scope = "module")
def request_context(playwright):
    context = playwright.request.new_context()
    yield context
    context.dispose()


@pytest.fixture(scope = "module")
def valid_token(request_context: APIRequestContext):
    response = request_context.post(
        "https://campsharing-dbdjb9cycyhjcjdp.westeurope-01.azurewebsites.net/api/login",
        headers = {"Content-Type": "application/json"},
        json = {"username": "user@info.sk", "password": "password"}
    )

    print(f"Response status: {response.status}")
    print(f"Response body: {response.text()}")

    assert response.status == 200, "Failed to login"

    return response.json()["token"]


def test_add_gadget_success(request_context: APIRequestContext, valid_token):
    response = request_context.post(
        "https://campsharing-dbdjb9cycyhjcjdp.westeurope-01.azurewebsites.net/api/gadgets/add",
        headers = {
            "Content-Type": "application/json",
            "Authorization": f"Bearer {valid_token}"
        },
        json = {
            "gadgetName": "Camping Tent",
            "gadgetDescription": "A high-quality camping tent",
            "pricePerDay": 10.0,
            "width": 2.5,
            "height": 2.0,
            "length": 3.0,
            "weight": 5.0,
            "material": "Nylon",
            "availableFrom": "2023-01-01T00:00:00",
            "availableTo": "2023-12-31T23:59:59",
            "status": "available"
        }
    )

    print(f"Response status: {response.status}")
    print(f"Response body: {response.text()}")

    assert response.status == 201, f"Unexpected status: {response.status}"
