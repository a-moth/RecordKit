
/**
 flexDirection:
  orientation === "horizontal"
    ? "row"
    : "column";
 */

import { ScrollView, Text, View, Pressable } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import ValidationPreview from "./ValidationPreview";
import EditorControls from "./EditorControls";
import { ReactNode, useState } from "react";
import FieldNodeFactory from "./FieldNodeFactory";
import AddControls, { AddFieldPicker, useAddFieldPicker } from "./AddControls";
import RenameInput from "./RenameInput";
import { useTheme } from "../../../hooks/use-theme-provider";
import { data_container_types, DataContainer, FieldData, FieldNode, SectionData, template } from "../../../constants/DataTypes";

export default function SectionNodeFactory({ template, id, edit, locked, nodeKey, section, onChange, addField, addSection, moveUp, moveDown, deleteNode }: {
    template: DataContainer<data_container_types>,
    id: string,
    edit: boolean
    nodeKey: string;
    section: FieldNode<FieldData>;
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
    locked: boolean;
}) {
    const theme = useTheme();
    const [collapsed, setCollapsed] = useState(false);
    const { picking, selectorField, startPicking, handleTypeChange } = useAddFieldPicker(addField);

    function renderFieldNodes(childNodes: Record<string, FieldNode<FieldData>>,): ReactNode {
        return (
            <>
                {Object.entries(childNodes).map(([title, node]) => {
                    switch (node.field.data.type) {
                        case "section":
                            return <SectionNodeFactory template={template} id={node.id} key={title} locked={locked} edit={edit} nodeKey={title} section={node} onChange={onChange} addField={addField} addSection={addSection} moveUp={moveUp} moveDown={moveDown} deleteNode={deleteNode} />;
                        default:
                            return <FieldNodeFactory template={template} id={node.id} edit={edit} key={title} nodeKey={title} field={node} onChange={onChange} addField={addField} addSection={addSection} moveUp={moveUp} moveDown={moveDown} deleteNode={deleteNode} locked={locked} />;
                    }
                })}
            </>
        );
    }
    if (section.field.data.type == "section") {
        const header = (
            <Pressable
                onPress={() => setCollapsed((prev) => !prev)}
                style={{ flexDirection: "row", alignItems: "center" }}
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
                <ScrollView style={{ flexDirection: section.field.data.orientation, flexWrap: "nowrap" }}>
                    {header}
                    {!collapsed && (
                        <View style={[theme.sizes.default.section, { flexDirection: section.field.data.orientation, flexWrap: "nowrap" }]}>
                            {renderFieldNodes(section.field.data.childNodes)}
                        </View>
                    )}
                </ScrollView>
            )
        }
        return (
            <ScrollView style={{ flexDirection: "column", flexWrap: "nowrap" }}>
                <View style={[theme.sizes.default.section, { flexDirection: section.field.data.orientation, flexWrap: "nowrap", alignItems: "center" }]}>
                    <View style={{ width: 100 }}>
                        <EditorControls moveUp={moveUp} moveDown={moveDown} deleteField={deleteNode} />
                        <AddControls locked={locked} addSection={addSection} picking={picking} onStartPicking={startPicking} />
                    </View>
                    <View style={{ flex: 1 }}>
                        {header}
                    </View>
                    <RenameInput template={template} id={id} field={section} locked={locked} onChange={onChange} />
                </View>
                {picking && (
                    <AddFieldPicker template={template} locked={locked} selectorField={selectorField} onChange={handleTypeChange} />
                )}
                {!collapsed && (
                    <View style={[theme.sizes.default.section, { flexDirection: "column", flexWrap: "nowrap" }]}>
                        {renderFieldNodes(section.field.data.childNodes)}
                        <ValidationPreview field={section} />
                    </View>
                )}
            </ScrollView>
        );
    }
}