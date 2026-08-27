# Templates

A template is a `TemplateContainer` with metadata type `template`.

`metadata.templateId` is its stable key in the current template map. `metadata.name` is its user-facing name. `metadata.order` determines top-level field display order independently of object-property order. `usedTime` is template-specific metadata.

The bundled default template has identifier `9834fa2e-4392-407f-9672-95b82d2868a7`. Current storage helpers protect it from editing and deletion and restore it when no stored templates are available.

Templates define field structure and defaults. Entries created against a template carry the template identifier in their metadata.

