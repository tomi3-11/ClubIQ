from uuid import UUID
from flask import abort
from sqlalchemy import or_
from sqlalchemy.exc import IntegrityError
from app import db
from app.models import Club, ClubMember, User


class ClubService:
    @staticmethod
    def _club_to_dict(club):
        creator = db.session.get(User, club.created_by)
        return {
            "id": str(club.id),
            "name": club.name,
            "description": club.description,
            "created_by": creator.username if creator else None,
            "created_at": club.created_at.isoformat() if club.created_at else None,
            "updated_at": club.updated_at.isoformat() if club.updated_at else None,
        }

    @staticmethod
    def _get_club_or_404(club_id):
        try:
            club_uuid = UUID(str(club_id))
        except ValueError:
            abort(404)

        club = db.session.get(Club, club_uuid)
        if not club:
            abort(404)
        return club

    @staticmethod
    def get_club(club_id):
        club = ClubService._get_club_or_404(club_id)
        return ClubService._club_to_dict(club), 200

    @staticmethod
    def list_clubs(user, mine: bool = False):
        """List clubs. If mine=true and caller is not admin/super_user, limit to memberships/created."""
        if mine and user.role not in ["admin", "super_user"]:
            clubs = (
                Club.query.join(ClubMember, ClubMember.club_id == Club.id, isouter=True)
                .filter(or_(Club.created_by == user.id, ClubMember.user_id == user.id))
                .distinct()
                .all()
            )
        else:
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
        club = ClubService._get_club_or_404(club_id)

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
        club = ClubService._get_club_or_404(club_id)

        if club.created_by != user.id and user.role not in ["admin", "super_user"]:
            return {"error": "Access forbidden: Insufficient permissions"}, 403

        # Remove memberships to avoid FK conflicts before deleting the club
        ClubMember.query.filter_by(club_id=club.id).delete()
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
