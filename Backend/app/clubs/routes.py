from flask import jsonify, request
from flask_restful import Resource, Api
from flask_jwt_extended import jwt_required, get_jwt_identity

from app import db
from app.models import Club, Club_member, User
from app.clubs import clubs_bp

api = Api(clubs_bp)


class ClubResource(Resource):
    @jwt_required()
    def get(self, club_id):
        club = Club.query.get_or_404(club_id)
        creator = User.query.get(club.created_by)
        return {
            "id": str(club.id),
            "name": club.name,
            "description": club.description,
            "created_by": creator.username if creator else None,
            "created_at": club.created_at.isoformat() if club.created_at else None,
            "updated_at": club.updated_at.isoformat() if club.updated_at else None,
        }, 200

    @jwt_required()
    def put(self, club_id):
        club = Club.query.get_or_404(club_id)
        user_id = get_jwt_identity()
        data = request.get_json()

        if not data:
            return {"error": "Missing JSON body"}, 400

        # Check if user is the creator or has admin privileges
        user = User.query.get(user_id)
        if not user:
            return {"error": "User not found"}, 404

        if club.created_by != user_id and user.role not in ['admin', 'super_user']:
            return {"error": "Access forbidden: Insufficient permissions"}, 403

        # Update fields if they are in the request
        if 'name' in data:
            # Check if name is unique (excluding current club)
            existing_club = Club.query.filter(Club.name == data['name'], Club.id != club.id).first()
            if existing_club:
                return {"error": "Club name already exists"}, 400
            club.name = data['name']

        if 'description' in data:
            club.description = data['description']

        db.session.commit()

        creator = User.query.get(club.created_by)
        return {
            "message": "Club updated successfully",
            "id": str(club.id),
            "name": club.name,
            "description": club.description,
            "created_by": creator.username if creator else None,
            "updated_at": club.updated_at.isoformat() if club.updated_at else None,
        }, 200

    @jwt_required()
    def delete(self, club_id):
        club = Club.query.get_or_404(club_id)
        user_id = get_jwt_identity()

        # Check if user is the creator or has admin privileges
        user = User.query.get(user_id)
        if not user:
            return {"error": "User not found"}, 404

        if club.created_by != user_id and user.role not in ['admin', 'super_user']:
            return {"error": "Access forbidden: Insufficient permissions"}, 403

        db.session.delete(club)
        db.session.commit()
        return {
            "message": "Club deleted successfully"
        }, 200


class ClubListResource(Resource):
    @jwt_required()
    def get(self):
        clubs = Club.query.all()
        clubs_data = []
        for club in clubs:
            creator = User.query.get(club.created_by)
            clubs_data.append({
                "id": str(club.id),
                "name": club.name,
                "description": club.description,
                "created_by": creator.username if creator else None,
                "created_at": club.created_at.isoformat() if club.created_at else None,
                "updated_at": club.updated_at.isoformat() if club.updated_at else None,
            })
        return clubs_data, 200

    @jwt_required()
    def post(self):
        data = request.get_json()
        if not data:
            return {"error": "Missing JSON body"}, 400

        # Basic validation
        if 'name' not in data or not data['name']:
            return {"error": "Missing required field: name"}, 400

        # Check if club name already exists
        existing_club = Club.query.filter_by(name=data['name']).first()
        if existing_club:
            return {"error": "Club name already exists"}, 400

        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        if not user:
            return {"error": "User not found"}, 404

        new_club = Club(
            name=data['name'],
            description=data.get('description'),
            created_by=user_id
        )

        db.session.add(new_club)
        db.session.flush()  # Flush to get the club ID without committing

        # Automatically add creator as a club member with 'admin' role
        club_member = Club_member(
            club_id=new_club.id,
            user_id=user_id,
            role='admin'  # Creator becomes admin of the club
        )

        db.session.add(club_member)
        db.session.commit()

        creator = User.query.get(new_club.created_by)
        return {
            "message": "Club created successfully",
            "id": str(new_club.id),
            "name": new_club.name,
            "description": new_club.description,
            "created_by": creator.username if creator else None,
            "created_at": new_club.created_at.isoformat() if new_club.created_at else None,
        }, 201

api.add_resource(ClubListResource, '/')
api.add_resource(ClubResource, '/<string:club_id>')

