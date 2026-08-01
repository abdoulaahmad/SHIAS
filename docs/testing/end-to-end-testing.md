# End-to-End Testing

## Purpose

This document defines the standards, scope, and best practices for End-to-End (E2E) testing within the Secure Health Identity & Access System (SHIAS).

End-to-End testing validates complete user journeys by exercising the system through its public interfaces. These tests ensure that all integrated components function correctly together in a production-like environment.

E2E tests provide confidence that critical business workflows operate as expected from the perspective of real users.

---

# Objectives

End-to-End testing aims to:

- Validate complete user workflows
- Verify business requirements
- Ensure frontend and backend integration
- Detect workflow regressions
- Validate production readiness
- Verify user experience
- Increase deployment confidence

---

# Testing Framework

The SHIAS platform uses:

| Tool | Purpose |
|------|---------|
| Playwright | Browser automation |
| TypeScript | Test implementation |
| Vitest | Supporting utilities where required |

---

# Scope

End-to-End tests verify complete platform behavior including:

- Frontend
- Backend APIs
- Authentication
- Authorization
- PostgreSQL
- Audit logging
- Business workflows

Mocking should be minimized.

Only external third-party systems should be simulated.

---

# Test Environment

E2E tests execute against a production-like environment.

Environment requirements:

- Dedicated database
- Seeded test data
- Configured authentication
- Mock external provider systems
- Stable test environment
- Representative application configuration

Production environments must not be used.

---

# Core User Journeys

The following workflows are considered business-critical.

## Patient Registration

Workflow:

1. Open registration page
2. Complete registration form
3. Submit registration
4. Verify Health ID creation
5. Login successfully

Expected outcome:

Patient account created successfully.

---

## Authentication

Workflow:

1. Login
2. Receive session
3. Access dashboard
4. Logout
5. Verify session termination

Expected outcome:

Authentication lifecycle functions correctly.

---

## Consent Management

Workflow:

1. Provider requests access
2. Patient receives consent request
3. Patient approves consent
4. Consent becomes active
5. Provider gains authorized access

Expected outcome:

Consent lifecycle completes successfully.

---

## Consent Revocation

Workflow:

1. Existing consent is active
2. Patient revokes consent
3. Provider attempts access
4. Access denied
5. Audit event recorded

Expected outcome:

Revoked consent immediately prevents access.

---

## Pointer Registration

Workflow:

1. Provider registers metadata pointer
2. Pointer stored
3. Pointer searchable
4. Pointer retrieved successfully

Expected outcome:

Metadata registry functions correctly.

---

## Record Access

Workflow:

1. Provider searches patient
2. Pointer discovered
3. Authorization evaluated
4. Temporary access token issued
5. Source provider contacted
6. Audit log created

Expected outcome:

Secure provider-to-provider access succeeds.

---

## Administrative Workflow

Workflow:

1. Administrator logs in
2. Reviews providers
3. Verifies provider
4. Reviews audit logs

Expected outcome:

Administrative functions operate correctly.

---

# Browser Coverage

Supported browsers:

- Chromium
- Firefox
- WebKit

Tests should pass consistently across all supported browsers unless browser-specific behavior is documented.

---

# Responsive Testing

The following viewport categories should be tested:

- Desktop
- Tablet
- Mobile

Critical workflows should remain functional across supported screen sizes.

---

# Accessibility Verification

Critical user journeys should include accessibility checks.

Areas to verify:

- Keyboard navigation
- Focus management
- Accessible labels
- Color contrast
- Screen reader compatibility (where applicable)

Accessibility testing complements, but does not replace, dedicated accessibility reviews.

---

# Test Data

Test accounts should be predefined.

Examples:

- Test Patient
- Test Provider
- Test Administrator

Test data should:

- Be deterministic
- Be isolated
- Reset between test runs
- Avoid production information

---

# Error Scenarios

E2E tests should verify:

- Invalid login
- Unauthorized access
- Expired session
- Missing consent
- Invalid form submission
- Network interruption
- External provider timeout

The application should display appropriate user-facing error messages and recover gracefully where possible.

---

# Test Execution

End-to-End tests should execute:

- Before production releases
- During release validation
- On scheduled nightly builds
- For critical pull requests affecting user workflows

Running the full E2E suite on every commit is generally discouraged due to execution time.

---

# Continuous Integration

The CI pipeline should:

1. Deploy the application to a test environment
2. Seed test data
3. Execute Playwright tests
4. Collect reports
5. Archive screenshots and traces on failure
6. Clean up the environment

Failed E2E tests should block production releases.

---

# Reporting

Each test run should generate:

- Test summary
- Passed tests
- Failed tests
- Execution duration
- Screenshots (on failure)
- Videos (on failure)
- Playwright traces

Reports should be retained for troubleshooting and release validation.

---

# Best Practices

- Test complete business workflows.
- Keep scenarios realistic.
- Minimize mocked components.
- Use stable selectors.
- Keep tests independent.
- Reset test data between runs.
- Write clear and descriptive test names.

---

# Anti-Patterns

Avoid:

- Testing implementation details
- Sharing state between tests
- Hard-coded wait times
- Brittle CSS selectors
- Excessively long scenarios
- Depending on execution order

---

# Exit Criteria

End-to-End testing is complete when:

- Critical workflows pass.
- No unresolved critical defects remain.
- Production deployment scenarios are validated.
- Regression suite passes successfully.
- Product Owner approves release readiness.

---

# Related Documentation

- README.md
- testing-strategy.md
- unit-testing.md
- integration-testing.md
- security-testing.md
- test-data.md
- ../project/business-rules.md
- ../contracts/api-overview.md