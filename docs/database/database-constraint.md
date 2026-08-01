# Database Indexes

Version: 1.0

Status: Active

Owner: SHIAS Team

Last Updated: YYYY-MM-DD

---

# Purpose

This document defines the indexing strategy for the Secure Health Identity & Access System (SHIAS).

Indexes improve query performance by reducing the amount of data scanned during searches, filtering, sorting, and joins.

Every index should have a measurable purpose.

---

# Indexing Principles

The indexing strategy follows these principles:

- Index columns used for searching.
- Index all foreign keys.
- Index unique business identifiers.
- Prefer composite indexes for common query patterns.
- Avoid unnecessary indexes.
- Review indexes periodically as usage evolves.

---

# Primary Key Indexes

Every table has a primary key index.

| Table | Primary Key |
|---------|-------------|
| patients | id |
| providers | id |
| provider_users | id |
| metadata_pointers | id |
| consents | id |
| consent_pointers | id |
| access_tokens | id |
| sessions | id |
| audit_events | id |
| system_settings | id |

---

# Unique Indexes

## patients

| Column | Purpose |
|---------|----------|
| health_id | Business identifier |
| email | Authentication |
| phone | Prevent duplicate accounts |

---

## providers

| Column | Purpose |
|---------|----------|
| registration_number | Regulatory uniqueness |

---

## provider_users

| Column | Purpose |
|---------|----------|
| email | Authentication |

---

## system_settings

| Column | Purpose |
|---------|----------|
| setting_key | Fast configuration lookup |

---

# Foreign Key Indexes

Foreign key columns should always be indexed.

| Table | Column |
|---------|--------|
| provider_users | provider_id |
| metadata_pointers | provider_id |
| metadata_pointers | patient_id |
| consents | patient_id |
| consents | requesting_provider_id |
| consents | source_provider_id |
| consent_pointers | consent_id |
| consent_pointers | pointer_id |
| access_tokens | consent_id |
| sessions | patient_id |
| sessions | provider_user_id |

---

# Composite Indexes

Composite indexes optimize common application queries.

---

## Patients

### Search by status

```
(status, created_at)
```

Supports:

- Active patients
- Recently registered patients

---

## Providers

### Verification queue

```
(verification_status, created_at)
```

Supports:

- Pending verification
- Recently submitted providers

---

## Provider Users

### Provider directory

```
(provider_id, status)
```

Supports:

- Active users within a provider

---

## Metadata Pointers

### Patient record discovery

```
(patient_id, record_type)
```

Supports:

- Finding records by patient
- Filtering by record type

---

### Provider record lookup

```
(provider_id, patient_id)
```

Supports:

- Provider-specific patient records

---

## Consents

### Patient consent history

```
(patient_id, created_at DESC)
```

Supports:

- Viewing consent history

---

### Provider requests

```
(requesting_provider_id, status)
```

Supports:

- Outstanding requests
- Provider dashboards

---

### Source provider

```
(source_provider_id, status)
```

Supports:

- Incoming consent requests

---

## Consent Pointers

```
(consent_id, pointer_id)
```

Unique index.

Supports:

- Permission checks
- Consent expansion

---

## Access Tokens

```
(consent_id, status)
```

Supports:

- Token validation
- Token revocation

---

## Sessions

### Active sessions

```
(patient_id, revoked_at)
```

```
(provider_user_id, revoked_at)
```

Supports:

- Listing active sessions

---

## Audit Events

### Event timeline

```
(created_at DESC)
```

---

### Actor history

```
(actor_type, actor_id)
```

---

### Resource history

```
(resource_type, resource_id)
```

---

### Event type

```
(event_type, created_at DESC)
```

---

# Partial Indexes

Partial indexes reduce storage and improve performance.

---

## Active Patients

```sql
WHERE deleted_at IS NULL
```

---

## Active Providers

```sql
WHERE deleted_at IS NULL
```

---

## Active Provider Users

```sql
WHERE deleted_at IS NULL
```

---

## Active Metadata Pointers

```sql
WHERE deleted_at IS NULL
```

---

## Active Sessions

```sql
WHERE revoked_at IS NULL
```

---

## Active Access Tokens

```sql
WHERE status = 'ACTIVE'
```

---

# Full-Text Search (Future)

Future versions may introduce PostgreSQL full-text search.

Potential searchable fields:

Patients

- first_name
- last_name
- health_id

Providers

- provider_name
- registration_number

---

# JSONB Indexes

## audit_events.metadata

Future versions may create a GIN index if metadata querying becomes common.

---

## system_settings.setting_value

GIN index may be added if configuration queries require JSON filtering.

---

# Ordering Indexes

Indexes should support default ordering.

Example

Patients

```
(created_at DESC)
```

Providers

```
(created_at DESC)
```

Audit

```
(created_at DESC)
```

---

# Query Optimization Goals

Indexes should optimize:

- Authentication
- Dashboard queries
- Consent workflows
- Record discovery
- Audit investigations
- Pagination
- Administrative reporting

---

# Maintenance

Indexes should be reviewed regularly.

Monitor:

- Index size
- Index usage
- Sequential scans
- Slow queries

Unused indexes should be removed.

---

# Business Rules

- Every foreign key must be indexed.
- Business identifiers must be uniquely indexed.
- Composite indexes should match common query patterns.
- Partial indexes should be used for active records.
- Indexes should be validated using production query plans.

---

# Related Documents

- overview.md
- schema.md
- constraints.md
- migrations.md
- soft-delete.md