import { ScrollView, Text, View, Pressable } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import ValidationPreview from "../nodes/operations/ValidationPreview";
import EditorControls from "../nodes/operations/EditorControls";
import AddControls, { AddFieldPicker, useAddFieldPicker } from "../nodes/operations/AddControls";
import RenameInput from "../nodes/operations/RenameInput";
import MiniButton from "./MiniButton";
import {
    data_container_types,
    DataContainer,
    FieldData,
    FieldNode,
    SectionData,
    SectionField,
} from "../../constants/DataTypes";
import { useTheme } from "../../hooks/use-theme-provider";
import { useState } from "react";
import { fieldDefinitions } from "../../hooks/node-registry";
import { createId } from "../../utils/NodeUtils";

/**
 * Builds the mutation callbacks for a section's own childNodes, all
 * routed through onChange (via SectionField's own insert/move/remove
 * methods) so a single onHandleChange/updateFieldByPath pass finds and
 * replaces the section node wherever it lives in the tree.
 */
function makeSectionChildActions(
    template: DataContainer<data_container_types>,
    onChange: (
        template: DataContainer<data_container_types>,
        defaultShown: boolean,
        value: FieldNode<FieldData>
    ) => void,
    section: FieldNode<SectionData>,
) {
    const sectionField = section.field as SectionField;

    function updateSection(newSectionField: SectionField) {
        onChange(template, false, {
            id: section.id,
            type: "field",
            field: newSectionField,
        });
    }

    function addChildField(afterId: string, type: string) {
        const fieldValue = fieldDefinitions[type];
        if (!fieldValue) return;

        const fieldNode: FieldNode<FieldData> = {
            id: createId(),
            type: "field",
            field: fieldValue.create(),
        };

        updateSection(sectionField.insertChildAfter(afterId, fieldNode));
    }

    function addChildSection(afterId: string) {
        const newSectionValue = new SectionField({
            id: createId(),
            type: "section",
            label: "section-field",
            orientation: "row",
            childNodes: {},
            visible: true,
        });

        const newSectionNode: FieldNode<SectionData> = {
            field: newSectionValue,
            type: "field",
            id: createId(),
        };

        updateSection(sectionField.insertChildAfter(afterId, newSectionNode));
    }

    function moveChildUp(childId: string) {
        updateSection(sectionField.moveChildUp(childId));
    }

    function moveChildDown(childId: string) {
        updateSection(sectionField.moveChildDown(childId));
    }

    function deleteChild(childId: string) {
        updateSection(sectionField.removeChild(childId));
    }

    return { addChildField, addChildSection, moveChildUp, moveChildDown, deleteChild };
}

/**
 * A single child row within a section. Split out from renderFieldNodes so
 * each child mounts as its own component instance (own hook context) -
 * calling useAddFieldPicker directly inside the childNodes.map() would
 * otherwise change React's hook count for the *enclosing* section's render
 * whenever a child is added or removed, tripping the rules of hooks.
 */
function SectionChildRow({
    template,
    edit,
    locked,
    onChange,
    childActions,
    title,
    node,
    orientation,
}: {
    template: DataContainer<data_container_types>;
    edit: boolean;
    locked: boolean;
    onChange: (
        template: DataContainer<data_container_types>,
        defaultShown: boolean,
        value: FieldNode<FieldData>
    ) => void;
    childActions: ReturnType<typeof makeSectionChildActions>;
    title: string;
    node: FieldNode<FieldData>;
    orientation: 'row' | 'column';
}) {
    const definition = fieldDefinitions[node.field.data.type];

    function addField(type: string) {
        childActions.addChildField(node.id, type);
    }

    function addSection() {
        childActions.addChildSection(node.id);
    }

    function moveUp() {
        childActions.moveChildUp(node.id);
    }

    function moveDown() {
        childActions.moveChildDown(node.id);
    }

    function deleteNode() {
        childActions.deleteChild(node.id);
    }

    const { picking, selectorField, startPicking, handleTypeChange } = useAddFieldPicker(addField);

    if (!definition) {
        return null;
    }

    const Component = definition.component;

    // Row orientation is a display-time layout for filled-in entries. While
    // editing, every child still needs its own full-width move/delete/add
    // controls and rename field, so the editor always stacks children in a
    // column regardless of the section's chosen orientation - forcing those
    // per-field control strips to share a row leaves no room for the actual
    // field content.
    if (!edit) {
        return (
            <View style={orientation === 'row' ? { flex: 1 } : undefined}>
                <Component
                    template={template}
                    id={node.id}
                    edit={edit}
                    locked={locked}
                    fieldKey={node.field.data.label}
                    defaultShown={node.field.data.visible}
                    field={node}
                    section={node}
                    onChange={onChange}
                    addField={addField}
                    addSection={addSection}
                    moveUp={moveUp}
                    moveDown={moveDown}
                    deleteNode={deleteNode}
                />
                <ValidationPreview field={node} />
            </View>
        )
    }
    return (
        <View>
            <View style={{ flexDirection: "row", flexWrap: "nowrap", alignItems: "center" }}>
                <View style={{ width: 100 }}>
                    <EditorControls moveUp={moveUp} moveDown={moveDown} deleteField={deleteNode} />
                    <AddControls locked={locked} addSection={addSection} picking={picking} onStartPicking={startPicking} />
                </View>
                <View style={{ flex: 1 }}>
                    <Component
                        template={template}
                        id={node.id}
                        edit={edit}
                        locked={locked}
                        fieldKey={node.field.data.label}
                        defaultShown={node.field.data.visible}
                        field={node}
                        section={node}
                        onChange={onChange}
                        addField={addField}
                        addSection={addSection}
                        moveUp={moveUp}
                        moveDown={moveDown}
                        deleteNode={deleteNode}
                    />
                    <ValidationPreview field={node} />
                </View>
                <RenameInput template={template} id={node.id} field={node} locked={locked} onChange={onChange} />
            </View>
            {picking && (
                <AddFieldPicker template={template} locked={locked} selectorField={selectorField} onChange={handleTypeChange} />
            )}
        </View>
    );
}

function renderFieldNodes(
    template: DataContainer<data_container_types>,
    edit: boolean,
    locked: boolean,
    onChange: (
        template: DataContainer<data_container_types>,
        defaultShown: boolean,
        value: FieldNode<FieldData>
    ) => void,
    childActions: ReturnType<typeof makeSectionChildActions>,
    childNodes: Record<string, FieldNode<FieldData>>,
    orientation: 'row' | 'column' = 'column'
) {
    return (
        <>
            {Object.entries(childNodes).map(([title, node]) => (
                <SectionChildRow
                    key={title}
                    template={template}
                    edit={edit}
                    locked={locked}
                    onChange={onChange}
                    childActions={childActions}
                    title={title}
                    node={node}
                    orientation={orientation}
                />
            ))}
        </>
    );
}

function renderFieldNode(
    template: DataContainer<data_container_types>,
    edit: boolean,
    locked: boolean,
    onChange: (
        template: DataContainer<data_container_types>,
        defaultShown: boolean,
        value: FieldNode<FieldData>
    ) => void,
    addField: (type: string) => void,
    addSection: () => void,
    moveUp: () => void,
    moveDown: () => void,
    deleteNode: () => void,
    node: FieldNode<FieldData>
) {
    const definition = fieldDefinitions[node.field.data.type];

    if (!definition) {
        return null;
    }

    const Component = definition.component;

    const { picking, selectorField, startPicking, handleTypeChange } = useAddFieldPicker(addField);

    if (!edit) {
        return (
            <>
                <Component
                    key={node.id}
                    template={template}
                    id={node.id}
                    edit={edit}
                    locked={locked}
                    fieldKey={node.field.data.label}
                    defaultShown={node.field.data.visible}
                    field={node}
                    section={node}
                    onChange={onChange}
                    addField={addField}
                    addSection={addSection}
                    moveUp={moveUp}
                    moveDown={moveDown}
                    deleteNode={deleteNode}
                />
                <ValidationPreview field={node} />
            </>
        )
    }
    return (
        <View>
            <View style={{ flexDirection: "row", flexWrap: "nowrap", alignItems: "center" }}>
                <View style={{ width: 100 }}>
                    <EditorControls moveUp={moveUp} moveDown={moveDown} deleteField={deleteNode} />
                    <AddControls locked={locked} addSection={addSection} picking={picking} onStartPicking={startPicking} />
                </View>
                <View style={{ flex: 1 }}>
                    <Component
                        key={node.id}
                        template={template}
                        id={node.id}
                        edit={edit}
                        locked={locked}
                        fieldKey={node.field.data.label}
                        defaultShown={node.field.data.visible}
                        field={node}
                        section={node}
                        onChange={onChange}
                        addField={addField}
                        addSection={addSection}
                        moveUp={moveUp}
                        moveDown={moveDown}
                        deleteNode={deleteNode}
                    />
                    <ValidationPreview field={node} />
                </View>
                <RenameInput template={template} id={node.id} field={node} locked={locked} onChange={onChange} />
            </View>
            {picking && (
                <AddFieldPicker template={template} locked={locked} selectorField={selectorField} onChange={handleTypeChange} />
            )}
        </View>
    );
}


export default function Component({
    template,
    section,
    edit,
    locked,
    onChange,
    addField,
    addSection,
    moveUp,
    moveDown,
    deleteNode,
}: {
    template: DataContainer<data_container_types>;
    section: FieldNode<FieldData>;
    edit: boolean;
    locked: boolean;
    onChange: (
        template: DataContainer<data_container_types>,
        defaultShown: boolean,
        value: FieldNode<FieldData>
    ) => void;
    addField: (type: string) => void;
    addSection: () => void;
    moveUp: () => void;
    moveDown: () => void;
    deleteNode: () => void;
}) {
    const theme = useTheme();
    const [collapsed, setCollapsed] = useState(false);

    const childActions = makeSectionChildActions(template, onChange, section as FieldNode<SectionData>);

    // A section's own Add Field/Add Section controls append into its own
    // childNodes, not a sibling after the section - the button lives on the
    // section, so "add" should mean "add into this section". To insert a new
    // top-level sibling after a section, use the preceding node's controls
    // (or the trailing template-level controls if the section is last).
    function addChildFieldToEnd(type: string) {
        childActions.addChildField('', type);
    }

    function addChildSectionToEnd() {
        childActions.addChildSection('');
    }

    const {
        picking,
        selectorField,
        startPicking,
        handleTypeChange,
    } = useAddFieldPicker(addChildFieldToEnd);

    if (section.field.data.type !== "section") {
        return renderFieldNode(template, edit, locked, onChange, addField, addSection, moveUp, moveDown, deleteNode, section);
    }

    if (!section.field.data.childNodes) {
        return null;
    }

    if (!section.field.data.label) {
        return null;
    }

    const orientation = (section as FieldNode<SectionData>).field.data.orientation;
    const childNodes = (section as FieldNode<SectionData>).field.data.childNodes;

    function toggleOrientation() {
        const sectionField = (section as FieldNode<SectionData>).field.clone() as SectionField;
        sectionField.setOrientation(orientation === 'row' ? 'column' : 'row');

        onChange(template, false, {
            id: section.id,
            type: "field",
            field: sectionField,
        });
    }

    const header = (
        <View>
            <Pressable
                onPress={() => setCollapsed((prev) => !prev)}
                style={{
                    flexDirection: "row",
                    alignItems: "center",
                }}
            >
                <Text
                    style={[
                        theme.sizes.default.sectionTitle,
                        {
                            color: theme.colors.text,
                            fontFamily: theme.fonts?.bold.fontFamily,
                        },
                    ]}
                >
                    {section.field.data.label}
                </Text>

                <Icon
                    name={collapsed ? "chevron-right" : "chevron-down"}
                    size={theme.sizes.default.sectionTitle.fontSize}
                    color={theme.colors.text}
                    style={{ marginLeft: 6 }}
                />
            </Pressable>

            {edit && (
                <MiniButton
                    label={orientation === 'row' ? '--' : '|'}
                    color="primary"
                    onPress={toggleOrientation}
                />
            )}

            {edit && orientation === 'row' && (
                <Text style={{ color: theme.colors.success, fontFamily: theme.fonts?.regular.fontFamily }}>
                    Sections only lay out in a row on entries - this editor always lists fields in a column.
                </Text>
            )}
        </View>
    );

    if (!edit) {
        return (
            <ScrollView
                style={{
                    flexDirection: "column",
                    flexWrap: "nowrap",
                }}
            >
                {header}

                {!collapsed && (
                    <View
                        style={[
                            theme.sizes.default.section,
                            {
                                flexDirection: orientation,
                                flexWrap: "nowrap",
                            },
                        ]}
                    >
                        {renderFieldNodes(
                            template,
                            edit,
                            locked,
                            onChange,
                            childActions,
                            childNodes,
                            orientation
                        )}
                    </View>
                )}
            </ScrollView>
        );
    }

    return (
        <ScrollView
            style={{
                flexDirection: "column",
                flexWrap: "nowrap",
            }}
        >
            <View
                style={[
                    theme.sizes.default.section,
                    {
                        flexDirection: "row",
                        flexWrap: "nowrap",
                        alignItems: "center",
                    },
                ]}
            >
                <View style={{ width: 100 }}>
                    <EditorControls
                        moveUp={moveUp}
                        moveDown={moveDown}
                        deleteField={deleteNode}
                    />

                    <AddControls
                        locked={locked}
                        addSection={addChildSectionToEnd}
                        picking={picking}
                        onStartPicking={startPicking}
                    />
                </View>

                <View style={{ flex: 1 }}>
                    {header}
                </View>

                <RenameInput
                    template={template}
                    id={section.id}
                    field={section}
                    locked={locked}
                    onChange={onChange}
                />
            </View>

            {picking && (
                <AddFieldPicker
                    template={template}
                    locked={locked}
                    selectorField={selectorField}
                    onChange={handleTypeChange}
                />
            )}

            {!collapsed && (
                <View
                    style={[
                        theme.sizes.default.section,
                        {
                            flexDirection: "column",
                            flexWrap: "nowrap",
                        },
                    ]}
                >
                    {renderFieldNodes(
                        template,
                        edit,
                        locked,
                        onChange,
                        childActions,
                        childNodes
                    )}
                </View>
            )}
        </ScrollView>
    );
}