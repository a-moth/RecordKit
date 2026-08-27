# Testing overview

## Commands

Run the automated checks with:

```sh
npx jest --runInBand --no-watchman
npx tsc --noEmit
```

The no-Watchman option keeps the test command portable across development and CI environments. The TypeScript configuration excludes `old code/` because that directory is a historical prototype rather than active source.

## White-box expectations

Tests should be written with knowledge of the implementation boundaries and invariants they attest to. Prefer the lowest useful boundary:

- pure functions and model methods for data behaviour;
- storage helpers for persistence contracts;
- components for meaningful UI state and interaction;
- screens only when routing or multiple component boundaries matter.

Cover successful behaviour, invalid input, boundaries, missing data, and recursive behaviour where relevant. A test that merely renders without asserting meaningful behaviour is insufficient coverage for a feature.

## Test isolation

- Reset AsyncStorage mocks between tests that persist data.
- Use deterministic identifiers when UUID values are not the subject of the test.
- Mock native modules at the test boundary; do not require a native binary in Jest.
- Avoid asserting implementation noise such as generated style arrays unless that styling is the behaviour under test.
- Do not use real personal or health data in fixtures.

## Current test infrastructure

Global mocks live in `jest.setup.js`. The current setup provides AsyncStorage and native-component boundaries needed by the existing home-screen test. Add global mocks only for dependencies shared broadly; keep scenario-specific behaviour inside the relevant test file.

