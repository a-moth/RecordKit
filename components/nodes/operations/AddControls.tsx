import { useState } from "react";
import { Pressable, Text, ScrollView } from "react-native";
import { selectionField } from "../../../hooks/NodeRegistry";
import { DataContainer, data_container_types, FieldData, FieldNode, SelectionData } from "../../../constants/DataTypes";
import SelectionInputField from "../inputs/SelectionInputField";

function newSelectorField(): FieldNode<SelectionData> {
    return {
        id: "add-field-selector",
        type: "field",
        field: selectionField.clone(),
    };
}

export default function AddControls({ template, locked, addField, addSection }: {
    template: DataContainer<data_container_types>;
    locked: boolean;
    addField: (type: string) => void;
    addSection: () => void;
}) {
    const [picking, setPicking] = useState(false);
    const [selectorField, setSelectorField] = useState<FieldNode<SelectionData>>(newSelectorField);

    function handleTypeChange(_template: DataContainer<data_container_types>, _defaultShown: boolean, newValue: FieldNode<FieldData>) {
        const chosenType = newValue.field.data.type === "selection" ? newValue.field.data.selected[0] : undefined;

        setPicking(false);
        setSelectorField(newSelectorField());

        if (chosenType) addField(chosenType);
    }

    if (picking) {
        return (
            <SelectionInputField
                template={template}
                id={selectorField.id}
                fieldKey={selectorField.field.data.label}
                field={selectorField}
                defaultShown={selectorField.field.data.visible}
                locked={locked}
                onChange={handleTypeChange}
            />
        );
    }

    return (
        <ScrollView style={{ flexDirection: "row", flexWrap: "nowrap" }}>
            <Pressable onPress={() => setPicking(true)}>
                <Text>Add Field</Text>
            </Pressable>
            <Pressable onPress={addSection}>
                <Text>Add Section</Text>
            </Pressable>
        </ScrollView>
    );
}
