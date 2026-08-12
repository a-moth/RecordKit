
/**
 flexDirection:
  orientation === "horizontal"
    ? "row"
    : "column";
 */

import { ScrollView, Text } from "react-native";
import ValidationPreview from "./ValidationPreview";
import EditorControls from "./EditorControls";
import { ReactNode } from "react";
import FieldNodeFactory from "./FieldNodeFactory";
import AddControls from "./AddControls";
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
        if (!edit) {
            return (
                <ScrollView style={{ flexDirection: section.field.data.orientation, flexWrap: "nowrap" }}>
                    <Text>
                        {section.field.data.label}
                    </Text>
                    {renderFieldNodes(section.field.data.childNodes)}
                </ScrollView>
            )
        }
        return (
            <ScrollView style={{ flexDirection: section.field.data.orientation, flexWrap: "nowrap" }}>
                <Text>
                    {section.field.data.label}
                </Text>
                {renderFieldNodes(section.field.data.childNodes)}
                <ValidationPreview field={section} />
                <EditorControls moveUp={moveUp} moveDown={moveDown} deleteField={deleteNode} />
                <AddControls template={template} locked={locked} addField={addField} addSection={addSection} />
            </ScrollView>
        );
    }
}