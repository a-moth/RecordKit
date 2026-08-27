# Testing components and screens

Component tests should focus on behaviour that is not already proven by model or pure-function tests.

Use real providers when the provider integration is part of the behaviour. Otherwise, use a focused wrapper or mock so the test does not become an accidental integration test of the whole application.

Representative responsibilities include:

- editor controls invoking the correct container operation;
- add-field flow using the registry factory;
- rename inputs updating the intended metadata;
- entry and template writers guarding saves;
- list readers loading, sorting, empty states, and actions;
- route parameters passed when opening an entry or template;
- theme and settings-dependent presentation;
- accessible names, states, and touch interactions.

Native pickers, vector icons, and other binary-backed modules should be mocked in Jest. Keep the mock contract narrow enough that tests still fail when RecordKit calls the dependency incorrectly.

