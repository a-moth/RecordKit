import { useState } from "react";
import { Text, View } from "react-native";
import BooleanImageInput from "./BooleanImageInput";
import MiniButton from "../../common/MiniButton";
import { useTheme } from "../../../hooks/use-theme-provider";
import { useSettings } from "../../../utils/SettingsProvider";
import { useImagePicker } from "../../../hooks/use-image-picker";
import { resolveBundledImage } from "../../../utils/resolve-bundled-image";
import valueOf from "../../../utils/generic-calls";
import { ScaleData, ScaleField, StandardFieldProps } from "../../../constants/DataTypes";

const SCALE_ICON_COUNT = 5;

export default function ScaleInputField({
  template,
  id,
  fieldKey,
  field,
  edit = false,
  onChange,
  locked = false,
}: StandardFieldProps<ScaleData>) {
  const theme = useTheme();
  const { settings } = useSettings();
  const { pickImage } = useImagePicker();

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

  async function handleReplaceImage(index: number) {
    const picked = await pickImage();
    if (!picked) return;

    const newField = field.field.clone() as ScaleField;
    newField.setImage(index, picked.uri);

    onChange?.(template, locked, {
      id: id,
      type: "field",
      field: newField,
    });
  }

  const maxImageSize = valueOf(settings["**maxImageSize"]) ?? 100;

  const images = Array.from({ length: SCALE_ICON_COUNT }, (_, index) => {
    const override = field.field.data.images?.[index];
    const fallback = settings[`**image${index + 1}`] ?? `assets/images/${index + 1}.png`;
    return resolveBundledImage(override || fallback);
  });

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

      <View id={fieldKey} style={[theme.sizes.default.row, { backgroundColor: theme.colors.background, flexWrap: 'nowrap' }]}>
        {images.map((image, index) => {
          const selection = index + 1;

          return (
            <View key={selection} style={{ flex: 1 }}>
              <BooleanImageInput
                selection={selection}
                selected={which === selection}
                onPress={() => handleSelect(selection)}
                imageSrc={image}
                imageSrcFalse={image}
                locked={locked}
                size="100%"
                maxSize={maxImageSize}
              />
              {edit && (
                <MiniButton
                  label="Change Image"
                  color="primary"
                  onPress={() => handleReplaceImage(index)}
                />
              )}
            </View>
          );
        })}
      </View>
    </>
  );
}
