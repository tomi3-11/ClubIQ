import uuid
import pytest
from app import db
from app.models import User, Club, ClubMember


def auth_header(token: str = "token") -> dict:
    return {"Authorization": f"Bearer {token}"}


def get_user(app, clerk_id: str):
    with app.app_context():
        user = User.query.filter_by(clerk_id=clerk_id).one()
        return {"id": user.id, "clerk_id": user.clerk_id, "username": user.username}


def create_user(app, clerk_id: str, name: str, email: str, username: str, role: str = "user"):
    with app.app_context():
        user = User(
            clerk_id=clerk_id,
            name=name,
            email=email,
            username=username,
            role=role,
        )
        db.session.add(user)
        db.session.commit()
        return {"id": user.id, "clerk_id": user.clerk_id, "username": user.username}


@pytest.fixture(autouse=True)
def clean_clubs(app):
    with app.app_context():
        ClubMember.query.delete()
        Club.query.delete()
        db.session.commit()
    yield


def test_create_club_success(monkeypatch, client, app):
    admin = get_user(app, "clerk_admin")
    monkeypatch.setattr("app.auth.decorators.verify_clerk_token", lambda token: {"sub": admin["clerk_id"]})

    payload = {"name": "Chess Club", "description": "Board games"}
    response = client.post("/api/clubs/", json=payload, headers=auth_header())

    assert response.status_code == 201
    data = response.get_json()
    assert data["name"] == payload["name"]

    with app.app_context():
        club = Club.query.filter_by(name=payload["name"]).one()
        member = ClubMember.query.filter_by(club_id=club.id, user_id=admin["id"]).one()
        assert member.role == "admin"


def test_create_club_duplicate_name(monkeypatch, client, app):
    admin = get_user(app, "clerk_admin")
    monkeypatch.setattr("app.auth.decorators.verify_clerk_token", lambda token: {"sub": admin["clerk_id"]})

    payload = {"name": "Film Club"}
    first = client.post("/api/clubs/", json=payload, headers=auth_header())
    assert first.status_code == 201

    duplicate = client.post("/api/clubs/", json=payload, headers=auth_header())
    assert duplicate.status_code == 400
    assert "already exists" in duplicate.get_json().get("error", "")


def test_update_club_forbidden_for_non_creator(monkeypatch, client, app):
    owner = create_user(app, "clerk_owner", "Owner", "owner@example.com", "owneruser")
    other = create_user(app, "clerk_other", "Other", "other@example.com", "otheruser")

    monkeypatch.setattr("app.auth.decorators.verify_clerk_token", lambda token: {"sub": owner["clerk_id"]})
    create_resp = client.post("/api/clubs/", json={"name": "Owner Club"}, headers=auth_header())
    club_id = create_resp.get_json()["id"]

    monkeypatch.setattr("app.auth.decorators.verify_clerk_token", lambda token: {"sub": other["clerk_id"]})
    update_resp = client.put(f"/api/clubs/{club_id}", json={"name": "Hacked"}, headers=auth_header())

    assert update_resp.status_code == 403
    assert "Insufficient permissions" in update_resp.get_json().get("error", "")


def test_update_club_allowed_for_admin(monkeypatch, client, app):
    owner = create_user(app, "clerk_creator", "Creator", "creator@example.com", "creatoruser")
    admin = get_user(app, "clerk_admin")

    monkeypatch.setattr("app.auth.decorators.verify_clerk_token", lambda token: {"sub": owner["clerk_id"]})
    create_resp = client.post("/api/clubs/", json={"name": "Updatable Club"}, headers=auth_header())
    club_id = create_resp.get_json()["id"]

    monkeypatch.setattr("app.auth.decorators.verify_clerk_token", lambda token: {"sub": admin["clerk_id"]})
    update_resp = client.put(f"/api/clubs/{club_id}", json={"name": "Updated Club"}, headers=auth_header())

    assert update_resp.status_code == 200
    assert update_resp.get_json()["name"] == "Updated Club"


def test_list_clubs_mine_filters_memberships(monkeypatch, client, app):
    user1 = create_user(app, "clerk_user1", "User One", "user1@example.com", "userone")
    user2 = create_user(app, "clerk_user2", "User Two", "user2@example.com", "usertwo")

    monkeypatch.setattr("app.auth.decorators.verify_clerk_token", lambda token: {"sub": user1["clerk_id"]})
    client.post("/api/clubs/", json={"name": "User1 Club"}, headers=auth_header())

    monkeypatch.setattr("app.auth.decorators.verify_clerk_token", lambda token: {"sub": user2["clerk_id"]})
    club2_resp = client.post("/api/clubs/", json={"name": "User2 Club"}, headers=auth_header())
    club2_id = club2_resp.get_json()["id"]
    club2_uuid = uuid.UUID(club2_id)

    with app.app_context():
        membership = ClubMember(club_id=club2_uuid, user_id=user1["id"], role="member")
        db.session.add(membership)
        db.session.commit()

    monkeypatch.setattr("app.auth.decorators.verify_clerk_token", lambda token: {"sub": user1["clerk_id"]})
    list_resp = client.get("/api/clubs/?mine=true", headers=auth_header())

    assert list_resp.status_code == 200
    names = {club["name"] for club in list_resp.get_json()}
    assert names == {"User1 Club", "User2 Club"}


def test_delete_club_by_creator(monkeypatch, client, app):
    owner = create_user(app, "clerk_del", "Delete Me", "del@example.com", "deluser")

    monkeypatch.setattr("app.auth.decorators.verify_clerk_token", lambda token: {"sub": owner["clerk_id"]})
    create_resp = client.post("/api/clubs/", json={"name": "Temp Club"}, headers=auth_header())
    club_id = create_resp.get_json()["id"]

    delete_resp = client.delete(f"/api/clubs/{club_id}", headers=auth_header())
    assert delete_resp.status_code == 200

    with app.app_context():
        club_uuid = uuid.UUID(club_id)
        assert db.session.get(Club, club_uuid) is None
