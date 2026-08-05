import { useState } from "react";
import { Text, View } from "react-native";
import BooleanImageInput from "./BooleanImageInput";
import { useTheme } from "../../../hooks/use-theme-provider";
import { field_data, FieldNode, ScaleData, StandardFieldProps } from "../../../constants/DataTypes";

export default function ScaleInputField({
  template,
  id,
  fieldKey,
  field,
  onChange,
  locked = false,
}: StandardFieldProps<ScaleData>) {
  const theme = useTheme();

  // 0 = nothing selected
  const [which, setWhich] = useState<number>(field.field.data.value);

  const handleSelect = (selection: number) => {
    const nextValue = which === selection ? 0 : selection;

    setWhich(nextValue);

    const newField = field.field.clone();
    newField.setData(nextValue);

    onChange?.(template, locked, {
      id: id,
      type: "field",
      field: newField,
    });
  };

  const images = [
    require("../../../assets/images/1.png"),
    require("../../../assets/images/2.png"),
    require("../../../assets/images/3.png"),
    require("../../../assets/images/4.png"),
    require("../../../assets/images/5.png"),
  ];

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

      <View id={fieldKey} style={theme.sizes.default.row}>
        {images.map((image, index) => {
          const selection = index + 1;

          return (
            <BooleanImageInput
              key={selection}
              selection={selection}
              selected={which === selection}
              onPress={() =>
                handleSelect(selection)
              }
              imageSrc={image}
              imageSrcFalse={image}
            />
          );
        })}
      </View>
    </>
  );
}