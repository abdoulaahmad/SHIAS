# Audit API

Version: 1.0

Status: Active

Owner: SHIAS Team

Last Updated: YYYY-MM-DD

---

# Purpose

This document defines the Audit API for the Secure Health Identity & Access System (SHIAS).

The Audit API provides secure access to immutable audit records generated throughout the platform. Audit records capture authentication events, consent actions, provider operations, pointer registry activities, and access token usage.

Audit records support accountability, security monitoring, compliance, and forensic investigations.

---

# Responsibilities

The Audit API supports:

- Viewing audit events
- Searching audit events
- Filtering audit events
- Viewing audit event details
- Exporting audit reports (future)

Audit records are read-only.

---

# Resource

```
/api/v1/audit-events
```

---

# Audit Principles

The audit system follows these principles:

- Immutable
- Append-only
- Tamper-evident
- Timestamped
- Traceable
- Secure

Audit records cannot be edited or deleted.

---

# Endpoints

| Method | Endpoint | Description |
|---------|----------|-------------|
| GET | `/audit-events` | List audit events |
| GET | `/audit-events/{auditEventId}` | Get audit event |

---

# GET /audit-events

## Purpose

Retrieve audit events.

---

## Authentication

Bearer Token

---

## Authorization

Administrator

---

## Query Parameters

| Parameter | Description |
|-----------|-------------|
| actorId | User who performed the action |
| actorType | PATIENT, PROVIDER_USER, ADMIN |
| eventType | Event category |
| resourceType | Resource affected |
| outcome | SUCCESS, FAILURE |
| from | Start timestamp |
| to | End timestamp |
| page | Page number |
| limit | Results per page |

---

## Example

```
GET /api/v1/audit-events?eventType=CONSENT_APPROVED&page=1
```

---

## Success Response

HTTP 200

```json
{
  "success": true,
  "data": {
    "items": [
      {
        "auditEventId": "uuid",
        "timestamp": "2026-08-18T14:30:00Z",
        "eventType": "CONSENT_APPROVED",
        "actorType": "PATIENT",
        "actorId": "uuid",
        "resourceType": "CONSENT",
        "resourceId": "uuid",
        "outcome": "SUCCESS"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 84
    }
  }
}
```

---

# GET /audit-events/{auditEventId}

## Purpose

Retrieve a specific audit event.

---

## Authentication

Bearer Token

---

## Authorization

Administrator

---

## Path Parameters

| Name | Type |
|------|------|
| auditEventId | UUID |

---

## Success Response

```json
{
  "success": true,
  "data": {
    "auditEventId": "uuid",
    "timestamp": "2026-08-18T14:30:00Z",
    "eventType": "CONSENT_APPROVED",
    "actorType": "PATIENT",
    "actorId": "uuid",
    "resourceType": "CONSENT",
    "resourceId": "uuid",
    "outcome": "SUCCESS",
    "ipAddress": "203.0.113.25",
    "userAgent": "Mozilla/5.0"
  }
}
```

---

# Audit Event Structure

Every audit event contains:

| Field | Description |
|------|-------------|
| auditEventId | Unique event identifier |
| timestamp | Event timestamp (UTC) |
| eventType | Type of action |
| actorType | Patient, Provider User, Admin |
| actorId | Identity of the actor |
| resourceType | Affected resource |
| resourceId | Resource identifier |
| outcome | Success or Failure |
| ipAddress | Client IP address |
| userAgent | Client application |
| correlationId | Request correlation identifier |

---

# Event Categories

## Authentication

- LOGIN_SUCCESS
- LOGIN_FAILURE
- TOKEN_REFRESH
- LOGOUT

---

## Patient

- PATIENT_REGISTERED
- PATIENT_UPDATED
- PATIENT_VIEWED

---

## Provider

- PROVIDER_REGISTERED
- PROVIDER_UPDATED
- PROVIDER_VERIFIED
- PROVIDER_SUSPENDED

---

## Pointer Registry

- POINTER_REGISTERED
- POINTER_UPDATED
- POINTER_DEACTIVATED
- POINTER_SEARCHED

---

## Consent

- CONSENT_REQUESTED
- CONSENT_APPROVED
- CONSENT_REJECTED
- CONSENT_REVOKED
- CONSENT_EXPIRED

---

## Access Broker

- ACCESS_TOKEN_ISSUED
- ACCESS_TOKEN_VALIDATED
- ACCESS_TOKEN_REVOKED
- ACCESS_TOKEN_EXPIRED

---

## Administration

- USER_CREATED
- USER_UPDATED
- ROLE_CHANGED
- SYSTEM_CONFIGURATION_UPDATED

---

# Outcome Values

| Value | Description |
|-------|-------------|
| SUCCESS | Operation completed successfully |
| FAILURE | Operation failed |

---

# Search and Filtering

The API supports filtering by:

- Date range
- Event type
- Actor
- Resource
- Outcome

Multiple filters may be combined.

---

# Pagination

Supports:

- page
- limit

Responses include pagination metadata.

---

# Retention Policy

Minimum retention:

```
7 years
```

Archived records remain immutable.

Retention periods may be configured according to applicable regulatory requirements.

---

# Security Requirements

The Audit API must:

- Require HTTPS.
- Require JWT authentication.
- Restrict access to administrators.
- Never allow updates.
- Never allow deletion.
- Protect sensitive metadata.
- Record all access to audit logs.

---

# Business Rules

- Audit events are append-only.
- Audit events cannot be modified.
- Audit events cannot be deleted.
- Every security-sensitive action generates an audit event.
- Every API request should include a correlation ID for traceability.

---

# Error Responses

| Status | Meaning |
|---------|---------|
| 400 | Invalid request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Audit event not found |
| 422 | Validation failed |

---

# Example Workflow

1. A patient logs in.
2. A `LOGIN_SUCCESS` audit event is created.
3. The patient approves a consent request.
4. A `CONSENT_APPROVED` audit event is created.
5. An access token is issued.
6. An `ACCESS_TOKEN_ISSUED` audit event is created.
7. An administrator later reviews the complete sequence using the Audit API.

---

# Non-Goals

The Audit API does not:

- Modify audit records.
- Delete audit records.
- Store clinical data.
- Expose sensitive authentication secrets.

---

# Related Documents

- api-overview.md
- authentication.md
- consent.md
- access-broker.md
- business-rules.md
- domain-model.md
- communication.md