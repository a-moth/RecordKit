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

## The data model

As of 2026-08-12: the class-based migration described in earlier versions of this file is **complete**. `constants/NodeTypes.ts` has been deleted and nothing in the codebase imports it — `EntryWriter.tsx`, `TemplateWriter.tsx`, `FieldNodeFactory.tsx`, `SettingManager.tsx`, `TypedNode.tsx`, the leaf field inputs, everything is on the class-based model below. There is no longer a legacy/target split to check before touching a file.

- **Model** — [constants/DataTypes.tsx](constants/DataTypes.tsx):
  - `DataContainer<T>` is an abstract class wrapping `{ metadata, fields }`, with `EntryContainer`/`TemplateContainer` as concrete subclasses distinguished by `metadata.type`.
  - `DataContainer` owns the tree operations: `insertNodeAfter`, `removeNode`, `moveNodeUp`/`moveNodeDown`, `updateFieldByPath`, `onHandleChange`, ordering via `metadata.order` (an array of field IDs) and `initialiseOrder()`.
  - Each field value is a `FieldNode<T>` = `{ id, type: 'field', field: field_data<T> }`, where `field_data<T>` is an abstract class with `getData()`/`setData()`/`moveUp()`/`moveDown()`/`deleteNode()`. Concrete field classes: `TextField`, `NumberField`, `TimeField`, `DateField`, `DurationField`, `ScaleField`, `ToggleButtonField`, `ToggleImageButtonField`, `SectionField` (holds nested `childNodes`), `SelectionField`.
  - Rationale for the migration (per project owner): classes let each field type carry its own behavior/methods rather than every consumer having to know how to interpret a plain data shape — this is meant to make the data processing more accurate and the system easier to extend with new field types.

- **Field-type registry**: [hooks/NodeRegistry.tsx](hooks/NodeRegistry.tsx) is a live, wired-up registry, not a stub. `fieldDefinitions: Record<string, () => field_data<FieldData>>` maps every field-type string to a factory producing a fresh default instance, and `TemplateEditorManager.tsx`'s "Add Field" flow calls `fieldDefinitions[type]?.()`. The file also holds `defaultTemplate` and the `selectionField` used by the type picker. This settles the data/factory side of the "field-type registry direction" open question below — but `TypedNode.tsx`'s render `switch` (field-type string → input *component*) is a separate, still-manual dispatch that hasn't been folded into this registry.

- **Known gap**: `TypedNode.tsx`'s render switch has no `case "number"` or `case "time"` (falls to `default: return null`), even though `NumberField`/`TimeField` are fully supported in `DataTypes.tsx`/`NodeRegistry.tsx` and "Number"/"Time" are offered in the Add Field picker. `NumberInputField.tsx`/`TimeInputField.tsx` already exist as components but aren't wired into `TypedNode.tsx`. Adding one of these fields to a template currently renders nothing, in both the template editor and entry writer — a two-case fix, not a design problem.

## How to collaborate with me on this project

The project owner wants support in three recurring modes — flag which mode a request is in if it's not obvious, and default to the depth described:

1. **UML / architecture diagrams.** Base these on the actual current code (grep/read before drawing), not on assumptions carried over from earlier conversations — this file gets updated as things change, but re-verify against imports for anything load-bearing. Prefer class diagrams for the `DataContainer`/`field_data` hierarchy, and sequence/flow diagrams for things like "user edits a field → onChange → save."

2. **High-level planning.** Ground proposals in the V1/V2/V3 roadmap above — a planning response should say which version's scope a piece of work belongs to, and flag scope creep into later versions (pulling the React/Vite PWA migration or V2 analytics/theming forward are the recurring failure modes to watch for).

3. **Bug fixing.** The class-based data model migration is done, so refactor-seam bugs (mismatched `DataTypes.tsx`/`NodeTypes.ts` imports) are no longer the default suspect. The known live gap is `TypedNode.tsx` missing render cases for `number`/`time` fields (see above) — if you hit a field type that silently renders nothing, check there first. More generally: a function that moved from a `utils/*.ts` free function onto a class method (e.g. tree-mutation logic living on `DataContainer`) without every call site updated is still a plausible cause — say so explicitly rather than patching around it.

## Open questions for the project owner

Answer these as they come up, or proactively fill them in — this file should get more precise over time, not just longer:

- **Field-type registry direction — partially answered**: `hooks/NodeRegistry.tsx`'s `fieldDefinitions` already is the source of truth for field-type string → factory on the data side, wired into `TemplateEditorManager.tsx`. Still open: should `TypedNode.tsx`'s component-dispatch `switch` (and `SettingManager.tsx`'s) be folded into the same registry (e.g. `fieldDefinitions[type]` carrying an input component alongside the factory), so a new field type is one registry entry instead of touching multiple switch statements by hand? Worth deciding before the next new field type is added — and would also be the natural place to fix the `number`/`time` `TypedNode.tsx` gap noted above.
- **Storage shape**: is the single `appData` blob (`{templates, entries}`) intended to scale to V1's full feature set, or is a move to per-entry/per-template storage keys (or a real embedded DB) planned before V1 ships?
- **Validation**: `DataContainer.validateNode()` is a stub returning `false` and `validateTree()` assumes `nodes` is an array where the type says `Record<string, ...>` — is field/tree validation in scope for V1, or deferred? (Currently dead code — not called from anywhere.)
- **Naming/rename**: is renaming the repo folder and `package.json` `name` field from `critterkeeper` to something RecordKit-branded in scope now, or held until later so it doesn't disrupt in-flight work?
- **Coding conventions**: any preferences beyond what's inferable from existing code (naming, file organization, when to prefer a class method vs. a free function, comment style) that should be captured here?
- **Welcome/first-run flow**: `app/welcome.tsx` is currently just TODO comments with no component/default export (Expo Router warns about it on boot). Is a first-run onboarding screen in scope for V1's "baseline settings needed to make the app usable," or deferred?
