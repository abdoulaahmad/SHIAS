# ADR-0009: Do Not Store Clinical Medical Records

Status: Accepted

Date: YYYY-MM-DD

Decision Makers:

- SHIAS Team

---

# Context

SHIAS is designed to enable secure discovery and controlled access to healthcare information across multiple providers.

Healthcare providers already maintain authoritative medical record systems, including:

- Electronic Medical Records (EMRs)
- Electronic Health Records (EHRs)
- Hospital Information Systems (HIS)
- Laboratory Information Systems (LIS)
- Radiology Information Systems (RIS)

Duplicating these records into SHIAS would introduce:

- Increased security risk
- Larger privacy impact
- Synchronization challenges
- Data ownership ambiguity
- Higher infrastructure costs
- Additional regulatory obligations

The platform's objective is to facilitate secure access—not to become another medical record repository.

---

# Decision

SHIAS **will not store clinical medical records**.

Instead, SHIAS stores only:

- Patient identities
- Provider identities
- Metadata pointers
- Consent records
- Access tokens
- Session information
- Audit events
- System configuration

Clinical data remains within the originating healthcare provider's systems.

---

# Decision Drivers

- Privacy
- Security
- Least data retention
- Regulatory compliance
- Interoperability
- Scalability
- Data ownership
- Simplicity

---

# Architectural Model

The architecture follows a pointer-based model.

```
Patient

↓

SHIAS

├── Identity
├── Consent
├── Metadata Pointer
└── Audit

↓

Healthcare Provider

↓

Clinical Record
```

SHIAS never becomes the source of truth for medical records.

---

# Metadata Pointers

Pointers describe where a clinical record exists.

A pointer may include:

- Pointer ID
- Patient ID
- Provider ID
- Record type
- Record identifier
- Department
- Facility
- Record version
- Created date
- Last updated
- Source system

Pointers do **not** contain clinical content.

---

# Record Retrieval

When an authorized provider requests a record:

1. SHIAS verifies identity.
2. SHIAS validates consent.
3. SHIAS evaluates authorization policies.
4. SHIAS issues a short-lived access token.
5. The requesting provider retrieves the record directly from the source provider.

SHIAS is not involved in storing or caching the returned clinical payload.

---

# Benefits

## Improved Privacy

Sensitive medical information remains only with the healthcare provider responsible for creating it.

Compromising SHIAS would not expose complete clinical histories.

---

## Reduced Attack Surface

The platform stores significantly less sensitive information.

Attackers cannot obtain:

- Diagnoses
- Prescriptions
- Laboratory results
- Imaging studies
- Clinical notes

because those records are not stored in SHIAS.

---

## Clear Data Ownership

Each provider remains the authoritative owner of its clinical records.

SHIAS manages access—not ownership.

---

## Simplified Synchronization

Since records are never duplicated:

- No replication
- No synchronization conflicts
- No stale copies
- No merge logic

Providers update only their own systems.

---

## Scalability

Metadata is substantially smaller than clinical payloads.

This allows SHIAS to support a large number of patients and providers without storing large binary objects or extensive medical histories.

---

# Alternatives Considered

## Centralized Medical Record Repository

Rejected.

Pros:

- Single source for queries
- Simplified retrieval

Cons:

- Extremely high security requirements
- Massive storage requirements
- Synchronization complexity
- Privacy risks
- Greater regulatory burden
- Data ownership disputes

---

## Cached Medical Records

Rejected.

Pros:

- Faster repeated access

Cons:

- Risk of stale data
- Cache invalidation complexity
- Increased storage of sensitive data
- Expanded attack surface

---

## Full Health Information Exchange Database

Rejected.

Pros:

- Rich analytics
- Unified querying

Cons:

- Outside SHIAS's scope
- Complex governance
- Significant operational overhead
- Greater compliance obligations

---

# Consequences

Positive:

- Smaller security footprint
- Better privacy
- Lower storage costs
- Easier compliance
- Clear ownership boundaries
- Simpler architecture

Negative:

- Retrieval depends on source provider availability
- Network latency between providers
- Requires standardized provider APIs

These trade-offs are acceptable given SHIAS's objectives.

---

# Security Considerations

Because SHIAS does not store clinical data:

- Database compromise has reduced impact.
- Backup sensitivity is reduced.
- Encryption requirements remain important for identities and consent.
- Audit logs become even more critical for accountability.

---

# Implementation Guidelines

SHIAS may store:

- Metadata
- Identifiers
- References
- Consent
- Audit information

SHIAS must never store:

- Clinical notes
- Laboratory results
- Prescriptions
- Radiology images
- Diagnoses
- Allergies
- Vital signs
- Medication histories
- Medical documents
- Binary clinical files

If a future feature requires temporary handling of clinical data (for example, transformation or validation), the data must be processed in memory and discarded immediately after use unless explicitly approved through a separate architectural decision.

---

# Compliance

All new features must preserve the pointer-based architecture.

Any proposal to persist clinical payloads requires:

- A new Architecture Decision Record
- Security review
- Privacy impact assessment
- Regulatory review
- Explicit project approval

The default policy is:

**Clinical medical records are never stored by SHIAS.**

---

# Future Review

This decision should be revisited only if:

- SHIAS expands into a certified Electronic Health Record platform.
- Legal or regulatory requirements mandate centralized storage.
- A new architecture demonstrably provides stronger privacy and security guarantees without compromising interoperability.

---

# References

- docs/project/vision.md
- docs/project/business-rules.md
- docs/architecture/domain-model.md
- docs/architecture/data-flow.md
- docs/contracts/pointers.md
- docs/contracts/access-broker.md
- docs/contracts/consent.md