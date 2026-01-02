import uuid
import pytest
from app import db
from app.models import User, Club, Invitation, InvitationStatusEnum, ClubMember


def auth_header(token: str = "token") -> dict:
    return {"Authorization": f"Bearer {token}"}


def set_token(monkeypatch, clerk_id: str):
    monkeypatch.setattr("app.auth.decorators.verify_clerk_token", lambda token: {"sub": clerk_id})


def get_user(app, clerk_id: str):
    with app.app_context():
        user = User.query.filter_by(clerk_id=clerk_id).one()
        return {"id": user.id, "clerk_id": user.clerk_id, "email": user.email}


def create_user(app, clerk_id: str, name: str, email: str, username: str, role: str = "user"):
    with app.app_context():
        user = User(clerk_id=clerk_id, name=name, email=email, username=username, role=role)
        db.session.add(user)
        db.session.commit()
        return {"id": user.id, "clerk_id": user.clerk_id, "email": user.email}


def create_club(client, monkeypatch, owner, name: str = "Club"):
    set_token(monkeypatch, owner["clerk_id"])
    resp = client.post("/api/clubs/", json={"name": name}, headers=auth_header())
    assert resp.status_code == 201
    return resp.get_json()["id"]


@pytest.fixture(autouse=True)
def clean_invites(app, monkeypatch):
    monkeypatch.setattr("app.invitations.service.mail.send", lambda msg: None)
    with app.app_context():
        ClubMember.query.delete()
        Invitation.query.delete()
        Club.query.delete()
        User.query.filter(User.clerk_id != "clerk_admin").delete()
        db.session.commit()
    yield


def test_create_invitation_success(monkeypatch, client, app):
    admin = get_user(app, "clerk_admin")
    club_id = create_club(client, monkeypatch, admin, "Invitable Club")

    set_token(monkeypatch, admin["clerk_id"])
    payload = {"email": "invitee@example.com", "club_id": club_id}
    resp = client.post("/api/invitations/", json=payload, headers=auth_header())

    assert resp.status_code == 201
    body = resp.get_json()
    assert body["invitation"]["email"] == payload["email"]
    assert body["invitation"]["status"] == InvitationStatusEnum.pending.value
    assert body["invitation"]["invited_by"] == admin["id"]


def test_create_invitation_forbidden_for_non_creator(monkeypatch, client, app):
    owner = create_user(app, "clerk_owner", "Owner", "owner@example.com", "owneruser")
    outsider = create_user(app, "clerk_out", "Out", "out@example.com", "outuser")
    club_id = create_club(client, monkeypatch, owner, "Owner Club")

    set_token(monkeypatch, outsider["clerk_id"])
    resp = client.post(
        "/api/invitations/",
        json={"email": "invitee@example.com", "club_id": club_id},
        headers=auth_header(),
    )

    assert resp.status_code == 403
    assert "Forbidden" in resp.get_json().get("message", "")


def test_list_invitations_scoped_for_inviter(monkeypatch, client, app):
    admin = get_user(app, "clerk_admin")
    owner = create_user(app, "clerk_owner", "Owner", "owner@example.com", "owneruser")

    admin_club = create_club(client, monkeypatch, admin, "Admin Club")
    owner_club = create_club(client, monkeypatch, owner, "Owner Club")

    set_token(monkeypatch, admin["clerk_id"])
    client.post("/api/invitations/", json={"email": "a@example.com", "club_id": admin_club}, headers=auth_header())

    set_token(monkeypatch, owner["clerk_id"])
    client.post("/api/invitations/", json={"email": "b@example.com", "club_id": owner_club}, headers=auth_header())

    # Owner should only see their own invitations
    set_token(monkeypatch, owner["clerk_id"])
    owner_list = client.get("/api/invitations/", headers=auth_header())
    assert owner_list.status_code == 200
    assert all(inv["invited_by"] == owner["id"] for inv in owner_list.get_json())

    # Admin can see all invitations
    set_token(monkeypatch, admin["clerk_id"])
    admin_list = client.get("/api/invitations/", headers=auth_header())
    assert admin_list.status_code == 200
    invited_by_ids = {inv["invited_by"] for inv in admin_list.get_json()}
    assert invited_by_ids == {admin["id"], owner["id"]}


def test_accept_invitation_success(monkeypatch, client, app):
    admin = get_user(app, "clerk_admin")
    club_id = create_club(client, monkeypatch, admin, "Accept Club")

    invitee = create_user(app, "clerk_inv", "Inv", "invitee@example.com", "invuser")

    set_token(monkeypatch, admin["clerk_id"])
    resp = client.post(
        "/api/invitations/",
        json={"email": invitee["email"], "club_id": club_id},
        headers=auth_header(),
    )
    token = resp.get_json()["invitation"]["token"]

    set_token(monkeypatch, invitee["clerk_id"])
    accept_resp = client.post(f"/api/invitations/{token}/accept", headers=auth_header())

    assert accept_resp.status_code == 200
    with app.app_context():
        club_uuid = uuid.UUID(club_id)
        membership = ClubMember.query.filter_by(club_id=club_uuid, user_id=invitee["id"]).one()
        invitation = Invitation.query.filter_by(token=token).one()
        assert membership.role == "member"
        assert invitation.status == InvitationStatusEnum.accepted


def test_accept_invitation_wrong_user(monkeypatch, client, app):
    admin = get_user(app, "clerk_admin")
    club_id = create_club(client, monkeypatch, admin, "Wrong User Club")

    invitee = create_user(app, "clerk_inv", "Inv", "invitee@example.com", "invuser")
    other = create_user(app, "clerk_other", "Other", "other@example.com", "otheruser")

    set_token(monkeypatch, admin["clerk_id"])
    resp = client.post(
        "/api/invitations/",
        json={"email": invitee["email"], "club_id": club_id},
        headers=auth_header(),
    )
    token = resp.get_json()["invitation"]["token"]

    set_token(monkeypatch, other["clerk_id"])
    accept_resp = client.post(f"/api/invitations/{token}/accept", headers=auth_header())

    assert accept_resp.status_code == 403
    assert "not for this user" in accept_resp.get_json().get("message", "")
