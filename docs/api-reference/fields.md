# Fields

Every field contains common data including a `type`, `label`, and `visible` value, plus type-specific values.

Current serialized types are:

- `text`: string value;
- `number`: numeric value;
- `time`: raw string value and optional format;
- `date`: raw string value and optional format;
- `duration`: two non-negative values and their units;
- `selection`: selected identifiers, options, and a `multiple` flag;
- `scale`: minimum, maximum, value, image mode, and image list;
- `boolean`: boolean value and selected/unselected labels;
- `image-boolean`: boolean value and selected/unselected image references;
- `section`: orientation, identifier, and nested child nodes.

The add-field registry key `multiselection` creates serialized type `selection` with `multiple: true`; it is not a separate serialized field type.

Refer to `constants/DataTypes.tsx` for current TypeScript definitions. A generated schema is not yet available.

