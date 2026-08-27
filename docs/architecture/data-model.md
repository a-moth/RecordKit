# Data model

The class-based data model is defined in `constants/DataTypes.tsx`.

`DataContainer<T>` is an abstract wrapper around `{ metadata, fields }`. `EntryContainer` and `TemplateContainer` are its concrete forms and are distinguished by `metadata.type`.

`DataContainer` owns operations that read or mutate its tree, including insertion, removal, movement, path-based updates, change handling, and order initialisation. Field ordering is stored in `metadata.order` as field identifiers.

A field is represented by `FieldNode<T>`:

```text
{
  id,
  type: "field",
  field: field_data<T>
}
```

The abstract `field_data<T>` class owns field behaviour such as getting and setting data, moving, and deletion. Concrete classes cover text, number, time, date, duration, scale, boolean, image-boolean, section, and selection fields. A `SectionField` contains nested child nodes.

## Field registry

`hooks/node-registry.tsx` is the single source of truth for field-type behaviour. Each `fieldDefinitions` entry supplies both a default-instance factory and the component used to render that type.

The template editor creates fields through the registry. `components/common/Component.tsx` renders fields and sections through the same registry. Settings follow the same design through `settingDefinitions`.

The earlier `NodeTypes.ts`, `TypedNode.tsx`, and separate field/section factory architecture is retired. Files under `old code/` are not an active compatibility layer.

## Validation

`components/nodes/operations/ValidationPreview.tsx` is the single live field-validation path. Its hook-free `validateFieldData` function owns field validation, including exception-safe date and time parsing.

`hasValidationErrors` recursively validates top-level and nested section fields. Entry and template writers use it both to disable saving and to guard the save operation. Input components preserve raw strings so partial user input can be displayed and validated without being rejected during typing.

