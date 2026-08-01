# ADR-0007: Use pnpm Workspaces for Monorepo Management

Status: Accepted

Date: YYYY-MM-DD

Decision Makers:

- SHIAS Team

---

# Context

SHIAS consists of multiple applications and shared packages.

Applications include:

- API
- Patient Portal
- Provider Portal
- Provider Source Demo
- Provider Request Demo

Shared code includes:

- SDK
- Shared types
- Utilities
- Configuration
- TypeScript configuration
- Lint configuration

Managing these projects as independent repositories would introduce:

- Dependency duplication
- Version synchronization issues
- Code sharing difficulties
- Increased maintenance effort

The project requires a repository structure that encourages reuse while keeping each application independently deployable.

---

# Decision

SHIAS will use a **pnpm workspace monorepo**.

The repository contains multiple applications and shared packages managed through a single workspace.

```
shias/

apps/

packages/

docs/

prisma/
```

Each application remains independently buildable and deployable.

---

# Decision Drivers

- Code reuse
- Dependency management
- Fast installation
- Disk efficiency
- TypeScript support
- Shared tooling
- Consistent developer experience
- Long-term maintainability

---

# Rationale

## Efficient Dependency Management

pnpm stores package contents in a global content-addressable store and links them into projects.

Benefits:

- Reduced disk usage
- Faster installs
- Consistent dependency versions

---

## Shared Packages

The workspace allows internal packages to be shared across applications.

Examples:

```
packages/

sdk-node

shared-types

shared-utils

config

tsconfig

eslint-config
```

Applications consume these packages directly without publishing them.

---

## Consistent Tooling

All workspace projects share:

- TypeScript configuration
- Lint rules
- Formatting rules
- Build scripts
- Testing configuration

This reduces duplication and keeps development standards consistent.

---

## Developer Experience

A single repository enables:

- Unified dependency installation
- Centralized scripts
- Easier refactoring
- Cross-project navigation
- Simplified onboarding

Developers can work across the entire platform without switching repositories.

---

## Workspace Isolation

Although projects share a repository, each application remains logically independent.

Examples:

```
apps/api

apps/patient-portal

apps/provider-portal
```

Each application can be built, tested, and deployed separately.

---

## Performance

pnpm provides:

- Fast installation
- Efficient linking
- Strict dependency resolution
- Reduced storage requirements

These characteristics are especially valuable as the repository grows.

---

# Alternatives Considered

## Polyrepo

Rejected.

Pros:

- Clear separation
- Independent release cycles

Cons:

- Difficult code sharing
- Dependency drift
- Repeated tooling configuration
- Higher maintenance cost

The amount of shared code in SHIAS favors a monorepo.

---

## npm Workspaces

Considered.

Pros:

- Built into npm
- Familiar workflow

Cons:

- Slower installations
- Less efficient dependency storage
- Weaker workspace performance for large projects

---

## Yarn Workspaces

Considered.

Pros:

- Mature workspace support
- Large community

Cons:

- More complex configuration options
- Multiple package management modes
- Less attractive storage model compared to pnpm

---

## Bun Workspaces

Rejected for now.

Pros:

- Very fast
- Modern tooling

Cons:

- Ecosystem still maturing
- Smaller enterprise adoption
- Some tooling compatibility concerns

Future adoption may be reconsidered as the ecosystem evolves.

---

# Consequences

Positive:

- Single source of truth
- Shared packages
- Faster installations
- Reduced duplication
- Consistent tooling
- Easier cross-project refactoring

Negative:

- Larger repository
- Developers must understand workspace concepts
- CI pipelines require careful workspace configuration

These trade-offs are acceptable given SHIAS's architecture.

---

# Workspace Layout

```
apps/
├── api/
├── patient-portal/
├── provider-portal/
├── provider-source-demo/
└── provider-request-demo/

packages/
├── sdk-node/
├── shared-types/
├── shared-utils/
├── config/
├── eslint-config/
└── tsconfig/

docs/

prisma/
```

---

# Dependency Rules

Applications may depend on:

- Shared packages
- External packages

Shared packages may depend on:

- Other shared packages
- External packages

Shared packages must never depend on applications.

Dependency direction:

```
Applications

↓

Shared Packages

↓

External Libraries
```

---

# Versioning

The repository maintains:

- One Git history
- One workspace lockfile
- Shared dependency versions

Applications continue to use independent semantic versions for releases.

---

# CI/CD

The CI pipeline should:

- Install workspace dependencies once
- Cache the pnpm store
- Build affected projects
- Run affected tests
- Publish build artifacts independently

Workspace-aware builds improve pipeline efficiency.

---

# Compliance

All new applications must:

- Be added under `apps/`
- Use workspace dependencies
- Extend shared configurations
- Follow repository conventions

Shared code belongs in `packages/`.

---

# Future Review

This decision should be revisited if:

- Independent teams require completely isolated release cycles
- Repository size significantly impacts developer productivity
- Workspace tooling no longer meets project requirements

---

# References

- docs/implementation/repository-structure.md
- docs/implementation/backend-architecture.md
- docs/implementation/frontend-architecture.md
- README.md