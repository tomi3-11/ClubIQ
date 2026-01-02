from sqlalchemy.exc import IntegrityError
from app import db
from app.models import Club, ClubMember, User


class ClubService:
    @staticmethod
    def _club_to_dict(club):
        creator = User.query.get(club.created_by)
        return {
            "id": str(club.id),
            "name": club.name,
            "description": club.description,
            "created_by": creator.username if creator else None,
            "created_at": club.created_at.isoformat() if club.created_at else None,
            "updated_at": club.updated_at.isoformat() if club.updated_at else None,
        }

    @staticmethod
    def get_club(club_id):
        club = Club.query.get_or_404(club_id)
        return ClubService._club_to_dict(club), 200

    @staticmethod
    def list_clubs():
        clubs = Club.query.all()
        return [ClubService._club_to_dict(club) for club in clubs], 200

    @staticmethod
    def create_club(data, user):
        if not data.get("name"):
            return {"error": "Missing required field: name"}, 400

        existing_club = Club.query.filter_by(name=data["name"]).first()
        if existing_club:
            return {"error": "Club name already exists"}, 400

        new_club = Club(
            name=data["name"],
            description=data.get("description"),
            created_by=user.id,
        )

        db.session.add(new_club)
        db.session.flush()

        club_member = ClubMember(
            club_id=new_club.id,
            user_id=user.id,
            role="admin",
        )

        db.session.add(club_member)

        try:
            db.session.commit()
        except IntegrityError as exc:
            db.session.rollback()
            return {"error": "Club creation failed", "details": str(exc.orig)}, 409
        except Exception as exc:
            db.session.rollback()
            return {"error": "Club creation failed", "details": str(exc)}, 500

        return {
            "message": "Club created successfully",
            **ClubService._club_to_dict(new_club),
        }, 201

    @staticmethod
    def update_club(club_id, data, user):
        club = Club.query.get_or_404(club_id)

        if club.created_by != user.id and user.role not in ["admin", "super_user"]:
            return {"error": "Access forbidden: Insufficient permissions"}, 403

        if "name" in data:
            existing_club = Club.query.filter(Club.name == data["name"], Club.id != club.id).first()
            if existing_club:
                return {"error": "Club name already exists"}, 400
            club.name = data["name"]

        if "description" in data:
            club.description = data["description"]

        try:
            db.session.commit()
        except IntegrityError as exc:
            db.session.rollback()
            return {"error": "Club update failed", "details": str(exc.orig)}, 409
        except Exception as exc:
            db.session.rollback()
            return {"error": "Club update failed", "details": str(exc)}, 500

        return {
            "message": "Club updated successfully",
            **ClubService._club_to_dict(club),
        }, 200

    @staticmethod
    def delete_club(club_id, user):
        club = Club.query.get_or_404(club_id)

        if club.created_by != user.id and user.role not in ["admin", "super_user"]:
            return {"error": "Access forbidden: Insufficient permissions"}, 403

        db.session.delete(club)

        try:
            db.session.commit()
        except IntegrityError as exc:
            db.session.rollback()
            return {"error": "Club deletion failed", "details": str(exc.orig)}, 409
        except Exception as exc:
            db.session.rollback()
            return {"error": "Club deletion failed", "details": str(exc)}, 500

        return {"message": "Club deleted successfully"}, 200
