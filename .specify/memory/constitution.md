<!--
Sync Impact Report
- Version change: [TEMPLATE] → 1.0.0 (initial ratification)
- Modified principles: n/a (first concrete version)
- Added sections: Core Principles (I-V), Technology Stack & Architecture Constraints,
  Development Workflow & Quality Gates, Governance
- Removed sections: none
- Templates requiring updates:
  - ✅ .specify/templates/plan-template.md (Constitution Check section reads this file at runtime)
  - ✅ .specify/templates/spec-template.md (no direct reference, but aligned by convention)
  - ✅ .specify/templates/tasks-template.md (no direct reference, but aligned by convention)
  - ✅ .devin/workflows/speckit.*.md (already contextualized with the same MES domain facts)
- Follow-up TODOs: none — all placeholders resolved from README.MD, DOCUMENTACAO_PROJETO.md,
  and decisions made during the initial Spec Kit + test harness setup session.
-->

# MES Frontend Constitution

## Core Principles

### I. Production Data Accuracy
Production Order (OP) status transitions, apontamento business rules, and dashboard KPI
formulas (OEE = Availability × Performance × Quality, overall efficiency, defect rate,
OP progress) MUST match the documented state machine and formulas in
`DOCUMENTACAO_PROJETO.md` exactly. Any discrepancy between what the UI computes/displays
and the documented business rules is a bug, not an edge case, and MUST be fixed at the
root cause rather than patched with a UI-only workaround.

### II. Role-Based Access Control
Every screen and action MUST enforce the correct role (`ADMIN`, `GERENTE`, `OPERADOR`,
`PLANEJAMENTO`) as defined by the OP state machine and business rules. The UI MUST
hide or disable actions a role cannot perform — it MUST NOT rely solely on the backend
to silently reject the request. Role values coming from external input (API responses,
auth tokens) MUST be validated against the known `UserRole` set before use; unknown or
malformed role values MUST degrade to "no permissions" rather than being cast/assumed
into a valid role.

### III. Static-Export Compatibility (NON-NEGOTIABLE)
All pages and features MUST remain compatible with static export (`next export`) for
AWS S3 + CloudFront hosting. No server-side rendering, server actions, or dynamic
server-side API routes are permitted. All data fetching MUST happen client-side via the
`src/services/` layer.

### IV. Type Safety (NON-NEGOTIABLE)
All data crossing a boundary (API responses, form inputs, values read from external
state) MUST be typed with TypeScript and, where it represents user input, validated
with Zod. Casting to `any` to silence a type error is prohibited; when a value's type
cannot be guaranteed at compile time (e.g., a string from an API that should be one of
a known set of values), a runtime type guard MUST be used to narrow it safely instead.

### V. Test-First Reliability (NON-NEGOTIABLE)
New business logic and bug fixes MUST follow Red-Green-Refactor: a failing test is
written first (or a reproduction test for bug fixes), then the minimal implementation
to make it pass, then refactor with tests green. The project's test command
(`npm test`) and typecheck (`npx tsc --noEmit`) MUST pass before a task or feature is
considered done. Business-critical pure logic (state machines, validations, KPI
calculations) MUST have unit test coverage before being wired into UI components.

## Technology Stack & Architecture Constraints

- **Framework**: Next.js 15 (App Router), React 19, TypeScript 5.8.
- **UI**: Refine 5 + Material-UI 6, following the existing light/dark theming.
- **Forms & Validation**: React Hook Form + Zod resolvers.
- **Data**: Axios calls to a separate Node.js/Express REST API through `src/services/`;
  no local database or ORM in this repository.
- **Charts**: Recharts for dashboard visualizations.
- **Auth**: NextAuth.js / custom client auth (`src/lib/auth-client.ts`), session data
  persisted client-side.
- **Project structure**: Follow the existing layout — `src/app/` (pages), `src/components/`,
  `src/services/`, `src/providers/`, `src/utils/`, `src/validations/`, `src/types/`,
  `src/interfaces/`. New top-level folders require explicit justification in a plan.
- **Testing**: Jest + `next/jest` + React Testing Library (`jest.config.js`,
  `jest.setup.ts`). Tests live alongside source as `*.test.ts`/`*.test.tsx`.

## Development Workflow & Quality Gates

- Features follow the Spec Kit gated flow: `/speckit.specify` → `/speckit.plan` →
  `/speckit.tasks` → `/speckit.implement`, each phase reviewed before advancing to the
  next.
- `/speckit.plan`'s Constitution Check MUST be evaluated against this document; any
  violation MUST be justified in the plan's Complexity Tracking section or the plan
  MUST be revised.
- Every implementation task MUST satisfy Principle V (Test-First Reliability) before
  being marked complete.
- Before merging, code MUST pass: `npm test`, `npx tsc --noEmit`, and `npm run lint`,
  with no new warnings introduced beyond documented pre-existing ones.
- Code review MUST check for the specific violation patterns already found in this
  codebase: `as any` casts on external data, dead/unreachable validation branches, and
  logic that silently swallows errors instead of surfacing them.

## Governance

This constitution supersedes ad-hoc conventions for anything it explicitly covers.
Amendments are made via `/speckit.constitution`, which MUST update the Sync Impact
Report at the top of this file and bump `CONSTITUTION_VERSION` following semantic
versioning: MAJOR for incompatible principle removals/redefinitions, MINOR for new
principles or materially expanded guidance, PATCH for clarifications and wording. Every
PR/change MUST be checked against the Core Principles above during code review;
unresolved violations block merging unless explicitly justified and recorded.

**Version**: 1.0.0 | **Ratified**: 2026-08-12 | **Last Amended**: 2026-08-12
