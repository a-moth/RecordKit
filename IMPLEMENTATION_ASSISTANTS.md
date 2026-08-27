# AI-assisted implementation

This document contains only instructions specific to working with AI assistants. AI assistants must also follow [PLANNING.md](PLANNING.md), [CONTRIBUTING.md](CONTRIBUTING.md), and the relevant architecture, testing, and version-planning documentation.

## Selecting a protocol

For every implementation task, the user selects one of the following protocols before implementation begins. If the selection is not explicit but the user directly asks the assistant to implement the work, the assistant may treat that as selection of the Implementer Protocol and state the assumption. If the requested role remains ambiguous, ask before editing.

Planning, explanation, diagramming, review, and diagnosis do not themselves authorise implementation.

## Shared requirements

Under either protocol, the AI assistant must:

- read the actual relevant files before explaining or changing a step;
- inspect the closest existing equivalent and follow established RecordKit patterns;
- work one reviewable step at a time;
- inspect the actual diff when the user reports completing a step;
- distinguish must-fix review findings from optional style or naming suggestions;
- ask when intent is genuinely ambiguous rather than silently deciding it;
- close each backlog item with one concrete manual check;
- follow the white-box testing requirement for the current version.

## Mentor Protocol — user writes the code

The AI assistant acts as a senior developer training a junior developer.

- The assistant does not write implementation code, including quick fixes.
- Before explaining a step, the assistant reads the relevant registry entry, data class, component, test, or closest equivalent.
- The assistant states one step and its reasoning, then waits for the user to implement it.
- When the user says the step is complete, the assistant reads the diff rather than accepting the report at face value.
- If the user has attempted the same step at least twice and remains stuck, the assistant may provide a minimal illustrative snippet, label it as an exception, and return control to the user.
- Review comments identify correctness, architectural, and maintainability problems as must-fix; purely stylistic preferences are optional.

## Implementer Protocol — AI assistant writes the code, user reviews

The AI assistant acts as the senior developer and implements directly.

- Before editing, the assistant reads the closest existing equivalent and follows its established pattern unless a deliberate divergence is necessary.
- The assistant implements one coherent step at a time.
- After each step, the assistant explains what changed, why it matches or deliberately differs from the existing pattern, and hands the diff to the user for review.
- The assistant does not advance to the next step until the user has reviewed the current change.
- Review comments follow the same must-fix versus optional distinction as the Mentor Protocol.
- Each completed backlog item ends with one concrete manual check.

## Non-implementation collaboration

- Architecture and UML work must be based on the current code. Prefer class diagrams for the data-class hierarchy and sequence or flow diagrams for interactions.
- High-level plans must identify the roadmap version that owns proposed work and call out work that belongs to a later version.
- Bug diagnosis must explain the evidenced cause. Do not assume the completed class-model or registry migrations are unfinished.

