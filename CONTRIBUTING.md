# Contributing to RecordKit

Thank you for contributing to RecordKit. This guide defines the process shared by human contributors and AI-assisted work.

## Read before starting

1. Read [PLANNING.md](PLANNING.md) for project direction, current scope, and documentation routes.
2. Read the plan for the version that owns the work.
3. Read the relevant material under [docs/architecture/](docs/architecture/README.md) and [docs/testing/](docs/testing/README.md).
4. AI assistants must additionally follow [IMPLEMENTATION_ASSISTANTS.md](IMPLEMENTATION_ASSISTANTS.md).

## Authorising work

A change must have either a valid item in the current version plan or an approved issue that authorises the work. Future roadmap entries describe direction and are not implementation permission.

If work knowingly changes behaviour outside approved scope, pause and decide whether it belongs in RecordKit and which version owns it. Significant architectural choices require discussion and an architecture decision record before implementation establishes the choice by default. A feature proposal's suggested approach is not itself an accepted architecture decision.

## Development expectations

- Follow [RecordKit's code conventions](docs/architecture/code-conventions.md).
- Match the closest existing implementation pattern unless a reviewed decision justifies a divergence.
- Preserve local-first operation, sensitive-data protections, accessibility, and data portability.
- Keep changes focused on their authorised scope.
- Preserve unrelated work already present in the branch.

## Tests

From version 1.1 onward, every implementation change includes appropriate white-box tests in the same work. Cover success, failure, boundary, and recursive behaviour where relevant. Document meaningful manual-only checks under `docs/testing/`.

Before requesting review, run:

```sh
npx jest --runInBand --no-watchman
npx tsc --noEmit
```

## Documentation and accessibility

Review every change for effects on architecture, testing guidance, API or serialized data reference, user-facing behaviour and limitations, planned versus implemented status, and accessibility.

Documentation or accessibility work unrelated to the current version may be tracked separately without blocking the version. Work directly affected by the current change must be completed or explicitly accounted for before release.

## Pull requests

Use the pull-request template. Review proceeds by confirming authorised scope, resolving architecture-decision requirements, reviewing implementation and tests, confirming documentation and accessibility coverage, and recording remaining work in issues.

A pull request that lacks authorised scope, knowingly breaks unrelated behaviour, or embeds an unresolved significant architectural decision should not proceed normally.
