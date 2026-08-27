# Testing the data model

The model under test is the class hierarchy in `constants/DataTypes.tsx`.

## Containers

Test `TemplateContainer` and `EntryContainer` separately when metadata type affects the returned class. Required cases include:

- order initialisation for a new container;
- preservation of an explicit non-empty order;
- ordered-node lookup ignoring missing identifiers safely;
- insertion after an existing node and append behaviour for a missing target;
- removal from both fields and order;
- movement at the beginning, middle, end, and for a missing identifier;
- recursive path updates inside nested sections;
- unchanged return behaviour when an update target is absent;
- correct concrete container type after a change.

## Serialization and reconstruction

Round-trip every field type through `toJSON` and `DataContainerFactory.fromJSON`. Include nested sections and explicit order. Malformed JSON, missing metadata, missing fields, incomplete nodes, unsupported types, and invalid nested nodes must fail in the documented manner rather than constructing partially valid objects.

## Fields

For every `field_data` subclass, test cloning, data mutation, serialization, and type-specific setters. The base `moveUp`, `moveDown`, and `deleteNode` methods are currently no-ops and are not the active tree-operation path; top-level operations belong to `DataContainer`, while section-child operations belong to `SectionField`. Verify that shallow cloning does not accidentally share nested mutable structures when independent data is required.
