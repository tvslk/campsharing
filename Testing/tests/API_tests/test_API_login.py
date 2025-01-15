import pytest
from playwright.sync_api import APIRequestContext, sync_playwright

@pytest.fixture(scope="module")
def request_context() -> APIRequestContext:
    with sync_playwright() as p:
        request = p.request.new_context(base_url="https://campsharing-dbdjb9cycyhjcjdp.westeurope-01.azurewebsites.net")
        yield request
        request.dispose()

def test_login_success(request_context: APIRequestContext):
    response = request_context.post(
        "/api/login",
        headers={"Content-Type": "application/json"},
        data='{"email": "user@info.sk", "password": "password"}'
    )
    assert response.status == 200, f"Unexpected status: {response.status}"
    json_data = response.json()
    assert json_data["token"] is not None, "Token was not returned"

def test_login_invalid_credentials(request_context: APIRequestContext):
    response = request_context.post(
        "/api/login",
        headers={"Content-Type": "application/json"},
        data='{"email": "user@info.sk", "password": "wrongpassword"}'
    )
    assert response.status == 401, f"Unexpected status: {response.status}"
    json_data = response.json()
    assert json_data["message"] == "Invalid credentials", f"Unexpected message: {json_data['message']}"

def test_login_empty_password(request_context: APIRequestContext):
    response = request_context.post(
        "/api/login",
        headers={"Content-Type": "application/json"},
        data='{"email": "user@info.sk", "password": ""}'
    )
    assert response.status == 401, f"Unexpected status: {response.status}"
    json_data = response.json()
    assert json_data["message"] == "Password cannot be empty", f"Unexpected message: {json_data['message']}"
