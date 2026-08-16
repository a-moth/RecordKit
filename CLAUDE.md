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

- **V1.0 (current target)** — Not yet reached. Scope: all core data manipulation (create/edit/delete entries and templates, field types, sections, ordering), templating system, and the baseline settings needed to make the above usable. This is the bar for "the app does its one job." Ships with bundled-only images for `image-boolean` fields — user-uploaded images are V1.1, not a V1.0 blocker. Remaining before it ships: cleaning up `constants/theme.ts`'s Sizes (currently "old groups of CSS classes that are messy"), and finishing time-field validation's move fully into `ValidationPreview.tsx` (`TimeInputField.tsx` still does some validation itself instead of deferring to that layer).
- **V1.1** — Scope: user-uploaded images. Implements `FileInputField.tsx`/`StorageUtil.ts`'s image-handling TODOs (images under ~5MB inlined as data URIs, larger ones stored as file-system paths), picked via `@react-native-documents/picker`, extended to `image-boolean` field icons. The settings keys (`**image1`–`**image5`) and the `image-boolean` field type already exist in the data model — this finishes what V1.0 scaffolded, not new scope. In progress: `FileInputField.tsx` currently opens the picker but doesn't yet store the result.
- **V1.2** — Scope: storage-shape migration. Move off the single `appData` blob (`{templates, entries}`) to per-entry/per-template `AsyncStorage` keys, or evaluate a real embedded DB, once V1.0/V1.1 have put the current shape through real usage. This is scheduled deliberately, not something to only revisit reactively if it becomes a problem — see the Storage bullet under Tech stack & structure.
- **V1.3+** — Scope: Welcome/first-run screen implementation using react-native-documents/picker. `app/welcome.tsx` is currently just TODO comments with no component/default export (Expo Router will keep warning about it on boot until this is built) — that's expected until V1.3, not a V1.0 gap.
- **V2** — Analytics over collected entries, theming, and general settings/QoL expansion (more granular settings, better organization of settings, etc.).
- **V3** — A local-host-only API so the user can pull their own data out of the app programmatically (still local-first — this is not a hosted service).

When evaluating whether a proposed feature belongs now, check it against this list — pulling V1.1/V1.2/V1.3 work into the V1.0 baseline, or pulling V2/V3 scope forward (especially analytics or theming), are both common ways to lose focus before the current step is solid.

## Tech stack & structure

- **Framework**: Expo / React Native (`expo-router` for navigation, file-based routing under `app/`), currently targeting mobile-shaped RN components.
- **Planned migration**: Once V1's functionality is solid, the intent is to restructure this into a **React + Vite PWA** (the README also mentions XSLT/XHTML — treat that as an earlier, likely superseded idea; Vite+React PWA is the current stated direction). This is **not happening yet** — don't propose PWA-specific tooling/APIs as part of current work unless asked.
- **Storage**: `@react-native-async-storage/async-storage`, wrapped by [utils/StorageUtil.ts](utils/StorageUtil.ts) (`getData`/`saveData`/entry & template CRUD helpers). Everything currently lives under one `appData` blob (`{ templates: {...}, entries: {...} }`). This is intentional through V1.0/V1.1 — the move to per-entry/per-template keys (or a real embedded DB) is scheduled as **V1.2**, not something to design now.
- **Routing** ([app/](app)): `_layout.tsx` wraps the app in `SettingsProvider` → `ThemeProvider` → `Stack`. Tabs live under `app/(tabs)/` (`index.tsx` = entries home, `templates.tsx` = template list, `settings.tsx`). `app/templates/edit.tsx` and the entry-writing flow build on `TemplateWriter`/`EntryWriter`.
- **Settings**: [utils/SettingsProvider.tsx](utils/SettingsProvider.tsx) is a context provider persisting key/value settings individually to `AsyncStorage` under `@`-prefixed keys, seeded from a hardcoded default map. [constants/setting-enums.ts](constants/setting-enums.ts) maps setting keys to their input type (`text`/`time`/`number`/`locked`), consumed by [components/managers/SettingManager.tsx](components/managers/SettingManager.tsx) to pick the right input component.
- **`old code/`**: a pre-React-Native vanilla JS/HTML/Node prototype of the same idea (journal.html, server.js). Historical reference only — not part of the active app, don't treat it as source of truth for current behavior.

## The data model

As of 2026-08-12: the class-based migration described in earlier versions of this file is **complete**. `constants/NodeTypes.ts` has been deleted and nothing in the codebase imports it — `EntryWriter.tsx`, `TemplateWriter.tsx`, `SettingManager.tsx`, the leaf field inputs, everything is on the class-based model below. There is no longer a legacy/target split to check before touching a file.

As of 2026-08-15: the field-type registry consolidation described below (previously an open question) is also **complete**. `TypedNode.tsx`, `FieldNodeFactory.tsx`, and `SectionNodeFactory.tsx` have been deleted; a single [components/common/Component.tsx](components/common/Component.tsx) now renders both fields and sections by looking up `fieldDefinitions[type].component` from the registry (moved here from `components/nodes/operations/` since it's the generic tree renderer, not operations-specific — its sibling files `ValidationPreview.tsx`/`EditorControls.tsx`/`AddControls.tsx`/`RenameInput.tsx` are still in `components/nodes/operations/`). `SettingManager.tsx` follows the same pattern via a `settingDefinitions` map. A new field type is now one registry entry in `NodeRegistry.tsx`, not several hand-edited switch statements.

- **Model** — [constants/DataTypes.tsx](constants/DataTypes.tsx):
  - `DataContainer<T>` is an abstract class wrapping `{ metadata, fields }`, with `EntryContainer`/`TemplateContainer` as concrete subclasses distinguished by `metadata.type`.
  - `DataContainer` owns the tree operations: `insertNodeAfter`, `removeNode`, `moveNodeUp`/`moveNodeDown`, `updateFieldByPath`, `onHandleChange`, ordering via `metadata.order` (an array of field IDs) and `initialiseOrder()`.
  - Each field value is a `FieldNode<T>` = `{ id, type: 'field', field: field_data<T> }`, where `field_data<T>` is an abstract class with `getData()`/`setData()`/`moveUp()`/`moveDown()`/`deleteNode()`. Concrete field classes: `TextField`, `NumberField`, `TimeField`, `DateField`, `DurationField`, `ScaleField`, `ToggleButtonField`, `ToggleImageButtonField`, `SectionField` (holds nested `childNodes`), `SelectionField`.
  - Rationale for the migration (per project owner): classes let each field type carry its own behavior/methods rather than every consumer having to know how to interpret a plain data shape — this is meant to make the data processing more accurate and the system easier to extend with new field types.

- **Field-type registry**: [hooks/NodeRegistry.tsx](hooks/NodeRegistry.tsx) is the single source of truth for field-type string → behavior. `fieldDefinitions: Record<string, { create: () => field_data<FieldData>, component: React.ComponentType<any> }>` maps every field-type string to both its default-instance factory and its render component. `TemplateEditorManager.tsx`'s "Add Field" flow calls `fieldDefinitions[type].create()`; `Component.tsx` calls `fieldDefinitions[type].component` to render it. The file also holds `defaultTemplate`, the `selectionField` used by the type picker, and `settingDefinitions` (the equivalent registry for `SettingManager.tsx`).

- **Field-level validation**: [components/nodes/operations/ValidationPreview.tsx](components/nodes/operations/ValidationPreview.tsx) is the live validation path — a per-field-type `validateFieldData()` switch rendered inline in the editor, wired into `Component.tsx`. `DataContainer.validateNode()`/`validateTree()` (the earlier stub) has been removed from `DataTypes.tsx` — there is no longer a dead second validation path to confuse with this one.

## Coding conventions

- **File naming**: kebab-case for files that are registries/definitions (e.g. `setting-enums.ts`) or plain data-value assignment (constants, config); PascalCase for files whose default export is a React component or that manage state (providers, hooks returning component-facing state, UI-facing classes). `hooks/NodeRegistry.tsx` is a registry/definitions file under this rule and is a naming outlier (rename candidate: `node-registry.tsx`) — not yet renamed, don't treat the current name as the pattern to copy for new registry-style files.
- **Class method vs. free function**: if a function reads or mutates a `DataContainer`'s or `field_data`'s own internal state, it belongs on the class as a method. If it operates on a template in general terms, or falls outside the container/field entirely (id generation, type guards, storage I/O), it's a free function in `utils/`.
- **Comment style**: TODOs are always `// TODO: description` — single line, space after `//`, colon before the description. No block-comment TODO stacks, no `//TODO:` without the space. Existing TODOs that don't match this are known debt, not yet swept — don't copy their format for new ones.
- **Folder structure**: the current type-based split (`components/nodes/inputs`, `components/nodes/operations`, `components/managers`, `components/wrappers`, `hooks/`, `utils/`, `constants/`) is fine as-is for V1-era work. Don't reorganize into feature-based folders now — that's a call to revisit (if at all) at the planned React + Vite PWA migration, not before, so it isn't restructured twice.

## How to collaborate with me on this project

The project owner wants support in three recurring modes — flag which mode a request is in if it's not obvious, and default to the depth described:

1. **UML / architecture diagrams.** Base these on the actual current code (grep/read before drawing), not on assumptions carried over from earlier conversations — this file gets updated as things change, but re-verify against imports for anything load-bearing. Prefer class diagrams for the `DataContainer`/`field_data` hierarchy, and sequence/flow diagrams for things like "user edits a field → onChange → save."

2. **High-level planning.** Ground proposals in the version roadmap above — a planning response should say which version's scope a piece of work belongs to, and flag scope creep into later versions (pulling the React/Vite PWA migration or V2 analytics/theming forward are the recurring failure modes to watch for).

3. **Bug fixing.** The class-based data model migration and the field-type registry consolidation are both done, so refactor-seam bugs (mismatched `DataTypes.tsx`/`NodeTypes.ts` imports, or a field type missing from `TypedNode.tsx`'s old switch) are no longer the default suspect — that file doesn't exist anymore. If a field type silently renders nothing, check `fieldDefinitions` in `NodeRegistry.tsx` first for a missing/misconfigured entry. More generally: a function that moved from a `utils/*.ts` free function onto a class method (e.g. tree-mutation logic living on `DataContainer`) without every call site updated is still a plausible cause — say so explicitly rather than patching around it.

## Open questions for the project owner

None outstanding as of 2026-08-15 — the last round (field-type registry direction, storage shape, naming/rename, validation scope, coding conventions) is all resolved and folded into the sections above. Add new ones here as they come up; this file should get more precise over time, not just longer.
