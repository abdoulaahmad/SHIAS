# Data Flow

Version: 1.0

Status: Active

Owner: SHIAS Team

Last Updated: YYYY-MM-DD

---

# Purpose

This document describes how information flows through the Secure Health Identity & Access System (SHIAS).

It explains the sequence of interactions between users, applications, and services for each major business process.

The objective is to ensure a shared understanding of how requests are processed while maintaining the architectural principle that SHIAS never stores or transfers clinical records.

---

# Design Principles

All data flows must comply with the following principles:

- SHIAS stores metadata only.
- Clinical records remain with the Source Provider.
- Every protected request requires authentication.
- Every authorization decision requires valid patient consent.
- Every security-sensitive action is audited.
- The Core API is the central orchestration layer.

---

# Primary Data Flows

The MVP consists of the following primary workflows:

1. Patient Registration
2. Provider Registration
3. Metadata Pointer Registration
4. Record Discovery
5. Consent Management
6. Authorization
7. Medical Record Retrieval
8. Audit Logging

---

# Flow 1 — Patient Registration

## Goal

Register a new patient and issue a unique Health ID.

## Sequence

1. Patient submits registration details.
2. Patient Portal validates required fields.
3. Request is sent to the Core API.
4. Core API validates the request.
5. Core API creates the patient record.
6. Core API generates a unique Health ID.
7. Patient information is stored.
8. Audit event is recorded.
9. Health ID is returned to the Patient Portal.

## Result

The patient is successfully registered and can authenticate using SHIAS.

---

# Flow 2 — Provider Registration

## Goal

Register a healthcare provider within SHIAS.

## Sequence

1. Provider submits organization details.
2. Provider Portal sends the request to the Core API.
3. Core API validates the request.
4. Provider record is created.
5. Provider receives credentials.
6. Audit event is recorded.

## Result

The provider can authenticate and participate in interoperability workflows.

---

# Flow 3 — Metadata Pointer Registration

## Goal

Register information describing where a patient's medical record exists.

## Sequence

1. Source Provider authenticates.
2. Source Provider submits metadata.
3. Core API validates the request.
4. Metadata Pointer is stored.
5. Audit event is recorded.

## Stored Information

Examples include:

- Health ID
- Provider ID
- Record Type
- Record Identifier
- Creation Date

No clinical information is stored.

---

# Flow 4 — Record Discovery

## Goal

Locate providers that hold medical records for a patient.

## Sequence

1. Requesting Provider searches using a Health ID.
2. Core API validates authentication.
3. Pointer Registry is searched.
4. Matching metadata pointers are returned.
5. Audit event is recorded.

## Result

The Requesting Provider learns where records exist without accessing the records themselves.

---

# Flow 5 — Consent Request

## Goal

Request authorization to access patient records.

## Sequence

1. Requesting Provider selects a metadata pointer.
2. Consent request is submitted.
3. Core API validates the request.
4. Consent record is created with a status of **Pending**.
5. Patient is notified.
6. Audit event is recorded.

---

# Flow 6 — Consent Decision

## Goal

Allow the patient to approve or reject the request.

## Sequence

1. Patient reviews the pending request.
2. Patient selects **Approve** or **Reject**.
3. Core API updates the consent record.
4. Audit event is recorded.

### If Approved

The workflow proceeds to authorization.

### If Rejected

The workflow ends.

---

# Flow 7 — Authorization

## Goal

Issue a secure access token after successful authorization.

## Sequence

1. Requesting Provider requests authorization.
2. Core API verifies:
   - Provider identity
   - Consent status
   - Consent expiration
3. Access Broker generates a short-lived access token.
4. Token is returned to the Requesting Provider.
5. Audit event is recorded.

## Result

The Requesting Provider is authorized to retrieve the requested medical record.

---

# Flow 8 — Medical Record Retrieval

## Goal

Retrieve a patient's medical record.

## Sequence

1. Requesting Provider sends the access token to the Source Provider.
2. Source Provider validates the token with the Core API.
3. Core API confirms the token is valid.
4. Source Provider retrieves the requested clinical record.
5. Clinical record is sent directly to the Requesting Provider.
6. Audit event is recorded.

## Important

At no point does SHIAS receive or store the clinical record.

---

# Flow 9 — Audit Logging

## Goal

Maintain a complete history of security-sensitive actions.

Audit events are generated for:

- Login
- Logout
- Registration
- Provider verification
- Pointer registration
- Record discovery
- Consent approval
- Consent rejection
- Token issuance
- Record retrieval

Audit logs are immutable.

---

# Data Ownership

| Data | Owner |
|-------|-------|
| Patient Identity | SHIAS |
| Provider Identity | SHIAS |
| Metadata Pointer | SHIAS |
| Consent | SHIAS |
| Audit Log | SHIAS |
| Clinical Record | Source Provider |

---

# Data Classification

## Public

None.

---

## Internal

- Provider profile
- System configuration

---

## Confidential

- Patient identity
- Consent records
- Metadata pointers
- Audit logs

---

## Highly Confidential

- Clinical records (stored only by providers)

---

# Failure Scenarios

## Invalid Health ID

Result:

- Search rejected.
- Audit event recorded.

---

## Consent Rejected

Result:

- No access token issued.
- Workflow terminates.

---

## Consent Expired

Result:

- Authorization denied.
- New consent request required.

---

## Invalid Access Token

Result:

- Source Provider rejects the request.
- Audit event recorded.

---

## Provider Authentication Failure

Result:

- Request rejected.
- Audit event recorded.

---

# Data Flow Summary

| Workflow | Final Outcome |
|-----------|---------------|
| Patient Registration | Health ID created |
| Provider Registration | Provider registered |
| Pointer Registration | Metadata stored |
| Record Discovery | Metadata returned |
| Consent Request | Pending consent |
| Consent Decision | Approved or Rejected |
| Authorization | Access token issued |
| Record Retrieval | Direct provider-to-provider exchange |
| Audit Logging | Immutable audit record |

---

# Architectural Guarantees

The following guarantees must always hold:

- SHIAS never stores clinical records.
- Clinical records move only between healthcare providers.
- Every authorization depends on patient consent.
- Every protected request requires authentication.
- Every sensitive action is audited.
- Metadata and clinical data remain separate.

---

# Related Documents

- system-overview.md
- system-context.md
- container-architecture.md
- communication.md
- domain-model.md
- business-rules.md
- mvp.md