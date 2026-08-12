import { Text, TextStyle, View } from "react-native";
import { StandardFieldProps, SelectionData } from "../../../constants/DataTypes";
import SelectionInput from "./SelectionInput";
import { useTheme } from "../../../hooks/use-theme-provider";

export default function SelectionInputField({
  id,
  template,
  fieldKey,
  defaultShown,
  onChange,
  field,
  locked,
  style,
  textStyle
}: StandardFieldProps<SelectionData> & { style?: any, textStyle?: TextStyle }) {
  const theme = useTheme();

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

  return (
    <View id={fieldKey} style={theme.sizes.default.container}>
      <Text style={textStyling}>{fieldKey}</Text>

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