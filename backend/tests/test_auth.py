from app import db
from app.models import User


def auth_header(token: str = "test-token") -> dict:
    return {"Authorization": f"Bearer {token}"}


def test_sync_creates_user_first_time(monkeypatch, client, app):
    payload = {
        "sub": "clerk_sync_1",
        "email": "sync_user@example.com",
        "username": "syncuser",
        "first_name": "Sync",
        "last_name": "User",
    }
    monkeypatch.setattr("app.auth.decorators.verify_clerk_token", lambda token: payload)

    response = client.post("/api/auth/sync/", json={}, headers=auth_header())

    assert response.status_code == 200
    data = response.get_json()
    assert data["user"]["clerk_id"] == payload["sub"]
    assert data["user"]["email"] == payload["email"]

    with app.app_context():
        synced = User.query.filter_by(clerk_id=payload["sub"]).one()
        assert synced.username == "syncuser"


def test_sync_missing_email_returns_400(monkeypatch, client, app):
    monkeypatch.setattr("app.auth.decorators.verify_clerk_token", lambda token: {"sub": "clerk_missing_email"})

    response = client.post(
        "/api/auth/sync/",
        json={"name": "No Email Provided", "username": "missingemail"},
        headers=auth_header(),
    )

    assert response.status_code == 400
    data = response.get_json()
    assert "email" in data.get("missing", [])

    with app.app_context():
        assert User.query.filter_by(clerk_id="clerk_missing_email").first() is None


def test_profile_requires_auth(client):
    response = client.get("/api/auth/me/1/")

    assert response.status_code == 401
    data = response.get_json()
    assert data["message"] == "Authorization token missing"


def test_profile_returns_user_when_authed(monkeypatch, client, app):
    with app.app_context():
        user = User.query.filter_by(clerk_id="clerk_admin").one()

    payload = {"sub": user.clerk_id}
    monkeypatch.setattr("app.auth.decorators.verify_clerk_token", lambda token: payload)

    response = client.get(f"/api/auth/me/{user.id}/", headers=auth_header())

    assert response.status_code == 200
    data = response.get_json()
    assert data["email"] == user.email
    assert data["username"] == user.username


def test_protected_endpoint_blocks_unsynced_user(monkeypatch, client):
    monkeypatch.setattr("app.auth.decorators.verify_clerk_token", lambda token: {"sub": "clerk_unknown"})

    response = client.get("/api/auth/test/", headers=auth_header())

    assert response.status_code == 403
    data = response.get_json()
    assert data["message"] == "User not synced"


def test_protected_endpoint_allows_synced_user(monkeypatch, client, app):
    with app.app_context():
        user = User(
            clerk_id="clerk_synced",
            name="Synced User",
            email="synced@example.com",
            username="synceduser",
            role="user",
        )
        db.session.add(user)
        db.session.commit()
        username = user.username

    payload = {"sub": "clerk_synced"}
    monkeypatch.setattr("app.auth.decorators.verify_clerk_token", lambda token: payload)

    response = client.get("/api/auth/test/", headers=auth_header())

    assert response.status_code == 200
    data = response.get_json()
    assert username in data["message"]
