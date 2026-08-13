# Feature Specification: [FEATURE NAME]

**Feature Branch**: `[###-feature-name]`

**Created**: [DATE]

**Status**: Draft

**Input**: User description: "$ARGUMENTS"

## User Scenarios & Testing *(mandatory)*

<!--
  IMPORTANT: User stories should be PRIORITIZED as user journeys ordered by importance.
  Each user story/journey must be INDEPENDENTLY TESTABLE - meaning if you implement just ONE of them,
  you should still have a viable MVP (Minimum Viable Product) that delivers value.

  Assign priorities (P1, P2, P3, etc.) to each story, where P1 is the most critical.
  Think of each story as a standalone slice of functionality that can be:
  - Developed independently
  - Tested independently
  - Deployed independently
  - Demonstrated to users independently
-->

### User Story 1 - [Brief Title] (Priority: P1)

[Describe this user journey in plain language. MES example: "As an Operador, I want to record an apontamento for the machine I'm running so that production quantities are tracked in real time."]

**Why this priority**: [Explain the value and why it has this priority level]

**Independent Test**: [Describe how this can be tested independently - e.g., "Can be fully tested by an Operador starting and finalizing an apontamento on an active OP and delivers accurate production/defect counts"]

**Acceptance Scenarios**:

1. **Given** [initial state, e.g., "an OP is EM_ANDAMENTO and a machine is available"], **When** [action, e.g., "the operator starts an apontamento"], **Then** [expected outcome, e.g., "the apontamento is created with status EM ANDAMENTO and linked to the logged-in operator"]
2. **Given** [initial state], **When** [action], **Then** [expected outcome]

---

### User Story 2 - [Brief Title] (Priority: P2)

[Describe this user journey in plain language]

**Why this priority**: [Explain the value and why it has this priority level]

**Independent Test**: [Describe how this can be tested independently]

**Acceptance Scenarios**:

1. **Given** [initial state], **When** [action], **Then** [expected outcome]

---

### User Story 3 - [Brief Title] (Priority: P3)

[Describe this user journey in plain language]

**Why this priority**: [Explain the value and why it has this priority level]

**Independent Test**: [Describe how this can be tested independently]

**Acceptance Scenarios**:

1. **Given** [initial state], **When** [action], **Then** [expected outcome]

---

[Add more user stories as needed, each with an assigned priority]

### Edge Cases

<!--
  ACTION REQUIRED: The content in this section represents placeholders.
  Fill them out with the right edge cases.
-->

- What happens when [boundary condition, e.g., "a machine already has an apontamento EM ANDAMENTO and a second one is started"]?
- How does system handle [error scenario, e.g., "defect quantity exceeds produced quantity, or the API/backend is unreachable"]?

## Requirements *(mandatory)*

<!--
  ACTION REQUIRED: The content in this section represents placeholders.
  Fill them out with the right functional requirements.
-->

### Functional Requirements

- **FR-001**: System MUST [specific capability, e.g., "allow an Operador to create an apontamento linked to an EM_ANDAMENTO order"]
- **FR-002**: System MUST [specific capability, e.g., "prevent defect quantity from exceeding produced quantity"]
- **FR-003**: Users MUST be able to [key interaction, e.g., "filter production orders by status and sector"]
- **FR-004**: System MUST [data requirement, e.g., "persist apontamento start/end timestamps"]
- **FR-005**: System MUST [behavior, e.g., "restrict OP status transitions to the roles permitted by the state machine"]

*Example of marking unclear requirements:*

- **FR-006**: System MUST authenticate users via [NEEDS CLARIFICATION: auth method not specified - email/password, SSO, OAuth?]
- **FR-007**: System MUST retain user data for [NEEDS CLARIFICATION: retention period not specified]

### Key Entities *(include if feature involves data)*

- **[Entity 1]**: [What it represents, key attributes without implementation — e.g., "Ordem de Produção (OP): a production order with status, planned/produced quantities, and deadline"]
- **[Entity 2]**: [What it represents, relationships to other entities — e.g., "Apontamento: a production report linked to one OP, one machine, and one operator"]

## Success Criteria *(mandatory)*

<!--
  ACTION REQUIRED: Define measurable success criteria.
  These must be technology-agnostic and measurable.
-->

### Measurable Outcomes

- **SC-001**: [Measurable metric, e.g., "Operators can register a new apontamento in under 30 seconds"]
- **SC-002**: [Measurable metric, e.g., "Dashboard KPIs reflect new apontamentos within 5 seconds of submission"]
- **SC-003**: [User satisfaction metric, e.g., "90% of operators successfully complete an apontamento on first attempt"]
- **SC-004**: [Business metric, e.g., "Reduce manually corrected OP statuses by 50%"]

## Assumptions

<!--
  ACTION REQUIRED: The content in this section represents placeholders.
  Fill them out with the right assumptions based on reasonable defaults
  chosen when the feature description did not specify certain details.
-->

- [Assumption about target users, e.g., "Users have stable internet connectivity"]
- [Assumption about scope boundaries, e.g., "Mobile support is out of scope for v1"]
- [Assumption about data/environment, e.g., "Existing authentication system will be reused"]
- [Dependency on existing system/service, e.g., "Requires access to the existing user profile API"]
