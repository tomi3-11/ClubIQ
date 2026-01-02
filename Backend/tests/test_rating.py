import uuid
import pytest
from app import db
from app.models import User, Activity, Task, TaskStatusEnum, Rating


def auth_header(token: str = "token") -> dict:
    return {"Authorization": f"Bearer {token}"}


def set_token(monkeypatch, clerk_id: str):
    monkeypatch.setattr("app.auth.decorators.verify_clerk_token", lambda token: {"sub": clerk_id})


def create_user(app, clerk_id: str, name: str, email: str, username: str, role: str = "user"):
    with app.app_context():
        suffix = uuid.uuid4().hex[:6]
        user = User(
            clerk_id=clerk_id,
            name=name,
            email=f"{suffix}-{email}",
            username=f"{username}-{suffix}",
            role=role,
        )
        db.session.add(user)
        db.session.commit()
        return {"id": user.id, "clerk_id": user.clerk_id, "username": user.username}


def create_completed_task(app, author_id: int):
    with app.app_context():
        activity = Activity(title="Task Activity", description="", club_id=None, author_id=author_id)
        db.session.add(activity)
        db.session.flush()

        task = Task(activity_id=activity.id, title="Test Task", description="", status=TaskStatusEnum.completed)
        db.session.add(task)
        db.session.commit()
        return str(task.id)


def add_rating(client, monkeypatch, actor, task_id: str, rated_user_id: int, score: int = 5):
    set_token(monkeypatch, actor["clerk_id"])
    return client.post(
        f"/api/ratings/{task_id}/",
        json={"score": score, "rated_user": rated_user_id, "comments": "good"},
        headers=auth_header(),
    )


@pytest.fixture(autouse=True)
def clean_ratings(app):
    with app.app_context():
        Rating.query.delete()
        Task.query.delete()
        Activity.query.delete()
        db.session.commit()
    yield


def test_create_rating_success(monkeypatch, client, app):
    admin = create_user(app, "clerk_rate_admin", "Admin", "admin@ex.com", "admin", role="admin")
    target = create_user(app, "clerk_rate_target", "Target", "target@ex.com", "target")
    task_id = create_completed_task(app, admin["id"])

    resp = add_rating(client, monkeypatch, admin, task_id, target["id"])

    assert resp.status_code == 201
    body = resp.get_json()
    assert body["success"] is True
    assert body["data"]["rated_user"] == target["id"]

    with app.app_context():
        rating = Rating.query.filter_by(task_id=uuid.UUID(task_id)).one()
        assert rating.rated_by_id == admin["id"]


def test_create_rating_duplicate_rejected(monkeypatch, client, app):
    admin = create_user(app, "clerk_rate_admin2", "Admin2", "admin2@ex.com", "admin2", role="admin")
    target = create_user(app, "clerk_rate_target2", "Target2", "target2@ex.com", "target2")
    task_id = create_completed_task(app, admin["id"])

    first = add_rating(client, monkeypatch, admin, task_id, target["id"])
    assert first.status_code == 201

    dup = add_rating(client, monkeypatch, admin, task_id, target["id"])
    assert dup.status_code == 400


def test_create_rating_incomplete_task(monkeypatch, client, app):
    admin = create_user(app, "clerk_rate_admin3", "Admin3", "admin3@ex.com", "admin3", role="admin")
    target = create_user(app, "clerk_rate_target3", "Target3", "target3@ex.com", "target3")

    with app.app_context():
        activity = Activity(title="Incomplete Activity", description="", club_id=None, author_id=admin["id"])
        db.session.add(activity)
        db.session.flush()
        task = Task(activity_id=activity.id, title="Incomplete Task", description="", status=TaskStatusEnum.pending)
        db.session.add(task)
        db.session.commit()
        task_id = str(task.id)

    set_token(monkeypatch, admin["clerk_id"])
    resp = client.post(
        f"/api/ratings/{task_id}/",
        json={"score": 4, "rated_user": target["id"]},
        headers=auth_header(),
    )
    assert resp.status_code == 400


def test_list_task_ratings(monkeypatch, client, app):
    admin = create_user(app, "clerk_rate_admin4", "Admin4", "admin4@ex.com", "admin4", role="admin")
    target = create_user(app, "clerk_rate_target4", "Target4", "target4@ex.com", "target4")
    task_id = create_completed_task(app, admin["id"])

    add_rating(client, monkeypatch, admin, task_id, target["id"], score=3)

    set_token(monkeypatch, admin["clerk_id"])
    resp = client.get(f"/api/ratings/{task_id}/", headers=auth_header())

    assert resp.status_code == 200
    body = resp.get_json()
    assert body["average_score"] == 3
    assert len(body["data"]) == 1


def test_user_ratings_self(monkeypatch, client, app):
    admin = create_user(app, "clerk_rate_admin5", "Admin5", "admin5@ex.com", "admin5", role="admin")
    target = create_user(app, "clerk_rate_target5", "Target5", "target5@ex.com", "target5")
    task_id = create_completed_task(app, admin["id"])

    add_rating(client, monkeypatch, admin, task_id, target["id"], score=4)

    set_token(monkeypatch, target["clerk_id"])
    resp = client.get(f"/api/ratings/user/{target['id']}/", headers=auth_header())
    assert resp.status_code == 200
    body = resp.get_json()
    assert body["average_score"] == 4


def test_delete_rating(monkeypatch, client, app):
    admin = create_user(app, "clerk_rate_admin6", "Admin6", "admin6@ex.com", "admin6", role="admin")
    target = create_user(app, "clerk_rate_target6", "Target6", "target6@ex.com", "target6")
    task_id = create_completed_task(app, admin["id"])

    resp = add_rating(client, monkeypatch, admin, task_id, target["id"])
    rating_id = resp.get_json()["data"]["rating_id"]

    set_token(monkeypatch, admin["clerk_id"])
    delete_resp = client.delete(f"/api/ratings/{rating_id}", headers=auth_header())
    assert delete_resp.status_code == 200

    with app.app_context():
        assert db.session.get(Rating, uuid.UUID(rating_id)) is None
