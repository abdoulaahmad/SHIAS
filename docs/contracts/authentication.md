# Authentication API

Version: 1.0

Status: Active

Owner: SHIAS Team

Last Updated: YYYY-MM-DD

---

# Purpose

This document defines the authentication API for the Secure Health Identity & Access System (SHIAS).

It specifies how users authenticate, receive access tokens, refresh sessions, and terminate authenticated sessions.

Authentication establishes identity. Authorization is handled separately based on roles, provider verification, and patient consent.

---

# Authentication Overview

SHIAS uses JWT (JSON Web Tokens) for stateless authentication.

Authentication flow:

1. User submits credentials.
2. Credentials are verified.
3. Access Token is issued.
4. Refresh Token is issued.
5. Client stores tokens securely.
6. Access Token is used for protected requests.
7. Refresh Token is used to obtain a new Access Token.
8. User logs out or tokens expire.

---

# Supported User Types

The following principals can authenticate:

- Patient
- Provider Administrator
- System Administrator (future)

Each authenticated user receives a role that determines authorization.

---

# Authentication Endpoints

| Method | Endpoint | Description |
|---------|----------|-------------|
| POST | `/api/v1/auth/login` | Authenticate user |
| POST | `/api/v1/auth/refresh` | Refresh access token |
| POST | `/api/v1/auth/logout` | Logout current session |
| GET | `/api/v1/auth/me` | Get authenticated user |

---

# POST /auth/login

## Purpose

Authenticate a user using email and password.

---

## Authentication

Public

---

## Authorization

None

---

## Request

```json
{
  "email": "patient@example.com",
  "password": "StrongPassword123!"
}
```

---

## Success Response

HTTP 200

```json
{
  "success": true,
  "message": "Authentication successful.",
  "data": {
    "accessToken": "...",
    "refreshToken": "...",
    "expiresIn": 900,
    "user": {
      "id": "uuid",
      "role": "PATIENT",
      "name": "Amina Bello"
    }
  }
}
```

---

## Error Responses

401 Unauthorized

```json
{
  "success": false,
  "message": "Invalid credentials."
}
```

422 Validation Failed

```json
{
  "success": false,
  "message": "Validation failed."
}
```

---

## Business Rules

- Email is case-insensitive.
- Passwords are never returned.
- Failed logins are audited.
- Successful logins are audited.
- Disabled accounts cannot authenticate.

---

# POST /auth/refresh

## Purpose

Issue a new Access Token using a valid Refresh Token.

---

## Authentication

Refresh Token

---

## Authorization

Authenticated User

---

## Request

```json
{
  "refreshToken": "..."
}
```

---

## Success Response

HTTP 200

```json
{
  "success": true,
  "data": {
    "accessToken": "...",
    "expiresIn": 900
  }
}
```

---

## Business Rules

- Refresh Token must be valid.
- Refresh Token must not be expired.
- Refresh Token may be revoked.
- A new Access Token is generated.
- The existing Refresh Token remains valid until expiry or revocation.

---

# POST /auth/logout

## Purpose

Terminate the authenticated session.

---

## Authentication

Bearer Token

---

## Authorization

Authenticated User

---

## Request

No request body.

---

## Success Response

HTTP 204 No Content

---

## Business Rules

- Refresh Token is revoked.
- Session is terminated.
- Logout event is audited.

---

# GET /auth/me

## Purpose

Return information about the currently authenticated user.

---

## Authentication

Bearer Token

---

## Authorization

Authenticated User

---

## Success Response

HTTP 200

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "role": "PATIENT",
    "name": "Amina Bello",
    "email": "patient@example.com"
  }
}
```

---

# Access Token

Purpose:

Authenticate API requests.

Format:

JWT

Lifetime:

15 minutes

Contains:

- User ID
- User Role
- Token ID (JTI)
- Issued At
- Expiration Time

Example Claims

```json
{
  "sub": "uuid",
  "role": "PATIENT",
  "jti": "uuid",
  "iat": 1786200000,
  "exp": 1786200900
}
```

---

# Refresh Token

Purpose:

Obtain new Access Tokens.

Lifetime:

30 days

Properties:

- Opaque or JWT implementation
- Revocable
- Stored securely
- Never exposed in URLs

---

# Authorization Header

Protected endpoints require:

```
Authorization: Bearer <access-token>
```

Requests without a valid Bearer token return:

HTTP 401 Unauthorized

---

# Password Requirements

Passwords must:

- Be at least 12 characters long.
- Include uppercase letters.
- Include lowercase letters.
- Include numbers.
- Include special characters.
- Not contain leading or trailing whitespace.

Passwords are stored only as secure password hashes.

---

# Session Management

Each successful login creates a new session.

A session includes:

- Session ID
- User ID
- Refresh Token
- Device Information (future)
- IP Address (optional)
- Last Activity
- Expiration Time

---

# Token Expiration

| Token | Lifetime |
|---------|----------|
| Access Token | 15 minutes |
| Refresh Token | 30 days |

Expired Access Tokens cannot be renewed without a valid Refresh Token.

---

# Authentication Errors

| Status | Reason |
|---------|--------|
| 400 | Invalid request |
| 401 | Invalid credentials |
| 401 | Token expired |
| 401 | Missing token |
| 401 | Invalid token |
| 403 | Account disabled |
| 422 | Validation failed |

---

# Security Requirements

Authentication must:

- Use HTTPS in production.
- Hash passwords using Argon2id.
- Never log passwords.
- Never expose Refresh Tokens in URLs.
- Validate JWT signatures.
- Validate token expiration.
- Reject revoked tokens.
- Audit all authentication events.

---

# Audit Events

The following actions generate audit events:

- Login Success
- Login Failure
- Token Refresh
- Logout
- Authentication Failure

---

# Related Documents

- api-overview.md
- patients.md
- providers.md
- business-rules.md
- communication.md