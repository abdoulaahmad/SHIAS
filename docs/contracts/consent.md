# Consent API

Version: 1.0

Status: Active

Owner: SHIAS Team

Last Updated: YYYY-MM-DD

---

# Purpose

This document defines the Consent Management API for the Secure Health Identity & Access System (SHIAS).

The Consent API enables patients to control access to their health information by authorizing or denying requests from healthcare providers.

A valid consent is required before an Access Token can be issued for medical record retrieval.

---

# Responsibilities

The Consent API supports:

- Creating consent requests
- Viewing consent requests
- Approving consent
- Rejecting consent
- Revoking consent
- Listing consent history

---

# Resource

```
/api/v1/consents
```

---

# Consent Lifecycle

```
Pending
   │
   ├──────────────► Rejected
   │
   ▼
Approved
   │
   ├──────────────► Revoked
   │
   └──────────────► Expired
```

A consent can only be approved once.

Revoked and expired consents cannot be reused.

---

# Endpoints

| Method | Endpoint | Description |
|---------|----------|-------------|
| POST | `/consents` | Create consent request |
| GET | `/consents` | List consents |
| GET | `/consents/{consentId}` | Get consent |
| PATCH | `/consents/{consentId}/approve` | Approve consent |
| PATCH | `/consents/{consentId}/reject` | Reject consent |
| PATCH | `/consents/{consentId}/revoke` | Revoke consent |

---

# POST /consents

## Purpose

Create a new consent request.

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
  "healthId": "SHIAS-000001",
  "pointerId": "uuid",
  "purpose": "CONTINUITY_OF_CARE",
  "expiresInHours": 24
}
```

---

## Success Response

HTTP 201

```json
{
  "success": true,
  "message": "Consent request created.",
  "data": {
    "consentId": "uuid",
    "status": "PENDING"
  }
}
```

---

## Business Rules

- Provider must be verified.
- Patient must exist.
- Pointer must exist.
- A pending consent is created.
- Patient is notified.
- Audit event is generated.

---

# GET /consents

## Purpose

Retrieve consent requests.

---

## Authentication

Bearer Token

---

## Authorization

Patient, Provider, Administrator

---

## Query Parameters

| Parameter | Description |
|-----------|-------------|
| status | Pending, Approved, Rejected |
| healthId | Patient Health ID |
| providerId | Requesting Provider |
| page | Page number |
| limit | Results per page |

---

## Success Response

```json
{
  "success": true,
  "data": {
    "items": [],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 14
    }
  }
}
```

---

## Business Rules

Patients see only their own consent requests.

Providers see requests they created.

Administrators may view all.

---

# GET /consents/{consentId}

## Purpose

Retrieve a consent request.

---

## Authentication

Bearer Token

---

## Authorization

Patient (owner), Requesting Provider, Administrator

---

## Success Response

```json
{
  "success": true,
  "data": {
    "consentId": "uuid",
    "status": "PENDING",
    "purpose": "CONTINUITY_OF_CARE",
    "requestedAt": "2026-08-15T09:00:00Z",
    "expiresAt": "2026-08-16T09:00:00Z"
  }
}
```

---

# PATCH /consents/{consentId}/approve

## Purpose

Approve a pending consent request.

---

## Authentication

Bearer Token

---

## Authorization

Patient (owner)

---

## Request Body

No body required.

---

## Success Response

```json
{
  "success": true,
  "message": "Consent approved."
}
```

---

## Business Rules

- Only the patient may approve.
- Consent must be pending.
- Approval timestamp is recorded.
- Access Broker may now issue an Access Token.
- Audit event is recorded.

---

# PATCH /consents/{consentId}/reject

## Purpose

Reject a pending consent request.

---

## Authentication

Bearer Token

---

## Authorization

Patient (owner)

---

## Request Body

Optional:

```json
{
  "reason": "Patient declined."
}
```

---

## Success Response

```json
{
  "success": true,
  "message": "Consent rejected."
}
```

---

## Business Rules

- Only pending requests may be rejected.
- Rejected requests cannot be approved later.
- A new consent request is required.
- Audit event is generated.

---

# PATCH /consents/{consentId}/revoke

## Purpose

Revoke an approved consent before expiration.

---

## Authentication

Bearer Token

---

## Authorization

Patient (owner)

---

## Request Body

Optional:

```json
{
  "reason": "Access no longer required."
}
```

---

## Success Response

```json
{
  "success": true,
  "message": "Consent revoked."
}
```

---

## Business Rules

- Only approved consents may be revoked.
- Revocation immediately invalidates future token issuance.
- Existing Access Tokens associated with the consent must be invalidated.
- Revocation is audited.

---

# Consent Status

| Status | Description |
|---------|-------------|
| PENDING | Awaiting patient decision |
| APPROVED | Authorized by patient |
| REJECTED | Denied by patient |
| REVOKED | Withdrawn after approval |
| EXPIRED | Validity period ended |

---

# Consent Purpose

Supported values include:

- CONTINUITY_OF_CARE
- EMERGENCY_CARE
- SPECIALIST_REFERRAL
- SECOND_OPINION
- DIAGNOSTIC_REVIEW
- FOLLOW_UP
- TRANSFER_OF_CARE
- OTHER

---

# Validation Rules

| Field | Rules |
|------|-------|
| healthId | Required, valid Health ID |
| pointerId | Required, existing pointer |
| purpose | Required enum |
| expiresInHours | Integer, 1–168 hours |

Maximum consent validity for the MVP is **7 days (168 hours)**.

---

# Authorization Rules

| Role | Permissions |
|------|-------------|
| Patient | View, approve, reject, revoke own consents |
| Verified Provider | Create requests, view own requests |
| Administrator | View all consents |

---

# Audit Events

The following actions generate audit events:

- Consent Requested
- Consent Viewed
- Consent Approved
- Consent Rejected
- Consent Revoked
- Consent Expired

---

# Security Requirements

The Consent API must:

- Require HTTPS in production.
- Require JWT authentication.
- Verify patient ownership before approval, rejection, or revocation.
- Prevent duplicate approvals.
- Prevent modification of expired or revoked consents.
- Never expose clinical records.

---

# Example Workflow

1. A verified provider discovers a metadata pointer.
2. The provider submits a consent request.
3. SHIAS stores the request with a **PENDING** status.
4. The patient reviews the request in the Patient Portal.
5. The patient approves the request.
6. The consent status becomes **APPROVED**.
7. The Access Broker can issue an Access Token.
8. The requesting provider retrieves the clinical record directly from the source provider.
9. The patient may revoke consent before it expires, preventing future token issuance.

---

# Related Documents

- api-overview.md
- authentication.md
- providers.md
- pointers.md
- access-broker.md
- audit.md
- domain-model.md
- business-rules.md