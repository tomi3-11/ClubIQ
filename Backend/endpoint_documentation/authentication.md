# This covers the docs for the backend authentication usage

## To be used by
- Frontend contrubutors
- maintainers
- consumers of the API

## AUTH DETAIL
BASE_URL: `api/auth/`

|id | Description | endpoint | method |
|---|-------------|----------|--------|
| 1 | Get the user infor from frontend for syncing to the db | `/sync/` | `POST` |
| 2 | Get the user details by id | `/me/<int:id>/` | `GET` |
| 3 | Test the auth routes working ( no core functionality) | `/test/` | `GET` |


## Implementaion
Content-Type: `application/json`

### Syncing User to the database
`POST`: `http://127.0.0.1:5000/api/auth/sync/`

```json
{
  "clerk_id": "12342787shjhsd",
  "name": "tom",
  "username": "tom1",
  "email": "tom@test.com",
  "role": "admin"
}

```
Expected response: `201`

```json
{
  "message": "User created successfully",
  "user": {
    "id": 1,
    "clerk_id": "12342787shjhsd",
    "name": "tom",
    "email": "tom@test.com",
    "username": "tom1",
    "role": "admin",
    "created_at": "2026-01-01T09:45:11.089007",
    "updated_at": "2026-01-01T09:50:15.161471"
  },
  "verified_via": "Clerk"
}

```
If send the same details Again, then it updated the user.

```json
{
  "message": "User updated successfully",
  "user": {
    "id": 1,
    "clerk_id": "12342787shjhsd",
    "name": "tom",
    "email": "tom@test.com",
    "username": "tom1",
    "role": "admin",
    "created_at": "2026-01-01T09:45:11.089007",
    "updated_at": "2026-01-01T09:50:15.161471"
  },
  "verified_via": "Clerk"
}

```

### Get a single user detail
`GET`: `http://127.0.0.1:5000/api/auth/me/1/`

Expected response: `200`
```json
{
  "id": 1,
  "clerk_id": "12342787shjhsd",
  "email": "tom@test.com",
  "username": "tom1",
  "role": "admin",
  "created_at": "2026-01-01T09:45:11.089007"
}

```

### testing the routes
`GET`: `http://127.0.0.1:5000/api/auth/test/`

```json
{
  "message": "Auth routes working!"
}
```

Thats it folks.

