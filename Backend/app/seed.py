from app import create_app, db
from app.models import Member


def seed_data():
    if Member.query.count() == 0:
        print("Seeding initial members...")
        members = [
            Member(name="Admin User", email="admin@clubiq.com", role="admin"),
            Member(name="Alice Johnson", email="alice@clubiq.com", role="member"),
            Member(name="Brian Kim", email="brian@clubiq.com", role="member"),
            Member(name="Cynthia Wanjiru", email="cynthia@clubiq.com", role="member"),
            Member(name="David Otieno", email="david@clubiq.com", role="member"),
        ]
        db.session.add_all(members)
        db.session.commit()
    else:
        print("Members already seeded.")


if __name__ == "__main__":
    app = create_app()
    with app.app_context():
        seed_data()
