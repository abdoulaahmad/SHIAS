# ADR-0002: Use Fastify as the Backend Framework

Status: Accepted

Date: YYYY-MM-DD

Decision Makers:

- SHIAS Team

---

# Context

SHIAS requires a backend framework capable of supporting:

- High request throughput
- Secure API development
- Strong TypeScript support
- Schema-based validation
- Modular architecture
- Long-term maintainability
- Integration with Prisma
- JWT authentication
- Structured logging
- Healthcare-grade reliability

The backend will expose REST APIs for:

- Patient management
- Provider management
- Consent workflows
- Metadata pointers
- Access broker
- Audit services
- Authentication

The selected framework should align with the project's Clean Architecture principles while remaining lightweight and performant.

---

# Decision

The SHIAS backend will use **Fastify** as its primary HTTP framework.

Fastify serves as the Presentation Layer within the Clean Architecture.

Business logic remains framework-independent.

---

# Decision Drivers

- High performance
- Low overhead
- Strong TypeScript support
- Plugin architecture
- Schema-based validation
- Excellent developer experience
- Mature ecosystem
- Long-term maintainability

---

# Rationale

Fastify provides several advantages for SHIAS.

## Performance

Fastify is designed for high throughput and low latency.

Its optimized request lifecycle and serialization make it well suited for API-heavy workloads.

---

## TypeScript

Fastify offers first-class TypeScript support.

Benefits include:

- Strong typing
- Typed request objects
- Typed replies
- Plugin type safety

This aligns with the project's strict TypeScript standards.

---

## Plugin Architecture

Fastify encourages modular development.

Examples:

- JWT authentication
- CORS
- Security headers
- Rate limiting
- Logging
- Health checks

Plugins integrate naturally without tightly coupling business logic to the framework.

---

## Schema Validation

Fastify integrates well with schema validation libraries such as Zod.

Validation occurs before requests reach business logic, improving security and reducing boilerplate.

---

## Logging

Fastify integrates with **Pino**, enabling:

- Structured JSON logs
- Correlation IDs
- High-performance logging
- Centralized observability

This supports the logging strategy defined for SHIAS.

---

## Lifecycle Hooks

Fastify provides lifecycle hooks that simplify:

- Authentication
- Authorization
- Request tracing
- Metrics collection
- Request validation

These hooks help keep controllers thin and focused.

---

## Ecosystem

Fastify has a mature ecosystem of official plugins, including support for:

- JWT authentication
- Cookies
- Multipart uploads
- Static assets
- Compression
- CORS

This reduces the need for custom implementations.

---

# Alternatives Considered

## Express

Rejected.

Pros:

- Large ecosystem
- Familiar API
- Extensive community support

Cons:

- Lower performance
- Less structured plugin system
- Weaker TypeScript experience
- Requires additional libraries for many features

---

## NestJS

Rejected.

Pros:

- Comprehensive framework
- Dependency injection
- Modular architecture

Cons:

- Higher complexity
- Larger abstraction layer
- Opinionated architecture
- More boilerplate than required for SHIAS

The project already defines its own Clean Architecture and does not require NestJS's additional abstractions.

---

## Koa

Rejected.

Pros:

- Lightweight
- Modern middleware

Cons:

- Smaller ecosystem
- Less comprehensive plugin support
- Fewer built-in capabilities

---

## Hono

Rejected.

Pros:

- Extremely fast
- Excellent edge runtime support

Cons:

- Ecosystem still evolving
- Less established for long-lived Node.js server applications
- Fewer production examples for healthcare-style systems

---

# Consequences

Positive:

- High request throughput
- Strong TypeScript integration
- Lightweight framework
- Excellent logging support
- Clear plugin architecture
- Easy integration with Prisma
- Good long-term maintainability

Negative:

- Smaller community than Express
- Some third-party libraries primarily target Express
- Team members unfamiliar with Fastify may require onboarding

These trade-offs are acceptable for SHIAS.

---

# Implementation Guidelines

Fastify is responsible only for:

- Routing
- Request parsing
- Validation
- Middleware/plugins
- Authentication entry point
- Response formatting

Fastify must not contain:

- Business rules
- Domain logic
- Database queries
- Authorization policies

Those responsibilities belong to the Application and Domain layers.

---

# Compliance

All backend modules must:

- Register routes through Fastify
- Use Fastify plugins for infrastructure concerns
- Keep controllers thin
- Delegate business operations to use cases
- Return standardized RFC 7807 error responses

---

# Future Review

This decision should be revisited if:

- Runtime requirements change significantly
- Edge deployment becomes the primary target
- Fastify no longer meets performance or maintenance needs
- The project's architectural goals evolve substantially

---

# References

- docs/implementation/backend-architecture.md
- docs/implementation/repository-structure.md
- docs/implementation/logging-monitoring.md
- docs/contracts/errors.md