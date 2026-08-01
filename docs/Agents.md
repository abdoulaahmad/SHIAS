# AGENTS.md

Version: 1.0
Status: Active
Project: SHIAS (Secure Health Identity & Access System)

---

# Purpose

This document is the primary source of truth for every AI coding agent and human contributor working on SHIAS.

Before modifying any source code, every contributor must understand this document.

The objective is to ensure that all implementations remain consistent with the system architecture, business rules, security requirements, and long-term vision of the platform.

---

# Project Vision

SHIAS (Secure Health Identity & Access System) is a consent-driven healthcare interoperability platform that enables healthcare providers to securely discover and retrieve patient medical records from other healthcare providers without centralizing clinical data.

SHIAS is NOT an Electronic Health Record (EHR) system.

SHIAS is NOT a Health Information Exchange (HIE) that stores medical records.

SHIAS is an interoperability platform.

Its responsibility is to identify patients, locate records, manage patient consent, authorize access, and audit all interactions.

Clinical records always remain under the control of the originating healthcare provider.

---

# Mission

Build a secure, privacy-preserving, API-first healthcare interoperability platform suitable for healthcare providers in Nigeria while remaining extensible to international healthcare ecosystems.

---

# MVP Goal

The MVP demonstrates one complete interoperability workflow:

1. Patient receives a Health ID.
2. Source Provider registers a pointer.
3. Requesting Provider searches the Health ID.
4. Requesting Provider requests access.
5. Patient approves consent.
6. SHIAS validates the request.
7. SHIAS issues a short-lived access token.
8. Source Provider verifies the token.
9. Medical record is returned directly to the requesting provider.
10. Every action is audited.

At no point does SHIAS permanently store clinical records.

---

# Core Principles

## Principle 1

SHIAS never stores patient clinical records.

Only metadata may be stored.

---

## Principle 2

Patients own consent.

Providers cannot override patient consent during the MVP.

---

## Principle 3

Healthcare providers own medical records.

SHIAS never becomes the system of record.

---

## Principle 4

Every sensitive action must generate an audit event.

No exceptions.

---

## Principle 5

Every API must be secure by default.

Authentication and authorization are mandatory.

---

## Principle 6

Business rules always take priority over implementation convenience.

---

# Architecture Overview

SHIAS consists of five primary applications.

1. Core API
2. Patient Portal
3. Provider Portal
4. Source Provider Demo
5. Requesting Provider Demo

These applications communicate through secure REST APIs.

---

# Core Services

The Core API contains the following modules:

Identity

Provider Management

Pointer Registry

Consent Engine

Access Broker

Audit Service

Notification Service (Future)

Emergency Access (Future)

FHIR Gateway (Future)

---

# Project Structure

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

---

# Technology Stack

Frontend

- Next.js
- React
- TypeScript
- TailwindCSS

Backend

- Fastify
- TypeScript
- Prisma

Database

- PostgreSQL

Authentication

- JWT
- Refresh Tokens

Package Manager

- pnpm

Repository

- Monorepo

---

# Business Rules

The following rules are absolute.

• Clinical records SHALL NOT be stored by SHIAS.

• Pointers SHALL NOT contain clinical information.

• Every patient SHALL have exactly one Health ID.

• Every provider SHALL be verified before participating.

• Consent SHALL be required before cross-provider access.

• Access Tokens SHALL expire after five minutes.

• Consent SHALL expire after twenty-four hours unless revoked sooner.

• Every access SHALL be logged.

• Every audit record SHALL be immutable.

• Deleted records SHALL be soft deleted.

---

# Non-Goals

The MVP does NOT include:

National Health Database

Hospital Billing

Insurance Claims

Appointment Scheduling

Medical Imaging Storage

HL7/FHIR Integration

Emergency Access

Biometric Authentication

Mobile Applications

AI Diagnosis

Machine Learning

Analytics

---

# Definition of Done

A feature is complete only if:

Business rules are satisfied.

Security requirements are implemented.

Tests pass.

Documentation updated.

API documented.

Audit events implemented.

No architectural rules violated.

---

# Coding Standards

Use strict TypeScript.

Never use `any`.

Use dependency injection.

Business logic belongs in services.

Controllers remain thin.

Repositories perform persistence only.

Validation occurs at API boundaries.

Never hardcode secrets.

Prefer composition over inheritance.

Write self-documenting code.

---

# Security Rules

Never log sensitive medical information.

Never expose internal database identifiers.

Never trust client input.

Validate every request.

Authorize every request.

Encrypt sensitive values.

Use HTTPS in production.

Tokens must be short-lived.

---

# Documentation Rules

Every new module requires documentation.

Every endpoint requires documentation.

Every database change requires documentation.

Every architectural decision requires an ADR.

---

# Current MVP Modules

Identity

Provider

Pointer Registry

Consent

Access Broker

Audit

---

# Future Modules

Notification Service

FHIR Gateway

Emergency Access

Patient Timeline

Provider Federation

National Registry

---

# AI Agent Instructions

Before writing code:

Read this file.

Read the relevant domain document.

Read the relevant API contract.

Read the relevant database schema.

Read the current sprint document.

Never assume undocumented behaviour.

If documentation and implementation disagree, documentation is considered authoritative until updated.

---

# Guiding Philosophy

Move access—not data.

Protect privacy by design.

Patients control consent.

Providers own records.

SHIAS enables interoperability.

Nothing else.
