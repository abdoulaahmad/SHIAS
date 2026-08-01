# System Overview

Version: 1.0

Status: Active

Owner: SHIAS Team

Last Updated: YYYY-MM-DD

---

# Purpose

This document provides a high-level architectural overview of the Secure Health Identity & Access System (SHIAS). It describes the system's purpose, major components, responsibilities, design principles, and how the different applications collaborate to enable secure healthcare interoperability.

This document serves as the primary architectural reference for developers, architects, and AI coding agents.

---

# Overview

SHIAS (Secure Health Identity & Access System) is a consent-driven interoperability platform that enables healthcare providers to securely discover and retrieve patient medical records without centralizing clinical data.

Rather than storing Electronic Health Records (EHRs), SHIAS coordinates identity management, metadata discovery, consent, authorization, and auditing while healthcare providers continue to own and store their clinical records.

The platform acts as a trusted interoperability layer between independent healthcare organizations.

---

# Architectural Vision

The architecture is designed around one fundamental principle:

> **Move access—not data.**

SHIAS exists to make healthcare information discoverable and accessible through secure authorization, not to become another repository of patient medical records.

---

# Core Responsibilities

SHIAS is responsible for:

- Managing patient identities.
- Managing healthcare provider identities.
- Registering metadata pointers.
- Discovering record locations.
- Managing patient consent.
- Issuing authorization tokens.
- Auditing all security-sensitive actions.

SHIAS is **not** responsible for:

- Storing clinical records.
- Editing medical records.
- Diagnosing patients.
- Replacing hospital information systems.
- Acting as a centralized Electronic Health Record.

---

# System Components

The SHIAS MVP consists of five applications.

## 1. SHIAS Core API

The Core API is the central platform responsible for all interoperability services.

Primary responsibilities include:

- Authentication
- Authorization
- Patient Management
- Provider Management
- Pointer Registry
- Consent Engine
- Access Broker
- Audit Service

The Core API is the only component that interacts directly with the SHIAS database.

---

## 2. Patient Portal

The Patient Portal allows patients to:

- Register
- Authenticate
- View their Health ID
- Manage consent requests
- Approve or reject requests
- Review consent history

Patients interact only with SHIAS and never directly with healthcare provider systems.

---

## 3. Provider Portal

The Provider Portal allows healthcare organizations to:

- Register
- Authenticate
- Search for patient records
- Register metadata pointers
- Request patient consent
- View organization activity

The Provider Portal communicates exclusively with the Core API.

---

## 4. Source Provider Demo

This application represents a healthcare provider that owns patient medical records.

Responsibilities include:

- Maintaining clinical records
- Registering metadata pointers
- Validating access tokens
- Returning records directly to authorized providers

Clinical records remain entirely within this application.

---

## 5. Requesting Provider Demo

This application represents another healthcare provider requesting access to patient records.

Responsibilities include:

- Searching for patient records
- Requesting consent
- Receiving authorization
- Retrieving records directly from the Source Provider

---

# Core Services

The Core API contains several logical services.

## Identity Service

Responsible for patient registration, Health ID generation, authentication, and profile management.

---

## Provider Service

Responsible for healthcare provider registration, verification, and management.

---

## Pointer Registry

Stores metadata pointers describing where patient records exist.

Only metadata is stored.

---

## Consent Service

Manages patient consent requests and decisions.

Consent determines whether access is permitted.

---

## Access Broker

Validates authorization requests and issues short-lived access tokens.

The Access Broker never returns medical records.

---

## Audit Service

Records every security-sensitive action performed within SHIAS.

Audit records are immutable.

---

# High-Level Workflow

The primary interoperability workflow is:

1. Patient registers with SHIAS.
2. Source Provider registers a metadata pointer.
3. Requesting Provider searches using the patient's Health ID.
4. SHIAS returns metadata describing where records exist.
5. Requesting Provider submits an access request.
6. Patient reviews the request.
7. Patient grants consent.
8. SHIAS validates authorization.
9. SHIAS issues a short-lived access token.
10. Requesting Provider presents the token to the Source Provider.
11. Source Provider validates the token.
12. Medical records are transferred directly between providers.
13. SHIAS records every action in the audit log.

---

# Data Ownership Model

The architecture clearly separates ownership responsibilities.

| Data Type | Owner |
|------------|-------|
| Patient Identity | SHIAS |
| Provider Identity | SHIAS |
| Metadata Pointers | SHIAS |
| Consent Records | SHIAS |
| Audit Logs | SHIAS |
| Clinical Records | Source Provider |

This separation ensures SHIAS never becomes a centralized medical record repository.

---

# Communication Model

The architecture follows a hub-and-spoke model.

- Patient Portal ↔ Core API
- Provider Portal ↔ Core API
- Source Provider ↔ Core API
- Requesting Provider ↔ Core API
- Source Provider ↔ Requesting Provider (direct record exchange)

Clinical data flows only between healthcare providers after authorization.

---

# Security Architecture

Security is integrated into every layer of the system.

Key principles include:

- Authentication required for all protected endpoints.
- Role-Based Access Control (RBAC).
- JWT-based authentication.
- Short-lived access tokens.
- TLS for secure communication.
- Immutable audit logging.
- Metadata-only storage.
- Privacy by design.

---

# Technology Stack

## Frontend

- Next.js
- React
- TypeScript
- Tailwind CSS

## Backend

- Fastify
- TypeScript
- Prisma ORM

## Database

- PostgreSQL

## Authentication

- JWT
- Refresh Tokens

## Package Manager

- pnpm

## Repository

- Monorepo

---

# Design Principles

The architecture follows these principles:

- API-first design.
- Separation of concerns.
- Modular services.
- Least privilege.
- Secure by default.
- Privacy by design.
- Provider-owned clinical data.
- Patient-controlled consent.
- Immutable auditing.
- Future extensibility.

---

# Non-Goals

The architecture intentionally excludes:

- Centralized clinical record storage.
- Hospital management functions.
- Billing and insurance.
- Appointment scheduling.
- AI diagnosis.
- Medical imaging repositories.
- Emergency ("break-glass") access.
- HL7 FHIR integration (MVP).

---

# Scalability Considerations

The architecture is designed so future versions can introduce:

- Additional healthcare providers.
- National provider registry.
- HL7 FHIR gateway.
- Notification service.
- Mobile applications.
- Multi-region deployments.
- Event-driven messaging.
- Distributed caching.
- API gateway.

These enhancements should not require redesigning the core architecture.

---

# Quality Attributes

The architecture prioritizes:

- Security
- Privacy
- Reliability
- Maintainability
- Modularity
- Scalability
- Availability
- Auditability
- Simplicity

Every architectural decision should support these quality attributes.

---

# References

Related documentation:

- AGENTS.md
- README.md
- docs/project/vision.md
- docs/project/mvp.md
- docs/project/business-rules.md
- docs/project/terminology.md

Future architecture documents:

- container-architecture.md
- communication.md
- data-flow.md
- deployment.md
- technology-stack.md