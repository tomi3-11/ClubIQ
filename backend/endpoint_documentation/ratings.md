# Ratings API

Authoritative reference for task ratings endpoints. All endpoints sit under the blueprint prefix `/api/ratings`.

## Auth
- Header: `Authorization: Bearer <Clerk session token>`
- Auth middleware loads `g.current_user` from the Clerk token. If the user is not already synced in the DB, the request fails with 403 (`{"success": false, "message": "User not synced"}`).

## Roles
- Admin + Super User: full access (create, list, delete, view any user).
- Club Manager: list ratings for a task.
- Regular User: may fetch their own ratings only.

## Endpoints
| # | Method | Path | Description | Roles |
|---|--------|------|-------------|-------|
| 1 | GET | `/<task_id>/` | List ratings for a task (with pagination + date filters) | admin, super_user, club_manager |
| 2 | POST | `/<task_id>/` | Create a rating for a completed task | admin, super_user |
| 3 | GET | `/user/<user_id>/` | List ratings received by a user (with pagination + date filters) | admin, super_user, or the user themselves |
| 4 | DELETE | `/<rating_id>` | Delete a rating | admin, super_user |

## Query Params (list endpoints)
- `limit` (int, optional): page size, default 10, max 100.
- `page` (int, optional): 1-based page number, default 1.
- `from` (ISO datetime, optional): include ratings with `created_at >= from`.
- `to` (ISO datetime, optional): include ratings with `created_at <= to`.

## 1) List ratings for a task
`GET /api/ratings/<task_id>/`

Roles: admin, super_user, club_manager

Sample request:
```http
GET /api/ratings/0f4c90f7-4d6f-46d6-8df7-6b0a8d1a5e14/?page=1&limit=10 HTTP/1.1
Authorization: Bearer <token>
```

Success 200 body:
```json
{
  "success": true,
  "data": [
    {
      "id": "87c6b7ef-d6bc-4d07-8b5d-2078170c4c9a",
      "task_id": "0f4c90f7-4d6f-46d6-8df7-6b0a8d1a5e14",
      "rated_user": 5,
      "rated_by": 1,
      "score": 4,
      "comments": "Well done",
      "created_at": "2026-01-01T12:00:00"
    }
  ],
  "average_score": 4.0,
  "pagination": {"page": 1, "limit": 10, "total": 1}
}
```
Error cases:
- 404 if `task_id` is invalid/unknown.
- 403 if role is insufficient or user not synced.

## 2) Create a rating for a task
`POST /api/ratings/<task_id>/`

Roles: admin, super_user

Request body:
```json
{
  "score": 5,
  "rated_user": 5,
  "comments": "Great execution"
}
```
Notes:
- `task_id` must be a valid UUID for an existing task.
- Task must be `completed`; otherwise 400 `"Cannot rate an incomplete task"`.
- `rated_user` must exist.
- A rater can only rate a task once; duplicates return 400 `"You have already rated this task"`.

Success 201 body:
```json
{
  "success": true,
  "message": "Rating created successfully",
  "data": {
    "rating_id": "5c2fd7ef-4b82-4e77-a2dd-dfd606c640fd",
    "task_id": "0f4c90f7-4d6f-46d6-8df7-6b0a8d1a5e14",
    "rated_user": 5,
    "score": 5
  }
}
```
Common errors:
- 400: invalid task id, missing `score`/`rated_user`, incomplete task, duplicate rating.
- 403: insufficient role or user not synced.
- 404: task or rated user not found.
- 409/500: DB failures (IntegrityError or unexpected error).

## 3) List ratings for a user
`GET /api/ratings/user/<user_id>/`

Roles: admin, super_user, or the same `user_id` as the caller.

Sample request:
```http
GET /api/ratings/user/5/?page=1&limit=20 HTTP/1.1
Authorization: Bearer <token>
```

Success 200 body:
```json
{
  "success": true,
  "data": [
    {
      "id": "87c6b7ef-d6bc-4d07-8b5d-2078170c4c9a",
      "task_id": "0f4c90f7-4d6f-46d6-8df7-6b0a8d1a5e14",
      "score": 4,
      "comments": "Well done",
      "rated_by": 1,
      "created_at": "2026-01-01T12:00:00"
    }
  ],
  "average_score": 4.0,
  "pagination": {"page": 1, "limit": 20, "total": 1}
}
```
Error cases:
- 403 if caller is neither admin/super_user nor the same user.
- 403 if user not synced.

## 4) Delete a rating
`DELETE /api/ratings/<rating_id>`

Roles: admin, super_user

Success 200 body:
```json
{"success": true, "message": "Rating deleted successfully"}
```

Errors:
- 404 if `rating_id` is invalid or not found.
- 409/500 on DB errors.

## Pagination & filtering
- Defaults: `limit=10`, `page=1`.
- `limit` is capped at 100. Negative/non-integer values fall back to defaults.
- `from` / `to` must be ISO-8601 datetimes (`YYYY-MM-DD` or `YYYY-MM-DDTHH:MM:SS`). Invalid values are ignored.

## Status codes at a glance
- 200: successful read/delete.
- 201: rating created.
- 400: bad input (invalid IDs, missing fields, incomplete task, duplicate rating).
- 403: auth/role issues or unsynced user.
- 404: resource not found.
- 409: DB constraint error.
- 500: unexpected server error.
