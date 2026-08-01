# Testing Strategy

Version: 1.0

Status: Active

Owner: SHIAS Team

Last Updated: YYYY-MM-DD

---

# Purpose

This document defines the testing strategy for the Secure Health Identity & Access System (SHIAS).

The objectives are to:

- Verify correctness
- Prevent regressions
- Ensure security
- Maintain reliability
- Support continuous delivery

Testing is integrated throughout the development lifecycle rather than treated as a final step.

---

# Testing Principles

The testing strategy follows these principles:

- Automate wherever practical
- Test behavior, not implementation details
- Keep tests deterministic
- Isolate external dependencies
- Test the highest-risk areas first
- Every bug should result in a regression test

---

# Testing Pyramid

```
                 E2E
              ▲▲▲▲▲▲▲
           Integration
        ▲▲▲▲▲▲▲▲▲▲▲▲▲▲
            Unit Tests
▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲
```

The majority of tests should be unit tests.

---

# Test Levels

## Unit Tests

Purpose:

Verify individual units of business logic.

Examples:

- Domain entities
- Value objects
- Validation
- Utility functions
- Authorization policies
- Permission checks

Unit tests must not require:

- Database
- Network
- HTTP server

---

## Integration Tests

Purpose:

Verify interaction between components.

Examples:

- API + Database
- Prisma repositories
- Authentication
- Authorization
- Transactions

Integration tests use a dedicated test database.

---

## End-to-End Tests

Purpose:

Verify complete user workflows.

Examples:

Patient:

- Register
- Login
- Approve consent
- Revoke consent

Provider:

- Login
- Request consent
- Obtain access token

Administrator:

- Verify provider
- Create provider user

---

# Scope by Layer

| Layer | Unit | Integration | E2E |
|--------|------|-------------|-----|
| Domain | ✅ | ❌ | ❌ |
| Application | ✅ | ✅ | ❌ |
| Infrastructure | ❌ | ✅ | ❌ |
| API | ❌ | ✅ | ✅ |
| Frontend | ✅ | ❌ | ✅ |

---

# Test Frameworks

Backend

- Vitest

Frontend

- Vitest
- React Testing Library

End-to-End

- Playwright

---

# Mocking Strategy

Mock only:

- Email service
- SMS provider
- External APIs
- Time
- UUID generation

Do not mock:

- Business logic
- Authorization policies
- Validation rules

---

# Test Database

Integration tests use a dedicated PostgreSQL database.

Requirements:

- Isolated from development
- Automatically reset
- Seeded with deterministic data

Production data must never be used.

---

# Test Data

Seed data should include:

- Demo patient
- Demo provider
- Provider user
- Administrator
- Metadata pointers
- Consents
- Sessions

Test fixtures must be predictable.

---

# API Testing

Every endpoint should be tested for:

- Success responses
- Validation failures
- Authentication failures
- Authorization failures
- Resource not found
- Conflict scenarios
- Unexpected errors

---

# Security Testing

Security tests verify:

- Password hashing
- JWT validation
- Session revocation
- Refresh token rotation
- Authorization enforcement
- Consent enforcement

Negative test cases are mandatory.

---

# Performance Testing

Critical endpoints should be benchmarked.

Examples:

- Login
- Consent approval
- Pointer lookup
- Access token issuance

Performance tests should detect regressions.

---

# Accessibility Testing

Frontend testing includes:

- Keyboard navigation
- Focus management
- Semantic HTML
- Screen reader compatibility

---

# Regression Testing

Every production bug must be accompanied by:

- A failing automated test
- A code fix
- A passing test

This prevents recurrence.

---

# Code Coverage

Coverage targets:

| Type | Target |
|------|--------|
| Statements | ≥90% |
| Branches | ≥85% |
| Functions | ≥90% |
| Lines | ≥90% |

Coverage is a quality indicator, not a substitute for meaningful tests.

---

# Continuous Integration

Every pull request must execute:

1. Install dependencies
2. Type checking
3. Linting
4. Unit tests
5. Integration tests
6. Build
7. Coverage reporting

Pull requests failing any required check must not be merged.

---

# Test Organization

Backend

```
src/

modules/

patients/

tests/

unit/

integration/
```

Frontend

```
src/

components/

tests/

features/

tests/
```

E2E

```
tests/

e2e/

patient/

provider/

admin/
```

---

# Naming Conventions

Test files:

```
*.test.ts

*.spec.ts
```

Test names should describe behavior.

Examples:

```
should create a patient successfully

should reject expired consent

should deny unauthorized access
```

---

# Flaky Tests

Flaky tests must be:

- Investigated immediately
- Fixed promptly
- Never ignored

Retries should be minimized and not used to hide instability.

---

# Test Environments

Supported environments:

- Local development
- Continuous Integration
- Staging

Production testing must avoid destructive operations.

---

# Quality Gates

A release cannot proceed if:

- Tests fail
- Coverage drops below thresholds
- Security tests fail
- Build fails
- Type checking fails

---

# Business Rules

- Every feature requires automated tests.
- Business logic is tested independently.
- Integration tests use a dedicated database.
- End-to-end tests validate critical workflows.
- Every bug receives a regression test.
- CI must enforce quality gates.

---

# Related Documents

- backend-architecture.md
- frontend-architecture.md
- validation-strategy.md
- authentication-flow.md
- authorization-model.md
- logging-monitoring.md
- deployment.md