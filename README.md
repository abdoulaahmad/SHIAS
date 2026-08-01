# SHIAS

**Secure Health Identity & Access System**

A consent-driven healthcare interoperability platform that enables healthcare providers to securely discover and retrieve patient medical records across healthcare organizations without centralizing clinical data.

---

## Overview

SHIAS is a secure, API-first interoperability platform designed to facilitate the exchange of healthcare information between healthcare providers while preserving patient privacy and provider ownership of medical records.

Unlike traditional Electronic Health Record (EHR) systems or centralized Health Information Exchanges (HIEs), SHIAS does **not** store clinical records. Instead, it manages digital identities, metadata pointers, patient consent, secure authorization, and audit logs, allowing healthcare providers to exchange information directly.

The project is being developed as the MVP for an undergraduate Software Engineering project with a focus on secure, privacy-preserving healthcare interoperability.

---

## Problem Statement

Healthcare records are often isolated within individual hospitals and clinics. When patients visit different healthcare providers, their medical history is usually unavailable, resulting in:

- Repeated laboratory tests
- Delayed diagnosis and treatment
- Increased healthcare costs
- Poor continuity of care
- Fragmented patient information

Traditional centralized solutions introduce privacy, security, governance, and ownership challenges.

SHIAS addresses these challenges through a decentralized interoperability approach where healthcare providers retain ownership of patient records while securely sharing information through patient-controlled consent.

---

## Project Goals

The primary goals of SHIAS are to:

- Provide every patient with a unique Health ID.
- Enable healthcare providers to discover available patient records.
- Store metadata pointers instead of clinical records.
- Allow patients to control access to their health information through explicit consent.
- Issue secure, short-lived access tokens for record retrieval.
- Maintain a complete and immutable audit trail of all sensitive operations.

---

## Key Features

- Patient Health Identity Management
- Provider Registration and Verification
- Metadata Pointer Registry
- Patient Consent Management
- Secure Access Broker
- JWT-Based Authentication
- Role-Based Access Control (RBAC)
- Comprehensive Audit Logging
- RESTful API
- Modular Monorepo Architecture

---

## Core Principles

SHIAS is built upon the following principles:

- Clinical records remain with healthcare providers.
- Patients control consent.
- Providers own medical records.
- SHIAS stores metadata only.
- Every sensitive action is audited.
- Security and privacy are built into every component.
- APIs are designed using an API-first approach.

---

## System Architecture

The MVP consists of five primary applications:

### 1. SHIAS Core API

The central backend responsible for:

- Identity Management
- Provider Management
- Pointer Registry
- Consent Engine
- Access Broker
- Audit Service

---

### 2. Patient Portal

Allows patients to:

- Register
- Manage their Health ID
- Review consent requests
- Approve or deny access
- View consent history

---

### 3. Provider Portal

Allows healthcare providers to:

- Register their organization
- Search for patient records
- Request patient consent
- View audit history
- Manage metadata pointers

---

### 4. Source Provider Demo

A demonstration healthcare provider that owns patient records and exposes secured APIs for record retrieval after authorization.

---

### 5. Requesting Provider Demo

A demonstration healthcare provider that searches for records, requests patient consent, and retrieves medical records from another provider.

---

## Typical Workflow

1. Patient registers and receives a Health ID.
2. Source Provider registers a metadata pointer.
3. Requesting Provider searches using the Health ID.
4. SHIAS identifies the Source Provider.
5. Patient receives a consent request.
6. Patient approves the request.
7. SHIAS issues a short-lived access token.
8. Source Provider validates the token.
9. Medical record is returned directly to the Requesting Provider.
10. SHIAS records every action in the audit log.

At no point are clinical records stored within SHIAS.

---

## Technology Stack

### Frontend

- Next.js
- React
- TypeScript
- Tailwind CSS

### Backend

- Fastify
- TypeScript
- Prisma ORM

### Database

- PostgreSQL

### Authentication

- JWT
- Refresh Tokens

### Package Manager

- pnpm

### Repository

- Monorepo

---

## Repository Structure

```
apps/
    api/
    patient-portal/
    provider-portal/
    provider-source-demo/
    provider-request-demo/

packages/
    sdk-node/
    shared/

docs/
```

---

## MVP Scope

The MVP includes:

- Health Identity Management
- Provider Registration
- Pointer Registry
- Consent Management
- Access Authorization
- Audit Logging
- Demonstration Provider Systems

The MVP does **not** include:

- Electronic Health Record storage
- Hospital billing
- Insurance processing
- Appointment scheduling
- Medical imaging storage
- Emergency ("break-glass") access
- HL7/FHIR integration
- Mobile applications
- AI-powered diagnosis

---

## Security

Security is a fundamental design principle.

The MVP includes:

- JWT Authentication
- Role-Based Access Control
- HTTPS support
- Short-lived access tokens
- Secure password hashing
- Immutable audit logs
- Input validation
- Metadata-only storage
- Privacy-by-design architecture

---

## Documentation

Project documentation is located in the `docs/` directory and includes:

- Project documentation
- Architecture
- Domain specifications
- API contracts
- Database design
- Security documentation
- Development guidelines
- Roadmaps
- Architecture Decision Records (ADRs)

The `AGENTS.md` document serves as the primary source of truth for AI coding agents and contributors.

---

## Current Status

**Project Phase:** Documentation & Architecture

Current work focuses on:

- Defining the system architecture
- Establishing business rules
- Producing technical documentation
- Designing APIs
- Preparing implementation specifications

Development of production code begins after the documentation phase is complete.

---

## License

This project is developed for academic and research purposes.

---

## Authors

**Project:** Secure Health Identity & Access System (SHIAS)

**Institution:** Federal University Dutse

**Department:** Software Engineering

---

## Vision

**Move access—not data.**

SHIAS enables secure healthcare interoperability by allowing providers to exchange information while ensuring that patients remain in control of consent and healthcare providers retain ownership of clinical records.