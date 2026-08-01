# Business Rules

Version: 1.0

Status: Active

Owner: SHIAS Team

Last Updated: YYYY-MM-DD

---

# Purpose

This document defines the business rules governing the Secure Health Identity & Access System (SHIAS).

Business rules describe the constraints, policies, and operational requirements that every component of SHIAS must follow. These rules are technology-independent and remain valid regardless of implementation details.

All developers, architects, and AI coding agents must treat these rules as mandatory.

---

# Rule Categories

The business rules are organized into the following categories:

- Identity
- Patient
- Healthcare Provider
- Pointer Registry
- Consent Management
- Access Authorization
- Audit Logging
- Security
- Data Management
- System Integrity

---

# Identity Rules

## BR-001

Every patient shall have exactly one unique Health ID.

A Health ID uniquely identifies a patient within SHIAS and shall never be reassigned to another individual.

---

## BR-002

A patient may update personal profile information without changing their Health ID.

---

## BR-003

A Health ID must remain valid throughout the patient's lifetime unless the account is permanently removed according to administrative policy.

---

## BR-004

Healthcare providers shall identify patients using the Health ID during interoperability operations.

---

# Patient Rules

## BR-005

Patients are the owners of their consent decisions.

---

## BR-006

Only the patient may approve or reject a request for access to their medical information.

---

## BR-007

Patients may revoke active consent before its expiration.

---

## BR-008

Patients shall be able to review the history of all consent decisions.

---

# Provider Rules

## BR-009

Every healthcare provider must be registered before participating in the platform.

---

## BR-010

Every provider must be verified before requesting or sharing patient information.

---

## BR-011

Healthcare providers remain the owners and custodians of their clinical records.

SHIAS does not assume ownership of provider data.

---

## BR-012

Providers are responsible for the accuracy and availability of their own clinical records.

---

# Pointer Registry Rules

## BR-013

Pointers shall contain metadata only.

Pointers must never include clinical content.

---

## BR-014

Pointers shall identify where a patient's medical records exist.

---

## BR-015

Pointers shall reference the originating healthcare provider.

---

## BR-016

Pointers may be updated when record metadata changes.

---

## BR-017

Pointers may be removed if records are permanently deleted according to provider policy.

---

# Consent Rules

## BR-018

Cross-provider access requires explicit patient consent.

---

## BR-019

Consent must specify:

- Patient
- Requesting Provider
- Source Provider
- Purpose of access
- Expiration time

---

## BR-020

Consent expires automatically after twenty-four (24) hours unless revoked earlier.

---

## BR-021

Expired consent cannot be reused.

---

## BR-022

Each consent request is valid for one authorization process only.

---

## BR-023

Providers cannot modify patient consent decisions.

---

# Access Authorization Rules

## BR-024

Only verified providers may request access to patient records.

---

## BR-025

Authorization requires a valid consent record.

---

## BR-026

Access tokens shall be issued only after successful authorization.

---

## BR-027

Access tokens expire after five (5) minutes.

---

## BR-028

Expired tokens are invalid and must not be accepted.

---

## BR-029

Access tokens shall contain only the claims necessary for authorization.

---

## BR-030

Source Providers must validate access tokens before releasing records.

---

# Clinical Data Rules

## BR-031

SHIAS shall never store clinical records.

---

## BR-032

Clinical records remain under the control of the originating healthcare provider.

---

## BR-033

Medical records shall be exchanged directly between healthcare providers.

---

## BR-034

SHIAS may temporarily process authorization information but shall not persist clinical content.

---

# Audit Rules

## BR-035

Every security-sensitive operation shall generate an audit event.

---

## BR-036

Audit records shall be immutable.

---

## BR-037

Audit records shall include:

- Event type
- Timestamp
- Actor
- Resource
- Outcome
- IP address (where available)

---

## BR-038

Audit logs shall not contain clinical records.

---

# Authentication Rules

## BR-039

Every user shall authenticate before accessing protected resources.

---

## BR-040

Passwords shall never be stored in plain text.

---

## BR-041

Authentication failures shall be recorded.

---

# Authorization Rules

## BR-042

Every protected request shall undergo authorization.

---

## BR-043

Authorization decisions shall consider:

- User role
- Provider status
- Consent status
- Token validity

---

# Data Management Rules

## BR-044

Sensitive information shall be encrypted during transmission.

---

## BR-045

Personal information shall be handled according to applicable privacy regulations.

---

## BR-046

Deleted records shall be soft deleted unless permanent deletion is explicitly required.

---

## BR-047

System identifiers shall be globally unique.

---

# Availability Rules

## BR-048

The platform should target 99.9% service availability for the MVP deployment.

---

# Error Handling Rules

## BR-049

Unauthorized requests shall be rejected.

---

## BR-050

Invalid consent shall prevent record retrieval.

---

## BR-051

Expired tokens shall be rejected.

---

## BR-052

Requests referencing unknown Health IDs shall return an appropriate error response.

---

# Administrative Rules

## BR-053

Administrative actions shall be auditable.

---

## BR-054

Administrative users shall not bypass patient consent.

---

## BR-055

System configuration changes shall be recorded.

---

# Future Rules (Not Applicable to MVP)

The following rules will become active in future versions:

- Emergency ("break-glass") access
- Multi-factor authentication
- National Provider Registry
- HL7 FHIR interoperability
- Cross-border healthcare exchange

These features are intentionally excluded from the MVP.

---

# Rule Precedence

If implementation conflicts with business rules:

1. Business Rules
2. Architecture Documents
3. API Contracts
4. Database Design
5. Source Code

Business rules always take precedence.

---

# Summary

The following principles summarize the SHIAS business model:

- Patients control consent.
- Providers own clinical records.
- SHIAS stores metadata only.
- Every access requires authorization.
- Every sensitive action is audited.
- Clinical records remain outside SHIAS.
- Security and privacy are mandatory.
- Interoperability must never compromise patient trust.