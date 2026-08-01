# ADR-0004: Use PostgreSQL as the Primary Database

Status: Accepted

Date: YYYY-MM-DD

Decision Makers:

- SHIAS Team

---

# Context

SHIAS is a healthcare identity and consent platform responsible for storing:

- Patient identities
- Provider organizations
- Provider users
- Metadata pointers
- Consent records
- Access tokens
- User sessions
- Audit events
- System configuration

The platform requires a database that provides:

- Strong transactional guarantees
- High reliability
- Data integrity
- Mature indexing capabilities
- JSON document support
- Excellent TypeScript tooling
- Long-term stability

Because healthcare systems handle sensitive information, data consistency and durability are higher priorities than raw write throughput.

---

# Decision

SHIAS will use **PostgreSQL** as its primary relational database.

PostgreSQL is the authoritative source of truth for all persistent platform data.

---

# Decision Drivers

- ACID compliance
- Data integrity
- Transaction support
- Mature ecosystem
- JSONB support
- Rich indexing
- Excellent tooling
- Reliability
- Open source
- Long-term support

---

# Rationale

## ACID Transactions

Healthcare workflows frequently involve multiple related operations.

Examples include:

- Patient registration
- Consent approval
- Access token issuance
- Session creation

These operations must succeed or fail as a single unit.

PostgreSQL provides full ACID transaction guarantees.

---

## Data Integrity

PostgreSQL supports robust integrity mechanisms, including:

- Primary keys
- Foreign keys
- CHECK constraints
- UNIQUE constraints
- NOT NULL constraints
- Referential integrity

These features align with SHIAS's database design principles.

---

## JSONB Support

Some data structures are semi-structured.

Examples include:

- Audit metadata
- Provider-specific metadata
- Request context
- Feature flags

PostgreSQL's `JSONB` type enables efficient storage and querying of such data without sacrificing relational modeling.

---

## Indexing

PostgreSQL supports a wide range of index types.

Examples include:

- B-tree
- Hash
- GIN
- GiST
- Partial indexes
- Composite indexes
- Covering indexes

These capabilities support the platform's performance requirements.

---

## Concurrency

The platform may process multiple concurrent operations involving the same resources.

PostgreSQL's Multi-Version Concurrency Control (MVCC) enables high concurrency while preserving consistency.

---

## Reliability

PostgreSQL is widely used in:

- Financial systems
- Healthcare platforms
- Government systems
- Enterprise applications

Its proven stability makes it an appropriate choice for SHIAS.

---

## Standards Compliance

PostgreSQL adheres closely to SQL standards and offers advanced features such as:

- Window functions
- Common Table Expressions (CTEs)
- Materialized views
- Recursive queries

These features support future reporting and analytics requirements.

---

## Ecosystem

PostgreSQL integrates well with:

- Prisma
- Fastify
- Node.js
- TypeScript
- Monitoring tools
- Backup solutions

This aligns with the rest of the SHIAS technology stack.

---

# Alternatives Considered

## MySQL

Rejected.

Pros:

- Mature
- Large community
- Broad hosting support

Cons:

- Less feature-rich for advanced SQL workloads
- Weaker JSON capabilities compared to PostgreSQL
- Fewer advanced indexing options

PostgreSQL better matches SHIAS's long-term needs.

---

## MongoDB

Rejected.

Pros:

- Flexible schema
- High scalability
- Good developer experience

Cons:

- Document model is less suitable for highly relational healthcare data
- Referential integrity must often be enforced in application code
- Multi-document transactions introduce additional complexity

The relational nature of SHIAS favors PostgreSQL.

---

## SQLite

Rejected.

Pros:

- Lightweight
- Simple setup
- Excellent for local development

Cons:

- Not designed for concurrent production workloads
- Limited scalability
- File-based storage

SQLite remains useful for local prototypes but not production deployment.

---

## Microsoft SQL Server

Rejected.

Pros:

- Enterprise-grade
- Mature tooling
- Excellent performance

Cons:

- Licensing costs
- Vendor lock-in
- Less suitable for the project's open-source technology stack

---

# Consequences

Positive:

- Strong consistency guarantees
- Excellent performance for relational workloads
- Mature ecosystem
- Advanced indexing
- Rich SQL feature set
- Long-term maintainability

Negative:

- More operational complexity than embedded databases
- Requires ongoing administration
- Advanced features have a learning curve

These trade-offs are appropriate for a healthcare platform.

---

# Implementation Guidelines

PostgreSQL is responsible for:

- Persistent storage
- Transactions
- Constraints
- Indexes
- Query execution

Business rules remain outside the database and are enforced in the Application and Domain layers.

---

# Performance Considerations

Developers should:

- Use appropriate indexes
- Avoid unnecessary full-table scans
- Optimize frequently executed queries
- Use pagination for large result sets
- Monitor slow queries
- Review execution plans when necessary

Optimization decisions should be based on measured performance.

---

# Backup and Recovery

The deployment strategy includes:

- Automated backups
- Encrypted backup storage
- Periodic restore testing
- Recovery documentation

Database recovery procedures are documented separately.

---

# Compliance

All persistent data must:

- Reside in PostgreSQL
- Be accessed through Prisma repositories
- Follow migration procedures
- Respect transaction boundaries
- Comply with documented schema constraints

Direct database modifications outside approved migration workflows are prohibited.

---

# Future Review

This decision should be revisited if:

- Platform requirements change significantly
- Multi-region database architecture becomes necessary
- PostgreSQL no longer satisfies operational needs
- Alternative technologies provide substantial benefits

---

# References

- docs/database/overview.md
- docs/database/schema.md
- docs/database/indexes.md
- docs/database/migrations.md
- docs/implementation/backend-architecture.md
- docs/implementation/deployment.md