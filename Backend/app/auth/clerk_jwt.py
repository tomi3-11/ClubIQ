"""
Clerk token verification via Clerk's session verification endpoint (sync).

We avoid the async Clerk SDK because it requires a running event loop inside
Flask. Instead, we call the verify endpoint directly with `requests` using the
backend secret key.
"""

import requests
from jose import jwt  # used only to read unverified claims for session id
from flask import current_app


def verify_clerk_token(token: str) -> dict:
    """
    Verify a Clerk session token by calling Clerk's `/sessions/{id}/verify`.

    Returns minimal payload with Clerk user id (`sub`) and session id (`sid`).
    Raises Exception if verification fails.
    """

    secret = current_app.config.get("CLERK_SECRET_KEY")
    if not secret:
        raise Exception("Clerk configuration missing: set CLERK_SECRET_KEY")

    # Read unverified claims only to get session id (sid)
    unverified_claims = jwt.get_unverified_claims(token)
    session_id = unverified_claims.get("sid")
    if not session_id:
        raise Exception("Invalid token payload: sid missing")

    url = f"https://api.clerk.com/v1/sessions/{session_id}/verify"
    headers = {
        "Authorization": f"Bearer {secret}",
        "Content-Type": "application/json",
    }
    body = {"token": token}

    resp = requests.post(url, headers=headers, json=body, timeout=10)
    if not resp.ok:
        raise Exception(f"Clerk verification failed: {resp.status_code} {resp.text}")

    data = resp.json()
    return {
        "sub": data.get("user_id"),
        "sid": data.get("id"),
    }
