# Frontend Architecture

Version: 1.0

Status: Active

Owner: SHIAS Team

Last Updated: YYYY-MM-DD

---

# Purpose

This document defines the frontend architecture for the Secure Health Identity & Access System (SHIAS).

It establishes the application structure, architectural principles, state management strategy, routing, authentication flow, and UI organization for all frontend applications.

The architecture aims to provide:

- Maintainability
- Scalability
- Accessibility
- Performance
- Consistency

---

# Technology Stack

| Component | Technology |
|------------|------------|
| Framework | Next.js 15 |
| Language | TypeScript (Strict Mode) |
| Styling | Tailwind CSS |
| UI Components | shadcn/ui |
| Icons | Lucide React |
| Forms | React Hook Form |
| Validation | Zod |
| State Management | TanStack Query + React Context |
| HTTP Client | Fetch API |
| Authentication | JWT + Refresh Token |
| Notifications | Sonner |
| Charts | Recharts |

---

# Frontend Applications

The SHIAS frontend consists of:

```
apps/

patient-portal

provider-portal

provider-source-demo

provider-request-demo
```

Each application is independently deployable.

---

# Design Principles

The frontend follows these principles:

- Component-driven development
- Feature-based organization
- Server-first rendering
- Minimal client-side state
- Accessibility by default
- Responsive design
- Progressive enhancement

---

# Rendering Strategy

Default:

```
Server Components
```

Use Client Components only when required.

Examples:

- Forms
- Interactive dashboards
- Modals
- Toast notifications

---

# Folder Structure

```
src/

app/

components/

features/

hooks/

lib/

services/

types/

styles/

middleware.ts
```

---

# App Router

The project uses the Next.js App Router.

Example

```
app/

login/

dashboard/

profile/

consents/

providers/

settings/
```

Layouts are shared where appropriate.

---

# Feature Organization

Each business feature is isolated.

Example

```
features/

patients/

providers/

consents/

audit/

authentication/
```

Each feature contains:

```
components/

hooks/

services/

types/

validators/
```

---

# Components

Component hierarchy:

```
UI Components

↓

Feature Components

↓

Page Components
```

---

## UI Components

Reusable building blocks.

Examples

```
Button

Input

Dialog

Card

Badge

Avatar

Table
```

UI components contain no business logic.

---

## Feature Components

Business-specific components.

Examples

```
ConsentCard

ProviderSearch

PatientProfile

AccessHistory

PointerTable
```

---

## Page Components

Responsible for page composition.

They assemble feature components.

---

# State Management

The frontend minimizes global state.

## React Context

Used for:

- Authentication
- Theme
- User preferences

---

## TanStack Query

Responsible for:

- API requests
- Caching
- Background refetching
- Mutations
- Pagination

Server state should never be duplicated.

---

# Forms

Forms use:

React Hook Form

+

Zod

Validation occurs:

- Client-side
- Server-side

Server validation remains authoritative.

---

# API Layer

All API communication passes through service classes.

Example

```
services/

patient-service.ts

provider-service.ts

consent-service.ts
```

Components never call `fetch()` directly.

---

# Authentication

Authentication uses:

- Access Token
- Refresh Token

Tokens are managed centrally.

Protected routes require authentication.

---

# Authorization

Role-aware UI.

Roles include:

- Patient
- Provider User
- Administrator

Unauthorized UI elements remain hidden.

The backend remains the source of truth.

---

# Error Handling

Errors follow RFC 7807.

User-friendly notifications should be displayed.

Unexpected errors should be logged.

---

# Loading States

Every asynchronous operation should include:

- Skeleton loaders
- Loading indicators
- Disabled actions

Avoid blank screens.

---

# Empty States

Every collection page should provide an informative empty state.

Example:

"No consents found."

Include relevant actions where possible.

---

# Routing

Protected routes:

```
/dashboard

/profile

/consents

/providers

/settings
```

Public routes:

```
/

/login

/register

/forgot-password
```

---

# Styling

Tailwind CSS is the standard.

Rules:

- Utility-first
- No inline styles
- Shared design tokens
- Responsive layouts

---

# Design System

Use shadcn/ui components whenever possible.

Custom components should extend the design system rather than replace it.

---

# Accessibility

Applications should conform to WCAG 2.2 AA where practical.

Requirements:

- Keyboard navigation
- Focus management
- Semantic HTML
- ARIA labels where needed
- Color contrast compliance

---

# Performance

Optimize for:

- Server rendering
- Code splitting
- Lazy loading
- Image optimization
- Route-level caching

Avoid unnecessary client-side JavaScript.

---

# Security

Frontend applications must:

- Never store secrets
- Sanitize user-generated content
- Use HTTPS
- Protect against XSS
- Respect Content Security Policy (CSP)
- Handle authentication securely

Authorization decisions remain on the backend.

---

# Internationalization

The MVP uses English.

Future versions may support:

- Multiple languages
- Locale-aware formatting
- RTL layouts

---

# Testing

Frontend testing includes:

- Unit tests
- Component tests
- End-to-end tests

Critical workflows should have E2E coverage.

---

# Business Rules

- Components remain focused and reusable.
- Business logic belongs in services or hooks.
- API access is centralized.
- UI reflects backend authorization.
- Accessibility is considered from the beginning.
- Server Components are preferred by default.

---

# Related Documents

- backend-architecture.md
- authentication-flow.md
- authorization-model.md
- validation-strategy.md
- deployment.md
- repository-structure.md