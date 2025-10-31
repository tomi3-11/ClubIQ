from flask import Blueprint, jsonify, request
import requests
import jwt
from functools import wraps

auth_bp = Blueprint("auth", __name__, url_prefix="/api")

CLERK_JWKS_URL = "https://api.clerk.dev/v1/jwks"
CLERK_AUDIENCE = "your-clerk-audience-id" 

def verify_clerk_token(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        auth_header = request.headers.get("Authorization")
        if not auth_header or not auth_header.startswith("Bearer "):
            return jsonify({"message": "Missing or invalid token"}), 401

        token = auth_header.split(" ")[1]

        try:
            jwks = requests.get(CLERK_JWKS_URL).json()
            public_key = jwt.algorithms.RSAAlgorithm.from_jwk(jwks["keys"][0])
            decoded = jwt.decode(
                token,
                public_key,
                algorithms=["RS256"],
                audience=CLERK_AUDIENCE,
            )
            request.user = decoded
        except Exception as e:
            return jsonify({"message": "Token verification failed", "error": str(e)}), 401

        return f(*args, **kwargs)
    return decorated_function


@auth_bp.route("/protected", methods=["GET"])
@verify_clerk_token
def protected():
    return jsonify({
        "message": "Access granted to protected route!",
        "user": request.user,
    })
