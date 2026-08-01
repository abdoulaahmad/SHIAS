# Domain Model

Version: 1.0

Status: Active

Owner: SHIAS Team

Last Updated: YYYY-MM-DD

---

# Purpose

This document defines the core business entities of the Secure Health Identity & Access System (SHIAS) and the relationships between them.

The domain model provides a technology-independent representation of the business concepts used throughout SHIAS. It serves as the foundation for the database schema, REST APIs, services, and business rules.

---

# Overview

SHIAS is built around a small number of core business entities.

These entities represent the real-world concepts required to enable secure, consent-driven healthcare interoperability.

The primary domain entities are:

- Patient
- Health ID
- Healthcare Provider
- Metadata Pointer
- Consent
- Access Token
- Audit Event

---

# Domain Relationships

```
                    Patient
                       │
                       │ owns
                       ▼
                  Health ID
                       │
                       │ identifies
                       ▼
               Metadata Pointer
                       │
          belongs to   │
                       ▼
            Source Provider
                       ▲
                       │
      receives token   │
                       │
               Access Token
                       ▲
                       │ issued from
                       │
                    Consent
                       ▲
                       │ requested by
                       │
          Requesting Provider

Every security-sensitive action

            ▼

         Audit Event
```

---

# Patient

## Description

A patient is an individual registered within SHIAS.

The patient owns a unique Health ID and controls consent decisions for sharing medical records.

---

## Responsibilities

- Register with SHIAS
- Authenticate
- View Health ID
- Approve consent requests
- Reject consent requests
- Revoke consent
- Review consent history

---

## Attributes

- Patient ID
- Health ID
- Full Name
- Date of Birth
- Gender
- Phone Number
- Email Address
- Status
- Created At
- Updated At

---

## Relationships

- One Patient has one Health ID.
- One Patient may have many Consent records.
- One Patient may have many Metadata Pointers.
- One Patient may have many Audit Events.

---

# Health ID

## Description

A Health ID is the unique identifier assigned to a patient.

It enables healthcare providers to discover available medical records without exposing sensitive information.

---

## Rules

- Globally unique.
- Never reused.
- Assigned once.
- Immutable.

---

## Relationships

- Belongs to one Patient.
- Used by many Metadata Pointers.

---

# Healthcare Provider

## Description

A healthcare provider is an organization participating in SHIAS.

Providers maintain patient medical records and exchange information through SHIAS.

---

## Responsibilities

- Register with SHIAS
- Authenticate
- Register Metadata Pointers
- Request patient consent
- Retrieve medical records
- Validate access tokens

---

## Attributes

- Provider ID
- Organization Name
- Registration Number
- Contact Email
- Contact Phone
- Status
- Created At

---

## Relationships

- One Provider owns many Metadata Pointers.
- One Provider submits many Consent Requests.
- One Provider generates many Audit Events.

---

# Metadata Pointer

## Description

A Metadata Pointer describes where a patient's medical record exists.

It never stores the clinical record itself.

---

## Purpose

Enable record discovery.

---

## Attributes

- Pointer ID
- Health ID
- Provider ID
- Record Type
- Record Identifier
- Created At
- Updated At

---

## Rules

Must not contain:

- Diagnoses
- Medications
- Laboratory Results
- Clinical Notes
- Medical Images

---

## Relationships

- Belongs to one Patient.
- Belongs to one Provider.

---

# Consent

## Description

Consent represents a patient's authorization allowing one healthcare provider to access records owned by another provider.

---

## Attributes

- Consent ID
- Patient ID
- Source Provider
- Requesting Provider
- Purpose
- Status
- Granted At
- Expires At

---

## States

- Pending
- Approved
- Rejected
- Revoked
- Expired

---

## Relationships

- Belongs to one Patient.
- References one Source Provider.
- References one Requesting Provider.
- May generate one Access Token.

---

# Access Token

## Description

A temporary authorization credential issued after successful consent verification.

The Source Provider validates the token before releasing records.

---

## Attributes

- Token ID
- Consent ID
- Issued At
- Expires At
- Status

---

## Rules

- Valid for five minutes.
- Single purpose.
- Cannot be reused after expiration.

---

## Relationships

- Generated from one Consent.
- Used by one Requesting Provider.
- Validated by one Source Provider.

---

# Audit Event

## Description

An immutable record of security-sensitive activity.

---

## Attributes

- Audit ID
- Event Type
- Actor
- Resource
- Timestamp
- Outcome
- IP Address

---

## Examples

- Login
- Logout
- Patient Registration
- Provider Registration
- Consent Approved
- Consent Rejected
- Pointer Registered
- Token Issued
- Record Retrieved

---

## Rules

- Immutable.
- Never deleted.
- Never modified.
- Never stores clinical data.

---

# Entity Relationships

| Entity | Relationship |
|---------|--------------|
| Patient | Owns one Health ID |
| Patient | Has many Consents |
| Patient | Has many Metadata Pointers |
| Patient | Has many Audit Events |
| Provider | Owns many Metadata Pointers |
| Provider | Creates many Consent Requests |
| Provider | Generates many Audit Events |
| Consent | Produces one Access Token |
| Access Token | Authorizes one Record Retrieval |

---

# Aggregate Boundaries

The domain is organized into the following aggregates:

## Identity Aggregate

- Patient
- Health ID

---

## Provider Aggregate

- Healthcare Provider

---

## Pointer Aggregate

- Metadata Pointer

---

## Consent Aggregate

- Consent
- Access Token

---

## Audit Aggregate

- Audit Event

Each aggregate owns its own business rules and lifecycle.

---

# Domain Invariants

The following conditions must always be true:

- Every Patient has exactly one Health ID.
- Every Metadata Pointer references an existing Patient.
- Every Metadata Pointer references an existing Provider.
- Every Consent references both a Source Provider and a Requesting Provider.
- Every Access Token references a valid Consent.
- Every Audit Event references a valid actor.
- SHIAS never stores clinical records.

---

# Future Domain Entities

The following entities are planned for future releases:

- Notification
- Provider Federation
- National Registry
- FHIR Resource
- Emergency Access Request
- Device Session

These entities are intentionally excluded from the MVP.

---

# Related Documents

- business-rules.md
- terminology.md
- system-overview.md
- container-architecture.md
- database/schema.md (future)