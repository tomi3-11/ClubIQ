# Invitations API

Endpoints under `/api/invitations`. All requests require `Authorization: Bearer <Clerk session token>` and the caller must be synced (`g.current_user`).

## Roles & Access
- Admin / Super User: can create, list, fetch, and delete/accept (accept only if email matches) for any club invitation.
- Club Creator: can create and list invitations for clubs they created; can fetch invitations they issued; cannot see others' invitations.
- Invitee: can fetch an invitation addressed to their email (via id) and accept it using the token endpoint.

## Status Values
`pending`, `in_progress`, `accepted` (enum `InvitationStatusEnum`). Tokens expire when `expires_at < now (UTC)`.

## Endpoints
| # | Method | Path | Description | Roles |
|---|--------|------|-------------|-------|
| 1 | POST | `/` | Create an invitation for a club member | admin, super_user, club creator |
| 2 | GET | `/` | List invitations (filtered by status, scoped to inviter unless admin/super_user) | admin, super_user, inviter |
| 3 | GET | `/<invite_id>` | Fetch a single invitation | admin, super_user, inviter, or invitee (email match) |
| 4 | POST | `/<token>/accept` | Accept invitation and join club | invitee only (email match) |

> Note: Paths above are relative to the blueprint prefix `/api/invitations`.

## Common Query Params
- `status` (optional, enum): filter list by `pending`, `in_progress`, `accepted`.

## 1) Create invitation
`POST /api/invitations/`

Body:
```json
{
  "email": "invitee@example.com",
  "club_id": "a7c72fce-30c6-4d54-8c4f-9a2d9c0b8e27",
  "expires_at": "2026-02-01T12:00:00"  // optional ISO-8601
}
```
Rules:
- Caller must be admin/super_user or the creator of the club.
- `club_id` must be a valid club; `email` required.
- `expires_at` must be ISO-8601 if provided.

Success 201:
```json
{
  "message": "Invitation created",
  "invitation": {
    "id": "1e2f8a6a-dde4-4b8f-a5d8-6d2f3a4b1f3a",
    "email": "invitee@example.com",
    "club_id": "a7c72fce-30c6-4d54-8c4f-9a2d9c0b8e27",
    "invited_by": 1,
    "token": "<token>",
    "status": "pending",
    "created_at": "2026-01-02T09:00:00+00:00",
    "expires_at": "2026-02-01T12:00:00"
  }
}
```
Error highlights: 400 invalid/missing fields or bad `expires_at`; 403 forbidden/unsynced; 404 club not found; 409 on DB constraint failures.

## 2) List invitations
`GET /api/invitations/?status=pending`

- Admin/Super User: sees all invitations.
- Others: only invitations they issued (`invited_by` = current user id).

Success 200:
```json
[
  {
    "id": "1e2f8a6a-dde4-4b8f-a5d8-6d2f3a4b1f3a",
    "email": "invitee@example.com",
    "club_id": "a7c72fce-30c6-4d54-8c4f-9a2d9c0b8e27",
    "invited_by": 1,
    "token": "<token>",
    "status": "pending",
    "created_at": "2026-01-02T09:00:00+00:00",
    "expires_at": "2026-02-01T12:00:00"
  }
]
```

## 3) Get invitation by id
`GET /api/invitations/<invite_id>`

- Allowed if caller is admin/super_user, the inviter, or the invitee (email match).

Success 200:
```json
{
  "id": "1e2f8a6a-dde4-4b8f-a5d8-6d2f3a4b1f3a",
  "email": "invitee@example.com",
  "club_id": "a7c72fce-30c6-4d54-8c4f-9a2d9c0b8e27",
  "invited_by": 1,
  "token": "<token>",
  "status": "pending",
  "created_at": "2026-01-02T09:00:00+00:00",
  "expires_at": "2026-02-01T12:00:00"
}
```

## 4) Accept invitation
`POST /api/invitations/<token>/accept`

- Caller must be the invitee (token email must match caller email).
- Invitation must be `pending` and not expired; club must still exist.

Success 200:
```json
{
  "message": "Successfully joined the club",
  "membership": {
    "club_id": "a7c72fce-30c6-4d54-8c4f-9a2d9c0b8e27",
    "user_id": 5,
    "role": "member"
  }
}
```

Error highlights: 400 invalid/expired token or already used; 403 wrong user; 404 club not found; 409/500 DB errors.

## Notes
- Tokens are URL-safe strings; store client-side as-is.
- Email delivery failures are logged but do not block invitation creation (API still returns 201).
- All dates use UTC.

## Status Codes Quick Reference
- 200: read/accept success
- 201: created
- 400: bad input/invalid token/duplicate member
- 403: auth/role/email mismatch/unsynced user
- 404: not found (club/invitation)
- 409: DB constraint issues
- 500: unexpected server error
