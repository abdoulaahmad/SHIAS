# ADR-0013: Use Domain Events for Inter-Module Communication

Status: Accepted

Date: YYYY-MM-DD

Decision Makers:

- SHIAS Team

---

# Context

SHIAS consists of several business modules:

- Identity
- Provider Management
- Pointer Registry
- Consent
- Access Broker
- Audit

Many business operations require one module to notify another that something important has occurred.

Examples include:

- Patient registered
- Provider verified
- Consent approved
- Consent revoked
- Metadata pointer created
- Access token issued

Calling another module directly for every business action tightly couples the system and makes future evolution difficult.

The architecture requires a communication mechanism that preserves module independence while maintaining consistency.

---

# Decision

SHIAS will use **Domain Events** to communicate significant business occurrences between modules.

A domain event represents something that has already happened within a bounded context.

Events are immutable and describe completed business facts.

---

# Decision Drivers

- Loose coupling
- Maintainability
- Extensibility
- Clear business language
- Future microservice compatibility
- Improved testability

---

# Event Flow

A typical event flow is:

```
Command

↓

Application Service

↓

Aggregate

↓

Domain Event

↓

Event Dispatcher

↓

Interested Module(s)
```

The originating module does not know which consumers will process the event.

---

# Event Characteristics

Domain events must be:

- Immutable
- Timestamped
- Versioned
- Business-focused
- Past tense

Examples:

- PatientRegistered
- ProviderVerified
- ConsentApproved
- ConsentRevoked
- MetadataPointerCreated
- AccessTokenIssued
- SessionRevoked

Events describe facts, not requests.

---

# Event Ownership

Only the module that owns an aggregate may publish events about that aggregate.

Examples:

Identity Module

Publishes:

- PatientRegistered
- PatientUpdated
- SessionCreated

Consent Module

Publishes:

- ConsentRequested
- ConsentApproved
- ConsentRejected
- ConsentRevoked

Audit Module does not publish Identity events.

Ownership prevents conflicting event definitions.

---

# Event Consumers

Multiple modules may consume the same event.

Example:

```
PatientRegistered

↓

Audit Module

↓

Create Audit Event

↓

Notification Module (future)

↓

Send Welcome Notification

↓

Analytics Module (future)

↓

Update Metrics
```

Publishers remain unaware of consumers.

---

# Event Structure

Each event should include:

- Event ID
- Event Type
- Event Version
- Aggregate ID
- Aggregate Type
- Occurred At
- Correlation ID
- Payload

Example:

```json
{
  "eventId": "uuid",
  "eventType": "ConsentApproved",
  "eventVersion": 1,
  "aggregateId": "consent-id",
  "aggregateType": "Consent",
  "occurredAt": "2026-01-01T12:00:00Z",
  "correlationId": "request-id",
  "payload": {
    "patientId": "...",
    "providerId": "...",
    "scope": "..."
  }
}
```

---

# Event Dispatching

In the modular monolith, events are dispatched in-process.

```
Module

↓

Event Dispatcher

↓

Registered Handlers
```

No external message broker is required.

---

# Transaction Boundary

Domain events are raised during business operations but should only be dispatched **after the surrounding database transaction commits successfully**.

This prevents consumers from acting on changes that are later rolled back.

If the transaction fails, the event must not be published.

---

# Event Ordering

Within a single aggregate, events must be processed in the order they occurred.

Example:

```
ConsentRequested

↓

ConsentApproved

↓

ConsentRevoked
```

Consumers should not observe these events out of sequence.

---

# Error Handling

Failures in one event handler should not corrupt the originating business transaction.

Handlers should:

- Log failures
- Support retries where appropriate
- Be idempotent
- Avoid side effects before validation

Future asynchronous implementations may introduce dead-letter queues.

---

# Alternatives Considered

## Direct Module Calls

Rejected.

Pros:

- Simple
- Easy to understand

Cons:

- Tight coupling
- Difficult evolution
- Harder testing
- Reduced extensibility

---

## Shared Services

Rejected.

Pros:

- Reusable

Cons:

- Centralized dependencies
- Poor module isolation
- Large service classes over time

---

## Message Broker from Day One

Rejected.

Examples:

- RabbitMQ
- Kafka
- NATS

Pros:

- Asynchronous processing
- Independent scaling

Cons:

- Operational complexity
- Distributed failure modes
- Additional infrastructure

Current requirements do not justify this complexity.

---

# Consequences

Positive:

- Loose coupling
- Better extensibility
- Clear business communication
- Easier testing
- Future-ready architecture

Negative:

- More architectural concepts
- Event version management
- Additional debugging considerations

These trade-offs are acceptable.

---

# Implementation Guidelines

Events belong to the Domain layer.

Application Services should:

- Execute business logic
- Commit the transaction
- Dispatch collected events

Infrastructure is responsible for event delivery.

Handlers should remain independent and focused on a single responsibility.

---

# Compliance

All published events must:

- Represent completed business facts
- Be immutable
- Use descriptive past-tense names
- Include event metadata
- Preserve backward compatibility when versioned

Modules must not publish events on behalf of other modules.

---

# Future Evolution

The event model should allow future replacement of the in-process dispatcher with an external message broker without changing the domain model.

Possible future architecture:

```
Current

Module

↓

In-Process Dispatcher

↓

Handlers

Future

Module

↓

Outbox

↓

Message Broker

↓

Subscribers
```

The business code should remain unchanged.

---

# Future Review

This decision should be revisited if:

- Modules become independently deployed services
- Event throughput exceeds in-process capabilities
- Cross-system integrations require external messaging infrastructure

---

# References

- docs/adr/0012-use-modular-monolith.md
- docs/adr/0011-use-domain-driven-design.md
- docs/architecture/domain-model.md
- docs/implementation/backend-architecture.md