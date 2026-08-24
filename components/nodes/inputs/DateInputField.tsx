import { Text, TextInput, View } from "react-native";

import { useTheme } from "../../../hooks/use-theme-provider";
import { useFocusBorderColor } from "../../../hooks/use-focus-border-color";

import {
  DateData,
  StandardFieldProps,
} from "../../../constants/DataTypes";

import { useSettings } from "../../../utils/SettingsProvider";
import { useState } from "react";

export default function DateInputField({
  template,
  id,
  fieldKey,
  defaultShown,
  field,
  locked = false,
  onChange,
}: StandardFieldProps<DateData>) {

  const theme = useTheme();

  const { settings } = useSettings();

  const [text, setText] = useState(
    field.field.data.value ?? ""
  );

  const focusBorder = useFocusBorderColor(theme.colors.border, theme.colors.caution);

  /**
   * date-fns tokens:
   *
   * dd
   * MM
   * MMM
   * yyyy
   * yy
   */

  const dateFormat =
    field.field.data.format ??
    settings["**dayFormat"] ??
    "dd-MM-yyyy";

  if (!defaultShown) {
    return null;
  }

  return (
    <View style={theme.sizes.default.container}>

      <Text
        style={[
          theme.sizes.default.text,
          {
            color:
              theme.colors.text,

            fontFamily:
              theme.fonts?.regular.fontFamily,
          },
        ]}
      >
        {fieldKey}
      </Text>

      <TextInput
        value={text}
        editable={!locked}
        placeholder={dateFormat}
        placeholderTextColor={
          theme.colors.subtext
        }
        onFocus={focusBorder.onFocus}
        onBlur={focusBorder.onBlur}
        onChangeText={(text) => {
          setText(text);

          const newField = field.field.clone();
          newField.setData(text === "" ? "" : text);

          onChange?.(template, defaultShown, {
            id,
            type: "field",
            field: newField,
          });
        }}
        style={[
          theme.sizes.default.input,
          {
            backgroundColor:
              theme.colors.background,

            borderColor:
              focusBorder.borderColor,

            color:
              theme.colors.text,

            fontFamily:
              theme.fonts?.regular.fontFamily,
          },
        ]}
      />

    </View>
  );
}