# RecordKit — Shared Project Planning

## What this is

RecordKit is a local-first, template-driven data journal. A user defines their own **templates** (arbitrary sets of typed fields — text, number, date, time, duration, selection, scale, boolean, image-boolean, and nested sections) and then fills out **entries** against those templates over time. It is not a fixed-schema symptom tracker or habit app — the schema itself is user-authored per template, which is what lets it flex to cover:

- Health/disability symptom and activity tracking (the original driving use case)
- Personal or local history logs
- Domain-specific data collection (security, infrastructure, geopolitical tracking, etc.)
- A document-style personal library/citation tool (Zotero-like, but entry-based/human-readable rather than database-row-based)

## Who it's for

Designed for **high-tech disabled users** as the current primary persona: people comfortable with technology who want to track their own symptoms, activities, and other data points to observe progression of a disability (or any personal metric) more effectively than manual spreadsheets allow. Making RecordKit friendlier to middle-tech users is a later goal. Secondary audience: anyone (disabled or not) who wants structured personal record-keeping. Semi-automation is not currently committed scope, although V2 analytics will provide some automated synthesis of collected data.

Design implications of this audience:
- Prioritize clarity and low cognitive load in UI flows over density or cleverness.
- Don't assume the user wants to fight with the tool to get data in — entry creation/editing should be fast and forgiving.
- Accessibility (screen readers, contrast, touch target size, reduced-motion) is not a V2 nice-to-have to defer indefinitely — keep it in mind as fields/components are built, even before it's formally scheduled.

## Privacy & business model (this shapes architecture decisions)

- **Local-first, no server side.** The app itself never phones home. All data lives on-device (currently `AsyncStorage`).
- The **only** network calls that will ever exist are to third-party APIs that a user *explicitly* wires into their own template's fields (e.g., pulling in Health Connect data, or some other API-backed input). The user opts into each one per template; nothing is on-by-default.
- **No monetization inside the app.** If a template's chosen API integration has a cost, that cost is between the user and that third-party API provider — RecordKit only calls the API and, at most, provides settings fields to store the user's own credentials for it. There is no payment processing, subscription, or paywall logic to build.
- Because this app is explicitly designed to hold **sensitive personal data** (health symptoms, disability progression, potentially very personal logs), treat any feature touching storage, export, or network calls with elevated caution. When in doubt, default to *not* transmitting or logging data.
- Open source, free, self-hosted (no hosting needed at all for core use — it's just a local app/PWA).

## Roadmap

- **V1.0 (released 2026-08-24)** — Core CRUD for entries and templates, field types, sections, ordering, the templating system, and the baseline settings needed to make the app usable are complete. It ships with bundled-only images for `image-boolean` fields. Date/time validation is centralized in `ValidationPreview.tsx`, nested field trees are validated recursively, and invalid templates/entries cannot be saved. Date/time settings use `date-fns` tokens, with time-setting input separated from entry-field input. The internal `Sizes` theme object now uses standardized camelCase and role-based labels throughout the active codebase. The final V1.0 manual acceptance pass over core CRUD, field flows, and the refactored list layouts was completed on 2026-08-24.
- **V1.1 (current target)** — Scope: establish comprehensive white-box test coverage for the existing product. From this version onward, every new implementation must include appropriate white-box tests as part of the same work rather than leaving testing for a later sweep.
- **V1.2** — Scope: storage-shape migration. Move off the single `appData` blob (`{templates, entries}`) to per-entry/per-template `AsyncStorage` keys, or evaluate a real embedded database before image storage adds further pressure to the current shape. Reserve a dedicated `@images/` namespace (a logical storage "folder") and give each stored image its own entry beneath it, so image payloads are not embedded directly in entry or template records.
- **V1.3** — Scope: user-uploaded images, built on the V1.2 storage foundation. Implements `FileInputField.tsx`/`StorageUtil.ts`'s image-handling TODOs (images under ~5MB inlined as data URIs, larger ones stored as file-system paths), picked via `@react-native-documents/picker`, extended to `image-boolean` and scale-field icons. Native and web pickers currently store every selected image as a data URI. Remaining work is the size-sensitive policy: keep images under ~5MB inline, copy larger images into durable app storage, store their paths, load them asynchronously, and surface failures to the user.
- **V1.4** — Scope: welcome/first-run experience. `app/welcome.tsx` is currently TODO-only and has no component/default export.
- **V1.5** — Scope: decoration objects: fields that accept no user data and hold content solely for visual decoration or organization within a template.
- **V1.6** — Scope: user-facing custom theming.
- **V2** — Scope: analytics over collected entries. V1.x work should prepare the data model, storage, validation, and testing foundations needed for analytics without pulling the analytics feature itself forward.
- **V3** — A local-host-only API so the user can pull their own data out of the app programmatically (still local-first — this is not a hosted service).

When evaluating whether a proposed feature belongs now, check it against this list. Do not pull later V1.x, V2, or V3 work into the current target. The completed V1.0 `Sizes` refactor was internal cleanup and remains distinct from V1.6 user-facing custom theming.

As the number of field types grows, the add-field picker will need to organize available fields into small tabs or similarly low-cognitive-load groups instead of presenting one long list. This is future UI organization work; assign it to a version when the field list makes the current picker unwieldy.

## Tech stack & structure

- **Framework**: Expo / React Native (`expo-router` for navigation, file-based routing under `app/`), currently targeting mobile-shaped RN components.
- **Planned migration**: The intent is to migrate from Expo / React Native to a **React + Vite PWA before V2**. Do not introduce Vite/PWA-specific implementation into earlier work unless the task is explicitly part of that migration.
- **Storage**: `@react-native-async-storage/async-storage`, wrapped by [utils/StorageUtil.ts](utils/StorageUtil.ts) (`getData`/`saveData`/entry and template CRUD helpers). Everything currently lives under one `appData` blob (`{ templates: {...}, entries: {...} }`). This is intentional through V1.1; the move to per-entry/per-template keys or an embedded database is scheduled for **V1.2**, before V1.3 expands user-uploaded image storage. The migrated shape must reserve `@images/` as the logical namespace for individually stored images.
- **Pre-V1 persistence policy**: pre-V1 data is disposable because only development builds have used the app and local data is cleared between runs. V1.0 work does not need migrations for legacy development-only values or settings (including earlier date/time format tokens). Begin preserving and migrating shipped data from V1.0 onward; the planned storage-shape migration remains V1.2 scope.
- **Routing** ([app/](app)): `_layout.tsx` wraps the app in `SettingsProvider` → `ThemeProvider` → `Stack`. Tabs live under `app/(tabs)/` (`index.tsx` = entries home, `templates.tsx` = template list, `settings.tsx`). `app/templates/edit.tsx` and the entry-writing flow build on `TemplateWriter`/`EntryWriter`.
- **Settings**: [utils/SettingsProvider.tsx](utils/SettingsProvider.tsx) is a context provider persisting key/value settings individually to `AsyncStorage` under `@`-prefixed keys, seeded from a hardcoded default map. [constants/setting-enums.ts](constants/setting-enums.ts) maps setting keys to their input type (`text`/`time`/`number`/`locked`), consumed by [components/managers/SettingManager.tsx](components/managers/SettingManager.tsx) to pick the right input component.
- **`old code/`**: a pre-React-Native vanilla JS/HTML/Node prototype of the same idea (journal.html, server.js). Historical reference only — not part of the active app, don't treat it as source of truth for current behavior.

## The data model

As of 2026-08-12: the class-based migration described in earlier versions of this file is **complete**. `constants/NodeTypes.ts` has been deleted and nothing in the codebase imports it — `EntryWriter.tsx`, `TemplateWriter.tsx`, `SettingManager.tsx`, the leaf field inputs, everything is on the class-based model below. There is no longer a legacy/target split to check before touching a file.

As of 2026-08-15: the field-type registry consolidation described below (previously an open question) is also **complete**. `TypedNode.tsx`, `FieldNodeFactory.tsx`, and `SectionNodeFactory.tsx` have been deleted; a single [components/common/Component.tsx](components/common/Component.tsx) now renders both fields and sections by looking up `fieldDefinitions[type].component` from the registry (moved here from `components/nodes/operations/` since it's the generic tree renderer, not operations-specific — its sibling files `ValidationPreview.tsx`/`EditorControls.tsx`/`AddControls.tsx`/`RenameInput.tsx` are still in `components/nodes/operations/`). `SettingManager.tsx` follows the same pattern via a `settingDefinitions` map. A new field type is now one registry entry in `node-registry.tsx`, not several hand-edited switch statements.

- **Model** — [constants/DataTypes.tsx](constants/DataTypes.tsx):
  - `DataContainer<T>` is an abstract class wrapping `{ metadata, fields }`, with `EntryContainer`/`TemplateContainer` as concrete subclasses distinguished by `metadata.type`.
  - `DataContainer` owns the tree operations: `insertNodeAfter`, `removeNode`, `moveNodeUp`/`moveNodeDown`, `updateFieldByPath`, `onHandleChange`, ordering via `metadata.order` (an array of field IDs) and `initialiseOrder()`.
  - Each field value is a `FieldNode<T>` = `{ id, type: 'field', field: field_data<T> }`, where `field_data<T>` is an abstract class with `getData()`/`setData()`/`moveUp()`/`moveDown()`/`deleteNode()`. Concrete field classes: `TextField`, `NumberField`, `TimeField`, `DateField`, `DurationField`, `ScaleField`, `ToggleButtonField`, `ToggleImageButtonField`, `SectionField` (holds nested `childNodes`), `SelectionField`.
  - Rationale for the migration (per project owner): classes let each field type carry its own behavior/methods rather than every consumer having to know how to interpret a plain data shape — this is meant to make the data processing more accurate and the system easier to extend with new field types.

- **Field-type registry**: [hooks/node-registry.tsx](hooks/node-registry.tsx) is the single source of truth for field-type string → behavior. `fieldDefinitions: Record<string, { create: () => field_data<FieldData>, component: React.ComponentType<any> }>` maps every field-type string to both its default-instance factory and its render component. `TemplateEditorManager.tsx`'s "Add Field" flow calls `fieldDefinitions[type].create()`; `Component.tsx` calls `fieldDefinitions[type].component` to render it. The file also holds `defaultTemplate`, the `selectionField` used by the type picker, and `settingDefinitions` (the equivalent registry for `SettingManager.tsx`).

- **Field-level validation**: [components/nodes/operations/ValidationPreview.tsx](components/nodes/operations/ValidationPreview.tsx) is the single live validation path. Its hook-free `validateFieldData(data, settings)` switch owns per-field validation, including exception-safe `date-fns` parsing for date/time strings. `ValidationPreview` renders its result inline for template and entry fields; `hasValidationErrors()` recursively checks top-level and nested section fields and is used by `EntryWriter.tsx` and `TemplateWriter.tsx` to disable and guard saving when any field is invalid. Date/time input components manage raw strings only and do not reject partial or invalid typing. `DataContainer.validateNode()`/`validateTree()` (the earlier stub) has been removed from `DataTypes.tsx` — there is no dead second validation path.

## Coding conventions

- **File naming**: kebab-case for files that are registries/definitions (e.g. `setting-enums.ts`) or plain data-value assignment (constants, config); PascalCase for files whose default export is a React component or that manage state (providers, hooks returning component-facing state, UI-facing classes).
- **Class method vs. free function**: if a function reads or mutates a `DataContainer`'s or `field_data`'s own internal state, it belongs on the class as a method. If it operates on a template in general terms, or falls outside the container/field entirely (id generation, type guards, storage I/O), it's a free function in `utils/`.
- **Comment style**: TODOs are always `// TODO: description` — single line, space after `//`, colon before the description. No block-comment TODO stacks, no `//TODO:` without the space. Existing TODOs that don't match this are known debt, not yet swept — don't copy their format for new ones.
- **Folder structure**: the current type-based split (`components/nodes/inputs`, `components/nodes/operations`, `components/managers`, `components/wrappers`, `hooks/`, `utils/`, `constants/`) is fine as-is for V1-era work. Don't reorganize into feature-based folders now — that's a call to revisit (if at all) at the planned React + Vite PWA migration, not before, so it isn't restructured twice.

## How to collaborate with me on this project

The project owner wants support in four recurring modes — flag which mode a request is in if it's not obvious, and default to the depth described:

1. **UML / architecture diagrams.** Base these on the actual current code (grep/read before drawing), not on assumptions carried over from earlier conversations — this file gets updated as things change, but re-verify against imports for anything load-bearing. Prefer class diagrams for the `DataContainer`/`field_data` hierarchy, and sequence/flow diagrams for things like "user edits a field → onChange → save."

2. **High-level planning.** Ground proposals in the version roadmap above — a planning response should say which version's scope a piece of work belongs to, and flag scope creep into later versions (pulling the React/Vite PWA migration or V2 analytics/theming forward are the recurring failure modes to watch for).

3. **Bug fixing.** The class-based data model migration and the field-type registry consolidation are both done, so refactor-seam bugs (mismatched `DataTypes.tsx`/`NodeTypes.ts` imports, or a field type missing from `TypedNode.tsx`'s old switch) are no longer the default suspect — that file doesn't exist anymore. If a field type silently renders nothing, check `fieldDefinitions` in `node-registry.tsx` first for a missing/misconfigured entry. More generally: a function that moved from a `utils/*.ts` free function onto a class method (e.g. tree-mutation logic living on `DataContainer`) without every call site updated is still a plausible cause — say so explicitly rather than patching around it.

4. **Implementation work.** Unlike modes 1–3, this is where code actually gets written, so the project owner picks one of two guidance techniques per task and says which one up front:

   - **Mentor Protocol (moth writes the code).** The AI assistant acts as a senior developer training a junior developer — direct and specific about mistakes, not flattering. The AI assistant never writes implementation code, including "quick" fixes, unless moth has tried a step at least twice and is stuck — and even then offers only a minimal illustrative snippet, clearly marked as an exception, before handing control back. Before explaining any step, read the actual relevant files (the field registry, the relevant `field_data` class, the relevant input component) rather than describing an approach from generic React/TS knowledge — match RecordKit's existing patterns, don't reinvent them. Work one step at a time: state the step and the reasoning, then stop and wait rather than dumping the whole task plan at once. When moth reports a step done, read the actual diff before responding — don't take "done" at face value. Review feedback distinguishes must-fix (breaks correctness, contradicts an existing pattern, will bite them later) from optional (style/naming); ask rather than guess when intent is ambiguous. Close out each backlog item with one concrete manual check (not a full test suite).

   - **Implementer Protocol (AI assistant writes the code, moth reviews).** The AI assistant acts as the senior developer and implements directly, under the same discipline: read the closest existing equivalent (field registry entry, `field_data` subclass, input component) before writing anything new, and match that pattern rather than inventing a parallel one. Work still proceeds one step at a time, but the pause after each step is to hand moth the diff for review, not to hand them the keyboard — moth reviews it as the code-review step, as with any other PR. The AI assistant explains what it wrote and why it matches (or deliberately diverges from) the existing pattern, and doesn't advance to the next step until moth has looked at the change. Same must-fix vs. optional distinction and same one-manual-check close-out as the Mentor Protocol.

## Open questions for the project owner

None outstanding as of 2026-08-15 — the last round (field-type registry direction, storage shape, naming/rename, validation scope, coding conventions) is all resolved and folded into the sections above. Add new ones here as they come up; this file should get more precise over time, not just longer.
