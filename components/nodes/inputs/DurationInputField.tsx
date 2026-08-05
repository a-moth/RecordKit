import { Text, TextInput, View } from "react-native";
import {
  StandardFieldProps,
  DurationField,
  FieldNode,
  DurationData,
  field_data,
} from "../../../constants/DataTypes";
import { useTheme } from "../../../hooks/use-theme-provider";

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
              backgroundColor: theme.colors.card,
              borderColor: theme.colors.border,
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
              backgroundColor: theme.colors.card,
              borderColor: theme.colors.border,
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