"""
Clerk JWT verification utility

This module provides functions to:
- Fetch Clerk JWKS (public keys)
- verify JWTs issued by Clerk
"""

import requests
from jose import jwt
from flask import current_app

# Clerk JWK url (contains public keys to verify tokens)
CLERK_JWKS_URL = "https://api.clerk.dev/v1/jwks"

# Cache JWKS to avoid repeated requests 
_cached_jwks = None

def get_jwks():
    """
    Fetch the JWKS (JSON Web Key Set) from Clerk or return Cached keys
    """
    global _cached_jwks
    if _cached_jwks is None:
        response = requests.get(CLERK_JWKS_URL)
        response.raise_for_status()
        _cached_jwks = response.json()
    return _cached_jwks


def verify_clerk_token(token: str) -> dict:
    """
    Verify a Clerk JWK using RS256 and return the payload.
    
    Args:
        token (str): JWT from Authorization header.
        
    Returns:
        dict: Decoded payload containing at least 'sub' (clerk_id).
        
    Raises:
        Exception: If token is invalid or verification fails.
    """
    jwks = get_jwks()
    unverified_header = jwt.get_unverified_header(token)
    
    # Find the matching key by 'kid'
    rsa_key = {}
    for key in jwks["keys"]:
        if key["kid"] == unverified_header["kid"]:
            rsa_key = key
            break
        
    if not rsa_key:
        raise Exception("Invalid token key")
    
    # Decode and verify token 
    payload = jwt.decode(
        token,
        rsa_key,
        algorithms=["RS256"],
        audience=current_app.config.get("CLERK_FRONTEND_API"),
        issuer=current_app.config.get("CLERK_ISSUER"),
    )
    
    return payload
