# Providers API

Version: 1.0

Status: Active

Owner: SHIAS Team

Last Updated: YYYY-MM-DD

---

# Purpose

This document defines the Healthcare Provider Management API for the Secure Health Identity & Access System (SHIAS).

Healthcare providers are trusted organizations that participate in secure health information exchange. They authenticate with SHIAS, register metadata pointers, request patient consent, validate access tokens, and exchange clinical records directly with other providers.

SHIAS stores provider identity and metadata only. It never stores provider-owned clinical records.

---

# Responsibilities

The Provider API supports:

- Provider registration
- Provider profile retrieval
- Provider profile updates
- Provider verification status
- Provider listing
- Provider activation/deactivation

---

# Resource

```
/api/v1/providers
```

---

# Endpoints

| Method | Endpoint | Description |
|---------|----------|-------------|
| POST | `/providers` | Register provider |
| GET | `/providers/me` | Get authenticated provider |
| GET | `/providers/{providerId}` | Get provider by ID |
| PATCH | `/providers/{providerId}` | Update provider |
| GET | `/providers` | List providers |
| PATCH | `/providers/{providerId}/status` | Update provider status (Admin) |
| PATCH | `/providers/{providerId}/verify` | Verify provider (Admin) |

---

# POST /providers

## Purpose

Register a new healthcare provider.

---

## Authentication

None

---

## Authorization

Public

---

## Request Body

```json
{
  "organizationName": "City General Hospital",
  "registrationNumber": "HSP-2026-001",
  "email": "admin@citygeneral.org",
  "phoneNumber": "+2348012345678",
  "address": {
    "street": "123 Health Avenue",
    "city": "Abuja",
    "state": "FCT",
    "country": "Nigeria"
  },
  "password": "StrongPassword123!"
}
```

---

## Success Response

HTTP 201

```json
{
  "success": true,
  "message": "Provider registered successfully.",
  "data": {
    "providerId": "uuid",
    "verificationStatus": "PENDING"
  }
}
```

---

## Business Rules

- Registration number must be unique.
- Email must be unique.
- Phone number must be unique.
- Newly registered providers are not verified by default.
- Registration generates an audit event.

---

# GET /providers/me

## Purpose

Retrieve the authenticated provider profile.

---

## Authentication

Bearer Token

---

## Authorization

Verified or Pending Provider

---

## Success Response

HTTP 200

```json
{
  "success": true,
  "data": {
    "providerId": "uuid",
    "organizationName": "City General Hospital",
    "verificationStatus": "VERIFIED",
    "status": "ACTIVE",
    "email": "admin@citygeneral.org"
  }
}
```

---

# GET /providers/{providerId}

## Purpose

Retrieve a provider profile.

---

## Authentication

Bearer Token

---

## Authorization

Authenticated Provider or Administrator

---

## Path Parameters

| Name | Type |
|------|------|
| providerId | UUID |

---

## Success Response

HTTP 200

```json
{
  "success": true,
  "data": {
    "providerId": "uuid",
    "organizationName": "City General Hospital",
    "verificationStatus": "VERIFIED",
    "status": "ACTIVE"
  }
}
```

---

## Business Rules

- Providers may retrieve their own profile.
- Administrators may retrieve any provider profile.
- Sensitive credentials are never returned.

---

# PATCH /providers/{providerId}

## Purpose

Update provider information.

---

## Authentication

Bearer Token

---

## Authorization

Provider (self)

---

## Request Body

```json
{
  "organizationName": "City General Teaching Hospital",
  "phoneNumber": "+2348099999999"
}
```

---

## Updatable Fields

- Organization Name
- Phone Number
- Address
- Contact Person

---

## Non-Updatable Fields

- Provider ID
- Registration Number
- Verification Status
- Created At

---

## Success Response

HTTP 200

```json
{
  "success": true,
  "message": "Provider updated successfully."
}
```

---

## Business Rules

- Registration number cannot be changed.
- Updates are audited.

---

# GET /providers

## Purpose

Retrieve registered providers.

---

## Authentication

Bearer Token

---

## Authorization

Administrator

---

## Query Parameters

| Name | Description |
|------|-------------|
| page | Page number |
| limit | Items per page |
| search | Search by organization |
| status | ACTIVE, INACTIVE |
| verificationStatus | VERIFIED, PENDING |

---

## Success Response

HTTP 200

```json
{
  "success": true,
  "data": {
    "items": [],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 58
    }
  }
}
```

---

# PATCH /providers/{providerId}/verify

## Purpose

Approve or reject provider verification.

---

## Authentication

Bearer Token

---

## Authorization

Administrator

---

## Request Body

```json
{
  "verificationStatus": "VERIFIED"
}
```

Allowed values:

- VERIFIED
- REJECTED

---

## Success Response

HTTP 200

```json
{
  "success": true,
  "message": "Provider verification updated."
}
```

---

## Business Rules

- Only administrators may verify providers.
- Only verified providers may:
  - Register metadata pointers.
  - Request patient consent.
  - Validate access tokens.
  - Participate in record exchange.

---

# PATCH /providers/{providerId}/status

## Purpose

Activate or deactivate a provider.

---

## Authentication

Bearer Token

---

## Authorization

Administrator

---

## Request Body

```json
{
  "status": "ACTIVE"
}
```

Allowed values:

- ACTIVE
- INACTIVE
- SUSPENDED

---

## Business Rules

Inactive or suspended providers cannot:

- Authenticate.
- Register pointers.
- Request consent.
- Validate access tokens.

---

# Provider Verification Status

| Status | Description |
|---------|-------------|
| PENDING | Awaiting review |
| VERIFIED | Approved to participate |
| REJECTED | Registration rejected |

---

# Provider Status

| Status | Description |
|---------|-------------|
| ACTIVE | Operational |
| INACTIVE | Temporarily disabled |
| SUSPENDED | Administrative suspension |

---

# Validation Rules

| Field | Rules |
|------|-------|
| organizationName | Required, 2–200 characters |
| registrationNumber | Required, unique |
| email | Required, valid email, unique |
| phoneNumber | Required, E.164 format |
| address | Required |
| password | See Authentication API |

---

# Audit Events

The following actions generate audit events:

- Provider Registered
- Provider Updated
- Provider Verified
- Provider Rejected
- Provider Activated
- Provider Suspended
- Provider Profile Viewed

---

# Security Requirements

The Provider API must:

- Require HTTPS in production.
- Enforce JWT authentication.
- Restrict administrative actions.
- Prevent unauthorized profile access.
- Never expose password hashes.
- Never expose refresh tokens.
- Never expose clinical records.

---

# Related Documents

- api-overview.md
- authentication.md
- pointers.md
- consent.md
- access-broker.md
- business-rules.md
- domain-model.md