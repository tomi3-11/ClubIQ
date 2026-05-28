from uuid import UUID, uuid4
from datetime import datetime
from sqlalchemy import and_, func
from sqlalchemy.exc import IntegrityError
from app import db
from app.models import Rating, Task, User, TaskStatusEnum


def _parse_uuid(value):
    try:
        return UUID(str(value))
    except (ValueError, TypeError):
        return None


def _pagination(params):
    limit = params.get("limit")
    page = params.get("page")
    try:
        limit = min(int(limit), 100) if limit is not None else 10
    except ValueError:
        limit = 10
    try:
        page = max(int(page), 1) if page is not None else 1
    except ValueError:
        page = 1
    offset = (page - 1) * limit
    return limit, page, offset


def _date_filters(params, column):
    filters = []
    from_val = params.get("from")
    to_val = params.get("to")
    if from_val:
        try:
            filters.append(column >= datetime.fromisoformat(from_val))
        except ValueError:
            pass
    if to_val:
        try:
            filters.append(column <= datetime.fromisoformat(to_val))
        except ValueError:
            pass
    return filters


class RatingService:
    @staticmethod
    def create_rating(task_id, data, current_user):
        task_uuid = _parse_uuid(task_id)
        if not task_uuid:
            return {"success": False, "message": "Invalid task id"}, 400

        if not current_user:
            return {"success": False, "message": "User not synced"}, 403

        if current_user.role not in ["admin", "super_user"]:
            return {"success": False, "message": "Access forbidden"}, 403

        score = data.get("score")
        rated_user = data.get("rated_user")
        comments = data.get("comments")

        if score is None or rated_user is None:
            return {"success": False, "message": "Missing required fields"}, 400

        task = db.session.get(Task, task_uuid)
        if not task:
            return {"success": False, "message": "Task not found"}, 404

        if task.status != TaskStatusEnum.completed:
            return {"success": False, "message": "Cannot rate an incomplete task"}, 400

        rated_user_obj = db.session.get(User, rated_user)
        if not rated_user_obj:
            return {"success": False, "message": "Rated user not found"}, 404

        if Rating.query.filter_by(task_id=task_uuid, rated_by_id=current_user.id).first():
            return {"success": False, "message": "You have already rated this task"}, 400

        rating = Rating(
            id=uuid4(),
            task_id=task_uuid,
            rated_user_id=rated_user_obj.id,
            rated_by_id=current_user.id,
            score=score,
            comments=comments,
        )

        db.session.add(rating)
        try:
            db.session.commit()
        except IntegrityError as exc:
            db.session.rollback()
            return {"success": False, "message": "Rating creation failed", "error": str(exc.orig)}, 409
        except Exception as exc:
            db.session.rollback()
            return {"success": False, "message": "Rating creation failed", "error": str(exc)}, 500

        return {
            "success": True,
            "message": "Rating created successfully",
            "data": {
                "rating_id": str(rating.id),
                "task_id": str(rating.task_id),
                "rated_user": rating.rated_user_id,
                "score": rating.score,
            },
        }, 201

    @staticmethod
    def list_task_ratings(task_id, current_user, params):
        task_uuid = _parse_uuid(task_id)
        if not task_uuid:
            return {"success": False, "message": "Task not found"}, 404

        if not current_user:
            return {"success": False, "message": "User not synced"}, 403

        if current_user.role not in ["admin", "super_user", "club_manager"]:
            return {"success": False, "message": "Access forbidden"}, 403

        limit, page, offset = _pagination(params)
        filters = [Rating.task_id == task_uuid] + _date_filters(params, Rating.created_at)

        query = Rating.query.filter(and_(*filters))
        total = query.count()
        ratings = query.order_by(Rating.created_at.desc()).offset(offset).limit(limit).all()
        avg_score = db.session.query(func.avg(Rating.score)).filter(and_(*filters)).scalar()
        avg_score = round(avg_score, 2) if avg_score else None

        data = [RatingService._serialize_rating(r) for r in ratings]

        return {
            "success": True,
            "data": data,
            "average_score": avg_score,
            "pagination": {"page": page, "limit": limit, "total": total},
        }, 200

    @staticmethod
    def list_user_ratings(user_id, current_user, params):
        if not current_user:
            return {"success": False, "message": "User not synced"}, 403

        if current_user.role not in ["admin", "super_user"] and current_user.id != int(user_id):
            return {"success": False, "message": "Permission denied"}, 403

        limit, page, offset = _pagination(params)
        filters = [Rating.rated_user_id == user_id] + _date_filters(params, Rating.created_at)

        query = Rating.query.filter(and_(*filters))
        total = query.count()
        ratings = query.order_by(Rating.created_at.desc()).offset(offset).limit(limit).all()
        avg_score = db.session.query(func.avg(Rating.score)).filter(and_(*filters)).scalar()
        avg_score = round(avg_score, 2) if avg_score else None

        data = [
            {
                "id": str(r.id),
                "task_id": str(r.task_id),
                "score": r.score,
                "comments": r.comments,
                "rated_by": r.rated_by_id,
                "created_at": r.created_at.isoformat(),
            }
            for r in ratings
        ]

        return {
            "success": True,
            "data": data,
            "average_score": avg_score,
            "pagination": {"page": page, "limit": limit, "total": total},
        }, 200

    @staticmethod
    def delete_rating(rating_id):
        rating_uuid = _parse_uuid(rating_id)
        if not rating_uuid:
            return {"success": False, "message": "Rating not found"}, 404

        rating = db.session.get(Rating, rating_uuid)
        if not rating:
            return {"success": False, "message": "Rating not found"}, 404

        db.session.delete(rating)
        try:
            db.session.commit()
        except IntegrityError as exc:
            db.session.rollback()
            return {"success": False, "message": "Rating deletion failed", "error": str(exc.orig)}, 409
        except Exception as exc:
            db.session.rollback()
            return {"success": False, "message": "Rating deletion failed", "error": str(exc)}, 500

        return {"success": True, "message": "Rating deleted successfully"}, 200

    @staticmethod
    def _serialize_rating(rating: Rating):
        return {
            "id": str(rating.id),
            "task_id": str(rating.task_id),
            "rated_user": rating.rated_user_id,
            "rated_by": rating.rated_by_id,
            "score": rating.score,
            "comments": rating.comments,
            "created_at": rating.created_at.isoformat() if rating.created_at else None,
        }
