import AddControls, { AddFieldPicker, useAddFieldPicker } from '../nodes/operations/AddControls';
import { createId, isSectionNode, } from '../../utils/NodeUtils';
import { useSettings } from '../../utils/SettingsProvider';
import valueOf from '../../utils/generic-calls';
import { data_container_types, DataContainer, FieldData, SectionData, SectionField, FieldNode } from '../../constants/DataTypes';
import { fieldDefinitions } from '../../hooks/NodeRegistry';
import Component from '../nodes/operations/Component';

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

  function addFieldToEmpty(type: string) {
    const fieldValue = fieldDefinitions[type];
    if (!fieldValue || !template) return;

    const fieldNode: FieldNode<FieldData> = {
      id: createId(),
      type: 'field',
      field: fieldValue.create(),
    };

    const updated = template.insertNodeAfter(template, '', fieldNode);
    if (updated) onTreeChange?.(updated);
  }

  function addSectionToEmpty() {
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
      const updated = template.insertNodeAfter(template, '', sectionFieldNode);
      if (updated) onTreeChange?.(updated);
    }
  }

  function addFieldLast(type: string) {
    const fieldValue = fieldDefinitions[type];
    if (!fieldValue || !template) return;

    const fieldNode: FieldNode<FieldData> = {
      id: createId(),
      type: 'field',
      field: fieldValue.create(),
    };

    const updated = template.insertNodeAfter(template, template.getData().metadata.order[template.getData().metadata.order.length - 1], fieldNode);
    if (updated) onTreeChange?.(updated);
  }

  function addSectionLast() {
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
      const updated = template.insertNodeAfter(template, template.getData().metadata.order[template.getData().metadata.order.length - 1], sectionFieldNode);
      if (updated) onTreeChange?.(updated);
    }
  }

  const emptyPicker = useAddFieldPicker(addFieldToEmpty);
  const lastPicker = useAddFieldPicker(addFieldLast);
  const isEmpty = !!template && template.getData().metadata.order.length === 0;

  return (
    <>
      {edit && isEmpty && (
        <>
          <AddControls
            locked={locked}
            addSection={addSectionToEmpty}
            picking={emptyPicker.picking}
            onStartPicking={emptyPicker.startPicking}
          />
          {emptyPicker.picking && template && (
            <AddFieldPicker
              template={template}
              locked={locked}
              selectorField={emptyPicker.selectorField}
              onChange={emptyPicker.handleTypeChange}
            />
          )}
        </>
      )}
      {template &&
        template.getData().metadata.order
          .map((id): [string, FieldNode<FieldData>] | null => {
            const node = template.getData().fields[id];
            return node ? [id, node] : null;
          })
          .filter((entry): entry is [string, FieldNode<FieldData>] => entry !== null)
          .slice(0, isList ? valueOf(settings?.["**showCount"]) ?? 10 : undefined).map(([nodeKey, node]) => {
            let actualNode = template?.getData().fields[nodeKey];
            // Future autosave?

            function addField(type: string) {
              // insert this after fieldnode of field
              const fieldValue = fieldDefinitions[type];
              if (!fieldValue || !template) return;

              const fieldNode: FieldNode<FieldData> = {
                id: createId(),
                type: 'field',
                field: fieldValue.create(),
              };

              const updated = template.insertNodeAfter(template, nodeKey, fieldNode);
              if (updated) onTreeChange?.(updated);
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
                <Component template={template} locked={locked} edit={edit} key={nodeKey} section={actualNode} onChange={onChange} addField={addField} addSection={addSection} moveUp={moveUp} moveDown={moveDown} deleteNode={deleteNode} />
              );
            }

            return (
              <Component template={template} locked={locked} edit={edit} key={nodeKey} section={actualNode} onChange={onChange} addField={addField} addSection={addSection} moveUp={moveUp} moveDown={moveDown} deleteNode={deleteNode} />
            );
          })
      }
      {edit && !isEmpty && (
        <>
          <AddControls
            locked={locked}
            addSection={addSectionLast}
            picking={lastPicker.picking}
            onStartPicking={lastPicker.startPicking}
          />
          {lastPicker.picking && template && (
            <AddFieldPicker
              template={template}
              locked={locked}
              selectorField={lastPicker.selectorField}
              onChange={lastPicker.handleTypeChange}
            />
          )}
        </>
      )}
    </>
  );
}
