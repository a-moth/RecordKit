import FieldNodeFactory from '../nodes/operations/FieldNodeFactory';
import SectionNodeFactory from '../nodes/operations/SectionNodeFactory';
import { createId, isSectionNode, } from '../../utils/NodeUtils';
import { useSettings } from '../../utils/SettingsProvider';
import valueOf from '../../utils/generic-calls';
import { data_container_types, DataContainer, field_data, FieldData, SectionData, SectionField, SelectionField, TextField, FieldNode } from '../../constants/DataTypes';
import { selectionField } from '../../hooks/NodeRegistry';

//You need:

//insertNode(parentId, node)
//removeNode(nodeId)
//moveNode(nodeId, direction)
//updateNodeConfig(nodeId)

// in this overarching file to pass to nodes

/**
│ TEMPLATE EDITOR                              │
<TextLabel value={"Template Editor"} />

│ Template Name(text input)                  │
<TextInput value={templateName} />
<ValidationPreview />

│[Field Node]                                │
<FieldNode type={type} name={name} config={config} />
│   - name(input)                             │
│   - type                                      │
│   - config panel(conditional)               │
  <TextInput value={name} />
  <TypedNode value={defaultValue from config} rest={...config} />

  |[TypedNode]                                       |
  |   - type
  |   - type implementation content (ex. mins, maxes, default value, etc)
  <TextInput value={default} /> ...
  <ImageFileInput value={null || loaded} />
│  - Remove/Move Field / + Add Section                │
<EditorNode />

│[Section Node - Vertical]                   │
<SectionNode type={"vertical"} />
│   - section name(input)                     │
│   ├── child field nodes                      │
    <TextInput value={sectionName} />
    <FieldNode type={type} name={name} config={config} />
    ....
│  - Remove/Move Field / + Add Section                │
<EditorNode />

│[Section Node - Horizontal]                 │
<SectionNode type={"horizontal"} />
│   - section name(input)                     │
│   ├── child field nodes                      │
    <TextInput value={sectionName} />
    <FieldNode type={type} name={name} config={config} />
    ....
│  - Remove/Move Field / + Add Section                │
<EditorNode />

│  + Add Field / + Add Section                │
<AdderNode />
│                                              │
├──────────────────────────────────────────────┤
│ Preview                          Save        │
<ValidateRequestNodes content={pageContent} />
│ (validates current state) (persist)          │
└──────────────────────────────────────────────┘
 */

export default function TemplateEditorManager({
  isList,
  template,
  edit,
  locked,
  onChange,
  onTreeChange,
}: {
  isList: boolean;
  template: DataContainer<data_container_types> | null;
  edit: boolean;
  locked: boolean;
  onChange: (
    template: DataContainer<data_container_types> | null,
    defaultShown: boolean,
    value: FieldNode<FieldData>
  ) => void;
  onTreeChange?: (updated: DataContainer<data_container_types>) => void;
}) {
  const { settings } = useSettings();

  return (
    <>
      {template &&
        Object.entries(template?.getData().fields).slice(0, isList ? valueOf(settings?.["**showCount"]) ?? 10 : undefined).map(([nodeKey, node]) => {
          let actualNode = template?.getData().fields[nodeKey];
          // Future autosave?

          function addField() {
            // insert this after fieldnode of field
            let nodeValue: SelectionField = selectionField;

            let fieldValue: field_data<FieldData> | undefined;
            switch (nodeValue.data.selected[0]) {
              case "text":
                fieldValue = new TextField({
                  label: "text-field",
                  type: "text",
                  visible: true,
                  value: "",
                });
                break;
              case "section":
                fieldValue = new SectionField({
                  type: "section",
                  label: "section-field",
                  visible: true,
                  orientation: "row",
                  id: createId(),
                  childNodes: {}
                });
                break;
              case "selection":
                fieldValue = new SelectionField({
                  type: "selection",
                  label: "selection-field",
                  visible: true,
                  multiple: false,
                  selected: [],
                  options: [],
                });
                break;
            }

            let fieldNode: FieldNode<FieldData> | undefined;
            if (fieldValue) {
              fieldNode = {
                id: createId(),
                type: 'field',
                field: fieldValue
              }
            }

            if (fieldValue && template) {
              const updated = template.insertNodeAfter(template, nodeKey, fieldNode as FieldNode<FieldData>);
              if (updated) onTreeChange?.(updated);
            }
          }

          function addSection() {
            let sectionValue: SectionField = new SectionField({
              id: createId(),
              type: "section",
              label: "section-field",
              orientation: "row",
              childNodes: {},
              visible: true,
            });

            let sectionFieldNode = {
              field: sectionValue,
              type: "field",
              id: createId(),
            } as FieldNode<SectionData>;

            if (template) {
              const updated = template.insertNodeAfter(template, nodeKey, sectionFieldNode);
              if (updated) onTreeChange?.(updated);
            }
          }

          function moveUp() {
            if (!template) return;
            const updated = template.moveNodeUp(template, actualNode.id);
            if (updated) onTreeChange?.(updated);
          }

          function moveDown() {
            if (!template) return;
            const updated = template.moveNodeDown(template, actualNode.id);
            if (updated) onTreeChange?.(updated);
          }

          function deleteNode() {
            if (!template) return;
            const updated = template.removeNode(template, actualNode.id);
            if (updated) onTreeChange?.(updated);
          }

          if (isSectionNode(actualNode)) {
            return (
              <SectionNodeFactory template={template} id={actualNode.id} locked={locked} edit={edit} key={nodeKey} nodeKey={nodeKey} section={actualNode} onChange={onChange} addField={addField} addSection={addSection} moveUp={moveUp} moveDown={moveDown} deleteNode={deleteNode} />
            );
          }

          return (
            <FieldNodeFactory template={template} id={actualNode.id} locked={locked} edit={edit} key={nodeKey} nodeKey={nodeKey} field={actualNode} onChange={onChange} addField={addField} addSection={addSection} moveUp={moveUp} moveDown={moveDown} deleteNode={deleteNode} />
          );
        })
      }
    </>
  );
}
