# Soft Delete Strategy

Version: 1.0

Status: Active

Owner: SHIAS Team

Last Updated: YYYY-MM-DD

---

# Purpose

This document defines the soft deletion strategy for the Secure Health Identity & Access System (SHIAS).

Soft deletion allows business entities to be marked as deleted without permanently removing them from the database.

This preserves historical information for auditing, recovery, legal compliance, and system integrity.

---

# Design Principles

The SHIAS platform follows these principles:

- Business records are rarely permanently deleted.
- Deleted data remains recoverable.
- Audit history is preserved.
- Relationships remain consistent.
- Users cannot access deleted records unless authorized.

---

# Soft Delete Model

Entities supporting soft deletion include:

- Patients
- Providers
- Provider Users
- Metadata Pointers

Soft deletion is implemented using:

```sql
deleted_at TIMESTAMPTZ NULL
```

Meaning:

```
NULL
```

Resource is active.

```
2026-08-18T10:45:00Z
```

Resource has been soft deleted.

---

# Supported Entities

| Entity | Soft Delete |
|----------|-------------|
| Patients | ✅ |
| Providers | ✅ |
| Provider Users | ✅ |
| Metadata Pointers | ✅ |
| Consents | ❌ |
| Access Tokens | ❌ |
| Sessions | ❌ |
| Audit Events | ❌ |
| System Settings | ❌ |

---

# Why Some Entities Are Not Soft Deleted

## Consents

Consent records are legal authorizations.

They must remain permanently available.

Status changes should be used instead:

- APPROVED
- REJECTED
- REVOKED
- EXPIRED

---

## Access Tokens

Access tokens are short-lived.

They naturally expire.

They should never be restored.

---

## Sessions

Sessions represent temporary authentication.

Revocation replaces deletion.

---

## Audit Events

Audit records are immutable.

Deletion is prohibited.

---

# Soft Delete Workflow

```
Resource Created
        │
        ▼
Active
        │
Delete Request
        │
        ▼
Soft Deleted
        │
        ▼
Restore (optional)
```

---

# Restore Workflow

```
Soft Deleted
        │
Restore Request
        │
        ▼
deleted_at = NULL
        │
        ▼
Active
```

---

# Query Rules

Normal application queries must exclude deleted rows.

Example

```sql
WHERE deleted_at IS NULL
```

Administrative queries may explicitly include deleted rows.

---

# API Behavior

Collection endpoints return only active records by default.

Administrative APIs may support:

```
includeDeleted=true
```

Example

```
GET /patients?includeDeleted=true
```

---

# Delete Operations

Deleting an entity sets:

```sql
deleted_at = CURRENT_TIMESTAMP
```

No row is physically removed.

---

# Restore Operations

Restoration sets:

```sql
deleted_at = NULL
```

The original primary key is retained.

---

# Cascade Behavior

Soft deletion does not automatically cascade.

Example:

Deleting a Provider does **not** automatically soft delete:

- Provider Users
- Metadata Pointers

The application must decide whether related entities should also be deactivated.

---

# Unique Constraints

Soft-deleted records should not block creation of new active records.

Example

A deleted patient may have:

```
email = amina@example.com
```

A new patient may later register with the same email.

This is achieved using partial unique indexes.

---

# Authorization

Only administrators may:

- View deleted records
- Restore deleted records
- Permanently purge records (where permitted)

Ordinary users cannot access deleted resources.

---

# Audit Requirements

Every soft delete operation generates an audit event.

Example:

```
PATIENT_SOFT_DELETED
```

Restoration generates:

```
PATIENT_RESTORED
```

Audit records include:

- Actor
- Timestamp
- Resource
- Reason (optional)
- Correlation ID

---

# Retention Policy

Soft-deleted records should be retained for a minimum of:

```
7 years
```

Longer retention may be required by applicable regulations or organizational policy.

---

# Permanent Deletion

Permanent deletion is exceptional.

Examples include:

- Test data
- Accidental duplicate imports
- Administrative cleanup
- Legal requirements

Permanent deletion requires administrator privileges.

Whenever possible, permanent deletion should be logged in the audit trail.

---

# Business Rules

- Soft deletion must preserve the primary key.
- Soft deletion must preserve relationships.
- Soft deletion must never affect audit history.
- Deleted records are excluded from normal queries.
- Deleted records remain recoverable until permanently purged.
- Restoration must preserve the original identifier and timestamps.

---

# SQL Example

Soft delete

```sql
UPDATE patients
SET deleted_at = CURRENT_TIMESTAMP
WHERE id = :id;
```

Restore

```sql
UPDATE patients
SET deleted_at = NULL
WHERE id = :id;
```

Active query

```sql
SELECT *
FROM patients
WHERE deleted_at IS NULL;
```

---

# Related Documents

- overview.md
- schema.md
- constraints.md
- indexes.md
- audit-storage.md
- business-rules.md