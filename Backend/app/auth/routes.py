from flask import Blueprint, jsonify, request
import requests
import jwt
from functools import wraps
import time
import os
from app.models import Club_member
from app import db

auth_bp = Blueprint("auth", __name__, url_prefix="/api")

@auth_bp.route("/sync", methods=["POST"])
def sync_user():
    """
    Synchronize Clerk-authenticated user data with the backend.
    Expected payload from frontend:
    {
        "id": "user_abc123",
        "email": "example@mail.com",
        "first_name": "John",
        "last_name": "Doe"
    }
    """
    try:
        data = request.get_json()

        if not data:
            return jsonify({"message": "No user data provided"}), 400

        clerk_id = data.get("clerk_id")
        email = data.get("email")
        username = data.get("username")
        print("reached")
        
        if not clerk_id or not email:
            return jsonify({
                "message": "Missing required fields"
            }), 400
            
        # Check if User exists
        existing_user = Club_member.query.filter_by(clerk_user_id=clerk_id).first()
        
        if existing_user:
            # Update user info
            existing_user.email = email
            existing_user.username = username
            db.session.commit()
            
            return jsonify({
                "message": "User updated successfully",
                "user": {
                    "clerk_user_id": existing_user.clerk_user_id,
                    "email": existing_user.email,
                    "username": existing_user.username,
                    "verified_via": existing_user.verified_via
                }
            })
        
        new_user = Club_member(
            clerk_user_id=clerk_id,
            email=email,
            username=username,
            verified_via="Clerk"
        )

        # Adding user credencials to the database 
        db.session.add(new_user)
        db.session.commit()
        
        
        return jsonify({
            "message": "User synced successfully",
            "user": {
                "clerk_user_id": new_user.clerk_user_id,
                "email": new_user.email,
                "username": new_user.username,
                "verified_via": new_user.verified_via
            }
        }), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({"message": "Error syncing user", "error": str(e)}), 500
