# RecordKit 1.6 — Custom theming

## Status

Planned after 1.5.

## Objective

Allow users to customise RecordKit's appearance while retaining an accessible and coherent interface.

## Scope direction

- Define which theme roles users may customise.
- Persist user theme choices locally.
- Preserve readable contrast and clear interaction states.
- Respect platform accessibility and reduced-motion preferences.
- Document reset and fallback behaviour.
- Add white-box coverage for persistence, resolution, defaults, and invalid values.

## Constraints

- This is distinct from the completed internal `Sizes` naming cleanup.
- Do not pull user-facing theme configuration into earlier versions.
- Prefer semantic theme roles over styling individual components independently.

