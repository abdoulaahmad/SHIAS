# Container Architecture

Version: 1.0

Status: Active

Owner: SHIAS Team

Last Updated: YYYY-MM-DD

---

# Purpose

This document describes the container architecture of the Secure Health Identity & Access System (SHIAS).

Within the C4 Model, a container is an independently deployable application or a reusable package with a well-defined responsibility.

The objective of this document is to define the major applications, shared packages, their responsibilities, communication patterns, and technology stack.

---

# Architecture Overview

The SHIAS MVP is implemented as a TypeScript monorepo.

The monorepo consists of:

- Five deployable applications
- Three reusable packages
- One shared PostgreSQL database

All applications communicate through secure REST APIs.

```
                    +----------------------+
                    |   Patient Portal     |
                    +----------+-----------+
                               |
                               |
                               v
                    +----------------------+
                    |      Core API        |
                    +----------+-----------+
                               ^
                               |
                    +----------+-----------+
                    |   Provider Portal    |
                    +----------------------+

                               |
                               |
               ---------------------------------------
               |                                     |
               v                                     v

      +-------------------+             +----------------------+
      | Source Provider   |<----------->| Requesting Provider  |
      | Demo System       |             | Demo System          |
      +-------------------+             +----------------------+

                    Shared PostgreSQL Database
                           (Core API only)
```

Clinical records remain inside the Source Provider system.

---

# Repository Structure

```
shias/

apps/
│
├── api/
├── patient-portal/
├── provider-portal/
├── provider-source-demo/
└── provider-request-demo/

packages/
│
├── sdk-node/
├── shared-types/
└── shared-utils/

docs/

package.json

pnpm-workspace.yaml
```

---

# Applications

## 1. Core API

### Purpose

The Core API is the central backend of SHIAS.

Every application communicates with the Core API.

It manages all interoperability services.

### Responsibilities

- Authentication
- Authorization
- Patient Management
- Provider Management
- Health ID Management
- Pointer Registry
- Consent Management
- Access Broker
- Audit Logging

### Technology

- Fastify
- TypeScript
- Prisma
- PostgreSQL

### Owns

- Business logic
- Database access
- Security
- REST API

---

## 2. Patient Portal

### Purpose

The Patient Portal allows patients to interact with SHIAS.

### Responsibilities

- Registration
- Login
- Profile Management
- View Health ID
- Approve Consent
- Reject Consent
- View Consent History

### Technology

- Next.js
- React
- TypeScript
- TailwindCSS

Communicates only with the Core API.

---

## 3. Provider Portal

### Purpose

The Provider Portal allows healthcare providers to use SHIAS.

### Responsibilities

- Provider Registration
- Authentication
- Search Patients
- Request Consent
- Register Metadata Pointers
- View Audit Activity

### Technology

- Next.js
- React
- TypeScript
- TailwindCSS

Communicates only with the Core API.

---

## 4. Source Provider Demo

### Purpose

Simulates a healthcare provider that owns patient medical records.

### Responsibilities

- Store Clinical Records
- Register Metadata Pointers
- Validate Access Tokens
- Return Medical Records

### Technology

- Fastify
- TypeScript

This application owns all demonstration medical records.

---

## 5. Requesting Provider Demo

### Purpose

Simulates another healthcare provider requesting medical records.

### Responsibilities

- Search Patient Records
- Request Consent
- Retrieve Medical Records
- Display Retrieved Information

### Technology

- Fastify
- TypeScript

---

# Shared Packages

## sdk-node

### Purpose

Provides a Node.js SDK for integrating external systems with SHIAS.

### Responsibilities

- Authentication helpers
- Patient API client
- Provider API client
- Pointer Registry client
- Consent client
- Access Broker client
- Audit client
- TypeScript models
- Error handling

Consumers include:

- Hospital systems
- Third-party applications
- Internal demo applications

---

## shared-types

### Purpose

Contains shared TypeScript interfaces and type definitions used across all applications.

Examples:

- Patient
- Provider
- Consent
- Pointer
- Audit Event
- API Responses

This package ensures type consistency across the monorepo.

---

## shared-utils

### Purpose

Provides reusable utility functions shared across applications.

Examples:

- Date helpers
- Validation helpers
- Error utilities
- Constants
- Logger interfaces
- Pagination helpers

Business logic must not be placed in this package.

---

# Database

The PostgreSQL database is accessed exclusively by the Core API.

Applications never communicate directly with the database.

```
Patient Portal
        │
        │
        ▼
Core API
        │
        ▼
 PostgreSQL
```

This architecture ensures that business rules remain centralized.

---

# Communication

The communication model is intentionally simple.

| Source | Destination |
|----------|-------------|
| Patient Portal | Core API |
| Provider Portal | Core API |
| Source Provider | Core API |
| Requesting Provider | Core API |
| Source Provider | Requesting Provider |

Only the final communication (record retrieval) occurs directly between providers.

---

# Container Responsibilities

| Container | Responsibility |
|------------|---------------|
| Core API | Interoperability Platform |
| Patient Portal | Patient Interface |
| Provider Portal | Provider Interface |
| Source Provider Demo | Medical Record Owner |
| Requesting Provider Demo | Medical Record Consumer |
| sdk-node | External API Client |
| shared-types | Shared Models |
| shared-utils | Shared Utilities |

---

# Security

Every container follows these security principles.

- HTTPS in production
- JWT Authentication
- RBAC Authorization
- Input Validation
- Audit Logging
- Principle of Least Privilege

Only the Core API accesses the database.

Clinical records remain outside SHIAS.

---

# Scalability

The architecture allows future additions without major redesign.

Possible future containers include:

- Notification Service
- Mobile Application
- Admin Portal
- FHIR Gateway
- Analytics Service

These are intentionally excluded from the MVP.

---

# Deployment

For the MVP, each application is deployed independently.

Typical production deployment:

- Core API
- Patient Portal
- Provider Portal
- Source Provider Demo
- Requesting Provider Demo
- PostgreSQL
- Nginx (reverse proxy)
- PM2 (process manager)

Docker is not required for the MVP.

---

# Design Decisions

The container architecture follows these principles:

- Monorepo structure
- API-first communication
- Centralized business logic
- Independent frontends
- Shared TypeScript packages
- Provider-owned clinical data
- Patient-controlled consent
- Metadata-only interoperability

---

# Related Documents

- system-overview.md
- system-context.md
- communication.md
- data-flow.md
- technology-stack.md
- deployment.md