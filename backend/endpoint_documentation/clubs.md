# Clubs API

Base URL: `/api/clubs/`

All endpoints require a valid Clerk session token:
- Header: `Authorization: Bearer <Clerk session token>`
- Content-Type: `application/json` for endpoints with bodies

IDs
- `club_id` is a UUID. Routes accept it as a string; it is parsed server-side. Invalid UUIDs return `404`.

## Endpoints at a glance

| # | Endpoint | Method | Description | Auth | Notes |
|---|----------|--------|-------------|------|-------|
| 1 | `/` | GET | List clubs | Required | Optional `mine` query to filter to the caller's clubs. |
| 2 | `/` | POST | Create club | Required | Creates club and adds creator as `admin` member. Requires `name`. |
| 3 | `/<club_id>` | GET | Get club by id | Required | Returns basic metadata. |
| 4 | `/<club_id>` | PUT | Update club | Required | Only creator or roles `admin`/`super_user`. Name uniqueness enforced. |
| 5 | `/<club_id>` | DELETE | Delete club | Required | Only creator or roles `admin`/`super_user`. Removes memberships first, then club. |

## List clubs
`GET /api/clubs/?mine={true|false}`

Query params
- `mine` (optional, default `false`): when `true`, non-admin users only see clubs they created or are a member of. Admin/super_user sees all regardless.

Responses
- `200 OK`: array of clubs

```json
[
  {
    "id": "a4e0f2b9-...",
    "name": "Chess Club",
    "description": "Board games and strategy",
    "created_by": "alice",
    "created_at": "2026-01-01T10:00:00Z",
    "updated_at": "2026-01-02T10:00:00Z"
  }
]
```

## Create club
`POST /api/clubs/`

Request body
```json
{
  "name": "Chess Club",
  "description": "Board games and strategy"
}
```

Rules
- `name` is required and must be unique.
- Caller is recorded as `created_by` and is inserted into `clubmembers` with role `admin`.

Responses
- `201 Created`: on success
- `400 Bad Request`: missing `name` or duplicate name
- `409 Conflict`: DB constraint failure

Example success
```json
{
  "message": "Club created successfully",
  "id": "a4e0f2b9-...",
  "name": "Chess Club",
  "description": "Board games and strategy",
  "created_by": "alice",
  "created_at": "2026-01-01T10:00:00Z",
  "updated_at": "2026-01-01T10:00:00Z"
}
```

## Get club by id
`GET /api/clubs/<club_id>`

Responses
- `200 OK`: club object (same shape as list)
- `404 Not Found`: invalid or missing club

## Update club
`PUT /api/clubs/<club_id>`

Allowed fields
- `name` (must remain unique)
- `description`

Permissions
- Creator of the club, or users with role `admin` or `super_user`.

Responses
- `200 OK`: updated club
- `400 Bad Request`: duplicate name
- `403 Forbidden`: insufficient permissions
- `404 Not Found`: invalid/missing club
- `409 Conflict`/`500`: DB errors

Example success
```json
{
  "message": "Club updated successfully",
  "id": "a4e0f2b9-...",
  "name": "Chess & Go Club",
  "description": "Board games and strategy",
  "created_by": "alice",
  "created_at": "2026-01-01T10:00:00Z",
  "updated_at": "2026-01-02T12:00:00Z"
}
```

## Delete club
`DELETE /api/clubs/<club_id>`

Behavior
- Removes related memberships, then deletes the club.
- Permissions: creator, `admin`, or `super_user`.

Responses
- `200 OK`: `{ "message": "Club deleted successfully" }`
- `403 Forbidden`: insufficient permissions
- `404 Not Found`: invalid/missing club
- `409 Conflict`/`500`: on DB errors
