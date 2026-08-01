# Entity Relationship Model

Version: 1.0

Status: Active

Owner: SHIAS Team

Last Updated: YYYY-MM-DD

---

# Purpose

This document defines the logical entity-relationship model for the Secure Health Identity & Access System (SHIAS).

The model establishes:

- Business entities
- Relationships
- Ownership
- Cardinality
- Referential integrity

This document is the blueprint for the physical PostgreSQL schema and Prisma models.

---

# Design Principles

The entity model follows these principles:

- Every entity has a single owner.
- Every relationship is explicit.
- Clinical records are never stored.
- UUIDv7 is used for all primary keys.
- Foreign keys enforce ownership.
- Business entities support soft deletion where appropriate.

---

# Entity Overview

| Entity | Purpose |
|---------|---------|
| Patient | Represents an individual receiving healthcare |
| Provider | Represents a healthcare organization |
| Provider User | Represents an authenticated user within a provider organization |
| Metadata Pointer | Reference to a clinical record held by a provider |
| Consent | Patient authorization for record sharing |
| Access Token | Temporary authorization to retrieve records |
| Session | Authenticated login session |
| Audit Event | Immutable record of system activity |
| System Setting | Platform configuration |

---

# High-Level Relationship Diagram

```text
                +----------------+
                |    Patient     |
                +----------------+
                        |
                        | 1
                        |
                        | N
                +----------------+
                |    Consent     |
                +----------------+
                  |            |
                  |            |
                  |            |
                  |            |
                  ▼            ▼
         +--------------+   +----------------+
         | Access Token |   | MetadataPointer|
         +--------------+   +----------------+
                                 |
                                 |
                                 |
                                 ▼
                         +----------------+
                         |    Provider    |
                         +----------------+
                                 |
                                 |
                                 |
                                 ▼
                         +----------------+
                         | Provider User  |
                         +----------------+

Patient
   |
   ▼
Session

Everything generates

          ▼

+----------------+
|  Audit Event   |
+----------------+
```

---

# Patient

Represents a registered patient.

## Owns

- Consents
- Sessions

## Relationships

| Relationship | Cardinality |
|--------------|-------------|
| Patient → Consent | One-to-Many |
| Patient → Session | One-to-Many |

---

# Provider

Represents a healthcare organization.

Examples

- Hospital
- Clinic
- Laboratory
- Pharmacy

## Owns

- Provider Users
- Metadata Pointers

## Relationships

| Relationship | Cardinality |
|--------------|-------------|
| Provider → Provider User | One-to-Many |
| Provider → Metadata Pointer | One-to-Many |

---

# Provider User

Represents an authenticated employee of a provider organization.

Examples

- Doctor
- Nurse
- Medical Records Officer
- Administrator

Each Provider User belongs to exactly one Provider.

## Relationships

| Relationship | Cardinality |
|--------------|-------------|
| Provider User → Provider | Many-to-One |

---

# Metadata Pointer

Represents metadata describing where a clinical record exists.

It never contains medical information.

Stores:

- Record identifier
- Record type
- Source provider
- Creation date
- Optional metadata

## Relationships

| Relationship | Cardinality |
|--------------|-------------|
| Provider → Metadata Pointer | One-to-Many |

Pointers may be referenced by multiple consent records over time.

---

# Consent

Represents patient authorization for healthcare data sharing.

Each consent belongs to one patient.

A consent authorizes:

- One requesting provider
- One source provider
- One or more metadata pointers

## Relationships

| Relationship | Cardinality |
|--------------|-------------|
| Patient → Consent | One-to-Many |
| Consent → Metadata Pointer | Many-to-Many |
| Consent → Access Token | One-to-Many |

---

# Access Token

Represents a temporary authorization issued after consent approval.

Each token belongs to one consent.

## Relationships

| Relationship | Cardinality |
|--------------|-------------|
| Consent → Access Token | One-to-Many |

---

# Session

Represents an authenticated login session.

Sessions belong to either:

- Patient
- Provider User

Exactly one owner must exist.

## Relationships

| Relationship | Cardinality |
|--------------|-------------|
| Patient → Session | One-to-Many |
| Provider User → Session | One-to-Many |

---

# Audit Event

Represents an immutable system event.

Examples

- Login
- Consent approval
- Pointer registration
- Token issuance

Audit events reference business entities but are never owned by them.

Relationships are logical rather than cascading.

---

# System Setting

Represents platform configuration.

Examples

- Token lifetime
- Maintenance mode
- Rate limits
- Feature flags

Normally contains only a small number of rows.

---

# Cardinality Summary

| Relationship | Cardinality |
|--------------|-------------|
| Patient → Consent | 1 : N |
| Patient → Session | 1 : N |
| Provider → Provider User | 1 : N |
| Provider → Metadata Pointer | 1 : N |
| Consent → Access Token | 1 : N |
| Consent ↔ Metadata Pointer | N : N |

---

# Ownership Rules

| Entity | Owner |
|---------|-------|
| Consent | Patient |
| Session | Patient or Provider User |
| Provider User | Provider |
| Metadata Pointer | Provider |
| Access Token | Consent |
| Audit Event | System |
| System Setting | System |

---

# Referential Integrity

Foreign keys enforce all ownership relationships.

Deletion rules:

| Parent | Child | Action |
|---------|-------|--------|
| Patient | Consent | RESTRICT |
| Patient | Session | CASCADE |
| Provider | Provider User | RESTRICT |
| Provider | Metadata Pointer | RESTRICT |
| Consent | Access Token | RESTRICT |

Audit events are never cascaded or deleted.

---

# Lifecycle Overview

## Patient

```
Registered
    │
Active
    │
Inactive
    │
Soft Deleted
```

---

## Provider

```
Pending
    │
Verified
    │
Suspended
    │
Inactive
```

---

## Consent

```
Pending
     │
Approved
     │
 ┌───┴────┐
 │        │
Expired Revoked
```

---

## Access Token

```
Issued
   │
Active
   │
 ┌─┴─────┐
 │       │
Expired Revoked
```

---

# Data Ownership Boundaries

The SHIAS database owns:

- Identity
- Provider registry
- Metadata pointers
- Consent
- Authorization
- Audit

Healthcare providers own:

- Medical records
- Laboratory reports
- Diagnoses
- Imaging
- Prescriptions
- Clinical notes

These records are never copied into SHIAS.

---

# Future Relationships

Future versions may introduce:

- Care Teams
- Organizations
- Facilities
- Departments
- Devices
- Notifications
- API Clients
- OAuth Applications
- External Identity Providers

These entities are intentionally excluded from the MVP.

---

# Business Rules

- Every entity has exactly one owner.
- Metadata pointers never contain clinical content.
- Patients own consent decisions.
- Providers own metadata pointers.
- Access tokens cannot exist without consent.
- Audit events are immutable.
- Referential integrity is enforced through foreign keys.

---

# Related Documents

- overview.md
- schema.md
- constraints.md
- indexes.md
- soft-delete.md
- domain-model.md
- business-rules.md