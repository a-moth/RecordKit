import { useState } from "react";
import { View } from "react-native";
import { selectionField } from "../../../hooks/NodeRegistry";
import { DataContainer, data_container_types, FieldData, FieldNode, SelectionData } from "../../../constants/DataTypes";
import SelectionInputField from "../inputs/SelectionInputField";
import MiniButton from "../../common/MiniButton";

function newSelectorField(): FieldNode<SelectionData> {
    return {
        id: "add-field-selector",
        type: "field",
        field: selectionField.clone(),
    };
}

/**
 * Owns the "which field type?" picker state so it can be shown on its own
 * line below the element, rather than squeezed inline with the add/editor
 * controls in the left-hand control column.
 */
export function useAddFieldPicker(addField: (type: string) => void) {
    const [picking, setPicking] = useState(false);
    const [selectorField, setSelectorField] = useState<FieldNode<SelectionData>>(newSelectorField);

    function handleTypeChange(_template: DataContainer<data_container_types>, _defaultShown: boolean, newValue: FieldNode<FieldData>) {
        const chosenType = newValue.field.data.type === "selection" ? newValue.field.data.selected[0] : undefined;

        setPicking(false);
        setSelectorField(newSelectorField());

        if (chosenType) addField(chosenType);
    }

    return {
        picking,
        selectorField,
        startPicking: () => setPicking(true),
        handleTypeChange,
    };
}

export function AddFieldPicker({ template, locked, selectorField, onChange }: {
    template: DataContainer<data_container_types>;
    locked: boolean;
    selectorField: FieldNode<SelectionData>;
    onChange: (
        template: DataContainer<data_container_types>,
        defaultShown: boolean,
        value: FieldNode<FieldData>
    ) => void;
}) {
    return (
        <SelectionInputField
            template={template}
            id={selectorField.id}
            fieldKey={selectorField.field.data.label}
            field={selectorField}
            defaultShown={selectorField.field.data.visible}
            locked={locked}
            onChange={onChange}
        />
    );
}

export default function AddControls({ locked, addSection, picking, onStartPicking }: {
    locked: boolean;
    addSection: () => void;
    picking: boolean;
    onStartPicking: () => void;
}) {
    if (picking) {
        return null;
    }

    return (
        <View style={{ flexDirection: "row", flexWrap: "wrap", alignItems: "center", gap: 4, alignSelf: "center", alignContent: "center" }}>
            <MiniButton label="Add Field" color="primary" disabled={locked} onPress={onStartPicking} />
            <MiniButton label="Add Section" color="primary" disabled={locked} onPress={addSection} />
        </View>
    );
}
