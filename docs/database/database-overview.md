# Database Overview

Version: 1.0

Status: Active

Owner: SHIAS Team

Last Updated: YYYY-MM-DD

---

# Purpose

This document defines the database architecture, principles, conventions, and design standards for the Secure Health Identity & Access System (SHIAS).

The database stores operational data required for identity management, provider management, metadata pointers, consent management, access authorization, and auditing.

The database never stores patient clinical records.

---

# Database Objectives

The SHIAS database is designed to provide:

- Strong data integrity
- High reliability
- Security by design
- Referential integrity
- Scalability
- Maintainability
- Clear ownership boundaries

---

# Database Engine

Primary Database

```
PostgreSQL
```

Reasoning:

- ACID compliant
- Excellent concurrency
- Mature ecosystem
- Strong indexing support
- Native UUID support
- Excellent Prisma integration

---

# Database Ownership

The PostgreSQL database is owned exclusively by the Core API.

Applications must never communicate directly with the database.

```
Patient Portal
        │
Provider Portal
        │
Reference Provider
        │
        ▼
     Core API
        │
        ▼
    PostgreSQL
```

---

# Database Scope

The database stores:

- Patient identities
- Provider organizations
- Provider users
- Metadata pointers
- Consent records
- Access tokens
- Audit events
- Authentication sessions
- System configuration

---

# Out of Scope

The database must never store:

- Clinical notes
- Laboratory reports
- Medical images
- Prescriptions
- Diagnoses
- Vital signs
- Electronic Health Records (EHR)

These remain with healthcare providers.

---

# Database Design Principles

The database follows these principles:

- Normalize data to at least Third Normal Form (3NF).
- Use foreign keys to enforce relationships.
- Prefer immutable identifiers.
- Use UTC timestamps.
- Avoid duplicated data.
- Soft-delete business entities where appropriate.
- Maintain complete auditability.

---

# Identifier Strategy

All primary keys use UUID Version 7 (UUIDv7).

Example

```
01986d55-0d2c-7f1f-bb17-6fdc3f1a5d91
```

UUIDv7 provides:

- Global uniqueness
- Time-ordered inserts
- Better index locality than random UUIDs
- Easier horizontal scaling

Business identifiers (such as Health IDs) are stored separately from primary keys.

---

# Naming Conventions

## Tables

Use plural snake_case names.

Examples:

```
patients
providers
provider_users
metadata_pointers
consents
access_tokens
audit_events
sessions
```

---

## Columns

Use snake_case.

Examples

```
first_name
last_name
created_at
updated_at
provider_id
```

---

## Primary Keys

Every table uses:

```
id UUID
```

Example

```
patients.id
providers.id
consents.id
```

---

## Foreign Keys

Foreign key columns use:

```
<referenced_table>_id
```

Examples

```
patient_id
provider_id
consent_id
pointer_id
```

---

# Timestamp Columns

Every business table contains:

```
created_at
updated_at
```

Where appropriate, additional timestamps include:

```
deleted_at
approved_at
revoked_at
expires_at
last_login_at
```

All timestamps use UTC.

---

# Soft Delete Strategy

Business entities should be soft deleted.

Example:

```
deleted_at TIMESTAMP NULL
```

A NULL value indicates the resource is active.

Deleted rows remain available for audit and recovery.

Audit events are never soft deleted.

---

# Status Fields

Status values should be represented using enums where appropriate.

Examples

Patient Status

- ACTIVE
- INACTIVE
- SUSPENDED

Consent Status

- PENDING
- APPROVED
- REJECTED
- REVOKED
- EXPIRED

Provider Verification

- PENDING
- VERIFIED
- REJECTED

---

# Relationships

Relationships use foreign key constraints.

Examples

Patient

↓

Consent

↓

Access Token

Provider

↓

Metadata Pointer

↓

Consent

↓

Audit Event

Every relationship should enforce referential integrity.

---

# Constraints

The database enforces:

- Primary Keys
- Foreign Keys
- Unique Constraints
- Check Constraints
- Not Null Constraints

Business logic should not rely solely on application code.

---

# Transactions

The following operations must execute within database transactions:

- Patient registration
- Provider registration
- Consent approval
- Token issuance
- Pointer registration
- Provider verification

Transactions ensure data consistency.

---

# Indexing Principles

Indexes should be created for:

- Primary Keys
- Foreign Keys
- Frequently searched fields
- Unique identifiers

Examples

```
health_id
email
registration_number
status
created_at
```

---

# Data Retention

Operational data follows business retention policies.

Minimum audit retention:

```
7 years
```

Expired access tokens may be archived according to operational requirements.

---

# Security Principles

The database must:

- Require authenticated access.
- Restrict access to the Core API.
- Encrypt connections using TLS.
- Never expose credentials.
- Protect backups.
- Prevent unauthorized schema changes.

---

# Backup Strategy

Minimum requirements:

- Daily automated backups
- Point-in-time recovery (PITR)
- Encrypted backup storage
- Periodic restore testing

---

# Performance Principles

The database should:

- Minimize unnecessary joins.
- Use indexes appropriately.
- Avoid redundant data.
- Keep transactions short.
- Support efficient pagination.

---

# Future Scalability

Potential future enhancements include:

- Read replicas
- Partitioning
- Archival storage
- Materialized views
- Full-text search
- Multi-region replication

These are outside the MVP.

---

# Database Modules

The database is organized into the following logical domains:

Identity

- patients
- provider_users
- sessions

Providers

- providers

Registry

- metadata_pointers

Consent

- consents

Authorization

- access_tokens

Audit

- audit_events

Configuration

- system_settings

---

# Business Rules

- Clinical records must never be stored.
- UUIDs are the primary identifiers.
- Every table must have timestamps.
- Foreign keys must enforce ownership.
- Audit events are immutable.
- Soft deletes are preferred over hard deletes for business entities.
- Database access is limited to the Core API.

---

# Related Documents

- entity-relationship.md
- schema.md
- constraints.md
- indexes.md
- soft-delete.md
- audit-storage.md
- domain-model.md