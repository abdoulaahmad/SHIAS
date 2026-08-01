# Unit Testing

## Purpose

This document defines the standards and best practices for unit testing within the Secure Health Identity & Access System (SHIAS).

Unit tests verify the correctness of individual software units in isolation. They provide fast feedback, improve maintainability, and reduce the likelihood of regressions.

All business logic should be covered by automated unit tests.

---

# Objectives

Unit testing aims to:

- Verify individual components in isolation
- Detect defects early
- Prevent regressions
- Increase developer confidence
- Enable safe refactoring
- Document expected behavior through executable tests

---

# Testing Framework

SHIAS uses the following tools for unit testing:

| Tool | Purpose |
|------|---------|
| Vitest | Test runner |
| TypeScript | Type safety |
| Mock Service Worker (MSW) | API mocking (where applicable) |
| Prisma Mocking | Database isolation |
| Faker | Test data generation |

---

# Scope

Unit tests should focus on:

- Domain logic
- Business rules
- Utility functions
- Validation logic
- Services
- Helper functions
- Data transformations

Unit tests should **not** verify:

- Database connectivity
- External APIs
- HTTP endpoints
- Authentication servers
- Browser behavior

These belong to Integration or End-to-End testing.

---

# Test Organization

Tests should mirror the application's directory structure.

Example:

```
src/
├── services/
│   ├── consent.service.ts
│   └── consent.service.test.ts
│
├── domain/
│   ├── patient.ts
│   └── patient.test.ts
│
├── utils/
│   ├── jwt.ts
│   └── jwt.test.ts
```

Keeping tests close to the code they verify improves discoverability and maintenance.

---

# Test Naming

Test files should use the following naming convention:

```
*.test.ts
```

Examples:

```
patient.test.ts

consent.service.test.ts

jwt.test.ts

validator.test.ts
```

---

# Test Structure

Tests should follow the **Arrange – Act – Assert (AAA)** pattern.

```text
Arrange
    ↓
Act
    ↓
Assert
```

### Example

```ts
describe("ConsentService", () => {
  it("should approve a pending consent request", () => {
    // Arrange

    // Act

    // Assert
  });
});
```

---

# Naming Conventions

Describe blocks:

```
describe("PatientService")
```

Test cases:

```
it("should register a patient")
```

Prefer behavior-focused descriptions.

Avoid vague names such as:

```
works correctly

test patient

function test
```

---

# Isolation

Each unit test must be independent.

Tests should:

- Create their own data
- Clean up after execution
- Avoid shared mutable state
- Produce the same result every run

Tests must never depend on execution order.

---

# Mocking

External dependencies should be mocked.

Examples:

- Database repositories
- HTTP clients
- Email services
- Notification services
- Authentication providers
- File storage

Only the unit under test should contain real logic.

---

# Test Data

Test data should be:

- Minimal
- Readable
- Deterministic
- Relevant to the scenario

Avoid unnecessary complexity.

Example:

```ts
const patient = {
  id: "patient-001",
  firstName: "Jane",
  lastName: "Doe"
};
```

---

# Assertions

Assertions should verify observable behavior.

Examples:

- Returned values
- State changes
- Exceptions
- Method calls
- Validation results

Avoid asserting internal implementation details.

---

# Error Testing

Expected failures should be tested.

Examples:

- Invalid input
- Missing required fields
- Unauthorized operations
- Validation failures
- Business rule violations

Every major validation rule should have corresponding failure tests.

---

# Business Rules

Critical business rules must always have unit tests.

Examples:

- Consent expiration
- Duplicate patient detection
- Authorization rules
- Pointer validation
- Record ownership

Business rules are among the highest-priority areas for test coverage.

---

# Coverage Targets

Recommended minimum coverage:

| Component | Target |
|-----------|--------|
| Domain Models | 90% |
| Business Services | 90% |
| Utility Functions | 90% |
| Validation Logic | 90% |
| Controllers | 80% |

Coverage percentages should guide quality rather than become mandatory goals.

---

# Test Execution

Unit tests should run:

- Before every commit
- In Continuous Integration (CI)
- Before merging a Pull Request
- Before every release

Developers are encouraged to run unit tests locally during development.

---

# Continuous Integration

Every Pull Request should automatically execute:

- Unit tests
- Linting
- Type checking

A Pull Request must not be merged if unit tests fail.

---

# Best Practices

- Keep tests small and focused.
- Test one behavior per test case.
- Prefer readable tests over clever tests.
- Avoid duplicated setup code.
- Refactor tests as production code evolves.
- Write tests that clearly communicate intent.

---

# Anti-Patterns

Avoid:

- Testing multiple behaviors in one test
- Shared mutable test state
- Overusing mocks
- Extremely long test functions
- Testing private methods directly
- Depending on implementation details

---

# Definition of Done

Unit testing is complete when:

- All unit tests pass.
- Critical business logic is covered.
- New functionality includes corresponding tests.
- Existing tests remain green.
- Coverage targets are maintained.

---

# Related Documentation

- README.md
- testing-strategy.md
- integration-testing.md
- end-to-end-testing.md
- security-testing.md
- test-data.md
- ../implementation/testing-strategy.md