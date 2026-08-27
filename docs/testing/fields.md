# Testing fields and the registry

`hooks/node-registry.tsx` is the field-type source of truth. Registry tests should keep creation and rendering aligned.

For every `fieldDefinitions` entry:

- `create` returns the expected `field_data` subclass;
- the new field has a valid default shape;
- the registered component is defined;
- the type is available through the add-field flow;
- the generic component renderer selects the registered component.

Current registry keys are `text`, `number`, `time`, `date`, `duration`, `selection`, `multiselection`, `scale`, `boolean`, `image-boolean`, and `section`. `multiselection` intentionally creates a `SelectionField` whose serialized data type remains `selection` and whose `multiple` value is true.

Field-component tests should cover raw input handling, change callbacks, edit/locked states, type-specific controls, and accessibility labels or roles where relevant. Image-related tests use fixtures or mocks and must never load personal images.

Serialization tests should capture current omissions as well as intended values. In particular, `ToggleButtonField` carries selected/unselected labels at runtime but currently omits them from `toJSON`; a test should either preserve that compatibility fact or accompany an approved fix.
