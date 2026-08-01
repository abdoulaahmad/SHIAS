# Database Migration Strategy

Version: 1.0

Status: Active

Owner: SHIAS Team

Last Updated: YYYY-MM-DD

---

# Purpose

This document defines the database migration strategy for the Secure Health Identity & Access System (SHIAS).

Database migrations provide a controlled, versioned, and repeatable method for evolving the database schema while preserving data integrity.

All schema changes must be performed through migrations.

Direct modifications to production databases are prohibited.

---

# Objectives

The migration strategy aims to provide:

- Repeatable deployments
- Version-controlled schema evolution
- Safe rollouts
- Reliable rollback procedures
- Environment consistency
- Auditability

---

# Migration Tool

The SHIAS project uses:

```
Prisma Migrate
```

Prisma is the single source of truth for schema evolution.

The workflow is:

```
schema.prisma
        │
        ▼
Prisma Migration
        │
        ▼
PostgreSQL
```

---

# Migration Workflow

Every schema modification follows this process.

```
Schema Change

↓

Update schema.prisma

↓

Generate Migration

↓

Review SQL

↓

Test Locally

↓

Commit

↓

Deploy

↓

Verify
```

---

# Directory Structure

```
prisma/

├── schema.prisma
├── seed.ts

└── migrations/
    ├── 20260810111500_initial_schema/
    │       migration.sql
    │
    ├── 20260817103020_add_provider_users/
    │       migration.sql
    │
    └── migration_lock.toml
```

---

# Migration Naming

Migration names should clearly describe the change.

Examples

```
initial_schema

add_provider_users

create_metadata_pointers

add_consent_status

add_audit_indexes

split_provider_roles

add_soft_delete
```

Avoid vague names like:

```
update

fix

changes

test

new
```

---

# Creating Migrations

Every migration starts with:

```
schema.prisma
```

Example

```bash
npx prisma migrate dev --name add_provider_users
```

---

# Applying Migrations

Development

```bash
npx prisma migrate dev
```

Production

```bash
npx prisma migrate deploy
```

Production deployments must never use:

```bash
prisma db push
```

---

# Schema Review

Every migration should be reviewed before merging.

Review includes:

- SQL statements
- New indexes
- Constraints
- Foreign keys
- Cascade rules
- Data safety

Large migrations should receive peer review.

---

# Data Migrations

Schema migrations should not contain complex business logic.

If data transformation is required:

1. Deploy schema changes.
2. Execute a separate migration script.
3. Verify migrated data.
4. Remove obsolete columns in a later release.

This minimizes deployment risk.

---

# Rollback Strategy

Prisma does not support automatic rollback generation.

Rollback strategy:

1. Create a new corrective migration.
2. Restore from backup only if necessary.
3. Never edit previously applied migrations.

Applied migrations are immutable.

---

# Migration Ordering

Migrations execute in chronological order.

Example

```
001_initial_schema

002_provider_users

003_metadata_pointers

004_consents

005_access_tokens
```

Dependencies must be respected.

---

# Seed Data

The project includes a seed script.

```
prisma/seed.ts
```

Development seed data may include:

- Administrator account
- Demo provider
- Demo patient
- System settings

Production seed data must be minimal.

---

# Environment Support

Migrations must be tested in:

- Development
- Staging
- Production

Schemas must remain consistent across environments.

---

# Backward Compatibility

Whenever possible:

- Add before removing.
- Deprecate before deleting.
- Avoid breaking changes.

Recommended approach:

Release 1

```
Old Column
New Column
```

Release 2

Application uses new column.

Release 3

Remove old column.

---

# Large Tables

When modifying large tables:

Prefer:

- Adding nullable columns
- Backfilling data
- Adding constraints afterward

Avoid long-running table locks.

---

# Performance Considerations

Review migrations for:

- Full table scans
- Blocking operations
- Index creation
- Lock duration

Large indexes should be created carefully to minimize downtime.

---

# Testing

Every migration should be tested by:

- Applying to an empty database
- Applying to an existing database
- Verifying constraints
- Verifying indexes
- Running integration tests

---

# Backup Policy

Before production migrations:

- Verify recent backups
- Confirm restore procedure
- Validate recovery point

High-risk migrations should not proceed without a verified backup.

---

# Failed Migrations

If a migration fails:

1. Stop deployment.
2. Investigate the cause.
3. Do not edit the failed migration.
4. Create a corrective migration.
5. Retry deployment.

---

# Version Control

Migration files must be committed to Git.

Never delete committed migrations.

Migration history is part of the project's permanent record.

---

# Business Rules

- All schema changes require migrations.
- `schema.prisma` is the source of truth.
- Production databases must never use `db push`.
- Applied migrations are immutable.
- Every migration must be tested before production.
- Every production migration requires a verified backup.

---

# Related Documents

- overview.md
- schema.md
- constraints.md
- indexes.md
- soft-delete.md
- README.md