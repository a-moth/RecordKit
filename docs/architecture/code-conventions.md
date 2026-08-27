# Code conventions

## File naming

Use kebab-case for registries, definitions, and plain configuration or constant data. Use PascalCase for files whose default export is a React component and for component-facing providers, hooks, and classes.

## Behaviour ownership

If a function reads or mutates a `DataContainer` or `field_data` instance's own state, implement it as a method on that class. Operations outside a model instance—identifier generation, type guards, general template operations, and storage I/O—belong in utilities.

## TODOs

Write TODO comments in this exact form:

```ts
// TODO: description
```

Existing nonconforming TODOs are debt and are not examples to copy.

## Source organisation

Keep the current type-based layout during the React Native era:

- `components/nodes/inputs/`
- `components/nodes/operations/`
- `components/managers/`
- `components/wrappers/`
- `hooks/`
- `utils/`
- `constants/`

Reconsider feature-based organisation, if useful, during the planned PWA migration so the project is not restructured twice.

