"""
Clerk token verification using local JWKS validation (networkless).

We verify RS256 tokens locally with Clerk's JWKS, enforcing issuer and audience
from config. This aligns with Clerk's recommended networkless verification for
short-lived session tokens.
"""

import time
import requests
from jose import jwt
from flask import current_app

# Default Clerk JWKS endpoint; override via config if needed
DEFAULT_CLERK_JWKS_URL = "https://api.clerk.dev/v1/jwks"

_cached_jwks = None
_cached_jwks_fetched_at = 0.0
_JWKS_TTL_SECONDS = 60 * 60  # 1 hour


def _get_jwks():
    """Fetch Clerk JWKS with a simple TTL cache."""
    global _cached_jwks, _cached_jwks_fetched_at

    now = time.time()
    if _cached_jwks and now - _cached_jwks_fetched_at < _JWKS_TTL_SECONDS:
        return _cached_jwks

    jwks_url = current_app.config.get("CLERK_JWKS_URL") or DEFAULT_CLERK_JWKS_URL
    resp = requests.get(jwks_url, timeout=5)
    resp.raise_for_status()
    _cached_jwks = resp.json()
    _cached_jwks_fetched_at = now
    return _cached_jwks


def verify_clerk_token(token: str) -> dict:
    """
    Verify a Clerk JWT locally using JWKS.

    Returns payload (at least contains `sub`). Raises Exception if verification fails.
    """

    audience = current_app.config.get("CLERK_FRONTEND_API") or current_app.config.get("CLERK_AUDIENCE")
    issuer = current_app.config.get("CLERK_ISSUER")
    if not audience or not issuer:
        raise Exception("Clerk configuration missing: set CLERK_FRONTEND_API (or CLERK_AUDIENCE) and CLERK_ISSUER")

    jwks = _get_jwks()

    unverified_header = jwt.get_unverified_header(token)
    kid = unverified_header.get("kid")
    rsa_key = next((key for key in jwks.get("keys", []) if key.get("kid") == kid), None)
    if not rsa_key:
        raise Exception("Invalid token key (kid not found in JWKS)")

    payload = jwt.decode(
        token,
        rsa_key,
        algorithms=["RS256"],
        audience=audience,
        issuer=issuer,
    )

    return payload
