import { View } from "react-native";
import { data_container_types, DataContainer, FieldData, FieldNode } from "../../../constants/DataTypes";
import TypedNode from "./TypedNode";
import EditorControls from "./EditorControls";
import ValidationPreview from "./ValidationPreview";
import AddControls, { AddFieldPicker, useAddFieldPicker } from "./AddControls";
import RenameInput from "./RenameInput";

export default function FieldNodeFactory({ template, id, edit, nodeKey, locked, field, onChange, addField, addSection, moveUp, moveDown, deleteNode }: {
    template: DataContainer<data_container_types>,
    id: string,
    edit: boolean,
    nodeKey: string,
    locked: boolean,
    field: FieldNode<FieldData>,
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
    const { picking, selectorField, startPicking, handleTypeChange } = useAddFieldPicker(addField);

    if (!edit) {
        return (
            <TypedNode
                template={template}
                id={id}
                field={field}
                locked={locked}
                onChange={onChange}
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
                    <TypedNode
                        template={template}
                        id={id}
                        field={field}
                        locked={locked}
                        onChange={onChange}
                    />
                    <ValidationPreview field={field} />
                </View>
                <RenameInput template={template} id={id} field={field} locked={locked} onChange={onChange} />
            </View>
            {picking && (
                <AddFieldPicker template={template} locked={locked} selectorField={selectorField} onChange={handleTypeChange} />
            )}
        </View>
    );
}