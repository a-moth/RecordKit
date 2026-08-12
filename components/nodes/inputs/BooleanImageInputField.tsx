import { Text, View } from "react-native";
import BooleanInput from "./BooleanInput";
import { useTheme } from "../../../hooks/use-theme-provider";
import { StandardFieldProps, FieldNode, ToggleImageButtonData, FieldData, field_data } from "../../../constants/DataTypes";
import BooleanImageInput from "./BooleanImageInput";

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

  function handleChange() {
    const newField = field.field.clone();
    newField.setData(!field.field.data.value);


    onChange?.(template, defaultShown, {
      id,
      type: "field",
      field: newField,
    });
  }

  return (
    <View style={[theme.sizes.default.container]}>
      <Text style={[theme.sizes.default.text, { color: theme.colors.text, fontFamily: theme.fonts?.regular.fontFamily }]}>
        {field.field.data.label}
      </Text>

      <BooleanImageInput
        selected={field.field.data.value}
        selection={displayedValue ? 1 : 0}
        imageSrcFalse={field.field.data.imageSelected}
        imageSrc={field.field.data.imageUnselected}
        locked={locked}
        onPress={handleChange}
      />
    </View>
  );
}