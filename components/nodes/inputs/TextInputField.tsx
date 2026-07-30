import {
  useState,
} from "react";

import {
  Text,
  TextInput,
  View,
} from "react-native";

import { useTheme } from "../../../hooks/use-theme-provider";

import {
  field_data,
  FieldNode,
  StandardFieldProps,
  TextData,
} from "../../../constants/DataTypes";

export default function TextInputField({
  id,
  template,
  fieldKey,
  defaultShown,
  field,
  locked = false,
  onChange,
}: StandardFieldProps<TextData>) {

  const theme = useTheme();

  const [text, setText] = useState(
    field.field.data.value ?? ""
  );

  /**
   * only sync external updates
   * don't overwrite active typing
   */

  if (!defaultShown) {
    return null;
  }

  return (
    <View style={theme.sizes.default.container}>

      <Text
        style={[
          theme.sizes.default.text,
          {
            color: theme.colors.text,
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
        onChangeText={(newText) => {

          setText(newText);

          onChange?.(
            template,
            defaultShown,
            {
              id: id,
              type: "field",
              field: {
                ...field.field,
                data: {
                  ...field.field.data,
                  value: newText,
                } as TextData,
              } as field_data<TextData>,
            } as FieldNode<TextData>
          );
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