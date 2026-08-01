# ADR-0008: Use Next.js App Router for Frontend Applications

Status: Accepted

Date: YYYY-MM-DD

Decision Makers:

- SHIAS Team

---

# Context

SHIAS provides multiple frontend applications, including:

- Patient Portal
- Provider Portal
- Provider Source Demo
- Provider Request Demo

These applications require:

- Secure authentication
- Fast page loading
- Consistent routing
- Shared layouts
- Modern React features
- Strong TypeScript support
- Excellent developer experience
- Long-term maintainability

The frontend architecture must integrate seamlessly with the Fastify backend while remaining modular and scalable.

---

# Decision

SHIAS will use **Next.js App Router** as the frontend framework for all web applications.

The App Router provides:

- File-based routing
- React Server Components
- Nested layouts
- Server Actions (when appropriate)
- Streaming
- Built-in optimization

---

# Decision Drivers

- Performance
- Developer experience
- React Server Components
- Modern routing
- Layout composition
- TypeScript support
- Long-term maintainability
- Strong ecosystem

---

# Rationale

## App Router

The App Router provides a modern routing model built around the filesystem.

Benefits include:

- Predictable routing
- Simplified navigation
- Nested layouts
- Route groups
- Dynamic routes

This aligns well with SHIAS's feature-based architecture.

---

## React Server Components

Server Components reduce the amount of JavaScript sent to the browser.

Benefits include:

- Faster initial page loads
- Lower bundle sizes
- Improved performance
- Reduced client-side state

Client Components are used only where interactivity is required.

---

## Nested Layouts

Shared layouts prevent duplication.

Example:

```
Dashboard Layout

├── Sidebar
├── Header
├── Breadcrumbs
└── Page Content
```

Patient and Provider portals can share consistent navigation while maintaining separate application logic.

---

## Built-in Optimizations

Next.js provides:

- Code splitting
- Image optimization
- Route prefetching
- Streaming
- Incremental rendering features

These optimizations improve user experience without requiring additional tooling.

---

## TypeScript

Next.js integrates seamlessly with TypeScript.

Benefits include:

- Typed routes
- Typed components
- Strong IDE support
- Consistent developer experience

This supports SHIAS's strict TypeScript standards.

---

## Deployment Flexibility

Next.js applications can be deployed independently from the backend.

This enables:

- Independent release cycles
- Horizontal scaling
- Separate hosting strategies
- Easier operational management

---

# Alternatives Considered

## React + React Router

Rejected.

Pros:

- Lightweight
- Flexible
- Familiar

Cons:

- Manual routing configuration
- No built-in server rendering
- Requires additional tooling for many common features

Next.js provides a more complete solution.

---

## Remix

Considered.

Pros:

- Excellent data loading model
- Strong nested routing
- Good performance

Cons:

- Smaller ecosystem
- Less widespread adoption
- Fewer community resources

Next.js was selected due to its broader ecosystem and tooling.

---

## Vue + Nuxt

Rejected.

Pros:

- Strong developer experience
- Excellent framework

Cons:

- Project standardizes on React
- Shared TypeScript knowledge
- Existing component ecosystem favors React

---

## Angular

Rejected.

Pros:

- Comprehensive framework
- Dependency injection
- Enterprise tooling

Cons:

- Higher complexity
- Steeper learning curve
- Larger framework footprint

---

## SvelteKit

Considered.

Pros:

- Excellent performance
- Small bundle sizes

Cons:

- Smaller ecosystem
- Less mature tooling
- Fewer enterprise examples

---

# Consequences

Positive:

- Modern React architecture
- Consistent routing
- Better performance
- Shared layouts
- Excellent TypeScript support
- Strong ecosystem

Negative:

- Developers must understand Server vs Client Components
- App Router has a learning curve
- Some React patterns require adaptation

These trade-offs are acceptable.

---

# Implementation Guidelines

Frontend applications should:

- Default to Server Components
- Use Client Components only when necessary
- Keep business logic in services and hooks
- Organize code by feature
- Use shared UI components
- Centralize API communication

---

# Client Components

Use Client Components only for:

- Forms
- Interactive dashboards
- Dialogs
- Toast notifications
- Local UI state
- Browser APIs

Avoid unnecessary `"use client"` directives.

---

# Server Components

Prefer Server Components for:

- Static layouts
- Read-only views
- Initial data loading
- Navigation
- Page composition

This minimizes client-side JavaScript.

---

# Routing Conventions

Routes follow the App Router structure.

Example:

```
app/

login/

dashboard/

profile/

consents/

providers/

settings/
```

Dynamic routes should use descriptive segment names.

---

# State Management

Global client-side state should be minimized.

Use:

- React Context for authentication and theme
- TanStack Query for server state
- Local component state for UI interactions

---

# Security

Frontend applications must:

- Never expose secrets
- Authenticate through the backend
- Respect backend authorization
- Sanitize user-generated content
- Use HTTPS exclusively

Authorization decisions remain on the server.

---

# Compliance

All frontend applications must:

- Use App Router
- Follow feature-based organization
- Share common UI components
- Use centralized API services
- Prefer Server Components
- Minimize client-side state

---

# Future Review

This decision should be revisited if:

- React architecture changes significantly
- Next.js no longer aligns with project requirements
- Alternative frameworks provide compelling operational benefits

---

# References

- docs/implementation/frontend-architecture.md
- docs/implementation/repository-structure.md
- docs/implementation/authentication-flow.md
- docs/implementation/validation-strategy.md