# Nodes and ordering

A field node has this shape:

```ts
{
  id: string;
  type: "field";
  field: field_data;
}
```

Top-level nodes are stored in the container's `fields` map and ordered by `metadata.order`. Missing identifiers in the order array are ignored by `getOrderedNodes`.

Sections store nested nodes in `field.data.childNodes`. Container path updates search section children recursively. Section children are serialized recursively and reconstructed by `DataContainerFactory.fromJSON`.

Node identifiers and map keys normally correspond, but consumers should use the node's `id` and explicit order contract rather than rely on JavaScript object insertion order.

