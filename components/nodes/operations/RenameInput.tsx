import { useState } from "react";
import { TextInput } from "react-native";
import { useTheme } from "../../../hooks/use-theme-provider";
import { useFocusBorderColor } from "../../../hooks/use-focus-border-color";
import { DataContainer, data_container_types, FieldData, FieldNode } from "../../../constants/DataTypes";

export default function RenameInput({ template, id, field, locked, onChange }: {
    template: DataContainer<data_container_types>;
    id: string;
    field: FieldNode<FieldData>;
    locked: boolean;
    onChange: (
        template: DataContainer<data_container_types>,
        defaultShown: boolean,
        value: FieldNode<FieldData>
    ) => void;
}) {
    const theme = useTheme();
    const [name, setName] = useState(field.field.data.label);
    const focusBorder = useFocusBorderColor(theme.colors.border, theme.colors.caution);

    return (
        <TextInput
            value={name}
            editable={!locked}
            onFocus={focusBorder.onFocus}
            onBlur={focusBorder.onBlur}
            onChangeText={(newName) => {
                setName(newName);

                const newField = field.field.clone();
                newField.data.label = newName;

                onChange(template, field.field.data.visible, {
                    id,
                    type: "field",
                    field: newField,
                });
            }}
            style={[
                theme.sizes.default.input,
                {
                    width: 140,
                    marginLeft: 12,
                    marginRight: 12,
                    backgroundColor: theme.colors.background,
                    borderColor: focusBorder.borderColor,
                    color: theme.colors.text,
                    fontFamily: theme.fonts?.regular.fontFamily,
                },
            ]}
        />
    );
}
