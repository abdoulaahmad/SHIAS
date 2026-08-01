# Release Plan

## Purpose

The Release Plan defines how SHIAS delivers value through incremental product releases.

It connects the Product Roadmap with Sprint Planning by grouping completed Sprint Increments into production-ready releases.

The Release Plan supports Agile Scrum by prioritizing working software over fixed schedules while maintaining clear release objectives.

---

# Release Strategy

SHIAS follows an incremental release strategy.

Each release:

- Delivers usable functionality
- Builds upon previous releases
- Is independently deployable
- Produces a potentially shippable product increment

Development follows the progression:

```
Product Roadmap

↓

Release

↓

Sprint

↓

Product Increment

↓

Production Deployment
```

---

# Sprint Cadence

The project follows a fixed sprint cadence.

| Item | Value |
|------|-------|
| Sprint Length | 2 Weeks |
| Sprint Planning | Beginning of Sprint |
| Daily Scrum | Daily |
| Sprint Review | End of Sprint |
| Sprint Retrospective | End of Sprint |
| Backlog Refinement | Continuous |

Sprint duration may be adjusted only with team agreement.

---

# Release Structure

A release consists of multiple completed sprints.

Example:

```
Release

├── Sprint 1
├── Sprint 2
├── Sprint 3
└── Sprint 4

↓

Production Release
```

The number of sprints per release depends on feature completion and product readiness.

---

# Planned Releases

## Foundation Release

### Objective

Establish the technical foundation of SHIAS.

### Scope

- Repository setup
- Architecture implementation
- CI/CD
- Database schema
- Authentication foundation
- Development environment

### Exit Criteria

- Development environment operational
- Architecture implemented
- CI pipeline passing
- Coding standards adopted

---

## MVP Release

### Objective

Deliver the first usable version of SHIAS.

### Scope

- Patient Identity
- Provider Management
- Consent Management
- Pointer Registry
- Access Broker
- Audit Trail

### Exit Criteria

- End-to-end workflow operational
- Security testing completed
- API documentation complete
- Integration tests passing
- Product Owner approval

---

## Version 1.0 (Pilot Ready)

### Objective

Support pilot deployment with healthcare providers.

### Scope

- Administrative features
- Operational dashboards
- Enhanced monitoring
- Performance improvements
- Backup and recovery
- Security hardening

### Exit Criteria

- Pilot acceptance completed
- Performance targets achieved
- Monitoring operational
- Deployment procedures validated

---

## Version 2.0

### Objective

Expand interoperability and platform capabilities.

### Scope

- Provider integrations
- Notifications
- Reporting
- Mobile optimization
- Operational enhancements

### Exit Criteria

- Integration testing completed
- Production deployment successful
- Stakeholder acceptance achieved

---

# Release Readiness Checklist

A release is considered ready when all of the following are satisfied.

## Development

- All committed Product Backlog Items completed
- Code review completed
- No critical defects
- Documentation updated

---

## Testing

- Unit tests passing
- Integration tests passing
- End-to-End tests passing
- Regression testing completed

---

## Security

- Authentication verified
- Authorization verified
- Security review completed
- No unresolved critical vulnerabilities

---

## Operations

- Deployment tested
- Backup verified
- Monitoring configured
- Rollback procedure validated

---

## Product

- Acceptance criteria satisfied
- Product Owner approval
- Release notes prepared

---

# Release Workflow

```
Sprint Planning

↓

Sprint Development

↓

Testing

↓

Sprint Review

↓

Potentially Shippable Increment

↓

Release Validation

↓

Production Deployment
```

---

# Hotfix Releases

Critical production issues may require a hotfix release.

Hotfixes should:

- Address a single issue or closely related issues
- Undergo testing appropriate to the change
- Be reviewed before deployment
- Be merged back into the main development branch

Hotfix releases should not introduce unrelated features.

---

# Release Versioning

SHIAS follows Semantic Versioning.

```
MAJOR.MINOR.PATCH
```

Examples:

```
0.1.0

0.2.0

1.0.0

1.1.0

1.1.1
```

Version increments:

| Version | Meaning |
|----------|---------|
| MAJOR | Breaking changes |
| MINOR | New backward-compatible features |
| PATCH | Bug fixes and security fixes |

---

# Branching Strategy

The project uses a simplified Git workflow.

```
main
│
├── develop
│
├── feature/*
│
├── release/*
│
└── hotfix/*
```

Guidelines:

- `main` always contains production-ready code.
- `develop` is the integration branch for upcoming work.
- `feature/*` branches are used for individual Product Backlog Items or features.
- `release/*` branches stabilize an upcoming release.
- `hotfix/*` branches address urgent production issues.

---

# Definition of a Release

A release is complete when:

- Release objectives are achieved
- Exit criteria are satisfied
- Product Owner approves deployment
- Documentation is updated
- Deployment is successful

---

# Continuous Improvement

After every release the team conducts:

- Sprint Retrospectives
- Release Retrospectives
- Stakeholder feedback sessions

The outcomes are used to improve future releases and refine the Product Backlog.

---

# Related Documentation

- README.md
- product-roadmap.md
- backlog.md
- milestones.md
- risks.md