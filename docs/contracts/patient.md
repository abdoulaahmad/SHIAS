# Patients API

Version: 1.0

Status: Active

Owner: SHIAS Team

Last Updated: YYYY-MM-DD

---

# Purpose

This document defines the Patient Management API for the Secure Health Identity & Access System (SHIAS).

The Patient API allows patients to register, manage their profile, retrieve their Health ID, and view their own information.

Patient records represent identities only. Clinical records are never stored by SHIAS.

---

# Responsibilities

The Patient API supports:

- Patient registration
- Patient profile retrieval
- Patient profile updates
- Health ID retrieval
- Patient listing (administrative)
- Patient deactivation (future)

---

# Resource

```
/api/v1/patients
```

---

# Endpoints

| Method | Endpoint | Description |
|---------|----------|-------------|
| POST | `/patients` | Register patient |
| GET | `/patients/me` | Get current patient |
| GET | `/patients/{patientId}` | Get patient by ID |
| PATCH | `/patients/{patientId}` | Update patient |
| GET | `/patients/{patientId}/health-id` | Retrieve Health ID |
| GET | `/patients` | List patients (Admin) |

---

# POST /patients

## Purpose

Register a new patient.

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
  "firstName": "Amina",
  "lastName": "Bello",
  "dateOfBirth": "2003-05-27",
  "gender": "FEMALE",
  "email": "amina@example.com",
  "phoneNumber": "+2348012345678",
  "password": "StrongPassword123!"
}
```

---

## Success Response

HTTP 201

```json
{
  "success": true,
  "message": "Patient registered successfully.",
  "data": {
    "patientId": "uuid",
    "healthId": "SHIAS-000001"
  }
}
```

---

## Error Responses

### 409 Conflict

```json
{
  "success": false,
  "message": "Email already exists."
}
```

---

### 422 Validation Failed

```json
{
  "success": false,
  "message": "Validation failed."
}
```

---

## Business Rules

- Email must be unique.
- Phone number must be unique.
- One Health ID is generated automatically.
- Health ID cannot be modified.
- Registration creates an audit event.

---

# GET /patients/me

## Purpose

Return the authenticated patient's profile.

---

## Authentication

Bearer Token

---

## Authorization

Patient

---

## Success Response

HTTP 200

```json
{
  "success": true,
  "data": {
    "patientId": "uuid",
    "healthId": "SHIAS-000001",
    "firstName": "Amina",
    "lastName": "Bello",
    "email": "amina@example.com",
    "phoneNumber": "+2348012345678",
    "status": "ACTIVE",
    "createdAt": "2026-08-01T10:15:00Z"
  }
}
```

---

## Business Rules

- Patients may only access their own profile.
- Soft-deleted accounts cannot authenticate.

---

# GET /patients/{patientId}

## Purpose

Retrieve a patient by ID.

---

## Authentication

Bearer Token

---

## Authorization

Patient (self) or Administrator

---

## Path Parameters

| Name | Type |
|------|------|
| patientId | UUID |

---

## Success Response

HTTP 200

```json
{
  "success": true,
  "data": {
    "patientId": "uuid",
    "healthId": "SHIAS-000001",
    "firstName": "Amina",
    "lastName": "Bello",
    "email": "amina@example.com",
    "phoneNumber": "+2348012345678",
    "status": "ACTIVE"
  }
}
```

---

## Error Responses

404 Not Found

```json
{
  "success": false,
  "message": "Patient not found."
}
```

---

## Business Rules

- Patients may only retrieve their own profile.
- Administrators may retrieve any patient profile.
- Sensitive fields must not be exposed.

---

# PATCH /patients/{patientId}

## Purpose

Update patient information.

---

## Authentication

Bearer Token

---

## Authorization

Patient (self)

---

## Request Body

```json
{
  "firstName": "Amina",
  "lastName": "Muhammad",
  "phoneNumber": "+2348099999999"
}
```

---

## Success Response

HTTP 200

```json
{
  "success": true,
  "message": "Profile updated successfully."
}
```

---

## Updatable Fields

- First Name
- Last Name
- Phone Number

---

## Non-Updatable Fields

- Patient ID
- Health ID
- Email
- Date of Birth
- Registration Date

---

## Business Rules

- Health ID is immutable.
- Updates are audited.
- Validation occurs before persistence.

---

# GET /patients/{patientId}/health-id

## Purpose

Retrieve a patient's assigned Health ID.

---

## Authentication

Bearer Token

---

## Authorization

Patient (self)

---

## Success Response

HTTP 200

```json
{
  "success": true,
  "data": {
    "healthId": "SHIAS-000001"
  }
}
```

---

## Business Rules

- Health ID never changes.
- Only the owning patient may retrieve it.

---

# GET /patients

## Purpose

List registered patients.

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
| search | Search by name or Health ID |
| status | ACTIVE, INACTIVE |

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
      "total": 125
    }
  }
}
```

---

## Business Rules

- Supports pagination.
- Supports filtering.
- Supports searching.
- Excludes sensitive authentication data.

---

# Patient Status

Supported statuses:

| Status | Description |
|--------|-------------|
| ACTIVE | Patient may use the platform |
| INACTIVE | Account temporarily disabled |
| SUSPENDED | Administrative suspension |

---

# Validation Rules

| Field | Rules |
|------|-------|
| firstName | Required, 2–100 characters |
| lastName | Required, 2–100 characters |
| email | Required, valid email, unique |
| phoneNumber | Required, E.164 format, unique |
| password | See Authentication API |
| dateOfBirth | Required, ISO 8601 date |
| gender | Required, valid enum |

---

# Audit Events

The following actions generate audit events:

- Patient Registered
- Patient Updated
- Patient Profile Viewed
- Health ID Retrieved
- Patient Listed (Admin)

---

# Security Requirements

The Patient API must:

- Require HTTPS in production.
- Enforce JWT authentication for protected endpoints.
- Prevent unauthorized profile access.
- Never expose password hashes.
- Never expose refresh tokens.
- Never expose clinical information.

---

# Related Documents

- api-overview.md
- authentication.md
- consent.md
- business-rules.md
- domain-model.md