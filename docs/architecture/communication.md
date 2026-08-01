# Communication Architecture

Version: 1.0

Status: Active

Owner: SHIAS Team

Last Updated: YYYY-MM-DD

---

# Purpose

This document defines how applications and services within the Secure Health Identity & Access System (SHIAS) communicate with each other.

It establishes the permitted communication paths, protocols, security requirements, and architectural constraints that govern all interactions between system components.

The goal is to ensure a secure, maintainable, and consistent communication model throughout the platform.

---

# Communication Principles

All communication within SHIAS follows these principles:

- API-first communication
- Stateless REST APIs
- HTTPS for secure transport
- JWT-based authentication
- Role-Based Access Control (RBAC)
- No direct database access outside the Core API
- No direct communication between frontends
- Clinical records never pass through the Core API

---

# Communication Protocol

The MVP uses REST APIs over HTTPS.

| Layer | Protocol |
|---------|----------|
| Frontend → Backend | HTTPS + REST |
| Backend → Backend | HTTPS + REST |
| SDK → Core API | HTTPS + REST |

Future versions may introduce asynchronous messaging, but it is outside the MVP.

---

# Communication Matrix

| Source | Destination | Allowed | Purpose |
|----------|-------------|---------|---------|
| Patient Portal | Core API | ✅ | Patient operations |
| Provider Portal | Core API | ✅ | Provider operations |
| Source Provider | Core API | ✅ | Pointer registration, token validation |
| Requesting Provider | Core API | ✅ | Search and authorization |
| Requesting Provider | Source Provider | ✅ | Direct medical record retrieval |
| Core API | PostgreSQL | ✅ | Data persistence |
| Patient Portal | PostgreSQL | ❌ | Not permitted |
| Provider Portal | PostgreSQL | ❌ | Not permitted |
| Source Provider | PostgreSQL (SHIAS) | ❌ | Not permitted |
| Requesting Provider | PostgreSQL (SHIAS) | ❌ | Not permitted |
| Patient Portal | Source Provider | ❌ | Not permitted |
| Patient Portal | Requesting Provider | ❌ | Not permitted |
| Provider Portal | Source Provider | ❌ | Not permitted |

---

# Core API as the Central Hub

The Core API is the only component responsible for:

- Authentication
- Authorization
- Business logic
- Validation
- Database access
- Consent verification
- Audit logging

Every application communicates through the Core API unless a direct provider-to-provider record exchange is required.

---

# Patient Portal Communication

The Patient Portal communicates exclusively with the Core API.

Supported operations include:

- Login
- Registration
- Profile management
- View Health ID
- View consent requests
- Approve consent
- Reject consent
- View consent history

The Patient Portal never communicates directly with healthcare provider systems.

---

# Provider Portal Communication

The Provider Portal communicates exclusively with the Core API.

Supported operations include:

- Login
- Provider registration
- Search Health ID
- Register metadata pointers
- Request consent
- View audit history

The Provider Portal never communicates directly with the Patient Portal.

---

# Source Provider Communication

The Source Provider communicates with:

## Core API

For:

- Authentication
- Pointer registration
- Token validation
- Audit events

## Requesting Provider

For:

- Direct medical record exchange after successful authorization

This is the only communication path where clinical records are transmitted.

---

# Requesting Provider Communication

The Requesting Provider communicates with:

## Core API

For:

- Authentication
- Patient search
- Consent request
- Access token request

## Source Provider

For:

- Retrieving medical records after authorization

---

# SDK Communication

The Node.js SDK communicates only with the Core API.

The SDK abstracts REST API calls and provides a developer-friendly interface for external integrations.

The SDK never communicates directly with provider systems or databases.

---

# Database Communication

Only the Core API may access the SHIAS PostgreSQL database.

Applications and packages must never establish database connections.

```
Applications
      │
      ▼
 Core API
      │
      ▼
 PostgreSQL
```

This ensures centralized business logic and security enforcement.

---

# Authentication Flow

Every protected request follows this sequence:

1. Client authenticates.
2. Core API validates credentials.
3. JWT access token is issued.
4. Client includes the token in future requests.
5. Core API validates the token.
6. Business logic executes.
7. Audit event is recorded.

---

# Authorization Flow

Authorization requires:

- Authenticated identity
- Valid user role
- Verified provider (where applicable)
- Valid patient consent (where applicable)
- Valid access token (where applicable)

Requests failing any check are rejected.

---

# Medical Record Exchange

Medical records never pass through SHIAS.

The workflow is:

1. Requesting Provider receives an access token.
2. Requesting Provider contacts the Source Provider.
3. Source Provider validates the token with SHIAS.
4. Source Provider returns medical records directly.
5. SHIAS records the transaction.

```
Requesting Provider
        │
        │ Access Token
        ▼
Source Provider
        │
        │ Validate Token
        ▼
Core API

Source Provider
        │
        │ Medical Record
        ▼
Requesting Provider
```

---

# Error Communication

The Core API returns standardized HTTP responses.

Examples:

| Status | Meaning |
|---------|----------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 409 | Conflict |
| 422 | Validation Error |
| 500 | Internal Server Error |

All error responses should follow a consistent API format.

---

# Security Requirements

All communication must satisfy the following requirements:

- HTTPS in production
- JWT authentication
- Authorization checks
- Input validation
- Output sanitization
- Audit logging
- Principle of least privilege
- No sensitive information in URLs
- No clinical data stored by SHIAS

---

# Communication Constraints

The following are prohibited:

- Frontend-to-database communication
- Direct frontend-to-frontend communication
- Patient Portal to Provider System communication
- Provider Portal to Provider System communication
- Clinical records passing through the Core API
- Shared database access by multiple applications

These constraints are mandatory and must not be bypassed.

---

# Future Enhancements

Future versions may introduce:

- Event-driven messaging
- Notification service
- Webhooks
- API Gateway
- Rate limiting service
- Service discovery
- Distributed caching

These enhancements must preserve the communication principles defined in this document.

---

# Related Documents

- system-overview.md
- system-context.md
- container-architecture.md
- domain-model.md
- business-rules.md