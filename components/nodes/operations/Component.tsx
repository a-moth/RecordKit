import { ScrollView, Text, View, Pressable } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import ValidationPreview from "./ValidationPreview";
import EditorControls from "./EditorControls";
import AddControls, { AddFieldPicker, useAddFieldPicker } from "./AddControls";
import RenameInput from "./RenameInput";
import {
    data_container_types,
    DataContainer,
    FieldData,
    FieldNode,
    SectionData,
} from "../../../constants/DataTypes";
import { useTheme } from "../../../hooks/use-theme-provider";
import { useState } from "react";
import { fieldDefinitions } from "../../../hooks/NodeRegistry";


function renderFieldNodes(
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
    childNodes: Record<string, FieldNode<FieldData>>
) {
    return (
        <>
            {Object.entries(childNodes).map(([title, node]) => {
                const definition = fieldDefinitions[node.field.data.type];

                if (!definition) {
                    return null;
                }

                const Component = definition.component;

                const { picking, selectorField, startPicking, handleTypeChange } = useAddFieldPicker(addField);

                if (!edit) {
                    return (
                        <Component
                            key={title}
                            template={template}
                            id={node.id}
                            edit={edit}
                            locked={locked}
                            nodeKey={title}
                            field={node}
                            section={node}
                            onChange={onChange}
                            addField={addField}
                            addSection={addSection}
                            moveUp={moveUp}
                            moveDown={moveDown}
                            deleteNode={deleteNode}
                        />
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
                                    key={title}
                                    template={template}
                                    id={node.id}
                                    edit={edit}
                                    locked={locked}
                                    nodeKey={title}
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
            })}
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
            <Component
                key={node.id}
                template={template}
                id={node.id}
                edit={edit}
                locked={locked}
                nodeKey={node.id}
                field={node}
                section={node}
                onChange={onChange}
                addField={addField}
                addSection={addSection}
                moveUp={moveUp}
                moveDown={moveDown}
                deleteNode={deleteNode}
            />
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
                        nodeKey={node.id}
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

    const {
        picking,
        selectorField,
        startPicking,
        handleTypeChange,
    } = useAddFieldPicker(addField);

    if (section.field.data.type !== "section") {
        return renderFieldNode(template, edit, locked, onChange, addField, addSection, moveUp, moveDown, deleteNode, section);
    }

    if (!section.field.data.childNodes) {
        return null;
    }

    if (!section.field.data.label) {
        return null;
    }

    const header = (
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
                                flexDirection: (section as FieldNode<SectionData>).field.data.orientation,
                                flexWrap: "nowrap",
                            },
                        ]}
                    >
                        {renderFieldNodes(
                            template,
                            edit,
                            locked,
                            onChange,
                            addField,
                            addSection,
                            moveUp,
                            moveDown,
                            deleteNode,
                            (section as FieldNode<SectionData>).field.data.childNodes
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
                        addSection={addSection}
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
                        addField,
                        addSection,
                        moveUp,
                        moveDown,
                        deleteNode,
                        (section as FieldNode<SectionData>).field.data.childNodes
                    )}

                    <ValidationPreview field={section} />
                </View>
            )}
        </ScrollView>
    );
}