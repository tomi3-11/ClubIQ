# Activities API

Base URL: `/api/activities/`

Auth
- All endpoints require a valid Clerk session token.
- Header: `Authorization: Bearer <Clerk session token>`
- Content-Type: `application/json` for bodies.

IDs
- `club_id` is a UUID (string in routes).
- `activity_id` is a UUID (internal; not exposed in current routes except in responses).

Permissions
- Create: club creator or roles `admin`/`super_user`.
- List: any authenticated, synced user.
- `auth_required` populates `g.current_user`; permissions are enforced in the service.

## Endpoints at a glance

| # | Endpoint | Method | Description | Auth | Notes |
|---|----------|--------|-------------|------|-------|
| 1 | `/create/` | POST | Create an activity | Required | Creator/admin/super_user only. Title+club_id required. |
| 2 | `/<club_id>/` | GET | List activities for a club | Required | Ordered by `created_at` desc. |

## Create activity
`POST /api/activities/create/`

Request body
```json
{
  "title": "Movie Night",
  "description": "Watch films together",
  "club_id": "e58b9984-ebfc-4308-9223-69944ece8c09"
}
```

Rules
- `title` and `club_id` are required.
- Caller must be club creator or have role `admin`/`super_user`.
- Duplicate titles per club are rejected (400).

Responses
- `201 Created`: success with activity payload
- `400 Bad Request`: missing fields, invalid `club_id`, or duplicate title
- `403 Forbidden`: insufficient permissions or unsynced user
- `404 Not Found`: club not found
- `409/500`: DB errors

Example success
```json
{
  "message": "Activity created successfully",
  "Details": {
    "id": "d7f9c3b4-...",
    "club_id": "e58b9984-ebfc-4308-9223-69944ece8c09",
    "title": "Movie Night",
    "description": "Watch films together",
    "created_by": "creator_username",
    "created_at": "2026-01-02T19:20:00Z",
    "start_date": null
  }
}
```

## List activities for a club
`GET /api/activities/<club_id>/`

Behavior
- Validates `club_id` (UUID) and ensures club exists.
- Returns activities sorted by `created_at` descending.

Responses
- `200 OK`: array of activities (same shape as `Details` above)
- `404 Not Found`: invalid or missing club

Example
```json
[
  {
    "id": "a1b2c3...",
    "club_id": "e58b9984-ebfc-4308-9223-69944ece8c09",
    "title": "Event2",
    "description": "",
    "created_by": "creator_username",
    "created_at": "2026-01-02T20:00:00Z",
    "start_date": null
  },
  {
    "id": "d7f9c3...",
    "title": "Event1",
    "description": "First event",
    "club_id": "e58b9984-ebfc-4308-9223-69944ece8c09",
    "created_by": "creator_username",
    "created_at": "2026-01-02T19:20:00Z",
    "start_date": null
  }
]
```
