"""
Clerk token verification via the Clerk Backend SDK.

We verify session tokens by calling Clerk's `/sessions/{id}/verify` endpoint
using the official backend SDK. This avoids managing JWKS locally and ensures
the token is valid, not revoked, and issued for the current instance.
"""

from jose import jwt  # used only to read unverified claims for session id
from flask import current_app
from clerk_backend_sdk import Configuration, ApiClient, SessionsApi
from clerk_backend_sdk.models import VerifySessionRequest
from clerk_backend_sdk.exceptions import ApiException

_sessions_api = None


def _get_sessions_api() -> SessionsApi:
    """Create (or reuse) a Clerk SessionsApi client with the secret key."""
    global _sessions_api

    if _sessions_api is not None:
        return _sessions_api

    secret = current_app.config.get("CLERK_SECRET_KEY")
    if not secret:
        raise Exception("Clerk configuration missing: set CLERK_SECRET_KEY")

    configuration = Configuration()
    configuration.access_token = secret  # bearerAuth

    _sessions_api = SessionsApi(ApiClient(configuration))
    return _sessions_api


def verify_clerk_token(token: str) -> dict:
    """
    Verify a Clerk session token using Clerk's backend verification API.

    Returns a minimal payload with the Clerk user id (sub) and session id.
    Raises an Exception if verification fails.
    """

    # Read unverified claims only to get session id (sid)
    unverified_claims = jwt.get_unverified_claims(token)
    session_id = unverified_claims.get("sid")
    if not session_id:
        raise Exception("Invalid token payload: sid missing")

    sessions_api = _get_sessions_api()

    try:
        session = sessions_api.verify_session(
            session_id,
            VerifySessionRequest(token=token),
        )
    except ApiException as exc:  # from Clerk SDK
        raise Exception(f"Clerk verification failed: {exc}") from exc

    # Map to the shape expected by downstream callers
    return {
        "sub": session.user_id,
        "sid": session.id,
    }
