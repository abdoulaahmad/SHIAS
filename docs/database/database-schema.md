# Database Schema

Version: 1.0

Status: Active

Owner: SHIAS Team

Last Updated: YYYY-MM-DD

---

# Purpose

This document defines the logical database schema for the Secure Health Identity & Access System (SHIAS).

It specifies:

- Tables
- Columns
- Data types
- Primary keys
- Foreign keys
- Constraints
- Relationships
- Enumerations

This document serves as the reference for the PostgreSQL implementation and Prisma schema.

---

# Design Conventions

## Primary Keys

Every table uses:

```
id UUID PRIMARY KEY
```

(UUIDv7)

---

## Timestamp Columns

Business tables include:

```
created_at TIMESTAMPTZ
updated_at TIMESTAMPTZ
```

Optional timestamps include:

```
deleted_at
approved_at
revoked_at
expires_at
verified_at
last_login_at
```

All timestamps are stored in UTC.

---

# Table: patients

Represents registered patients.

| Column | Type | Constraints |
|---------|------|-------------|
| id | UUID | PK |
| health_id | VARCHAR(32) | UNIQUE, NOT NULL |
| first_name | VARCHAR(100) | NOT NULL |
| last_name | VARCHAR(100) | NOT NULL |
| middle_name | VARCHAR(100) | NULL |
| email | VARCHAR(255) | UNIQUE, NOT NULL |
| phone | VARCHAR(20) | UNIQUE |
| date_of_birth | DATE | NOT NULL |
| gender | patient_gender | NOT NULL |
| password_hash | TEXT | NOT NULL |
| status | patient_status | DEFAULT ACTIVE |
| last_login_at | TIMESTAMPTZ | NULL |
| created_at | TIMESTAMPTZ | NOT NULL |
| updated_at | TIMESTAMPTZ | NOT NULL |
| deleted_at | TIMESTAMPTZ | NULL |

---

# Table: providers

Healthcare organizations.

| Column | Type |
|---------|------|
| id | UUID |
| provider_name | VARCHAR(255) |
| registration_number | VARCHAR(100) UNIQUE |
| provider_type | provider_type |
| email | VARCHAR(255) |
| phone | VARCHAR(20) |
| address | TEXT |
| verification_status | verification_status |
| verified_at | TIMESTAMPTZ |
| created_at | TIMESTAMPTZ |
| updated_at | TIMESTAMPTZ |
| deleted_at | TIMESTAMPTZ |

---

# Table: provider_users

Employees of providers.

| Column | Type |
|---------|------|
| id | UUID |
| provider_id | UUID FK |
| first_name | VARCHAR(100) |
| last_name | VARCHAR(100) |
| email | VARCHAR(255) UNIQUE |
| password_hash | TEXT |
| role | provider_role |
| status | user_status |
| last_login_at | TIMESTAMPTZ |
| created_at | TIMESTAMPTZ |
| updated_at | TIMESTAMPTZ |
| deleted_at | TIMESTAMPTZ |

Relationship

```
provider_users.provider_id

→ providers.id
```

---

# Table: metadata_pointers

Metadata describing where clinical records exist.

| Column | Type |
|---------|------|
| id | UUID |
| provider_id | UUID FK |
| patient_id | UUID FK |
| record_identifier | VARCHAR(255) |
| record_type | record_type |
| source_system | VARCHAR(100) |
| record_version | VARCHAR(30) |
| created_at | TIMESTAMPTZ |
| updated_at | TIMESTAMPTZ |
| deleted_at | TIMESTAMPTZ |

---

# Table: consents

Patient authorization.

| Column | Type |
|---------|------|
| id | UUID |
| patient_id | UUID FK |
| requesting_provider_id | UUID FK |
| source_provider_id | UUID FK |
| status | consent_status |
| purpose | consent_purpose |
| approved_at | TIMESTAMPTZ |
| revoked_at | TIMESTAMPTZ |
| expires_at | TIMESTAMPTZ |
| created_at | TIMESTAMPTZ |
| updated_at | TIMESTAMPTZ |

---

# Table: consent_pointers

Junction table between consent and pointers.

| Column | Type |
|---------|------|
| id | UUID |
| consent_id | UUID FK |
| pointer_id | UUID FK |
| permission | pointer_permission |
| created_at | TIMESTAMPTZ |

Unique Constraint

```
(consent_id, pointer_id)
```

---

# Table: access_tokens

Temporary authorization tokens.

| Column | Type |
|---------|------|
| id | UUID |
| consent_id | UUID FK |
| jwt_id | UUID |
| status | token_status |
| issued_at | TIMESTAMPTZ |
| expires_at | TIMESTAMPTZ |
| revoked_at | TIMESTAMPTZ |
| created_at | TIMESTAMPTZ |

---

# Table: sessions

Authenticated login sessions.

| Column | Type |
|---------|------|
| id | UUID |
| patient_id | UUID NULL |
| provider_user_id | UUID NULL |
| refresh_token_hash | TEXT |
| ip_address | INET |
| user_agent | TEXT |
| expires_at | TIMESTAMPTZ |
| revoked_at | TIMESTAMPTZ |
| created_at | TIMESTAMPTZ |

Exactly one of:

```
patient_id
provider_user_id
```

must be non-null.

---

# Table: audit_events

Immutable security logs.

| Column | Type |
|---------|------|
| id | UUID |
| actor_type | actor_type |
| actor_id | UUID |
| event_type | audit_event_type |
| resource_type | resource_type |
| resource_id | UUID |
| outcome | audit_outcome |
| correlation_id | UUID |
| ip_address | INET |
| user_agent | TEXT |
| metadata | JSONB |
| created_at | TIMESTAMPTZ |

Audit events are append-only.

---

# Table: system_settings

Platform configuration.

| Column | Type |
|---------|------|
| id | UUID |
| setting_key | VARCHAR(100) UNIQUE |
| setting_value | JSONB |
| description | TEXT |
| updated_at | TIMESTAMPTZ |

---

# Enumerations

## patient_status

```
ACTIVE
INACTIVE
SUSPENDED
```

---

## verification_status

```
PENDING
VERIFIED
REJECTED
```

---

## consent_status

```
PENDING
APPROVED
REJECTED
REVOKED
EXPIRED
```

---

## token_status

```
ACTIVE
EXPIRED
REVOKED
```

---

## provider_role

```
ADMIN
DOCTOR
NURSE
RECORDS_OFFICER
LAB_TECHNICIAN
PHARMACIST
```

---

## audit_outcome

```
SUCCESS
FAILURE
```

---

# Foreign Key Summary

| Child | Parent |
|---------|---------|
| provider_users.provider_id | providers.id |
| metadata_pointers.provider_id | providers.id |
| metadata_pointers.patient_id | patients.id |
| consents.patient_id | patients.id |
| consents.requesting_provider_id | providers.id |
| consents.source_provider_id | providers.id |
| consent_pointers.consent_id | consents.id |
| consent_pointers.pointer_id | metadata_pointers.id |
| access_tokens.consent_id | consents.id |

---

# Cascade Rules

| Parent | Child | Action |
|---------|-------|--------|
| Provider | Provider User | RESTRICT |
| Patient | Consent | RESTRICT |
| Provider | Metadata Pointer | RESTRICT |
| Consent | Access Token | RESTRICT |
| Consent | Consent Pointer | CASCADE |

Audit events are never cascaded.

---

# JSON Columns

The following columns use JSONB:

```
audit_events.metadata

system_settings.setting_value
```

JSON data should have a documented schema at the application level.

---

# Business Rules

- Every table uses UUID primary keys.
- Every business table contains timestamps.
- Audit events are immutable.
- Clinical records are never stored.
- Junction tables enforce many-to-many relationships.
- Foreign keys enforce referential integrity.
- Soft deletion is applied where appropriate.

---

# Related Documents

- overview.md
- entity-relationship.md
- constraints.md
- indexes.md
- soft-delete.md
- migrations.md