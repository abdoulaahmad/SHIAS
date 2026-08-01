# ADR-0005: Use JWT Access Tokens with Rotating Refresh Tokens

Status: Accepted

Date: YYYY-MM-DD

Decision Makers:

- SHIAS Team

---

# Context

SHIAS requires an authentication mechanism that provides:

- Strong security
- Stateless request authentication
- Scalable API access
- Session management
- Support for multiple devices
- Revocable sessions
- Good user experience

The platform serves:

- Patients
- Provider Users
- Administrators

Users may be simultaneously authenticated on multiple devices.

The authentication system must balance security, performance, and usability.

---

# Decision

SHIAS will use:

- Short-lived JWT Access Tokens
- Rotating Refresh Tokens
- Stateful session storage
- Argon2id password hashing

Authentication consists of:

```
User

↓

Login

↓

Session Created

↓

JWT Access Token

+

Refresh Token

↓

Authenticated Requests
```

---

# Decision Drivers

- Security
- Scalability
- Stateless APIs
- Session revocation
- Multi-device support
- Industry adoption
- Developer experience

---

# Rationale

## JWT Access Tokens

Access tokens are:

- Stateless
- Self-contained
- Signed
- Short-lived

Benefits include:

- No database lookup for every request
- Easy horizontal scaling
- Standardized authentication
- Efficient API performance

Access tokens expire after:

```
15 minutes
```

---

## Refresh Tokens

Refresh tokens provide long-lived authentication without requiring users to log in repeatedly.

Characteristics:

- Stored securely
- Single-use
- Rotated after every refresh
- Hashed before persistence

Lifetime:

```
30 days
```

---

## Session Storage

Each login creates an individual session.

Session records contain:

- Session ID
- User ID
- Refresh token hash
- Device information
- IP address
- Expiration
- Revocation status

This enables:

- Device management
- Session revocation
- Global logout
- Security monitoring

---

## Token Rotation

Every refresh request performs:

```
Old Refresh Token

↓

Validate

↓

Invalidate

↓

Generate New Refresh Token

↓

Store Hash

↓

Return New Tokens
```

Token rotation reduces replay attack risk.

---

## Password Hashing

Passwords are hashed using:

```
Argon2id
```

Passwords are never stored or logged in plaintext.

---

# Alternatives Considered

## Server-Side Sessions

Rejected.

Pros:

- Immediate revocation
- Simpler token model

Cons:

- Database or cache lookup required for every request
- Reduced horizontal scalability
- Higher infrastructure dependency

---

## Opaque Access Tokens

Rejected.

Pros:

- Easy revocation
- Small token size

Cons:

- Requires token introspection
- Additional network/database lookups
- Increased latency

---

## PASETO

Considered.

Pros:

- Modern design
- Simpler cryptographic choices
- Reduced implementation pitfalls

Cons:

- Smaller ecosystem
- Fewer mature libraries
- Less industry adoption
- Less operational familiarity

JWT was selected due to its mature ecosystem and broad tooling support.

---

## Cookie-Based Sessions

Rejected.

Pros:

- Familiar web authentication
- Simple browser support

Cons:

- Less suitable for API-first architecture
- Additional CSRF considerations
- Reduced flexibility for future mobile or third-party clients

---

# Consequences

Positive:

- Stateless request authentication
- Scalable architecture
- Good user experience
- Session management
- Secure token rotation
- Strong ecosystem support

Negative:

- More complex than simple sessions
- Requires refresh token management
- JWTs cannot be revoked independently of their session until they expire

These trade-offs are acceptable given the short access token lifetime.

---

# Security Considerations

The authentication system must:

- Use HTTPS exclusively
- Sign JWTs securely
- Hash refresh tokens
- Rotate refresh tokens
- Validate expiration
- Validate issuer
- Validate audience
- Reject revoked sessions
- Rate-limit login attempts

---

# Implementation Guidelines

Authentication responsibilities:

JWT

- Request authentication
- Identity propagation

Refresh Token

- Session continuation
- Token renewal

Session Store

- Revocation
- Device tracking
- Activity monitoring

---

# Compliance

All authenticated requests must:

- Present a valid JWT
- Belong to an active session
- Pass authorization checks
- Generate audit events where applicable

Authentication must remain separate from authorization.

---

# Future Review

This decision should be revisited if:

- Regulatory requirements change
- Hardware-backed authentication becomes mandatory
- Token standards evolve significantly
- Platform requirements shift toward zero-trust architectures

---

# References

- docs/implementation/authentication-flow.md
- docs/implementation/authorization-model.md
- docs/contracts/authentication.md
- docs/database/schema.md