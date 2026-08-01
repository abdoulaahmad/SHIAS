# Repository Structure

Version: 1.0

Status: Active

Owner: SHIAS Team

Last Updated: YYYY-MM-DD

---

# Purpose

This document defines the repository structure, workspace organization, naming conventions, and shared package strategy for the Secure Health Identity & Access System (SHIAS).

The repository is organized as a pnpm workspace monorepo to encourage code reuse, consistent tooling, and modular development.

---

# Design Goals

The repository should be:

- Modular
- Easy to navigate
- Easy to test
- Easy to deploy
- Easy to extend
- Suitable for multiple developers

---

# Monorepo Layout

```
shias/

├── apps/
├── packages/
├── docs/
├── prisma/
├── scripts/
├── .github/
├── .vscode/

├── package.json
├── pnpm-workspace.yaml
├── tsconfig.base.json
├── biome.json
├── .env.example
├── README.md
└── AGENTS.md
```

---

# Applications

```
apps/

├── api/
├── patient-portal/
├── provider-portal/
├── provider-source-demo/
└── provider-request-demo/
```

---

## api

Core Fastify backend.

Contains:

- REST API
- Authentication
- Business logic
- Database access
- Authorization
- Audit logging

---

## patient-portal

Next.js application.

Responsibilities:

- Authentication
- Consent management
- Profile management
- Activity history

---

## provider-portal

Next.js application.

Responsibilities:

- Provider administration
- Record discovery
- Consent requests
- Token management

---

## provider-source-demo

Reference implementation of a provider exposing medical records.

Demonstrates how an external provider integrates with SHIAS.

---

## provider-request-demo

Reference implementation of a provider requesting medical records.

Demonstrates the requesting workflow.

---

# Shared Packages

```
packages/

├── sdk-node/
├── shared-types/
├── shared-utils/
├── config/
├── eslint-config/
└── tsconfig/
```

---

## sdk-node

Official Node.js SDK.

Provides:

- API client
- Authentication helpers
- Token validation
- Typed request/response models

---

## shared-types

Shared TypeScript types.

Examples:

- DTOs
- Enums
- API contracts
- Domain types

No runtime code.

---

## shared-utils

Reusable utilities.

Examples:

- Date helpers
- Validation helpers
- String utilities
- UUID helpers
- Pagination utilities

Utilities must be framework-independent.

---

## config

Shared application configuration.

Contains:

- Environment validation
- Default values
- Feature flags
- Shared constants

---

## eslint-config

Shared lint configuration.

Used by every workspace package.

---

## tsconfig

Shared TypeScript configuration.

Every project extends the base configuration.

---

# Documentation

```
docs/

project/
architecture/
contracts/
database/
implementation/
adr/
```

Documentation is version controlled alongside the code.

---

# Prisma

```
prisma/

schema.prisma

seed.ts

migrations/
```

The Prisma directory is owned exclusively by the API application.

Frontend applications must never access Prisma directly.

---

# Scripts

```
scripts/

generate-sdk.ts

seed-demo.ts

cleanup.ts

backup.ts
```

Scripts automate operational tasks.

---

# GitHub

```
.github/

workflows/

ISSUE_TEMPLATE/

PULL_REQUEST_TEMPLATE.md

CODEOWNERS
```

GitHub Actions handle:

- CI
- Linting
- Tests
- Builds

---

# API Structure

```
apps/api/src/

modules/

shared/

infrastructure/

config/

plugins/

server.ts
```

---

# Module Structure

Example

```
modules/

patients/

register/

get/

update/

list/

delete/
```

Each feature is independently testable.

---

# Shared Layer

```
shared/

errors/

http/

security/

pagination/

problem-details/

logger/
```

Contains reusable backend components.

---

# Infrastructure

```
infrastructure/

database/

jwt/

repositories/

email/

cache/

audit/
```

Infrastructure implements interfaces defined by the domain.

---

# Configuration Files

```
package.json

pnpm-workspace.yaml

tsconfig.base.json

biome.json

.env.example
```

Configuration should remain centralized.

---

# Naming Conventions

Folders

```
kebab-case
```

Examples

```
provider-users

shared-utils

patient-portal
```

---

Files

```
kebab-case.ts
```

Examples

```
register-patient.ts

patient-controller.ts

jwt-service.ts
```

---

Classes

```
PascalCase
```

---

Interfaces

```
PascalCase
```

Without the `I` prefix.

Example

```
PatientRepository
```

---

Functions

```
camelCase
```

---

Constants

```
UPPER_SNAKE_CASE
```

---

Environment Variables

```
UPPER_SNAKE_CASE
```

Examples

```
DATABASE_URL

JWT_SECRET

PORT
```

---

Workspace Dependencies

Applications may depend on:

```
packages/*
```

Packages must never depend on applications.

Allowed

```
apps

↓

packages
```

Forbidden

```
packages

↓

apps
```

---

Testing Structure

```
tests/

unit/

integration/

e2e/
```

Feature-specific tests may also live beside implementation files.

---

Build Outputs

Generated artifacts should never be committed.

Ignored directories include:

```
node_modules/

dist/

.next/

coverage/

.prisma/
```

---

Business Rules

- Shared code belongs in `packages/`.
- Applications own business workflows.
- Packages must remain application-agnostic.
- Documentation evolves with implementation.
- Every application follows the same conventions.
- Repository structure should remain stable over time.

---

# Related Documents

- backend-architecture.md
- frontend-architecture.md
- authentication-flow.md
- validation-strategy.md
- deployment.md
- README.md
- AGENTS.md