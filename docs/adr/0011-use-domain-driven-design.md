# ADR-0011: Adopt Domain-Driven Design (DDD) Principles

Status: Accepted

Date: YYYY-MM-DD

Decision Makers:

- SHIAS Team

---

# Context

SHIAS is a healthcare identity and consent platform with complex business rules governing:

- Patient identity
- Provider management
- Metadata pointers
- Consent lifecycle
- Access authorization
- Audit trails

These domains have rich business behavior that extends beyond simple Create, Read, Update, and Delete (CRUD) operations.

Without a clear domain model, business logic tends to become fragmented across:

- Controllers
- Services
- Database queries
- Middleware
- UI components

This leads to duplicated rules, inconsistent behavior, and difficult maintenance.

The platform requires an architectural approach that models the business domain explicitly and keeps domain knowledge centralized.

---

# Decision

SHIAS will adopt **Domain-Driven Design (DDD) principles**.

The architecture will organize business capabilities into bounded contexts with clearly defined responsibilities.

Core domain logic will reside in the Domain layer rather than infrastructure or presentation layers.

DDD principles will guide:

- Domain modeling
- Service boundaries
- Repository design
- Business rule implementation
- Ubiquitous language

---

# Decision Drivers

- Maintainability
- Business rule consistency
- Separation of concerns
- Testability
- Scalability
- Long-term evolution
- Shared domain language

---

# Domain Philosophy

Business concepts should be represented directly in code.

Instead of:

```
PatientController

↓

Database
```

SHIAS follows:

```
Controller

↓

Application Service

↓

Domain Model

↓

Repository

↓

Database
```

The domain model owns business behavior.

---

# Bounded Contexts

The platform is divided into independent bounded contexts.

Current contexts include:

- Identity
- Provider Management
- Pointer Registry
- Consent
- Access Broker
- Audit

Each context owns:

- Its terminology
- Its entities
- Its business rules
- Its repositories
- Its services

Contexts communicate through defined interfaces rather than sharing internal implementation details.

---

# Ubiquitous Language

Developers, analysts, and stakeholders should use the same terminology.

Examples:

Use:

- Patient
- Provider
- Consent
- Metadata Pointer
- Access Token
- Audit Event

Avoid ambiguous or generic terms such as:

- User Record
- Item
- Data Object
- Entity Manager

Consistent terminology improves communication and reduces misunderstanding.

---

# Entities

Entities have identity that persists over time.

Examples include:

- Patient
- Provider
- Consent
- Metadata Pointer
- Session
- Audit Event

Entities encapsulate both data and behavior relevant to their lifecycle.

---

# Value Objects

Value Objects represent descriptive concepts without independent identity.

Examples include:

- Health ID
- Email Address
- Phone Number
- Consent Scope
- Record Identifier
- Provider Identifier

Value Objects should be immutable and validated at creation.

---

# Aggregates

Aggregates define consistency boundaries.

Examples:

Patient Aggregate

- Patient
- Sessions

Consent Aggregate

- Consent
- Consent Scope

Provider Aggregate

- Provider
- Provider Users

Business invariants are enforced within aggregate boundaries.

---

# Domain Services

Some business operations do not naturally belong to a single entity.

Examples:

- Consent evaluation
- Access authorization
- Identity verification

These belong in Domain Services.

Domain Services contain domain logic without depending on infrastructure.

---

# Repositories

Repositories abstract persistence.

Examples:

- PatientRepository
- ProviderRepository
- ConsentRepository
- PointerRepository

Repositories expose business-oriented operations rather than database-specific queries.

---

# Application Services

Application Services coordinate use cases.

Responsibilities include:

- Transaction management
- Authorization coordination
- Calling repositories
- Invoking domain services
- Publishing domain events

They should not contain core business rules.

---

# Infrastructure

Infrastructure is responsible for technical concerns such as:

- PostgreSQL
- Prisma
- Fastify
- JWT
- Logging
- External APIs

Infrastructure must not define domain behavior.

---

# Alternatives Considered

## CRUD-Oriented Architecture

Rejected.

Pros:

- Simple to start
- Familiar
- Fast initial development

Cons:

- Business rules become scattered
- Poor scalability
- Difficult testing
- Weak domain model

---

## Anemic Domain Model

Rejected.

Pros:

- Simple entities
- Lightweight implementation

Cons:

- Behavior moves into services
- Large service classes
- Poor encapsulation
- Difficult maintenance

---

## Transaction Script

Rejected.

Pros:

- Easy implementation
- Suitable for simple applications

Cons:

- Logic duplication
- Poor organization
- Limited scalability
- Difficult evolution

---

# Consequences

Positive:

- Rich domain model
- Centralized business rules
- Better maintainability
- Improved testability
- Clear architectural boundaries
- Easier onboarding through shared terminology

Negative:

- More upfront design effort
- Additional architectural concepts for developers to learn
- More classes and abstractions than a CRUD-based design

These trade-offs are acceptable given the long-term nature of the platform.

---

# Implementation Guidelines

Each bounded context should contain:

- Entities
- Value Objects
- Domain Services
- Repository Interfaces
- Domain Events (when applicable)

Infrastructure implementations remain outside the Domain layer.

---

# Compliance

All new business functionality must:

- Be assigned to an existing bounded context or justify the creation of a new one
- Implement business rules in the Domain layer
- Use repositories for persistence
- Preserve ubiquitous language
- Avoid placing domain logic in controllers or database access code

---

# Future Review

This decision should be revisited if:

- The platform evolves toward a microservices architecture with new bounded contexts
- Domain complexity changes significantly
- Alternative architectural styles better support future requirements

---

# References

- docs/architecture/domain-model.md
- docs/architecture/system-overview.md
- docs/implementation/backend-architecture.md
- docs/implementation/repository-structure.md
- docs/project/business-rules.md