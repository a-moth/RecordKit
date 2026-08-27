# Portability

RecordKit's local-first design includes data portability. Users should be able to export data explicitly and use that export with software other than RecordKit.

Portability work must preserve:

- stable, documented data representations;
- explicit import and export rather than implicit transmission;
- compatibility and migration documentation when representations change;
- user ownership of credentials for any third-party integration;
- the absence of automatic device sync or a RecordKit-controlled server.

Detailed serialized formats and compatibility rules belong in `docs/api-reference/`. User-facing import, export, and programmatic-use instructions belong in `user-docs/`.

