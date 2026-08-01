# Pagination, Filtering & Sorting

Version: 1.0

Status: Active

Owner: SHIAS Team

Last Updated: YYYY-MM-DD

---

# Purpose

This document defines the standard pagination, filtering, sorting, and searching behavior for collection endpoints in the Secure Health Identity & Access System (SHIAS).

Every endpoint returning multiple resources MUST follow the conventions defined in this document.

Examples include:

- Patients
- Providers
- Metadata Pointers
- Consents
- Audit Events

---

# Design Principles

Collection endpoints should be:

- Predictable
- Consistent
- Performant
- Stable
- Easy to consume

Every collection endpoint should support pagination.

Filtering and sorting should be supported where appropriate.

---

# Pagination Strategy

The SHIAS API uses offset-based pagination for the MVP.

Future versions may introduce cursor-based pagination.

---

# Query Parameters

| Parameter | Description |
|------------|-------------|
| page | Page number (starts at 1) |
| limit | Number of records per page |

Example

```
GET /api/v1/patients?page=2&limit=25
```

---

# Default Values

| Parameter | Default |
|------------|---------|
| page | 1 |
| limit | 20 |

---

# Limits

| Parameter | Minimum | Maximum |
|------------|---------|---------|
| page | 1 | Unlimited |
| limit | 1 | 100 |

Requests exceeding the maximum limit should automatically use the maximum allowed value.

---

# Standard Response

Every paginated endpoint returns the following structure.

```json
{
  "data": [
    {}
  ],
  "pagination": {
    "page": 2,
    "limit": 20,
    "totalItems": 145,
    "totalPages": 8,
    "hasNextPage": true,
    "hasPreviousPage": true
  }
}
```

---

# Pagination Fields

| Field | Description |
|---------|-------------|
| page | Current page |
| limit | Items per page |
| totalItems | Total matching records |
| totalPages | Number of pages |
| hasNextPage | More pages available |
| hasPreviousPage | Previous page available |

---

# Empty Collections

If no resources match the query:

```json
{
  "data": [],
  "pagination": {
    "page": 1,
    "limit": 20,
    "totalItems": 0,
    "totalPages": 0,
    "hasNextPage": false,
    "hasPreviousPage": false
  }
}
```

HTTP 200 should still be returned.

---

# Filtering

Collection endpoints may support filtering.

Example

```
GET /providers?status=ACTIVE
```

Example

```
GET /consents?status=PENDING
```

Multiple filters may be combined.

```
GET /providers?status=ACTIVE&verificationStatus=VERIFIED
```

---

# Filtering Rules

Filters should:

- Be optional.
- Ignore omitted parameters.
- Use exact matching unless documented otherwise.

---

# Searching

Search uses the `search` query parameter.

Example

```
GET /patients?search=Amina
```

The server determines which fields are searchable.

Typical searchable fields include:

- Patient name
- Health ID
- Provider name
- Registration number

---

# Sorting

Sorting uses the `sort` query parameter.

Ascending

```
GET /patients?sort=lastName
```

Descending

```
GET /patients?sort=-createdAt
```

The minus (`-`) prefix indicates descending order.

---

# Multiple Sort Fields

Multiple fields may be supplied.

```
GET /patients?sort=lastName,-createdAt
```

Sorting is applied from left to right.

---

# Date Range Filtering

Endpoints supporting timestamps may implement:

```
from
to
```

Example

```
GET /audit-events?from=2026-08-01T00:00:00Z&to=2026-08-31T23:59:59Z
```

Dates must be ISO 8601 UTC timestamps.

---

# Field Selection (Future)

Future versions may support:

```
fields
```

Example

```
GET /patients?fields=patientId,healthId,firstName,lastName
```

Unknown fields should return HTTP 400.

---

# Includes (Future)

Future versions may support related resource expansion.

Example

```
GET /patients/{id}?include=consents
```

Allowed relationships must be documented per resource.

---

# Response Ordering

Unless otherwise specified:

Collections are sorted by:

```
createdAt DESC
```

Newest resources appear first.

---

# Validation Rules

| Parameter | Rules |
|------------|-------|
| page | Integer ≥ 1 |
| limit | Integer between 1 and 100 |
| search | Maximum 100 characters |
| sort | Valid sortable fields only |
| from | ISO 8601 UTC timestamp |
| to | ISO 8601 UTC timestamp |

---

# Invalid Parameters

Example

```
GET /patients?page=-2
```

Returns

HTTP 400

```json
{
  "type": "https://api.shias.com/problems/invalid-pagination",
  "title": "Invalid Pagination Parameters",
  "status": 400,
  "code": "SYS_INVALID_PAGINATION",
  "detail": "The page parameter must be greater than or equal to 1."
}
```

---

# Performance Guidelines

Implementations should:

- Apply filters before pagination.
- Apply sorting before pagination.
- Execute database pagination efficiently.
- Avoid loading unnecessary records.

---

# Security Considerations

Collection endpoints must:

- Respect authorization.
- Never expose unauthorized resources.
- Never leak hidden records through pagination counts.
- Never expose soft-deleted resources unless explicitly requested by administrators.

---

# Business Rules

- Every collection endpoint MUST support pagination.
- Pagination metadata MUST always be returned.
- Filtering MUST be optional.
- Sorting MUST use documented fields only.
- Invalid parameters MUST return HTTP 400.
- Maximum page size is 100 records.

---

# Future Enhancements

Future versions may support:

- Cursor-based pagination
- Full-text search
- Advanced filtering
- Compound filtering
- Aggregations
- GraphQL connections

---

# Related Documents

- api-overview.md
- errors.md
- authentication.md
- patients.md
- providers.md
- pointers.md
- consent.md
- audit.md