import { Text, View } from "react-native";
import BooleanImageInput from "./BooleanImageInput";
import MiniButton from "../../common/MiniButton";
import { useTheme } from "../../../hooks/use-theme-provider";
import { useSettings } from "../../../utils/SettingsProvider";
import { useImagePicker } from "../../../hooks/use-image-picker";
import { resolveBundledImage } from "../../../utils/resolve-bundled-image";
import valueOf from "../../../utils/generic-calls";
import { StandardFieldProps, ToggleImageButtonData, ToggleImageButtonField } from "../../../constants/DataTypes";

export default function BooleanImageInputField({
  template,
  id,
  fieldKey,
  defaultShown,
  field,
  edit = false,
  locked = false,
  onChange,
}: StandardFieldProps<ToggleImageButtonData>) {
  const theme = useTheme();
  const { settings } = useSettings();
  const { pickImage } = useImagePicker();

  const displayedValue = field.field.data.value ?? false;

  const onImage = resolveBundledImage(field.field.data.imageSelected || settings["**image5"] || "assets/images/5.png");
  const offImage = resolveBundledImage(field.field.data.imageUnselected || settings["**image1"] || "assets/images/1.png");
  const maxImageSize = valueOf(settings["**maxImageSize"]) ?? 100;

  function handleChange() {
    const newField = field.field.clone();
    newField.setData(!field.field.data.value);

    onChange?.(template, defaultShown, {
      id,
      type: "field",
      field: newField,
    });
  }

  async function handleReplaceImage(which: "selected" | "unselected") {
    const picked = await pickImage();
    if (!picked) return;

    const newField = field.field.clone() as ToggleImageButtonField;
    if (which === "selected") {
      newField.setImageSelected(picked.uri);
    } else {
      newField.setImageUnselected(picked.uri);
    }

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

      {edit ? (
        <View style={[theme.sizes.default.row]}>
          <View style={{ alignItems: 'center' }}>
            <BooleanImageInput
              selection={0}
              selected={false}
              imageSrc={offImage}
              imageSrcFalse={offImage}
              locked
              maxSize={maxImageSize}
              onPress={() => { }}
            />
            <MiniButton label="Change Off Image" color="primary" onPress={() => handleReplaceImage("unselected")} />
          </View>
          <View style={{ alignItems: 'center' }}>
            <BooleanImageInput
              selection={1}
              selected={false}
              imageSrc={onImage}
              imageSrcFalse={onImage}
              locked
              maxSize={maxImageSize}
              onPress={() => { }}
            />
            <MiniButton label="Change On Image" color="primary" onPress={() => handleReplaceImage("selected")} />
          </View>
        </View>
      ) : (
        <BooleanImageInput
          selected={displayedValue}
          selection={displayedValue ? 1 : 0}
          imageSrc={onImage}
          imageSrcFalse={offImage}
          locked={locked}
          size="100%"
          maxSize={maxImageSize}
          onPress={handleChange}
        />
      )}
    </View>
  );
}
