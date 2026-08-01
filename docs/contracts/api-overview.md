# API Overview

Version: 1.0

Status: Active

Owner: SHIAS Team

Last Updated: YYYY-MM-DD

---

# Purpose

This document defines the overall API design for the Secure Health Identity & Access System (SHIAS).

It establishes the standards, conventions, and principles that every REST endpoint within SHIAS must follow.

All API specifications inherit the rules defined in this document.

---

# API Philosophy

SHIAS follows an API-first architecture.

Every feature exposed through the Patient Portal, Provider Portal, and future integrations must be implemented through documented REST APIs.

The web applications are consumers of the same APIs available to external systems.

---

# Design Goals

The API is designed to be:

- Simple
- Consistent
- Predictable
- Secure
- Versioned
- Stateless
- Easy to integrate

---

# Base URL

Development

```
http://localhost:3000/api/v1
```

Production

```
https://api.shias.com/api/v1
```

---

# API Versioning

SHIAS uses URL versioning.

Example

```
/api/v1
```

Future versions

```
/api/v2
/api/v3
```

Breaking changes require a new API version.

---

# Data Format

Request Body

```
application/json
```

Response Body

```
application/json
```

All APIs communicate using UTF-8 encoded JSON.

---

# HTTP Methods

| Method | Purpose |
|----------|----------|
| GET | Retrieve resources |
| POST | Create resources |
| PUT | Replace resources |
| PATCH | Partially update resources |
| DELETE | Remove resources (soft delete where applicable) |

---

# Resource Naming

Resources use plural nouns.

Examples

```
/patients

/providers

/pointers

/consents

/audit-events
```

Avoid verbs in URLs.

Correct

```
POST /patients
```

Incorrect

```
POST /createPatient
```

---

# URL Structure

General pattern

```
/api/v1/{resource}

/api/v1/{resource}/{id}

/api/v1/{resource}/{id}/{sub-resource}
```

Example

```
GET /api/v1/patients

GET /api/v1/patients/{patientId}

GET /api/v1/patients/{patientId}/consents
```

---

# Request Headers

Common headers

```
Content-Type: application/json

Accept: application/json

Authorization: Bearer <JWT>
```

Protected endpoints require an Authorization header.

---

# Authentication

Public endpoints

- Patient Registration
- Provider Registration
- Login

Protected endpoints

All remaining endpoints.

Authentication is handled using JWT access tokens.

---

# Authorization

Authorization depends on:

- User role
- Authentication status
- Provider verification
- Patient consent (where applicable)

The Core API performs all authorization checks.

---

# Standard Response Format

Successful Response

```json
{
  "success": true,
  "message": "Patient created successfully.",
  "data": {}
}
```

---

Error Response

```json
{
  "success": false,
  "message": "Validation failed.",
  "errors": [
    {
      "field": "email",
      "message": "Email is required."
    }
  ]
}
```

Every endpoint should follow this structure.

---

# HTTP Status Codes

| Code | Meaning |
|------|----------|
| 200 | Success |
| 201 | Resource Created |
| 204 | No Content |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Resource Not Found |
| 409 | Conflict |
| 422 | Validation Failed |
| 429 | Too Many Requests |
| 500 | Internal Server Error |

---

# Pagination

Endpoints returning collections should support pagination.

Query parameters

```
?page=1

?limit=20
```

Future versions may support cursor pagination.

---

# Filtering

Collections may support filtering.

Example

```
GET /providers?status=verified

GET /consents?status=pending
```

---

# Sorting

Collections may support sorting.

Example

```
GET /patients?sort=name

GET /patients?sort=-createdAt
```

The "-" prefix indicates descending order.

---

# Field Selection

Future versions may support selecting specific fields.

Example

```
GET /patients?fields=name,healthId
```

---

# Resource Identifiers

Every resource has a unique identifier.

Examples

```
patientId

providerId

pointerId

consentId

auditEventId
```

Identifiers are immutable.

---

# Date Format

All timestamps use ISO 8601.

Example

```
2026-08-10T14:30:00Z
```

UTC should be used for storage and communication.

---

# Validation

Every request must be validated.

Validation includes:

- Required fields
- Data types
- String length
- Email format
- UUID format
- Enum values
- Business rules

Invalid requests return HTTP 422.

---

# Idempotency

GET operations are idempotent.

PUT operations are idempotent.

DELETE operations are idempotent.

POST operations are generally not idempotent.

Future versions may support Idempotency-Key headers.

---

# Security Requirements

Every protected endpoint must:

- Require JWT authentication
- Perform authorization
- Validate input
- Sanitize output
- Generate audit events where appropriate

Clinical records must never appear in API logs.

---

# API Documentation

Every endpoint specification should include:

- Purpose
- URL
- HTTP Method
- Authentication
- Authorization
- Path Parameters
- Query Parameters
- Request Body
- Success Response
- Error Responses
- Business Rules
- Audit Events

---

# API Modules

The SHIAS API is organized into the following modules.

## Authentication

```
/auth
```

---

## Patients

```
/patients
```

---

## Providers

```
/providers
```

---

## Pointer Registry

```
/pointers
```

---

## Consent

```
/consents
```

---

## Access Broker

```
/access
```

---

## Audit

```
/audit-events
```

---

# API Lifecycle

Every request follows this lifecycle:

1. Client sends request.
2. Authentication is verified.
3. Authorization is evaluated.
4. Input validation occurs.
5. Business rules are enforced.
6. Database operation executes.
7. Audit event is recorded (if required).
8. Standardized response is returned.

---

# Non-Goals

The API does not expose:

- Direct database access
- Clinical record storage
- Internal implementation details
- Administrative bypass operations

---

# Related Documents

- authentication.md
- patients.md
- providers.md
- pointers.md
- consent.md
- access-broker.md
- audit.md
- errors.md