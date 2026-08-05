import { Text, View } from "react-native";
import BooleanInput from "./BooleanInput";
import { useTheme } from "../../../hooks/use-theme-provider";
import { StandardFieldProps, FieldNode, ToggleImageButtonData, FieldData, field_data } from "../../../constants/DataTypes";

export default function BooleanInputField({
  template,
  id,
  fieldKey,
  defaultShown,
  field,
  locked = false,
  onChange,
}: StandardFieldProps<ToggleImageButtonData>) {
  const theme = useTheme();

  const displayedValue = field.field.data.value ?? false;

  const fieldData = field.field.data as ToggleImageButtonData;

  function handleChange(selected: boolean) {
    const newField = field.field.clone();
    newField.setData(selected);

    onChange?.(template, defaultShown, {
      id,
      type: "field",
      field: newField,
    });
  }

  return (
    <View style={[theme.sizes.default.container]}>
      <Text style={[theme.sizes.default.text, { color: theme.colors.text, fontFamily: theme.fonts?.regular.fontFamily }]}>
        {fieldKey}
      </Text>

      <BooleanInput
        selected={field.field.data.value}
        label={field.field.data.label}
        value={displayedValue}
        locked={locked}
        onChange={handleChange}
      />
    </View>
  );
}