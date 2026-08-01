# Logging & Monitoring

Version: 1.0

Status: Active

Owner: SHIAS Team

Last Updated: YYYY-MM-DD

---

# Purpose

This document defines the logging, monitoring, and observability strategy for the Secure Health Identity & Access System (SHIAS).

Its objectives are to provide:

- Operational visibility
- Performance monitoring
- Security monitoring
- Auditability
- Incident investigation
- Troubleshooting

Logging supports system operations.

Audit logging supports compliance and accountability.

These are separate concerns.

---

# Observability Principles

The platform follows these principles:

- Structured logging
- Correlation across services
- Actionable logs
- Minimal sensitive data
- Health monitoring
- Performance measurement
- Centralized error handling

---

# Observability Components

```
HTTP Request

↓

Structured Logging

↓

Application Metrics

↓

Health Checks

↓

Audit Events

↓

Alerts

↓

Operations Dashboard
```

---

# Logging Categories

The system produces multiple categories of logs.

## Application Logs

Capture normal application behavior.

Examples:

- Startup
- Shutdown
- Route execution
- Background jobs

---

## Security Logs

Capture security-related events.

Examples:

- Login attempts
- Failed authentication
- Authorization failures
- Session revocation
- Password changes

---

## Database Logs

Capture database operations.

Examples:

- Connection failures
- Migration execution
- Transaction rollback
- Slow queries

---

## Infrastructure Logs

Capture platform events.

Examples:

- Environment startup
- Configuration loading
- External service failures

---

## Audit Logs

Audit events are immutable business records.

Examples:

- Consent approved
- Consent revoked
- Access token issued
- Medical record accessed

Audit logs are defined separately in:

```
docs/contracts/audit.md
```

---

# Logging Format

All application logs use structured JSON.

Example:

```json
{
  "timestamp": "2026-08-15T10:42:00Z",
  "level": "info",
  "service": "api",
  "correlationId": "0198abcd...",
  "requestId": "0198efgh...",
  "method": "POST",
  "path": "/auth/login",
  "statusCode": 200,
  "durationMs": 83
}
```

---

# Log Levels

Supported levels:

```
TRACE

DEBUG

INFO

WARN

ERROR

FATAL
```

Guidelines:

TRACE

Very detailed diagnostics.

Development only.

---

DEBUG

Developer diagnostics.

Disabled in production.

---

INFO

Normal operations.

Examples:

- Startup
- Successful login
- Request completed

---

WARN

Unexpected but recoverable events.

Examples:

- Validation failures
- Rate limiting
- Slow response

---

ERROR

Operation failed.

Examples:

- Database unavailable
- Unexpected exception
- External dependency failure

---

FATAL

System cannot continue.

Examples:

- Startup failure
- Configuration invalid
- Database unavailable during boot

---

# Correlation IDs

Every incoming request receives a unique correlation ID.

Example:

```
0198abcd-1234...
```

The ID is propagated through:

- Logs
- Audit events
- Error responses
- Background jobs

This enables end-to-end request tracing.

---

# Request Logging

Every HTTP request records:

- Method
- Path
- Status code
- Duration
- Client IP
- User ID (if authenticated)
- Correlation ID

Sensitive request bodies must not be logged.

---

# Error Logging

Errors should include:

- Correlation ID
- Stack trace (internal only)
- Route
- User ID (if available)
- Exception type

Clients receive sanitized error responses.

---

# Sensitive Data

The following must never appear in logs:

- Passwords
- Access tokens
- Refresh tokens
- Authorization headers
- API keys
- Session secrets
- Raw medical records
- Personally identifiable health data

Sensitive values should be masked or omitted.

---

# Health Endpoints

The API exposes:

```
GET /health
```

Returns:

- Service status
- Database connectivity
- Application version

---

```
GET /ready
```

Returns:

- Database ready
- Configuration loaded
- Dependencies available

---

# Metrics

The platform collects metrics for:

- Request count
- Error rate
- Average latency
- Database query duration
- Authentication success/failure
- Consent operations
- Access token issuance

---

# Performance Monitoring

Monitor:

- Response times
- Slow endpoints
- Slow database queries
- Memory usage
- CPU usage
- Active sessions

Performance thresholds should trigger operational review.

---

# Alerts

Alerts should be generated for:

- Service unavailable
- Database connection failures
- High error rates
- Authentication attack patterns
- Excessive latency
- Repeated failed deployments

---

# Exception Handling

Unhandled exceptions are captured centrally.

The application should:

- Log the exception
- Generate a correlation ID
- Return RFC 7807 Problem Details
- Continue serving requests where possible

---

# Startup Logging

During startup, record:

- Application version
- Environment
- Port
- Database connection status
- Migration status

Secrets must never be logged.

---

# Shutdown Logging

Graceful shutdown records:

- Shutdown reason
- Active requests
- Open connections
- Shutdown duration

---

# Retention

Application logs and audit logs may have different retention periods.

Application logs:

- Retained for operational troubleshooting.

Audit logs:

- Retained according to legal, regulatory, and organizational requirements.

Retention policies should be documented separately.

---

# Monitoring Dashboard

Operations dashboards should include:

- System status
- Request throughput
- Error rates
- Authentication activity
- Consent activity
- Active sessions
- Database health

---

# Testing

Observability should be verified through automated tests.

Tests should confirm:

- Correlation IDs generated
- Structured log format
- Health endpoint responses
- Metrics collection
- Error logging
- Sensitive data masking

---

# Business Rules

- All logs must be structured.
- Every request receives a correlation ID.
- Sensitive information must never be logged.
- Audit logs remain separate from application logs.
- Errors must be traceable without exposing internal details.
- Health endpoints must accurately reflect service status.

---

# Related Documents

- authentication-flow.md
- authorization-model.md
- backend-architecture.md
- contracts/audit.md
- contracts/errors.md
- deployment.md