# MVP Specification

Version: 1.0

Status: Active

Owner: SHIAS Team

Last Updated: YYYY-MM-DD

---

# Purpose

This document defines the Minimum Viable Product (MVP) for the Secure Health Identity & Access System (SHIAS).

It specifies the minimum set of features required to demonstrate that SHIAS successfully enables secure, consent-driven healthcare interoperability without storing clinical records.

Any feature not explicitly included in this document is considered outside the scope of the MVP.

---

# MVP Objective

The primary objective of the SHIAS MVP is to demonstrate a complete, end-to-end healthcare interoperability workflow between independent healthcare providers.

The MVP proves that healthcare providers can discover and retrieve patient records securely while ensuring:

- Clinical records remain with the originating provider.
- Patients control access through explicit consent.
- Every access request is authenticated, authorized, and audited.
- SHIAS stores only metadata required for interoperability.

---

# MVP Deliverables

The MVP consists of five applications.

## 1. SHIAS Core API

The backend platform responsible for:

- Patient Identity Management
- Provider Management
- Pointer Registry
- Consent Management
- Access Broker
- Audit Logging
- Authentication
- Authorization

---

## 2. Patient Portal

Allows patients to:

- Register an account
- View their Health ID
- Manage profile information
- Review pending consent requests
- Approve or reject consent requests
- View consent history

---

## 3. Provider Portal

Allows healthcare providers to:

- Register an organization
- Search for patient records
- Submit consent requests
- Register metadata pointers
- View access history
- Manage organization information

---

## 4. Source Provider Demo

A demonstration healthcare provider that:

- Owns clinical records
- Registers metadata pointers with SHIAS
- Verifies access tokens
- Returns medical records to authorized providers

---

## 5. Requesting Provider Demo

A demonstration healthcare provider that:

- Searches for patient records
- Requests patient consent
- Retrieves records from another provider
- Displays retrieved patient information

---

# Functional Scope

The MVP includes the following capabilities.

## Identity Management

- Patient registration
- Patient authentication
- Unique Health ID generation
- Patient profile management

---

## Provider Management

- Healthcare provider registration
- Provider verification
- Provider authentication
- Provider profile management

---

## Pointer Registry

- Register metadata pointers
- Search metadata pointers
- Update metadata pointers
- Remove metadata pointers

Pointers contain metadata only.

No clinical information shall be stored.

---

## Consent Management

Patients can:

- Approve requests
- Reject requests
- Revoke active consent
- View previous consent decisions

Healthcare providers cannot bypass patient consent.

---

## Access Broker

The Access Broker shall:

- Validate consent
- Verify provider authorization
- Generate short-lived access tokens
- Deny unauthorized requests

---

## Audit Service

The Audit Service records:

- Patient registration
- Provider registration
- Login events
- Pointer creation
- Consent approval
- Consent rejection
- Token issuance
- Record retrieval
- Administrative actions

Audit records are immutable.

---

# Supported Clinical Dataset

The MVP supports a limited demonstration dataset.

## Patient Demographics

- Name
- Date of Birth
- Gender
- Contact Information

---

## Allergies

- Allergy
- Severity
- Notes

---

## Diagnoses

- Diagnosis
- Date
- Status

---

## Medications

- Medication Name
- Dosage
- Frequency

---

## Laboratory Results

- Test Name
- Result
- Reference Range
- Date

---

## Clinical Notes

- Visit Summary
- Physician Notes

This dataset exists only within the Source Provider system.

SHIAS never stores these records.

---

# End-to-End Workflow

The MVP demonstrates the following workflow.

1. Patient registers with SHIAS.
2. Source Provider registers a metadata pointer.
3. Requesting Provider searches using the patient's Health ID.
4. SHIAS returns pointer metadata.
5. Requesting Provider submits an access request.
6. Patient reviews the request.
7. Patient grants consent.
8. SHIAS validates the request.
9. SHIAS issues a five-minute access token.
10. Requesting Provider presents the token to the Source Provider.
11. Source Provider validates the token.
12. Source Provider returns the requested medical records directly.
13. SHIAS records all actions in the audit log.

---

# Non-Functional Requirements

The MVP shall:

- Use HTTPS for secure communication.
- Use JWT-based authentication.
- Implement Role-Based Access Control (RBAC).
- Store passwords using secure hashing.
- Validate all incoming requests.
- Support RESTful APIs.
- Maintain immutable audit logs.
- Store only metadata required for interoperability.

---

# Success Criteria

The MVP is considered successful if it demonstrates:

- Successful patient registration.
- Successful provider registration.
- Metadata pointer registration.
- Patient record discovery.
- Patient consent approval.
- Access token generation.
- Direct provider-to-provider record exchange.
- Complete audit logging.
- No persistent storage of clinical records within SHIAS.

---

# Out of Scope

The following features are intentionally excluded from the MVP.

## Clinical Systems

- Electronic Health Records (EHR)
- Hospital Information Systems (HIS)
- Medical imaging storage
- Pharmacy management
- Laboratory Information Systems

---

## Healthcare Operations

- Appointment scheduling
- Billing
- Insurance claims
- Inventory management
- Staff management

---

## Advanced Interoperability

- HL7 FHIR integration
- National Health Information Exchange
- Cross-country interoperability

---

## Advanced Security Features

- Emergency ("break-glass") access
- Biometric authentication
- Multi-factor authentication
- Hardware security modules

---

## Additional Platforms

- Mobile applications
- Desktop applications
- Public APIs for third parties

---

## Artificial Intelligence

- Clinical decision support
- Disease prediction
- AI diagnosis
- Medical recommendations

---

# Future Enhancements

The architecture should support future implementation of:

- HL7 FHIR compatibility
- National provider registry
- Emergency access
- Mobile applications
- Patient health timeline
- Provider federation
- Notification service
- Integration with external healthcare systems

These features are not required for the MVP.

---

# Acceptance Criteria

The MVP is complete when:

- All five applications are operational.
- The complete interoperability workflow executes successfully.
- Patient consent controls access.
- Providers exchange records directly.
- SHIAS stores only metadata.
- All sensitive actions are audited.
- Security requirements are satisfied.
- Documentation is complete.
- The system is ready for demonstration and academic evaluation.