# RecordKit 1.5 — Decoration objects

## Status

Planned after 1.4.

## Objective

Add template nodes that accept no user data and exist solely for visual decoration or organisation.

## Required design work

- Define how decoration nodes differ from fields and sections in the model.
- Decide which initial decoration types provide clear user value.
- Specify ordering, nesting, editing, validation, serialization, and portability behaviour.
- Record any significant model decision before implementation.

## Constraints

- Decorations must not masquerade as collected record data.
- They must remain accessible and must not make a template's meaning depend solely on visual presentation.
- The add-field picker may need low-cognitive-load grouping as available node types grow; choose the final organisation based on the implemented list rather than prematurely adding a large picker redesign.
- Add white-box coverage for model, registry, rendering, and persistence behaviour.

