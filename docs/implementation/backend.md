# Backend Architecture

Version: 1.0

Status: Active

Owner: SHIAS Team

Last Updated: YYYY-MM-DD

---

# Purpose

This document defines the backend architecture for the Secure Health Identity & Access System (SHIAS).

It establishes the application structure, architectural patterns, dependency rules, and implementation standards for the Core API.

The goal is to build a backend that is:

- Maintainable
- Testable
- Scalable
- Secure
- Modular

---

# Technology Stack

| Component | Technology |
|------------|------------|
| Runtime | Node.js 24 LTS |
| Language | TypeScript (Strict Mode) |
| Framework | Fastify |
| ORM | Prisma |
| Database | PostgreSQL |
| Authentication | JWT + Refresh Tokens |
| Validation | Zod |
| Password Hashing | Argon2id |
| Logging | Pino |
| Testing | Vitest |
| Package Manager | pnpm |

---

# Architectural Style

The Core API follows **Clean Architecture** with **Domain-Driven Design (DDD)** principles.

```
                API Layer
                     │
                     ▼
             Application Layer
                     │
                     ▼
               Domain Layer
                     │
                     ▼
            Infrastructure Layer
```

Dependencies always point inward.

---

# Layer Responsibilities

## Presentation Layer

Responsible for:

- HTTP routes
- Controllers
- Request validation
- Response formatting
- Authentication middleware

Must never contain business logic.

---

## Application Layer

Responsible for:

- Use cases
- Transactions
- Authorization checks
- Orchestration
- Domain service coordination

Examples:

- Register Patient
- Register Provider
- Create Consent
- Approve Consent
- Issue Access Token

---

## Domain Layer

Contains:

- Entities
- Value Objects
- Domain Services
- Repository Interfaces
- Business Rules

The Domain Layer has no knowledge of Fastify, Prisma, or PostgreSQL.

---

## Infrastructure Layer

Responsible for:

- Prisma repositories
- Database access
- JWT implementation
- Email providers
- Logging
- External integrations

Infrastructure implements interfaces defined in the Domain Layer.

---

# Feature-Based Organization

The project is organized by business capability rather than technical type.

```
src/

├── modules/
│
├── patients/
├── providers/
├── provider-users/
├── pointers/
├── consents/
├── access/
├── audit/
├── auth/
├── sessions/
│
├── shared/
│
├── infrastructure/
│
└── app.ts
```

Each module is self-contained.

---

# Module Structure

Example:

```
patients/

├── controller.ts
├── routes.ts
├── dto.ts
├── validators.ts
│
├── application/
│     register-patient.ts
│     update-patient.ts
│
├── domain/
│     patient.ts
│     patient-repository.ts
│
├── infrastructure/
│     prisma-patient-repository.ts
│
└── tests/
```

---

# Dependency Rules

Allowed

```
Presentation

↓

Application

↓

Domain

↓

Infrastructure
```

Forbidden

```
Domain → Fastify

Domain → Prisma

Application → HTTP

Infrastructure → Business Rules
```

---

# Dependency Injection

All services are resolved through dependency injection.

Application services depend on interfaces.

Infrastructure provides implementations.

---

# Repository Pattern

Repositories abstract persistence.

Example

```
PatientRepository

ProviderRepository

ConsentRepository

PointerRepository
```

The application never communicates with Prisma directly.

---

# Validation

Input validation uses Zod.

Validation occurs before business logic.

Invalid requests return RFC 7807 Problem Details responses.

---

# Transactions

Multi-step operations execute inside database transactions.

Examples:

- Patient registration
- Consent approval
- Access token issuance
- Provider verification

---

# Error Handling

The backend uses centralized exception handling.

Errors are translated into standardized Problem Details responses.

No stack traces are exposed to clients.

---

# Authentication

Authentication uses:

- JWT Access Tokens
- Refresh Tokens
- Argon2id password hashing

Passwords are never stored in plaintext.

---

# Authorization

Authorization follows role-based access control (RBAC).

Roles include:

Patient

Provider User

Administrator

Authorization checks occur inside the Application Layer.

---

# Logging

Structured logging uses Pino.

Every request includes:

- Correlation ID
- Timestamp
- Route
- Duration
- Status Code

Sensitive information is never logged.

---

# Configuration

Configuration comes exclusively from environment variables.

Examples:

```
DATABASE_URL

JWT_SECRET

JWT_EXPIRES_IN

REFRESH_TOKEN_EXPIRES_IN

PORT
```

Configuration is validated during startup.

---

# Testing

Three levels of testing:

- Unit Tests
- Integration Tests
- End-to-End Tests

Business logic is tested independently from Fastify and Prisma.

---

# Security

The backend must:

- Enforce HTTPS
- Validate JWTs
- Hash passwords
- Validate all input
- Prevent SQL injection
- Prevent XSS
- Prevent CSRF where applicable
- Protect against brute-force attacks

---

# Performance

The backend should:

- Minimize database queries
- Batch related operations
- Avoid N+1 queries
- Use pagination
- Use indexes efficiently

---

# Observability

The backend exposes:

- Health endpoint
- Readiness endpoint
- Structured logs
- Metrics (future)

---

# Business Rules

- Business logic belongs in the Domain Layer.
- Controllers remain thin.
- Repositories abstract persistence.
- Modules are self-contained.
- Dependencies point inward.
- Infrastructure implements—not defines—business behavior.

---

# Related Documents

- repository-structure.md
- authentication-flow.md
- authorization-model.md
- validation-strategy.md
- logging-monitoring.md
- testing-strategy.md
- deployment.md
- database/schema.md