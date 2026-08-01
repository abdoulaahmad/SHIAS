# ADR-0001: Use Clean Architecture

Status: Accepted

Date: YYYY-MM-DD

Decision Makers:

- SHIAS Team

---

# Context

SHIAS is a healthcare identity and consent platform that handles:

- Patient identities
- Provider organizations
- Metadata pointers
- Consent workflows
- Access token issuance
- Audit logging

The system is expected to evolve over time with new features, integrations, and regulatory requirements.

A traditional layered architecture tightly coupled to frameworks or persistence technologies would make long-term maintenance difficult.

The project requires an architecture that:

- Is easy to test
- Separates business rules from infrastructure
- Allows replacement of frameworks and libraries
- Supports long-term maintainability
- Encourages modular development

---

# Decision

The backend will adopt **Clean Architecture**.

Business rules are placed at the center of the application.

Frameworks, databases, and external services remain implementation details.

Dependencies always point inward.

```
Presentation

↓

Application

↓

Domain

↓

Infrastructure
```

The Domain layer must not depend on:

- Fastify
- Prisma
- PostgreSQL
- JWT libraries
- HTTP
- Environment variables

---

# Rationale

Clean Architecture provides:

- Clear separation of concerns
- Independent business logic
- Easier automated testing
- Improved maintainability
- Better scalability
- Reduced framework coupling

The architecture enables replacing infrastructure without rewriting core business logic.

---

# Consequences

Positive:

- Business logic becomes framework-independent.
- Unit testing becomes straightforward.
- Infrastructure changes have minimal impact.
- Clear ownership of responsibilities.
- Easier onboarding for contributors.

Negative:

- More initial boilerplate.
- Additional interfaces and abstractions.
- Slightly steeper learning curve.

These trade-offs are acceptable given the project's expected growth and long-term maintenance requirements.

---

# Alternatives Considered

## Traditional Layered Architecture

Rejected.

Reason:

Business logic tends to become coupled to persistence and framework code.

---

## MVC

Rejected.

Reason:

Suitable for smaller applications but offers weaker separation of concerns for a domain-driven healthcare platform.

---

## Hexagonal Architecture

Considered.

Reason:

Shares many goals with Clean Architecture.

Not selected because Clean Architecture provides a more familiar structure for the project team while still supporting ports and adapters where appropriate.

---

# Impact

Affected components:

- Backend
- Repository structure
- Domain model
- Testing strategy
- Validation strategy
- Authorization policies

Future modules must comply with this architecture.

---

# Compliance

The following rules apply:

- Domain depends on nothing.
- Business logic resides in the Domain and Application layers.
- Controllers remain thin.
- Infrastructure implements interfaces defined by the Domain.
- Dependency direction always points inward.

Code reviews should verify compliance.

---

# References

- docs/architecture/system-overview.md
- docs/implementation/backend-architecture.md
- docs/implementation/repository-structure.md