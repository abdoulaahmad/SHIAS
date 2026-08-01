# Pointer Registry API

Version: 1.0

Status: Active

Owner: SHIAS Team

Last Updated: YYYY-MM-DD

---

# Purpose

This document defines the Pointer Registry API for the Secure Health Identity & Access System (SHIAS).

The Pointer Registry allows verified healthcare providers to register and discover metadata describing the location of patient medical records.

The registry stores metadata only. Clinical records remain under the control of the Source Provider.

---

# Responsibilities

The Pointer Registry API supports:

- Register metadata pointers
- Retrieve metadata pointers
- Search by Health ID
- Update metadata pointers
- Deactivate metadata pointers
- List pointers

---

# Resource

```
/api/v1/pointers
```

---

# Pointer Model

A Metadata Pointer represents a reference to a clinical record.

It contains information describing:

- who owns the record
- which patient it belongs to
- what type of record it is
- where it exists

It never contains the clinical record itself.

---

# Stored Metadata

Examples of stored metadata include:

- Pointer ID
- Patient Health ID
- Provider ID
- Record Identifier
- Record Type
- Record Category
- Record Date
- Created At
- Updated At
- Status

---

# Never Stored

The Pointer Registry must never store:

- Diagnoses
- Laboratory results
- Prescriptions
- Clinical notes
- Medical images
- PDF reports
- Patient history
- Vital signs

---

# Endpoints

| Method | Endpoint | Description |
|---------|----------|-------------|
| POST | `/pointers` | Register pointer |
| GET | `/pointers/{pointerId}` | Retrieve pointer |
| PATCH | `/pointers/{pointerId}` | Update pointer |
| DELETE | `/pointers/{pointerId}` | Deactivate pointer |
| GET | `/pointers` | Search pointers |

---

# POST /pointers

## Purpose

Register a new metadata pointer.

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
  "recordIdentifier": "REC-984732",
  "recordType": "LAB_RESULT",
  "recordCategory": "PATHOLOGY",
  "recordDate": "2026-07-18"
}
```

---

## Success Response

HTTP 201

```json
{
  "success": true,
  "message": "Pointer registered successfully.",
  "data": {
    "pointerId": "uuid"
  }
}
```

---

## Business Rules

- Provider must be verified.
- Patient must exist.
- Health ID must exist.
- Pointer ID is generated automatically.
- Registration is audited.

---

# GET /pointers/{pointerId}

## Purpose

Retrieve metadata for a pointer.

---

## Authentication

Bearer Token

---

## Authorization

Verified Provider

---

## Success Response

```json
{
  "success": true,
  "data": {
    "pointerId": "uuid",
    "providerId": "uuid",
    "healthId": "SHIAS-000001",
    "recordIdentifier": "REC-984732",
    "recordType": "LAB_RESULT",
    "recordCategory": "PATHOLOGY",
    "recordDate": "2026-07-18",
    "status": "ACTIVE"
  }
}
```

---

## Business Rules

Only metadata is returned.

No clinical information is exposed.

---

# PATCH /pointers/{pointerId}

## Purpose

Update pointer metadata.

---

## Authentication

Bearer Token

---

## Authorization

Owning Provider

---

## Request Body

```json
{
  "recordCategory": "LABORATORY"
}
```

---

## Success Response

```json
{
  "success": true,
  "message": "Pointer updated successfully."
}
```

---

## Business Rules

The owning provider may update metadata only.

The Health ID cannot be modified.

The Provider ID cannot be modified.

---

# DELETE /pointers/{pointerId}

## Purpose

Deactivate a metadata pointer.

---

## Authentication

Bearer Token

---

## Authorization

Owning Provider

---

## Response

HTTP 204 No Content

---

## Business Rules

Pointers are soft deleted.

Historical audit records remain.

---

# GET /pointers

## Purpose

Search for metadata pointers.

---

## Authentication

Bearer Token

---

## Authorization

Verified Provider

---

## Query Parameters

| Parameter | Description |
|-----------|-------------|
| healthId | Patient Health ID |
| recordType | Type of record |
| providerId | Source Provider |
| page | Page number |
| limit | Results per page |

---

## Example

```
GET /api/v1/pointers?healthId=SHIAS-000001
```

---

## Success Response

```json
{
  "success": true,
  "data": {
    "items": [
      {
        "pointerId": "uuid",
        "providerId": "uuid",
        "recordType": "LAB_RESULT",
        "recordCategory": "PATHOLOGY",
        "recordDate": "2026-07-18"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 1
    }
  }
}
```

---

## Business Rules

Only metadata is returned.

No clinical records are included.

Search operations are audited.

---

# Pointer Status

| Status | Description |
|---------|-------------|
| ACTIVE | Available for discovery |
| INACTIVE | Hidden from discovery |
| ARCHIVED | Historical reference only |

---

# Record Types

Supported values include:

- ALLERGY
- DIAGNOSIS
- ENCOUNTER
- IMMUNIZATION
- LAB_RESULT
- MEDICATION
- PRESCRIPTION
- PROCEDURE
- RADIOLOGY
- REFERRAL
- SURGERY
- VITAL_SIGNS
- DISCHARGE_SUMMARY
- OTHER

---

# Validation Rules

| Field | Rules |
|------|-------|
| healthId | Required, valid Health ID |
| providerId | Derived from authenticated provider |
| recordIdentifier | Required, unique within provider |
| recordType | Required enum |
| recordCategory | Required |
| recordDate | ISO 8601 date |

---

# Security Rules

The Pointer Registry must:

- Never expose clinical records.
- Never expose internal provider databases.
- Require verified providers.
- Audit every create, update, delete, and search operation.
- Reject inactive providers.

---

# Audit Events

Generated events include:

- Pointer Registered
- Pointer Updated
- Pointer Deactivated
- Pointer Retrieved
- Pointer Search

---

# Example Workflow

1. A verified provider creates a patient's laboratory record in its own Electronic Health Record (EHR) system.
2. The provider registers a metadata pointer with SHIAS.
3. Another verified provider searches using the patient's Health ID.
4. SHIAS returns only the metadata pointer.
5. The requesting provider initiates the consent workflow before any clinical record can be accessed.

---

# Related Documents

- api-overview.md
- providers.md
- consent.md
- access-broker.md
- domain-model.md
- communication.md
- data-flow.md