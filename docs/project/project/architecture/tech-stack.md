# Technology Stack

Version: 1.0

Status: Active

Owner: SHIAS Team

Last Updated: YYYY-MM-DD

---

# Purpose

This document defines the technology stack used to implement the Secure Health Identity & Access System (SHIAS).

It explains the technologies selected for the MVP, the reasons for each selection, and the architectural principles guiding these decisions.

The objective is to ensure consistency across the project while making future technology decisions easier.

---

# Technology Selection Principles

The technology stack was selected according to the following principles:

- Simplicity
- Maintainability
- Security
- Developer productivity
- Strong TypeScript support
- Open-source ecosystem
- Long-term maintainability
- Modern web development practices

---

# Architecture Overview

SHIAS follows a modern web architecture consisting of:

- Web Frontends
- REST API Backend
- PostgreSQL Database
- Shared TypeScript Packages

The system is organized as a pnpm monorepo.

---

# Frontend

## Framework

### Next.js

Used for:

- Patient Portal
- Provider Portal

### Why Next.js?

- Excellent TypeScript support
- Built-in routing
- Server-side rendering support
- Good performance
- Mature ecosystem
- Easy deployment

---

## UI Library

### React

React provides:

- Component-based architecture
- Reusable UI
- Large ecosystem
- Excellent community support

---

## Language

### TypeScript

Why TypeScript?

- Static typing
- Better IDE support
- Compile-time error checking
- Improved maintainability
- Shared models with backend

TypeScript is used throughout the entire project.

---

## Styling

### Tailwind CSS

Reasons:

- Utility-first workflow
- Consistent design
- Responsive layouts
- Reduced CSS maintenance

---

# Backend

## Framework

### Fastify

The Core API and reference provider applications are implemented using Fastify.

Reasons:

- High performance
- Lightweight
- Excellent TypeScript support
- Schema-based validation
- Plugin architecture
- Low memory usage

---

## Runtime

### Node.js

Reasons:

- JavaScript/TypeScript ecosystem
- Non-blocking I/O
- Excellent package ecosystem
- Large developer community

---

## Language

### TypeScript

Backend services use strict TypeScript.

Benefits include:

- Type safety
- Shared interfaces
- Easier refactoring
- Reduced runtime errors

---

# Database

## PostgreSQL

PostgreSQL is the primary relational database.

Reasons:

- ACID compliance
- Reliability
- Strong indexing
- Mature ecosystem
- Excellent Prisma support
- Open source

The Core API is the only application allowed to access PostgreSQL directly.

---

# ORM

## Prisma

Prisma provides:

- Type-safe database access
- Automatic migrations
- Strong TypeScript integration
- Generated client
- Improved developer productivity

---

# Authentication

## JWT

JSON Web Tokens are used for authentication.

Reasons:

- Stateless authentication
- Easy API integration
- Widely adopted
- Suitable for REST APIs

---

## Refresh Tokens

Refresh Tokens provide:

- Improved security
- Reduced login frequency
- Better user experience

---

# Authorization

Authorization uses:

- Role-Based Access Control (RBAC)
- Patient Consent
- Provider Verification

Authorization decisions are performed by the Core API.

---

# Package Manager

## pnpm

Reasons:

- Faster installation
- Efficient disk usage
- Native monorepo support
- Deterministic dependency management

---

# Monorepo Structure

The project uses a pnpm workspace.

Benefits:

- Shared dependencies
- Shared TypeScript types
- Easier maintenance
- Simplified version management

---

# Shared Packages

## sdk-node

Provides:

- API Client
- Authentication helpers
- Typed SDK
- Request helpers

---

## shared-types

Contains:

- Interfaces
- Enums
- DTOs
- Shared models

---

## shared-utils

Contains:

- Validation helpers
- Utility functions
- Constants
- Common helpers

---

# API Style

The MVP exposes RESTful APIs.

Characteristics:

- JSON request/response
- Resource-oriented endpoints
- Standard HTTP methods
- HTTP status codes
- Stateless communication

---

# Development Tools

## Git

Version control.

---

## GitHub

Repository hosting.

Issue tracking.

Pull requests.

---

## ESLint

Code quality.

Static analysis.

---

## Prettier

Consistent code formatting.

---

# Deployment

The MVP deployment consists of:

- Node.js
- PM2
- Nginx
- PostgreSQL

Docker is intentionally excluded from the MVP.

---

# Testing Strategy

Testing includes:

- Unit Tests
- Integration Tests
- API Tests

Future versions may include end-to-end testing.

---

# Logging

Application logging should include:

- Errors
- Warnings
- Information
- Security events

Clinical information must never appear in logs.

---

# Security Technologies

The platform uses:

- HTTPS
- JWT
- Password Hashing
- Input Validation
- RBAC
- Audit Logging

---

# Browser Support

Supported browsers include:

- Google Chrome
- Microsoft Edge
- Mozilla Firefox

The MVP is optimized for modern browsers.

---

# Future Technology Considerations

Potential future additions include:

- Redis
- API Gateway
- Message Queue
- Object Storage
- FHIR Libraries
- Mobile Applications
- Webhooks

These technologies are outside the scope of the MVP.

---

# Technology Summary

| Layer | Technology |
|---------|------------|
| Frontend | Next.js |
| UI | React |
| Styling | Tailwind CSS |
| Language | TypeScript |
| Backend | Fastify |
| Runtime | Node.js |
| Database | PostgreSQL |
| ORM | Prisma |
| Authentication | JWT |
| Authorization | RBAC |
| Package Manager | pnpm |
| SDK | Node.js SDK |
| Version Control | Git |
| Repository | GitHub |
| Process Manager | PM2 |
| Reverse Proxy | Nginx |

---

# Technology Principles

Every technology adopted by SHIAS should:

- Improve maintainability.
- Support TypeScript.
- Be actively maintained.
- Integrate well with the existing stack.
- Avoid unnecessary complexity.
- Align with the architecture and business rules.

Technology choices should favor stability and clarity over adopting new tools without a clear benefit.

---

# Related Documents

- system-overview.md
- container-architecture.md
- communication.md
- data-flow.md
- business-rules.md
- AGENTS.md