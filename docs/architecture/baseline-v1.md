# Architecture Baseline (v1.0)

This document captures the foundational architecture of the Secure Health Identity & Access System (SHIAS) as of the completion of the core backend MVP (Sprints 1–6). It serves as the definitive reference point for future development, ensuring that operational features, integrations, and UI layers build on a stable, well-documented core.

---

## 1. Bounded Contexts and Responsibilities

The system is structured as a Modular Monolith with strictly separated bounded contexts based on Domain-Driven Design (DDD).

- **Identity Management**: Manages patients, user authentication, and issues identity JWTs.
- **Provider Management**: Manages healthcare provider organizations, their verification status, and provider staff linking.
- **Pointer Registry**: Stores and retrieves metadata ("pointers") describing where patient health records exist across external provider systems, without storing clinical payload.
- **Consent Engine**: Governs the patient-controlled consent lifecycle (create, approve, reject, revoke) for specific scopes, purposes, and durations.
- **Access Broker**: The central orchestrator for data retrieval requests. It coordinates Identity, Pointer Registry, and Consent Engine to evaluate authorization and issues short-lived, cryptographically signed access tokens.

---

## 2. Dependency Rules Between Layers

SHIAS enforces strict Clean Architecture principles within each bounded context:

1. **Domain Layer**: Contains Aggregates, Value Objects, Domain Events, and Enums. Has zero dependencies on external frameworks or other layers.
2. **Application Layer (Use Cases)**: Orchestrates domain logic using Application Services and Repository Interfaces. Depends only on the Domain layer.
3. **Infrastructure Layer**: Implements repository interfaces using Prisma. Contains the implementation details for token generation (e.g., `JwtTokenService`) and event publishing.
4. **Presentation Layer (HTTP API)**: Built with Fastify and TypeBox for strict schema validation. Responsible for routing and translating HTTP requests to Use Case DTOs.

> [!IMPORTANT]
> The dependency rule strictly points inward: `Infrastructure/Presentation -> Application -> Domain`. The domain layer must never depend on Prisma types or Fastify request objects.

---

## 3. Security Model

The security model guarantees that patients retain explicit control over their data, while the system avoids centralizing vulnerable clinical payloads.

### Identity → Consent → Access Broker Flow
1. **Identity Verification**: Users (Patients and Provider Staff) authenticate to receive an identity JWT.
2. **Pointer Discovery**: Providers discover patient record locations (pointers) via the Pointer Registry.
3. **Consent Creation**: Providers submit an `AccessRequest` which creates a pending `Consent` for the patient to review.
4. **Patient Authorization**: The patient reviews and approves the `Consent` through the Consent Engine.
5. **Access Granting**: The provider asks the Access Broker for access. The Access Broker evaluates the Consent. If authorized, it generates an `AccessGrant` audit record and issues a short-lived, minimal-claim JWT (`AccessToken`).
6. **Data Retrieval**: The requesting provider presents the `AccessToken` directly to the source provider's external system. SHIAS is not involved in the actual data transfer.

---

## 4. API Surface Overview

All endpoints are validated via TypeBox schemas and guarded by appropriate authentication hooks.

### Auth (`/api/v1/auth`)
- `POST /register/patient`
- `POST /register/provider`
- `POST /login`
- `POST /refresh`

### Providers (`/api/v1/providers`)
- `POST /` (Create)
- `GET /:id`
- `POST /:id/staff` (Link staff)

### Pointers (`/api/v1/pointers`)
- `POST /` (Register)
- `GET /:id`
- `GET /patient/:patientId`
- `PUT /:id/archive`

### Consents (`/api/v1/consents`)
- `POST /request`
- `POST /:id/approve`
- `POST /:id/reject`
- `POST /:id/revoke`
- `GET /patient/:patientId`

### Access Broker (`/api/v1/access`)
- `POST /request` (Initiate workflow, evaluate consent, generate grant & token)
- `GET /grants/:id`
- `POST /grants/:id/revoke`
- `POST /validate` (Validates tokens for future integrations)

---

## 5. Database Schema Overview

The database uses PostgreSQL via Prisma, mapped closely to the bounded contexts:

- **`User`**: Patient and staff credentials and demographics.
- **`Provider`** & **`ProviderStaff`**: Healthcare organizations and their RBAC links to Users.
- **`Pointer`**: Metadata (`externalSystemId`, `externalRecordId`, `recordType`) pointing to clinical records.
- **`Consent`**: Patient consent decisions tracking status (`PENDING`, `APPROVED`, etc.) and `ConsentPurpose`.
- **`AccessRequest`** & **`AccessGrant`**: Immutable audit trails of data access orchestration, tracking expiration and revocation.
- **`AuditLog`**: Centralized, immutable table tracking platform activities (to be fully integrated in future Sprints).

---

## 6. Domain Events and Publishers

To decouple bounded contexts, SHIAS utilizes Domain Events (e.g., `AccessRequestedEvent`, `AccessGrantedEvent`, `AccessDeniedEvent`).
- **Interfaces**: Defined in the domain (`IDomainEventPublisher`).
- **Publishers**: Implemented in Infrastructure (`ConsoleEventPublisher` for MVP). 
- **Future State**: These events will eventually hook into a Transactional Outbox or external message broker for async analytics and system-wide audit logging.

---

## 7. Key Architectural Decisions (ADRs)

The platform architecture is formally governed by Architecture Decision Records (ADRs). Key decisions include:

- **ADR-0001 (Clean Architecture)**: Ensures business logic is independent of UI, database, or frameworks.
- **ADR-0002 (Fastify)**: Chosen for high performance and seamless JSON schema validation.
- **ADR-0003 (Prisma)**: Selected as the ORM for type-safe database interactions.
- **ADR-0009 (Do Not Store Medical Records)**: The fundamental security mandate of SHIAS; acts strictly as an identity and consent broker.
- **ADR-0011 (Domain-Driven Design)**: Aligns software components with business domains to handle complex logic.
- **ADR-0012 (Modular Monolith)**: Starts with a single deployable unit logically divided into bounded contexts, allowing future extraction to microservices if scale demands.
- **ADR-0013 (Domain Events)**: Establishes event-driven decoupling between internal components.
