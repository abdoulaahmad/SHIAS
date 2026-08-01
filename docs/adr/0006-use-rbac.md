# ADR-0006: Use Role-Based Access Control (RBAC) with Consent-Aware Authorization

Status: Accepted

Date: YYYY-MM-DD

Decision Makers:

- SHIAS Team

---

# Context

SHIAS is responsible for protecting sensitive healthcare identity and metadata.

The platform manages:

- Patient identities
- Provider organizations
- Metadata pointers
- Consent records
- Access tokens
- Audit events

Not every authenticated user should have equal access.

Access decisions must consider:

- User role
- Resource ownership
- Patient consent
- Resource state
- Business rules

The authorization model must remain understandable, testable, and secure.

---

# Decision

SHIAS will use:

- Role-Based Access Control (RBAC)
- Resource Ownership
- Consent-Based Authorization
- Policy-Based Authorization (PBAC) implementation

RBAC determines the user's baseline permissions.

Policies evaluate whether those permissions apply to a specific resource.

Patient consent governs access to protected healthcare resources.

---

# Decision Drivers

- Security
- Least privilege
- Maintainability
- Predictability
- Regulatory compliance
- Auditability
- Simplicity

---

# Authorization Model

Authorization consists of multiple layers.

```
Authenticated User

↓

Role Check

↓

Ownership Check

↓

Consent Validation

↓

Business Rules

↓

Allow / Deny
```

Every layer must succeed.

---

# Roles

The MVP defines:

## Patient

Capabilities include:

- Manage own profile
- Approve consent
- Reject consent
- Revoke consent
- View own pointers
- View own audit history
- Manage own sessions

Patients cannot access other patients' resources.

---

## Provider User

Capabilities include:

- Search patients
- Request consent
- View granted metadata pointers
- Request access tokens

Provider users cannot bypass patient consent.

---

## Administrator

Capabilities include:

- Register providers
- Verify providers
- Manage provider users
- Suspend accounts
- View operational audit events

Administrators do not receive automatic access to patient healthcare data.

---

# Why RBAC

RBAC provides:

- Clear permission boundaries
- Simple reasoning
- Easy testing
- Straightforward auditing
- Stable permission management

Most system operations depend primarily on organizational roles.

---

# Why Resource Ownership

Role alone is insufficient.

Example:

Two patients share the same role.

Only the owner should modify their profile.

Ownership determines:

```
Patient A

↓

Own Profile

↓

Allowed

Patient A

↓

Patient B Profile

↓

Denied
```

---

# Why Consent

Healthcare access is governed by patient authorization.

Even if a provider user has permission to request access, they cannot access metadata pointers unless:

- Consent exists
- Consent is active
- Consent scope matches
- Consent has not expired
- Consent has not been revoked

Consent is therefore an essential authorization requirement.

---

# Policy-Based Enforcement

Authorization logic is centralized through policies.

Example:

```
PatientPolicy

ProviderPolicy

ConsentPolicy

PointerPolicy

AuditPolicy
```

Policies evaluate:

- Role
- Ownership
- Consent
- Resource state

Controllers never perform authorization directly.

---

# Permission Model

Permissions follow the pattern:

```
RESOURCE:ACTION
```

Examples:

```
PATIENT:READ_SELF

PATIENT:UPDATE_SELF

PROVIDER:VERIFY

CONSENT:APPROVE

POINTER:READ

AUDIT:READ
```

Permissions express capability.

Policies determine applicability.

---

# Alternatives Considered

## Hard-Coded Authorization

Rejected.

Example:

```ts
if (user.role !== "ADMIN") {
  throw new ForbiddenError();
}
```

Problems:

- Difficult to maintain
- Logic duplicated
- Poor testability
- Inconsistent behavior

---

## Pure Attribute-Based Access Control (ABAC)

Considered.

Pros:

- Extremely flexible
- Fine-grained decisions

Cons:

- Greater implementation complexity
- Harder to reason about
- More difficult to audit
- Higher testing burden

ABAC may be introduced selectively in future versions.

---

## ACL (Access Control Lists)

Rejected.

Pros:

- Resource-level permissions

Cons:

- Difficult to manage at scale
- Increased storage complexity
- Not well suited to SHIAS's ownership and consent model

---

# Consequences

Positive:

- Simple permission model
- Clear separation of concerns
- Easy testing
- Predictable authorization
- Strong security
- Supports future expansion

Negative:

- More policy classes
- Additional authorization layer
- Some workflows require multiple checks

These trade-offs are acceptable.

---

# Implementation Guidelines

Authorization checks occur in the Application Layer.

Sequence:

```
Authenticate

↓

Load Resource

↓

Evaluate Policy

↓

Execute Use Case
```

Policies remain independent of Fastify and Prisma.

---

# Compliance

Every protected operation must:

- Authenticate the caller
- Evaluate role
- Verify ownership
- Validate consent where required
- Apply business rules
- Generate audit events

The default decision is:

```
DENY
```

---

# Future Review

This decision should be revisited if:

- Organizational hierarchies become more complex
- Fine-grained delegated administration is introduced
- Emergency "break-glass" access is implemented
- Regulatory requirements necessitate attribute-based policies

---

# References

- docs/implementation/authorization-model.md
- docs/implementation/authentication-flow.md
- docs/project/business-rules.md
- docs/contracts/consent.md
- docs/contracts/access-broker.md