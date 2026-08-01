# ADR-0014: Use the Transactional Outbox Pattern for Reliable Event Delivery

Status: Accepted

Date: YYYY-MM-DD

Decision Makers:

- SHIAS Team

---

# Context

SHIAS uses Domain Events to communicate important business events between modules.

Examples include:

- PatientRegistered
- ProviderVerified
- ConsentApproved
- ConsentRevoked
- MetadataPointerCreated
- AccessTokenIssued

These events are generated as part of normal business transactions.

A failure can occur after the database transaction commits but before an event is delivered.

Example:

```
Save Consent

↓

Commit Database Transaction

↓

Application Crashes

↓

Consent Exists

↓

ConsentApproved Event Lost
```

Lost events can result in:

- Missing audit records
- Missing notifications
- Inconsistent downstream processing
- Difficult recovery

The platform requires reliable event publication.

---

# Decision

SHIAS will use the **Transactional Outbox Pattern**.

Business transactions and event persistence occur within the same database transaction.

A background dispatcher publishes events from the Outbox after the transaction commits.

---

# Decision Drivers

- Reliability
- Consistency
- Recoverability
- Fault tolerance
- Future message broker compatibility
- Observability

---

# Architecture

```
Application Service

↓

Aggregate

↓

Domain Events

↓

Database Transaction

├── Business Tables
└── Outbox Table

↓

Commit

↓

Outbox Processor

↓

Event Dispatcher

↓

Consumers
```

Event persistence becomes part of the business transaction.

---

# Transaction Flow

```
Begin Transaction

↓

Update Business Data

↓

Create Domain Event

↓

Insert Outbox Record

↓

Commit Transaction

↓

Dispatcher Reads Outbox

↓

Publish Event

↓

Mark Outbox Record as Processed
```

Either both the business data and outbox record are committed, or neither is.

---

# Outbox Table

Each record contains:

- Outbox ID
- Event ID
- Event Type
- Event Version
- Aggregate ID
- Aggregate Type
- Payload
- Correlation ID
- Created At
- Published At
- Processing Status
- Retry Count
- Last Error

This table serves as the durable event queue.

---

# Dispatcher

A dedicated background process is responsible for:

- Reading pending events
- Publishing events
- Recording success
- Recording failures
- Scheduling retries

The dispatcher is infrastructure and does not contain business logic.

---

# Retry Strategy

If publication fails:

```
Pending

↓

Retry 1

↓

Retry 2

↓

Retry 3

↓

Dead Letter / Manual Review
```

Retries should use exponential backoff to avoid overwhelming dependent systems.

---

# Idempotency

Event consumers must be idempotent.

Processing the same event multiple times must produce the same outcome.

Consumers should use the Event ID to detect duplicates.

---

# Ordering

Events from the same aggregate should be published in creation order.

Example:

```
ConsentRequested

↓

ConsentApproved

↓

ConsentRevoked
```

Ordering across unrelated aggregates is not guaranteed.

---

# Failure Recovery

If the application crashes:

- Business data remains committed.
- Outbox records remain in the database.
- The dispatcher resumes processing after restart.

No events are lost.

---

# Monitoring

Operational metrics should include:

- Pending outbox count
- Processing rate
- Failed publications
- Retry count
- Average publish latency
- Oldest pending event

These metrics support operational visibility.

---

# Alternatives Considered

## Immediate Event Dispatch

Rejected.

Pros:

- Simple implementation
- Low latency

Cons:

- Events may be lost after database commit
- No retry capability
- Poor crash recovery

---

## Distributed Transactions (2PC)

Rejected.

Pros:

- Strong consistency

Cons:

- High complexity
- Poor scalability
- Vendor dependency
- Difficult operations

---

## External Message Broker Transactions

Rejected.

Pros:

- Strong broker integration

Cons:

- Infrastructure coupling
- Additional operational complexity
- Not required for the MVP

---

# Consequences

Positive:

- Reliable event delivery
- Crash recovery
- Retry support
- Better observability
- Future broker compatibility

Negative:

- Additional table
- Background processing component
- Slight delay before event publication

These trade-offs are acceptable.

---

# Implementation Guidelines

The Domain layer should only create Domain Events.

The Application layer should:

- Execute business logic
- Persist aggregates
- Persist outbox records

The Infrastructure layer should:

- Poll pending outbox records
- Publish events
- Update processing status
- Handle retries

Business modules must never publish events directly.

---

# Outbox Cleanup

Processed records should not remain indefinitely.

Retention policy:

- Keep processed events for a configurable period (for example, 30–90 days)
- Archive or delete records after the retention period
- Preserve records needed for audit or troubleshooting in accordance with operational policies

Cleanup jobs must not interfere with active event processing.

---

# Compliance

Every Domain Event must:

- Be persisted in the Outbox within the same transaction
- Be published only after a successful commit
- Support idempotent consumption
- Include version information
- Include correlation metadata

Direct publication without the Outbox is prohibited.

---

# Future Evolution

The dispatcher may later publish to:

- RabbitMQ
- Kafka
- NATS
- AWS SNS/SQS
- Azure Service Bus

The business code should remain unchanged.

Future architecture:

```
Business Transaction

↓

Outbox

↓

Dispatcher

↓

Message Broker

↓

Independent Services
```

---

# Future Review

This decision should be revisited if:

- The platform adopts event sourcing
- Message broker capabilities change significantly
- Operational requirements justify an alternative delivery mechanism

---

# References

- docs/adr/0013-use-domain-events.md
- docs/adr/0012-use-modular-monolith.md
- docs/implementation/backend-architecture.md
- docs/database/schema.md