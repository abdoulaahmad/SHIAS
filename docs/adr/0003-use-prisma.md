# ADR-0003: Use Prisma as the Object-Relational Mapper (ORM)

Status: Accepted

Date: YYYY-MM-DD

Decision Makers:

- SHIAS Team

---

# Context

SHIAS requires a database access layer that provides:

- Strong TypeScript support
- Safe schema evolution
- Reliable migrations
- High developer productivity
- PostgreSQL compatibility
- Good performance
- Long-term maintainability
- Compatibility with Clean Architecture

The application manages:

- Patients
- Providers
- Provider Users
- Metadata Pointers
- Consents
- Access Tokens
- Sessions
- Audit Events

Database interactions must remain type-safe, predictable, and easy to maintain.

---

# Decision

The SHIAS backend will use **Prisma ORM** for database access and schema management.

Prisma serves as the persistence implementation within the Infrastructure Layer.

Business logic depends only on repository interfaces.

---

# Decision Drivers

- Type safety
- Developer productivity
- Migration management
- PostgreSQL support
- Schema-first development
- Excellent TypeScript integration
- Active ecosystem
- Long-term maintainability

---

# Rationale

## Type Safety

Prisma generates strongly typed database clients directly from the schema.

Benefits include:

- Compile-time query validation
- Typed models
- Typed relations
- Reduced runtime errors
- Improved IDE support

This aligns with SHIAS's strict TypeScript policy.

---

## Schema as Source of Truth

The database schema is defined in:

```
prisma/schema.prisma
```

From this schema, Prisma generates:

- Migration files
- Database client
- Type definitions

This ensures consistency between the codebase and the database.

---

## Migration Management

Prisma Migrate provides:

- Versioned migrations
- Repeatable deployments
- Migration history
- Safe schema evolution

This aligns with the migration strategy documented for SHIAS.

---

## PostgreSQL Integration

Prisma provides excellent PostgreSQL support, including:

- UUID support
- JSONB
- Transactions
- Relations
- Constraints
- Indexes
- Enumerations

These capabilities match the platform's data model requirements.

---

## Developer Experience

Prisma improves productivity through:

- Auto-completion
- IntelliSense
- Generated types
- Schema validation
- Helpful error messages

This reduces development time and improves code quality.

---

## Transactions

Prisma supports transactional operations, enabling:

- Patient registration
- Consent approval
- Session creation
- Access token issuance

to execute atomically.

---

## Repository Pattern

Prisma remains isolated within repository implementations.

Example:

```
PatientRepository

↓

PrismaPatientRepository

↓

Prisma Client
```

The Application and Domain layers are unaware of Prisma.

---

# Alternatives Considered

## Drizzle ORM

Considered.

Pros:

- Lightweight
- SQL-first approach
- Excellent TypeScript support
- Good performance

Cons:

- Smaller ecosystem
- Less mature migration tooling at the time of adoption
- Requires more manual schema management

Prisma was chosen for its more comprehensive tooling and developer experience.

---

## TypeORM

Rejected.

Pros:

- Mature
- Large community
- Decorator-based models

Cons:

- Weaker type inference
- More runtime configuration
- Entity classes tightly coupled to persistence
- Higher maintenance overhead

---

## Sequelize

Rejected.

Pros:

- Mature
- Broad ecosystem

Cons:

- Limited TypeScript experience
- Verbose APIs
- Weaker type safety
- Less aligned with the project's architecture

---

## Raw SQL

Rejected.

Pros:

- Maximum control
- Potential performance optimizations

Cons:

- Higher maintenance cost
- More boilerplate
- Greater risk of inconsistencies
- Reduced developer productivity

Raw SQL remains acceptable for carefully justified performance-critical queries.

---

# Consequences

Positive:

- End-to-end type safety
- Simplified database access
- Reliable migrations
- Faster development
- Reduced runtime errors
- Improved maintainability

Negative:

- Generated client increases project size
- Some advanced SQL features require raw queries
- Developers must understand Prisma's schema language

These trade-offs are acceptable given the project's goals.

---

# Implementation Guidelines

Prisma is responsible for:

- Database connections
- CRUD operations
- Transactions
- Migrations
- Query execution

Prisma must not contain:

- Business rules
- Authorization policies
- Validation logic
- HTTP concerns

These responsibilities remain in the Application and Domain layers.

---

# Performance Considerations

Developers should:

- Select only required fields
- Avoid N+1 query patterns
- Use transactions appropriately
- Define indexes in the schema
- Profile slow queries
- Use raw SQL only when justified

Performance should be measured before introducing optimizations.

---

# Compliance

All database access must:

- Flow through repository interfaces
- Use Prisma Client
- Respect transaction boundaries
- Follow migration procedures
- Maintain schema consistency

Direct database access outside approved repositories is prohibited.

---

# Future Review

This decision should be revisited if:

- Prisma no longer meets performance or feature requirements
- PostgreSQL is replaced
- The project adopts a different persistence strategy
- Significant ecosystem changes occur

---

# References

- docs/database/schema.md
- docs/database/migrations.md
- docs/database/indexes.md
- docs/database/constraints.md
- docs/implementation/backend-architecture.md
- docs/implementation/repository-structure.md