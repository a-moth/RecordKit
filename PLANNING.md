# RecordKit — Shared Project Planning

## Mandatory reading

Read this file completely before planning, reviewing, diagnosing, or implementing work in this repository. It establishes RecordKit's direction, scope, current state, and documentation routes.

For implementation work by an AI assistant, also read [IMPLEMENTATION_ASSISTANTS.md](IMPLEMENTATION_ASSISTANTS.md) and use the Mentor Protocol or Implementer Protocol selected by the user. Follow [CONTRIBUTING.md](CONTRIBUTING.md) and the relevant technical and testing documentation for the affected area.

## What RecordKit is

RecordKit is a local-first, template-driven data journal. A user defines templates made from arbitrary typed fields—text, number, date, time, duration, selection, scale, boolean, image-boolean, and nested sections—and fills out entries against those templates over time.

The schema is authored by the user rather than fixed by RecordKit. That makes the same application useful for:

- health, disability, symptom, and activity tracking;
- personal or local history logs;
- domain-specific data collection;
- document-style personal libraries and citation records;
- any other structured personal record-keeping use case.

## Who it is for

The current primary audience is high-tech disabled users who want to track symptoms, activities, and other data points without maintaining manual spreadsheets. The secondary audience is anyone who wants configurable, structured personal records.

Design implications include:

- favour clarity and low cognitive load over density or cleverness;
- make entry creation and editing fast and forgiving;
- consider screen readers, contrast, touch-target size, and reduced motion as features are built;
- do not assume an implementation belongs in an earlier version than the roadmap assigns it.

## Project philosophy

Use this question to test whether proposed work belongs in RecordKit:

> Would someone who cares about how their data is managed, and/or wants a way to programmatically manage their data on their own device, find this useful?

RecordKit is governed by these principles:

- Local-first: the application has no RecordKit-controlled server and core data remains on the user's device.
- User control: third-party integrations are configured and initiated explicitly by the user.
- Privacy: sensitive records must not be transmitted by default and kept local.
- Data ownership: import and export are explicit, and exported data should remain usable by software other than RecordKit.
- No automatic device sync: syncing is not an implicit part of the local-first model.
- No in-app monetisation: third-party API costs are between the user and that provider.
- Open source and free: core use requires no hosted RecordKit service.

Detailed architectural consequences are documented in [docs/architecture/](docs/architecture/README.md).

## Current project state

- Current released version: **1.0**, released 2026-08-24.
- Current development target: **1.1**, comprehensive white-box coverage for the existing product.
- From 1.1 onward, every implementation change must include appropriate white-box tests in the same work.
- Core template and entry CRUD, field types, nested sections, ordering, validation, and baseline settings are complete.

## Roadmap index

Future-version entries describe direction; they are not permission to implement that work early.

- **[1.1 — Test coverage](PLANNING-1.1.md):** comprehensive white-box tests for the current product.
- **[1.2 — Storage migration](PLANNING-1.2.md):** replace the single `appData` blob with per-record storage or an evaluated embedded database; reserve an `@images/` namespace.
- **[1.3 — User-uploaded images](PLANNING-1.3.md):** add durable, size-sensitive image storage on the 1.2 foundation.
- **[1.4 — Welcome experience](PLANNING-1.4.md):** implement the first-run experience.
- **[1.5 — Decoration objects](PLANNING-1.5.md):** add non-data template nodes used for presentation and organisation.
- **[1.6 — Custom theming](PLANNING-1.6.md):** add user-facing theme customisation.
- **[2.0 — Analytics](PLANNING-2.0.md):** analyse collected entries and migrate to a PWA before this release; confirm React + Vite against the earlier XSLT/XHTML alternative during migration planning.
- **[3.0 — Local API](PLANNING-3.0.md):** allow users to access their own data programmatically over a local-host-only API.

Detailed version plans live in `PLANNING-X.Y.md` files. Completed plans move to [past-planning/](past-planning/README.md). Do not pull PWA migration work, analytics, storage migration, image expansion, or theming into an earlier target unless an approved plan explicitly changes the roadmap.

## Documentation routes

- [README.md](README.md): project introduction and public orientation.
- [CONTRIBUTING.md](CONTRIBUTING.md): contributor workflow and shared contribution rules.
- [IMPLEMENTATION_ASSISTANTS.md](IMPLEMENTATION_ASSISTANTS.md): AI-specific collaboration behaviour.
- [docs/architecture/](docs/architecture/README.md): architecture, invariants, conventions, and decisions.
- [docs/testing/](docs/testing/README.md): testing strategy and subsystem guidance.
- [docs/api-reference/](docs/api-reference/README.md): precise programmatic reference.
- [user-docs/](user-docs/README.md): user-facing documentation and future GitHub Pages source.
- `PLANNING-X.Y.md`: detailed future-version plans.

## Scope and collaboration rules

- Verify load-bearing architectural facts against current code before drawing diagrams, diagnosing bugs, or planning changes.
- Base proposals on the roadmap and identify scope creep explicitly.
- The class-based model and field registry migrations are complete; do not diagnose current bugs as incomplete legacy migrations without evidence.
- If a field silently fails to render, inspect the registry first. If tree mutation fails, check whether all callers use the owning class method.
- General conventions belong in architecture documentation, not here.
- AI-specific working protocols belong only in `IMPLEMENTATION_ASSISTANTS.md`.
