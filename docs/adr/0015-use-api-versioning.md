# ADR-0015: Use URI-Based API Versioning

Status: Accepted

Date: YYYY-MM-DD

Decision Makers:

- SHIAS Team

---

# Context

SHIAS exposes REST APIs consumed by:

- Patient Portal
- Provider Portal
- Provider Systems
- SDKs
- Third-party Integrations
- Future Mobile Applications

Over time, APIs will evolve.

Changes may include:

- New fields
- New endpoints
- Modified validation rules
- New authentication mechanisms
- New business capabilities

Without a clear versioning strategy, API evolution can:

- Break existing clients
- Increase maintenance costs
- Reduce developer confidence
- Make upgrades difficult

The platform requires a predictable and maintainable versioning strategy.

---

# Decision

SHIAS will use **URI-based API versioning**.

All public API endpoints include a version prefix.

Example:

```
/api/v1/patients

/api/v1/providers

/api/v1/consents

/api/v1/pointers
```

Major API versions receive a new URI.

---

# Decision Drivers

- Backward compatibility
- Simplicity
- Discoverability
- Tool compatibility
- Documentation clarity
- SDK generation
- Long-term maintainability

---

# Why URI Versioning

URI versioning is:

- Explicit
- Easy to understand
- Supported by all HTTP clients
- Well supported by API gateways
- Compatible with OpenAPI

Clients can immediately determine which version they are consuming.

---

# Version Lifecycle

Each version progresses through:

```
Preview

↓

Stable

↓

Deprecated

↓

Retired
```

Only stable versions are recommended for production.

---

# Versioning Rules

Major versions introduce:

- Breaking changes
- Removed fields
- Removed endpoints
- Behavioral changes
- Authentication changes

Minor, backward-compatible improvements remain within the same major version.

Examples:

Allowed in v1:

- New optional fields
- New endpoints
- Additional filters
- Additional sort options

Not allowed in v1:

- Removing required fields
- Changing field meanings
- Renaming properties
- Removing endpoints
- Changing authentication semantics

---

# Breaking Changes

Examples include:

- Required request changes
- Removed response fields
- Changed validation behavior
- Changed authorization behavior
- Removed resources

Breaking changes require a new major version.

Example:

```
/api/v1

↓

/api/v2
```

---

# Backward Compatibility

Version updates should preserve compatibility whenever practical.

Examples:

Allowed:

```
{
  "id": "...",
  "name": "...",
  "phone": "..."
}
```

↓

```
{
  "id": "...",
  "name": "...",
  "phone": "...",
  "email": "..."
}
```

Adding optional fields is considered backward compatible.

---

# Deprecation Policy

When a version is deprecated:

- Documentation is updated
- Release notes are published
- Migration guidance is provided
- Support timeline is communicated

Deprecated versions continue to receive:

- Security fixes
- Critical bug fixes

They do not receive new features.

---

# Retirement Policy

A version may be retired after:

- Published notice
- Defined support period
- Migration documentation
- Customer communication

Retired versions are removed from production.

---

# OpenAPI

Each API version maintains its own specification.

Examples:

```
openapi/v1.yaml

openapi/v2.yaml
```

Documentation remains synchronized with the deployed API.

---

# SDKs

Each SDK release targets a specific API version.

Example:

```
SDK v1

↓

API v1
```

SDKs must clearly document supported API versions.

---

# URL Structure

Public APIs follow:

```
/api/v1/

patients/

providers/

consents/

pointers/

audit/
```

Version prefixes remain consistent across all resources.

---

# Alternatives Considered

## Header-Based Versioning

Example:

```
Accept:
application/vnd.shias.v1+json
```

Rejected.

Pros:

- Cleaner URLs
- HTTP compliant

Cons:

- Harder to discover
- More difficult debugging
- Poor browser usability
- More complex documentation

---

## Query Parameter Versioning

Example:

```
/patients?version=1
```

Rejected.

Pros:

- Easy implementation

Cons:

- Poor cache behavior
- Less explicit
- Rarely recommended for public APIs

---

## Media-Type Versioning

Rejected.

Pros:

- Flexible

Cons:

- Increased client complexity
- Reduced tooling compatibility

---

# Consequences

Positive:

- Clear API evolution
- Better client compatibility
- Simple documentation
- Easy OpenAPI support
- Predictable upgrades

Negative:

- Multiple versions require maintenance
- Documentation duplication
- Temporary operational overhead

These trade-offs are acceptable.

---

# Implementation Guidelines

Controllers should be organized by version.

Example:

```
src/

api/

v1/

patients/

providers/

consents/

audit/
```

Business logic should remain version-independent whenever possible.

Version-specific behavior should be isolated to:

- Controllers
- Request mapping
- Response mapping
- Validation

---

# Compliance

Every public endpoint must:

- Belong to a version
- Be documented
- Follow compatibility rules
- Provide migration guidance if deprecated

Unversioned public APIs are prohibited.

---

# Future Review

This decision should be revisited if:

- API standards change significantly
- The platform adopts GraphQL or gRPC
- Operational experience suggests a different versioning strategy

---

# References

- docs/contracts/api-overview.md
- docs/contracts/errors.md
- docs/contracts/pagination.md
- docs/adr/0010-use-openapi-first.md