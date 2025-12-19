from flask import Blueprint, request, jsonify
from flask.views import MethodView
from functools import wraps
from sqlalchemy import func, and_
from app import db
from app.models import Rating, Task, User
import uuid
from datetime import datetime
from flask_jwt_extended import jwt_required, get_jwt_identity

ratings_bp = Blueprint('ratings', __name__, url_prefix='/api/ratings')


def roles_required(*allowed_roles):
    """Role-based access decorator with JWT."""
    def decorator(func):
        @wraps(func)
        @jwt_required()
        def wrapper(*args, **kwargs):
            user_id = get_jwt_identity()
            current_user = User.query.get(user_id)
            if not current_user:
                return jsonify({"success": False, "message": "User not found"}), 404

            # Superuser bypass
            if current_user.role == 'super_user':
                return func(*args, **kwargs)

            if current_user.role not in allowed_roles:
                return jsonify({
                    "success": False,
                    "message": f"Access forbidden: '{current_user.role}' not allowed",
                    "required_roles": allowed_roles
                }), 403

            return func(*args, **kwargs)
        return wrapper
    return decorator



class RatingAPI(MethodView):
    """POST/GET ratings for a specific task."""

    @roles_required('admin', 'super_user')
    def post(self, id):
        """Create a rating for a completed task."""
        data = request.get_json() or {}
        score = data.get('score')
        comments = data.get('comments')
        rated_user = data.get('rated_user')

        if not all([score, rated_user]):
            return jsonify({"success": False, "message": "Missing required fields"}), 400

        task = Task.query.get(id)
        if not task:
            return jsonify({"success": False, "message": "Task not found"}), 404

        if task.status != 'completed':
            return jsonify({"success": False, "message": "Cannot rate an incomplete task"}), 400

        current_user = User.query.get(get_jwt_identity())

        # Prevent duplicate rating
        if Rating.query.filter_by(task_id=id, rated_by=current_user.id).first():
            return jsonify({"success": False, "message": "You have already rated this task"}), 400

        rating = Rating(
            id=uuid.uuid4(),
            task_id=id,
            rated_user=rated_user,
            rated_by=current_user.id,
            score=score,
            comments=comments
        )

        db.session.add(rating)
        db.session.commit()

        return jsonify({
            "success": True,
            "message": "Rating created successfully",
            "data": {
                "rating_id": str(rating.id),
                "task_id": str(rating.task_id),
                "rated_user": rating.rated_user,
                "score": rating.score
            }
        }), 201

    @roles_required('club_manager', 'admin')
    def get(self, id):
        """Fetch ratings for a task."""
        limit = min(int(request.args.get('limit', 10)), 100)
        page = max(int(request.args.get('page', 1)), 1)
        offset = (page - 1) * limit

        from_date = request.args.get('from')
        to_date = request.args.get('to')

        filters = [Rating.task_id == id]
        if from_date:
            filters.append(Rating.created_at >= datetime.fromisoformat(from_date))
        if to_date:
            filters.append(Rating.created_at <= datetime.fromisoformat(to_date))

        query = Rating.query.filter(and_(*filters))
        total = query.count()
        ratings = query.order_by(Rating.created_at.desc()).offset(offset).limit(limit).all()
        avg_score = db.session.query(func.avg(Rating.score)).filter(and_(*filters)).scalar()
        avg_score = round(avg_score, 2) if avg_score else None

        data = [{
            "id": str(r.id),
            "rated_user": r.rated_user,
            "rated_by": r.rated_by,
            "score": r.score,
            "comments": r.comments,
            "created_at": r.created_at.isoformat()
        } for r in ratings]

        return jsonify({
            "success": True,
            "data": data,
            "average_score": avg_score,
            "pagination": {"page": page, "limit": limit, "total": total}
        }), 200



class UserRatingAPI(MethodView):
    """GET ratings for a specific user."""

    @roles_required('admin', 'user', 'club_manager')
    def get(self, id):
        current_user = User.query.get(get_jwt_identity())
        if current_user.role != 'admin' and current_user.id != int(id):
            return jsonify({"success": False, "message": "Permission denied"}), 403

        limit = min(int(request.args.get('limit', 10)), 100)
        page = max(int(request.args.get('page', 1)), 1)
        offset = (page - 1) * limit

        from_date = request.args.get('from')
        to_date = request.args.get('to')

        filters = [Rating.rated_user == id]
        if from_date:
            filters.append(Rating.created_at >= datetime.fromisoformat(from_date))
        if to_date:
            filters.append(Rating.created_at <= datetime.fromisoformat(to_date))

        query = Rating.query.filter(and_(*filters))
        total = query.count()
        ratings = query.order_by(Rating.created_at.desc()).offset(offset).limit(limit).all()
        avg_score = db.session.query(func.avg(Rating.score)).filter(and_(*filters)).scalar()
        avg_score = round(avg_score, 2) if avg_score else None

        data = [{
            "id": str(r.id),
            "task_id": str(r.task_id),
            "score": r.score,
            "comments": r.comments,
            "rated_by": r.rated_by,
            "created_at": r.created_at.isoformat()
        } for r in ratings]

        return jsonify({
            "success": True,
            "data": data,
            "average_score": avg_score,
            "pagination": {"page": page, "limit": limit, "total": total}
        }), 200



class RatingDeleteAPI(MethodView):
    """Admin-only endpoint to delete a rating."""

    @roles_required('admin')
    def delete(self, id):
        rating = Rating.query.get(id)
        if not rating:
            return jsonify({"success": False, "message": "Rating not found"}), 404

        db.session.delete(rating)
        db.session.commit()
        return jsonify({"success": True, "message": "Rating deleted successfully"}), 200



rating_view = RatingAPI.as_view('ratings_api')
user_rating_view = UserRatingAPI.as_view('user_ratings_api')
rating_delete_view = RatingDeleteAPI.as_view('rating_delete_api')

ratings_bp.add_url_rule('/tasks/<uuid:id>/ratings', view_func=rating_view, methods=['POST', 'GET'])
ratings_bp.add_url_rule('/users/<int:id>/ratings', view_func=user_rating_view, methods=['GET'])
ratings_bp.add_url_rule('/ratings/<uuid:id>', view_func=rating_delete_view, methods=['DELETE'])
