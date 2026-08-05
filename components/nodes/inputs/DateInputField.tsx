import { Text, TextInput, View } from "react-native";

import {
  parse,
  format,
  isValid,
} from "date-fns";

import { useTheme } from "../../../hooks/use-theme-provider";

import {
  DateData,
  DateField,
  field_data,
  FieldNode,
  StandardFieldProps,
} from "../../../constants/DataTypes";

import { useSettings } from "../../../utils/SettingsProvider";

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

  /**
   * Convert stored ISO value
   * into display string
   */

  function buildDisplayValue() {

    if (!field.field.data.value) {
      return "";
    }

    try {

      const parsed =
        new Date(field.field.data.value);

      if (!isValid(parsed)) {
        return "";
      }

      return format(
        parsed,
        dateFormat
      );

    } catch {

      return "";
    }
  }

  const displayValue =
    buildDisplayValue();

  /**
   * Parse typed input
   * into ISO storage format
   */

  function parseInput(
    value: string
  ) {

    try {

      const parsed =
        parse(
          value,
          dateFormat,
          new Date()
        );

      if (!isValid(parsed)) {
        return null;
      }

      return format(
        parsed,
        "yyyy-MM-dd"
      );

    } catch {

      return null;
    }
  }

  if (!defaultShown) {
    return null;
  }

  const fieldData = field.field.data as DateData;

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
        value={displayValue}
        editable={!locked}
        keyboardType="numeric"
        placeholder={dateFormat}
        placeholderTextColor={
          theme.colors.primary
        }
        onChangeText={(text) => {

          const isoValue =
            parseInput(text);

          /**
           * allow partial typing
           * without corrupting state
           */

          if (!isoValue) {
            return;
          }

          const newField = field.field.clone();
          newField.setData(text === "" ? null : isoValue);

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
              theme.colors.card,

            borderColor:
              theme.colors.border,

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