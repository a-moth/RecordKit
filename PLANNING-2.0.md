# RecordKit 2.0 — Analytics and PWA foundation

## Status

Future major version.

## Objectives

- Provide useful analytics over user-authored templates and collected entries.
- Complete the intended migration from Expo/React Native to a progressive web application before release.

## Planning requirements

- Define analytics in terms of arbitrary user-authored schemas rather than fixed symptom or habit fields.
- Preserve local-first analysis and avoid transmitting personal records by default.
- Define how historical storage shapes and exported data remain compatible.
- Decide between the current React + Vite plan and the earlier XSLT/XHTML direction through an explicit architecture decision before migration implementation.
- Plan the framework migration explicitly rather than allowing earlier features to introduce uncoordinated PWA-specific code.
- Treat accessibility and data portability as release requirements.

Detailed interfaces, supported analyses, migration sequencing, and PWA capabilities remain open until closer to implementation.
