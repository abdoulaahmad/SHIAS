# ADR-0012: Use a Modular Monolith Architecture

Status: Accepted

Date: YYYY-MM-DD

Decision Makers:

- SHIAS Team

---

# Context

SHIAS is composed of several distinct business capabilities:

- Identity
- Provider Management
- Pointer Registry
- Consent
- Access Broker
- Audit

These capabilities have clear domain boundaries but are highly related.

The platform requires:

- Strong transactional consistency
- Simple deployment
- Predictable operational costs
- High maintainability
- Clear module boundaries
- Future scalability

The architecture should support long-term evolution without introducing unnecessary operational complexity during the MVP.

---

# Decision

SHIAS will be implemented as a **Modular Monolith**.

Business capabilities are organized into independent modules within a single deployable application.

Each module owns:

- Its domain model
- Its application services
- Its repository interfaces
- Its infrastructure implementations
- Its API endpoints

Modules communicate through internal interfaces rather than direct database access.

---

# Decision Drivers

- Simplicity
- Transactional consistency
- Faster development
- Lower operational overhead
- Easier debugging
- Lower infrastructure costs
- Future migration path

---

# Architecture

```
                    SHIAS API

────────────────────────────────────────────

Identity Module

Provider Module

Pointer Registry Module

Consent Module

Access Broker Module

Audit Module

────────────────────────────────────────────

Shared Infrastructure

────────────────────────────────────────────

PostgreSQL
```

Only one application is deployed.

---

# Module Boundaries

Each module owns its own business rules.

Example:

```
Identity Module

├── Controller
├── Application
├── Domain
├── Infrastructure
└── Repository
```

Modules should not access each other's internal implementations.

---

# Communication

Modules communicate through:

- Public interfaces
- Application services
- Domain events (future)

Modules must never:

- Read another module's private database structures
- Call internal classes directly
- Duplicate business logic

---

# Transaction Management

Many workflows span multiple modules.

Example:

Patient Registration

↓

Identity

↓

Session Creation

↓

Audit Event

These operations should execute within a single database transaction.

A modular monolith simplifies transactional consistency.

---

# Deployment

Deployment consists of:

```
Nginx

↓

Fastify

↓

Modular Monolith

↓

PostgreSQL
```

Only one deployment artifact is produced.

---

# Development

Developers work within independent modules.

Benefits include:

- Clear ownership
- Easier navigation
- Reduced merge conflicts
- Better encapsulation

Modules are organized by business capability rather than technical layer.

---

# Testing

Testing can occur at multiple levels.

Module Tests

↓

Integration Tests

↓

End-to-End Tests

Modules can be tested independently while still participating in system-wide integration testing.

---

# Performance

Internal module communication uses in-process method calls.

Benefits:

- No network latency
- No serialization overhead
- Simpler debugging
- Better throughput

---

# Scalability

A modular monolith scales vertically.

If additional capacity is required:

```
Load Balancer

↓

Multiple SHIAS Instances

↓

Shared PostgreSQL
```

Horizontal scaling is achieved by running multiple identical application instances.

---

# Migration Strategy

If operational requirements change, individual modules can be extracted into services.

Possible future evolution:

```
Current

Identity
Provider
Consent
Audit

↓

One Application

Future

Identity Service

Provider Service

Consent Service

Audit Service
```

The modular architecture minimizes migration effort.

---

# Alternatives Considered

## Microservices

Rejected.

Pros:

- Independent deployment
- Independent scaling
- Technology flexibility

Cons:

- Distributed transactions
- Service discovery
- Network latency
- Operational complexity
- Increased infrastructure cost
- More difficult debugging

The MVP does not justify this complexity.

---

## Layered Monolith

Rejected.

Pros:

- Simple
- Familiar

Cons:

- Weak business boundaries
- Large shared service layer
- Higher coupling
- Difficult future decomposition

---

## Service-Oriented Architecture (SOA)

Rejected.

Pros:

- Modular
- Enterprise-oriented

Cons:

- Complex governance
- Higher operational overhead
- Less suitable for the current project scope

---

# Consequences

Positive:

- Simple deployment
- Strong transactional consistency
- Easier debugging
- Lower infrastructure costs
- Better developer productivity
- Clear migration path

Negative:

- Single deployment unit
- Entire application redeployed for module changes
- Requires discipline to preserve module boundaries

These trade-offs are acceptable.

---

# Implementation Guidelines

Each module should contain:

- Controllers
- Application Services
- Domain
- Repository Interfaces
- Infrastructure
- Validation
- Mapping

Modules should expose only well-defined public interfaces.

---

# Compliance

All new functionality must:

- Belong to a business module
- Respect module boundaries
- Avoid circular dependencies
- Communicate through public interfaces
- Preserve transactional consistency

Cross-module database access is prohibited.

---

# Future Review

This decision should be revisited if:

- Teams require independent deployments
- Scaling requirements differ significantly by module
- Operational needs justify service decomposition
- Regulatory requirements necessitate stronger isolation

---

# References

- docs/architecture/system-overview.md
- docs/architecture/domain-model.md
- docs/implementation/backend-architecture.md
- docs/implementation/repository-structure.md
- docs/adr/0001-use-clean-architecture.md
- docs/adr/0011-use-domain-driven-design.md