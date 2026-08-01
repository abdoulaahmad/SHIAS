# Authorization Model

Version: 1.0

Status: Active

Owner: SHIAS Team

Last Updated: YYYY-MM-DD

---

# Purpose

This document defines the authorization model for the Secure Health Identity & Access System (SHIAS).

It specifies:

- Roles
- Permissions
- Resource ownership
- Access policies
- Authorization workflow
- Policy enforcement

Authorization determines what an authenticated user is permitted to do.

---

# Authorization Principles

The authorization model follows these principles:

- Least Privilege
- Default Deny
- Resource Ownership
- Explicit Permission Checks
- Auditability
- Separation of Duties

Unless explicitly permitted, access is denied.

---

# Authorization Architecture

```
HTTP Request

↓

Authentication

↓

Load User Context

↓

Load Resource

↓

Evaluate Policies

↓

Allow / Deny

↓

Audit Decision
```

Authorization only occurs after successful authentication.

---

# Authorization Components

The authorization system evaluates:

- Authenticated User
- User Role
- Resource Owner
- Resource State
- Granted Permissions
- Business Rules

---

# Roles

The MVP defines three primary roles.

## Patient

Represents an individual who owns their medical identity.

Capabilities include:

- Manage profile
- View pointers
- Create consent
- Approve consent
- Reject consent
- Revoke consent
- View audit history
- Manage sessions

Patients cannot manage providers or system settings.

---

## Provider User

Represents a user employed by a healthcare provider.

Capabilities include:

- Search patients
- Request consent
- View granted pointers
- Request access tokens
- View provider activity

Provider users cannot manage patients outside authorized workflows.

---

## Administrator

Responsible for platform administration.

Capabilities include:

- Manage providers
- Create provider users
- Verify providers
- Suspend users
- Configure system settings
- Review audit events

Administrators do not automatically gain access to patient medical data.

---

# Permission Model

Permissions follow the format:

```
RESOURCE:ACTION
```

Examples:

```
PATIENT:READ

PATIENT:UPDATE

PROVIDER:CREATE

PROVIDER:VERIFY

CONSENT:APPROVE

CONSENT:REVOKE

POINTER:READ

POINTER:CREATE

ACCESS_TOKEN:ISSUE

AUDIT:READ
```

---

# Permission Matrix

| Permission | Patient | Provider User | Administrator |
|------------|----------|---------------|---------------|
| PATIENT:READ_SELF | ✅ | ❌ | ❌ |
| PATIENT:UPDATE_SELF | ✅ | ❌ | ❌ |
| PROVIDER:READ | ❌ | ✅ | ✅ |
| PROVIDER:VERIFY | ❌ | ❌ | ✅ |
| PROVIDER_USER:CREATE | ❌ | ❌ | ✅ |
| POINTER:READ | Owner Only | Granted Only | Metadata Only |
| POINTER:CREATE | ❌ | Source Provider | ❌ |
| CONSENT:CREATE | ✅ | Request Only | ❌ |
| CONSENT:APPROVE | Owner Only | ❌ | ❌ |
| CONSENT:REVOKE | Owner Only | ❌ | ❌ |
| ACCESS_TOKEN:ISSUE | ❌ | ✅ | ❌ |
| AUDIT:READ_SELF | ✅ | ✅ | ❌ |
| AUDIT:READ_ALL | ❌ | ❌ | ✅ |

---

# Resource Ownership

Every protected resource has an owner.

Examples:

| Resource | Owner |
|----------|-------|
| Patient Profile | Patient |
| Metadata Pointer | Source Provider |
| Consent | Patient |
| Access Token | Requesting Provider |
| Session | Authenticated User |

Ownership is verified before authorization.

---

# Ownership Rules

Patients may only access:

- Their own profile
- Their own consents
- Their own audit history
- Their own sessions

Provider users may only access:

- Resources belonging to their provider
- Pointers granted through consent
- Their own sessions

Administrators may manage system resources but cannot bypass consent requirements.

---

# Consent-Based Authorization

Medical data access requires:

```
Authenticated Provider

↓

Valid Consent

↓

Matching Scope

↓

Issue Access Token

↓

Retrieve Records
```

Without valid consent, access is denied.

---

# Scope Evaluation

Consent defines the scope of access.

Example:

```json
{
  "permissions": ["READ"],
  "recordTypes": ["LAB_RESULTS"],
  "expiresAt": "2026-09-01T00:00:00Z"
}
```

Authorization verifies:

- Permission
- Record type
- Expiration
- Revocation status

---

# Policy Enforcement

Authorization checks occur in the Application Layer.

Controllers must never contain authorization logic.

Example:

```
Controller

↓

Use Case

↓

Authorization Policy

↓

Repository
```

---

# Authorization Policies

Policies evaluate:

- Role
- Ownership
- Consent
- Resource status
- Provider relationship
- Business rules

Policies return:

```
ALLOW

or

DENY
```

---

# Denied Requests

Requests are denied when:

- User lacks permission
- Resource ownership fails
- Consent missing
- Consent expired
- Consent revoked
- Session revoked
- User suspended

---

# Policy Examples

## Patient Updates Profile

Requirements:

- Authenticated
- Role = Patient
- Own profile

Result:

Allow

---

## Provider Reads Pointer

Requirements:

- Authenticated
- Provider User
- Valid consent
- Pointer included in consent

Result:

Allow

---

## Administrator Reads Medical Record

Requirements:

Administrator role only

Result:

Denied

Administrators cannot bypass patient consent.

---

# Session Validation

Authorization also verifies:

- Session active
- Account active
- User not suspended
- Token valid

---

# Service-Level Authorization

Every use case performs authorization before business logic.

Example:

```
UpdatePatientUseCase

↓

Authorize()

↓

Business Logic

↓

Persist
```

---

# Audit Logging

Every authorization decision generates an audit event.

Examples:

- AUTHORIZATION_GRANTED
- AUTHORIZATION_DENIED
- CONSENT_SCOPE_VIOLATION
- RESOURCE_ACCESS

Audit logs include:

- User ID
- Resource ID
- Action
- Decision
- Timestamp
- Correlation ID

---

# Error Responses

Authorization failures return:

```
403 Forbidden
```

Response body follows RFC 7807 Problem Details.

Sensitive authorization details are never exposed.

---

# Future Enhancements

Future versions may introduce:

- Attribute-Based Access Control (ABAC)
- Organization hierarchies
- Delegated administration
- Emergency "break glass" access
- Fine-grained policy engine

---

# Business Rules

- Authorization requires successful authentication.
- Default decision is DENY.
- Resource ownership is always verified.
- Patient consent governs access to medical data.
- Administrators cannot bypass consent.
- Policies are enforced in the Application Layer.
- Every authorization decision is audited.

---

# Related Documents

- authentication-flow.md
- backend-architecture.md
- contracts/consent.md
- contracts/access-broker.md
- business-rules.md
- audit.md