# ADR-0010: Adopt an OpenAPI-First Development Approach

Status: Accepted

Date: YYYY-MM-DD

Decision Makers:

- SHIAS Team

---

# Context

SHIAS consists of multiple independently developed components, including:

- API
- Patient Portal
- Provider Portal
- Provider Source Demo
- Provider Request Demo
- Future SDKs
- Third-party integrations

Without a formal API contract, frontend and backend development can become tightly coupled, leading to:

- Misaligned implementations
- Inconsistent request and response formats
- Duplicate documentation
- Difficult integration testing
- Breaking API changes
- Increased maintenance costs

The project requires a standardized approach for defining, reviewing, and evolving APIs.

---

# Decision

SHIAS will adopt an **OpenAPI-first (contract-first)** development process.

Every public REST endpoint must be defined in the OpenAPI specification before implementation begins.

The OpenAPI specification is the authoritative contract between clients and the backend.

---

# Decision Drivers

- API consistency
- Parallel development
- Documentation quality
- SDK generation
- Testability
- Contract validation
- Long-term maintainability
- Tooling ecosystem

---

# Development Workflow

The standard workflow is:

```
Requirements

↓

OpenAPI Specification

↓

Architecture Review

↓

Frontend Development

+

Backend Development

↓

Integration Testing

↓

Production Release
```

The API specification precedes implementation.

---

# Why OpenAPI

OpenAPI provides:

- Machine-readable API definitions
- Human-readable documentation
- Validation support
- Code generation
- Schema reuse
- Version control

It is widely supported across development tools and ecosystems.

---

# Single Source of Truth

The OpenAPI document defines:

- Endpoints
- HTTP methods
- Parameters
- Request bodies
- Response bodies
- Authentication
- Error responses
- Schemas

Implementation must conform to the specification.

---

# Parallel Development

Once an endpoint is defined, frontend developers can:

- Build UI
- Create forms
- Integrate API clients
- Write tests

while backend developers implement the corresponding functionality.

This reduces development bottlenecks.

---

# Shared Schemas

Common objects should be defined once and reused.

Examples:

- Patient
- Provider
- Consent
- Metadata Pointer
- Audit Event
- Error Response
- Pagination

Reusable schemas improve consistency and reduce duplication.

---

# SDK Generation

The OpenAPI specification enables automatic generation of:

- TypeScript SDKs
- Client models
- API interfaces

Generated clients reduce manual coding errors and keep consumers aligned with the API.

---

# Documentation

The OpenAPI specification serves as the foundation for interactive API documentation.

Documentation includes:

- Endpoint descriptions
- Authentication requirements
- Request examples
- Response examples
- Error definitions

Documentation is generated from the specification rather than maintained separately.

---

# Validation

Request and response validation should use the OpenAPI schemas wherever practical.

Benefits include:

- Early error detection
- Consistent validation
- Reduced implementation drift

---

# API Evolution

Changes to the API must follow a documented review process.

Breaking changes require:

- Version review
- Consumer impact assessment
- Migration documentation
- Team approval

Backward-compatible changes are preferred.

---

# Alternatives Considered

## Code-First Development

Rejected.

Pros:

- Faster initial implementation
- Familiar workflow

Cons:

- Documentation often becomes outdated
- Frontend depends on backend completion
- Harder to review API design before coding
- Increased risk of inconsistent contracts

---

## Documentation After Implementation

Rejected.

Pros:

- Minimal initial effort

Cons:

- Documentation drift
- Incomplete API descriptions
- Poor developer experience
- Difficult onboarding

---

## GraphQL

Considered.

Pros:

- Flexible queries
- Strong typing
- Schema introspection

Cons:

- Increased operational complexity
- More difficult caching
- Authorization complexity
- Not aligned with SHIAS's REST-based architecture

---

# Consequences

Positive:

- Consistent API design
- Better documentation
- Easier testing
- Parallel development
- SDK generation
- Improved maintainability

Negative:

- Additional upfront design effort
- API changes require specification updates
- Team discipline is required to keep implementation aligned

These trade-offs are acceptable.

---

# Implementation Guidelines

Every endpoint must include:

- Summary
- Description
- Tags
- Parameters
- Request schema
- Response schema
- Error responses
- Authentication requirements

Schemas should be reusable and referenced through OpenAPI components.

---

# Testing

API testing should include:

- Contract validation
- Schema validation
- Integration testing
- Backward compatibility checks

The OpenAPI specification should be incorporated into automated CI workflows where feasible.

---

# Compliance

No public REST endpoint may be implemented without:

- An approved OpenAPI definition
- Defined request and response schemas
- Authentication requirements
- Documented error responses

The OpenAPI specification is the authoritative source for API behavior.

---

# Future Review

This decision should be revisited if:

- The platform adopts additional API paradigms (such as GraphQL or gRPC)
- OpenAPI standards evolve significantly
- New tooling provides substantial improvements to the development workflow

---

# References

- docs/contracts/api-overview.md
- docs/contracts/authentication.md
- docs/contracts/patients.md
- docs/contracts/providers.md
- docs/contracts/pointers.md
- docs/contracts/consent.md
- docs/contracts/access-broker.md
- docs/contracts/errors.md
- docs/contracts/pagination.md