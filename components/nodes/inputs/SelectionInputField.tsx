import { useState } from "react";
import { Text, TextInput, TextStyle, View } from "react-native";
import { SelectionField, StandardFieldProps, SelectionData } from "../../../constants/DataTypes";
import SelectionInput from "./SelectionInput";
import MiniButton from "../../common/MiniButton";
import { useTheme } from "../../../hooks/use-theme-provider";
import { useFocusBorderColor } from "../../../hooks/use-focus-border-color";
import { createId } from "../../../utils/NodeUtils";

export default function SelectionInputField({
  id,
  template,
  fieldKey,
  defaultShown,
  onChange,
  field,
  locked,
  edit = false,
  style,
  textStyle
}: StandardFieldProps<SelectionData> & { style?: any, textStyle?: TextStyle }) {
  const theme = useTheme();
  const [newOptionName, setNewOptionName] = useState("");
  const focusBorder = useFocusBorderColor(theme.colors.border, theme.colors.caution);

  const textStyling: TextStyle = textStyle ?? {
    ...theme.sizes.default.text,
    color: theme.colors.text,
    fontFamily: theme.fonts?.regular.fontFamily,
  };

  const baseStyling = style ?? {
    ...theme.sizes.default.input,
    backgroundColor: theme.colors.background,
    borderColor: theme.colors.border,
    color: theme.colors.text,
    fontFamily: theme.fonts?.regular.fontFamily,
  };

  function addOption() {
    const name = newOptionName.trim();
    if (!name) return;

    const newField = (field.field.clone() as SelectionField).addOption({ id: createId(), name });

    setNewOptionName("");
    onChange?.(template, defaultShown, {
      id: id,
      type: "field",
      field: newField,
    });
  }

  function removeOption(optionId: string) {
    const newField = (field.field.clone() as SelectionField).removeOption(optionId);

    onChange?.(template, defaultShown, {
      id: id,
      type: "field",
      field: newField,
    });
  }

  return (
    <View id={fieldKey} style={theme.sizes.default.container}>
      <Text style={textStyling}>{fieldKey}</Text>

      {edit && (
        <View style={theme.sizes.default.container}>
          {field.field.data.options.map(option => (
            <View key={option.id} style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
              <Text style={textStyling}>{option.name}</Text>
              <MiniButton label="Remove" color="danger" disabled={locked} onPress={() => removeOption(option.id)} />
            </View>
          ))}

          <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
            <TextInput
              value={newOptionName}
              editable={!locked}
              placeholder="New option"
              placeholderTextColor={theme.colors.text}
              onFocus={focusBorder.onFocus}
              onBlur={focusBorder.onBlur}
              onChangeText={setNewOptionName}
              onSubmitEditing={addOption}
              style={[baseStyling, { borderColor: focusBorder.borderColor }]}
            />
            <MiniButton label="Add Option" color="primary" disabled={locked} onPress={addOption} />
          </View>
        </View>
      )}

      <SelectionInput
        id={id}
        template={template}
        style={baseStyling}
        textStyle={textStyling}
        field={field}
        locked={locked}
        fieldKey={fieldKey}
        defaultShown={defaultShown}
        onChange={onChange}
        submitButtonColor={theme.colors.primary}
      />
    </View>
  );
}