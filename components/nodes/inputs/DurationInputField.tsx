import { Text, TextInput, View } from "react-native";
import {
  StandardFieldProps,
  DurationField,
  FieldNode,
  DurationData,
  field_data,
} from "../../../constants/DataTypes";
import { useTheme } from "../../../hooks/use-theme-provider";
import { useFocusBorderColor } from "../../../hooks/use-focus-border-color";

export default function DurationInputField({
  template,
  id,
  fieldKey,
  defaultShown,
  field,
  locked = false,
  onChange,
}: StandardFieldProps<DurationData>) {
  const theme = useTheme();

  const focusBorderA = useFocusBorderColor(theme.colors.border, theme.colors.caution);
  const focusBorderB = useFocusBorderColor(theme.colors.border, theme.colors.caution);

  const fieldData = field.field.data as DurationData;

  return (
    <>
      <Text
        style={[
          theme.sizes.default.text,
          {
            color: theme.colors.text,
            fontFamily: theme.fonts?.regular.fontFamily,
          },
        ]}
      >
        {fieldKey}
      </Text>

      <View
        style={[
          theme.sizes.default.container,
          theme.sizes.default.row,
        ]}
      >
        <TextInput
          value={String(field.field.data.valueA)}
          onFocus={focusBorderA.onFocus}
          onBlur={focusBorderA.onBlur}
          onChangeText={(newText) => {
            const newField = field.field.clone();
            newField.setData(Number(newText)); // writes valueA, matches current behavior

            onChange?.(template, defaultShown, {
              id,
              type: "field",
              field: newField,
            });
          }}
          style={[
            theme.sizes.default.input,
            {
              backgroundColor: theme.colors.background,
              borderColor: focusBorderA.borderColor,
              color: theme.colors.text,
              fontFamily: theme.fonts?.regular.fontFamily,
            },
          ]}
          editable={!locked}
        />

        <Text
          style={[
            theme.sizes.default.text,
            {
              color: theme.colors.text,
              fontFamily: theme.fonts?.regular.fontFamily,
            },
          ]}
        >
          {field.field.data.unitA}
        </Text>

        <TextInput
          value={String(field.field.data.valueB)}
          onFocus={focusBorderB.onFocus}
          onBlur={focusBorderB.onBlur}
          onChangeText={(newText) => {
            const newField = field.field.clone() as DurationField;
            newField.setDataB(Number(newText)); // writes valueB, matches current behavior

            onChange?.(template, defaultShown, {
              id,
              type: "field",
              field: newField,
            });
          }}
          style={[
            theme.sizes.default.input,
            {
              backgroundColor: theme.colors.background,
              borderColor: focusBorderB.borderColor,
              color: theme.colors.text,
              fontFamily: theme.fonts?.regular.fontFamily,
            },
          ]}
          editable={!locked}
        />

        <Text
          style={[
            theme.sizes.default.text,
            {
              color: theme.colors.text,
              fontFamily: theme.fonts?.regular.fontFamily,
            },
          ]}
        >
          {field.field.data.unitB}
        </Text>
      </View>
    </>
  );
}