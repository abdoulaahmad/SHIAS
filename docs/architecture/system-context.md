# System Context

Version: 1.0

Status: Active

Owner: SHIAS Team

Last Updated: YYYY-MM-DD

---

# Purpose

This document defines the system boundary of the Secure Health Identity & Access System (SHIAS) and identifies the external actors and systems that interact with it.

It provides a high-level view of where SHIAS fits within the healthcare ecosystem without describing internal implementation details.

This document corresponds to the Context level of the C4 Model.

---

# Overview

SHIAS acts as a secure interoperability platform between independent healthcare providers.

It enables healthcare providers to discover and retrieve patient medical records through patient-controlled consent while ensuring that clinical records remain within the originating healthcare provider.

SHIAS coordinates communication between patients and healthcare providers but never stores clinical records.

---

# System Boundary

The SHIAS platform includes:

- Core API
- Patient Portal
- Provider Portal
- Identity Management
- Pointer Registry
- Consent Management
- Access Broker
- Audit Service
- PostgreSQL Database

The following systems exist outside SHIAS:

- Source Provider Systems
- Requesting Provider Systems
- Healthcare Professionals
- Patients
- Future Government Health Systems

---

# External Actors

## Patient

Patients are the owners of consent decisions.

Patients interact with SHIAS through the Patient Portal to:

- Register
- Authenticate
- View their Health ID
- Review consent requests
- Approve or reject requests
- Review previous consent history

Patients never interact directly with provider systems during interoperability operations.

---

## Healthcare Provider

Healthcare providers participate in SHIAS to exchange medical information.

Providers use the Provider Portal to:

- Register their organization
- Search for patient records
- Request patient consent
- Register metadata pointers
- View audit history

Providers remain responsible for maintaining their own clinical records.

---

## Source Provider System

The Source Provider System owns and manages patient medical records.

Responsibilities include:

- Storing clinical records
- Registering metadata pointers
- Validating access tokens
- Returning medical records to authorized providers

Clinical records never leave the Source Provider except during an authorized exchange.

---

## Requesting Provider System

The Requesting Provider System requests access to medical records owned by another healthcare provider.

Responsibilities include:

- Searching for patient records
- Requesting patient consent
- Receiving authorization
- Retrieving medical records

---

# Core Responsibilities of SHIAS

SHIAS is responsible for:

- Managing Health IDs
- Managing healthcare provider identities
- Registering metadata pointers
- Discovering record locations
- Managing patient consent
- Issuing authorization tokens
- Recording audit events

---

# Responsibilities Outside SHIAS

The following responsibilities remain outside SHIAS:

- Creating medical records
- Updating medical records
- Deleting medical records
- Clinical diagnosis
- Treatment planning
- Hospital operations
- Appointment scheduling
- Medical billing
- Laboratory processing

---

# Information Flow

The high-level information flow is:

1. Patients register with SHIAS.
2. Healthcare providers register with SHIAS.
3. Source Providers register metadata pointers.
4. Requesting Providers search using a Health ID.
5. Patients approve consent requests.
6. SHIAS issues an access token.
7. Source Providers validate the token.
8. Medical records are exchanged directly between providers.
9. SHIAS records the transaction in the audit log.

Clinical records never pass through persistent SHIAS storage.

---

# Trust Boundaries

The architecture contains two primary trust boundaries.

## Trust Boundary 1

Between external users and SHIAS.

All requests crossing this boundary require:

- Authentication
- Authorization
- Input validation
- Secure communication

---

## Trust Boundary 2

Between SHIAS and healthcare provider systems.

Communication requires:

- Provider authentication
- Access token validation
- Secure HTTPS connections
- Audit logging

---

# Data Ownership

| Data | Owner |
|-------|-------|
| Health IDs | SHIAS |
| Provider Accounts | SHIAS |
| Metadata Pointers | SHIAS |
| Consent Records | SHIAS |
| Audit Logs | SHIAS |
| Clinical Records | Source Provider |

---

# Security Considerations

The system context enforces several architectural principles:

- SHIAS never stores clinical records.
- Every protected operation requires authentication.
- Every authorization decision depends on patient consent.
- Every sensitive operation generates an audit event.
- Healthcare providers retain ownership of their medical records.
- Patients remain in control of consent decisions.

---

# Assumptions

The MVP assumes:

- Participating healthcare providers expose secure APIs.
- Patients have internet access to manage consent.
- Providers authenticate before accessing protected services.
- HTTPS is used for all production communication.
- PostgreSQL is available as the system database.

---

# Out of Scope

This document does not describe:

- Internal service implementation
- Database schema
- API endpoints
- User interface design
- Deployment configuration

These topics are covered in separate documentation.

---

# Related Documents

- AGENTS.md
- README.md
- docs/project/vision.md
- docs/project/mvp.md
- docs/project/business-rules.md
- docs/architecture/system-overview.md