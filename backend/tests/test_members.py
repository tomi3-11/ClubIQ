import uuid
import pytest
from app import db
from app.models import User, Club, ClubMember


def auth_header(token: str = "token") -> dict:
    return {"Authorization": f"Bearer {token}"}


def set_token(monkeypatch, clerk_id: str):
    monkeypatch.setattr("app.auth.decorators.verify_clerk_token", lambda token: {"sub": clerk_id})


def create_user(app, clerk_id: str, name: str, email: str, username: str, role: str = "user"):
    with app.app_context():
        unique_suffix = uuid.uuid4().hex[:6]
        user = User(
            clerk_id=clerk_id,
            name=name,
            email=f"{unique_suffix}-{email}",
            username=f"{username}-{unique_suffix}",
            role=role,
        )
        db.session.add(user)
        db.session.commit()
        return {"id": user.id, "clerk_id": user.clerk_id, "username": user.username}


def create_club(client, monkeypatch, creator, name: str):
    set_token(monkeypatch, creator["clerk_id"])
    resp = client.post("/api/clubs/", json={"name": name}, headers=auth_header())
    assert resp.status_code == 201
    return resp.get_json()["id"]


def add_member(client, monkeypatch, acting_user, club_id: str, target_user_id: int, role: str = "member"):
    set_token(monkeypatch, acting_user["clerk_id"])
    return client.post(
        "/api/members/",
        json={"club_id": club_id, "user_id": target_user_id, "role": role},
        headers=auth_header(),
    )


@pytest.fixture(autouse=True)
def clean_members(app):
    with app.app_context():
        ClubMember.query.delete()
        Club.query.delete()
        User.query.filter(User.clerk_id != "clerk_admin").delete()
        db.session.commit()
    yield


def test_create_member_success(monkeypatch, client, app):
    creator = create_user(app, "clerk_creator", "Creator", "creator@example.com", "creator")
    target = create_user(app, "clerk_target", "Target", "target@example.com", "target")

    club_id = create_club(client, monkeypatch, creator, "Club A")

    resp = add_member(client, monkeypatch, creator, club_id, target["id"], role="member")

    assert resp.status_code == 201
    body = resp.get_json()
    assert body["role"] == "member"

    with app.app_context():
        membership = ClubMember.query.filter_by(club_id=uuid.UUID(club_id), user_id=target["id"]).one()
        assert membership.role == "member"


def test_create_member_duplicate(monkeypatch, client, app):
    creator = create_user(app, "clerk_creator2", "Creator2", "creator2@example.com", "creator2")
    target = create_user(app, "clerk_target2", "Target2", "target2@example.com", "target2")
    club_id = create_club(client, monkeypatch, creator, "Club B")

    first = add_member(client, monkeypatch, creator, club_id, target["id"])
    assert first.status_code == 201

    dup = add_member(client, monkeypatch, creator, club_id, target["id"])
    assert dup.status_code == 400
    assert "already" in dup.get_json().get("error", "")


def test_update_member_role_by_admin(monkeypatch, client, app):
    creator = create_user(app, "clerk_creator3", "Creator3", "creator3@example.com", "creator3")
    target = create_user(app, "clerk_target3", "Target3", "target3@example.com", "target3")
    admin = {"id": 1, "clerk_id": "clerk_admin"}

    club_id = create_club(client, monkeypatch, creator, "Club C")
    resp = add_member(client, monkeypatch, creator, club_id, target["id"])
    membership_id = resp.get_json()["id"]

    set_token(monkeypatch, admin["clerk_id"])
    update_resp = client.put(
        f"/api/members/{membership_id}",
        json={"role": "moderator"},
        headers=auth_header(),
    )

    assert update_resp.status_code == 200
    assert update_resp.get_json()["role"] == "moderator"


def test_list_members_mine_filters(monkeypatch, client, app):
    user1 = create_user(app, "clerk_u1", "User1", "u1@example.com", "user1")
    user2 = create_user(app, "clerk_u2", "User2", "u2@example.com", "user2")

    club1 = create_club(client, monkeypatch, user1, "Club U1")
    add_member(client, monkeypatch, user1, club1, user1["id"])

    club2 = create_club(client, monkeypatch, user2, "Club U2")
    add_member(client, monkeypatch, user2, club2, user1["id"])

    set_token(monkeypatch, user1["clerk_id"])
    list_resp = client.get("/api/members/?mine=true", headers=auth_header())

    assert list_resp.status_code == 200
    payload = list_resp.get_json()
    assert len(payload) == 2
    club_ids = {item["club_id"] for item in payload}
    assert club_ids == {club1, club2}


def test_delete_member_by_creator(monkeypatch, client, app):
    creator = create_user(app, "clerk_del", "Del", "del@example.com", "deluser")
    target = create_user(app, "clerk_del_t", "DelT", "delt@example.com", "deltuser")

    club_id = create_club(client, monkeypatch, creator, "Club D")
    resp = add_member(client, monkeypatch, creator, club_id, target["id"])
    membership_id = resp.get_json()["id"]

    set_token(monkeypatch, creator["clerk_id"])
    delete_resp = client.delete(f"/api/members/{membership_id}", headers=auth_header())
    assert delete_resp.status_code == 200

    with app.app_context():
        assert db.session.get(ClubMember, uuid.UUID(membership_id)) is None
