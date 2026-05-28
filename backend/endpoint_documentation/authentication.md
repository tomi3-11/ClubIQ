# This covers the docs for the backend authentication usage

## To be used by
- Frontend contrubutors
- maintainers
- consumers of the API

## AUTH DETAIL
BASE_URL: `api/auth/`

All auth endpoints require a valid Clerk session token:
- Header: `Authorization: Bearer <Clerk session token>`
- Content-Type: `application/json`

|id | Description | endpoint | method |
|---|-------------|----------|--------|
| 1 | Sync the signed-in Clerk user into the DB | `/sync/` | `POST` |
| 2 | Get the user details by id | `/me/<int:id>/` | `GET` |
| 3 | Test the auth routes working ( no core functionality) | `/test/` | `GET` |


## Implementaion
### Syncing User to the database
`POST`: `http://127.0.0.1:5000/api/auth/sync/`

```json



```
Notes:
- The backend verifies the Clerk token and overrides `clerk_id` from the token (client-supplied clerk_id is ignored).
- Provide email/name/username/role; if already synced, the user is updated.

Expected response: `200`

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
If sent again, the user is updated.

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
On duplicate constraints (email/username/clerk_id), a `409` may be returned with error details.

### Get a single user detail
`GET`: `http://127.0.0.1:5000/api/auth/me2/`

Requires a valid Clerk token and the user to exist in the DB.

Expected response: `200`
```json
{
  "id": 2,
  "clerk_id": "user_37elnRLAq6G6KjtQ0lU4Jcp4ZMV",
  "email": "testuser@gmail.com",
  "username": "testuser",
  "role": "user",
  "created_at": "2026-01-01T18:18:18.039582"
}

```

### testing the routes
`GET`: `http://127.0.0.1:5000/api/auth/test/`

Requires a valid Clerk token and a synced user.

```json
{
  "message": "Hello, testuser!"
}
```

Thats it folks.

For test purposes and token retrieval Replace the `App.tsx` and `main.tsx` with the content below.

here are the sample implementation for the tests made in react, 
```typescript
// App.tsx

import './App.css';
import { SignedIn, SignedOut, SignInButton, UserButton, useAuth, useUser } from '@clerk/clerk-react';
import { useEffect } from 'react';


export default function App() {
  const { getToken, isLoaded, isSignedIn } = useAuth();
  const { user } = useUser();

  useEffect(() => {
    if (!isLoaded || !isSignedIn || !user) return;

    const syncUser = async () => {
      try {
        const token = await getToken();
        if (!token) {
          console.warn('No Clerk token available');
          return;
        }

        // temporary for debugging
        // console.log('Clerk Bearer token:', token);

        const email = user.primaryEmailAddress?.emailAddress;
        const name = [user.firstName, user.lastName].filter(Boolean).join(' ') || user.username || user.id;
        const username = user.username || email?.split('@')[0] || user.id;

        const res = await fetch('http://127.0.0.1:5000/api/auth/sync/', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email,
            name,
            username,
            role: 'user',
          }),
        });

        const body = await res.json().catch(() => ({}));
        if (!res.ok) {
          console.error('Sync failed', res.status, body);
          return;
        }
        console.log('Sync ok', body);
      } catch (err) {
        console.error('Sync error', err);
      }
    };

    syncUser();
  }, [getToken, isLoaded, isSignedIn, user]);

  return (
    <>
      <SignedOut>
        <SignInButton />
      </SignedOut>
      <SignedIn>
        <UserButton />
      </SignedIn>
    </>
  );
}

```

```typescript
// Main.tsx

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { ClerkProvider } from '@clerk/clerk-react';

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
if (!PUBLISHABLE_KEY) throw new Error('Add your Clerk Publishable Key to .env');

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      <App />
    </ClerkProvider>
  </StrictMode>
);

```

