import { data_container_types, DataContainer, FieldData, FieldNode } from "../../../constants/DataTypes";
import TypedNode from "./TypedNode";
import EditorControls from "./EditorControls";
import ValidationPreview from "./ValidationPreview";
import AddControls from "./AddControls";

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
    addField: () => void;
    addSection: () => void;
    moveUp: () => void;
    moveDown: () => void;
    deleteNode: () => void;
}) {

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
        <>
            <TypedNode
                template={template}
                id={id}
                field={field}
                locked={locked}
                onChange={onChange}
            />
            <ValidationPreview field={field} />
            <EditorControls moveUp={moveUp} moveDown={moveDown} deleteField={deleteNode} />
            <AddControls addField={addField} addSection={addSection} />
        </>
    );
}