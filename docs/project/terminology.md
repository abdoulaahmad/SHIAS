# Terminology

Version: 1.0

Status: Active

Owner: SHIAS Team

Last Updated: YYYY-MM-DD

---

# Purpose

This document defines the official terminology used throughout the Secure Health Identity & Access System (SHIAS).

The purpose of this glossary is to ensure that all documentation, source code, API contracts, database schemas, and discussions use consistent terminology.

When a term defined here appears elsewhere in the project, its meaning should match the definition in this document.

---

# A

## Access Broker

The core SHIAS service responsible for validating authorization requests, verifying patient consent, and issuing short-lived access tokens that allow healthcare providers to retrieve medical records.

The Access Broker never stores or returns clinical records.

---

## Access Request

A request submitted by a healthcare provider asking permission to access a patient's medical records held by another healthcare provider.

---

## Access Token

A secure, short-lived authorization token issued by the Access Broker after a patient's consent has been verified.

The token is presented to the Source Provider to retrieve medical records.

---

## Audit Event

A record describing a security-sensitive action performed within SHIAS.

Examples include:

- Login
- Consent approval
- Pointer registration
- Token issuance
- Record retrieval

Audit events are immutable.

---

## Audit Log

A chronological collection of audit events used for monitoring, accountability, and security investigations.

Audit logs never contain clinical records.

---

# C

## Clinical Record

Medical information created and maintained by a healthcare provider.

Examples include:

- Diagnoses
- Medications
- Laboratory results
- Clinical notes
- Allergies

Clinical records remain outside SHIAS.

---

## Consent

A patient's explicit authorization allowing a healthcare provider to access medical records held by another healthcare provider.

Consent includes:

- Patient
- Requesting Provider
- Source Provider
- Purpose of access
- Expiration time

---

## Consent Request

A request sent to a patient asking for permission to access their medical records.

---

# D

## Direct Provider-to-Provider Exchange

The secure transfer of medical records directly between healthcare providers after authorization has been granted.

SHIAS facilitates this process but does not relay or store the records.

---

# H

## Health ID

A unique identifier assigned to every patient registered in SHIAS.

The Health ID is used by healthcare providers to locate patient record pointers across participating organizations.

A patient has exactly one Health ID.

---

## Healthcare Provider

An organization responsible for creating and maintaining patient medical records.

Examples include:

- Hospitals
- Clinics
- Laboratories
- Diagnostic Centers
- Pharmacies (future)

---

# I

## Identity Management

The SHIAS module responsible for registering patients, generating Health IDs, authenticating users, and maintaining patient identity information.

---

## Interoperability

The ability of independent healthcare systems to securely exchange healthcare information while preserving data integrity, privacy, and ownership.

Interoperability is the primary objective of SHIAS.

---

# M

## Metadata

Descriptive information about a medical record that does not contain the medical record itself.

Examples include:

- Provider identifier
- Record type
- Creation date
- Last updated date

Metadata enables record discovery without exposing sensitive clinical information.

---

## Metadata Pointer

A reference stored by SHIAS indicating where a patient's medical record exists.

A metadata pointer contains only descriptive information and never stores clinical content.

---

# P

## Patient

An individual registered within SHIAS who owns a Health ID and controls consent for access to their healthcare information.

---

## Pointer Registry

The SHIAS service responsible for storing and managing metadata pointers that identify where patient medical records are located.

The Pointer Registry never stores clinical records.

---

## Provider Portal

The web application used by healthcare providers to interact with SHIAS.

Typical functions include:

- Register organization
- Search for patients
- Request consent
- Register pointers
- View audit history

---

## Patient Portal

The web application used by patients to manage their account and review consent requests.

---

# R

## Record Discovery

The process of locating healthcare providers that possess medical records for a patient.

Record discovery uses metadata pointers rather than searching clinical data.

---

## Requesting Provider

The healthcare provider requesting access to patient records maintained by another provider.

---

# S

## SHIAS

Secure Health Identity & Access System.

A consent-driven healthcare interoperability platform that enables secure discovery and retrieval of medical records without storing clinical data.

---

## Source Provider

The healthcare provider that owns and maintains the requested medical records.

The Source Provider validates access tokens before releasing records.

---

# T

## Token Validation

The process by which a Source Provider verifies that an access token is authentic, valid, and unexpired before releasing medical records.

---

# U

## User

Any authenticated individual interacting with SHIAS.

User categories include:

- Patients
- Healthcare Providers
- System Administrators

---

# V

## Verification

The process of confirming the identity and legitimacy of a healthcare provider before allowing participation in SHIAS.

---

# Glossary Summary

The following concepts define the SHIAS architecture:

| Concept | Description |
|----------|-------------|
| Health ID | Unique patient identifier |
| Metadata Pointer | Reference to where records exist |
| Clinical Record | Medical information stored by providers |
| Consent | Patient authorization for record access |
| Access Broker | Issues secure access tokens |
| Source Provider | Provider that owns the records |
| Requesting Provider | Provider requesting access |
| Audit Event | Security-related system activity |
| Pointer Registry | Stores metadata pointers only |
| Interoperability | Secure exchange of healthcare information |

---

# Naming Conventions

To maintain consistency across the project:

- Use **Health ID** (not Patient ID)
- Use **Source Provider** (not Sending Hospital)
- Use **Requesting Provider** (not Receiving Hospital)
- Use **Metadata Pointer** (not Record Pointer)
- Use **Access Broker** (not Authorization Service)
- Use **Consent** (not Permission)
- Use **Clinical Record** (not Medical File)
- Use **Healthcare Provider** (not Hospital, unless referring to a specific organization)

These terms should be used consistently in all documentation, source code, APIs, database schemas, and user interfaces.