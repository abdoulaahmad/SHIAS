# Error Handling

Version: 1.0

Status: Active

Owner: SHIAS Team

Last Updated: YYYY-MM-DD

---

# Purpose

This document defines the standard error handling model for the Secure Health Identity & Access System (SHIAS).

Every API endpoint MUST return errors using the standardized Problem Details format defined in RFC 7807.

The goal is to provide predictable, machine-readable, and human-readable error responses.

---

# Principles

The SHIAS API follows these principles:

- Consistent error structure
- Standard HTTP status codes
- Machine-readable error codes
- Human-readable descriptions
- Field-level validation errors
- Correlation IDs for tracing
- No sensitive information in responses

---

# Content Type

Error responses use:

```
Content-Type: application/problem+json
```

---

# Standard Error Format

Every error response follows this structure.

```json
{
  "type": "https://api.shias.com/problems/validation-error",
  "title": "Validation Failed",
  "status": 422,
  "detail": "One or more validation errors occurred.",
  "instance": "/api/v1/patients",
  "correlationId": "9b56d640-a54c-4f4d-a78d-42e4d2dbef7f",
  "errors": {
    "email": [
      "Email already exists."
    ]
  }
}
```

---

# Fields

| Field | Required | Description |
|---------|----------|-------------|
| type | Yes | URI identifying the error type |
| title | Yes | Short summary |
| status | Yes | HTTP status code |
| detail | Yes | Human-readable explanation |
| instance | Yes | Request URI |
| correlationId | Yes | Request tracing identifier |
| errors | No | Field-level validation errors |

---

# HTTP Status Codes

| Status | Meaning |
|---------|---------|
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 405 | Method Not Allowed |
| 409 | Conflict |
| 410 | Gone |
| 415 | Unsupported Media Type |
| 422 | Validation Failed |
| 429 | Too Many Requests |
| 500 | Internal Server Error |
| 503 | Service Unavailable |

---

# Error Codes

Each error should include an application-specific error code.

Example

```json
{
  "type": "https://api.shias.com/problems/duplicate-email",
  "title": "Duplicate Email",
  "status": 409,
  "code": "PATIENT_EMAIL_EXISTS",
  "detail": "A patient with this email already exists."
}
```

---

# Validation Errors

Validation errors should identify every invalid field.

Example

```json
{
  "type": "https://api.shias.com/problems/validation-error",
  "title": "Validation Failed",
  "status": 422,
  "detail": "Validation failed.",
  "errors": {
    "email": [
      "Must be a valid email address."
    ],
    "password": [
      "Must contain at least one uppercase letter."
    ]
  }
}
```

---

# Authentication Errors

Example

HTTP 401

```json
{
  "type": "https://api.shias.com/problems/authentication",
  "title": "Authentication Failed",
  "status": 401,
  "code": "INVALID_CREDENTIALS",
  "detail": "Email or password is incorrect."
}
```

---

# Authorization Errors

HTTP 403

```json
{
  "type": "https://api.shias.com/problems/authorization",
  "title": "Forbidden",
  "status": 403,
  "code": "INSUFFICIENT_PERMISSIONS",
  "detail": "You do not have permission to perform this action."
}
```

---

# Resource Not Found

HTTP 404

```json
{
  "type": "https://api.shias.com/problems/not-found",
  "title": "Resource Not Found",
  "status": 404,
  "code": "PATIENT_NOT_FOUND",
  "detail": "The requested patient does not exist."
}
```

---

# Conflict Errors

HTTP 409

Example:

- Duplicate email
- Duplicate registration number
- Duplicate Health ID
- Duplicate pointer

```json
{
  "type": "https://api.shias.com/problems/conflict",
  "title": "Conflict",
  "status": 409,
  "code": "DUPLICATE_RESOURCE",
  "detail": "The resource already exists."
}
```

---

# Consent Errors

Examples include:

- Consent not approved
- Consent revoked
- Consent expired

```json
{
  "type": "https://api.shias.com/problems/consent",
  "title": "Consent Required",
  "status": 403,
  "code": "CONSENT_NOT_APPROVED",
  "detail": "Patient consent has not been approved."
}
```

---

# Access Token Errors

Example

```json
{
  "type": "https://api.shias.com/problems/token",
  "title": "Invalid Access Token",
  "status": 401,
  "code": "TOKEN_EXPIRED",
  "detail": "The supplied access token has expired."
}
```

---

# Rate Limiting

HTTP 429

```json
{
  "type": "https://api.shias.com/problems/rate-limit",
  "title": "Too Many Requests",
  "status": 429,
  "code": "RATE_LIMIT_EXCEEDED",
  "detail": "Please try again later."
}
```

The response should include:

```
Retry-After
```

when appropriate.

---

# Internal Errors

HTTP 500

```json
{
  "type": "https://api.shias.com/problems/internal",
  "title": "Internal Server Error",
  "status": 500,
  "code": "INTERNAL_ERROR",
  "detail": "An unexpected error occurred."
}
```

Internal implementation details must never be exposed.

---

# Correlation ID

Every request should receive a unique correlation identifier.

Clients may send:

```
X-Correlation-ID
```

If omitted, the server generates one.

Responses include:

```
X-Correlation-ID
```

The same value should appear in:

- Logs
- Audit events
- Error responses

---

# Security Requirements

Error responses must never reveal:

- Password hashes
- JWT secrets
- Stack traces
- SQL queries
- Database schema
- Internal file paths
- Private keys

---

# Localization

The `title` field should remain stable for programmatic use.

The `detail` field may be localized in future versions.

Application error codes must remain language-independent.

---

# Logging

Every 5xx response must be logged.

Authentication failures should be logged.

Authorization failures should be logged.

Validation failures should not generate server error logs.

---

# Business Rules

- All APIs MUST use the Problem Details format.
- HTTP status codes MUST match the error condition.
- Application error codes MUST be stable across releases.
- Validation errors MUST identify affected fields.
- Sensitive implementation details MUST never be returned.

---

# Related Documents

- api-overview.md
- authentication.md
- business-rules.md
- audit.md