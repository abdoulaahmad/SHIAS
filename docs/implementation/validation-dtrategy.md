# Validation Strategy

Version: 1.0

Status: Active

Owner: SHIAS Team

Last Updated: YYYY-MM-DD

---

# Purpose

This document defines the validation strategy for the Secure Health Identity & Access System (SHIAS).

It establishes how data is validated throughout the system to ensure:

- Data integrity
- Security
- Consistency
- Reliability
- Compliance with business rules

Validation occurs at multiple layers of the application and is never delegated to a single component.

---

# Validation Principles

The validation strategy follows these principles:

- Validate early
- Validate consistently
- Fail fast
- Never trust client input
- Keep validation deterministic
- Separate syntax validation from business validation

Every request must pass all required validation stages before any business operation is executed.

---

# Validation Layers

Validation is performed in the following order:

```
HTTP Request

↓

Schema Validation

↓

Input Sanitization

↓

Business Validation

↓

Authorization

↓

Database Constraints

↓

Persistence
```

Each layer has a distinct responsibility.

---

# Types of Validation

## 1. Schema Validation

Ensures request structure is valid.

Checks include:

- Required fields
- Field types
- Length limits
- Enum values
- Object structure
- Array structure

Performed using:

```
Zod
```

---

## 2. Input Sanitization

Input is normalized before processing.

Examples:

- Trim whitespace
- Normalize email casing
- Remove duplicate spaces
- Canonicalize phone numbers

Sanitization must never alter the semantic meaning of user input.

---

## 3. Business Validation

Business validation enforces domain rules.

Examples:

- Patient email must be unique
- Provider registration number must exist
- Consent cannot expire in the past
- Pointer owner must exist
- User cannot approve another patient's consent

Business validation belongs in the Application or Domain layer.

---

## 4. Authorization Validation

Authorization confirms the authenticated user is permitted to perform the requested action.

Validation includes:

- Role
- Ownership
- Consent scope
- Account status

---

## 5. Database Validation

Database constraints provide the final layer of protection.

Examples:

- Foreign keys
- Unique constraints
- CHECK constraints
- NOT NULL constraints

Database validation complements application validation but never replaces it.

---

# Request Validation

Every endpoint validates:

- Path parameters
- Query parameters
- Request body
- Headers (where applicable)

Invalid requests are rejected before business logic executes.

---

# Field Validation Rules

Examples:

## Email

- Required where applicable
- RFC-compliant format
- Maximum length: 254 characters
- Stored in lowercase

---

## Password

Requirements:

- Minimum 12 characters
- Maximum 128 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one digit
- At least one special character

Passwords are never logged or returned.

---

## UUID

All identifiers must:

- Be valid UUIDv7
- Match expected format

Invalid identifiers return:

```
400 Bad Request
```

---

## Dates

All dates must:

- Be ISO 8601
- Include timezone
- Represent valid calendar dates

Business rules determine whether past or future dates are allowed.

---

## Enums

Enum fields accept only documented values.

Unknown enum values are rejected.

---

## Arrays

Arrays are validated for:

- Maximum size
- Minimum size
- Duplicate values
- Element type

---

# Validation Error Responses

Validation failures return:

```
400 Bad Request
```

Response format follows RFC 7807 Problem Details.

Example:

```json
{
  "type": "https://shias.example/errors/validation",
  "title": "Validation Error",
  "status": 400,
  "detail": "One or more validation errors occurred.",
  "errors": [
    {
      "field": "email",
      "message": "Email address is invalid."
    },
    {
      "field": "password",
      "message": "Password must contain at least one uppercase letter."
    }
  ]
}
```

---

# Cross-Field Validation

Some rules require multiple fields.

Examples:

- Password and confirmation must match
- Consent expiration must be after creation date
- Access token expiration must be after issuance

---

# Cross-Resource Validation

Some operations depend on other resources.

Examples:

- Provider must exist
- Patient must exist
- Consent must exist
- Pointer must belong to provider

These checks occur during business validation.

---

# Duplicate Detection

The application checks for duplicates before insertion.

Examples:

- Email
- Health ID
- Provider registration number

Database unique constraints remain the final safeguard.

---

# File Validation

When file uploads are introduced, validation should include:

- File type
- File size
- MIME type
- Malware scanning
- Filename normalization

Executable files must never be accepted.

---

# Defensive Validation

Validation protects against common attacks, including:

- SQL injection
- XSS
- Path traversal
- Oversized payloads
- Malformed JSON

All user input is treated as untrusted.

---

# Logging

Validation failures may be logged with:

- Correlation ID
- Endpoint
- Timestamp
- Error code

Sensitive user input (such as passwords or tokens) must never be logged.

---

# Testing

Validation rules require automated tests.

Tests should verify:

- Valid input
- Invalid input
- Boundary values
- Missing fields
- Malformed requests
- Business rule violations

---

# Versioning

Validation changes that break API compatibility require a new API version.

Backward-compatible enhancements may be introduced without version changes.

---

# Business Rules

- Every external input is validated.
- Validation occurs before business logic.
- Schema validation and business validation remain separate.
- Validation failures are deterministic.
- Database constraints provide the final safeguard.
- Validation errors follow RFC 7807.
- Sensitive values are never included in validation responses or logs.

---

# Related Documents

- backend-architecture.md
- frontend-architecture.md
- authentication-flow.md
- authorization-model.md
- contracts/errors.md
- database/constraints.md
- business-rules.md