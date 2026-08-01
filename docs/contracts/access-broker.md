# Access Broker API

Version: 1.0

Status: Active

Owner: SHIAS Team

Last Updated: YYYY-MM-DD

---

# Purpose

This document defines the Access Broker API for the Secure Health Identity & Access System (SHIAS).

The Access Broker is responsible for issuing, validating, and revoking temporary access tokens that authorize healthcare providers to retrieve patient medical records directly from another healthcare provider.

The Access Broker never stores or transmits clinical records.

---

# Responsibilities

The Access Broker supports:

- Access token issuance
- Access token validation
- Access token revocation
- Access token inspection
- Access logging

---

# Resource

```
/api/v1/access
```

---

# Overview

The Access Broker sits between the Consent Service and participating healthcare providers.

Its responsibilities are to:

- Verify patient consent
- Verify provider authorization
- Generate short-lived access tokens
- Validate presented tokens
- Prevent unauthorized access
- Record audit events

---

# Access Token Lifecycle

```
Consent Approved
        │
        ▼
Issue Token
        │
        ▼
Token Active
        │
        ├────────────► Expired
        │
        ├────────────► Revoked
        │
        ▼
Validated
```

---

# Endpoints

| Method | Endpoint | Description |
|---------|----------|-------------|
| POST | `/access/tokens` | Issue access token |
| POST | `/access/tokens/validate` | Validate token |
| GET | `/access/tokens/{tokenId}` | Inspect token |
| POST | `/access/tokens/{tokenId}/revoke` | Revoke token |

---

# POST /access/tokens

## Purpose

Issue a temporary access token after successful consent verification.

---

## Authentication

Bearer Token

---

## Authorization

Verified Provider

---

## Request Body

```json
{
  "consentId": "uuid"
}
```

---

## Success Response

HTTP 201

```json
{
  "success": true,
  "data": {
    "tokenId": "uuid",
    "accessToken": "<jwt>",
    "expiresAt": "2026-08-18T14:35:00Z",
    "expiresIn": 300
  }
}
```

---

## Business Rules

- Consent must exist.
- Consent must be APPROVED.
- Consent must not be expired.
- Consent must not be revoked.
- Requesting provider must match the consent.
- Source provider must exist.
- Audit event generated.

---

# POST /access/tokens/validate

## Purpose

Validate an access token before releasing a clinical record.

---

## Authentication

Bearer Token

---

## Authorization

Verified Provider

---

## Request Body

```json
{
  "accessToken": "<jwt>"
}
```

---

## Success Response

HTTP 200

```json
{
  "success": true,
  "data": {
    "valid": true,
    "tokenId": "uuid",
    "consentId": "uuid",
    "healthId": "SHIAS-000001",
    "requestingProviderId": "uuid",
    "sourceProviderId": "uuid",
    "expiresAt": "2026-08-18T14:35:00Z"
  }
}
```

---

## Invalid Response

HTTP 401

```json
{
  "success": false,
  "message": "Access token is invalid."
}
```

---

## Business Rules

Validation checks:

- Signature
- Expiration
- Revocation
- Consent status
- Source Provider
- Requesting Provider

---

# GET /access/tokens/{tokenId}

## Purpose

Retrieve metadata about an issued access token.

---

## Authentication

Bearer Token

---

## Authorization

Administrator

---

## Success Response

```json
{
  "success": true,
  "data": {
    "tokenId": "uuid",
    "status": "ACTIVE",
    "issuedAt": "2026-08-18T14:30:00Z",
    "expiresAt": "2026-08-18T14:35:00Z"
  }
}
```

---

# POST /access/tokens/{tokenId}/revoke

## Purpose

Immediately invalidate an access token.

---

## Authentication

Bearer Token

---

## Authorization

Administrator

---

## Success Response

HTTP 200

```json
{
  "success": true,
  "message": "Access token revoked."
}
```

---

## Business Rules

A revoked token:

- Cannot be validated.
- Cannot be reused.
- Generates an audit event.

---

# Token Claims

Issued JWTs contain the following claims:

```json
{
  "jti": "uuid",
  "sub": "consent-id",
  "healthId": "SHIAS-000001",
  "requestingProviderId": "uuid",
  "sourceProviderId": "uuid",
  "scope": [
    "READ_RECORD"
  ],
  "iat": 1787063400,
  "exp": 1787063700
}
```

---

# Token Lifetime

Default lifetime:

```
5 minutes
```

Maximum lifetime:

```
15 minutes
```

Long-lived access tokens are prohibited.

---

# Token Status

| Status | Description |
|---------|-------------|
| ACTIVE | Token may be used |
| EXPIRED | Lifetime ended |
| REVOKED | Revoked manually |
| INVALID | Failed validation |

---

# Validation Rules

The Access Broker validates:

- JWT signature
- Token expiration
- Token status
- Consent status
- Requesting provider
- Source provider

Validation fails if any check fails.

---

# Authorization Rules

| Role | Permissions |
|------|-------------|
| Verified Provider | Request token, validate token |
| Administrator | Inspect and revoke any token |

---

# Security Requirements

The Access Broker must:

- Use HTTPS.
- Sign tokens with a secure private key.
- Validate every JWT signature.
- Reject expired tokens.
- Reject revoked tokens.
- Reject tokens linked to revoked or expired consent.
- Prevent token replay where applicable.
- Never include clinical records in token payloads.

---

# Audit Events

The following actions generate audit events:

- Access Token Issued
- Access Token Validated
- Access Token Validation Failed
- Access Token Revoked
- Access Token Expired

---

# Error Responses

| Status | Meaning |
|---------|---------|
| 400 | Invalid request |
| 401 | Invalid token |
| 403 | Consent not approved |
| 404 | Consent not found |
| 409 | Token already revoked |
| 422 | Validation failed |

---

# Example Workflow

1. A provider receives an approved consent.
2. The provider requests an access token.
3. The Access Broker validates the consent.
4. A signed JWT is issued.
5. The requesting provider presents the token to the source provider.
6. The source provider validates the token with SHIAS.
7. If valid, the source provider releases the requested clinical record directly to the requesting provider.
8. SHIAS records all security events.

---

# Non-Goals

The Access Broker does not:

- Store clinical records.
- Proxy clinical record transfers.
- Persist medical data.
- Make treatment decisions.

---

# Related Documents

- api-overview.md
- authentication.md
- providers.md
- pointers.md
- consent.md
- audit.md
- communication.md
- data-flow.md
- business-rules.md