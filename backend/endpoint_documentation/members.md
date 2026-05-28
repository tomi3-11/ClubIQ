# Members API

Base URL: `/api/members/`

Auth
- All endpoints require a valid Clerk session token.
- Header: `Authorization: Bearer <Clerk session token>`
- Content-Type: `application/json` for endpoints with bodies.

IDs
- `member_id` is a UUID (string in routes).
- `club_id` is a UUID (string in routes).
- `user_id` is an internal integer.

Permissions
- Read (list/get): any authenticated, synced user.
- Create/Update/Delete: club creator or roles `admin`/`super_user`.
- The service enforces permissions; endpoints accept authenticated requests and rely on `g.current_user` from `auth_required`.

## Endpoints at a glance

| # | Endpoint | Method | Description | Auth | Notes |
|---|----------|--------|-------------|------|-------|
| 1 | `/` | GET | List members | Required | Supports `mine` and `club_id` filters. |
| 2 | `/` | POST | Create member | Required | Creator/admin/super_user only. |
| 3 | `/<member_id>` | GET | Get member by id | Required | Returns membership details. |
| 4 | `/<member_id>` | PUT | Update member | Required | Creator/admin/super_user; change `role`. |
| 5 | `/<member_id>` | DELETE | Delete member | Required | Creator/admin/super_user. |

## List members
`GET /api/members/?mine={true|false}&club_id=<uuid>`

Query params
- `mine` (optional, default `false`): when `true`, non-admin users only see memberships where they are the member or they created the club. Admin/super_user sees all regardless.
- `club_id` (optional): filter to a specific club (UUID string). Invalid UUID → `400`.

Responses
- `200 OK`: array of members

```json
[
  {
    "id": "73a799b1-f4c1-4cfd-acf8-2866e480462c",
    "club_id": "e58b9984-ebfc-4308-9223-69944ece8c09",
    "user_id": 5,
    "username": "alice",
    "role": "member",
    "joined_at": "2026-01-02T10:00:00Z"
  }
]
```

## Create member
`POST /api/members/`

Request body
```json
{
  "club_id": "e58b9984-ebfc-4308-9223-69944ece8c09",
  "user_id": 5,
  "role": "member"
}
```

Rules
- `club_id` (UUID) and `user_id` (int) are required.
- Caller must be club creator or have role `admin`/`super_user`.
- Duplicate membership returns `400`.

Responses
- `201 Created`: success with member payload
- `400 Bad Request`: missing fields, invalid club_id, or duplicate membership
- `403 Forbidden`: insufficient permissions
- `404 Not Found`: club or user not found
- `409/500`: DB/other errors

Example success
```json
{
  "message": "Member created successfully",
  "id": "73a799b1-f4c1-4cfd-acf8-2866e480462c",
  "club_id": "e58b9984-ebfc-4308-9223-69944ece8c09",
  "user_id": 5,
  "username": "alice",
  "role": "member",
  "joined_at": "2026-01-02T10:00:00Z"
}
```

## Get member by id
`GET /api/members/<member_id>`

Responses
- `200 OK`: member object (same shape as above)
- `404 Not Found`: invalid or missing member

## Update member
`PUT /api/members/<member_id>`

Allowed fields
- `role`

Permissions
- Club creator, or roles `admin`/`super_user`.

Responses
- `200 OK`: updated member
- `400 Bad Request`: validation errors
- `403 Forbidden`: insufficient permissions
- `404 Not Found`: invalid/missing member
- `409/500`: DB/other errors

Example success
```json
{
  "message": "Member updated successfully",
  "id": "73a799b1-f4c1-4cfd-acf8-2866e480462c",
  "club_id": "e58b9984-ebfc-4308-9223-69944ece8c09",
  "user_id": 5,
  "username": "alice",
  "role": "moderator",
  "joined_at": "2026-01-02T10:00:00Z"
}
```

## Delete member
`DELETE /api/members/<member_id>`

Permissions
- Club creator, or roles `admin`/`super_user`.

Responses
- `200 OK`: `{ "message": "Member deleted successfully" }`
- `403 Forbidden`: insufficient permissions
- `404 Not Found`: invalid/missing member
- `409/500`: DB/other errors
