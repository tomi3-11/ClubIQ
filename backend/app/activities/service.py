from uuid import UUID
from sqlalchemy.exc import IntegrityError
from app import db
from app.models import Activity, Club, User


def _parse_uuid(value):
    try:
        return UUID(str(value))
    except (ValueError, TypeError):
        return None

class ActivityService:
    # Removes author, to be implemented Some other time
    
    @staticmethod
    def create_activity(data, current_user):
        title = data.get("title")
        description = data.get("description")
        club_id = data.get("club_id")

        if not title:
            return {"message": "Title is required"}, 400
        if not club_id:
            return {"message": "club_id is required"}, 400

        club_uuid = _parse_uuid(club_id)
        if not club_uuid:
            return {"message": "Invalid club_id"}, 400

        club = db.session.get(Club, club_uuid)
        if not club:
            return {"message": "Club not found"}, 404

        if not current_user:
            return {"message": "User not synced"}, 403

        if current_user.role not in ["admin", "super_user"] and club.created_by != current_user.id:
            return {"message": "Access forbidden: Insufficient permissions"}, 403

        if Activity.query.filter_by(title=title, club_id=club.id).first():
            return {"message": "Activity already exists for this club"}, 400

        activity = Activity(
            title=title,
            description=description,
            club_id=club.id,
            author_id=current_user.id,
        )

        db.session.add(activity)

        try:
            db.session.commit()
        except IntegrityError as exc:
            db.session.rollback()
            return {"message": "Activity creation failed", "error": str(exc.orig)}, 409
        except Exception as exc:
            db.session.rollback()
            return {"message": "Activity creation failed", "error": str(exc)}, 500

        return {
            "message": "Activity created successfully",
            "Details": ActivityService._serialize(activity)
        }, 201
        
        
    @staticmethod
    def list_activities(club_id):
        club_uuid = _parse_uuid(club_id)
        if not club_uuid:
            return {"message": "Club not found"}, 404

        club = db.session.get(Club, club_uuid)
        if not club:
            return {"message": "Club not found"}, 404

        activities = (
            Activity.query.filter_by(club_id=club.id)
            .order_by(Activity.created_at.desc())
            .all()
        )

        return [ActivityService._serialize(a) for a in activities], 200
        
        
    @staticmethod
    def _serialize(activity):
        return {
            "id": str(activity.id), 
            "club_id": str(activity.club_id) if activity.club_id else None,
            "title": activity.title,
            "description": activity.description,
            "created_by": activity.author.username if activity.author else None,
            "created_at": activity.created_at.isoformat() if activity.created_at else None,
            "start_date": activity.start_date.isoformat() if activity.start_date else None,
        }
        
        
        