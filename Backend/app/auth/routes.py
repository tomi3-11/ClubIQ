from flask import Blueprint, jsonify, request
import requests
import jwt
from functools import wraps
import time
import os

CLERK_SECRET_KEY = os.environ.get('CLERK_SECRET_KEY')
CLERK_JWKS_URL = os.environ.get('CLERK_JWKS_URL')
CLERK_AUDIENCE = os.environ.get('CLERK_AUDIENCE') 

auth_bp = Blueprint("auth", __name__, url_prefix="/api")

_jwks_cache = {"keys": None, "last_fetched": 0}
JWKS_CACHE_TTL = 3600  # Cache keys for 1 hour

def get_cached_jwks():
    """Fetch JWKS from Clerk or return cached version."""
    current_time = time.time()
    if _jwks_cache["keys"] is None or (current_time - _jwks_cache["last_fetched"]) > JWKS_CACHE_TTL:
        response = requests.get(CLERK_JWKS_URL)
        if response.status_code != 200:
            raise Exception("Failed to fetch Clerk JWKS keys")
        _jwks_cache["keys"] = response.json()["keys"]
        _jwks_cache["last_fetched"] = current_time
    return _jwks_cache["keys"]


def verify_clerk_token(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        auth_header = request.headers.get("Authorization")
        if not auth_header or not auth_header.startswith("Bearer "):
            return jsonify({"message": "Missing or invalid Authorization header"}), 401

        token = auth_header.split(" ")[1]

        try:
            # Load JWKS keys (cached)
            jwks_keys = get_cached_jwks()
            public_key = jwt.algorithms.RSAAlgorithm.from_jwk(jwks_keys[0])

            # Decode token
            decoded = jwt.decode(
                token,
                public_key,
                algorithms=["RS256"],
                audience=CLERK_AUDIENCE,
            )

            # Attach user info to the request
            request.user = decoded

        except jwt.ExpiredSignatureError:
            return jsonify({"message": "Token expired"}), 401
        except jwt.InvalidTokenError as e:
            return jsonify({"message": "Invalid token", "error": str(e)}), 401
        except Exception as e:
            return jsonify({"message": "Token verification failed", "error": str(e)}), 401

        return f(*args, **kwargs)

    return decorated_function

@auth_bp.route("/test", methods=["GET", "POST"])
def test():
    return jsonify({"message": "Auth routes working!"}), 200

@auth_bp.route("/protected", methods=["GET"])
@verify_clerk_token
def protected():
    return jsonify({
        "message": "Access granted to protected route ",
        "user": request.user
    }), 200

@auth_bp.route("/profile", methods=["GET"])
# @verify_clerk_token
def profile():
    """Example route that returns only key user info."""
    user_info = request.user
    return jsonify({
        "id": user_info.get("sub"),
        "email": user_info.get("email_address"),
        "name": user_info.get("name"),
        "aud": user_info.get("aud"),
    }), 200
    


@auth_bp.route("/sync", methods=["POST"])
# @verify_clerk_token
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

        user_id = data.get("id")
        email = data.get("email")
        username = data.get("username")
        # last_name = data.get("last_name")
        print("reached")

        # Example logic (you can later integrate with your DB here)
        synced_user = {
            "clerk_user_id": user_id,
            "email": email,
            "username": username,
            # "last_name": last_name,
            "verified_via": "Clerk"
        }

        return jsonify({
            "message": "User synced successfully",
            "user": synced_user,
        }), 200

    except Exception as e:
        return jsonify({"message": "Error syncing user", "error": str(e)}), 500
