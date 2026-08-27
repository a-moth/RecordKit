# Data format

## Stability

The shapes on this page describe the current internal representation. They are not yet a stable public import/export contract. Data shipped from 1.0 onward must nevertheless be preserved when the internal representation changes.

## Container

Templates and entries share this conceptual shape:

```ts
{
  metadata: {
    templateId: string;
    name: string;
    lastModified: number;
    order: string[];
    // type-specific metadata
  };
  fields: Record<string, FieldNode>;
}
```

Template metadata adds `type: "template"` and `usedTime`. Entry metadata adds `type: "entry"` and `createdAt`.

## Current persistence envelope

AsyncStorage key `appData` contains JSON with `templates` and `entries` maps. Each map value is itself the JSON string returned by `DataContainer.toJSON`; each node's `field` value is likewise the JSON string returned by that field's `toJSON`.

This nested-string representation is current behaviour, not the intended 1.2 storage design.

