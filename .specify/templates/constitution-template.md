# [PROJECT_NAME] Constitution
<!-- Example: Spec Constitution, TaskFlow Constitution, etc. -->

## Core Principles

### [PRINCIPLE_1_NAME]
<!-- Example: I. Production Data Accuracy -->
[PRINCIPLE_1_DESCRIPTION]
<!-- Example: KPI calculations (OEE, efficiency, defect rate) and OP status transitions MUST match the documented formulas/state machine exactly; discrepancies between dashboard and backend data are treated as bugs, not edge cases -->

### [PRINCIPLE_2_NAME]
<!-- Example: II. Role-Based Access Control -->
[PRINCIPLE_2_DESCRIPTION]
<!-- Example: Every screen and action MUST enforce the correct role (ADMIN, GERENTE, OPERADOR, PLANEJAMENTO); UI MUST hide/disable actions a role cannot perform, not just block them server-side -->

### [PRINCIPLE_3_NAME]
<!-- Example: III. Static-Export Compatibility (NON-NEGOTIABLE) -->
[PRINCIPLE_3_DESCRIPTION]
<!-- Example: All pages MUST remain compatible with static export for AWS S3 hosting; no SSR, server actions, or dynamic server-side routes are permitted -->

### [PRINCIPLE_4_NAME]
<!-- Example: IV. Type Safety -->
[PRINCIPLE_4_DESCRIPTION]
<!-- Example: All API responses and form inputs MUST be typed with TypeScript and validated with Zod before use; no `any` on data crossing the service layer -->

### [PRINCIPLE_5_NAME]
<!-- Example: V. Shop-Floor Usability -->
[PRINCIPLE_5_DESCRIPTION]
<!-- Example: Operator-facing flows (e.g., apontamentos) MUST be completable in a few taps/clicks on shared shop-floor devices; error messages MUST be clear and actionable -->

## [SECTION_2_NAME]
<!-- Example: Additional Constraints, Security Requirements, Performance Standards, etc. -->

[SECTION_2_CONTENT]
<!-- Example: Technology stack requirements, compliance standards, deployment policies, etc. -->

## [SECTION_3_NAME]
<!-- Example: Development Workflow, Review Process, Quality Gates, etc. -->

[SECTION_3_CONTENT]
<!-- Example: Code review requirements, testing gates, deployment approval process, etc. -->

## Governance
<!-- Example: Constitution supersedes all other practices; Amendments require documentation, approval, migration plan -->

[GOVERNANCE_RULES]
<!-- Example: All PRs/reviews must verify compliance; Complexity must be justified; Use [GUIDANCE_FILE] for runtime development guidance -->

**Version**: [CONSTITUTION_VERSION] | **Ratified**: [RATIFICATION_DATE] | **Last Amended**: [LAST_AMENDED_DATE]
<!-- Example: Version: 2.1.1 | Ratified: 2025-06-13 | Last Amended: 2025-07-16 -->
