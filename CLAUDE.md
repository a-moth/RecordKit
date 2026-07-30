# RecordKit

> Repo folder and `package.json` still say `critterkeeper` — that's a legacy codename left over from before the project's purpose solidified. The product is **RecordKit**. Renaming the package/folder is a pending housekeeping task, not yet done.

## What this is

RecordKit is a local-first, template-driven data journal. A user defines their own **templates** (arbitrary sets of typed fields — text, number, date, time, duration, selection, scale, boolean, image-boolean, and nested sections) and then fills out **entries** against those templates over time. It is not a fixed-schema symptom tracker or habit app — the schema itself is user-authored per template, which is what lets it flex to cover:

- Health/disability symptom and activity tracking (the original driving use case)
- Personal or local history logs
- Domain-specific data collection (security, infrastructure, geopolitical tracking, etc.)
- A document-style personal library/citation tool (Zotero-like, but entry-based/human-readable rather than database-row-based)

## Who it's for

Designed with **high-to-middle-tech disabled users** as the primary persona: people comfortable with technology who want to track their own symptoms, activities, and other data points to observe progression of a disability (or any personal metric) more automatically than manual spreadsheets allow. Secondary audience: anyone (disabled or not) who wants structured, semi-automated personal record-keeping.

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

- **V1 (current target)** — Not yet reached. Scope: all core data manipulation (create/edit/delete entries and templates, field types, sections, ordering), templating system, and the baseline settings needed to make the above usable. This is the bar for "the app does its one job."
- **V2** — Analytics over collected entries, theming, and general settings/QoL expansion (more granular settings, better organization of settings, etc.).
- **V3** — A local-host-only API so the user can pull their own data out of the app programmatically (still local-first — this is not a hosted service).

When evaluating whether a proposed feature belongs now, check it against this list — pulling V2/V3 scope forward (especially analytics or theming) is a common way to lose focus before V1 is solid.

## Tech stack & structure

- **Framework**: Expo / React Native (`expo-router` for navigation, file-based routing under `app/`), currently targeting mobile-shaped RN components.
- **Planned migration**: Once V1's functionality is solid, the intent is to restructure this into a **React + Vite PWA** (the README also mentions XSLT/XHTML — treat that as an earlier, likely superseded idea; Vite+React PWA is the current stated direction). This is **not happening yet** — don't propose PWA-specific tooling/APIs as part of current work unless asked.
- **Storage**: `@react-native-async-storage/async-storage`, wrapped by [utils/StorageUtil.ts](utils/StorageUtil.ts) (`getData`/`saveData`/entry & template CRUD helpers). Everything currently lives under one `appData` blob (`{ templates: {...}, entries: {...} }`).
- **Routing** ([app/](app)): `_layout.tsx` wraps the app in `SettingsProvider` → `ThemeProvider` → `Stack`. Tabs live under `app/(tabs)/` (`index.tsx` = entries home, `templates.tsx` = template list, `settings.tsx`). `app/templates/edit.tsx` and the entry-writing flow build on `TemplateWriter`/`EntryWriter`.
- **Settings**: [utils/SettingsProvider.tsx](utils/SettingsProvider.tsx) is a context provider persisting key/value settings individually to `AsyncStorage` under `@`-prefixed keys, seeded from a hardcoded default map. [constants/setting-enums.ts](constants/setting-enums.ts) maps setting keys to their input type (`text`/`time`/`number`/`locked`), consumed by [components/managers/SettingManager.tsx](components/managers/SettingManager.tsx) to pick the right input component.
- **`old code/`**: a pre-React-Native vanilla JS/HTML/Node prototype of the same idea (journal.html, server.js). Historical reference only — not part of the active app, don't treat it as source of truth for current behavior.

## The data model (and the in-progress refactor)

The project is **mid-migration from plain object literals to class-based data types**. This is the single most important piece of context for any work here: two parallel type systems currently coexist in the codebase, and code you touch may be on either side of that line.

- **New (target) model** — [constants/DataTypes.tsx](constants/DataTypes.tsx):
  - `DataContainer<T>` is an abstract class wrapping `{ metadata, fields }`, with `EntryContainer`/`TemplateContainer` as concrete subclasses distinguished by `metadata.type`.
  - `DataContainer` owns the tree operations: `insertNodeAfter`, `removeNode`, `moveNodeUp`/`moveNodeDown`, `updateFieldByPath`, `onHandleChange`, ordering via `metadata.order` (an array of field IDs) and `initialiseOrder()`.
  - Each field value is a `FieldNode<T>` = `{ id, type: 'field', field: field_data<T> }`, where `field_data<T>` is an abstract class with `getData()`/`setData()`/`moveUp()`/`moveDown()`/`deleteNode()`. Concrete field classes: `TextField`, `NumberField`, `TimeField`, `DateField`, `DurationField`, `ScaleField`, `ToggleButtonField`, `ToggleImageButtonField`, `SectionField` (holds nested `childNodes`), `SelectionField`.
  - Rationale for the migration (per project owner): classes let each field type carry its own behavior/methods rather than every consumer having to know how to interpret a plain data shape — this is meant to make the data processing more accurate and the system easier to extend with new field types.

- **Old (legacy) model** — [constants/NodeTypes.ts](constants/NodeTypes.ts): plain object literals for `Template`, `Entry`, `Node`, `FieldNode`, plus a hardcoded `defaultTemplate`/`tempTemplate` built the old way. Still imported by some files.

- **Where the line currently falls** (as of this writing — re-verify against the actual imports before relying on this, it will keep moving): `TypedNode.tsx` and the leaf field input components under `components/nodes/inputs/` plus `TemplateEditorManager.tsx` have been converted to import from the new `DataTypes.tsx`. Other files (`EntryWriter.tsx`, `TemplateWriter.tsx`, `FieldNodeFactory.tsx`, `SettingManager.tsx`) still reference the old `NodeTypes.ts` shapes. `hooks/NodeRegistry.tsx` looks like a stub for a future registry pattern (mapping field-type strings to components/definitions) that isn't wired up yet.

- **Working assumption for any task**: don't assume a file is "done" just because it compiles or matches a pattern seen elsewhere — check which of the two type systems it currently imports from before extending it, and prefer moving code *forward* onto `DataTypes.tsx` rather than backward onto `NodeTypes.ts` when a file needs to change anyway. `NodeTypes.ts` should eventually be deleted once nothing references it.

## How to collaborate with me on this project

The project owner wants support in three recurring modes — flag which mode a request is in if it's not obvious, and default to the depth described:

1. **UML / architecture diagrams.** Base these on the actual current code (grep/read before drawing), not on the target-state description above — the two will diverge until the refactor completes. Prefer class diagrams for the `DataContainer`/`field_data` hierarchy, and sequence/flow diagrams for things like "user edits a field → onChange → save." Call out explicitly when a diagram reflects target/intended state vs. current-code state if they differ.

2. **High-level planning.** Ground proposals in the V1/V2/V3 roadmap above — a planning response should say which version's scope a piece of work belongs to, and flag scope creep into later versions. Also flag when a plan would require choosing between finishing the class refactor first vs. building new features on the old model (building on old model files generally means redoing that work later).

3. **Bug fixing.** Given the mid-refactor state, a lot of "bugs" you'll encounter are refactor seams — mismatched imports between `DataTypes.tsx` and `NodeTypes.ts`, or functions that moved from a `utils/*.ts` free function onto a class method (e.g. tree-mutation logic living on `DataContainer` now) without every call site being updated. When you hit one, say so explicitly rather than patching around it — the real fix is usually "finish moving this file onto the new model," not a local workaround.

## Open questions for the project owner

Answer these as they come up, or proactively fill them in — this file should get more precise over time, not just longer:

- **Field-type registry direction**: is `hooks/NodeRegistry.tsx` meant to become the single source of truth mapping field-type string → (class, input component, config schema), replacing the current `switch` statements in `TypedNode.tsx`/`SettingManager.tsx`/`TemplateEditorManager.tsx`? Worth deciding before more field types get added, since every new type currently means touching several switch statements by hand.
- **Storage shape**: is the single `appData` blob (`{templates, entries}`) intended to scale to V1's full feature set, or is a move to per-entry/per-template storage keys (or a real embedded DB) planned before V1 ships?
- **Validation**: `DataContainer.validateNode()` is a stub returning `false` and `validateTree()` assumes `nodes` is an array where the type says `Record<string, ...>` — is field/tree validation in scope for V1, or deferred?
- **Naming/rename**: is renaming the repo folder and `package.json` `name` field from `critterkeeper` to something RecordKit-branded in scope now, or held until later so it doesn't disrupt in-flight work?
- **Coding conventions**: any preferences beyond what's inferable from existing code (naming, file organization, when to prefer a class method vs. a free function, comment style) that should be captured here?
