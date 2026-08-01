# Authentication Flow

Version: 1.0

Status: Active

Owner: SHIAS Team

Last Updated: YYYY-MM-DD

---

# Purpose

This document defines the authentication architecture and lifecycle for the Secure Health Identity & Access System (SHIAS).

It covers:

- User registration
- Login
- JWT issuance
- Refresh tokens
- Session management
- Logout
- Password reset
- Token rotation
- Security controls

Authentication identifies users.

Authorization determines what authenticated users are permitted to do.

---

# Authentication Principles

The authentication system follows these principles:

- Secure by default
- Stateless access tokens
- Stateful refresh sessions
- Short-lived access tokens
- Rotation of refresh tokens
- Session revocation
- Zero plaintext passwords

---

# Supported User Types

The system authenticates:

- Patients
- Provider Users
- Administrators

Each authenticated user belongs to exactly one user type.

---

# Authentication Components

```
User

↓

Login Endpoint

↓

Credential Verification

↓

Session Creation

↓

JWT Access Token

↓

Refresh Token

↓

Authenticated Requests
```

---

# Registration Flow

## Patient Registration

```
Patient

↓

Submit Registration

↓

Validate Input

↓

Check Duplicate Email

↓

Hash Password (Argon2id)

↓

Create Patient

↓

Create Session

↓

Issue Tokens

↓

Authenticated
```

---

## Provider User Registration

Provider users are created by administrators.

Workflow

```
Administrator

↓

Create Provider User

↓

Temporary Password

↓

First Login

↓

Force Password Change

↓

Normal Authentication
```

---

# Login Flow

```
User

↓

POST /auth/login

↓

Validate Request

↓

Lookup User

↓

Verify Password

↓

Create Session

↓

Generate Access Token

↓

Generate Refresh Token

↓

Return Tokens
```

---

# Access Token

Purpose

Authenticate API requests.

Format

JWT

Lifetime

```
15 minutes
```

Stored:

In memory (recommended).

The access token is never persisted in the database.

---

# JWT Claims

```
sub

typ

role

sessionId

iat

exp

jti
```

Example

```json
{
  "sub": "0198abcd-1234-7ef0-9abc-1234567890ab",
  "typ": "PATIENT",
  "role": "PATIENT",
  "sessionId": "0198def0-5678-7abc-9def-0987654321cd",
  "iat": 1787063400,
  "exp": 1787064300,
  "jti": "0198feed-1111-7aaa-bbbb-222233334444"
}
```

---

# Refresh Token

Purpose

Obtain a new access token without requiring the user to log in again.

Lifetime

```
30 days
```

Stored:

- HttpOnly cookie (web)
- Secure storage (native/mobile)

Only a **hash** of the refresh token is stored in the database.

---

# Session Model

Each successful login creates a new session.

```
User

↓

Session

↓

Refresh Token

↓

Access Token
```

A user may have multiple active sessions.

Examples:

- Laptop
- Mobile phone
- Tablet

---

# Refresh Flow

```
Client

↓

POST /auth/refresh

↓

Verify Refresh Token

↓

Verify Session

↓

Rotate Refresh Token

↓

Issue New Access Token

↓

Issue New Refresh Token

↓

Update Session
```

Refresh tokens are **single-use**.

Every refresh invalidates the previous refresh token.

---

# Token Rotation

Every refresh operation performs:

```
Old Refresh Token

↓

Invalidate

↓

Generate New Refresh Token

↓

Hash Token

↓

Store Hash

↓

Return New Token
```

This prevents replay attacks.

---

# Logout Flow

```
Client

↓

POST /auth/logout

↓

Revoke Session

↓

Delete Refresh Token

↓

Client Removes Access Token
```

The refresh token becomes permanently invalid.

---

# Global Logout

Users may revoke all sessions.

```
Current User

↓

Revoke Every Session

↓

Invalidate All Refresh Tokens

↓

Require Login Everywhere
```

Useful after:

- Password change
- Suspected compromise
- Device theft

---

# Password Reset

Workflow

```
Forgot Password

↓

Email Verification

↓

Temporary Reset Token

↓

Reset Password

↓

Invalidate All Sessions

↓

Force Login
```

Reset tokens expire after:

```
15 minutes
```

---

# Password Change

Authenticated users may change passwords.

Requirements

- Current password
- New password
- Password confirmation

Changing a password invalidates all existing sessions.

---

# Password Policy

Minimum length

```
12 characters
```

Requirements

- Uppercase letter
- Lowercase letter
- Number
- Special character

Passwords are hashed using:

```
Argon2id
```

---

# Session Storage

Sessions store:

- Session ID
- User ID
- User Type
- Refresh Token Hash
- IP Address
- User Agent
- Created At
- Last Activity
- Expires At
- Revoked At

---

# Failed Login Protection

The system protects against brute-force attacks.

After repeated failures:

```
5 failed attempts

↓

Temporary Lock

↓

15 minutes
```

Audit events are generated.

---

# Token Revocation

Tokens become invalid when:

- Session revoked
- Password changed
- User disabled
- Refresh rotation
- Administrator revokes access

---

# Authentication Middleware

Every protected endpoint performs:

1. Verify JWT signature.
2. Verify expiration.
3. Verify session.
4. Verify user status.
5. Attach authenticated user context.

---

# Security Controls

The authentication system must:

- Use HTTPS
- Hash passwords with Argon2id
- Hash refresh tokens
- Rotate refresh tokens
- Reject expired JWTs
- Reject revoked sessions
- Limit login attempts
- Generate audit events

---

# Audit Events

Authentication generates:

- LOGIN_SUCCESS
- LOGIN_FAILURE
- LOGOUT
- PASSWORD_CHANGED
- PASSWORD_RESET_REQUESTED
- PASSWORD_RESET_COMPLETED
- SESSION_REVOKED
- TOKEN_REFRESHED

---

# Error Responses

Authentication errors follow RFC 7807.

Examples include:

- Invalid credentials
- Expired token
- Invalid refresh token
- Session revoked
- Account suspended
- Account locked

---

# Business Rules

- Access tokens are short-lived.
- Refresh tokens are single-use.
- Passwords are never stored in plaintext.
- Refresh token hashes are stored instead of raw tokens.
- Every login creates a new session.
- Password changes invalidate all active sessions.
- Authentication and authorization remain separate concerns.

---

# Related Documents

- authorization-model.md
- backend-architecture.md
- frontend-architecture.md
- validation-strategy.md
- logging-monitoring.md
- testing-strategy.md
- contracts/authentication.md